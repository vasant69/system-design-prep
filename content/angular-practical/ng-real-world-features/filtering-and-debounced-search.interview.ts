import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fds-1",
    question: "Debounced server-side search ka poora pipeline likho aur har operator ka reason batao.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`toObservable(querySignal).pipe(debounceTime(250), distinctUntilChanged(deepEqual), switchMap(q => api.getAll(q)))` -> `toSignal`. `debounceTime`: typing pause ka wait. `distinctUntilChanged`: no-op changes skip. `switchMap`: purani in-flight request cancel (no stale). Every filter setter also resets `page` to 1 and mirrors to query params.",
    detailedAnswer:
      "One combined `query` signal (search + filters + page + pageSize) is the single source. `debounceTime` reduces request count; `distinctUntilChanged` avoids re-querying when the same value is re-selected or debounce re-emits an equal object; `switchMap` guarantees the latest query wins. Add `tap(() => loading.set(true))` at the start and `finalize` inside the inner for a spinner. URL sync (`replaceUrl: true`) makes filtered views shareable and keeps history clean.",
    followUp: "`distinctUntilChanged` ke liye deep-equality function bade filter objects par slow ho sakta hai — alternative?",
  },
  {
    id: "fds-2",
    question: "Client-side vs server-side filtering — decision kaise loge, khaaskar pagination ke saath?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Client-side (a `computed` over a fully-loaded array) only when the whole dataset is small and already loaded (a few hundred rows max). Server-side (send `?search=&filter=`) for anything real, and it's the only correct choice with server-side pagination — because the client only holds one page.",
    detailedAnswer:
      "The trap: server-side pagination loads page N (20 rows); a `computed` filter over those 20 rows is nonsense — you'd 'filter' 20 of 800. If you want client-side filtering you must load everything (no pagination) and paginate client-side too. So: small bounded list -> load all, filter + paginate client-side (instant). Large list -> server does filtering, sorting, and pagination together, and the client just renders `Paged<T>`. Hybrid (load 500, filter client-side) is rarely worth the complexity.",
    followUp: "Ek lookup dropdown (200 options) ke liye search — client ya server?",
  },
  {
    id: "fds-3",
    question:
      "Multiple filters (search, department, status, date-range) ko state me kaise organize karoge, aur re-query kaise trigger hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "One `filters` signal object + separate `page`/`pageSize` signals. A `computed` `query` merges them. `toObservable(query)` -> debounce/distinct/switchMap -> API. Setters (`setSearch`, `setDepartment`, ...) `filters.update(...)` + `page.set(1)` + URL sync. Extract into a generic `ListStore`/`createListState()`.",
    detailedAnswer:
      "The single derived `query` signal means one pipeline and one URL-sync point instead of N subscriptions. `readFiltersFromUrl(queryParamMap)` on init hydrates state so refresh/share works. `toQueryParams(filters)` serializes back (drop `null`/empty, booleans as `'true'`/absent, arrays as CSV). Date ranges: two params (`from`, `to`). A `createListState<TFilters>()` factory (with `page`, `pageSize`, `sort`, a `filters` signal, the derived `query`, and URL sync) turns each list screen into: define `TFilters`, call the factory, render.",
    followUp: "URL se filters hydrate karte waqt invalid values (jaise `page=abc`) kaise handle karoge?",
  },
  {
    id: "fds-4",
    question:
      "Search box aur list alag components hain (toolbar aur table). Coordinate kaise karoge without tight coupling?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Use the URL as the bus: the toolbar `router.navigate([], { queryParams, merge, replaceUrl })`; the list reads `route.queryParamMap` and re-queries. Neither knows the other. Or a shared feature `ListStore` both inject. URL approach also gives sharing/back-button for free.",
    detailedAnswer:
      "URL-as-state: `SearchToolbar` writes `?search=`, `EmployeeTable` (or its page) does `route.queryParamMap.pipe(debounceTime, map(toFilters), switchMap(api.list))`. Hydrate the toolbar's inputs from the URL too so refresh shows the current search. Alternative: `EmployeesStore` (route `providers`) with `setSearch()` and a `query`/`rows` signal — cleaner if you also need non-URL state (selection, bulk). Avoid: toolbar `@Output` drilled through the page to the table, or `ViewChild` wiring — brittle.",
    followUp: "Toolbar inputs ko URL ke saath sync rakhna — feedback loop (URL -> input -> navigate -> URL) se kaise bachoge?",
  },
  {
    id: "fds-5",
    question: "Search results empty aane par UX — kaise design karoge? Aur 'search failed' vs 'no matches'?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Distinguish three states: loading (skeleton/overlay), error (a retry banner — 'Couldn't load results'), and empty-success (a friendly 'No employees match \"aar\" in Engineering' + a 'Clear filters' action). Never show a blank table with no explanation.",
    detailedAnswer:
      "State model: `loading` signal, `error` signal (`AppError | null`), and `rows` — `@if (loading()) {skeleton} @else if (error()) {retry} @else if (rows().length === 0) {empty-state} @else {table}`. The empty-state should echo the active filters ('No matches for these filters') and offer to clear them — a dead end with no way back is bad UX. On error, keep the previous rows visible if you have them, with an inline 'Retry'. Debounce means a transient empty state while typing is normal — don't flash 'No results' on every keystroke; only after the request settles.",
    followUp: "Typing ke dauran 'No results' flash ko kaise rokoge?",
  },
];

export default questions;
