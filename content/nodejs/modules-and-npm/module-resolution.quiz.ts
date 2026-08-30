import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "module-resolution-1",
    question:
      "`require(\"lodash\")` — na core module hai, na `./` se shuru hota hai. Node ise kaise dhoondhta hai?",
    options: [
      "Sirf project root ke `node_modules` folder mein dekhta hai",
      "Current file ke folder ke `node_modules` se shuru karke folder tree mein upar chadhte hue har level ke `node_modules` mein dekhta hai, aur pehla match load karta hai",
      "Global npm install location mein dekhta hai",
      "`package.json` ke `dependencies` list se path padhta hai",
    ],
    correctIndex: 1,
    explanation:
      "Bare specifier ke liye Node current module ke directory se shuru karta hai aur `/` tak har parent folder ke `node_modules` ko check karta hai; jo pehla `lodash` milta hai wahi load hota hai. Isiliye ek hi package ke do versions alag nesting levels pe reh sakte hain. Option A galat — walk poore tree mein hota hai, sirf root mein nahi. Option C galat — global modules require resolution mein normally participate nahi karte. Option D galat — `dependencies` list resolution algorithm ka input nahi hai, wo bas npm ke liye hai.",
    difficulty: "easy",
  },
  {
    id: "module-resolution-2",
    question:
      "Ek package ki `package.json` mein `exports` field hai jo sirf `\".\"` aur `\"./client\"` expose karta hai. `import x from \"the-pkg/dist/internal.js\"` karne pe kya hoga?",
    options: [
      "Normal load ho jayega — `exports` sirf ek hint hai",
      "`ERR_PACKAGE_PATH_NOT_EXPORTED` — `exports` package ko seal kar deta hai, sirf listed subpaths accessible hain",
      "Node warning dega lekin file load kar dega",
      "`the-pkg/dist/internal.js` ko `\".\"` entry ki tarah treat karega",
    ],
    correctIndex: 1,
    explanation:
      "`exports` field ka existence hi package ki public surface ko seal kar deta hai — sirf explicitly listed subpaths (`\".\"`, `\"./client\"`) resolve hote hain, baaki sab `ERR_PACKAGE_PATH_NOT_EXPORTED` dete hain. Pehle (sirf `main` ke zamane mein) kisi bhi internal file ko deep-import kar sakte the; `exports` isko band karta hai taaki maintainer internal structure refactor kar sake. Option A/C galat — `exports` enforce hota hai, hint nahi. Option D galat — unlisted path kisi entry pe map nahi hota.",
    difficulty: "medium",
  },
  {
    id: "module-resolution-3",
    question:
      "Conditional `exports` mein ye likha hai: `{ \"default\": \"./index.js\", \"import\": \"./index.mjs\", \"require\": \"./index.cjs\" }`. ESM consumer `import` karega toh kaunsi file load hogi?",
    options: [
      "`./index.mjs` — `import` condition match karti hai",
      "`./index.js` — Node upar-se-neeche pehla match leta hai aur `\"default\"` hamesha match karta hai, toh `\"import\"`/`\"require\"` kabhi hit nahi hote",
      "`./index.cjs` — ESM hamesha CJS build use karta hai",
      "Error — `import` aur `require` dono present nahi ho sakte",
    ],
    correctIndex: 1,
    explanation:
      "Node conditions ko object mein likhe order mein, upar se neeche, evaluate karta hai aur pehli matching condition leta hai. `\"default\"` har situation mein match karti hai, toh use sabse pehle rakhne se baaki saari conditions dead ho jaati hain. Isiliye `\"default\"` hamesha last honi chahiye, specific conditions (`types`, `import`, `require`, `node`) uske pehle. Yahan galat order ki wajah se ESM consumer ko galti se `./index.js` milega, `./index.mjs` nahi.",
    difficulty: "hard",
  },
  {
    id: "module-resolution-4",
    question:
      "`package.json` ka `\"imports\"` field (jaise `\"#db\": \"./src/db.js\"`) kiske liye hai?",
    options: [
      "Consumers ke liye — wo `import x from \"the-pkg/#db\"` likh sakte hain",
      "Sirf us package ke apne code ke liye — package ke andar `import db from \"#db\"` likh sakte ho deep relative paths ki jagah; bahar wale consumers `#db` use nahi kar sakte",
      "npm ko batane ke liye ki kaunse packages install karne hain",
      "TypeScript type resolution ke liye, runtime pe koi effect nahi",
    ],
    correctIndex: 1,
    explanation:
      "`imports` field private internal specifiers define karta hai jo `#` se shuru hote hain aur sirf us package ke apne modules ke andar resolve hote hain — `../../../shared/db` jaise deep relative paths ko `#db` se replace karne ke liye, aur conditional internal wiring (dev vs prod) ke liye. Consumers ko ye leak nahi hote. Option A galat — `#` specifiers cross-package accessible nahi. Option C galat — npm dependency management se alag cheez hai. Option D galat — ye Node ka native runtime feature hai (v14.6+).",
    difficulty: "medium",
  },
];

export default quiz;
