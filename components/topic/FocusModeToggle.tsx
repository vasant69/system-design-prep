"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Hides the site header and the TOC sidebar via a `focus-mode` class on
 * <body> (see globals.css) — session-only, resets on navigation. Kept as
 * plain component state rather than localStorage since "distraction-free
 * for this reading session" is the actual intent, not a lasting preference.
 */
export function FocusModeToggle() {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("focus-mode", focused);
    return () => {
      document.body.classList.remove("focus-mode");
    };
  }, [focused]);

  return (
    <Button variant="outline" size="sm" onClick={() => setFocused((f) => !f)} className="gap-1.5">
      {focused ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      {focused ? "Exit focus" : "Focus mode"}
    </Button>
  );
}
