import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "primitive-vs-reference-1",
    question: "`let a = 5; let b = a; b = 10; console.log(a);` — output?",
    options: ["`5`", "`10`", "`undefined`", "`NaN`"],
    correctIndex: 0,
    explanation:
      "`b = a` ne `a` ki value (`5`) ki copy `b` ko di. `b = 10` sirf `b` badalta hai; `a` apni alag `5` liye baitha hai. Primitives value se copy hote hain — koi shared link nahi.",
    difficulty: "easy",
  },
  {
    id: "primitive-vs-reference-2",
    question:
      "`const arr1 = [1, 2]; const arr2 = arr1; arr2.push(3); console.log(arr1.length);` — output?",
    options: ["`2`", "`3`", "`TypeError` kyunki `arr1` const hai", "`undefined`"],
    correctIndex: 1,
    explanation:
      "`arr2 = arr1` ne wahi array-reference copy kiya, naya array nahi. `arr2.push(3)` usi shared array ko mutate karta hai, to `arr1.length` bhi `3`. `const` sirf binding lock karta hai — array ke andar `push` allowed hai.",
    difficulty: "easy",
  },
  {
    id: "primitive-vs-reference-3",
    question: "`console.log({ x: 1 } === { x: 1 }, NaN === NaN);` — output?",
    options: ["`true true`", "`false false`", "`true false`", "`false true`"],
    correctIndex: 1,
    explanation:
      "Do alag object literals = do alag heap addresses, isliye `===` `false` (content same hone se farak nahi). `NaN === NaN` bhi `false` — `NaN` spec ke mutabik apne aap ke barabar nahi (check karne ke liye `Number.isNaN()` use karo). Dono `false`.",
    difficulty: "medium",
  },
  {
    id: "primitive-vs-reference-4",
    question:
      "`function f(o, s) { o.done = true; s = 'changed'; } const obj = {}; let str = 'orig'; f(obj, str); console.log(obj.done, str);` — output?",
    options: ["`true 'changed'`", "`true 'orig'`", "`undefined 'orig'`", "`undefined 'changed'`"],
    correctIndex: 1,
    explanation:
      "`obj` argument ke roop mein pointer pass hua — `o.done = true` usi shared object ko badalta hai, to bahar `obj.done` -> `true`. `str` primitive hai — `s` uski copy tha; `s = 'changed'` sirf local copy badalta hai, bahar `str` `'orig'` hi rehta hai.",
    difficulty: "medium",
  },
];

export default quiz;
