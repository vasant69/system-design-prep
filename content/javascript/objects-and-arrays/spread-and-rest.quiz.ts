import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "spread-and-rest-1",
    question:
      "`const a = { x: 1, nested: { y: 2 } }; const b = { ...a }; b.nested.y = 99;` — `a.nested.y` ab kya hai?",
    options: [
      "2 — b ek alag copy hai",
      "99 — spread shallow hai, nested object dono mein shared hai",
      "undefined",
      "TypeError",
    ],
    correctIndex: 1,
    explanation:
      "`{ ...a }` sirf ek level copy karta hai. `b.x` `a.x` se alag hai (top-level primitive), lekin `b.nested` aur `a.nested` wahi object point karte hain. `b.nested.y = 99` usi shared object ko badalta hai, isliye `a.nested.y` bhi `99`. Deep copy ke liye `structuredClone(a)` ya nested level ka bhi spread chahiye.",
    difficulty: "medium",
  },
  {
    id: "spread-and-rest-2",
    question:
      "`{ role: 'admin', ...userInput }` jab `userInput = { role: 'user', name: 'V' }` — result ka `role` kya hai?",
    options: [
      "'admin' — pehli key hamesha jeet-ti hai",
      "'user' — object spread mein baad wali (spread se aayi) key jeet-ti hai",
      "['admin', 'user'] — dono rakh li jaati hain",
      "TypeError — duplicate key",
    ],
    correctIndex: 1,
    explanation:
      "Object literal left-to-right build hota hai aur duplicate key pe baad wali value jeet-ti hai. Yaha `role: 'admin'` pehle set hua, phir `...userInput` ne `role: 'user'` se overwrite kar diya. Agar tum chahte ho ki `admin` fix rahe to spread pehle karo aur fixed value baad mein: `{ ...userInput, role: 'admin' }`.",
    difficulty: "medium",
  },
  {
    id: "spread-and-rest-3",
    question: "`...` spread hai ya rest — kaise pehchaante ho?",
    options: [
      "Array ke saath hamesha spread, object ke saath hamesha rest",
      "Value/call side pe ho to spread (expand); binding/parameter side pe ho to rest (collect)",
      "Function ke andar spread, bahar rest",
      "Dono bilkul same hain, koi farak nahi",
    ],
    correctIndex: 1,
    explanation:
      "Same token, position se job decide hoti hai. `[...arr]`, `{ ...obj }`, `fn(...args)` — value ya call ke andar `...` expand kar raha hai = spread. `function f(...args)`, `const [a, ...rest] = arr` — binding/parameter position pe `...` leftovers collect kar raha hai = rest. Array/object ya andar/bahar se koi rule nahi.",
    difficulty: "easy",
  },
  {
    id: "spread-and-rest-4",
    question:
      "10000 items ko ek naye array mein jodna hai loop mein. `result = [...result, item]` har iteration pe — problem kya hai?",
    options: [
      "Koi problem nahi, yeh idiomatic immutable pattern hai",
      "Har iteration pura result copy hota hai — total kaam O(n^2) ho jaata hai; result.push(item) O(n) hai",
      "Spread loop ke andar SyntaxError deta hai",
      "result ek string ban jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`[...result, item]` har baar ek naya array banata hai jisme pura purana `result` copy hota hai. n iterations, har ek O(n) copy = O(n^2) total. 10k items pe ~50 million operations. Ek local array pe `result.push(item)` O(1) amortised per push, O(n) total. Immutability tab tak matlab nahi rakhti jab tak array function se bahar na jaaye — local building ke liye push use karo.",
    difficulty: "medium",
  },
];

export default quiz;
