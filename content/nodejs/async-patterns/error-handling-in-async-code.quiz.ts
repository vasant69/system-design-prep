import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "error-handling-in-async-code-1",
    question:
      "`async function load(id) { try { return getData(id); } catch (e) { return CACHE[id]; } }` — `getData` reject kare toh kya hoga?",
    options: [
      "catch chalega aur CACHE[id] return hoga",
      "catch MISS ho jayega — bina `await` ke `return getData(id)` ki rejection function ke try block ke bahar hoti hai (function pehle hi return kar chuka), isliye rejection caller tak propagate hoti hai; fix: `return await getData(id)`",
      "Function undefined return karega",
      "Syntax error — try ke andar return allowed nahi",
    ],
    correctIndex: 1,
    explanation:
      "`return getData(id)` bina `await` matlab function turant us pending Promise ko return karke exit kar jata hai — jab wo baad mein reject hoti hai, `load` ka `try/catch` context ja chuka hai, isliye local `catch` use nahi pakadta aur rejection caller ko milti hai. `return await getData(id)` likhne se rejection function ke andar throw hoti hai aur `catch` use pakadta hai. Option A tab sahi jab `await` hota. Option C/D galat.",
    difficulty: "hard",
  },
  {
    id: "error-handling-in-async-code-2",
    question:
      "8 microservices se data laane ke liye `Promise.all` use kar rahe the; jab bhi ek service down hoti, pura dashboard blank ho jata. Sabse seedha fix?",
    options: [
      "Har service call ke around apna try/catch aur phir bhi Promise.all",
      "`Promise.allSettled` use karo — wo kabhi reject nahi karta, har element ka `{status: 'fulfilled'|'rejected', value|reason}` deta hai, toh 7 up services render hoti hain aur down wali pe 'unavailable' dikha sakte ho",
      "Retry lagao har service pe infinite baar",
      "Promise.race use karo taaki sabse tez service ka data mile",
    ],
    correctIndex: 1,
    explanation:
      "`Promise.all` fail-fast hai — ek reject = pura reject, isliye ek down service sab kuch gira deti hai. `Promise.allSettled` har promise ko settle hone deta hai aur ek array deta hai jisme har entry ka status hota hai; caller fulfilled se value nikaalta hai aur rejected ko gracefully dikhata hai. Option A messy aur Promise.all abhi bhi fail-fast rahega agar tum catch mein rethrow karo. Option C infinite retry down service pe waste. Option D galat semantics — race sirf ek result deta hai, saare 8 nahi.",
    difficulty: "medium",
  },
  {
    id: "error-handling-in-async-code-3",
    question:
      "Retry-with-backoff implement kar rahe ho. Kaunsa design decision double-charge jaise bug se bachata hai?",
    options: [
      "Retry count 3 ke bajaye 10 karna",
      "Sirf transient errors (`ECONNRESET`, `5xx`, `429`) pe retry karna, non-idempotent operations ko retry se bahar rakhna (ya client `Idempotency-Key` bhejna), aur ambiguous timeouts pe blind retry na karna",
      "Har retry se pehle 5 second fixed wait",
      "Retry ko sirf GET requests tak seemita rakhna aur POST ko kabhi timeout hone hi na dena",
    ],
    correctIndex: 1,
    explanation:
      "Double-charge tab hota hai jab ek non-idempotent POST timeout hua (server ne process kar liya, response nahi aaya) aur client retry kar deta hai. Bachne ke liye: `isRetryable` guard (sirf transient), non-idempotent ops ke liye `Idempotency-Key` header taaki server duplicate detect kare, aur ambiguous failures pe retry karne se pehle sochna. Option A load badhata hai, bug nahi rokta. Option C jitter/backoff ka point miss karta hai aur thundering herd rok nahi paata. Option D — POST ko timeout se rokna possible hi nahi.",
    difficulty: "hard",
  },
  {
    id: "error-handling-in-async-code-4",
    question:
      "`process.on('unhandledRejection', ...)` ka sahi use kya hai?",
    options: [
      "Ye application ka main error handler hai — yahan sab errors handle karo aur process ko chalte raho",
      "Ye ek last-resort safety net hai jo batata hai ki kahin ek `await`/`.catch` chhoot gaya — best practice: structured log likho aur `process.exit(1)`, phir process manager clean state se restart kare",
      "Ise kabhi register nahi karna chahiye, wo memory leak karta hai",
      "Ye sirf development mein kaam karta hai, production mein ignore hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`unhandledRejection` ek Promise rejection ka signal hai jise kisi ne handle nahi kiya — matlab code mein bug (missing await/catch). Ise 'main handler' ki tarah use karke process ko continue karana khatarnak hai: process ab unknown/corrupt state mein ho sakta hai. Sahi: log + `exit(1)`, restart PM2/K8s pe chhod do. Node v15+ mein default behaviour waise bhi crash hai. Option C/D galat — handler valid aur production mein bhi fire hota hai.",
    difficulty: "medium",
  },
];

export default quiz;
