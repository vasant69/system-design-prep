import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cbh-1",
    question: "Callback kya hai? Synchronous aur asynchronous callback mein farak batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Callback ek function hai jo doosre code ko argument ki tarah pass kiya jaata hai taaki wo use baad mein call kare. Synchronous callback usi waqt chal jaata hai (jaise `[1,2,3].map(fn)`), asynchronous callback kisi operation ke poora hone par baad ke event loop tick mein chalta hai (jaise `fs.readFile(path, cb)` ya `setTimeout(cb, 0)`).",
    detailedAnswer:
      "JavaScript mein functions first-class values hain — inhe pass, store aur return kiya ja sakta hai. Callback isi ka use hai: 'ye function le lo aur zaroorat par chala dena'. Synchronous callback: `Array.prototype.map/filter/forEach`, ya `[...].sort(compareFn)` — ye function jis line par diya us line par hi invoke ho jaata hai, aur baaki code uske baad chalta hai. Asynchronous callback: event handlers (`addEventListener`), timers (`setTimeout`), Node I/O (`fs`, `http`) — yaha callback register hota hai abhi, par actual invocation tab hoti hai jab event/operation complete ho, aur tab tak call stack khali ho chuka hota hai. Ek subtle bug 'release Zalgo' hai — ek API kabhi sync kabhi async call kare to callers ko predict karna mushkil ho jaata hai; achhi APIs consistently async call karti hain.",
    followUp: "Ek API ka callback kabhi sync kabhi async call ho to kya problem hai?",
  },
  {
    id: "cbh-2",
    question: "Callback hell kya hai? Iske concrete problems kya hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Callback hell tab hota hai jab kai sequential async steps ho aur har step agle ke callback ke andar nest ho — code daayen taraf pyramid ('pyramid of doom') ban jaata hai. Problems: padhna mushkil, `if (err) return` har level par repeat, `try/catch` async errors nahi pakadta, aur beech mein step add/remove karna poore nesting ko shift kar deta hai.",
    detailedAnswer:
      "Jab step B ko step A ke result ki zaroorat hai, tumhe B ko A ke callback ke andar likhna padta hai; C ko B ke andar, aur aage. 5-6 steps par indentation screen se bahar chali jaati hai. Concrete dard: (1) Error handling — har callback mein alag `if (err) { handle; return; }`, aur `return` bhoolna ek classic bug. (2) `try/catch` bekaar — async error next tick mein alag stack par aata hai. (3) Control flow padhna — success path 5 levels andar chhupa hota hai. (4) Refactor mushkil — ek naya step beech mein daalne se saare inner blocks ka indentation badalta hai. (5) Combine karna — 2 calls parallel chalani ho to manual counter rakhna padta hai. Fix: Promises se flat `.then` chain (ek `.catch` poore chain ke liye), ya `async/await` se top-to-bottom code aur `try/catch` wapas.",
    followUp: "Promises se pehle log callback hell kaise manage karte the?",
    redFlag: "\"Bas functions ko alag naam de do, problem solve\" — named functions nesting kam karti hain par repeated error handling aur inversion of control fix nahi karti.",
  },
  {
    id: "cbh-3",
    question:
      "Ye code likha hai:\n\n```javascript\nfunction load(cb) {\n  getUser(1, (err, user) => {\n    if (err) cb(err);\n    getPosts(user.id, (err, posts) => {\n      cb(null, posts);\n    });\n  });\n}\n```\n\nIsme kya bugs hain?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Do bugs: (1) `if (err) cb(err)` ke baad `return` nahi hai — error ke baad bhi `getPosts` chalega, aur `user` `undefined` hone par `user.id` crash karega. (2) `getPosts` ke callback mein `err` check hi nahi hai — agar posts fail huyi to error silently ignore, `cb(null, undefined)` chala jaata hai.",
    detailedAnswer:
      "Sahi version:\n\n```javascript\nfunction load(cb) {\n  getUser(1, (err, user) => {\n    if (err) return cb(err);\n    getPosts(user.id, (err, posts) => {\n      if (err) return cb(err);\n      cb(null, posts);\n    });\n  });\n}\n```\n\nDono jagah `return cb(err)` — taaki error ke baad execution ruke. Dono callbacks mein `if (err)` check. Ek aur risk: agar koi callback do baar call ho gaya (library bug) to `cb` bhi do baar chalega — ise `Promise` (guaranteed single settle) se ya ek `done` flag se roka ja sakta hai. Sabse saaf: `getUser`/`getPosts` ko promisify karke `async/await` ya `.then` chain use karo, tab error propagation apne aap ek jagah aa jaata hai.",
    followUp: "Ise `async/await` se kaise likhoge aur error handling kaha jaayega?",
  },
  {
    id: "cbh-4",
    question:
      "Callback ke saath \"inversion of control\" problem kya hai, aur Promise ise kaise theek karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Callback dene par tum apna code kisi doosri library ke haath mein de dete ho — bharosa ki wo use exactly ek baar, sahi arguments ke saath, error case mein bhi, sahi timing par call karegi. Agar wo galat behave kare (0 baar, 2 baar, kabhi nahi) to tumhara flow tootta hai. Promise state machine hai jo guarantee karta hai settle exactly ek baar hoga, aur `.then`/`.catch` control tumhare paas wapas laate hain.",
    detailedAnswer:
      "Third-party API ko callback dena matlab: control ulta ho gaya. Failure modes: (a) callback kabhi call na ho — tumhara code hamesha ke liye 'loading'; (b) do baar call ho — do baar DB write ya UI render ya payment; (c) error par call na ho — tumhara error handler dead code; (d) sync expected tha par async nikla (ya ulta) — race conditions. Promise ek object hai jo teen states mein se ek mein hota hai — pending, fulfilled, rejected — aur ek baar settle hone ke baad state lock ho jaati hai; baad ke `resolve`/`reject` calls ignore. Isliye tum library ko sirf 'ek Promise return karo' bolte ho aur consumption apne haath mein rakhte ho: `lib.doThing().then(...).catch(...)`. Plus `.catch` ek jagah, aur `Promise.all`/`race` jaise combinators.",
    followUp: "Promise settle hone ke baad dobara resolve call karo to kya hota hai?",
  },
  {
    id: "cbh-5",
    question:
      "Callbacks aaj bhi kaha appropriate hain? Sab kuch Promise/async-await mein convert kar dena chahiye?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Nahi. Callbacks recurring events aur synchronous higher-order functions ke liye sahi hain: DOM event listeners, `setInterval`, Node streams (`.on('data', ...)`), aur array methods (`map`/`filter`/`reduce`). Promise ek-baar-settle model hai, isliye baar baar fire hone wale events ke liye wo fit nahi. Sirf sequential dependent async steps ko Promise/async-await mein convert karna chahiye.",
    detailedAnswer:
      "Promise ka model hai: ek operation, ek result, ek baar. Wo perfectly fit hai network request, file read, ek timer ke liye. Lekin: (1) DOM events baar baar aate hain — `addEventListener` callback hi rahega (ya RxJS/observables). (2) Streams — data chunks aate rehte hain, `.on('data')` callback. (3) `setInterval` — recurring. (4) Array iteration — `map`/`filter` ke callbacks synchronous aur idiomatic hain, inhe async banane ki zaroorat nahi. Jab log 'callback hell' bolte hain to unka matlab sirf **nested sequential async** callbacks hai. Baaki callbacks bilkul theek hain. Node ki purani `(err, cb)` I/O APIs ko zaroor `util.promisify` ya `fs/promises` se modernize karo.",
    followUp: "Event stream ko Promise ki tarah handle karna ho to kaunsa pattern use karoge (hint: async iterator)?",
  },
];

export default questions;
