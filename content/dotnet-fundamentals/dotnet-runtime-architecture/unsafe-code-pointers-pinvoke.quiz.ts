import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "unsafe-code-pointers-pinvoke-1",
    question: "`unsafe` keyword C# me kya karta hai?",
    options: [
      "Code ko faster banata hai automatically, koi trade-off nahi",
      "CLR ki memory-safety guarantees ko ek scoped block ke andar explicitly off kar deta hai, raw pointer use allow karke",
      "Sirf multi-threading code ke liye hota hai",
      "Ye ek deprecated keyword hai, ab use nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "`unsafe` block ke andar raw pointers declare/dereference/arithmetic possible hai, jo CLR ke normal memory-safety guarantees (bounds checking, type safety) ko explicitly bypass karta hai. Ye deliberate opt-out hai, automatic speed-up nahi (Option A galat), threading-specific nahi hai (Option C galat), aur active feature hai (Option D galat).",
    difficulty: "medium",
  },
  {
    id: "unsafe-code-pointers-pinvoke-2",
    question: "`fixed` statement ka purpose kya hai unsafe pointer code me?",
    options: [
      "Variable ko constant bana deta hai",
      "GC ko us object ko block ke andar move karne se rokta hai, taaki raw pointer dangling na ho jaaye",
      "Memory ko permanently allocate kar deta hai, kabhi free nahi hoti",
      "Sirf string types ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "GC compaction ke dauraan managed objects (jaise arrays) memory me move ho sakte hain. Agar unsafe code ne kisi object ka raw pointer liya hai, aur GC use move kar de, pointer dangling (invalid) ho jaayega. `fixed` object ko temporarily pin kar deta hai — block ke andar GC use move nahi karega. Options A, C, D is mechanism ko galat describe karte hain.",
    difficulty: "medium",
  },
  {
    id: "unsafe-code-pointers-pinvoke-3",
    question: "P/Invoke (Platform Invoke) kis use case ke liye hai?",
    options: [
      "Do managed C# assemblies ke beech communicate karne ke liye",
      "Managed C# code se native (unmanaged) C/C++ library ke functions call karne ke liye",
      "Database connections manage karne ke liye",
      "Async/await implement karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "P/Invoke specifically managed .NET code ko native, unmanaged libraries (jaise Windows API `.dll`s, ya ek existing C/C++ SDK) ke functions call karne deta hai — `[DllImport]` attribute ke through method signature ko native export se map kiya jaata hai. Ye .NET-to-.NET communication (Option A), database (Option C), ya async (Option D) se related nahi hai.",
    difficulty: "easy",
  },
  {
    id: "unsafe-code-pointers-pinvoke-4",
    question: "Modern C# me `stackalloc int[100]` ko `Span<int>` ke saath use karna kyun common hai, `unsafe` block ke bina hi?",
    options: [
      "Kyunki `stackalloc` C# 12 me deprecated ho gaya hai",
      "Kyunki `Span<T>` internally bounds-checked, safe wrapper provide karta hai raw pointer ke bina",
      "Kyunki `Span<T>` heap pe allocate karta hai, stackalloc ki jagah",
      "Kyunki `unsafe` blocks ab compile hi nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "`Span<T>` ek safe, bounds-checked abstraction hai jo `stackalloc` memory ko wrap kar sakta hai bina raw pointer expose kiye — isliye is combination ko `unsafe` context ki zaroorat nahi padti, jabki raw pointer arithmetic hamesha `unsafe` maangta hai. Options A, C, D factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
