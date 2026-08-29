import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ssp-1",
    question: "Server-side pagination ka full front-end flow batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`page`/`pageSize` signals (mirrored to query params, hydrated from URL). A `computed` query merges them with filters/sort. `toObservable(query).pipe(switchMap(q => api.getAll(q)))` -> `toSignal` gives `Paged<T>`. `rows`, `total`, `totalPages` computeds. A dumb `Paginator` emits `pageChange`. Reset `page` to 1 on filter change.",
    detailedAnswer:
      "Contract: `GET /employees?page=&pageSize=&search=&sort=` -> `{ items, total, page, pageSize }`. `switchMap` cancels stale requests on rapid navigation. URL-as-state gives shareable/refresh-safe pages. Don't blank the table on page change — overlay or skeletons. Cap `pageSize`. For huge/streaming datasets use cursor pagination (`nextCursor`) instead, accepting you can't jump to an arbitrary page.",
    followUp: "Loading state ko page change par kaise dikhaoge bina table blank kiye?",
  },
  {
    id: "ssp-2",
    question: "Offset pagination (page/pageSize + total) aur cursor pagination — trade-offs.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Offset: can jump to any page, show 'page X of Y', but on large tables deep offsets are slow server-side, and rows shifting between requests cause skips/dupes. Cursor: stable across inserts/deletes, efficient for large/streaming data, powers 'load more' / infinite scroll, but can't jump to page 50 or show a total easily.",
    detailedAnswer:
      "Offset `LIMIT 20 OFFSET 10000` forces the DB to scan 10,020 rows — slow at depth. And if a row is inserted between fetching page 1 and page 2, page 2 repeats a row. Cursor (`WHERE id > lastId LIMIT 20`) is index-friendly and stable. UX: admin tables with page numbers -> offset. Feeds, chat, activity logs, mobile 'load more' -> cursor. Some APIs do hybrid (cursor + approximate total). Front-end: offset = a `Paginator` with numbers; cursor = a `nextCursor` signal + a 'Load more' button or an IntersectionObserver.",
    followUp: "Infinite scroll ko Angular me IntersectionObserver se kaise implement karoge?",
  },
  {
    id: "ssp-3",
    question:
      "User fast Prev/Next dabata hai aur kabhi-kabhi galat page ke rows dikhte hain. Diagnose aur fix.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Requests race — page 4's response arrives after page 5's. The fetch is probably `mergeMap`/nested `subscribe` or a manual `page.subscribe(p => api.get(p).subscribe(...))`. Fix: `toObservable(pageSignal).pipe(switchMap(p => api.getAll(p)))` so a new page cancels the previous request.",
    detailedAnswer:
      "`switchMap` guarantees latest-wins: subscribing to a new inner Observable unsubscribes the previous, and HttpClient cancels the in-flight XHR/fetch. Also disable Prev/Next while a request is pending, or debounce rapid clicks (`debounceTime(150)` on the page signal). Keep the previous page's rows visible during load so it doesn't flash. Mirror `page` to the URL after the successful fetch (or optimistically, then correct on error).",
    followUp: "Page change ke dauran Prev/Next disable karna vs previous rows dikhana — kaunsa UX behtar?",
  },
  {
    id: "ssp-4",
    question:
      "Pagination + filters + sort — teeno ek saath. State aur re-query kaise organize karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "One `computed` 'query' signal combining `page`, `pageSize`, `search`, `filters`, `sort`. `toObservable(query).pipe(debounceTime(200), distinctUntilChanged(deepEqual), switchMap(api.getAll))`. Any filter/sort setter also resets `page` to 1. All of it mirrored to query params. Encapsulate in a `ListStore`.",
    detailedAnswer:
      "The single query signal is the key — one source of truth, one pipeline, one place to mirror to the URL. `debounceTime` smooths search typing; `distinctUntilChanged` skips no-op changes (e.g. selecting the same filter). Setters: `setSearch(v) { this.search.set(v); this.page.set(1); }`. A generic `createListState<TFilters>()` factory (page/pageSize/sort + a filters signal + the derived query + URL sync) means every list screen is ~10 lines. Server sees `?page=&pageSize=&search=&departmentId=&sort=name:asc`.",
    followUp: "Ye `ListStore` ko route ke `providers` me rakhna vs component me — kya farak?",
  },
  {
    id: "ssp-5",
    question: "Pagination ke saath row selection (checkboxes) chahiye — selection page change par kya ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Decide the scope: (a) selection is per-page — clears on page change (simple, but 'select all' is confusing across pages); or (b) selection persists across pages — store `selectedIds: Set<number>` independent of the current page, and 'select all' offers 'all on this page' vs 'all N matching'.",
    detailedAnswer:
      "For a small app, per-page selection with a clear on `pageChange` is fine and predictable. For bulk operations over large results, persist `selectedIds` (a signal `Set`) and show a banner: 'All 20 on this page selected. Select all 842 matching?'. Bulk delete then either sends the id list or a filter ('delete all matching these filters') — the latter avoids sending 842 ids. Always show the selected count and a clear-selection action. Re-fetching a page should re-tick already-selected rows.",
    followUp: "'Select all 842 matching' ko backend ko kaise express karoge — id list ya filter?",
  },
];

export default questions;
