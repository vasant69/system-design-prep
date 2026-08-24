import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "repo-uow-1",
    question: "EF Core ke context me, `DbContext` aur `DbSet<T>` already kaunse do design patterns ka role play karte hain?",
    options: [
      "Singleton aur Factory",
      "Unit of Work (DbContext) aur Repository (DbSet<T>)",
      "Observer aur Strategy",
      "Chain of Responsibility aur Decorator",
    ],
    correctIndex: 1,
    explanation:
      "EF Core ki official documentation khud bhi ye explicitly describe karti hai — DbContext apne change-tracking aur SaveChangesAsync() ke through Unit of Work ka role play karta hai, aur har DbSet<T> ek collection-jaisa CRUD interface deta hai jo Repository pattern jaisa hi hai. Options A, C, D sab unrelated design patterns hain jo is exact overlap ko describe nahi karte.",
    difficulty: "hard",
  },
  {
    id: "repo-uow-2",
    question: "EF Core ke upar ek extra Repository/Unit-of-Work layer ke against sabse common, well-known criticism kya hai?",
    options: [
      "Ye compile hi nahi hoga",
      "Ye needless indirection ban sakta hai — same cheez ko dobara implement karna jo DbContext/DbSet<T> already deta hai",
      "EF Core is pattern ko explicitly disallow karta hai",
      "Ye sirf legacy .NET Framework me valid tha, .NET Core me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Well-documented criticism ye hai ki ye ek abstraction ke upar doosri, largely redundant abstraction ban jaata hai — extra interfaces/classes/mapping bina real benefit ke, jab EF Core already dono patterns deta hai. Option A factually galat hai, code compile hota hai. Option C galat hai, EF Core isko disallow nahi karta, sirf redundant ho sakta hai. Option D bhi galat hai, ye .NET Core/EF Core context me bhi equally applicable debate hai.",
    difficulty: "hard",
  },
  {
    id: "repo-uow-3",
    question: "In teen me se kaunsa ek genuine, valid reason hai Repository layer add karne ka, EF Core hone ke bawajood?",
    options: [
      "Kyunki har production app me ye hona chahiye, best practice hai",
      "Heavy mocking-based unit tests chahiye jahan DbContext ko mock karna genuinely awkward hai",
      "Kyunki DbSet<T> me LINQ query karna allowed nahi hai",
      "Kyunki EF Core transactions support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Ek genuine reason hai unit testing ki zaroorat jahan real database chhoote — DbContext/DbSet<T> ko directly mock karna awkward hai (IQueryable ka full behavior fake karna mushkil), ek thin repository interface mock karna kahin easier hai. Option A galat hai, topic explicitly is blanket statement ko reject karta hai. Options C aur D dono factually galat hain — DbSet<T> LINQ fully support karta hai, aur EF Core transactions ko SaveChangesAsync() ke through handle karta hai.",
    difficulty: "medium",
  },
  {
    id: "repo-uow-4",
    question: "Ek Repository interface se `IQueryable<T>` return karna kyun problematic maana jaata hai?",
    options: [
      "Kyunki IQueryable<T> compile nahi hota interfaces me",
      "Kyunki ye abstraction ka point khatam kar deta hai — caller ab bhi EF Core-specific query composition pe depend karta hai",
      "Kyunki IQueryable<T> sirf synchronous operations support karta hai",
      "Kyunki DbSet<T> IQueryable<T> implement hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Agar repository IQueryable<T> return karta hai, caller abhi bhi EF Core-specific deferred-execution query-building pe depend kar raha hai (jaise .Where(), .Include() chain karna) — actual persistence technology abstract nahi hui, ye sirf ek thin wrapper hai jo asli benefit nahi deta. Options A, C, D sab factually galat hain — koi compile issue nahi, IQueryable async bhi support karta hai (via extension methods), aur DbSet<T> genuinely IQueryable<T> implement karta hai.",
    difficulty: "hard",
  },
];

export default quiz;
