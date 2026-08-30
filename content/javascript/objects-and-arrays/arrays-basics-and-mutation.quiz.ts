import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "arrays-basics-and-mutation-1",
    question: "`[1, 2, 10, 21].sort()` ka result kya hai?",
    options: [
      "[1, 2, 10, 21]",
      "[1, 10, 2, 21]",
      "[21, 10, 2, 1]",
      "[1, 2, 21, 10]",
    ],
    correctIndex: 1,
    explanation:
      "Bina compare function ke `sort` har element ko string mein convert karke lexicographically (dictionary order) compare karta hai. String world mein `'10'` `'2'` se pehle aata hai kyunki pehla character `'1'` < `'2'`. Result `[1, 10, 2, 21]`. Numbers ke liye `.sort((a, b) => a - b)` dena zaroori hai.",
    difficulty: "easy",
  },
  {
    id: "arrays-basics-and-mutation-2",
    question:
      "`const a = [3, 1, 2]; const b = a.sort((x, y) => x - y);` — `a === b` aur `a` ki value?",
    options: [
      "a === b false; a abhi bhi [3, 1, 2]",
      "a === b true; a ab [1, 2, 3] (sort ne a ko in-place badla aur wahi return kiya)",
      "a === b false; a ab [1, 2, 3], b ek nayi copy",
      "TypeError kyunki a const hai",
    ],
    correctIndex: 1,
    explanation:
      "`sort` mutating hai: `a` ko jagah pe reorder karta hai aur *usi* array ka reference return karta hai, isliye `a === b` `true` aur dono `[1, 2, 3]`. Non-mutating sorted copy chahiye to `[...a].sort(cmp)` ya `a.toSorted(cmp)`. `const` array content ko nahi rokta, sirf rebinding ko.",
    difficulty: "medium",
  },
  {
    id: "arrays-basics-and-mutation-3",
    question: "In methods mein se kaunsa group original array ko mutate NAHI karta?",
    options: [
      "push, pop, splice, sort",
      "shift, unshift, reverse, fill",
      "map, filter, slice, concat",
      "sort, reverse, splice, push",
    ],
    correctIndex: 2,
    explanation:
      "`map`, `filter`, `slice`, `concat` (aur spread, `flat`, `flatMap`) hamesha ek naya array return karte hain aur original ko chhodte hain. Baaki options mein listed methods (`push`/`pop`/`shift`/`unshift`/`splice`/`sort`/`reverse`/`fill`) sab in-place mutate karte hain.",
    difficulty: "easy",
  },
  {
    id: "arrays-basics-and-mutation-4",
    question: "`Array(3)` aur `Array.of(3)` mein kya farak hai?",
    options: [
      "Dono [3] dete hain",
      "Dono [undefined, undefined, undefined] dete hain",
      "Array(3) -> length 3 with 3 holes (koi actual element nahi); Array.of(3) -> [3] (ek element)",
      "Array(3) -> [0, 0, 0]; Array.of(3) -> [3]",
    ],
    correctIndex: 2,
    explanation:
      "Single number arg ke saath `Array(n)` sirf `length` ko `n` set karta hai — array mein 3 holes hain, actual elements nahi, isliye `Array(3).map(fn)` bhi kuch map nahi karta. `Array.of(3)` argument ko literal element treat karta hai, to `[3]`. Holes-free numeric array chahiye to `Array.from({ length: 3 }, (_, i) => i)`.",
    difficulty: "medium",
  },
];

export default quiz;
