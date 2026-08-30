import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-loop-worked-examples-1",
    question:
      "`console.log('start'); setTimeout(() => console.log('timeout'), 0); Promise.resolve().then(() => console.log('promise')); console.log('end');` — output order?",
    options: [
      "start, timeout, promise, end",
      "start, end, promise, timeout",
      "start, end, timeout, promise",
      "start, promise, end, timeout",
    ],
    correctIndex: 1,
    explanation:
      "Saara sync code pehle: `start`, `end`. Phir main script khatam, stack khali — microtasks drain hoti hain timers phase se PEHLE: `promise`. Phir loop timers phase: `timeout`. Microtask (`.then`) hamesha macrotask (`setTimeout(0)`) se pehle — ye deterministic hai. Option A sync/micro/macro order ulta karta hai. Option C micro aur macro swap karta hai. Option D `end` ko `promise` ke baad daalta hai, jo galat hai kyunki `end` sync hai.",
    difficulty: "medium",
  },
  {
    id: "event-loop-worked-examples-2",
    question:
      "`console.log('1'); Promise.resolve().then(() => console.log('2')); process.nextTick(() => console.log('3')); console.log('4');` — output order?",
    options: [
      "1, 4, 2, 3",
      "1, 4, 3, 2",
      "1, 2, 3, 4",
      "1, 3, 4, 2",
    ],
    correctIndex: 1,
    explanation:
      "Sync pehle: `1`, `4`. Phir microtask drain: pehle POORI `process.nextTick` queue (`3`), phir POORI Promise queue (`2`). Do alag microtask queues hain aur nextTick jeetta hai, chahe `.then` code mein pehle likha ho. Isliye `1, 4, 3, 2`. Option A nextTick aur Promise ka order ulta karta hai. Option C sab kuch source order maan leta hai. Option D `3` ko `4` (sync) se pehle daalta hai, jo galat hai.",
    difficulty: "medium",
  },
  {
    id: "event-loop-worked-examples-3",
    question:
      "Main module (top level) se: `setTimeout(() => console.log('timeout'), 0); setImmediate(() => console.log('immediate'));` — output order?",
    options: [
      "Hamesha: timeout, immediate",
      "Hamesha: immediate, timeout",
      "Non-deterministic — kabhi timeout pehle, kabhi immediate pehle, kyunki `setTimeout(0)` ~1ms par clamp hota hai aur startup timing decide karti hai ki timer 'ready' hai ya nahi jab loop pehli baar timers phase par pahunchta hai",
      "Dono ek saath print hote hain",
    ],
    correctIndex: 2,
    explanation:
      "`setTimeout(0)` effectively ~1ms clamp hota hai. Agar process startup + script execution mein 1ms se zyada laga to timer ready hai -> `timeout` pehle. Agar kam laga to loop poll se check phase mein pahunchta hai -> `immediate` pehle. Ye main module se non-deterministic hai — interview mein ise explicitly bolna bonus deta hai. (Note: ek I/O callback ke ANDAR se `setImmediate` hamesha `setTimeout(0)` se pehle — wo deterministic hai.)",
    difficulty: "hard",
  },
  {
    id: "event-loop-worked-examples-4",
    question:
      "`setImmediate` ke naam mein 'immediate' hai — kya wo `process.nextTick` aur `Promise.then` se pehle chalega?",
    options: [
      "Haan, 'immediate' matlab sabse pehle",
      "Nahi — `setImmediate` ek check-phase MACROTASK hai; `process.nextTick` aur `Promise.then` (dono microtasks) usse pehle chalenge, har baar. 'setImmediate' ka matlab actually 'next check phase' hai",
      "Haan, lekin sirf Windows par",
      "`setImmediate` aur `process.nextTick` ek hi cheez hain",
    ],
    correctIndex: 1,
    explanation:
      "`setImmediate` ka naam bhramita karta hai. Wo check-phase macrotask hai — priority ladder: sync > process.nextTick > Promise microtasks > macrotasks (timers/poll/check). Isliye nextTick aur Promise `.then` `setImmediate` se pehle drain hote hain. Option A/C galat. Option D galat — `nextTick` ek microtask queue hai (highest priority), `setImmediate` ek phase macrotask.",
    difficulty: "medium",
  },
];

export default quiz;
