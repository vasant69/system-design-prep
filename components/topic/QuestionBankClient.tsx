"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FencedText } from "@/components/topic/FencedText";
import type { InterviewQuestion, InterviewQuestionType, ModuleConfig } from "@/lib/types";

const TYPE_STYLES: Record<InterviewQuestionType, string> = {
  conceptual: "border-sky-500/30 text-sky-300",
  "code-output": "border-violet-500/30 text-violet-300",
  scenario: "border-amber-500/30 text-amber-300",
  trap: "border-red-500/30 text-red-300",
  coding: "border-emerald-500/30 text-emerald-300",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "border-emerald-500/30 text-emerald-300",
  intermediate: "border-amber-500/30 text-amber-300",
  advanced: "border-red-500/30 text-red-300",
};

export type QuestionBankEntry = {
  question: InterviewQuestion;
  moduleId: string;
  topicTitle: string;
  topicHref: string;
};

export function QuestionBankClient({ entries, modules }: { entries: QuestionBankEntry[]; modules: ModuleConfig[] }) {
  const [moduleFilter, setModuleFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (moduleFilter !== "all" && e.moduleId !== moduleFilter) return false;
      if (difficultyFilter !== "all" && e.question.difficulty !== difficultyFilter) return false;
      if (typeFilter !== "all" && e.question.type !== typeFilter) return false;
      if (q && !e.question.question.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, moduleFilter, difficultyFilter, typeFilter, search]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="h-9 min-w-[200px] flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-sky-500/50"
        />
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-2 text-sm"
        >
          <option value="all">All modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-2 text-sm"
        >
          <option value="all">All difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-2 text-sm"
        >
          <option value="all">All types</option>
          <option value="conceptual">Conceptual</option>
          <option value="code-output">Code Output</option>
          <option value="scenario">Scenario</option>
          <option value="trap">Trap</option>
          <option value="coding">Coding</option>
        </select>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {filtered.length} question{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-3">
        {filtered.map((e) => {
          const open = openId === e.question.id;
          return (
            <div key={e.question.id} className="rounded-lg border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : e.question.id)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
                aria-expanded={open}
              >
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className={cn("text-[10px]", TYPE_STYLES[e.question.type])}>
                      {e.question.type}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px]", DIFFICULTY_STYLES[e.question.difficulty])}>
                      {e.question.difficulty}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{e.topicTitle}</span>
                  </div>
                  <FencedText text={e.question.question} className="text-sm font-medium text-foreground [&_pre]:text-left" />
                </div>
              </button>
              {open && (
                <div className="border-t border-border px-4 pb-4 pt-3">
                  <div className="mb-3 rounded-md border border-sky-500/20 bg-sky-500/5 p-3 text-sm text-sky-100">
                    <span className="font-semibold text-sky-300">Say this first: </span>
                    {e.question.shortAnswer}
                  </div>
                  <FencedText text={e.question.detailedAnswer} className="space-y-3 text-sm leading-relaxed text-foreground/90" />
                  <Link href={e.topicHref} className="mt-3 inline-block text-sm text-sky-400 hover:text-sky-300">
                    Read the full topic →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No questions match these filters.
          </p>
        )}
      </div>
    </div>
  );
}
