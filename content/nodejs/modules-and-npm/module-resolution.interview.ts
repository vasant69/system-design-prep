import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mres-1",
    question:
      "Jab tum `require(\"x\")` ya `import ... from \"x\"` likhte ho, Node us string ko file mein kaise badalta hai? Algorithm samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Node teen tarah ke specifiers alag handle karta hai: (1) core module (`fs`, `node:crypto`) — builtin, disk touch nahi; (2) `./` `../` `/` se shuru — file path: exact → extensions (CJS) → directory ka `main`/`index.js`; (3) bare name (`lodash`) — current folder se root tak har `node_modules` walk karo, pehla match lo, phir us package ki `package.json` `exports`/`main` se entry file.",
    detailedAnswer:
      "Step by step: pehle core check — agar specifier builtin hai (ya `node:` prefix hai), wahi load hota hai aur `node_modules` mein same-naam ka package hone par bhi builtin jeetta hai. Agar `./`, `../` ya `/` se shuru — relative/absolute path: CJS mein Node exact path, phir `.js`/`.json`/`.node`, phir folder ko module maan ke uski `package.json` `main` ya `index.js` try karta hai; native ESM extension guess **nahi** karta. Warna bare specifier — Node current module ke directory se shuru karke `/` tak har parent ke `node_modules` folder check karta hai; pehla match jeetta hai (isiliye ek dependency ke multiple versions nested reh sakte hain). Package milne ke baad uski `package.json` decide karti hai andar kaunsi file — `exports` (naya, sealing) ya `main` (legacy) ya `index.js` fallback.",
    followUp:
      "Ek hi package ke do versions install ho gaye — kaunsa load ho raha hai, ye kaise debug karoge?",
    redFlag:
      "\"Node bas project root ke `node_modules` mein dekhta hai\" — nahi, wo poore folder tree ko upar tak walk karta hai.",
  },
  {
    id: "mres-2",
    question:
      "`package.json` ke `main` aur `exports` fields mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`main` ek legacy single entry point hai (`\"main\": \"./lib/index.js\"`), fallback `index.js`. `exports` naya field hai jo (a) ek se zyada named entry points define karta hai (`\".\"`, `\"./utils\"`), (b) conditional resolution deta hai (`import`/`require`/`node`), aur sabse important (c) package ki public surface ko **seal** karta hai — jo subpaths listed nahi, wo `ERR_PACKAGE_PATH_NOT_EXPORTED` dete hain.",
    detailedAnswer:
      "Sirf `main` wale package mein consumer koi bhi internal file deep-import kar sakta hai (`require(\"pkg/lib/secret.js\")`) — maintainer ke liye ye refactor ko risky banata hai kyunki koi bhi internal path effectively public API ban jaata hai. `exports` add karte hi sirf explicitly listed subpaths accessible rehte hain:\n\n```json\n{\n  \"exports\": {\n    \".\": \"./dist/index.js\",\n    \"./utils\": \"./dist/utils.js\",\n    \"./package.json\": \"./package.json\"\n  }\n}\n```\n\nIska matlab existing package mein `exports` add karna ek **breaking change** hai (major version bump) kyunki pehle deep-import karne wale toot jaate hain. Fayda: maintainer internal structure freely refactor kar sakta hai jab tak public entries stable rahein.",
    followUp:
      "Ek library ne `exports` add kar diya aur tumhara `some-lib/dist/helper.js` import toot gaya — kya karoge?",
  },
  {
    id: "mres-3",
    question:
      "Conditional exports (`import` / `require` / `node` / `default`) kaise kaam karte hain? Order kyun matter karta hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`exports` ki value ek object ho sakta hai jahan har key ek condition hai. Node use object mein likhe order mein, upar se neeche, evaluate karta hai aur **pehli matching** condition ki file leta hai. `import` ESM load pe match, `require` CJS load pe, `node` Node runtime pe, `default` hamesha. Isliye `default` ko last rakhna zaroori — pehle rakhoge toh wo har baar match karke baaki conditions ko dead kar dega.",
    detailedAnswer:
      "```json\n{\n  \"exports\": {\n    \".\": {\n      \"types\": \"./index.d.ts\",\n      \"import\": \"./index.mjs\",\n      \"require\": \"./index.cjs\",\n      \"default\": \"./index.js\"\n    }\n  }\n}\n```\n\nESM consumer `import \"pkg\"` → `types` skip (type-only), `import` match → `./index.mjs`. CJS consumer `require(\"pkg\")` → `import` skip, `require` match → `./index.cjs`. Ye hi mechanism dual-package (CJS + ESM) shipping ko possible banata hai. Agar `default` upar hota, dono consumers ko `./index.js` milta aur `import`/`require` kabhi hit na hote. Nested conditions bhi ho sakti hain (`node` ke andar `import`/`require`).",
    followUp:
      "Dual-package hazard kya hai — jab ek hi package CJS aur ESM dono taraf se load ho jaaye?",
  },
  {
    id: "mres-4",
    question:
      "Ek monorepo package ke andar `../../../shared/logger` jaise deep relative paths hain. Node-native tarika inhe clean karne ka?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`package.json` ka `imports` field use karo. `\"imports\": { \"#logger\": \"./src/logger/index.js\" }` daalo, phir package ke andar `import log from \"#logger\"` likho. Keys `#` se shuru hoti hain, sirf us package ke apne code ke andar resolve hoti hain, consumers ko leak nahi hoti, aur conditional bhi ho sakti hain (dev vs prod).",
    detailedAnswer:
      "```json\n{\n  \"imports\": {\n    \"#logger\": \"./src/logger/index.js\",\n    \"#config\": {\n      \"development\": \"./src/config.dev.js\",\n      \"default\": \"./src/config.prod.js\"\n    }\n  }\n}\n```\n\nAlternatives jo Node runtime pe portable **nahi** hain: `tsconfig.json` `paths` aur webpack `resolve.alias` — ye compile/bundle time pe resolve hote hain; plain `node dist/app.js` chalao toh wo specifiers fail karenge jab tak build ne rewrite na kiya ho. `imports` field Node ka native feature hai (v14.6+), bundler ke bina bhi chalta hai, isliye zyada portable choice hai.",
    followUp:
      "`#` specifiers aur regular bare specifiers (`lodash`) ke resolution mein kya farak hai?",
  },
  {
    id: "mres-5",
    question:
      "Production mein galat dependency version load ho raha tha. Tum kaise diagnose karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`npm ls <pkg>` se dekho package kitni jagah aur kaunse versions mein installed hai aur kis nesting level pe. Phir us specific file mein jahan bug hai, `require.resolve(\"<pkg>\")` chala ke exact path confirm karo. Resolution nearest `node_modules` se serve karta hai, toh alag files ko alag versions mil sakte hain.",
    detailedAnswer:
      "Steps: (1) `npm ls <pkg>` — tree dikhata hai; agar do versions hain, dono entries + unke parents dikhte hain. Ye normal hai jab do dependencies incompatible ranges maangti hain. (2) `node -e \"console.log(require.resolve('<pkg>'))\"` project root se, aur phir us subfolder se jahan buggy code hai — agar paths alag hain, tumne version mismatch pakad liya. (3) `require('<pkg>/package.json').version` log karo runtime pe. (4) Fix options: `npm dedupe`, `overrides` field (`package.json`) se version pin karo, ya offending dependency ko upgrade karo taaki wo compatible range accept kare. ESM mein `import.meta.resolve()` (naye Node) similar kaam karta hai.",
    followUp:
      "`package.json` ka `overrides` field kaise kaam karta hai?",
    redFlag:
      "\"Dono versions ek saath install nahi ho sakte\" — bilkul ho sakte hain, alag `node_modules` levels pe; yahi npm ka nested resolution model hai.",
  },
];

export default questions;
