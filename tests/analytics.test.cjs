const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function setup() {
  const events = [], traffic = [], cookies = [];
  const window = { location: { origin: 'https://www.hamzashakeel.ca', pathname: '/blog', search: '?email=private@example.com' }, portfolioAnalytics: { accepted: true, ready: true, paths: ['/', '/blog'] }, gtag: (...args) => events.push(args), fetch: async (url) => { traffic.push(String(url)); return new Response(null, { status: 204 }); } };
  const navigator = { sendBeacon: url => { traffic.push(String(url)); return true; } };
  const document = {};
  Object.defineProperty(document, 'cookie', { get: () => '_ga=test; theme=dark', set: value => cookies.push(value) });
  const sandbox = { exports: {}, window, navigator, document, URL, Request, Response };
  const source = fs.readFileSync(require.resolve('../src/lib/analytics.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, sandbox);
  return { api: sandbox.exports, window, navigator, events, traffic, cookies };
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
  s.api.disableAnalytics(); s.api.trackEvent('contact_open', { location: 'dock' }); assert.equal(s.events.length, 2);
  assert.ok(s.cookies.every(cookie => cookie.startsWith('_ga=')));
});
test('withdrawal drops buffered GA fetch/beacons while contact and other properties work', async () => {
  const s = setup(); s.api.installAnalyticsTransportGuard();
  const capturedBeacon = s.navigator.sendBeacon;
  const hit = 'https://region1.google-analytics.com/g/collect?tid=G-1BKHGCCN3E';
  capturedBeacon(hit); assert.equal(s.traffic.length, 1);
  s.api.disableAnalytics(); capturedBeacon(hit); await s.window.fetch(hit); assert.equal(s.traffic.length, 1);
  await s.window.fetch('/api/contact'); capturedBeacon('https://www.google-analytics.com/g/collect?tid=G-OTHER');
  assert.equal(s.traffic.length, 3);
  s.window.portfolioAnalytics.accepted = true; s.window['ga-disable-G-1BKHGCCN3E'] = false;
  capturedBeacon(hit); assert.equal(s.traffic.length, 4);
});
