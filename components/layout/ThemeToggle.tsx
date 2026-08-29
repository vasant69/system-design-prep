"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Segmented Light / Dark control. The blocking init script in <head> has
 * already put the right class on <html> before this mounts, so we just read
 * it back once and render the matching state. The site now defaults to light,
 * which is also what the server renders, so the initial state is `false`.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function set(next: boolean) {
    if (next === isDark) return;
    setIsDark(next);
    const root = document.documentElement;
    // brief colour cross-fade (respects prefers-reduced-motion via CSS)
    root.classList.add("theme-transition");
    root.classList.toggle("dark", next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 300);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* private mode: still toggles for this page load, just won't persist */
    }
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="relative flex items-center rounded-full border border-border bg-secondary/60 p-0.5 text-muted-foreground"
    >
      {/* sliding thumb */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-card shadow-sm ring-1 ring-border transition-transform duration-200 ease-out",
          isDark ? "translate-x-[calc(100%+2px)]" : "translate-x-0",
        )}
      />
      <button
        type="button"
        onClick={() => set(false)}
        aria-pressed={!isDark}
        aria-label="Light mode"
        className={cn(
          "relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:px-3",
          !isDark && "text-foreground",
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button
        type="button"
        onClick={() => set(true)}
        aria-pressed={isDark}
        aria-label="Dark mode"
        className={cn(
          "relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:px-3",
          isDark && "text-foreground",
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
