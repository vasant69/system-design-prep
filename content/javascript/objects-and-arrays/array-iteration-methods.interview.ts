import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "arr-iter-1",
    question: "map aur forEach mein kya farak hai? Kaunsa kab use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`map` ek naya array return karta hai jismein har element transform hua hota hai (same length) — use jab tumhe transformed array chahiye, aur callback pure hona chahiye. `forEach` `undefined` return karta hai aur sirf side effects ke liye hai (log, DOM update, external push). Return use nahi kar rahe to `map` galat choice hai.",
    detailedAnswer:
      "Dono har element pe callback chalate hain, farak result mein hai. `map` output ka har slot callback ke return se banta hai, isliye `const doubled = nums.map(n => n * 2)`. `forEach` return collect nahi karta — `nums.forEach(n => console.log(n))`. `map` chainable hai (`.map().filter()`), `forEach` nahi (undefined pe chain nahi). Practical rule: agar `map` ka result kisi variable, return, ya aage ki chain mein nahi ja raha, to wo galat hai — reader ko lagega array chahiye tha, aur `array-callback-return` ESLint rule flag karega; wahan `forEach` ya `for...of`. Aur agar loop mein `break` ya sequential `await` chahiye to dono chhod ke `for...of`.",
    followUp: "`map` ka result chahiye hi nahi par side effect bhi karna hai — kya karoge?",
    redFlag: "\"dono same hain, map thoda modern hai\" — return value ka farak core hai.",
  },
  {
    id: "arr-iter-2",
    question: "filter aur find mein kya farak hai? id se ek user dhoondhna ho to kaunsa?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`filter` saare matching elements ka array return karta hai (0, 1, ya zyada — hamesha array, empty ho sakta hai) aur poora array scan karta hai. `find` pehla matching element ya `undefined` return karta hai aur pehla match milte hi ruk jata hai. Id lookup ke liye `find`.",
    detailedAnswer:
      "`filter` tab jab tumhe subset ya list chahiye — ya count (`arr.filter(pred).length`). `find` tab jab tumhe ek specific item chahiye. `users.filter(u => u.id === 5)[0]` do tarah se kharab hai: poora array scan hota hai (find index 3 pe ruk jata, filter 10 lakh dekhta), aur ek single-element throwaway array banta hai. `find` ka ek trap: agar koi match na mile to `undefined` deta hai, to `users.find(u => u.id === x).name` crash karega — hamesha `users.find(...)?.name` ya pehle null-check. Index chahiye element ki jagah to `findIndex` (`-1` on no match). Aakhri match chahiye to `findLast` / `findLastIndex` (ES2023).",
    followUp: "`find` ne `undefined` diya aur tumne `.name` access kiya — kya hoga aur kaise bachoge?",
  },
  {
    id: "arr-iter-3",
    question:
      "`orders.filter(o => o.paid).map(o => o.amount).reduce((a, b) => a + b, 0)` — ye chain thik hai? Kabhi problem?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Readability ke liye badhiya aur chhote/medium arrays pe bilkul thik. Lekin ye array pe **3 passes** karta hai aur 2 intermediate arrays allocate karta hai. Lakhon elements ya hot path pe ek single `for...of` ya `reduce` behtar — ek pass, zero extra array.",
    detailedAnswer:
      "`filter` poora input ghoomta hai aur naya array banata hai; `map` us naye array ko dubara ghoomta hai aur ek aur naya array banata hai; `reduce` teesri baar. Chhote data pe ye microseconds hai aur clarity jeeti — main aksar chain hi likhta hoon. Bade data (analytics, log processing, tight render loops) pe:\n\n```javascript\nlet total = 0;\nfor (const o of orders) {\n  if (o.paid) total += o.amount;\n}\n```\n\nEk pass, koi intermediate allocation nahi. Beech ka rasta: `reduce` mein hi condition daal do — `orders.reduce((sum, o) => o.paid ? sum + o.amount : sum, 0)`. Premature optimization se bacho — pehle profile karo, phir chain todo.",
    followUp: "Lazy evaluation (generators / transducers) is problem ko kaise solve karte hain?",
  },
  {
    id: "arr-iter-4",
    question: "Loop mein async kaam sequential karna hai. `forEach` kyun nahi chalega?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`forEach` apne callback se return hui promise ko ignore karta hai — wo saare callbacks turant fire kar deta hai aur await nahi karta. Result: saara async kaam parallel chalta hai aur `forEach` ke baad ka code un promises ke settle hone se pehle chal jata hai. Sequential ke liye `for...of` + `await`.",
    detailedAnswer:
      "```javascript\n// GALAT - forEach promises ignore karta hai\nitems.forEach(async (i) => { await save(i); });\nconsole.log('done'); // saare save se pehle chalta hai\n\n// SAHI - sequential\nfor (const i of items) {\n  await save(i);\n}\n\n// SAHI - parallel par completion ka wait\nawait Promise.all(items.map((i) => save(i)));\n```\n\n`for...of` async function ke andar har iteration pe genuinely rukta hai. Jab order matter kare (ya rate-limit / backpressure chahiye) to `for...of`. Jab items independent hain aur speed chahiye to `Promise.all(map(...))` — par dhyaan rakho ye saare ek saath fire karta hai, 10000 items pe server ko flood kar sakta hai (tab `p-limit` jaisa concurrency cap).",
    followUp: "1000 items hain par ek saath sirf 5 requests chahiye — kaise?",
  },
  {
    id: "arr-iter-5",
    question: "some, every, includes, indexOf — inme kya farak hai aur kaunsa kab?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`some(fn)` -> `true` agar kam se kam ek element predicate pass kare (pehla true pe rukta). `every(fn)` -> `true` agar sab pass karein (pehla false pe rukta; khali array pe `true`). `includes(x)` -> boolean, exact value hai ya nahi (`NaN`-safe). `indexOf(x)` -> index ya `-1` (`NaN` miss karta hai).",
    detailedAnswer:
      "`some`/`every` predicate function lete hain aur short-circuit karte hain — `roles.some(r => r === 'admin')` permission check ke liye. `every` ka khali-array `true` edge case yaad rakho: `[].every(x => x.valid)` `true` deta hai, to 'non-empty aur sab valid' ke liye `arr.length > 0 && arr.every(...)`. `includes` vs `indexOf`: dono value dhoondhte hain (predicate nahi), par `includes` `SameValueZero` use karta hai to `[NaN].includes(NaN)` `true`, jabki `indexOf` strict `===` use karta hai to `[NaN].indexOf(NaN)` `-1`. Sirf presence chahiye to `includes` readable; position chahiye to `indexOf`; predicate se dhoondhna ho to `some` (boolean) ya `findIndex` (position).",
    followUp: "`[NaN].includes(NaN)` `true` aur `[NaN].indexOf(NaN)` `-1` kyun?",
  },
];

export default questions;
