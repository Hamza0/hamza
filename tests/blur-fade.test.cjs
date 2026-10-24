const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const filename = path.resolve(__dirname, '../src/components/magicui/blur-fade.tsx');
const sandbox = { exports: {}, require };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText, sandbox);
const BlurFade = sandbox.exports.default;

test('readable server-rendered reveals do not retain a filter compositing layer', () => {
  const html = renderToStaticMarkup(React.createElement(BlurFade, null, 'Readable content'));
  assert.match(html, /opacity:1/);
  assert.match(html, /filter:none/);
  assert.match(html, /transform:none/);
  assert.ok(html.includes('Readable content'));
});
