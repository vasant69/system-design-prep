import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tb-1",
    question: "JavaScript mein `this` kaise decide hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`this` function ke call-site pe decide hota hai, definition pe nahi. Precedence: (1) `new` -> naya object; (2) explicit `call`/`apply`/`bind` -> diya gaya object; (3) implicit `obj.method()` -> dot ke left ka object; (4) default -> strict mode `undefined`, sloppy mode global object. Arrow functions in rules ko ignore karke `this` lexically enclosing scope se lete hain.",
    detailedAnswer:
      "Ek hi function ko alag-alag call karo to `this` alag hoga — `this` late-bound hai. Rules highest-to-lowest: `new f()` — engine fresh object banata hai, use `this` set karta hai, prototype link karta hai, aur return karta hai (jab tak f khud koi object return na kare). `f.call(obj)` / `f.apply(obj)` / `f.bind(obj)()` — `this` explicitly `obj`. `obj.method()` — `this` `obj` (sirf aakhri dot: `a.b.c.m()` -> `this` = `a.b.c`). Kuch bhi nahi — `f()` — default: `'use strict'` / ES module mein `this` `undefined`, warna `globalThis`. Arrow function ka apna `this` slot hi nahi — wo scope chain se enclosing `this` uthata hai, call form irrelevant. Practical rule: call mein dot dhoondo, `new` dhoondo, `.call/.bind` dhoondo — nahi mila to default.",
    followUp:
      "`const f = obj.method; f()` — `this` kya hoga aur usse kaise theek karoge?",
    redFlag:
      "\"this us object ko point karta hai jismein method define hua hai\" — define nahi, call-site.",
  },
  {
    id: "tb-2",
    question:
      "Ye kya print karega?\n\n```javascript\nconst obj = {\n  name: 'obj',\n  regular: function () { return this.name; },\n  arrow: () => this.name,\n};\nconsole.log(obj.regular(), obj.arrow());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`obj.regular()` -> 'obj' (implicit binding, dot ke left obj). `obj.arrow()` -> undefined ya error — arrow ka `this` lexical hai, module top-level pe `this` `undefined` (ya browser sloppy script mein `window`), `obj` nahi.",
    detailedAnswer:
      "`regular` ek normal function hai; `obj.regular()` call form implicit binding trigger karta hai, `this === obj`, to `this.name` = 'obj'. `arrow` ek arrow function hai jo object literal ke andar likha hai — par object literal koi scope nahi banata, to arrow ka lexical `this` module/script ke top-level `this` hai. ES module mein wo `undefined` hai (`this.name` -> `TypeError`); classic non-module browser script mein `window` hai (`window.name` -> usually `''`). Point: arrow ko object method banana `this` ko `obj` se nahi jodta — ye ek common bug hai. Object methods regular function ya method shorthand hone chahiye.",
    followUp:
      "`obj.arrow` ko theek karke `obj` ka name return karwao — kya badloge?",
  },
  {
    id: "tb-3",
    question:
      "`obj.method` ko `setTimeout`/event listener mein pass karne par `this` kyun toot jaata hai, aur 3 fixes kya hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`setTimeout(obj.method, 1000)` sirf function reference pass karta hai — call ke waqt `obj.` dot gayab hota hai, to `setTimeout` use standalone call karta hai aur `this` default (`undefined`/global) ban jaata hai. Fixes: (1) arrow-wrap `() => obj.method()`; (2) `obj.method.bind(obj)`; (3) `const self = obj` aur closure.",
    detailedAnswer:
      "`obj.method` expression method ko object se 'detach' kar deta hai — ab wo ek plain function value hai. Jab `setTimeout` ise call karta hai to koi base object nahi, default binding lagti hai. Fixes: (1) Arrow wrapper — `setTimeout(() => obj.method(), 1000)` — arrow ke andar `obj.method()` full call form hai, dot present, `this === obj`. Sabse readable. (2) `.bind` — `setTimeout(obj.method.bind(obj), 1000)` — ek naya permanently-bound function object banta hai; thoda extra memory, aur agar baar-baar bind ho to har baar naya function (React mein isse `useCallback`-jaisa concern). (3) `const self = obj; setTimeout(function () { self.method(); }, 1000)` — purana closure trick, still valid. React class components mein pattern tha: constructor mein `this.handleClick = this.handleClick.bind(this)`.",
    followUp: "Arrow-wrap aur `.bind` mein — event listener remove karne ke context mein kaunsa problematic hai?",
  },
  {
    id: "tb-4",
    question:
      "`new` keyword ke saath call karne par step-by-step kya hota hai `this` ke liye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`new Fn()`: (1) ek naya khaali object banta hai; (2) uska internal prototype `Fn.prototype` pe set hota hai; (3) `Fn` us naye object ko `this` bana kar chalti hai; (4) agar `Fn` koi object explicitly return nahi karti to naya object return hota hai (primitive return ignore hota hai).",
    detailedAnswer:
      "`function Person(name) { this.name = name; }` `const p = new Person('A')` ke steps: naya object `{}` banaya, `Object.getPrototypeOf(newObj) === Person.prototype` set kiya (isliye `p` prototype methods access kar sakta hai), phir `Person` ke andar `this` = wo naya object — `this.name = name` us object pe property daalta hai. `Person` `return` statement nahi rakhti, to `new` naya object return kar deta hai — `p`. Agar `Person` `return { custom: 1 }` karti to `p` wo object hota (`this` wala discard). Agar `return 42` (primitive) karti to wo ignore hota aur `this` wala object hi milta. `new` binding explicit `call`/`bind` se bhi jeetti hai — `bind` kiya function `new` ke saath call karo to bound `this` ignore hota hai aur naya object use hota hai.",
    followUp:
      "`const BoundPerson = Person.bind({ x: 1 }); new BoundPerson('A')` — `this` kya hoga?",
  },
  {
    id: "tb-5",
    question:
      "Kab tum `this`-based code likhoge aur kab avoid karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`this` tab use karo jab ek method ko multiple instances/objects pe reuse karna ho — class/prototype methods, object literal methods, constructors. Avoid karo simple utility functions mein (pure params better), functional-style pipelines mein, aur jahan method idhar-udhar callbacks ke roop mein pass hoga (bind/arrow overhead + bug risk).",
    detailedAnswer:
      "`this` ka strong case: `class BankAccount { deposit(amt) { this.balance += amt; } }` — ek `deposit` implementation, har account instance apna `this.balance`. Method borrowing bhi (`Array.prototype.slice.call(arrayLike)`). Avoid ka case: `function formatCurrency(amount, currency) { ... }` — koi `this` ki zarurat nahi, seedha params; test karna aur compose karna trivial. Functional code (`pipe(parse, validate, save)`) mein `this`-free functions rakhne se refactor safe rehta hai. Aur agar ek object ke methods mostly callbacks banenge (event handlers), to har jagah `.bind`/arrow-wrap ka overhead aata hai — waha closure over ek explicit variable ya module-level function clearer ho sakta hai. Rule of thumb: `this` OO-shaped stateful cheezon ke liye; pure transforms ke liye nahi.",
    followUp:
      "Ek object jiske saare methods event handlers ban jaate hain — tum usko `this` ke bina kaise design karoge?",
  },
];

export default questions;
