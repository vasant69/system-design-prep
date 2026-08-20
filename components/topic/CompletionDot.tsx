"use client";

import { CheckCircle2 } from "lucide-react";
import { useTopicProgress } from "@/hooks/use-topic-progress";

/** Small checkmark shown next to a topic in a list once it's marked complete. */
export function CompletionDot({ sectionSlug, slug }: { sectionSlug: string; slug: string }) {
  const { completed } = useTopicProgress(sectionSlug, slug);
  if (!completed) return null;
  return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-label="Completed" />;
}
