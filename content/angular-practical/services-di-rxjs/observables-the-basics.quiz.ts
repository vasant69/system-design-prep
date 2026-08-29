import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "observables-the-basics-1",
    question: "Ek Observable kab kaam karna shuru karta hai?",
    options: [
      "Jaise hi wo create hota hai",
      "Jab koi `.subscribe()` (ya `| async`) karta hai — Observable lazy hota hai",
      "App bootstrap par",
      "Har change-detection cycle me",
    ],
    correctIndex: 1,
    explanation:
      "Observable lazy hai — uska producer function tabhi chalta hai jab koi subscribe kare. Ek Promise (eager) create hote hi chal jaata hai. Isliye `getAll()` call karne se HTTP nahi hota, `subscribe`/`async` se hota hai.",
    difficulty: "easy",
  },
  {
    id: "observables-the-basics-2",
    question: "Observable aur Promise me kaunsa farak SAHI hai?",
    options: [
      "Promise multiple values de sakta hai, Observable sirf ek",
      "Observable lazy + cancellable hai aur 0 se many values de sakta hai; Promise eager hai, exactly ek value, cancel nahi hota",
      "Dono bilkul same hain",
      "Observable sirf HTTP ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Observable: lazy, cancellable (`unsubscribe`), 0..n values over time, rich operators, re-subscribe possible. Promise: eager, ek value, no cancel. Isliye debounced search, request cancellation, aur event streams Observables se natural hain.",
    difficulty: "easy",
  },
  {
    id: "observables-the-basics-3",
    question: "Ek cold HTTP Observable ko template me 3 jagah `| async` kiya. Kya hota hai?",
    options: [
      "Ek hi HTTP request, result 3 jagah share",
      "3 alag HTTP requests — cold observable har subscriber ke liye producer dobara chalata hai; fix `shareReplay(1)` ya `toSignal`",
      "Error aata hai",
      "Sirf pehla `| async` kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Cold observable = per-subscriber execution. Teen `| async` = teen subscribers = teen GETs. `shareReplay(1)` execution ko multicast karta hai aur last value replay karta hai, ya observable ko `toSignal()` se ek single source bana lo.",
    difficulty: "medium",
  },
  {
    id: "observables-the-basics-4",
    question: "In me se kaunsa stream unsubscribe na karne par memory leak dega?",
    options: [
      "`HttpClient.get()` (ek value emit karke complete ho jaata hai)",
      "`interval(1000)` / route `paramMap` / `form.valueChanges` — ye complete nahi hote, isliye subscription aur callback chalte rehte hain",
      "`of(1, 2, 3)`",
      "Koi bhi Observable kabhi leak nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Auto-completing streams (HTTP, `of`, `from`) terminal ke baad khud teardown ho jaate hain. Non-completing streams (`interval`, `fromEvent`, route params, `valueChanges`, websockets) ko explicit cleanup chahiye — `async` pipe, `takeUntilDestroyed()`, ya manual `unsubscribe`.",
    difficulty: "medium",
  },
];

export default quiz;
