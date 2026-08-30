import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "prom-1",
    question: "Promise kya hai? Iske states aur lifecycle samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Promise ek object hai jo ek future value ko represent karta hai. Teen states: pending (kaam chal raha), fulfilled (value ke saath successful), rejected (reason/error ke saath fail). Settle (fulfil ya reject) exactly ek baar hota hai aur uske baad state kabhi nahi badalti.",
    detailedAnswer:
      "Jab tum `new Promise((resolve, reject) => {...})` banate ho, executor function synchronously turant chalta hai. Uske andar jab async kaam poora hota hai to tum `resolve(value)` ya `reject(error)` call karte ho. Consumer `.then(onFulfilled)`, `.catch(onRejected)`, `.finally(onSettled)` se result use karta hai. Key guarantees: (1) settle sirf ek baar — pehla `resolve`/`reject` jeetta hai, baaki silently ignore; (2) state monotonic — pending se fulfilled/rejected, wapas nahi; (3) `.then` callbacks hamesha asynchronously chalte hain (microtask queue mein), chahe promise pehle se settled ho. Practically tum khud `new Promise` kam likhte ho — `fetch`, `fs/promises`, DB drivers already Promise dete hain; `new Promise` mostly purani callback API ko wrap karne ke liye.",
    followUp: "Ek already-resolved promise par `.then` lagao to callback sync chalega ya async?",
    redFlag: "\"Promise settle hone ke baad dobara resolve karne se value update ho jaati hai\" — nahi, wo call ignore ho jaati hai.",
  },
  {
    id: "prom-2",
    question: "Promise chaining kaise kaam karti hai? `.then` mein value vs promise return karne mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Har `.then` ek naya promise return karta hai, isliye calls chain hoti hain. Agar `.then` handler ek plain value return kare, wo value agle `.then` ko milti hai. Agar wo ek promise return kare, chain us promise ka wait karti hai aur uski resolved value ko unwrap karke agle `.then` ko deti hai. `throw` karne par chain reject ho kar agle `.catch` par chali jaati hai.",
    detailedAnswer:
      "Ye 'flattening' behaviour hi callback hell ko khatam karta hai:\n\n```javascript\nfetchUser(id)\n  .then(user => fetchOrders(user.id))   // promise return -> chain wait karti hai\n  .then(orders => orders[0])            // plain value -> aage pass\n  .then(first => console.log(first.id)) // kuch return nahi -> agle ko undefined\n  .catch(err => console.error(err));    // kisi bhi step ka reject/throw yaha\n```\n\nRules: (1) plain value return -> next `.then` ko wahi value; (2) promise return -> uska wait, phir unwrapped value next ko; (3) `throw` ya returned promise reject -> beech ke `.then` skip, next `.catch`; (4) kuch return nahi -> `undefined`. Common bug: `return` bhoolna — `.then(u => { fetchOrders(u.id); })` chain ko wait nahi karwata aur us fetch ka error 'escape' kar jaata hai (unhandled rejection).",
    followUp: "`.catch` ke baad chain continue kar sakti hai? Kya milega agle `.then` ko?",
  },
  {
    id: "prom-3",
    question:
      "`Promise.all`, `Promise.allSettled`, `Promise.race`, aur `Promise.any` — chaaron kab use karoge? Ek-ek concrete example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`all` — sab chahiye, koi ek fail = poora fail (dashboard ke 3 zaroori API). `allSettled` — sab try karo, partial success OK (100 users ko notification). `race` — jo pehle settle ho, fulfil ya reject (fetch par timeout lagana). `any` — jo pehle fulfil ho (multiple CDN mirrors se jo pehle de).",
    detailedAnswer:
      "`Promise.all([...])` fail-fast hai: sab fulfilled hone par values ka array (input order mein) deta hai; pehla reject hote hi poora reject. `Promise.allSettled([...])` kabhi reject nahi hota — sab settle hone par `{status:'fulfilled', value}` / `{status:'rejected', reason}` objects ka array. `Promise.race([...])` pehla promise jo bhi settle kare (fulfil YA reject) uske result/reason se settle — timeout pattern: `Promise.race([fetch(url), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))])`. `Promise.any([...])` pehla fulfilled leta hai aur rejections ignore karta hai jab tak koi fulfil ho; sab reject huye to `AggregateError`. Trap: `race` empty array par forever pending; `all` empty array par turant `[]` se resolve.",
    followUp: "`Promise.all` mein ek promise reject ho gaya — baaki promises ka kya hota hai, cancel ho jaate hain?",
  },
  {
    id: "prom-4",
    question:
      "Output predict karo:\n\n```javascript\nconsole.log('1');\nPromise.resolve().then(() => console.log('2'));\nconsole.log('3');\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Output: 1, 3, 2. `console.log('1')` aur `console.log('3')` synchronous hain. `.then` ka callback microtask queue mein jaata hai aur tab chalta hai jab current synchronous code poora ho jaaye — isliye '2' sabse baad mein, chahe promise pehle se resolved ho.",
    detailedAnswer:
      "Promise pehle se resolved hone ke bawajood, `.then` ka callback kabhi synchronously nahi chalta — wo microtask queue mein enqueue hota hai. Event loop pehla saara synchronous code (call stack) khatam karta hai, phir microtask queue drain karta hai. Isliye: sync `1`, sync `3`, phir microtask `2`. Agar isme `setTimeout(() => console.log('4'), 0)` bhi add karein to wo macrotask hai aur microtasks ke baad chalega — order ban jaata hai `1, 3, 2, 4`. Ye event-loop ke microtask-before-macrotask rule ka seedha application hai.",
    followUp: "Isme `setTimeout(() => console.log('0'), 0)` sabse upar add kar doon to output kya hoga?",
  },
  {
    id: "prom-5",
    question:
      "Team ne 8 API calls `Promise.all` mein daali. Kabhi kabhi poora page 'error' dikhata hai jabki sirf ek minor widget ka API down hota hai. Kya galat hai aur kaise theek karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`Promise.all` fail-fast hai — 8 mein se ek bhi reject hote hi poora `all` reject ho jaata hai aur baaki 7 successful results discard ho jaate hain. Fix: critical vs non-critical calls ko alag karo. Critical ke liye `Promise.all`, non-critical ke liye `Promise.allSettled` (ya har widget apna independent promise + local error state).",
    detailedAnswer:
      "Sahi design: (1) Page tabhi 'error' dikhaye jab koi genuinely required data missing ho — un 2-3 calls ko ek `Promise.all` mein rakho. (2) Baaki 5-6 optional widgets ke liye `Promise.allSettled` use karo aur result array par iterate karke fulfilled wale render karo, rejected wale par us widget mein chhota 'failed to load' state dikhao. (3) Alternatively har widget ko apna data khud fetch karne do (React mein per-component query) — ek ka fail doosre ko affect nahi karega. (4) `Promise.all` par timeout wrapper bhi lagao (`Promise.race` se) taaki ek slow call poore page ko na roke. Interview point: `Promise.all` cancel nahi karta baaki calls — wo chalti rehti hain, bas unke results ignore ho jaate hain.",
    followUp: "Rejected promises jinke results `Promise.all` ignore kar deta hai — unke unhandled rejection warnings kaise aayenge?",
  },
];

export default questions;
