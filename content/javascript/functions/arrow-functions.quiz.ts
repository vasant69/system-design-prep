import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "arrow-functions-1",
    question:
      "`const counter = { n: 0, inc: () => { this.n++; } }; counter.inc(); console.log(counter.n);` — output?",
    options: [
      "1",
      "0 — arrow ka this counter nahi hai, wo lexical (module/undefined) hai, isliye counter.n nahi badhta",
      "TypeError: cannot read property n",
      "NaN",
    ],
    correctIndex: 1,
    explanation:
      "Arrow function ka apna `this` nahi hota — wo lexically enclosing scope (yahan module top-level) se aata hai, `counter` se nahi. `this.n++` `counter.n` ko touch hi nahi karta, isliye `counter.n` `0` hi rehta hai. Method shorthand `inc() { this.n++; }` use karne se `this` `counter` banta aur output `1` aata. Strict module scope mein `this` `undefined` hone se error bhi aa sakta hai depending on setup, par binding-wise counter.n untouched.",
    difficulty: "medium",
  },
  {
    id: "arrow-functions-2",
    question:
      "`const make = id => { id: id };` — `make(5)` kya return karta hai?",
    options: [
      "{ id: 5 }",
      "undefined — { } ko function body samjha gaya, id: ek label ban gaya",
      "5",
      "SyntaxError",
    ],
    correctIndex: 1,
    explanation:
      "Braces ke saath arrow body ek block hai, object literal nahi. `id: id` yahan ek labeled statement hai (`id:` label, `id` expression statement), koi return nahi — isliye `undefined`. Object literal implicitly return karne ke liye parentheses chahiye: `id => ({ id: id })`. SyntaxError nahi aata kyunki labeled statement valid JS hai.",
    difficulty: "medium",
  },
  {
    id: "arrow-functions-3",
    question:
      "Class method ke andar `this.items.forEach(function (i) { this.process(i); })` `this.process is not a function` deta hai. Sabse saaf fix kya hai?",
    options: [
      "forEach ko for-loop se replace karo",
      "Callback ko arrow bana do: this.items.forEach(i => this.process(i)) — arrow lexically method ka this leta hai",
      "process ko global bana do",
      "this.items ko bind karo",
    ],
    correctIndex: 1,
    explanation:
      "Regular function callback ka `this` call-site pe decide hota hai — `forEach` use default (strict: `undefined`) ke saath call karta hai, isliye `this.process` fail hota hai. Arrow function ka apna `this` nahi hota; wo enclosing method ka `this` (instance) lexically leta hai, isliye `this.process` sahi resolve hota hai. `.bind(this)` ya `const self = this` bhi kaam karte hain par arrow sabse readable hai.",
    difficulty: "medium",
  },
  {
    id: "arrow-functions-4",
    question:
      "In mein se kaunsa case regular function DEMAND karta hai, arrow nahi chalega?",
    options: [
      "arr.map se numbers double karna",
      "Promise .then callback",
      "Ek constructor jise new se call karna hai",
      "React onClick handler",
    ],
    correctIndex: 2,
    explanation:
      "Arrow functions `new`-able nahi hain — unke paas `prototype` property nahi hoti, isliye `new (() => {})` `TypeError` deta hai. Constructor ke liye regular function ya `class` chahiye. Baaki teeno (map callback, .then, onClick) arrow ke liye perfect hain — inhe apna `this` nahi chahiye.",
    difficulty: "easy",
  },
];

export default quiz;
