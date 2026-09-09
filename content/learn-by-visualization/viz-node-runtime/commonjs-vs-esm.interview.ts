import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cve-1",
    question: "CommonJS aur ES Modules mein main differences batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "CJS: `require`/`module.exports`, synchronous load, runtime-resolved (dynamic paths OK), value ki copy export, `__dirname` built-in, no top-level await. ESM: `import`/`export`, static (parse-time) resolution, async loading, live bindings, `import.meta.url`, top-level await allowed, aur ye JS ka standard hai.",
    detailedAnswer:
      "CJS Node-specific hai. `require('x')` jis line pe hai wahin blocking load karta hai, module ko ek baar run karke `module.exports` return karta hai, aur cache kar deta hai. Paths dynamic ho sakte hain (`require(path.join(...))`). Import ki hui value ek snapshot/copy hoti hai. ESM ECMAScript standard hai (browser + Node same). `import`/`export` statements hoisted aur statically analyzable hain — Node pehle poora graph resolve karta hai (async), phir modules evaluate karta hai. Bindings live hain: agar module A apna exported `count` badalta hai, importer ko nayi value dikhti hai (read-only reference). ESM mein top-level await, `import.meta`, aur behtar tree-shaking milte hain; par `require`/`module`/`__dirname` nahi hote.",
    followUp: "'Live binding' ka matlab code example se samjhao — CJS copy se kaise alag hai?",
    redFlag: "\"Dono same hain, bas import likhna modern style hai\".",
  },
  {
    id: "cve-2",
    question: "Ek project ko CJS se ESM migrate karna ho to kya-kya break hota hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`require`/`module.exports` ko `import`/`export` banao; `__dirname`/`__filename` ko `import.meta.url` + `fileURLToPath` se derive karo; imports mein file extension mandatory ho jaata hai (`./util.js`, not `./util`); JSON import ko import attribute ya `fs.readFile` chahiye; `require.main === module` check ko badalna padta hai.",
    detailedAnswer:
      "`package.json` mein `\"type\": \"module\"` (ya files ko `.mjs`). Fir: (1) har `const x = require('y')` -> `import x from 'y'`; `module.exports = z` -> `export default z` ya named exports. (2) `__dirname` gone -> `const __dirname = path.dirname(fileURLToPath(import.meta.url))`. (3) Relative imports ko full extension chahiye — bundler ke bina `./config` kaam nahi karega, `./config.js` chahiye. (4) `require('./data.json')` -> `import data from './data.json' with { type: 'json' }` ya `JSON.parse(await readFile(...))`. (5) 'am I the entry file?' — `require.main === module` ke jagah `process.argv[1]` ko `import.meta.url` se compare. (6) Kuch CJS-only libs sirf default import se aati hain; named imports fail ho sakte hain (`import pkg from 'lib'; const { thing } = pkg`). (7) Conditional/lazy `require()` ko `await import()` banana padega. Jest/ts config bhi adjust hote hain.",
    followUp: "Ek library author ke roop mein tum dono CJS aur ESM consumers ko kaise support karoge?",
  },
  {
    id: "cve-3",
    question: "ESM se CJS import kar sakte ho? CJS se ESM?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "ESM -> CJS: haan, `import pkg from 'cjs-lib'` — `pkg` = `module.exports`. Named imports CJS se hit-or-miss hote hain (Node static analysis se kuch nikaalta hai). CJS -> ESM: static `require` se nahi (ESM async hai); sirf dynamic `const m = await import('esm-mod')` se.",
    detailedAnswer:
      "ESM loader CJS ko samajh sakta hai: default export poore `module.exports` object ko map karta hai. Node named exports ko 'cjs-module-lexer' se best-effort detect karta hai, par computed exports miss ho sakte hain — safe pattern `import pkg from 'lib'; const { a, b } = pkg`. Ulti direction: `require()` synchronous hai aur ESM evaluation async (top-level await ho sakta hai), isliye `require('./x.mjs')` historically `ERR_REQUIRE_ESM` deta tha; portable solution dynamic `import()` jo promise return karta hai. (Note: recent Node mein bina top-level await wale ESM ko `require` karne ki suvidha aa rahi hai, par cross-version code ke liye `import()` safe hai.)",
    followUp: "`import()` ka ek aur genuine use case kya hai, module-format interop ke alawa?",
  },
  {
    id: "cve-4",
    question: "Circular dependency CJS aur ESM mein kaise behave karti hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "CJS: jo module cycle complete karta hai use partial (adhoora) `module.exports` milta hai — jitna abhi tak assign hua. ESM: bindings live hain, isliye function calls jo baad mein hoti hain sahi value dekhti hain; sirf module-evaluation ke dauraan use karo to `undefined`/TDZ mil sakta hai.",
    detailedAnswer:
      "CJS: A require B, B require A. B ke andar jab `require('A')` chalta hai, A abhi mid-execution hai, to B ko A ka ab tak ka `module.exports` (possibly `{}` ya adhoora) milta hai — ek stale snapshot. Agar B top-level pe A ki koi property use kare jo abhi assign nahi hui, wo `undefined` hoti hai; runtime pe use karo (function ke andar) to aksar theek ho jaati hai. ESM: loader pehle graph banata hai, phir evaluate karta hai; imports live read-only bindings hain. Function bodies jo evaluation ke baad call hoti hain, unhe final values milti hain, isliye ESM cycles CJS se zyada predictable hain — lekin agar module ke top-level code mein hi ek circularly-imported binding use ho jo abhi initialise nahi hui, to ReferenceError (TDZ) aata hai. Best fix dono mein: cycle todo (shared module extract karo) ya use ko defer karo.",
    followUp: "Ek real cycle example do jahan CJS chup-chaap galat chale par ESM loudly fail kare.",
  },
];

export default questions;
