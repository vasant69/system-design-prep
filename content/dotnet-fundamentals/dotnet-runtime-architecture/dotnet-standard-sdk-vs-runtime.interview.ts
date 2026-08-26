import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dotnet-standard-sdk-runtime-tr-1",
    question: ".NET Standard kya hai aur ye .NET Framework ya .NET Core jaisa 'version' kyun nahi hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer:
      ".NET Standard ek API specification hai, jo har .NET implementation guarantee karti hai support karegi — khud koi runnable implementation nahi.",
    detailedAnswer:
      ".NET Framework, .NET Core, Xamarin — ye sab genuine, runnable implementations hain. .NET Standard sirf ek contract hai: 'ye APIs har implementation me available honge.' Ek library jo `netstandard2.0` target karti hai, wo saari implementations pe chalti hai jo Standard 2.0 support karti hain — bina alag build ke. Ye multi-implementation era (2016-2020) ki cross-compatibility problem solve karne ke liye banaya gaya tha.",
    followUp: ".NET 5+ ke baad iska use case kaise badla?",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-2",
    question: "SDK aur Runtime me exact difference kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "SDK = poora development toolchain (compiler, CLI, templates) + ek Runtime; Runtime = sirf execute karne ke liye minimum.",
    detailedAnswer:
      "Runtime me CLR (execution engine), JIT compiler, GC, aur core BCL assemblies hote hain — bas itna ki ek already-compiled app chal sake. SDK isme C# compiler (Roslyn), `dotnet` CLI (`build`/`run`/`test`/`publish`), project templates (`dotnet new`), aur NuGet client add karta hai. SDK ⊃ Runtime — SDK install karne se Runtime automatically aa jaata hai, ulta nahi.",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-3",
    question: "Production server pe SDK install karna chahiye ya sirf Runtime? Kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Sirf matching Runtime — production ko compile karne ki zaroorat nahi, sirf pre-built app run karni hai.",
    detailedAnswer:
      "Production server pe app already `dotnet publish` se compiled ho chuki hoti hai — waha sirf `dotnet MyApp.dll` chalana hota hai. SDK install karna unnecessary disk space aur attack surface add karta hai (ek poora compiler toolchain jo kabhi use hi nahi hoga). Best practice: dev machines aur CI/CD build agents pe SDK, production/deployment targets pe sirf matching Runtime (web app ke liye `aspnetcore-runtime`).",
    followUp: "Docker multi-stage build me ye principle kaise apply hoti hai?",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-4",
    question: "`dotnet --list-sdks` aur `dotnet --list-runtimes` commands kya karte hain, aur ye kab useful hote hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Machine pe installed sab SDK/Runtime versions list karte hain — troubleshooting 'wrong version' issues me useful.",
    detailedAnswer:
      "Multiple SDK aur Runtime versions ek hi machine pe side-by-side install ho sakte hain. `dotnet --list-sdks` batata hai kaunsi build-capable versions hain, `dotnet --list-runtimes` batata hai kaunsi execute-only versions hain (dotnet-runtime, aspnetcore-runtime, windowsdesktop-runtime alag-alag list hote hain). Ye tab useful hota hai jab 'app kis version target kar raha hai vs machine pe kya installed hai' debug karna ho.",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-5",
    question: "Ek naya team member confuse hai ki unke naye Web API project ke liye `netstandard2.0` target karein ya `net8.0`. Tum kya suggest karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`net8.0` (ya current LTS) — jab tak specifically .NET Framework consumers support karna zaroori na ho.",
    detailedAnswer:
      "Ek Web API app khud directly deploy hoti hai, use kisi doosri implementation se consume nahi kiya jaata jaisa ek shared library hoti hai — isliye `netstandard2.0` ka original purpose (cross-implementation compatibility) yahan apply hi nahi hota. `net8.0` target karna bigger, modern API surface deta hai (jaise minimal APIs, latest C# features), aur .NET 5+ unification ke baad ye standard recommendation hai. `netstandard2.0` sirf tab jab genuinely ek shared class library banayi ja rahi ho jo .NET Framework consumers ko bhi support kare.",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-6",
    question: "Kya ye statement sahi hai: 'Runtime install karne se SDK ke saare features mil jaate hain, bas thoda halka hota hai'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — Runtime SDK ka subset hai, compiler/CLI build tooling/templates isme included nahi hote.",
    detailedAnswer:
      "Ye ek common misconception hai. Runtime aur SDK feature-wise same nahi hain 'bas size ka fark' — Runtime me genuinely compiler nahi hota, `dotnet build`/`dotnet new`/`dotnet test` jaise commands kaam nahi karenge. Ye rishta ek-tarfa hai: SDK ⊇ Runtime (SDK ek Runtime bundle karta hai), lekin Runtime install karne se SDK ke development-tooling features bilkul nahi milte.",
    redFlag: "'Runtime install kar lo, SDK jaisa hi hai bas chhota' bolna — feature-set difference ko size difference samajhna galat signal hai.",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-7",
    question: "`aspnetcore-runtime` install kiye bina, sirf `dotnet-runtime` ke saath ek ASP.NET Core Web API deploy karne ki koshish karoge to kya hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "App start hi nahi hoga — ASP.NET Core hosting/Kestrel-specific assemblies missing honge.",
    detailedAnswer:
      "`dotnet-runtime` sirf core CLR aur BCL deta hai — Kestrel, ASP.NET Core middleware pipeline, hosting infrastructure jaisi web-specific libraries isme nahi hoti. App start karne par typically ek `FileNotFoundException` ya assembly-load-failure milegi kisi ASP.NET Core-specific type ke liye. Fix: `aspnetcore-runtime` install karna (jo `dotnet-runtime` ka superset hai) ya self-contained deployment use karna jisme sab kuch bundled ho.",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-8",
    question: "Docker-based deployment me SDK vs Runtime image ka use kaise structure karoge, aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Multi-stage build — SDK image sirf build stage me, final image Runtime-only, taaki production image chhoti aur secure rahe.",
    detailedAnswer:
      "Pehla stage `mcr.microsoft.com/dotnet/sdk:8.0` use karta hai — source code compile/publish karne ke liye. Doosra (final) stage `mcr.microsoft.com/dotnet/aspnet:8.0` (ya `dotnet/runtime:8.0` non-web apps ke liye) use karta hai, aur pehle stage se sirf published output copy karta hai. Ye final image ka size significantly kam karta hai aur unnecessary compiler/tooling ko production image me shipping se bachata hai — security aur efficiency dono ke liye better.",
  },
  {
    id: "dotnet-standard-sdk-runtime-tr-9",
    question: "Ek library `netstandard2.0` target karti hai lekin naye C# 12 features (jaise primary constructors) use karna chahti hai. Kya ye possible hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Language version aur target framework alag cheezein hain — kuch naye C# features specific runtime APIs pe depend karte hain jo netstandard2.0 me missing ho sakte hain.",
    detailedAnswer:
      "Language compiler version (`LangVersion`) aur target framework (`TargetFramework`) independent settings hain — syntactic features (jaise pattern matching improvements) aksar kaam kar jaate hain purane targets pe bhi, lekin features jo naye BCL types/APIs pe depend karte hain (jaise kuch newer collection APIs, `Span<T>` improvements) `netstandard2.0` pe available nahi honge kyunki underlying runtime support nahi karta. Ye ek genuine trap hai — 'naya C# syntax' aur 'naya .NET API' alag guarantees hain.",
    redFlag: "Ye assume karna ki koi bhi naya C# version feature automatically kaam karega chahe target framework kuch bhi ho.",
  },
];

export default questions;
