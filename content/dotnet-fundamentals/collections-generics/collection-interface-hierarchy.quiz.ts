import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "collection-hierarchy-1",
    question: "Ek method ko sirf ek collection ko iterate karna hai, koi mutation ya index access nahi chahiye. Sabse appropriate parameter type kya hoga?",
    options: [
      "`List<T>`",
      "`ICollection<T>`",
      "`IEnumerable<T>`",
      "`IList<T>`",
    ],
    correctIndex: 2,
    explanation:
      "'Accept the least-specific interface you need' principle ke mutabik, agar sirf iteration chahiye, `IEnumerable<T>` sabse appropriate hai — ye caller ko maximum flexibility deta hai (array, List, HashSet, LINQ query — sab accept ho jaate hain). Options A, B, D sab zaroorat se zyada specific hain, jo unnecessarily caller ki flexibility restrict karte hain.",
    difficulty: "easy",
  },
  {
    id: "collection-hierarchy-2",
    question: "`IEnumerable<T>` type ke variable pe `.Count` property directly access karne ki koshish karna kya karega?",
    options: [
      "O(1) me count return karega, jaise ICollection",
      "Compile error — `IEnumerable<T>` me `Count` property exist nahi karti; `.Count()` LINQ extension method use karna padega jo O(n) hai",
      "Runtime exception aayega",
      "`0` return karega hamesha",
    ],
    correctIndex: 1,
    explanation:
      "`IEnumerable<T>` interface me `Count` property define hi nahi hai — sirf `GetEnumerator()`. `Count` (property) `ICollection<T>` me define hai. `IEnumerable<T>` pe agar count chahiye, `System.Linq`'s `.Count()` extension method use karna padta hai, jo poori sequence enumerate karke count karta hai — O(n), `ICollection<T>.Count`'s typical O(1) ke muqable slow. Options A, C, D sab galat hain.",
    difficulty: "medium",
  },
  {
    id: "collection-hierarchy-3",
    question: "`IQueryable<T>` `IEnumerable<T>` se fundamentally kaise alag hai?",
    options: [
      "Koi fark nahi, dono identical hain",
      "`IEnumerable<T>` in-memory delegate-based filtering karta hai; `IQueryable<T>` expression trees banata hai jo ek provider (jaise EF Core) SQL me translate karta hai",
      "`IQueryable<T>` sirf read-only collections ke liye hai",
      "`IEnumerable<T>` sirf database queries ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "`IEnumerable<T>` (LINQ to Objects) memory me hi filtering/projection karta hai, C# delegates ke through. `IQueryable<T>` (LINQ to Entities, jaise EF Core) execution ko defer karta hai aur expression trees banata hai — 'code as data' — jinhe query provider apni target query language (jaise SQL) me translate karta hai, execution database pe hoti hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "collection-hierarchy-4",
    question: "`List<T>` konse collection interfaces implement karta hai simultaneously?",
    options: [
      "Sirf `IList<T>`",
      "`IEnumerable<T>`, `ICollection<T>`, aur `IList<T>` sab ek saath",
      "Sirf `IEnumerable<T>`",
      "Koi bhi collection interface nahi",
    ],
    correctIndex: 1,
    explanation:
      "`List<T>` ek saath teeno interfaces implement karta hai — `IEnumerable<T>` (iteration), `ICollection<T>` (count/mutation), aur `IList<T>` (indexing/insertion) — isliye ek `List<T>` instance kisi bhi method me pass ho sakta hai jo in teeno me se koi bhi interface parameter type me accept karta ho. Options A, C, D incomplete ya galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
