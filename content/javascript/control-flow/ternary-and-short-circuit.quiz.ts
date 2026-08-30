import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ternary-and-short-circuit-1",
    question: "`0 || 'fallback'` aur `0 && 'next'` ke results kya hain?",
    options: [
      "'fallback' aur 'next'",
      "'fallback' aur 0",
      "0 aur 0",
      "true aur false",
    ],
    correctIndex: 1,
    explanation:
      "`||` pehla truthy operand deta hai, warna aakhri — `0` falsy hai to `'fallback'` return hota hai. `&&` pehla falsy operand deta hai — `0` falsy hai to `0` hi return hota hai, `'next'` evaluate hi nahi hoti (short-circuit). Option D galat — ye operators operands return karte hain, boolean nahi. Option A/C conditions ko ulta samajh rahe hain.",
    difficulty: "easy",
  },
  {
    id: "ternary-and-short-circuit-2",
    question: "`function make(opts) { const retries = opts.retries || 3; }` — `make({ retries: 0 })` ke baad `retries` kya hai aur kyun bug hai?",
    options: [
      "0 — sahi hai, koi bug nahi",
      "3 — kyunki 0 falsy hai, to || use 'not provided' samajh ke default de deta hai; agar 0 ek valid value hai to ye bug hai",
      "undefined",
      "TypeError kyunki retries const hai",
    ],
    correctIndex: 1,
    explanation:
      "`0` falsy hai, to `opts.retries || 3` `3` return karta hai — bhale user ne explicitly `0` bheja ho ('retry mat karo'). Jab `0`/`\"\"`/`false` legitimate values hon to `||` ki jagah `??` chahiye: `opts.retries ?? 3` `0` ko respect karega aur sirf `null`/`undefined` pe `3` dega. Option A galat — result `0` nahi `3` hai. Option D galat — `const` ko ek baar assign karna theek hai.",
    difficulty: "medium",
  },
  {
    id: "ternary-and-short-circuit-3",
    question: "React JSX mein `{items.length && <List />}` jab `items` khaali hai to kya render hota hai?",
    options: [
      "Kuch nahi — React falsy ko skip karta hai",
      "Literal 0 screen pe dikhta hai, kyunki `0 && <List/>` `0` return karta hai aur React 0 ko text ki tarah render karta hai",
      "<List /> render hota hai empty state ke saath",
      "Error: 'objects are not valid as a React child'",
    ],
    correctIndex: 1,
    explanation:
      "`items.length` `0` hai; `0 && <List/>` short-circuit karke `0` return karta hai. React `null`/`undefined`/`false`/`true` ko skip karta hai par `0` ek valid renderable number child hai — to UI mein akela `0` dikh jaata hai. Fix: `{items.length > 0 && <List/>}` ya `{items.length ? <List/> : null}`. Option A galat — 0 skip nahi hota. Option D galat — number child valid hai.",
    difficulty: "medium",
  },
  {
    id: "ternary-and-short-circuit-4",
    question: "Ternary `cond ? a : b` ko `if/else` ki jagah kab prefer karna chahiye?",
    options: [
      "Hamesha — ternary tez chalta hai",
      "Jab tumhe ek single value chahiye (assign / return / JSX) do meaningful alternatives ke beech, aur branches multi-line nahi hain",
      "Jab 3 ya zyada branches ho",
      "Jab har branch mein multiple statements aur side-effects ho",
    ],
    correctIndex: 1,
    explanation:
      "Ternary ek expression hai — wo value deta hai, isliye assignment, `return`, ya JSX ke andar fit hota hai jahan `if` statement nahi likha ja sakta; aur `const` bhi bana sakte ho. Option C aur D dono ternary ke against hain — 3+ branches (nested ternary) aur multi-line side-effect branches ke liye `if/else if` ya lookup better hai. Option A galat — performance farak meaningful nahi, aur 'hamesha' readability kharab karta hai.",
    difficulty: "easy",
  },
];

export default quiz;
