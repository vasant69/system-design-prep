"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A shrunk, non-interactive preview of a topic's diagram for the section
 * page's topic list — lets you spot a topic by its diagram's shape while
 * scanning, without loading/rendering all ~40 diagrams up front. Renders
 * mermaid's real SVG output, then scales it down with a CSS transform
 * (mermaid has no native "thumbnail" size) once it scrolls into view.
 */
export function DiagramThumbnail({ chart }: { chart: string }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRendered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rendered) return;
    let cancelled = false;

    (async () => {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" });
      try {
        const { svg } = await mermaid.render(`thumb-${rawId}`, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            // Mermaid sets width="100%" directly on the <svg>, which would
            // size it to 100% of this tiny container BEFORE the CSS scale
            // transform below even applies — shrinking it twice over. And
            // simply removing width/height leaves the browser's "no
            // intrinsic size" default (~replaced-element fallback), not a
            // 1:1 mapping of the viewBox — so we set the pixel size from
            // the viewBox explicitly, giving a predictable natural size for
            // the transform to then scale down into the thumbnail box.
            const viewBox = svgEl.getAttribute("viewBox");
            const dims = viewBox?.split(/\s+/).map(Number);
            if (dims && dims.length === 4) {
              svgEl.style.width = `${dims[2]}px`;
              svgEl.style.height = `${dims[3]}px`;
            }
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.maxWidth = "none";
          }
        }
      } catch {
        // malformed/unsupported diagram — just show nothing rather than an error in a thumbnail
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rendered, chart, rawId]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="hidden h-12 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-background/60 sm:block"
    >
      <div ref={containerRef} className="origin-top-left scale-[0.12]" />
    </div>
  );
}
