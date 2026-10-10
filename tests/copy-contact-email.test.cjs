const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = readFileSync(require.resolve("../src/lib/copy-contact-email.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function setup(clipboard, result = true) {
  const trace = { temporary: [], copied: null, focusRestored: false, selectionRestored: false };
  class Element {
    focus(options) { trace.focusRestored = options.preventScroll; }
  }
  const range = {};
  const selection = {
    rangeCount: 1,
    getRangeAt: () => ({ cloneRange: () => range }),
    removeAllRanges() {},
    addRange(value) { trace.selectionRestored = value === range; },
  };
  const context = {
    exports: {}, navigator: { clipboard }, HTMLElement: Element,
    window: { getSelection: () => selection },
    document: {
      activeElement: new Element(),
      body: { appendChild(field) { trace.temporary.push(field); } },
      createElement(tag) {
        assert.equal(tag, "textarea");
        return {
          style: {}, setAttribute() {}, select() {},
          setSelectionRange(start, end) { assert.equal(start, 0); assert.equal(end, this.value.length); },
          remove() { trace.temporary.splice(trace.temporary.indexOf(this), 1); },
        };
      },
      execCommand(command) {
        assert.equal(command, "copy");
        trace.copied = trace.temporary[0].value;
        if (result instanceof Error) throw result;
        return result;
      },
    },
  };
  vm.runInNewContext(compiled, context);
  return { copy: context.exports.copyContactEmail, trace };
}

test("Clipboard API copies the exact contact address without creating DOM content", async () => {
  let copied;
  const { copy, trace } = setup({ writeText: async value => { copied = value; } });
  assert.equal(await copy(), true);
  assert.equal(copied, "hamza@codedsquare.com");
  assert.equal(trace.copied, null);
  assert.deepEqual(trace.temporary, []);
});

for (const [name, clipboard] of [
  ["missing Clipboard API", undefined],
  ["denied Clipboard API", { writeText: async () => { throw new Error("Denied"); } }],
]) {
  test(`${name} uses the fallback and removes the temporary address`, async () => {
    const { copy, trace } = setup(clipboard);
    assert.equal(await copy(), true);
    assert.equal(trace.copied, "hamza@codedsquare.com");
    assert.deepEqual(trace.temporary, []);
    assert.equal(trace.focusRestored, true);
    assert.equal(trace.selectionRestored, true);
  });
}

for (const result of [false, new Error("Copy unavailable")]) {
  test(`fallback failure (${typeof result}) reports failure and still cleans up`, async () => {
    const { copy, trace } = setup(undefined, result);
    assert.equal(await copy(), false);
    assert.deepEqual(trace.temporary, []);
    assert.equal(trace.focusRestored, true);
    assert.equal(trace.selectionRestored, true);
  });
}
