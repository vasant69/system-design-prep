import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "scope-1",
    question: "JavaScript mein scope kitne tarah ke hote hain, aur scope chain kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Teen: global, function, aur block scope (`let`/`const`/`class` ke liye). Scope chain = nested scopes ki linked list; jab naam current scope mein na mile to engine parent scope mein dekhta hai, phir uske parent mein... global tak, phir `ReferenceError`.",
    detailedAnswer:
      "Global scope poori file/program ke liye hai. Har function call apna scope banata hai. Har `{ }` block ek block scope banata hai, par usme sirf `let`/`const`/`class` trap hote hain — `var` block ko ignore karke nearest function/global scope mein chala jaata hai. Scope chain ka matlab: jab ek naam use hota hai, engine current scope se shuru karke bahar-bahar har enclosing scope check karta hai, aur pehla match jeet jaata hai (isliye inner `x` outer `x` ko shadow kar deta hai). Chain sirf bahar ki taraf jaati hai — outer scope inner ke variables kabhi nahi dekh sakta.",
    followUp: "`var` aur `let` ki scoping ek `for` loop mein kaise alag behave karti hai?",
    redFlag: "\"Scope decide hota hai function kahan se call hua uske hisaab se\" — ye dynamic scoping hai, JS lexical hai.",
  },
  {
    id: "scope-2",
    question: "Lexical scope aur dynamic scope mein farak kya hai? JS kaunsa use karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Lexical (JS wala): function ka outer scope wahan fix hota hai jahan wo LIKHA gaya. Dynamic: outer scope wahan se aata jahan se function CALL hua. JS purely lexical hai (sirf `this` call-time par decide hota hai, baaki variable lookup nahi).",
    detailedAnswer:
      "Lexical scoping mein sirf source code ki nesting maayne rakhti hai — ek function apne aas-paas ke (enclosing) scopes ko dekhta hai, chahe use kahin se bhi call kiya jaaye. Isi wajah se closures predictable hain: returned function apne birth-place ke variables yaad rakhta hai. Dynamic scoping (bash, kuch Lisp variants) mein call stack maayne rakhta hai — caller ke locals callee ko dikh jaate. JS mein variable resolution 100% lexical hai; sirf `this`, `arguments` aur (non-arrow) new.target call-time context se aate hain.",
    followUp: "Closures lexical scoping par kaise depend karte hain?",
  },
  {
    id: "scope-3",
    question:
      "`const v = 'A'; function read() { return v; } function outer() { const v = 'B'; return read(); } console.log(outer());` — kya aayega aur kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`'A'`. `read` global scope mein define hua hai, to uska `v` global `v` hai. `outer()` ke andar se call hone se koi farak nahi padta — JS lexical hai, `outer` ka local `v = 'B'` `read` ko dikhta hi nahi.",
    detailedAnswer:
      "`read` ka scope chain hai: `read` ka apna scope -> global. `outer` uss chain mein kahin nahi. Jab `read()` chalta hai (chahe kahin se bhi call hua ho), `v` ka lookup `read` ke local scope (khaali) se global (`'A'`) tak jaata hai. Agar JS dynamic-scoped hota to answer `'B'` hota. Yeh sawaal aksar 'lexical vs dynamic' samajh check karne ke liye poochha jaata hai.",
    followUp: "Agar `read` ko `outer` ke andar define kar dein to output kya hoga?",
  },
  {
    id: "scope-4",
    question: "Ek variable galti se global ban raha hai — ye kaise hota hai aur kaise rokoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Non-strict mode mein bina `var`/`let`/`const` ke `x = 1` likhna x ko global bana deta hai (implicit global). Fix: `\"use strict\"` (ya ES modules, jo hamesha strict hote hain), plus ESLint `no-undef` / `no-global-assign`.",
    detailedAnswer:
      "Sloppy mode mein assignment target agar kisi scope mein declared nahi hai to engine chup-chaap use global object par bana deta hai — ek typo (`totl` instead of `total`) silently naya global create kar deta hai aur bugs chhupa jaata hai. Strict mode isko `ReferenceError` bana deta hai. Modern setup: har file ES module ho (import/export), jo automatically strict hoti hai; bundle ke top par `\"use strict\"`; aur linter par `no-implicit-globals` / `no-undef`. Loop counters aur temporaries ke liye hamesha `let`/`const` likhna muscle-memory hona chahiye.",
    followUp: "ES modules strict mode ke alawa aur kya-kya alag karte hain (top-level `this`, etc.)?",
  },
];

export default questions;
