// localStorage-backed progress tracking — no backend, matches the rest of
// the app's "everything lives in your browser" model. Plain functions here,
// paired with the useTopicProgress hook (which wires them to React via
// useSyncExternalStore) for anything that renders in a component.
export type TopicProgress = {
  completed: boolean;
  completedAt: string | null;
  bookmarked: boolean;
};

type ProgressStore = Record<string, TopicProgress>;

const STORAGE_KEY = "sd-progress";
const CHANGE_EVENT = "sd-progress-change";
const EMPTY_PROGRESS: TopicProgress = { completed: false, completedAt: null, bookmarked: false };

// useSyncExternalStore requires getSnapshot() to return a referentially
// stable value when nothing has changed — re-parsing localStorage on every
// call would return a new object each time and trigger React's "getSnapshot
// should be cached" infinite-loop warning. So we keep one in-memory copy
// and only replace it (a) on our own writes or (b) when another tab wrote
// to localStorage (via the "storage" event, which invalidates the cache).
let cachedStore: ProgressStore | null = null;

function loadStore(): ProgressStore {
  if (cachedStore) return cachedStore;
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cachedStore = raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    cachedStore = {};
  }
  return cachedStore;
}

function persistStore(next: ProgressStore) {
  cachedStore = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (quota, private browsing) — change still
    // applies for this session via the cached copy above
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

if (typeof window !== "undefined") {
  // Another tab changed localStorage — drop our cache so the next read
  // picks up the fresh value instead of serving a stale snapshot.
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY || e.key === null) cachedStore = null;
  });
}

export function topicKey(sectionSlug: string, slug: string): string {
  return `${sectionSlug}/${slug}`;
}

export function getProgress(key: string): TopicProgress {
  return loadStore()[key] ?? EMPTY_PROGRESS;
}

export function getAllProgress(): ProgressStore {
  return loadStore();
}

export function setCompleted(key: string, completed: boolean) {
  const store = loadStore();
  const current = store[key] ?? EMPTY_PROGRESS;
  persistStore({
    ...store,
    [key]: { ...current, completed, completedAt: completed ? new Date().toISOString() : null },
  });
}

export function setBookmarked(key: string, bookmarked: boolean) {
  const store = loadStore();
  const current = store[key] ?? EMPTY_PROGRESS;
  persistStore({ ...store, [key]: { ...current, bookmarked } });
}

/** Subscribes to same-tab changes (custom event) and cross-tab changes (storage event). */
export function subscribeToProgress(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
