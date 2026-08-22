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
  /** Raw Mermaid source of the topic's first <Diagram>, if it has one — used for section-page thumbnails */
  diagramChart: string | null;
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

export type InterviewQuestionType = "conceptual" | "code-output" | "scenario" | "trap" | "coding";

/** A single "technical round" question — richer than a QuizQuestion (open-ended, not MCQ). */
export type InterviewQuestion = {
  id: string;
  /** Phrased the way an interviewer would actually ask it */
  question: string;
  type: InterviewQuestionType;
  difficulty: Difficulty;
  /** Companies only when genuinely commonly-reported for this exact question — omit rather than guess */
  askedAt?: string[];
  /** Hinglish, 1-2 lines — what to say first */
  shortAnswer: string;
  /** Hinglish, full explanation with code where needed */
  detailedAnswer: string;
  /** Hinglish — the follow-up question an interviewer is likely to fire next */
  followUp?: string;
  /** Hinglish — the wrong-but-tempting answer that signals a weak candidate */
  redFlag?: string;
};
