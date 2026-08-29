import { MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";

// Warm amber "chai conversation" box — the main teaching body. Visually the
// opposite of SimpleDefinition's cool blue on purpose.
export function Hinglish({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
        <MessageSquareText className="h-3.5 w-3.5" />
        Hinglish Deep Explanation
      </div>
      <div className="space-y-4 text-[15px] leading-[1.8] text-foreground/90 [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px]">
        {children}
      </div>
    </div>
  );
}
