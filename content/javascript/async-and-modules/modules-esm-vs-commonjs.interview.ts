import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mod-1",
    question: "ES Modules aur CommonJS mein core differences kya hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "ESM: import/export, static + hoisted + analysable (tree-shaking possible), async load, live bindings, hamesha strict mode. CJS: require()/module.exports, ek synchronous dynamic function call, value copy at require time, __dirname available. ESM language standard hai; CJS Node ka legacy system.",
    detailedAnswer:
      "(1) Syntax: ESM `import x from './m.js'` / `export`; CJS `const x = require('./m')` / `module.exports = ...`. (2) Static vs dynamic: ESM statements top pe hoist hote hain aur engine code chalaye bina dependency graph banata hai — isliye bundler unused exports drop kar sakta hai (tree-shaking). CJS `require` runtime function call hai, `if` ke andar / computed path se ho sakta hai — analysis unreliable. (3) Sync vs async: `require` synchronously file load+execute karta hai; ESM loading async hai aur dynamic `import()` ek Promise deta hai, plus top-level `await` sirf ESM mein. (4) Bindings: ESM imports live read-only bindings hain (exporter ki current value dikhti hai); CJS destructure karte waqt value ki copy leta hai. (5) Environment: ESM hamesha strict mode, `import.meta.url`; CJS `__dirname`/`__filename` built-in.",
    followUp: "ESM ka 'do-phase' loading (parse/link, phir evaluate) circular dependencies ke liye kaise help karta hai?",
    redFlag: "'bas alag syntax hai, behaviour same' — static/dynamic aur sync/async farak fundamental hain.",
  },
  {
    id: "mod-2",
    question: "Live bindings kya hain? ESM aur CJS mein ek imported value kaise behave karti hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "ESM import ek live, read-only reference hai exporting module ke variable ka — exporter usko update kare to importer ko nayi value dikhti hai. CJS require ke waqt jo value hoti hai uski copy milti hai (agar tum ek primitive destructure karo), baad ka change nahi dikhta.",
    detailedAnswer:
      "```javascript\n// counter.mjs\nexport let count = 0;\nexport function inc() { count++; }\n\n// app.mjs\nimport { count, inc } from './counter.mjs';\nconsole.log(count); // 0\ninc();\nconsole.log(count); // 1  -- live binding\n```\n\nESM spec kehta hai import ek indirection hai module ke actual binding tak. Importer usko reassign nahi kar sakta (read-only), par exporter ke mutations visible hain. CJS mein:\n\n```javascript\n// counter.cjs\nlet count = 0;\nfunction inc() { count++; }\nmodule.exports = { count, inc };\n\n// app.cjs\nconst { count, inc } = require('./counter.cjs');\ninc();\nconsole.log(count); // 0  -- purani copy, kyunki count ek primitive tha\n```\n\nAgar tum `const m = require('./counter.cjs')` karke `m.count` padho to nayi value dikh sakti hai — kyunki tum ab object property padh rahe ho, ek copied primitive nahi.",
    followUp: "Isi wajah se CJS mein circular dependency ka result partial/undefined exports kyun ho sakta hai?",
  },
  {
    id: "mod-3",
    question: "Node mein ESM kaise enable karte ho? Migration ke waqt kya-kya break hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "package.json mein `\"type\": \"module\"` (saari .js ESM ban jaati hain) ya per-file `.mjs` extension. Common breaks: `__dirname`/`__filename` gaayab, relative imports ko full `.js` extension chahiye, aur CJS-only dependencies ke named imports fail ho sakte hain.",
    detailedAnswer:
      "`\"type\": \"module\"` package-wide switch hai — uske baad har `.js` ESM hai, aur purani CJS files ko `.cjs` rename karna padta hai ya convert karna padta hai. Teen practical fixes: (1) `__dirname` ke liye: `import { fileURLToPath } from 'node:url'; const __dirname = path.dirname(fileURLToPath(import.meta.url));`. (2) Relative imports: `import x from './util.js'` — extension mandatory, bundler wali flexibility nahi. (3) CJS dependency: `import { readFile } from 'fs-extra'` fail ho sakta hai; `import pkg from 'fs-extra'; const { readFile } = pkg;` reliable hai. Isiliye advice hai: migration deliberate karo — file-by-file, tests ke saath — na ki ek flag flip karke sab kuch ek saath.",
    followUp: "`.cjs` aur `.mjs` files ek hi project mein ek dusre ko kaise import karti hain?",
  },
  {
    id: "mod-4",
    question: "Dynamic import() kab use karoge? Static import se kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`import(...)` ek function-jaisa form hai jo ek Promise return karta hai aur module ko tab load karta hai jab wo line chalti hai. Use: lazy loading / code splitting (route pe pahunchne pe hi heavy component load karo), conditional loading (feature flag), aur CJS se ESM module load karna.",
    detailedAnswer:
      "Static `import` top pe hoist hota hai aur hamesha evaluate hota hai — tum use skip ya defer nahi kar sakte. `import()` runtime pe chalta hai:\n\n```javascript\nbutton.addEventListener('click', async () => {\n  const { renderChart } = await import('./chart.js'); // tab tak chart.js download nahi hua\n  renderChart(data);\n});\n```\n\nBundler is call site pe automatic code-split point banata hai — `chart.js` aur uski deps ek alag chunk mein jaati hain jo sirf click pe fetch hoti hai. React mein `React.lazy(() => import('./Heavy'))` isi pe based hai. Doosra use: `if (locale === 'ar') await import('./rtl-styles.js')`. Aur CJS module se ESM-only package use karna ho to `const mod = await import('esm-only-pkg')` hi rasta hai (`require` us pe fail karega).",
    followUp: "`import()` ke return value ka shape kya hai — default export kaise access karoge?",
  },
  {
    id: "mod-5",
    question: "Browser mein `<script type=\"module\">` normal `<script>` se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "type=module: deferred by default (HTML parse ke baad chalta hai), apna module scope (top-level var global nahi banta), hamesha strict mode, same URL sirf ek baar evaluate hota hai, CORS-enforced, aur import/export use kar sakta hai. Normal script: blocking (jab tak async/defer na ho), shared global scope, sloppy mode default.",
    detailedAnswer:
      "Ek module script parser ko block nahi karta — wo background mein fetch hota hai aur document parse hone ke baad, order mein, execute hota hai (jaise `defer`). Har module ka apna scope hota hai, isliye do modules ka `const config` clash nahi karta — inter-module sharing sirf explicit `import`/`export` se. Module graph ek hi baar resolve aur execute hota hai chahe kitni jagah import ho. Cross-origin module scripts ko valid CORS headers chahiye (normal scripts ko nahi). Bare specifiers (`import _ from 'lodash'`) natively resolve nahi hote — chahiye `<script type=\"importmap\">` ya ek bundler. Nomodule fallback (`<script nomodule>`) purane browsers ke lite use hota tha jo ESM nahi samajhte.",
    followUp: "Import map kya karta hai aur bundler ke bina wo kaise help karta hai?",
  },
];

export default questions;
