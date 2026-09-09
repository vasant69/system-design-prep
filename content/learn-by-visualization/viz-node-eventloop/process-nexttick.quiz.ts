import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "process-nexttick-1",
    question:
      "`Promise.resolve().then(() => console.log('P')); process.nextTick(() => console.log('N')); setTimeout(() => console.log('T'), 0);` — output?",
    options: ["P N T", "N P T", "T N P", "N T P"],
    correctIndex: 1,
    explanation:
      "Current operation ke baad Node pehle `process.nextTick` queue drain karta hai (`N`), phir Promise microtask queue (`P`), phir event loop timers phase (`T`). Isliye `N P T`. nextTick promise `.then` se bhi pehle chalti hai — dono microtask jaise hote hue bhi nextTick ki priority upar hai.",
    difficulty: "easy",
  },
  {
    id: "process-nexttick-2",
    question: "`process.nextTick` ke baare mein kaunsa statement sahi hai?",
    options: [
      "Wo event loop ke timers phase ka hissa hai",
      "Wo agle event loop tick pe chalta hai, isiliye naam 'nextTick'",
      "Wo current operation ke turant baad chalta hai, kisi bhi phase se aur Promise microtasks se pehle",
      "Wo `setImmediate` ka alias hai",
    ],
    correctIndex: 2,
    explanation:
      "Naam bhramit karta hai — `process.nextTick` actually 'agle tick' ka intzaar nahi karta. Wo current operation complete hote hi, loop ke agle phase se pehle, aur Promise microtask queue se bhi pehle chalta hai. `setImmediate` isse bilkul alag hai (wo check phase mein chalta hai, ek poora phase-cycle baad).",
    difficulty: "medium",
  },
  {
    id: "process-nexttick-3",
    question:
      "Ek function `process.nextTick` mein khud ko recursively schedule karta rehta hai. Event loop ka kya hota hai?",
    options: [
      "Normal chalta rehta hai, nextTick low priority hai",
      "I/O aur timers starve ho jaate hain — loop nextTick queue khali hone tak agle phase pe nahi badhta",
      "Node 1000 nextTicks ke baad automatically ruk jaata hai",
      "Recursion stack overflow deti hai turant",
    ],
    correctIndex: 1,
    explanation:
      "nextTick queue har operation ke baad poori drain hoti hai; agar wo khud aur nextTicks add karti rahe, wo kabhi khali nahi hoti. Loop tabhi agle phase pe jaata hai jab queue empty ho, isliye poll (I/O) aur timers indefinitely block ho jaate hain. Stack overflow nahi hota kyunki har nextTick alag turn mein chalta hai. `setImmediate` recursion safe hai — wo har tick loop ko aage badhne deti hai.",
    difficulty: "medium",
  },
  {
    id: "process-nexttick-4",
    question:
      "Ek API function cache-hit pe callback ko sync call karta hai aur cache-miss pe async. Isse `process.nextTick` se kyun theek karte hain?",
    options: [
      "Performance ke liye — nextTick tez hai",
      "Taaki callback HAMESHA caller ke return hone ke baad chale — consistent async, warna caller ka baaki setup abhi tak nahi hua hota",
      "Cache ko clear karne ke liye",
      "Error handling ke liye zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "\"Kabhi sync kabhi async\" (Zalgo) ek real bug source hai: sync path pe callback tab chalta hai jab caller ne abhi apne event listeners / variables set bhi nahi kiye. Cache-hit branch ko `process.nextTick(cb, ...)` se defer karne se callback dono raaston pe caller ke return ke baad chalta hai — behaviour predictable ho jaata hai. Ye purely correctness ke liye hai, performance ya error handling ke liye nahi.",
    difficulty: "hard",
  },
];

export default quiz;
