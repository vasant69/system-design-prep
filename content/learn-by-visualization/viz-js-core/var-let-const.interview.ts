import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "vlc-1",
    question: "var, let aur const mein farak batao — teen concrete points.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Scope: var function-scoped, let/const block-scoped. Reassignment: const ka binding reassign nahi hota, let/var ka hota hai. Hoisting: var hoist hoke undefined ban jaata hai; let/const declaration line tak Temporal Dead Zone mein rehte hain (access = ReferenceError).",
    detailedAnswer:
      "(1) Scope — `var` sirf function boundary maanta hai; ek `if`/`for` block ke andar `var x` block ke bahar bhi visible hota hai. `let`/`const` kisi bhi `{ }` block tak simit hain. (2) Reassignment — `const` ka binding fixed hai (`x = ...` -> TypeError), lekin agar value object/array hai to uske andar mutation allowed hai. `let` aur `var` reassign ho sakte hain. (3) Hoisting — teeno hoist hote hain, par `var` turant `undefined` se initialise hota hai (declaration se pehle read = silent `undefined`), jabki `let`/`const` TDZ mein rehte hain — declaration se pehle koi access (`typeof` bhi) `ReferenceError` deta hai. Bonus: `var` same scope mein redeclare ho sakta hai, `let`/`const` nahi.",
    followUp: "TDZ ka fayda kya hai — var ka undefined milna to crash se better lagta hai na?",
    redFlag: "\"const matlab value kabhi change nahi hoti\" — ye binding vs value ka confusion hai.",
  },
  {
    id: "vlc-2",
    question: "`const obj = {}; obj.x = 1;` chalta hai. Toh const 'constant' kaise hua?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "const value ko nahi, binding ko constant banata hai. `obj` hamesha usi object ko point karega (`obj = {...}` -> TypeError), lekin us object ke andar properties add/change/delete karna allowed hai.",
    detailedAnswer:
      "Variable ke do hisse hain: naam (binding) aur wo jise wo point kar raha hai (value/reference). `const` sirf binding lock karta hai. `obj.x = 1`, `delete obj.x` — sab valid, kyunki binding wahi object point karta rehta hai. Sirf `obj` ko kisi *doosri* cheez pe point karana blocked hai. Agar andar bhi immutability chahiye: `Object.freeze(obj)` — par wo shallow hai (nested objects freeze nahi hote); deep ke liye recursive freeze helper ya TypeScript `readonly`/`as const`.",
    followUp: "Object.freeze shallow kyun hai, aur deep freeze kaise karoge?",
  },
  {
    id: "vlc-3",
    question:
      "`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);` kya print karega? `var` ko `let` karne se kya badlega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "var: `3 3 3`. let: `0 1 2`. `var i` puri loop ke liye ek hi binding hai — async callbacks tab chalte hain jab loop khatam ho chuka aur `i === 3`. `let i` har iteration ke liye naya block-scoped binding banata hai jise us iteration ka callback capture karta hai.",
    detailedAnswer:
      "`var` version mein teeno arrow functions *same* `i` pe closure banate hain. `setTimeout` callbacks event loop ke agle tick mein chalte hain — tab tak `for` loop `i` ko `3` tak badha chuka hai, isliye `3 3 3`. `let` version mein spec ke mutabik har iteration ka fresh block-scoped `i` hota hai (pichli value se copy hoke), isliye har callback apni value capture karta hai — `0 1 2`. `let` se pehle iska classic fix IIFE se per-iteration scope banana tha, ya `setTimeout(fn, 0, i)` se value pass karna.",
    followUp: "IIFE se ye bug pehle kaise fix karte the?",
  },
  {
    id: "vlc-4",
    question: "Apne code mein const, let, var — kaunsa kab use karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "const by default (imported modules, config, API data, function references, React state/handlers). let sirf jab reassignment genuinely chahiye — loop counter, accumulator, ya if/else ki alag branches mein set hone wali value. var kabhi nahi.",
    detailedAnswer:
      "Rule: sabse strict cheez se shuru karo. `const` reader ko maximum info deta hai — 'ye binding fixed hai' — bina poori scope padhe. Jab linter (`prefer-const`) ya compiler bataye ki ye reassign hota hai, tab `let`. `let` ke genuine cases kam hain: `for (let i ...)`, `let total = 0; total += x`, `let result; if (a) result = x; else result = y;`. `var` ka koi modern use case nahi — surprising function scope, `undefined` hoisting se silent bugs, aur loop-closure bug. `no-var` + `prefer-const` ESLint rules ise automatically enforce karte hain.",
    followUp: "`let result; if (...) result = ...` wale case ko const ke saath kaise likhoge? (hint: ternary ya helper function)",
  },
];

export default questions;
