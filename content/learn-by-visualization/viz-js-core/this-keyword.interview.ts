import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "this-1",
    question: "`this` ki value kaise decide hoti hai? 4 rules priority order mein batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Call-time par decide hota hai, top-to-bottom: (1) `new Fn()` -> `this` = naya object. (2) `fn.call/apply/bind(o)` -> `this` = `o`. (3) `obj.method()` -> `this` = `obj` (dot ke left). (4) plain `fn()` -> strict mein `undefined`, warna global. Arrow ka apna `this` nahi — lexical.",
    detailedAnswer:
      "`this` static nahi hai; wahi function alag call-styles se alag `this` paata hai. `new` sabse strong: constructor ke andar `this` fresh instance hota hai. Phir explicit binding — `call`/`apply` turant call karte hain given `this` ke saath, `bind` ek naya function deta hai jiska `this` permanently fixed hai (baad ki `call` bhi use override nahi karti). Phir implicit — `obj.method()` mein `this` `obj`. Kuch bhi na ho to default — strict mode aur ES modules mein `undefined` (isliye detached method crash karta hai), sloppy mode mein `globalThis`. Arrow functions in sab rules ko skip karte hain: unka `this` wahi hai jo unke enclosing lexical scope ka tha.",
    followUp: "Arrow function ke `this` ko `call` se change kar sakte ho? Kyun / kyun nahi?",
    redFlag: "\"`this` hamesha us object ko point karta hai jisme function likha hai\" — nahi, `this` definition-site se nahi, call-site se aata hai.",
  },
  {
    id: "this-2",
    question:
      "`const o = { n: 1, get() { return this.n; } }; setTimeout(o.get, 0);` mein `this` `undefined`/galat aa raha hai. Kyun, aur 2 fix batao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`o.get` ko function reference ki tarah pass kiya — `setTimeout` use plain `get()` ki tarah call karta hai, `o.` ke bina, to implicit binding toot jaati hai. Fixes: `setTimeout(o.get.bind(o), 0)` ya `setTimeout(() => o.get(), 0)`.",
    detailedAnswer:
      "`setTimeout(o.get, 0)` sirf function value pass karta hai; jab timer fire hota hai to engine use bina kisi receiver ke invoke karta hai -> strict/module mein `this` `undefined`, `undefined.n` -> TypeError. `bind` se ek naya function banta hai jiska `this` `o` par fixed hai. Arrow wrapper `() => o.get()` fire hone par `o.get()` ko as-a-method call karta hai, to implicit binding wapas lagti hai. Class components / event handlers mein bhi yahi issue hota hai — solution wahi (constructor bind ya arrow class field).",
    followUp: "`bind` wala approach har render par naya function banata hai — React mein iska kya nuksan hai?",
  },
  {
    id: "this-3",
    question: "Arrow function ka `this` regular function se kaise alag hai? Kab arrow galat choice hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Regular function ka `this` call-time par set hota hai (4 rules). Arrow ka apna `this` hota hi nahi — wo lexically enclosing scope ka `this` use karta hai, aur `call`/`apply`/`bind` use badal nahi sakte. Arrow galat hai jab tumhe dynamic `this` chahiye: object methods, prototype methods, aur `new` (arrow constructor ban hi nahi sakta).",
    detailedAnswer:
      "Arrow tab perfect hai jab tum chahte ho ki `this` wahi rahe jo aas-paas ke code ka hai — jaise `class` method ke andar `arr.map(x => this.transform(x))`, ya `setTimeout(() => this.tick(), 1000)`. Arrow tab galat hai jab: (1) object literal method — `{ name, hi: () => this.name }` mein `this` object nahi, outer scope hai. (2) `Constructor.prototype.method` — arrow lexical `this` le lega, instance nahi. (3) event handler jise `event.currentTarget` as `this` chahiye. (4) library APIs jo callback ko specific `this` ke saath call karti hain. Rule: dynamic `this` chahiye -> regular; surrounding `this` chahiye -> arrow.",
    followUp: "Arrow function `arguments` object ke saath kaise behave karta hai?",
  },
  {
    id: "this-4",
    question:
      "React class component ya DOM event handler mein `this` `undefined` aa raha hai — kyun, aur production mein kaise fix karte ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Handler ko JSX/`addEventListener` ne callback ki tarah store kiya — call ke waqt `this.handleClick()` nahi, plain `handleClick()` hota hai, to implicit binding nahi lagti (strict mode -> `undefined`). Fix: constructor mein `this.handleClick = this.handleClick.bind(this)`, ya handler ko arrow class field banao (`handleClick = () => {...}`).",
    detailedAnswer:
      "Class body strict mode mein chalti hai, to detached method ka `this` `undefined` hota hai. Do standard fixes: (1) constructor bind — `this.onSave = this.onSave.bind(this)` — ek baar bind, har render same reference. (2) arrow class field — `onSave = () => { this.setState(...) }` — `this` lexically instance ka, bas har instance ke liye ek naya function (memory thoda jyada). Function components mein yeh problem hoti hi nahi kyunki `this` use hi nahi hota — closures aur hooks se state milta hai. Plain DOM ke liye: `el.addEventListener('click', this.onClick.bind(this))` aur remove ke liye wahi bound reference store karo.",
    followUp: "Function component + hooks class ke `this`-binding jhamele ko kaise poori tarah khatam kar dete hain?",
  },
];

export default questions;
