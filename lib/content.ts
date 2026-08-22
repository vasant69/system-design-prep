// Reads .mdx files under /content, parses frontmatter, and builds the
// topic graph (module grouping, ordering, prerequisites, prev/next).
// Filesystem is the database — this module is the only place that knows
// the on-disk layout, so nothing above it should call `fs` directly.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypePrettyCode } from "rehype-pretty-code";
import { getEnabledSections, getModulesSorted } from "@/lib/sections";
import { mdxComponents } from "@/components/mdx";
import type { InterviewQuestion, ModuleConfig, QuizQuestion, TopicFrontmatter, TopicMeta } from "@/lib/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function sectionDir(sectionSlug: string): string {
  return path.join(CONTENT_ROOT, sectionSlug);
}

function listModuleDirs(sectionSlug: string): string[] {
  const dir = sectionDir(sectionSlug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function listTopicFiles(sectionSlug: string, moduleId: string): string[] {
  const dir = path.join(sectionDir(sectionSlug), moduleId);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

const DIAGRAM_CHART_RE = /<Diagram\s+chart=\{`([\s\S]*?)`\}/;

/** Pulls the raw Mermaid source out of a topic's first <Diagram>, for section-page thumbnails. */
function extractDiagramChart(body: string): string | null {
  return DIAGRAM_CHART_RE.exec(body)?.[1]?.trim() ?? null;
}

/** All topic frontmatter for a section, unsorted. Cached per request/build. */
export const getAllTopicsMeta = cache((sectionSlug: string): TopicMeta[] => {
  const metas: TopicMeta[] = [];
  for (const moduleId of listModuleDirs(sectionSlug)) {
    for (const file of listTopicFiles(sectionSlug, moduleId)) {
      const filePath = path.join(sectionDir(sectionSlug), moduleId, file);
      // All content is authored in-repo and every page here is statically
      // generated (generateStaticParams) — this never runs against
      // untrusted input or at request time, so it's safe to opt this
      // dynamic path out of Vercel's output file tracing.
      const raw = fs.readFileSync(/* turbopackIgnore: true */ filePath, "utf8");
      const { data, content: body } = matter(raw);
      const frontmatter = data as TopicFrontmatter;
      metas.push({
        ...frontmatter,
        sectionSlug,
        href: `/${sectionSlug}/${frontmatter.slug}`,
        diagramChart: extractDiagramChart(body),
      });
    }
  }
  return metas;
});

/** Topics grouped by module, both modules and topics-within-module sorted by `order`. */
export function getTopicsByModule(sectionSlug: string): { module: ModuleConfig; topics: TopicMeta[] }[] {
  const allTopics = getAllTopicsMeta(sectionSlug);
  return getModulesSorted(sectionSlug).map((module) => ({
    module,
    topics: allTopics.filter((t) => t.module === module.id).sort((a, b) => a.order - b.order),
  }));
}

/** All topics in a section, flattened in the order they should be studied. */
export function getFlatTopicOrder(sectionSlug: string): TopicMeta[] {
  return getTopicsByModule(sectionSlug).flatMap((group) => group.topics);
}

export function getAdjacentTopics(
  sectionSlug: string,
  slug: string,
): { prev: TopicMeta | null; next: TopicMeta | null } {
  const flat = getFlatTopicOrder(sectionSlug);
  const index = flat.findIndex((t) => t.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return { prev: flat[index - 1] ?? null, next: flat[index + 1] ?? null };
}

export function resolvePrerequisites(sectionSlug: string, prerequisiteSlugs: string[]): TopicMeta[] {
  const all = getAllTopicsMeta(sectionSlug);
  return prerequisiteSlugs
    .map((slug) => all.find((t) => t.slug === slug))
    .filter((t): t is TopicMeta => Boolean(t));
}

/** {section, slug} pairs for every topic in every enabled section — for generateStaticParams. */
export function getAllTopicParams(): { section: string; slug: string }[] {
  return getEnabledSections().flatMap((section) =>
    getAllTopicsMeta(section.slug).map((topic) => ({ section: section.slug, slug: topic.slug })),
  );
}

function findTopicFile(sectionSlug: string, slug: string): { filePath: string; moduleId: string } | null {
  for (const moduleId of listModuleDirs(sectionSlug)) {
    for (const file of listTopicFiles(sectionSlug, moduleId)) {
      const filePath = path.join(sectionDir(sectionSlug), moduleId, file);
      const raw = fs.readFileSync(/* turbopackIgnore: true */ filePath, "utf8");
      const { data } = matter(raw);
      if ((data as TopicFrontmatter).slug === slug) {
        return { filePath, moduleId };
      }
    }
  }
  return null;
}

/** Compiles one topic's MDX body to a renderable React node, plus its typed frontmatter. */
export const getTopic = cache(async (sectionSlug: string, slug: string) => {
  const found = findTopicFile(sectionSlug, slug);
  if (!found) return null;

  const raw = fs.readFileSync(/* turbopackIgnore: true */ found.filePath, "utf8");
  const { content, frontmatter } = await compileMDX<TopicFrontmatter>({
    source: raw,
    options: {
      parseFrontmatter: true,
      // next-mdx-remote defaults to stripping non-literal JSX expression
      // attributes (blockJS) as an XSS guard for untrusted MDX. Every .mdx
      // file here is first-party content we author ourselves, and custom
      // components like <Diagram chart={...}> and <Tradeoff pros={[...]}>
      // rely on expression attributes, so we disable that guard.
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          // "wrap" would put the whole heading text inside <a>, so it'd
          // inherit the blue-underline link styling from typography.tsx.
          // "append" adds a small separate anchor after the text instead —
          // the heading itself stays styled as a heading.
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["anchor-link"],
                ariaLabel: "Link to this section",
              },
              content: { type: "text", value: " #" },
            },
          ],
          [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
        ],
      },
    },
    components: mdxComponents,
  });

  const meta: TopicMeta = {
    ...frontmatter,
    sectionSlug,
    href: `/${sectionSlug}/${slug}`,
    diagramChart: extractDiagramChart(raw),
  };

  return { meta, moduleId: found.moduleId, content };
});

/**
 * Loads the co-located quiz file for a topic (content/<section>/<module>/<slug>.quiz.ts),
 * if one exists. Returns [] rather than throwing so a topic without a quiz
 * yet doesn't break the page — the quiz UI itself ships in Phase 3.
 */
export async function getTopicQuiz(sectionSlug: string, moduleId: string, slug: string): Promise<QuizQuestion[]> {
  try {
    const mod = (await import(`@/content/${sectionSlug}/${moduleId}/${slug}.quiz`)) as {
      default: QuizQuestion[];
    };
    return mod.default;
  } catch {
    return [];
  }
}

/**
 * Loads the co-located technical-round question bank for a topic
 * (content/<section>/<module>/<slug>.interview.ts), if one exists. Returns
 * [] rather than throwing so a topic without one doesn't break the page —
 * mirrors getTopicQuiz above.
 */
export async function getTopicInterviewQuestions(
  sectionSlug: string,
  moduleId: string,
  slug: string,
): Promise<InterviewQuestion[]> {
  try {
    const mod = (await import(`@/content/${sectionSlug}/${moduleId}/${slug}.interview`)) as {
      default: InterviewQuestion[];
    };
    return mod.default;
  } catch {
    return [];
  }
}

/** Every technical-round question across every topic in a section, with topic context attached — for the /[section]/questions aggregator. */
export const getAllInterviewQuestions = cache(async (sectionSlug: string) => {
  const topics = getAllTopicsMeta(sectionSlug);
  const results: { topic: TopicMeta; moduleId: string; question: InterviewQuestion }[] = [];
  for (const topic of topics) {
    const found = findTopicFile(sectionSlug, topic.slug);
    if (!found) continue;
    const questions = await getTopicInterviewQuestions(sectionSlug, found.moduleId, topic.slug);
    for (const question of questions) {
      results.push({ topic, moduleId: found.moduleId, question });
    }
  }
  return results;
});
