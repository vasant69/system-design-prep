import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "errh-1",
    question:
      "JavaScript mein async errors report hone ke kitne tareeqe hain? Har ek ko kaise pakdoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teen: (1) synchronous `throw` — `try/catch` se; (2) rejected Promise (`async`/`await`, `.then`) — `await` ke around `try/catch` ya `.catch()` se; (3) error-first callback — `if (err) return handle(err)` se. `try/catch` sirf sync `throw` pakadta hai, error-first callback ka error nahi.",
    detailedAnswer:
      "Ek codebase mein teeno milte hain. Sync: `JSON.parse(bad)`, `null.x`, apna `throw` — engine call stack unwind karta hai jab tak `catch` na mile. Promise reject: `async function` ka `throw` ya awaited Promise ka reject — `await` ke saath language ka normal `try/catch` wapas kaam karta hai; `.then` chain mein `.catch()`. Error-first callback: `fs.readFile(path, (err, data) => {})` — error `err` argument mein aata hai kyunki callback baad ke tick mein alag stack pe chalta hai, isliye purana `try/catch` bekaar. Bug tab hota hai jab ek duniya ka tool doosri pe lagao — error-first ke around `try/catch`, ya `async` ko bina `await` call karna. Fix: naya code Promise-based rakho, legacy ko `util.promisify` se wrap karke ek hi model banao.",
    followUp: "`util.promisify` error-first callback ko Promise mein kaise badalta hai?",
    redFlag: "\"async callback ko `try/catch` mein wrap kar dunga\" — wo sirf callback ko register karne ki sync error pakadta hai, actual failure nahi.",
  },
  {
    id: "errh-2",
    question:
      "Custom error class kyun banate ho? Ek chhota example dikhao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Taaki caller `instanceof` se known errors ko unknown se alag kar sake aur structured fields (`code`, `retryable`, `status`) par branch kare — `err.message` string parse kiye bina. Domain errors ko boundary par user-safe HTTP responses mein map karna aasan ho jata hai.",
    detailedAnswer:
      "```javascript\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n    this.status = 400;\n    Error.captureStackTrace?.(this, ValidationError);\n  }\n}\n\n// caller / boundary\ntry {\n  await createUser(body);\n} catch (err) {\n  if (err instanceof ValidationError) {\n    return res.status(err.status).json({ field: err.field, error: err.message });\n  }\n  throw err; // unknown — central 500 handler ko\n}\n```\n\nKey points: `super(message)` se `message` + `stack` set hote hain; `this.name` set karna zaroori hai warna logs mein `'Error'` dikhega; `Error.captureStackTrace` (V8) constructor frame ko trace se hata deta hai. `code`/`status` jaise fields machine-readable branching dete hain. Jo error known nahi hai use rethrow karo — swallow mat karo.",
    followUp: "`Error` ke naye `cause` option ka kya use hai?",
  },
  {
    id: "errh-3",
    question:
      "`uncaughtException` ya `unhandledRejection` pe kya karna chahiye — aur kya nahi?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Karo: fatal-log, in-flight requests ko thoda drain hone do, phir `process.exit(1)` — process manager (PM2/Kubernetes) ko saaf state ke saath restart karne do. Mat karo: error log karke server ko chalte rehne dena — state corrupt ho chuki hoti hai.",
    detailedAnswer:
      "Ye events safety net hain, primary error handling nahi — inpe pahunchna matlab kahin `try/catch` / `.catch()` chhuta. `uncaughtException` ke baad process mein half-open sockets, adhoore DB transactions, inconsistent in-memory state ho sakti hai. Uspe agli request serve karna silently galat data de sakta hai — ek short restart se kahin mehnga. Isliye 'let it crash' (Erlang se) / fail-fast: log once, graceful shutdown timeout (jaise 10s) ke andar server close karo, phir `process.exit(1)`. `unhandledRejection` Node v15+ mein waise bhi by default crash karta hai; handler sirf clean structured logging ke liye lagao. Note: `process.exit()` pending writes/logs ko kaat deta hai — pehle log stream flush hone do.",
    followUp: "Graceful shutdown mein exactly kaunse steps hote hain?",
    redFlag: "\"`uncaughtException` pakad ke server ko zinda rakhta hoon taaki downtime na ho\" — corrupt-state process se galat responses downtime se bura hai.",
  },
  {
    id: "errh-4",
    question:
      "Errors kahan catch karne chahiye — har function mein, ya kuch specific jagah? Aur kab error ko swallow karna theek hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Catch karo jahan tum kuch kar sakte ho (retry, fallback, translate, rollback) ya boundary par (request handler, job worker, CLI entry) jahan user-safe response banana hai. Baaki jagah error ko upar jaane do. Swallow sirf genuinely optional kaam (analytics ping, cache warm) mein — wo bhi log ke saath.",
    detailedAnswer:
      "Har function ko `try/catch` mein wrap karke `console.log` karna aur aage badhna = errors chhupana; caller ko `undefined` milta hai jaise sab theek, aur crash asli wajah se door hota hai. Behtar model: (1) leaf-level pe catch tabhi jab actionable ho — `catch` mein retry ya fallback ya domain-error translation; (2) ek central boundary (Express error middleware, worker wrapper) jo har unhandled error ko log + generic safe response mein badle; (3) beech ke functions kuch na karein — error khud propagate ho. Swallow acceptable: `try { await sendMetric() } catch (e) { logger.warn(e) }` — kaam optional hai lekin phir bhi visible. `finally` ke andar ki cleanup error ko bhi log karo, primary error ko mask mat karo.",
    followUp: "Express 5 async route handlers mein error middleware tak error kaise pahunchta hai?",
  },
  {
    id: "errh-5",
    question:
      "Error handling ke liye `throw`/`try-catch` vs Result type (`{ ok, value, error }`) — trade-off kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`throw`/`try-catch`: language-native, stack traces free, JS ecosystem isi ko expect karta hai — lekin async ke teen styles aur 'kahan catch karun' complexity. Result type: errors return value ban jate hain, TypeScript mein compiler force karta hai handle karna, koi hidden control flow — lekin verbose aur har library boundary par `throw` se convert karna padta hai.",
    detailedAnswer:
      "Result/Either pattern (Rust/Go style): `function parseAmount(s): { ok: true, value: number } | { ok: false, error: string }`. Fayda: TypeScript ko pata hota hai ki caller ne `ok` check kiya ya nahi; koi surprise exception nahi; pure functions testable. Nuqsaan: har call site pe `if (!r.ok) return r;` — noise; async ke saath `Promise<Result<...>>` aur bhi bhaari; aur `fs`, `fetch`, DB drivers sab `throw`/`reject` karte hain, toh boundary par `try/catch` laga ke Result mein convert karna padta hai. Practical stance: domain/validation logic mein Result-style types acche kaam karte hain jahan 'failure expected hai'; I/O aur genuinely exceptional cases ke liye `throw` + central boundary handler rakho. Dono ko mix karna common hai.",
    followUp: "Node mein Result pattern ke liye koi standard library hai?",
  },
];

export default questions;
