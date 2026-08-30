import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "array-iteration-methods-1",
    question: "`const r = [1, 2, 3].forEach((n) => n * 2);` — `r` ki value kya hai?",
    options: [
      "[2, 4, 6]",
      "undefined",
      "[1, 2, 3]",
      "6",
    ],
    correctIndex: 1,
    explanation:
      "`forEach` hamesha `undefined` return karta hai — wo side effects ke liye hai, transformation ke liye nahi. Callback ka `n * 2` return value discard ho jata hai. Doubled array chahiye to `map` use karo: `[1, 2, 3].map((n) => n * 2)` -> `[2, 4, 6]`.",
    difficulty: "easy",
  },
  {
    id: "array-iteration-methods-2",
    question:
      "Ek `users` array mein `id === 5` wala ek hi user hai. `users.filter((u) => u.id === 5)` aur `users.find((u) => u.id === 5)` mein practical farak?",
    options: [
      "Koi farak nahi — dono wahi user object dete hain",
      "filter -> array `[user]` (poora scan); find -> user object seedha (pehla match milte hi ruk jata hai)",
      "find -> array; filter -> object",
      "filter tez hai kyunki wo bhi jaldi ruk jata hai",
    ],
    correctIndex: 1,
    explanation:
      "`filter` hamesha ek array return karta hai (yahan `[user]`) aur poora array scan karta hai kyunki wo aur matches dhoondta rehta hai. `find` pehla match milte hi ruk jata hai aur seedha element (ya `undefined`) deta hai. Single/unique lookup ke liye `find` — `filter(...)[0]` extra scan + throwaway array hai.",
    difficulty: "medium",
  },
  {
    id: "array-iteration-methods-3",
    question:
      "Async loop: `items.forEach(async (i) => { await save(i); }); console.log('done');` — behaviour?",
    options: [
      "Saare save sequential complete hote hain, phir 'done' print hota hai",
      "'done' turant print hota hai; saare save() ek saath fire hote hain, forEach unhe await nahi karta",
      "SyntaxError — forEach mein async allowed nahi",
      "Sirf pehla item save hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`forEach` apne callback se return hui promise ko ignore karta hai — wo har callback synchronously fire karke turant aage badh jata hai, isliye `console.log('done')` saare `save()` complete hone se pehle chal jata hai, aur saare `save()` ek saath (parallel) fire hote hain. Sequential await chahiye to `for (const i of items) { await save(i); }`. Parallel chahiye par completion ka wait chahiye to `await Promise.all(items.map(save))`.",
    difficulty: "hard",
  },
  {
    id: "array-iteration-methods-4",
    question: "`[].every((x) => x > 10)` aur `[].some((x) => x > 10)` kya dete hain?",
    options: [
      "every -> false, some -> true",
      "every -> true, some -> false",
      "Dono false",
      "Dono undefined",
    ],
    correctIndex: 1,
    explanation:
      "Khali array pe `every` `true` deta hai (vacuous truth — 'koi element condition fail nahi karta' technically sach hai) aur `some` `false` deta hai ('koi element pass nahi karta'). Isliye 'non-empty aur sab pass' chahiye to `arr.length > 0 && arr.every(fn)` likhna padta hai.",
    difficulty: "medium",
  },
];

export default quiz;
