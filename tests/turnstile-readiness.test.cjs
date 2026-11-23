const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { handleClientScriptLoad } = require('next/dist/client/script');

// Capture the actual Script props rendered by each form. No browser, external
// script, verification token or enquiry request is involved in this test.
function formScript(filename, initialStep) {
  const Script = Symbol('Script');
  const updates = [];
  let stateIndex = 0;
  const hooks = {
    useState(initial) {
      const index = stateIndex++;
      return [index === 0 ? initialStep : initial, value => updates.push(value)];
    },
    useRef: current => ({ current }),
    useEffect() {},
  };
  const element = (type, props) => ({ type, props });
  const mocks = {
    react: hooks,
    'react/jsx-runtime': { jsx: element, jsxs: element, Fragment: Symbol('Fragment') },
    'next/script': Script,
    'next/link': 'Link',
    'lucide-react': { ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', Check: 'Check', X: 'X' },
    '@radix-ui/react-dialog': new Proxy({}, { get: (_target, key) => `Dialog.${String(key)}` }),
    '@/components/ui/button': { Button: 'Button' },
    '@/lib/analytics': { trackEvent() {} },
  };
  function load(file) {
    const sandbox = {
      exports: {}, URL, process: { env: {} },
      require(name) {
        if (Object.hasOwn(mocks, name)) return mocks[name];
        const dependency = name.startsWith('@/')
          ? path.resolve(__dirname, '../src', name.slice(2))
          : path.resolve(path.dirname(file), name);
        return load(`${dependency}.ts`);
      },
    };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
      },
    }).outputText, sandbox);
    return sandbox.exports;
  }
  const exports = load(path.resolve(__dirname, '../src/components', filename));
  const tree = exports.BusinessProfileInquiry
    ? exports.BusinessProfileInquiry({ available: true })
    : exports.default({ open: true, onOpenChange() {}, restoreFocus() {} });
  function find(node) {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) return node.map(find).find(Boolean) || null;
    if (node.type === Script) return node.props;
    return find(node.props?.children);
  }
  const props = find(tree);
  assert.ok(props, `${filename} renders its verification script`);
  return { props, updates };
}

function fakeScriptDocument() {
  const appended = [];
  return {
    appended,
    body: { appendChild: node => appended.push(node) },
    createElement() {
      const listeners = new Map();
      return {
        addEventListener: (event, callback) => listeners.set(event, callback),
        setAttribute() {},
        fire(event) { listeners.get(event)?.call(this, { type: event }); },
      };
    },
  };
}

for (const order of ['contact-first', 'profile-first']) {
  test(`both forms become ready when sharing an in-flight Turnstile script: ${order}`, async () => {
    const contact = formScript('contact-dialog.tsx', 2);
    const profile = formScript('business-profile-inquiry.tsx', 5);
    assert.equal(contact.props.src, profile.props.src);
    assert.equal(contact.props.id, profile.props.id, 'remounts use the same Next script cache key');
    const forms = order === 'contact-first' ? [contact, profile] : [profile, contact];
    const previousDocument = global.document;
    const document = fakeScriptDocument();
    global.document = document;
    try {
      for (const { props } of forms) handleClientScriptLoad({
        ...props,
        // Isolate the Next loader's module-level caches between test cases.
        id: `${props.id}-${order}`, src: `${props.src}&test=${order}`,
      });
      assert.equal(document.appended.length, 1, 'the shared script is only loaded once');
      document.appended[0].fire('load');
      await new Promise(resolve => setImmediate(resolve));
      for (const [index, form] of forms.entries()) {
        assert.ok(form.updates.includes(true), `form ${index + 1} receives readiness when loading finishes`);
        assert.ok(form.updates.includes(false), `form ${index + 1} clears its verification error`);
      }
    } finally {
      if (previousDocument === undefined) delete global.document;
      else global.document = previousDocument;
    }
  });
}
