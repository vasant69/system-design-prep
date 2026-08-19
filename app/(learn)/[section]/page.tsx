import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { getAllSections, getSection } from "@/lib/sections";
import { getTopicsByModule } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/topic/DifficultyBadge";

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
        <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
        <p className="mt-3 text-muted-foreground">{section.description}</p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          Content for this section hasn&apos;t been written yet — it&apos;s wired up and ready to go.
        </div>
      </div>
    );
  }

  const moduleGroups = getTopicsByModule(sectionSlug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{section.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{section.description}</p>

      <div className="mt-10 space-y-10">
        {moduleGroups.map(({ module, topics }) => (
          <section key={module.id}>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                Module {module.order} · {module.title}
              </h2>
              <span className="text-sm text-muted-foreground">{topics.length} topics</span>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{module.description}</p>

            {topics.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground italic">No topics published yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
                {topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={topic.href}
                      className="flex flex-col gap-2 p-4 transition-colors hover:bg-card sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-medium">{topic.title}</div>
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          {topic.englishDefinition}
                        </p>
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
        ))}
      </div>
    </div>
  );
}
