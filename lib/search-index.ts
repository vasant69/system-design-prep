import { getEnabledSections } from "@/lib/sections";
import { getAllTopicsMeta } from "@/lib/content";

export type SearchDoc = {
  title: string;
  href: string;
  sectionTitle: string;
  moduleId: string;
  tags: string[];
  englishDefinition: string;
  difficulty: string;
};

/** Flat, JSON-serializable list of every topic across enabled sections, for client-side Fuse.js search. */
export function buildSearchIndex(): SearchDoc[] {
  return getEnabledSections().flatMap((section) =>
    getAllTopicsMeta(section.slug).map((topic) => ({
      title: topic.title,
      href: topic.href,
      sectionTitle: section.title,
      moduleId: topic.module,
      tags: topic.tags,
      englishDefinition: topic.englishDefinition,
      difficulty: topic.difficulty,
    })),
  );
}
