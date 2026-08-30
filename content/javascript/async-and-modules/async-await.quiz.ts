import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-await-1",
    question:
      "```javascript\nconst a = await fetchA(); // 1s\nconst b = await fetchB(); // 1s\n```\n`fetchA` aur `fetchB` independent hain. Isme kya problem hai?",
    options: [
      "Kuch nahi — ye optimal hai",
      "Ye ~2s leta hai kyunki `fetchB` `fetchA` ke poora hone ka wait karta hai; independent hone par `Promise.all([fetchA(), fetchB()])` ~1s lega",
      "`await` do baar use karne se syntax error hoga",
      "`b` hamesha `undefined` hoga",
    ],
    correctIndex: 1,
    explanation:
      "Har `await` apne se pehle wale ka wait karta hai, isliye do independent 1s calls sequential chal ke ~2s leti hain. Kyunki inke beech koi data dependency nahi, inhe parallel fire karna chahiye: `const [a, b] = await Promise.all([fetchA(), fetchB()])` — dono saath shuru, total ~1s (sabse slow wala). Ye sabse common async performance bug hai. Option C/D galat hain — syntax valid hai aur `b` sahi value paata hai, bas der se.",
    difficulty: "medium",
  },
  {
    id: "async-await-2",
    question: "`await someOtherThing()` ek async function ke andar — ye kya karta hai?",
    options: [
      "Poore JavaScript thread ko block kar deta hai jab tak promise settle na ho",
      "Sirf us async function ka execution us jagah pause karta hai aur control caller ko wapas deta hai; baaki code chalta rehta hai, settle hone par function microtask ke roop mein resume hota hai",
      "Ek naya thread banata hai jispe promise chalta hai",
      "Promise ko synchronously resolve karke value turant deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`await` non-blocking hai. Wo sirf enclosing async function ko suspend karta hai (ek bookmark ki tarah), control caller ko lautata hai, aur baaki program — event handlers, doosre callbacks — normal chalte rehte hain. Awaited promise settle hone par function ka baaki hissa microtask queue se resume hota hai. Ye synchronous blocking (jaise ek `while` loop) se bilkul alag hai. Isiliye `await` UI freeze nahi karta. Option A/C/D common galat dhaarnaayein hain.",
    difficulty: "easy",
  },
  {
    id: "async-await-3",
    question:
      "```javascript\nconst r = ids.map(async (id) => await fetchOne(id));\nconsole.log(r);\n```\n`r` mein kya hoga?",
    options: [
      "Fetched data ka array",
      "Ek single Promise jo poore array pe resolve hota hai",
      "Promises ka array — `map` async callbacks ka wait nahi karta; `await Promise.all(ids.map(id => fetchOne(id)))` chahiye",
      "`undefined`, kyunki `map` async ke sanaath kaam nahi karta",
    ],
    correctIndex: 2,
    explanation:
      "`async` callback hamesha ek Promise return karta hai, aur `Array.prototype.map` sirf har return value collect karta hai — wo un promises ko settle nahi karta. Isliye `r` promises ka array hai. Actual data ke liye `const data = await Promise.all(ids.map(id => fetchOne(id)))` (parallel) ya `for...of` + `await` (sequential). Option A tabhi sahi hota jab `Promise.all` se wrap kiya hota. `.forEach` to aur bura — wo return value bhi discard kar deta hai.",
    difficulty: "medium",
  },
  {
    id: "async-await-4",
    question:
      "Ek `async` function jo `return 42` karta hai. Caller ko kya milega, aur `async/await` ne Promises ki zaroorat khatam kar di?",
    options: [
      "Caller ko `42` seedhe milta hai; haan, ab Promise ki zaroorat nahi",
      "Caller ko `Promise` milta hai jo `42` pe resolve hota hai; nahi — `async/await` sugar hai, aur `Promise.all`/`race`/`allSettled` jaise combinators abhi bhi chahiye",
      "Caller ko `undefined` milta hai; Promise optional hai",
      "Syntax error — `async` function plain value return nahi kar sakta",
    ],
    correctIndex: 1,
    explanation:
      "`async` function hamesha Promise return karta hai — plain `42` bhi `Promise.resolve(42)` mein wrap ho jaata hai, isliye caller ko `await` ya `.then` chahiye. `async/await` Promises ke upar syntax sugar hai, replacement nahi: parallel execution ke liye `Promise.all`, timeout ke liye `Promise.race`, partial results ke liye `Promise.allSettled` — ye sab abhi bhi zaroori hain. Option A/C/D galat hain.",
    difficulty: "easy",
  },
];

export default quiz;
