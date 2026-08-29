import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "smss-1",
    question: "Angular app me state management kaise approach karoge? Ek hierarchy do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Lowest-level-that-works: (1) local component signal; (2) lifted to a common parent; (3) feature-scoped store (service at route providers); (4) app-wide store (`providedIn: 'root'`); (5) server state as an HTTP cache / `resource()`; (6) URL query params for shareable view state. Promote upward only when sharing demands it.",
    detailedAnswer:
      "Zyadatar state local ya feature-scoped hoti hai. App-wide sirf genuinely cross-cutting cheezein (auth, permissions, theme, notifications). Server state ko client 'source of truth' mat samjho — wo ek cache hai jise staleness/refetch/invalidation chahiye. Filters/page/selected-id URL me best (back button, sharing). Ek chhota injectable store (signal + computed selectors + methods) 80% needs cover karta hai; NgRx/SignalStore tab jab scale/team/tooling demand kare.",
    followUp: "Server state ke liye ek dedicated query library (jaise TanStack Query for Angular) kab worth hai?",
  },
  {
    id: "smss-2",
    question: "Ek feature ke liye signal-based store design karo. Structure aur rules kya honge?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "`@Injectable()` (route providers me), ek `private state = signal<FeatureState>(init)`, `readonly` selectors as `computed`, aur explicit action methods jo `state.update(s => ({ ...s, ... }))` se immutably update karein. Async actions HTTP call karke state me merge karein (loading/error included).",
    detailedAnswer:
      "```ts\n@Injectable()\nexport class EmployeesStore {\n  private api = inject(EmployeeService);\n  private state = signal<State>({ items: [], loading: false, error: null, filters: {...}, page: 1 });\n  readonly pageItems = computed(() => /* derive from state() */);\n  readonly totalPages = computed(() => ...);\n  setSearch(q: string) { this.state.update(s => ({ ...s, filters: { ...s.filters, search: q }, page: 1 })); }\n  async load() { this.state.update(s => ({...s, loading: true})); try { const items = await firstValueFrom(this.api.getAll()); this.state.update(s => ({...s, items, loading: false })); } catch { this.state.update(s => ({...s, loading: false, error: 'failed' })); } }\n}\n```\nRules: single source of truth, read-only selectors, immutable updates, explicit named actions, no raw `state.set` from components.",
    followUp: "Optimistic update (delete par turant UI se hatao, fail par wapas) is store me kaise implement karoge?",
  },
  {
    id: "smss-3",
    question: "NgRx ke core pieces (actions, reducers, selectors, effects) aur signal store — trade-off?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "NgRx: actions (events), reducers (pure state transitions), selectors (memoized derived), effects (async side-effects). Benefits: strict unidirectional flow, redux devtools/time-travel, testable pure reducers, large-team consistency. Cost: significant boilerplate + indirection. Signal store: same principles, ~1/4 the code, no devtools/time-travel, conventions self-enforced.",
    detailedAnswer:
      "NgRx shines jab: multiple features same complex state pe operate karein, aap har state change ka audit log chahte ho, effects ke through complex async orchestration hai, ya 20+ dev ek pattern par chahiye. NgRx SignalStore ek middle path hai — NgRx ka structure (withState/withComputed/withMethods/withHooks) signals ke saath, kam boilerplate, plus optional entity/devtools plugins. Chhote/medium apps: plain signal stores per feature. 'NgRx = best practice everywhere' ek common over-engineering trap hai.",
    followUp: "NgRx effects aur ek async method in a signal store — testability me farak?",
  },
  {
    id: "smss-4",
    question:
      "Team ne poore app ka state ek `AppStateService` ke ek `BehaviorSubject<AppState>` me daal diya hai — auth, current route data, form drafts, modal open flags, sab. Problems?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "God store: har chhoti UI state (modal open, hover) bhi ek global object me — har change poore state ka new reference, unnecessary coupling, selectors bahut, aur 'kaun ye field badalta hai' trace karna mushkil. Local UI state components me wapas le jao; feature state feature stores me; sirf genuinely app-wide cheezein root store me.",
    detailedAnswer:
      "Symptoms: (1) ek modal toggle poore `AppState` ko touch karta hai; (2) test setup me poora state object banana padta hai; (3) merge conflicts is ek file me; (4) re-render scope samajhna mushkil. Refactor: `AuthStore` (root), `NotificationStore` (root), `EmployeesStore` (feature route), aur modal/hover/draft ko local component signals. Root store me sirf 3-5 truly global slices. Ye 'split by ownership' NgRx me bhi feature-modules se hota hai.",
    followUp: "Form draft state — local signal, feature store, ya kahin persist? Kis basis par decide karoge?",
  },
  {
    id: "smss-5",
    question:
      "Filters aur pagination state ko store me rakhein ya URL me? Trade-offs.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "URL (query params) me rakhna aksar behtar: shareable links, working back/forward, refresh-safe, aur bookmarkable. Store me rakhna simpler code par ye teenon benefits kho deta hai. Common pattern: URL source of truth, store use derive/read karke API call kare (dono ko ek `effect`/route subscription se sync).",
    detailedAnswer:
      "URL approach: `router.navigate([], { queryParams: { search, page, dept } })`; component `route.queryParamMap` (ya `withComponentInputBinding` signals) se padhta hai aur `switchMap` se list load karta hai. Trade-off: URL me sirf serializable, user-meaningful state (filters, page, sort, selected id) — transient UI (loading, hovered row) store/local me. Downside of URL: rapid changes (har keystroke) history spam kar sakti hain -> `replaceUrl: true` + debounce. Overall shareability aur browser-nav ke liye URL jeet-ta hai list screens par.",
    followUp: "`replaceUrl: true` aur normal navigation me history ke liye kya farak, aur search me kaunsa?",
  },
];

export default questions;
