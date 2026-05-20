import type { Feature } from './feature.model';

export const FEATURES: Feature[] = [
  // =====================================================================
  // SECTION 1 — Fundamentals & Mental Model
  // =====================================================================
  {
    slug: 'jsx',
    section: 'fundamentals',
    title: 'JSX',
    tagline: 'Syntactic sugar over function calls — not HTML, not a template language.',
    summary:
      'JSX compiles (by Babel or SWC) to plain JS that calls React.createElement, or — since React 17 — to the automatic JSX runtime jsx() / jsxs(). The result is a plain object (a React element) describing what to render. JSX is just expressions; conditionals, ternaries and arrays all work because the markup is JavaScript.',
    keyPoints: [
      "JSX is not HTML and not a template language — it's an XML-like syntax compiled to function calls.",
      '<div className="x">hi</div> becomes React.createElement(\'div\', { className: \'x\' }, \'hi\').',
      'Since React 17 the automatic JSX runtime removes the "import React" requirement for JSX.',
      'JSX expressions return values, so conditionals, ternaries and arrays compose naturally.',
      'The type checker sees JSX as JS, so prop types and component contracts are statically checked.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'JSX vs createElement',
        code: `// JSX
const view = <button className="btn" onClick={save}>Save</button>;

// What it compiles to (classic runtime)
const view = React.createElement(
  'button',
  { className: 'btn', onClick: save },
  'Save',
);

// React 17+ automatic runtime — no React import needed
import { jsx as _jsx } from 'react/jsx-runtime';
const view = _jsx('button', { className: 'btn', onClick: save, children: 'Save' });`,
      },
    ],
    pointers: [
      {
        label: 'jsx-compilation demo',
        path: 'src/features/jsx-compilation/JsxCompilationDemo.tsx',
        note: 'Toggle between JSX and createElement views of the same UI.',
      },
    ],
    demoKey: 'jsx-compilation',
    references: [
      { label: 'JSX in depth', url: 'https://react.dev/learn/writing-markup-with-jsx' },
      { label: 'The new JSX transform', url: 'https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html' },
    ],
    redFlags: [
      'Thinks JSX is HTML or a template language.',
      'Does not know about the compilation step.',
      "Still imports React just to use JSX (post-17 it's unnecessary)."
    ],
  },
  {
    slug: 'component-element-dom',
    section: 'fundamentals',
    title: 'Component vs Element vs DOM Node',
    tagline: 'Three distinct layers — conflating them hides every render bug.',
    summary:
      "A component is a function that returns elements — a definition, like a class. An element is a plain object describing what should appear: { type, props, children }. A DOM node is the actual browser element React eventually creates and updates. Components produce elements during render; the reconciler diffs elements; the renderer commits DOM ops.",
    keyPoints: [
      'Component = function/class (definition). Reusable; can render many times.',
      'Element = plain JS object describing UI. Immutable; created on every render.',
      'DOM node = the browser thing. React updates these from the element tree.',
      "A component re-rendering doesn't mean DOM updates — it means a new element tree, which may diff to no DOM mutation.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'The three layers',
        code: `// Component (definition)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

// Element (created during render — a plain object)
const el = <Greeting name="Darko" />;
// === { type: Greeting, props: { name: 'Darko' }, ... }

// DOM node (after react-dom commits)
document.querySelector('h1'); // <h1>Hello, Darko</h1>`,
      },
    ],
    pointers: [
      {
        label: 'component-vs-element demo',
        path: 'src/features/component-vs-element/ComponentVsElementDemo.tsx',
        note: 'Inspect a React element object next to the component that produced it.',
      },
    ],
    demoKey: 'component-vs-element',
    references: [
      { label: 'Your first component', url: 'https://react.dev/learn/your-first-component' },
    ],
    redFlags: [
      'Treats component and element as synonyms.',
      'Thinks React mutates the DOM on every render.',
    ],
  },
  {
    slug: 'props-vs-state',
    section: 'fundamentals',
    title: 'Props vs State',
    tagline: 'Inputs from above vs locally-owned data — and the bugs from confusing them.',
    summary:
      "Props are inputs passed in by a parent — read-only from the component's perspective, like function arguments. State is data owned by the component, updated via useState/useReducer, whose changes trigger a re-render. If a value can be derived from props/state, it is not state — derived state is a common bug source.",
    keyPoints: [
      'Props flow down from a parent. The component cannot modify them.',
      'State is owned locally and mutating it triggers a re-render of this component (and its subtree).',
      "If a value can be computed from props or other state, don't store it as state — compute it during render.",
      "Initializing useState from props is usually a mistake — you'll desync when the prop changes.",
      'Controlled vs uncontrolled inputs is an applied case: state-driven vs ref/DOM-driven values.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Don\'t copy props into state',
        code: `// BAD — desyncs when 'initialName' changes after mount
function Greeting({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// GOOD — derive, or accept that the value is controlled by the parent
function Greeting({ name, onChange }: {
  name: string;
  onChange: (next: string) => void;
}) {
  return <input value={name} onChange={(e) => onChange(e.target.value)} />;
}`,
      },
    ],
    pointers: [
      {
        label: 'state-vs-props demo',
        path: 'src/features/state-vs-props/StateVsPropsDemo.tsx',
        note: 'Parent owns state; child receives a value + a callback prop.',
      },
    ],
    demoKey: 'state-vs-props',
    references: [
      { label: 'Choosing the state structure', url: 'https://react.dev/learn/choosing-the-state-structure' },
      { label: 'Lifting state up', url: 'https://react.dev/learn/sharing-state-between-components' },
    ],
    redFlags: [
      'Copies props into state in useState initial value.',
      "Doesn't know what derived state is.",
      'Treats them as interchangeable.',
    ],
  },
  {
    slug: 'rerender-model',
    section: 'fundamentals',
    title: 'When Does a Component Re-render?',
    tagline: 'The single most important mental model in React.',
    summary:
      "A component re-renders when: its own state changes; its parent re-renders; a Context it subscribes to changes; or a hook subscribing to external state signals a change. Crucially, a parent re-rendering re-renders all its children regardless of whether props 'changed' — React doesn't know that. Only React.memo + shallow prop compare opts out.",
    keyPoints: [
      'Own state change (useState/useReducer setter) — triggers a re-render.',
      "Parent re-renders — children re-render too, even if props look 'the same' to you.",
      'Subscribed Context value changes — all consumers re-render.',
      'External-store subscription fires (useSyncExternalStore, useSelector, etc.).',
      'Inline objects/arrays/functions as props break referential equality and defeat React.memo.',
      'Setting state to the same primitive bails out via Object.is — but a new array with the same contents still re-renders.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Inline props defeat memo',
        code: `const Heavy = React.memo(function Heavy({ data }: { data: number[] }) {
  console.log('Heavy render');
  return <div>{data.length}</div>;
});

function Parent() {
  const [n, setN] = useState(0);
  // BAD — new array every render, memo bail-out never fires
  return (
    <>
      <Heavy data={[1, 2, 3]} />
      <button onClick={() => setN(n + 1)}>{n}</button>
    </>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'rerender-causes demo',
        path: 'src/features/rerender-causes/RerenderCausesDemo.tsx',
        note: 'Click counter, parent state, child memo — watch render counts.',
      },
    ],
    demoKey: 'rerender-causes',
    references: [
      { label: 'Render and commit', url: 'https://react.dev/learn/render-and-commit' },
      { label: 'State as a snapshot', url: 'https://react.dev/learn/state-as-a-snapshot' },
    ],
    redFlags: [
      'Thinks prop comparison happens automatically.',
      "Doesn't know parent re-renders re-render children by default.",
      'No mention of Context behavior.',
    ],
  },
  {
    slug: 'keys',
    section: 'fundamentals',
    title: 'Keys & List Reconciliation',
    tagline: 'Why array index as key produces invisible production bugs.',
    summary:
      "React matches new list elements to previous ones by key. Without keys, it falls back to position-based matching. Using the array index as key works only for append-only lists; with insert/reorder/filter, React keeps the same DOM nodes and component state attached to what is now a different item — form inputs keep stale values, animations animate the wrong element, state leaks between rows.",
    keyPoints: [
      'Keys let React detect insert / move / delete cheaply.',
      'Array index as key is correct only when the list is append-only.',
      'On reorder, index-as-key reuses DOM + state with new props — quiet, hard-to-reproduce bugs.',
      'Use a stable unique ID from the data; generate one at create time if you must.',
      'Keys need only be unique among siblings.',
      'Changing the key intentionally is the canonical way to reset a component (force remount).',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Index vs id as key',
        code: `// BAD — reorder this list and any focused input keeps its old value
items.map((item, i) => <Row key={i} item={item} />)

// GOOD — stable ID from the data
items.map((item) => <Row key={item.id} item={item} />)

// Force-reset on identity change
<Form key={user.id} initialUser={user} />`,
      },
    ],
    pointers: [
      {
        label: 'keys-and-lists demo',
        path: 'src/features/keys-and-lists/KeysAndListsDemo.tsx',
        note: 'Two lists side-by-side: index key vs id key. Type, reorder, watch focus.',
      },
    ],
    demoKey: 'keys-and-lists',
    references: [
      { label: 'Rendering lists', url: 'https://react.dev/learn/rendering-lists' },
      { label: 'Preserving and resetting state', url: 'https://react.dev/learn/preserving-and-resetting-state' },
    ],
    redFlags: [
      'Uses array index as key in production lists that can change.',
      "Thinks keys are 'just for performance'.",
    ],
  },

  // =====================================================================
  // SECTION 2 — Hooks
  // =====================================================================
  {
    slug: 'rules-of-hooks',
    section: 'hooks',
    title: 'Rules of Hooks',
    tagline: 'Top-level only, components only — because React tracks hooks by call order.',
    summary:
      "Two rules: call hooks only at the top level of a function component or another hook, and only from components or custom hooks. React stores hook state in a list per component and matches them across renders by position. Conditional hook calls shift the list, swapping which state belongs to which hook — the classic 'Rendered fewer hooks than expected' error.",
    keyPoints: [
      'No hooks in conditionals, loops, or nested functions.',
      "Hooks only from function components or custom hooks (functions starting with 'use').",
      'eslint-plugin-react-hooks enforces both rules — keep it on at error level.',
      'Custom hooks compose because they inline into the host component\'s hook list.',
      'Early returns BEFORE all hook calls cause the same shift-the-list bug.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Why the rules exist',
        code: `function Profile({ id }: { id?: string }) {
  // BAD — hook order changes when id is undefined
  if (id) {
    const [tab, setTab] = useState('overview');
  }
  const [name, setName] = useState('');
  // ...

  // GOOD — hooks always at the top, branch on the value
  const [tab, setTab] = useState('overview');
  const [name, setName] = useState('');
  if (!id) return <NoProfile />;
  return <Tabs value={tab} onChange={setTab}>{/* ... */}</Tabs>;
}`,
      },
    ],
    pointers: [
      {
        label: 'rules-of-hooks demo',
        path: 'src/features/rules-of-hooks/RulesOfHooksDemo.tsx',
        note: 'Compare a buggy conditional-hooks component against a fixed version.',
      },
    ],
    demoKey: 'rules-of-hooks',
    references: [
      { label: 'Rules of Hooks', url: 'https://react.dev/reference/rules/rules-of-hooks' },
    ],
    redFlags: [
      "Calls hooks conditionally and 'it works in dev'.",
      'Disables react-hooks/rules-of-hooks lint rule.',
    ],
  },
  {
    slug: 'usestate',
    section: 'hooks',
    title: 'useState',
    tagline: 'Local state with a setter — and the batching subtlety that bites everyone once.',
    summary:
      "useState gives you a value and a setter. Setter calls inside the same event handler are batched — multiple setCount(count + 1) calls don't stack because they all see the same count snapshot. Use the function form setCount(c => c + 1) when the next state depends on the previous one. The initializer can be a function for expensive lazy initial state.",
    keyPoints: [
      'Setters are batched within an event handler / effect / promise (since React 18).',
      'setCount(c => c + 1) — functional form sees the latest queued state.',
      "Setter replaces, doesn't merge — passing a new object overwrites entirely (unlike class setState).",
      'Lazy initial state: useState(() => expensive()) — runs only on first render.',
      'Setting state to the same primitive (Object.is equality) bails out and skips re-render.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Batching + functional updates',
        code: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => {
      // BAD — both setters see count = 0, end state is 1
      setCount(count + 1);
      setCount(count + 1);
      // GOOD — functional form, end state is 2
      setCount(c => c + 1);
      setCount(c => c + 1);
    }}>{count}</button>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'usestate demo',
        path: 'src/features/usestate/UseStateDemo.tsx',
        note: 'Side-by-side: object setter vs functional. Click both, watch the difference.',
      },
    ],
    demoKey: 'usestate',
    references: [
      { label: 'useState', url: 'https://react.dev/reference/react/useState' },
    ],
    redFlags: [
      'Believes setCount(x+1) twice = +2.',
      "Doesn't know about lazy initial state.",
    ],
  },
  {
    slug: 'usereducer',
    section: 'hooks',
    title: 'useReducer',
    tagline: 'When useState calls have outgrown their welcome.',
    summary:
      'useReducer fits when state has multiple sub-fields that change together, when transitions are non-trivial, or when the next state depends on the previous state plus an action payload. The reducer is a pure function — easy to unit-test in isolation and pleasant to read versus a pile of setX calls.',
    keyPoints: [
      "Useful when 5+ useState calls relate; managing them separately leads to inconsistent intermediate states.",
      'Reducer is a pure function (state, action) => state — testable in isolation.',
      'Action types capture intent — easier to read than a wall of setX(...).',
      'Pairs naturally with Context (useContext + useReducer ≈ a tiny Redux).',
      "'When in doubt, useState' — useReducer is a refactor target.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Tiny todo reducer',
        code: `type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string };

interface Todo { id: string; text: string; done: boolean }

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':    return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case 'toggle': return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'remove': return state.filter(t => t.id !== action.id);
  }
}

function Todos() {
  const [todos, dispatch] = useReducer(reducer, []);
  // ...
}`,
      },
    ],
    pointers: [
      {
        label: 'usereducer demo',
        path: 'src/features/usereducer/UseReducerDemo.tsx',
        note: 'Add / toggle / remove todos via dispatched actions.',
      },
    ],
    demoKey: 'usereducer',
    references: [
      { label: 'useReducer', url: 'https://react.dev/reference/react/useReducer' },
    ],
    redFlags: [
      'Has never used useReducer.',
      'Manages 8+ related useState calls without reaching for it.',
    ],
  },
  {
    slug: 'useeffect',
    section: 'hooks',
    title: 'useEffect & Common Pitfalls',
    tagline: 'The hook everyone uses and the hook most people misuse.',
    summary:
      "useEffect synchronizes a component with an external system — DOM API, network, subscription. The classic pitfalls: wrong dependency arrays causing stale closures, missing cleanup leaking subscriptions, race conditions in fetches, object/array dependencies that change every render, and effects that should have been derived state. React 18+ Strict Mode runs effects twice in dev to surface these.",
    keyPoints: [
      "Mental model: 'sync with something external' — not 'componentDidUpdate'.",
      'exhaustive-deps lint rule is essential. Treat it as an error, not a warning.',
      "Always return a cleanup if you subscribed, timed, or attached anything — Strict Mode will catch you.",
      'Race conditions in fetches: AbortController, ignore-flag, or a data-fetching library.',
      'Inline objects/arrays in deps re-fire every render — memoize or destructure primitives.',
      "If the only thing the effect does is compute a value to set state, you don't need an effect.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Cleanup + abort',
        code: `useEffect(() => {
  const ac = new AbortController();
  fetch(\`/api/user/\${id}\`, { signal: ac.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => { if (e.name !== 'AbortError') throw e; });
  return () => ac.abort();
}, [id]);`,
      },
      {
        language: 'tsx',
        label: 'Effect smell — derive instead',
        code: `// BAD — derived state via effect; runs an extra render every change
const [fullName, setFullName] = useState('');
useEffect(() => { setFullName(\`\${first} \${last}\`); }, [first, last]);

// GOOD — just compute during render
const fullName = \`\${first} \${last}\`;`,
      },
    ],
    pointers: [
      {
        label: 'useeffect-cleanup demo',
        path: 'src/features/useeffect-cleanup/UseEffectCleanupDemo.tsx',
        note: 'Subscription with/without cleanup — log shows the Strict Mode double-fire.',
      },
    ],
    demoKey: 'useeffect-cleanup',
    references: [
      { label: 'useEffect', url: 'https://react.dev/reference/react/useEffect' },
      { label: 'You Might Not Need an Effect', url: 'https://react.dev/learn/you-might-not-need-an-effect' },
    ],
    redFlags: [
      "Disables exhaustive-deps because 'it triggers loops'.",
      "Treats useEffect as 'after every render' generic hook.",
      'Fetches in useEffect with no cancellation.',
    ],
  },
  {
    slug: 'usememo-usecallback',
    section: 'hooks',
    title: 'useMemo & useCallback',
    tagline: "Narrow use cases, often misapplied — memoization isn't free.",
    summary:
      "Both take a dependency array and recompute only when deps change. Legitimate uses: genuinely expensive computation; referential stability for memoized children or effect deps; custom hooks returning stable references. Cost: the dependency comparison itself isn't free, every memoized value adds review burden, and most components re-render fine without it. The React Compiler aims to make manual memoization mostly obsolete.",
    keyPoints: [
      'useMemo memoizes a value; useCallback memoizes a function.',
      'useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).',
      'Memoization helps only if the component is re-rendering when its props could have been equal.',
      "Wrapping everything is harmful — comparison cost, cognitive cost, no measurable wins.",
      'The React Compiler (formerly Forget) auto-memoizes correctly when enabled.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'When useMemo earns its keep',
        code: `function Search({ query, items }: { query: string; items: Item[] }) {
  // items[] can be 10k; filter is real work
  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );
  return <List items={filtered} />;
}`,
      },
      {
        language: 'tsx',
        label: 'Stable callback for a memoized child',
        code: `const onSave = useCallback((next: string) => save(id, next), [id]);
return <ExpensiveChild onSave={onSave} />;`,
      },
    ],
    pointers: [
      {
        label: 'usememo-usecallback demo',
        path: 'src/features/usememo-usecallback/UseMemoUseCallbackDemo.tsx',
        note: 'Heavy filter with vs. without useMemo. Render counter shows the difference.',
      },
    ],
    demoKey: 'usememo-usecallback',
    references: [
      { label: 'useMemo', url: 'https://react.dev/reference/react/useMemo' },
      { label: 'useCallback', url: 'https://react.dev/reference/react/useCallback' },
    ],
    redFlags: [
      'Wraps everything in useMemo/useCallback by default.',
      'Has never used them and cannot say when they would help.',
    ],
  },
  {
    slug: 'custom-hooks',
    section: 'hooks',
    title: 'Custom Hooks',
    tagline: 'The modern way to share logic between components.',
    summary:
      "A custom hook is a function whose name starts with 'use' that calls other hooks. It's the modern replacement for HOCs and render props as a code-reuse mechanism. The naming convention is how the linter identifies hook-rule-following functions. Hooks share logic, not state — each call site gets its own state.",
    keyPoints: [
      "Must start with 'use' — linter + React rely on it.",
      'Composes other hooks freely.',
      'Each component calling the hook gets its own state — hooks share logic, not state.',
      'Common patterns: useDebouncedValue, useLocalStorage, useMediaQuery, useDisclosure, useFetch.',
      "'Extract a custom hook' is the React equivalent of 'extract a class' — primary refactoring step.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'useDebouncedValue',
        code: `import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function Search() {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 250);
  // \`debounced\` is what you use for the API call
}`,
      },
    ],
    pointers: [
      {
        label: 'custom-hook demo',
        path: 'src/features/custom-hook/CustomHookDemo.tsx',
        note: 'Type into a search box — useDebouncedValue throttles the API hits.',
      },
    ],
    demoKey: 'custom-hook',
    references: [
      { label: 'Reusing logic with custom hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
    ],
    redFlags: [
      'Has never written one.',
      "Describes 'custom hooks' that don't call any hooks and could be plain functions.",
    ],
  },
  {
    slug: 'useref',
    section: 'hooks',
    title: 'useRef',
    tagline: 'A mutable box that survives renders and never triggers one.',
    summary:
      "useRef returns a stable object with a .current property. Two main uses: accessing DOM nodes (pass the ref to a JSX element), and storing mutable values that should not trigger re-renders (timer IDs, previous values, instance variables). State changes re-render; ref changes don't. Don't read or write refs during render — that's a render side effect.",
    keyPoints: [
      'Stable identity across renders — safe to put in deps arrays.',
      "Mutating .current does not re-render. It's an 'escape hatch' from declarative React.",
      "DOM access: <input ref={inputRef} /> then inputRef.current.focus().",
      "In React 19, ref can be a regular prop on function components — no forwardRef needed for new code.",
      "Heavy reliance on useRef is sometimes a sign you're fighting React's declarative model.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'DOM ref + value ref',
        code: `function Auto() {
  // DOM ref
  const inputRef = useRef<HTMLInputElement>(null);

  // Value ref (no re-render on change)
  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <input ref={inputRef} />
      <span>Rendered {renderCount.current} time(s)</span>
    </>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'useref demo',
        path: 'src/features/useref/UseRefDemo.tsx',
        note: 'DOM focus + render-count ref side-by-side.',
      },
    ],
    demoKey: 'useref',
    version: 'React 19',
    references: [
      { label: 'useRef', url: 'https://react.dev/reference/react/useRef' },
      { label: 'ref as a prop (React 19)', url: 'https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop' },
    ],
    redFlags: [
      'Only knows the DOM-access use case.',
      'Mutates refs during render.',
    ],
  },

  // =====================================================================
  // SECTION 3 — State Management
  // =====================================================================
  {
    slug: 'state-colocation',
    section: 'state',
    title: 'Where Should State Live?',
    tagline: 'Local → Lifted → Context → Global → Server-state → URL. In that order.',
    summary:
      "A decision tree. Start with local state. Lift only when siblings need to share. Reach for Context for ambient values like theme/user that don't change often. Reach for a global store (Zustand/Jotai/Redux) when state is shared widely AND changes frequently AND needs fine-grained subscription. Use a server-state library for data that lives on the server. Use the URL for state that should be shareable / refresh-survive / back-button-navigable.",
    keyPoints: [
      'Local first. Lift only when siblings need it.',
      'Prop drilling 1–3 levels is fine; 5+ is the smell.',
      'Context: ambient, low-frequency change (theme, user, locale, feature flags).',
      'Global store: shared + frequent + selector subscription. Otherwise Context is enough.',
      "Server state ≠ client state — use TanStack Query / RTK Query / SWR for data that lives on the server.",
      'URL state: filters, current page, modal open, selected item. Bookmarkable.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Decision sketch',
        code: `// Local — one component cares
const [open, setOpen] = useState(false);

// Lifted — two siblings care
function Page() {
  const [filter, setFilter] = useState('');
  return (
    <>
      <Filters value={filter} onChange={setFilter} />
      <Results filter={filter} />
    </>
  );
}

// Context — ambient, low-frequency
<ThemeContext value={{ mode, toggle }}>{children}</ThemeContext>

// Server state
const { data } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });

// URL state
const [params, setParams] = useSearchParams();`,
      },
    ],
    pointers: [
      {
        label: 'state-colocation demo',
        path: 'src/features/state-colocation/StateColocationDemo.tsx',
        note: 'Same UI built three ways — local, lifted, context — with render-count overlays.',
      },
    ],
    demoKey: 'state-colocation',
    references: [
      { label: 'Choosing the state structure', url: 'https://react.dev/learn/choosing-the-state-structure' },
      { label: 'Sharing state between components', url: 'https://react.dev/learn/sharing-state-between-components' },
    ],
    redFlags: [
      `'Just put it in Redux'.`,
      "Doesn't know server-state libraries exist.",
      'No URL-state awareness for shareable views.',
    ],
  },
  {
    slug: 'context-api',
    section: 'state',
    title: 'Context API & Its Limits',
    tagline: 'Powerful for ambient values — terrible for high-frequency state.',
    summary:
      "Context passes values through the tree without prop-drilling. The catch: every consumer re-renders when the value changes. No selector pattern — you get the whole value. Splitting context to mitigate gets awkward. And default values are sneaky — a consumer rendered outside a Provider silently gets the default. Stops being right when state is updated frequently and consumed widely.",
    keyPoints: [
      'Every consumer re-renders on value change — no selectors.',
      "If you pass a new object as the value every render, every consumer re-renders every render.",
      'Split by update frequency: separate Providers for theme, user, route, etc.',
      'Default values are silent — a missing Provider gives you the default, not an error.',
      "When you want selectors: Zustand, Jotai, Redux + useSelector, or `use-context-selector`.",
      'React 19: <Context value={…}> works without .Provider.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Stable Provider value',
        code: `// BAD — new object every render, every consumer re-renders
<ThemeContext.Provider value={{ mode, toggle: () => setMode(m => m === 'light' ? 'dark' : 'light') }}>

// GOOD — memoize the value
const value = useMemo(
  () => ({ mode, toggle: () => setMode(m => m === 'light' ? 'dark' : 'light') }),
  [mode],
);
<ThemeContext.Provider value={value}>`,
      },
    ],
    pointers: [
      {
        label: 'context-api demo',
        path: 'src/features/context-api/ContextApiDemo.tsx',
        note: 'Theme + deeply nested consumer; toggle and watch what re-renders.',
      },
    ],
    demoKey: 'context-api',
    references: [
      { label: 'useContext', url: 'https://react.dev/reference/react/useContext' },
      { label: 'Passing data deeply with context', url: 'https://react.dev/learn/passing-data-deeply-with-context' },
    ],
    redFlags: [
      'Puts all app state in one Context.',
      "Doesn't know about the re-render-all-consumers behavior.",
    ],
  },
  {
    slug: 'redux-and-modern-state',
    section: 'state',
    title: 'Redux, Sagas & Modern Alternatives',
    tagline: 'The state-management landscape, 2018 vs 2024.',
    summary:
      "Redux is a single-store, reducer/action state container. Pure Redux is sync; for async you add middleware: redux-thunk (functions as actions, simple) or redux-saga (generators + effect model, powerful for complex orchestration, heavy learning curve). Modern alternatives — Redux Toolkit (the official 'modern Redux'), Zustand (minimal hooks-store), Jotai (atomic state), and server-state libraries (TanStack/RTK Query, SWR) — together cover what 80% of apps used to use Redux for.",
    keyPoints: [
      'Redux Toolkit (RTK) is the recommended way to use Redux today — drops the boilerplate.',
      "Zustand: tiny, hook-based, selectors built in. Default greenfield client-state choice for small/medium apps.",
      'Jotai: atomic state — pieces composed into derived atoms. Good when state has many independent parts.',
      "Server state isn't 'state' in the Redux sense — use TanStack Query / RTK Query / SWR. Don't put server data in Redux.",
      'redux-saga still earns its keep for complex orchestration (debounce, race, fork) — but is overkill for simple data fetching.',
      "'Should I use Redux?' is now a real question. Many apps don't need it.",
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Zustand — minimal client store',
        code: `import { create } from 'zustand';

interface Store {
  count: number;
  inc: () => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

// in a component — selector subscribes only to the slice you read
function Counter() {
  const count = useStore((s) => s.count);
  const inc = useStore((s) => s.inc);
  return <button onClick={inc}>{count}</button>;
}`,
      },
      {
        language: 'typescript',
        label: 'Redux Toolkit slice',
        code: `import { createSlice, configureStore } from '@reduxjs/toolkit';

const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    inc: (s) => s + 1,
    add: (s, action: { payload: number }) => s + action.payload,
  },
});

export const store = configureStore({ reducer: { counter: counter.reducer } });
export const { inc, add } = counter.actions;`,
      },
    ],
    pointers: [
      {
        label: 'feature.model.ts',
        path: 'src/core/features/feature.model.ts',
        note: 'This app keeps state purely local — no global store needed.',
      },
    ],
    references: [
      { label: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' },
      { label: 'Zustand', url: 'https://zustand-demo.pmnd.rs/' },
      { label: 'Jotai', url: 'https://jotai.org/' },
    ],
    redFlags: [
      'Recommends raw Redux + thunk for greenfield projects without considering RTK.',
      "Doesn't know about server-state libraries.",
      'Has only used Redux and is unaware of Zustand/Jotai.',
    ],
  },
  {
    slug: 'data-fetching',
    section: 'state',
    title: 'Data Fetching',
    tagline: 'Server-state libraries replace the useEffect-fetch-useState dance.',
    summary:
      "Default in 2024+: a server-state library — TanStack Query, RTK Query, or SWR. The pattern: useQuery returns { data, isLoading, error }, handles caching, deduplication, background refetch, stale-while-revalidate, and integrates with mutations for invalidation. Manual useEffect + useState fetching has well-known failure modes: race conditions, no dedup, no cache, no background refresh.",
    keyPoints: [
      'useQuery({ queryKey, queryFn }) — caching + dedup + background refetch for free.',
      'Mutations invalidate queries (queryClient.invalidateQueries) to keep data fresh.',
      'React 19 + Suspense — set { suspense: true } and components read data synchronously; loading is handled by <Suspense fallback>.',
      'For one-off cases or pre-library setup, manual fetch with AbortController is fine — but anything user-facing should use the library.',
      "RSC (Next.js App Router) shifts data-fetching to the server entirely for non-interactive parts.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'TanStack Query basics',
        code: `import { useQuery } from '@tanstack/react-query';

function Orders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetch('/api/orders').then(r => r.json()),
    staleTime: 60_000,
  });
  if (isLoading) return <Spinner />;
  if (error) return <ErrorPanel error={error} />;
  return <OrderList orders={data} />;
}`,
      },
      {
        language: 'tsx',
        label: 'React 19: use() + Suspense',
        code: `import { use, Suspense } from 'react';

function User({ promise }: { promise: Promise<User> }) {
  const user = use(promise); // suspends until the promise resolves
  return <h1>{user.name}</h1>;
}

<Suspense fallback={<Spinner />}>
  <User promise={fetchUser(id)} />
</Suspense>`,
      },
    ],
    pointers: [
      {
        label: 'data-fetching demo',
        path: 'src/features/data-fetching/DataFetchingDemo.tsx',
        note: 'Mocked fetch with race-condition reproduction + AbortController fix.',
      },
    ],
    demoKey: 'data-fetching',
    references: [
      { label: 'TanStack Query', url: 'https://tanstack.com/query/latest' },
      { label: 'use() reference', url: 'https://react.dev/reference/react/use' },
    ],
    redFlags: [
      "Default answer is 'useEffect + fetch + useState'.",
      "Doesn't know about server-state libraries.",
      'No mention of caching or deduplication.',
    ],
  },
  {
    slug: 'forms',
    section: 'state',
    title: 'Forms',
    tagline: 'useState-per-field for trivial forms, React Hook Form for everything else.',
    summary:
      "For 1–3 field forms, useState per field is fine. As forms grow — many fields, dynamic field arrays, async validation, schema enforcement — the problems pile up: validation spreads across handlers, every keystroke re-renders the form, validation timing inconsistent, error-message threading, accessibility gaps. React Hook Form is the de-facto modern choice: uncontrolled inputs + refs, no per-keystroke re-render of the form root, schema integration via Zod.",
    keyPoints: [
      'Trivial forms — useState per field is fine.',
      'React Hook Form: uncontrolled inputs, near-zero re-render cost, Zod integration.',
      'Formik: older, controlled-input model, slower for large forms.',
      'Schema validation (Zod / Yup) gives you both runtime validation AND TS types from one definition.',
      'React 19: <form action={fn}>, useActionState, useFormStatus — built-in form Actions.',
      "Wizards / multi-step forms: use a reducer or a state machine (XState), not a form library.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'React Hook Form + Zod',
        code: `import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type Form = z.infer<typeof schema>;

function Login() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<Form>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((data) => login(data))}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <input type="password" {...register('password')} />
      <button type="submit">Sign in</button>
    </form>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'forms-rhf demo',
        path: 'src/features/forms-rhf/FormsRhfDemo.tsx',
        note: 'Typed form with required, format and length validation. No re-render on keystroke.',
      },
    ],
    demoKey: 'forms-rhf',
    references: [
      { label: 'React Hook Form', url: 'https://react-hook-form.com/' },
      { label: 'React 19 Actions', url: 'https://react.dev/blog/2024/12/05/react-19#actions' },
    ],
    redFlags: [
      'Uses useState-per-field for everything.',
      "Doesn't know schema validation libraries.",
    ],
  },
  {
    slug: 'error-handling',
    section: 'state',
    title: 'Error Handling',
    tagline: 'Error Boundaries catch render errors. Everything else is layered handling.',
    summary:
      "Multiple layers: Error Boundaries catch render-time errors (still need a class component or react-error-boundary). Async errors — handlers, promises, timers — don't hit boundaries. Form/domain errors are state, displayed inline. Network errors come from the data-fetching library's error state. Global error reporting (Sentry / Datadog) catches what slips through. Place boundaries strategically: too coarse and everything dies; too fine is noisy.",
    keyPoints: [
      "Error Boundaries catch errors thrown during render. Place them at major-route or feature boundaries.",
      "Async errors (handlers, promises, setTimeout) do NOT bubble to boundaries — handle locally.",
      'Form/validation errors are state, not exceptions — render them inline.',
      'Network errors come from the data-fetching library (TanStack Query exposes them as state).',
      'Wire global reporters (Sentry, Datadog) for both window errors and componentDidCatch.',
      'React 19 has react-error-boundary as the de facto package — class-component boilerplate stays the same.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Class-based Error Boundary',
        code: `class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: (e: Error, reset: () => void) => React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // sendToSentry(error, info);
  }
  reset = () => this.setState({ error: null });
  render() {
    return this.state.error
      ? this.props.fallback(this.state.error, this.reset)
      : this.props.children;
  }
}`,
      },
    ],
    pointers: [
      {
        label: 'error-boundary demo',
        path: 'src/features/error-boundary/ErrorBoundaryDemo.tsx',
        note: 'A child throws; the boundary catches and shows a fallback with retry.',
      },
    ],
    demoKey: 'error-boundary',
    references: [
      { label: 'Error boundaries', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' },
      { label: 'react-error-boundary', url: 'https://github.com/bvaughn/react-error-boundary' },
    ],
    redFlags: [
      'No error boundaries at all.',
      'One boundary at root — first error kills the whole app.',
      "Doesn't know async errors aren't caught by boundaries.",
    ],
  },

  // =====================================================================
  // SECTION 4 — Architecture & Code Organization
  // =====================================================================
  {
    slug: 'folder-structure',
    section: 'architecture',
    title: 'Folder Structure',
    tagline: 'By-feature, not by-type — once the app is non-trivial.',
    summary:
      "Two main approaches: by type (src/components, src/hooks, src/services — junior-default, painful at scale) and by feature (src/features/orders/ with its own components, hooks, queries — preferred). The rule of thumb: adding a feature should be adding a folder; deleting a feature should be deleting a folder. Cross-feature coupling becomes visible in import statements.",
    keyPoints: [
      "By-feature: src/features/<name>/ with components, hooks, queries, store slice, tests.",
      "Shared primitives in src/shared/. Features can import from shared, not from each other.",
      'index.ts as a public API per feature codifies the boundary.',
      "Atomic Design is popular but often over-engineered for product apps — boundaries are blurry.",
      'Path aliases (@/...) save you from the ../../../ tax in any non-tiny app.',
      'Move is cheap — iterate. Day-one over-design is wasted effort.',
    ],
    snippets: [
      {
        language: 'bash',
        label: 'A feature-based src/',
        code: `src/
  core/
    features/       # data + types shared across the app
    theme.ts
  shared/
    CodeBlock.tsx
    FeaturePage.tsx
    FeatureTasks.tsx
  features/
    usestate/
      UseStateDemo.tsx
    keys-and-lists/
      KeysAndListsDemo.tsx
    forms-rhf/
      FormsRhfDemo.tsx
  pages/
    Home.tsx
    NotFound.tsx
  App.tsx
  main.tsx`,
      },
    ],
    pointers: [
      {
        label: 'src/',
        path: 'src/',
        note: 'This project is feature-based — see core/ shared/ features/ pages/.',
      },
    ],
    demoKey: 'folder-structure',
    references: [
      { label: 'Thinking in React', url: 'https://react.dev/learn/thinking-in-react' },
    ],
    redFlags: [
      `No opinion at all.`,
      `Rigid 'must be Atomic Design'.`,
      `'Put everything in components/'.`,
    ],
  },
  {
    slug: 'code-reuse',
    section: 'architecture',
    title: 'Code Reuse: HOCs, Render Props, Hooks',
    tagline: 'Three patterns, three eras — hooks win for most code reuse today.',
    summary:
      "HOCs (functions component → component) were the pre-hooks default. Render props (component takes a function child) gave more flexibility but verbose JSX. Custom hooks are the modern choice — compose freely, no wrapper components, easy to type, fits the rest of React. HOCs and render props still earn their keep occasionally (component-level wrapping, library back-compat), but hooks should be the default.",
    keyPoints: [
      'HOCs: withAuth(Component) — pre-hooks pattern. Wrapper hell in DevTools, prop collisions.',
      'Render props: <Mouse>{({ x, y }) => <X/>}</Mouse> — flexible but indented JSX.',
      'Custom hooks: const { x, y } = useMouse() — modern default, no wrapper components.',
      "HOCs aren't strictly weaker — they CAN wrap rendering, hooks cannot return JSX.",
      'Compound components (Tabs / Tab.List / Tab.Panel) complement hooks for layout primitives.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Same idea, three styles',
        code: `// HOC
const withMouse = (Comp) => (props) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
    <Comp {...props} mouse={pos} />
  </div>;
};

// Render prop
function Mouse({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
    {children(pos)}
  </div>;
}

// Custom hook (modern)
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return pos;
}`,
      },
    ],
    pointers: [
      {
        label: 'code-reuse demo',
        path: 'src/features/code-reuse/CodeReuseDemo.tsx',
        note: 'Three implementations of the same behavior — pick the one that wins.',
      },
    ],
    demoKey: 'code-reuse',
    references: [
      { label: 'Reusing logic with custom hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
    ],
    redFlags: [
      'Still defaults to HOCs in new code.',
      "Doesn't know what render props are.",
      'Thinks hooks replaced everything (compound components still apply).',
    ],
  },
  {
    slug: 'smart-vs-presentational',
    section: 'architecture',
    title: 'Smart vs Presentational',
    tagline: 'A 2015 pattern softened by hooks — but the principle still applies.',
    summary:
      "The original split (Dan Abramov, 2015): presentational components are props-in / JSX-out, no state or fetching; containers manage state/data and render presentational pieces. With hooks, the same separation is achieved by extracting data + state into custom hooks. The formal split is loose in modern apps but the principle holds: pure UI components in /shared shouldn't fetch data.",
    keyPoints: [
      'Original split predates hooks. Strict containers/presentational structure is no longer common.',
      'Design-system / /shared components stay presentational — that constraint is real.',
      'Hooks naturally achieve the separation: data hook + pure UI component.',
      'RSC formalizes the split at the framework level (server components for data, client for interactivity).',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Container hook + presentational component',
        code: `// Hook = container: owns data + state
function useOrders() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
  const [filter, setFilter] = useState('');
  return { orders: data ?? [], isLoading, filter, setFilter };
}

// Component = presentational: props in, JSX out
function OrderTable({ orders, filter }: { orders: Order[]; filter: string }) {
  const filtered = orders.filter(o => o.id.includes(filter));
  return <table>{/* ... */}</table>;
}

// Page glues them together
function OrdersPage() {
  const { orders, isLoading, filter, setFilter } = useOrders();
  if (isLoading) return <Spinner />;
  return (
    <>
      <SearchBar value={filter} onChange={setFilter} />
      <OrderTable orders={orders} filter={filter} />
    </>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'smart-vs-presentational demo',
        path: 'src/features/smart-vs-presentational/SmartVsPresentationalDemo.tsx',
        note: 'A pure list component reused by two different containers.',
      },
    ],
    demoKey: 'smart-vs-presentational',
    references: [
      { label: 'Presentational and container components (historical)', url: 'https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0' },
    ],
    redFlags: [
      'Has never heard of the pattern.',
      'Rigidly enforces it in modern code, creating awkward splits.',
    ],
  },
  {
    slug: 'component-splitting',
    section: 'architecture',
    title: 'When to Split a Component',
    tagline: "Smells, not rules — split when there's friction, not before.",
    summary:
      "Smells of a too-large component: long render (200+ lines mixing concerns), many unrelated hooks (8+ useState/useEffect), multiple distinct interactions in one place, hard to name, hard to test, requirements forcing flag props that toggle internal behavior. Refactoring moves: extract a custom hook (first), extract a sub-component, extract by feature, composition over flags.",
    keyPoints: [
      'Long renders + many unrelated hooks = the loudest smell.',
      "Flag props that toggle internal behavior — usually two components in a trench coat.",
      'Hard to name = unclear single responsibility = split.',
      "First refactor move: extract a custom hook for related state/effects/handlers.",
      'Premature splits create prop-drilling and ceremony without value.',
      `'Split when you feel friction, not before' beats hard rules.`,
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Flag-prop smell → split',
        code: `// SMELL — variant toggles behavior, not appearance
<List variant="compact" sortable selectable onSelect={fn} />

// BETTER — composition; smaller composable parts
<List>
  <List.SortableHeader />
  {items.map(i => <List.SelectableRow key={i.id} item={i} onSelect={fn} />)}
</List>`,
      },
    ],
    pointers: [
      {
        label: 'component-splitting demo',
        path: 'src/features/component-splitting/ComponentSplittingDemo.tsx',
        note: 'Side-by-side: monolith vs split-with-custom-hook.',
      },
    ],
    demoKey: 'component-splitting',
    references: [
      { label: 'Thinking in React', url: 'https://react.dev/learn/thinking-in-react' },
    ],
    redFlags: [
      "'Always <100 lines' rule with no rationale.",
      "Never splits and ships 1000-line components.",
    ],
  },
  {
    slug: 'styling',
    section: 'architecture',
    title: 'Styling Approaches',
    tagline: 'Tailwind, CSS Modules, CSS-in-JS — same trade-offs as the rest of the ecosystem.',
    summary:
      "Plain CSS (global, collisions). CSS Modules (auto-scoped class names — good default for plain-CSS workflows). CSS-in-JS like styled-components/Emotion (co-located, dynamic, but runtime cost; awkward with RSC). Tailwind utility-first (dominant in modern apps — strong design-system enforcement, build-time only). Zero-runtime CSS-in-JS (vanilla-extract, Panda). Inline styles only for dynamic values.",
    keyPoints: [
      'CSS Modules: scoped classes, zero runtime — good default for plain-CSS shops.',
      'Tailwind: utility classes, strong design-system enforcement, build-time only — the dominant modern choice.',
      'styled-components / Emotion: co-located, dynamic, runtime cost — awkward with Server Components.',
      'Zero-runtime CSS-in-JS (vanilla-extract, linaria, Panda): co-located but build-time extraction.',
      "Inline style={{}}: only for genuinely dynamic values — no media queries, no pseudo-classes.",
      "Decision factors: RSC compatibility, design-system maturity, team familiarity, bundle weight.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'CSS Modules vs Tailwind vs CSS-in-JS',
        code: `// CSS Modules
import styles from './Button.module.css';
<button className={styles.btn}>Save</button>

// Tailwind
<button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>

// styled-components (runtime CSS-in-JS)
const Btn = styled.button\`
  padding: .5rem 1rem;
  background: \${p => p.theme.primary};
\`;
<Btn theme={theme}>Save</Btn>`,
      },
    ],
    pointers: [
      {
        label: 'styling demo',
        path: 'src/features/styling/StylingDemo.tsx',
        note: 'Same button styled four ways — pick the one that fits your team.',
      },
    ],
    demoKey: 'styling',
    references: [
      { label: 'Vite + CSS Modules', url: 'https://vitejs.dev/guide/features.html#css-modules' },
      { label: 'Tailwind', url: 'https://tailwindcss.com/' },
    ],
    redFlags: [
      'Hardcodes inline styles everywhere.',
      'Has not heard of Tailwind.',
      `Dismisses Tailwind as 'just inline styles in disguise'.`,
    ],
  },

  // =====================================================================
  // SECTION 5 — Performance & Rendering
  // =====================================================================
  {
    slug: 'reconciliation',
    section: 'performance',
    title: 'Reconciliation & Diffing',
    tagline: "How React keeps DOM in sync without doing O(n³) work.",
    summary:
      "On every render the component produces a new element tree. The reconciler compares it to the previous tree and emits the minimal DOM operations. Heuristics make it O(n): different element types at the same position tear down + rebuild; same type keeps the DOM node and updates changed props; lists diff by key. React 18+ added Fiber's interruptible rendering (concurrent rendering) so urgent updates (typing) preempt non-urgent ones (data).",
    keyPoints: [
      'Different element types at the same position → tear down the subtree.',
      'Same type, different props → keep the DOM node, update changed attributes.',
      'Lists diff by KEY, not position — that is why keys matter.',
      'Component instances persist as long as their position + type match.',
      "Fiber (React 16) made rendering interruptible — foundation for concurrent features.",
      "Reconciliation is rarely the bottleneck. Component work usually is.",
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Same type vs different type',
        code: `// Same component type at same position — state preserved
{open ? <Modal>{children}</Modal> : <Modal style={{ display: 'none' }}>{children}</Modal>}

// Different element type — full unmount + remount of subtree
{open ? <Modal>{children}</Modal> : <div>{children}</div>}`,
      },
    ],
    pointers: [
      {
        label: 'reconciliation-keys demo',
        path: 'src/features/reconciliation-keys/ReconciliationKeysDemo.tsx',
        note: 'Two trees, before/after — see what is preserved vs unmounted.',
      },
    ],
    demoKey: 'reconciliation-keys',
    references: [
      { label: 'Reconciliation', url: 'https://legacy.reactjs.org/docs/reconciliation.html' },
    ],
    redFlags: [
      "'Virtual DOM is fast because it diffs' with no model.",
      "Does not know list diffing happens by key.",
    ],
  },
  {
    slug: 'memo-misuse',
    section: 'performance',
    title: 'React.memo — Not Free',
    tagline: 'Per-render shallow compare cost, defeated by inline props.',
    summary:
      "React.memo wraps a component to skip re-renders when props are shallow-equal. It is not free — the comparison runs on every render. memo only helps if the parent passes equal props yet still re-renders. If props change every render anyway (inline objects, inline functions, new arrays), memo does the work and re-renders anyway — pure overhead. The React Compiler aims to make manual memoization mostly obsolete.",
    keyPoints: [
      'Shallow compare cost runs on every render whether memo bails out or not.',
      'Inline objects/arrays/functions defeat memo — use useCallback / useMemo to stabilize.',
      "memo + stabilized props cascades the discipline upward — every parent has to play.",
      'Most components do not need memoization. Re-render is cheap when render work is small.',
      'Better wins: move state down, pass children as a prop (children are stable), virtualize lists.',
      'React Compiler auto-memoizes correctly when enabled — manual memo loses relevance.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'memo only helps with stable props',
        code: `const Row = React.memo(function Row({ item, onSelect }: Props) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }: { items: Item[] }) {
  const [, setN] = useState(0);
  // BAD — new function every render, memo never bails
  return items.map(i => <Row key={i.id} item={i} onSelect={(id) => log(id)} />);

  // GOOD — stable callback
  const onSelect = useCallback((id: string) => log(id), []);
  return items.map(i => <Row key={i.id} item={i} onSelect={onSelect} />);
}`,
      },
    ],
    pointers: [
      {
        label: 'memo-misuse demo',
        path: 'src/features/memo-misuse/MemoMisuseDemo.tsx',
        note: 'Render-count display — toggle memo, toggle stable callback, see the matrix.',
      },
    ],
    demoKey: 'memo-misuse',
    references: [
      { label: 'memo', url: 'https://react.dev/reference/react/memo' },
      { label: 'React Compiler', url: 'https://react.dev/learn/react-compiler' },
    ],
    redFlags: [
      "'Wrap everything in memo for free perf'.",
      "Recommends memo without checking parent prop stability.",
    ],
  },
  {
    slug: 'long-lists',
    section: 'performance',
    title: 'Rendering Very Long Lists',
    tagline: '10k DOM nodes is slow. Virtualize, paginate, or both.',
    summary:
      "Naive rendering of 10k+ items kills performance — mount time, scroll perf, state-change re-render. Three solutions: pagination (50 at a time), infinite scroll (load on scroll — combine with virtualization or DOM still grows), and virtualization (windowing) — only render items in the viewport. Libraries: react-window (lightweight), TanStack Virtual (framework-agnostic), react-virtuoso.",
    keyPoints: [
      'Pagination — simplest, fits most browsing UIs.',
      'Infinite scroll WITHOUT virtualization still grows the DOM indefinitely.',
      'Virtualization keeps the DOM at ~50–100 nodes regardless of list size.',
      'Variable-height rows, grids, drag-and-drop — libraries handle them but with extra complexity.',
      'Memoize row components — prevents re-rendering items that didn\'t change.',
      'Accessibility: virtualized rows are not in the DOM — make sure the lib handles aria-rowcount.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'react-window basics',
        code: `import { List } from 'react-window';

function BigList({ items }: { items: Item[] }) {
  return (
    <List
      rowCount={items.length}
      rowHeight={36}
      rowProps={{ items }}
      rowComponent={Row}
      defaultHeight={400}
    />
  );
}

function Row({ index, style, items }: { index: number; style: React.CSSProperties; items: Item[] }) {
  return <div style={style}>{items[index].name}</div>;
}`,
      },
    ],
    pointers: [
      {
        label: 'virtualized-list demo',
        path: 'src/features/virtualized-list/VirtualizedListDemo.tsx',
        note: '10k-row list with react-window — scroll smoothly with 100-ish nodes in the DOM.',
      },
    ],
    demoKey: 'virtualized-list',
    references: [
      { label: 'react-window', url: 'https://github.com/bvaughn/react-window' },
      { label: 'TanStack Virtual', url: 'https://tanstack.com/virtual/latest' },
    ],
    redFlags: [
      'Has never used a virtualization library.',
      `Suggests 'just CSS overflow:scroll' for 10k items.`,
    ],
  },
  {
    slug: 'suspense',
    section: 'performance',
    title: 'Suspense & the use() Hook',
    tagline: 'Declarative loading states — let the boundary handle the spinner.',
    summary:
      "Suspense wraps a subtree and shows a fallback while anything inside is suspending. A component suspends by throwing a Promise (or by calling use(promise)). The component pretends data is synchronous; the boundary handles loading. Pairs with Error Boundaries for the fail path and with useTransition/useDeferredValue to avoid fallback flicker on quick state changes.",
    keyPoints: [
      "Suspense is the loading primitive. Wrap your tree once, components read data synchronously.",
      'use(promise) — React 19 hook that consumes a promise inside a Suspense boundary.',
      'React.lazy() suspends for code-split components — the original Suspense use case.',
      'Combines with <ErrorBoundary> — loading + error are recovery boundaries in the tree.',
      'startTransition / useTransition — fast updates skip the fallback if they finish quickly.',
      'Data-fetching libraries opt in: TanStack Query has { suspense: true }.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'use() + Suspense',
        code: `import { Suspense, use } from 'react';

function UserCard({ promise }: { promise: Promise<User> }) {
  const user = use(promise);   // suspends until resolved
  return <h2>{user.name}</h2>;
}

function Page() {
  const promise = useMemo(() => fetchUser(id), [id]);
  return (
    <ErrorBoundary fallback={<p>Failed to load.</p>}>
      <Suspense fallback={<Spinner />}>
        <UserCard promise={promise} />
      </Suspense>
    </ErrorBoundary>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'suspense-use-hook demo',
        path: 'src/features/suspense-use-hook/SuspenseUseHookDemo.tsx',
        note: 'A component calling use(promise) inside a Suspense fallback.',
      },
    ],
    demoKey: 'suspense-use-hook',
    version: 'React 19',
    references: [
      { label: 'Suspense', url: 'https://react.dev/reference/react/Suspense' },
      { label: 'use', url: 'https://react.dev/reference/react/use' },
    ],
    redFlags: [
      'Only knows React.lazy use case.',
      `Thinks Suspense is 'just a spinner wrapper'.`,
    ],
  },
  {
    slug: 'concurrent-transitions',
    section: 'performance',
    title: 'useTransition & useDeferredValue',
    tagline: 'Keep the input responsive while a heavy list re-renders in the background.',
    summary:
      "Concurrent rendering lets React mark updates as non-urgent — the urgent ones (typing, clicks) preempt them. useTransition wraps the state update at the source; useDeferredValue defers the value at the consumer. Both prevent a heavy downstream render from blocking the input. Useful for filter/search over big lists, expensive visualizations, route transitions.",
    keyPoints: [
      'useTransition: const [isPending, startTransition] = useTransition(); wrap the slow update.',
      'useDeferredValue: const deferred = useDeferredValue(value); consumer side, similar effect.',
      'Urgent updates (the typed character) render immediately; the heavy work renders in the next tick.',
      'isPending lets you show a subtle loading indicator without yanking the UI.',
      'Pairs naturally with Suspense — transitions skip the fallback when they finish quickly.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'useTransition for a heavy filter',
        code: `function Filter() {
  const [query, setQuery] = useState('');
  const [list, setList] = useState<Item[]>(INITIAL);
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);                  // urgent — input updates immediately
    startTransition(() => {           // non-urgent — heavy filter
      setList(BIG_LIST.filter(i => i.name.includes(next)));
    });
  };

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <span>updating…</span>}
      <List items={list} />
    </>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'usetransition demo',
        path: 'src/features/usetransition/UseTransitionDemo.tsx',
        note: 'Type quickly into the input — heavy list lags but input stays buttery.',
      },
    ],
    demoKey: 'usetransition',
    references: [
      { label: 'useTransition', url: 'https://react.dev/reference/react/useTransition' },
      { label: 'useDeferredValue', url: 'https://react.dev/reference/react/useDeferredValue' },
    ],
    redFlags: [
      "Doesn't know transitions exist.",
      'Recommends throttling/debouncing input instead of using transitions.',
    ],
  },
  {
    slug: 'form-actions',
    section: 'performance',
    title: 'React 19 Form Actions',
    tagline: 'useActionState, useFormStatus, useOptimistic — the new form story.',
    summary:
      "React 19 added a built-in form story: the action prop on <form>, useActionState for action + state pairing, useFormStatus for child components to read the parent form's pending state, and useOptimistic for instant UI updates that roll back on failure. Replaces the old useState + onSubmit + isLoading pattern for many forms.",
    keyPoints: [
      "<form action={fn}> — pass a function directly; React handles submit + pending state.",
      "useActionState(action, initial) → [state, dispatchAction, isPending] — the form result.",
      "useFormStatus() — any child of <form> can read { pending } and disable itself.",
      'useOptimistic(state, reducer) — set a temporary optimistic value while the action runs.',
      'Composes with Suspense / Error Boundary for the loading / error surfaces.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'useActionState + useFormStatus',
        code: `import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

async function login(_prev: string | null, fd: FormData): Promise<string | null> {
  const res = await fetch('/login', { method: 'POST', body: fd });
  return res.ok ? null : 'Invalid credentials';
}

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>;
}

function LoginForm() {
  const [error, action] = useActionState(login, null);
  return (
    <form action={action}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {error && <p role="alert">{error}</p>}
      <Submit />
    </form>
  );
}`,
      },
      {
        language: 'tsx',
        label: 'useOptimistic — instant like button',
        code: `function Like({ liked, count }: { liked: boolean; count: number }) {
  const [optimistic, setOptimistic] = useOptimistic(
    { liked, count },
    (state, next: boolean) => ({ liked: next, count: state.count + (next ? 1 : -1) }),
  );
  return (
    <form action={async () => {
      setOptimistic(!optimistic.liked);
      await toggleLike(!optimistic.liked); // server may reject; rolls back
    }}>
      <button>{optimistic.liked ? '♥' : '♡'} {optimistic.count}</button>
    </form>
  );
}`,
      },
    ],
    pointers: [
      {
        label: 'useactionstate demo',
        path: 'src/features/useactionstate/UseActionStateDemo.tsx',
        note: 'Login form using action + useFormStatus.',
      },
      {
        label: 'useoptimistic demo',
        path: 'src/features/useoptimistic/UseOptimisticDemo.tsx',
        note: 'Like button — flips instantly, rolls back on simulated failure.',
      },
    ],
    demoKey: 'useactionstate',
    version: 'React 19',
    references: [
      { label: 'React 19 Actions', url: 'https://react.dev/blog/2024/12/05/react-19#actions' },
      { label: 'useActionState', url: 'https://react.dev/reference/react/useActionState' },
      { label: 'useOptimistic', url: 'https://react.dev/reference/react/useOptimistic' },
    ],
    redFlags: [
      "Doesn't know about React 19 form Actions.",
      "Still hand-rolls useState + isLoading + handleSubmit for new code.",
    ],
  },

  // =====================================================================
  // SECTION 6 — Build, Deploy & Senior Judgment
  // =====================================================================
  {
    slug: 'build-tools',
    section: 'build',
    title: 'Webpack vs Vite vs Rollup',
    tagline: 'Three tools, three shapes — pick by use case.',
    summary:
      "Webpack: long-time default. Bundles everything (slow dev for big apps), mature ecosystem, heavy legacy. Vite: native ES modules in dev (instant startup), Rollup under the hood for production. New default for greenfield React. Rollup: library bundler — cleaner output, better tree-shaking, used for npm packages. Esbuild and SWC are the underlying compilers, both faster than Babel.",
    keyPoints: [
      'Vite is the modern default for app dev — instant cold start regardless of project size.',
      'Webpack still default in Next.js (Turbopack coming) and many legacy projects — not strictly worse for prod output.',
      'Rollup for libraries / npm packages — cleaner ESM output, better tree-shaking.',
      'esbuild + SWC are the fast Rust/Go compilers — replacing Babel under the hood.',
      'CRA is deprecated by the React team — use Vite or Next.js for new projects.',
      "Build-tool choice mostly affects DX. Final bundle quality is comparable across modern tools.",
    ],
    snippets: [
      {
        language: 'bash',
        label: 'Scaffold modern React',
        code: `# Vite + React + TS (this app)
npm create vite@latest my-app -- --template react-ts

# Next.js (App Router, SSR/RSC)
npx create-next-app@latest my-app --typescript --app

# Avoid — CRA is deprecated
# npx create-react-app my-app`,
      },
    ],
    pointers: [
      {
        label: 'vite.config.ts',
        path: 'vite.config.ts',
        note: 'This app uses Vite. Path alias @/ → src/ lives here.',
      },
    ],
    demoKey: 'build-tools',
    references: [
      { label: 'Vite', url: 'https://vitejs.dev/' },
      { label: 'Sunsetting CRA', url: 'https://react.dev/blog/2025/02/14/sunsetting-create-react-app' },
    ],
    redFlags: [
      'Only knows Webpack.',
      'Has not tried Vite.',
      "Doesn't know what tree-shaking is.",
    ],
  },
  {
    slug: 'rendering-strategies',
    section: 'build',
    title: 'SPA, MPA, SSR, SSG, ISR, RSC',
    tagline: 'A rendering spectrum, not a binary.',
    summary:
      "MPA: server-rendered, full reload on nav — content-heavy sites. SPA: one HTML, JS handles everything — app-like UIs, slow first load, bad SEO. SSR: server renders HTML per request, client hydrates — fast first paint, SEO, server cost. SSG: render at build time, deploy to CDN — cheapest, fastest, static. ISR: SSG that regenerates on a schedule / on demand. RSC: server components run on the server, stream HTML + payload, mix with client components.",
    keyPoints: [
      'SPA-without-SSR is bad for public content — SEO, TTI penalties.',
      'SSG + ISR for content that rarely changes; SSR/RSC for per-request data.',
      "Hydration is the SPA-after-SSR step where React attaches handlers. Mismatch errors here are the bane of SSR.",
      'RSC = server components run on server, send a payload describing the UI — reduces client JS.',
      'Modern Next.js apps mix all of them in one repo.',
      'This app is an SPA — fine for an internal refresher, would not ship as a public marketing site.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Server vs Client component (RSC)',
        code: `// app/orders/page.tsx — Server Component (Next.js App Router)
// Runs only on the server, can hit the DB directly.
export default async function OrdersPage() {
  const orders = await db.order.findMany();
  return <OrderTable orders={orders} />;
}

// app/orders/OrderTable.tsx — Client Component
'use client';
export function OrderTable({ orders }: { orders: Order[] }) {
  const [sort, setSort] = useState('date');
  // ...interactivity lives here
}`,
      },
    ],
    pointers: [
      {
        label: 'rendering-strategies demo',
        path: 'src/features/rendering-strategies/RenderingStrategiesDemo.tsx',
        note: 'Visual comparison of where each strategy fits on the spectrum.',
      },
    ],
    demoKey: 'rendering-strategies',
    references: [
      { label: 'Rendering — Next.js', url: 'https://nextjs.org/docs/app/building-your-application/rendering' },
      { label: 'React Server Components', url: 'https://react.dev/reference/rsc/server-components' },
    ],
    redFlags: [
      "Treats SPA vs MPA as the only options.",
      "Doesn't know what hydration is.",
      'Has not heard of Server Components.',
    ],
  },
  {
    slug: 'testing',
    section: 'build',
    title: 'Testing Strategy',
    tagline: 'Layered, biased toward integration. Test behavior, not implementation.',
    summary:
      "Layered tests with the integration layer fat. Unit tests for pure functions / reducers / custom hooks. Component tests with Testing Library — interact like a user, assert on the DOM. Integration tests render larger chunks with mocked APIs (MSW). E2E (Playwright / Cypress) for critical paths. Visual regression (Chromatic / Percy) for layout. 100% coverage is a vanity metric; focus on the paths that matter.",
    keyPoints: [
      "Testing Library philosophy: test behavior, not implementation. Don't query by data-testid if a role/label exists.",
      'MSW (Mock Service Worker) is the modern standard for mocking network in tests.',
      'E2E: only critical paths. Flakes are a productivity tax — fix or delete.',
      "Don't test internal state directly. Refactor-resistance dies otherwise.",
      'Storybook + interaction tests increasingly viable for component-level testing.',
      'Vitest is the Vite-native test runner — Jest-compatible API, much faster.',
    ],
    snippets: [
      {
        language: 'tsx',
        label: 'Testing Library example',
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('shows error on bad credentials', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid/i);
});`,
      },
    ],
    pointers: [
      {
        label: 'testing demo',
        path: 'src/features/testing/TestingDemo.tsx',
        note: 'A walk-through of unit / component / integration / e2e test shapes.',
      },
    ],
    demoKey: 'testing',
    references: [
      { label: 'Testing Library guiding principles', url: 'https://testing-library.com/docs/guiding-principles/' },
      { label: 'MSW', url: 'https://mswjs.io/' },
      { label: 'Vitest', url: 'https://vitest.dev/' },
    ],
    redFlags: [
      'Tests internal state directly.',
      'Only has unit tests, no component / integration coverage.',
      'No tests at all.',
    ],
  },
  {
    slug: 'major-upgrade',
    section: 'build',
    title: 'Major-Version Upgrades',
    tagline: "Treat 'React 18 → 19' as a project, not a one-line bump.",
    summary:
      "Approach as a project. Read the migration guide. Audit peer deps — react-router, redux, the design system all need to be compatible. Run codemods. Gate on test coverage — thin tests = bad time to upgrade. Triage Strict Mode warnings (real bugs, mostly). Sequence on a feature branch behind a flag; gradual deploy with an obvious rollback. Separate 'upgrade React' from 'rewrite to use new patterns'.",
    keyPoints: [
      'Audit dependencies first — library compat issues are usually what blocks the upgrade.',
      'Run codemods (npx react-codemod ...) for breaking changes the team has automated.',
      'Test coverage = your rollback safety net. Patch holes before bumping.',
      'Strict Mode surfaces existing bugs — triage, do not silence.',
      "Don't bundle 'upgrade React' with 'rewrite for new patterns' — separate PRs.",
      'Roll out behind a feature flag if you can. Rollback path obvious.',
      'After: a knowledge-sharing session so the team uses new features correctly.',
    ],
    snippets: [
      {
        language: 'bash',
        label: 'Anatomy of a React upgrade',
        code: `# 1. Read the migration guide for the target version

# 2. Audit dep compat
npm outdated --depth=0
npm ls react react-dom

# 3. Bump in a branch
npm install react@latest react-dom@latest @types/react@latest @types/react-dom@latest

# 4. Run codemods
npx react-codemod@latest

# 5. Run tests + type-check + manual smoke
npm run lint && npm run build && npm test

# 6. Triage Strict Mode warnings in dev
npm run dev`,
      },
    ],
    pointers: [
      {
        label: 'major-upgrade demo',
        path: 'src/features/major-upgrade/MajorUpgradeDemo.tsx',
        note: 'A staged-rollout checklist applied to a hypothetical React 18 → 19 jump.',
      },
    ],
    demoKey: 'major-upgrade',
    references: [
      { label: 'React 19 upgrade guide', url: 'https://react.dev/blog/2024/04/25/react-19-upgrade-guide' },
      { label: 'react-codemod', url: 'https://github.com/reactjs/react-codemod' },
    ],
    redFlags: [
      `Treats it as 'just bump the version'.`,
      'No mention of dependencies, tests, or rollout strategy.',
      'Bundles upgrade + rewrite in one PR.',
    ],
  },
];
