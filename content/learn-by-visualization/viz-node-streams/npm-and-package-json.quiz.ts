import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "npm-and-package-json-1",
    question: "`\"express\": \"^4.18.2\"` kaunsi versions install hone deta hai?",
    options: [
      "Koi bhi 4.x ya 5.x, jab tak version 4.18.2 se badi ho",
      "4.18.2 se lekar 5.0.0 se pehle tak — same major, minor aur patch float karte hain",
      "Sirf 4.18.x — patch updates only",
      "Exactly 4.18.2, kuch bhi float nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "`^` (caret) major ko lock karta hai: `^4.18.2` matlab range 4.18.2 se 5.0.0 (exclusive). Naya minor (4.19.0) aur patch (4.18.5) auto-accept hote hain, par 5.0.0 (breaking major) nahi. Option C tilde (`~`) ka behaviour hai. Option D exact pin hai (koi operator nahi). Option A galat kyunki 5.x kabhi allowed nahi hota.",
    difficulty: "easy",
  },
  {
    id: "npm-and-package-json-2",
    question: "CI/CD pipeline mein `npm install` ki jagah `npm ci` kyun use karte hain?",
    options: [
      "`npm ci` faster hai kyunki wo download cache use karta hai",
      "Dono same hain, sirf naam ka farak hai",
      "`npm ci` `node_modules` wipe karke sirf package-lock.json se exact tree install karta hai — fully reproducible, aur lockfile mismatch pe fail",
      "`npm ci` package.json ko bhi auto-update karke commit kar deta hai",
    ],
    correctIndex: 2,
    explanation:
      "`npm ci` lockfile ko source of truth maanta hai: `node_modules` delete, phir exact versions install, aur agar package.json lockfile se mismatch kare to build fail. Isse har CI run identical tree deta hai. `npm install` ranges dobara resolve kar sakta hai aur lockfile ko update kar sakta hai — CI mein wo non-deterministic builds deta hai. Option D galat: `npm ci` kabhi likhta nahi, sirf padhta hai.",
    difficulty: "medium",
  },
  {
    id: "npm-and-package-json-3",
    question: "`dependencies` aur `devDependencies` mein asli farak kya hai?",
    options: [
      "`devDependencies` production mein bhi install hoti hain, bas alag folder mein",
      "`dependencies` = app ko runtime pe chahiye; `devDependencies` = sirf build/test/lint tooling, aur `npm ci --omit=dev` inhe skip kar deta hai",
      "Farak sirf ordering ka hai, dono ek jaisa treat hoti hain",
      "`devDependencies` sirf globally install hone wale packages hote hain",
    ],
    correctIndex: 1,
    explanation:
      "`dependencies` wo packages hain jinhe shipped code `require`/`import` karta hai (express, pg). `devDependencies` sirf development tools hain (jest, eslint, typescript, webpack). Production install (`npm ci --omit=dev` ya `NODE_ENV=production`) devDependencies chhod deta hai — chhota, faster deploy. Isliye ek build-only tool ko `dependencies` mein daalna common mistake hai.",
    difficulty: "medium",
  },
  {
    id: "npm-and-package-json-4",
    question: "`npx create-react-app my-app` command kya karti hai?",
    options: [
      "create-react-app ko globally install karke permanently rakhti hai",
      "Pehle local `node_modules/.bin` mein binary dhoondti hai; nahi mili to registry se temporary download karke ek baar run karti hai (koi global install nahi)",
      "package.json ke `scripts.npx` block ko run karti hai",
      "Sirf tab kaam karti hai jab create-react-app pehle se globally installed ho",
    ],
    correctIndex: 1,
    explanation:
      "`npx` pehle project ke local `node_modules/.bin` mein binary locate karta hai; nahi mila to package ko temporary cache mein download karke run karta hai. Global install nahi hota, isliye version stale nahi hoti — one-off scaffolding tools ke liye perfect. Option C galat: aisa koi `scripts.npx` block nahi hota.",
    difficulty: "easy",
  },
];

export default quiz;
