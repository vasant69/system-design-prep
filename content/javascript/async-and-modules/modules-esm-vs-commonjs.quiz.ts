import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "modules-esm-vs-commonjs-1",
    question: "Tree-shaking reliably ESM ke saath hi kyun kaam karta hai, CJS ke saath nahi?",
    options: [
      "ESM files chhoti hoti hain isliye bundler faster hai",
      "ESM ke import/export statements static aur hoisted hain — bundler code chalaye bina dependency graph bana leta hai aur unused exports hata deta hai; CJS require() runtime function call hai isliye analysis unreliable",
      "CJS tree-shaking support karta hai par sirf production mode mein",
      "ESM automatically dead code delete karta hai bina bundler ke",
    ],
    correctIndex: 1,
    explanation:
      "ESM ka `import`/`export` static syntax hai — top pe hoisted, string literal paths, koi conditional nahi. Bundler isse compile-time pe pura module graph aur har export ka usage nikaal leta hai, phir jo export kahi import nahi hua use bundle se drop kar deta hai. CJS `require()` ek normal function call hai jo `if` ke andar, loop mein, ya computed path se ho sakta hai — bundler safely nahi keh sakta ki kya unused hai. Option A/C/D galat — size, mode, ya automatic runtime deletion iska reason nahi.",
    difficulty: "medium",
  },
  {
    id: "modules-esm-vs-commonjs-2",
    question:
      "`export let count = 0; export function inc(){ count++; }` — ek ESM consumer `import { count, inc }` karke `inc()` call karta hai. Ab `count` kya dikhta hai?",
    options: [
      "0 — import ek snapshot copy hai",
      "1 — ESM imports live bindings hain, importer ko exporter ki current value dikhti hai",
      "undefined — count ko reassign nahi kar sakte import ke baad",
      "ReferenceError — imported binding read-only hai",
    ],
    correctIndex: 1,
    explanation:
      "ESM imports **live bindings** hain — ek read-only view jo exporting module ke variable ki current value reflect karta hai. `inc()` ne exporter ke andar `count` badha diya, isliye consumer ko ab `1` dikhta hai. Importer khud `count = 5` nahi kar sakta (wo read-only hai — option D us galti pe error dega), par exporter ke changes dikhte hain. CJS is se alag hai: `require` ke time jo value thi uski copy milti hai, baad ka update nahi dikhta. Option A CJS ka behaviour describe karta hai.",
    difficulty: "hard",
  },
  {
    id: "modules-esm-vs-commonjs-3",
    question:
      "Node project mein `package.json` mein `\"type\": \"module\"` add karne ke baad ek purani file jismein `require()` aur `module.exports` hai — kya hoga?",
    options: [
      "Kuch nahi, Node dono syntax ek hi .js file mein allow karta hai",
      "Wo file ab ESM treat hoti hai — require, module.exports, __dirname sab break; use .cjs rename karo ya convert karo",
      "require() automatically import mein convert ho jaata hai",
      "Sirf naye files pe asar padta hai, purane .js files CJS rehte hain",
    ],
    correctIndex: 1,
    explanation:
      "`\"type\": \"module\"` us package ki **saari** `.js` files ko ESM bana deta hai. ESM scope mein `require`, `module.exports`, `exports`, `__dirname`, `__filename` defined hi nahi — wo file turant break ho jaati hai. Fix: ya us file ko `.cjs` extension do (jo hamesha CJS hai), ya use ESM syntax mein convert karo (`import`, `export`, `import.meta.url` se `__dirname`). Option A/C/D galat — koi per-file opt-out, auto-conversion, ya 'sirf naye files' rule nahi hai.",
    difficulty: "medium",
  },
  {
    id: "modules-esm-vs-commonjs-4",
    question: "Naya greenfield Node service shuru kar rahe ho. Module system ki default choice kya honi chahiye?",
    options: [
      "CommonJS — sabse compatible hai npm ke saath",
      "ESM — language standard hai, tree-shaking, top-level await, browser+Node dono; CJS pe sirf tab jab ek bada existing CJS codebase ho jise migrate karne ka plan nahi",
      "Dono mix karo — har file mein jo convenient ho",
      "Farak nahi padta, Node dono ko identical treat karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Naya code ESM mein — wo JS ka standard module system hai, static structure se better tooling aur tree-shaking milta hai, top-level `await` sirf yahaan hai, aur same code browser mein bhi chal sakta hai. CJS ka jagah aaj sirf ek established CJS codebase hai jise deliberately migrate karne ka plan nahi — consistency ke liye. Option C (random mixing) interop bugs deta hai. Option D galat — static/dynamic aur sync/async behaviour ke bade farak hain, sirf syntax nahi.",
    difficulty: "easy",
  },
];

export default quiz;
