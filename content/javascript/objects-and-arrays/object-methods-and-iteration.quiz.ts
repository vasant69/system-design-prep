import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "object-methods-and-iteration-1",
    question:
      "`const a = { x: 1, nested: { y: 2 } }; const b = { ...a }; b.nested.y = 99;` — `a.nested.y` kya hai?",
    options: [
      "2 — spread ne poori copy bana di",
      "99 — spread shallow hai, a.nested aur b.nested wahi object hain",
      "undefined — nested spread nahi hota",
      "TypeError — frozen object",
    ],
    correctIndex: 1,
    explanation:
      "`{ ...a }` shallow copy hai: `b.x` ek naya slot hai (primitive copy), par `b.nested` sirf `a.nested` ki reference copy karta hai — dono wahi ek object point karte hain. `b.nested.y = 99` isliye `a.nested.y` ko bhi 99 kar deta hai. True deep copy ke liye `structuredClone(a)`.",
    difficulty: "medium",
  },
  {
    id: "object-methods-and-iteration-2",
    question:
      "Plain object `{ a: 1, b: 2 }` ko iterate karne ka idiomatic aur safe tareeka kaunsa hai?",
    options: [
      "for...in — sabse purana aur reliable",
      "for...of obj — object seedha iterable hota hai",
      "for (const [k, v] of Object.entries(obj)) — own-only, destructuring ke saath",
      "obj.forEach((v, k) => ...) — objects pe forEach hota hai",
    ],
    correctIndex: 2,
    explanation:
      "`for...of Object.entries(obj)` sirf own enumerable string keys deta hai aur `[k, v]` destructuring readable hai. `for...in` prototype chain walk karta hai (guard chahiye). `for...of obj` seedha object pe TypeError deta hai — plain object iterable nahi. Plain objects pe `.forEach` method hota hi nahi (wo Array/Map/Set pe hai).",
    difficulty: "easy",
  },
  {
    id: "object-methods-and-iteration-3",
    question:
      "`JSON.parse(JSON.stringify({ d: new Date(), f: () => 1, n: NaN, u: undefined }))` ka result kya shape ka hai?",
    options: [
      "Sab kuch waise ka waise — perfect deep copy",
      "{ d: <ISO string>, n: null } — f aur u keys drop, Date string ban gaya, NaN null",
      "{ d: Date, f: Function, n: NaN, u: undefined } — bas nayi reference",
      "Throw karta hai kyunki function hai",
    ],
    correctIndex: 1,
    explanation:
      "`JSON.stringify` `undefined` aur function values wali keys ko poori tarah drop kar deta hai, `Date` ko `toISOString()` string bana deta hai (parse ke baad wapas Date nahi milta), aur `NaN`/`Infinity` ko `null` kar deta hai. Isliye result `{ d: '2026-...T...Z', n: null }` jaisa hai. Function value se throw nahi hota — wo bas skip hoti hai (throw sirf BigInt aur circular refs pe). Modern deep copy ke liye `structuredClone`.",
    difficulty: "hard",
  },
  {
    id: "object-methods-and-iteration-4",
    question:
      "`const merged = Object.assign(defaults, overrides)` mein kya problem ho sakti hai?",
    options: [
      "Koi problem nahi, ye spread ke barabar hai",
      "`defaults` object mutate ho jata hai — agli baar jo `defaults` use karega use badla hua milega",
      "`overrides` ki keys ignore hoti hain",
      "Sirf pehli key copy hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "`Object.assign(target, ...sources)` `target` ko in-place mutate karta hai aur wahi return karta hai. `Object.assign(defaults, overrides)` mein `defaults` hi target hai, to `overrides` ki keys usme likh di jati hain — shared `defaults` corrupt ho gaya. Copy chahiye to `Object.assign({}, defaults, overrides)` ya `{ ...defaults, ...overrides }`.",
    difficulty: "medium",
  },
];

export default quiz;
