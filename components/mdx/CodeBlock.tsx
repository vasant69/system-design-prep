"use client";

// Custom <pre> renderer for MDX code fences: rehype-pretty-code (Shiki) does
// the syntax highlighting at build time, this just adds the copy button and
// a horizontally-scrollable container so long lines don't break mobile layout.
import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";

export function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable (e.g. insecure context) — fail silently
    }
  }

  return (
    <div className="group relative my-5">
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto rounded-lg border border-border bg-[#0d1117] p-4 text-[13px] leading-relaxed"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-2 top-2 rounded-md border border-border/60 bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
