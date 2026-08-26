import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dotnet-standard-sdk-runtime-1",
    question: ".NET Standard actually kya hai?",
    options: [
      "Ek runnable .NET implementation jaise .NET 6 ya .NET 8",
      "Ek API specification/contract jo multiple implementations follow karte hain",
      "Ek deployment tool",
      "Ek testing framework",
    ],
    correctIndex: 1,
    explanation:
      ".NET Standard ek formal API specification hai — ye batata hai kaunse APIs har implementing runtime (Framework, Core, Xamarin) guarantee karega, taaki ek library sabme kaam kare. Ye khud koi runnable implementation nahi hai. Option A galat hai — .NET 6/8 actual implementations hain, Standard nahi. Options C aur D unrelated concepts hain.",
    difficulty: "easy",
  },
  {
    id: "dotnet-standard-sdk-runtime-2",
    question: "Production server pe sirf `aspnetcore-runtime` installed hai, SDK nahi. `dotnet build` command chalane par kya hoga?",
    options: [
      "Normally build ho jaayega, Runtime SDK ke saare features include karta hai",
      "Kaam nahi karega — build/compile karne ke liye SDK chahiye, Runtime sirf execute karne ke liye hota hai",
      "Automatically SDK download ho jaayega",
      "App crash ho jaayega runtime pe",
    ],
    correctIndex: 1,
    explanation:
      "Runtime sirf already-compiled apps execute karne ke liye hota hai — compiler (Roslyn), CLI build tooling isme nahi hote. `dotnet build`/`dotnet run` jaise commands SDK chahte hain. Ye deliberate design hai — production machines ko compiler ki zaroorat nahi honi chahiye. Options A, C, D sab galat premises hain.",
    difficulty: "medium",
  },
  {
    id: "dotnet-standard-sdk-runtime-3",
    question: ".NET 5+ ke baad .NET Standard ki relevance kaise badli?",
    options: [
      "Aur zyada important ho gaya, sab naye projects isko target karte hain",
      "Largely historical ho gaya — Framework/Core/Xamarin ke unification ke baad 'multiple implementations ke beech common contract' wali problem hi khatam ho gayi",
      "Koi fark nahi pada, wahi importance hai",
      ".NET Standard replace ho gaya .NET Framework se",
    ],
    correctIndex: 1,
    explanation:
      ".NET 5+ ne Framework, Core, aur Xamarin ko ek hi implementation me unify kar diya. Jab implementations hi ek reh gayi, to 'multiple implementations ke beech contract' ki original problem largely solve ho gayi, isliye naye projects ab directly net8.0 jaisa target karte hain, netstandard2.0 sirf legacy-Framework-compatibility ke liye reh gaya hai. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "dotnet-standard-sdk-runtime-4",
    question: "`dotnet-runtime` aur `aspnetcore-runtime` me kya fark hai?",
    options: [
      "Dono bilkul same hain, naam alag hai bas",
      "`aspnetcore-runtime` ek superset hai — ASP.NET Core specific hosting/web libraries ke saath, jo plain `dotnet-runtime` me nahi hoti",
      "`dotnet-runtime` sirf Windows ke liye hai, `aspnetcore-runtime` cross-platform",
      "`aspnetcore-runtime` sirf development ke liye use hota hai, production ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "`aspnetcore-runtime` `dotnet-runtime` ka superset hai — Kestrel aur ASP.NET Core hosting ke liye zaroori extra libraries include karta hai. Ek plain console/worker app ko sirf `dotnet-runtime` chahiye; ek Web API ko `aspnetcore-runtime` chahiye. Options A, C, D sab galat hain.",
    difficulty: "easy",
  },
];

export default quiz;
