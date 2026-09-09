import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "commonjs-vs-esm-1",
    question: "`require()` aur `import` ke loading behaviour mein core farak kya hai?",
    options: [
      "`require` async hai, `import` sync hai",
      "`require` synchronously module ko load+run karta hai jab line pahunchti hai; `import` static hai — Node code chalne se pehle poora graph resolve karta hai, loading async hoti hai",
      "Dono bilkul same tarah kaam karte hain, sirf syntax alag",
      "`import` module ko cache nahi karta, `require` karta hai",
    ],
    correctIndex: 1,
    explanation:
      "CJS `require` blocking hai — jis line pe hai, wahin ruk ke poora module run karta hai, phir aage. ESM `import` statements pehle parse-time pe collect hote hain; Node ka module loader poora dependency graph asynchronously resolve karta hai, phir modules ko order mein evaluate karta hai. Dono systems modules ko cache karte hain (ek baar hi run hote hain).",
    difficulty: "medium",
  },
  {
    id: "commonjs-vs-esm-2",
    question: "Ek `.js` file CJS chalegi ya ESM — Node kaise decide karta hai?",
    options: [
      "Hamesha CJS, `.js` ka matlab hi CommonJS hai",
      "File ke andar `import` dikhe to ESM, warna CJS",
      "Nearest `package.json` ke `\"type\"` field se: `\"module\"` -> ESM, absent ya `\"commonjs\"` -> CJS. `.mjs` hamesha ESM, `.cjs` hamesha CJS",
      "Node command-line flag se, per-file decide nahi hota",
    ],
    correctIndex: 2,
    explanation:
      "Explicit extensions jeetti hain: `.mjs` = ESM, `.cjs` = CJS, chahe `package.json` kuch bhi kahe. `.js` ke liye Node upar ki taraf sabse nazdeek `package.json` dhoondta hai aur uska `\"type\"` dekhta hai — `\"module\"` to ESM, warna (default) CJS. Node file content scan karke decide nahi karta.",
    difficulty: "medium",
  },
  {
    id: "commonjs-vs-esm-3",
    question: "ESM file mein `__dirname` use karne par kya hota hai, aur equivalent kya hai?",
    options: [
      "Kaam karta hai, bilkul CJS jaisa",
      "`ReferenceError` — ESM mein `__dirname`/`__filename`/`require`/`module` nahi hote; `import.meta.url` se derive karo (`fileURLToPath` + `dirname`)",
      "`undefined` return karta hai chup-chaap",
      "Sirf tab kaam karta hai jab `\"type\": \"commonjs\"` ho",
    ],
    correctIndex: 1,
    explanation:
      "ESM scope mein CJS ke wrapper-provided variables (`require`, `module`, `exports`, `__filename`, `__dirname`) exist hi nahi karte — inhe use karna `ReferenceError` deta hai. ESM `import.meta.url` deta hai (current file ka `file://` URL); usse `fileURLToPath(import.meta.url)` se path, phir `path.dirname(...)` se directory nikaalte hain. (Newer Node mein `import.meta.dirname`/`import.meta.filename` bhi hain.)",
    difficulty: "medium",
  },
  {
    id: "commonjs-vs-esm-4",
    question: "CJS module se ek ESM-only package ko kaise use karoge?",
    options: [
      "Seedha `require('esm-pkg')` — Node automatically convert kar deta hai",
      "Possible hi nahi, package ko downgrade karna padega",
      "Dynamic `import()` se: `const pkg = await import('esm-pkg')` (ek async context ke andar)",
      "`package.json` mein `\"type\": \"module\"` likhne se saari CJS files bhi ESM import kar sakti hain",
    ],
    correctIndex: 2,
    explanation:
      "`require()` ESM ko synchronously load nahi kar sakta (ESM async hai), isliye ESM-only package pe `require` throw karta hai (`ERR_REQUIRE_ESM`) — haalaanki recent Node versions mein sync-graph ESM ke liye `require(esm)` allow hone laga hai. Portable tareeka: dynamic `import('esm-pkg')` jo ek promise deta hai, kisi `async` function ya top-level await (ESM) mein. Ulta, ESM file static `import` se CJS ko load kar sakti hai (default import = `module.exports`).",
    difficulty: "hard",
  },
];

export default quiz;
