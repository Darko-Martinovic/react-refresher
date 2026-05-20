import type { Task } from './feature.model';

/**
 * Per-feature exercises. Three validator kinds:
 *  - `predict`     — multiple choice; `correct` is the index of the right option
 *  - `input`       — free text; case-insensitive match against any value in `accept`
 *  - `self-check`  — claim done after trying something in the demo
 *
 * The tasks favour `input` and `self-check` so the user has to think /
 * try something, not just guess from four options.
 */
export const TASKS_BY_SLUG: Record<string, Task[]> = {
  // -------------------------------------------------------------------
  // SECTION 1 — Fundamentals & Mental Model
  // -------------------------------------------------------------------
  jsx: [
    {
      prompt:
        'Which classic React function does `<div className="x">hi</div>` compile to when targeting the classic JSX runtime? Type just the function name (with the React. prefix).',
      validator: {
        kind: 'input',
        accept: ['React.createElement', 'createElement'],
        explanation:
          'The classic JSX transform compiles <Foo x={y} /> to React.createElement(Foo, { x: y }). The automatic runtime (React 17+) uses _jsx() internally instead, but the result is the same kind of plain element object.',
      },
    },
    {
      prompt:
        'A React element is an immutable plain JavaScript object describing what to render. Roughly speaking, what three top-level fields does it contain? Type them comma-separated.',
      hint: "Think: what's the tag, what are the attributes/props, and what's inside?",
      validator: {
        kind: 'input',
        accept: [
          'type, props, children',
          'type,props,children',
          'type props children',
        ],
        explanation:
          "Every element is roughly { type, props, children } (children may live inside props depending on the runtime, but conceptually it's those three).",
      },
    },
    {
      prompt:
        'Toggle the JSX-vs-createElement view in the demo above and confirm the two columns describe the same UI.',
      validator: {
        kind: 'self-check',
        explanation:
          "JSX and createElement are isomorphic — the same call tree, written two different ways.",
      },
    },
  ],

  'component-element-dom': [
    {
      prompt:
        "Match the layer to the description. Which layer is 'a plain JavaScript object like { type, props, children }'? Type one word: component, element, or DOM-node.",
      validator: {
        kind: 'input',
        accept: ['element', 'react element'],
        explanation:
          "Element. The component is the function that produces them; the DOM node is what the browser ends up with.",
      },
    },
    {
      prompt:
        'A component re-rendering always causes a DOM mutation. True or false?',
      validator: {
        kind: 'predict',
        options: ['True', 'False'],
        correct: 1,
        explanation:
          "False. Re-rendering produces a new element tree. If the diff says nothing changed at the DOM level (same props, same children), no DOM ops are committed.",
      },
    },
  ],

  'props-vs-state': [
    {
      prompt:
        'A child component receives `count` as a prop and needs to show `count + 1` somewhere. Should `count + 1` be: (a) computed during render, or (b) stored in useState and synced via useEffect?',
      hint: 'If it can be derived, derive.',
      validator: {
        kind: 'input',
        accept: ['a', 'computed', 'compute', 'render', 'derive'],
        explanation:
          "Compute it during render. Storing derived values in useState + syncing in useEffect is one of the most common React anti-patterns — it costs an extra render and creates a desync window.",
      },
    },
    {
      prompt:
        'In the live demo, click the parent\'s "+" button. Confirm the child\'s displayed count updates without the child holding its own count state.',
      validator: {
        kind: 'self-check',
        explanation:
          "The child is pure: it renders whatever count prop it's given. State lives in the parent — the single source of truth.",
      },
    },
  ],

  'rerender-model': [
    {
      prompt:
        'Wrap the heavy child in `React.memo`. If the parent passes `data={[1, 2, 3]}` inline (a new array literal every render), how many times out of 5 parent re-renders will the memoized child skip its body?',
      hint: 'Same contents, different reference.',
      validator: {
        kind: 'predict',
        options: ['0', '1', '4', '5'],
        correct: 0,
        explanation:
          "Zero. Every parent render creates a new array literal — different reference. memo's shallow compare sees a new prop and re-renders the child every time. memo helps only when props are referentially stable.",
      },
    },
    {
      prompt:
        'Inside an event handler you call `setCount(count + 1)` three times in a row, where count starts at 0. What is the final count after the handler returns?',
      validator: {
        kind: 'input',
        accept: ['1'],
        explanation:
          "1. All three setters see the same snapshot (count === 0), so all three set count to 1. To get 3 you need the functional form: setCount(c => c + 1).",
      },
    },
    {
      prompt:
        "Same scenario but using the functional form `setCount(c => c + 1)` three times. Final count?",
      validator: {
        kind: 'input',
        accept: ['3'],
        explanation:
          "3. The functional form sees the latest queued state — each setter increments cleanly.",
      },
    },
  ],

  keys: [
    {
      prompt:
        "You render a re-orderable list with `items.map((it, i) => <Row key={i} item={it} />)`. After dragging the second row to the top, what happens to a typed-in input value inside row 1?",
      validator: {
        kind: 'predict',
        options: [
          "It moves with the row to its new position",
          "It stays attached to position 0 — now showing the wrong row",
          "It is cleared by React on every reorder",
          "It triggers a React warning and stops rendering",
        ],
        correct: 1,
        explanation:
          "Index-as-key tells React 'the item at position 0 is the same item' — so it reuses the DOM input + its state with what is now a different item.",
      },
    },
    {
      prompt:
        "In the demo, reorder the right (id-keyed) list and confirm typed-in input values follow their row.",
      validator: {
        kind: 'self-check',
        explanation:
          "With a stable id key, React matches new and old positions correctly and the DOM node moves with the row.",
      },
    },
    {
      prompt:
        'What attribute would you change to FORCE a child component to fully reset its internal state and remount?',
      validator: {
        kind: 'input',
        accept: ['key', 'key prop', 'the key'],
        explanation:
          "Change the key — React treats a new key as a different identity, unmounts the old subtree, and mounts a fresh one. The canonical 'reset state' trick.",
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 2 — Hooks
  // -------------------------------------------------------------------
  'rules-of-hooks': [
    {
      prompt:
        'How does React identify which `useState` call corresponds to which piece of state across renders? One word.',
      validator: {
        kind: 'input',
        accept: ['order', 'call order', 'position', 'call-order'],
        explanation:
          "React tracks hooks by call order. That's why they must be at the top level — a conditional call shifts the list and React mixes up which state belongs to which hook.",
      },
    },
    {
      prompt:
        'Of the two rules of hooks, only one is enforced at lint time. Which one?',
      validator: {
        kind: 'predict',
        options: [
          'Only call hooks from React components or custom hooks',
          'Only call hooks at the top level',
          'Both are enforced equally',
          'Neither — runtime only',
        ],
        correct: 2,
        explanation:
          "Both are enforced by eslint-plugin-react-hooks. The plugin checks call sites for the 'use*' naming convention (rule 2) and analyses control flow to catch conditional hook calls (rule 1).",
      },
    },
  ],

  usestate: [
    {
      prompt:
        'In the demo above, click the "Object form (BAD)" button three times starting from count=0. What is the displayed count?',
      validator: {
        kind: 'input',
        accept: ['1'],
        explanation:
          "1. Each click sees the same starting count and overwrites it with count + 1 — three writes of the same value.",
      },
    },
    {
      prompt:
        'Now click the "Functional form (GOOD)" button three times. Displayed count?',
      validator: {
        kind: 'input',
        accept: ['3'],
        explanation:
          "3. The functional form receives the latest queued state — increments stack correctly.",
      },
    },
    {
      prompt:
        "useState's initial value is a function returning the expensive default. Is `useState(expensive())` or `useState(() => expensive())` correct for lazy init?",
      validator: {
        kind: 'input',
        accept: [
          'useState(() => expensive())',
          '() => expensive()',
          'function form',
          'lazy',
          'pass a function',
        ],
        explanation:
          "Pass a function: useState(() => expensive()). The function form runs only on first render. The bare call form would invoke expensive() on every render even though only the first one is used.",
      },
    },
  ],

  usereducer: [
    {
      prompt:
        "A reducer is a pure function of what signature? Type it (use `(state, action) => newState` syntax).",
      validator: {
        kind: 'input',
        accept: [
          '(state, action) => state',
          '(state, action) => newstate',
          '(state, action) => newState',
          'state, action) => state',
          'state, action => state',
        ],
        explanation:
          "(state, action) => newState. Pure — given the same input it always returns the same output and never mutates the previous state.",
      },
    },
    {
      prompt:
        "Add a todo, toggle it, then remove it in the demo. Confirm each dispatched action produces a single coherent new state.",
      validator: {
        kind: 'self-check',
        explanation:
          "Every action goes through the same reducer — easy to read in DevTools, easy to test with a single new-state assertion.",
      },
    },
  ],

  useeffect: [
    {
      prompt:
        "What does an effect that subscribes to a global event but does not return a cleanup leak in dev mode with React 19 Strict Mode?",
      validator: {
        kind: 'predict',
        options: [
          'Nothing — React 19 fixes leaks automatically',
          'Two subscriptions per mount (the effect fires twice in dev)',
          'One silent error and zero subscriptions',
          'An infinite re-render loop',
        ],
        correct: 1,
        explanation:
          "Strict Mode runs the effect mount/unmount cycle twice in dev so leaks become loud. Without cleanup, the second mount adds a duplicate subscription. Always return a cleanup.",
      },
    },
    {
      prompt:
        "In the demo, toggle the 'cleanup' switch off and click the source button a few times. Confirm the log shows duplicate handler hits.",
      validator: {
        kind: 'self-check',
        explanation:
          "Without cleanup, the second subscription stays attached and the log shows it. With cleanup, the unmount in between detaches the first listener cleanly.",
      },
    },
    {
      prompt:
        "Which official React docs page explicitly enumerates the cases where useEffect is the WRONG tool?",
      validator: {
        kind: 'input',
        accept: [
          'You Might Not Need an Effect',
          'you might not need an effect',
          'might not need an effect',
        ],
        explanation:
          "'You Might Not Need an Effect' on react.dev. If the only thing the effect does is compute a value to set state, you don't need an effect.",
      },
    },
  ],

  'usememo-usecallback': [
    {
      prompt:
        "`useCallback(fn, deps)` is equivalent to which useMemo expression? Type it.",
      validator: {
        kind: 'input',
        accept: [
          'useMemo(() => fn, deps)',
          'usememo(() => fn, deps)',
          'useMemo(()=>fn, deps)',
          'usememo(()=>fn,deps)',
        ],
        explanation:
          "useCallback(fn, deps) is sugar for useMemo(() => fn, deps). One memoizes a value, the other memoizes a function — under the hood the same caching primitive.",
      },
    },
    {
      prompt:
        "In the demo, toggle 'memoize' off and slide the slider repeatedly. The expensive computation runs how often?",
      validator: {
        kind: 'predict',
        options: [
          'Once per app session',
          'Only when the filter input changes',
          'On every render',
          'Never',
        ],
        correct: 2,
        explanation:
          "Without useMemo, the function body runs every render. With it, the function body runs only when the dependency changes.",
      },
    },
  ],

  'custom-hooks': [
    {
      prompt:
        'What naming convention identifies a custom hook to both the linter and to readers?',
      validator: {
        kind: 'input',
        accept: ['use prefix', 'use', 'starts with use', 'use*', 'useX'],
        explanation:
          "Function name must start with 'use'. The linter relies on this to know it should apply hook rules to the function.",
      },
    },
    {
      prompt:
        'Two different components each call `useCounter()`. Do they share the same count?',
      validator: {
        kind: 'predict',
        options: ['Yes — hooks share state', 'No — each call site gets its own state'],
        correct: 1,
        explanation:
          "Hooks share LOGIC, not state. Each component calling the hook gets its own independent state. (If you want shared state, use Context, a global store, or a Provider pattern.)",
      },
    },
    {
      prompt:
        'In the demo, type quickly into the search box. The debounce should show "debounced value" updating only ~250 ms after you stop. Confirm.',
      validator: {
        kind: 'self-check',
        explanation:
          "The hook sets a timeout, clears it when value changes, and only commits the latest value when typing stops. That's the whole point of useDebouncedValue.",
      },
    },
  ],

  useref: [
    {
      prompt:
        'Which hook returns a value whose changes do NOT trigger a re-render?',
      validator: {
        kind: 'input',
        accept: ['useRef', 'useref', 'useRef()'],
        explanation:
          "useRef returns { current }. Mutating .current is invisible to React's render system — perfect for timer IDs, previous values, instance variables.",
      },
    },
    {
      prompt:
        "In React 19, do you still need `forwardRef` to accept a ref on a function component for new code?",
      validator: {
        kind: 'predict',
        options: ['Yes — always required', 'No — ref is now a regular prop'],
        correct: 1,
        explanation:
          "React 19 made ref a regular prop. The forwardRef wrapper is still around for back-compat but new code doesn't need it.",
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 3 — State Management
  // -------------------------------------------------------------------
  'state-colocation': [
    {
      prompt:
        "A boolean for 'is the user-profile modal open' that should survive a refresh and be sharable via link. Where does it belong?",
      validator: {
        kind: 'predict',
        options: ['useState', 'Context', 'Redux', 'URL'],
        correct: 3,
        explanation:
          "URL (search params or path). Surviving refresh and being shareable are exactly the URL's job.",
      },
    },
    {
      prompt:
        "Filter text shared by two sibling components that re-renders the form on every keystroke. State should be:",
      validator: {
        kind: 'predict',
        options: [
          'Local in each sibling — duplicate it',
          'Lifted to the common parent',
          'In Context at the page root',
          'In Redux',
        ],
        correct: 1,
        explanation:
          "Lift to the lowest common ancestor. Context for high-frequency state across two siblings is overkill; Redux even more so.",
      },
    },
  ],

  'context-api': [
    {
      prompt:
        "Five components all consume a `ThemeContext`. The Provider's value is `{ mode, toggle }` reconstructed inline on every render of its parent. When the parent re-renders, how many of the five consumers re-render?",
      validator: {
        kind: 'input',
        accept: ['5', 'five', 'all', 'all 5', 'all five'],
        explanation:
          "All 5. A new object literal is a new reference; every consumer re-renders. Memoize the value with useMemo to fix.",
      },
    },
    {
      prompt:
        "What's the fix without switching to a state library? Type the hook name you'd wrap the value with.",
      validator: {
        kind: 'input',
        accept: ['useMemo', 'usememo', 'useMemo()'],
        explanation:
          "Wrap the value object in useMemo so the reference is stable until the underlying state actually changes.",
      },
    },
  ],

  'redux-and-modern-state': [
    {
      prompt:
        "The 2024+ default for SERVER state in a React app — type the most popular library name.",
      validator: {
        kind: 'input',
        accept: [
          'tanstack query',
          'tanstack-query',
          'react-query',
          'react query',
          'TanStack Query',
        ],
        explanation:
          "TanStack Query (formerly react-query). It owns the cache/dedup/refetch/stale-while-revalidate cycle so Redux doesn't have to.",
      },
    },
    {
      prompt:
        "If you ARE going to use Redux on a greenfield project today, you should use:",
      validator: {
        kind: 'predict',
        options: [
          'Raw Redux + redux-thunk',
          'Redux Toolkit (RTK)',
          'redux-saga',
          'redux-observable',
        ],
        correct: 1,
        explanation:
          "Redux Toolkit. It bakes in best practices, drops most boilerplate, and ships RTK Query for server state.",
      },
    },
    {
      prompt:
        "Lightweight client store with hooks-based API + built-in selectors, popular as a Redux replacement for small/medium apps. Name it.",
      validator: {
        kind: 'input',
        accept: ['zustand', 'Zustand'],
        explanation:
          "Zustand. Sub-1kb, no actions/reducers required, selectors via the hook signature.",
      },
    },
  ],

  'data-fetching': [
    {
      prompt:
        "What does TanStack Query do automatically that a hand-rolled useEffect + fetch + useState does NOT? Name at least two: type them comma-separated.",
      validator: {
        kind: 'input',
        accept: [
          'caching, deduplication',
          'cache, dedup',
          'caching, dedup',
          'dedup, cache',
          'caching and deduplication',
          'caching,dedup',
          'background refetch, caching',
          'caching, refetch',
          'caching, retry',
        ],
        explanation:
          "Any pair from: caching, deduplication, background refetch, stale-while-revalidate, retry, race-condition handling, invalidation on mutate.",
      },
    },
    {
      prompt:
        "The React 19 hook that consumes a Promise inside a Suspense boundary is just two letters long. Type it.",
      validator: {
        kind: 'input',
        accept: ['use', 'use()'],
        explanation:
          "use(). The same hook also reads Context — it's a general 'consume a resource' primitive.",
      },
    },
  ],

  forms: [
    {
      prompt:
        "What's the main performance reason React Hook Form is faster than Formik for large forms? Type a short phrase.",
      hint: 'Hint: think about what triggers a re-render of the form root.',
      validator: {
        kind: 'input',
        accept: [
          'uncontrolled inputs',
          'uncontrolled',
          'uses refs',
          'refs',
          'no re-render on keystroke',
          'no rerender',
          'avoids re-renders',
        ],
        explanation:
          "RHF uses uncontrolled inputs + refs — the form root does not re-render on every keystroke. Formik's controlled-input model re-renders on each change.",
      },
    },
    {
      prompt:
        'Open the form demo above, type an invalid email and password under 8 chars, and confirm both error messages appear after submitting.',
      validator: {
        kind: 'self-check',
        explanation:
          "Errors come from the Zod schema; RHF threads them into formState.errors and the per-field message rendering.",
      },
    },
  ],

  'error-handling': [
    {
      prompt:
        "Do Error Boundaries catch errors thrown inside an `onClick` handler?",
      validator: {
        kind: 'predict',
        options: [
          'Yes — all errors bubble to the nearest boundary',
          'No — only errors thrown during render are caught',
        ],
        correct: 1,
        explanation:
          "Async errors (handlers, promises, timers) do NOT hit Error Boundaries. Handle them locally or via libraries (TanStack Query exposes errors as state).",
      },
    },
    {
      prompt:
        "In the demo, click the 'Throw on render' button. Confirm the boundary's fallback appears with a working retry button.",
      validator: {
        kind: 'self-check',
        explanation:
          "The boundary catches the throw via getDerivedStateFromError and renders its fallback. Retry resets the boundary's local error state.",
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 4 — Architecture & Code Organization
  // -------------------------------------------------------------------
  'folder-structure': [
    {
      prompt:
        "Adding a new feature should require touching how many top-level folders in a feature-based src/ layout?",
      validator: {
        kind: 'predict',
        options: [
          'Five — one per layer',
          'Three — components, hooks, services',
          'One — its own feature folder',
          'Zero — everything is shared',
        ],
        correct: 2,
        explanation:
          "One folder per feature is the whole point. Adding a feature = adding a folder; deleting it = deleting a folder.",
      },
    },
    {
      prompt:
        "What's the import-time check that codifies the 'features import from /shared, not from each other' boundary?",
      validator: {
        kind: 'input',
        accept: [
          'index.ts',
          'index file',
          'public api',
          'index.ts barrel',
          'eslint-plugin-boundaries',
        ],
        explanation:
          "An index.ts per feature exposing only the public surface — and ESLint rules (eslint-plugin-boundaries or `no-restricted-imports`) to enforce the rule mechanically.",
      },
    },
  ],

  'code-reuse': [
    {
      prompt:
        "The modern default replacement for HOCs and render props is custom ____. Type the missing word.",
      validator: {
        kind: 'input',
        accept: ['hooks', 'hook'],
        explanation:
          "Custom hooks. Composable, no wrapper components, easy to type, fits the rest of React.",
      },
    },
    {
      prompt:
        "Name one thing HOCs CAN do that hooks CANNOT.",
      hint: 'Think about what an HOC has access to that a hook does not.',
      validator: {
        kind: 'input',
        accept: [
          'wrap rendering',
          'wrap component',
          'wrap the component',
          'return jsx',
          'add jsx',
          'wrap jsx',
          'render wrapping',
        ],
        explanation:
          "HOCs can wrap the rendering — e.g. <Layout>{originalRender}</Layout>. Hooks cannot return JSX as a wrapper around the host component. For most reuse, hooks are still cleaner.",
      },
    },
  ],

  'smart-vs-presentational': [
    {
      prompt:
        "With hooks, how is the smart/presentational split usually achieved without dedicated container components?",
      validator: {
        kind: 'input',
        accept: [
          'custom hook',
          'custom hooks',
          'use* hook',
          'extract a hook',
          'data hook',
        ],
        explanation:
          "Extract data and state into a custom hook; the component stays a pure props-in/JSX-out render function consuming the hook.",
      },
    },
    {
      prompt:
        "In a design system / shared components folder, which kind of component is appropriate?",
      validator: {
        kind: 'predict',
        options: [
          'Container components that fetch their own data',
          'Presentational components that take everything via props',
          'A mix — preference per component',
        ],
        correct: 1,
        explanation:
          "/shared = presentational only. A reusable component that fetches data couples to a specific endpoint and stops being reusable.",
      },
    },
  ],

  'component-splitting': [
    {
      prompt:
        "Refactor sequence: a 600-line component with many unrelated hooks. What is usually the FIRST extraction move?",
      validator: {
        kind: 'predict',
        options: [
          'Split it into 10 micro-components by visual section',
          'Extract a custom hook for the data + related state/handlers',
          'Move everything to Redux',
          'Add React.memo around the whole thing',
        ],
        correct: 1,
        explanation:
          "First move: extract a custom hook. Pulls related state/effects/handlers out into a named, testable unit and shrinks the component body considerably.",
      },
    },
    {
      prompt:
        "A `<List variant='compact' sortable selectable />` is a smell because the props are toggling internal _____.",
      validator: {
        kind: 'input',
        accept: ['behavior', 'behaviour', 'features', 'functionality', 'logic'],
        explanation:
          "Behavior. Variant flags that toggle internal behavior usually indicate two components in a trench coat — composition wins.",
      },
    },
  ],

  styling: [
    {
      prompt:
        "Which styling approach is incompatible with React Server Components at runtime?",
      validator: {
        kind: 'predict',
        options: [
          'CSS Modules',
          'Tailwind',
          'Runtime CSS-in-JS (styled-components / Emotion)',
          'Plain CSS',
        ],
        correct: 2,
        explanation:
          "Runtime CSS-in-JS injects styles during render — fundamentally a client-only operation. RSC pushes you toward CSS Modules, Tailwind, or zero-runtime CSS-in-JS (vanilla-extract, Panda).",
      },
    },
    {
      prompt:
        "Tailwind purges unused class names at build time. The bundle size of utility classes after purging is generally:",
      validator: {
        kind: 'predict',
        options: [
          'Larger than equivalent CSS Modules',
          'Comparable to or smaller than handwritten CSS',
          'Always exactly 50 KB',
        ],
        correct: 1,
        explanation:
          "After purging, only utilities the app actually uses ship. Pages tend to share most utilities, so the per-page cost is small.",
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 5 — Performance & Rendering
  // -------------------------------------------------------------------
  reconciliation: [
    {
      prompt:
        "If a `<Modal>` becomes a `<div>` at the same tree position between renders, React:",
      validator: {
        kind: 'predict',
        options: [
          'Updates only the changed attributes',
          'Tears down the entire subtree and rebuilds it',
          'Throws — types cannot change',
          'Reuses the DOM node, just renames the tag',
        ],
        correct: 1,
        explanation:
          "Different element type at the same position → full subtree teardown + rebuild. State and refs of the children are lost.",
      },
    },
    {
      prompt:
        "What was the name of the React 16 rewrite that made rendering interruptible and laid the groundwork for concurrent rendering?",
      validator: {
        kind: 'input',
        accept: ['Fiber', 'fiber', 'react fiber'],
        explanation:
          "Fiber. The reconciler became a list of small work units rather than a recursive call — React can pause and resume work, prioritise updates, and yield to the browser.",
      },
    },
  ],

  'memo-misuse': [
    {
      prompt:
        "In the demo above, with both 'memo' and 'stable callback' off, the child renders on every parent render. Toggle ONLY 'memo' on — does the child stop re-rendering?",
      validator: {
        kind: 'predict',
        options: ['Yes — memo blocks the re-render', 'No — inline callback is a new reference every render'],
        correct: 1,
        explanation:
          "No. The inline arrow function passed as a prop is a new reference each render, so memo's shallow compare always sees 'props changed'.",
      },
    },
    {
      prompt:
        "Now toggle both memo AND stable callback on. Confirm the child stops re-rendering on parent state changes.",
      validator: {
        kind: 'self-check',
        explanation:
          "With both on, every prop is referentially stable across parent renders, memo bails out, the child skips its body.",
      },
    },
    {
      prompt:
        "What Compiler-mode feature aims to make manual `React.memo` / `useMemo` / `useCallback` mostly obsolete?",
      validator: {
        kind: 'input',
        accept: [
          'React Compiler',
          'react compiler',
          'compiler',
          'React Forget',
          'forget',
        ],
        explanation:
          "The React Compiler (formerly Forget). It analyses your component and inserts memoization where actually useful — no decoration needed.",
      },
    },
  ],

  'long-lists': [
    {
      prompt:
        'In the demo, scroll the virtualized 10k-row list. Roughly how many `<div>` nodes does the list mount at any given time?',
      validator: {
        kind: 'predict',
        options: ['10,000', '~1,000', '~50–100', '0 — they are all CSS-rendered'],
        correct: 2,
        explanation:
          "A windowed list mounts only the visible rows plus a small overscan buffer — usually 30–100 nodes regardless of total length.",
      },
    },
    {
      prompt:
        "Naively rendering 10k rows without virtualization mainly hurts which two things?",
      validator: {
        kind: 'predict',
        options: [
          'First paint and scroll smoothness',
          'TypeScript compilation and ESLint',
          'CSS specificity and React DevTools',
          'Service worker cache and IndexedDB',
        ],
        correct: 0,
        explanation:
          "Mount time + scroll perf. State changes also become more expensive because every row diffs.",
      },
    },
  ],

  suspense: [
    {
      prompt:
        "A Suspense boundary's role is to show a _____ while children inside are not yet ready. Type the missing word.",
      validator: {
        kind: 'input',
        accept: ['fallback', 'spinner'],
        explanation:
          "Fallback. The fallback prop is what renders while any descendant is suspending.",
      },
    },
    {
      prompt:
        "Suspense pairs with which other React construct to handle the failure path (uncaught error during render of the suspended subtree)?",
      validator: {
        kind: 'input',
        accept: [
          'ErrorBoundary',
          'error boundary',
          'error boundaries',
          '<ErrorBoundary>',
        ],
        explanation:
          "Error Boundary. Together they define recovery boundaries: Suspense for loading, ErrorBoundary for failure.",
      },
    },
  ],

  'concurrent-transitions': [
    {
      prompt:
        "Open the useTransition demo. Type quickly into the filter input. The input should stay responsive even while the heavy list re-renders. Confirm.",
      validator: {
        kind: 'self-check',
        explanation:
          "startTransition marks the heavy state update as non-urgent. React renders the urgent (input) update immediately and the heavy work in the background.",
      },
    },
    {
      prompt:
        "Which hook is the consumer-side alternative to useTransition for deferring an expensive downstream render?",
      validator: {
        kind: 'input',
        accept: [
          'useDeferredValue',
          'usedeferredvalue',
          'useDeferredValue()',
        ],
        explanation:
          "useDeferredValue. You wrap the input VALUE rather than the state update — useful when the consumer is downstream of the input setter.",
      },
    },
  ],

  'form-actions': [
    {
      prompt:
        "Inside a child of <form>, a submit button wants to disable itself while the form action is running. Which React 19 hook (from react-dom) does it use?",
      validator: {
        kind: 'input',
        accept: ['useFormStatus', 'useformstatus', 'useFormStatus()'],
        explanation:
          "useFormStatus from react-dom. It reads { pending } of the closest <form action={…}> without prop drilling.",
      },
    },
    {
      prompt:
        "Which React 19 hook keeps an optimistic value while the server action runs and rolls it back on failure?",
      validator: {
        kind: 'input',
        accept: ['useOptimistic', 'useoptimistic', 'useOptimistic()'],
        explanation:
          "useOptimistic. Pair it with the action so the UI updates instantly; if the action throws, React reverts the optimistic state.",
      },
    },
    {
      prompt:
        "In the useOptimistic demo, click the like button rapidly. Confirm the count flips instantly even before the simulated server confirms.",
      validator: {
        kind: 'self-check',
        explanation:
          "The optimistic state shows the next value; the action runs in the background. If the simulated server rejects, the value rolls back.",
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 6 — Build, Deploy & Senior Judgment
  // -------------------------------------------------------------------
  'build-tools': [
    {
      prompt:
        "In dev mode, what does Vite serve files as so that startup is near-instant regardless of project size?",
      validator: {
        kind: 'input',
        accept: [
          'native ESM',
          'esm',
          'native es modules',
          'es modules',
          'native modules',
          'ESM',
        ],
        explanation:
          "Native ES modules. Vite skips bundling in dev — the browser pulls modules directly via <script type=\"module\">.",
      },
    },
    {
      prompt:
        "Which bundler does Vite use under the hood for production builds?",
      validator: {
        kind: 'input',
        accept: ['Rollup', 'rollup'],
        explanation:
          "Rollup. Production builds need a bundle; Rollup produces clean, tree-shakable output.",
      },
    },
    {
      prompt:
        "Status of Create React App today:",
      validator: {
        kind: 'predict',
        options: [
          'Recommended default for new React apps',
          'Deprecated by the React team — use Vite or Next.js',
          'Required for React 19',
          'Renamed to create-react-toolkit',
        ],
        correct: 1,
        explanation:
          "CRA was officially deprecated. The React docs recommend Vite or a framework like Next.js.",
      },
    },
  ],

  'rendering-strategies': [
    {
      prompt:
        "Match the strategy. 'Render all pages at build time to static HTML and deploy to a CDN.' Three-letter acronym.",
      validator: {
        kind: 'input',
        accept: ['SSG', 'ssg'],
        explanation:
          "SSG — Static Site Generation. The cheapest and fastest option for content that does not change per user.",
      },
    },
    {
      prompt:
        "The step where a server-rendered page attaches React event handlers on the client is called what?",
      validator: {
        kind: 'input',
        accept: ['hydration', 'hydrate', 'hydrating'],
        explanation:
          "Hydration. Mismatches between the server-rendered HTML and the first client render are the bane of SSR.",
      },
    },
    {
      prompt:
        "React Server Components (RSC) primarily aim to reduce:",
      validator: {
        kind: 'predict',
        options: [
          'Server CPU usage',
          'Client JavaScript bundle size',
          'Database connections',
          'CSS specificity conflicts',
        ],
        correct: 1,
        explanation:
          "Client JS. RSC runs on the server and streams a UI payload — components that never need interactivity ship zero JS to the client.",
      },
    },
  ],

  testing: [
    {
      prompt:
        "Testing Library's guiding principle: tests should resemble the way the software is used. So when locating a submit button you should prefer:",
      validator: {
        kind: 'predict',
        options: [
          'getByTestId("submit")',
          'document.querySelector("#submit")',
          'getByRole("button", { name: /sign in/i })',
          'getByClassName("btn-primary")',
        ],
        correct: 2,
        explanation:
          "Role + accessible name — that's what a user (and an assistive technology) sees. data-testid is the last resort when nothing else works.",
      },
    },
    {
      prompt:
        "Modern standard library for mocking network requests in component / integration tests:",
      validator: {
        kind: 'input',
        accept: ['MSW', 'msw', 'mock service worker'],
        explanation:
          "MSW — Mock Service Worker. Intercepts at the network layer, so your component code uses real fetch / axios calls.",
      },
    },
  ],

  'major-upgrade': [
    {
      prompt:
        "The biggest reason a React 18 → 19 upgrade fails on a large existing codebase is rarely React itself. It is usually:",
      validator: {
        kind: 'predict',
        options: [
          'Deprecated React APIs',
          'Peer dependencies (component lib, router, redux) that haven\'t shipped React-19 builds',
          'TypeScript compile errors',
          'Webpack configuration',
        ],
        correct: 1,
        explanation:
          "Dependency compatibility. If one critical lib doesn't support the new React version, the upgrade is gated on that vendor.",
      },
    },
    {
      prompt:
        "Should you bundle 'upgrade React' and 'refactor app to use new patterns' in one PR?",
      validator: {
        kind: 'predict',
        options: [
          'Yes — get it all done at once',
          'No — separate, reviewable changes',
        ],
        correct: 1,
        explanation:
          "Separate. Bundling them creates an un-reviewable diff and obscures which change caused which regression.",
      },
    },
  ],
};
