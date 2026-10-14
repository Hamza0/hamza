const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const ts = require('typescript');
const source = fs.readFileSync(require.resolve('../src/lib/contact/server.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const sandbox = { exports: {}, require, Response, Request, AbortSignal, TextDecoder, Uint8Array, setTimeout, clearTimeout, fetch: async () => { throw Error('Unexpected real network request'); } };
vm.runInNewContext(compiled, sandbox);
const { handleContact } = sandbox.exports;
const config = { origin: 'https://www.hamzashakeel.ca', hostname: 'www.hamzashakeel.ca', resendKey: 'test-only', from: 'verified@example.com', to: 'recipient@example.com', turnstileSecret: 'test-only',  };
const input = (extra = {}) => ({ category: 'project', name: 'Test Visitor', email: 'visitor@example.com', message: 'This is a clearly labelled test message.', website: '', token: randomUUID(), submissionId: `${Date.now()}.${randomUUID()}`, ...extra });
const request = (body, headers = {}, method = 'POST') => new Request(`${config.origin}/api/contact`, { method, headers: { origin: config.origin, 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1', ...headers }, ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}) });

// Provider persistence is modelled only in this test double.
function services(options = {}) {
  const tokens = new Set(); const keys = new Map(); const calls = []; let sends = 0;
  const transport = async (url, init) => {
    calls.push({ url, init }); assert.ok(init.signal);
    if (url.includes('/siteverify')) {
      const token = JSON.parse(init.body).response; const used = tokens.has(token); tokens.add(token);
      return Response.json({ success: !used, hostname: config.hostname, action: 'portfolio_contact', challenge_ts: new Date().toISOString(), ...options.verification });
    }
    assert.equal(url, 'https://api.resend.com/emails', 'No Redis or unexpected service calls');
    const key = init.headers['Idempotency-Key']; const old = keys.get(key);
    if (old && old.body !== init.body) return Response.json({ name: 'invalid_idempotent_request' }, { status: 409 });
    if (old?.pending) return Response.json({ name: 'concurrent_idempotent_requests' }, { status: 409 });
    if (old?.id) return Response.json({ id: old.id });
    keys.set(key, { body: init.body, pending: true }); sends++;
    try {
      const r = options.onProvider ? await options.onProvider(init, sends) : options.providerDown ? Response.json({}, { status: 500 }) : Response.json({ id: 'test-accepted' });
      if (!r.ok) { keys.delete(key); return r; }
      const data = await r.clone().json(); keys.set(key, { body: init.body, id: data.id });
      if (options.timeoutAfterAcceptance && sends === 1) throw Error('uncertain timeout');
      return r;
    } catch (e) { if (!keys.get(key)?.id) keys.delete(key); throw e; }
  };
  return { transport, calls, get sends() { return sends; } };
}

test('unconfigured contact is unavailable and POST-only', async () => {
  assert.equal((await handleContact(request(input()), null)).status, 503);
  assert.equal((await handleContact(request(null, {}, 'GET'), config)).status, 405);
});
test('rejects foreign and missing origin before touching services', async () => {
  for (const origin of ['', 'https://evil.example']) {
    const mock = services();
    assert.equal((await handleContact(request(input(), { origin }), config, mock.transport)).status, 403);
    assert.equal(mock.calls.length, 0);
  }
});
test('validates all fields, bounded body and header injection', async () => {
  for (const data of [input({ name: 'A\r\nB' }), input({ email: 'a@b.com\r\nBcc:x@y.com' }), input({ message: 'short' }), input({ message: 'x'.repeat(3001) }), input({ category: 'other' }), input({ website: 'spam' }), input({ submissionId: `${Date.now() - 24 * 3600000}.${randomUUID()}` }), '{bad json']) {
    const mock = services();
    assert.equal((await handleContact(request(data), config, mock.transport)).status, 400);
    assert.equal(mock.sends, 0);
  }
  assert.equal((await handleContact(request('x'.repeat(8193)), config, services().transport)).status, 413);
  assert.equal((await handleContact(request(input(), { 'content-length': '9000' }), config, services().transport)).status, 413);
});
test('Turnstile rejects missing, invalid, expired, mismatched and replayed tokens', async () => {
  assert.equal((await handleContact(request(input({ token: '' })), config, services().transport)).status, 400);
  for (const verification of [{ success: false }, { hostname: 'evil.example' }, { action: 'another_action' }, { challenge_ts: new Date(Date.now() - 301000).toISOString() }, { challenge_ts: 'invalid' }]) {
    const mock = services({ verification });
    assert.equal((await handleContact(request(input()), config, mock.transport)).status, 400);
    assert.equal(mock.sends, 0);
  }
  const mock = services(); const data = input();
  assert.equal((await handleContact(request(data), config, mock.transport)).status, 200);
  assert.equal((await handleContact(request(data), config, mock.transport)).status, 400);
  assert.equal(mock.sends, 1);
});
test('verification outage and malformed provider acceptance fail closed', async () => {
  assert.equal((await handleContact(request(input()), config, async () => { throw Error('offline'); })).status, 503);
  assert.equal((await handleContact(request(input()), config, services({ onProvider: async () => Response.json({}) }).transport)).status, 503);
});
test('provider acceptance, safe plain text, private destination and idempotent retry', async () => {
  const mock = services(); const data = input({ message: '<script>alert(1)</script> This stays plain text.' });
  const first = await handleContact(request(data), config, mock.transport);
  assert.deepEqual(await first.json(), { code: 'accepted' });
  const retry = await handleContact(request({ ...data, token: randomUUID() }), config, mock.transport);
  assert.equal(retry.status, 200); assert.equal(mock.sends, 1);
  const sent = mock.calls.find(c => c.url.includes('resend'));
  const body = JSON.parse(sent.init.body);
  assert.deepEqual(body.to, [config.to]); assert.equal(body.reply_to, data.email);
  assert.equal(body.subject, 'Portfolio: Project enquiry'); assert.equal(body.html, undefined);
  assert.ok(body.text.includes(data.message));
  const conflict = await handleContact(request({ ...data, token: randomUUID(), message: 'Different message content here.' }), config, mock.transport);
  assert.equal(conflict.status, 409); assert.equal(mock.sends, 1);
});
test('provider failure and uncertain acceptance retries reuse the provider key', async () => {
  const mock = services({ timeoutAfterAcceptance: true }); const data = input();
  assert.equal((await handleContact(request(data), config, mock.transport)).status, 503);
  assert.equal((await handleContact(request({ ...data, token: randomUUID() }), config, mock.transport)).status, 200);
  const calls = mock.calls.filter(c => c.url.includes('resend'));
  assert.equal(calls[0].init.headers['Idempotency-Key'], calls[1].init.headers['Idempotency-Key']); assert.equal(mock.sends, 1);
  assert.equal((await handleContact(request(input()), config, services({ providerDown: true }).transport)).status, 503);
});
test('concurrent verified retries rely on provider concurrency protection', async () => {
  let release; const wait = new Promise(resolve => release = resolve);
  let started; const called = new Promise(resolve => started = resolve);
  const mock = services({ onProvider: async () => { started(); await wait; return Response.json({ id: 'test-accepted' }); } });
  const data = input(); const first = handleContact(request(data), config, mock.transport); await called;
  assert.equal((await handleContact(request({ ...data, token: randomUUID() }), config, mock.transport)).status, 409);
  release(); assert.equal((await first).status, 200); assert.equal(mock.sends, 1);
});
