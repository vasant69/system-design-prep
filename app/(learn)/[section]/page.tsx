import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getAllSections, getSection } from "@/lib/sections";
import { getTopicsByModule } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/topic/DifficultyBadge";
import { getModuleTheme, getSectionTheme } from "@/lib/section-theme";
import { moduleIconMap, sectionIconMap } from "@/components/icon-map";
import { CompletionDot } from "@/components/topic/CompletionDot";
import { DiagramThumbnail } from "@/components/topic/DiagramThumbnail";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getAllSections().map((section) => ({ section: section.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug } = await params;
  const section = getSection(sectionSlug);
  if (!section) return {};
  return { title: section.title, description: section.description };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionSlug } = await params;
  const section = getSection(sectionSlug);
  if (!section) notFound();

  if (!section.enabled) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">{section.title}</h1>
        <p className="mt-3 text-muted-foreground">{section.description}</p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-[var(--shadow-card)]">
          Content for this section hasn&apos;t been written yet — it&apos;s wired up and ready to go.
        </div>
      </div>
    );
  }

  const moduleGroups = getTopicsByModule(sectionSlug);
  const theme = getSectionTheme(sectionSlug);
  const totalTopics = moduleGroups.reduce((sum, g) => sum + g.topics.length, 0);
  const SectionIcon = sectionIconMap[section.icon];

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b [mask-image:linear-gradient(to_bottom,black,transparent)]",
            theme.gradient,
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_55%_at_30%_0%,black_20%,transparent_75%)] opacity-60"
        />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All tracks
          </Link>

          <div className="mt-6 flex items-start gap-4 sm:gap-5">
            <span
              className={cn(
                "hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border shadow-[var(--shadow-card)] sm:flex",
                theme.iconBg,
              )}
            >
              {SectionIcon && <SectionIcon className={cn("h-7 w-7", theme.iconColor)} />}
            </span>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
                {section.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {section.description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-border bg-card px-3 py-1 font-medium text-foreground/80 shadow-[var(--shadow-card)]">
              {moduleGroups.length} modules
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1 font-medium text-foreground/80 shadow-[var(--shadow-card)]">
              {totalTopics} topics
            </span>
            <Link
              href={`/${sectionSlug}/questions`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-medium text-foreground/80 shadow-[var(--shadow-card)] transition-colors hover:bg-secondary hover:text-foreground"
            >
              Question bank
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Module roadmap */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative space-y-6">
          {/* connecting spine */}
          <div aria-hidden className="absolute top-4 bottom-4 left-[23px] w-px bg-border sm:left-[27px]" />

          {moduleGroups.map(({ module, topics }) => {
            const moduleTheme = getModuleTheme(module.id);
            const ModuleIcon = moduleIconMap[module.id];

            return (
              <section key={module.id} className="relative pl-14 sm:pl-16">
                <span
                  className={cn(
                    "absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-background ring-1 ring-border shadow-[var(--shadow-card)] sm:h-14 sm:w-14",
                    moduleTheme.iconBg,
                  )}
                >
                  {ModuleIcon && <ModuleIcon className={cn("h-5 w-5 sm:h-6 sm:w-6", moduleTheme.iconColor)} />}
                </span>

                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className={cn("border-b border-border bg-gradient-to-r px-5 py-4", moduleTheme.gradient)}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                        <span className={cn("mr-1.5 font-mono text-sm", moduleTheme.text)}>
                          {String(module.order).padStart(2, "0")}
                        </span>
                        {module.title}
                      </h2>
                      <span className="text-xs font-medium text-muted-foreground">
                        {topics.length} {topics.length === 1 ? "topic" : "topics"}
                      </span>
                    </div>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{module.description}</p>
                  </div>

                  {topics.length === 0 ? (
                    <p className="px-5 py-4 text-sm italic text-muted-foreground">No topics published yet.</p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {topics.map((topic, i) => (
                        <li key={topic.slug}>
                          <Link
                            href={topic.href}
                            className="group flex flex-col gap-2.5 px-4 py-3.5 transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="hidden w-6 shrink-0 text-center font-mono text-xs text-muted-foreground/70 sm:block">
                                {i + 1}
                              </span>
                              {topic.diagramChart && <DiagramThumbnail chart={topic.diagramChart} />}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-medium">
                                  <span className="transition-colors group-hover:text-foreground">{topic.title}</span>
                                  <CompletionDot sectionSlug={sectionSlug} slug={topic.slug} />
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                                  {topic.englishDefinition}
                                </p>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 pl-9 text-xs text-muted-foreground sm:pl-0">
                              <DifficultyBadge difficulty={topic.difficulty} />
                              <Badge variant="outline" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {topic.readingTime}m
                              </Badge>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
