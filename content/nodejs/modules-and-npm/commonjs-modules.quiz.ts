import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "commonjs-modules-1",
    question:
      "Ek CommonJS module ke top-level pe `console.log(\"loaded\")` hai. Teen alag files use `require` karti hain. `\"loaded\"` kitni baar print hoga?",
    options: [
      "Teen baar — har require pe file dobara chalti hai",
      "Ek baar — module ka code sirf pehli require pe evaluate hota hai, phir cache se milta hai",
      "Zero baar — top-level code kabhi nahi chalta",
      "Do baar — pehli aur aakhri require pe",
    ],
    correctIndex: 1,
    explanation:
      "Node module ko pehli require pe wrapper function mein chala ke uska module.exports cache kar leta hai (key = absolute path). Har agla require sirf cache lookup hai, file dobara execute nahi hoti — isliye print sirf ek baar. Option A require ke caching model ko galat samajhta hai; C galat kyunki top-level code hi exports set karta hai; D ka koi mechanism nahi hai.",
    difficulty: "easy",
  },
  {
    id: "commonjs-modules-2",
    question:
      "Kaunsa statement `module.exports` ko theek se replace karta hai taaki require karne wale ko `{ add }` mile?",
    options: [
      "`exports = { add }`",
      "`exports.default = { add }`",
      "`module.exports = { add }`",
      "`require.exports = { add }`",
    ],
    correctIndex: 2,
    explanation:
      "`exports` sirf `module.exports` ka alias hai; `exports = { add }` alias ko naye object pe point kara deta hai lekin `module.exports` purana khali object hi rehta hai, toh require karne wale ko `{}` milta hai. `module.exports = { add }` seedha wo object set karta hai jo return hoga. `exports.default` sirf ek `default` property banata (ESM interop artifact), poora object replace nahi; `require.exports` aisa kuch hota hi nahi.",
    difficulty: "easy",
  },
  {
    id: "commonjs-modules-3",
    question:
      "`a.js` aur `b.js` ek doosre ko top pe `require` karte hain (circular). `a.js` chalna shuru hoti hai, `require(\"./b\")` par jaati hai, `b.js` `require(\"./a\")` karti hai. Us waqt `b.js` ko `a` se kya milta hai?",
    options: [
      "Ek error — Node circular require pe crash karta hai",
      "`a.js` ka poora, final `module.exports`",
      "`a.js` ka partial `module.exports` — sirf wo properties jo `require(\"./b\")` line se pehle set hui thi",
      "`undefined` — `a` abhi cache mein hai hi nahi",
    ],
    correctIndex: 2,
    explanation:
      "Node circular require pe crash nahi karta. Jab a.js apne execution ke beech b.js ko trigger karti hai, a.js ka module object cache mein already hai lekin abhi aadha bhara hua — b.js ko a.js ka wahi partial module.exports milta hai (require line ke baad wali properties abhi undefined). Isiliye circular deps mein top-level destructure khatarnaak hai. Option A/D require ke cache-registration timing ko galat samajhte hain.",
    difficulty: "medium",
  },
  {
    id: "commonjs-modules-4",
    question:
      "Naya greenfield HTTP service jise top-level await aur bundler tree-shaking chahiye — CommonJS ya ES Modules? Aur ek internal CLI jo runtime pe ek plugins folder se modules conditionally load karta hai?",
    options: [
      "Dono ke liye CommonJS — wo zyada mature hai",
      "Service ke liye ESM (top-level await, tree-shaking); CLI ke liye CommonJS thik hai kyunki uska synchronous dynamic `require` conditional loading ke liye seedha fit hai",
      "Dono ke liye ESM — CommonJS deprecated ho chuka hai",
      "Service ke liye CommonJS; CLI ke liye ESM",
    ],
    correctIndex: 1,
    explanation:
      "ESM ke unique fayde — top-level await, static analysis se tree-shaking, standard syntax — naye service ko fit karte hain. CLI ka use case dynamic/conditional loading hai; CJS ka `require` ek normal function hai jise `if` ke andar, variable path ke saath, kisi bhi jagah bula sakte ho, aur wo synchronous hai. ESM ka static `import` yeh seedhe nahi deta (dynamic `import()` Promise return karta hai). CommonJS deprecated nahi hai — bas naye code ke liye default nahi.",
    difficulty: "medium",
  },
];

export default quiz;
