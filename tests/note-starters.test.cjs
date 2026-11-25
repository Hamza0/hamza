const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const sandbox = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../src/lib/contact/note-starters.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, sandbox);
const { hasNoteStarter, toggleNoteStarter } = sandbox.exports;

test('multiple suggestions can be selected and deselected independently', () => {
  const a = 'My website shows a security warning.';
  const b = 'Customers cannot open my website.';
  const first = toggleNoteStarter('My site is example.com.', a, 3000);
  const both = toggleNoteStarter(first, b, 3000);
  assert.equal(both, 'My site is example.com.\n' + a + '\n' + b);
  assert.equal(hasNoteStarter(both, a), true);
  assert.equal(hasNoteStarter(both, b), true);
  assert.equal(toggleNoteStarter(both, a, 3000), 'My site is example.com.\n' + b);
});

test('edited sentences remain user-owned and length limits prevent overwriting', () => {
  const a = 'My website is down.';
  const edited = a + ' It started after a hosting change.';
  assert.equal(hasNoteStarter(edited, a), false);
  assert.equal(toggleNoteStarter(edited, a, edited.length), edited);
  assert.equal(toggleNoteStarter('', a, 3000), a);
  assert.equal(toggleNoteStarter(a, a, 3000), '');
});
