import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "oeeu-1",
    question: "`@Output()` / `output()` ka mechanism samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Child ek output property declare karta hai (`x = output<T>()` ya `@Output() x = new EventEmitter<T>()`), aur `this.x.emit(payload)` se event fire karta hai. Parent normal event binding `(x)=\"handler($event)\"` se sunta hai; `$event` = emitted payload. One-way, child -> parent.",
    detailedAnswer:
      "Emit synchronous hai — parent ka handler emit call return hone se pehle chal jaata hai. `EventEmitter` internally RxJS `Subject` hai, isliye legacy code me `.subscribe` dikh sakta hai, par idiomatic usage template `( )` binding hai. `output()` (v17.3+) lighter API hai, aur `outputFromObservable()` se ek stream ko output me convert kar sakte ho (debounced search jaisa). `output<void>()` payload-less events ke liye.",
    followUp: "`output()` aur `@Output() EventEmitter` — testing me koi practical farak?",
  },
  {
    id: "oeeu-2",
    question: "Parent-child ke alawa components ke beech communication ke aur kaunse tareeke hain? Kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "(1) `@Input`/`@Output` — direct parent-child. (2) Lift state up — common parent state rakhe, siblings ko input/output se jode. (3) Shared service (signals/`BehaviorSubject`) — distant components ya app-wide state. (4) Router state / query params — cross-route. (5) Content projection + `@ContentChild` — wrapper-content coordination.",
    detailedAnswer:
      "Selection guide: tightly-coupled aur adjacent -> inputs/outputs. Do siblings ek page par -> parent me state. App-wide (auth, cart, notifications, theme) -> `providedIn: 'root'` service with a signal store. Ek feature ke andar bahut se components ek hi state pe -> feature-scoped service (route ke `providers` me). Cross-page handoff -> route params / resolver / a store. `@ViewChild` se dusre component ko poke karna last resort hai — brittle coupling.",
    followUp: "Ek feature-scoped service (route providers me) aur ek root service me lifecycle ka kya farak hai?",
  },
  {
    id: "oeeu-3",
    question:
      "Ek 4-level deep component tree me sabse neeche wale component ka event top tak pahunchana hai. Har level pe re-emit karna pad raha hai. Better approach?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Event 'drilling' (har intermediate component ek output re-emit kare) brittle aur noisy hai. Behtar: ek shared service (feature-scoped ya root) jise deep child aur top consumer dono inject karein — deep child `service.something()` call kare, top component uske signal/stream ko observe kare.",
    detailedAnswer:
      "Har intermediate component ko event ke baare me kuch nahi pata hona chahiye jo wo sirf pass karta hai — ye leaky. Shared service pattern: `@Injectable()` (route `providers` me for feature scope) with `private _event = new Subject<T>()` / a signal, `emitX()` method, aur `event$` / `event()` read. Deep child `inject(FeatureBus).select(id)`; top component `effect(() => handle(bus.selected()))`. Ye tree structure se decouple karta hai. NgRx/other stores bhi isi problem ko solve karte hain bade scale par.",
    followUp: "Feature-scoped service kaise ensure karta hai ki do parallel feature instances apna-apna state rakhein?",
  },
  {
    id: "oeeu-4",
    question:
      "Debounced search chahiye ek `SearchBox` component se. Output kaise design karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Andar ek `Subject<string>` (ya signal + `toObservable`) me raw keystrokes daalo, `debounceTime(300)` + `distinctUntilChanged()` pipe karo, aur result ko `search` output se emit karo (`outputFromObservable(debounced$)` ya manual `.subscribe(v => this.search.emit(v))` with `takeUntilDestroyed()`).",
    detailedAnswer:
      "```ts\nquery = signal('');\nsearch = outputFromObservable(\n  toObservable(this.query).pipe(debounceTime(300), distinctUntilChanged())\n);\nonInput(e: Event) { this.query.set((e.target as HTMLInputElement).value); }\n```\nParent: `<app-search-box (search)=\"onSearch($event)\" />`. Faayda: parent ko sirf final, debounced term milta hai — debounce logic component me encapsulated, har consumer ko dobara nahi likhna. Parent phir `switchMap` se API call karta hai (in-flight request cancel).",
    followUp: "Debounce component me rakhna vs parent me rakhna — trade-off kya hai?",
  },
  {
    id: "oeeu-5",
    question: "`output()` ka `@Output() EventEmitter` par kya faayda hai, aur kya migration me koi risk hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`output()` ek focused API hai — sirf `emit` + `subscribe` (parent binding ke liye). `EventEmitter` `Subject` extend karta hai, jisse log galti se use multicast bus ki tarah use kar lete hain. Migration low-risk hai: template binding syntax same rehti hai; sirf declaration badalti hai.",
    detailedAnswer:
      "`EventEmitter` ka `Subject` hona historically confusion ka source raha — `error()`/`complete()` call karna, ya component ke bahar subscribe karna. `output()` sirf output semantics deta hai. Risk areas: (1) agar kisi ne `@Output` ko `.pipe()` / `.subscribe()` kiya tha class ke andar — us code ko `outputToObservable()` se adapt karo; (2) `EventEmitter` ka `emit` NgZone ke andar run karta tha kuch edge cases me — modern zoneless me ye anyway change ho raha hai. Overall recommended migration hai naye code me.",
    followUp: "`outputToObservable()` aur `outputFromObservable()` kab use karoge?",
  },
];

export default questions;
