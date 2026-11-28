// Read-only browser DNS lookups. No user-provided URL, server proxy, SMTP probe,
 // DNS changes, recursive SPF expansion, or message-content inspection.
const label = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
const reserved = new Set(["local", "localhost", "internal", "test", "invalid", "example", "onion", "home", "lan", "arpa"]);

export function normalizeDomain(input) {
  const domain = input.trim().toLowerCase().replace(/\.$/, "");
  const labels = domain.split(".");
  const tld = labels[labels.length - 1];
  if (domain.length > 245 || labels.length < 2 || !labels.every(part => label.test(part)) ||
      !/^(?:[a-z]{2,63}|xn--[a-z0-9-]+)$/.test(tld) || reserved.has(tld)) return null;
  return domain;
}

export function normalizeSelector(input, domain) {
  const selector = input.trim().toLowerCase();
  if (!selector) return "";
  return selector.split(".").every(part => label.test(part)) &&
    (selector + "._domainkey." + domain).length <= 253 ? selector : null;
}

// Google returns TXT RDATA in DNS presentation format. Join quoted fragments
// without inserting spaces. Handle escaped characters and decimal DNS escapes.
export function decodeTxt(raw) {
  const value = raw.trim();
  if (!value.startsWith('"')) return value;
  let pos = 0;
  let output = "";
  while (pos < value.length) {
    while (/\s/.test(value[pos] || "") && pos < value.length) pos++;
    if (pos === value.length) break;
    if (value[pos++] !== '"') return null;
    let closed = false;
    while (pos < value.length) {
      const ch = value[pos++];
      if (ch === '"') { closed = true; break; }
      if (ch !== "\\") { output += ch; continue; }
      if (pos === value.length) return null;
      const digits = value.slice(pos, pos + 3);
      if (/^\d{3}$/.test(digits)) {
        const code = Number(digits);
        if (code > 255) return null;
        output += String.fromCharCode(code);
        pos += 3;
      } else output += value[pos++];
    }
    if (!closed) return null;
  }
  return output;
}

const unavailable = (reason) => ({ state: "unavailable", records: [], reason });
const canon = (name) => name.toLowerCase().replace(/\.$/, "");

export function parseDnsReply(raw, name, type) {
  if (!raw || typeof raw !== "object" || !Number.isInteger(raw.Status) || raw.TC !== false ||
      !Array.isArray(raw.Question) || raw.Question.length !== 1 ||
      typeof raw.Question[0]?.name !== "string" ||
      canon(raw.Question[0].name) !== canon(name) ||
      raw.Question[0].type !== type) return unavailable("The resolver returned an incomplete or unexpected response.");
  if (raw.Status === 3) return { state: "absent", records: [], reason: "DNS reports that this name does not exist." };
  if (raw.Status !== 0) return unavailable("The DNS resolver could not complete this lookup (code " + raw.Status + ").");
  const answers = raw.Answer ?? [];
  if (!Array.isArray(answers) || answers.length > 256 || answers.some(r => !r ||
      typeof r.name !== "string" || typeof r.data !== "string" || !Number.isInteger(r.type) || r.data.length > 4096)) {
    return unavailable("The resolver returned unexpected record data.");
  }
  // Follow only the CNAME chain in this response; do not make extra requests.
  const allowed = new Set([canon(name)]);
  for (let i = 0; i < 16; i++) {
    const size = allowed.size;
    for (const r of answers) if (r.type === 5 && allowed.has(canon(r.name))) allowed.add(canon(r.data));
    if (allowed.size === size) break;
  }
  const records = answers.filter(r => r.type === type && allowed.has(canon(r.name))).map(r => r.data);
  if (type === 16) {
    const decoded = records.map(decodeTxt);
    if (decoded.some(r => r === null)) return unavailable("A TXT record could not be decoded.");
    return { state: decoded.length ? "present" : allowed.size > 1 ? "unavailable" : "absent", records: [...new Set(decoded)], reason: allowed.size > 1 && !decoded.length ? "An alias was returned without a final TXT record." : "" };
  }
  return { state: records.length ? "present" : allowed.size > 1 ? "unavailable" : "absent", records: [...new Set(records)], reason: allowed.size > 1 && !records.length ? "An alias was returned without a final MX record." : "" };
}

export async function lookupDns(name, type, signal, transport = fetch) {
  try {
    const url = "https://dns.google/resolve?name=" + encodeURIComponent(name) + "&type=" + type + "&edns_client_subnet=0.0.0.0%2F0";
    const response = await transport(url, { signal, credentials: "omit", referrerPolicy: "no-referrer", redirect: "error" });
    if (!response.ok) return unavailable("The public resolver is temporarily unavailable. Try again later.");
    return parseDnsReply(await response.json(), name, type);
  } catch {
    return unavailable("The lookup could not be completed. Check your connection and try again.");
  }
}

const titles = { mx: "Mail routing (MX)", spf: "Sender authorization (SPF)", dmarc: "Domain policy (DMARC)", dkim: "Signing key (DKIM)" };
const result = (key, status, label, detail, records = []) => ({ key, title: titles[key], status, label, detail, records });
const unknown = (key, dns) => result(key, "unknown", "Could not check", dns.reason || "DNS did not return a conclusive response.");
const tags = (record) => {
  const parts = record.split(";").map(part => part.trim()).filter(Boolean);
  const map = new Map();
  for (const part of parts) {
    const at = part.indexOf("=");
    if (at < 1) return null;
    const name = part.slice(0, at).trim();
    if (!/^[a-z][a-z0-9_]*$/i.test(name) || map.has(name)) return null;
    map.set(name, part.slice(at + 1).trim());
  }
  return map;
};

export function assessMx(dns) {
  if (dns.state === "unavailable") return unknown("mx", dns);
  if (!dns.records.length) return result("mx", "review", "No explicit MX", "No MX record was found at this domain. Some mail servers may fall back to address records. If you expect to receive mail here, check your provider's required records.");
  if (dns.records.some(r => /^\s*\d+\s+\.\s*$/.test(r))) {
    return result("mx", "review", dns.records.length === 1 && /^0\s+\.$/.test(dns.records[0].trim()) ? "Null MX" : "Review MX records", "A null MX indicates a domain that is not intended to receive mail. It should be the only MX record, with priority 0. Check whether this is intentional.", dns.records);
  }
  return result("mx", "found", "Records found", "Mail routing records are published. This does not confirm that individual inboxes or receiving servers work.", dns.records);
}

export function assessSpf(dns) {
  if (dns.state === "unavailable") return unknown("spf", dns);
  const records = dns.records.filter(r => /^v=spf1(?:\s|$)/i.test(r));
  if (!records.length) return result("spf", "review", "Not found", "No SPF record was found at the exact domain. Your sending provider may use a different envelope-sender domain. Check its instructions.");
  if (records.length > 1) return result("spf", "review", "Multiple records", "A single domain must not publish multiple SPF policies. Review all authorized senders before combining or replacing records.", records);
  if (/\s\+?all(?:\s|$)/i.test(records[0])) return result("spf", "review", "Permissive policy", "An all mechanism that allows any sender can weaken protection. Review the full policy with your email provider.", records);
  if (/^v=spf1\s+-all\s*$/i.test(records[0])) return result("spf", "review", "No senders authorized", "This policy declares that the domain has no authorized senders. It may be intentional for a domain that never sends email.", records);
  return result("spf", "found", "Record found", "An SPF record is published. Its authorized senders, syntax, recursive includes and DNS lookup count have not been fully validated.", records);
}

export function assessDmarc(dns) {
  if (dns.state === "unavailable") return unknown("dmarc", dns);
  const records = dns.records.filter(r => /^v\s*=\s*DMARC1(?:\s*;|\s*$)/.test(r));
  if (!records.length) return result("dmarc", "review", "No direct record", "No DMARC policy was found directly at this name. A parent domain may supply an inherited policy, which this check does not evaluate.");
  const parsed = records.length === 1 ? tags(records[0]) : null;
  const policy = parsed?.get("p");
  if (!parsed || !["none", "quarantine", "reject"].includes(policy)) return result("dmarc", "review", "Review policy", "There is a DMARC-looking record, but the policy is missing, unexpected or multiple records were returned. Check your provider's guidance before editing.", records);
  if (policy === "none") return result("dmarc", "review", "p=none", "A monitoring policy is published. It does not request quarantine or rejection of messages that fail DMARC. Monitoring can be an intentional first step.", records);
  if (parsed.get("t") === "y" || (parsed.has("pct") && Number(parsed.get("pct")) < 100)) return result("dmarc", "review", "Review test policy", "The policy includes test mode or an older partial-percentage setting. The requested treatment may be less strict than the headline policy suggests.", records);
  return result("dmarc", "found", "p=" + policy, "A policy requesting " + policy + " is published. This does not verify sender alignment, reporting, inherited policy or actual recipient behavior.", records);
}

export function assessDkim(dns, selector) {
  if (!selector) return result("dkim", "skipped", "Selector needed", "Use the selector (s=) and signing domain (d=) from a DKIM-Signature header or the value your provider gives you. A missing selector is not a failure.");
  if (dns.state === "unavailable") return unknown("dkim", dns);
  const records = dns.records.filter(r => /^v\s*=\s*DKIM1(?:\s*;|\s*$)/.test(r) || /(?:^|;)\s*p\s*=/.test(r));
  if (!records.length) return result("dkim", "review", "Key not found", "No DKIM key record was found for this selector and domain. Confirm the exact selector and signing domain with your provider.");
  const parsed = records.length === 1 ? tags(records[0]) : null;
  const key = parsed?.get("p");
  if (parsed && key === "") return result("dkim", "review", "Key revoked", "An empty public key indicates a revoked DKIM key. Check whether this selector is still in use.", records);
  if (!parsed || !key || (parsed.has("v") && parsed.get("v") !== "DKIM1") || !/^[a-zA-Z0-9+/]+={0,2}$/.test(key.replace(/\s/g, ""))) return result("dkim", "review", "Review key", "A DKIM-looking record was found, but the key is missing, unexpected or multiple records were returned.", records);
  return result("dkim", "found", "Key found", "A non-empty public key is published for this selector. Only a real signed message can demonstrate whether DKIM verification succeeds.", records);
}

export async function checkEmailDns(domain, selector, signal, transport = fetch) {
  if (normalizeDomain(domain) !== domain || normalizeSelector(selector, domain) !== selector) throw new Error("Invalid domain or selector");
  const requests = [
    lookupDns(domain, 15, signal, transport),
    lookupDns(domain, 16, signal, transport),
    lookupDns("_dmarc." + domain, 16, signal, transport),
    selector ? lookupDns(selector + "._domainkey." + domain, 16, signal, transport) : Promise.resolve(null),
  ];
  const [mx, spf, dmarc, dkim] = await Promise.all(requests);
  return [assessMx(mx), assessSpf(spf), assessDmarc(dmarc), assessDkim(dkim, selector)];
}
