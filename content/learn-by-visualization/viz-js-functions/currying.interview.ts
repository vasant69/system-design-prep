import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cur-1",
    question: "Currying kya hai? sum(a, b, c) ko curried form mein likho.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Currying ek multi-arg function ko single-arg functions ki chain banati hai. const sum = a => b => c => a + b + c; phir sum(1)(2)(3) -> 6. Har call ek arg closure mein fix karke agla function return karta hai.",
    detailedAnswer:
      "Normal function sum(a, b, c) { return a + b + c; } teeno args ek saath maangta hai. Curried version har step pe ek arg leta hai aur ek naya function deta hai jab tak sab collect na ho jaayein — closures har layer ka arg yaad rakhte hain. Iska fayda partial reuse hai: const add10 = sum(10) ek function hai jo bache do args ka intezaar karta hai. FP libraries (Ramda, lodash/fp) ke functions data-last curried hote hain taaki pipe/compose clean rahe.",
    followUp: "Currying aur partial application mein farak?",
    redFlag: "\"Currying code fast karti hai\" — ulta thoda overhead add karti hai.",
  },
  {
    id: "cur-2",
    question:
      "Ek generic curry(fn) likho jo fn(1)(2)(3) aur fn(1, 2)(3) dono support kare.",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Recursive helper: agar ab tak jama args ki count fn.length se bade-barabar hai to fn(...args) chala do; warna ek function return karo jo aur args leke curried ko dobara call kare.",
    detailedAnswer:
      "function curry(fn) { return function curried(...args) { if (args.length >= fn.length) return fn.apply(this, args); return (...more) => curried.apply(this, [...args, ...more]); }; }. Key idea: fn.length se arity pata karo, args ko calls ke beech accumulate karo. curry((a,b,c)=>a+b+c) phir f(1)(2)(3), f(1,2)(3), f(1)(2,3) sab 6 dete hain. Caveat: rest/default params fn.length mein count nahi hote, to unpe ye tootega — tab explicit arity pass karo.",
    followUp: "Rest parameter wale function pe ye helper kyun fail karta hai?",
  },
  {
    id: "cur-3",
    question:
      "request.bind(null, 'POST') — ye currying hai ya partial application? Farak samjhao.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Ye partial application hai. Currying strictly ek-arg-per-call hoti hai; yahan ek call mein ek (ya zyada) leading arg fix karke baaki ke liye function laut raha hai — that is partial application. bind isi ke liye built-in tool hai.",
    detailedAnswer:
      "Currying: f(a)(b)(c) — har call exactly ek arg. Partial application: kuch args ab do, ek naya function lo jo baaki maange — per-call arg count fixed nahi. bind ke doosre argument se aage sab partial args ban jaate hain aur this bhi fix ho jaata hai. Practical code mein zyadatar 'currying' actually partial application hi hota hai; strict currying mostly FP libraries aur interview questions mein dikhta hai.",
    followUp: "bind se this bhi fix ho jaata hai — partial application ke liye ye kab problem banta hai?",
  },
  {
    id: "cur-4",
    question:
      "Currying ka ek accha real-world use case aur ek jagah jahan wo overkill hai — dono batao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Accha: config-first helpers — logger = createLogger(level), API client = makeRequest(baseURL), handler = handleRow.bind(null, row.id). Overkill: simple do-arg utility jahan koi arg reuse nahi hota — f(a)(b) sirf noise aur extra closures add karta hai.",
    detailedAnswer:
      "Use jab pehla/config argument baar-baar same ho aur baaki badalta ho: const dbLog = log('db'); dbLog('connected'); dbLog('query ok');. React list rendering: onClick={() => remove(item.id)} ya remove.bind(null, item.id) partial application hi hai. Anti-pattern: har utility ko blindly curry karna readability giraata hai, stack traces gehre hote hain, aur fn.length edge cases aate hain. Rule: curry tab jab genuine reuse dikhe.",
    followUp: "Point-free style zyada karne ke kya nuksaan hain?",
  },
];

export default questions;
