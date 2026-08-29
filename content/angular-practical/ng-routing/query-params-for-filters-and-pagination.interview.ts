import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "qpfp-1",
    question: "List screen ki filter/pagination state kahan rakhoge — component state ya URL? Justify.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "URL query params. Benefits: shareable links (paste a filtered view), working back/forward (undo a filter change), refresh-safe (F5 keeps filters), bookmarkable. Component-only state loses all four. URL becomes the single source of truth; toolbar navigates, list reads.",
    detailedAnswer:
      "Pattern: toolbar components `router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true })`; list component `route.queryParamMap.pipe(debounceTime, switchMap(loadFromApi))`. Trade-offs: (1) rapid typing = history spam -> `replaceUrl: true` + debounce; (2) only serializable, user-meaningful state in URL (not `loading`, hovered row); (3) values are strings — coerce; (4) reset `page` on filter change. Server-side filtering ke saath ye especially clean — URL params practically API params ban jaate hain.",
    followUp: "Kaunsi list state URL me NAHI honi chahiye, aur kyun?",
  },
  {
    id: "qpfp-2",
    question: "`queryParamsHandling` ke options aur har ek ka use case.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`'merge'` — naye params ko existing ke saath combine (filter update jahan baaki filters bane rahein). `'preserve'` — current params rakho, naye ignore (ek related route par navigate karte hue same context carry). Omitted — poora query string replace (fresh navigation, jaise list se details).",
    detailedAnswer:
      "`'merge'` 90% list-filter cases. `'preserve'` tab jab aap ek naye route par ja rahe ho par current filters relevant rakhne hain (jaise `/employees` se `/employees/export` par jaate hue `?departmentId=4` carry karna). Default (replace) tab jab naya context hai aur purane params meaningless (details page par list ke filters nahi chahiye). Ek subtle case: `'merge'` ke saath ek param ko `null` karke specifically hatana — merge preserves others but respects explicit `null`.",
    followUp: "`'preserve'` aur manually `{ ...currentParams, ...newParams }` pass karne me kya farak?",
  },
  {
    id: "qpfp-3",
    question:
      "User page 5 par hai, ek naya search type karta hai, aur 'No results' dikhta hai jabki data hai. Kyun aur fix?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Search update ne `page=5` ko URL me chhod diya. Naye search ke filtered results me sirf 2 pages hain, to page 5 empty. Fix: jab bhi search/filter badle, `queryParams` me `page: 1` bhi set karo.",
    detailedAnswer:
      "`updateSearch(term) { this.router.navigate([], { relativeTo: this.route, queryParams: { search: term || null, page: 1 }, queryParamsHandling: 'merge', replaceUrl: true }); }`. General rule: koi bhi filter jo result-set ka size badalta hai, use page ko 1 par reset karna chahiye. Sort change par page rakhna usually theek (same set, different order) par debatable. Ek helper `patchQuery(partial, { resetPage = true })` bana lo taaki har call site consistent rahe.",
    followUp: "Sort change par page reset karna chahiye ya nahi — kis basis par decide karoge?",
  },
  {
    id: "qpfp-4",
    question:
      "Toolbar component aur list component alag hain. Filter change ko coordinate karne ka clean tareeka?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "URL ko intermediary banao: toolbar `router.navigate` se query params likhta hai; list `route.queryParamMap` se padhta hai aur data load karta hai. Dono components ek dusre ko jaante bhi nahi — URL decouple karta hai. No shared service needed for this.",
    detailedAnswer:
      "Alternative (shared store) bhi valid hai par URL approach free me sharing/back-button deta hai. Flow: `ToolbarComponent.onSearch(v)` -> navigate merge; `ListComponent` constructor me `this.data = toSignal(this.route.queryParamMap.pipe(debounceTime(250), map(toFilters), switchMap(f => this.api.list(f))))`. Toolbar ke inputs ko bhi URL se hydrate karo (`search = input('')` via `withComponentInputBinding`) taaki refresh par toolbar sahi values dikhaye. Ye 'URL as state bus' pattern list screens ke liye idiomatic hai.",
    followUp: "Toolbar ke input fields ko URL ke saath two-way sync rakhna — infinite loop se kaise bachoge?",
  },
  {
    id: "qpfp-5",
    question: "Query param values strings hote hain. Booleans aur numbers ko robustly kaise handle karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Explicit coercion at the read boundary: `+ (qp.get('page') ?? '1')` for numbers, `qp.get('active') === 'true'` for booleans. Ek `parseFilters(qp)` function jo raw `ParamMap` ko ek typed `Filters` object me convert karein — ek jagah.",
    detailedAnswer:
      "Anti-pattern: har jagah ad-hoc coercion. Better: `function toFilters(qp: ParamMap): Filters { return { search: qp.get('search') ?? '', page: Math.max(1, +(qp.get('page') ?? 1) || 1), active: qp.get('active') === 'true' ? true : qp.get('active') === 'false' ? false : undefined, sort: (qp.get('sort') as SortKey) ?? 'name' }; }`. Invalid values ko sane defaults par clamp karo (page `NaN` -> 1). Writing side par bhi consistent: booleans ko `'true'`/`null`, numbers ko string. `withComponentInputBinding` ke saath ek input `transform` (`numberAttribute`, `booleanAttribute`, ya custom) use kar sakte ho.",
    followUp: "`withComponentInputBinding` ke saath query param ke liye custom transform kaise likhoge (jaise CSV `?tags=a,b,c` -> `string[]`)?",
  },
];

export default questions;
