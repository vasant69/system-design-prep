import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "es-modules-in-node-1",
    question:
      "Node ek `.js` file ko ES Module ki tarah kab treat karta hai?",
    options: [
      "Jab file mein `import` keyword ho, chahe package.json kuch bhi kahe",
      "Jab nearest `package.json` mein `\"type\": \"module\"` ho, ya file ka extension `.mjs` ho",
      "Hamesha — Node 14+ mein saari `.js` files ESM hain",
      "Jab file `\"use module\"` directive se shuru ho",
    ],
    correctIndex: 1,
    explanation:
      "Node module type ko file content se nahi, do signals se decide karta hai: nearest package.json ka `\"type\"` field (`\"module\"` = ESM, `\"commonjs\"` ya missing = CJS), ya explicit extension (`.mjs` = ESM, `.cjs` = CJS). Option A galat — `import` likhne se file automatically ESM nahi banti, wo syntax error de sakta hai agar file CJS hai. Option C galat — default abhi bhi CJS hai jab tak `\"type\"` set na ho. Option D jaisa koi directive hota hi nahi.",
    difficulty: "easy",
  },
  {
    id: "es-modules-in-node-2",
    question:
      "`counter.mjs` mein `export let count = 0` aur `export function inc() { count++ }` hai. `app.mjs` `{ count, inc }` import karta hai, `count` print karta hai (0), `inc()` call karta hai, phir `count` dobara print karta hai. Doosra print kya dikhayega, aur CJS mein kya hota?",
    options: [
      "ESM: 1; CJS mein bhi 1 — dono same behave karte hain",
      "ESM: 1 (live binding — importer ko exporter ke variable ka current value dikhta hai); CJS mein 0 (require ne value ka snapshot copy kiya tha)",
      "ESM: 0; CJS: 1",
      "ESM: error — imported `count` ko modify nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "ESM imports live bindings hain — `count` importer ki taraf exporter ke actual variable ka ek live view hai, toh `inc()` ke baad `1` dikhta hai. CJS mein `const { count } = require(...)` ne us waqt ki value (`0`) ko destructure karke copy kar liya, `inc()` uss local copy ko nahi badalta. Option D partially sahi concept hai (importer khud `count = 5` nahi likh sakta) lekin yahan `inc()` exporter ke andar mutate kar raha hai, jo allowed hai.",
    difficulty: "medium",
  },
  {
    id: "es-modules-in-node-3",
    question:
      "ESM module mein `__dirname` chahiye. Sahi tarika kya hai?",
    options: [
      "`const __dirname = process.cwd()`",
      "`const __dirname = import.meta.dirname` — ye har Node version mein guaranteed hai",
      "`const __dirname = dirname(fileURLToPath(import.meta.url))` (node:url aur node:path se)",
      "`const __dirname = import.meta.url.replace(\"file://\", \"\")`",
    ],
    correctIndex: 2,
    explanation:
      "ESM scope mein `__dirname` defined nahi hota. `import.meta.url` ek `file://` URL string deta hai; `fileURLToPath()` use proper OS path mein badalta hai aur `dirname()` folder nikaalta hai. Option A galat — `process.cwd()` wo folder hai jahan se `node` chalaya gaya, file ka folder nahi. Option D toota hua — `file://` URL ko manually slice karne se Windows pe leading slash/drive letter galat aata hai. `import.meta.dirname` newer Node (20.11+) mein hai lekin \"har version\" galat dava hai.",
    difficulty: "medium",
  },
  {
    id: "es-modules-in-node-4",
    question:
      "ESM loading ke context mein 'async graph' ka kya matlab hai, aur top-level await isse kaise juda hai?",
    options: [
      "Har import statement ek Promise return karta hai jise `await` karna padta hai",
      "Node pehle poora module graph resolve aur link karta hai (construction + instantiation) code chalane se pehle; evaluation phase alag hai, jisme ek module top-level await pe pause ho sakta hai bina dusre modules ko block kiye jinpe wo depend nahi karta",
      "ESM modules alag threads pe load hote hain",
      "Async graph matlab modules ko koi bhi order mein evaluate kiya ja sakta hai, non-deterministically",
    ],
    correctIndex: 1,
    explanation:
      "ESM ka loading 3 phases mein bata hua hai: construction (saare imports resolve + parse), instantiation (exports ke slots bana ke imports ko live-bind), evaluation (code chalao, leaves se root). Kyunki resolve/link alag phase hai, evaluation phase asynchronous ho sakta hai — ek module top-level `await` pe ruk sakta hai aur uspe depend karne wale modules uska wait karte hain. Option A galat — static `import` value return nahi karta. Option C galat — koi extra thread nahi. Option D galat — evaluation order deterministic hai (post-order DFS).",
    difficulty: "hard",
  },
];

export default quiz;
