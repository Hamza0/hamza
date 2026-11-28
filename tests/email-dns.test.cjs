const { test } = require('node:test');
const assert = require('node:assert/strict');

const mod = import('../src/lib/email-dns.mjs');
const record = (name, type, data) => ({ name, type, data });
const reply = (name, type, Answer = [], Status = 0) => ({ Status, TC: false, Question: [{ name, type }], Answer });
const dns = records => ({ state: 'present', records, reason: '' });

test('accepts only bounded public hostnames and valid selector labels', async () => {
  const m = await mod;
  assert.equal(m.normalizeDomain(' Example.COM. '), 'example.com');
  assert.equal(m.normalizeDomain('send.example.com'), 'send.example.com');
  for (const invalid of ['https://example.com', 'hi@example.com', '127.0.0.1', 'example.local', 'one..com', 'a'.repeat(64) + '.com', 'foo.com/path', 'foo.com:443']) assert.equal(m.normalizeDomain(invalid), null);
  assert.equal(m.normalizeSelector('selector1', 'example.com'), 'selector1');
  assert.equal(m.normalizeSelector('', 'example.com'), '');
  assert.equal(m.normalizeSelector('foo._domainkey', 'example.com'), null);
});

test('quoted TXT chunks are decoded and only relevant DNS answers are used', async () => {
  const m = await mod;
  assert.equal(m.decodeTxt('"v=spf1 include:""mail.example.com -all"'), 'v=spf1 include:mail.example.com -all');
  assert.equal(m.decodeTxt('"abc\\032def"'), 'abc def');
  assert.equal(m.decodeTxt('"unfinished'), null);
  const name = 'selector1._domainkey.example.com';
  const response = reply(name, 16, [record(name, 5, 'key.provider.com.'), record('key.provider.com.', 16, '"v=DKIM1; p=YWJj"'), record('unrelated.com.', 16, '"other"')]);
  assert.deepEqual(m.parseDnsReply(response, name, 16).records, ['v=DKIM1; p=YWJj']);
  assert.equal(m.parseDnsReply(reply(name, 16, [], 2), name, 16).state, 'unavailable');
  assert.equal(m.parseDnsReply(reply(name, 16, [], 3), name, 16).state, 'absent');
  assert.equal(m.parseDnsReply({...response, TC: true}, name, 16).state, 'unavailable');
  assert.equal(m.parseDnsReply(response, 'wrong.com', 16).state, 'unavailable');
});

test('record presence is distinct from policy warnings or verification', async () => {
  const m = await mod;
  assert.equal(m.assessMx(dns(['0 .'])).label, 'Null MX');
  assert.equal(m.assessMx(dns([])).label, 'No explicit MX');
  assert.equal(m.assessSpf(dns(['v=spf1 -all', 'v=spf1 ~all'])).label, 'Multiple records');
  assert.equal(m.assessSpf(dns(['v=spf1 +all'])).label, 'Permissive policy');
  assert.equal(m.assessSpf(dns(['v=spf1 -all'])).label, 'No senders authorized');
  assert.equal(m.assessSpf(dns(['v=spf1 include:provider.com -all'])).status, 'found');
  assert.equal(m.assessDmarc(dns(['v=DMARC1; p=none'])).label, 'p=none');
  assert.equal(m.assessDmarc(dns(['v=DMARC1; p=reject; t=y'])).status, 'review');
  assert.equal(m.assessDmarc(dns([])).label, 'No direct record');
  assert.equal(m.assessDkim(null, '').status, 'skipped');
  assert.equal(m.assessDkim(dns(['v=DKIM1; p=']), 's').label, 'Key revoked');
  assert.equal(m.assessDkim(dns(['v=DKIM1; p=YWJj']), 's').status, 'found');
});

test('fixed DNS endpoint, only 3 or 4 queries, no credential transmission, partial errors', async () => {
  const m = await mod;
  const calls = [];
  const transport = async (url, options) => {
    calls.push({url, options});
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://dns.google');
    assert.equal(parsed.pathname, '/resolve');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.redirect, 'error');
    const name = parsed.searchParams.get('name');
    const type = Number(parsed.searchParams.get('type'));
    if (name.startsWith('_dmarc.')) throw Error('mock outage');
    return { ok: true, json: async () => reply(name, type, type === 15 ? [record(name, type, '10 mail.example.com.')] : []) };
  };
  const result = await m.checkEmailDns('example.com', '', new AbortController().signal, transport);
  assert.equal(calls.length, 3);
  assert.deepEqual(result.map(x => x.status), ['found', 'review', 'unknown', 'skipped']);
  await m.checkEmailDns('example.com', 's', new AbortController().signal, transport);
  assert.equal(calls.length, 7);
  await assert.rejects(m.checkEmailDns('https://example.com', '', new AbortController().signal, transport));
  assert.equal(calls.length, 7);
});
