import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lp-1",
    question: "for...of aur for...in mein kya farak hai? Kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "for...of kisi bhi iterable ke VALUES pe chalta hai (array, string, Map, Set, NodeList). for...in ek object ke enumerable KEYS pe — inherited keys bhi, aur order guaranteed nahi. Arrays pe hamesha for...of; plain object ke keys ke liye Object.keys/entries + for...of.",
    detailedAnswer:
      "`for...of` ES6 ka values-iterator hai — har iterable pe same syntax, `break`/`continue`/`await` sab kaam karte hain, index book-keeping nahi. `for...in` sirf property keys deta hai:\n\n```javascript\nfor (const v of ['a','b']) {}   // 'a', 'b'  (values)\nfor (const k in ['a','b']) {}    // '0', '1'  (string keys)\n```\n\n`for...in` ke teen problems arrays ke liye: (1) keys strings hoti hain, (2) prototype chain ki enumerable properties bhi iterate hoti hain (purane polyfills se), (3) order sirf integer-like keys ke liye guaranteed. Isliye rule: `for...in` sirf plain objects, aur wahan bhi `Object.keys(obj)` / `Object.entries(obj)` + `for...of` behtar hai kyunki wo sirf own enumerable keys deta hai aur ek array return karta hai.",
    followUp: "for...of plain object pe kyun nahi chalta, aur usko iterate karne ka sahi tarika kya hai?",
    redFlag: "\"Arrays iterate karne ke liye for...in use karo\" — classic galat jawaab.",
  },
  {
    id: "lp-2",
    question: ".map() aur for...of / forEach mein se kis situation mein kaun sa? Ek decision rule do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Rule: `.map()` jab tum har element se ek naya element bana rahe ho AUR wo naya array use karoge (pure transform). Warna for...of — jab side-effects only ho, `break`/early-exit chahiye, ya sequential `await` chahiye.",
    detailedAnswer:
      "`.map()` ek transformation tool hai — input ke same length ka naya array deta hai. Sahi jagah: React list rendering, data reshape, ek array ko doosre shape mein. Galat jagah: side-effects (`users.map(u => save(u))` — array banake phenk diya, linter flag karta hai). for...of tab: (1) sirf effects (log, save, DOM update), (2) pehla match milte hi `break`, (3) `for (const x of arr) { await f(x) }` sequential. `forEach` side-effects ke liye theek hai par `break` nahi, aur async callback ka promise ignore karta hai to `await` bhi effectively nahi. Parallel async: `await Promise.all(arr.map(f))` — yahan `.map()` sahi hai kyunki wo promises ka array bana raha hai jo `Promise.all` use karta hai.",
    followUp: "`.map()` se kuch items skip karne ho to kya karoge — kya map ye kar sakta hai?",
  },
  {
    id: "lp-3",
    question: "Loop ke andar await kaise handle karoge — sequential aur parallel dono? forEach kyun kaam nahi karta?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Sequential: `for (const x of arr) { await f(x); }`. Parallel (aur wait): `await Promise.all(arr.map(f))`. `forEach` async callback ka Promise ignore karta hai — na wait, na order — to `forEach(async ...)` ke baad ka code turant chal jaata hai.",
    detailedAnswer:
      "```javascript\n// Sequential — ek ke baad ek, order preserve\nfor (const url of urls) {\n  const res = await fetch(url);\n  results.push(await res.json());\n}\n\n// Parallel — sab ek saath, sabka wait\nconst results = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));\n\n// BROKEN\nurls.forEach(async (u) => {\n  const res = await fetch(u);  // ye promises kahin await nahi hote\n});\nconsole.log('done');  // saare fetch se pehle chal jaata hai\n```\n\n`forEach` ka signature callback ke return ko use hi nahi karta — wo `undefined` expect karta hai. Isliye async callback fire-and-forget ban jaata hai. Jab rate-limit ya order matter kare -> sequential `for...of`. Jab independent aur fast chahiye -> `Promise.all`. Bounded parallelism -> `p-limit` ya manual chunking.",
    followUp: "1000 API calls hain aur server 10 concurrent allow karta hai — kaise karoge?",
    redFlag: "\"forEach ke andar await likh do, wo wait kar lega\" — nahi karta.",
  },
  {
    id: "lp-4",
    question: "Nested loop ke andar se dono loops ek saath kaise chhodoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Teen tarike: (1) labeled break — `outer: for (...) { for (...) { break outer; } }`, (2) ek `found` flag jo inner break ke baad outer condition mein check ho, (3) sabse saaf — nested loop ko ek function mein daalo aur `return` karo.",
    detailedAnswer:
      "Plain `break` sirf apne immediate loop ko chhodta hai. Options:\n\n```javascript\n// 1. Label\nouter: for (const row of grid) {\n  for (const cell of row) {\n    if (cell === target) break outer;\n  }\n}\n\n// 2. Function + return (aksar sabse readable)\nfunction findCell(grid, target) {\n  for (const row of grid) {\n    for (const cell of row) {\n      if (cell === target) return cell;\n    }\n  }\n  return null;\n}\n```\n\nLabels JS mein valid hain par rare — bahut se style guides inhe discourage karte hain kyunki `goto`-jaisa feel dete hain. Agar logic itni complex ho ke label chahiye, wo aksar signal hai ki us block ko apni function mein nikaal do, jahan `return` naturally dono loops se bahar le aata hai.",
    followUp: "labeled continue bhi hota hai — wo kya karta hai?",
  },
  {
    id: "lp-5",
    question: "Ek array pe iterate karte hue usme se items remove karna (splice) kyun bug deta hai? Sahi tarika?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`arr.splice(i, 1)` baaki elements ko ek index peeche shift kar deta hai, par loop ka `i` aage badh jaata hai — to remove kiye gaye element ke turant baad wala element skip ho jaata hai. Sahi: reverse iterate karo, ya `.filter()` se naya array banao.",
    detailedAnswer:
      "```javascript\n// BUG: [1,2,2,3] se 2 hataane ki koshish\nfor (let i = 0; i < arr.length; i++) {\n  if (arr[i] === 2) arr.splice(i, 1);\n}\n// [1, 2, 3] -- ek 2 bach gaya\n```\n\nJab index 1 ka `2` hata, array `[1,2,3]` ban gaya aur doosra `2` index 1 pe aa gaya — par `i` 2 ho chuka. Fixes:\n\n```javascript\n// Reverse — shift sirf peeche wale indices ko affect karta hai\nfor (let i = arr.length - 1; i >= 0; i--) {\n  if (arr[i] === 2) arr.splice(i, 1);\n}\n\n// Ya immutable — naya array\nconst cleaned = arr.filter(x => x !== 2);\n```\n\nGeneral principle: jis collection pe iterate kar rahe ho use loop ke andar structurally mutate mat karo. `.filter()`/`.map()` naya array dete hain, mutation ka sawaal hi nahi.",
    followUp: "for...of ke dauraan array me push karoge to kya hoga — infinite loop?",
  },
];

export default questions;
