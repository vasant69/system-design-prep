import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ttc-1",
    question: "JavaScript mein kisi value ke array hone ka reliable check kya hai? typeof kyun kaafi nahi?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Array.isArray(x). typeof [] 'object' deta hai — arrays aur plain objects (aur Date, RegExp) sab 'object' hain, to typeof distinguish nahi karta. instanceof Array cross-realm (iframe/worker) fail hota hai. x.length check unreliable hai (strings aur {length:n} objects bhi length rakhte hain). Array.isArray har case mein sahi aur realm-safe hai.",
    detailedAnswer:
      "`typeof` sirf 8 strings deta hai aur saare reference types ko `'object'` bolta hai. To array-vs-object typeof se nahi ho sakta.\n\nOptions aur unke problems:\n- `x instanceof Array` — prototype chain check; iframe/worker/vm se aaya array parent realm ke `Array.prototype` ki chain mein nahi hota -> `false`.\n- `x.constructor === Array` — `constructor` overwrite ho sakta hai, aur cross-realm same problem.\n- `x.length !== undefined` — `'abc'.length`, `{length: 0}`, `function(a){}.length` — sab truthy-ish.\n- `Array.isArray(x)` — ES5, internal check, realm-safe. Yahi answer hai.\n\nGeneral type-checking: `typeof` primitives ke liye, `x === null` null ke liye, `Object.prototype.toString.call(x)` Date/Map/RegExp ke liye.",
    followUp: "Object.prototype.toString.call([]) kya deta hai aur wo cross-realm kaam kyun karta hai?",
    redFlag: "x.length ya x.constructor === Array propose karna, ya Array.isArray ka pata na hona.",
  },
  {
    id: "ttc-2",
    question: "typeof null 'object' kyun deta hai? Aur null check karne ka sahi tarika kya hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "JS ke pehle implementation mein values ek type tag ke saath store hoti thin; null ka tag 0 tha, jo objects ka bhi tag tha — to typeof null 'object' de deta hai. Ise fix karna existing web tod deta, to spec ne permanent rakh diya. Sahi null check: x === null (ya dono ke liye x == null).",
    detailedAnswer:
      "1995 ke original engine mein har value ek small type-tag prefix ke saath aati thi. Object tag `0` tha, aur null ko machine-level null pointer (all-zero) se represent kiya gaya tha — to uska tag bhi `0` pad gaya. `typeof` us tag ko dekhta hai, isliye `null` -> `'object'`.\n\nES fix propose bhi hua (`typeof null === 'null'`) par reject ho gaya kyunki bahut sa code `typeof x === 'object'` pe depend karta hai.\n\nSahi checks:\n- Sirf null: `x === null`\n- null YA undefined: `x == null` (== ka ek accepted use)\n- 'object hai aur null nahi': `x !== null && typeof x === 'object'`\n- Plain object specifically: `Object.prototype.toString.call(x) === '[object Object]'`",
    followUp: "`x !== null && typeof x === 'object'` — ye check arrays ko bhi true dega. Plain object only kaise karoge?",
  },
  {
    id: "ttc-3",
    question: "typeof ka ek use case batao jahan wo hi kaam karta hai, koi aur approach nahi.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek aise variable/global ko check karna jo shayad declare hi na hua ho — jaise SSR mein `typeof window !== 'undefined'`. Undeclared name ko seedha reference karna ReferenceError deta hai; typeof us case mein bhi safely 'undefined' return karta hai, throw nahi karta.",
    detailedAnswer:
      "Normally undeclared identifier ko touch karna (`if (foo)`, `foo === undefined`) `ReferenceError: foo is not defined` deta hai — code crash, check chalta hi nahi. `typeof foo` ek syntactic exception hai: engine name resolve na kar paaye to `'undefined'` string de deta hai.\n\nReal uses:\n- SSR/isomorphic code: `if (typeof window !== 'undefined') { /* browser-only */ }` — Node pe `window` declared hi nahi.\n- Feature detection: `if (typeof IntersectionObserver !== 'undefined')`.\n- Optional global deps: `typeof jQuery !== 'undefined'`.\n\nEk caveat: `let`/`const` jo TDZ mein hain (declared but not yet initialised) — un par `typeof` bhi `ReferenceError` deta hai. 'typeof always safe' sirf genuinely undeclared names ke liye sach hai.",
    followUp: "`typeof` TDZ mein kyun throw karta hai jabki undeclared global pe nahi?",
  },
  {
    id: "ttc-4",
    question:
      "instanceof kaise kaam karta hai aur uski sabse badi limitation kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`x instanceof C` check karta hai ki `C.prototype` `x` ki prototype chain mein kahin hai ya nahi. Sabse badi limitation: cross-realm. Har iframe/worker/Node-vm ka apna Array, Object, Error etc. hota hai — doosre realm se aaye object pe `instanceof` `false` deta hai bhale wo 'same kind' ho. Aur primitives pe hamesha false (`'x' instanceof String` -> false).",
    detailedAnswer:
      "Mechanism: `x instanceof C` prototype chain traverse karta hai — `Object.getPrototypeOf(x)`, phir uska proto, ... — aur dekhta hai kahin `=== C.prototype` milta hai. `Symbol.hasInstance` se ise customize bhi kiya ja sakta hai.\n\nLimitations:\n1. Cross-realm: `iframeWindow.Array !== window.Array`, to iframe array `instanceof window.Array` -> false. Isliye `Array.isArray` (realm-safe) exist karta hai.\n2. Primitives: `'abc' instanceof String` -> false (primitive, wrapper object nahi).\n3. Prototype manipulation / `Object.setPrototypeOf` se result badla ja sakta hai.\n4. `Object` ke against sab kuch true (`[] instanceof Object` -> true).\n\nAcchha use: apni hi custom classes, same realm — `err instanceof AppError`, `node instanceof MyTreeNode`. Built-in cross-boundary detection ke liye `Array.isArray` / `Object.prototype.toString.call`.",
    followUp: "Custom error classes ke saath instanceof kab-kab break hota hai (hint: transpilation / extends Error)?",
  },
  {
    id: "ttc-5",
    question:
      "Ek API response aaya hai. Tumhe check karna hai: `data.items` ek non-empty array hai, `data.count` ek usable number hai, `data.meta` ek plain object hai. Har check kaise likhoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "items: `Array.isArray(data.items) && data.items.length > 0`. count: `typeof data.count === 'number' && Number.isFinite(data.count)`. meta: `Object.prototype.toString.call(data.meta) === '[object Object]'` (ya `data.meta != null && typeof data.meta === 'object' && !Array.isArray(data.meta)`).",
    detailedAnswer:
      "```javascript\nfunction validate(data) {\n  const errors = [];\n\n  if (!Array.isArray(data.items) || data.items.length === 0) {\n    errors.push('items must be a non-empty array');\n  }\n\n  if (typeof data.count !== 'number' || !Number.isFinite(data.count)) {\n    errors.push('count must be a finite number'); // NaN/Infinity reject\n  }\n\n  const metaTag = Object.prototype.toString.call(data.meta);\n  if (metaTag !== '[object Object]') {\n    errors.push('meta must be a plain object'); // array/null/Date reject\n  }\n\n  return errors;\n}\n```\n\nKey points: `Array.isArray` (typeof nahi), `Number.isFinite` (typeof 'number' `NaN`/`Infinity` ko pass kar deta), aur plain-object check jo `null` (typeof 'object'!) aur arrays ko exclude kare. Production mein aise boundaries pe zod/yup jaisa schema validator use karna zyada maintainable hai.",
    followUp: "Ye sab manual checks ki jagah zod use karo to code kaisa dikhega?",
    redFlag: "count ke liye sirf `typeof === 'number'`, ya meta ke liye sirf `typeof === 'object'` (null/array pass ho jaayenge).",
  },
];

export default questions;
