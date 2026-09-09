import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-await-1",
    question: "`async function f() { return 5; }` — `f()` kya return karta hai?",
    options: [
      "`5` (plain number)",
      "Ek promise jo `5` value se fulfil hota hai",
      "`undefined`",
      "Ek promise jo hamesha `pending` reh jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`async` function ka return hamesha ek promise mein wrap hota hai. `return 5` matlab wo promise `5` se fulfil hota hai; caller ko `f().then((v) => ...)` ya `await f()` karna padega value nikalne ke liye. Agar `async` function throw kare to wo promise reject hota hai.",
    difficulty: "easy",
  },
  {
    id: "async-await-2",
    question:
      "`const a = await slowA(); const b = await slowB();` jahan `slowA` aur `slowB` independent hain aur 1-1 second lete hain — total time, aur behtar kya?",
    options: [
      "Lagbhag 1s; already optimal",
      "Lagbhag 2s; behtar: `const [a, b] = await Promise.all([slowA(), slowB()])` -> lagbhag 1s",
      "Lagbhag 2s; koi behtar option nahi",
      "Lagbhag 0s; dono parallel chalte hain by default",
    ],
    correctIndex: 1,
    explanation:
      "Har `await` apni line pe function ko pause karta hai — `slowB()` shuru hi tab hota hai jab `slowA` settle ho chuka, isliye lagbhag 2s (serial). Kyunki wo independent hain, dono ko pehle fire karke phir `Promise.all` se dono ka result lo — total lagbhag 1s (max of the two). `await` thread ko block nahi karta, par aane wali lines ko zaroor rokta hai.",
    difficulty: "medium",
  },
  {
    id: "async-await-3",
    question:
      "Ek `async` function mein `await fetch(...)` reject ho jaata hai aur uske around `try/catch` nahi hai. Kya hota hai?",
    options: [
      "Function normally aage chalta hai, error ignore",
      "`async` function ka returned promise reject ho jaata hai; agar caller ne `.catch` ya `try` nahi lagaya to `unhandledRejection`",
      "Poora program crash, koi recovery nahi",
      "`await` `undefined` return karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`await` par rejected promise us async function ke andar ek exception ban ke throw hota hai. Local `try/catch` nahi hai to wo function se propagate karta hai — matlab function ka apna returned promise reject ho jaata hai. Caller uska `try/catch` (with await) ya `.catch()` se pakde; nahi to runtime `unhandledRejection` warning ya crash deta hai.",
    difficulty: "medium",
  },
  {
    id: "async-await-4",
    question: "`await` ke baare mein sabse sahi statement?",
    options: [
      "`await` poore main thread ko rok deta hai jab tak promise settle na ho",
      "`await` sirf usi `async` function ko us point pe pause karta hai; thread free rehta hai aur baaki code/events chal sakte hain",
      "`await` ek naya thread banata hai",
      "`await` sirf `setTimeout` ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`await` current `async` function ko suspend karta hai aur control caller ko wapas de deta hai — event loop dusre tasks, timers, event handlers process karta rehta hai. Promise settle hone pe function wahin se resume hota hai (ek microtask ki tarah). Thread kabhi block nahi hota; isi wajah se `await` I/O-heavy code mein bhi UI responsive rehti hai.",
    difficulty: "easy",
  },
];

export default quiz;
