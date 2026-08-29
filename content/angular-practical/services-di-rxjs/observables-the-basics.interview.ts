import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "otb-1",
    question: "Observable aur Promise me farak, aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Promise: eager, exactly ek value, cancel nahi. Observable: lazy, 0..n values over time, cancellable (`unsubscribe`), 100+ operators, re-subscribe possible. Ek-baar-ki async (jaise `firstValueFrom`) ke liye Promise theek; streams/events/cancellation/retry/debounce ke liye Observable.",
    detailedAnswer:
      "Angular HTTP/router Observables dete hain kyunki HTTP request cancel karni pad sakti hai (route change, new search), retry karni pad sakti hai, aur debounce/switchMap se compose karni padti hai — ye sab Observable operators se declarative. Ek isolated 'fetch this once' me `firstValueFrom(http.get(...))` se Promise mil jaata hai. Signals ke aane ke baad UI state ke liye signals, par async pipelines (HTTP, events) ke liye RxJS abhi bhi standard.",
    followUp: "`firstValueFrom` aur purana `toPromise()` me kya farak, aur `toPromise` deprecated kyun hua?",
  },
  {
    id: "otb-2",
    question: "Cold aur hot Observable samjhao, ek Angular example ke saath.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Cold: har subscriber ko apna independent execution — `HttpClient.get()` (3 subscribers = 3 requests). Hot: ek shared execution jise sab dekhte hain — `Subject`, `fromEvent(document, 'click')`. Cold ko share karne ke liye `shareReplay(1)` (multicast + last value replay).",
    detailedAnswer:
      "Practical impact: ek service me `data$ = this.http.get(...)` aur use template me `*ngFor` + ek count me + ek header me `| async` — 3 GETs, bug. Fix: `data$ = this.http.get(...).pipe(shareReplay({ bufferSize: 1, refCount: true }))`. `refCount: true` important hai taaki jab last subscriber jaaye to source unsubscribe ho (warna wo hot rehke resource hold karega). Ya modern: `data = toSignal(this.http.get(...))` — ek execution, signal read.",
    followUp: "`shareReplay` bina `refCount` ke kaunsa subtle leak deta hai?",
  },
  {
    id: "otb-3",
    question: "Angular component me subscriptions ko leak-free kaise manage karoge? Options aur recommendation.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Best: `async` pipe (template subscribe + auto-unsubscribe). Class me stream chahiye: `obs$.pipe(takeUntilDestroyed()).subscribe(...)` ya `toSignal(obs$)`. Legacy: `takeUntil(destroy$)` with a `Subject` in `ngOnDestroy`, ya manual `Subscription` unsubscribe.",
    detailedAnswer:
      "Priority: (1) `async` pipe — no code, correct by construction, OnPush-friendly. (2) `toSignal()` — observable ko signal me, cleanup automatic (injection context). (3) `takeUntilDestroyed()` — jab side-effect chahiye (analytics, non-template state). (4) manual — sirf legacy. HTTP observables auto-complete karte hain isliye wahaan leak risk kam, par `interval`, route params, stores, sockets me zaroori. Nested subscribes ko `switchMap`/`concatMap`/`mergeMap` se replace karo — wo bhi leak source hain.",
    followUp: "`takeUntilDestroyed()` ko constructor ke bahar call karne par kya problem, aur `DestroyRef` kaise madad karta hai?",
  },
  {
    id: "otb-4",
    question:
      "Ek developer ne `this.route.params.subscribe(p => this.http.get('/x/' + p['id']).subscribe(x => this.data = x))` likha hai. Kitni problems?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Kam se kam teen: (1) nested subscribe — inner subscription leak, no cancellation; (2) route param badalne par purani in-flight request cancel nahi hoti — stale data race; (3) outer `params` subscription bhi unsubscribe nahi ho rahi. Fix: `this.route.paramMap.pipe(switchMap(p => this.http.get('/x/' + p.get('id'))), takeUntilDestroyed()).subscribe(x => this.data = x)` — ya `toSignal`.",
    detailedAnswer:
      "`switchMap` param change par purani HTTP subscription ko cancel karta hai aur nayi start — classic stale-response fix. `takeUntilDestroyed()` outer stream ko component ke saath teardown karta hai. Aur better: `data = toSignal(this.route.paramMap.pipe(switchMap(p => this.api.get(p.get('id')!))))` — declarative, cleanup-free, template me `data()`. Ya `withComponentInputBinding()` + `id = input()` + `resource()`.",
    followUp: "`switchMap` vs `concatMap` vs `exhaustMap` — is scenario me kaunsa aur kyun?",
  },
  {
    id: "otb-5",
    question: "Signals aane ke baad kya RxJS Angular me obsolete ho gaya? Boundary kahan hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Nahi. Signals synchronous UI state ke liye best (component state, derived values, template reactivity). RxJS async pipelines ke liye best — HTTP, debounce, retry, websockets, event coordination, cancellation. `toSignal()`/`toObservable()` dono ke beech bridge karte hain.",
    detailedAnswer:
      "Practical split: (1) 'ek value jo template dikhata hai aur user badalta hai' -> signal. (2) 'time ke saath aane wale events ka stream jise transform/combine/cancel karna hai' -> Observable. Typical component: service HTTP Observable deti hai -> `toSignal()` -> template signal read; search input signal -> `toObservable()` -> `debounceTime`+`switchMap` -> `toSignal()`. Signals ne `BehaviorSubject`-as-state ki bahut si jagah le li hai, par RxJS ka async modelling replace nahi kiya.",
    followUp: "`toSignal()` ka `initialValue` / `requireSync` option kab chahiye?",
  },
];

export default questions;
