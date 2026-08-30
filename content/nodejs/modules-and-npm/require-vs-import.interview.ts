import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rvi-1",
    question:
      "`require` aur `import` mein core differences kya hain? Ek quick rundown do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`require` CommonJS hai: synchronous function call, dynamic (kahin bhi bula sakte ho), no tree-shaking, `__dirname` free, bindings value-snapshot. `import` ESM hai: static + hoisted, async graph ka part, tree-shakeable, top-level await, live bindings, aur dynamic cases ke liye `await import()`.",
    detailedAnswer:
      "Ye do alag module systems hain, sirf syntax nahi. `require`: ek normal function jo synchronously file load karke `module.exports` return karta hai; jahan likha wahi chalta hai (no hoisting); variable path aur conditionals allowed; `__dirname`/`__filename` milte hain. `import`: static statement jo file ke top pe hoist hota hai; specifier fixed string hona chahiye; module ek async graph ka node hai (resolve/link pehle, evaluate baad mein); bundler static structure se unused exports drop kar sakta hai (tree-shaking); top-level `await` allowed; imported bindings live hain (exporter ka update dikhta hai) aur read-only. Dynamic loading dono mein hai: `require()` sync, `import()` ek Promise return karta hai.",
    followUp:
      "In dono mein se kaunsi cheez sirf ESM ke paas hai jo library bundle size ke liye important hai?",
  },
  {
    id: "rvi-2",
    question:
      "Naye project mein tum kaunsa chunoge, aur kis situation mein doosra? Decision framework batao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Rule of thumb: naya project → ESM (standard syntax, top-level await, tree-shaking, ecosystem yahan ja raha hai). Bada existing CommonJS codebase → `require` pe raho jab tak koi concrete ESM-only blocker na ho. Publish hone wali library → dual ship karo (`package.json` `exports` mein `import` aur `require` dono conditions).",
    detailedAnswer:
      "Choice zyada tar project type se decide hoti hai, syntax preference se nahi. (1) Greenfield app/service — ESM: modern libs ESM-only ja rahe hain, top-level await se boot-time config clean, tree-shaking bundle chhota rakhta hai. (2) Bada CJS monolith — migrate karna weeks ka kaam + regression risk (extension changes, `__dirname`, test/mock setup, interop bugs); sirf tab karo jab blocker ho. Beech ka raasta: ek CJS file mein ESM-only dep ko `await import()` se load karo. (3) Library — dual build taaki dono taraf ke consumers bina friction use karein, lekin ek hi resolution path ka dhyaan rakho warna dual-instance hazard (do copies, singleton/`instanceof` toot). (4) Quick scripts / glue code bina build — CJS aksar simpler.",
    followUp:
      "Dual package hazard kya hai aur usse kaise bachte ho?",
    redFlag:
      "\"Hamesha ESM, CJS dead hai\" — bade CJS codebase ko bina wajah migrate karna real risk hai; context matter karta hai.",
  },
  {
    id: "rvi-3",
    question:
      "ESM se ek CommonJS package import karne mein kya pitfalls hain? Named exports kaise milenge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "CJS ka poora `module.exports` ESM mein **default export** par aata hai. Named exports ko Node \"cjs-module-lexer\" se best-effort static analysis se detect karta hai — simple `exports.foo = ...` aksar chalta hai, computed/conditional exports miss ho jaate hain. Safe pattern: `import pkg from \"cjs-pkg\"; const { foo } = pkg;`.",
    detailedAnswer:
      "```javascript\n// cjs-pkg module.exports = { Router, static: ... }\nimport { Router } from 'cjs-pkg';        // kabhi undefined\nimport pkg from 'cjs-pkg';\nconst { Router } = pkg;                   // reliable\n```\n\nDoosra pitfall: `require` se ESM load karna — purane Node mein `ERR_REQUIRE_ESM`; Node 22+ mein top-level-await-free ESM ko `require` kiya ja sakta hai, lekin portable code ke liye CJS file mein `await import('esm-pkg')` use karo. Teesra: dual package hazard — agar ek lib CJS aur ESM dono builds deti hai aur project dono raaston se load kar leta hai, do alag instances ban jaate hain, module-level state aur `instanceof` checks toot jaate hain.",
    followUp:
      "`createRequire(import.meta.url)` kab use karoge?",
  },
  {
    id: "rvi-4",
    question:
      "Hoisting ke context mein `require` aur `import` ka behaviour kaise alag hai? Ek code-output example do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`require` hoist nahi hota — jahan likha wahi execute hota hai. `import` hoist hota hai — chahe file mein neeche likho, ESM pehle poora graph evaluate karta hai, phir tumhara top-level code chalta hai. Isliye `import` ke just pehle likha code us module ke side effects se pehle nahi chal sakta.",
    detailedAnswer:
      "```javascript\n// side.mjs\nconsole.log('side effect');\n\n// main.mjs\nconsole.log('before import');\nimport './side.mjs';\n// Output:\n// side effect\n// before import\n```\n\nESM `import` hoist ho gaya, toh `side.mjs` ka `console.log` `'before import'` se pehle chala. CJS mein ulta:\n\n```javascript\n// main.cjs\nconsole.log('before require');\nrequire('./side.cjs');\n// Output:\n// before require\n// side effect\n```\n\nCJS mein `require` us line par chalta hai, hoist nahi hota. Ye difference tab bite karta hai jab log expect karte hain ki `import` ke pehle koi setup (env var, polyfill) chal jayega — ESM mein wo setup ko bhi ek imported module banana padta hai jo graph mein pehle aaye.",
    followUp:
      "ESM mein import se pehle ek env-var set karna ho toh kya karoge?",
  },
  {
    id: "rvi-5",
    question:
      "Interview: \"tumne pichle project mein `require` use kiya ya `import`, aur kyun?\" — model answer.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "\"Naye services mein ESM — top-level await se boot-time config aur tree-shaking se chhota bundle. Ek purana internal CJS monolith humne migrate nahi kiya kyunki koi ESM-only blocker nahi tha; wahan ek ESM-only lib chahiye thi toh sirf us module mein `await import()` kar liya. Shared utils lib dual-published hai `exports` conditions se.\"",
    detailedAnswer:
      "Achha answer decision-making dikhata hai. Structure: (1) Default position — naya code ESM, kyunki standard, top-level await, tree-shaking, ecosystem direction. (2) Exception — bada legacy CJS codebase migrate nahi kiya; migration cost (extensions, `__dirname`, test setup, interop) vs benefit weigh kiya, blocker nahi tha. (3) Pragmatic bridge — ESM-only dependency ko CJS module se `await import()` se consume kiya bina poora migrate kiye. (4) Library concern — dual publish, lekin single resolution path enforce kiya taaki dual-instance hazard na ho. Interviewer sunna chahta hai ki tum tool ko constraints se match karte ho, fashion se nahi.",
    followUp:
      "Agar migration ka decision aaye toh tum incremental migration kaise plan karoge?",
    redFlag:
      "\"`import` bas `require` ka naya naam hai\" ya \"ESM hamesha faster hai\" — dono galat; timing, analyzability, binding semantics alag hain, aur sync `require` ka apna simplicity fayda hai.",
  },
];

export default questions;
