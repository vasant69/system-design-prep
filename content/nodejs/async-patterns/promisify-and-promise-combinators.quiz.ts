import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "promisify-and-promise-combinators-1",
    question:
      "`Promise.all` aur `Promise.allSettled` mein core farak kya hai?",
    options: [
      "Dono bilkul same hain, sirf naam alag hai",
      "`Promise.all` fail-fast hai — ek bhi rejection poore combinator ko reject kar deta hai; `Promise.allSettled` KABHI reject nahi karta — wo har input ka `{status, value | reason}` object collect karta hai",
      "`Promise.all` sequential chalata hai, `Promise.allSettled` parallel",
      "`Promise.allSettled` sirf 2 promises leta hai, `Promise.all` unlimited",
    ],
    correctIndex: 1,
    explanation:
      "`Promise.all`: sab fulfil -> resolve with values array; koi ek reject -> turant reject (baaki cancel nahi hote, results discard). `Promise.allSettled`: sab settle -> resolve with `{status: 'fulfilled', value}` ya `{status: 'rejected', reason}` objects ka array; kabhi reject nahi. Use `all` jab ek fail = pura invalid; `allSettled` jab partial results OK (dashboards, fan-out, batch). Option C galat — dono inputs ko parallel launch karte hain. Option D galat.",
    difficulty: "medium",
  },
  {
    id: "promisify-and-promise-combinators-2",
    question:
      "`Promise.race` aur `Promise.any` mein kya farak hai?",
    options: [
      "Dono pehla fulfilment return karte hain",
      "`Promise.race` PEHLE SETTLE (fulfil YA reject) par rukta hai — agar wo settle ek reject hai to race reject karta hai; `Promise.any` rejections ko ignore karta hai aur PEHLE FULFIL ka intezaar karta hai, sirf jab SAB reject karein tab `AggregateError` deta hai",
      "`Promise.race` sabse dheemi promise ka wait karta hai",
      "`Promise.any` Node mein exist nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "`race`: pehla settle jeetta hai — timeout wrapper ke liye (jahan reject bhi ek valid 'result' hai). `any`: pehla successful fulfilment jeetta hai — redundant mirrors ke liye (fastest healthy). Agar fastest mirror `500` de, `race` wo reject return karega, `any` next successful ka intezaar karega. Sab reject -> `any` `AggregateError` deta hai jiska `.errors` array mein saare reasons. Option A `race` ko galat batata hai. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "promisify-and-promise-combinators-3",
    question:
      "`const results = await Promise.all(ids.map((id) => fetchItem(id)));` — `ids` mein 5000 entries hain. Kya problem hai?",
    options: [
      "Koi problem nahi — Promise.all automatically batch karta hai",
      "`ids.map(...)` synchronously 5000 Promises bana deta hai, matlab 5000 `fetchItem` calls turant in-flight — DB connection pool (usually 10-25) exhaust, upstream rate-limit `429`, memory spike; concurrency ko `p-limit`, manual pool, ya chunking se bound karo",
      "`Promise.all` sirf 10 promises accept karta hai, baaki error dega",
      "`.map` ko `.forEach` se replace karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`Promise.all` batching NAHI karta — wo `.map` se bane saare Promises ko ek saath launch karta hai. 5000 concurrent ops se pool exhaust, `429`s, aur memory (buffers, socket objects) spike. Fix: `p-limit(15)` (`ids.map((id) => limit(() => fetchItem(id)))`), ek manual `mapLimit` (Set + `Promise.race`), ya chunking. Typical concurrency `n` = 10-25. Option A galat — koi auto-batching nahi. Option C galat — no limit. Option D `forEach` results collect nahi karta.",
    difficulty: "hard",
  },
  {
    id: "promisify-and-promise-combinators-4",
    question:
      "`util.promisify(obj.method)` bina `.bind` ke use karne par kya hota hai?",
    options: [
      "Kuch nahi, wo hamesha theek kaam karta hai",
      "Promisified function ke andar jab original method call hota hai to `this` `undefined` ho jata hai — `TypeError: Cannot read properties of undefined`; fix hai `util.promisify(obj.method.bind(obj))`",
      "`util.promisify` automatically `this` ko `obj` bind kar deta hai",
      "Ye ek syntax error hai",
    ],
    correctIndex: 1,
    explanation:
      "`obj.method` ko bare reference ki tarah promisify karne se wo apne object se detach ho jata hai; call hone par `this` `undefined`, aur method ke andar `this.connection` jaisa access crash karta hai. Ye DB clients aur EventEmitter-style objects par khaas kar bites. Fix: `util.promisify(obj.method.bind(obj))`. Option C galat — promisify `this` handle nahi karta. Option D galat — valid syntax hai, bas runtime par crash.",
    difficulty: "medium",
  },
];

export default quiz;
