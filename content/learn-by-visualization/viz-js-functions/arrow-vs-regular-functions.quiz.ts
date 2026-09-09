import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "arrow-vs-regular-functions-1",
    question:
      "`const obj = { v: 42, get() { return (() => this.v)(); } }; obj.get();` — kya return hota hai?",
    options: ["`42`", "`undefined`", "`TypeError`", "`ReferenceError`"],
    correctIndex: 0,
    explanation:
      "`obj.get()` implicit binding se chalta hai, to `get` ke andar `this === obj`. Andar wala arrow function apna `this` nahi rakhta — wo `get` ka `this` (yaani `obj`) borrow karta hai, isliye `this.v` -> `42`. Agar andar `function () { return this.v; }` hota to uska `this` undefined/global hota aur `undefined` milta ya crash hota.",
    difficulty: "easy",
  },
  {
    id: "arrow-vs-regular-functions-2",
    question: "`const A = () => {}; new A();` — result kya hai?",
    options: [
      "Ek khaali object banta hai",
      "`TypeError: A is not a constructor`",
      "`undefined` return hota hai",
      "SyntaxError parse time pe",
    ],
    correctIndex: 1,
    explanation:
      "Arrow functions ke paas `[[Construct]]` internal method aur `prototype` property nahi hoti, isliye `new` ke saath use nahi ho sakte — runtime `TypeError: A is not a constructor` deta hai. Constructor chahiye to regular `function` ya `class` use karo.",
    difficulty: "easy",
  },
  {
    id: "arrow-vs-regular-functions-3",
    question:
      "Regular function aur arrow function ke `arguments` object mein kya farak hai?",
    options: [
      "Dono ke paas apna `arguments` hota hai",
      "Regular ke paas apna `arguments` hota hai; arrow ke paas nahi — wo enclosing scope ka `arguments` dekhta hai",
      "Arrow ke paas apna hota hai; regular ke paas nahi",
      "Kisi ke paas nahi — dono ko rest `...args` chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Regular function har call pe apna `arguments` (array-like) banata hai. Arrow function `arguments` bind nahi karta — agar arrow ke andar `arguments` likha to wo bahar wale regular function ka `arguments` resolve karega (ya na mila to ReferenceError). Isliye arrow mein saare args chahiye to `(...args) =>` use karo.",
    difficulty: "medium",
  },
  {
    id: "arrow-vs-regular-functions-4",
    question:
      "Ek `class` ke andar event handler jise `this` = instance chahiye — kaunsa approach best hai?",
    options: [
      "Prototype method (regular) jise har jagah `.bind(this)` karna easy hai bhoolna",
      "Class field arrow: `handleClick = () => { ... }`",
      "Arrow function ko `new` ke saath define karna",
      "`var self = this` har method ke top pe rakhna",
    ],
    correctIndex: 1,
    explanation:
      "Class field arrow (`handleClick = () => {}`) construction ke waqt instance ke scope mein bind hota hai, to `this` hamesha instance rehta hai chahe handler ko detach karke pass kiya jaye. Prototype regular method ko explicitly `bind` karna padta hai (bhoolna common bug). `new` arrow pe chalta hi nahi. `var self = this` purana workaround hai, arrow field usse cleaner hai.",
    difficulty: "medium",
  },
];

export default quiz;
