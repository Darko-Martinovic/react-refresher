import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { DemoKey } from './feature.model';

/**
 * Each demo is its own lazy chunk. Vite + React.lazy bundles
 * the demo as a separate JS file that loads on first navigation
 * to the feature page.
 */
export const DEMO_LOADERS: Record<DemoKey, LazyExoticComponent<ComponentType>> = {
  'jsx-compilation': lazy(() => import('@/features/jsx-compilation/JsxCompilationDemo')),
  'component-vs-element': lazy(() => import('@/features/component-vs-element/ComponentVsElementDemo')),
  'state-vs-props': lazy(() => import('@/features/state-vs-props/StateVsPropsDemo')),
  'rerender-causes': lazy(() => import('@/features/rerender-causes/RerenderCausesDemo')),
  'keys-and-lists': lazy(() => import('@/features/keys-and-lists/KeysAndListsDemo')),
  'rules-of-hooks': lazy(() => import('@/features/rules-of-hooks/RulesOfHooksDemo')),
  usestate: lazy(() => import('@/features/usestate/UseStateDemo')),
  usereducer: lazy(() => import('@/features/usereducer/UseReducerDemo')),
  'useeffect-cleanup': lazy(() => import('@/features/useeffect-cleanup/UseEffectCleanupDemo')),
  'usememo-usecallback': lazy(() => import('@/features/usememo-usecallback/UseMemoUseCallbackDemo')),
  'custom-hook': lazy(() => import('@/features/custom-hook/CustomHookDemo')),
  useref: lazy(() => import('@/features/useref/UseRefDemo')),
  'state-colocation': lazy(() => import('@/features/state-colocation/StateColocationDemo')),
  'context-api': lazy(() => import('@/features/context-api/ContextApiDemo')),
  'data-fetching': lazy(() => import('@/features/data-fetching/DataFetchingDemo')),
  'forms-rhf': lazy(() => import('@/features/forms-rhf/FormsRhfDemo')),
  'error-boundary': lazy(() => import('@/features/error-boundary/ErrorBoundaryDemo')),
  'folder-structure': lazy(() => import('@/features/folder-structure/FolderStructureDemo')),
  'code-reuse': lazy(() => import('@/features/code-reuse/CodeReuseDemo')),
  'smart-vs-presentational': lazy(() => import('@/features/smart-vs-presentational/SmartVsPresentationalDemo')),
  'component-splitting': lazy(() => import('@/features/component-splitting/ComponentSplittingDemo')),
  styling: lazy(() => import('@/features/styling/StylingDemo')),
  'reconciliation-keys': lazy(() => import('@/features/reconciliation-keys/ReconciliationKeysDemo')),
  'memo-misuse': lazy(() => import('@/features/memo-misuse/MemoMisuseDemo')),
  'virtualized-list': lazy(() => import('@/features/virtualized-list/VirtualizedListDemo')),
  'suspense-use-hook': lazy(() => import('@/features/suspense-use-hook/SuspenseUseHookDemo')),
  'build-tools': lazy(() => import('@/features/build-tools/BuildToolsDemo')),
  'rendering-strategies': lazy(() => import('@/features/rendering-strategies/RenderingStrategiesDemo')),
  testing: lazy(() => import('@/features/testing/TestingDemo')),
  'major-upgrade': lazy(() => import('@/features/major-upgrade/MajorUpgradeDemo')),
  usetransition: lazy(() => import('@/features/usetransition/UseTransitionDemo')),
  useactionstate: lazy(() => import('@/features/useactionstate/UseActionStateDemo')),
  useoptimistic: lazy(() => import('@/features/useoptimistic/UseOptimisticDemo')),
};
