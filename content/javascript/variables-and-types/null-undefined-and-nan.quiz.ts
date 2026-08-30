import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "null-undefined-and-nan-1",
    question: "`typeof null` aur `typeof undefined` kya dete hain?",
    options: [
      "'null' aur 'undefined'",
      "'object' aur 'undefined' — typeof null ek historical bug hai jo compat ke liye kabhi fix nahi hua",
      "'undefined' aur 'undefined'",
      "'object' aur 'object'",
    ],
    correctIndex: 1,
    explanation:
      "`typeof undefined` sahi se `'undefined'` deta hai. `typeof null` `'object'` deta hai — JS ke pehle version mein null ka internal type tag objects jaisa hi tha, aur ise fix karna web tod deta, to spec ne permanently 'object' rakh diya. Isliye null check karne ke liye `typeof` mat use karo, `x === null` (ya `x == null` dono ke liye) use karo.",
    difficulty: "easy",
  },
  {
    id: "null-undefined-and-nan-2",
    question: "`x == null` kis-kis value ke liye `true` deta hai?",
    options: [
      "Sirf null ke liye",
      "null, undefined, 0, '', false, NaN — sab falsy values ke liye",
      "Exactly null aur undefined ke liye, aur kisi ke liye nahi",
      "null, undefined, aur 0 ke liye",
    ],
    correctIndex: 2,
    explanation:
      "`==` ke coercion rules mein `null` aur `undefined` sirf ek-doosre ke (aur khud ke) barabar hote hain — kisi aur value ke nahi (`null == 0` bhi `false`). Isliye `x == null` ek safe, concise idiom hai 'x null ya undefined hai?' check karne ka, aur yahi `==` ka wo ek case hai jise style guides allow karte hain. `0`, `''`, `false`, `NaN` sab `false` dete hain.",
    difficulty: "medium",
  },
  {
    id: "null-undefined-and-nan-3",
    question:
      "`Number.isNaN('hello')` aur global `isNaN('hello')` kya dete hain aur kyun different?",
    options: [
      "Dono true — 'hello' ek number nahi hai",
      "Number.isNaN('hello') -> false (koi coercion nahi, 'hello' literally NaN value nahi); isNaN('hello') -> true (pehle Number('hello') = NaN karta hai)",
      "Dono false",
      "Number.isNaN('hello') -> true; isNaN('hello') -> false",
    ],
    correctIndex: 1,
    explanation:
      "`Number.isNaN(x)` sirf tab `true` deta hai jab `x` bilkul `NaN` value ho — koi type coercion nahi. `'hello'` ek string hai, NaN nahi, to `false`. Global `isNaN(x)` pehle `Number(x)` karta hai; `Number('hello')` `NaN` hai, to `true`. Ye global version misleading hai (`isNaN(undefined)` bhi `true`), isliye hamesha `Number.isNaN` use karo.",
    difficulty: "medium",
  },
  {
    id: "null-undefined-and-nan-4",
    question:
      "`const qty = userInput ?? 1;` vs `const qty = userInput || 1;` — user `0` enter karta hai. Dono ka result?",
    options: [
      "Dono 0 dete hain",
      "?? version -> 0 (0 null/undefined nahi); || version -> 1 (0 falsy hai)",
      "Dono 1 dete hain",
      "?? version -> 1; || version -> 0",
    ],
    correctIndex: 1,
    explanation:
      "`??` sirf `null` aur `undefined` pe right-hand side deta hai. `0` inme se nahi, to `qty` `0` rehta hai — jo aksar sahi hai (user ne genuinely 0 chuna). `||` har falsy value pe right-hand side deta hai, aur `0` falsy hai, to `qty` `1` ban jaata hai — ek silent bug. Numeric/boolean defaults ke liye hamesha `??`.",
    difficulty: "easy",
  },
];

export default quiz;
