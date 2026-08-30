import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "object-basics-1",
    question:
      "`const k = 'user-role'; const o = { name: 'V' }; o[k] = 'admin';` — `o.k` aur `o[k]` kya dete hain?",
    options: [
      "Dono 'admin' dete hain",
      "o.k -> undefined, o[k] -> 'admin'",
      "o.k -> 'admin', o[k] -> undefined",
      "Dono undefined dete hain",
    ],
    correctIndex: 1,
    explanation:
      "`o.k` literal key `'k'` ko dhoondta hai — aisi koi property nahi, isliye `undefined`. `o[k]` mein `k` ek variable hai jiski value `'user-role'` hai, isliye `o['user-role']` = `'admin'`. Dynamic key hamesha bracket ke andar bina quotes ke variable se aati hai. Option A/C dot aur bracket ko same samajhne ki galti hai.",
    difficulty: "easy",
  },
  {
    id: "object-basics-2",
    question:
      "`const obj = { a: undefined };` — `'a' in obj`, `obj.a !== undefined`, aur `Object.hasOwn(obj, 'a')` ke results?",
    options: [
      "true, true, true",
      "true, false, true",
      "false, false, false",
      "true, false, false",
    ],
    correctIndex: 1,
    explanation:
      "Key `a` genuinely mojood hai par uski value `undefined` hai. `'a' in obj` -> `true` (key hai). `obj.a !== undefined` -> `false` (value undefined hai — isi liye ye check existence ke liye bharosemand nahi). `Object.hasOwn(obj, 'a')` -> `true` (own property hai). Yehi teen checks ka farak dikhata hai kyun `obj.k !== undefined` galat jawab de sakta hai.",
    difficulty: "medium",
  },
  {
    id: "object-basics-3",
    question:
      "`const c = Object.freeze({ n: 1, db: { host: 'local' } }); c.n = 5; c.db.host = 'prod';` — object ab kya hai?",
    options: [
      "{ n: 5, db: { host: 'prod' } } — freeze kuch nahi rokta",
      "{ n: 1, db: { host: 'local' } } — sab kuch frozen",
      "{ n: 1, db: { host: 'prod' } } — freeze shallow hai, nested mutate ho gaya",
      "TypeError dono lines pe",
    ],
    correctIndex: 2,
    explanation:
      "`Object.freeze` sirf top-level properties lock karta hai. `c.n = 5` ignore ho gaya (non-strict mein silent, strict mein TypeError), isliye `n` abhi bhi `1`. Lekin `c.db` khud ek object hai jo frozen nahi — `c.db.host = 'prod'` chal gaya. Deep immutability chahiye to har nested object recursively freeze karna padta hai.",
    difficulty: "medium",
  },
  {
    id: "object-basics-4",
    question:
      "Kis situation mein bracket notation `obj[k]` zaroori hai, dot `obj.k` kaam nahi karega?",
    options: [
      "Jab key ek chhoti string ho jaise 'name'",
      "Jab key runtime pe variable/loop se aaye, ya key mein space/dash ho, ya wo digit se shuru ho",
      "Kabhi zaroori nahi — dot aur bracket bilkul interchangeable hain",
      "Sirf jab object nested ho",
    ],
    correctIndex: 1,
    explanation:
      "Dot notation ke baad ek fixed valid identifier hi aa sakta hai. Dynamic key (variable ya loop se), space wali key (`obj['full name']`), dash wali key (`obj.a-b` ko engine `a minus b` samajhta hai), ya digit-start key ke liye bracket zaroori hai. Isi liye computed keys `{ [expr]: v }` bhi exist karte hain. Option C common galatfehmi hai.",
    difficulty: "easy",
  },
];

export default quiz;
