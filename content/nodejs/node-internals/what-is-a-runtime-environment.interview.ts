import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "wre-1",
    question: "JavaScript engine aur runtime environment me kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Engine (V8, JavaScriptCore) sirf JavaScript language execute karta hai — syntax, `Array`, `Promise`, `Math`, closures — usko file, socket, ya timer ka koi concept nahi. Runtime environment engine ko wrap karke wo sab add karta hai: built-in APIs, event loop, timers, I/O, global object, module system. Node ek server-side runtime hai jo V8 engine use karta hai.",
    detailedAnswer:
      "ECMAScript spec deliberately I/O-free hai kyunki JS bahut jagah chalti hai. Engine ka scope: language ko parse/compile/execute karna, aur `Object`, `Array`, `Function`, `Promise`, `JSON`, `Math` jaise built-ins dena. Runtime ka scope engine ke upar: (1) built-in API library — Node me `fs`/`http`/`path`/`crypto`, browser me `document`/`fetch`/`localStorage`; (2) event loop — async callbacks schedule/run karna; (3) timers — `setTimeout`/`setInterval`; (4) I/O layer — Node me libuv, browser me browser internals; (5) global object — `global`/`process` vs `window`; (6) module system — CommonJS/ESM loader vs `<script type=module>`. Node ka stack neeche se: OS → libuv → C++ bindings → V8 → Node core modules → app. Isliye `setTimeout` aur `fs` 'JavaScript' nahi, 'Node runtime features' hain — aur unka behavior doosre runtimes me alag ya absent ho sakta hai.",
    followUp: "Agar main sirf V8 ka standalone shell (`d8`) chalaun, toh `setTimeout` aur `require` kaam karenge?",
    redFlag:
      "\"Engine aur runtime same cheez hain\" ya \"V8 ek runtime hai\" — V8 engine hai; Node runtime hai jo use embed karta hai.",
  },
  {
    id: "wre-2",
    question:
      "Node runtime ki layers kaunsi hain? Ek `fs.readFile` call in layers se kaise guzarti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Neeche se: OS → libuv (event loop + thread pool + async I/O) → C++ bindings → V8 → Node core JS modules → your app. `fs.readFile(path, cb)` call: JS `fs` module → C++ binding → libuv thread pool par actual read → complete hone par libuv event loop callback ko queue karta hai → V8 tumhara `cb` JS me run karta hai.",
    detailedAnswer:
      "Step by step: (1) Tumhari app `fs.readFile('a.txt', cb)` call karti hai — ye Node ke JS-side `fs` module ka function hai. (2) Wo ek C++ binding function ko call karta hai jo request ko ek libuv work request me package karta hai. (3) File I/O ke liye libuv apne thread pool (default 4 threads) me se ek thread ko kaam deta hai — ye isliye kyunki OS-level file reads reliably async nahi hote sab platforms par. Us dauraan main thread free rehta hai. (4) Thread read complete karta hai, result buffer ready hota hai. (5) libuv event loop ke poll phase me completion detect hota hai aur associated callback ready-queue me chala jaata hai. (6) Event loop us tick par V8 ko bolta hai tumhara `cb(err, data)` JavaScript execute karo. Networking (`http`, `net`) thoda alag hai — wo thread pool use nahi karta, kernel ke epoll/kqueue/IOCP directly use karta hai. Ye layering hi 'Node = V8 + libuv + bindings + core lib' ka concrete matlab hai.",
    followUp: "File I/O thread pool use karta hai lekin network I/O nahi — kyun?",
  },
  {
    id: "wre-3",
    question:
      "\"Ye toh JavaScript hai, kahin bhi chalega\" — is soch me kya problem hai? Ek concrete example do.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Sirf pure ECMAScript portable hai. Jaise hi code runtime APIs use karta hai (`fs`, `process`, `Buffer`, ya `document`, `localStorage`), wo ek specific environment se bandh jaata hai. Example: `require('fs')` wala code Cloudflare Workers / Vercel Edge / Deno (bina compat) par fail karta hai, kyunki wo runtimes Node core modules provide nahi karte.",
    detailedAnswer:
      "Portability layers me sochо: (1) ECMAScript — `Array`, `Promise`, `Map`, `async/await`, `JSON`, `Math` — har JS runtime me chalega. (2) Web-standard APIs — `fetch`, `Request`/`Response`, `URL`, `TextEncoder`, `crypto.subtle` — browser, Deno, Bun, aur Edge runtimes me chalega, aur Node 18+ me bhi mostly. (3) Node-specific APIs — `fs`, `net`, `child_process`, `Buffer`, `process.cwd()`, CommonJS `require` — sirf Node (aur partially Bun/Deno compat mode). Concrete: ek npm package jo internally `Buffer` aur `crypto` (Node ka, `crypto.subtle` nahi) use karta hai, wo Vercel Edge runtime par import karte hi build/runtime error dega. Isliye Vercel/Cloudflare docs har package ke liye 'Edge compatible' batate hain, aur Next.js me tum `export const runtime = 'nodejs'` ya `'edge'` explicitly choose karte ho. Lesson: deploy target ka runtime pehle pata karo, phir dependencies choose karo.",
    followUp: "Ek library ko 'runtime-agnostic' banane ke liye tum kya rules follow karoge?",
  },
  {
    id: "wre-4",
    question:
      "Team keh rahi hai \"Bun Node se 3x fast hai, chalo migrate karte hain\". Tum kaise evaluate karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Pehla sawaal: humara bottleneck kya hai? Zyaadatar server apps me wo DB/network I/O hai, runtime execution nahi — toh 3x faster JS execution end-to-end latency ko barely badlega. Fir compatibility audit: native addons, Node-specific APIs, obscure npm packages. Fir ek non-prod service par pilot, real load test, aur observability. Blanket migration sirf benchmark dekhkar nahi.",
    detailedAnswer:
      "Framework: (1) Measure — current p50/p99 latency ka breakdown lo. Agar 80% time Postgres queries aur upstream API calls me hai, toh runtime swap se maybe 2-5% improvement, migration risk ke laayak nahi. (2) Where Bun helps — cold start (serverless), CI test speed, install speed, aur genuinely CPU-heavy JS (parsing, transforms). Un cases me measurable win ho sakta hai. (3) Compatibility risks — native addons (`node-gyp` builds), `worker_threads`/`cluster` edge cases, some `fs`/`crypto`/`http` behaviors, aur npm packages jo Node internals par depend karte hain. Bun ka compat layer strong hai par 100% nahi. (4) Operational — production hardening, known-issue history, hiring familiarity, hosting support. (5) Approach — ek low-risk internal service par pilot, dono ko same load test do, error rates aur latency compare karo hafton tak, phir decide. Interview point: tum hype ke against measurement aur risk assessment rakhte ho, aur 'faster' ko 'faster at what, and does it matter here' me todte ho.",
    followUp: "Kaunse specific workloads me runtime swap se genuine, measurable improvement milega?",
    redFlag:
      "\"Benchmark me tez hai toh migrate kar do\" — bina bottleneck analysis aur compatibility audit ke.",
  },
  {
    id: "wre-5",
    question:
      "Browser ko 'ek runtime' kyun kehte hain? Wo Node se conceptually kaise related hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Browser bhi ek JavaScript runtime hai: usme ek engine (Chrome me V8, Safari me JavaScriptCore) plus ek API set (`document`/DOM, `fetch`, `localStorage`, `setTimeout`) plus ek event loop hai. Structurally Node jaisa hi — engine + APIs + event loop — bas APIs web page ke liye tuned hain (DOM, security sandbox), server ke liye nahi (no `fs`).",
    detailedAnswer:
      "Dono runtimes ka same shape hai: (engine) + (host APIs) + (event loop) + (global object) + (module system). Farak sirf choices ka: Browser — global object `window`, APIs DOM manipulation / user events / `fetch` with CORS / sandboxed `localStorage`, event loop me macrotasks + microtasks + rendering steps, security sandbox (no file access) kyunki untrusted code chalta hai. Node — global object `global`/`globalThis` + `process`, APIs `fs`/`http`/`net`/`crypto`/`child_process`, event loop libuv ka (phases: timers, poll, check, close), full OS access kyunki trusted code chalta hai. V8 dono jagah same ho sakta hai. Isliye jo cheez dono me hai (jaise `setTimeout`) uska naam same par implementation aur semantics thode alag. Ye samajhna isomorphic code (Next.js SSR) likhne ke liye zaroori hai: tum jaante ho kaunsa API kaunse runtime me milega.",
    followUp: "Browser aur Node ke event loops me ek concrete behavioral difference kya hai?",
  },
];

export default questions;
