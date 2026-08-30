import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "npm-and-the-registry-1",
    question:
      "\"npm\" naam do alag cheezon ke liye use hota hai. Wo kya hain?",
    options: [
      "npm version 1 aur npm version 2",
      "Ek command-line tool jo Node ke saath aata hai, aur public registry (registry.npmjs.org) jise wo CLI download ke liye contact karti hai",
      "Node ka module system aur uska event loop",
      "npm install aur npm publish — do commands",
    ],
    correctIndex: 1,
    explanation:
      "npm ek CLI hai (jo Node ke saath bundled hai) aur ek registry hai (registry.npmjs.org, jahan packages published hote hain). Dono ko 'npm' bolne se confusion hoti hai. Option A/D npm ke sub-parts hain, poori definition nahi. Option C ES/CommonJS modules aur event loop ka hai, npm ka nahi.",
    difficulty: "easy",
  },
  {
    id: "npm-and-the-registry-2",
    question:
      "`npm install express` chalane par integrity hash (SHA-512) verify karne ka kya maqsad hai?",
    options: [
      "Install ko tez karna",
      "Ye ensure karna ki download kiya gaya tarball wahi bit-for-bit content hai jo expected tha — tampered ya corrupt tarball reject ho jaye",
      "express ka latest version dhoondhna",
      "package.json ko format karna",
    ],
    correctIndex: 1,
    explanation:
      "Integrity hash tarball ke content ka cryptographic checksum hai. npm download ke baad hash recompute karke lockfile/registry ke stored hash se compare karta hai — mismatch matlab tarball corrupt ya tampered hai, install fail. Ye supply-chain security aur reproducibility dono ke liye hai. Option A/C/D hash ke kaam nahi.",
    difficulty: "medium",
  },
  {
    id: "npm-and-the-registry-3",
    question:
      "Team ka ek member `typescript` ko `npm install -g` se global install karta hai aur project ke package.json mein nahi likhta. Sabse pehle kya galat hoga?",
    options: [
      "Uske laptop pe tsc chalega hi nahi",
      "CI server aur naye developers ke paas typescript nahi hoga kyunki global install package.json/lockfile mein record nahi hota — build unko break ya galat version pe chalega",
      "npm registry se typescript hat jayega",
      "package-lock.json corrupt ho jayega",
    ],
    correctIndex: 1,
    explanation:
      "Global install sirf us ek machine par hota hai aur project ke package.json/lockfile mein koi entry nahi banti. Isliye clone karne wale ya CI ke paas wo dependency nahi hoti — 'works on my machine' bug. Build tools jaise typescript devDependencies mein local hone chahiye. Option A ulta hai (uske laptop pe to chalega). Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "npm-and-the-registry-4",
    question:
      "`npm ci` `npm install` se kaise alag hai, aur kab konsa use karna chahiye?",
    options: [
      "Dono bilkul same hain, ci sirf chhota naam hai",
      "npm install package.json ki ranges resolve karta hai aur lockfile update kar sakta hai (development ke liye); npm ci lockfile ko exactly follow karta hai, pehle node_modules delete karta hai, aur mismatch pe fail hota hai (CI/reproducible builds ke liye)",
      "npm ci sirf devDependencies install karta hai",
      "npm install offline chalta hai, npm ci ko internet chahiye hamesha",
    ],
    correctIndex: 1,
    explanation:
      "npm install ka kaam package.json ki ranges ke against resolve karna hai — agar naya matching version mila toh lockfile change ho sakti hai. npm ci deterministic hai: package.json aur lock match na karein toh fail, node_modules clean-slate se banata hai, seedha lock follow karta hai. Isliye CI/CD mein npm ci. Option C galat (ci sab install karta hai, --omit=dev se dev skip). Option D galat (dono cache se offline chal sakte hain).",
    difficulty: "medium",
  },
];

export default quiz;
