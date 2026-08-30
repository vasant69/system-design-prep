import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aad-1",
    question:
      "async/await Promises ke upar syntax sugar hai — iska matlab kya, aur wo internally kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Nayi capability add nahi hoti — bas Promise code readable ho jata hai. `async` function ko engine ek state machine mein compile karta hai. `await p` par: engine `p` ko `Promise.resolve` se wrap karta hai, function ka current state save karta hai, function return kar deta hai (caller ko pending Promise), aur `p` settle hone par ek microtask function ko usi jagah se resume karta hai — fulfilled value dekar ya rejection ko us line par `throw` karke.",
    detailedAnswer:
      "`async` do guarantees deta hai: function hamesha Promise return karega (`return v` -> fulfill, `throw e` -> reject), aur uske andar `await` use ho sakta hai. `await` ke do critical facts: (1) wo thread block nahi karta — sirf us ek function ko suspend karta hai; event loop, timers, doosre requests chalte rehte hain. (2) Resume hamesha microtask mein — `await Promise.resolve(1)` bhi turant resume nahi hota, ek microtask hop leta hai. Isliye `await` ke baad ki line kabhi usi synchronous tick mein nahi chalti. Payoff: code top-to-bottom padhta hai, `try/catch/finally` wapas kaam karta hai, aur har `await` ka result ek normal `const` mein rakh ke aage use kar sakte ho.",
    followUp: "`await` ke baad ki line agle event loop tick mein chalti hai ya microtask mein? Farak kyun matter karta hai?",
    redFlag:
      "\"`await` server ko block kar deta hai / doosre requests ruk jaate hain\" — nahi, wo sirf current async function ko suspend karta hai.",
  },
  {
    id: "aad-2",
    question:
      "Sequential `await` vs `Promise.all` — kab kaunsa? Ek concrete latency example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dependency ho (B ko A ki value chahiye) to sequential `await`. Independent ho to `Promise.all` — sab ek saath launch, total time ~sabse dheemi wali. 3 calls @ 100ms: sequential = ~300ms, `Promise.all` = ~100ms.",
    detailedAnswer:
      "```javascript\n// SEQUENTIAL — B ko A chahiye\nconst user = await getUser(id);\nconst org = await getOrg(user.orgId);\n\n// PARALLEL — independent\nconst [a, b, c] = await Promise.all([getProfile(id), getSettings(id), getPrefs(id)]);\n```\n\nSequential har call ka poora intezaar karta hai agli shuru karne se pehle. `Promise.all` teeno turant shuru karta hai (kyunki teeno `getX(id)` calls `await` se pehle evaluate ho jaati hain) aur sabke complete hone tak pause. Loop mein ye pitfall aur bhi bada: `for (const id of ids) await fetchRow(id)` — 1000 × 20ms = 20s; `Promise.all(ids.map(fetchRow))` = milliseconds (network/DB limit tak). Lekin unbounded `Promise.all` bade N par DB pool exhaust kar sakta hai — tab `p-limit(10-25)` ya batching. Jab order ya rate-limit matter karta hai, sequential `for...await` jaanbujh ke sahi hai.",
    followUp: "1000 items ko parallel process karna hai lekin DB pool sirf 20 connections ka hai — kya karoge?",
  },
  {
    id: "aad-3",
    question:
      "`array.forEach(async (x) => { await f(x); })` — is code mein kya galat hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`forEach` apne callback ke returned Promise ko ignore karta hai. Isliye `forEach` ke baad ki line tab chal jaati hai jab `f(x)` calls abhi chal rahe hote hain, aur agar koi `f(x)` reject kare to wo unhandled rejection ban jaati hai — error kho jaata hai. `for...of` + `await` (sequential) ya `await Promise.all(array.map(f))` (parallel) use karo.",
    detailedAnswer:
      "`forEach` ka contract hai: har element par callback call karo, return value discard karo. Jab callback `async` hai, wo ek Promise return karta hai jo `forEach` phenk deta hai — to na wait hota hai, na error propagate hota hai.\n\n```javascript\nasync function main() {\n  const ids = [1, 2, 3];\n  ids.forEach(async (id) => {\n    await save(id); // agar save(2) reject kare -> unhandled rejection\n  });\n  console.log('done'); // ye turant chalega, saves abhi chal rahe honge\n}\n```\n\nFix:\n```javascript\nfor (const id of ids) { await save(id); }        // sequential, ordered\n// ya\nawait Promise.all(ids.map((id) => save(id)));      // parallel, errors caught\n```\n\n`map` `forEach` se isliye theek hai kyunki wo Promises ka array return karta hai jise `Promise.all` collect kar sakta hai.",
    followUp: "`for await...of` kis situation ke liye hai?",
    redFlag: "`forEach` ke saath `async` callback likhna aur maan lena ki wo await karta hai.",
  },
  {
    id: "aad-4",
    question:
      "\"Missing await\" ya \"floating promise\" kya hai? Ek real bug scenario do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek async function ko call karna par uska Promise `await` ya `.catch` na karna. Wo background mein chalta hai; agar fail ho to unhandled rejection, aur ho sakta hai response uske complete hone se pehle chala jaye ya ordering galat ho.",
    detailedAnswer:
      "```javascript\napp.post('/order', async (req, res) => {\n  const order = await createOrder(req.body);\n  saveAuditLog(order);   // <-- missing await, async function\n  res.json(order);       // response chala jaata hai, audit shayad abhi likha nahi\n});\n```\n\nProblems: (1) agar `saveAuditLog` reject kare -> unhandled rejection (Node v15+ par process crash). (2) Response `saveAuditLog` ke complete hone se pehle bhej diya — agar wo fail ho to client ko `200` mila lekin audit missing. (3) Serverless (Lambda) mein handler return hote hi execution freeze — audit call kabhi complete nahi hota.\n\nFix: `await saveAuditLog(order);` — ya agar jaanbujh ke fire-and-forget karna hai to `saveAuditLog(order).catch(logError);` explicitly, taaki rejection handled rahe aur intent clear ho. Linters (`no-floating-promises`) isse pakadte hain.",
    followUp: "Fire-and-forget genuinely chahiye — ek background metrics call. Sahi tareeka kya?",
  },
  {
    id: "aad-5",
    question:
      "Kya `await` CPU-bound kaam ko non-blocking bana deta hai? `const hash = await expensiveSyncHash(data)` ka kya hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Nahi. Agar `expensiveSyncHash` synchronous hai, `await` kuch nahi badalta — wo function event loop par hi chalega aur poore duration ke liye block karega. `await` sirf tab kuch karta hai jab uske aage ek Promise ho jo genuinely async I/O ka wait kar raha ho.",
    detailedAnswer:
      "`await x` mein agar `x` ek plain value (ya sync function ka result) hai, wo `Promise.resolve(x)` mein wrap ho jaata hai aur ek microtask hop ke baad resume ho jaata hai — lekin `expensiveSyncHash(data)` pehle **pura synchronously chal chuka hota hai** `await` ke reach karne se pehle. To agar wo 200ms CPU leta hai, event loop 200ms freeze rehta hai, `await` ke bawajood.\n\nCPU-bound kaam ke liye asli fix: `worker_threads` (ya `piscina` pool) par offload karo, ya ek alag service. `await` non-blocking-ness sirf I/O ke liye deta hai — jab actual wait OS/network/disk ke paas hota hai aur main thread free ho jaata hai.\n\n```javascript\n// galat — abhi bhi blocks\nconst hash = await heavySyncHash(buf);\n// sahi — worker par\nconst hash = await pool.run({ buf });\n```",
    followUp: "`worker_threads` aur `child_process` mein is use case ke liye kya farak hai?",
    redFlag: "\"async laga do to fast/non-blocking ho jayega\" — CPU work ke liye async keyword kuch nahi karta.",
  },
];

export default questions;
