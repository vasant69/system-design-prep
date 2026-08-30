import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fde-1",
    question:
      "Function declaration aur function expression mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Declaration ek statement hai jo 'function' keyword se shuru hoti hai aur poori (naam + body) hoist hoti hai — isliye apni line se pehle bhi callable. Expression mein function ek value hai jo variable ko assign hoti hai; sirf binding hoist hota hai (var -> undefined, let/const -> TDZ), body us line pe assign hoti hai.",
    detailedAnswer:
      "Syntactic test: line ka pehla token dekho. `function foo() {}` — declaration. `const foo = function () {}` ya `const foo = () => {}` — expression. Behaviour ka farak hoisting mein hai. Creation phase mein engine declaration ka naam aur body dono register kar deta hai, isliye `foo(); function foo() {}` valid hai. Expression mein sirf variable ka binding register hota hai — `var` ke saath `undefined` (call pe `TypeError: foo is not a function`), `let`/`const` ke saath Temporal Dead Zone (access pe `ReferenceError`). Practical impact: declarations 'helpers neeche, main logic upar' style allow karti hain; expressions tab natural hain jab function ek value ki tarah pass/return/assign ho raha ho, aur `const` expression 'use before define' ko loud error banata hai.",
    followUp:
      "Agar function expression ko var se declare karo aur uski line se pehle call karo to exact error kya milega?",
    redFlag:
      "\"Dono bilkul same hain, sirf likhne ka style alag hai\" — hoisting ka farak miss karna.",
  },
  {
    id: "fde-2",
    question:
      "Named function expression kya hota hai aur uska naam kahan visible hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`const f = function g() {}` — yahan `g` named function expression ka naam hai. `g` sirf us function ke apne body ke andar bind hota hai (recursion ke liye handy) aur bahar se accessible nahi hota. Bahar sirf `f` available hai.",
    detailedAnswer:
      "Do fayde hain. Pehla: function apne aap ko naam se call kar sakta hai bina us outer variable pe depend kiye — agar koi `f` ko reassign kar de ya function kisi aur naam se pass ho, tab bhi internal recursion `g` ke through safe rehti hai. Dusra: stack traces aur `f.name` mein 'anonymous' ki jagah `g` dikhta hai, jisse debugging aur profiling aasan ho jaati hai. Scope rule: engine function ke liye ek chhota extra scope banata hai jismein sirf `g` hota hai, function body ke bahar `g` `ReferenceError` deta hai. Modern engines anonymous `const f = () => {}` ka naam bhi assignment se infer kar lete hain, par explicit named expression ab bhi clearer hai jab function idhar-udhar pass hota ho.",
    followUp:
      "Arrow function ko naam kaise milta hai — usme to `function name() {}` syntax hi nahi?",
  },
  {
    id: "fde-3",
    question:
      "Ye code kya print karega?\n\n```javascript\nconsole.log(typeof a, typeof b);\nfunction a() {}\nvar b = function () {};\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "'function undefined' print hoga. `a` ek declaration hai — body ke saath hoist, isliye pehli line pe already function. `b` ek var expression hai — binding hoist hoke `undefined`, assignment abhi hua nahi.",
    detailedAnswer:
      "Creation phase: `a` declaration poori register hoti hai, `var b` register hoke `undefined` set hota hai. Execution phase line 1: `typeof a` -> `\"function\"`, `typeof b` -> `\"undefined\"` (kyunki `b` ka function abhi line 3 pe assign hoga). Agar `var b` ki jagah `let b` hota to line 1 pe `typeof b` `ReferenceError` deta — `let`/`const` TDZ mein `typeof` bhi safe nahi hota, jabki `var` ke saath `undefined` milta hai. Ye exactly wahi farak dikhata hai jo declaration bnaam expression + var bnaam let/const ke beech hota hai.",
    followUp:
      "Agar line 3 ko `let b = function () {}` bana dein to line 1 ka output kaise badlega?",
    redFlag:
      "Dono ke liye 'function' bolna — expression ke binding-only hoisting ko ignore karna.",
  },
  {
    id: "fde-4",
    question:
      "IIFE kya hai, aur aaj ke ES-modules code mein kya iski zaroorat hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "IIFE = Immediately Invoked Function Expression: `(function () { ... })()` — function ko wrap karke turant call kar dena. Purpose ek private scope banana tha taaki `var` variables global na banein. ES modules har file ko apna scope dete hain, isliye naye module code mein IIFE ki zaroorat kam hai.",
    detailedAnswer:
      "Pre-2015, browser mein saari `<script>` files ek hi global scope share karti thi. Do libraries agar dono `var config` declare karti to ek dusre ko overwrite kar deti. IIFE ne har library ko `(function () { ... })()` mein wrap karke uske `var`s ko private bana diya, aur zarurat ki cheezein `window` pe explicitly expose ki ya arguments ke through inject ki (`(function ($) { ... })(jQuery)`). Aaj `import`/`export` wali file automatically module scope mein hoti hai — top-level `const`/`let`/`var` module-private hote hain, global nahi. Isliye modern code mein IIFE mostly legacy bundles, inline `<script>` snippets, ya ek chhota async wrapper (`(async () => { await ... })()`) ke liye bacha hai.",
    followUp:
      "Top-level await aa jaane ke baad `(async () => {})()` wrapper ki bhi zaroorat kahan khatam ho jaati hai?",
  },
  {
    id: "fde-5",
    question:
      "Tum kab declaration prefer karoge aur kab expression? Ek practical rule do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Top-level named helper functions ke liye declaration — hoisted hone se file mein order flexible rehta hai aur main logic upar rakh sakta hoon. Jab function ek value ki tarah move kare (callback, object method, conditional assignment, export-as-value) tab const expression — reassignment rukta hai aur 'use before define' TDZ pe loud error deta hai.",
    detailedAnswer:
      "Declaration ka strong case: utility module jismein 5-6 helpers hain jo ek dusre ko call karte hain, ya mutual recursion (`isEven`/`isOdd`). Hoisting yahan feature hai — reviewer top pe `export` aur main function padhta hai, details neeche. Expression ka strong case: `arr.map(fn)` jaisa inline callback, React component ke andar `const handleClick = () => {}` (render scope pe closure + value pass), ya `const validator = strict ? strictCheck : looseCheck` jaisa conditional assignment. `if`/`else` block ke andar declaration kabhi nahi — behaviour strict/sloppy mode mein alag hai; wahan `let fn; if (...) fn = ...`. Bug-catching angle: agar tum chahte ho ki galti se function ko define hone se pehle call karne pe code crash kare (bug jaldi mile), to `const` expression better hai kyunki declaration wo call silently chala degi.",
    followUp:
      "Ek codebase mein sab kuch `const fn = () => {}` style mein likha hai — iska ek downside batao.",
  },
];

export default questions;
