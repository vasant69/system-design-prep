import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sva-1",
    question:
      "Synchronous aur asynchronous code mein kya farak hai? Ek example do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Sync code line-by-line chalta hai — har line agli ko block karti hai. Async code slow kaam (timer, network, file) runtime ko deta hai aur turant aage badh jaata hai; result baad mein callback, promise ya await se aata hai. Example: `readFileSync` blocks, `readFile` aur `fetch` nahi.",
    detailedAnswer:
      "Sync: `const x = compute(); use(x);` — `use` tab tak nahi chalta jab tak `compute` return na kare. Async: `fetch('/api').then(use); doNext();` — `doNext()` pehle chal sakta hai kyunki `fetch` ka kaam network pe ho raha hai, JS thread pe nahi. JS ek hi call stack rakhta hai; jab wo khaali hota hai to event loop callback queue se ready callbacks uthata hai. Isliye async ka fayda: ek thread ke bawajood app I/O ke wait mein freeze nahi hota — 50 requests ek saath in-flight ho sakti hain.",
    followUp:
      "Agar JS single-threaded hai to 50 requests ek saath kaise chal sakti hain?",
    redFlag:
      "'Async matlab code alag thread pe chalta hai' — I/O off-thread hota hai, aapka JS callback nahi.",
  },
  {
    id: "sva-2",
    question:
      "`console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);` — output?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`1 4 3 2`. Sync pehle (`1`, `4`), phir microtask (`3`, promise), phir macrotask (`2`, setTimeout).",
    detailedAnswer:
      "Execution order: (1) sync code top-to-bottom — `1`, phir `4`. `setTimeout` callback macrotask queue mein, `.then` callback microtask queue mein chala jaata hai bina chale. (2) Call stack khaali — event loop pehle poori microtask queue drain karta hai — `3`. (3) Phir ek macrotask — `2`. `setTimeout(..., 0)` ka `0` sirf 'jitni jaldi ho sake' hai, 'abhi' nahi — aur microtasks hamesha usse pehle.",
    followUp:
      "Agar `.then` ke andar ek aur `Promise.resolve().then(...)` ho to wo `setTimeout` se pehle chalega ya baad mein?",
    redFlag:
      "`1 2 3 4` ya `1 4 2 3` bolna — microtask vs macrotask priority nahi pata.",
  },
  {
    id: "sva-3",
    question:
      "Ek button click handler mein 200000 items ka heavy sync loop hai aur user complain karta hai ki page hang ho jaata hai. Kya ho raha hai, kaise theek karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Synchronous heavy loop call stack ko block kar raha hai, isliye event loop paint aur dusre events process nahi kar paata. Fix: kaam ko chunks mein todo (`setTimeout` ya `requestIdleCallback` se yield), ya Web Worker pe offload karo.",
    detailedAnswer:
      "JS single-threaded hai — jab tak wo loop return nahi karta, browser na render kar sakta hai na click process. Options: (1) Kaam ko batch karo aur har batch ke baad `await new Promise((r) => setTimeout(r))` se event loop ko saans do. (2) `requestIdleCallback` ya `requestAnimationFrame` se idle time mein thoda-thoda karo. (3) Sabse saaf: computation ko Web Worker (alag thread) pe bhejo aur result `postMessage` se lo — main thread bilkul free rehta hai. Async wrapper akele se CPU kaam fast nahi hota, wo sirf thread ko chhota-chhota free karta hai.",
    followUp: "Web Worker aur `setTimeout` chunking mein trade-off kya hai?",
    redFlag:
      "Loop ko `async function` bana dena aur maan lena ab non-blocking hai — `await` ke bina wo abhi bhi sync hai.",
  },
  {
    id: "sva-4",
    question:
      "`let data; fetch('/api').then((r) => r.json()).then((d) => (data = d)); console.log(data);` — `data` kya print hoga aur kyun?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`undefined`. `fetch` async hai — `.then` callbacks abhi chale hi nahi jab `console.log(data)` run hota hai. `data` assign hone se pehle hi log ho jaata hai.",
    detailedAnswer:
      "`fetch(...)` turant ek pending promise return karta hai aur aage ka sync code chalta rehta hai. `console.log(data)` usi sync pass mein chalta hai, jab promise abhi settle nahi hua — `data` abhi bhi `undefined`. `.then` callbacks baad mein microtask ke roop mein chalte hain. Sahi tareeka: value ko uske `.then` ke andar use karo, ya `async/await` se — `const r = await fetch(...); const data = await r.json();`.",
    followUp:
      "Isko `async/await` se kaise likhoge, aur error handling kahan aayega?",
    redFlag:
      "'`await` laga do `console.log` se pehle' bina function ko `async` banaye — top-level await sirf modules mein.",
  },
];

export default questions;
