import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "scope-and-closures-1",
    question:
      "`function makeCounter() { let count = 0; return () => ++count; } const a = makeCounter(); const b = makeCounter(); a(); a(); b();` — teeno calls kya return karte hain?",
    options: [
      "1, 2, 3",
      "1, 2, 1 — a aur b alag closures hain, har ek ka apna count",
      "1, 1, 1",
      "3, 3, 3",
    ],
    correctIndex: 1,
    explanation:
      "Har `makeCounter()` call ek naya scope banata hai jisme apna `count` hota hai, aur lauta hua arrow us specific scope pe closure banata hai. `a` aur `b` isliye independent hain: `a()` -> 1, `a()` -> 2, `b()` -> apna alag count -> 1. Option A tab hota jab `count` shared (module-level) hota. Closures ka key point: har factory call apni private state.",
    difficulty: "medium",
  },
  {
    id: "scope-and-closures-2",
    question:
      "Lexical scope ka matlab kya hai?",
    options: [
      "Function jahan call hota hai, wahan ke variables use kar sakta hai",
      "Function jahan LIKHA gaya hai, wahan ke outer variables use kar sakta hai — call-site se farak nahi padta",
      "Har function sirf global aur apne local variables dekh sakta hai",
      "Scope runtime pe dynamically decide hota hai",
    ],
    correctIndex: 1,
    explanation:
      "JavaScript lexical (static) scope use karta hai: variable access function ki definition ki jagah se decide hota hai, call ki jagah se nahi. Isliye ek inner function apne outer function ke variables tak pahunch sakta hai chahe usse kahin aur le jaake call karo. Option A dynamic scoping describe karta hai jo JS use nahi karta. Option C nested access ko ignore karta hai.",
    difficulty: "easy",
  },
  {
    id: "scope-and-closures-3",
    question:
      "`const fns = []; for (var i = 0; i < 3; i++) { fns.push(() => i); } console.log(fns[0](), fns[1](), fns[2]());` — output, aur `var` ko `let` karne se?",
    options: [
      "var: 0 1 2; let: 0 1 2 — koi farak nahi",
      "var: 3 3 3; let: 0 1 2 — var ek shared binding, let har iteration ka apna binding",
      "var: 0 1 2; let: 3 3 3",
      "Dono 3 3 3",
    ],
    correctIndex: 1,
    explanation:
      "`var i` poore loop ke liye ek hi binding hai — teeno arrows usi `i` pe closure bante hain, aur loop khatam hone pe `i` `3` hai, isliye `3 3 3`. `let i` spec ke mutabik har iteration ka fresh block-scoped binding deta hai, isliye har closure alag value capture karta hai — `0 1 2`. Pre-`let` fix: IIFE se per-iteration scope.",
    difficulty: "medium",
  },
  {
    id: "scope-and-closures-4",
    question:
      "Ek long-lived `window.addEventListener('resize', fn)` jahan `fn` ek bade array `bigData` ko close over karta hai — memory ke saath kya hota hai?",
    options: [
      "bigData turant GC ho jaata hai kyunki outer function return ho gaya",
      "bigData tab tak memory mein rehta hai jab tak listener remove nahi hota — closure use zinda rakhe hue hai",
      "Kuch nahi, closures memory use nahi karte",
      "bigData automatically 30 second baad free ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Closure-captured scope tab tak zinda rehta hai jab tak closure (function object) reachable hai. `resize` listener `window` se attached hai — long-lived — aur wo `fn` ko hold karta hai, jo `bigData` ko close over karta hai. Jab tak `removeEventListener` na ho, `bigData` GC nahi hoga. Fix: cleanup pe listener hataao, ya closure mein sirf zaroori chhoti value (`bigData.length`) capture karo.",
    difficulty: "hard",
  },
];

export default quiz;
