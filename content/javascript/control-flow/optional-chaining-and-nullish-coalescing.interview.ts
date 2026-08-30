import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ocnc-1",
    question: "?? aur || mein kya farak hai? Ek example jahaan || bug deta hai aur ?? sahi hai.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "|| apne left ko truthiness pe judge karta hai — saari 8 falsy values (0, '', false, NaN, null, undefined) pe right side de deta hai. ?? sirf null/undefined pe right side deta hai. `count || 10` `count` 0 hone pe galti se 10 deta hai; `count ?? 10` 0 ko respect karta hai.",
    detailedAnswer:
      "```javascript\nfunction paginate(opts) {\n  const page = opts.page || 1;      // BUG: opts.page === 0 -> 1\n  const size = opts.size ?? 20;     // OK: opts.size === 0 -> 0\n}\n```\n\n`||` tab safe hai jab left sirf 'ek object / non-empty string / kuch nahi' ho sakta hai — jaise `opts.user || {}`. Par jaise hi `0`, `\"\"`, ya `false` legitimate value ban sakti hai (counts, prices, indices, text inputs, boolean flags), `||` galat hai kyunki wo unhe 'missing' maan leta hai. `??` sirf `null`/`undefined` — jo genuinely 'value hi nahi hai' ko represent karte hain — pe fallback deta hai. Rule: numeric/string/boolean defaults ke liye `??`; 'truthy object ya fallback' ke liye `||` chalega.",
    followUp: "?? ko || ya && ke saath ek expression mein bina parentheses mix kar sakte ho?",
    redFlag: "\"?? aur || basically same hain, bas ?? naya syntax hai\" — nahi, trigger set alag hai.",
  },
  {
    id: "ocnc-2",
    question: "Optional chaining ?. exactly kya karta hai? Ek case batao jahaan wo phir bhi TypeError dega.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`a?.b` — agar `a` null ya undefined hai to poori remaining chain skip hoke `undefined` return hoti hai, TypeError ke bajaye. Lekin `?.` sirf apne turant left ko guard karta hai — `a?.b.c` mein agar `b` undefined hai to `.c` plain access hai aur wo throw karega.",
    detailedAnswer:
      "`?.` ke forms: `a?.b` (property), `a?.[key]` (dynamic), `a?.()` (call), `arr?.[0]` (index). Jab left operand `null`/`undefined` ho, engine baaki poori chain evaluate hi nahi karta:\n\n```javascript\nconst obj = { a: null };\nobj?.a?.b?.c   // undefined — a null tha, .b.c skip\nobj?.a.b       // TypeError — a null tha par .b plain access hai\n```\n\nToh crash-safe banane ke liye har optional hop pe `?.` chahiye: `obj?.a?.b`. Doosra caveat: `?.` assignment ke left side pe allowed nahi (`a?.b = c` SyntaxError). Aur `?.()` sirf tab call karta hai jab function maujood ho — `cb?.()` = 'cb hai to call'.",
    followUp: "`a?.b.c` ko crash-safe kaise likhoge, aur `a?.()` kab useful hai?",
  },
  {
    id: "ocnc-3",
    question: "`res?.data?.items?.[0]?.name ?? 'N/A'` — is expression ko line by line explain karo.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`res` se shuru karke har `?.` hop pe check: agar us point pe null/undefined mila to poori expression undefined ban jaati hai (koi crash nahi). Aakhir mein `?? 'N/A'` — agar poora result undefined/null nikla to 'N/A', warna asli name.",
    detailedAnswer:
      "Step by step: (1) `res?.` — `res` null/undefined? -> undefined. (2) `.data?.` — `res.data` missing? -> undefined. (3) `.items?.` — array missing? -> undefined. (4) `?.[0]?.` — array khaali hai to `items[0]` undefined, `?.` uspe short-circuit. (5) `.name` — pehle item ka name. (6) `?? 'N/A'` — agar upar wali chain ne undefined diya (ya name explicitly null tha) to `'N/A'`, warna name.\n\nEk sookshm baat: agar `name` `\"\"` (empty string) hai, to `??` use valid maanta hai aur `\"\"` return hota hai, `'N/A'` nahi. Agar requirement ho ki blank name bhi `'N/A'` bane to wahaan `||` chahiye ya explicit check. Ye pattern external/paginated API responses ke liye standard hai jahaan shape guaranteed nahi.",
    followUp: "Agar critical field missing hone pe tum crash ke bajaye log-and-reject chahte ho, to ?. ke bajaye kya karoge?",
  },
  {
    id: "ocnc-4",
    question: "??=, ||=, &&= — ye kya karte hain aur kab use hote hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Logical assignment (ES2021), short-circuit ke saath: `a ??= b` -> a null/undefined ho to a = b. `a ||= b` -> a falsy ho to a = b. `a &&= b` -> a truthy ho to a = b. Right side tabhi evaluate hota hai jab test pass ho.",
    detailedAnswer:
      "```javascript\nconfig.timeout ??= 5000;      // default ensure — 0 respected\noptions.headers ??= {};        // 'object exist karta hai' guarantee\ncache[key] ??= expensiveCompute(key);  // memoize — compute sirf pehli baar\nuser.name ||= 'Anonymous';     // falsy (incl '') ko replace\nel.dataset.state &&= 'active'; // sirf jab pehle se truthy ho tab update\n```\n\nShort-circuit important hai: `cache[key] ??= expensiveCompute(key)` mein `expensiveCompute` tabhi chalta hai jab `cache[key]` missing ho. `??=` sabse common hai — 'set only if not already set'. `||=` tab jab empty string / 0 ko bhi 'unset' maana jaaye. `&&=` rare — 'jo pehle se hai use hi update karo'.",
    followUp: "`cache[key] ??= compute()` aur `cache[key] = cache[key] ?? compute()` mein farak hai kya?",
  },
  {
    id: "ocnc-5",
    question: "Kya optional chaining har jagah lagana ek achhi practice hai? Kyun / kyun nahi?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Nahi. `?.` sirf wahaan jahaan null/undefined ek legitimate expected state ho. Jahaan value kabhi null nahi honi chahiye, wahaan `?.` ek real bug ko crash ke bajaye silent `undefined` bana deta hai — failure baad mein kahin aur, samajhne mein mushkil jagah pe aati hai.",
    detailedAnswer:
      "Defensive `?.` spam ke do nuksaan: (1) **Bugs chhupte hain** — `const id = user?.id` jahaan `user` guaranteed hai; agar kisi refactor se `user` `null` aa gaya, to `id` `undefined` ban ke aage propagate hota hai, aur crash 3 functions door hota hai bina stack trace jo asli jagah point kare. Plain `user.id` wahin turant fail karta. (2) **Code noise + intent blur** — jab sab kuch `?.` hai to reader nahi bata sakta kaunsa field genuinely optional hai. Better approach: entry point pe data validate karo (Zod/manual), uske baad known-shape data pe plain access; `?.` sirf genuinely-optional fields (analytics metadata, optional callbacks, refs jo abhi mount nahi hue) ke liye. Rule of thumb: agar tum `?.` isliye laga rahe ho ki 'pata nahi shape kya hai', to problem `?.` nahi, missing validation hai.",
    followUp: "TypeScript is decision ko kaise easier bana deta hai?",
  },
];

export default questions;
