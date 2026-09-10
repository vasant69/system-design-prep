import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "paa-1",
    question: "`await` asal me kya karta hai, aur kya wo kuch block karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`await p` current async function ko tab tak suspend karta hai jab tak `p` settle na ho, phir value ke saath resume karta hai ya rejection reason throw karta hai. Wo thread block nahi karta — event loop baaki code chalata rehta hai; sirf ye function paused hai. Resumption ek microtask hai.",
    detailedAnswer:
      "Ek `async` function pehle `await` tak synchronously chalta hai, caller ko pending promise return karta hai, aur baaki ko continuation ke roop me schedule karta hai. Toh `await` bina block kiye sequential-dikhne wala code deta hai. Isiliye tum CPU-bound work ko await karke tez nahi kar sakte — wait karne ko kuch nahi hai, work abhi bhi main thread par chalta hai.",
    followUp: "Do independent awaited calls ko concurrently kaise chalaoge?",
  },
  {
    id: "paa-2",
    question: "`for (const item of items) { await save(item); }` vs `await Promise.all(items.map(save))` — trade-offs?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`for...of` version sequential hai: ek time par ek save, ordered, reason karna aasaan, low peak load, par slow. `Promise.all(map)` sab ek saath fire karta hai: fastest, par unordered completion, aur ye server ya DB connection pool ko overwhelm kar sakta hai, aur pehli failure par reject karke baaki kho deta hai.",
    detailedAnswer:
      "Practice me tum aksar bounded concurrency chahte ho — maan lo 5 at a time — ek chhote pool / `p-limit`-jaise helper se, ya `allSettled` agar sab attempt karke har outcome collect karna hai. Note `items.forEach(async ...)` dono me se kuch bhi sahi nahi karta: `forEach` promises ignore karta hai isliye kuch bhi await nahi hota.",
    redFlag: "Hazaaron DB writes par `Promise.all` use karna aur connection-pool exhaustion se surprise hona.",
  },
  {
    id: "paa-3",
    question: "Promise.all, allSettled, race, aur any compare karo.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "all: saari values ke saath resolve, pehli rejection par reject. allSettled: sabke liye wait, kabhi reject nahi, har ek ke liye `{status,value|reason}`. race: jaise hi koi settle ho, value ya error. any: pehla fulfilment resolve, sirf tab reject jab har input reject kare (AggregateError ke saath).",
    detailedAnswer:
      "`all` chuno 'mujhe har result chahiye aur koi bhi failure fatal hai' ke liye; `allSettled` dashboards / batch jobs ke liye jahan partial success theek hai; `race` timeouts ke liye (`race([work, timeout(ms)])`); `any` 'kai mirrors try karo, pehla success jeeta' ke liye. Common bug: dashboard ke liye `all` use karna aur ek flaky widget poore page ko blank kar deta hai.",
  },
];

export default questions;
