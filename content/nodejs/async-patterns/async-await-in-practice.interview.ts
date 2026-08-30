import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aaip-1",
    question: "async/await Promises ke upar 'syntax sugar' hai — 'sugar' se exactly kya matlab hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Matlab async/await koi naya runtime mechanism nahi laata — engine `await` ko internally `.then` mein convert karta hai. `async` function ek Promise return karta hai, aur `await p` ka matlab hai 'p ko `.then` karo aur function ka baaki hissa us `.then` ka callback bana do'. Behaviour bilkul Promises jaisa, sirf likhna linear ho jata hai.",
    detailedAnswer:
      "Jab engine `const x = await getX(); use(x);` dekhta hai, wo effectively ise `getX().then((x) => { use(x); })` mein badal deta hai — plus generator-jaisi state machine taaki function apni local variables ke saath resume ho sake. Consequences: (1) `async` function turant ek pending Promise return karta hai, uska body pehle `await` tak sync chalta hai; (2) `await` ke baad ka code hamesha ek microtask mein chalta hai, kabhi synchronously nahi — chahe Promise already resolved ho; (3) `await`ed rejection `.then`'s reject path ke barabar hai, jise `try/catch` ek throw ki tarah pakadta hai; (4) concurrency wahi Promise concurrency hai — parallel chahiye toh `Promise.all`, `await` khud sequential hi hai.",
    followUp: "`await` ke baad ka code synchronously kyun nahi chal sakta jab Promise already resolved ho?",
    redFlag: "\"await ek naya thread ya parallel execution deta hai\" — nahi, wo single-threaded event loop pe `.then` scheduling hai.",
  },
  {
    id: "aaip-2",
    question: "Ye code faster kaise banaoge? `const user = await getUser(id); const prefs = await getPrefs(id); const feed = await getFeed(id);`",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Teenon calls sirf `id` pe depend karti hain, ek doosre pe nahi — isliye sequential await waste hai. `Promise.all` se parallel karo: `const [user, prefs, feed] = await Promise.all([getUser(id), getPrefs(id), getFeed(id)]);`. Time sum se max ho jata hai.",
    detailedAnswer:
      "Sequential version har call ke ~100ms ko add karta hai → ~300ms. Parallel:\n\n```javascript\nconst [user, prefs, feed] = await Promise.all([\n  getUser(id),\n  getPrefs(id),\n  getFeed(id),\n]);\n```\n\nYahan teenon Promises `Promise.all` ko pass karne se pehle hi **start** ho jaati hain (function call = kaam shuru), phir `Promise.all` ek combined Promise deta hai jo teenon fulfil hone par resolve karta hai → ~100ms. Caveats: (1) `Promise.all` fail-fast hai — koi ek reject hua toh poora `await` throw karega; agar tumhe saare results chahiye chahe kuch fail ho toh `Promise.allSettled`. (2) Agar `getPrefs` ko sach mein `user` ka koi field chahiye, toh wo dependency hai aur usko sequential rakhna hi padega — sirf independent calls parallelize karo.",
    followUp: "Agar getFeed ko user.region chahiye ho toh kaunsa hissa parallel rahega aur kaunsa sequential?",
  },
  {
    id: "aaip-3",
    question: "`for...of` + await, `.map(async)` + `Promise.all`, aur `for await...of` — teenon kab use karte ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`for...of` + await: sequential — jab order matter kare ya jab tum downstream ko flood nahi karna chahte. `.map(async)` + `Promise.all`: parallel — jab items independent hon aur count chhota (10-50). `for await...of`: jab source khud ek async iterable ho — DB cursor, paginated API, stream.",
    detailedAnswer:
      "```javascript\n// sequential — order/backpressure\nfor (const id of ids) {\n  await migrate(id); // ek time pe ek, DB safe\n}\n\n// parallel — independent, bounded count\nconst results = await Promise.all(ids.map((id) => fetchItem(id)));\n\n// async iterable — source apni speed se deta hai\nfor await (const row of db.queryCursor('SELECT ...')) {\n  process(row); // memory mein poora result set nahi\n}\n```\n\nDecision: pehle poochho 'kya items ek doosre pe depend karte hain?' — haan toh sequential. Nahi, aur count chhota — `Promise.all` + `map`. Nahi, par count bada (1000+) — concurrency limit (`p-limit` ya chunking) kyunki `.map` + `Promise.all` 1000 concurrent ops launch kar dega aur pool/rate-limit todega. Source streaming hai (cursor, HTTP body, file lines) — `for await...of` taaki backpressure natural rahe.",
    followUp: "`.map(async)` + `Promise.all` ko 10000 items pe chalane se kya production issue aayega?",
    redFlag: "\"Hamesha Promise.all use karo, wo tez hai\" — bade N pe unbounded concurrency pool exhaust aur rate-limit errors deta hai.",
  },
  {
    id: "aaip-4",
    question: "Floating promise (missing await) bug kya hai? Ek example do aur batao production mein kya todega.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Jab tum ek Promise-returning call ka `await` (ya `.then`/`.catch`) bhool jaate ho, wo Promise 'float' karta hai — function uske complete hone se pehle return kar deta hai, aur agar wo reject kare toh wo unhandled rejection hai (Node v15+ process crash).",
    detailedAnswer:
      "```javascript\nasync function createOrder(data) {\n  const order = await db.orders.insert(data);\n  auditLog.write({ event: 'order_created', id: order.id }); // BUG: await nahi\n  return order; // auditLog complete hone se pehle return\n}\n```\n\nProduction impact: (1) caller ko lagta hai kaam ho gaya jabki `auditLog.write` abhi pending hai — race conditions, missing audit entries; (2) `auditLog.write` reject hua toh `unhandledRejection` — Node v15+ mein default process exit, matlab ek audit failure poore server ko gira sakta hai; (3) errors silently gayab, debugging nightmare. Fixes: `await auditLog.write(...)` agar tum uska wait karna chahte ho; ya agar deliberately fire-and-forget hai toh `void auditLog.write(...).catch((e) => log.error(e))` — explicit `.catch` aur `void` se intent clear. Lint rule `no-floating-promises` (typescript-eslint) ise catch karta hai.",
    followUp: "Deliberate fire-and-forget kaise likhoge taaki reviewer ko pata chale ki ye bug nahi hai?",
    redFlag: "\"await optional hai agar mujhe result nahi chahiye\" — rejection handling ke liye await/catch zaroori hai, result chahe na ho.",
  },
  {
    id: "aaip-5",
    question: "Interviewer: \"Tumne yeh 3 calls sequential await kiye, Promise.all kyun nahi?\" Kaise justify karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "\"In calls mein data dependency thi — doosri call ko pehli ka output chahiye tha — isliye wo genuinely sequential hain aur Promise.all yahan galat hota. Jahan calls independent thin, wahan maine Promise.all use kiya. Aur ek loop mein maine jaanbujh ke sequential rakha taaki upstream ko flood na karun.\"",
    detailedAnswer:
      "Achha answer teen scenarios distinguish karta hai: (1) **Data dependency** — `const user = await getUser(id); const orders = await getOrders(user.accountId);` — `getOrders` ko `user.accountId` chahiye, sequential majboori hai. (2) **Independent** — `Promise.all([getProfile(id), getSettings(id), getUsage(id)])` — sab `id` se, parallel karo, latency sum se max. (3) **Deliberate throttle** — 5000-row migration mein `for...of` + `await` isliye taaki ek time pe ek hi DB write ho aur connection pool na tuten; agar batch chhota hota (20) toh `map` + `Promise.all`. Interviewer sunna chahta hai ki tumne har call ki dependency graph socha, blindly ek pattern nahi lagaya — aur ki tum jaante ho unbounded `Promise.all` bade N pe hazard hai.",
    followUp: "5000-row job ko na fully-sequential na fully-parallel — beech ka rasta kya hai?",
    redFlag: "\"Promise.all se dependent calls bhi tez ho jaati\" — agar B ko A ka result chahiye toh Promise.all use tod dega ya undefined dega.",
  },
];

export default questions;
