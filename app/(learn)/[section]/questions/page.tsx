import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSections, getSection } from "@/lib/sections";
import { getAllInterviewQuestions } from "@/lib/content";
import { QuestionBankClient, type QuestionBankEntry } from "@/components/topic/QuestionBankClient";

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
  return { title: `${section.title} — Question Bank` };
}

export default async function QuestionBankPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionSlug } = await params;
  const section = getSection(sectionSlug);
  if (!section || !section.enabled) notFound();

  const raw = await getAllInterviewQuestions(sectionSlug);
  if (raw.length === 0) notFound();

  const entries: QuestionBankEntry[] = raw.map((r) => ({
    question: r.question,
    moduleId: r.moduleId,
    topicTitle: r.topic.title,
    topicHref: r.topic.href,
  }));

  return (
    <div>
      <div className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
            {section.title} — Question Bank
          </h1>
          <p className="mt-2 text-muted-foreground">
            Every technical-round question across {section.title}, filterable by module, difficulty, and type.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <QuestionBankClient entries={entries} modules={section.modules} />
      </div>
    </div>
  );
}
