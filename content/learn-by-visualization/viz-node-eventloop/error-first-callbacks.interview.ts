import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "efc-1",
    question: "Error-first callback convention kya hai, aur ye exist kyun karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node ki standard callback shape `callback(err, data)` hai: pehla argument error (fail pe Error object, success pe null), baaki asli result. Exist isliye karta hai kyunki async callback ek naye call stack se invoke hota hai, to purana try/catch use catch nahi kar sakta — error ko value ki tarah pass karna hi reliable tarika hai.",
    detailedAnswer:
      "Jab tum `fs.readFile(path, cb)` call karte ho, function turant return kar deta hai; asli kaam baad mein hota hai aur `cb` ko event loop ek fresh stack pe chalata hai. Us waqt tumhara `try` block kab ka khatam ho chuka, to synchronous exception handling kaam nahi karti. Solution: error ko `cb` ke pehle argument mein bhej do. Caller ka contract: `if (err) return handleErr(err);` — pehle check, phir early return, tabhi `data` ko use karo. Callback ke andar `throw` mat karo (wo uncaught ban jaata hai); error ko apne khud ke callback ke `err` slot se aage bhejo.",
    followUp: "Callback ke andar agar tum `throw` kar do to kya hota hai?",
    redFlag: "\"try/catch laga do async call ke around\" — async errors wahan aate hi nahi.",
  },
  {
    id: "efc-2",
    question:
      "Ek dev ne `fs.readFile` call ko `try/catch` mein wrap kiya, phir bhi file missing hone pe app crash hui. Kyun?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`fs.readFile` async hai — error `try/catch` ke bahar, baad mein, callback ke `err` argument se aata hai. try block tab tak return kar chuka. Missing `err` check ki wajah se code `undefined` data pe operate karke crash hota hai.",
    detailedAnswer:
      "Async function ka error synchronous exception nahi hota. `fs.readFile(p, cb)` ka sync part sirf 'kaam schedule karo' hai — koi throw nahi. try block turant successfully exit ho jaata hai. Baad mein poll phase mein `cb(err, data)` chalta hai jahan `err` set hai par `data` `undefined`. Agar callback `err` ignore karke `JSON.parse(data)` ya `data.trim()` karta hai, wo throw karega — ab bhi kisi try ke andar nahi — to process crash. Fix: `if (err) return ...;` callback ke andar, ya `fs.promises.readFile` + `await` + `try/catch` use karo (wahan await rejection ko throw mein badal deta hai).",
    followUp: "Isko promise/async-await se kaise likhoge taaki try/catch actually kaam kare?",
    redFlag: "Sync aur async error handling ko ek jaisa maan lena.",
  },
  {
    id: "efc-3",
    question:
      "Ek error-first style function `readJson(path, cb)` likho jo file padhe aur parse karke `cb(err, obj)` call kare.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "fs.readFile call karo; err aaye to `cb(err)` karke return; warna try/catch mein JSON.parse karo aur parse fail pe `cb(parseErr)`, success pe `cb(null, obj)`.",
    detailedAnswer:
      "```js\nconst fs = require('fs');\n\nfunction readJson(path, cb) {\n  fs.readFile(path, 'utf8', (err, text) => {\n    if (err) return cb(err);            // I/O error aage bhejo\n    let obj;\n    try {\n      obj = JSON.parse(text);           // parse sync hai, isliye try/catch OK\n    } catch (parseErr) {\n      return cb(parseErr);               // parse error ko bhi err slot se\n    }\n    cb(null, obj);                       // success\n  });\n}\n```\nDhyaan: har error path pe `return cb(err)` — taaki success `cb(null, obj)` galti se dobara na chale. `JSON.parse` sync hai isliye uske liye local `try/catch` sahi hai; `fs.readFile` async hai isliye uska error `err` argument se aata hai.",
    followUp: "Agar `cb` ko dono baar call kar diya (err ke baad success bhi) to caller pe kya asar padega?",
  },
  {
    id: "efc-4",
    question:
      "Ek purana callback-based codebase hai. Error handling consistent aur safe kaise rakhoge — kaunse patterns?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Har callback ki pehli line `if (err) return cb(err)` (ya handle). Callbacks ko ek hi baar call karna guarantee karo. Deep nesting ki jagah named functions ya `util.promisify` + async/await. Uncaught ke liye process-level `uncaughtException`/`unhandledRejection` sirf log-and-exit ke liye.",
    detailedAnswer:
      "Practical rules: (1) Har error-first callback ke top pe `if (err) return next(err);` — early return, exceptions nahi. (2) Ek callback ko exactly ek baar call karo; double-call bugs se bachne ke liye ek `called` guard ya `once` wrapper. (3) Nesting kam karo — chhote named functions, ya `util.promisify`/`fs.promises` se async/await pe shift karo jahan `try/catch` phir se meaningful ho jaata hai. (4) Library boundary pe errors ko wrap karo (`err.cause`) taaki context na khoye. (5) Last-resort safety net: `process.on('uncaughtException')` aur `process.on('unhandledRejection')` — inme sirf structured log likho aur `process.exit(1)`; inse 'recover' mat karo. (6) Naya code promise-first likho; sirf legacy edges pe callbacks rakho.",
    followUp: "Callback code ko incrementally promises pe migrate karne ka safe order kya hoga?",
    redFlag: "Har jagah alag-alag ad-hoc error handling, aur callbacks ka kabhi ek baar kabhi do baar call hona.",
  },
];

export default questions;
