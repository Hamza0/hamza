const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(filename) {
  const sandbox = { exports: {}, URL, require: name => load(path.resolve(path.dirname(filename), `${name}.ts`)) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, sandbox);
  return sandbox.exports;
}
const { createBusinessProfileDetails, validateBusinessProfileStep } = load(require.resolve('../src/lib/business-profile-inquiry.ts'));
const values = (changes = {}) => ({
  issue: 'address', businessName: '  Example Bakery  ', profileUrl: 'https://maps.app.goo.gl/example',
  details: 'The new address is still pending.\nCustomers see our old location.',
  name: '  Test Visitor  ', email: ' visitor@example.com ', website: '', ...changes,
});

test('review payload is deterministic, bounded and contains every supplied enquiry detail', () => {
  const result = createBusinessProfileDetails(values());
  assert.ok(result);
  assert.equal(result.category, 'business_profile');
  assert.equal(result.context, 'Example Bakery');
  assert.equal(result.name, 'Test Visitor');
  assert.equal(result.email, 'visitor@example.com');
  assert.ok(result.message.includes('Help needed: My address change is not showing'));
  assert.ok(result.message.includes('Profile link: https://maps.app.goo.gl/example'));
  assert.ok(result.message.includes(values().details));
  assert.deepEqual(Object.keys(result).sort(), ['category', 'context', 'email', 'message', 'name']);
  assert.equal(JSON.stringify(createBusinessProfileDetails(values())), JSON.stringify(result));
  assert.ok(createBusinessProfileDetails(values({ details: 'x'.repeat(2000), profileUrl: `https://example.com/${'x'.repeat(480)}` })).message.length <= 3000);
  assert.ok(createBusinessProfileDetails(values({ profileUrl: '' })).message.includes('Profile link: Not provided'));
});

test('optional profile links accept web URLs and reject credentials, executable schemes and malformed values', () => {
  for (const profileUrl of ['', 'https://www.google.com/maps/place/example', 'http://example.com/profile']) {
    assert.equal(validateBusinessProfileStep(values({ profileUrl }), 1), null);
  }
  for (const profileUrl of ['javascript:alert(1)', 'data:text/html,hello', 'https://name:password@example.com', 'not a URL', 'https://example.com/has space', `https://example.com/${'x'.repeat(500)}`]) {
    assert.equal(validateBusinessProfileStep(values({ profileUrl }), 1).field, 'profileUrl');
    assert.equal(createBusinessProfileDetails(values({ profileUrl })), null);
  }
});

test('invalid choices, missing answers, field overflow and control characters cannot enter the contact payload', () => {
  for (const change of [
    { issue: '__proto__' }, { issue: 'unknown' }, { businessName: '   ' },
    { businessName: 'x'.repeat(161) }, { businessName: 'Bakery\r\nHidden' },
    { details: 'short' }, { details: 'x'.repeat(2001) }, { details: 'description\u0000extra' },
    { name: '' }, { name: 'x'.repeat(101) }, { name: 'Person\r\nHidden' },
    { email: 'invalid' }, { email: 'a@example.com\r\nBcc: x@example.com' },
  ]) {
    assert.equal(createBusinessProfileDetails(values(change)), null);
  }
});
