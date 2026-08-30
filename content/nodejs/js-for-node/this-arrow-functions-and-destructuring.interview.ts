import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tafd-1",
    question:
      "Arrow function aur regular function mein `this` ka farak batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Regular function ka `this` call site par decide hota hai — `new`, explicit `bind`/`call`/`apply`, `obj.fn()` method call, ya default (`undefined` in strict mode/ESM). Arrow function ka apna `this` hota hi nahi; wo lexically enclosing scope ka `this` use karta hai, aur `bind`/`call` se badla nahi ja sakta.",
    detailedAnswer:
      "Regular function: har call par ek naya execution context, jismein `this` slot 4 rules ke precedence se set hota hai — `new Fn()` (naya instance) > `fn.call/apply/bind(obj)` > `obj.fn()` (dot ke left) > `fn()` seedha (default: `undefined` strict/ESM, `globalThis` sloppy). Key insight: `const f = obj.method; f();` — ab `.` ke left kuch nahi, default binding lagti hai, `this` `undefined`.\n\nArrow function: koi apna `this` slot nahi. `this` ko scope chain se resolve karta hai — bilkul ek normal variable ki tarah — jab tak enclosing regular function ya module top-level ka `this` na mil jaye. Isliye `arrowFn.call(x)` ka `this` argument silently ignore hota hai. Arrow ke paas `arguments`, `prototype`, apna `super`, aur `new` bhi nahi — constructor nahi ban sakta.\n\nPractical rule: callbacks (`map`, `setTimeout`, `.then`, class method ke andar) -> arrow, taaki outer `this` bina `bind` ke mile. Object methods / constructors / prototype methods -> regular function ya method shorthand, kyunki unhe apne object ka dynamic `this` chahiye.",
    followUp: "`call`, `apply`, aur `bind` mein kya farak hai?",
    redFlag: "\"Arrow function bas chhota syntax hai regular function ka\" — `this`, `arguments`, `new`, `prototype` ka behaviour alag hai.",
  },
  {
    id: "tafd-2",
    question:
      "Ek classic bug: class method ko event listener ya callback ki tarah pass karne par `this` chhoot jata hai. Dikhao aur do fixes batao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`const f = obj.method; f()` ya `setTimeout(obj.method, 100)` — method apne object se detach ho jata hai, call hone par `this` `undefined`. Fix 1: arrow wrapper `setTimeout(() => obj.method(), 100)`. Fix 2: `setTimeout(obj.method.bind(obj), 100)`.",
    detailedAnswer:
      "```javascript\nclass Timer {\n  constructor() { this.count = 0; }\n  tick() { this.count++; console.log(this.count); }\n}\nconst t = new Timer();\nsetTimeout(t.tick, 100); // TypeError: Cannot read properties of undefined (reading 'count')\n```\n\n`t.tick` ko as a bare reference pass kiya — `setTimeout` use plain call karta hai, `this` `undefined`.\n\nFixes:\n```javascript\nsetTimeout(() => t.tick(), 100);        // arrow wrapper\nsetTimeout(t.tick.bind(t), 100);        // bind\n// ya class field:\n// tick = () => { this.count++; }        // har instance ka bound method\n```\n\n`bind` tab better jab tumhe wahi function reference `removeListener`/`removeEventListener` ke liye chahiye — ek arrow har baar naya function banata hai, to usse `off` nahi kar paoge.",
    followUp: "`.bind()` har call par naya function object banata hai — iska ek practical consequence kya hai?",
  },
  {
    id: "tafd-3",
    question:
      "Object spread `{ ...a }` shallow copy hai — ise ek concrete bug ke saath samjhao aur deep copy ke options batao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`{ ...a }` sirf top-level properties copy karta hai; nested objects/arrays ka reference share hota hai. To `copy.address.city = 'X'` original ko bhi badal deta hai. Deep copy: per-level spread (`{ ...a, address: { ...a.address } }`), ya `structuredClone(a)` (modern Node), ya `JSON.parse(JSON.stringify(a))` (loses Dates/functions/undefined).",
    detailedAnswer:
      "```javascript\nconst original = { name: 'A', address: { city: 'Pune' } };\nconst copy = { ...original };\ncopy.address.city = 'Mumbai';\nconsole.log(original.address.city); // 'Mumbai' — leak!\n```\n\n`copy` ek naya top-level object hai, lekin `copy.address` aur `original.address` wahi ek object hain. Ye state-management bugs mein bahut common hai — ek 'immutable update' jo galti se shared nested state mutate kar deta hai (Redux reducers, React setState).\n\nOptions: (1) `structuredClone(original)` — built-in Node 17+, handles nested objects, arrays, Maps, Dates, typed arrays; functions par throw karta hai. (2) Per-level spread jab sirf ek-do nested levels hain aur performance-sensitive ho. (3) `JSON.parse(JSON.stringify(x))` — quick but Date -> string, `undefined`/functions drop, circular refs par throw. (4) Immer jaisi library structural sharing ke saath immutable updates deti hai.",
    followUp: "`structuredClone` ek circular reference wale object par kya karta hai?",
    redFlag: "`{ ...a }` ko deep copy maan lena aur nested mutation se surprised hona.",
  },
  {
    id: "tafd-4",
    question:
      "Modern Node code mein destructuring, spread, default parameters, aur template literals kaise use hote hain? Kuch idiomatic examples do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Destructuring request/DB data unpack karne ke liye (`const { id, name } = req.params`), spread config merge ke liye (`{ ...defaults, ...overrides }`), default params options object safe rakhne ke liye (`function f(opts = {})`), template literals messages/queries ke liye (`` `user ${id} not found` ``).",
    detailedAnswer:
      "```javascript\n// destructuring + defaults in a parameter\nfunction createServer({ port = 3000, host = 'localhost', ...rest } = {}) {\n  console.log(`listening on ${host}:${port}`, rest);\n}\n\n// = {} default: bina argument call safe rahe, undefined destructure crash na kare\ncreateServer();\ncreateServer({ port: 8080, tls: true });\n\n// spread for merge (right wins)\nconst options = { ...DEFAULTS, ...userOptions };\n\n// array destructuring with rest\nconst [first, ...others] = args;\n\n// destructure in callback param\nconst ids = users.map(({ id }) => id);\n```\n\nCommon lines: `const { rows } = await pool.query(...)`, `const { status, page = 1 } = req.query`, `const merged = { ...a, ...b }`, `throw new Error(\\`invalid ${field}\\`)`. `= {}` default parameter par lagana zaroori hai — warna `f()` call par `undefined` ko destructure karne se `TypeError: Cannot destructure property ... of undefined`.",
    followUp: "`function f({ x } = {})` mein wo `= {}` kya prevent karta hai?",
  },
  {
    id: "tafd-5",
    question:
      "Arrow function kab use NAHI karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Object methods (arrow module/global `this` capture karega, object nahi — method shorthand use karo), constructors aur prototype methods (arrow `new` ke saath kaam nahi karta, `prototype` nahi hota), aur event handlers jahan `this` ko DOM element ya emitter chahiye (`emitter.on('x', function () { this === emitter })` — arrow yahan `this` tod deta hai).",
    detailedAnswer:
      "Concrete cases:\n1. **Object method**: `const obj = { name: 'x', greet: () => this.name }` — `this` `obj` nahi. Use `greet() { return this.name }`.\n2. **Constructor**: arrow `new` ke saE throw karta hai — `const A = () => {}; new A()` -> TypeError.\n3. **Prototype method**: `Foo.prototype.bar = () => {...}` — `this` instance nahi.\n4. **Emitter/DOM handler jahan receiver chahiye**: `socket.on('data', function () { this === socket })` — arrow mein `this` outer scope ka.\n5. **Dynamic `this` chahiye**: ek generic function jo `call`/`apply` se alag objects par chalta hai — arrow ka `this` override nahi hota.\n\nJahan arrow sahi hai: chhote pure callbacks (`map`/`filter`/`reduce`), class method ke andar `setTimeout`/`.then`/`forEach` (outer instance `this` chahiye), aur jab `this`/`arguments` ki zaroorat hi nahi.",
    followUp: "React class components mein log `handleClick = () => {}` (class field arrow) kyun likhte the?",
    redFlag: "Har jagah arrow function use karna \"kyunki wo modern hai\" — object methods aur constructors mein wo galat behaviour deta hai.",
  },
];

export default questions;
