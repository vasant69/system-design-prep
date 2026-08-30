import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "error-handling-in-javascript-1",
    question:
      "`throw new Error('bad')` ke bajaye `throw 'bad'` likhne se kya problem hoti hai?",
    options: [
      "Kuch nahi, dono bilkul same hain",
      "Thrown value pe `stack` aur `message` nahi hote aur `value instanceof Error` false hota hai, isliye loggers aur error middleware jo `err.stack` expect karte hain toot jate hain",
      "String throw karna syntax error hai",
      "String throw sirf browser mein kaam karta hai, Node mein nahi",
    ],
    correctIndex: 1,
    explanation:
      "`throw` kisi bhi value ko phenk sakta hai, lekin non-Error value pe `stack`/`message` properties nahi hoti aur `instanceof Error` false hota hai. Downstream code (logger, Express error middleware) `err.stack` / `err.message` access karta hai aur crash ya undefined logs deta hai. Isliye hamesha `Error` (ya subclass) throw karo. Option C/D galat — string throw valid hai, bas buri practice.",
    difficulty: "easy",
  },
  {
    id: "error-handling-in-javascript-2",
    question:
      "`try { fs.readFile('missing.txt', 'utf8', (err, data) => { use(data); }); } catch (e) { handle(e); }` — file missing hone par kya hoga?",
    options: [
      "`catch` block `handle(e)` ke saath chalega — file-not-found error pak jayegi",
      "`catch` nahi chalega; file-not-found error `err` argument mein aati hai jise ignore kiya gaya, aur `use(data)` `undefined` par crash karega",
      "`readFile` synchronously error throw karega",
      "Process turant exit code 1 ke saath mar jayega",
    ],
    correctIndex: 1,
    explanation:
      "Error-first callback ka error `try/catch` nahi pakadta — wo `err` (pehla argument) mein aata hai, kyunki callback baad ke event loop tick mein alag stack pe chalta hai. Yahan `err` check nahi hua, `use(data)` ko `undefined` mila. Sahi tarika: callback ki pehli line `if (err) return handle(err)`, ya `fs.promises.readFile` + `await` + `try/catch`.",
    difficulty: "medium",
  },
  {
    id: "error-handling-in-javascript-3",
    question:
      "Custom error class (`class PaymentError extends Error`) banane ka sabse bada practical fayda kya hai?",
    options: [
      "Error tez throw hota hai",
      "Caller `err instanceof PaymentError` se apni known errors ko anjaan errors se alag kar sakta hai aur `err.code` / `err.retryable` jaise structured fields par branch kar sakta hai — `err.message` string parse kiye bina",
      "Stack trace automatically double lamba ho jata hai",
      "`try/catch` async callbacks pe kaam karne lagta hai",
    ],
    correctIndex: 1,
    explanation:
      "Custom error class typed handling deti hai: `instanceof` se known vs unknown, aur `code`/`retryable` jaise fields se machine-readable branching (retry karun? kaunsa HTTP status?). `err.message` par branch karna brittle hai kyunki wording badal sakti hai. Option D bilkul galat — error class teen-duniya wali baat nahi badalti.",
    difficulty: "medium",
  },
  {
    id: "error-handling-in-javascript-4",
    question:
      "`process.on('uncaughtException', ...)` handler mein sabse sahi kaam kya hai?",
    options: [
      "Error log karke normal chalte rehna, taaki server down na ho",
      "Fatal-log karna, in-flight kaam ko thoda drain hone dena, phir `process.exit(1)` — process manager ko saaf state ke saath restart karne dena",
      "Error ko ignore karna kyunki Node khud recover kar leta hai",
      "Us error ko dobara `throw` karna",
    ],
    correctIndex: 1,
    explanation:
      "`uncaughtException` ke baad process ki state corrupt maani jati hai — half-open connections, adhoore transactions. Uspe chalte rehna agli requests ko corrupt state par chala deta hai (silent-wrong data). Sahi: log + graceful drain + `process.exit(1)`, phir PM2/Kubernetes restart kare — 'let it crash' / fail-fast. Option A/C exactly wo galti hai jise interviewer sunna nahi chahta.",
    difficulty: "medium",
  },
];

export default quiz;
