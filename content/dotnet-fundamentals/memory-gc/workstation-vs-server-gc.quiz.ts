import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "workstation-server-gc-1",
    question: "Ek naya ASP.NET Core Web API project bina koi explicit GC config ke banaya gaya. Default me kaunsa GC mode active hoga?",
    options: [
      "Workstation GC",
      "Server GC",
      "Koi bhi nahi, GC manually enable karna padta hai",
      "Dono simultaneously"
    ],
    correctIndex: 1,
    explanation:
      "ASP.NET Core apps me Server GC by default ON hota hai (SDK-level default), kyunki server workloads typically multi-core hardware pe high allocation rate ke saath chalte hain aur throughput priority hoti hai. Option A ek common trap hai — Workstation GC desktop/console apps ka default hai, ASP.NET Core ka nahi.",
    difficulty: "medium",
  },
  {
    id: "workstation-server-gc-2",
    question: "Server GC ka heap architecture Workstation GC se kaise different hai?",
    options: [
      "Dono same single heap use karte hain, sirf thread count alag hota hai",
      "Server GC har logical CPU core ke liye ek separate heap banata hai; Workstation GC ek single heap use karta hai",
      "Workstation GC multiple heaps use karta hai, Server GC single heap",
      "Heap architecture dono me identical hota hai"
    ],
    correctIndex: 1,
    explanation:
      "Server GC 1 heap + 1 dedicated GC thread per logical CPU core banata hai, jisse collections parallel chal sakein — ye throughput ke liye design kiya gaya hai. Workstation GC ek single heap maintain karta hai, low-latency ke liye optimized. Ye ek fundamental structural difference hai, sirf configuration flag nahi.",
    difficulty: "medium",
  },
  {
    id: "workstation-server-gc-3",
    question: "Ek microservice sirf 1 CPU core wale Kubernetes pod me deploy hota hai, Server GC default ON hai. Iska kya likely downside ho sakta hai?",
    options: [
      "Koi downside nahi, Server GC hamesha better hota hai",
      "Server GC ka 'per-core heap' model ek core ke against overhead-heavy ho sakta hai — memory footprint aur scheduling cost benefit se zyada",
      "Server GC sirf multi-core machines pe hi kaam karta hai, single-core pe crash hoga",
      "Workstation GC automatically activate ho jaayega"
    ],
    correctIndex: 1,
    explanation:
      "Server GC ka design assumption hai ki multiple cores available hain jinme parallel collection kaam split ho sake. Sirf 1 core wale constrained environment me is model ka overhead (memory, thread management) benefit se zyada ho sakta hai. Explicit `ServerGarbageCollection=false` set karna aisi situations me better trade-off de sakta hai. Server GC crash nahi karta single-core pe (Option C galat), aur mode automatically switch nahi hota (Option D galat).",
    difficulty: "hard",
  },
  {
    id: "workstation-server-gc-4",
    question: "Workstation GC kis type ki application ke liye design kiya gaya hai, aur kyun?",
    options: [
      "Server apps ke liye, maximum throughput ke liye",
      "Desktop/client apps ke liye, responsiveness (low latency) ke liye — lambi GC pause UI freeze kar degi",
      "Sirf console apps ke liye, GUI apps ke liye kabhi nahi use hota",
      "Sirf batch-processing jobs ke liye"
    ],
    correctIndex: 1,
    explanation:
      "Workstation GC single heap, low-latency-focused design hai — desktop apps (WPF/WinForms) ka default, kyunki ek lambi GC pause directly UI responsiveness ko affect karti hai (freeze dikhega user ko). Ye chhoti, frequent pauses prefer karta hai bade throughput ke bajaye — Server GC ka exact opposite goal.",
    difficulty: "medium",
  },
];

export default quiz;
