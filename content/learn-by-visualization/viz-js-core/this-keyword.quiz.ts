import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "this-keyword-1",
    question: "`const o = { v: 42, get() { return this.v; } }; console.log(o.get());` — output?",
    options: ["`42`", "`undefined`", "`TypeError`", "`globalThis`"],
    correctIndex: 0,
    explanation:
      "`o.get()` — call `o.` ke through hua, to implicit binding lagti hai aur `this` = `o` (dot ke left wala object). `this.v` -> `42`. Agar `const g = o.get; g()` hota to binding toot jaati aur `this` `undefined` hota.",
    difficulty: "easy",
  },
  {
    id: "this-keyword-2",
    question:
      "`const o = { v: 1, get() { return this.v; } }; const f = o.get; console.log(f());` (strict mode) — output?",
    options: [
      "`1`",
      "`undefined`",
      "`TypeError: Cannot read properties of undefined`",
      "`null`",
    ],
    correctIndex: 2,
    explanation:
      "`f` ko `o` se detach kar diya — ab `f()` plain call hai, koi dot nahi. Strict mode mein `this` `undefined` ho jaata hai, aur `undefined.v` padhna `TypeError` deta hai. Sloppy mode hota to `this` global object hota aur `this.v` -> `undefined` milta (crash nahi).",
    difficulty: "medium",
  },
  {
    id: "this-keyword-3",
    question:
      "`const o = { name: 'A', reg() { return this.name; }, arr: () => (typeof this) }; console.log(o.reg(), o.arr());` (ES module scope) — output?",
    options: [
      "`'A' 'object'`",
      "`'A' 'undefined'`",
      "`'undefined' 'undefined'`",
      "`'A' TypeError`",
    ],
    correctIndex: 1,
    explanation:
      "`o.reg()` implicit binding — `this` = `o`, `this.name` -> `'A'`. `o.arr` ek arrow hai — uska apna `this` nahi; wo jahan define hua (module top-level, jahan `this` `undefined` hai) se `this` leta hai, `o` se nahi. Object literal koi naya scope nahi banata. Isliye `typeof this` -> `'undefined'`.",
    difficulty: "medium",
  },
  {
    id: "this-keyword-4",
    question:
      "`function f() { return this.x; } const b = f.bind({ x: 1 }); console.log(b.call({ x: 2 }));` — output?",
    options: ["`2`", "`1`", "`undefined`", "`TypeError`"],
    correctIndex: 1,
    explanation:
      "`bind` ne `this` ko `{ x: 1 }` par PERMANENTLY lock kar diya. Uske baad `.call({ x: 2 })` ka `this` argument ignore ho jaata hai — bound function ka `this` dobara set nahi hota. Isliye `this.x` -> `1`. Priority: `bind` ka locked `this` baad ki `call` / `apply` se nahi badalta.",
    difficulty: "hard",
  },
];

export default quiz;
