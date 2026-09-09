import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aaw-1",
    question:
      "`async/await` promises ke upar kya add karta hai? Internally kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Add karta hai readability — async code sync-jaisa top-to-bottom, aur `try/catch`, loops, conditionals natural lagte hain. Internally: `async` function ek promise return karta hai; `await` function ko pause karke promise ka wait karta hai aur settle pe resume — `.then` ka syntactic sugar.",
    detailedAnswer:
      "`async` keyword function ko guarantee deta hai ki wo promise return karega (non-promise return auto-wrapped, throw se rejected promise). `await p` internally aisa hai jaise baaki function ko `p.then(rest)` mein daal diya ho — function suspend hota hai, control caller ko jaata hai, aur `p` settle hone pe continuation ek microtask ki tarah queue hoti hai. Isi wajah se `await` ke baad ka code `setTimeout` se pehle par current sync code ke baad chalta hai.",
    followUp:
      "`await` ke baad ka code microtask hai ya macrotask — aur ye kyun matter karta hai?",
    redFlag: "'`await` thread ko block karta hai' — function pause hota hai, thread nahi.",
  },
  {
    id: "aaw-2",
    question:
      "`async function f() { console.log('a'); await null; console.log('b'); } console.log('start'); f(); console.log('end');` — output?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`start`, `a`, `end`, `b`. `f()` synchronously `'a'` tak chalta hai; `await null` par `f` suspend, control wapas — `'end'` chalta hai; phir microtask mein `'b'`.",
    detailedAnswer:
      "`f()` call hote hi uska body sync chalta hai jab tak pehla `await` na aaye — isliye `'a'` turant. `await null` ko `Promise.resolve(null)` treat kiya jaata hai; `f` yahin ruk jata hai aur baaki function continuation microtask ban jata hai. Control caller ko: `'end'` print. Ab stack khaali — microtask queue se continuation — `'b'`. Key insight: `await` non-promise value pe bhi ek microtask tick introduce karta hai.",
    followUp: "`await null` ki jagah `await Promise.resolve()` ho to kuch badlega?",
    redFlag:
      "`start a b end` bolna — maan liya `await` ke aage ka function sync continue hota hai.",
  },
  {
    id: "aaw-3",
    question:
      "Ek loop mein 100 user IDs hain aur har ID ke liye API call. `for...of` ke andar `await` likha hai aur ye bahut slow hai. Kya galat hai, kaise theek karoge, aur risk kya?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`for...of` + `await` calls ko serial kar deta hai — 100 * latency. Fix: `await Promise.all(ids.map((id) => fetchUser(id)))` se parallel. Risk: 100 concurrent requests server ya rate-limit ko maar sakti hain — batching ya concurrency limit use karo.",
    detailedAnswer:
      "Serial version tab sahi jab har call ka result agle ke liye chahiye ya order-sensitive side effects hon. Independent reads ke liye `Promise.all(map(...))` — sab ek saath, total lagbhag ek call jitna. Lekin unbounded parallelism ke apne problems: socket exhaustion, `429 Too Many Requests`, memory spike. Practical: chunks of 10, ya ek concurrency-limited pool. `Promise.allSettled` use karo agar kuch calls fail ho sakti hain aur tumhe baaki results chahiye.",
    followUp: "Concurrency ko 10 pe limit kaise karoge bina library ke?",
    redFlag:
      "`forEach(async ...)` likh dena aur maan lena wo await hota hai — `forEach` promises ko ignore karta hai.",
  },
  {
    id: "aaw-4",
    question:
      "`[1, 2, 3].forEach(async (n) => { await save(n); }); console.log('all saved');` — `'all saved'` sahi jagah print hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. `forEach` async callback ke returned promise ko ignore karta hai — wo `await` nahi karta. `'all saved'` turant chalega jab `save` calls abhi pending hain.",
    detailedAnswer:
      "`forEach` ka contract: callback ka return value discard. To har `async` callback ek floating promise return karta hai jise koi nahi await karta. `'all saved'` ek sync line hai, wo teeno `save` ke settle hone se pehle print ho jata hai; agar `save` reject kare to `unhandledRejection`. Sahi: `for (const n of [1, 2, 3]) { await save(n); }` (serial) ya `await Promise.all([1, 2, 3].map((n) => save(n)))` (parallel).",
    followUp:
      "`for...of await` aur `Promise.all(map)` mein se yahan kaunsa, aur kyun?",
    redFlag:
      "'`forEach` await ko handle kar leta hai' — nahi, sirf `for...of` aur `for` loops karte hain.",
  },
];

export default questions;
