import type { Metadata } from "next";
import { dictionaryEntries } from "@/lib/dictionary-data";
import { DictionaryClient } from "@/components/dictionary/DictionaryClient";

export const metadata: Metadata = {
  title: "Dictionary",
  description: "Every word a developer actually hears at work — one-line Hinglish meanings, no fluff.",
};

export default function DictionaryPage() {
  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight sm:text-5xl">
            Dictionary
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Every word a developer actually hears at work — one-line Hinglish meanings, no fluff. Search or jump by
            category to look one up in five seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-3 py-1">{dictionaryEntries.length} words</span>
          </div>
        </div>
      </div>

      <DictionaryClient entries={dictionaryEntries} />
    </div>
  );
}
