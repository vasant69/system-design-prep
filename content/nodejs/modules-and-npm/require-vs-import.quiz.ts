import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "require-vs-import-1",
    question:
      "Conditional/lazy loading ke liye CJS aur ESM mein kya farak hai?",
    options: [
      "Dono mein `import` ko `if` ke andar likh sakte ho",
      "CJS: `if (x) require('./a')` — synchronous, kahin bhi. ESM: `if (x) await import('./a.js')` — dynamic import Promise return karta hai (async)",
      "ESM mein conditional loading possible hi nahi",
      "CJS mein `require` sirf file ke top pe likh sakte ho",
    ],
    correctIndex: 1,
    explanation:
      "`require` ek normal function hai — `if` ke andar, function ke andar, variable path ke saath, kahin bhi, aur wo synchronously load karta hai. ESM ka static `import` sirf top-level pe allowed hai; conditional/lazy ke liye `import()` function use hota hai jo ek Promise return karta hai (`await import('./a.js')`). Option A galat — static import block ke andar syntax error hai. Option C galat — dynamic import se hota hai. Option D ulta hai — `require` kahin bhi likh sakte ho.",
    difficulty: "easy",
  },
  {
    id: "require-vs-import-2",
    question:
      "In dono mein se kaunsi capability sirf ESM (`import`) ke paas hai, `require` ke paas nahi?",
    options: [
      "Modules ko cache karna taaki dobara load na ho",
      "JSON files load karna",
      "Tree-shaking (bundler unused exports drop kar sake) aur top-level await",
      "Circular dependencies handle karna",
    ],
    correctIndex: 2,
    explanation:
      "Tree-shaking ESM ki static structure (imports/exports sirf top-level, fixed specifiers) pe depend karta hai — bundler run se pehle jaan leta hai kya use hua. CJS dynamic hai isliye reliable tree-shaking nahi. Top-level await bhi sirf ESM mein hai. Option A galat — dono systems modules cache karte hain. Option B galat — dono JSON load kar sakte hain. Option D galat — dono circular deps handle karte hain (CJS partial exports, ESM live bindings), bas ESM zyada predictable.",
    difficulty: "medium",
  },
  {
    id: "require-vs-import-3",
    question:
      "Ek ESM file `import { Router } from \"some-cjs-package\"` likhti hai aur `Router` `undefined` aata hai. Sabse sahi fix kya hai?",
    options: [
      "CJS package ko `require` se load karo — ESM CJS ko load hi nahi kar sakta",
      "`import pkg from \"some-cjs-package\"` phir `const { Router } = pkg` — CJS ka poora `module.exports` hamesha default export par aata hai",
      "Package ko `\"type\": \"module\"` add karke patch karo",
      "`import * as Router from \"some-cjs-package\"` use karo",
    ],
    correctIndex: 1,
    explanation:
      "Node CJS ke named exports ko \"cjs-module-lexer\" se best-effort static analysis se detect karta hai; computed ya non-trivial exports miss ho jaate hain. Lekin poora `module.exports` object hamesha default export par guaranteed milta hai — isliye default import karke destructure karna reliable hai. Option A galat — ESM CJS ko import kar sakta hai. Option C galat aur unsafe — node_modules ke package ko patch karna. Option D `* as` namespace deta hai jismein bhi wahi best-effort named exports honge, aur default `.default` par nested hoga.",
    difficulty: "medium",
  },
  {
    id: "require-vs-import-4",
    question:
      "Ek 4-saal purana bada CommonJS Express monolith hai. Team ko ek naya major version chahiye jo ESM-only ho gaya. Best approach kya hai?",
    options: [
      "Poore monolith ko turant ESM pe migrate karo — modern practice yahi hai",
      "Sirf us module mein jahan dependency chahiye, `const { default: x } = await import(\"pkg\")` use karo; ya aakhri CJS version pe pin karke ruko jab tak migration budget na mile",
      "Us dependency ko chhod do, koi bhi ESM-only package mat use karo",
      "Monolith ke package.json mein `\"type\": \"module\"` daal do, baaki apne aap chal jayega",
    ],
    correctIndex: 1,
    explanation:
      "Bade CJS codebase ko migrate karna weeks ka kaam aur bada regression surface hai (extension changes, __dirname fixes, test/mock setup, interop bugs) — sirf tabhi karo jab concrete blocker ho. ESM-only dependency ko ek CJS file se `await import()` se load kar sakte ho (us function ko async banana padega). Alternatively last CJS release pe pin karo. Option A high-risk low-reward hai bina blocker ke. Option C over-restrictive. Option D galat — `\"type\": \"module\"` daalte hi har `require` aur `__dirname` toot jaayega.",
    difficulty: "hard",
  },
];

export default quiz;
