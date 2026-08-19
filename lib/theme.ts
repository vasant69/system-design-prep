// Single source of truth for the theme localStorage key, shared between the
// blocking init script in app/layout.tsx (which must inline this value as a
// string literal, since it runs before any JS module loads) and ThemeToggle.
export const THEME_STORAGE_KEY = "sd-theme";
export type Theme = "light" | "dark";

/**
 * Runs synchronously in <head>, before first paint, so the correct theme
 * class is on <html> before the browser ever renders — no flash of the
 * wrong theme on load. Defaults to dark per the site's dark-first design.
 * Kept as a plain string (not imported) because it's injected verbatim
 * into a <script> tag, which can't reach into app modules.
 */
export function getThemeInitScript(): string {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY,
  )});var d=t?t==="dark":true;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
}
