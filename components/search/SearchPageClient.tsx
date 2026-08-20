"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DifficultyBadge } from "@/components/topic/DifficultyBadge";
import type { SearchDoc } from "@/lib/search-index";
import type { Difficulty } from "@/lib/types";

export function SearchPageClient({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "englishDefinition", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [docs],
  );

  const results = query.trim() ? fuse.search(query, { limit: 40 }).map((r) => r.item) : docs;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">Search</h1>
      <p className="mt-2 text-muted-foreground">Every topic, searchable by title, tag, or definition.</p>

      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, tags, definitions..."
          className="pl-9"
        />
      </div>

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {results.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No topics found.</li>}
        {results.map((doc) => (
          <li key={doc.href}>
            <Link href={doc.href} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-card">
              <div className="min-w-0">
                <div className="font-medium">{doc.title}</div>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{doc.englishDefinition}</p>
              </div>
              <DifficultyBadge difficulty={doc.difficulty as Difficulty} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
