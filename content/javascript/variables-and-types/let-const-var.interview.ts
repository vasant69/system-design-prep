import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lcv-1",
    question: "let, const aur var mein kya farak hai? Teen concrete points do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Scope: var function-scoped, let/const block-scoped. Reassignment: const ka binding reassign nahi hota, let/var ka hota hai. Hoisting: var hoist hoke undefined ban jaata hai, let/const declaration line tak Temporal Dead Zone mein rehte hain (access se ReferenceError).",
    detailedAnswer:
      "(1) Scope — `var` sirf function boundary maanta hai, isliye ek `if` block ke andar `var x` block ke bahar bhi visible hai. `let`/`const` kisi bhi `{ }` block tak simit hain. (2) Reassignment — `const` ka *binding* fix hai (`x = ...` TypeError), par agar value object/array hai to uske andar mutation allowed hai. `let` aur `var` reassign ho sakte hain. (3) Hoisting — teeno declarations hoist hote hain, par `var` turant `undefined` se initialise hota hai (declaration se pehle access silently `undefined` deta hai), jabki `let`/`const` TDZ mein rehte hain — declaration line se pehle koi bhi access, `typeof` bhi, `ReferenceError` deta hai. Extra: `var` same scope mein redeclare ho sakta hai, `let`/`const` nahi; `const` ko declaration ke waqt initialise karna mandatory hai.",
    followUp: "TDZ ka fayda kya hai — var ka undefined milna to crash se better lagta hai?",
    redFlag: "\"const matlab value kabhi change nahi hoti\" — ye binding vs value ka confusion hai.",
  },
  {
    id: "lcv-2",
    question: "`const user = { name: 'A' }; user.name = 'B';` — ye chalta hai. Toh const 'constant' kaise hua?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "const value ko nahi, binding ko constant banata hai. `user` hamesha usi object ko point karega — `user = {...}` TypeError dega. Lekin us object ke andar properties add/change/delete karna allowed hai kyunki object wahi rehta hai.",
    detailedAnswer:
      "Variable ke do hisse hain: naam (binding) aur wo jis cheez ko point kar raha (value/reference). `const` sirf binding lock karta hai — `user` ko kisi *doosre* object/value pe point nahi kara sakte. Lekin `user` jis object ko point kar raha hai, wo object mutable hai: `user.name = 'B'`, `user.age = 30`, `delete user.name` sab valid, kyunki binding wahi object point karta rahta hai. Agar object ke andar bhi immutability chahiye to `Object.freeze(user)` — par wo shallow hai (nested objects freeze nahi hote). Deep immutability ke liye recursive freeze helper ya TypeScript `readonly`/`as const` ya Immer jaisi library.",
    followUp: "Object.freeze shallow kyun hai aur deep freeze kaise karoge?",
  },
  {
    id: "lcv-3",
    question: "Hoisting kya hai? var, let, const teeno ke saath ye kaise behave karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Hoisting = JS engine code chalane se pehle scope ko scan karke saare declarations 'top' pe utha leta hai (memory reserve). var us waqt undefined se initialise ho jaata hai; let/const memory to milti hai par 'uninitialised' state (TDZ) mein — declaration line pe hi usable bante hain.",
    detailedAnswer:
      "Do phase hain: creation aur execution. Creation phase mein engine current scope ke saare `var`/`let`/`const`/function declarations register karta hai. `var` ko turant `undefined` bind kar diya jaata hai — isliye `console.log(a); var a = 1;` `undefined` deta hai, error nahi. Function declarations poori tarah hoist hoti hain (body ke saath), isliye unhe define hone se pehle call kar sakte ho. `let`/`const` bhi register hote hain par 'not yet initialised' mark hote hain; block ke shuru se declaration line tak ka gap = Temporal Dead Zone, aur is window mein access (`typeof` sameet) `ReferenceError` deta hai. Practical takeaway: `let`/`const` ka TDZ 'use before declare' bug ko chhupne nahi deta — jo `var` ke silent `undefined` se behtar hai.",
    followUp: "Function declaration aur function expression mein hoisting ka farak kya hai?",
  },
  {
    id: "lcv-4",
    question:
      "for loop mein setTimeout ke saath var use karo to sab callbacks same value print karte hain. Kyun, aur let se kaise theek hota hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`var i` puri loop ke liye ek hi binding hai. Jab async callbacks chalte hain, loop khatam ho chuka hota hai aur `i` apni final value pe hota hai — sab wahi print karte hain. `let i` har iteration ke liye naya binding banata hai, jise us iteration ka callback capture karta hai.",
    detailedAnswer:
      "Code:\n\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// 3 3 3\n\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// 0 1 2\n```\n\n`var` version mein ek hi `i` function scope mein hai. Teeno arrow functions us *same* `i` pe closure banate hain. `setTimeout` callbacks event loop ke baad ke tick mein chalte hain — tab tak `for` loop `i` ko `3` tak badha chuka hai. `let` version mein spec ke mutabik har iteration ka apna fresh block-scoped `i` hota hai (previous value se copy hoke), isliye har callback alag binding capture karta hai. `var` ke saath fix karne ka purana tarika: IIFE se per-iteration scope banana, ya `setTimeout(fn, 0, i)` se value pass karna.",
    followUp: "IIFE se ye bug kaise fix karte the let se pehle?",
  },
  {
    id: "lcv-5",
    question: "Tum apne code mein const kab, let kab, var kab use karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "const by default — har wo variable jo ek baar set hoke reassign nahi hota (imported modules, config, API data, function references, React state/handlers). let sirf jab reassignment genuinely chahiye — loop counter, ek accumulator, ya ek value jo if/else ki alag branches mein set hoti hai. var kabhi nahi (naye code mein).",
    detailedAnswer:
      "Rule: sabse strict cheez se shuru karo. `const` reader ko maximum information deta hai — 'ye binding fixed hai', bina poori scope padhe. Jab compiler/linter (`prefer-const`) complain kare ki ye reassign hota hai, tab `let`. `let` ke genuine cases kam hain: `for (let i ...)`, `let total = 0; ... total += x`, ya `let result; if (a) result = x; else result = y;` (yaha `const` nahi ho sakta kyunki do jagah assign). `var` ka koi modern use case nahi — uska function scope surprising hai, `undefined` hoisting silent bugs deta hai, aur loop-closure bug deta hai. Codebases mein `no-var` + `prefer-const` ESLint rules ise automatically enforce karte hain.",
    followUp: "`let result; if (...) result = ...` wale case ko const ke saath kaise likhoge? (hint: ternary ya helper function)",
  },
];

export default questions;
