import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "typeof-and-type-checking-1",
    question: "`typeof null`, `typeof []`, `typeof function(){}` — teeno kya dete hain?",
    options: [
      "'null', 'array', 'function'",
      "'object', 'object', 'function' — typeof null aur arrays dono 'object' dete hain, functions ko special-case 'function' milta hai",
      "'object', 'array', 'object'",
      "'null', 'object', 'object'",
    ],
    correctIndex: 1,
    explanation:
      "`typeof null` `'object'` deta hai (historical bug, permanent). `typeof []` bhi `'object'` — arrays plain objects se distinguish nahi hote via typeof, iske liye `Array.isArray(x)` chahiye. Functions callable objects hain par `typeof` unhe `'function'` deta hai (spec special case). null check ke liye `x === null` use karo.",
    difficulty: "easy",
  },
  {
    id: "typeof-and-type-checking-2",
    question:
      "Ek variable `config` kabhi declare nahi hua. `if (config)` vs `if (typeof config !== 'undefined')` — dono ka result?",
    options: [
      "Dono false dete hain",
      "if (config) -> ReferenceError (crash); if (typeof config !== 'undefined') -> false (safe)",
      "Dono ReferenceError dete hain",
      "if (config) -> false; typeof waala -> true",
    ],
    correctIndex: 1,
    explanation:
      "Undeclared name ko seedha reference karna (`if (config)`) `ReferenceError: config is not defined` deta hai — check chalne se pehle hi crash. `typeof` ek exception hai: undeclared name pe bhi `'undefined'` string return karta hai, throw nahi karta. Isliye SSR guards `typeof window !== 'undefined'` is pattern pe based hain. (Caveat: TDZ mein pade `let`/`const` pe `typeof` phir bhi throw karta hai.)",
    difficulty: "medium",
  },
  {
    id: "typeof-and-type-checking-3",
    question:
      "Ek array ek `<iframe>` se aaya hai. `arr instanceof Array` `false` deta hai par `Array.isArray(arr)` `true`. Kyun?",
    options: [
      "instanceof mein bug hai",
      "Har realm (iframe/worker/vm) ka apna Array constructor hota hai — iframe ka array parent ke Array.prototype ki chain mein nahi hai, isliye instanceof false; Array.isArray realm ke bina internal [[class]] check karta hai",
      "iframe ke arrays actually objects hote hain",
      "Array.isArray galat result de raha hai",
    ],
    correctIndex: 1,
    explanation:
      "`instanceof` prototype chain check karta hai: 'kya `Array.prototype` (is realm ka) `arr` ki chain mein hai?'. iframe ka apna `Array` aur `Array.prototype` hai, jo parent window ke `Array.prototype` se alag object hai — to chain match nahi hoti, `false`. `Array.isArray` internal array-ness ko realm ke bina check karta hai, isliye cross-realm reliable hai. Yahi wajah hai libraries (Lodash) `Array.isArray` + toString-tag use karti hain, `instanceof` nahi.",
    difficulty: "hard",
  },
  {
    id: "typeof-and-type-checking-4",
    question:
      "`function isNum(x) { return typeof x === 'number'; }` — `isNum(NaN)` kya deta hai aur kya ye theek hai?",
    options: [
      "false — NaN ek number nahi hai",
      "true — typeof NaN 'number' hai; agar 'usable number' chahiye to `typeof x === 'number' && Number.isFinite(x)` chahiye",
      "TypeError",
      "true — aur ye har use case ke liye sahi hai",
    ],
    correctIndex: 1,
    explanation:
      "`typeof NaN` `'number'` hai (NaN number type ka special value hai), to `isNum(NaN)` `true` deta hai. Agar tumhe genuinely usable number chahiye (arithmetic ke liye), ye check kaafi nahi — `NaN` calculations mein leak kar dega. `typeof x === 'number' && Number.isFinite(x)` use karo (ye `NaN` aur `Infinity` dono reject karta hai), ya `!Number.isNaN(x)` agar Infinity allow karna hai.",
    difficulty: "medium",
  },
];

export default quiz;
