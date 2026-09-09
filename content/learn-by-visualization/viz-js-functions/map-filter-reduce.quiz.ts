import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "map-filter-reduce-1",
    question: "`const r = [1, 2, 3].forEach((n) => n * 2);` — `r` kya hoga?",
    options: [
      "`[2, 4, 6]`",
      "`undefined` — `forEach` hamesha `undefined` return karta hai",
      "`[1, 2, 3]`",
      "`3`",
    ],
    correctIndex: 1,
    explanation:
      "`forEach` sirf side-effect ke liye hai — har element pe callback chalata hai aur `undefined` return karta hai. Naya array chahiye to `map` use karo: `[1,2,3].map((n) => n*2)` -> `[2,4,6]`. Ye `map` vs `forEach` ka sabse common confusion hai.",
    difficulty: "easy",
  },
  {
    id: "map-filter-reduce-2",
    question: "`[].reduce((acc, n) => acc + n)` (bina initial value ke) — kya hota hai?",
    options: [
      "`0` return karta hai",
      "`undefined` return karta hai",
      "`TypeError: Reduce of empty array with no initial value`",
      "`NaN`",
    ],
    correctIndex: 2,
    explanation:
      "Bina initial value ke `reduce` pehle element ko accumulator maan leta hai — par empty array mein koi element hi nahi, isliye `TypeError`. Hamesha initial value do (`, 0` numbers ke liye, `, {}` object build ke liye) — tab empty array pe wahi initial value safely return hoti hai.",
    difficulty: "medium",
  },
  {
    id: "map-filter-reduce-3",
    question:
      "10 lakh items hain. `.map(expensive).filter(isValid)` vs `.filter(isValid).map(expensive)` — kaunsa behtar?",
    options: [
      "Dono same — order se farak nahi padta",
      "`.filter().map()` — pehle rows kam karo, phir sirf bache rows pe expensive transform chale",
      "`.map().filter()` — hamesha map pehle",
      "Chaining se hamesha bachna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Har method poore (current) array pe chalta hai aur ek naya array banata hai. Agar pehle `map(expensive)` kiya to expensive transform saari 10 lakh rows pe chalega, phir filter unhe kaatega. Pehle `filter` karke rows ghata do, phir `map` sirf bachi rows pe — kam kaam, result same.",
    difficulty: "medium",
  },
  {
    id: "map-filter-reduce-4",
    question:
      "Users ke array ko `{ [id]: user }` lookup object mein badalna hai. Sabse seedha tarika?",
    options: [
      "`users.map((u) => ({ [u.id]: u }))`",
      "`users.filter((u) => u.id)`",
      "`users.reduce((acc, u) => { acc[u.id] = u; return acc; }, {})`",
      "`users.forEach((u) => acc[u.id] = u)` bina `acc` declare kiye",
    ],
    correctIndex: 2,
    explanation:
      "`reduce` ka accumulator kuch bhi ho sakta hai — yahan ek object `{}`. Har step pe `acc[u.id] = u` set karke `acc` return karo. `map` yahan galat hai kyunki wo array deta hai (chhote objects ka array, ek merged object nahi). Modern alternative: `Object.fromEntries(users.map((u) => [u.id, u]))`.",
    difficulty: "medium",
  },
];

export default quiz;
