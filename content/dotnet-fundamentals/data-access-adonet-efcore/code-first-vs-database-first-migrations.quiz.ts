import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "codefirst-1",
    question: "Code-First approach me database schema ka source of truth kya hota hai?",
    options: [
      "Database khud, code baad me generate hota hai",
      "C# entity classes — schema unse migrations ke through generate hota hai",
      "Ek separate XML configuration file",
      "DBA ki documentation",
    ],
    correctIndex: 1,
    explanation:
      "Code-First me C# entity classes source of truth hote hain — `dotnet ef migrations add` unse ek migration file generate karta hai, aur `dotnet ef database update` use actual database schema me apply karta hai. Ye Database-First (option A jaisa) se exact opposite direction hai.",
    difficulty: "easy",
  },
  {
    id: "codefirst-2",
    question: "`dotnet ef dbcontext scaffold` command kya karta hai?",
    options: [
      "C# classes se ek naya database create karta hai",
      "Existing database ko inspect karke C# entity classes aur DbContext generate karta hai",
      "Migrations ko database pe apply karta hai",
      "Pending migrations ka list dikhata hai",
    ],
    correctIndex: 1,
    explanation:
      "`dbcontext scaffold` Database-First workflow ka core command hai — existing database (tables, columns, foreign keys) ko inspect karke matching C# entity classes aur `DbContext` reverse-generate karta hai. Option C `database update` ka kaam hai, option A Code-First ka reverse hai, option D koi standard EF Core command nahi hai directly is naam se.",
    difficulty: "medium",
  },
  {
    id: "codefirst-3",
    question: "Ek migration file me `Up()` aur `Down()` methods ka kya purpose hai?",
    options: [
      "Up() database connection open karta hai, Down() close karta hai",
      "Up() schema ko forward apply karta hai, Down() usi migration ko rollback karta hai",
      "Up() production ke liye hai, Down() development ke liye",
      "Inka koi functional purpose nahi hai, sirf naming convention hai",
    ],
    correctIndex: 1,
    explanation:
      "`Up()` woh schema changes describe karta hai jo migration apply karne par hote hain (forward direction), aur `Down()` unhi changes ko reverse karta hai (rollback ke liye, jaise agar koi migration galat apply ho gayi ho). Ye bidirectional control migration-based schema evolution ka core safety mechanism hai.",
    difficulty: "medium",
  },
  {
    id: "codefirst-4",
    question: "Ek company ka ek central database hai jise 4 alag applications share karte hain aur ek dedicated DBA team schema ko independently govern karti hai. Naye application ke liye kaunsa approach zyada fit baithega?",
    options: [
      "Code-First — kyunki ye hamesha better hai",
      "Database-First — kyunki database ek shared, independently-governed resource hai, application isko drive nahi kar sakta",
      "Dono equally bekaar hain is scenario me",
      "Raw ADO.NET, EF Core is scenario me kabhi use nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Jab database multiple applications ke beech shared hai aur ek independent DBA team schema govern karti hai, application team ko schema 'own' karne ka sense nahi banta — Database-First (scaffolding) fit baithta hai, jahan application current schema ke against apni classes generate karti hai, aur schema change hone par dobara scaffold karti hai. Code-First (option A) is scenario me galat hoga kyunki application schema changes drive nahi kar sakti jab wo shared resource hai.",
    difficulty: "hard",
  },
];

export default quiz;
