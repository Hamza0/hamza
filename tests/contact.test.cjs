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
const config = { origin: 'https://www.hamzashakeel.ca', hostname: 'www.hamzashakeel.ca', resendKey: 'test-only', from: 'verified@example.com', to: 'recipient@example.com', turnstileSecret: 'test-only', redisUrl: 'https://redis.example.com', redisToken: 'test-only', hashSecret: 'test-fixture-key-not-a-real-secret-000', onVercel: true };
const input = (extra = {}) => ({ category: 'project', name: 'Test Visitor', email: 'visitor@example.com', message: 'This is a clearly labelled test message.', website: '', token: randomUUID(), submissionId: `${Date.now()}.${randomUUID()}`, ...extra });
const request = (body, headers = {}, method = 'POST') => new Request(`${config.origin}/api/contact`, { method, headers: { origin: config.origin, 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1', ...headers }, ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}) });

function services(options = {}) {
  const store = new Map();
  const calls = [];
  let sends = 0;
  const transport = async (url, init) => {
    calls.push({ url, init });
    assert.ok(init.signal, 'Every provider operation has a timeout');
    if (url === config.redisUrl) {
      if (options.redisDown) return new Response('', { status: 503 });
      const command = JSON.parse(init.body);
      let result;
      if (command[0] === 'SET') {
        if (command.includes('NX') && store.has(command[1])) result = null;
        else { store.set(command[1], command[2]); result = 'OK'; }
      } else if (command[0] === 'EVAL') {
        const [_, script, count, key, arg1, arg2, arg3] = command;
        assert.equal(count, 1);
        if (script.includes("'INCR'")) { const n = (Number(store.get(key)) || 0) + 1; store.set(key, n); result = [options.rateLimit ? 99 : n, arg1]; }
        else if (script.includes("'DEL'")) { result = store.get(key) === arg1 ? Number(store.delete(key)) : 0; }
        else { const old = store.get(key); if (old && old !== arg3) result = old; else { store.set(key, arg1); result = 'new'; } }
      } else throw Error('Unexpected Redis command');
      return Response.json({ result });
    }
    if (url.includes('/siteverify')) return Response.json({ success: true, hostname: config.hostname, action: 'portfolio_contact', challenge_ts: new Date().toISOString(), ...options.verification });
    if (url === 'https://api.resend.com/emails') {
      sends++;
      if (options.onProvider) return options.onProvider(init, sends);
      if (options.providerDown) return Response.json({ error: 'test-only' }, { status: 500 });
      return Response.json({ id: 'provider-test-acceptance' });
    }
    throw Error('Unexpected service');
  };
  return { transport, calls, store, get sends() { return sends; } };
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
test('shared rate limiter fails closed; no provider call on limit or outage', async () => {
  for (const [options, status] of [[{ rateLimit: true }, 429], [{ redisDown: true }, 503]]) {
    const mock = services(options);
    const r = await handleContact(request(input()), config, mock.transport);
    assert.equal(r.status, status);
    if (status === 429) assert.ok(Number(r.headers.get('retry-after')) > 0);
    assert.equal(mock.sends, 0);
  }
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
  const redisBodies = mock.calls.filter(c => c.url === config.redisUrl).map(c => c.init.body).join('');
  for (const privateValue of [data.name, data.email, data.message, data.token, config.to]) assert.ok(!redisBodies.includes(privateValue));
  const conflict = await handleContact(request({ ...data, token: randomUUID(), message: 'Different message content here.' }), config, mock.transport);
  assert.equal(conflict.status, 409); assert.equal(mock.sends, 1);
});
test('provider failure and uncertain timeout retry reuse the provider key', async () => {
  const keys = [];
  const mock = services({ onProvider: async (init, count) => { keys.push(init.headers['Idempotency-Key']); if (count === 1) throw new Error('timeout'); return Response.json({ id: 'test-accepted' }); } });
  const data = input();
  assert.equal((await handleContact(request(data), config, mock.transport)).status, 503);
  assert.equal((await handleContact(request({ ...data, token: randomUUID() }), config, mock.transport)).status, 200);
  assert.equal(keys[0], keys[1]);
  const down = services({ providerDown: true });
  assert.equal((await handleContact(request(input()), config, down.transport)).status, 503);
});
test('concurrent verified submissions cannot call the provider twice', async () => {
  let release; const wait = new Promise(resolve => release = resolve);
  let started; const called = new Promise(resolve => started = resolve);
  const mock = services({ onProvider: async () => { started(); await wait; return Response.json({ id: 'test-accepted' }); } });
  const data = input(); const first = handleContact(request(data), config, mock.transport); await called;
  assert.equal((await handleContact(request({ ...data, token: randomUUID() }), config, mock.transport)).status, 409);
  release(); assert.equal((await first).status, 200); assert.equal(mock.sends, 1);
});
