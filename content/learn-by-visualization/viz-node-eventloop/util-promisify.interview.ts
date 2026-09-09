import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ups-1",
    question: "`util.promisify` kya karta hai, aur kis tarah ke functions pe chalta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek error-first callback function (`fn(...args, (err, value) => ...)`) ko wrap karke ek naya function deta hai jo same args leta hai par Promise return karta hai — err pe reject, value pe resolve. Chalta sirf un functions pe jo Node ki `(err, value)` callback convention follow karte hain.",
    detailedAnswer:
      "`util.promisify(original)` ek function return karta hai jo call hone pe ek `new Promise` banata hai, `original` ko tumhare args plus ek internal callback ke saath call karta hai, aur us callback mein `err ? reject(err) : resolve(value)` karta hai. Isse tum legacy callback APIs ko `await` aur `try/catch` ke saath use kar sakte ho, nesting hataye bina. Requirements: callback last argument ho aur `(err, value)` shape ka ho. Exceptions: multi-value callbacks (`dns.lookup`) ke liye `util.promisify.custom` symbol; aur `fs` ke liye already `fs.promises` maujood hai, use prefer karo.",
    followUp: "Jis function ka callback `(err, value)` ke bajaye `(value)` deta ho, uska kya hoga?",
    redFlag: "\"Kisi bhi function ko promise bana deta hai\" — non-standard callback shapes pe wo galat resolve karta hai.",
  },
  {
    id: "ups-2",
    question: "`util.promisify` ka ek chhota apna version implement karo.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Ek function return karo jo `...args` le, `new Promise` banaye, aur original ko `args` + ek `(err, value)` callback ke saath call kare jo err pe reject aur warna value pe resolve kare. `this` preserve karne ke liye `fn.call(this, ...)` use karo.",
    detailedAnswer:
      "```js\nfunction promisify(fn) {\n  return function promisified(...args) {\n    return new Promise((resolve, reject) => {\n      fn.call(this, ...args, (err, value) => {\n        if (err) return reject(err);\n        resolve(value);\n      });\n    });\n  };\n}\n\n// use\nconst readFile = promisify(require('fs').readFile);\nconst text = await readFile('a.txt', 'utf8');\n```\nReal `util.promisify` isse zyada karta hai: `util.promisify.custom` symbol check karta hai, original ka name/length copy karta hai, aur callback ke multiple success args ke liye kuchh handling. Par core idea yahi hai — ek Promise ke andar callback ko wire karna.",
    followUp: "`this` ko `fn.call(this, ...)` se preserve karna kyun zaroori hai?",
  },
  {
    id: "ups-3",
    question:
      "Kis tarah ke callback function pe `util.promisify` galat ya unexpected result dega?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Jinka callback error-first nahi hai: jaise `(value) => ...` (koi err slot nahi), ya `(err, a, b)` multiple success values (default sirf `a` deta hai), ya jo callback ke bajaye return/emit karte hain. In cases mein `util.promisify.custom` define karna padta hai ya manual wrapper likhna padta hai.",
    detailedAnswer:
      "`util.promisify` blindly maanta hai: last arg callback hai, aur wo `(err, value)` order mein call hoga. Break hota hai jab — (1) callback value-first hai (`setTimeout`-style ya kuchh older APIs): promisify `value` ko `err` samjhega aur galat reject/resolve karega; (2) do success values hain (`dns.lookup` ka `address, family`): default sirf pehli value milti hai — isliye Node ne uspe `util.promisify.custom` rakha hai; (3) function callback nahi callback-per-event (`EventEmitter`) use karta hai: promisify ka concept hi apply nahi hota. In sab ke liye ya to `fn[util.promisify.custom] = customImpl` set karo, ya seedha `new Promise` wrapper likho.",
    followUp: "`util.promisify.custom` symbol se ek multi-value callback ko kaise handle karoge?",
    redFlag: "Bina callback signature dekhe har cheez promisify kar dena.",
  },
  {
    id: "ups-4",
    question:
      "Ek legacy callback-based logging/DB module hai jise naye async/await codebase mein use karna hai. Kaise integrate karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Har error-first method ko `util.promisify` se wrap karke ek thin promise-returning adapter module banao (`const query = util.promisify(db.query.bind(db))`). Non-standard methods ke liye manual `new Promise` wrapper. App code sirf adapter ko `await` kare, legacy module ko seedha nahi.",
    detailedAnswer:
      "Approach: ek `db-async.js` (adapter) banao. Standard error-first methods: `const query = util.promisify(db.query).bind(db)` — ya pehle `db.query.bind(db)` phir promisify, taaki `this` na toote. Multi-value ya event-based methods ke liye chhota manual wrapper. Adapter mein hi errors ko meaningful message/`cause` ke saath wrap kar do. App code ab `await query(sql, params)` likhta hai aur `try/catch` use karta hai. Faayda: legacy module ek jagah isolated rehta hai, migration incremental hota hai, aur agar baad mein native promise-based driver aa jaaye to sirf adapter badalna padta hai.",
    followUp: "`util.promisify(db.query)` ko `.bind(db)` kyun chahiye?",
  },
];

export default questions;
