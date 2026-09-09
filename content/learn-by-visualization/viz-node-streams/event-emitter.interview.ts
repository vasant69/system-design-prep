import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ee-1",
    question: "EventEmitter kya hai aur Node mein kahan-kahan use hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Observer pattern ka built-in implementation. Ek object jispe `on(event, fn)` se listeners register hote hain aur `emit(event, ...args)` se wo sab synchronously chalte hain. Streams, http.Server, sockets, process, child_process — sab EventEmitter extend karte hain.",
    detailedAnswer:
      "API chhoti hai: `on`/`addListener` (subscribe), `once` (ek baar), `off`/`removeListener`, `emit` (fire), `listenerCount`, `removeAllListeners`. `emit` ek sync loop hai — listeners registration order mein turant chalte hain. Ye Node ka core decoupling mechanism hai: `req.on('data', ...)`, `req.on('end', ...)`, `server.on('connection', ...)`, `stream.on('error', ...)`, `process.on('SIGINT', ...)`. Apne code mein use karo jab ek cheez hone par kai independent reactions chahiye (order placed -> email plus invoice plus analytics) bina un modules ko aapas mein couple kiye.",
    followUp: "`emit` sync hai — agar ek listener slow ho to kya? Aur async listeners kaise handle karoge?",
    redFlag: "\"emit event loop pe schedule karta hai\" — nahi, wo turant inline chalta hai.",
  },
  {
    id: "ee-2",
    question:
      "`e.on('x', () => console.log('A')); e.on('x', () => console.log('B')); console.log('start'); e.emit('x'); console.log('end');` — output kya hoga?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "start, A, B, end — isi order mein. `emit` synchronous hai: dono listeners registration order mein turant chalte hain, `emit` return hone ke baad hi 'end' print hota hai.",
    detailedAnswer:
      "Koi async gap nahi hai. `emit('x')` internally kuch aisa hai: for (const fn of listeners['x']) fn(...args). Isliye start -> A -> B -> end. Agar tumhe listeners defer karne hain to listener ke andar `setImmediate(() => ...)` ya `queueMicrotask(...)` daalo, ya poore `emit` call ko `process.nextTick(() => emitter.emit(...))` mein wrap karo. Node docs specifically kehte hain ki listeners sync chalte hain taaki ordering aur race conditions predictable rahein.",
    followUp: "`emit` ko poore app ke liye async banane ka kya tradeoff hoga?",
  },
  {
    id: "ee-3",
    question:
      "Ek Express app har request pe `db.on('error', handler)` call kar raha hai. 5 minute baad `MaxListenersExceededWarning` aata hai. Kya galat hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Har request usi long-lived `db` emitter pe ek naya `error` listener add kar raha hai, par kabhi remove nahi karta — listeners array badhta jaata hai (memory leak). 10 paar hote hi warning. Fix: listener module load pe ek baar lagao, ya `once`, ya request ke baad `off()`.",
    detailedAnswer:
      "`db` connection process-lifetime object hai. `on()` har baar ek aur function `listeners['error']` mein push karta hai; purane request handlers ke closures garbage collect nahi hote kyunki emitter unhe hold kiye hue hai — classic leak. `MaxListenersExceededWarning` (default threshold 10) exactly isi ko catch karne ke liye hai. Fixes: (1) `db.on('error', handler)` top-level pe ek hi baar; (2) per-request context chahiye to `const h = ...; db.once('error', h)` ya `res.on('finish', () => db.off('error', h))`; (3) `setMaxListeners` sirf tab badhao jab tumhe sach mein N static listeners chahiye — warning silence karna fix nahi hai.",
    followUp: "`setMaxListeners(Infinity)` laga dein to? Kab acceptable hai?",
    redFlag: "\"setMaxListeners(100) laga do, warning chali jaayegi\" — leak chhupana, theek karna nahi.",
  },
  {
    id: "ee-4",
    question: "`error` event pe listener na ho to kya hota hai, aur EventEmitter isko special kyun treat karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Unhandled `error` event `err` ko throw kar deta hai — usually process crash. Special-case isliye hai kyunki async errors ka koi call stack nahi hota jisme wo naturally propagate ho; agar EventEmitter chup rehta to serious failures silently gum ho jaate.",
    detailedAnswer:
      "`emit('error', err)` par agar listenerCount('error') zero hai: Node `err` ko synchronously throw karta hai `emit` ke andar se. Agar wo try/catch mein nahi (aur async context mein aksar nahi hota) -> uncaughtException -> process exit. Rationale: streams, sockets, DB clients async fail hote hain; unka error kisi try/catch mein nahi girega, aur loud crash silent corruption se behtar hai. Practical rule: har emitter jise tum retain karte ho uspe `.on('error', ...)` — chahe wo sirf log kare. `stream.pipe()` ki jagah `pipeline()` use karne ka ek bada reason yahi hai: wo har stage ka error propagate plus cleanup karta hai.",
    followUp: "Ek EventEmitter subclass mein tum error handling ko kaise robust banaoge?",
  },
];

export default questions;
