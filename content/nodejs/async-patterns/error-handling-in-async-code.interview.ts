import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ehac-1",
    question: "Async code mein error kahan catch karna chahiye? Koi guiding principle?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Error wahan catch karo jahan tum uske baare mein kuch meaningful kar sakte ho: retry, fallback value, user ko proper message, ya context add karke rethrow. Agar us jagah pe tum kuch nahi kar sakte, catch mat karo — use propagate hone do jahan koi decide kar sake.",
    detailedAnswer:
      "Concrete decision tree: (1) Retryable + idempotent → call site pe catch, `withRetry` lagao. (2) Sensible default hai → catch karke default return karo (`getFeatureFlags().catch(() => DEFAULTS)`). (3) User-facing request → request boundary (Express error middleware) pe catch, 4xx/5xx map karo. (4) Sirf context chahiye → catch, `new AppError(code, { cause: err })` se wrap karo, rethrow. (5) Kuch nahi kar sakte → catch hi mat karo. Anti-pattern jo bahut dikhta hai: har function `try { ... } catch (e) { console.error(e); throw e; }` — ye duplicate logs deta hai, stack trace ko clutter karta hai, aur asli handler ko chhupa deta hai. Ek achha codebase mein try/catch kam jagah par hota hai, strategic points pe.",
    followUp: "\"Context add karke rethrow\" karte waqt original error kaise preserve karoge?",
    redFlag: "\"Sab kuch top-level pe ek bade try/catch mein wrap kar dete hain\" — isse har error same treatment paati hai aur recovery ka mauka khatam.",
  },
  {
    id: "ehac-2",
    question: "`return promise` vs `return await promise` — farak kab dikhta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Farak sirf `try/catch` (ya `try/finally`) ke andar dikhta hai. Bina try block ke dono practically same. `try` ke andar: `return await promise` zaroori hai, warna rejection function ke return hone ke baad hoti hai aur local `catch` use miss kar deta hai.",
    detailedAnswer:
      "```javascript\nasync function a() {\n  try {\n    return fetchThing(); // rejection yahan try se 'escape' kar jaati hai\n  } catch (e) {\n    return fallback(); // fetchThing reject kare toh ye NAHI chalega\n  }\n}\n\nasync function b() {\n  try {\n    return await fetchThing(); // rejection function ke andar throw hoti hai\n  } catch (e) {\n    return fallback(); // ab ye chalega\n  }\n}\n```\n\n`a()` mein `return fetchThing()` function ko us pending Promise ke saath exit kara deta hai; jab wo reject hoti hai, `a` ka execution context ja chuka, `catch` dead hai, rejection caller ko milti hai. `b()` mein `await` engine ko function ke andar hi rejection throw karne ko kehta hai. Bina `try/catch` ke, `return await` thoda redundant hai (ek extra microtask tick) par galta nahi — aur stack traces behtar aate hain, isliye kai teams `return await` ko default rakhte hain.",
    followUp: "Bina try/catch ke bhi `return await` rakhne ka koi fayda hai?",
  },
  {
    id: "ehac-3",
    question: "Ek flaky external API ke saath resilient kaise banoge? Retry design ke details batao.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Retry-with-exponential-backoff-plus-jitter, sirf transient errors pe (`isRetryable` guard), sirf idempotent operations (ya `Idempotency-Key` ke saath), attempts ~3 tak cap, aur upar se ek timeout wrapper. Repeated failure pe circuit breaker.",
    detailedAnswer:
      "```javascript\nasync function withRetry(fn, { retries = 3, baseMs = 200 } = {}) {\n  for (let i = 0; i <= retries; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (i === retries || !isRetryable(err)) throw err;\n      const wait = baseMs * 2 ** i + Math.random() * 100; // backoff + jitter\n      await new Promise((r) => setTimeout(r, wait));\n    }\n  }\n}\n```\n\nKey decisions: (1) **Backoff** — 200/400/800ms, server ko recover hone ka time. (2) **Jitter** — random component taaki saare clients ek saath retry na karein (thundering herd). (3) **`isRetryable`** — `ECONNRESET`/`ETIMEDOUT`/`502`/`503`/`504`/`429` haan; `400`/`401`/`404`/validation nahi (dobara bhi fail hoga). (4) **Idempotency** — non-idempotent POST ko blind retry mat karo; `Idempotency-Key` header bhejo taaki server duplicate detect kare. (5) **Timeout** — `withTimeout(fn(), 3000)` har attempt pe, hang na ho. (6) **Circuit breaker** (`opossum`) — agar service 50% calls fail kar rahi hai toh kuch der ke liye call hi mat karo, fail fast.",
    followUp: "Retry storm kya hai aur jitter usse kaise bachata hai?",
    redFlag: "\"Har error ko 5 baar retry kar dete hain\" — non-transient errors pe retry sirf latency aur load 5x karta hai.",
  },
  {
    id: "ehac-4",
    question: "`Promise.race` se timeout wrapper likho. Isme kaunsi 2 gotchas hain?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Wrapper: `Promise.race([work, timeoutRejectAfterMs])`. Gotcha 1: `clearTimeout` `.finally` mein karo, warna dangling timer event loop ko `ms` tak alive rakhta hai. Gotcha 2: timeout jeetne pe underlying `work` cancel nahi hota — wo background mein chalta rehta hai; actual cancellation ke liye `AbortController`.",
    detailedAnswer:
      "```javascript\nfunction withTimeout(promise, ms, label = 'op') {\n  let timer;\n  const timeout = new Promise((_, reject) => {\n    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);\n  });\n  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));\n}\n```\n\nGotcha 1 detail: agar `promise` 50ms mein resolve ho gaya par tumne `clearTimeout` nahi kiya, `setTimeout` ka timer `ms` (e.g. 3000ms) tak pending rehta hai — ek CLI script exit nahi karega, aur ek hot path pe timers accumulate honge. Gotcha 2 detail: `Promise.race` sirf 'pehla settle' return karta hai; haari hui Promise abhi bhi chal rahi hai. Ek `fetch` jise timeout ho gaya wo abhi bhi socket hold kiye hai. Fix: `fetch(url, { signal: controller.signal })` aur timeout pe `controller.abort()`.",
    followUp: "AbortController ke saath fetch timeout kaise likhoge?",
  },
  {
    id: "ehac-5",
    question: "`Promise.all` aur `Promise.allSettled` mein kab kaunsa? Ek real example do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`Promise.all`: jab tumhe SAARE results chahiye aur koi ek bhi fail hone ka matlab pura operation invalid hai (fail-fast sahi hai) — jaise ek transaction ke liye 3 mandatory lookups. `Promise.allSettled`: jab partial results acceptable hon — dashboard, fan-out notifications, batch processing — koi fail kare toh baaki phir bhi useful.",
    detailedAnswer:
      "```javascript\n// Promise.all — sab chahiye, ek fail = abort\nconst [user, account, limits] = await Promise.all([\n  getUser(id), getAccount(id), getLimits(id),\n]);\n// limits fail hua toh aage badhna hi galat hai -> throw sahi\n\n// Promise.allSettled — best effort\nconst results = await Promise.allSettled(\n  subscribers.map((s) => notify(s)),\n);\nconst failed = results.filter((r) => r.status === 'rejected');\nfailed.forEach((r) => deadLetter.push(r.reason));\n// 3 notifications fail hue toh baaki 97 phir bhi gaye\n```\n\n`allSettled` kabhi reject nahi karta — har element `{status: 'fulfilled', value}` ya `{status: 'rejected', reason}`. Isliye uske baad tumhe manually fulfilled/rejected filter karna padta hai. Real bug jo `allSettled` fix karta hai: ek dashboard `Promise.all` se 8 services laata tha, ek service deploy ke dauran down hone se pura dashboard blank; `allSettled` se 7 render hote hain aur 1 pe 'unavailable'.",
    followUp: "`Promise.any` aur `Promise.race` bhi hain — wo kab use karoge?",
    redFlag: "\"allSettled hamesha behtar hai kyunki wo throw nahi karta\" — jab ek missing result poore operation ko invalid kar deta hai, fail-fast hi sahi hai.",
  },
];

export default questions;
