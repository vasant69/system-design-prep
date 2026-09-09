import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "prom-1",
    question: "Promise kya hai? Uske states aur guarantees batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Promise ek async operation ke future result ka object hai. States: `pending`, phir `fulfilled` (value ke saath) ya `rejected` (reason ke saath). Guarantee: settle sirf ek baar, uske baad immutable; `.then`/`.catch` handlers hamesha async (microtask) chalte hain, chahe promise pehle se settled ho.",
    detailedAnswer:
      "Ek promise bante waqt `pending` hota hai. Executor `resolve(v)` call kare to `fulfilled`, `reject(e)` ya throw kare to `rejected`. Pehli settlement ke baad koi bhi aur `resolve`/`reject` no-op hai. Handlers: `.then(onFulfilled, onRejected)`, shorthand `.catch`, aur `.finally` cleanup ke liye. Important: agar tum already-resolved promise pe `.then` lagao to bhi callback abhi nahi, current sync code ke baad microtask mein chalta hai — is consistency se code ka order predictable rehta hai.",
    followUp:
      "`.then` callback synchronously chal sakta hai kya agar promise already resolved ho?",
    redFlag:
      "'Promise ka matlab code parallel chalta hai' — promise sirf ek value ka wrapper hai, concurrency runtime deta hai.",
  },
  {
    id: "prom-2",
    question:
      "`console.log('1'); Promise.resolve().then(() => console.log('2')); console.log('3');` — output?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`1 3 2`. `.then` callback microtask hai — sync code (`1`, `3`) pehle poora chalta hai, phir call stack khaali hone pe microtask (`2`).",
    detailedAnswer:
      "`Promise.resolve()` already-fulfilled promise deta hai, par `.then` callback fir bhi turant nahi chalta — wo microtask queue mein jaata hai. Sync statements top-to-bottom: `1`, phir `3`. Script ka sync part khatam, stack empty — event loop microtask queue drain karta hai — `2`. Agar yahan `setTimeout(() => console.log('4'), 0)` bhi hota to wo `2` ke baad aata (macrotask microtask ke baad).",
    followUp: "Isi mein `setTimeout(..., 0)` add karein to wo kahan print hoga?",
    redFlag: "`1 2 3` bol dena — maan liya `.then` synchronous hai.",
  },
  {
    id: "prom-3",
    question:
      "`somePromise.then(onOk).catch(onErr)` vs `somePromise.then(onOk, onErr)` — farak?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`.then(onOk, onErr)` mein `onErr` sirf `somePromise` ke rejection ko pakadta hai — `onOk` ke andar aaya error nahi. `.then(onOk).catch(onErr)` mein `onErr` chain mein `onOk` ke baad hai, isliye `somePromise` AUR `onOk` dono ke errors pakadta hai.",
    detailedAnswer:
      "`.then(f, g)` mein `g` ko `f` ke throw se koi lena-dena nahi — wo `f` ke saath 'sibling' hai. `.then(f).catch(g)` mein `g` chain mein `f` ke baad hai, isliye `f` ka rejection bhi `g` tak pahunchta hai. 90% cases mein `.catch` end mein chahiye. `.then(f, g)` tab useful jab tum `f` ke errors ko deliberately alag (ya un-handled) rakhna chahte ho.",
    followUp: "Kabhi `.then(f, g)` form genuinely kab chahiye?",
    redFlag:
      "'Dono same hain' — `onOk` ke andar ka error catch hone mein farak hai.",
  },
  {
    id: "prom-4",
    question:
      "Ek existing callback-based function `getData(id, cb)` hai (error-first). Isse `await` karne layak kaise banaoge, aur error propagation kaise hoga?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Ek promise wrapper banao: `const getDataP = (id) => new Promise((res, rej) => getData(id, (err, data) => (err ? rej(err) : res(data))));`. Phir `try { const d = await getDataP(1); } catch (e) { ... }` — `err` reject ban ke `catch` mein aata hai.",
    detailedAnswer:
      "Manual wrapper upar jaisa, ya Node mein `const getDataP = util.promisify(getData)` (error-first signature ke liye built-in). Ab `getDataP` ek promise return karta hai jise chain ya await kar sakte ho. Error-first ka `err` `reject(err)` ban jaata hai, jo `await` pe `try/catch` mein throw hota hai ya `.catch()` mein aata hai. Dhyaan: agar callback galti se `res` aur `rej` dono call kar de to promise 'settle once' rule se sirf pehli settlement rakhega.",
    followUp:
      "`util.promisify` kaunse callback signature ke liye kaam karta hai, aur non-standard signature ke liye kya?",
    redFlag:
      "Callback ke andar `res(data)` call karna bhool ke wrapper ko forever pending chhod dena.",
  },
];

export default questions;
