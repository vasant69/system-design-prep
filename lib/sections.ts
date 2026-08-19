import { sectionsConfig } from "@/config/sections.config";
import type { ModuleConfig, SectionConfig } from "@/lib/types";

/** All sections, enabled or not, in registry order. */
export function getAllSections(): SectionConfig[] {
  return sectionsConfig;
}

/** Sections that currently have content and should be linked in nav/search. */
export function getEnabledSections(): SectionConfig[] {
  return sectionsConfig.filter((s) => s.enabled);
}

export function getSection(slug: string): SectionConfig | undefined {
  return sectionsConfig.find((s) => s.slug === slug);
}

export function isValidSection(slug: string): boolean {
  return sectionsConfig.some((s) => s.slug === slug);
}

export function getModuleConfig(sectionSlug: string, moduleId: string): ModuleConfig | undefined {
  return getSection(sectionSlug)?.modules.find((m) => m.id === moduleId);
}

/** Modules of a section sorted by their declared `order`. */
export function getModulesSorted(sectionSlug: string): ModuleConfig[] {
  const section = getSection(sectionSlug);
  if (!section) return [];
  return [...section.modules].sort((a, b) => a.order - b.order);
}
