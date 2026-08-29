import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "royau-1",
    question: "`switchMap`, `mergeMap`, `concatMap`, `exhaustMap` — chaaron ka farak aur ek-ek use case.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`switchMap`: naye source value par purana inner cancel — search-as-you-type, latest-wins reads. `mergeMap`: sab inner parallel — independent bulk work. `concatMap`: inner queue, sequential — order-sensitive writes (autosave, reorder). `exhaustMap`: current inner chalte hue naye ignore — double-submit prevention (login).",
    detailedAnswer:
      "Sab ek outer value ko ek inner Observable me map karte hain aur flatten karte hain; farak overlap handling ka hai. Galat choice = real bug: search me `mergeMap` -> stale out-of-order results; sequential writes me `mergeMap` -> server par galat order; submit me `switchMap` -> user double-click par pehli request cancel (shayad DB me aadha likha). Default mental model: 'read, latest matters' -> switchMap; 'write, order matters' -> concatMap; 'action, ignore spam' -> exhaustMap; 'truly parallel independent' -> mergeMap.",
    followUp: "`concatMap` ki queue unbounded grow kar sakti hai — is se kaise bachoge?",
  },
  {
    id: "royau-2",
    question: "`catchError` ko ek pipeline me kahan rakhna chahiye — inner Observable me ya bahar?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Depends. Agar aap chahte ho ki ek failed request poore outer stream ko na maare (jaise search: ek term fail ho par agla chale), to `catchError` **inner** me (switchMap ke andar) rakho. Agar ek fatal load hai jahan fail = page error, to bahar.",
    detailedAnswer:
      "`switchMap(term => this.api.search(term).pipe(catchError(() => of([]))))` — inner catch: ek query fail ho to `[]` mile aur outer stream (agli keystrokes) zinda rahe. Agar `catchError` outer par ho (`.pipe(switchMap(...), catchError(...))`) to pehli error par **poora** subscription terminate ho jaata hai — agli type par kuch nahi hoga. Rule: recoverable per-item errors -> inner catch; stream-ending fatal errors -> outer. Yeh ek top interview subtlety hai.",
    followUp: "`retry` ko inner ya outer — search pipeline me kahan?",
  },
  {
    id: "royau-3",
    question: "`combineLatest` aur `forkJoin` — kab kaunsa? Ek gotcha batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`forkJoin`: sab parallel, sab complete hone par ek baar final values — parallel HTTP loads (details page). `combineLatest`: jab bhi koi input emit karein, sab ki latest values — dependent filters. Gotcha: `forkJoin` me koi non-completing source (interval/BehaviorSubject) ho to wo kabhi emit nahi karega; `combineLatest` tab tak emit nahi karta jab tak har input ne kam se kam ek value na di ho.",
    detailedAnswer:
      "`forkJoin([getUser(), getRoles(), getDepartments()])` — teenon HTTP (jo complete hote hain) parallel, page render on all done. `combineLatest([search$, dept$, page$]).pipe(switchMap(f => api.list(f)))` — koi bhi filter change -> nayi query. `combineLatest` ka 'har input ko kam se kam ek value chahiye' issue ko `startWith(defaultValue)` se solve karte hain. `forkJoin` ka non-completing issue ko `source$.pipe(take(1))` se.",
    followUp: "`combineLatest` initial 'sab ready hone' ke wait ko kaise handle karoge bina flicker ke?",
  },
  {
    id: "royau-4",
    question: "Loading spinner state (`loading = true/false`) ko RxJS pipeline me cleanly kaise manage karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`tap(() => this.loading.set(true))` pipeline ke start me (ya trigger par), aur `finalize(() => this.loading.set(false))` end me — `finalize` complete/error/unsubscribe teenon par chalta hai, isliye spinner kabhi stuck nahi.",
    detailedAnswer:
      "```ts\nthis.trigger$.pipe(\n  tap(() => this.loading.set(true)),\n  switchMap(f => this.api.list(f).pipe(\n    catchError(err => { this.error.set(err); return of(EMPTY_PAGE); }),\n    finalize(() => this.loading.set(false))\n  ))\n).subscribe(res => this.data.set(res));\n```\n`finalize` inner par isliye ki wo har request ke baad chale. Agar outer par ho to sirf ek baar (stream end) chalega. Anti-pattern: `subscribe`'s `next` aur `error` dono me manually `loading = false` — duplication aur unsubscribe case miss.",
    followUp: "Agar do concurrent requests ho sakti hain to single boolean `loading` galat ho jaata hai — kaise handle karoge?",
  },
  {
    id: "royau-5",
    question: "Ek team `tap()` ke andar API calls aur state mutations kar rahi hai. Kya problem hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`tap` observation/side-effect-for-debugging ke liye hai — value ko change nahi karta aur pipeline ke control flow ka hissa nahi. API call `tap` me daalna matlab wo fire-and-forget hai (no cancellation, no error handling, no ordering). Actual async work `switchMap`/`mergeMap`/`concatMap` me hona chahiye.",
    detailedAnswer:
      "`tap(() => this.http.post(...).subscribe())` — nested subscribe (leak), koi retry/catch nahi, aur agar outer cancel ho to ye request phir bhi chal jaayegi. State mutation `tap` me (`tap(x => this.items.push(x))`) OnPush/immutability tod sakta hai aur logic ko chhupa deta hai. `tap` sirf: logging, analytics events, ek external non-critical side-effect. Real transformation `map`, real async `*Map` operators, real state update `subscribe` (ya `toSignal`).",
    followUp: "Analytics event bhejna (`tap(() => analytics.track(...))`) — ye acceptable tap use hai ya nahi?",
  },
];

export default questions;
