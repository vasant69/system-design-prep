import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "integration-testing-waf-1",
    question:
      "`WebApplicationFactory<TEntryPoint>` primarily kya karta hai?",
    options: [
      "Sirf ek mock HttpClient banata hai, koi real app nahi boot karta",
      "Poori ASP.NET Core app ko in-memory boot karta hai — real routing, middleware, DI ke saath",
      "Database ko automatically real se in-memory replace kar deta hai",
      "Sirf controller classes ko unit test karta hai, HTTP involve nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "`WebApplicationFactory<T>` genuinely poori app pipeline ko in-memory boot karta hai — real middleware, routing, DI container — aur ek real HttpClient deta hai jo actual HTTP requests bhej sakta hai. Option A galat hai kyunki ye sirf mock client nahi, real request pipeline hai. Option C galat hai — database swap manually `WithWebHostBuilder` se karna padta hai, automatic nahi hota. Option D unit testing describe karta hai, jo different concept hai.",
    difficulty: "medium",
  },
  {
    id: "integration-testing-waf-2",
    question:
      "EF Core InMemory provider ko database-behavior-sensitive integration tests ke liye use karna kyun risky hai?",
    options: [
      "Ye deprecated hai aur ab support nahi karta",
      "Ye real foreign-key/unique constraints enforce nahi karta aur SQL translation ko accurately simulate nahi karta",
      "Ye sirf .NET Framework me kaam karta hai, .NET Core me nahi",
      "Ye Testcontainers se zyada slow hai",
    ],
    correctIndex: 1,
    explanation:
      "InMemory provider real SQL database ka behavior accurately replicate nahi karta — constraints enforce nahi hote, kuch SQL-specific query translations silently pass ho jaate hain jo real database pe fail hote. Ye tests ko false-green bana sakta hai. Option A factually galat hai (deprecated nahi hai). Option C galat hai. Option D ulta hai — InMemory actually Testcontainers se FASTER hai, lekin problem speed nahi, correctness hai.",
    difficulty: "hard",
  },
  {
    id: "integration-testing-waf-3",
    question:
      "`IClassFixture<WebApplicationFactory<Program>>` use karne ka main fayda kya hai?",
    options: [
      "Ye tests ko parallel run karwata hai",
      "Ek hi factory instance poore test class ke saare tests ke beech share hota hai, repeated app-startup cost avoid hoti hai",
      "Ye automatically database ko reset karta hai har test ke baad",
      "Ye sirf xUnit ke bina bhi kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`IClassFixture<T>` xUnit ka mechanism hai jisse ek expensive-to-create object (yahan WebApplicationFactory, jo poori app boot karta hai) ek baar banaya jaaye aur poore test class ke tests ke beech share ho, taaki har test se pehle app dobara boot na karni pade. Options A, C, aur D iska actual purpose describe nahi karte.",
    difficulty: "medium",
  },
  {
    id: "integration-testing-waf-4",
    question:
      "Test pyramid guidance ke hisaab se, ek healthy test suite me kaunsa distribution hona chahiye?",
    options: [
      "Sirf integration tests, unit tests ki zaroorat nahi",
      "Bahut saare unit tests, kam integration tests, sabse kam end-to-end tests",
      "Equal number of unit aur integration tests",
      "Sirf end-to-end tests, sabse comprehensive coverage ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Test pyramid principle kehta hai fast, granular unit tests sabse zyada hone chahiye (cheap, quick feedback), integration tests kam (slower, real wiring verify karte hain), aur end-to-end tests sabse kam (slowest, most brittle). Options A, C, aur D is balance ko galat represent karte hain — extremes dono directions me impractical hain.",
    difficulty: "easy",
  },
];

export default quiz;
