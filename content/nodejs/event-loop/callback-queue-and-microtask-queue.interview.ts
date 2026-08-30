import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mtq-1",
    question: "Macrotask aur microtask mein kya farak hai? Har ek ke examples do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Macrotask = bada 'unit of work' jo ek event-loop phase mein chalta hai: `setTimeout`/`setInterval` (timers), poore ho chuke I/O ke callbacks, `setImmediate` (check). Microtask = chhota, high-priority job jo har macrotask ke turant baad chalta hai: `process.nextTick` (pehle) aur resolved-Promise jobs (`.then`/`.catch`/`.finally`, `await` continuations).",
    detailedAnswer:
      "Timing difference decisive hai. Ek macrotask complete hone ke baad, Node agla macrotask uthane se pehle **saari** microtasks drain karta hai — pehle poori `process.nextTick` queue, phir poori Promise job queue, aur agar drain ke dauraan naye microtasks add hue toh wo bhi, jab tak dono queues bilkul khali na ho. Yeh drain har event-loop phase ke beech bhi hota hai, sirf macrotasks ke beech nahi. Isliye ek promise chain jitni bhi lambi ho, wo agle timer ya I/O callback se pehle poori complete ho jati hai. Practical takeaway: microtasks 'iss kaam ke turant baad, kuch aur hone se pehle'; macrotasks 'agli baari mein'.",
    followUp: "Agar ek microtask ek naya microtask schedule kare, wo isi drain mein chalega ya agle?",
    redFlag: "\"setTimeout(fn, 0) microtask hai\" — nahi, wo timer macrotask hai.",
  },
  {
    id: "mtq-2",
    question: "`process.nextTick` aur `Promise.resolve().then` — timing aur use-case mein farak?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dono microtasks hain, lekin `process.nextTick` queue Promise job queue se **pehle** poori drain hoti hai. `nextTick` mostly internal/library use ke liye hai (ek API ko consistently async banana); application code mein promise-timing chahiye toh `queueMicrotask` ya `Promise.resolve().then` behtar hai.",
    detailedAnswer:
      "Order: sync code khatam → poori `process.nextTick` queue → poori Promise queue → (agar Promise jobs ne nextTick add kiya toh wapas nextTick queue) → agla macrotask. Toh `nextTick` 'even sooner than a promise'. Node ne ise isliye rakha taaki wo error emit karne se pehle listeners ko attach hone de sake, ya recursive-safe internal deferral kar sake. Danger: `nextTick` I/O aur timers se pehle hai, toh ek heavy ya recursive `nextTick` poori loop ko starve kar deta hai. Application code mein 'promise ke baad' chahiye toh `queueMicrotask(fn)` — same timing as `.then`, bina dummy promise allocate kiye, aur uska error `uncaughtException` mein jata hai (unhandled rejection mein nahi).",
    followUp: "\"Release Zalgo\" ka matlab kya hai aur `nextTick` usse kaise related hai?",
    redFlag: "`nextTick` ko \"thoda der baad chalao\" ke liye use karna — wo I/O se pehle chalta hai, baad mein nahi.",
  },
  {
    id: "mtq-3",
    question: "Yeh code — output order batao aur reason: `console.log(1); setTimeout(() => console.log(2)); Promise.resolve().then(() => console.log(3)); process.nextTick(() => console.log(4)); console.log(5);`",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Output: `1 5 4 3 2`. Sync pehle (`1`, `5`). Phir microtasks: `nextTick` queue pehle (`4`), phir Promise queue (`3`). Phir macrotask: `setTimeout` callback (`2`) agli loop iteration ke timers phase mein.",
    detailedAnswer:
      "Step by step: (1) `console.log(1)` sync. (2) `setTimeout(cb)` — `cb` timer macrotask queue mein, abhi nahi. (3) `Promise.resolve().then(cb)` — `cb` Promise job (microtask) queue mein. (4) `process.nextTick(cb)` — `cb` nextTick (microtask) queue mein. (5) `console.log(5)` sync. Main script (macrotask) khatam, call stack khali. Node microtasks drain karta hai: nextTick queue pehle → `4`; phir Promise queue → `3`. Dono microtask queues empty. Node timers phase pe jata hai → `2`. Final: `1, 5, 4, 3, 2`.",
    followUp: "Agar `process.nextTick` callback ke andar ek aur `Promise.resolve().then` add kar dein toh order kaise badlega?",
  },
  {
    id: "mtq-4",
    question: "Microtask starvation kya hai? Ek concrete scenario batao jismein yeh production issue bana.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Starvation tab hoti hai jab microtask queue kabhi khali nahi hoti — jaise ek callback khud ko `process.nextTick` ya `Promise.resolve().then` se recursively schedule kare. Node next macrotask/phase pe tabhi jata hai jab microtask queues empty hon, toh timers aur I/O callbacks kabhi nahi chalte — process bina crash ke hang.",
    detailedAnswer:
      "Real scenario: ek service ne ek badi in-memory tree (roughly 4 lakh nodes) ko `Promise.resolve().then(() => processNext())` se node-by-node process kiya, yeh soch ke ki microtask se stack overflow nahi hoga. Sahi — overflow nahi hua, lekin har node ne ek naya microtask schedule kiya, queue kabhi empty nahi hui, aur event loop poll phase tak nahi pahuncha jab tak poora tree khatam na ho. Us dauraan health-check ka `setTimeout`-based timeout fire nahi hua, aur load balancer ne instance ko unhealthy mark kar diya — effectively ek self-inflicted outage. Fix: batching + `await new Promise(r => setImmediate(r))` har N nodes ke baad. `setImmediate` ek macrotask hai, toh beech mein Node poll phase mein jaake I/O serve kar leta hai. Lesson: bade kaam ko microtasks se chunk mat karo — `setImmediate` se karo.",
    followUp: "Kaise detect karoge ki ek running process microtask starvation mein hai?",
    redFlag: "\"Microtask lightweight hai toh usmein loop chalana safe hai\" — timing priority ki wajah se yeh sabse asaan tarika hai loop ko freeze karne ka.",
  },
  {
    id: "mtq-5",
    question: "Ek async utility likhni hai jo kabhi sync path le sakti hai (cache hit) aur kabhi async (cache miss). Callers ko consistent behaviour kaise doge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Hamesha async raho — chahe result turant available ho. Sync path pe bhi callback/resolution ko `queueMicrotask` ya `process.nextTick` se defer karo, taaki caller ka code jo function-call ke turant baad aata hai wo hamesha callback se pehle chale. Yeh 'don't release Zalgo' rule hai.",
    detailedAnswer:
      "Agar function kabhi sync aur kabhi async return kare, toh caller ke liye reasoning namumkin: variables jo callback ke baad set hone the wo cache-hit case mein undefined dikhenge. Fix pattern:\n\n```javascript\nfunction getUser(id, cb) {\n  const cached = cache.get(id);\n  if (cached) {\n    queueMicrotask(() => cb(null, cached)); // async even on hit\n    return;\n  }\n  db.query(id, cb); // already async\n}\n```\n\nPromise-based API ho toh yeh apne-aap milta hai — `Promise.resolve(cached)` ka `.then` bhi microtask pe hi chalega, kabhi synchronously nahi. Library authoring mein `process.nextTick` traditionally use hota tha kyunki wo Promise jobs se bhi pehle hai aur guaranteed 'as soon as possible'; modern code mein `queueMicrotask` clean choice hai jab tak tumhe explicitly Promise jobs se aage nahi jana.",
    followUp: "`setImmediate` se defer karne mein kya problem hai is case mein?",
    redFlag: "Cache-hit pe callback ko synchronously call kar dena aur async path pe defer karna — yahi inconsistency bug paida karta hai.",
  },
];

export default questions;
