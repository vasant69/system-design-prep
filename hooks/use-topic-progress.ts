"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getProgress, setBookmarked, setCompleted, subscribeToProgress, topicKey } from "@/lib/progress";

const SERVER_SNAPSHOT = { completed: false, completedAt: null, bookmarked: false };

/**
 * Reads/writes one topic's progress via useSyncExternalStore — the correct
 * primitive for a value that lives outside React (localStorage) and can
 * change from other components or other browser tabs.
 */
export function useTopicProgress(sectionSlug: string, slug: string) {
  const key = topicKey(sectionSlug, slug);

  const progress = useSyncExternalStore(
    subscribeToProgress,
    () => getProgress(key),
    () => SERVER_SNAPSHOT,
  );

  const toggleCompleted = useCallback(() => setCompleted(key, !progress.completed), [key, progress.completed]);
  const toggleBookmarked = useCallback(() => setBookmarked(key, !progress.bookmarked), [key, progress.bookmarked]);

  return { ...progress, toggleCompleted, toggleBookmarked };
}
