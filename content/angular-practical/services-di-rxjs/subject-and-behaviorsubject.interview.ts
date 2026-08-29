import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sabs-1",
    question: "Subject, BehaviorSubject, ReplaySubject, AsyncSubject — chaaron batao aur ek-ek use.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`Subject`: multicast Observable+observer, no replay — events (toast). `BehaviorSubject(init)`: holds current value, replays it + `.value` — state (auth user). `ReplaySubject(n)`: replays last n — recent-items feed. `AsyncSubject`: emits only final value on complete — rare, one-shot compute result.",
    detailedAnswer:
      "Sab hot/multicast hain (ek execution, sab subscribers share). Farak 'new subscriber ko kya milta hai': Subject = kuch nahi (future only); BehaviorSubject = current; ReplaySubject = last n (optionally with a time window); AsyncSubject = final value after complete. State ke liye BehaviorSubject default choice (ya signal). Events ke liye Subject. `.asObservable()` se read-only expose karo.",
    followUp: "`ReplaySubject(1)` aur `BehaviorSubject` — dono 'last value replay' karte hain, farak kya?",
  },
  {
    id: "sabs-2",
    question: "BehaviorSubject-based service store aur signal-based service store — kab kaunsa, aur kaise migrate karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Signal store: synchronous UI/app state ke liye simpler — no subscribe, no async pipe, OnPush-native, `computed` for derived. BehaviorSubject store: jab aap RxJS operators chahiye state transitions par (debounce, switchMap to HTTP), ya interop with existing observable code. `toSignal()`/`toObservable()` se bridge, incremental migrate.",
    detailedAnswer:
      "Modern default: `private _state = signal<State>(initial)`, `readonly state = this._state.asReadonly()`, `readonly count = computed(() => this._state().items.length)`, update methods `this._state.update(s => ({ ...s, ... }))`. Template `store.state()` — no `| async`. RxJS store still shines jab state ka source ek async pipeline hai (`combineLatest(filters).pipe(switchMap(load))`) — waha result ko `toSignal()` kar do. Migration: subject ko signal se replace, `x$` getters ko `toObservable(xSignal)` se backward-compat rakho jab tak consumers migrate na ho jayein.",
    followUp: "`toObservable(signal)` kis injection-context constraint ke saath aata hai?",
  },
  {
    id: "sabs-3",
    question:
      "Ek 'global event bus' service dekhi jisme ek `Subject<{ type: string; payload: any }>` hai aur poore app ke events us par jaate hain. Feedback?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Untyped catch-all bus anti-pattern hai: `any` payload, string types (typos), aur trace karna impossible (kaun emit karta hai, kaun sunta hai). Behtar: specific typed subjects/methods per concern, ya direct service calls + signals. Bus sirf jab genuinely decoupled pub/sub chahiye, aur tab bhi typed events.",
    detailedAnswer:
      "Problems: (1) `payload: any` — koi compile safety; (2) ek `switch(event.type)` har consumer me — brittle; (3) refactoring tooling 'find usages' nahi de paata; (4) ordering/lifecycle unclear. Alternatives: `NotificationService.toast$`, `EmployeeEvents.deleted$` — narrow, typed. Ya bilkul bus mat rakho — components jinhe coordinate karna hai wo ek shared feature-scoped service inject karein with explicit methods. Real decoupled cases (plugin systems) me ek typed discriminated-union event ok hai.",
    followUp: "Kabhi ek app-wide typed event bus genuinely sahi hota hai — kaunse use cases?",
  },
  {
    id: "sabs-4",
    question:
      "`BehaviorSubject<Filters>` me `this._filters$.value.search = 'abc'; this._filters$.next(this._filters$.value)` — kya galat hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Aapne current value object ko in-place mutate kiya aur wahi reference dobara `next` kiya. `distinctUntilChanged` (reference-based) is change ko miss karega, OnPush consumers update nahi honge, aur time-travel/debug tools stale reference dekhenge. Immutable update chahiye: `this._filters$.next({ ...this._filters$.value, search: 'abc' })`.",
    detailedAnswer:
      "RxJS state ko immutable treat karna chahiye same reasons as OnPush/signals: reference equality par bahut kuch depend karta hai. Mutation + `next(sameRef)` = 'kuch emit hua' par 'kuch badla nahi' according to identity checks. Spread se naya object, phir `next` — ab `distinctUntilChanged`, `combineLatest` diffing, aur OnPush sab sahi. Ek `update(fn)` helper method bana lo taaki har call site ye galti na kare.",
    followUp: "Ek `updateFilters(patch: Partial<Filters>)` helper kaise likhoge jo immutability guarantee kare?",
  },
  {
    id: "sabs-5",
    question: "`EventEmitter` (jo `@Output` me use hota hai) aur `Subject` ka kya rishta hai? `@Output` ke bahar `EventEmitter` use karna theek hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`EventEmitter<T>` `Subject<T>` ko extend karta hai. Isliye technically `next`/`subscribe`/`pipe` sab kaam karte hain. Par uska intended aur documented use sirf `@Output` template events hai — service/cross-component communication ke liye plain `Subject`/`BehaviorSubject` (ya signals) use karo.",
    detailedAnswer:
      "`EventEmitter` ka `emit()` bas `next()` hai. Angular team ne clarify kiya hai ki `EventEmitter` ko public API contract ke roop me sirf `@Output` maano. Service me `EventEmitter` use karna: (1) misleading semantics (ye 'output' nahi); (2) future me `output()` function ke saath `EventEmitter` phase out ho raha hai; (3) `Subject` explicit aur correct hai. Naye `output()` function bhi internally EventEmitter ke behaviour se decouple hota ja raha hai.",
    followUp: "`output()` function `EventEmitter` se kaise alag behave karta hai zone/async ke context me?",
  },
];

export default questions;
