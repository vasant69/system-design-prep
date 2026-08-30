import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sc-1",
    question: "Closure kya hai? Apne shabdon mein samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Closure ek function aur us outer scope ka combination hai jisme wo banaya gaya tha. Function apne outer variables ko access karta rehta hai outer function ke return hone ke baad bhi, kyunki engine wo scope tab tak zinda rakhta hai jab tak koi inner function usse reference kar raha hota hai.",
    detailedAnswer:
      "Normally jab function return hota hai to uske local variables garbage collect ho jaate hain. Lekin agar us function ne ek inner function banaya jo outer ke kisi variable ko use karta hai, aur wo inner function bahar chala gaya (return hua, event listener bana, setTimeout mein gaya), to wo apne saath us outer scope ki reference le jaata hai — function object ke andar chhupa `[[Environment]]` slot. Jab tak inner function reachable hai, us outer scope ke variables zinda rehte hain aur inner unhe padh/badal sakta hai. Classic example: `function makeCounter() { let count = 0; return () => ++count; }` — `makeCounter` return ho chuka par `count` zinda hai kyunki lauta hua arrow usse reference kar raha hai. Har `makeCounter()` call ki apni private `count` hoti hai.",
    followUp:
      "Do alag `makeCounter()` calls ke counters ek dusre ko affect karte hain kya? Kyun / kyun nahi?",
    redFlag:
      "\"Closure matlab function ke andar function\" — sirf nesting bolna, outer-variable capture aur lifetime ko miss karna.",
  },
  {
    id: "sc-2",
    question:
      "Lexical scope aur dynamic scope mein farak? JavaScript kaunsa use karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Lexical (static) scope: function ka outer-variable access uski definition ki jagah se decide hota hai. Dynamic scope: call ki jagah se. JavaScript lexical scope use karta hai — isliye ek function ko kahin bhi le jaake call karo, wo hamesha wahi outer variables dekhega jahan wo likha gaya tha.",
    detailedAnswer:
      "`const x = 'global'; function inner() { console.log(x); } function outer() { const x = 'local'; inner(); } outer();` — lexical scope ke saath ye `'global'` print karta hai, kyunki `inner` global scope mein likha gaya tha, wahi uski outer chain hai. Dynamic scope hota to `'local'` print hota (jahan se call hua). JS pura lexical hai — `var`/`let`/`const`, function boundaries, block boundaries, sab. Ek confusing exception jaisa cheez `this` hai: `this` lexical nahi hota (regular functions mein call-site pe decide hota hai) — isliye log this ko scope ka hissa samajhne ki galti karte hain, jabki wo alag mechanism hai. Arrow functions ka `this` zaroor lexical hota hai.",
    followUp:
      "Agar `this` lexical nahi hai to arrow function ka `this` lexical kyun hota hai?",
  },
  {
    id: "sc-3",
    question:
      "Ye kya print karega aur kyun?\n\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "3 3 3. `var i` poore loop ke liye ek hi function-scoped binding hai. setTimeout callbacks event loop ke agle tick mein chalte hain — tab tak loop khatam ho chuka hai aur `i` `3` hai. Teeno callbacks usi ek `i` pe closure bante hain.",
    detailedAnswer:
      "`var` function-scoped hai, block-scoped nahi — to poore loop mein ek `i`. Har `setTimeout` ka arrow us same `i` ko close over karta hai (value copy nahi, binding reference). Callbacks synchronously nahi, event loop ke baad chalte hain, jab `i` apni final value `3` pe pahunch chuka hai (`i < 3` false hone pe loop ruka). Isliye 3 3 3. Fix 1: `let i` — spec har iteration ke liye naya block-scoped `i` banata hai (previous se copy hoke), to har callback alag binding capture karta hai -> 0 1 2. Fix 2 (pre-let): IIFE `(function (j) { setTimeout(() => console.log(j), 0); })(i)` — har iteration naya scope. Fix 3: `setTimeout(f, 0, i)` — value as extra arg pass.",
    followUp: "`let` ke saath ye 0 1 2 kaise deta hai — spec exactly kya karta hai har iteration pe?",
  },
  {
    id: "sc-4",
    question:
      "Closures se ek real problem solve karke dikhao — kahan use kiya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Private state ke liye: `once(fn)` aur `memoize(fn)` jaise helpers. `called` flag ya `cache` Map closure mein private rehta hai — bahar se koi tamper nahi kar sakta, sirf lauta hua function usse interact karta hai. Middleware factories bhi: `requireRole('admin')` role ko closure mein yaad rakhta hai.",
    detailedAnswer:
      "`function memoize(fn) { const cache = new Map(); return (...args) => { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); const result = fn(...args); cache.set(key, result); return result; }; }` — `cache` sirf lauta hua function dekh sakta hai. Har `memoize(someFn)` call ka apna `cache`. Express example: `function requireRole(role) { return (req, res, next) => { if (req.user?.role !== role) return res.status(403).end(); next(); }; }` — ek factory se `requireRole('admin')`, `requireRole('editor')`, har ek apna `role` capture kiye. React `useState`/`useEffect` bhi closures pe khade hain — callback us render ke props/state ko close over karta hai. Trade-off: `cache` ko closure zinda rakhta hai — agar memoized function long-lived global ho to cache unbounded grow kar sakta hai (LRU limit ya WeakMap chahiye).",
    followUp:
      "`memoize` ka cache kabhi free nahi hota — production mein isko kaise bound karoge?",
  },
  {
    id: "sc-5",
    question:
      "Closures memory leak kaise cause karte hain? Ek example do.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Closure apne captured scope ko tab tak zinda rakhta hai jab tak wo closure reachable hai. Agar ek long-lived cheez (global event listener, timer, cache) ek bade object ko close over kare aur kabhi release na ho, wo bada object kabhi GC nahi hota.",
    detailedAnswer:
      "`function attach(bigData) { document.getElementById('btn').addEventListener('click', () => console.log(bigData.length)); }` — `bigData` (maan lo 50MB array) ab click listener ke through reachable hai. `attach` return ho gaya par `bigData` free nahi hoga jab tak listener remove na ho ya button DOM se hat na jaye (aur reference bhi na bache). Common real cases: React component mein `useEffect` ke andar listener add karna par cleanup function na return karna; `setInterval` jo bade closure ko hold kare aur `clearInterval` na ho; detached DOM nodes jo closure mein bache hue hon. Fixes: (1) cleanup — `removeEventListener` / `clearInterval`; (2) closure mein sirf zaroori chhoti value capture karo (`const n = bigData.length;` phir `n` use karo, `bigData` nahi); (3) instance-private data ke liye `WeakMap` — keys weakly held, GC-friendly.",
    followUp:
      "React `useEffect` mein listener add kiya par cleanup return nahi kiya — exactly kya leak hota hai har re-render pe?",
  },
];

export default questions;
