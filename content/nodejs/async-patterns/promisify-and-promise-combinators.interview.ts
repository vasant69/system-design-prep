import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ppc-1",
    question:
      "`util.promisify` kya karta hai? `promisify.custom` symbol kis liye hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`util.promisify(fn)` ek error-first callback function (`fn(...args, (err, result) => {})`) ko ek Promise-returning function mein badalta hai — callback mein `err` -> reject, warna result -> resolve. `util.promisify.custom` ek symbol hai jispe library author apna Promise version attach karta hai jab callback error-first single-result convention follow nahi karta (multi-value ya non-standard).",
    detailedAnswer:
      "```javascript\nconst util = require('util');\nconst readFileP = util.promisify(require('fs').readFile);\nconst text = await readFileP('note.txt', 'utf8');\n```\n\nDo gotchas: (1) sirf error-first single-result callbacks par out-of-the-box. (2) Object method promisify karte waqt `this` lost — `util.promisify(obj.method.bind(obj))`.\n\n`promisify.custom`: default promisify maanta hai callback `(err, singleResult)` shape ka hai. Agar `(err, a, b)` ya pehla arg error nahi — library `fn[util.promisify.custom]` par proper implementation rakhti hai. Node core khud ye karta hai: `child_process.exec` ka promisified version `{ stdout, stderr }` object deta hai (do alag args nahi). `util.promisify(setTimeout)` ek special version deta hai jo `(ms, value)` leta hai — wahi `timers/promises`.",
    followUp: "Agar Node ne pehle se `fs.promises` de rakha hai to `util.promisify(fs.readFile)` kyun nahi karna chahiye?",
  },
  {
    id: "ppc-2",
    question:
      "Char combinators — `Promise.all`, `allSettled`, `race`, `any` — mein se ek scenario ke liye kaunsa? (a) 3 mandatory lookups, (b) 100 best-effort notifications, (c) ek call jise 3s se zyada nahi lagna chahiye, (d) 3 CDN mirrors se fastest healthy response.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "(a) `Promise.all` — sab chahiye, koi fail = pura invalid. (b) `Promise.allSettled` — partial results OK, kabhi throw nahi. (c) `Promise.race([realWork(), rejectAfter(3000)])` — pehla settle (timeout reject bhi ek valid result). (d) `Promise.any` — pehla FULFIL jeetta hai, ek mirror ke `500` par next ka intezaar.",
    detailedAnswer:
      "Trick: **all** = 'sab chahiye' (AND); **allSettled** = 'sab ka result chahiye chahe fail ho'; **race** = 'pehla koi bhi result' (fulfil ya reject); **any** = 'pehla successful result'.\n\n```javascript\n// a\nconst [user, acct, limits] = await Promise.all([getUser(id), getAcct(id), getLimits(id)]);\n// b\nconst outcomes = await Promise.allSettled(subs.map((s) => notify(s)));\nconst failed = outcomes.filter((o) => o.status === 'rejected');\n// c\nconst rejectAfter = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));\nconst data = await Promise.race([fetchReport(id), rejectAfter(3000)]);\n// d\nconst asset = await Promise.any([cdn1.get(k), cdn2.get(k), cdn3.get(k)]);\n```\n\nCommon mistake: (d) ke liye `race` use karna — agar fastest mirror reject kare to `race` bhi reject kar deta hai; `any` rejections ignore karke fastest FULFIL deta hai.",
    followUp: "`Promise.allSettled` ke result ko `Promise.all` ki tarah `.map(r => r.value)` karne mein kya bug hai?",
  },
  {
    id: "ppc-3",
    question:
      "Ek CSV import 8000 rows ko `Promise.all(rows.map(insertRow))` se insert karta hai. Chhote files (50 rows) par theek, 8000 par sab fail. Kya ho raha hai aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`rows.map(insertRow)` synchronously 8000 Promises bana deta hai — 8000 inserts turant in-flight. DB connection pool (max ~20) exhaust, sekron queries `pool timeout` se fail, aur `Promise.all` fail-fast hone se ek fail par pura import abort — 0 rows. Fix: `p-limit(15)` se concurrency bound + `Promise.allSettled` taaki ek bad row pure batch ko na girae.",
    detailedAnswer:
      "```javascript\nconst pLimit = require('p-limit');\nconst limit = pLimit(15);\nconst outcomes = await Promise.allSettled(\n  rows.map((row) => limit(() => insertRow(row)))\n);\nconst failures = outcomes\n  .map((o, i) => ({ o, i }))\n  .filter((x) => x.o.status === 'rejected');\n// failures ko ek error report mein, baaki rows imported\n```\n\n`p-limit(15)` ensure karta hai ki kabhi bhi max 15 inserts in-flight hon — pool safe. `allSettled` ensure karta hai ki row 3000 ka constraint violation baaki 7999 ko na roke. Import time thoda badhta hai par reliability 0% se ~100%.\n\nZero-dependency alternative: ek manual `mapLimit` (Set of running promises + `Promise.race` jab count concurrency tak pahunche), ya chunking (rows ko 50-50 groups mein, har group `await Promise.all(group)` — thoda kam optimal par simple).",
    followUp: "`p-limit` ki concurrency value tum kaise choose karoge production mein?",
    redFlag: "`Promise.all` ko bade N par seedhe chalana yeh maan ke ki wo internally batch karta hai — wo nahi karta.",
  },
  {
    id: "ppc-4",
    question:
      "`Promise.race` se timeout wrapper kaise likhoge? Ek subtle issue kya hai?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`Promise.race([realWork(), rejectAfter(ms)])` — jo pehle settle ho. `rejectAfter` ek Promise jo `ms` baad `reject(new Error('timeout'))` karta hai. Subtle issue: `realWork` ka promise 'race jeet' jaane ke baad bhi background mein chalta rehta hai (Promises cancellable nahi) — aur `rejectAfter` ka `setTimeout` pending reh jata hai (loop ko ref karta), use `clearTimeout` karo.",
    detailedAnswer:
      "```javascript\nfunction withTimeout(promise, ms) {\n  let t;\n  const timeout = new Promise((_, reject) => {\n    t = setTimeout(() => reject(new Error('timeout')), ms);\n  });\n  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));\n}\n```\n\nIssues to mention: (1) `promise` cancel nahi hota — agar wo ek fetch hai jo 30s leta hai, wo abhi bhi 30s chalega aur socket/DB connection hold karega; real cancellation ke liye `AbortController` pass karo. (2) `clearTimeout` zaroori hai warna timer loop ko zinda rakhta hai (script contexts mein) ya ek unnecessary reject baad mein fire karta hai. (3) Agar `promise` reject kare timeout se pehle, `race` wo reject propagate karta hai — jo aksar sahi behaviour hai.",
    followUp: "`AbortController` ko is wrapper mein kaise integrate karoge taaki underlying request bhi cancel ho?",
  },
  {
    id: "ppc-5",
    question:
      "`util.callbackify` kab use hota hai, aur `util.promisify` se ulta kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`util.callbackify(asyncFn)` ek Promise-returning (`async`) function ko error-first callback-style function mein badalta hai — `promisify` ka ulta. Zaroorat tab jab tumhara code modern async hai lekin koi purana caller ya plugin interface sirf `(err, result)` callbacks samajhta hai.",
    detailedAnswer:
      "```javascript\nasync function getUser(id) { return { id, name: 'Asha' }; }\nconst getUserCb = util.callbackify(getUser);\ngetUserCb(42, (err, user) => {\n  if (err) return console.error(err);\n  console.log(user);\n});\n```\n\nPromise fulfil -> `cb(null, value)`; reject -> `cb(reason)`. Ek gotcha: agar `async` function `null` ya `undefined` se reject kare, `callbackify` use ek special wrapper error mein daal deta hai taaki `cb(err)` mein `err` truthy rahe (warna `if (err)` check fail ho jata). Real use: ek library jo callback-based API expose karti hai backward-compat ke liye, lekin uske andar ka logic async/await mein. Agar tum dono taraf ka code control karte ho, callbackify ki zaroorat nahi honi chahiye.",
    followUp: "`promisify(callbackify(asyncFn))` round-trip karne mein kya risk hai?",
  },
];

export default questions;
