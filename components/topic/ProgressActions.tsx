"use client";

import { Bookmark, BookmarkCheck, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTopicProgress } from "@/hooks/use-topic-progress";
import { cn } from "@/lib/utils";

export function ProgressActions({ sectionSlug, slug }: { sectionSlug: string; slug: string }) {
  const { completed, bookmarked, toggleCompleted, toggleBookmarked } = useTopicProgress(sectionSlug, slug);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={completed ? "default" : "outline"}
        size="sm"
        onClick={toggleCompleted}
        className={cn("gap-1.5", completed && "bg-emerald-600 text-white hover:bg-emerald-600/90")}
      >
        {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {completed ? "Completed" : "Mark as complete"}
      </Button>
      <Button
        variant={bookmarked ? "default" : "outline"}
        size="sm"
        onClick={toggleBookmarked}
        className={cn("gap-1.5", bookmarked && "bg-fuchsia-600 text-white hover:bg-fuchsia-600/90")}
      >
        {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {bookmarked ? "Bookmarked" : "Revise later"}
      </Button>
    </div>
  );
}
