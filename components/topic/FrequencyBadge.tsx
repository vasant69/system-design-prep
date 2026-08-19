import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InterviewFrequency } from "@/lib/types";

const STYLES: Record<InterviewFrequency, string> = {
  "very-high": "border-red-500/30 text-red-300",
  high: "border-amber-500/30 text-amber-300",
  medium: "border-sky-500/30 text-sky-300",
  low: "border-muted-foreground/30 text-muted-foreground",
};

const LABELS: Record<InterviewFrequency, string> = {
  "very-high": "Asked very often",
  high: "Asked often",
  medium: "Asked sometimes",
  low: "Rarely asked",
};

export function FrequencyBadge({ frequency }: { frequency: InterviewFrequency }) {
  return (
    <Badge variant="outline" className={cn("gap-1", STYLES[frequency])}>
      <Flame className="h-3 w-3" />
      {LABELS[frequency]}
    </Badge>
  );
}
