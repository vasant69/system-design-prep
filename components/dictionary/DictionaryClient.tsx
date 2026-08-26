"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DictionaryEntry } from "@/lib/dictionary-data";

const ALL_CATEGORY = "All";

export function DictionaryClient({ entries }: { entries: DictionaryEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORY);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) set.add(e.category);
    return [ALL_CATEGORY, ...Array.from(set).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entries;
    if (category !== ALL_CATEGORY) {
      list = list.filter((e) => e.category === category);
    }
    if (q) {
      list = list.filter(
        (e) => e.term.toLowerCase().includes(q) || e.meaning.toLowerCase().includes(q),
      );
      list = [...list].sort((a, b) => {
        const aStarts = a.term.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.term.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.term.localeCompare(b.term);
      });
    } else {
      list = [...list].sort((a, b) => a.term.localeCompare(b.term));
    }
    return list;
  }, [entries, query, category]);

  const grouped = useMemo(() => {
    const groups = new Map<string, DictionaryEntry[]>();
    for (const e of filtered) {
      const letter = /[a-zA-Z]/.test(e.term[0]) ? e.term[0].toUpperCase() : "#";
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push(e);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a word (e.g. latency, cache, idempotent...)"
            className="h-10 pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
                  : "border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "word" : "words"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No word matches &quot;{query}&quot;.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {grouped.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg font-medium text-amber-400">
                {letter}
              </h2>
              <ul className="divide-y divide-border rounded-xl border border-border bg-card/40">
                {items.map((e) => (
                  <li key={e.term} className="flex flex-col gap-0.5 p-3.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <span className="shrink-0 font-semibold text-foreground">{e.term}</span>
                    <span className="hidden text-muted-foreground sm:inline">=</span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{e.meaning}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
