"use client";

import { useState } from "react";
import { ChevronDown, MessageSquareCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FencedText } from "@/components/topic/FencedText";
import type { InterviewQuestion, InterviewQuestionType } from "@/lib/types";

const TYPE_LABELS: Record<InterviewQuestionType, string> = {
  conceptual: "Conceptual",
  "code-output": "Code Output",
  scenario: "Scenario",
  trap: "Trap",
  coding: "Coding",
};

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

function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Q{index + 1}</span>
            <Badge variant="outline" className={cn("text-[10px]", TYPE_STYLES[q.type])}>
              {TYPE_LABELS[q.type]}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px]", DIFFICULTY_STYLES[q.difficulty])}>
              {q.difficulty}
            </Badge>
            {q.askedAt && q.askedAt.length > 0 && (
              <span className="text-[11px] text-muted-foreground">
                Asked at: {q.askedAt.join(", ")}
              </span>
            )}
          </div>
          <FencedText text={q.question} className="text-sm font-medium text-foreground [&_pre]:text-left" />
          {!open && <p className="mt-1 text-xs text-muted-foreground">{q.shortAnswer}</p>}
        </div>
        <ChevronDown
          className={cn("mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="mb-3 rounded-md border border-sky-500/20 bg-sky-500/5 p-3 text-sm text-sky-100">
            <span className="font-semibold text-sky-300">Say this first: </span>
            {q.shortAnswer}
          </div>

          <FencedText text={q.detailedAnswer} className="space-y-3 text-sm leading-relaxed text-foreground/90" />

          {q.followUp && (
            <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-sm">
              <span className="font-semibold text-foreground">Likely follow-up: </span>
              <span className="text-foreground/80">{q.followUp}</span>
            </div>
          )}

          {q.redFlag && (
            <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
              <span className="font-semibold text-red-300">Red flag answer: </span>
              {q.redFlag}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TechnicalRoundQuestions({ questions }: { questions: InterviewQuestion[] }) {
  if (questions.length === 0) return null;

  return (
    <div className="mt-14 border-t border-border pt-8">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquareCode className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">
          Technical Round Questions
        </h2>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
      </div>
    </div>
  );
}
