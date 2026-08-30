import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "this-arrow-functions-and-destructuring-1",
    question:
      "Ek regular function mein `this` ki value kaise decide hoti hai?",
    options: [
      "Function jahan define hua us scope se — hamesha fixed",
      "Function ko kaise call kiya gaya us se: `new Fn()` (naya instance) > `fn.call/apply/bind(obj)` > `obj.fn()` (dot ke left wala) > `fn()` seedha (`undefined` strict/ESM mein)",
      "Hamesha `globalThis`",
      "Function ke pehle argument se",
    ],
    correctIndex: 1,
    explanation:
      "Regular function ka `this` call site par decide hota hai, 4 rules ke precedence order mein: `new` binding, explicit binding (`bind`/`call`/`apply`), method/implicit binding (`obj.fn()`), aur default binding (`fn()` -> `undefined` in strict mode/ESM, `globalThis` in sloppy). Option A actually arrow function ka behaviour describe karta hai, regular ka nahi. Option C sirf sloppy-mode default binding mein sach hai. Option D galat.",
    difficulty: "easy",
  },
  {
    id: "this-arrow-functions-and-destructuring-2",
    question:
      "Ek class method ke andar `this.items.forEach(function (item) { console.log(this.name); })` crash kyun karta hai, aur fix kya hai?",
    options: [
      "`forEach` supported nahi hai class ke andar; `for` loop use karo",
      "`forEach` apne callback ko plain call karta hai (`fn(item)`), koi object left mein nahi — isliye callback ke andar `this` `undefined` hota hai aur `this.name` `TypeError` deta hai; fix hai arrow callback jo enclosing method ka `this` capture karta hai",
      "`this.items` ek array nahi hai",
      "`console.log` ko `this` ke saath bind karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Regular `function` callback ko `forEach` bina kisi receiver ke call karta hai, to default binding lagti hai — strict mode (jo class bodies mein hamesha on hai) mein `this` `undefined`. `this.name` par crash. Arrow callback (`(item) => {...}`) ka apna `this` nahi hota, wo lexically `runAll` method ka `this` (the instance) use karta hai. `forEach` ka optional second `thisArg` argument bhi kaam karta hai. Baaki options galat.",
    difficulty: "medium",
  },
  {
    id: "this-arrow-functions-and-destructuring-3",
    question:
      "Object method ke liye arrow function kyun galat choice hai? `const c = { count: 0, inc: () => { this.count++; } }`",
    options: [
      "Arrow functions object ke andar syntactically allowed nahi hain",
      "Arrow ka apna `this` nahi hota — wo module/global scope ka `this` capture karta hai, `c` ko nahi; `this.count` `NaN` ya crash deta hai. Method shorthand `inc() { this.count++; }` use karo",
      "Arrow functions slow hote hain regular functions se",
      "`count` ko `let` se declare karna padta",
    ],
    correctIndex: 1,
    explanation:
      "Method ko apne object ka `this` chahiye, lekin arrow ka `this` lexical hai — jahan arrow likha gaya (module top-level ya global), wahan ka `this`, `c` nahi. To `this.count` object ki `count` ko touch nahi karta. Method shorthand ya regular `function` use karo. Option A galat — syntactically allowed hai, bas semantically galat. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "this-arrow-functions-and-destructuring-4",
    question:
      "`const copy = { ...original }; copy.address.city = 'X';` — `original.address.city` bhi badal gaya. Kyun?",
    options: [
      "Spread operator broken hai nested objects ke saath",
      "`{ ...original }` ek SHALLOW copy hai — top-level properties copy hoti hain, lekin `address` ek nested object hai jiska reference dono mein same hai; deep copy ke liye per-level spread (`{ ...a, address: { ...a.address } }`) ya `structuredClone(a)`",
      "`copy` aur `original` ek hi variable hain",
      "Objects ko copy karne ke liye `Object.freeze` chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Object/array spread (`{...x}`, `[...x]`) ek level deep copy karta hai. Nested objects/arrays abhi bhi shared references hain, to unhe mutate karna dono jagah dikhta hai. Fix: har level par explicitly spread, ya `structuredClone` (modern Node). Option A galat — spread theek kaam kar raha hai, bas shallow hai by design. Option C galat — `copy` ek naya top-level object hai.",
    difficulty: "hard",
  },
];

export default quiz;
