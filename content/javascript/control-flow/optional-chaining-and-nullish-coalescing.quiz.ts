import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "optional-chaining-and-nullish-coalescing-1",
    question: "`0 ?? 'x'` aur `0 || 'x'` ke results kya hain?",
    options: [
      "Dono 'x'",
      "Dono 0",
      "`0 ?? 'x'` -> 0; `0 || 'x'` -> 'x'",
      "`0 ?? 'x'` -> 'x'; `0 || 'x'` -> 0",
    ],
    correctIndex: 2,
    explanation:
      "`??` right side sirf tab deta hai jab left `null` ya `undefined` ho — `0` in dono mein se nahi hai, to `0` return hota hai. `||` har falsy value pe right side deta hai, aur `0` falsy hai, to `'x'` return hota hai. Yahi `??` vs `||` ka core farak — isliye numeric/boolean defaults ke liye `??` chahiye, warna legitimate `0` galti se replace ho jaata hai.",
    difficulty: "easy",
  },
  {
    id: "optional-chaining-and-nullish-coalescing-2",
    question: "`const obj = { a: { b: undefined } }; obj?.a?.b?.c` — kya hota hai? Aur `obj?.a?.b.c`?",
    options: [
      "Dono undefined dete hain",
      "Pehla undefined; doosra TypeError kyunki `.c` `?.` ke baad plain access hai aur b undefined hai",
      "Dono TypeError",
      "Pehla TypeError; doosra undefined",
    ],
    correctIndex: 1,
    explanation:
      "`obj?.a?.b?.c` — `b` `undefined` hai, `?.` uspe short-circuit karke poori chain `undefined` return karta hai, no crash. `obj?.a?.b.c` mein `b` ke baad `.c` **plain** access hai (`?.` nahi) — `undefined.c` `TypeError` deta hai. `?.` sirf apne turant left ko guard karta hai, aage ki plain access ko nahi. Isliye har optional hop pe `?.` chahiye.",
    difficulty: "medium",
  },
  {
    id: "optional-chaining-and-nullish-coalescing-3",
    question: "Ek `user` object jo tumne abhi function ke andar banaya hai aur jo kabhi null nahi ho sakta — uspe `user?.name` likhne ka kya nuksaan hai?",
    options: [
      "Kuch nahi, ?. hamesha safe aur better hai",
      "Performance kaafi slow ho jaati hai",
      "Agar kisi bug se `user` galti se null aa jaaye, to crash ke bajaye `undefined` silently propagate hota hai — real bug chhup jaata hai",
      "?. sirf API data pe kaam karta hai, local objects pe nahi",
    ],
    correctIndex: 2,
    explanation:
      "`?.` tab lagana chahiye jab `null`/`undefined` ek legitimate expected state ho. Jahaan value kabhi null honi hi nahi chahiye, wahaan `?.` ek genuine bug (jaise galat assignment) ko loud crash ke bajaye silent `undefined` bana deta hai, jo baad mein kahin aur weird failure deta hai. Plain `user.name` us case mein turant, saaf jagah crash karega. Option D galat — `?.` kisi bhi value pe kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "optional-chaining-and-nullish-coalescing-4",
    question: "`config.timeout ??= 5000;` — ye line kya karti hai?",
    options: [
      "`config.timeout` ko hamesha 5000 set kar deti hai",
      "`config.timeout` ko 5000 set karti hai sirf tab jab wo abhi `null` ya `undefined` ho; 0 ya koi aur value ho to chhod deti hai",
      "`config.timeout` ko 5000 set karti hai jab wo koi bhi falsy value ho (0, '', false bhi)",
      "SyntaxError — ??= valid operator nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "`??=` logical nullish assignment hai (ES2021): `a ??= b` sirf tab `a = b` karta hai jab `a` `null`/`undefined` ho, aur short-circuit karta hai (right side tabhi evaluate hota hai). `config.timeout = 0` ho to wo bacha rehta hai — ye `||=` se farak hai jo `0`/`''`/`false` ko bhi replace kar deta. 'Ensure a default exists' ya 'compute once' (`cache[k] ??= expensive()`) ke liye ye pattern use hota hai.",
    difficulty: "easy",
  },
];

export default quiz;
