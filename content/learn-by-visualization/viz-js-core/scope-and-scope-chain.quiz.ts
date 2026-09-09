import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "scope-and-scope-chain-1",
    question:
      "`const x = 1; function f() { const x = 2; function g() { console.log(x); } g(); } f();` — kya print hota hai?",
    options: ["`1`", "`2`", "`undefined`", "`ReferenceError`"],
    correctIndex: 1,
    explanation:
      "`g` ke apne scope mein `x` nahi hai, to lookup ek level bahar jaata hai — `f()` ke scope mein `x = 2` milta hai aur wahin ruk jaata hai. Global ka `x = 1` tab print hota agar `f` ke andar wala `x` na hota. Lookup nearest scope par rukta hai jahan naam milta hai.",
    difficulty: "easy",
  },
  {
    id: "scope-and-scope-chain-2",
    question:
      "`const msg = 'global'; function show() { console.log(msg); } function wrap() { const msg = 'local'; show(); } wrap();` — output?",
    options: ["`'local'`", "`'global'`", "`undefined`", "`ReferenceError`"],
    correctIndex: 1,
    explanation:
      "`show` GLOBAL scope mein likha gaya hai, isliye uska parent scope global hai — call `wrap()` ke andar se hua isse koi farak nahi (JS lexical hai, dynamic nahi). `show` ke andar `msg` -> global `'global'`. `wrap` ka `msg = 'local'` sirf `wrap` ke andar dikhta hai.",
    difficulty: "medium",
  },
  {
    id: "scope-and-scope-chain-3",
    question:
      "`function f() { if (true) { var a = 10; let b = 20; } console.log(a); console.log(b); }` — `f()` call karne par?",
    options: [
      "`10` phir `20`",
      "`10` phir `ReferenceError: b is not defined`",
      "`undefined` phir `undefined`",
      "Dono lines `ReferenceError`",
    ],
    correctIndex: 1,
    explanation:
      "`var a` block scope ko ignore karta hai — wo `f` ke poore function scope ka hai, isliye `console.log(a)` -> `10`. `let b` sirf us `if` block ke andar zinda hai; block ke bahar `b` scope chain mein kahin nahi milta -> `ReferenceError`.",
    difficulty: "medium",
  },
  {
    id: "scope-and-scope-chain-4",
    question: "Scope chain ke baare mein kaunsa statement sahi hai?",
    options: [
      "Outer function apne inner function ke local variables padh sakta hai",
      "Lookup current scope se bahar ki taraf chalta hai; inner outer ko dekh sakta hai, outer inner ko nahi",
      "Lookup wahan se shuru hota hai jahan function call hua",
      "Block scope sirf `var` par lagta hai",
    ],
    correctIndex: 1,
    explanation:
      "Scope chain ek hi direction mein chalti hai — andar se bahar. Inner function apne saare enclosing scopes (aur global) dekh sakta hai; outer function inner ke locals nahi dekh sakta. Option 3 dynamic scoping describe karta hai jo JS mein nahi hai. Option 4 ulta hai — block scope `let`/`const`/`class` par lagta hai, `var` uska respect nahi karta.",
    difficulty: "medium",
  },
];

export default quiz;
