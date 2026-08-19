import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";

// Deliberately the most "textbook" looking box on the page — cool blue,
// crisp border — so the eye instantly separates "what I'd say in an
// interview" from the Hinglish explanation below it.
export function SimpleDefinition({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-sky-500/30 bg-sky-500/[0.07] p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-300">
        <BookOpen className="h-3.5 w-3.5" />
        Simple English Definition
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/90 [&>p]:m-0 [&>p+p]:mt-2">{children}</div>
    </div>
  );
}
