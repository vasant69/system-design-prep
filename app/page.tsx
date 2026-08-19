import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { getAllSections } from "@/lib/sections";
import { getAllTopicsMeta } from "@/lib/content";
import { sectionIconMap } from "@/components/icon-map";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const sections = getAllSections();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Personal interview trainer</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">System Design Prep</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          English definitions you can say out loud in an interview, Hinglish explanations for how it actually clicks,
          and real numbers from companies you already use. Built to study daily, not skim once.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = sectionIconMap[section.icon];
          const topicCount = section.enabled ? getAllTopicsMeta(section.slug).length : 0;

          const cardBody = (
            <>
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  {Icon && <Icon className="h-5 w-5" />}
                </span>
                {!section.enabled && (
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Coming soon
                  </Badge>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{section.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
              {section.enabled && (
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-sky-400">
                  {topicCount} topics
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </>
          );

          if (!section.enabled) {
            return (
              <div
                key={section.slug}
                className="rounded-xl border border-border bg-card/50 p-6 opacity-60"
                aria-disabled
              >
                {cardBody}
              </div>
            );
          }

          return (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-sky-500/40 hover:bg-card/80"
            >
              {cardBody}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
