const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function setup() {
  const events = [];
  const window = { location: { origin: 'https://www.hamzashakeel.ca', pathname: '/blog', search: '?email=private@example.com' }, portfolioAnalytics: { enabled: true, ready: true, paths: ['/', '/blog'] }, gtag: (...args) => events.push(args) };
  const sandbox = { exports: {}, window };
  const source = fs.readFileSync(require.resolve('../src/lib/analytics.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, sandbox);
  return { api: sandbox.exports, window, events };
}
test('only allowlisted event names, parameters and page paths reach GA', () => {
  const s = setup();
  s.api.trackEvent('contact_submit_success', { category: 'project', location: 'section', name: 'Private', message: 'Private message' });
  assert.equal(s.events.length, 1);
  assert.deepEqual(Object.keys(s.events[0][2]).sort(), ['enquiry_category', 'page_location', 'page_referrer', 'send_to', 'trigger_location']);
  assert.equal(s.events[0][2].page_location, 'https://www.hamzashakeel.ca/blog');
  assert.ok(!JSON.stringify(s.events).includes('private@example.com'));
  s.api.trackEvent('unapproved_event', { category: 'project' }); assert.equal(s.events.length, 1);
  s.window.location.pathname = '/personal-value'; s.api.trackEvent('contact_open', { location: 'invalid', category: 'invalid' });
  assert.equal(s.events[1][2].page_location, 'https://www.hamzashakeel.ca/');
  assert.equal(s.events[1][2].trigger_location, undefined);
});
test('all existing custom events remain available without a saved preference', () => {
  const s = setup();
  for (const event of ['contact_open', 'contact_submit_success', 'contact_submit_error', 'linkedin_click', 'call_click']) {
    s.api.trackEvent(event, { location: 'dock', category: 'job' });
  }
  assert.equal(s.events.length, 5);
  assert.ok(s.events.every(event => event[2].send_to === 'G-1BKHGCCN3E'));
});
test('custom events require production initialization and respect browser opt-out', () => {
  const s = setup();
  s.window.portfolioAnalytics.enabled = false;
  s.api.trackEvent('contact_open');
  s.window.portfolioAnalytics.enabled = true;
  s.window.portfolioAnalytics.ready = false;
  s.api.trackEvent('contact_open');
  s.window.portfolioAnalytics.ready = true;
  s.window['ga-disable-G-1BKHGCCN3E'] = true;
  s.api.trackEvent('contact_open');
  delete s.window.portfolioAnalytics;
  s.api.trackEvent('contact_open');
  assert.equal(s.events.length, 0);
});

test('Business Profile enquiries report only fixed labels and the public page path', () => {
  const s = setup();
  s.window.portfolioAnalytics.paths.push('/google-business-profile-help');
  s.window.location.pathname = '/google-business-profile-help';
  s.api.trackEvent('contact_submit_success', {
    category: 'business_profile', location: 'business_profile',
    name: 'Private owner', email: 'owner@example.com',
    profileUrl: 'https://maps.google.com/private-business', message: 'Private issue details',
  });
  assert.equal(s.events[0][2].enquiry_category, 'business_profile');
  assert.equal(s.events[0][2].page_location, 'https://www.hamzashakeel.ca/google-business-profile-help');
  assert.equal(s.events[0][2].trigger_location, 'business_profile');
  assert.ok(!JSON.stringify(s.events).includes('Private'));
  assert.ok(!JSON.stringify(s.events).includes('owner@example.com'));
  assert.ok(!JSON.stringify(s.events).includes('maps.google.com'));
});
