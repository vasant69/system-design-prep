import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, GitBranch } from "lucide-react";
import { getAllTopicParams, getAdjacentTopics, getTopic, getTopicInterviewQuestions, resolvePrerequisites } from "@/lib/content";
import { getSection } from "@/lib/sections";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/topic/DifficultyBadge";
import { FrequencyBadge } from "@/components/topic/FrequencyBadge";
import { ReadingProgress } from "@/components/topic/ReadingProgress";
import { TableOfContents } from "@/components/topic/TableOfContents";
import { ProgressActions } from "@/components/topic/ProgressActions";
import { FocusModeToggle } from "@/components/topic/FocusModeToggle";
import { KeyboardNav } from "@/components/topic/KeyboardNav";
import { TechnicalRoundQuestions } from "@/components/topic/TechnicalRoundQuestions";
import { getModuleTheme } from "@/lib/section-theme";
import { moduleIconMap } from "@/components/icon-map";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getAllTopicParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const topic = await getTopic(section, slug);
  if (!topic) return {};
  return {
    title: topic.meta.title,
    description: topic.meta.englishDefinition,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section: sectionSlug, slug } = await params;
  const section = getSection(sectionSlug);
  if (!section) notFound();

  const topic = await getTopic(sectionSlug, slug);
  if (!topic) notFound();

  const { meta, content, moduleId } = topic;
  const prerequisites = resolvePrerequisites(sectionSlug, meta.prerequisites);
  const { prev, next } = getAdjacentTopics(sectionSlug, slug);
  const interviewQuestions = await getTopicInterviewQuestions(sectionSlug, moduleId, slug);
  const moduleConfig = section.modules.find((m) => m.id === meta.module);
  const theme = getModuleTheme(meta.module);
  const ModuleIcon = moduleIconMap[meta.module];

  return (
    <div>
      <ReadingProgress colorClassName={theme.progressBar} />

      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b [mask-image:linear-gradient(to_bottom,black,transparent)]",
            theme.gradient,
          )}
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-7 sm:px-6">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Link href={`/${sectionSlug}`} className="hover:text-foreground">
              {section.title}
            </Link>
            {moduleConfig && (
              <>
                <span>/</span>
                <span className="inline-flex items-center gap-1.5">
                  {ModuleIcon && <ModuleIcon className={cn("h-3.5 w-3.5", theme.iconColor)} />}
                  {moduleConfig.title}
                </span>
              </>
            )}
          </nav>

          <h1 className="mt-3 max-w-[42ch] font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight sm:text-4xl">
            {meta.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={meta.difficulty} />
            <FrequencyBadge frequency={meta.interviewFrequency} />
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {meta.readingTime} min read
            </Badge>
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {meta.companies.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Asked at: <span className="text-foreground/80">{meta.companies.join(", ")}</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <ProgressActions sectionSlug={sectionSlug} slug={slug} />
            <FocusModeToggle />
          </div>
        </div>
      </div>

      <KeyboardNav prevHref={prev?.href} nextHref={next?.href} />

      <div
        id="topic-layout-grid"
        className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,var(--prose-measure))_15rem] lg:gap-12 xl:gap-16"
      >
        <div className="min-w-0">
          {prerequisites.length > 0 && (
            <div className="mb-8 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5" />
                Read first
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {prerequisites.map((prereq) => (
                  <Link
                    key={prereq.slug}
                    href={prereq.href}
                    className={cn(
                      "rounded-full border border-border px-3 py-1 text-sm text-foreground/90 transition-colors hover:bg-secondary",
                      theme.hoverBorder,
                    )}
                  >
                    {prereq.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <article id="topic-article">{content}</article>

          <TechnicalRoundQuestions questions={interviewQuestions} />

          <div className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={prev.href}
                className={cn(
                  "group flex flex-col rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0",
                  theme.hoverBorder,
                )}
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                  Previous
                </span>
                <span className="mt-1 font-medium">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={next.href}
                className={cn(
                  "group flex flex-col items-end rounded-xl border border-border bg-card p-4 text-right shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0",
                  theme.hoverBorder,
                )}
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  Next
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 font-medium">{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <aside data-site-chrome className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
