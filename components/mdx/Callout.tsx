import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    className: "border-emerald-500/30 bg-emerald-500/10",
    iconClassName: "text-emerald-400",
    labelClassName: "text-emerald-300",
    label: "Tip",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/10",
    iconClassName: "text-amber-400",
    labelClassName: "text-amber-300",
    label: "Warning",
  },
  trap: {
    icon: Info,
    className: "border-red-500/30 bg-red-500/10",
    iconClassName: "text-red-400",
    labelClassName: "text-red-300",
    label: "Interview Trap",
  },
} as const;

type CalloutType = keyof typeof CALLOUT_STYLES;

export function Callout({ type = "tip", children }: { type?: CalloutType; children: ReactNode }) {
  const style = CALLOUT_STYLES[type];
  const Icon = style.icon;
  return (
    <div className={cn("my-5 flex gap-3 rounded-lg border p-4 text-sm leading-relaxed", style.className)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", style.iconClassName)} />
      <div className="[&>p]:m-0">
        <div className={cn("mb-1 text-xs font-semibold uppercase tracking-wide", style.labelClassName)}>
          {style.label}
        </div>
        {children}
      </div>
    </div>
  );
}
