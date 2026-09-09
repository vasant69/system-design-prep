import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "var-let-const-1",
    question: "`if (true) { var a = 1; let b = 2; } console.log(a, b);` — kya hota hai?",
    options: [
      "1 2 print hota hai",
      "`1` print hota hai, phir `ReferenceError: b is not defined`",
      "`undefined undefined`",
      "SyntaxError build time pe",
    ],
    correctIndex: 1,
    explanation:
      "`var a` block ko ignore karta hai — wo function/global scope mein chala jaata hai, isliye bahar `a` -> `1`. `let b` sirf us `{ }` block ke andar zinda hai, block ke bahar `b` access karna `ReferenceError` deta hai. Isi wajah se `console.log(a, b)` pehle `1` evaluate karta hai phir `b` pe crash — practically output se pehle hi error aata hai jab line run hoti hai.",
    difficulty: "easy",
  },
  {
    id: "var-let-const-2",
    question: "`const nums = [1, 2]; nums.push(3); nums = [];` — in teen lines ka result?",
    options: [
      "Teeno lines chalti hain, `nums` ban jaata hai `[]`",
      "`push` pe TypeError kyunki `nums` const hai",
      "Pehli do OK (`nums` -> `[1,2,3]`), teesri line `TypeError: Assignment to constant variable`",
      "SyntaxError — const ko array assign nahi kar sakte",
    ],
    correctIndex: 2,
    explanation:
      "`const` binding ko lock karta hai, value ko nahi. `nums.push(3)` array ke andar mutation hai — binding wahi array point karta rehta hai, isliye allowed. `nums = []` binding ko *naye* array pe point karana hai = reassignment = `TypeError`. Ye `const` ka sabse common interview trap hai.",
    difficulty: "easy",
  },
  {
    id: "var-let-const-3",
    question: "`console.log(x); var x = 5;` aur `console.log(y); let y = 5;` — dono alag-alag chalein to?",
    options: [
      "Dono `undefined` print karte hain",
      "Pehla `undefined`; doosra `ReferenceError` (TDZ)",
      "Dono `ReferenceError`",
      "Pehla `5`; doosra `undefined`",
    ],
    correctIndex: 1,
    explanation:
      "`var x` hoist hoke turant `undefined` se initialise ho jaata hai — isliye declaration se pehle read karne pe crash nahi, chup-chaap `undefined`. `let y` bhi hoist hota hai par 'uninitialised' rehta hai; block start se declaration line tak ka gap = Temporal Dead Zone, aur is window mein koi bhi access `ReferenceError` deta hai (jo actually behtar hai — bug chhupta nahi).",
    difficulty: "medium",
  },
  {
    id: "var-let-const-4",
    question: "Naye code mein default declaration kya honi chahiye, aur `let` kab?",
    options: [
      "`let` default — flexibility ke liye; `const` sirf jab pakka constant ho",
      "`var` default — sabse compatible",
      "`const` default; `let` sirf jab wo naam genuinely reassign hone wala ho (loop counter, accumulator)",
      "Farak nahi padta, teeno runtime pe same hain",
    ],
    correctIndex: 2,
    explanation:
      "`const` default rakho kyunki most variables kabhi reassign nahi hote — reader ko turant pata chal jaata hai binding fixed hai, refactor safe hota hai (`prefer-const` linter isi ko enforce karta hai). `let` sirf real reassignment cases mein: `for (let i ...)`, `let total = 0; total += x`. `var` ka koi modern fayda nahi — function scope + `undefined` hoisting + loop-closure bug. Option D galat: scope/hoisting/reassign teeno alag hain.",
    difficulty: "easy",
  },
];

export default quiz;
