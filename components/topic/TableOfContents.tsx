"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Scans the rendered article for h2/h3s (rehype-slug already gave them ids)
 * after mount, then tracks which one is in view via IntersectionObserver.
 * Reads the DOM rather than the MDX AST because by the time this renders,
 * `content` from compileMDX is already an opaque compiled React tree — this
 * is the simplest way to build a ToC from it without re-parsing anything.
 */
export function TableOfContents({ articleSelector = "#topic-article" }: { articleSelector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const nodes = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"));
    // One-time read of the already-rendered article's headings — can only
    // happen client-side after mount, not a subscription to an external
    // store that would warrant useSyncExternalStore.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent?.replace(/#$/, "").trim() ?? "",
        level: node.tagName === "H3" ? 3 : 2,
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.y - b.boundingClientRect.y);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [articleSelector]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      <ul className="mt-3 space-y-2 border-l border-border text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l pl-3 py-0.5 transition-colors",
                h.level === 3 && "pl-6",
                activeId === h.id
                  ? "border-sky-400 font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
