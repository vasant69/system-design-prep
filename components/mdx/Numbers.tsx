import { Hash } from "lucide-react";
import type { ReactNode } from "react";

// Expects a plain <ul><li>label — value</li></ul> list as children.
export function Numbers({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-teal-500/25 bg-teal-500/[0.06] p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-300">
        <Hash className="h-3.5 w-3.5" />
        Numbers That Matter
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/90 [&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-1.5 [&_ul]:p-0 [&_li]:border-b [&_li]:border-border/50 [&_li]:pb-1.5 [&_li]:font-mono [&_li]:text-[13.5px] [&_li:last-child]:border-0 [&_li:last-child]:pb-0">
        {children}
      </div>
    </div>
  );
}
