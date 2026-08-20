import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { getAllSections, getSection } from "@/lib/sections";
import { getTopicsByModule } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/topic/DifficultyBadge";
import { getModuleTheme, getSectionTheme } from "@/lib/section-theme";
import { moduleIconMap } from "@/components/icon-map";
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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">{section.title}</h1>
        <p className="mt-3 text-muted-foreground">{section.description}</p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          Content for this section hasn&apos;t been written yet — it&apos;s wired up and ready to go.
        </div>
      </div>
    );
  }

  const moduleGroups = getTopicsByModule(sectionSlug);
  const theme = getSectionTheme(sectionSlug);
  const totalTopics = moduleGroups.reduce((sum, g) => sum + g.topics.length, 0);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div aria-hidden className={cn("absolute inset-x-0 top-0 h-56 bg-gradient-to-b", theme.gradient)} />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight sm:text-5xl">
            {section.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{section.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-3 py-1">{moduleGroups.length} modules</span>
            <span className="rounded-full border border-border bg-card px-3 py-1">{totalTopics} topics</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="relative space-y-8">
          {/* connecting spine for the "roadmap" feel */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-border sm:left-[23px]" />

          {moduleGroups.map(({ module, topics }) => {
            const moduleTheme = getModuleTheme(module.id);
            const ModuleIcon = moduleIconMap[module.id];

            return (
              <section key={module.id} className="relative pl-11 sm:pl-14">
                <span
                  className={cn(
                    "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background sm:h-12 sm:w-12",
                    moduleTheme.iconBg,
                  )}
                >
                  {ModuleIcon && <ModuleIcon className={cn("h-4.5 w-4.5 sm:h-5 sm:w-5", moduleTheme.iconColor)} />}
                </span>

                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                    Module {module.order} · {module.title}
                  </h2>
                  <span className="text-sm text-muted-foreground">{topics.length} topics</span>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{module.description}</p>

                {topics.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground italic">No topics published yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card/40">
                    {topics.map((topic) => (
                      <li key={topic.slug}>
                        <Link
                          href={topic.href}
                          className="flex flex-col gap-2 p-4 transition-colors hover:bg-card sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {topic.diagramChart && <DiagramThumbnail chart={topic.diagramChart} />}
                            <div>
                              <div className="flex items-center gap-1.5 font-medium">
                                {topic.title}
                                <CompletionDot sectionSlug={sectionSlug} slug={topic.slug} />
                              </div>
                              <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                                {topic.englishDefinition}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                            <DifficultyBadge difficulty={topic.difficulty} />
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {topic.readingTime}m
                            </Badge>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
