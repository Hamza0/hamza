const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const filename = path.resolve(__dirname, '../src/lib', file + '.ts');
  const sandbox = { exports: {}, URL, require: name => load(path.relative(path.resolve(__dirname, '../src/lib'), path.resolve(path.dirname(filename), name))) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, sandbox);
  return sandbox.exports;
}
const { isPublished, isIndexable, modificationDate } = load('publication');
const { serializeJsonLd, pageMetadata, articleJsonLd, PERSON_ID } = load('seo');
const { SOCIAL_PREVIEW } = load('social-metadata');
const publication = { publishedAt: '2026-05-02' };

test('public listings exclude drafts, private, unpublished, noindex and future content', () => {
  assert.equal(isIndexable(publication, '2026-10-24'), true);
  for (const flags of [{ draft: true }, { private: true }, { published: false }, { noindex: true }, { publishedAt: '2027-01-01' }, { publishedAt: '2026-02-30' }, { publishedAt: 'invalid' }]) {
    assert.equal(isIndexable({ ...publication, ...flags }, '2026-10-24'), false);
  }
  assert.equal(isPublished({ ...publication, noindex: true }, '2026-10-24'), true);
  assert.equal(isPublished({ ...publication, private: true }, '2026-10-24'), false);
});

test('modification dates use an explicit valid editorial record, never a publication fallback', () => {
  assert.equal(modificationDate(publication), undefined);
  assert.equal(modificationDate({ ...publication, updatedAt: '2026-10-24' }), '2026-10-24');
  for (const updatedAt of ['2026-01-01', '2026-02-30', 'bad']) assert.equal(modificationDate({ ...publication, updatedAt }), undefined);
});

test('article identity, canonical and optional dates remain consistent', () => {
  const input = { title: 'Test note', description: 'Description', path: '/blog/test-note', image: '/og/test-note', publishedAt: publication.publishedAt };
  const original = articleJsonLd(input);
  assert.equal(original.datePublished, '2026-05-02');
  assert.equal('dateModified' in original, false);
  assert.equal(original.author['@id'], PERSON_ID);
  assert.equal(original.mainEntityOfPage['@id'], original.url);
  assert.equal(original.image, 'https://www.hamzashakeel.ca/og/test-note');
  assert.equal(articleJsonLd({ ...input, updatedAt: '2026-10-24' }).dateModified, '2026-10-24');
  assert.equal('datePublished' in articleJsonLd({ ...input, type: 'TechArticle', publishedAt: undefined }), false);
});

test('JSON-LD cannot terminate its script element and round-trips special text', () => {
  const input = { headline: '</script><script>alert("x")</script>\u2028\u2029 & "quoted"' };
  const output = serializeJsonLd(input);
  assert.equal(output.includes('<'), false);
  assert.equal(output.includes('\u2028'), false);
  assert.deepEqual(JSON.parse(output), input);
});

test('each page owns its canonical and social metadata, including noindex overrides', () => {
  const meta = pageMetadata({ title: 'Notes', description: 'Technical articles', path: '/blog' });
  assert.equal(meta.alternates.canonical, 'https://www.hamzashakeel.ca/blog');
  assert.equal(meta.openGraph.url, meta.alternates.canonical);
  assert.equal(meta.twitter.title, meta.openGraph.title);
  assert.equal(meta.openGraph.description, 'Technical articles');
  const hidden = pageMetadata({ title: 'Unlisted', description: 'Unlisted', path: '/blog/unlisted', noindex: true });
  assert.equal(hidden.robots.index, false);
  assert.equal(hidden.robots.googleBot.index, false);
  assert.equal(SOCIAL_PREVIEW.title, 'Hamza Shakeel | Software Developer | Toronto, Canada');
  assert.ok(SOCIAL_PREVIEW.description.includes('Greater Toronto Area'));
});
