import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "eh-1",
    question: "try/catch async code ke saath kaise behave karta hai? Kaunse errors ye pakadta hai aur kaunse nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "try/catch sync throw aur `await` ki hui rejection pakadta hai. Ye NAHI pakadta: bina await ka bare promise jo reject hota hai, aur setTimeout / event listener callback ke andar thrown error — kyunki wo baad ke tick pe chalta hai jab try block khatam ho chuka hota hai.",
    detailedAnswer:
      "try/catch synchronous mechanism hai — jab block ke andar kuch throw hota hai, control catch pe jaata hai. `await` is bridge ko async tak le jaata hai: `await somePromise` agar reject ho to wo rejection ek thrown error ki tarah catch pe pahunchti hai. Lekin agar tum `somePromise` ko bina await call karo, function turant aage badh jaata hai aur baad mein hone wali rejection try/catch ke bahar 'unhandled rejection' ban jaati hai. Isi tarah:\n\n```javascript\ntry {\n  setTimeout(() => { throw new Error('boom'); }, 0);\n} catch (e) {\n  // yahaan kabhi nahi aayega\n}\n```\n\ncallback ek naye tick pe chalta hai jab surrounding try khatam ho chuka. Aise cases mein error ko usi callback ke andar handle karo, ya promise-based API use karke `await` karo.",
    followUp: "Multiple await calls ek hi try block mein hain — konsa fail hua ye kaise pata karoge?",
    redFlag: "'try/catch har error pakad leta hai' — bina await/timeout nuance ke.",
  },
  {
    id: "eh-2",
    question: "Custom error class kaise aur kyun banate ho? Ek example do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Error ko extend karo, constructor mein super(message) call karo aur this.name set karo. Fayda: instanceof se typed catch, aur error type ko HTTP status ya recovery logic pe map karna.",
    detailedAnswer:
      "```javascript\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n```\n\n`super(message)` base Error ko message deta hai, jisse `.message` aur `.stack` set ho jaate hain. `this.name` explicitly set karna zaroori hai warna wo 'Error' rehta hai aur logs confuse karte hain. Extra properties (`field`, `statusCode`) daal sakte ho. Use:\n\n```javascript\ncatch (err) {\n  if (err instanceof ValidationError) return res.status(400).json({ field: err.field });\n  if (err instanceof NotFoundError) return res.status(404).end();\n  throw err; // unknown -> bubble up -> 500\n}\n```\n\nIsse ek central error handler error ke type se response decide kar sakta hai, aur har jagah string matching (`err.message.includes(...)`) jaisa fragile code nahi likhna padta.",
    followUp: "extends Error ke saath transpiled ES5 mein instanceof kabhi-kabhi fail kyun hota tha?",
  },
  {
    id: "eh-3",
    question: "finally block kab chalta hai? Agar try ya catch ke andar return ho to?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "finally hamesha chalta hai — normal completion pe, exception pe, aur try/catch ke andar return statement pe bhi. return ki value hold hoti hai, finally chalta hai, phir return complete hota hai. Cleanup (file close, spinner hide, lock release) ke liye.",
    detailedAnswer:
      "finally ka purpose guaranteed cleanup hai. Sequence:\n\n```javascript\nfunction f() {\n  try {\n    return 'from try';\n  } finally {\n    console.log('finally chala');\n  }\n}\nf(); // pehle 'finally chala' log, phir 'from try' return\n```\n\nEngine return expression evaluate karta hai, us value ko side mein rakhta hai, finally chalata hai, phir wo value return karta hai. Agar finally khud return kare ya throw kare to wo try/catch ke return ko override kar deta hai — isliye finally mein return/throw avoid karo. Agar catch nahi hai, sirf try+finally, to exception pe finally chalta hai aur phir exception aage propagate hoti hai.",
    followUp: "finally ke andar throw kar do to try ka original error ka kya hota hai?",
    redFlag: "'finally sirf error na aane pe chalta hai' — ye ulta hai.",
  },
  {
    id: "eh-4",
    question: "Ek error ko catch karke, usmein context add karke aage bhejna ho to kaise karoge? error.cause kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "catch karo, ek naya higher-level Error banao apne message ke saath, aur `{ cause: originalErr }` as second arg pass karo. Naya error readable message deta hai, aur err.cause mein original error (uska stack sameet) preserve rehta hai debugging ke liye.",
    detailedAnswer:
      "```javascript\ntry {\n  await db.saveOrder(order);\n} catch (err) {\n  throw new Error(`Failed to save order ${order.id}`, { cause: err });\n}\n```\n\nProblem jo ye solve karta hai: agar tum original DB error ko waise hi rethrow karo, upar wale layer ko pata nahi chalega ki ye kis operation ke dauran hua. Agar tum sirf naya error banao aur original discard karo, to root cause (connection timeout, constraint violation) kho jaata hai. `error.cause` (ES2022) dono deta hai — top-level message business context ke liye, `.cause` chain technical root cause ke liye. Modern Node aur browsers `console.log` mein cause chain ko automatically print karte hain.",
    followUp: "cause se pehle log wahi info kaise attach karte the? (hint: message string concatenation ya custom property)",
  },
  {
    id: "eh-5",
    question:
      "Global handlers — window.onerror, unhandledrejection, process.on('uncaughtException') — inka sahi use kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Ye last-resort safety nets hain, error handling strategy nahi. Sahi use: error ko monitoring service (Sentry) pe log karna, aur Node mein process ko gracefully shut down / restart karna. Yahaan se app ko 'continue as normal' karana khatarnaak hai kyunki state corrupt ho sakti hai.",
    detailedAnswer:
      "Jo error tumhare kisi bhi try/catch ya .catch() se nikal gaya wo yahaan pahunchta hai. Browser mein `window.addEventListener('error', ...)` aur `window.addEventListener('unhandledrejection', ...)` — inse error report bhejo aur shayad user ko ek generic toast dikhao. Node mein `process.on('uncaughtException', ...)` ke baad best practice hai: error log karo, in-flight requests ko finish hone ka thoda time do, phir `process.exit(1)` — aur ek process manager (PM2, Kubernetes) naya process start kar de. Ise 'error nigal ke chalte raho' ke liye use karna anti-pattern hai: exception ka matlab hai koi assumption toota, aur uske baad ka program state unreliable hai. Real handling hamesha specific call sites pe honi chahiye jahaan tum recover kar sakte ho.",
    followUp: "unhandledRejection ko Node future versions mein hard crash kyun banaya ja raha hai?",
    redFlag: "'main sab errors process.on(uncaughtException) mein handle karta hoon' — ye centralised swallowing hai.",
  },
];

export default questions;
