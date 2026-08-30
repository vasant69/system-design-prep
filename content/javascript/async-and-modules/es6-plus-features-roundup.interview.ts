import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "es6r-1",
    question: "ES6 aur ES2015 mein kya farak hai? ECMAScript ka release cycle kaisa hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Koi farak nahi — ES6 aur ES2015 ek hi release ke do naam hain. 2015 se ECMAScript har June mein ek naya version release karta hai jismein pichle saal ke finished (Stage 4) proposals hote hain. Version-based naam (ES6, ES7) practically chhod diye gaye, ab year-based (ES2015, ES2016) standard hai.",
    detailedAnswer:
      "Pehle bade infrequent releases hote the — ES5 (2009) aur ES6 (2015) ke beech 6 saal, aur ES4 to cancel hi ho gaya. TC39 committee ne yearly cycle adopt kiya taaki features ek-ek karke ship hon, browsers incremental support de sakein, aur koi 'mega release' fragment na ho. Ek proposal 4 stages se guzarta hai (0 = idea, 4 = finished with two implementations + tests); jo June cutoff tak Stage 4 pe hai wo us saal ke spec mein jaata hai. Naming: ES6 = ES2015, ES7 = ES2016, ES8 = ES2017 — par ES2016 ke baad log year-based naam hi use karte hain kyunki har saal chhota batch hota hai, numbering ka koi khaas fayda nahi.",
    followUp: "Stage 3 proposal ka matlab kya hai — kya use production mein use kar sakte ho?",
    redFlag: "'ES6 alag hai, ES2015 alag' — same release ke do naam hain.",
  },
  {
    id: "es6r-2",
    question: "Optional chaining (?.) aur nullish coalescing (??) kya karte hain? `||` se kaise alag?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`?.` safe property/method access — beech mein `null`/`undefined` mile to poora expression `undefined` return karta hai, crash nahi. `??` fallback deta hai sirf `null`/`undefined` pe. `||` har falsy value (`0`, `\"\"`, `false`, `NaN` bhi) pe fallback deta hai — isliye numeric/boolean defaults ke liye galat.",
    detailedAnswer:
      "```javascript\nconst city = user?.address?.city;          // undefined agar user ya address missing\nconst port = config.port ?? 3000;          // 3000 sirf agar config.port null/undefined\nconst portBad = config.port || 3000;       // 3000 agar config.port 0 bhi ho -- BUG\n\nuser?.save?.();                             // save method call sirf agar wo exist kare\narr?.[0];                                   // safe index access\n```\n\nDono ES2020 mein aaye. `?.` sirf apne left operand ko check karta hai — `a?.b.c` mein agar `b` null hai to `.c` phir bhi crash karega, isliye har uncertain step pe `?.` lagao. `??` aur `||`/`&&` ko bina bracket ke mix nahi kar sakte (`a ?? b || c` SyntaxError) — explicit parentheses chahiye. Practical rule: existence check ke liye `?.`, default value ke liye `??` (na ki `||`, jab tak tum sach mein har falsy ko replace karna na chaho).",
    followUp: "`a ?? b || c` SyntaxError kyun deta hai?",
  },
  {
    id: "es6r-3",
    question: "Transpiler (Babel) aur polyfill mein kya farak hai? Kaunsa feature kis se handle hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Transpiler (Babel/SWC/tsc) naye **syntax** ko purane equivalent syntax mein badalta hai — `?.` ko nested checks, class fields ko constructor assignments. Polyfill (core-js) naye **APIs / methods** ko runtime pe add karta hai jo purane engine mein missing hain — `Array.prototype.flat`, `Promise.any`, `Object.fromEntries`. Syntax ke liye transpiler, missing functions ke liye polyfill.",
    detailedAnswer:
      "Syntax features (arrow functions, destructuring, `?.`, `??`, `#private`, spread) parser-level hain — purana engine unhe padh hi nahi sakta, isliye Babel unhe compile time pe rewrite karta hai. API features nayi functions/methods hain jinke bina engine chal to jaata hai par wo method `undefined` hota hai — un cases mein core-js ek implementation runtime pe attach kar deta hai. Babel dono ko coordinate kar sakta hai `@babel/preset-env` + `browserslist` + `useBuiltIns: 'usage'` se: wo target ke hisaab se decide karta hai kaunsa syntax down-level karna hai aur kaunse polyfills import karne hain (sirf jo tumhare code mein actually use hue). Isiliye `arr.toSorted()` bina polyfill ke purane target pe `TypeError` deta hai — Babel ne wo naya method add nahi kiya, sirf syntax handle karta hai.",
    followUp: "`browserslist` config kya hota hai aur wo build output ko kaise affect karta hai?",
  },
  {
    id: "es6r-4",
    question:
      "ES2023 ke immutable array methods (toSorted, toReversed, with) kyun add kiye gaye? Purane methods se kaise alag?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`sort()`, `reverse()`, `splice()` original array ko **in-place mutate** karte hain, jo shared state / React state / const arrays ke saath bugs deta hai. `toSorted()`, `toReversed()`, `toSpliced()`, `with(i, val)` ek **naya array** return karte hain aur original ko chhoo-te bhi nahi.",
    detailedAnswer:
      "```javascript\nconst nums = [3, 1, 2];\nconst sorted = nums.toSorted();   // [1, 2, 3], nums abhi bhi [3, 1, 2]\nconst copy = nums.with(0, 99);    // [99, 1, 2], nums unchanged\n\nnums.sort();                      // nums KHUD [1, 2, 3] ban gaya -- mutation\n```\n\nProblem jo ye solve karta hai: React/Redux mein state ko directly mutate karna forbidden hai — pehle `[...arr].sort()` likhna padta tha (pehle copy, phir mutate copy). `toSorted` wo do-step pattern ek call mein karta hai aur intent bhi clearer hai. `map`/`filter`/`slice`/`concat` pehle se non-mutating the; ES2023 ne teen bache-hue mutating methods ke non-mutating jode add kiye. Ye abhi naye hain — purane runtimes pe polyfill ya `[...arr].sort()` fallback chahiye.",
    followUp: "React state update mein tum ek array ko sort karke set karna ho to aaj kaise likhoge?",
  },
  {
    id: "es6r-5",
    question:
      "Naya project shuru karte waqt tum kaise decide karte ho ki kaunse modern JS features use karne safe hain?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Do cheezein dekhta hoon: (1) build step hai ya nahi — Next/Vite/Babel ke saath latest syntax OK kyunki wo down-level ho jaata hai; (2) `browserslist` / `engines` target — wo batata hai kitne purane runtimes support karne hain. Fresh APIs (last 1-2 saal) ke liye polyfill/transpile verify karta hoon ya fallback likhta hoon.",
    detailedAnswer:
      "Application code with a bundler: main bindaas latest **syntax** likhta hoon (`?.`, `??`, top-level await, `#private`) kyunki SWC/Babel usse `browserslist` target ke hisaab se compile kar deta hai. Naye **APIs** ke liye `@babel/preset-env` + `core-js` `useBuiltIns: 'usage'` set karta hoon taaki zaroori polyfills auto-inject hon. Library code: yahaan zyada conservative — kyunki mera output consumer ke build ko affect karta hai, main `browserslist` explicitly document karta hoon aur bleeding-edge APIs (`Object.groupBy`, `Promise.withResolvers`) avoid karta hoon ya inline fallback deta hoon. No-build script (directly browser mein `<script>`): sirf wahi syntax jo mere minimum target browser mein native ho — MDN/caniuse pe check. General principle: syntax sugar low-risk hai (transpile ho jaata hai), naye global APIs higher-risk (polyfill chahiye), aur last 12 mahine ke features ko production-critical path pe extra scrutiny.",
    followUp: "core-js ka `useBuiltIns: 'usage'` vs `'entry'` mein kya farak hai?",
    redFlag: "'jo latest hai wo hamesha use karo' — library context aur no-build context mein ye bugs deta hai.",
  },
];

export default questions;
