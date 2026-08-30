import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nvb-1",
    question: "Node.js aur browser JavaScript me kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Language same hai (ECMAScript) aur Chrome/Node me engine bhi same (V8). Farak host environment ka hai. Browser deta hai `window`, DOM, `fetch`, `localStorage` — plus ek security sandbox, no file access. Node deta hai `global`, `process`, `Buffer`, `require`/`module`, `__dirname`, aur poora file/OS access — no DOM.",
    detailedAnswer:
      "3 layers alag karo: (1) Language — ECMAScript spec: `Array`, `Promise`, closures, `async/await`, `JSON` — dono jagah identical. (2) Engine — V8 (Chrome, Node, Edge), SpiderMonkey (Firefox), JavaScriptCore (Safari, Bun) — code ko parse/JIT-compile/run karta hai, lekin sirf language built-ins deta hai. (3) Host/runtime — engine ke upar context-specific APIs: browser `window` global banata hai with `document`, `fetch`, `localStorage`, `navigator`, `setTimeout`; Node `global` banata hai with `process`, `Buffer`, `require`, `module`, `__dirname`, `fs`, `os`, `net`. `setTimeout` dono me hai par implementation alag (browser scheduler vs libuv timers) aur return type alag (number vs `Timeout` object). Module system historically alag tha (browser ESM, Node CommonJS) — ab dono ESM support karte hain. Practical rule: secrets, DB, file access Node side; DOM aur UI browser side; shared code me sirf pure ECMAScript.",
    followUp: "Agar tum ek library likh rahe ho jo dono jagah chale, toh kya avoid karoge?",
    redFlag:
      "\"Node aur browser JS do alag languages hain\" — ek hi language hai, alag environments.",
  },
  {
    id: "nvb-2",
    question:
      "Browser me `fs` (file system) access kyun nahi hota, aur agar tum bundler use karo to `require('fs')` browser me kya karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Security: browser kisi bhi website ka untrusted code chalata hai; file access de diya toh har site tumhari disk padh legi. Bundlers (webpack/vite) `fs` jaise Node core modules ko ya toh empty stub se replace karte hain ya build error dete hain — real file access kabhi nahi milta.",
    detailedAnswer:
      "Browser ka threat model: user random links kholta hai, har page arbitrary JS run karta hai. Agar us JS ko `fs.readFile('~/.ssh/id_rsa')` allowed hota toh web unusable ho jaata. Isliye browser sandbox: no direct file access (user-initiated `<input type=file>` ya File System Access API ke through hi, explicit permission ke saath), per-origin storage isolation, CORS for cross-origin requests. Node ka threat model ulta hai: code tum likhte aur deploy karte ho, wo trusted hai, use server ka kaam karna hai — config padhna, DB connect karna — isliye poora OS access (jo tumhare Unix user ke paas hai). Bundler behavior: webpack 4 me `fs` auto empty module ban jaata tha; webpack 5 me build error \"Module not found: Can't resolve 'fs'\" jab tak tum `resolve.fallback` set na karo. Matlab: `fs` import client bundle me le aana ek bug hai, feature nahi.",
    followUp: "File System Access API kya hai aur wo sandbox ko kaise respect karta hai?",
  },
  {
    id: "nvb-3",
    question:
      "\"Mera API server CORS error de raha hai jab main browser se call karta hoon, lekin Postman se chalta hai\" — kya ho raha hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "CORS ek browser-enforced rule hai, server-enforced nahi. Postman/curl/Node CORS check nahi karte, isliye wahan request chalti hai. Browser cross-origin response ko block karta hai jab tak server `Access-Control-Allow-Origin` (aur zaroorat ho toh preflight ke liye `Access-Control-Allow-Methods/Headers`) header na bheje.",
    detailedAnswer:
      "CORS (Cross-Origin Resource Sharing) same-origin policy ka relaxation hai jo SIRF browsers implement karte hain. Flow: browser dekhta hai ki page ka origin (jaise `https://app.example.com`) API ke origin (`https://api.other.com`) se alag hai. 'Simple' request ke liye browser call bhej deta hai lekin response tabhi JS ko deta hai jab `Access-Control-Allow-Origin` match kare. Non-simple (custom headers, PUT/DELETE, JSON content-type) ke liye pehle ek `OPTIONS` preflight jaata hai; server ko uska sahi CORS headers ke saath jawab dena hota hai. Postman, curl, aur Node ka `fetch` in checks ko run hi nahi karte kyunki wo browser sandbox me nahi hain — isliye \"Postman me chalta hai\" CORS bug ka classic symptom hai. Fix hamesha server par headers add karke hota hai (Express me `cors` middleware), client me nahi.",
    followUp: "Preflight `OPTIONS` request kab trigger hoti hai aur kab nahi?",
    redFlag:
      "CORS ko client-side code me `mode: 'no-cors'` ya kisi header se \"fix\" karne ki koshish — wo response ko unreadable bana deta hai, problem solve nahi karta.",
  },
  {
    id: "nvb-4",
    question:
      "Ek frontend developer `process.env.API_SECRET` ko React component me use kar raha hai. Isme kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Frontend code browser me chalta hai jahan `process` hota hi nahi — bundler build time par `process.env.API_SECRET` ko literal string se replace kar deta hai. Wo secret shipped JavaScript bundle me plain text ban jaata hai, jise koi bhi DevTools se padh sakta hai. Secrets kabhi client bundle me nahi jaane chahiye.",
    detailedAnswer:
      "Do problems. (1) Runtime: browser me `process` undefined hai; agar bundler ne replace na kiya toh `ReferenceError`. Isliye CRA/Vite/Next build time par `process.env.X` ko inline value se substitute karte hain (Next me sirf `NEXT_PUBLIC_` prefixed vars client me expose hote hain, baaki nahi). (2) Security: jo bhi env var client bundle me inline hota hai wo final `.js` file me literal string hai — user View Source ya Network tab se dekh sakta hai. Isliye API keys, DB passwords, JWT signing secrets — ye SIRF server (Node) side rehte hain. Agar client ko kisi third-party API se baat karni hai jiska key chhupana hai, toh Node me ek proxy route banao: client tumhare server ko call karta hai, tumhara server key add karke upstream call karta hai. Sirf public, non-sensitive config (public API base URL, feature flags) client env vars me theek hai.",
    followUp: "Next.js me `NEXT_PUBLIC_` prefix ka kya role hai?",
    redFlag:
      "\"Bundle minified hai toh secret safe hai\" — minification obfuscation nahi hai; strings as-is dikhti hain.",
  },
  {
    id: "nvb-5",
    question:
      "Tumhe ek validation library likhni hai jo frontend (React) aur backend (Node/Express) dono use karenge. Design me kya dhyaan rakhoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Library ko environment-agnostic rakho: koi host API nahi — na `window`/`document`, na `fs`/`process`/`Buffer`, na `localStorage`. Sirf pure ECMAScript (`RegExp`, `Number`, `Date`, string methods). Dono runtimes me test karo. Output ek plain structure ho (valid boolean + errors array), taaki dono side consume kar sakein.",
    detailedAnswer:
      "Kyun shared: client-side validation instant UX ke liye, server-side validation security ke liye (client bypass ho sakta hai — DevTools, curl). Ek hi source of truth se rules drift nahi karte. Design rules: (1) Zero host dependencies — agar `process.env` chahiye toh use parameter/config object se inject karo, module ke andar mat padho. (2) No side effects on import — koi network call, koi file read module load par nahi. (3) ESM output with CommonJS fallback (`exports` field in package.json) taaki purana Node bhi le sake. (4) Tree-shakeable — named exports, no giant default object. (5) Tests dono targets par: Node me `vitest`/`jest`, aur ek jsdom ya real-browser run. (6) Locale/timezone assumptions explicit — `Date` parsing browser aur Node me thoda alag ho sakta hai edge cases me. Interview me point: tum jaante ho ki \"universal\" code ka matlab hai lowest-common-denominator API surface.",
    followUp: "Agar validation me async check chahiye (jaise DB me email unique hai), tum use is shared library me rakhoge ya bahar?",
  },
];

export default questions;
