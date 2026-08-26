import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "clr-corecolr-corefx-1",
    question: "CLR aur CoreCLR ke beech sabse accurate relationship kya hai?",
    options: [
      "Dono exactly same cheez hain, sirf naam alag hai",
      "CLR ek concept/responsibility set hai, CoreCLR `.NET Core`/`.NET 5+` ke liye uska concrete, open-source implementation hai",
      "CoreCLR CLR ka successor hai jisne CLR ko completely replace kar diya har jagah",
      "CLR sirf `.NET Framework` me hota hai, CoreCLR ek unrelated naya concept hai",
    ],
    correctIndex: 1,
    explanation:
      "CLR ek abstract responsibility set hai (memory management, JIT, type safety, exceptions) jo kai implementations ne nibhayi hai. CoreCLR usi CLR responsibility ka `.NET Core`/`.NET 5+`-specific, open-source, cross-platform implementation hai. Option A galat hai — CoreCLR CLR ka ek implementation hai, synonym nahi. Option C galat hai — `.NET Framework` ka CLR abhi bhi maintenance mode me exist karta hai, replace nahi hua. Option D galat hai — `.NET Framework` ka bhi apna CLR implementation tha.",
    difficulty: "medium",
  },
  {
    id: "clr-corecolr-corefx-2",
    question: "CoreFX ka primary role kya tha .NET Core architecture me?",
    options: [
      "JIT compilation karna",
      "Garbage collection perform karna",
      "Base Class Library (BCL) provide karna — jaise `List<T>`, `String`, `HttpClient`",
      "Cross-platform Platform Abstraction Layer implement karna",
    ],
    correctIndex: 2,
    explanation:
      "CoreFX BCL (Base Class Library) ka implementation tha — wo saari common classes jo developers roz use karte hain. JIT compilation aur GC CoreCLR (execution engine) ki responsibility hai, CoreFX ki nahi. Platform Abstraction Layer (PAL) bhi CoreCLR ka hissa hai, cross-platform execution ke liye, library ka nahi.",
    difficulty: "medium",
  },
  {
    id: "clr-corecolr-corefx-3",
    question: "`dotnet/coreclr` aur `dotnet/corefx` repositories ka kya hua 2020 ke around?",
    options: [
      "Dono deprecated ho gaye, koi replacement nahi aaya",
      "Dono merge hokar ek single `dotnet/runtime` repository ban gaye",
      "`dotnet/corefx` `dotnet/coreclr` ko replace kar diya",
      "Kuch nahi hua, dono aaj bhi alag-alag maintain hote hain",
    ],
    correctIndex: 1,
    explanation:
      "Development coordination simplify karne ke liye, Microsoft ne `dotnet/coreclr`, `dotnet/corefx`, aur `dotnet/core-setup` ko merge kar diya ek single `dotnet/runtime` repository me. Ye teeno itne tightly coupled the ki alag repos rakhna overhead bana raha tha. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "clr-corecolr-corefx-4",
    question: "Ek fintech company `.NET Framework` se `.NET Core`/`.NET 8` pe migrate karti hai aur bina application code change kiye latency improvement dekhti hai. Ye kis wajah se most likely hua?",
    options: [
      "Naye C# language version ki wajah se",
      "CoreCLR ke redesigned GC aur JIT implementation ki wajah se — runtime khud ek performance lever hai",
      "Kyunki naya code hamesha fast hota hai koi bhi reason ke bina",
      "Kyunki CoreFX ne application logic optimize kar di",
    ],
    correctIndex: 1,
    explanation:
      "CoreCLR (`.NET Core`/`.NET 5+` ka CLR implementation) ka GC aur JIT `.NET Framework` ke CLR se redesigned/improved the — isliye sirf runtime switch karne se, bina code change ke, measurable performance gain mil sakta hai. Option A irrelevant hai agar code change nahi hua. Option C ek vague, non-technical claim hai. Option D galat hai — CoreFX libraries provide karta hai, application logic optimize nahi karta.",
    difficulty: "hard",
  },
];

export default quiz;
