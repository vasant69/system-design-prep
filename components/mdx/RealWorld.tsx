import { Building2 } from "lucide-react";
import type { ReactNode } from "react";

export function RealWorld({ company, children }: { company: string; children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-violet-500/25 bg-violet-500/[0.06] p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
        <Building2 className="h-3.5 w-3.5" />
        Real World — {company}
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90 [&>p]:m-0">{children}</div>
    </div>
  );
}
