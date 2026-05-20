import type { FeatureSection } from './feature.model';

export const SECTIONS: FeatureSection[] = [
  {
    key: 'fundamentals',
    label: 'Fundamentals & Mental Model',
    icon: 'psychology',
    description:
      'JSX, components/elements/DOM nodes, props vs state, the re-render model, and the key prop — the non-negotiable basics.',
    order: 1,
  },
  {
    key: 'hooks',
    label: 'Hooks',
    icon: 'extension',
    description:
      'The rules of hooks, useState/useReducer, useEffect pitfalls, useMemo/useCallback judgment, custom hooks, and useRef.',
    order: 2,
  },
  {
    key: 'state',
    label: 'State Management',
    icon: 'hub',
    description:
      'Local, lifted, Context, Redux/Zustand/Jotai, server-state libraries, forms, and error handling layers.',
    order: 3,
  },
  {
    key: 'architecture',
    label: 'Architecture & Code Organization',
    icon: 'architecture',
    description:
      'Folder structure, HOCs vs render props vs hooks, presentational/container, when to split, and styling approaches.',
    order: 4,
  },
  {
    key: 'performance',
    label: 'Performance & Rendering',
    icon: 'speed',
    description:
      'Reconciliation and diffing, React.memo misuse, long lists, Suspense, and the React 19 concurrent primitives.',
    order: 5,
  },
  {
    key: 'build',
    label: 'Build, Deploy & Senior Judgment',
    icon: 'rocket_launch',
    description:
      'Webpack vs Vite vs Rollup, SPA/MPA/SSR/SSG/ISR/RSC, testing strategy, and major-version upgrades.',
    order: 6,
  },
];
