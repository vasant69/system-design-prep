import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nvb-1",
    question: "Node.js aur browser JavaScript mein kya farak hai? Kuch concrete examples do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Language same hai, host environment alag. Browser: `window`, `document`, DOM, `localStorage`, same-origin sandbox. Node: `global`/`globalThis`, `process`, `require`/`module`, `Buffer`, `__dirname`, aur `fs`/`net`/`os` se full OS access. Default module system aur event loop impl bhi alag.",
    detailedAnswer:
      "ECMAScript core (variables, functions, Promise, classes, array/string methods) dono jagah identical hai. Farak wo cheezein hain jo host provide karta hai: (1) Global object — browser `window`/`self`, Node `global`/`globalThis`. (2) DOM — browser only (`document`, elements, events); Node ke paas UI nahi. (3) Storage — browser `localStorage`/cookies; Node file system ya env vars. (4) Network — browser `fetch`/`XHR`/`WebSocket` (CORS-restricted); Node raw `net`/`http`/`dgram` sockets. (5) Modules — browser ESM by default, Node historically CommonJS (`require`), ab dono support. (6) Event loop — Node libuv (phased, `setImmediate`, `process.nextTick`); browser ka apna, rendering ke saath tied. Portable APIs jo dono mein hain: `console`, `Promise`, `URL`, `TextEncoder`, `queueMicrotask`, aur modern `fetch`.",
    followUp: "Isomorphic / universal code (jo dono jagah chale) likhne ke liye kya karoge?",
    redFlag: "\"Node aur browser bilkul same hain\" ya \"Node mein DOM manipulate kar sakte ho\".",
  },
  {
    id: "nvb-2",
    question: "Browser mein `require` kyun nahi chalta, aur wahan modules kaise load hote hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`require` CommonJS ka function hai jo Node ka module system deta hai — synchronous file read maang-ke resolve karta hai, jo browser mein possible nahi. Browser native `import`/`export` (ESM) use karta hai jo async network fetch se module graph banata hai.",
    detailedAnswer:
      "CommonJS synchronous hai: `require('./x')` turant disk se file padhta hai, evaluate karta hai, `module.exports` return karta hai. Browser ke paas synchronous local file access nahi (aur hona bhi nahi chahiye — network latency). Isliye browser ESM use karta hai: `<script type=\"module\">` ya `import` statements, jo static analysis se dependency graph nikalta hai aur modules ko async fetch karke evaluate karta hai. Purane din bundlers (webpack, Rollup) CommonJS ko browser-friendly bundle mein convert karte the; ab native ESM se wo need kam ho gayi. Node bhi ab ESM support karta hai (`.mjs`, `\"type\": \"module\"`).",
    followUp: "Agar library dono environments target kare, to package.json mein wo dono formats kaise ship karti hai?",
  },
  {
    id: "nvb-3",
    question:
      "Tumne ek utility likhi jo `localStorage` use karti hai. Ab wahi code Node backend pe import ho raha hai aur crash kar raha hai. Kya karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`localStorage` browser-only hai. Ya to storage ko inject/abstract karo (interface pass karo, browser mein `localStorage` impl, Node mein file/DB/memory impl), ya us module ko client-only rakho aur guard lagao `typeof localStorage !== \"undefined\"`.",
    detailedAnswer:
      "Root cause: host-specific API ko shared code mein hardcode kiya. Do clean fixes: (1) Dependency injection — module ko ek `storage` object accept karao jisme `get`/`set` ho; browser call site `localStorage`-backed adapter de, Node call site `fs`-backed ya in-memory adapter de. Isse code testable bhi ho jaata hai. (2) Runtime guard + fallback — `const store = typeof localStorage !== \"undefined\" ? localStorage : memoryShim;`. Next.js jaise SSR frameworks mein aksar option hota hai code ko `\"use client\"` / dynamic import se sirf browser pe run karana. Anti-pattern: `try/catch` laga ke silently swallow karna — bug chhup jaata hai.",
    followUp: "Ye same problem `window` ya `document` use karne wale code mein SSR ke dauraan kaise dikhti hai?",
    redFlag: "\"Bas try/catch laga do aur error ignore kar do.\"",
  },
  {
    id: "nvb-4",
    question: "`global` (Node) aur `window` (browser) — inko unify karne ke liye kya hai, aur kyun aaya?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`globalThis` — ek standard global jo har environment mein global object ko point karta hai: browser mein `window`, Node mein `global`, workers mein `self`. Portable code ke liye aaya taaki environment-sniffing na karni pade.",
    detailedAnswer:
      "Pehle global object ka naam har jagah alag tha: `window` (browser main thread), `self` (Web Workers), `global` (Node), aur kabhi `frames`/`this` tricks. Universal library likhne walon ko ugly detection code likhna padta tha. ES2020 mein `globalThis` add hua — guaranteed reference to the global object in any JS host. Ab `globalThis.fetch`, `globalThis.crypto` jaisa likh sakte ho bina check kiye kaunsa host hai. Note: `globalThis` pe cheezein daalna abhi bhi global pollution hai — sparingly use karo.",
    followUp: "Web Worker mein `window` kyun nahi hota, aur wahan global kya hai?",
  },
];

export default questions;
