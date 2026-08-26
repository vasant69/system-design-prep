import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iqueryable-1",
    question: "`IQueryable<T>` par ek `.Where()` call likhne par lambda expression kya banta hai?",
    options: [
      "Ek compiled C# delegate, jaise IEnumerable ke saath",
      "Ek Expression Tree — 'code as data,' jise provider translate karta hai",
      "Ek raw SQL string, directly compiler dwara generate ki gayi",
      "Kuch nahi, ye sirf runtime pe interpret hota hai bina kisi structure ke",
    ],
    correctIndex: 1,
    explanation:
      "`IQueryable<T>` ke saath lambda ek Expression Tree me compile hota hai — ek data structure jo operation ko describe karta hai, directly execute nahi karta. Provider (jaise EF Core) is tree ko parse karke apni target language (jaise SQL) me translate karta hai. Option A `IEnumerable` ka behavior hai. Option C galat hai — compiler seedha SQL nahi generate karta, provider expression tree se SQL banata hai runtime pe. Option D galat hai, ek well-defined data structure banti hai.",
    difficulty: "medium",
  },
  {
    id: "iqueryable-2",
    question: "In do statements me se performance ke hisaab se kaunsa behtar hai, aur kyun?\n```csharp\n// A: dbContext.Employees.ToList().Where(e => e.Age > 40)\n// B: dbContext.Employees.Where(e => e.Age > 40).ToList()\n```",
    options: [
      "A behtar hai — pehle poora data le lena safer hai",
      "B behtar hai — filtering database-side (SQL WHERE clause ke through) hoti hai, sirf matching rows network se aati hain",
      "Dono exactly same performance dete hain",
      "Ye dono invalid code hain, compile nahi honge",
    ],
    correctIndex: 1,
    explanation:
      "Statement B me `.Where()` `.ToList()` se pehle chain hua hai, isliye poora expression IQueryable rehte hue ek SQL query me translate hota hai — sirf matching rows database se aati hain. Statement A me `.ToList()` pehle poori table memory me le aata hai, phir filtering memory me hoti hai — bade table ke liye ye genuinely bahut slow ho sakta hai. Options C aur D dono factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "iqueryable-3",
    question: "`IQueryable<T>` par ek aisa `.Where()` predicate likha jaaye jisme ek complex, arbitrary C# helper method call ho jo SQL me express nahi ho sakta. Kya hoga?",
    options: [
      "Compile-time error aayega",
      "Silently ignore ho jaayega aur poora data return hoga bina filter ke",
      "Runtime pe translation-failure exception aayega jab query enumerate hogi",
      "Automatically memory-side execution me fallback ho jaayega bina kisi error ke",
    ],
    correctIndex: 2,
    explanation:
      "Provider ko expression tree ko target language me translate karna hota hai — agar koi expression translate nahi ho sakta (jaise ek arbitrary custom C# method), ye runtime pe (query enumerate hone par, compile-time pe nahi, kyunki compiler ko translatability pata nahi hoti) ek exception throw karta hai. Options B aur D dono galat claims hain — koi silent fallback nahi hota (kuch specific providers/scenarios me client evaluation warnings/exceptions dete hain, lekin default modern EF Core behavior exception throw karna hai). Option A galat hai, ye ek runtime concern hai, compile-time nahi.",
    difficulty: "hard",
  },
  {
    id: "iqueryable-4",
    question: "`IQueryable<T>` `IEnumerable<T>` se inherit karta hai. Iska ek subtle practical risk kya hai?",
    options: [
      "IQueryable ko IEnumerable-typed parameter me pass karne se silently query in-memory execution me switch ho sakti hai, koi compile error ke bina",
      "IQueryable kabhi IEnumerable operations use nahi kar sakta",
      "Ye inheritance sirf naming convention hai, koi functional impact nahi",
      "IEnumerable ab deprecated ho gaya hai IQueryable ke aane ke baad",
    ],
    correctIndex: 0,
    explanation:
      "Kyunki `IQueryable<T>` `IEnumerable<T>` ka subtype hai, ise `IEnumerable<T>` expect karne wale kisi method/parameter me pass karna type-check pass kar jaata hai — lekin agar us context me `IEnumerable`-only extension methods use hote hain, query silently LINQ to Objects (in-memory) execution me switch ho jaati hai, database-side translation ka fayda kho kar. Ye koi compile error nahi deta, sirf performance silently degrade hoti hai. Options B, C, aur D sab factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
