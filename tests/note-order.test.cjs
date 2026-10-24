const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const sandbox = { exports: {} };
const source = fs.readFileSync(require.resolve('../src/lib/note-order.ts'), 'utf8');
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, sandbox);
const { getFeaturedNotes } = sandbox.exports;
const note = (slug, publishedAt, featuredOrder) => ({ slug, metadata: { publishedAt, featuredOrder } });
const slugs = posts => Array.from(posts, post => post.slug);

test('editorial order is independent of dates and leaves chronological navigation unchanged', () => {
  const archive = [
    note('programming-journey', '2026-10-15'),
    note('integrations', '2026-06-07', 3),
    note('database', '2026-05-19', 2),
    note('production', '2026-05-02', 1),
  ];
  const original = JSON.stringify(archive);
  assert.deepEqual(slugs(getFeaturedNotes(archive)), ['production', 'database', 'integrations']);
  assert.equal(JSON.stringify(archive), original);
  assert.equal(archive[0].slug, 'programming-journey');
});

test('unranked and invalid ranks never become featured; tied ranks are deterministic', () => {
  const posts = [
    note('z', '2026-01-01', 2), note('a', '2026-02-01', 2),
    ...[undefined, null, 0, -1, 1.5, '1', NaN, Infinity].map((rank, i) => note(`invalid-${i}`, '2026-01-01', rank)),
  ];
  assert.deepEqual(slugs(getFeaturedNotes(posts)), ['a', 'z']);
  assert.deepEqual(slugs(getFeaturedNotes([])), []);
});
