import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "prom-1",
    question: "Promise kya hai? Uski states aur unke beech transitions batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Promise ek object hai jo abhi-ready-nahi value ko represent karta hai. Teen states: pending (settle nahi hua), fulfilled (value ke saath success), rejected (reason ke saath failure). Sirf pending→fulfilled ya pending→rejected possible hai, aur settle hone ke baad state aur value dono immutable.",
    detailedAnswer:
      "Jab tum `fetch(url)` ya `fsp.readFile(path)` call karte ho, wo turant ek Promise object deta hai — value baad mein. Us object pe `.then` (fulfilled handler), `.catch` (rejected handler), `.finally` (dono) lagate ho. Andar Promise rakhta hai: `state`, `value` (ya reason), aur pending handlers ki list. `resolve(v)` state ko fulfilled karta hai aur queued handlers ko microtask queue mein daalta hai; `reject(e)` waisa hi rejected ke liye. 'Settled' = fulfilled ya rejected — uske baad dobara resolve/reject call karna bilkul ignore ho jata hai, isliye Promise 'immutable once settled' hai.",
    followUp: "Ek baar settled Promise pe .then lagao — handler kab chalega?",
    redFlag: "\"Promise aur callback ek hi cheez hai\" — Promise ek object hai jo future value represent karta hai; callback sirf ek function hai jo aap dete ho.",
  },
  {
    id: "prom-2",
    question:
      "Promise callbacks ke liye 'exactly once' aur 'always async' guarantee ka kya matlab hai, aur ye callbacks ke muqable kyun better hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Spec kehta hai: tumhara `.then`/`.catch` handler exactly ek baar chalega, aur hamesha asynchronously (agle microtask mein) — chahe Promise pehle se settled ho. Raw callback pe ye guarantee nahi: buggy library callback ko do baar, ya kabhi sync kabhi async call kar sakti hai.",
    detailedAnswer:
      "Callback dete waqt tum control ek third party ko de dete ho (inversion of control) — bharosa ki wo callback sahi baar, ek hi baar, sahi args ke saath call karegi. Ek bug do baar call kar de toh tumhara code do baar side-effect kar deta hai. Promise spec ye lock karta hai: (1) resolve/reject ke baad dobara koi bhi call no-op hai — handler ek hi baar; (2) handler kabhi synchronously nahi chalta — 'sometimes sync, sometimes async' (Zalgo) bug khatam. Iske upar: flat chaining (pyramid nahi), ek `.catch()` poore flow ke liye, aur `Promise.all`/`race`/`allSettled` se composition. IsliC sequential ya parallel async work ke liye Promise default hai; raw callback sirf single event listener ya legacy API ke liye.",
    followUp: "Zalgo (sometimes-sync-sometimes-async) bug ek example se samjhao.",
  },
  {
    id: "prom-3",
    question:
      "Ek minimal Promise-jaisa object kaise banaoge? Kaunsi 3 cheezein andar chahiye?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Andar chahiye: (1) `state` — pending/fulfilled/rejected; (2) `value` — fulfilled value ya rejection reason; (3) pending handlers ki list. `resolve`/`reject` state set karte hain (sirf agar pending) aur handlers ko `queueMicrotask` se schedule karte hain.",
    detailedAnswer:
      "```javascript\nclass MiniPromise {\n  constructor(executor) {\n    this.state = 'pending';\n    this.value = undefined;\n    this.cbs = [];\n    const settle = (state, value) => {\n      if (this.state !== 'pending') return; // ek hi baar\n      this.state = state;\n      this.value = value;\n      queueMicrotask(() => this.cbs.forEach((cb) => this._run(cb)));\n    };\n    try {\n      executor((v) => settle('fulfilled', v), (e) => settle('rejected', e));\n    } catch (e) {\n      settle('rejected', e);\n    }\n  }\n  _run({ onOk, onFail }) {\n    if (this.state === 'fulfilled') onOk && onOk(this.value);\n    else onFail && onFail(this.value);\n  }\n  then(onOk, onFail) {\n    if (this.state === 'pending') this.cbs.push({ onOk, onFail });\n    else queueMicrotask(() => this._run({ onOk, onFail }));\n    return this; // real spec: naya Promise for chaining\n  }\n  catch(onFail) { return this.then(undefined, onFail); }\n}\n```\n\nKey points jo interviewer sunna chahta hai: `if (this.state !== 'pending') return` — ye 'settle only once' hai; `queueMicrotask` — handlers hamesha async; executor ko turant chalao aur throw ko reject mein badlo. Real spec ka extra: `then` ek naya Promise return karta hai aur handler ke return value / thrown error / returned-thenable ko unwrap karta hai.",
    followUp: "then ko real chaining dene ke liye kya badloge?",
  },
  {
    id: "prom-4",
    question:
      "`Promise.all`, `Promise.allSettled`, aur `Promise.race` mein farak? Har ek kab use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`Promise.all` — sab fulfilled toh results ka array; koi ek reject toh poora turant reject (fail-fast). `Promise.allSettled` — kabhi reject nahi hota; har ek ka `{status, value|reason}` deta hai. `Promise.race` — jo pehle settle ho (fulfill ya reject) wahi result.",
    detailedAnswer:
      "`Promise.all([...])`: independent kaam jinke sab result chahiye aur ek bhi fail matlab poora kaam bekaar — jaise ek page render karne ke liye 4 zaroori API calls. `Promise.allSettled([...])`: batch jobs jahan partial success acceptable hai — 100 emails bhejo, jo fail huye unki list chahiye, baaki cancel nahi karne. `Promise.race([...])`: timeout pattern — `Promise.race([doWork(), rejectAfter(5000)])`; ya multiple mirrors mein se jo pehle jawab de. Ek aur: `Promise.any` (Node 15+) — pehla **fulfilled** chahiye, rejections ignore jab tak sab fail na ho jayein.",
    followUp: "Promise.all ke saath ek fail hone par baaki Promises ka kya hota hai?",
    redFlag: "\"Promise.all fail hone par baaki Promises cancel ho jate hain\" — nahi, wo chalte rehte hain; sirf combined Promise reject ho jata hai.",
  },
  {
    id: "prom-5",
    question:
      "Sequential await/then chain vs Promise.all — kab kya, aur galat choose karne ka nuqsaan kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Agar step B ko step A ka result chahiye → sequential (chain / await ek ke baad ek). Agar steps independent hain → Promise.all se parallel. Independent kaam ko sequential karna N-guna slow; dependent kaam ko Promise.all mein daalna galat data ya crash.",
    detailedAnswer:
      "```javascript\n// GALAT: 3 independent queries sequential — ~3x slow\nconst a = await getProfile(id);\nconst b = await getSettings(id);\nconst c = await getNotifications(id);\n\n// SAHI: parallel\nconst [a, b, c] = await Promise.all([\n  getProfile(id), getSettings(id), getNotifications(id),\n]);\n```\n\nUlta case: agar `getSettings` ko `getProfile` ka `orgId` chahiye, toh unhe `Promise.all` mein nahi daal sakte — wahan sequential hi sahi hai. Rule: dependency graph dekho. Jitne bhi nodes ka koi incoming dependency nahi, wo ek `Promise.all` batch mein ja sakte hain. Production impact: ek dashboard endpoint jo 6 counts sequentially fetch karta tha 900ms leta tha; Promise.all ke baad 180ms.",
    followUp: "Agar 50 queries parallel chalani hon toh Promise.all safe hai ya kuch aur chahiye?",
  },
];

export default questions;
