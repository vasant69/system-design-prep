import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-loop-and-task-queues-1",
    question:
      "`console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D');` — output?",
    options: ["A B C D", "A D C B", "A D B C", "A C D B"],
    correctIndex: 1,
    explanation:
      "Sync pehle: `A`, `D`. Phir call stack khaali — event loop poori microtask queue drain karta hai: `C` (promise `.then`). Phir ek macrotask: `B` (`setTimeout`). Isliye `A D C B`. `setTimeout(..., 0)` ka `0` 'turant' nahi — microtasks hamesha agle macrotask se pehle.",
    difficulty: "medium",
  },
  {
    id: "event-loop-and-task-queues-2",
    question:
      "`setTimeout(() => console.log('T'), 0); Promise.resolve().then(() => { console.log('P1'); Promise.resolve().then(() => console.log('P2')); });` — output order?",
    options: ["T P1 P2", "P1 P2 T", "P1 T P2", "P2 P1 T"],
    correctIndex: 1,
    explanation:
      "Event loop ek macrotask ke baad poori microtask queue drain karta hai — aur jo microtasks drain ke dauran add hoti hain wo bhi usi drain mein chalti hain. `P1` chalta hai, wo `P2` ko queue karta hai, aur loop agla macrotask (`T`) chalane se pehle `P2` bhi nikal deta hai. Isliye `P1 P2 T`. Isi wajah se recursive microtasks event loop ko 'starve' kar sakti hain.",
    difficulty: "hard",
  },
  {
    id: "event-loop-and-task-queues-3",
    question: "In mein se kaunsa microtask hai (macrotask nahi)?",
    options: [
      "`setTimeout` callback",
      "`setInterval` callback",
      "`Promise.prototype.then` callback",
      "Ek DOM `click` event listener",
    ],
    correctIndex: 2,
    explanation:
      "Microtasks: promise reactions (`.then`/`.catch`/`.finally`), `queueMicrotask`, `MutationObserver`, aur `await` ke baad ka continuation. Macrotasks: `setTimeout`/`setInterval`/`setImmediate`, I/O callbacks, DOM events (`click` waghairah), `MessageChannel`. Har macrotask ke baad saari pending microtasks chal jaati hain, tab jaake browser render aur agla macrotask.",
    difficulty: "medium",
  },
  {
    id: "event-loop-and-task-queues-4",
    question: "`setTimeout(fn, 0)` ke baare mein sahi kya hai?",
    options: [
      "`fn` turant, synchronously chalta hai",
      "`fn` current sync code ke turant baad, kisi bhi microtask se pehle chalta hai",
      "`fn` ek macrotask hai — current sync code AUR saari pending microtasks ke baad, aur browsers `0` ko lagbhag 4ms tak clamp karte hain (nested timers)",
      "`fn` bilkul nahi chalta agar page busy ho",
    ],
    correctIndex: 2,
    explanation:
      "`setTimeout` callback macrotask queue mein jaata hai. Wo tabhi chalega jab call stack khaali ho AUR poori microtask queue drain ho chuki ho. HTML spec ke mutabik nested `setTimeout` (5+ levels) ke liye minimum delay lagbhag 4ms clamp hota hai, aur background tabs mein aur bhi zyada. Isliye `0` ka matlab 'jitni jaldi allowed', 'abhi' nahi.",
    difficulty: "medium",
  },
];

export default quiz;
