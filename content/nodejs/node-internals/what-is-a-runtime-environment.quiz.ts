import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "what-is-a-runtime-environment-1",
    question: "JavaScript engine aur runtime environment me kya farak hai?",
    options: [
      "Koi farak nahi, dono ek hi cheez ke naam hain",
      "Engine (jaise V8) sirf JavaScript language execute karta hai (syntax, Array, Promise, Math) — usko I/O ka concept nahi; runtime engine ke around built-in APIs, event loop, timers, aur I/O add karta hai",
      "Engine browser me hota hai, runtime sirf server par",
      "Runtime code likhta hai, engine use compile karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Engine = language executor, koi file/socket/timer nahi jaanta. Runtime = engine + built-in APIs (`fs`/`http` ya `document`/`fetch`) + event loop + timers + I/O + global object + module system. Node ek runtime hai jo V8 engine use karta hai. Option A galat — alag layers. Option C galat — dono jagah dono concepts hain. Option D galat — na engine na runtime tumhara code likhta hai.",
    difficulty: "easy",
  },
  {
    id: "what-is-a-runtime-environment-2",
    question:
      "`setTimeout`, `fetch`, aur `console` — ye ECMAScript (JavaScript language) spec ka hissa hain?",
    options: [
      "Haan, teeno spec me define hain",
      "Nahi — teeno runtime-provided APIs hain; har runtime (Node, browser, Deno) apna version deta hai, isliye behavior 100% same nahi hota",
      "Sirf `console` spec me hai, baaki do nahi",
      "Haan, lekin sirf ES2020 ke baad",
    ],
    correctIndex: 1,
    explanation:
      "ECMAScript spec me koi I/O, timer, ya logging API nahi hai — wo deliberately language-only hai. `setTimeout` Node me libuv timers se, browser me browser scheduler se; return type bhi alag (Node: Timeout object, browser: number). `fetch` Node 18+ me alag implementation. `console` bhi host deta hai. Option A/C/D galat — inme se koi spec me nahi hai.",
    difficulty: "medium",
  },
  {
    id: "what-is-a-runtime-environment-3",
    question:
      "Ek Next.js API route ko Vercel Edge runtime par deploy karne par `import fs from 'fs'` fail ho jaata hai. Kyun?",
    options: [
      "Edge runtime me bug hai",
      "Edge runtime Node nahi hai — wo V8 isolates par ek web-standard runtime hai jisme `fs`, `net`, `Buffer`, `process` jaise Node core modules nahi hote, sirf `fetch`/`Request`/`Response` jaisi web APIs",
      "`fs` import ke liye ek npm package install karna padta hai",
      "Edge runtime purana Node version use karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Edge runtime ek alag, minimal runtime hai — full Node process nahi. Uski API surface web standards tak limited hai; file system, raw sockets, `Buffer`, `process` available nahi. Isliye Node core modules par depend karne wale npm packages wahan nahi chalte. Ye 'code runtime se bandhа hota hai' ka direct example hai. Option A/C/D galat — ye design hai, bug ya version issue nahi.",
    difficulty: "medium",
  },
  {
    id: "what-is-a-runtime-environment-4",
    question: "Deno aur Bun ke baare me kaunsa statement sahi hai?",
    options: [
      "Dono naye JavaScript engines hain jo V8 ko replace karte hain",
      "Dono alternative server-side runtimes hain — Deno V8 engine par (secure-by-default, TS built-in, web APIs), Bun JavaScriptCore engine par (fast, built-in bundler/test-runner)",
      "Dono sirf browser me chalte hain",
      "Deno aur Bun Node ke official sub-projects hain",
    ],
    correctIndex: 1,
    explanation:
      "Deno aur Bun runtimes hain, engines nahi — unhone existing engine ke around apna I/O layer, module system, aur API set banaya. Deno V8 use karta hai with a security sandbox aur first-class TypeScript; Bun JavaScriptCore use karta hai aur startup/install speed plus all-in-one tooling par focus karta hai. Option A galat — engine replace nahi. Option C galat — server-side hain. Option D galat — independent projects hain (Deno Ryan Dahl ka).",
    difficulty: "easy",
  },
];

export default quiz;
