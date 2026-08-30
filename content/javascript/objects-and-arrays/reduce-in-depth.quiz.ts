import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "reduce-in-depth-1",
    question: "`[].reduce((a, b) => a + b)` — kya hota hai?",
    options: [
      "0 return hota hai",
      "undefined return hota hai",
      "TypeError: Reduce of empty array with no initial value",
      "NaN return hota hai",
    ],
    correctIndex: 2,
    explanation:
      "Bina initial value ke reduce empty array pe TypeError phenkta hai — kyunki accumulator ke liye na koi init hai, na array[0]. `[].reduce((a, b) => a + b, 0)` hota to safe: seedha 0 milta, callback chalta hi nahi. Option A/B/D galat — koi silent value return nahi hoti, crash hota hai.",
    difficulty: "medium",
  },
  {
    id: "reduce-in-depth-2",
    question:
      "`['a', 'b', 'a'].reduce((acc, w) => { acc[w] = (acc[w] ?? 0) + 1; }, {})` ka result kya hai?",
    options: [
      "{ a: 2, b: 1 }",
      "TypeError agli iteration mein, kyunki callback acc return nahi karta",
      "{ a: 1, b: 1, a: 1 }",
      "undefined",
    ],
    correctIndex: 1,
    explanation:
      "Callback ka koi `return acc` nahi hai, isliye pehli iteration ke baad accumulator `undefined` ban jaata hai. Doosri iteration mein `undefined['b']` access/assign karne pe TypeError. Sahi code: `{ acc[w] = (acc[w] ?? 0) + 1; return acc; }`. Object accumulator ke saath har path pe acc return karna mandatory hai.",
    difficulty: "medium",
  },
  {
    id: "reduce-in-depth-3",
    question:
      "`[1, 2, 3].reduce((acc, n) => acc + n)` (no init) mein pehli baar callback call hone pe acc aur n kya hote hain?",
    options: [
      "acc = undefined, n = 1, index 0 se",
      "acc = 0, n = 1, index 0 se",
      "acc = 1 (array[0]), n = 2, index 1 se",
      "acc = 1, n = 1, index 0 se",
    ],
    correctIndex: 2,
    explanation:
      "Init na dene par accumulator array[0] (yaani 1) ban jaata hai aur iteration index 1 se shuru hoti hai — pehla element already consume ho chuka. Isliye pehli call: acc = 1, n = 2. Init dene par (`, 0`) acc = 0 hota aur iteration index 0 se chalti.",
    difficulty: "easy",
  },
  {
    id: "reduce-in-depth-4",
    question:
      "Ek array se `{ id -> record }` object banana hai jisme har step mein 10+ lines ki validation aur 3 alag counters bhi update hote hain. Sabse readable choice?",
    options: [
      "reduce, kyunki array-to-object ka standard tool wahi hai",
      "reduce with `Object.assign` chaining ek-line mein",
      "for...of loop — bada branchy step logic aur multiple accumulators reduce mein kam readable hote hain",
      "map, phir result ko object mein convert",
    ],
    correctIndex: 2,
    explanation:
      "reduce chhote per-step logic ke liye achha hai. Jab step mein bahut si conditions, side-effect-jaisi validation, aur kai accumulators hon, to `for...of` loop clearer rehta hai — har branch mein `return acc` likhne aur nesting ki ceremony nahi. map yaha fit nahi (output shape alag). One-line Object.assign aur unreadable ho jaata.",
    difficulty: "medium",
  },
];

export default quiz;
