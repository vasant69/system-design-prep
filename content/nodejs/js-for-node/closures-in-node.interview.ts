import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "clo-1",
    question: "Closure kya hai? Ek chhota example do jismein private state ho.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Closure ek function hai jo apne define hone wale scope ke variables ko hold karta hai — outer function return hone ke baad bhi wo variables zinda aur mutable rehte hain. Isi se JavaScript mein private state banta hai.",
    detailedAnswer:
      "Jab inner function outer function ke variables use karta hai aur inner function bahar (return/pass) chala jata hai, toh wo variables garbage collect nahi hote — inner function ke saath 'bandhe' rehte hain.\n\n```javascript\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2\n```\n\n`count` bahar se access nahi hota — `next.count` `undefined` hai. Sirf returned function usko badal sakta hai. Yahi encapsulation hai: state hai lekin usko touch karne ka ek hi controlled rasta.",
    followUp: "Agar main makeCounter() do baar call karun, kya dono counters `count` share karenge?",
    redFlag: "\"Closure matlab bas nested function\" — nesting zaroori hai lekin asli baat outer function khatam hone ke baad bhi variables ka zinda rehna hai.",
  },
  {
    id: "clo-2",
    question:
      "Ye code kya print karega? `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` — aur `let` se kaise badlega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`var` ke saath: `3 3 3`, kyunki teeno callbacks ek hi function-scoped `i` share karte hain jo loop ke baad 3 hai. `let i` ke saath: `0 1 2`, kyunki har iteration ka apna `i` binding banta hai jo us callback ne capture kiya.",
    detailedAnswer:
      "`var i` poore function mein ek hi variable hai. `setTimeout` callbacks synchronous loop ke baad chalte hain, us waqt `i === 3`. Sab `3` print karte hain.\n\n```javascript\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0 1 2\n}\n```\n\n`let` block-scoped hai; spec ke hisaab se har loop iteration ek fresh binding banata hai aur pichhli value copy karta hai, toh har closure apna alag `i` dekhta hai. Purane code mein `var` ke saath ye IIFE se fix karte the: `(function (j) { setTimeout(() => console.log(j)); })(i)`.",
    followUp: "let per-iteration fresh binding kyun banata hai — spec mein iska naam kya hai?",
  },
  {
    id: "clo-3",
    question:
      "Express mein `app.use(requireRole('admin'))` — yahan closure kaise kaam kar raha hai, aur ye pattern kyun useful hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`requireRole` ek middleware function `(req, res, next) => {...}` return karta hai jisne `'admin'` string closure mein capture ki hui hai. Ek hi factory se kai configured middlewares ban jate hain — `requireRole('teller')`, `requireRole('auditor')` — bina role ko har request pe dobara diye.",
    detailedAnswer:
      "```javascript\nfunction requireRole(role) {\n  return function (req, res, next) {\n    if (req.user && req.user.role === role) return next();\n    return res.status(403).json({ error: 'forbidden' });\n  };\n}\n\napp.get('/admin', requireRole('admin'), handler);\napp.get('/ledger', requireRole('auditor'), handler);\n```\n\nInner function har request pe chalta hai aur `role` ko closure se padhta hai. Fayda: configuration ek baar (factory call time), execution baar-baar (per request), aur state minimal (ek string) — isliye class banana over-engineering hoga. Yahi pattern `express-rate-limit`, `multer`, `cors` sab use karte hain.",
    followUp: "Agar middleware ko per-IP request count track karna ho toh wo state kahan rahegi?",
  },
  {
    id: "clo-4",
    question: "Closure se memory leak kaise ho sakta hai? Ek real Node scenario batao.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Agar ek long-lived function (jaise permanent event listener) apne closure mein ek bada object capture karta hai, toh wo object kabhi garbage collect nahi hoga jab tak listener zinda hai — bhale hi usko sirf ek chhoti field chahiye thi.",
    detailedAnswer:
      "```javascript\nfunction attach(server) {\n  const bigBuffer = Buffer.alloc(10 * 1024 * 1024); // 10 MB\n  const id = bigBuffer.readUInt8(0);\n  server.on('request', () => {\n    console.log('req for build', id); // sirf id chahiye tha...\n  });\n  // ...lekin closure poora bigBuffer hold kar raha hai\n}\n```\n\nListener server ki poori zindagi zinda rehta hai, aur closure `bigBuffer` ko bhi. Fix: sirf `id` capture karo (buffer ko block scope se bahar mat le jao ya `bigBuffer = null` kar do uske baad), ya `server.off('request', handler)` se listener hata do jab zaroorat khatam ho. `--inspect` + heap snapshot se aise leaks dikhte hain — retained closure ka scope object.",
    followUp: "Heap snapshot mein aisa retained closure kaise pehchanoge?",
    redFlag: "\"Closures kabhi leak nahi karte, GC sab sambhal leta hai\" — GC tabhi free karta hai jab koi reference na bache; live listener wo reference rakhta hai.",
  },
  {
    id: "clo-5",
    question:
      "Private state ke liye closure vs `class` with `#private` fields vs module scope — kab kya choose karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Chhoti state + factory/configured-function pattern → closure. Bada state + methods + inheritance/instanceof chahiye → class with `#private`. Ek process-wide singleton cache → module scope. Max predictability chahiye → explicit params, koi hidden state nahi.",
    detailedAnswer:
      "Closure: `makeCounter`, `once(fn)`, `requireRole(role)` — thodi si state, short ya bounded lifetime, function-shaped API. Class `#private`: `class ConnectionPool { #idle = []; #inUse = new Set(); }` — `#` fields V8-enforced private hain, `instanceof` kaam karta hai, team ke liye padhna aasan hai jab methods kai ho. Module scope: file ke top `let cachedConfig = null` + `getConfig()` — `require` caching ke saath natural singleton, bahar se koi reset nahi kar sakta. Explicit params: koi captured state nahi, har call self-contained — testing aur reasoning sabse aasan, bas verbose. Interviewer sunna chahta hai ki tum state ke size aur lifetime ke hisaab se tool chunte ho, dogma se nahi.",
    followUp: "`#private` field aur closure-based privacy mein enforcement ka farak kya hai?",
  },
];

export default questions;
