import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "loops-1",
    question: "`const arr = [10, 20]; arr.tag = 'x'; for (const k in arr) console.log(k);` — kya print hota hai?",
    options: [
      "10, 20",
      "0, 1",
      "'0', '1', 'tag' — for...in enumerable keys deta hai (string), custom property bhi",
      "Sirf 'tag'",
    ],
    correctIndex: 2,
    explanation:
      "`for...in` object ke enumerable **keys** deta hai, values nahi — arrays pe wo string indices `'0'`, `'1'` hoti hain, aur `arr.tag` bhi ek enumerable own property hai to `'tag'` bhi aata hai. Isi wajah se `for...in` arrays ke liye galat hai. Values chahiye to `for...of` (`10, 20`); saaf indices chahiye to classic `for` ya `arr.entries()`. Option A galat — for...in values nahi deta.",
    difficulty: "medium",
  },
  {
    id: "loops-2",
    question: "`[1,2,3].forEach(async n => { await save(n); }); console.log('done');` — 'done' kab print hota hai?",
    options: [
      "Jab teeno save() complete ho jaate hain, in order",
      "Turant — forEach async callback ka promise ignore karta hai, wait nahi karta",
      "Jab pehla save() complete hota hai",
      "Kabhi nahi — forEach async ke saath crash karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`forEach` apne callback ka return value (yahan ek Promise) ignore kar deta hai — na wait karta hai, na sequencing. Teeno `save()` calls fire ho jaati hain aur `console.log('done')` turant chal jaata hai, saves pending rehte hue. Sequential chahiye: `for (const n of [1,2,3]) { await save(n); }`. Parallel + wait: `await Promise.all([1,2,3].map(save))`. Option D galat — crash nahi hota, bas wait nahi hota.",
    difficulty: "medium",
  },
  {
    id: "loops-3",
    question: "`users.map(u => sendWelcomeEmail(u));` — is line mein kya problem hai?",
    options: [
      "Kuch nahi, ye bilkul sahi hai",
      "`.map()` ek naya array banata hai jo use hi nahi hota — side-effects ke liye `for...of` ya `forEach` chahiye; linters bhi warn karte hain",
      "map async functions ke saath kaam nahi karta",
      "sendWelcomeEmail ko return karna hoga",
    ],
    correctIndex: 1,
    explanation:
      "`.map()` ka poora maqsad har element ko transform karke ek naya array return karna hai. Yahan wo array (undefined ya promise se bhara) turant phenk diya jaata hai — intent misleading hai aur ESLint `array-callback-return` isko flag karta hai. Side-effect ('har user ko email bhejo') ke liye `for (const u of users) sendWelcomeEmail(u)` ya `users.forEach(...)`. Option D galat — return add karne se anti-pattern theek nahi hota, tool hi galat hai.",
    difficulty: "easy",
  },
  {
    id: "loops-4",
    question: "Kaunsi situation mein `.map()` sahi choice hai (loop ke bajaye)?",
    options: [
      "Har item ko database mein save karna hai, koi return value nahi chahiye",
      "Pehla item jo condition match kare wahan ruk jaana hai",
      "`[{id:1},{id:2}]` se `[<Row key={1}/>, <Row key={2}/>]` banana hai React rendering ke liye",
      "Har item pe ek-ek karke `await apiCall(item)` karna hai",
    ],
    correctIndex: 2,
    explanation:
      "`.map()` tab sahi jab tum har element se ek naya element bana rahe ho AUR wo naya array use hoga — jaise React list rendering. Option A side-effect hai (naya array nahi chahiye) -> `for...of`/`forEach`. Option B early-exit chahiye -> `for...of` + `break` ya `.find()`. Option D sequential await chahiye -> `for...of` + `await` (`.map()` sync hai).",
    difficulty: "easy",
  },
];

export default quiz;
