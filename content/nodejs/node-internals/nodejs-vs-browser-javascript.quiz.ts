import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nodejs-vs-browser-javascript-1",
    question:
      "Node aur browser JavaScript ke beech FUNDAMENTAL farak kya hai?",
    options: [
      "Do alag programming languages hain jinka syntax milta-julta hai",
      "Language (ECMAScript) same hai, aur Chrome/Node me engine bhi same (V8); farak host environment ka hai — kaunse global objects aur APIs available hain",
      "Node compiled hai, browser JS interpreted hai",
      "Browser JS purani hai, Node uska naya modern version hai",
    ],
    correctIndex: 1,
    explanation:
      "Same language, same engine (V8) Chrome/Node me; farak sirf host: browser deta hai window/DOM/fetch/localStorage (sandbox), Node deta hai global/process/Buffer/fs/require (full OS access). Option A galat — ek hi language hai. Option C galat — dono me V8 JIT-compile karta hai. Option D galat — dono active hain, ek doosre ka version nahi.",
    difficulty: "easy",
  },
  {
    id: "nodejs-vs-browser-javascript-2",
    question:
      "Browser JavaScript ko file-system access kyun nahi milta jabki Node ko milta hai?",
    options: [
      "Browser engineers ne bas wo feature nahi banaya",
      "Security model: browser kisi bhi website se aaya untrusted code chalata hai, isliye sandbox — no file access; Node deployed trusted code chalata hai, isliye full OS access",
      "File system access sirf compiled languages ko milta hai",
      "Browser me file system hota hi nahi",
    ],
    correctIndex: 1,
    explanation:
      "Agar koi bhi visited website tumhari disk padh leti toh har site ek virus hoti — isliye browser sandbox deta hai. Node code tum khud likhte/deploy karte ho (trusted), isliye use wahi access milta hai jo tumhare user account ke paas hai. Option A galat — deliberate design hai. Option C galat — language type se koi lena-dena nahi. Option D galat — machine me file system hai, browser use expose nahi karta.",
    difficulty: "medium",
  },
  {
    id: "nodejs-vs-browser-javascript-3",
    question:
      "Ek Next.js component ke top-level me `const w = window.innerWidth` likha hai. Server-side render par kya hoga?",
    options: [
      "Kuch nahi, `window` Node me bhi hota hai",
      "`ReferenceError: window is not defined` — kyunki server (Node) me `window` object nahi hota; fix: `useEffect` ya `typeof window !== 'undefined'` guard",
      "`window.innerWidth` 0 return karega server par",
      "Build fail ho jayega compile time par",
    ],
    correctIndex: 1,
    explanation:
      "SSR Node me hota hai jahan `window` exist hi nahi karta — top-level access par runtime ReferenceError aur page 500. Browser-only code ko `useEffect` (client-only) me daalo ya `typeof window !== 'undefined'` se guard karo. Option A galat — `window` browser-only. Option C galat — undefined object property padhne se error, 0 nahi. Option D galat — ye runtime error hai, compile-time nahi.",
    difficulty: "medium",
  },
  {
    id: "nodejs-vs-browser-javascript-4",
    question:
      "In me se kaunsa code Node aur browser DONO me bina modification ke chalta hai?",
    options: [
      "`const fs = require('fs'); fs.readFileSync('a.txt')`",
      "`document.querySelector('#app').innerHTML = 'hi'`",
      "`const doubled = [1,2,3].map(n => n*2); console.log(JSON.stringify(doubled))`",
      "`window.localStorage.setItem('k', 'v')`",
    ],
    correctIndex: 2,
    explanation:
      "`.map`, `JSON`, `console.log` sab ECMAScript ya dono runtimes me common hain. Option A `require`/`fs` — Node-only. Option B `document`/DOM — browser-only. Option D `window`/`localStorage` — browser-only. Isomorphic code likhne ke liye sirf pure ECMAScript use karo, koi host API nahi.",
    difficulty: "easy",
  },
];

export default quiz;
