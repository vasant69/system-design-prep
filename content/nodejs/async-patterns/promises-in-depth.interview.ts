import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pid-1",
    question: "Promise ke states kya hain aur 'settled' ka kya matlab hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Teen states: pending (abhi result nahi), fulfilled (value ke saath poora hua), rejected (reason ke saath fail hua). 'Settled' matlab fulfilled ya rejected — pending nahi. Ek baar settle ho gaya toh state aur value/reason kabhi nahi badalte.",
    detailedAnswer:
      "Promise object ke andar teen cheezein hain: state, value-ya-reason, aur registered handlers ki list. Shuru mein `pending`. `resolve(v)` call hone pe `fulfilled` with `v`; `reject(r)` pe `rejected` with `r`. Ye transition sirf ek baar hota hai — agar tum executor mein pehle `resolve` phir `reject` call karo, doosra call silently ignore ho jata hai. Isi immutability ki wajah se Promise predictable hai: tum ek settled Promise pe kitne bhi baad `.then` lagao, tumhe wahi value milegi, aur wo hamesha asynchronously (microtask mein) milegi — kabhi synchronously nahi. 'Resolved' aur 'fulfilled' thoda alag hain: 'resolved' ka matlab hai Promise 'lock ho gaya' kisi value/thenable pe — agar wo thenable hai toh state abhi bhi pending ho sakti hai jab tak wo thenable settle na ho.",
    followUp: "Agar executor mein resolve aur reject dono call karein toh kya hota hai?",
    redFlag: "\"Promise ki state kabhi bhi badal sakti hai\" — settle ke baad wo permanently fixed hai.",
  },
  {
    id: "pid-2",
    question: "Promise chain mein ek `.then` handler value return kare vs Promise return kare vs throw kare — teenon cases mein kya hota hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Plain value return → agla `.then` wo value fulfilled ke roop mein pata hai. Promise return → chain us Promise ke settle hone tak wait karti hai aur uski state adopt karti hai. Throw → us `.then` ka returned Promise reject ho jata hai aur control agle `.catch` pe chala jata hai.",
    detailedAnswer:
      "```javascript\nPromise.resolve(1)\n  .then((n) => n + 1)          // value: agla .then ko 2 milta hai\n  .then((n) => Promise.resolve(n * 10)) // Promise: chain wait karti hai, agla ko 20\n  .then((n) => { throw new Error('boom: ' + n); }) // throw: reject\n  .then((n) => console.log('skipped', n)) // SKIP — reject hai\n  .catch((e) => console.log('caught', e.message)) // 'caught boom: 20'\n  .then(() => console.log('chain recovered, continues'));\n```\n\nKey insight: har `.then`/`.catch` ek NAYA Promise return karta hai jiski state handler ke result pe depend karti hai. `.catch` bhi agar koi value return kare (ya kuch na kare) toh chain wapas fulfilled ho jati hai — isiliye `.catch` ke baad `.then` chal sakta hai. Agar handler kuch return na kare toh `undefined` se fulfilled.",
    followUp: "`.catch` ke andar se dobara throw karein toh chain ka kya hoga?",
  },
  {
    id: "pid-3",
    question: "\"Promise hell\" kya hai? Ye code theek karo: `.then(u => { return getOrders(u.id).then(o => { return getItems(o[0]); }); })`",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Promise hell = Promises use karte hue bhi `.then` ke andar `.then` nest karna — callback hell ka naya roop. Fix: flat chain banao — `.then(u => getOrders(u.id)).then(o => getItems(o[0]))`.",
    detailedAnswer:
      "Nested version:\n\n```javascript\ngetUser(id).then((u) => {\n  return getOrders(u.id).then((o) => {\n    return getItems(o[0]).then((items) => {\n      return { u, items };\n    });\n  });\n});\n```\n\nFlat version:\n\n```javascript\ngetUser(id)\n  .then((u) => getOrders(u.id))\n  .then((o) => getItems(o[0]))\n  .then((items) => ({ items }));\n```\n\nCatch: flat version mein agar tumhe `u` aur `items` dono chahiye final step mein, toh ya toh intermediate values ko `.then` ke through carry karo (`.then(u => getOrders(u.id).then(o => [u, o]))`), ya — behtar — async/await use karo jahan `u`, `o`, `items` sab ek scope mein rehte hain. Yahi wo point hai jahan async/await Promise chains se clearly jeet jata hai.",
    followUp: "Flat chain mein pehle step ka `user` aur teesre step ka result dono kaise access karoge?",
    redFlag: "\"Nesting theek hai jab tak Promises use ho rahe hain\" — nesting hi to problem thi, tool nahi.",
  },
  {
    id: "pid-4",
    question: "`.catch` chain ke beech mein rakhna vs end mein rakhna — farak kya hai? Kab kaunsa?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "End mein `.catch` = chain mein kahin bhi error ho toh ek jagah handle. Beech mein `.catch` = us point tak ki errors ko handle karke chain ko fulfilled continue karna (recovery). Beech wala tabhi jab tum sach mein us step se recover karke aage badhna chahte ho; warna hamesha end mein.",
    detailedAnswer:
      "```javascript\n// Beech ka catch — recovery pattern\nfetchPrimary(url)\n  .catch(() => fetchBackup(url)) // primary fail -> backup try karo\n  .then((data) => render(data))\n  .catch((e) => showError(e)); // sab kuch fail -> final handler\n```\n\nYahan pehla `.catch` deliberate hai — ek fallback. Lekin agar tum galti se aisa likho:\n\n```javascript\nfetchPrimary(url)\n  .catch(logIt)       // error nigal liya, undefined return\n  .then((data) => render(data.items)); // data undefined -> crash\n```\n\ntoh beech ka `.catch` error ko 'nigal' leta hai aur chain fulfilled continue karti hai `undefined` ke saath — downstream 'cannot read property of undefined'. Rule: beech ka `.catch` tabhi jab wo koi meaningful fallback value ya recovery Promise return kare; observability-only logging ke liye bhi, phir `.catch` ke andar se `throw` wapas karo taaki chain rejected rahe.",
    followUp: "Beech ke `.catch` mein sirf log karna ho par error propagate bhi karni ho toh kya likhoge?",
  },
  {
    id: "pid-5",
    question: "Interviewer: \"Yahan tumne Promise return kiya callback ke bajaye — kyun?\" Kaise answer doge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "\"Ye ek library helper hai jise kai jagah se call kiya jata hai. Promise return karke har caller ko chaining ya await ki azadi milti hai, ek jagah `.catch`, aur values automatically forward hoti hain. Repeated results chahiye hote toh main EventEmitter deta kyunki Promise ek hi baar settle hota hai.\"",
    detailedAnswer:
      "Achha answer decision dikhata hai: (1) Single async result jise aage chain karna hai → Promise/async-await, taaki callback hell na bane aur error handling centralize ho. (2) Public/reusable API → Promise return karo, callback nahi — modern consumers `await` expect karte hain, aur `Promise.all` jaise combinators tabhi kaam karte hain. (3) Immutability/composability → Promise ek value hai jise store, pass, aur multiple `.then` kiya ja sakta hai. (4) `.finally` mein resource cleanup — success/failure dono mein connection release, isse leak nahi hota. (5) Repeated events (stream data, intervals) → yahan Promise galat tool hai, EventEmitter. Interviewer sunna chahta hai ki tumne tool ko problem ke shape se match kiya, dogma se nahi.",
    followUp: "Ek callback-based legacy function ko Promise mein convert karne ke 2 tareeke batao.",
    redFlag: "\"Promise hamesha callback se behtar hai\" — repeated events aur ultra-hot zero-overhead paths ke liye nahi.",
  },
];

export default questions;
