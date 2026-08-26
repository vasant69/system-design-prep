import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "clr-corecolr-corefx-tr-1",
    question: "CLR kya hai, aur ye kya-kya responsibilities handle karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer: "CLR (Common Language Runtime) .NET ka execution engine hai — memory management (GC), JIT compilation, type safety, exception handling, security handle karta hai.",
    detailedAnswer:
      "CLR ek concept/role hai jo .NET code ko run karne ke liye zimmedar hai: (1) Garbage Collector ke through automatic memory management, (2) IL ko JIT ke through native code me compile karna, (3) CTS rules ke against type safety enforce karna, (4) structured exception handling (`try`/`catch`/`finally`) implement karna, (5) security aur thread management support. Ye sab ek 'concrete implementation' ke through hota hai — `.NET Core`/`.NET 5+` me wo implementation CoreCLR hai.",
  },
  {
    id: "clr-corecolr-corefx-tr-2",
    question: "CoreCLR aur `.NET Framework` ke CLR me structural/purpose difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Same responsibilities nibhate hain, lekin CoreCLR cross-platform aur open-source hai, `.NET Framework` ka CLR Windows-only tha (2014 tak closed-source).",
    detailedAnswer:
      "Dono CLR ki responsibilities (memory management, JIT, type safety, exceptions) nibhate hain, lekin CoreCLR ek Platform Abstraction Layer (PAL) ke through Windows/Linux/macOS pe consistently kaam karta hai, jabki `.NET Framework`'s CLR sirf Windows APIs ke against tightly coupled tha. CoreCLR `github.com/dotnet/runtime` par publicly available hai — koi bhi internals dekh/contribute kar sakta hai. Performance-wise bhi CoreCLR ka GC aur JIT redesigned/improved implementations hain.",
    followUp: "Cross-platform hona practically kya enable karta hai jo pehle possible nahi tha?",
  },
  {
    id: "clr-corecolr-corefx-tr-3",
    question: "CoreFX kya tha, aur ye CoreCLR se kaise alag tha?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "CoreFX Base Class Library (BCL) ka implementation tha — `List<T>`, `String`, `HttpClient` jaisi classes; CoreCLR execution engine hai jo unhe run karta hai.",
    detailedAnswer:
      "CoreCLR 'kaise execute karna hai' handle karta hai (JIT, GC, type safety). CoreFX 'kya execute ho raha hai' provide karta hai — wo actual classes/methods jinke saath developers code likhte hain (collections, I/O, networking, LINQ, sab). Dono pehle alag GitHub repos the (`dotnet/coreclr`, `dotnet/corefx`), tightly coupled hone ki wajah se coordination overhead badha, isliye ~2020 me `dotnet/runtime` me merge kar diye gaye.",
  },
  {
    id: "clr-corecolr-corefx-tr-4",
    question: "Kya CLR sirf `.NET Core`/`.NET 5+` ka concept hai, `.NET Framework` me nahi tha?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Galat — `.NET Framework` ka bhi apna CLR implementation tha 2002 se, bas usko alag naam (CoreCLR) nahi diya gaya tha kyunki tab ek hi implementation thi.",
    detailedAnswer:
      "CLR concept `.NET Framework` ke saath hi 2002 se exist karta tha — `.NET Framework` ka CLR bhi memory management, JIT, type safety, exceptions handle karta tha, exactly wahi responsibilities jo aaj CoreCLR nibhata hai. Jab `.NET Core` aaya aur ek naya, alag (cross-platform, open-source) implementation banaya gaya, tabhi usse differentiate karne ke liye 'CoreCLR' naam diya gaya. `.NET Framework` ke implementation ko koi special naam nahi mila kyunki us waqt sirf ek hi tha.",
    redFlag: "'CoreCLR CLR se naya hai, `.NET Framework` me CLR tha hi nahi' bolna — history/timeline ki galat samajh dikhata hai.",
  },
  {
    id: "clr-corecolr-corefx-tr-5",
    question: "Ye code jab run hota hai, CLR/CoreCLR aur CoreFX/BCL me se kaun kya kaam karta hai?\n```csharp\nvar list = new List<int> { 1, 2, 3 };\nConsole.WriteLine(list.Sum());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`List<int>`/`Sum()` type definitions CoreFX/BCL se aate hain; object allocation, JIT translation, aur execution CoreCLR handle karta hai.",
    detailedAnswer:
      "`List<T>` aur LINQ ka `Sum()` — ye classes/methods BCL (originally CoreFX, ab `dotnet/runtime` ke andar) me define hain, pre-compiled assemblies (jaise `System.Private.CoreLib.dll`) ke through available. CoreCLR is IL ko load karta hai, JIT se native code me translate karta hai, `new List<int>()` ke liye heap allocation karta hai (jise baad me GC track karega), aur execution actually run karta hai. Simply put: BCL 'kya' provide karta hai, CoreCLR 'kaise chalta hai' handle karta hai.",
  },
  {
    id: "clr-corecolr-corefx-tr-6",
    question: "Aaj (2026 me) `.NET 8`/`.NET 9` ke context me 'CoreFX' naam kitna relevant hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Largely historical — `dotnet/corefx` repo `dotnet/coreclr` ke saath merge hokar `dotnet/runtime` ban chuka hai, ab sab kuch bas '.NET runtime/libraries' bola jaata hai.",
    detailedAnswer:
      "CoreFX naam ~2020 tak active tha jab tak `dotnet/corefx` ek separate repository thi. Uske baad Microsoft ne coordination simplify karne ke liye CoreCLR, CoreFX, aur core-setup teeno ko ek single `dotnet/runtime` repo me merge kar diya. Aaj Microsoft ki official terminology '.NET runtime' aur '.NET libraries' hai — 'CoreFX' term ab mostly historical/legacy documentation me hi milta hai, lekin interview me iska concept samajhna (BCL ka role) still relevant hai.",
  },
  {
    id: "clr-corecolr-corefx-tr-7",
    question: "CoreCLR cross-platform kaise achieve karta hai — Windows, Linux, macOS teeno pe consistent behavior?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Ek Platform Abstraction Layer (PAL) ke through jo OS-specific details ko abstract karta hai, taaki CoreCLR ka core logic OS-agnostic rahe.",
    detailedAnswer:
      "CoreCLR ka core (GC, JIT, type system) OS-independent hai, lekin file system access, threading primitives, memory-mapping jaisi cheezein har OS pe alag APIs maangti hain. Ek Platform Abstraction Layer (PAL) ye OS-specific calls ko wrap karta hai, taaki upar ka CoreCLR logic bina change kiye Windows, Linux, aur macOS teeno pe kaam kare. Ye `.NET Framework` ke Windows-tightly-coupled design se fundamentally different architecture hai.",
    followUp: "Is design ka koi performance trade-off hai abstraction layer hone ki wajah se?",
  },
  {
    id: "clr-corecolr-corefx-tr-8",
    question: "Ek team ye claim karti hai ki '.NET Core aur .NET Framework ka CLR functionally bilkul same hai, koi fark hi nahi.' Ye kitna accurate hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Partially sahi — high-level responsibilities (GC, JIT, type safety) same hain, lekin implementation details, platform support, aur performance characteristics genuinely different hain.",
    detailedAnswer:
      "Dono CLR implementations same category ki responsibilities nibhate hain (yehi 'CLR' hone ka matlab hai), lekin CoreCLR ek alag, redesigned implementation hai — cross-platform PAL, open-source codebase, alag GC tuning, alag JIT optimizations, aur modern features (jaise tiered compilation, better Server GC) jo `.NET Framework` ke CLR me evolve nahi hue. Isliye 'same concept, different concrete implementation with real differences' sabse accurate framing hai — 'bilkul same' overstatement hai.",
    redFlag: "'Dono me koi practical fark nahi hai, bas naam alag hai' — ye implementation-level differences (performance, platform support) ko ignore karta hai.",
  },
];

export default questions;
