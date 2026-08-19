import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, GitBranch } from "lucide-react";
import { getAllTopicParams, getAdjacentTopics, getTopic, resolvePrerequisites } from "@/lib/content";
import { getSection } from "@/lib/sections";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/topic/DifficultyBadge";
import { FrequencyBadge } from "@/components/topic/FrequencyBadge";

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

  const { meta, content } = topic;
  const prerequisites = resolvePrerequisites(sectionSlug, meta.prerequisites);
  const { prev, next } = getAdjacentTopics(sectionSlug, slug);
  const moduleConfig = section.modules.find((m) => m.id === meta.module);

  return (
    <div className="mx-auto max-w-[72ch] px-4 py-10 sm:px-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={`/${sectionSlug}`} className="hover:text-foreground">
          {section.title}
        </Link>
        {moduleConfig && (
          <>
            <span>/</span>
            <span>{moduleConfig.title}</span>
          </>
        )}
      </nav>

      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{meta.title}</h1>

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

      {prerequisites.length > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <GitBranch className="h-3.5 w-3.5" />
            Read first
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {prerequisites.map((prereq) => (
              <Link
                key={prereq.slug}
                href={prereq.href}
                className="rounded-full border border-border px-3 py-1 text-sm text-foreground/90 transition-colors hover:border-sky-500/40 hover:text-sky-300"
              >
                {prereq.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <article className="mt-8">{content}</article>

      <div className="mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:border-sky-500/40 hover:bg-card"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="h-3 w-3" />
              Previous
            </span>
            <span className="mt-1 font-medium group-hover:text-sky-300">{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex flex-col items-end rounded-lg border border-border p-4 text-right transition-colors hover:border-sky-500/40 hover:bg-card"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Next
              <ArrowRight className="h-3 w-3" />
            </span>
            <span className="mt-1 font-medium group-hover:text-sky-300">{next.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
