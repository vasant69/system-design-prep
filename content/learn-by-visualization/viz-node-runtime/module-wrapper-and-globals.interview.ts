import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mwg-1",
    question: "Node ka module wrapper kya hai, aur wo kis liye hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node har CommonJS file ke code ko `(function (exports, require, module, __filename, __dirname) { ... })` mein wrap karke execute karta hai. Isse har file ko apna private scope milta hai, aur `require`/`module`/`__dirname` jaise identifiers 'globals' jaise available ho jaate hain — actually wo per-file function arguments hain.",
    detailedAnswer:
      "Jab Node koi `.js` (CommonJS) file load karta hai, compile karne se pehle wo source string ke aage `(function (exports, require, module, __filename, __dirname) {` aur peeche `\\n});` jod deta hai, phir us resulting function ko per-file values ke saath call karta hai. Fayde: (1) Encapsulation — top-level `var`/`let`/`function` wrapper mein scoped rehte hain, real `global` pe leak nahi karte, isliye modules ke beech naam takraate nahi. (2) Har file ko apna `require` milta hai jo `__dirname` ke relative resolve karta hai. (3) `module` object (`{ id, exports, loaded, parent, children }`) aur `exports` shortcut milta hai jisse cheezein export hoti hain. (4) `__filename`/`__dirname` file ka absolute path/folder dete hain. `require('module').wrapper` se exact wrapper strings dekh sakte ho.",
    followUp: "ESM (`.mjs`) files ke saath ye wrapper hota hai kya? `__dirname` wahan kyun nahi milta?",
    redFlag: "\"`require` aur `module` JavaScript keywords hain\" ya \"ye V8 ke built-in globals hain\".",
  },
  {
    id: "mwg-2",
    question: "`exports` aur `module.exports` mein farak samjhao. `exports = {...}` kyun kaam nahi karta?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`exports` shuru mein `module.exports` (ek `{}`) ka reference hai — dono same object point karte hain. `require` hamesha `module.exports` return karta hai. `exports = x` sirf local parameter ko re-point karta hai, `module.exports` wahi purana object rehta hai — isliye export nahi hota. Property add (`exports.foo = ...`) chalta hai kyunki wo shared object mutate karta hai.",
    detailedAnswer:
      "Wrapper call kuch aise hota hai: `wrapperFn(module.exports, require, module, ...)`. To function ke andar `exports === module.exports` initially `true`. Agar tum `exports.helper = fn` likhte ho, wo same object ko mutate karta hai jise `module.exports` bhi point karta hai — export dikh jaata hai. Lekin `exports = fn` sirf function-local `exports` binding ko naye value pe point karta hai; `module.exports` untouched (`{}`), aur `require` wahi `{}` deta hai. Rule: agar poora module ek single cheez (function/class) export kare, `module.exports = X` likho. Agar named cheezein export karni ho, `exports.a = ...; exports.b = ...` ya `module.exports = { a, b }`.",
    followUp: "`module.exports = {}` set karne ke baad phir se `exports.foo = 1` likha to kya hoga?",
    redFlag: "\"Dono bilkul same hain, koi bhi use kar lo\" — reassignment case miss kar rahe ho.",
  },
  {
    id: "mwg-3",
    question:
      "Ek file ke top-level pe `let config = loadConfig();` hai. Kya doosri file `config` ko directly access kar sakti hai?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Nahi. `config` us file ke wrapper function ke andar scoped hai, `global` pe nahi. Doosri file ko wo chahiye to source file ko `module.exports = config` (ya `exports.config = config`) se export karna hoga, aur consumer `require` karega.",
    detailedAnswer:
      "Node mein har file apne wrapper function mein chalti hai, to top-level `let`/`const`/`var`/`function` us function ke locals hain. Koi implicit sharing nahi. Cross-file sharing sirf explicit hota hai: exporter `module.exports.config = config`, importer `const { config } = require('./config-file')`. Ek gotcha: CommonJS modules cached hote hain (`require.cache`), to same file ka `require` har jagah same instance deta hai — isse ek shared singleton banta hai. Agar sach mein process-wide global chahiye (rarely a good idea), `globalThis.config = config`, par ye tight coupling aur test pain laata hai.",
    followUp: "CommonJS module caching kaise ek accidental singleton bana deti hai?",
  },
  {
    id: "mwg-4",
    question: "File-relative path banane ke liye `__dirname` use karo ya `process.cwd()`? Kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`__dirname` — wo hamesha usi file ka folder deta hai chahe process kahin se bhi launch ho. `process.cwd()` launch directory hai, jo user ke `cd` par depend karta hai. Fixed asset path ke liye `path.join(__dirname, 'data.json')`.",
    detailedAnswer:
      "`node ./scripts/run.js` root se chalao to `process.cwd()` = root, `__dirname` = `.../scripts`. Ab agar tum `scripts/` ke andar se hi chalao, `process.cwd()` badal jaayega par `__dirname` wahi rahega. Isliye jo file physically module ke saath rehti hai (template, JSON, migration) uske liye `__dirname` correct hai. `process.cwd()` tab theek hai jab user-supplied relative path resolve karna ho (CLI arg jaise `myapp build ./src`). ESM mein `__dirname` nahi hota — `const __dirname = path.dirname(fileURLToPath(import.meta.url))` likhna padta hai (ya Node 20.11+ mein `import.meta.dirname`).",
    followUp: "ESM file mein `__dirname` ka equivalent kaise nikaloge?",
  },
];

export default questions;
