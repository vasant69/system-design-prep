"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  INTERVIEW_PREP_META,
  INTERVIEW_PREP_PARTS,
  SCENARIO_PREP_CATEGORIES,
  SCENARIO_PREP_META,
  type IQCategory,
  type IQQuestion,
} from "@/lib/interview-questions";

// Per-visitor "I've reviewed this" state, same localStorage-only +
// useSyncExternalStore approach as lib/progress.ts. No backend. The cached
// snapshot keeps getSnapshot referentially stable between real changes.
const STORAGE_KEY = "sd-interview-prep-reviewed";
const EMPTY: ReadonlySet<string> = new Set();

let cached: ReadonlySet<string> | null = null;

function readStore(): ReadonlySet<string> {
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    cached = new Set();
  }
  return cached;
}

function writeStore(next: ReadonlySet<string>) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    /* quota / private browsing — non-fatal */
  }
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cached = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function useReviewed() {
  const reviewed = useSyncExternalStore(
    subscribe,
    readStore,
    () => EMPTY,
  );
  const toggle = (id: string) => {
    const next = new Set(reviewed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStore(next);
  };
  const reset = () => writeStore(new Set());
  return { reviewed, toggle, reset };
}

// Render inline `code` and **bold** spans without pulling in a markdown lib.
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-secondary px-1 py-0.5 font-mono text-[0.85em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// Lightweight markdown for worked answers: ```fenced code blocks, blank-line
// paragraphs, `- ` bullet lists, plus the inline formatting above.
function AnswerBody({ text }: { text: string }) {
  const segments = text.split(/```[^\n]*\n([\s\S]*?)```/g);
  return (
    <div className="space-y-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
      {segments.map((seg, i) => {
        // Odd indices are the captured contents of a fenced code block.
        if (i % 2 === 1) {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-md border border-border bg-background p-3 text-xs leading-relaxed"
            >
              <code className="font-mono text-foreground">{seg.replace(/\n$/, "")}</code>
            </pre>
          );
        }
        const blocks = seg.split(/\n{2,}/).filter((b) => b.trim().length > 0);
        return blocks.map((block, bi) => {
          const lines = block.split("\n");
          if (lines.every((l) => l.trimStart().startsWith("- "))) {
            return (
              <ul key={`${i}-${bi}`} className="list-disc space-y-1 pl-5">
                {lines.map((l, li) => (
                  <li key={li}>
                    <InlineText text={l.trimStart().slice(2)} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={`${i}-${bi}`}>
              {lines.map((l, li) => (
                <span key={li}>
                  {li > 0 && <br />}
                  <InlineText text={l} />
                </span>
              ))}
            </p>
          );
        });
      })}
    </div>
  );
}

function matchesQuery(q: IQQuestion, needle: string) {
  if (!needle) return true;
  const hay = (q.q + " " + (q.followups ?? []).join(" ")).toLowerCase();
  return hay.includes(needle);
}

type FilteredCategory = Omit<IQCategory, "questions"> & {
  questions: { q: IQQuestion; id: string }[];
};

function filterCategories(cats: IQCategory[], needle: string): FilteredCategory[] {
  return cats
    .map((cat) => ({
      ...cat,
      questions: cat.questions
        .map((q, i) => ({ q, id: `${cat.id}-${i}` }))
        .filter(({ q }) => matchesQuery(q, needle)),
    }))
    .filter((cat) => cat.questions.length > 0);
}

const EVERY_QUESTION_ID = [
  ...INTERVIEW_PREP_PARTS.flatMap((p) => p.categories),
  ...SCENARIO_PREP_CATEGORIES,
].flatMap((cat) => cat.questions.map((_, i) => `${cat.id}-${i}`));

function CategoryPanel({
  cat,
  reviewed,
  onToggle,
}: {
  cat: FilteredCategory;
  reviewed: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const label = cat.numLabel ?? cat.number;
  return (
    <details
      id={cat.id}
      open
      className="group scroll-mt-32 rounded-xl border border-border bg-card"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
        <span>
          {label}. {cat.title}
        </span>
        <span className="ml-auto shrink-0 text-xs font-normal text-muted-foreground">
          {cat.questions.length}
        </span>
      </summary>

      <div className="border-t border-border px-4 py-2">
        {cat.note && (
          <p className="py-2 text-xs italic text-muted-foreground">{cat.note}</p>
        )}
        <ol className="divide-y divide-border">
          {cat.questions.map(({ q, id }, idx) => {
            const isReviewed = reviewed.has(id);
            return (
              <li key={id} className="flex gap-3 py-3">
                <button
                  type="button"
                  onClick={() => onToggle(id)}
                  aria-pressed={isReviewed}
                  aria-label="Mark reviewed"
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    isReviewed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                  )}
                >
                  {isReviewed && <Check className="h-3.5 w-3.5" />}
                </button>
                <div className="min-w-0 flex-1 text-sm">
                  <p
                    className={cn(
                      isReviewed &&
                        "text-muted-foreground line-through decoration-muted-foreground/40",
                    )}
                  >
                    <span className="mr-1.5 tabular-nums text-muted-foreground">
                      {idx + 1}.
                    </span>
                    <InlineText text={q.q} />
                  </p>
                  {q.followups && q.followups.length > 0 && (
                    <ul
                      className={cn(
                        "mt-1.5 space-y-1 border-l-2 border-border pl-3",
                        isReviewed && "opacity-60",
                      )}
                    >
                      {q.followups.map((f, fi) => (
                        <li
                          key={fi}
                          className="text-[0.8125rem] text-muted-foreground"
                        >
                          <InlineText text={f} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.answer && (
                    <details className="group/ans mt-2 rounded-lg border border-border bg-secondary/40">
                      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground [&::-webkit-details-marker]:hidden">
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-open/ans:rotate-90" />
                        Answer
                      </summary>
                      <div className="border-t border-border px-3 py-2.5">
                        <AnswerBody text={q.answer} />
                      </div>
                    </details>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </details>
  );
}

export function InterviewQuestionBank() {
  const { reviewed, toggle, reset } = useReviewed();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();

  const filteredParts = useMemo(
    () =>
      INTERVIEW_PREP_PARTS.map((part) => ({
        ...part,
        categories: filterCategories(part.categories, needle),
      })).filter((part) => part.categories.length > 0),
    [needle],
  );

  const filteredScenarios = useMemo(
    () => filterCategories(SCENARIO_PREP_CATEGORIES, needle),
    [needle],
  );

  const reviewedCount = reviewed.size;
  const total = EVERY_QUESTION_ID.length;
  const pct = total ? Math.round((reviewedCount / total) * 100) : 0;
  const nothingMatches =
    filteredParts.length === 0 && filteredScenarios.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <header className="border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Interview Mode
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {INTERVIEW_PREP_META.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Profile:</span>{" "}
          {INTERVIEW_PREP_META.profile}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Scope:</span>{" "}
          {INTERVIEW_PREP_META.scope}
        </p>
        <p className="mt-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
          {INTERVIEW_PREP_META.disclaimer}
        </p>
      </header>

      {/* Controls */}
      <div className="sticky top-16 z-20 -mx-4 mt-6 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <Input
          type="search"
          placeholder="Filter questions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {reviewedCount} / {total} reviewed
          </span>
          {reviewedCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Jump nav */}
      <nav className="mt-8 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {filteredParts.map((part) => (
          <div key={part.id} className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {part.label} — {part.title}
            </p>
            <ul className="mt-1">
              {part.categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {cat.numLabel ?? cat.number}. {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filteredScenarios.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Scenario — How Would You Build X
            </p>
            <ul className="mt-1">
              {filteredScenarios.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {cat.number}. {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Theory bank */}
      <div className="mt-10 space-y-14">
        {filteredParts.map((part) => (
          <section key={part.id}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
              {part.label} — {part.title}
            </h2>
            <div className="mt-6 space-y-4">
              {part.categories.map((cat) => (
                <CategoryPanel
                  key={cat.id}
                  cat={cat}
                  reviewed={reviewed}
                  onToggle={toggle}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Scenario bank */}
      {filteredScenarios.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
            {SCENARIO_PREP_META.title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {SCENARIO_PREP_META.whySeparate}
          </p>
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium">
              {SCENARIO_PREP_META.checklistTitle}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {SCENARIO_PREP_META.checklist.map((item, i) => (
                <li key={i}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 space-y-4">
            {filteredScenarios.map((cat) => (
              <CategoryPanel
                key={cat.id}
                cat={cat}
                reviewed={reviewed}
                onToggle={toggle}
              />
            ))}
          </div>
        </section>
      )}

      {nothingMatches && (
        <p className="mt-10 text-sm text-muted-foreground">
          No questions match “{query}”.
        </p>
      )}
    </div>
  );
}
