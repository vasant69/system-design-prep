"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeToggle() {
  // Assume dark for the very first render so it matches the server-rendered
  // markup exactly (no hydration mismatch) — the blocking init script in
  // <head> already applied the real class before this ever mounts, so we
  // just read it back once mounted and correct if the user was on light.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // One-time read of DOM state set by the pre-hydration init script —
    // document doesn't exist during SSR, so this can only happen client-side
    // after mount. Not an external-system subscription, just a single
    // correction if the user's stored preference was actually "light".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // localStorage unavailable (e.g. private browsing) — toggle still
      // works for this page load, it just won't persist across visits
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
