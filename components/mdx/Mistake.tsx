import { XCircle } from "lucide-react";
import type { ReactNode } from "react";

// Small and stackable on purpose — a topic usually lists 3-5 of these in a
// row under "Common Mistakes", not one big block.
export function Mistake({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 flex gap-2.5 rounded-lg border border-red-500/25 bg-red-500/[0.06] p-3.5 text-sm leading-relaxed text-foreground/90">
      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
      <div className="[&>p]:m-0">{children}</div>
    </div>
  );
}
