import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sva-1",
    question:
      "Synchronous aur asynchronous function mein farak batao, ek-ek example ke saath.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Sync function apna kaam poora karke usi line pe result return ya throw karta hai — `JSON.parse(str)`, `fs.readFileSync(path)`. Async function turant return ho jata hai aur result baad mein deta hai — callback se (`fs.readFile(path, cb)`) ya Promise se (`fs.promises.readFile(path)` / `await`).",
    detailedAnswer:
      "Ye API ke 'shape' ka farak hai — result kaise wapas milta hai. Sync: `const data = fs.readFileSync('a.txt', 'utf8')` — agli line pe `data` ready hai, error `throw` hoti hai jise `try/catch` pakadta hai. Async: `fs.readFile('a.txt', 'utf8', (err, data) => {...})` — call turant return karti hai `undefined`, aur `data` callback ke andar baad mein aata hai; ya `const data = await fs.promises.readFile('a.txt', 'utf8')` — function ek Promise deta hai jo settle hone par value/error carry karta hai.\n\nDhyan: sync/async 'shape' hai, blocking/non-blocking 'event loop pe asar' hai. `readFileSync` dono hai (sync shape + blocking). Ek `for` loop crore baar chale toh wo blocking hai lekin usko 'sync API' nahi bolte kyunki wo koi API hi nahi. Overlap hai, identity nahi.",
    followUp: "`arr.map(fn)` sync hai ya async? Blocking hai ya nahi?",
    redFlag:
      "\"Async matlab multi-threaded / parallel\" — async single thread pe hi hota hai; wo sirf wait ke doran thread ko free karta hai.",
  },
  {
    id: "sva-2",
    question:
      "Kya ek asynchronous function ko synchronous bana sakte ho — matlab uska result seedha `return` karwa sakte ho?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Cleanly nahi. Agar underlying kaam async (I/O) hai toh result async hi milega. `deasync` / `sync-request` jaisi hacks event loop ko native level pe spin karti hain — unsafe (reentrancy, deadlock, Node upgrade pe break). Sahi jawaab: apne function ko bhi `async` bana do.",
    detailedAnswer:
      "Options jo log try karte hain aur kyun wo galat hain:\n\n1. Busy-wait: `let done = false; setTimeout(() => done = true, 100); while (!done) {}` — permanent hang. Event loop us `while` loop me atka hai, toh `setTimeout` ka callback kabhi schedule hi nahi ho paayega. Deadlock.\n\n2. `deasync` npm package — C++ addon jo `uv_run` ko nested call karta hai jab tak Promise settle na ho. Isse event loop reentrant ho jata hai: doosre pending callbacks (unrelated requests ke) beech me chal jate hain, jo state corruption / surprising bugs deta hai. Plus native addon Node ke har major version pe rebuild/break ho sakta hai.\n\n3. `Atomics.wait` + worker + `SharedArrayBuffer` — sirf numeric/serializable shared data ke liye, aur ye bhi calling thread ko block karta hai, toh main thread pe use karna poora async fayda khatam kar deta hai.\n\nSahi design: agar `getUser` I/O karta hai, wo async rahega; usko call karne wala `getDashboard` bhi `async` ho jayega; aur upar tak jab tak koi boundary (route handler, `main`) `await` se consume na kare. Ye 'async colors' / 'async bubbles up' kehte hain, aur ye intended hai.",
    followUp: "`deasync` ke bina agar tumhe genuinely ek CLI me sync-style flow chahiye toh top-level await kaise madad karta hai?",
    redFlag: "\"Haan, `deasync` se ho jata hai\" bina uske risks bataye.",
  },
  {
    id: "sva-3",
    question:
      "\"Async viral hota hai\" ya \"function colors\" — iska kya matlab hai? Ek example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Jaise hi ek function async banta hai, uska result use karne wale sabhi callers ko bhi async banna padta hai (await/then), aur ye chain unke callers tak upar phailti hai — jab tak koi boundary (route handler, event listener, main) Promise ko consume na kar le.",
    detailedAnswer:
      "Example: shuru me `getConfig()` sync tha (local file, `readFileSync`). Feature flags remote service se lene the, toh `getConfig()` ke andar ek HTTP call aa gaya — ab wo inherently async hai. Consequence:\n\n```javascript\n// pehle\nfunction getConfig() { return JSON.parse(fs.readFileSync('c.json')); }\nfunction startServer() { const c = getConfig(); app.listen(c.port); }\n\n// baad me\nasync function getConfig() { const r = await fetch(URL); return r.json(); }\nasync function startServer() { const c = await getConfig(); app.listen(c.port); }\nstartServer();\n```\n\n`getConfig` async hua -> `startServer` ko `async` + `await` karna pada -> `startServer()` ko top level pe call/await karna pada. Ye 'viral' spread hai. Ise problem nahi, consistency samjho: naya kaam likhte waqt maan lo I/O async hoga aur function ko upfront `async` rakho. Boundary pe (Express handler `async (req,res) => {}`) chain clean khatam hoti hai.",
    followUp: "Is spread ko chhota rakhne ke liye architecture me kya karte ho (I/O ko kahan isolate karna)?",
  },
  {
    id: "sva-4",
    question:
      "`async` keyword lagane se function 'faster' ya 'parallel' ho jata hai — sahi ya galat? `await a(); await b();` ke baare mein batao.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Galat. `async` sirf return ko Promise banata hai aur `await` allow karta hai — koi speed ya parallelism nahi. `await a(); await b();` sequential hai: `b` tab shuru hota hai jab `a` settle ho jaye. Parallel chahiye toh `await Promise.all([a(), b()])`.",
    detailedAnswer:
      "`async`/`await` sirf syntax aur control-flow hai, execution model nahi badalta. Do independent async operations:\n\n```javascript\n// SEQUENTIAL — total time = a + b\nconst x = await a();\nconst y = await b();\n\n// CONCURRENT — total time = max(a, b)\nconst [x, y] = await Promise.all([a(), b()]);\n```\n\nDusre form me `a()` aur `b()` dono turant start ho jate hain (Promises ban jate hain), phir `Promise.all` dono ke settle hone ka wait karta hai. Agar `b` ko `a` ke result ki zaroorat hai tabhi sequential zaroori hai. Common mistake: ek loop me `for (const id of ids) { await fetchOne(id); }` — N round-trips serially; agar independent hain toh `await Promise.all(ids.map(fetchOne))` (ya concurrency-limited version bade N ke liye).",
    followUp: "1000 ids ke liye `Promise.all(ids.map(fetchOne))` me kya problem ho sakti hai, aur fix?",
    redFlag: "Har async call ko reflexively `await` karna bina soche ki wo independent hain aur parallel ho sakte the.",
  },
  {
    id: "sva-5",
    question:
      "Code output: `console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D');` — output order kya hoga aur kyun?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`A D C B`. Pehle sync code: `A`, `D`. Phir current macrotask khatam hone par microtask queue drain hoti hai: `C` (Promise `.then`). Phir agla macrotask: `B` (`setTimeout` callback).",
    detailedAnswer:
      "Step by step: (1) `console.log('A')` — sync, turant: `A`. (2) `setTimeout(cb, 0)` — `cb` ko timer/macrotask queue me schedule kiya, abhi nahi chalta. (3) `Promise.resolve().then(cb2)` — `cb2` ko microtask queue me daala. (4) `console.log('D')` — sync: `D`. Ab call stack khali. Event loop rule: har macrotask ke baad, agla macrotask uthaane se pehle, poori microtask queue drain karo. Toh `cb2` chalta hai: `C`. Ab microtask queue khali, event loop agla macrotask uthata hai: `setTimeout` ka `cb`: `B`. Final: `A D C B`. Key insight: Promise callbacks (microtasks) hamesha `setTimeout`/I/O callbacks (macrotasks) se pehle chalte hain, chahe timeout `0` ho. Ye sync-vs-async timing samajhne ka core hai.",
    followUp: "Agar `.then` ke andar ek aur `setTimeout` aur ek aur `Promise.then` ho toh order kaise change hoga?",
    redFlag: "\"`setTimeout(fn, 0)` ka matlab turant chalega\" — 0 sirf minimum delay hai, aur microtasks pehle nikalte hain.",
  },
];

export default questions;
