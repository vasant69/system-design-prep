import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "parameters-arguments-defaults-rest-1",
    question:
      "`function f(x = 5) { return x; }` — `f(undefined)`, `f(null)`, `f(0)` kya return karte hain?",
    options: [
      "5, 5, 5",
      "5, null, 0",
      "undefined, null, 0",
      "5, 5, 0",
    ],
    correctIndex: 1,
    explanation:
      "Default parameter sirf tab lagta hai jab value `undefined` ho (missing ya explicit). `f(undefined)` -> default `5`. `f(null)` -> `null` ek real value hai, default skip, return `null`. `f(0)` -> `0` bhi real value hai, return `0`. Falsy hone se default trigger nahi hota — sirf `undefined` se.",
    difficulty: "easy",
  },
  {
    id: "parameters-arguments-defaults-rest-2",
    question:
      "`function c(x, ...rest) {}` aur `function d(x = 1, y) {}` — `c.length` aur `d.length` kya hain?",
    options: [
      "2 aur 2",
      "1 aur 1",
      "1 aur 0",
      "2 aur 1",
    ],
    correctIndex: 2,
    explanation:
      "`fn.length` pehle default parameter se pehle wale simple params count karta hai; rest params aur defaults exclude hote hain. `c`: `x` count hota hai, `...rest` nahi -> `1`. `d`: pehla param hi default hai, isliye uske baad kuch count nahi hota -> `0`. Isiliye Express jaisi arity-based libraries default/rest se confuse ho sakti hain.",
    difficulty: "medium",
  },
  {
    id: "parameters-arguments-defaults-rest-3",
    question:
      "Arrow function ke andar saare passed values chahiye. Sahi tarika kya hai?",
    options: [
      "arguments object use karo — har function mein milta hai",
      "Rest parameter (...args) use karo — arrow mein arguments nahi hota, aur ...args ek real array hai",
      "arguments ko [...arguments] se array banao",
      "Arrow function multiple args le hi nahi sakta",
    ],
    correctIndex: 1,
    explanation:
      "Arrow functions ke paas apna `arguments` object nahi hota — wo enclosing function ka uthata hai ya `ReferenceError` deta hai. Rest parameter `(...args)` arrow mein perfectly kaam karta hai aur `args` seedha ek real Array hota hai (map/filter/reduce ready). Option A/C regular functions ke liye theek the par arrow ke liye nahi. Option D galat — arrow multiple params aur rest dono le sakta hai.",
    difficulty: "easy",
  },
  {
    id: "parameters-arguments-defaults-rest-4",
    question:
      "`function connect({ port = 5432 } = {}) { return port; }` — outer `= {}` kis liye hai?",
    options: [
      "Performance ke liye",
      "Taaki bina argument ke call (connect()) crash na kare — undefined ko destructure karne se TypeError aata hai",
      "port ko constant banane ke liye",
      "Zaroori nahi hai, sirf style hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar `connect()` bina argument ke call ho aur outer `= {}` na ho, to engine `undefined` ko destructure karne ki koshish karta hai — `Cannot destructure property 'port' of undefined`. Outer default `= {}` batata hai: argument missing ho to ek empty object le lo, phir uske andar se `port` ka apna default `5432` lag jaata hai. Ye options-object pattern ka zaroori hissa hai.",
    difficulty: "medium",
  },
];

export default quiz;
