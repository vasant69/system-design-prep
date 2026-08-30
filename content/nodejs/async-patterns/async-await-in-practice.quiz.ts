import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-await-in-practice-1",
    question:
      "Teen independent API calls (sab sirf userId pe depend) — `const a = await getA(userId); const b = await getB(userId); const c = await getC(userId);`. Har call ~100ms. Total time aur fix?",
    options: [
      "~100ms — await calls automatically parallel chalti hain",
      "~300ms — awaits sequential hain; fix: `const [a,b,c] = await Promise.all([getA(userId), getB(userId), getC(userId)])` jo ~100ms leta hai",
      "~300ms, aur ye optimal hai — parallel karna possible nahi",
      "Time unpredictable hai kyunki await random order mein resolve hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Har `await` agli line se pehle apna Promise settle hone deta hai, isliye time teenon ka sum (~300ms). Calls independent hain (koi ek doosre ka result use nahi karti), isliye `Promise.all` se ek saath launch karke time ~max (~100ms) ho jata hai. Option A galat — `await` by nature sequential hai. Option C galat — parallel bilkul possible hai yahan. Option D galat — resolution deterministic hai, timing pe based.",
    difficulty: "medium",
  },
  {
    id: "async-await-in-practice-2",
    question:
      "`ids.forEach(async (id) => { await save(id); }); console.log('done');` — 'done' kab print hoga?",
    options: [
      "Sab save() complete hone ke baad",
      "Turant — forEach async callback ke returned Promise ko discard kar deta hai, isliye loop wait nahi karta aur saare save() background mein float karte hain",
      "Pehle save() ke baad",
      "Kabhi nahi — forEach async ke saath infinite loop banata hai",
    ],
    correctIndex: 1,
    explanation:
      "`forEach` apne callback ka return value (yahan ek Promise) ignore karta hai — wo await nahi karta. Loop synchronously saare callbacks invoke karke turant khatam ho jata hai, 'done' abhi print hota hai, aur saare `save()` Promises unawaited float karte hain (reject hue toh unhandled rejection). Sequential ke liye `for...of` + `await`; parallel ke liye `await Promise.all(ids.map(save))`. Option A/C galat — koi waiting nahi. Option D galat — loop normally khatam hota hai.",
    difficulty: "medium",
  },
  {
    id: "async-await-in-practice-3",
    question:
      "5000 rows ka array `rows.map(r => processRow(r))` phir `await Promise.all(...)`. `processRow` ek DB write karta hai (pool size 10). Kya hoga?",
    options: [
      "Sab 5000 writes efficiently 10-10 ke batches mein chalenge",
      "5000 DB operations ek saath launch honge — pool turant exhaust, queued queries timeout, memory spike; fix: concurrency limit (p-limit ya chunking)",
      "Promise.all automatically pool size ke hisaab se throttle karta hai",
      "Sirf pehli 10 rows process hongi, baaki silently skip",
    ],
    correctIndex: 1,
    explanation:
      "`.map` synchronously saare 5000 `processRow` calls turant invoke kar deta hai — 5000 pending Promises, sab pool se connection maang rahe. Pool (10) exhaust, baaki queue mein, kai timeout kar jaate hain, aur 5000 in-flight operations ka memory overhead. `Promise.all` koi throttling nahi karta — wo bas sab ka wait karta hai. Fix: `p-limit`, ya rows ko chunks mein todke har chunk `Promise.all`. Option A/C galat — koi auto-batching nahi. Option D galat — sab launch hote hain, skip nahi.",
    difficulty: "hard",
  },
  {
    id: "async-await-in-practice-4",
    question:
      "Ek Express route handler mein 3 dependent awaits hain. Agar sabhi errors ka same treatment hai (log + 500 response), error handling kaise structure karoge?",
    options: [
      "Har await ke around apna alag try/catch",
      "Ek try/catch boundary poore block ke around — teenon awaits ka error usi catch mein aata hai, ek jagah log + res.status(500)",
      "Koi try/catch nahi, errors ko process.on('uncaughtException') pe chhod do",
      "Har await ke baad `if (result.error)` check",
    ],
    correctIndex: 1,
    explanation:
      "async/await ke saath ek `try` block ke andar ke saare `await` ki rejections usi `catch` mein aati hain (rejection exception ki tarah throw hoti hai). Jab treatment same hai, ek boundary catch sabse clean hai. Targeted try/catch sirf tab jab kisi ek step ki failure ka alag handling ho (jaise getUser fail = 404). Option A over-engineering aur callback-hell jaisa clutter. Option C galat — recoverable request errors ke liye global handler galat jagah hai. Option D galat — rejections `if` se check nahi hoti, wo throw hoti hain.",
    difficulty: "medium",
  },
];

export default quiz;
