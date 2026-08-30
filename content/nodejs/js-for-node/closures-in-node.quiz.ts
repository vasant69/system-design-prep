import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "closures-in-node-1",
    question: "Closure ka sabse precise matlab kya hai?",
    options: [
      "Koi bhi function jo doosre function ke andar likha ho",
      "Ek function jo apne define hone wale scope ke variables ko yaad rakhta hai aur outer function return hone ke baad bhi unhe read/write kar sakta hai",
      "Ek function jo turant execute ho jata hai (IIFE)",
      "Ek function jise `new` ke saath call karna zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "Closure = function + jis lexical scope mein wo bana, us scope ke variables — aur wo binding outer function ke return hone ke baad bhi live rehti hai. Option A adhoora hai: nesting closure ka zaroori part hai lekin asli baat outer function khatam hone ke baad bhi variables ka zinda rehna hai. Option C IIFE hai, alag cheez. Option D constructor functions describe kar raha hai.",
    difficulty: "easy",
  },
  {
    id: "closures-in-node-2",
    question:
      "`for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` kya print karega aur kyun?",
    options: [
      "0 1 2 — har iteration ka apna i hota hai",
      "3 3 3 — teeno arrow functions ek hi function-scoped `i` ko share karte hain, jo loop khatam hone par 3 hai",
      "0 1 2 3 — loop 4 baar chalta hai",
      "Kuch print nahi hoga — setTimeout callbacks cancel ho jate hain",
    ],
    correctIndex: 1,
    explanation:
      "`var` function-scoped hai, toh ek hi `i` sabhi callbacks capture karte hain. Callbacks event loop ke baad ke tick mein chalte hain jab tak loop khatam ho chuka aur `i === 3`. Isliye `3 3 3`. `let i` use karte toh har iteration ka naya binding milta aur `0 1 2` print hota. Option C off-by-one galat; option D galat, callbacks chalte hain.",
    difficulty: "medium",
  },
  {
    id: "closures-in-node-3",
    question:
      "`createAccount` factory jo `let balance` closure mein rakhta hai — `acc.balance` bahar se kya deta hai, aur ye kis liye useful hai?",
    options: [
      "`balance` ki current value; debugging ke liye useful",
      "`undefined`, kyunki `balance` returned object ki property nahi balki closure variable hai — isse encapsulation (private state) milta hai",
      "Ek getter function jo call karna padta hai",
      "Error throw karta hai kyunki private field access ho raha hai",
    ],
    correctIndex: 1,
    explanation:
      "`balance` `createAccount` ke andar ek local variable hai jise sirf returned methods (deposit/withdraw/getBalance) closure ke through touch kar sakte hain. Bahar se `acc.balance` matlab ek non-existent property — `undefined`. Yahi encapsulation ka fayda hai. Option D `#private` fields ka behaviour hai, plain closure ka nahi — closure silently `undefined` deta hai.",
    difficulty: "medium",
  },
  {
    id: "closures-in-node-4",
    question:
      "Kaunsa scenario closure-based state ke bajaye `class` with `#private` fields (ya explicit params) prefer karne ki wajah hai?",
    options: [
      "Ek `requireRole('admin')` middleware factory jo sirf ek string capture karta hai",
      "Ek permanent `emitter.on('data', ...)` listener jo ek 10 MB buffer capture kar leta hai jabki usko sirf ek chhoti field chahiye",
      "Ek memoize wrapper jo results ek Map mein cache karta hai",
      "Ek counter jo har call pe increment hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Long-lived listener jo bada object capture karta hai = memory leak: wo 10 MB tab tak zinda jab tak listener hataya na jaye. Behtar: sirf chhoti field capture karo, ya state ko explicit param/field bana do. Option A/C/D closure ke natural, safe use cases hain — chhoti state, short ya bounded lifetime.",
    difficulty: "medium",
  },
];

export default quiz;
