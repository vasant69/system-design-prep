import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ffc-1",
    question: "\"Functions are first-class citizens\" — ye kya matlab hai aur Node ke liye kyun important hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Matlab function bhi ek value hai — variable mein store, argument mein pass, aur return kiya ja sakta hai. Node isi wajah se non-blocking ho pata hai: hum ek callback function pass karte hain jo I/O khatam hone par chalta hai, aur main thread free rehta hai.",
    detailedAnswer:
      "JavaScript mein function ek callable object hai jise value ki tarah treat kiya jata hai. Iske 3 practical consequences: (1) `const f = someFn` — reference variable mein; (2) `setTimeout(cb, 100)` — function ko argument ki tarah; (3) `function make() { return function () {...} }` — factory pattern. Jo function ko leta ya return karta hai use higher-order function bolte hain. Node ka pura I/O model isi pe based hai — `fs.readFile(path, cb)`, `server.on('request', handler)`, Express middleware — kahin bhi hum Node ko bolte hain 'ye kaam karo, ho jaye toh ye function chala dena'. Agar functions first-class na hote toh async callbacks, event listeners, aur `map`/`filter` jaise APIs possible hi nahi hote.",
    followUp: "Higher-order function ka ek example do jo tumne apne code mein likha ho.",
    redFlag: "\"First-class matlab function sabse pehle chalta hai\" — ye 'order/priority' se confusion hai; iska execution order se koi lena-dena nahi.",
  },
  {
    id: "ffc-2",
    question: "Callback kya hai? Synchronous aur asynchronous callback mein farak batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Callback wo function hai jo tum kisi doosre code ko dete ho taaki wo baad mein use call kare. Sync callback usi tick mein turant chalta hai (jaise `[1,2,3].map(fn)`), async callback kaam khatam hone par chalta hai aur event loop ke through aata hai (jaise `fs.readFile(path, cb)`, `setTimeout`).",
    detailedAnswer:
      "Callback ka mechanism ek hi hai — function reference pass karna — lekin timing do tarah ki: Synchronous: `Array.prototype.map`, `forEach`, `sort` apna kaam complete karne se pehle callback ko call kar lete hain, sab kuch ek hi call stack frame ke andar. Asynchronous: `fs.readFile`, `setTimeout`, `http` request handlers — inka callback abhi register hota hai, function turant return ho jata hai, aur callback baad ke event loop tick mein chalta hai jab (a) operation complete ho aur (b) call stack khali ho. Farak samajhna practically zaroori hai kyunki: sync callback ka error `try/catch` pakad leta hai, async callback ka nahi (isliye error-first convention); aur sync callback ke baad ka code guaranteed uske baad chalta hai, async mein nahi.",
    followUp: "`setTimeout(fn, 0)` ka callback turant kyun nahi chalta?",
  },
  {
    id: "ffc-3",
    question: "Error-first callback convention kya hai? Ek sahi aur ek galat example dikhao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Node ki convention: callback ka pehla parameter hamesha error hota hai (ya `null` agar sab theek). Callback ki pehli line hoti hai `if (err) return handle(err)`. Isse async errors consistently handle hote hain kyunki `try/catch` async callback ke andar ke error ko nahi pakadta.",
    detailedAnswer:
      "Galat (async error try/catch se pakadne ki koshish):\n\n```javascript\ntry {\n  fs.readFile('missing.txt', 'utf8', (err, data) => {\n    console.log(data.toUpperCase()); // data undefined -> crash\n  });\n} catch (e) {\n  console.log('caught', e); // kabhi nahi chalega\n}\n```\n\nYahan `catch` sirf `readFile` ko call karne ki sync error pakadta; file-not-found error `err` argument mein aati hai, jise ignore kiya gaya, isliye `data.toUpperCase()` crash karta hai.\n\nSahi:\n\n```javascript\nfs.readFile('missing.txt', 'utf8', (err, data) => {\n  if (err) {\n    console.error('read failed:', err.code); // 'ENOENT'\n    return;\n  }\n  console.log(data.toUpperCase());\n});\n```\n\nCustom function likhte waqt bhi: `if (err) return callback(err);` — `return` zaroori hai, warna callback do baar chal jayega.",
    followUp: "`util.promisify` error-first callback ke saath kaise kaam karta hai?",
    redFlag: "Async callback ko `try/catch` mein wrap karke sochna ki error handle ho gaya.",
  },
  {
    id: "ffc-4",
    question: "Callback hell kya hai aur usse kaise bachte ho? Kya callback hamesha bura hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Callback hell = kai sequential async operations ko nested callbacks mein likhna, jisse code daayein-neeche 'pyramid' ban jata hai — padhna, error handle karna, aur maintain karna mushkil. Fix: Promises with chaining, ya async/await. Lekin callback hamesha bura nahi — single event listeners aur repeated events ke liye wahi sahi hai.",
    detailedAnswer:
      "Pyramid pattern:\n\n```javascript\ngetUser(id, (e, user) => {\n  getOrders(user, (e, orders) => {\n    getItems(orders[0], (e, items) => {\n      // 3 levels deep, har level pe alag `e`\n    });\n  });\n});\n```\n\nProblems: error handling har level pe repeat, `e` variables shadow karte hain, control flow follow karna hard, aur `try/catch` kaam nahi karta. Solutions: (1) Promises — `getUser(id).then(getOrders).then(...)` flat chain; (2) async/await — `const user = await getUser(id); const orders = await getOrders(user);` — synchronous jaisa padhta hai, ek `try/catch` sab cover karta hai; (3) `util.promisify` se legacy callback APIs ko promise-based banao. Callback kab still sahi hai: `stream.on('data', cb)` (kai baar fire hota hai), `emitter.on('event', cb)`, `server.on('request', cb)` — kyunki Promise sirf ek baar resolve hota hai.",
    followUp: "async/await internally kis cheez ke upar bana hai?",
  },
  {
    id: "ffc-5",
    question: "Interview mein poocha jaye \"tumne yahan callback kyun use kiya, Promise kyun nahi?\" — kya answer doge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "\"Wo ek single event listener tha (stream ka `end` event) jo ek hi baar chalna tha — Promise wrap karna over-engineering hota. Sequential async steps ke liye maine async/await use kiya kyunki wo flat rehta hai aur error handling centralize karta hai. Legacy callback APIs ke liye `util.promisify` taaki baaki code consistent rahe.\"",
    detailedAnswer:
      "Achha answer decision-making dikhata hai, na ki dogma. Points: (1) Repeated/multiple invocations (streams, EventEmitter, HTTP request handler) — callback/EventEmitter hi sahi, kyunki Promise ek hi baar settle hota hai. (2) Ek-baar-ka async result jise aage chain karna hai — Promise ya async/await, taaki callback hell na bane aur error handling ek jagah ho. (3) Purani library jo sirf callback deti hai — `util.promisify(lib.fn)` se promise-ify karo instead of naya wrapper likhne ke. (4) CPU-bound sync kaam — koi callback/promise nahi, seedha call, ya worker thread agar bada ho. Interviewer sunna chahta hai ki tum tool ko problem ke shape se match karte ho.",
    followUp: "EventEmitter aur Promise mein fundamental farak kya hai?",
    redFlag: "\"Callback purana ho gaya, hamesha async/await hi use karna chahiye\" — repeated events ke liye async/await fit nahi hota.",
  },
];

export default questions;
