import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "prototype-chain-1",
    question:
      "`const o = {}; console.log(typeof o.toString);` — `toString` `o` ke apne paas nahi hai, phir bhi kyun defined hai?",
    options: [
      "JS har object mein `toString` copy kar deta hai",
      "Lookup `o` ke `[[Prototype]]` (`Object.prototype`) tak jaata hai jahan `toString` hai",
      "`toString` ek global function hai",
      "Ye actually `undefined` hai",
    ],
    correctIndex: 1,
    explanation:
      "`o` ka apna koi `toString` nahi, to engine uske prototype (`Object.prototype`) par dekhta hai — wahan `toString` defined hai. Har object mein copy nahi hoti; sab `Object.prototype` ki ek hi copy ko delegate karte hain. Chain: `o` -> `Object.prototype` -> `null`.",
    difficulty: "easy",
  },
  {
    id: "prototype-chain-2",
    question:
      "`function P() {} P.prototype.m = function () {}; const a = new P(), b = new P(); console.log(a.m === b.m);` — output?",
    options: [
      "`false` — har instance apni copy rakhta hai",
      "`true` — dono `P.prototype.m` ko delegate karte hain",
      "`undefined`",
      "`TypeError`",
    ],
    correctIndex: 1,
    explanation:
      "`m` `P.prototype` par ek hi function object hai. `a` aur `b` dono ka lookup `P.prototype` par pahunchta hai aur wahi ek function milta hai — isliye `===` `true`. Method ko constructor ke andar `this.m = function () {}` likhte to har instance ki apni copy banti aur `false` aata.",
    difficulty: "medium",
  },
  {
    id: "prototype-chain-3",
    question:
      "`function P() {} P.prototype.tag = 'proto'; const a = new P(); a.tag = 'own'; const b = new P(); console.log(a.tag, b.tag);` — output?",
    options: ["`'own' 'own'`", "`'proto' 'proto'`", "`'own' 'proto'`", "`'own' undefined`"],
    correctIndex: 2,
    explanation:
      "`a.tag = 'own'` ek WRITE hai — write hamesha khud object par hota hai, prototype par nahi. To `a` ke paas apna `tag` ban gaya jo prototype wale ko SHADOW karta hai -> `'own'`. `b` ne kuch set nahi kiya, uska lookup `P.prototype.tag` tak jaata hai -> `'proto'`. Prototype ki value ab bhi wahi hai.",
    difficulty: "medium",
  },
  {
    id: "prototype-chain-4",
    question: "Property lookup chain kahan khatam hoti hai, aur property na milne par kya return hota hai?",
    options: [
      "`Object.prototype` par; na milne par `ReferenceError`",
      "`null` par (`Object.prototype` ka `[[Prototype]]` `null` hai); na milne par `undefined`",
      "`globalThis` par; na milne par `null`",
      "Chain infinite hoti hai, engine loop karta rehta hai",
    ],
    correctIndex: 1,
    explanation:
      "`Object.getPrototypeOf(Object.prototype)` `null` hai — yahin chain khatam. Agar property poori chain mein kahin na mile to property ACCESS `undefined` deta hai (`ReferenceError` nahi — wo undeclared variables ke liye hai). Us `undefined` ko function ki tarah call karo tab `TypeError: x is not a function` aata hai.",
    difficulty: "hard",
  },
];

export default quiz;
