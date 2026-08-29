import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

const STYLES: Record<Difficulty, string> = {
  beginner: "border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  intermediate: "border-amber-500/30 text-amber-700 dark:text-amber-300",
  advanced: "border-red-500/30 text-red-700 dark:text-red-300",
};

const LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={cn(STYLES[difficulty])}>
      {LABELS[difficulty]}
    </Badge>
  );
}
