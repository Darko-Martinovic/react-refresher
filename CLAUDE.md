# CLAUDE.md — guidance for Claude Code working in this repo

This is the React 19 sibling of `C:\Source\A4Interview\Angular\angular-refresher\`. The two projects mirror each other in structure, conventions, and content. When adding to this repo, **mirror that project's architecture rather than redesigning from scratch**.

## Big picture

- 30+ feature pages driven by a single registry (`src/core/features/feature-registry.ts`).
- Each feature optionally has a `demoKey`. The demo is its own React component under `src/features/<demo-key>/` and is loaded lazily by `src/core/features/demo-loaders.ts`.
- Tasks per feature live in `src/core/features/feature-tasks-data.ts` keyed by slug.
- The generic page renderer is `src/shared/FeaturePage.tsx`. Adding a new feature usually means: add an entry to the registry, optionally add tasks, optionally add a demo + loader entry. The page itself doesn't change.

## Conventions

- **Function components only.** No class components anywhere except the Error Boundary in `src/features/error-boundary/`.
- **Rules of hooks.** Top-level only. Keep `eslint-plugin-react-hooks` at error level (Vite scaffolds it for you).
- **TypeScript strict.** No implicit `any`. `verbatimModuleSyntax: true` is on, so use `import type { ... }` for type-only imports.
- **Path alias `@/...` → `src/...`.** Use it everywhere — never `../../../`.
- **No Redux / Zustand / Jotai.** Local state is enough for this app. The state-management section discusses them in content only.
- **No CSS-in-JS files.** Styling is either MUI `sx={{ ... }}` against CSS variables in `src/index.css`, or inline `style={{}}` for simple cases. Keep the visual continuity with the Angular sibling.
- **One demo per `DemoKey`.** `default export` the demo so `React.lazy(() => import('@/features/x/X'))` works without `.then(m => m.X)`.
- **Default to writing no comments.** Code should be self-documenting via good names. Only comment a non-obvious WHY.

## React-19-specific gotchas (call them out in demos & docs)

- **Strict Mode double-effect in dev.** Every `useEffect` runs mount → cleanup → mount on first render in dev. Effects MUST be idempotent and return a cleanup. The `useeffect-cleanup` demo deliberately shows this.
- **`use()` hook.** Consume promises inside a `<Suspense>` boundary. The component reads the data synchronously; the boundary handles loading. See `suspense-use-hook` demo.
- **React 19 form Actions.** `<form action={fn}>`, `useActionState`, `useFormStatus`, `useOptimistic` replace the old `useState + handleSubmit` dance for many forms. See `useactionstate` and `useoptimistic` demos.
- **Ref as a prop.** In new React 19 code, `ref` is just a regular prop on function components — `forwardRef` is unnecessary.
- **React.memo is not free.** Per-render shallow compare costs. Memoize only when (a) the parent re-renders often and (b) the child render is expensive. See `memo-misuse` demo.
- **The React Compiler** auto-memoizes correctly when enabled. We do NOT enable it here (perf cost on dev/build); mention it in the perf chapter, don't depend on it.

## MUI v9 specifics

- `ThemeProvider` is the recommended provider (not `CssVarsProvider`, which is deprecated but still re-exported).
- Theme is built with `createTheme({ cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' }, colorSchemes: { light, dark } })`.
- The color scheme is toggled via `useColorScheme()` from `@mui/material/styles` (NOT from `@mui/material` root). Persistence to localStorage lives in `src/App.tsx`.
- Use `slotProps={{ htmlInput: { ... } }}` on TextField — the v8-era `inputProps` shorthand was removed.
- `InitColorSchemeScript` from `@mui/material/InitColorSchemeScript` is in `main.tsx` so the first paint matches the persisted scheme.

## Vite specifics

- Dev: native ES modules → instant cold start regardless of project size.
- Production: Rollup bundle. Run `npm run build` to inspect chunk sizes — every demo should be its own chunk via `React.lazy()`.
- The MUI chunk gzips to ~240 KB. If that becomes a problem, treeshake by avoiding barrel imports (`import Foo from '@mui/material/Foo'` instead of `import { Foo } from '@mui/material'`).

## Adding a new feature

1. Add an entry to `src/core/features/feature-registry.ts` — at minimum: `slug`, `section`, `title`, `tagline`, `summary`, `keyPoints[]`, `snippets[]`, `pointers[]`, `references[]`.
2. (Optional) Add a `demoKey` to the entry. Add the key to the `DemoKey` union in `src/core/features/feature.model.ts` and a `lazy(() => import('@/features/<key>/...'))` line in `src/core/features/demo-loaders.ts`.
3. (Optional) Create the demo at `src/features/<key>/<PascalName>Demo.tsx` with a `default export`.
4. (Optional) Add 2–3 tasks under the slug in `src/core/features/feature-tasks-data.ts`. Favour `input` and `self-check` over `predict`.
5. Run `npm run build` to confirm types pass and the new chunk shows up in the build output.

The sidenav, home grid, breadcrumbs, prev/next nav, and stats all derive from the registry automatically — no per-feature wiring beyond steps 1–4.
