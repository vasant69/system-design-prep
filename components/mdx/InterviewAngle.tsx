import { MessageCircleQuestion } from "lucide-react";
import type { ReactNode } from "react";

export function InterviewAngle({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
        <MessageCircleQuestion className="h-3.5 w-3.5" />
        Interview Angle
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90 [&>p]:m-0">{children}</div>
    </div>
  );
}
