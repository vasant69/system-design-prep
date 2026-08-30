import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "af-1",
    question:
      "Arrow function aur regular function mein sabse bada behavioural farak kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Arrow function ka apna `this` nahi hota — wo lexically enclosing scope se `this` uthata hai. Regular function ka `this` call-site pe decide hota hai. Arrow ke paas apna `arguments`, `super`, `new.target` bhi nahi, aur wo `new`-able nahi.",
    detailedAnswer:
      "Regular function ke internal slot mein `this` hota hai jo har call pe set hota hai (new / call-apply-bind / obj.method() / default). Arrow function mein wo slot hi nahi — jab arrow body mein `this` likha jaata hai, engine scope chain upar chad kar pehle enclosing regular function ya scope ka `this` use karta hai, exactly jaise koi normal variable resolve hota hai. Isi wajah se: (1) callback `this`-bug khatam ho jaata hai jab arrow ek method ke andar likha ho; (2) arrow ke andar `arguments` nahi milta (rest param `...args` use karo); (3) `new (() => {})` `TypeError` deta hai kyunki `prototype` property nahi hoti; (4) `super` bhi lexical hota hai. Syntax bonus: single expression body bina braces ke implicitly return hoti hai.",
    followUp:
      "Agar arrow ke paas apna `this` nahi hai, to `() => this.x` mein `this` kya hoga jab wo module ke top level pe likha ho?",
    redFlag:
      "\"Arrow bas ek chhota syntax hai, behaviour bilkul same\" — lexical this ko miss karna.",
  },
  {
    id: "af-2",
    question:
      "Kab tum arrow function use NAHI karoge? 3 concrete cases do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Object literal method jo apne object ki property `this` se padhta hai. (2) `Class.prototype.method` — instance `this` chahiye. (3) Constructor / generator, ya jab `arguments` object chahiye, ya jab `addEventListener` callback ko `this` = DOM element chahiye.",
    detailedAnswer:
      "Object method: `const o = { v: 1, get() { return this.v; } }` — yahan `get` ko `o` as `this` chahiye; arrow banate hi `this` lexical (module/undefined) ho jaata hai. Prototype method: `Widget.prototype.render = function () { return this.state; }` — arrow ke saath har instance ke liye `this` galat. Constructor: arrow `new`-able nahi. Generator: arrow generator ho hi nahi sakta. `arguments`: arrow mein nahi hota. Event handler: `el.addEventListener('click', function () { this // element })` — arrow ke saath `this` element nahi, `e.currentTarget` use karna padega. Mocha tests bhi: `it('...', function () { this.timeout(5000); })` — arrow se `this.timeout` undefined.",
    followUp:
      "Object method ko arrow banane par exactly kya galat hota hai — error aata hai ya silent wrong value?",
  },
  {
    id: "af-3",
    question:
      "Ye kya print karega?\n\n```javascript\nconst obj = {\n  name: 'Ada',\n  greet() {\n    const inner = () => console.log(this.name);\n    inner();\n  },\n};\nobj.greet();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "'Ada' print hoga. `inner` ek arrow hai — uska `this` lexically `greet` ka `this` hai, aur `greet` `obj.greet()` se call hua isliye `greet` ka `this` `obj` hai.",
    detailedAnswer:
      "Do steps: `obj.greet()` — implicit binding, isliye `greet` ke andar `this === obj`. `inner` arrow function `greet` ke body mein define hua hai; arrow ka apna `this` nahi, to wo enclosing scope (`greet` ka execution) ka `this` = `obj` use karta hai. `inner()` ko standalone call karne ke bawajood arrow ka `this` nahi badalta — arrow ke liye call-site irrelevant hai. Agar `inner` regular `function () {}` hota to `inner()` standalone call pe `this` `undefined` (strict) hota aur `this.name` `TypeError` deta — yahi wo classic bug hai jise arrow solve karta hai.",
    followUp:
      "`inner` ko `function () {}` bana do — ab output kya, aur usse `.bind` / self / arrow mein se kaunsa fix best hai?",
  },
  {
    id: "af-4",
    question:
      "React class component mein `handleClick = () => {}` (class field arrow) kyun popular hua tha?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Class field arrow `this` ko instance pe lexically fix kar deta hai. Isse `onClick={this.handleClick}` pass karne par `this` khota nahi, aur constructor mein `this.handleClick = this.handleClick.bind(this)` likhne ki zarurat nahi padti.",
    detailedAnswer:
      "Regular method `handleClick() {}` prototype pe hota hai; jab tum `onClick={this.handleClick}` likhte ho to sirf function reference pass hota hai, `this` chhoot jaata hai — click pe `this` `undefined`. Do fix the: constructor mein `.bind(this)`, ya class field arrow. Class field arrow har instance pe ek property banata hai jiska value ek arrow function hai jo constructor ke `this` (instance) ko lexically capture karta hai — is liye kaise bhi call ho, `this` instance rehta hai. Downside: har instance ke liye alag function object banta hai (prototype pe shared nahi), par readability aur bug-safety ke liye ye acceptable tha. Hooks aa jaane ke baad ye pattern kam relevant hai — ab `const handleClick = () => {}` function component ke andar closure se hi kaam ho jaata hai.",
    followUp:
      "Class field arrow ka memory / performance downside kya hai regular prototype method ke comparison mein?",
  },
  {
    id: "af-5",
    question:
      "`const f = () => { arguments[0] }` — ismein `arguments` kya refer karega?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Arrow function ka apna `arguments` nahi hota. `arguments` yahan enclosing regular function ka `arguments` refer karega; agar koi enclosing function nahi (module top-level) to `ReferenceError`. Sahi tarika: rest parameter `(...args)`.",
    detailedAnswer:
      "Jaise `this`, waise hi `arguments` bhi arrow ke liye lexical hai. Agar `f` kisi regular function `outer` ke andar define hua hai to `arguments` `outer` ka `arguments` object hoga — jo aksar bug hota hai kyunki tumhe `f` ke apne args chahiye the. Module ya script top level pe koi `arguments` scope mein nahi hota, to `ReferenceError: arguments is not defined`. Modern solution: `const f = (...args) => args[0]` — `args` ek real Array hai (`arguments` array-like tha), arrow ke saath fully compatible, aur ye purane `arguments` object ko har jagah replace kar deta hai.",
    followUp:
      "`arguments` object aur rest parameter `...args` mein 2 concrete farak batao.",
  },
];

export default questions;
