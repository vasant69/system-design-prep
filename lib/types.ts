// Shared types for the section/module/topic content graph.
// A "section" (system-design, api-design, ...) contains "modules",
// each module contains an ordered list of "topics" (one .mdx file each).

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type InterviewFrequency = "very-high" | "high" | "medium" | "low";

export type ModuleConfig = {
  /** Folder name under content/<section>/, e.g. "fundamentals" */
  id: string;
  title: string;
  description: string;
  /** Display order among modules within a section */
  order: number;
};

export type SectionConfig = {
  /** URL slug, e.g. "system-design" */
  slug: string;
  title: string;
  description: string;
  /** lucide-react icon name, resolved via the icon map in components */
  icon: string;
  /** Sections with no content yet render a "coming soon" page */
  enabled: boolean;
  modules: ModuleConfig[];
};

/** Raw frontmatter as authored in each .mdx file */
export type TopicFrontmatter = {
  slug: string;
  title: string;
  section: string;
  module: string;
  order: number;
  difficulty: Difficulty;
  readingTime: number;
  prerequisites: string[];
  tags: string[];
  englishDefinition: string;
  interviewFrequency: InterviewFrequency;
  companies: string[];
};

/** Frontmatter plus derived fields used for listings, search, and navigation */
export type TopicMeta = TopicFrontmatter & {
  /** Section slug this topic belongs to (redundant with frontmatter.section, kept in sync) */
  sectionSlug: string;
  /** Full route, e.g. "/system-design/load-balancing" */
  href: string;
};

export type QuizQuestion = {
  id: string;
  /** Hinglish */
  question: string;
  options: string[];
  correctIndex: number;
  /** Hinglish, explains WHY the other options are wrong too */
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};
