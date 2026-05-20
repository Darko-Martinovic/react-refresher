# React Refresher

A polished, navigable React 19 web app that walks through every concept in the React Interview Guide. Each concept is its own route with title, tagline, summary, key points, syntax-highlighted snippets, an interactive live demo where it adds value, "Explore in the codebase" pointers, a tasks section with self-validating exercises, red flags, and links to react.dev.

Sibling project to the Angular refresher at `C:\Source\A4Interview\Angular\angular-refresher\`.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production bundle
npm run preview   # preview the production build locally
npm run lint
```

## Stack

| Layer          | Choice                                                            |
| -------------- | ----------------------------------------------------------------- |
| Framework      | React 19 + TypeScript (strict)                                    |
| Tooling        | Vite (esbuild dev / Rollup production)                            |
| Routing        | React Router v7 — `createBrowserRouter`, `RouterProvider`         |
| UI             | MUI v9 + Emotion, `data-mui-color-scheme` light / dark            |
| Theming        | `createTheme({ cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' } })` |
| Code highlight | `highlight.js` (typescript / tsx / xml / scss / bash / json)      |
| Forms          | React Hook Form (forms demo)                                      |
| Virtualization | `react-window` (long-lists demo)                                  |
| Lint / format  | ESLint (vite scaffold) + react-hooks + react-refresh              |

## Architecture

```
src/
├── core/
│   ├── features/
│   │   ├── feature.model.ts        # Feature, Snippet, Task, TaskValidator, DemoKey
│   │   ├── sections.ts             # 6 sections
│   │   ├── feature-registry.ts     # ~30 feature entries — content from the guide
│   │   ├── feature-tasks-data.ts   # 2–3 tasks per feature (predict / input / self-check)
│   │   ├── demo-loaders.ts         # DemoKey → React.lazy(() => import(...))
│   │   └── useFeatures.ts          # hook exposing grouped / bySlug / neighbors
│   └── theme.ts                    # MUI theme + CSS-variable wiring
├── shared/
│   ├── CodeBlock.tsx               # highlight.js wrapper + copy button
│   ├── FeaturePage.tsx             # generic feature renderer
│   ├── FeatureTasks.tsx            # self-validating tasks UI
│   └── DemoShell.tsx               # consistent demo title + description shell
├── features/
│   ├── jsx-compilation/JsxCompilationDemo.tsx
│   ├── usestate/UseStateDemo.tsx
│   ├── ...                         # one folder per DemoKey (~30 demos)
│   └── useoptimistic/UseOptimisticDemo.tsx
├── pages/
│   ├── Home.tsx                    # hero, stats, search, grouped feature grid
│   └── NotFound.tsx
├── App.tsx                         # AppBar + responsive Drawer + theme toggle + Outlet
├── main.tsx                        # ThemeProvider + RouterProvider + InitColorSchemeScript
└── index.css                       # CSS variables (light + dark) + highlight.js theme
```

Path alias `@/*` → `src/*` is configured in both `tsconfig.app.json` and `vite.config.ts`.

## Live demos

Every demo is its own lazy chunk via `React.lazy()`. A short list:

- **State & re-renders** — `usestate`, `usereducer`, `rerender-causes`, `keys-and-lists`, `state-vs-props`, `state-colocation`
- **Hook hygiene** — `useeffect-cleanup`, `usememo-usecallback`, `custom-hook`, `useref`, `rules-of-hooks`
- **State management** — `context-api`, `data-fetching`, `forms-rhf`, `error-boundary`
- **Performance** — `memo-misuse`, `virtualized-list`, `reconciliation-keys`, `usetransition`, `suspense-use-hook`
- **React 19 actions** — `useactionstate`, `useoptimistic`
- **Architecture** — `code-reuse`, `smart-vs-presentational`, `component-splitting`, `styling`, `folder-structure`
- **Senior judgment** — `build-tools`, `rendering-strategies`, `testing`, `major-upgrade`

## Tasks

Each feature page ends with 2–3 self-validating tasks. Three validator kinds:

- **predict** — multiple choice
- **input** — free-text answer, case-insensitive trim match
- **self-check** — "I tried this in the demo above"

Tasks favour `input` and `self-check` so the user has to think or try something, not just guess from four options.

## Bundle notes

`npm run build` splits each demo into its own chunk; the main MUI-heavy bundle gzips to ~240 KB. That's the cost of shipping MUI v9. If bundle size becomes a concern, the path forward is treeshaking via barrel-less imports and/or replacing MUI with a lighter UI lib.

## Differences from the Angular sibling

- Function components only; no class components except the Error Boundary (still required by React).
- Hooks-based reactivity replaces Angular signals.
- Routing via React Router v7 (no equivalent of Angular's `loadChildren` — we use `React.lazy()` instead).
- Styling stays mostly inline `sx={{ ... }}` against CSS variables rather than SCSS modules.
