import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "the-event-loop-1",
    question:
      "```javascript\nconsole.log('a');\nsetTimeout(() => console.log('b'), 0);\nPromise.resolve().then(() => console.log('c'));\nconsole.log('d');\n```\nOutput?",
    options: ["a b c d", "a d c b", "a d b c", "a c d b"],
    correctIndex: 1,
    explanation:
      "`console.log('a')` aur `console.log('d')` synchronous — pehle chalte hain: `a`, `d`. Phir call stack khali hone par event loop poori microtask queue drain karta hai — `.then` ka callback microtask hai, isliye `c`. Uske baad ek macrotask uthaya jaata hai — `setTimeout` ka callback, isliye `b`. Final: `a d c b`. `setTimeout` delay `0` hone par bhi microtask (`c`) ke baad hi chalta hai.",
    difficulty: "medium",
  },
  {
    id: "the-event-loop-2",
    question:
      "Event loop ke ek iteration (tick) mein macrotask aur microtask kitne process hote hain?",
    options: [
      "Dono mein se ek-ek",
      "Exactly ek macrotask, aur uske baad poori microtask queue drain hoti hai (jo microtasks beech mein add hon wo bhi)",
      "Poori dono queues drain hoti hain",
      "Exactly ek microtask, aur poori macrotask queue drain hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Rule: call stack khali hone par event loop poori microtask queue drain karta hai — agar microtask ke andar naya microtask add ho to wo bhi isi baar chalega. Uske baad (browser mein render ke saath) exactly EK macrotask process hota hai, phir dobara poori microtask queue drain. Isiliye do `setTimeout` callbacks ke beech saare pending promise callbacks chal jaate hain. Option A/C/D is asymmetry ko miss karte hain.",
    difficulty: "medium",
  },
  {
    id: "the-event-loop-3",
    question: "`setTimeout(fn, 0)` ke baare mein kaunsa sahi hai?",
    options: [
      "`fn` turant, synchronously chal jaata hai",
      "`fn` current synchronous code aur saari pending microtasks ke baad, ek macrotask ke roop mein chalta hai; real minimum delay browsers mein ~4ms hai",
      "`fn` promise `.then` callbacks se pehle chalta hai kyunki delay 0 hai",
      "`fn` bilkul 0ms baad chalta hai, guaranteed",
    ],
    correctIndex: 1,
    explanation:
      "`setTimeout(fn, 0)` ka `0` 'turant' nahi — `fn` browser ke timer ke paas jata hai aur expire hone par macrotask queue mein aata hai, jo current task + poori microtask queue ke baad process hoti hai. HTML spec 5+ nested timers ke baad ~4ms clamp lagata hai, aur background tabs mein throttle 1000ms+ ho sakta hai. Isliye ye 'thread free karke thoda baad mein chalao' ke liye theek hai, precise timing ke liye nahi. Option C galat — microtasks hamesha pehle.",
    difficulty: "easy",
  },
  {
    id: "the-event-loop-4",
    question:
      "Ek `.then` callback har baar ek naya resolved promise banakar uspe `.then` lagata rehta hai (infinite). Page pe kya asar hoga?",
    options: [
      "Kuch nahi — microtasks lightweight hain",
      "Microtask queue kabhi khali nahi hoti, isliye event loop macrotasks aur browser render tak pahunch hi nahi paata — page frozen dikhega bina kisi lambe loop ke",
      "Browser 4ms baad microtask chain ko rok deta hai",
      "Sirf us tab ka CPU badhta hai, UI normal chalti hai",
    ],
    correctIndex: 1,
    explanation:
      "Event loop tab tak agla macrotask ya render nahi karta jab tak microtask queue poori drain na ho jaaye. Agar har microtask ek naya microtask add karta rahe, queue kabhi khatam nahi hoti — macrotasks (clicks, timers) aur paint permanently starve ho jaate hain. Result ek lambe synchronous loop jaisa hi freeze hai, bhale hi koi `while` loop na ho. Isiliye recursive deferral ke liye `setTimeout` (macrotask) behtar hai — wo render ko turn deta hai.",
    difficulty: "medium",
  },
];

export default quiz;
