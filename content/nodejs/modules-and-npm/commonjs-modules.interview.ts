import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cjs-1",
    question:
      "CommonJS module system kya hai? Ek file kaise ek module banti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "CommonJS Node ka original module system hai. Har `.js` file apna ek module hai apne scope ke saath — Node har file ko ek hidden wrapper function `(function (exports, require, module, __filename, __dirname) { ... })` mein chalata hai, isliye file ke variables global nahi bante. Values `module.exports` pe rakhte ho, doosre modules `require()` se laate ho.",
    detailedAnswer:
      "Node file ke code ko as-is nahi chalata; pehle use ek function wrapper mein lapetta hai jo 5 identifiers inject karta hai: `module` (is module ka object), `exports` (`module.exports` ka alias), `require` (is file ke path ke hisaab se resolve karne wala function), `__filename` aur `__dirname` (absolute path aur folder). Wrapper chalne ke baad Node `module.exports` ki value uthata hai aur use cache mein daal deta hai, key = resolved absolute path. Isliye har file ka apna scope hota hai aur teen problems solve hoti hain: naam ke jhagde, explicit dependencies (top ki `require` lines), aur reusability.",
    followUp:
      "`__dirname` aur `__filename` ESM mein kyun nahi hote, aur wahan wo kaise recreate karte ho?",
    redFlag:
      "\"`require` aur `__dirname` global variables hain\" — nahi, wo har module ke wrapper function ke parameters hain.",
  },
  {
    id: "cjs-2",
    question:
      "`module.exports` aur `exports` mein kya farak hai? `exports = { ... }` kyun toot jaata hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Shuru mein `exports === module.exports` — dono ek hi object ko point karte hain. `require` hamesha `module.exports` ko return karta hai, `exports` ko nahi. Property add karo (`exports.foo = ...`) toh dono par dikhta hai; lekin `exports = { ... }` sirf local alias ko naye object pe point karata hai jabki `module.exports` purana khali object hi rehta hai — require karne wale ko `{}` milta hai.",
    detailedAnswer:
      "```javascript\n// theek — same object pe property\nexports.add = (a, b) => a + b;\n\n// theek — module.exports ko seedha replace\nmodule.exports = { add: (a, b) => a + b };\n\n// TOOTA — alias reassign, module.exports se disconnect\nexports = { add: (a, b) => a + b };\n// require('./x') -> {}  kyunki module.exports abhi bhi original {} hai\n```\n\nRule: poora object replace karna ho toh hamesha `module.exports = ...`; sirf ek-do named cheezein expose karni ho toh `exports.name = ...` bhi chalega. Practical advice: consistency ke liye har file mein `module.exports = ...` ek hi baar likho.",
    followUp:
      "Agar `module.exports = function () {}` set karein aur uske baad `exports.helper = ...` likhein, toh `helper` require karne wale ko milega?",
  },
  {
    id: "cjs-3",
    question:
      "Module cache kya hai? Iska ek practical side effect batao jo bug ban sakta hai.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Node har module ko lifetime mein sirf ek baar evaluate karta hai; uske baad har `require` cache se wahi `module.exports` object deta hai (key = absolute path). Side effect: agar module top-level pe mutable state (`let count = 0`) rakhta hai, toh saari files ko wahi shared state milta hai — 'fresh instance per import' nahi hota. CJS module effectively ek singleton hai.",
    detailedAnswer:
      "Cache singleton pattern ko free mein deta hai — ek `db.js` jo ek pool banata hai, chahe 40 files usе `require` karein, pool ek hi banega. Lekin yahi cheez bug bhi ban sakti hai: (1) shared mutable state — do modules ek counter module ko modify karte hain aur ek doosre ke changes dekhte hain, jo kabhi-kabhi unexpected hota hai; (2) `require('./config.json')` cache ho jaata hai, toh file disk pe badalne par bhi purani value milti rehti hai — 'hot reload' ke liye `delete require.cache[require.resolve('./config.json')]` karna padta hai; (3) tests mein ek module ki internal state pichle test se leak ho sakti hai — isiliye Jest jaise runners `jest.resetModules()` dete hain. Cache key resolved absolute path hai, toh symlink ya alag path se same file kabhi-kabhi do baar load ho jaati hai.",
    followUp:
      "Ek module ko forcibly reload kaise karoge bina process restart kiye?",
    redFlag:
      "\"Har `require` module ko dobara chalata hai isliye state reset ho jaati hai\" — ulta hai; cache ki wajah se state persist karti hai.",
  },
  {
    id: "cjs-4",
    question:
      "Circular dependency (A require B, B require A) mein Node kya karta hai? Isse kaise handle karte ho?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Node crash nahi karta. Jab A chalte-chalte B ko require karti hai aur B wapas A ko require karti hai, B ko A ka **partial** `module.exports` milta hai — sirf wo properties jo A mein `require(B)` line se pehle set hui thi. Baaki `undefined`. Fix: circular structure avoid karo; agar zaroori ho toh `const b = require('./b')` rakho aur `b.fn()` ko **use karte waqt** access karo, top pe destructure mat karo.",
    detailedAnswer:
      "```javascript\n// a.js\nexports.name = 'A';\nconst b = require('./b');       // b.js ab chalti hai\nconsole.log('a got b.done =', b.done);\nexports.done = true;\n\n// b.js\nconst a = require('./a');       // a abhi aadhi chali\nconsole.log('b got a.done =', a.done); // undefined\nexports.done = true;\n```\n\nOutput: `b got a.done = undefined`, phir `a got b.done = true`. b.js ko a ka snapshot mila jab `exports.done` abhi set nahi hua tha. Handling strategies: (1) modules ko refactor karke shared cheez ko teesre module mein nikaalo; (2) lazy require — function body ke andar `require` karo, module top pe nahi; (3) top-level pe destructure (`const { x } = require('./a')`) mat karo — puri module reference rakho aur `.x` deferred access karo.",
    followUp:
      "ESM circular dependency ko CJS se alag kaise handle karta hai (live bindings)?",
  },
  {
    id: "cjs-5",
    question:
      "Interview mein: \"is naye project mein tumne CommonJS chuna ya ESM, aur kyun?\" — kaise answer doge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "\"Naye service ke liye ESM — standard syntax, top-level await, aur bundler tree-shaking chahiye tha. Ek internal CLI jo runtime pe plugins folder se modules conditionally load karta hai, uske liye CJS rakha kyunki uska synchronous dynamic `require` seedha fit hai. Ek shared utils package humne dual-publish kiya taaki dono taraf ke consumers kaam karein.\"",
    detailedAnswer:
      "Achha answer dogma nahi, fit dikhata hai. Points: (1) Naya app / service — ESM default: standard, tree-shakeable, top-level await, aur ecosystem ab yahan ja raha hai. (2) Existing bada CJS codebase — usi mein raho; poora migrate karna high-risk, low-reward hai jab tak koi concrete ESM-only dependency na aaye. (3) Library jo publish hogi — dual (CJS + ESM builds via `exports` conditional) taaki dono taraf ke users bina friction ke use kar sakein. (4) Dynamic/conditional loading zaroori (plugin systems, feature flags, optional deps) — CJS `require` ek expression hai jise kahin bhi bula sakte ho; ESM mein iske liye `await import()` chahiye. Interviewer sunna chahta hai ki tum syntax preference se nahi, constraints se decide karte ho.",
    followUp:
      "Ek package ko dual (CJS + ESM) publish karne mein `package.json` mein kya chahiye?",
    redFlag:
      "\"CommonJS purana ho gaya, hamesha ESM\" — bade CJS codebase ko bina wajah migrate karna real risk hai; decision context pe depend karta hai.",
  },
];

export default questions;
