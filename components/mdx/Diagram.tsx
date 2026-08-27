"use client";

// Mermaid diagrams must render client-side (they need the DOM). We dynamic-
// import mermaid inside useEffect so it never touches SSR, and wrap the
// output in an overflow-x-auto container so large diagrams stay readable —
// scrollable rather than squashed — on phone screens.
import { useEffect, useId, useRef, useState } from "react";
import { getMermaid } from "@/lib/mermaid-client";

export function Diagram({ chart, caption }: { chart: string; caption?: string }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaid = await getMermaid();
      try {
        const { svg } = await mermaid.render(`diagram-${rawId}`, chart.trim());
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, rawId]);

  return (
    <figure className="my-6">
      <div className="rounded-xl border border-border bg-card p-4">
        {error ? (
          <p className="text-sm text-destructive">Diagram failed to render: {error}</p>
        ) : (
          <div
            ref={containerRef}
            className="flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:min-w-[420px] [&_svg]:max-w-none"
            role="img"
            aria-label={caption ?? "Architecture diagram"}
          />
        )}
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
