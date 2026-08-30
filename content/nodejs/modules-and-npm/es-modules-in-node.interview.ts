import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "esm-1",
    question:
      "ES Modules kya hain, aur Node ko kaise pata chalta hai ki file ESM hai CJS nahi?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "ESM JavaScript ka standard, built-in module system hai — `import`/`export` statements jo engine run se pehle analyze karta hai. Node file ko ESM maanta hai jab nearest `package.json` mein `\"type\": \"module\"` ho, ya file ka extension `.mjs` ho. Warna default CJS.",
    detailedAnswer:
      "CJS Node ka apna solution tha; ESM language spec ka hissa hai, browser aur Node dono mein same syntax. `import`/`export` **statements** hain (functions nahi) aur sirf module ke top-level pe likh sakte ho — isliye engine graph ko code chalane se pehle poori tarah jaan leta hai (static analyzability), jo tree-shaking ko possible banata hai. Node module type do signals se decide karta hai: (1) nearest `package.json` ka `\"type\"` field, (2) explicit `.mjs`/`.cjs` extension jo `\"type\"` ko override karta hai. Ek hi project mein dono mix karne ke liye `.cjs`/`.mjs` extensions use karte ho.",
    followUp:
      "Ek ESM file ke andar se ek CommonJS file ko kaise import karoge, aur uske named exports milenge?",
    redFlag:
      "\"File mein `import` likhne se wo apne aap ESM ban jaati hai\" — nahi, `\"type\"` ya extension decide karta hai; galat context mein `import` syntax error deta hai.",
  },
  {
    id: "esm-2",
    question:
      "ESM ka 'async module graph' aur uski 3 phases samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "ESM loading 3 phases mein hoti hai: (1) Construction — entry se saare `import` specifiers resolve karke har file fetch+parse, recursively, poora graph banao; (2) Instantiation — har export ke liye memory slot bana ke har `import` ko us slot se link (live binding); (3) Evaluation — modules ka code chalao, leaves se root (post-order). Resolve/link pehle, execute baad mein — isliye 'async graph'.",
    detailedAnswer:
      "CJS mein `require(x)` ke waqt file parse aur execute dono synchronously hote hain, wahin. ESM inhe alag karta hai: pehle poora dependency tree discover aur parse hota hai (kisi module ka code chala nahi), phir har module ke exports ke liye slots banake imports link hote hain, phir evaluation phase mein code chalta hai. Kyunki evaluation ek alag phase hai, wo asynchronous ho sakta hai — ek module apne top pe `await` kar sakta hai (top-level await) aur uspe depend karne wale modules pause ho jaate hain jab tak wo settle na ho. Evaluation order phir bhi deterministic hai (post-order DFS), sirf timing async hai.",
    followUp:
      "Agar do modules ek doosre ko import karein (circular), toh evaluation phase mein kya hota hai?",
  },
  {
    id: "esm-3",
    question:
      "Live bindings kya hain? ESM aur CJS import mein iska farak ek example se dikhao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "ESM import ek live binding hai — importer ke paas exporter ke variable ka ek live reference hota hai, snapshot nahi. Exporter jab variable update kare, importer ko naya value dikhta hai. CJS `const { x } = require(...)` us waqt ki value copy kar leta hai; baad ke updates nahi dikhte.",
    detailedAnswer:
      "```javascript\n// counter.mjs\nexport let count = 0;\nexport function inc() { count++; }\n\n// app.mjs\nimport { count, inc } from './counter.mjs';\nconsole.log(count); // 0\ninc();\nconsole.log(count); // 1  <-- live binding\n```\n\nCJS version:\n\n```javascript\n// counter.js\nlet count = 0;\nfunction inc() { count++; }\nmodule.exports = { count, inc };\n\n// app.js\nconst { count, inc } = require('./counter');\nconsole.log(count); // 0\ninc();\nconsole.log(count); // 0  <-- snapshot, update nahi dikha\n```\n\nCJS mein `count` ko us waqt destructure karke copy kiya gaya. ESM binding read-only bhi hai importer ki taraf — `count = 5` likhna `TypeError` deta hai; sirf exporter module hi apne variable ko badal sakta hai.",
    followUp:
      "Ye live-binding property circular dependencies ko CJS se zyada predictable kyun banati hai?",
    redFlag:
      "\"`import` bas `require` ka naya syntax hai\" — binding semantics, timing, aur analyzability sab alag hain.",
  },
  {
    id: "esm-4",
    question:
      "Ek ESM file mein `__dirname`, `__filename`, aur `require` chahiye. Kya karoge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "ESM scope mein ye teeno defined nahi hote. `__filename` = `fileURLToPath(import.meta.url)`; `__dirname` = `dirname(__filename)` (`node:url` aur `node:path` se). `require` ki zaroorat ho toh `createRequire(import.meta.url)` se ek banao — warna `import` / `await import()` use karo.",
    detailedAnswer:
      "```javascript\nimport { fileURLToPath } from 'node:url';\nimport { dirname } from 'node:path';\nimport { createRequire } from 'node:module';\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\nconst require = createRequire(import.meta.url);\n```\n\nGalat tarika: `import.meta.url.replace('file://', '')` — `import.meta.url` ek `file://` URL hai, aur Windows pe wo `file:///D:/...` hota hai, toh manual slice leading slash / drive letter todta hai. Hamesha `fileURLToPath()`. Newer Node (20.11+) mein `import.meta.dirname` aur `import.meta.filename` seedhe milte hain, lekin portable code ke liye upar wala pattern safe hai.",
    followUp:
      "`createRequire` se load kiya hua CJS module ESM ke module cache mein aata hai ya CJS ke?",
  },
  {
    id: "esm-5",
    question:
      "Interview mein: \"tumne is service ke liye ESM kyun chuna, CJS nahi?\" — kaise answer doge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "\"Naya service tha, do concrete reasons: (1) startup pe secrets manager se config `await` karni thi — top-level await se module load hote hi config ready, IIFE hack ke bina; (2) humari internal shared library ESM-only publish hoti hai aur tree-shaking se bundle chhota rehta hai. `__dirname` ke liye ek chhota `import.meta.url` helper banaya, legacy CJS deps ko default import se use kiya.\"",
    detailedAnswer:
      "Achha answer constraints se justify karta hai, preference se nahi. Points jo mention karne chahiye: (1) Naya greenfield project — ESM 2024+ ka default, ecosystem yahan ja raha hai. (2) Concrete ESM features jo project ko chahiye the — top-level await (config/DB ready-on-import), tree-shaking (bundle size), standard syntax (isomorphic code browser+Node). (3) ESM-only dependencies — kai modern libs (`chalk@5`, `node-fetch@3`) sirf ESM hain, CJS se `require` karne pe `ERR_REQUIRE_ESM`. (4) Costs jo humne accept kiye — `__dirname` recreate karna, relative imports mein extension likhna, CJS interop ke liye `pkg.default` pattern. Agar bada existing CJS codebase hota toh main migrate nahi karta bina strong reason ke.",
    followUp:
      "ESM-only dependency ko ek CommonJS codebase mein use karna ho toh kya options hain?",
    redFlag:
      "\"ESM hamesha better hai\" — bade CJS codebase ko bina wajah migrate karna real risk; decision context-dependent hai.",
  },
];

export default questions;
