import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "promises-1",
    question:
      "Ek Promise `pending` se `fulfilled` ho gaya. Ab agar uska `resolve` dobara call ho aur phir `reject` bhi — kya hota hai?",
    options: [
      "State `rejected` ho jaayegi (last call jeetti hai)",
      "Kuch nahi — promise ek baar settle hone ke baad immutable hai, aage ke `resolve`/`reject` ignore",
      "Error throw hota hai",
      "Promise `pending` pe wapas chala jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Promise sirf ek baar settle hota hai. Pehla `resolve(...)` ne use `fulfilled` kar diya; uske baad `resolve` ya `reject` ke calls silently ignore ho jaate hain — na state badalti hai, na error. Isi 'settle once' guarantee ki wajah se `.then` handlers reliably ek hi baar apni value ke saath chalte hain.",
    difficulty: "easy",
  },
  {
    id: "promises-2",
    question:
      "`p.then(() => { doAsync(); }).then(() => console.log('done'))` — `doAsync()` ek promise return karta hai par yahan `return` nahi kiya. `'done'` kab print hoga?",
    options: [
      "`doAsync` ke settle hone ke baad",
      "`doAsync` ke settle hone ka wait kiye bina, turant agle microtask mein — kyunki inner promise return nahi hua",
      "Kabhi nahi",
      "Sirf tab jab `doAsync` ke andar error aaye",
    ],
    correctIndex: 1,
    explanation:
      "`.then` callback ne kuch return nahi kiya (`undefined` return hua), isliye chain ko pata hi nahi ki ek aur async kaam pending hai — wo turant aage badh jaati hai aur `'done'` print ho jaata hai `doAsync` se pehle. Sahi: `return doAsync()` — tab chain uske settle hone tak rukegi. `doAsync` ke andar ka koi rejection bhi is case mein swallow ho sakta hai.",
    difficulty: "medium",
  },
  {
    id: "promises-3",
    question:
      "`fetchA().then(handleA).catch(handleErr).then(handleB)` — agar `fetchA()` reject hota hai, `handleB` chalega?",
    options: [
      "Nahi, `catch` ke baad chain mar jaati hai",
      "Haan — `catch` ne error handle kar liya aur (agar wo throw nahi karta) ek fulfilled promise return kiya, isliye `handleB` chal jaata hai",
      "`handleB` ko error object milega",
      "Poori chain reject ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "`.catch` bhi ek `.then` jaisa hi hai jo rejection handle karta hai. Agar `handleErr` normally return karta hai (throw nahi), to us point se chain 'recover' ho jaati hai aur ek fulfilled promise aage jaata hai — `handleB` chalta hai. Isi wajah se `.catch` ko chain ke end mein rakhna common hai; beech mein tabhi jab wahin recover karna ho.",
    difficulty: "medium",
  },
  {
    id: "promises-4",
    question: "`.finally(fn)` ke baare mein kya sach hai?",
    options: [
      "`fn` ko settlement value ya reason argument milta hai",
      "`fn` sirf fulfil pe chalta hai",
      "`fn` fulfil aur reject dono pe chalta hai, koi argument nahi milta, aur (throw na kare to) chain ki value pass-through ho jaati hai",
      "`fn` rejected chain ko fulfilled bana deta hai",
    ],
    correctIndex: 2,
    explanation:
      "`.finally` cleanup ke liye hai (spinner hide, connection close) — dono outcome pe chalta hai, koi value ya reason nahi milta, aur original fulfilment value ya rejection reason ko aage pass kar deta hai (jab tak `.finally` khud throw na kare ya rejected promise return na kare). Wo reject hui chain ko 'theek' nahi karta.",
    difficulty: "easy",
  },
];

export default quiz;
