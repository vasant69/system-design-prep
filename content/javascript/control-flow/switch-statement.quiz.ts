import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "switch-statement-1",
    question: "`switch (2) { case 1: console.log('a'); case 2: console.log('b'); case 3: console.log('c'); break; case 4: console.log('d'); }` — kya print hota hai?",
    options: [
      "Sirf 'b'",
      "'b' aur 'c'",
      "'a', 'b', 'c'",
      "'b', 'c', 'd'",
    ],
    correctIndex: 1,
    explanation:
      "`2 === 2` pe match hota hai, wahan se code chalna shuru: `'b'` print. `case 2` mein `break` nahi hai, to fall-through hoke `case 3` ka `'c'` bhi print hota hai, phir `break` switch se bahar nikaal deta hai. `case 1` match hi nahi hua isliye `'a'` nahi. `case 4` `break` ke baad hai isliye `'d'` nahi. Ye fall-through ka classic example hai.",
    difficulty: "medium",
  },
  {
    id: "switch-statement-2",
    question: "`switch (userInput) { case '1': return 'one'; }` — `userInput` number `1` (not string) hai. Kya hota hai?",
    options: [
      "'one' return hota hai — switch loose equality use karta hai",
      "Koi case match nahi hota (case '1' string hai, switch === use karta hai) — default ya undefined",
      "TypeError",
      "Automatically string '1' mein convert hoke match ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`switch` cases ko **strict `===`** se compare karta hai — koi type coercion nahi. `1 === '1'` `false` hai, to ye case match nahi karega; agar `default` hai to wo chalega, warna `switch` bina kuch kiye khatam. Fix: `switch (String(userInput))` ya `case 1:` (number). Option A/D galat — `switch` `==` nahi karta.",
    difficulty: "easy",
  },
  {
    id: "switch-statement-3",
    question: "Har case sirf ek value return karta hai (`case 'info': return 'Information'` type). Behtar approach?",
    options: [
      "switch hi rakho — sabse fast hai",
      "Ek lookup object: `const MAP = { info: 'Information', ... }; return MAP[kind] ?? fallback` — ye control flow nahi, data hai",
      "Nested ternary chain",
      "if / else if chain",
    ],
    correctIndex: 1,
    explanation:
      "Jab har branch sirf ek value-to-value mapping hai, wo data hai, control flow nahi — ek lookup object (ya Map) ek line mein likha jaata hai, test karna aur naye keys add karna trivial hai, aur keys config/plugin se aa sakti hain. `switch` tab behtar jab har branch mein real multi-step logic ho. Option C/D bhi zyada boilerplate hain pure mapping ke liye. Option A — micro-performance farak yahan meaningful nahi.",
    difficulty: "medium",
  },
  {
    id: "switch-statement-4",
    question: "`switch` ke ek case mein `const result = ...` likhne pe kabhi-kabhi 'Identifier already declared' error kyun aata hai?",
    options: [
      "const switch ke andar allowed nahi hai",
      "Saare cases ek hi lexical scope share karte hain — do cases mein same naam se `const`/`let` clash karta hai; har case body ko `{ }` block mein wrap karo",
      "switch ko strict mode chahiye",
      "case ke baad break zaroori hai warna const leak hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek `switch` ke saare cases ek single block scope share karte hain. Do alag cases mein `const result` likhne ka matlab same scope mein do baar declare karna — `SyntaxError`. Solution: jis case body mein `let`/`const` ho use apne `{ }` block mein wrap karo, taaki har case ka apna scope ho. Option A galat — `const` switch ke andar theek hai, bas scoping ka issue hai.",
    difficulty: "easy",
  },
];

export default quiz;
