import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "package-json-1",
    question:
      "package.json mein `\"type\": \"module\"` set karne ka kya effect hota hai?",
    options: [
      "npm sirf ES module packages hi install karega",
      "Package ke `.js` files ko Node ESM (import/export) treat karega, CommonJS nahi",
      "package.json khud ES module ban jata hai",
      "TypeScript compilation enable ho jati hai",
    ],
    correctIndex: 1,
    explanation:
      "`type` field do values leta hai: `commonjs` (default) aur `module`. `module` set karne pe us package ke saare `.js` files ESM syntax mein parse hote hain — `require`/`module.exports` nahi chalega, `import`/`export` chalega. Explicit extension chahiye ho toh `.mjs` (hamesha ESM) / `.cjs` (hamesha CJS) use kar sakte ho. Option A/C/D `type` ka kaam nahi.",
    difficulty: "easy",
  },
  {
    id: "package-json-2",
    question:
      "`main` field ke hote hue bhi ek library ko `exports` field kyun add karni chahiye?",
    options: [
      "exports installs ko tez karta hai",
      "exports modern entry-point map deta hai AUR encapsulation — jo path exports mein listed nahi, use consumer deep-import (require/import) nahi kar sakta",
      "exports package.json ka size chhota karta hai",
      "main sirf CommonJS ke liye kaam karta hai, ESM ke liye nahi chal sakta",
    ],
    correctIndex: 1,
    explanation:
      "`exports` `main` se do cheezein zyada deta hai: (1) multiple named subpaths (`.`, `./utils`) with conditional resolution (import vs require, node vs browser); (2) encapsulation — sirf listed paths hi importable, `require('lib/src/internal.js')` block ho jata hai, jisse library apni internal structure freely refactor kar sakti hai. Option A/C galat. Option D galat — `main` dono ke liye kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "package-json-3",
    question:
      "Ek Express middleware package apni package.json mein `express` ko `dependencies` ke bajaye `peerDependencies` mein kyun daalega?",
    options: [
      "Taaki express install hi na ho aur package chhota rahe",
      "Taaki middleware aur host app ek hi express copy share karein — do alag copies hone se req/res augmentation aur instanceof checks toot jate",
      "peerDependencies dependencies se tez install hoti hain",
      "Kyunki express ek devDependency hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar middleware apni express copy `dependencies` mein rakhe, toh app mein express ki do copies aa sakti hain. Middleware jo `req`/`res` prototype extend karta hai ya `express.Router` ka instanceof check karta hai, wo galat copy pe kaam karega. `peerDependencies` bolta hai 'host app express provide karega, is range mein' — ek hi shared copy. Option A partially sahi (install nahi hota) par asli reason sharing hai. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "package-json-4",
    question:
      "Ek application repo (library nahi) ki package.json mein `\"private\": true` na hone ka sabse bada risk kya hai?",
    options: [
      "npm install slow ho jata hai",
      "Koi teammate ya CI job galti se `npm publish` chala de toh internal source code public npm registry par chala jata hai",
      "devDependencies install nahi hongi",
      "package-lock.json generate nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "`private: true` set hone par `npm publish` refuse kar deta hai. Iske bina, ek accidental `npm publish` (ya misconfigured CI release step) internal business logic, config patterns, aur code ko public registry pe leak kar sakta hai — jise remove karna bhi mushkil hai. Isliye har non-published repo mein `private: true` daalte hain. Option A/C/D `private` se unrelated hain.",
    difficulty: "easy",
  },
];

export default quiz;
