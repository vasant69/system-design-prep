import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "efcore-fund-1",
    question: "EF Core primarily kis problem ko solve karta hai raw ADO.NET ke comparison me?",
    options: [
      "Database connections ko faster banata hai",
      "Manual column-to-object mapping boilerplate ko automate karta hai LINQ-based querying ke through",
      "SQL Server ke alawa doosre databases se connect karne deta hai sirf",
      "Application ki memory usage ko automatically kam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "EF Core ka core value proposition manual mapping boilerplate ko eliminate karna hai — developer LINQ likhta hai, EF Core SQL generate/execute karta hai aur results ko automatically objects me map karta hai. Options A, C, D EF Core ke primary purpose ko galat describe karte hain — connection speed ya database-agnosticism side benefits ho sakte hain lekin core value proposition nahi hain.",
    difficulty: "easy",
  },
  {
    id: "efcore-fund-2",
    question: "`DbContext` ko ASP.NET Core me kaunsa DI lifetime hona chahiye, aur kyun?",
    options: [
      "Singleton — performance ke liye ek hi instance reuse karna best hai",
      "Scoped — har HTTP request ko apna fresh instance milna chahiye, kyunki DbContext thread-safe nahi hai",
      "Transient — har injection point pe naya instance",
      "Koi bhi lifetime chalega, farak nahi padta",
    ],
    correctIndex: 1,
    explanation:
      "`DbContext` Scoped lifetime use karta hai by convention — har HTTP request apna khud ka fresh, isolated `DbContext` instance leta hai. Singleton (option A) dangerous hai kyunki `DbContext` thread-safe nahi hai, concurrent requests ek hi instance share karke change-tracker corruption cause kar sakti hain. Transient (option C) technically kaam kar sakta hai lekin unnecessary hai jab ek hi request ke andar multiple services same DbContext share karna chahte hain (Unit-of-Work consistency ke liye) — Scoped exactly ye deta hai.",
    difficulty: "medium",
  },
  {
    id: "efcore-fund-3",
    question: "`DbSet<T>` kaunsa interface implement karta hai jo LINQ queries ko possible banata hai?",
    options: ["IEnumerable<T> only", "IQueryable<T>", "ICollection<T> only", "IList<T>"],
    correctIndex: 1,
    explanation:
      "`DbSet<T>` `IQueryable<T>` implement karta hai, jo EF Core ko LINQ expressions ko expression trees ke through capture karne aur SQL me translate karne deta hai (execute hone se pehle). Ye distinction — `IQueryable` vs `IEnumerable` — is section ke `linq-fundamentals` module me deeply cover hoti hai, kyunki ye decide karta hai ki filtering database me hoti hai ya memory me.",
    difficulty: "medium",
  },
  {
    id: "efcore-fund-4",
    question: "EF Core use karne ka trade-off (cost) kya hai raw ADO.NET/Dapper ke comparison me?",
    options: [
      "EF Core kabhi bhi SQL translate nahi kar paata complex queries ke liye",
      "Kuch runtime overhead (query translation + change tracking bookkeeping), aur generated SQL kabhi-kabhi hand-tuned SQL jitna optimized nahi hota",
      "EF Core sirf ek hi database provider support karta hai",
      "EF Core migrations support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "EF Core ka genuine trade-off ye hai ki translation aur change-tracking ka runtime cost hota hai, aur extremely perf-critical paths me generated SQL hand-written, carefully-tuned SQL se kam optimal ho sakta hai. Options A, C, D sab factually galat hain — EF Core complex queries handle karta hai (kuch limitations ke saath), multiple providers support karta hai, aur migrations EF Core ki ek core feature hai.",
    difficulty: "medium",
  },
];

export default quiz;
