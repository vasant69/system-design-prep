import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aeh-1",
    question:
      "Ek dev ne `try { doAsync(); } catch (e) { ... }` likha (async function, no `await`). Error hone pe `catch` nahi chala. Kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`try/catch` sirf us error ko pakadta hai jo `try` block ke *execution ke dauran* throw ho. Bina `await` ke `doAsync()` turant ek pending promise deta hai aur try block exit ho jaata hai; rejection baad mein aati hai, tab tak catch scope mein nahi. `await` lagao taaki rejection try ke andar throw bane.",
    detailedAnswer:
      "`await` ka kaam hi yahi hai: pending promise ka intzaar karo, resolve pe value do, reject pe us reason ko `throw` karo — aur wo throw us waqt hota hai jab execution abhi `try` ke andar hai, isliye `catch` use pakadta hai. Bina `await`, `doAsync()` ek expression hai jo turant evaluate hoke pending promise deta hai; agar tum use return/await nahi karte to wo floating rejection ban jaata hai (unhandledRejection). Rule of thumb: `try` ke andar har async call `await` ke saath; agar deliberately fire-and-forget hai to usko `.catch()` do.",
    followUp: "`try { return doAsync(); }` aur `try { return await doAsync(); }` mein farak kya hai?",
    redFlag: "\"try/catch async ke saath kaam nahi karta\" — karta hai, bas await chahiye.",
  },
  {
    id: "aeh-2",
    question: "Node/JS mein async code ke errors handle karne ke saare tarike batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "async/await ke saath `try/catch` (await ke saath). Raw promise chains pe `.then(...).catch(...)` ya `.catch()`. Error-first callbacks mein `if (err) return ...`. Parallel work ke liye `Promise.allSettled`. Aur last-resort process hooks: `unhandledRejection`, `uncaughtException` — sirf log + exit ke liye.",
    detailedAnswer:
      "Layer by layer: (1) Callbacks — `(err, data)`, pehle `err` check, early return. (2) Promise chains — har chain ke end pe `.catch()`; beech mein `.then(onFulfilled, onRejected)` bhi possible par end-catch cleaner. (3) async/await — `try/catch`, hamesha `await` ke saath; multiple awaits ke around ek try theek hai agar recovery same hai. (4) Aggregation — `Promise.all` fail-fast, `Promise.allSettled` jab har result chahiye, `Promise.any` jab koi ek success kaafi ho. (5) Boundaries — Express/Fastify mein async route handlers ko wrapper se catch karo (ya framework ka built-in). (6) Safety net — `process.on('unhandledRejection')` / `process.on('uncaughtException')`: log with context, graceful shutdown, `process.exit(1)`; recover mat karo. Fire-and-forget promises ko hamesha `.catch()`.",
    followUp: "`Promise.all` aur `Promise.allSettled` mein se kab kaunsa choose karoge?",
    redFlag: "Sirf `try/catch` bolna aur promise-chain / process-level hooks bhool jaana.",
  },
  {
    id: "aeh-3",
    question:
      "5 downstream API calls parallel mein karni hain. Agar 1-2 fail bhi ho jaayein, baaki ke results chahiye aur endpoint 200 dena chahiye partial data ke saath. Kaise likhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`Promise.allSettled` use karo — wo kabhi reject nahi hota, har call ka `{ status, value | reason }` deta hai. Fulfilled wale filter karke value nikaalo, rejected wale log karo (aur response mein ek `errors`/`partial` flag do).",
    detailedAnswer:
      "```js\nconst calls = [a, b, c, d, e].map((url) => fetchJson(url));\nconst results = await Promise.allSettled(calls);\n\nconst data = results\n  .filter((r) => r.status === 'fulfilled')\n  .map((r) => r.value);\n\nconst failed = results\n  .filter((r) => r.status === 'rejected')\n  .map((r) => r.reason?.message);\n\nif (failed.length) log.warn({ failed }, 'partial downstream failure');\nres.json({ data, partial: failed.length > 0 });\n```\n`Promise.all` yahan galat choice hai kyunki wo pehle reject pe poora fail kar deta. Agar har call pe timeout bhi chahiye to `AbortController` ya ek `Promise.race([call, timeout])` wrap add karo. Total failure (sab reject) pe 502/504 dena reasonable hai.",
    followUp: "Har individual call pe timeout kaise lagaoge?",
  },
  {
    id: "aeh-4",
    question: "`unhandledRejection` aur `uncaughtException` handlers ka sahi role kya hai — aur galat use kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Sahi: ek aakhri diagnostic + graceful-shutdown hook. Error ko full context ke saath log karo, naye kaam lena band karo, in-flight requests drain karo (short timeout), phir `process.exit(1)` taaki supervisor fresh process de. Galat: error swallow karke app ko chalte rehna dena.",
    detailedAnswer:
      "Jab in events tak baat pahunchi, matlab ek error tumhare normal handling se bach nikla — process ka state ab bharosemand nahi (aadhe-adhoore transactions, leaked handles, inconsistent memory). Isliye recover karne ki koshish latent corruption aur memory leaks deti hai. Sahi pattern: structured logger se `err.stack` aur relevant context likho, metrics/alert fire karo, server ko `close()` karke naye connections roko, kuchh seconds ka drain timeout do, phir `process.exit(1)`. Process manager (pm2, systemd, Kubernetes) restart sambhalega. `unhandledRejection` ko routinely ignore karna ya har jagah `try {} catch {}` se dabaana — dono red flags hain; asli fix hamesha specific promise/await ko handle karna hai.",
    followUp: "Graceful shutdown mein in-flight requests ko kaise drain karoge?",
    redFlag: "`process.on('uncaughtException', () => {})` laga ke 'ab app kabhi crash nahi hoga' maan lena.",
  },
];

export default questions;
