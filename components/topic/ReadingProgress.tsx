"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Thin fixed bar under the header showing scroll progress through the article. */
export function ReadingProgress({ colorClassName = "bg-sky-400" }: { colorClassName?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sticky top-14 z-30 h-0.5 w-full bg-border/60">
      <div
        className={cn("h-full transition-[width] duration-150 ease-out", colorClassName)}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
