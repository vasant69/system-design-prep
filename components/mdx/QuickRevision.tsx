import { Zap } from "lucide-react";
import type { ReactNode } from "react";

// data-quick-revision marks this block so a later cheatsheet-mode page can
// find and collect these bullets across topics without re-rendering the
// full page (see /revision?mode=cheatsheet, built in Phase 3).
export function QuickRevision({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-5" data-quick-revision>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">
        <Zap className="h-3.5 w-3.5" />
        Quick Revision
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/90 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:marker:text-fuchsia-600 dark:text-fuchsia-400">
        {children}
      </div>
    </div>
  );
}
