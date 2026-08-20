"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** j/k (or arrow left/right) jump to the previous/next topic — ignored while typing in an input. */
export function KeyboardNav({ prevHref, nextHref }: { prevHref?: string; nextHref?: string }) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if ((e.key === "j" || e.key === "ArrowRight") && nextHref) {
        router.push(nextHref);
      } else if ((e.key === "k" || e.key === "ArrowLeft") && prevHref) {
        router.push(prevHref);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prevHref, nextHref, router]);

  return null;
}
