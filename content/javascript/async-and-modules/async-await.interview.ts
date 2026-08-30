import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aa-1",
    question: "async/await Promises se kaise related hai? Kya ye unhe replace karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "async/await Promises ke upar syntax sugar hai, replacement nahi. `async` function hamesha ek Promise return karta hai, aur `await` sirf ek Promise ke saath kaam karta hai — wo us Promise ke settle hone tak function ko pause karke resolved value deta hai (ya reject par throw). Combinators jaise `Promise.all`/`race`/`allSettled` abhi bhi zaroori hain.",
    detailedAnswer:
      "`async` lagane se: (1) function jo bhi return kare wo `Promise.resolve(...)` mein wrap ho jaata hai; agar function `throw` kare to returned promise reject hota hai. (2) Function body mein `await` allowed ho jaata hai. `await p` engine ko bolta hai: `p` ka `.then` internally attach karo, function ko yahin suspend karo, aur settle par resolved value ke saath resume karo (rejection par us jagah `throw`). Yaani `const x = await p` roughly `p.then(x => /* baaki function */)` ke barabar hai, bas readable. Isiliye async/await Promises ko replace nahi karta — wo unhi ke upar chalta hai. Jaha multiple promises compose karni ho (parallel, timeout, first-to-finish) waha `Promise.all`/`race`/`any`/`allSettled` hi use hote hain, bhale hi tum unpe `await` laga do.",
    followUp: "`async` function ke andar `return await p` aur `return p` mein kya farak hai?",
    redFlag: "\"async/await aane ke baad Promise ki zaroorat nahi\" — Promise.all/race abhi bhi chahiye aur andar sab Promise hi hai.",
  },
  {
    id: "aa-2",
    question: "`await` thread ko block karta hai? UI freeze kyun nahi hoti?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. `await` sirf enclosing async function ka execution pause karta hai aur control caller ko wapas de deta hai — baaki program (event handlers, doosre callbacks, rendering) chalta rehta hai. Awaited promise settle hone par function ka baaki hissa microtask ke roop mein resume hota hai. Ye ek `while` loop jaise synchronous blocking se bilkul alag hai.",
    detailedAnswer:
      "Synchronous blocking (bada loop, `alert`, `readFileSync`) call stack ko occupy karke rakhta hai, isliye event loop kuch aur nahi chala sakta — clicks, timers, paint sab ruk jaate hain. `await` iske ulat hai: jab engine `await` par pahunchta hai, wo async function ko suspend karke stack se hata deta hai; stack khali ho jaata hai; event loop free hai baaki kaam ke liye. Jab promise settle hota hai, continuation microtask queue mein aata hai aur function wahin se aage chalta hai. Isiliye `await fetch(...)` ke dauran page fully responsive rehta hai. Ek nuance: `await` se pehle ka synchronous code (aur pehla `await` hit hone tak sab) synchronously hi chalta hai — sirf `await` ke baad ka hissa defer hota hai.",
    followUp: "Agar async function ke andar bhari CPU loop ho (await ke bina), to kya wo UI block karega?",
  },
  {
    id: "aa-3",
    question:
      "Ek loop mein 100 items process karne hain, har ek pe ek async DB call. `for...of` + `await` vs `Promise.all(items.map(...))` — kab kaunsa?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`for...of` + `await` items ko ek-ek karke process karta hai (sequential) — total time = sum of all calls, par DB par load controlled aur order guaranteed. `Promise.all(items.map(fn))` sabko ek saath fire karta hai (parallel) — total time = slowest call, par 100 concurrent connections DB ko flood kar sakti hain. Beech ka rasta: batched/limited concurrency.",
    detailedAnswer:
      "Sequential (`for (const item of items) { await save(item); }`) chuno jab: har call agle par depend karti hai, ya order matter karta hai, ya downstream system rate-limited hai, ya tum DB ko 100 concurrent writes se bachana chahte ho. Parallel (`await Promise.all(items.map(save))`) chuno jab: calls independent hain, count chhota/bounded hai, aur latency minimize karni hai. 100 jaise bade count ke liye best practice hai **limited concurrency** — ek pool of e.g. 10 (p-limit library, ya manual chunking: items ko 10-10 ke groups mein baant ke har group `Promise.all`, groups sequential). Isse latency bhi theek aur resource bhi safe. `.forEach(async ...)` kabhi mat — wo `await` ignore karta hai aur 'done' saare saves se pehle aa jaata hai.",
    followUp: "Limited concurrency (e.g. ek waqt mein max 5) khud kaise implement karoge bina library ke?",
  },
  {
    id: "aa-4",
    question:
      "Output predict karo:\n\n```javascript\nasync function f() {\n  console.log('B');\n  await Promise.resolve();\n  console.log('D');\n}\nconsole.log('A');\nf();\nconsole.log('C');\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Output: A, B, C, D. `console.log('A')` sync. `f()` call hote hi uske andar `await` se pehle ka `console.log('B')` synchronously chalta hai. `await` par `f` suspend ho kar control lauta deta hai, `console.log('C')` chalta hai. Sync code khatam hone par microtask queue se `f` resume hota hai — `console.log('D')`.",
    detailedAnswer:
      "Key insight: `async` function ka body pehle `await` tak **synchronously** chalta hai. Steps: (1) `'A'` print. (2) `f()` invoke — `'B'` print (abhi tak sync). (3) `await Promise.resolve()` — promise turant resolved hai par `await` phir bhi function ko suspend karta hai aur continuation ko microtask queue mein daalta hai; control `f()` ke caller ko wapas. (4) `'C'` print. (5) Call stack khali — event loop microtask queue drain karta hai — `f` resume, `'D'` print. Isliye `A B C D`. Agar `await` ke baad `setTimeout` bhi hota to wo `D` ke baad (macrotask) aata.",
    followUp: "`await Promise.resolve()` ko `await 42` se replace kar doon to output badlega?",
    redFlag: "\"B ke baad D aayega kyunki promise already resolved hai\" — await hamesha continuation ko defer karta hai.",
  },
  {
    id: "aa-5",
    question: "async/await ke saath error handling kaise karte ho? try/catch ke bahar await karne se kya hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Awaited promise reject ho to `await` us jagah `throw` kar deta hai, isliye `try/catch` (aur `finally`) phir se kaam karte hain — `await` ko `try` block ke andar rakho jaha recover karna hai. `try/catch` ke bahar `await` reject ho to error seedha enclosing async function ke returned promise ko reject kar deta hai aur uske caller tak propagate hota hai.",
    detailedAnswer:
      "Pattern: `try { const data = await risky(); use(data); } catch (err) { handle(err); } finally { cleanup(); }`. Yaha `finally` cleanup (spinner band, connection close) ke liye ideal hai kyunki wo success aur failure dono par chalta hai. Agar tum error ko yaha handle nahi karna chahte, `await` ko `try` ke bahar rakho — reject caller tak bubble ho jaayega aur wahi handle karega (central error boundary pattern). Gotchas: (1) `try` ke andar `await` na karo aur promise ko sirf create karke chhod do — floating promise ka reject `catch` mein nahi aayega. (2) `Promise.all` mein ek reject hone par `all` reject hota hai — `try/catch` use pakad lega, par baaki successful results kho jaate hain (`allSettled` chahiye agar wo chahiye). (3) Non-Error values throw mat karo — hamesha `throw new Error(...)` taaki stack trace mile.",
    followUp: "Ek async function jo kai jagah await karta hai — har await ke around alag try/catch, ya ek bada try/catch? Trade-off?",
  },
];

export default questions;
