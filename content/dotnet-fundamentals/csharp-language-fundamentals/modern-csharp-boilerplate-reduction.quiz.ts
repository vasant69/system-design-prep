import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "boilerplate-1",
    question: "Top-level statements (C# 9) ka runtime behavior kaisa hai traditional `class Program { static void Main(...) }` ke against?",
    options: [
      "Faster hai kyunki extra class overhead nahi hai",
      "Bilkul identical — compiler internally same Program class/Main method generate karta hai",
      "Slower hai extra compilation step ki wajah se",
      "Different hai — top-level statements async by default hain",
    ],
    correctIndex: 1,
    explanation:
      "Top-level statements purely source-level syntactic convenience hain — compiler behind-the-scenes ek hidden Program class aur Main method generate karta hai, IL output effectively traditional syntax jaisa hi hota hai. Koi runtime performance difference nahi hai. Option D galat hai, top-level statements khud automatically async nahi hote (though async Main support hota hai dono styles me).",
    difficulty: "medium",
  },
  {
    id: "boilerplate-2",
    question: "Ek project me kitni files top-level statements use kar sakti hain?",
    options: [
      "Jitni chaho",
      "Sirf ek",
      "Maximum do",
      "Sirf agar sab .NET 6+ target karein",
    ],
    correctIndex: 1,
    explanation:
      "Sirf EK file per project top-level statements use kar sakti hai — ye woh file hai jo effectively 'Main' entry point ban jaati hai. Doosri file me top-level statements likhne ki koshish compile error deti hai.",
    difficulty: "easy",
  },
  {
    id: "boilerplate-3",
    question: "`global using System.Linq;` ek file (jaise GlobalUsings.cs) me likhne ka effect kya hai?",
    options: [
      "Sirf usi file me System.Linq available hota hai",
      "Poore project ke har .cs file me System.Linq automatically available ho jaata hai, bina repeat kiye",
      "Sirf run-time pe dynamically resolve hota hai",
      "Sirf same-folder files ke liye apply hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`global using` project-wide scope rakhta hai — jis file me bhi likha jaaye, us using directive ka effect POORE project ke har `.cs` file me automatically apply hota hai compile-time pe. Options A aur D dono galat hain — scope file ya folder tak limited nahi hai, poora project hai.",
    difficulty: "medium",
  },
  {
    id: "boilerplate-4",
    question: "File-scoped namespace (`namespace X;`) ke baare me kaunsa statement sahi hai?",
    options: [
      "Ek file me multiple file-scoped namespaces ho sakte hain",
      "Ek file me sirf ek file-scoped namespace allowed hai",
      "File-scoped namespace braces ke saath bhi likha ja sakta hai optionally",
      "File-scoped namespace sirf .NET Framework me kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek file sirf EK file-scoped namespace declaration rakh sakti hai — poori file usi namespace ke andar treat hoti hai. Agar genuinely multiple namespaces chahiye ek file me (rare case), traditional block-syntax use karni padegi. Option C galat hai — file-scoped syntax semicolon-based hai, braces mix nahi kiye ja sakte usi declaration me.",
    difficulty: "hard",
  },
];

export default quiz;
