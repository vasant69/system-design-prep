import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "expr-trees-1",
    question: "`Func<int, bool> f = x => x > 5;` aur `Expression<Func<int, bool>> e = x => x > 5;` me fundamental fark kya hai?",
    options: [
      "Koi fark nahi, dono exactly same cheez hain",
      "`f` ek compiled, directly-executable delegate hai; `e` ek inspectable data structure (expression tree) hai jise chalane ke liye pehle .Compile() karna padta hai",
      "`e` faster hota hai `f` se, kyunki ye pre-optimized hota hai",
      "`f` sirf value types ke saath kaam karta hai, `e` reference types ke saath",
    ],
    correctIndex: 1,
    explanation:
      "`Func<int, bool>` ek compiled delegate hai — directly `f(10)` jaisa call kiya ja sakta hai. `Expression<Func<int, bool>>` ek expression tree hai — 'code as data,' ek data structure jo lambda ki structure describe karti hai, lekin directly call NAHI ki ja sakti; execute karne ke liye pehle `.Compile()` call karna padta hai jo ek delegate return karta hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "expr-trees-2",
    question: "`IQueryable<T>`'s `Where` method expression-tree-based parameter kyun leta hai, `IEnumerable<T>`'s `Where` jaisa plain delegate kyun nahi?",
    options: [
      "Ye sirf ek historical design accident hai, koi functional reason nahi",
      "Taaki provider (jaise EF Core) us tree ko inspect/traverse karke SQL jaisi doosri language me translate kar sake — ek compiled delegate ko inspect nahi kiya ja sakta",
      "Expression trees delegates se faster execute hote hain",
      "IEnumerable ke saath expression trees support hi nahi karte C# me",
    ],
    correctIndex: 1,
    explanation:
      "Ye poore `IQueryable`/LINQ-to-Entities mechanism ka core reason hai — expression tree ek inspectable data structure hai, isliye provider isko walk karke apni marzi se interpret (SQL me translate) kar sakta hai. Ek compiled delegate sirf 'chalaya' ja sakta hai, uske andar ka logic runtime pe inspect nahi kiya ja sakta. Options A, C, D sab galat hain — ye ek deliberate, functional design choice hai.",
    difficulty: "hard",
  },
  {
    id: "expr-trees-3",
    question: "```csharp\nvar employees = new List<Employee> { /* Id: 1, Id: 1, Id: 2 (duplicate Id!) */ };\nvar dict = employees.ToDictionary(e => e.Id, e => e.Name);\n```\nDuplicate `Id` hone par kya hoga?",
    options: [
      "Pehla wala overwrite ho jaayega, dusra wins",
      "ArgumentException throw hoga — duplicate keys allowed nahi hain ToDictionary me",
      "Dono entries dictionary me alag-alag store ho jaayengi",
      "Silently duplicate ko skip kar dega",
    ],
    correctIndex: 1,
    explanation:
      "`ToDictionary` unique keys expect karta hai — agar koi duplicate key mile, `ArgumentException` ('An item with the same key has already been added') throw hota hai. Ye `Dictionary<TKey, TValue>` ke underlying constraint ka hi direct consequence hai. Options A, C, D sab is actual behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "expr-trees-4",
    question: "`AsEnumerable()` aur `ToList()` me kya fark hai jab ek `IQueryable` (EF Core) source par call kiya jaaye?",
    options: [
      "Dono exactly same kaam karte hain — turant database query chalate hain",
      "AsEnumerable() sirf static type ko IEnumerable me badalta hai (koi immediate query execution nahi), jabki ToList() turant enumerate karke ek naya materialized collection banata hai",
      "ToList() sirf static type badalta hai, AsEnumerable() data materialize karta hai",
      "AsEnumerable() sirf non-database collections ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`AsEnumerable()` sirf compile-time type ko `IEnumerable<T>` me switch karta hai — isse aage chain hone wale operators `Enumerable`'s (in-memory, delegate-based) overloads resolve karenge, lekin koi data abhi immediately load nahi hota (query abhi bhi deferred hai). `ToList()` turant query ko enumerate karke ek concrete, materialized collection banata hai — immediate execution. Options A, C, D sab is difference ko galat represent karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
