import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "conditionals-and-truthy-falsy-1",
    question: "In mein se kaun si value TRUTHY hai?",
    options: [
      "\"\" (empty string)",
      "0",
      "[] (empty array)",
      "NaN",
    ],
    correctIndex: 2,
    explanation:
      "`[]` ek object hai, aur sirf 8 values falsy hain — `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`. Empty array us list mein nahi hai, isliye truthy. Option A (`\"\"`), B (`0`), aur D (`NaN`) teeno us 8-value falsy list mein hain. Isliye `if (arr)` kabhi 'array khaali hai' nahi batata.",
    difficulty: "easy",
  },
  {
    id: "conditionals-and-truthy-falsy-2",
    question: "`function f(count) { if (!count) return 'none'; return count; }` — `f(0)` kya return karta hai aur kya ye sahi hai?",
    options: [
      "0 — kyunki 0 truthy hai",
      "'none' — aur ye aksar bug hota hai kyunki 0 ek valid count ho sakta hai",
      "undefined — count define nahi hua",
      "TypeError",
    ],
    correctIndex: 1,
    explanation:
      "`0` falsy hai, to `!count` `true` ban jaata hai aur function `'none'` return karta hai. Agar '0 items' ek legitimate answer hai to ye bug hai — `f(0)` ko `0` dena chahiye tha. Fix: `if (count == null)` (sirf null/undefined) ya `if (count === undefined)`. Option A galat — `0` falsy hai. Option C/D galat — `count` `0` pass hua hai, koi error nahi.",
    difficulty: "medium",
  },
  {
    id: "conditionals-and-truthy-falsy-3",
    question: "Tumhe check karna hai ki `x` sirf `null` YA `undefined` hai (aur `0`, `\"\"`, `false` ko exclude karna hai). Sabse saaf tarika?",
    options: [
      "if (!x)",
      "if (x == null)",
      "if (x === null)",
      "if (x === false)",
    ],
    correctIndex: 1,
    explanation:
      "`x == null` loose equality deliberately sirf `null` aur `undefined` dono ko match karti hai, aur kisi aur falsy value ko nahi — yahi ek jagah `==` idiomatic hai. Option A (`!x`) `0`, `\"\"`, `false`, `NaN` ko bhi pakad leta hai. Option C sirf `null` match karta hai, `undefined` chhod deta hai. Option D `false` ke alawa kuch match nahi karta.",
    difficulty: "medium",
  },
  {
    id: "conditionals-and-truthy-falsy-4",
    question: "Guard clause pattern ka main fayda kya hai?",
    options: [
      "Code tez chalta hai kyunki conditions skip hoti hain",
      "Preconditions upar hi handle ho jaati hain aur happy-path code nested nahi hota (flat rehta hai)",
      "Ye `else` ko compulsory banata hai",
      "Ye truthy/falsy coercion ko disable kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Guard clause = 'agar precondition fail, turant return/throw/continue'. Isse bura case pehle nikal jaata hai aur asli logic bina nesting ke, left margin pe seedha rehta hai — `else` ki zaroorat khatam. Option A galat — performance ka faayda meaningful nahi, ye readability pattern hai. Option C ulta hai — guard clauses `else` hatate hain. Option D bakwaas — coercion aise disable nahi hota.",
    difficulty: "easy",
  },
];

export default quiz;
