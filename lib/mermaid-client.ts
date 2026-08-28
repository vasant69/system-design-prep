// Diagram.tsx and DiagramThumbnail.tsx both render mermaid charts, and a
// section page can mount dozens of DiagramThumbnails at once as they scroll
// into view. Each component previously called mermaid.initialize() on its
// own mount — with many diagrams initializing/rendering concurrently,
// initialize() calls interleaving with in-flight render() calls from
// siblings corrupts mermaid's shared parser state, causing otherwise-valid
// charts to intermittently render mermaid's own "Syntax error in text"
// bomb graphic instead of throwing (so the try/catch around render() never
// even sees it). Initializing exactly once, memoized, fixes this at the
// root instead of racing.
let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

export function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        // Every diagram on the site renders in a sketchy, hand-drawn style
        // (rough.js under the hood) — it reads as "notes on paper" rather
        // than a formal architecture render, which suits a study site.
        look: "handDrawn",
        securityLevel: "strict",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        // Without this, a genuine parse error doesn't reject render() — it
        // resolves with mermaid's own "Syntax error in text" bomb-graphic
        // SVG, which both Diagram and DiagramThumbnail would then happily
        // inject as if it were the real chart, bypassing their try/catch
        // entirely. This makes render() actually reject instead.
        suppressErrorRendering: true,
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}
