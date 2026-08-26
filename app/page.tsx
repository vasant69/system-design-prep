import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch as DiagramIcon, Globe2, Languages, Lock, MessageSquareText } from "lucide-react";
import { getAllSections } from "@/lib/sections";
import { getAllTopicsMeta } from "@/lib/content";
import { sectionIconMap } from "@/components/icon-map";
import { getSectionTheme } from "@/lib/section-theme";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dictionaryEntries } from "@/lib/dictionary-data";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Interview-ready definitions",
    body: "A clean, quotable English definition up top — the exact thing you'd say out loud in a room.",
  },
  {
    icon: MessageSquareText,
    title: "Hinglish, not bullet points",
    body: "The real explanation, the way a senior engineer actually talks it through over chai.",
  },
  {
    icon: DiagramIcon,
    title: "Diagram-first concepts",
    body: "Architecture and flow diagrams for every hard idea — built to be pictured and remembered, not memorized as text.",
  },
  {
    icon: Globe2,
    title: "Numbers you can use",
    body: "Real latency, throughput, and scale figures — from companies you already use daily.",
  },
];

export default function HomePage() {
  const sections = getAllSections();
  const systemDesignTopics = getAllTopicsMeta("system-design").length;

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)]"
        />
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -z-10 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Personal interview trainer · {systemDesignTopics} topics live
            </p>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-balance sm:text-6xl">
              System Design,
              <br />
              <span className="text-sky-400">pictured</span> and explained.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              English definitions you can say out loud in an interview, Hinglish explanations for how it actually
              clicks, and a diagram for every hard concept so you remember it, not just recognize it. Built to study
              daily, not skim once.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/system-design"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start with System Design
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-muted-foreground">No login, no ads — progress lives in your browser.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-b border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <f.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Choose a track</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {sections.map((section) => {
            const Icon = sectionIconMap[section.icon];
            const theme = getSectionTheme(section.slug);
            const topicCount = section.enabled ? getAllTopicsMeta(section.slug).length : 0;

            const cardBody = (
              <>
                <div
                  aria-hidden
                  className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-0 transition-opacity group-hover:opacity-100", theme.gradient)}
                />
                <div className="relative flex items-start justify-between">
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", theme.iconBg)}>
                    {Icon && <Icon className={cn("h-5 w-5", theme.iconColor)} />}
                  </span>
                  {!section.enabled && (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Coming soon
                    </Badge>
                  )}
                </div>
                <h3 className="relative mt-4 text-xl font-semibold tracking-tight">{section.title}</h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                {section.enabled && (
                  <div className={cn("relative mt-4 flex items-center gap-1.5 text-sm font-medium", theme.text)}>
                    {topicCount} {topicCount === 1 ? "topic" : "topics"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                )}
              </>
            );

            if (!section.enabled) {
              return (
                <div
                  key={section.slug}
                  className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-6 opacity-60"
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
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors",
                  `hover:${theme.border}`,
                )}
                style={{ ["--tw-hover-border" as string]: undefined }}
              >
                {cardBody}
              </Link>
            );
          })}

          {/* Dictionary — a standalone glossary page, not part of the module/topic content pipeline */}
          <Link
            href="/dictionary"
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors",
              "hover:border-amber-500/40",
            )}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <div className="relative flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15">
                <Languages className="h-5 w-5 text-amber-400" />
              </span>
            </div>
            <h3 className="relative mt-4 text-xl font-semibold tracking-tight">Dictionary</h3>
            <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Every word a developer actually hears at work — one-line Hinglish meanings, no fluff.
            </p>
            <div className="relative mt-4 flex items-center gap-1.5 text-sm font-medium text-amber-400">
              {dictionaryEntries.length} words
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
