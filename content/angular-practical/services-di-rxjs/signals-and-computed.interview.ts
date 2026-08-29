import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sac-1",
    question: "Signal kya hai? `computed` aur `effect` se kaise relate karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Signal ek reactive value container hai — read `x()`, write `set`/`update`. `computed(fn)` doosre signals se ek derived read-only signal banata hai (lazy + memoized, auto-tracked deps). `effect(fn)` side effect chalata hai jab uske read kiye signals badlein.",
    detailedAnswer:
      "Teenon ka reactive graph: writable signals = sources; `computed` = derived nodes jo lazily recompute; `effect` = leaves jo bahar ki duniya ko sync karte hain (DOM, storage, logging). Angular is graph ko track karke exactly wahi views re-render karta hai jo changed signal ko read karte hain — fine-grained change detection. `input()`, `model()`, `viewChild()`, `contentChild()` sab signals hain.",
    followUp: "`computed` kis point par recompute hota hai — dependency change par turant, ya read par?",
  },
  {
    id: "sac-2",
    question: "Signals change detection ko kaise badalte hain? 'Fine-grained' aur 'zoneless' ka matlab?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Classic: zone.js har async ke baad `tick()` -> poora tree check (OnPush se prune). Signals ke saath Angular exactly jaanta hai kaunsa template kaunse signal ko read karta hai, to signal write par sirf affected views ko dirty mark karta hai. Isse zone.js ki zaroorat khatam ho sakti hai (`provideZonelessChangeDetection()`).",
    detailedAnswer:
      "Fine-grained: ek signal update = ek precise set of views schedule, na ki 'poora subtree check'. Ye tab bhi hota hai jab component `Default` strategy par ho (signal-based reactivity strategy se independent). Zoneless: `provideExperimentalZonelessChangeDetection()` / `provideZonelessChangeDetection()` — zone.js bundle se hatata hai (~smaller), aur CD purely signals + explicit triggers (event bindings, `markForCheck`, `async` pipe via `toSignal`) se chalta hai. Migration ke liye: signals-first + OnPush code aaj likho, wo zoneless me bina change ke chalega.",
    followUp: "Zoneless me `setTimeout` ke andar state update kaise CD trigger karega?",
  },
  {
    id: "sac-3",
    question:
      "Ek dev `effect(() => this.filteredCount.set(this.items().filter(x => x.active).length))` likh raha hai. Kya galat aur sahi kya?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Ye derived state hai jise `effect` me `set` kar rahe hain — galat. Sahi: `filteredCount = computed(() => this.items().filter(x => x.active).length)`. `computed` memoized, glitch-free, aur signal-writes-in-effect (jo allowed but discouraged hai) ke loop/timing risks nahi.",
    detailedAnswer:
      "`effect` me signal `set` karna Angular explicitly discourage karta hai (aur by default `allowSignalWrites` ke bina warn/error karta tha) kyunki: (1) do sources of truth (`items` aur `filteredCount`) sync se bahar ja sakte hain ek frame ke liye; (2) agar `effect` apne likhe signal ko bhi read karein to loop; (3) `computed` ka lazy+memoized behaviour nahi milta. Rule: 'signal se signal derive' = `computed`. 'signal se bahar ki duniya' = `effect`.",
    followUp: "`effect` me genuinely ek signal set karna kab justified hai (koi valid case)?",
  },
  {
    id: "sac-4",
    question: "`BehaviorSubject`-based store ko signal-based store me convert karne ke steps? Kya cheez RxJS me hi rehni chahiye?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "State ko `signal`/`computed` me le jao: `private _state = signal(init)`, `readonly state = _state.asReadonly()`, derived `computed`s, update methods `_state.update(...)`. Async pipelines (HTTP with debounce/switchMap, websockets) RxJS me rakho aur result ko `toSignal()` karo. Backward compat ke liye `x$ = toObservable(xSignal)` expose karo.",
    detailedAnswer:
      "Steps: (1) har `BehaviorSubject` -> `signal`; (2) `combineLatest`-derived streams -> `computed`; (3) `.asObservable()` getters -> `toObservable(signal)` (temporary bridge) ya consumers ko `signal()` par migrate; (4) `.pipe(switchMap(loadFromApi))` jaisa async transform -> ek RxJS pipeline jo `toSignal` me end ho. Kya RxJS me rahe: debounce, retry, switchMap/exhaustMap, `forkJoin`, websocket streams, event coordination — signals in me se kuch nahi karte. Result: state reads simple (`store.employees()`), async logic still expressive.",
    followUp: "`toSignal()` ka `requireSync: true` kab use karoge aur uski precondition kya hai?",
  },
  {
    id: "sac-5",
    question: "Signal ke andar array/object rakha hai aur UI update nahi ho raha. Debug?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Aap probably array/object ko in-place mutate kar rahe ho (`items().push(x)`, `user().name = 'x'`) — signal ki reference nahi badli, to koi notification nahi (default equality `Object.is`). Fix: `items.update(a => [...a, x])` / `user.update(u => ({ ...u, name: 'x' }))`.",
    detailedAnswer:
      "Signals reference/`Object.is` equality par change detect karte hain (same as OnPush). In-place mutation = same reference = 'no change'. Immutable update se naya reference milta hai aur dependents (`computed`, template, `effect`) re-run hote hain. Agar deep-equal semantics chahiye (rare) to `signal(value, { equal: deepEqual })` — par usually immutable updates cleaner. `structuredClone` / spread / immer jaise helpers use kar sakte ho bade nested state ke liye.",
    followUp: "`{ equal: customFn }` option kis problem ko solve karta hai aur kab wo trap ban jaata hai?",
  },
];

export default questions;
