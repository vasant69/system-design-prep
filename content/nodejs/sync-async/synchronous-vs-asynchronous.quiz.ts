import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "synchronous-vs-asynchronous-1",
    question:
      "`fs.readFileSync` aur `fs.readFile` — 'synchronous vs asynchronous' ke context mein inka core farak kya hai?",
    options: [
      "`readFileSync` tez hai, `readFile` slow",
      "`readFileSync` result usi line pe return karta hai (ya throw); `readFile` turant return hota hai aur result baad mein callback ke through deta hai",
      "`readFile` sirf chhoti files ke liye kaam karta hai",
      "Dono same hain, naam alag hai",
    ],
    correctIndex: 1,
    explanation:
      "Sync vs async API ke 'shape' ka farak hai: sync result same line pe deta hai, async turant return hoke result baad mein (callback/Promise) deta hai. Speed ka farak nahi (dono ko wahi disk read karna hai) — farak ye hai ki beech ke time me thread free hai ya nahi. Option C/D galat.",
    difficulty: "easy",
  },
  {
    id: "synchronous-vs-asynchronous-2",
    question:
      "`async function getCount() { return 5; }` — `getCount()` call karne pe kya milta hai?",
    options: [
      "Number `5`",
      "Ek Promise jo `5` se resolve hota hai — `async` function hamesha Promise return karta hai",
      "`undefined`, kyunki `return` async function me kaam nahi karta",
      "Ek error, kyunki async function ko `await` ke bina call nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "`async` keyword function ke return ko hamesha Promise me wrap kar deta hai, chahe body me plain value return ho. `5` lene ke liye `await getCount()` ya `getCount().then(...)`. Option A galat (wrap ho jata hai), C galat (`return` Promise ko resolve karta hai), D galat (bina await call kar sakte ho, bas result Promise hoga).",
    difficulty: "easy",
  },
  {
    id: "synchronous-vs-asynchronous-3",
    question:
      "Ek async `getUser()` function ka result ek plain synchronous `return` value me 'cleanly' badalne ke liye Node mein sahi approach kya hai?",
    options: [
      "`deasync` library use karo jo event loop ko spin kare jab tak Promise settle na ho",
      "`while (!done) {}` busy loop laga ke callback ka wait karo",
      "Aisa cleanly possible nahi hai — apne function ko bhi `async` bana do aur Promise return karo; async chain ke upar bubble karta hai by design",
      "`JSON.parse` se Promise ko value me convert karo",
    ],
    correctIndex: 2,
    explanation:
      "Agar underlying operation async (I/O) hai toh uska result async hi milega. `deasync` native level pe event loop ko unsafely spin karta hai (reentrancy, deadlock, version-break risk). Busy loop toh guaranteed deadlock — event loop us loop me atka hai toh callback chalega hi nahi. Sahi jawaab: apne function ko async banao. `JSON.parse` ka isse koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "synchronous-vs-asynchronous-4",
    question:
      "Ek codebase mein `getPrice()` ko sync se async (DB call add hui) banaya gaya. Iska sabse seedha side effect kya hai?",
    options: [
      "Kuch nahi — callers bina change ke chalte rahenge",
      "`getPrice()` ka har direct caller jo uska result use karta hai use bhi async banana padega (await/then), aur ye chain unke callers tak upar bubble karti hai",
      "Poora program 2x slow ho jayega",
      "`getPrice()` ab parallel me multiple baar chalega automatically",
    ],
    correctIndex: 1,
    explanation:
      "Async 'viral' hota hai: jis function ka result async ho gaya, uske result-consumers ko bhi async hona padta hai, aur ye upar tak (route handler / main) bubble karta hai jab tak koi boundary Promise ko await/then se consume na kare. Ye by design hai, bug nahi. Option A galat (callers ab Promise pate hain), C/D galat.",
    difficulty: "medium",
  },
];

export default quiz;
