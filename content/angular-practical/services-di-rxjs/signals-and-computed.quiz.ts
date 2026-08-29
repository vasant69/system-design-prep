import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "signals-and-computed-1",
    question: "Signal ko read aur write kaise karte hain?",
    options: [
      "Read `x.value`, write `x.next(v)`",
      "Read `x()` (call karke), write `x.set(v)` ya `x.update(fn)`",
      "Read `x`, write `x = v`",
      "Read `x.get()`, write `x.put(v)`",
    ],
    correctIndex: 1,
    explanation:
      "Writable signal ko call karke read karte hain (`x()`), aur `set`/`update` se write. Template me bhi `{{ x() }}`. `.value`/`.next` RxJS Subject ka syntax hai, signal ka nahi.",
    difficulty: "easy",
  },
  {
    id: "signals-and-computed-2",
    question: "`computed(() => ...)` ke baare me kya sahi hai?",
    options: [
      "Wo har change-detection cycle me recompute hota hai",
      "Wo ek read-only signal hai jo lazy (jab read ho tab compute) aur memoized (jab tak dependency na badle cached) hota hai; dependencies automatically track hoti hain",
      "Wo ek writable signal hai",
      "Use manually subscribe karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "`computed` derived read-only signal hai. Uska function ke andar jo signals read hote hain wahi uski dependencies ban jaati hain; recompute sirf tab jab unme se koi badle aur koi `computed()` ko read karein.",
    difficulty: "medium",
  },
  {
    id: "signals-and-computed-3",
    question: "`effect()` kis kaam ke liye hai, aur kis ke liye NAHI?",
    options: [
      "Derived state calculate karne ke liye (jaise `total = a + b`)",
      "Side effects ke liye jab uske read kiye signals badlein — logging, localStorage, DOM API sync, analytics. Derived state ke liye `computed` use karo, `effect` nahi",
      "HTTP requests ke liye",
      "Routes define karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "`effect` reactive side-effects ke liye hai — signal change hone par bahar ki duniya ko sync karna. Derived values `computed` se (pure, memoized). `effect` me state derive karna / signals set karna loops aur surprises deta hai.",
    difficulty: "medium",
  },
  {
    id: "signals-and-computed-4",
    question: "Signals aur Observables ka sahi division kya hai?",
    options: [
      "Signals ne Observables ko obsolete kar diya, ab sirf signals use karo",
      "Signals synchronous UI/app state + derived values + fine-grained CD ke liye; Observables async streams (HTTP, debounce, switchMap, retry, websockets, cancellation) ke liye. `toSignal`/`toObservable` se bridge",
      "Observables state ke liye, signals events ke liye",
      "Dono bilkul same hain",
    ],
    correctIndex: 1,
    explanation:
      "Signal = ek value jo hamesha maujood hai, synchronous read, automatic CD. Observable = time ke saath aane wale values ka stream jise transform/cancel/combine karna hai. Typical component dono use karta hai aur `toSignal()`/`toObservable()` se connect karta hai.",
    difficulty: "medium",
  },
];

export default quiz;
