import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "json-i-1",
    question: "JSON aur JavaScript object mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "JSON ek text data format hai — ek string. JS object ek in-memory data structure hai. JSON ka syntax JS object literal ka strict subset hai: keys hamesha double-quoted, sirf double-quoted strings, no comments, no trailing comma, no functions/undefined/NaN.",
    detailedAnswer:
      "JS object memory mein rehta hai, uske paas methods, prototype, references ho sakte hain. JSON ek serialization format hai — plain text jo network pe ja sake ya file mein likha ja sake. Syntax differences: (1) JSON keys hamesha `\"double quoted\"`; JS mein `name:` ya `'name':` chalta hai. (2) JSON strings sirf double quotes. (3) JSON mein comments, trailing commas, `undefined`, functions, `NaN`, `Infinity`, `BigInt` — kuch bhi allowed nahi. (4) JSON ke values sirf: string, number, boolean, null, array, object. Tum JSON ko `JSON.parse` se JS value banate ho aur `JSON.stringify` se wapas JSON text.",
    followUp: "`JSON.stringify` un JS values ka kya karta hai jo JSON mein represent nahi hoti?",
    redFlag: "'JSON aur JS object same cheez hain' — JSON hamesha ek string hai.",
  },
  {
    id: "json-i-2",
    question: "`JSON.stringify` kaunse values ko drop ya transform karta hai? Ek example do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Object mein `undefined`, functions, Symbols wali keys drop hoti hain. Array mein wahi values `null` ban jaati hain. `NaN`/`Infinity` -> `null`. `Date` -> ISO string (toJSON ke through). `BigInt` aur circular reference -> throw.",
    detailedAnswer:
      "```javascript\nJSON.stringify({\n  name: 'A',\n  fn: () => 1,        // key drop\n  x: undefined,       // key drop\n  y: NaN,             // -> null\n  when: new Date(0),  // -> \"1970-01-01T00:00:00.000Z\"\n  list: [undefined, () => 1]  // -> [null, null]\n});\n// '{\"name\":\"A\",\"y\":null,\"when\":\"1970-01-01T00:00:00.000Z\",\"list\":[null,null]}'\n```\n\nReason: JSON grammar mein in types ki koi representation nahi. Object context mein spec kehta hai key skip karo; array context mein position preserve karni hai isliye `null`. `Date` ka apna `toJSON()` hai jo ISO string deta hai — isiliye round-trip ke baad `Date` nahi milta. `BigInt` aur circular structure `TypeError` throw karte hain kyunki unka koi safe representation nahi.",
    followUp: "In dropped values ko preserve karna ho to kya karoge? (replacer function / custom encoding)",
  },
  {
    id: "json-i-3",
    question: "`JSON.parse` ko try/catch mein kyun rakhna chahiye?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "`JSON.parse` malformed input pe `SyntaxError` throw karta hai. Input aksar untrusted hota hai — API body, localStorage, cookie, query param — jo truncated ya corrupt aa sakta hai. Bina try/catch ke ek bad character poora function/route gira deta hai.",
    detailedAnswer:
      "```javascript\nfunction safeParse(text, fallback = null) {\n  try {\n    return JSON.parse(text);\n  } catch {\n    return fallback;\n  }\n}\n```\n\nCommon crash sources: server ne 200 ke bajaye HTML error page bheja aur `res.json()` use parse karne ki koshish karta hai; `localStorage.getItem('key')` `null` return karta hai aur `JSON.parse(null)` (jo `\"null\"` string ban ke actually `null` deta hai — par `JSON.parse(undefined)` throw karta hai); dusre process ne file aadhi likhi. Production code mein `JSON.parse` hamesha wrapped hota hai, ek sane fallback ke saath, aur aksar parse ke baad shape validation (Zod / manual checks) bhi hota hai kyunki valid JSON ka matlab sahi shape nahi.",
    followUp: "`JSON.parse` ke baad tum data ka shape kaise validate karoge?",
    redFlag: "'JSON.parse safe hai, wo bas null return kar dega' — nahi, wo throw karta hai.",
  },
  {
    id: "json-i-4",
    question:
      "Deep clone ke liye `JSON.parse(JSON.stringify(obj))` — ye theek hai? Alternative kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Sirf simple plain-data objects ke liye. Ye lossy hai: `Date` -> string, `undefined`/functions/Symbols drop, `NaN`/`Infinity` -> `null`, `Map`/`Set`/`RegExp` toot-te hain, circular reference pe crash. Aur slow (do full passes). Aaj `structuredClone(obj)` use karo.",
    detailedAnswer:
      "`JSON.parse(JSON.stringify(x))` do serialization passes karta hai aur raaste mein har wo type kho deta hai jo JSON support nahi karta. Circular ref pe `JSON.stringify` `TypeError` throw karta hai — clone banta hi nahi. `structuredClone` (2022, sab modern browsers + Node 17+) structured clone algorithm use karta hai: `Date`, `Map`, `Set`, `ArrayBuffer`, typed arrays, `RegExp`, aur circular references sab sahi clone hote hain. Wo bhi functions aur DOM nodes clone nahi kar sakta (wo inherently non-cloneable hain) — un cases mein manual/shallow copy ya library (lodash `cloneDeep`) chahiye. Shallow clone (`{...obj}` / `Object.assign`) tab theek hai jab nested objects ko share karna acceptable ho.",
    followUp: "`structuredClone` functions kyun clone nahi kar sakta?",
  },
  {
    id: "json-i-5",
    question: "`JSON.stringify` ke doosre aur teesre arguments kya karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Doosra `replacer`: ya keys ka array (whitelist — sirf ye keys rakho), ya function `(key, value) => newValue` jo har pair transform kare (`undefined` return karo to key hataao). Teesra `space`: pretty-print indentation — `JSON.stringify(obj, null, 2)` 2-space indented output deta hai.",
    detailedAnswer:
      "`replacer` as array: `JSON.stringify(user, ['id', 'name'])` sirf `id` aur `name` keys rakhega — sensitive fields (`passwordHash`, `token`) chhodne ka aasaan tarika. `replacer` as function: har key-value pair pe chalta hai (top-down), jo return karo wo serialize hota hai; `undefined` return karo to wo key output se hat jaati hai — use karke tum `BigInt` ko string mein convert kar sakte ho ya `Date` ko epoch number bana sakte ho. `space`: number (max 10) ya string (jaise `'\\t'`). `JSON.stringify(obj, null, 2)` logs, config files, aur snapshot tests ke liye standard hai kyunki output human-readable aur diff-friendly hota hai. Compact wire format ke liye `space` chhod do (default: no whitespace).",
    followUp: "Ek object jismein BigInt hai use bina crash kiye stringify kaise karoge?",
  },
];

export default questions;
