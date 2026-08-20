"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { FileText } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { onOpenCommandPalette } from "@/lib/command-palette-bus";
import type { SearchDoc } from "@/lib/search-index";

export function CommandPalette({ docs }: { docs: SearchDoc[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

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

  const results = useMemo(() => {
    if (!query.trim()) return docs.slice(0, 8);
    return fuse.search(query, { limit: 20 }).map((r) => r.item);
  }, [query, fuse, docs]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        const target = e.target as HTMLElement | null;
        const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
        if (e.key === "/" && typing) return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => onOpenCommandPalette(() => setOpen(true)), []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search topics"
      description="Search across every topic's title, tags, and definition"
    >
      <Command shouldFilter={false}>
        <CommandInput placeholder="Search topics, tags, definitions..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>No topics found.</CommandEmpty>
          <CommandGroup heading={query.trim() ? "Results" : "Jump to a topic"}>
            {results.map((doc) => (
              <CommandItem key={doc.href} value={doc.href} onSelect={() => go(doc.href)} className="gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{doc.title}</span>
                  <span className="truncate text-xs text-muted-foreground">{doc.sectionTitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
