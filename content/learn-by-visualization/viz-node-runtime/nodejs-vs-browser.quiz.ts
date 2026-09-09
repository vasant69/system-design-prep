import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nodejs-vs-browser-1",
    question: "Node aur browser ke beech asli farak kya hai?",
    options: [
      "Do alag JavaScript languages, syntax bhi thoda alag",
      "Same language (ECMAScript), lekin alag host environment — global object aur built-in APIs alag",
      "Node compiled hai, browser interpreted",
      "Sirf performance ka farak, APIs bilkul same",
    ],
    correctIndex: 1,
    explanation:
      "Language core (syntax, `Promise`, `class`, array methods) dono jagah bilkul same hai. Farak host ka hai: browser `window`/`document`/DOM/`localStorage` deta hai, Node `global`/`process`/`require`/`fs` deta hai. Dono JIT-compiled hain (V8), aur performance ka farak secondary hai — asli baat available APIs.",
    difficulty: "easy",
  },
  {
    id: "nodejs-vs-browser-2",
    question: "Node mein `typeof window` ka result kya hai?",
    options: [
      '"object" — Node mein bhi window hota hai',
      '"undefined" — window ek browser global hai, Node mein nahi',
      "ReferenceError",
      '"function"',
    ],
    correctIndex: 1,
    explanation:
      "`window` browser ka global object hai (DOM ke saath). Node ka global object `global` (ya `globalThis`) hai, `window` nahi. `typeof` kabhi ReferenceError nahi deta undeclared identifier pe — wo safely `\"undefined\"` return karta hai. Isliye feature-detection often `typeof window !== \"undefined\"` se hoti hai.",
    difficulty: "easy",
  },
  {
    id: "nodejs-vs-browser-3",
    question: "In mein se kaun sa API dono (modern Node aur browser) mein available hai?",
    options: [
      "document.querySelector",
      "fs.readFile",
      "fetch, URL, TextEncoder, queueMicrotask",
      "process.env",
    ],
    correctIndex: 2,
    explanation:
      "`fetch` (Node 18+), `URL`, `TextEncoder`/`TextDecoder`, `queueMicrotask`, `console`, `Promise` — ye ab dono jagah standard hain (WHATWG/web-compat APIs Node ne adopt kiye). `document.*` sirf browser, `fs.*` aur `process.env` sirf Node.",
    difficulty: "medium",
  },
  {
    id: "nodejs-vs-browser-4",
    question: "Browser aur Node dono mein event loop hota hai — inke beech kya sahi hai?",
    options: [
      "Bilkul same implementation, same phases",
      "Node ka event loop libuv-based hai with distinct phases (timers, poll, check...); browser ka apna alag impl hai",
      "Browser mein event loop nahi hota",
      "Node mein sirf setTimeout hota hai, browser mein sab kuch",
    ],
    correctIndex: 1,
    explanation:
      "Dono ka concept same hai (stack khali hone par queue se kaam uthao, microtasks pehle), par implementation alag. Node ka loop libuv deta hai with ordered phases aur `setImmediate` jaisa Node-only API. Browser ka loop rendering, `requestAnimationFrame` etc. ke saath integrated hai. Isliye exact ordering edge-cases dono mein thode alag ho sakte hain.",
    difficulty: "medium",
  },
];

export default quiz;
