import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nexttick-vs-promise-vs-settimeout-1",
    question:
      "`console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); process.nextTick(() => console.log(4)); console.log(5);` — output?",
    options: ["1 5 2 3 4", "1 5 4 3 2", "1 5 3 4 2", "1 2 3 4 5"],
    correctIndex: 1,
    explanation:
      "Sync pehle: `1 5`. Phir priority: `process.nextTick` queue (`4`), phir Promise microtask queue (`3`), phir macrotask timers phase (`2`). Isliye `1 5 4 3 2`. `1 5 3 4 2` galat kyunki nextTick promise se pehle chalti hai; `1 2 3 4 5` galat kyunki async callbacks sync ke baad chalte hain.",
    difficulty: "medium",
  },
  {
    id: "nexttick-vs-promise-vs-settimeout-2",
    question:
      "`Promise.resolve().then(() => console.log('P')); process.nextTick(() => console.log('N'));` — dono ek saath schedule hue. Kaunsa pehle?",
    options: [
      "`P` pehle — promises ki priority zyada",
      "`N` pehle — process.nextTick queue promise microtask queue se pehle drain hoti hai",
      "Non-deterministic",
      "Dono ek saath, same microtask",
    ],
    correctIndex: 1,
    explanation:
      "Node me `process.nextTick` ki apni alag queue hai jo har operation ke baad Promise microtask queue se PEHLE poori drain hoti hai. Isliye `N` hamesha `P` se pehle. Dono ko log 'microtask' bolte hain, par nextTick strictly higher priority hai — ye ek classic trap hai.",
    difficulty: "easy",
  },
  {
    id: "nexttick-vs-promise-vs-settimeout-3",
    question:
      "Ek function recursively `process.nextTick(self)` call karta rehta hai. Pehle se scheduled `setTimeout` aur pending file reads ka kya hota hai?",
    options: [
      "Wo normal chalte rehte hain, nextTick unhe affect nahi karta",
      "Wo starve ho jaate hain — event loop timers/poll phase tak pahunchta hi nahi jab tak nextTick queue khali na ho",
      "Node 'maximum nextTick depth' error deta hai turant",
      "setTimeout chalta hai par file reads ruk jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "nextTick queue har operation ke baad poori drain hoti hai — aur agar wo khud aur nextTicks add karti rahe, wo kabhi khali nahi hoti. Event loop tabhi agle phase pe badhta hai jab nextTick queue empty ho, isliye timers aur poll (I/O) indefinitely wait karte hain. Yehi 'starvation' hai. Node koi automatic depth limit nahi lagata. `setImmediate` recursion ye problem nahi karti kyunki wo har tick loop ko aage badhne deti hai.",
    difficulty: "medium",
  },
  {
    id: "nexttick-vs-promise-vs-settimeout-4",
    question:
      "`async function f() { setTimeout(() => console.log('T'), 0); await null; console.log('A'); } f(); console.log('S');` — output?",
    options: ["S A T", "S T A", "A S T", "T S A"],
    correctIndex: 0,
    explanation:
      "`f()` sync chalta hai jab tak pehla `await` na aaye: `setTimeout` schedule hota hai, phir `await null` `f` ko pause karke control wapas deta hai. `console.log('S')` sync chalta hai. Ab stack khali — `await` ke baad ka `console.log('A')` ek promise microtask hai, jo timers phase se pehle chalta hai. Isliye `S`, phir `A`, phir `T`. `await` thread ko block nahi karta, sirf us async function ko.",
    difficulty: "hard",
  },
];

export default quiz;
