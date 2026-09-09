import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pcomb-1",
    question:
      "`Promise.all`, `allSettled`, `race`, `any` — chaaron ka farak ek-ek line mein, aur ek real use case each.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`all`: sab fulfil -> values array; ek reject -> turant reject. `allSettled`: sabke settle ka wait, kabhi reject nahi, `{ status, ... }` array. `race`: pehla jo bhi settle (fulfil ya reject). `any`: pehla fulfil; sab reject -> `AggregateError`.",
    detailedAnswer:
      "Use cases: `all` — ek dashboard ke 5 independent API calls, sab chahiye. `allSettled` — 100 records ka bulk sync, jo fail ho unka bhi hisaab chahiye. `race` — `Promise.race([fetchData(), timeout(5000)])` se request ko timeout dena. `any` — ek resource ko do mirrors se maango, jo pehle de wo lo. Note: `race` empty array pe forever pending; `all` empty pe `[]` se fulfil, `any` empty pe reject.",
    followUp:
      "`Promise.race` aur `Promise.any` mein se timeout implement karne ke liye kaunsa aur kyun?",
    redFlag:
      "`race` aur `any` ko same samajhna — `race` first settle, `any` first fulfil.",
  },
  {
    id: "pcomb-2",
    question:
      "`Promise.all([Promise.resolve(1), Promise.reject('e'), Promise.resolve(3)]).then((v) => console.log('ok', v)).catch((e) => console.log('err', e))` — kya print hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`err e`. Ek input reject hai isliye `Promise.all` us reason (`'e'`) se reject ho jata hai; `.then` skip, `.catch` chalta hai. `1` aur `3` kahin use nahi hote.",
    detailedAnswer:
      "`Promise.all` ka rule: jaise hi koi ek input reject hota hai, output promise usi reason se reject — baaki inputs ka wait nahi. Yahan `Promise.reject('e')` already rejected hai, to `.all` agle microtask mein reject ho jata hai. `1` aur `3` fulfilled the par unse kaam nahi. Agar `Promise.allSettled(...)` hota to output `[{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'e' }, { status: 'fulfilled', value: 3 }]` se fulfil hota.",
    followUp: "Same array `allSettled` ke saath — output kya?",
    redFlag: "`ok [1, undefined, 3]` bolna — `all` partial results nahi deta.",
  },
  {
    id: "pcomb-3",
    question:
      "Tumhe ek API request pe 3-second timeout chahiye — 3s ke andar response na aaye to error. Kaise?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`Promise.race([fetch(url), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))])`. Jo pehle settle ho — asli response ya timeout rejection — wahi jeetta hai.",
    detailedAnswer:
      "`race` isliye sahi kyunki hume 'pehla settle' chahiye, chahe wo success ho ya (timeout ka) failure. Behtar: modern `AbortController` se actual request bhi cancel karo — `const c = new AbortController(); setTimeout(() => c.abort(), 3000); fetch(url, { signal: c.signal })` — warna `race` jeetne ke baad bhi request background mein chalti rehti hai. `Promise.any` yahan galat — wo timeout rejection ko ignore kar deta, hume timeout ko 'jeetne' dena hai.",
    followUp:
      "`race` timeout jeet gaya — asli `fetch` ka kya hota hai, aur usse kya problem?",
    redFlag:
      "Timeout ke liye `Promise.any` use karna, ya request abort na karna (resource leak).",
  },
  {
    id: "pcomb-4",
    question:
      "`const results = await Promise.all(items.map(async (i) => { await process(i); }));` — `results` mein kya aayega?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`results` mein `[undefined, undefined, ...]` — async callback kuch `return` nahi karta, isliye har promise `undefined` se fulfil hota hai. Fix: `return process(i)` ya `return await process(i)`.",
    detailedAnswer:
      "`map` ka async callback ek promise deta hai jo callback ke `return` value se fulfil hota hai. Yahan koi return nahi (`await process(i)` ka result discard), to `undefined`. `Promise.all` ka array isliye sab `undefined`. Ye tab bite karta hai jab tum `process` ke result collect karna chahte the. Sahi: `items.map((i) => process(i))` (async keyword ki zaroorat hi nahi agar sirf ek await hai) ya `items.map(async (i) => { const r = await process(i); return transform(r); })`.",
    followUp:
      "Yahan `async` keyword ki zaroorat hai bhi ya `items.map((i) => process(i))` kaafi hai?",
    redFlag:
      "`Promise.all` ke results ko bina check kiye use karna jab callback return nahi karta.",
  },
];

export default questions;
