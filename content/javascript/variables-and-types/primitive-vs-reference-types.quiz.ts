import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "primitive-vs-reference-types-1",
    question:
      "`let a = { n: 1 }; let b = a; b.n = 99; console.log(a.n);` — kya print hota hai aur kyun?",
    options: [
      "1 — b ek independent copy hai",
      "99 — b aur a same object point karte hain, mutation dono jagah dikhti hai",
      "undefined — b.n original object pe set nahi hota",
      "TypeError — object ko is tarah mutate nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "Object reference type hai. `let b = a` sirf pointer copy karta hai, data nahi — `a` aur `b` heap pe ek hi object ko point karte hain. `b.n = 99` us shared object ko badalta hai, isliye `a.n` bhi `99`. Agar `a` primitive hota (`let a = 1`) to `b` ki apni copy hoti aur `a` unchanged rehta. Option A primitive semantics ki galti hai; C/D galat, object mutation valid hai.",
    difficulty: "easy",
  },
  {
    id: "primitive-vs-reference-types-2",
    question:
      "`function f(x) { x = 100; } let n = 5; f(n); console.log(n);` aur `function g(o) { o.v = 100; } let obj = { v: 5 }; g(obj); console.log(obj.v);` — dono ka result?",
    options: [
      "100 aur 100",
      "5 aur 5",
      "5 aur 100",
      "100 aur 5",
    ],
    correctIndex: 2,
    explanation:
      "`f(n)` — `n` primitive hai, function ko value ki copy milti hai; `x = 100` sirf local parameter badalta hai, `n` bahar `5` rehta hai. `g(obj)` — `o` ko `obj` ka reference milta hai; `o.v = 100` us shared object ko mutate karta hai, isliye bahar `obj.v` `100`. Note: agar `g` ke andar `o = { v: 100 }` likhte to bahar kuch na badalta (reassigning the parameter). Yahi 'call by sharing' hai.",
    difficulty: "medium",
  },
  {
    id: "primitive-vs-reference-types-3",
    question: "`console.log({ a: 1 } === { a: 1 })` kya deta hai?",
    options: [
      "true — dono ka structure same hai",
      "false — do alag object literals, do alag references",
      "true — chhote objects ko JS intern karta hai",
      "TypeError — objects ko === se compare nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "`===` objects ko reference identity se compare karta hai, structure se nahi. Yaha do alag object literals hain, do alag heap addresses, isliye `false`. Structural equality ke liye keys manually compare karo ya `JSON.stringify` / Lodash `isEqual`. Primitives ke saath `===` value compare karta hai (`1 === 1` true), isliye log hota hai ki 'objects alag hain'. Option C JS mein hota hi nahi.",
    difficulty: "easy",
  },
  {
    id: "primitive-vs-reference-types-4",
    question:
      "`const user = { name: 'A', address: { city: 'Delhi' } }; const copy = { ...user }; copy.address.city = 'Pune'; console.log(user.address.city);` — kya print hota hai?",
    options: [
      "'Delhi' — spread ne pura object deep copy kar diya",
      "'Pune' — spread shallow hai, nested address dono mein same reference",
      "undefined — nested properties spread nahi hoti",
      "TypeError — const object ko mutate nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "Spread `{ ...user }` sirf top-level properties copy karta hai. `name` (primitive) ki nayi copy banti hai, par `address` ek object hai — uska reference copy hota hai, object nahi. Isliye `copy.address` aur `user.address` same object hain; `copy.address.city = 'Pune'` dono jagah dikhta hai. Deep copy ke liye `structuredClone(user)` ya nested spread chahiye. `const` mutation nahi rokta.",
    difficulty: "medium",
  },
];

export default quiz;
