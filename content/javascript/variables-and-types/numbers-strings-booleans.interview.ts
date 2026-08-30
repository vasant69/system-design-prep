import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nsb-1",
    question: "0.1 + 0.2 exactly 0.3 kyun nahi hota? Production mein iska kya matlab hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "JS ka number 64-bit IEEE-754 float hai. 0.1 aur 0.2 binary mein exactly represent nahi hote, engine unhe nearest representable value pe round karta hai, aur wo tiny errors add hone pe 0.30000000000000004 dete hain. Matlab: floats ko === se compare mat karo, aur money ko float mein store mat karo.",
    detailedAnswer:
      "Binary floating point sirf un fractions ko exactly rakh sakta hai jo 2 ke powers ka sum hain. 0.1 decimal binary mein infinitely repeating hai (jaise 1/3 decimal mein 0.333...). float64 mein 52 mantissa bits hain, to value truncate/round hoti hai. Har arithmetic operation thodi si error carry karta hai.\n\nConsequences:\n- Comparison: `0.1 + 0.2 === 0.3` false. Use `Math.abs(a - b) < Number.EPSILON`.\n- Money: cents/paise ko integer mein store karo (`1499` = 14.99), sirf display pe divide; ya decimal.js / dinero.js.\n- Display: `.toFixed(2)` string deta hai formatting ke liye, par usse arithmetic mat karo.\n\nYe JS-specific nahi hai — har IEEE-754 language (Java double, C double, Python float) mein same hota hai.",
    followUp: "Number.EPSILON kya hai aur wo har comparison ke liye sufficient kyun nahi?",
    redFlag: "\"JS ka math buggy hai\" — nahi, ye IEEE-754 standard behaviour hai, har language mein same.",
  },
  {
    id: "nsb-2",
    question: "typeof NaN kya deta hai? Aur NaN ko check karne ka sahi tarika kya hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "typeof NaN === 'number' (ironic naam ke bawajood). Check karne ke liye Number.isNaN(x) use karo — global isNaN(x) pehle argument ko number mein coerce karta hai, isliye isNaN('abc') galat se true deta hai.",
    detailedAnswer:
      "`NaN` 'invalid number result' ka marker hai — `0/0`, `Number('abc')`, `Math.sqrt(-1)`, `parseInt('x')`. Ye number type ka special value hai, isliye `typeof NaN` `'number'`.\n\n`NaN` ki khaas baat: `NaN === NaN` `false` (IEEE-754 spec). To `x === NaN` se check nahi kar sakte.\n\n- `Number.isNaN(x)` — true SIRF tab jab x actually NaN value hai. Koi coercion nahi. Ye sahi choice hai.\n- Global `isNaN(x)` — pehle `Number(x)` karta hai, phir check. `isNaN('hello')` `true` ('hello' -> NaN), `isNaN(undefined)` `true`. Ye misleading hai.\n- `Object.is(x, NaN)` — bhi true deta hai, kaam karta hai.\n- Trick: `x !== x` sirf NaN ke liye true hota hai.\n\nPractical check ki 'ye ek usable number hai': `typeof x === 'number' && !Number.isNaN(x)`.",
    followUp: "Number.isFinite aur global isFinite mein kya farak hai?",
  },
  {
    id: "nsb-3",
    question:
      "'JavaScript mein strings immutable hain' — iska kya matlab hai aur ek example do jahan ye surprise deta hai.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "String value ko banane ke baad badla nahi ja sakta. Har 'modifying' method (toUpperCase, slice, replace, trim) ek naya string return karta hai, original ko chhodta nahi. Surprise: s[0] = 'X' silently fail hota hai (strict mode mein TypeError), string change nahi hota.",
    detailedAnswer:
      "Primitive strings heap pe immutable hote hain. Iska matlab:\n\n```javascript\nlet s = 'hello';\ns[0] = 'H';          // no-op (strict mode: TypeError)\ns.toUpperCase();     // 'HELLO' return hua, par s abhi bhi 'hello'\ns = s.toUpperCase(); // ab s 'HELLO' -- reassignment se, mutation se nahi\n```\n\nFayde: strings safe hain share/pass karne ke liye, cache aur object keys ke liye reliable, koi 'kisi ne mera string badal diya' bug nahi.\n\nCost: ek loop mein hazaron `result += chunk` naye strings banata hai (har baar allocation). Bade string building ke liye array mein `push` karke end mein `join('')` faster aur cleaner hai — ye ek real perf pattern hai large report/CSV generation mein.",
    followUp: "Agar string immutable hai to `str += x` loop mein perf problem kyun? Behtar pattern kya?",
  },
  {
    id: "nsb-4",
    question: "BigInt kya hai, kab use karoge, aur uske saath kya restrictions hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "BigInt (ES2020) arbitrary-precision integers ke liye hai — jab values Number.MAX_SAFE_INTEGER (2^53 - 1) se aage jaati hain aur exact hone chahiye. Literal: 123n. Restrictions: Number ke saath mix nahi kar sakte (1n + 1 TypeError), decimals nahi (1.5n SyntaxError), JSON.stringify mein error.",
    detailedAnswer:
      "Use cases: 64-bit database IDs jinpe arithmetic karna hai, Snowflake/Discord IDs, cryptography, high-precision timestamps (nanoseconds), factorial/combinatorics jaha overflow hota.\n\n```javascript\nconst a = 9007199254740993n;\na + 2n; // 9007199254740995n -- exact\n```\n\nRestrictions:\n- Number ke saath implicit mix nahi: `1n + 1` TypeError. Explicitly `1n + BigInt(1)` ya `Number(1n) + 1`.\n- Sirf integers: `1.5n` SyntaxError, `10n / 3n` `3n` (truncated).\n- `JSON.stringify(1n)` TypeError — custom replacer chahiye ya string bana ke bhejo.\n- `typeof 10n` `'bigint'`.\n- Thoda slower Number se, aur Math.* functions (Math.sqrt etc.) BigInt accept nahi karte.\n\nAgar ID sirf pass-through hai (store karo, dikhao, wapas bhejo, arithmetic nahi), to plain string simpler hai BigInt se.",
    followUp: "Ek API jo BigInt IDs return karti hai — client pe JSON.parse ke time precision kaise bachaoge?",
  },
  {
    id: "nsb-5",
    question:
      "Ek e-commerce app cart total float numbers se calculate kar rahi hai (19.99 + 4.95 + ...). Kya problem hai aur kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Float precision errors accumulate hote hain — total 53.99999999999999 jaisa aa sakta hai, phir .toFixed rounding kabhi customer ya seller ke against jaati hai, aur payment gateway ko galat amount ja sakta hai. Fix: paise ko integer cents mein store aur add karo, ya decimal.js / dinero.js use karo.",
    detailedAnswer:
      "Problem: `[19.99, 4.95, 29.99].reduce((s, p) => s + p, 0)` kuch inputs pe `...9999` ya `...0001` deta hai. `.toFixed(2)` display theek kar deta hai par underlying value galat rehti hai, aur multiple such operations (tax, discount, shipping) pe error compound hota hai. Reconciliation aur audit mein ye mismatch pakda jaata hai.\n\nFixes (best se practical):\n1. Sab amounts ko integer minor units (paise/cents) mein rakho: price `1999` matlab 19.99. Addition/subtraction integers pe exact. Sirf UI pe `(x / 100).toFixed(2)` ya `Intl.NumberFormat`.\n2. `dinero.js` — money object with currency + rounding rules, immutable ops.\n3. `decimal.js` / `big.js` — general arbitrary-precision decimal, agar complex arithmetic (percentages, compound) hai.\n\nRule of thumb: currency kabhi raw JS float mein arithmetic ke liye mat rakho.",
    followUp: "Integer cents approach mein tax 18% lagana ho to rounding kaise handle karoge?",
    redFlag: "\"Bas har jagah .toFixed(2) laga do\" — wo sirf display fix karta hai, underlying error nahi.",
  },
];

export default questions;
