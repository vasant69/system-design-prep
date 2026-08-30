import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tsc-1",
    question: "`&&` aur `||` operators kya return karte hain — boolean ya kuch aur?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Boolean nahi — apne do operands mein se ek. `a || b` = a agar a truthy hai warna b. `a && b` = a agar a falsy hai warna b. Isi wajah se `name || 'Guest'` (default) aur `isOpen && <Modal/>` (conditional render) patterns kaam karte hain.",
    detailedAnswer:
      "`||`: pehle `a` evaluate hota hai; agar `a` truthy hai to `a` return hota hai aur `b` chhua bhi nahi jaata; warna `b` return hota hai. `&&`: agar `a` falsy hai to `a` return hota hai (short-circuit), warna `b`. Result hamesha kisi ek operand ki actual value hoti hai:\n\n```javascript\n'hi' || 'x'   // 'hi'\n''   || 'x'   // 'x'\n0    && f()   // 0   (f kabhi nahi chala)\n1    && 2     // 2\n```\n\nAgar genuine boolean chahiye to `!!(a || b)` ya `Boolean(a && b)`. Common uses: `user.name || 'Guest'` (default), `isLoggedIn && <Dashboard/>` (render only when truthy), `user && user.address && user.address.city` (guard chain, aaj `?.` se replace).",
    followUp: "Toh `||` se default dene mein kya problem hai jab value 0 ya empty string ho?",
    redFlag: "\"&& aur || hamesha true/false return karte hain\" — galat, wo operands return karte hain.",
  },
  {
    id: "tsc-2",
    question: "Ternary aur if/else mein fundamental farak kya hai? Ek aise jagah batao jahan sirf ternary chalega.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Ternary ek expression hai (value banti hai), if/else ek statement hai (value nahi deta). Isliye ternary JSX ke andar, ek object literal ke andar, ya ek `const` ki right side pe use ho sakta hai — jahan if likha hi nahi ja sakta.",
    detailedAnswer:
      "`if` sirf code chalata hai, koi value produce nahi karta — isliye `const x = if (a) {...}` invalid hai. Ternary `cond ? a : b` poora ek value evaluate hota hai, to use kahin bhi rakh sakte ho jahan value expected ho:\n\n```jsx\n// JSX ke andar — if allowed nahi\n<span>{isLoading ? 'Loading...' : data.title}</span>\n\n// const ki RHS — if se let banana padta\nconst fee = amount > 1000 ? amount * 0.02 : 20;\n\n// object literal ke andar\nconst style = { color: active ? 'blue' : 'gray' };\n```\n\nJab branches multi-line ho, side-effects ho, ya 3+ cases ho — tab `if/else if` ya lookup object readable hota hai. Rule of thumb: value chahiye to ternary, action chahiye to if.",
    followUp: "Nested ternary kab tak acceptable hai?",
  },
  {
    id: "tsc-3",
    question: "`const RETRIES = process.env.MAX_RETRIES || 3` — is line mein kya bug ho sakta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Agar koi `MAX_RETRIES=0` set kare ('retry mat karo'), to `\"0\"`... actually env var string hoti hai, par point ye hai: agar value falsy hai (0, empty string) to `||` use ignore karke `3` de deta hai. Numeric 0 ya empty string legit ho to `??` chahiye.",
    detailedAnswer:
      "`||` apne left operand ko truthiness pe judge karta hai. `0`, `\"\"`, `false`, `NaN` — sab falsy hain, to `||` inhe 'not provided' maan ke default de deta hai. Config mein ye galat hai jab `0` ka apna matlab hai (0 retries, 0 timeout = no timeout, port 0 = OS picks). Fix nullish coalescing:\n\n```javascript\nconst raw = process.env.MAX_RETRIES;\nconst RETRIES = raw != null ? Number(raw) : 3;\n// ya: const RETRIES = Number(process.env.MAX_RETRIES ?? 3);\n```\n\n`??` sirf `null`/`undefined` pe right side deta hai — `0` aur `\"\"` ko as-is pass karta hai. `||` still theek hai jab left side sirf 'object ya nothing' ho (e.g. `config.user || {}`).",
    followUp: "`??` aur `||` ko ek expression mein bina parentheses ke mix kar sakte ho?",
    redFlag: "\"|| aur ?? same cheez hain\" — nahi, || falsy pe fallback deta hai, ?? sirf null/undefined pe.",
  },
  {
    id: "tsc-4",
    question: "Ye output batao: `console.log(1 && 2 && 3)`, `console.log(1 || 2 || 3)`, `console.log(null && 5)`.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "3, 1, null. `&&` sab truthy hai to aakhri (3). `||` pehla truthy (1), baaki evaluate nahi. `null && 5` — null falsy, to null return, 5 chhua nahi.",
    detailedAnswer:
      "`1 && 2 && 3`: `&&` pehle falsy operand pe rukta hai; koi falsy nahi, to aakhri operand `3` return. `1 || 2 || 3`: `||` pehle truthy operand pe rukta hai — `1` truthy, turant `1` return, `2` aur `3` evaluate hi nahi hote. `null && 5`: `null` falsy hai, `&&` `null` return karta hai aur `5` skip. Ye short-circuit demonstrate karta hai — ye sirf value ke baare mein nahi, side-effects ke baare mein bhi hai: `isReady && sendRequest()` mein `sendRequest()` sirf `isReady` truthy hone pe call hoti hai.",
    followUp: "`&&` aur `||` mein se kis ki operator precedence zyada hai? `a || b && c` kaise parse hota hai?",
  },
  {
    id: "tsc-5",
    question: "React component mein tum conditional rendering kaise karte ho, aur `{list.length && <List/>}` pattern se kya problem hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ternary jab dono branches meaningful ho (`isLoading ? <Spinner/> : <Content/>`), `&&` jab sirf 'ho to dikhao' ho (`error && <Alert/>`). `{list.length && <List/>}` bug hai — list khaali ho to `0` render ho jaata hai.",
    detailedAnswer:
      "`{list.length && <List/>}`: jab `list.length` `0` hai, `0 && <List/>` `0` return karta hai, aur React `0` ko renderable text child ki tarah UI mein daal deta hai (wo `null`/`false` ko skip karta hai par `0` ko nahi). Fixes:\n\n```jsx\n{list.length > 0 && <List items={list} />}   // boolean left side\n{list.length ? <List items={list} /> : null} // explicit null\n{!!list.length && <List items={list} />}      // coerce to boolean\n```\n\nGeneral rule: `&&` ke left side ko hamesha ek genuine boolean rakho JSX mein. Kai teams `eslint-plugin-react` ka `jsx-no-leaked-render` rule on karti hain jo exactly ye pakadta hai.",
    followUp: "Ternary vs && — agar ek hi branch chahiye to kaunsa cleaner hai aur kyun?",
  },
];

export default questions;
