export type SnippetLang =
  | 'typescript'
  | 'tsx'
  | 'jsx'
  | 'html'
  | 'scss'
  | 'css'
  | 'json'
  | 'bash';

export interface Snippet {
  language: SnippetLang;
  label?: string;
  code: string;
}

export interface ExplorePointer {
  label: string;
  path: string;
  note?: string;
}

export interface RefLink {
  label: string;
  url: string;
}

export type DemoKey =
  | 'jsx-compilation'
  | 'component-vs-element'
  | 'state-vs-props'
  | 'rerender-causes'
  | 'keys-and-lists'
  | 'rules-of-hooks'
  | 'usestate'
  | 'usereducer'
  | 'useeffect-cleanup'
  | 'usememo-usecallback'
  | 'custom-hook'
  | 'useref'
  | 'state-colocation'
  | 'context-api'
  | 'data-fetching'
  | 'forms-rhf'
  | 'error-boundary'
  | 'folder-structure'
  | 'code-reuse'
  | 'smart-vs-presentational'
  | 'component-splitting'
  | 'styling'
  | 'reconciliation-keys'
  | 'memo-misuse'
  | 'virtualized-list'
  | 'suspense-use-hook'
  | 'build-tools'
  | 'rendering-strategies'
  | 'testing'
  | 'major-upgrade'
  | 'usetransition'
  | 'useactionstate'
  | 'useoptimistic';

export type TaskValidator =
  | {
      kind: 'predict';
      options: string[];
      correct: number;
      explanation: string;
    }
  | {
      kind: 'input';
      accept: string[];
      explanation: string;
    }
  | {
      kind: 'self-check';
      explanation: string;
    };

export interface Task {
  prompt: string;
  hint?: string;
  validator: TaskValidator;
}

export interface Feature {
  slug: string;
  section: string;
  title: string;
  tagline: string;
  summary: string;
  keyPoints: string[];
  snippets: Snippet[];
  pointers: ExplorePointer[];
  demoKey?: DemoKey;
  references: RefLink[];
  redFlags?: string[];
  version?: string;
  tasks?: Task[];
}

export interface FeatureSection {
  key: string;
  label: string;
  icon: string;
  description: string;
  order: number;
}
