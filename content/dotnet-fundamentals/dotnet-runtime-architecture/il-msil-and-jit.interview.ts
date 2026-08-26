import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "il-msil-and-jit-tr-1",
    question: "C# source code se lekar actual execution tak ka poora compilation pipeline explain karo.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer: "C# source -> Roslyn compiler -> IL/MSIL (CPU-independent) -> JIT (runtime) -> native machine code, per-method on first call.",
    detailedAnswer:
      "Roslyn (C# compiler) `.cs` files ko IL me compile karta hai — ek CPU-independent bytecode jo `.dll`/`.exe` me store hota hai. Runtime pe, CoreCLR ka JIT compiler har method ko uski pehli call pe IL se native machine code me translate karta hai, aur compiled result cache kar leta hai future calls ke liye. Isliye ek `.dll` file cross-platform hoti hai (IL platform-independent hai), lekin actual execution us specific machine ke liye optimized native code se hoti hai.",
    followUp: "IL platform-independent hone ka practical benefit kya hai?",
  },
  {
    id: "il-msil-and-jit-tr-2",
    question: "JIT poori assembly ko app start hote hi compile karta hai, ya kuch aur strategy follow karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Nahi — JIT method-by-method, on-demand compile karta hai, jab method pehli baar call ho, poori assembly upfront nahi.",
    detailedAnswer:
      "JIT 'Just-In-Time' hai — matlab compilation tab hoti hai jab genuinely zaroorat ho. Jo methods kabhi call hi nahi hote, unke liye kabhi JIT nahi chalta. Ye 'lazy' approach startup ko fast rakhta hai kyunki poori assembly upfront compile nahi karni padti — sirf wo methods jo actually execution path me aate hain, compile hote hain, aur wo bhi ek baar (result cache hota hai).",
  },
  {
    id: "il-msil-and-jit-tr-3",
    question: "Tiered Compilation kya problem solve karta hai jo simple Normal JIT nahi kar paata tha?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Startup latency aur peak throughput ke beech trade-off — Tier 0 fast startup deta hai, Tier 1 hot paths ko full optimization deta hai bina startup slow kiye.",
    detailedAnswer:
      "Bina tiering ke, JIT ko choose karna padta: ya to har method ko jaldi lekin kam-optimized compile karo (startup fast, lekin hot loops suboptimal reh jaate hain), ya har method ko fully-optimized compile karo (hot paths fast, lekin startup slow ho jaata hai kyunki poori optimization pipeline har method pe chalti hai, chahe wo baar-baar call ho ya na ho). Tiered Compilation dono chahta hai: Tier 0 se fast start, aur Tier 1 se — background me, bina blocking ke — hot methods ko baad me re-optimize karna. Ye especially container/serverless environments (fast cold-start critical) ke liye designed hai.",
    followUp: "Server (ASP.NET Core) aur short-lived CLI tool ke liye JIT strategy me kya fark ho sakta hai?",
  },
  {
    id: "il-msil-and-jit-tr-4",
    question: "Kya C# source directly native machine code me compile hota hai, jaise C++?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — C# ek intermediate step (IL/MSIL) ke through jaata hai, jise JIT runtime pe native code me translate karta hai.",
    detailedAnswer:
      "C++ jaisi languages directly source ko target-machine-specific native code me compile karti hain (ahead of time). C# do-step process follow karta hai: Roslyn source ko CPU-independent IL me compile karta hai (build time), phir JIT runtime pe us IL ko native code me translate karta hai (per-method, on first call). Ye extra step hi .NET ko genuinely cross-platform aur cross-language interoperable banata hai.",
    redFlag: "'C# bhi C++ ki tarah directly machine code me compile hota hai' bolna — ye IL/JIT ki poori pipeline miss karta hai.",
  },
  {
    id: "il-msil-and-jit-tr-5",
    question: "Ye simple method IL me roughly kaise represent hoti hai?\n```csharp\npublic int Add(int a, int b)\n{\n    return a + b;\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Stack-based instructions — dono parameters stack pe load, `add` instruction, phir `ret` — IL ek stack machine model follow karta hai.",
    detailedAnswer:
      "IL stack-based hai (register-based nahi, jaise kai native instruction sets hote hain). Roughly: `ldarg.1` (load `a` onto the evaluation stack), `ldarg.2` (load `b`), `add` (pop dono values, unhe add karo, result stack pe push karo), `ret` (top-of-stack value return karo). JIT is stack-based IL ko target machine ke register-based native instructions me translate karta hai, jo ek genuinely non-trivial transformation hai.",
  },
  {
    id: "il-msil-and-jit-tr-6",
    question: "Pre-JIT (historical `ngen.exe`) aur Normal JIT me trade-off kya tha?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Pre-JIT startup fast karta hai (sab kuch pehle se compiled), lekin Normal JIT ke runtime-specific optimizations (jaise actual CPU features detect karke) ka fayda miss kar deta hai.",
    detailedAnswer:
      "Pre-JIT (`.NET Framework` ka `ngen.exe`, conceptually modern AOT/ReadyToRun ka predecessor) poori assembly ko app run hone se pehle hi native code me compile kar deta tha — startup fast, kyunki runtime pe JIT compile karne ki zaroorat nahi. Trade-off ye tha ki compile-time pe target machine ke exact runtime characteristics (jaise available CPU instructions) utni precisely nahi maloom hoti jitni Normal JIT ko runtime pe malum hoti hai, isliye kuch runtime-adaptive optimizations miss ho sakte the. Ye exact trade-off aaj bhi AOT vs JIT discussion me relevant hai.",
    followUp: "Ye Pre-JIT concept modern .NET me kaise evolve hua hai?",
  },
  {
    id: "il-msil-and-jit-tr-7",
    question: "Ek method jo app ke poore lifetime me sirf ek baar call hoti hai (jaise startup configuration load karna), uske liye JIT compilation ka overhead worth hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Haan, unavoidable hai (JIT ke bina wo run hi nahi ho sakti), lekin overhead genuinely chhota hota hai kyunki Tier 0 fast-compile use hota hai by default.",
    detailedAnswer:
      "Har method — chahe ek baar call ho ya lakhon baar — pehli call se pehle JIT-compile honi hi hai, kyunki IL directly execute nahi ho sakta. Lekin modern tiered compilation is overhead ko minimize karta hai — Tier 0 ki fast-unoptimized-compile use hoti hai by default, jo one-time-call methods ke liye perfectly fine hai (unhe kabhi Tier 1 promotion ki zaroorat hi nahi padegi kyunki wo 'hot' nahi banti).",
  },
  {
    id: "il-msil-and-jit-tr-8",
    question: "Ek same C# assembly ko Windows aur Linux dono machines pe bina rebuild kiye chalaya ja sakta hai — ye kaise possible hai given ki dono ka native machine code alag hota hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Kyunki assembly me sirf IL (CPU-independent) stored hota hai — JIT har machine pe alag-alag, us machine-specific native code generate karta hai runtime pe.",
    detailedAnswer:
      "Compile-time pe generate hone wala IL kisi bhi CPU architecture ke liye specific nahi hota — ye ek abstract, platform-independent bytecode hai. Jab wahi assembly Windows-x64 pe chalti hai, CoreCLR ka JIT usse x64 native instructions me compile karta hai; jab wahi assembly (bina rebuild kiye) Linux-ARM64 pe chalti hai, JIT usse ARM64 native instructions me compile karta hai. IL ek baar generate hota hai, native code har target machine ke liye runtime pe alag-alag generate hota hai — yehi 'build once, run anywhere' ka underlying mechanism hai.",
    followUp: "Native AOT is portability ko kaise affect karta hai?",
  },
];

export default questions;
