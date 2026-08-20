// Tiny event bus so SiteHeader's "Search" button (and the KeyboardNav "/"
// shortcut) can open the CommandPalette even though they're independent
// components mounted at different points in the tree — avoids a context
// provider for what's just a single "open" signal.
const EVENT = "sd-open-command-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(EVENT));
}

export function onOpenCommandPalette(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
