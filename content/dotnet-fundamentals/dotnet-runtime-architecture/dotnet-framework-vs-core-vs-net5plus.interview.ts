import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dotnet-framework-vs-core-tr-1",
    question: "`.NET Framework`, `.NET Core`, aur `.NET 5+` ka evolution timeline samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "`.NET Framework` (2002, Windows-only) → `.NET Core` (2016, cross-platform rewrite) → `.NET 5+` (2020, unification, 'Core' naam drop).",
    detailedAnswer:
      "`.NET Framework` (2002) Microsoft ka original, Windows-only, monolithic runtime tha. Cloud/cross-platform demand badhne par, `.NET Core` (2016) ko ground-up rewrite kiya gaya — open-source, modular, cross-platform. `.NET 5` (2020) se Microsoft ne `.NET Core`, `.NET Framework` ke relevant pieces, aur Mono/Xamarin ko unify kar diya aur 'Core' naam hata diya kyunki ab ek hi `.NET` platform tha going forward, yearly release cadence ke saath.",
    followUp: "`.NET Framework` ab bhi kyun use hota hai kuch companies me?",
  },
  {
    id: "dotnet-framework-vs-core-tr-2",
    question: "Naya greenfield project start karte waqt `.NET Framework` kyun nahi choose karoge?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "`.NET Framework` feature-frozen hai (`4.8` final version), sirf security patches milte hain — naya kaam current/LTS `.NET` version pe hota hai.",
    detailedAnswer:
      "`.NET Framework 4.8` (2019) is lineage ka final version hai — koi naya feature nahi aayega, sirf critical security patches. Cross-platform, performance improvements, modern language features (C# ke naye versions), aur active community support sab `.NET` (Core-lineage) me hi milta hai. Naya project `.NET Framework` pe start karna genuinely sirf tab justify hota hai jab kisi legacy Windows-only technology (jaise purana COM interop) se hard dependency ho.",
  },
  {
    id: "dotnet-framework-vs-core-tr-3",
    question: "LTS aur Current release ka difference kya hai, aur production ke liye kaunsa prefer karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "LTS (even-numbered, jaise `.NET 8`) = 3 saal support; Current (odd-numbered, jaise `.NET 9`) = 18 mahine — production usually LTS choose karta hai.",
    detailedAnswer:
      ".NET har November ek naya version release karta hai. Even-numbered versions (`6`, `8`, `10`) LTS (Long Term Support) hote hain — 3 saal ka support window, stability-focused. Odd-numbered (`5`, `7`, `9`) Current release hote hain — naye features jaldi milte hain, lekin sirf 18 mahine support, jisse frequent upgrades force hote hain. Production systems usually LTS pe rehte hain unless kisi Current release ka specific feature genuinely zaroori ho.",
  },
  {
    id: "dotnet-framework-vs-core-tr-4",
    question: "Kya `.NET Core` aur `.NET 5` alag runtimes hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `.NET 5` `.NET Core 3.1` ka hi direct successor hai, sirf naam se 'Core' hataya gaya.",
    detailedAnswer:
      "Ye ek common misconception hai. `.NET Core 1.0` → `2.x` → `3.1` ke baad agla version 'Core 4.0' nahi, seedha `.NET 5` aaya — jaan-boojhkar version number jump kiya gaya taaki `.NET Framework 4.x` se confuse na ho. Yeh ek naming/unification decision tha, ek naya alag runtime launch nahi. Same underlying codebase, continuous evolution.",
    redFlag: "'`.NET Core` aur `.NET 5+` dono alag products hain jo compete karte hain' bolna — ye batata hai timeline confuse ki gayi hai.",
  },
  {
    id: "dotnet-framework-vs-core-tr-5",
    question: "`.NET Core` ke early versions (1.x/2.x) me koi genuine limitation thi jo `.NET Framework` apps ko migrate karna mushkil banati thi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — WinForms/WPF jaise desktop UI frameworks `.NET Core 3.0` tak available nahi the, aur kai Windows-specific/COM-interop libraries port nahi ho sakti thi.",
    detailedAnswer:
      "`.NET Core` 1.x/2.x me focus web/cloud (ASP.NET Core, console apps) pe tha — desktop UI (WinForms, WPF) sirf `.NET Core 3.0` (2019) me add hui. Isliye purane desktop apps ya heavily Windows-API-dependent code ko migrate karna early versions me practically possible nahi tha, jo enterprise migration timelines ko lamba karta tha.",
  },
  {
    id: "dotnet-framework-vs-core-tr-6",
    question: "Ek Indian bank ka core banking engine `.NET Framework 4.8` pe hai, naye microservices `.NET 8` pe likhe ja rahe hain. Ye architecturally valid hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Haan — alag deployment units hain, network calls (HTTP/messaging) se integrate hote hain, same process/runtime share karne ki zaroorat nahi.",
    detailedAnswer:
      "Legacy `.NET Framework` service aur naye `.NET`-lineage microservices alag processes ke roop me independently deploy ho sakte hain, aur HTTP APIs ya message queues ke through communicate kar sakte hain. Ye ek common, valid incremental-modernization pattern hai — poora legacy system rewrite karna risky aur costly hota hai jab tak business case genuinely strong na ho.",
    followUp: "Is tarah ke coexistence me kaunsi cross-cutting concerns (jaise logging, auth) duplicate karni padengi?",
  },
  {
    id: "dotnet-framework-vs-core-tr-7",
    question: "`.NET Core` open-source hona practically kya fark laata hai ek team ke liye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Community bugs report/fix kar sakti hai, source code audit ho sakta hai, aur runtime internals (`dotnet/runtime` GitHub repo) publicly visible hain performance debugging ke liye.",
    detailedAnswer:
      "`.NET Core`/`.NET` ka source `github.com/dotnet/runtime` par publicly available hai — koi bhi bug report kar sakta hai, PR bhej sakta hai, ya deep performance issues debug karte waqt actual runtime implementation dekh sakta hai. `.NET Framework` bhi 2014 me source-available hua tha, lekin community contribution model utna active nahi tha jitna `.NET Core` se `.NET`-lineage me hai.",
  },
  {
    id: "dotnet-framework-vs-core-tr-8",
    question: "Ye statement sahi hai: '`.NET Framework` completely discontinued ho chuka hai, ab koi support nahi milta'?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Galat — `.NET Framework 4.8` still supported hai (security patches), sirf feature-frozen hai, naya development nahi hota.",
    detailedAnswer:
      "`.NET Framework` 'discontinued' nahi hai, 'feature-frozen/maintenance-mode' hai — Microsoft security aur critical bug fixes deti hai, lekin koi naya feature nahi aata. Bahut se production systems (banking, government, legacy enterprise) is version pe chalte rehte hain saalon tak, kyunki ye Windows OS ke saath hi bundled/supported hai.",
    redFlag: "'`.NET Framework` band ho gaya, koi use hi nahi karta' bolna — ye real-world enterprise landscape ki galat samajh dikhata hai.",
  },
];

export default questions;
