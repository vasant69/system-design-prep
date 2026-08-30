import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-await-deep-1",
    question:
      "`async function f() { return 5; }` — `f()` call karne par kya milta hai?",
    options: [
      "Number `5`",
      "Ek Promise jo `5` se fulfill hota hai",
      "`undefined`, kyunki async functions kuch return nahi kar sakte",
      "Ek error, kyunki async function ke andar `await` nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "`async` function hamesha ek Promise return karta hai — andar `return v` matlab wo Promise `v` se fulfill hota hai, aur `throw e` matlab reject. Isliye `f()` ka result `5` nahi, `Promise<5>` hai — caller ko `await` ya `.then` karna padega. Option C galat — return allowed hai. Option D galat — `await` optional hai async function mein.",
    difficulty: "easy",
  },
  {
    id: "async-await-deep-2",
    question:
      "`await` ke bare mein kaunsa statement sahi hai?",
    options: [
      "`await` poore Node process ko block kar deta hai jab tak Promise settle na ho — doosre requests ruk jaate hain",
      "`await` sirf us async function ko suspend karta hai; event loop, timers, aur doosre requests chalte rehte hain, aur function resume hamesha ek microtask mein hota hai",
      "`await` synchronously value nikaal leta hai bina koi delay ke agar Promise pehle se resolved hai",
      "`await` sirf `.then()` ka alias hai aur behaviour bilkul identical hai",
    ],
    correctIndex: 1,
    explanation:
      "`await` thread block nahi karta — wo function ko state machine ki tarah suspend karta hai, function return kar deta hai (caller ko pending Promise), aur Promise settle hone par ek microtask function ko resume karta hai. Option A ek classic misconception hai. Option C galat — `await Promise.resolve(1)` bhi ek microtask hop leta hai, synchronously resume nahi hota. Option D adhoora — semantically related hai par `await` code ko top-to-bottom rakhta hai aur `try/catch` wapas kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "async-await-deep-3",
    question:
      "`for (const id of ids) { const row = await fetchRow(id); results.push(row); }` — 1000 ids, har fetch 20ms. Total time approx aur behtar approach?",
    options: [
      "~20ms — await parallel chalata hai",
      "~20 seconds — har iteration serialize ho jaati hai; agar order/rate-limit matter nahi karte to `await Promise.all(ids.map(fetchRow))` (ya bounded `p-limit`) use karo",
      "~2 seconds — Node automatically 10x batch karta hai",
      "Error — `await` `for...of` loop mein allowed nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "`for...of` + `await` har fetch ka poora intezaar karta hai agli shuru karne se pehle: 1000 × 20ms = ~20s. `Promise.all(ids.map(fetchRow))` sab ek saath launch karta hai — total ~max latency, milliseconds. Lekin 1000 parallel connections DB gira sakti hain, isliye bade N par `p-limit` se bound karo. Sequential `for...await` sirf tab sahi jab dependency ho ya rate-limit chahiye. Option D galat — `for...of` + `await` valid hai.",
    difficulty: "medium",
  },
  {
    id: "async-await-deep-4",
    question:
      "`try { return fetchThing(); } catch (e) { handle(e); }` ek async function ke andar — `fetchThing()` reject ho to kya hota hai?",
    options: [
      "Local `catch` use pakad lega kyunki wo `try` block ke andar hai",
      "Local `catch` MISS ho jayega — `fetchThing()` ka Promise `try` se bahar return ho gaya, rejection function ke bahar propagate karti hai; `return await fetchThing();` likhna chahiye taaki suspension `try` ke andar rahe",
      "Process turant crash ho jayega bina catch chance diye",
      "`fetchThing()` synchronously chalega isliye catch hamesha kaam karega",
    ],
    correctIndex: 1,
    explanation:
      "Bina `await` ke, `return fetchThing()` `try` block ko chhod deta hai bas ek pending Promise return karke — jab wo baad mein reject hota hai, local `catch` scope ja chuka hota hai. `return await fetchThing();` function ko `try` ke andar suspend rakhta hai, to reject hone par `catch` pakad leta hai. Option A/D galat isi wajah se. Option C galat — agar caller `.catch` kare ya upar koi handler ho to crash nahi.",
    difficulty: "hard",
  },
];

export default quiz;
