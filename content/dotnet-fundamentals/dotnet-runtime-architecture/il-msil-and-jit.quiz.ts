import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "il-msil-and-jit-1",
    question: "C# compiler (Roslyn) directly kya output karta hai jab tum `dotnet build` chalate ho?",
    options: [
      "Native machine code (x64/ARM)",
      "IL (Intermediate Language / MSIL) — ek CPU-independent bytecode",
      "Python-jaisa interpreted script",
      "Assembly language directly",
    ],
    correctIndex: 1,
    explanation:
      "Roslyn source code ko IL (MSIL) me compile karta hai — ek CPU-independent bytecode, machine code nahi. Native machine code JIT compiler runtime pe banata hai. Option A galat hai — ye JIT ka kaam hai, compile-time ka nahi. Option C irrelevant hai, .NET interpreted nahi hai. Option D galat hai — assembly language bhi CPU-specific hoti, wo bhi JIT step me aati hai.",
    difficulty: "easy",
  },
  {
    id: "il-msil-and-jit-2",
    question: "JIT compiler kab ek method ko native code me compile karta hai?",
    options: [
      "App start hote hi, poori assembly ek saath",
      "Har baar jab method call ho, dobara se",
      "Jab method pehli baar call hoti hai — uske baad compiled result cache ho jaata hai",
      "Sirf jab developer explicitly compile command chalaye",
    ],
    correctIndex: 2,
    explanation:
      "JIT method-level, on-demand compilation karta hai — pehli call pe hi IL ko native code me translate karta hai, aur result cache kar leta hai. Isi method ke future calls dobara JIT nahi karte. Option A Pre-JIT/AOT jaisa concept hai, Normal JIT ka nahi. Option B galat hai, cache hone ki wajah se dobara compile nahi hota. Option D irrelevant hai, ye automatic runtime behavior hai.",
    difficulty: "medium",
  },
  {
    id: "il-msil-and-jit-3",
    question: "Tiered Compilation (`.NET Core 3.0+`) me Tier 0 aur Tier 1 ka kya role hai?",
    options: [
      "Tier 0 sirf debug builds ke liye, Tier 1 sirf release builds ke liye",
      "Tier 0 = fast, kam-optimized first compile (startup latency kam rakhne ke liye); Tier 1 = hot methods ka background re-compile, fully optimized",
      "Tier 0 aur Tier 1 dono exactly same kaam karte hain, redundancy ke liye",
      "Tier 1 pehle chalta hai, Tier 0 baad me",
    ],
    correctIndex: 1,
    explanation:
      "Tier 0 method ko jaldi, kam optimization ke saath compile karta hai taaki startup fast rahe. Agar method 'hot' ban jaaye (frequently called), runtime background me usse Tier 1 me re-compile karta hai, is baar full optimizations ke saath. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "il-msil-and-jit-4",
    question: "Ek e-commerce backend me ek order-total-calculation method lakhon baar call hoti hai, jabki ek admin-report method saal me kuch hi baar. Tiered compilation is scenario me kaise behave karega?",
    options: [
      "Dono methods hamesha Tier 0 pe reh jaayengi",
      "Order-total-calculation Tier 1 me promote ho jaayegi (hot path, full optimization), admin-report likely Tier 0 pe hi reh jaayegi (kabhi 'hot' nahi banti)",
      "Dono methods immediately Tier 1 me compile hongi app start hote hi",
      "JIT ye decide nahi kar sakta, developer ko manually specify karna padega",
    ],
    correctIndex: 1,
    explanation:
      "Tiered compilation ka poora point ye hai ki frequently-called (hot) methods automatically full-optimization Tier 1 me promote ho jaati hain, jabki rarely-called methods Tier 0 pe reh sakti hain — koi performance loss nahi kyunki wo bottleneck hi nahi hain. Ye automatic, runtime-driven decision hai, developer intervention ke bina.",
    difficulty: "hard",
  },
];

export default quiz;
