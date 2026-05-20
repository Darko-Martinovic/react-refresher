import { useMemo } from 'react';
import { FEATURES } from './feature-registry';
import { SECTIONS } from './sections';
import { TASKS_BY_SLUG } from './feature-tasks-data';
import type { Feature, FeatureSection } from './feature.model';

export interface GroupedSection {
  section: FeatureSection;
  features: Feature[];
}

const FEATURES_WITH_TASKS: Feature[] = FEATURES.map((f) => ({
  ...f,
  tasks: TASKS_BY_SLUG[f.slug] ?? [],
}));

const SECTIONS_ORDERED: FeatureSection[] = [...SECTIONS].sort(
  (a, b) => a.order - b.order,
);

const GROUPED: GroupedSection[] = SECTIONS_ORDERED.map((section) => ({
  section,
  features: FEATURES_WITH_TASKS.filter((f) => f.section === section.key),
}));

const FLAT: Feature[] = GROUPED.flatMap((g) => g.features);

const BY_SLUG: Map<string, Feature> = new Map(FLAT.map((f) => [f.slug, f]));

export interface UseFeaturesApi {
  features: Feature[];
  sections: FeatureSection[];
  grouped: GroupedSection[];
  bySlug: (slug: string) => Feature | undefined;
  sectionByKey: (key: string) => FeatureSection | undefined;
  neighbors: (slug: string) => { prev?: Feature; next?: Feature };
  totals: {
    features: number;
    sections: number;
    demos: number;
    tasks: number;
  };
}

const TOTALS = {
  features: FEATURES_WITH_TASKS.length,
  sections: SECTIONS_ORDERED.length,
  demos: FEATURES_WITH_TASKS.filter((f) => f.demoKey).length,
  tasks: FEATURES_WITH_TASKS.reduce((sum, f) => sum + (f.tasks?.length ?? 0), 0),
};

export function useFeatures(): UseFeaturesApi {
  // The data is module-static; the hook just hands a stable API back.
  return useMemo<UseFeaturesApi>(
    () => ({
      features: FEATURES_WITH_TASKS,
      sections: SECTIONS_ORDERED,
      grouped: GROUPED,
      bySlug: (slug) => BY_SLUG.get(slug),
      sectionByKey: (key) => SECTIONS_ORDERED.find((s) => s.key === key),
      neighbors: (slug) => {
        const idx = FLAT.findIndex((f) => f.slug === slug);
        return {
          prev: idx > 0 ? FLAT[idx - 1] : undefined,
          next: idx >= 0 && idx < FLAT.length - 1 ? FLAT[idx + 1] : undefined,
        };
      },
      totals: TOTALS,
    }),
    [],
  );
}
