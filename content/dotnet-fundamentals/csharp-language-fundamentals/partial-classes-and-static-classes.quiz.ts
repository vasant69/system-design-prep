import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "partial-static-1",
    question: "`new MathHelpers()` likhne ki koshish karo jahan `MathHelpers` ek static class hai. Kya hoga?",
    options: [
      "Runtime exception aayega",
      "Compile error aayega — static class instantiate nahi ho sakti",
      "Ek null instance ban jaayegi",
      "Compile ho jaayega, ek default instance ban jaayegi",
    ],
    correctIndex: 1,
    explanation:
      "Static class ko instantiate karne ki koshish COMPILE ERROR deti hai — ye language-level restriction hai, runtime tak pahunchti hi nahi. Static class ka poora design hi ye hai ki koi instance kabhi zaroori nahi hai. Options A, C, D sab galat hain.",
    difficulty: "easy",
  },
  {
    id: "partial-static-2",
    question: "Static class ke baare me kaunsa statement GALAT hai?",
    options: [
      "Static class sirf static members rakh sakti hai",
      "Static class implicitly sealed hoti hai",
      "Static class ek instance constructor define kar sakti hai",
      "Static class extension methods ka mandatory container hai",
    ],
    correctIndex: 2,
    explanation:
      "Static class instance constructor define NAHI kar sakti — sirf static constructor allowed hai. Baaki teen statements sahi hain: static class sirf static members rakh sakti hai, implicitly sealed hai (inherit nahi ho sakti), aur extension methods ko mandatory ek static class ke andar hona zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "partial-static-3",
    question: "Partial class ka sabse common real-world use-case kya hai?",
    options: [
      "Performance improve karna",
      "Generated code (jaise EF Core scaffolding) ko hand-written code se alag files me rakhna",
      "Multiple inheritance simulate karna",
      "Memory usage kam karna",
    ],
    correctIndex: 1,
    explanation:
      "Partial class ka classic use-case ye hai ki tool-generated code (EF Core scaffolding, WinForms designer files) ko hand-written business logic se separate files me rakha jaaye — taaki regeneration hone par hand-written code overwrite na ho. Options A, C, D partial class ka actual purpose nahi hain.",
    difficulty: "easy",
  },
  {
    id: "partial-static-4",
    question: "Static classes ko unit testing ke context me kyun problematic mana jaata hai?",
    options: [
      "Wo compile nahi hoti test projects me",
      "Unhe interface implement nahi karwaya ja sakta, isliye DI-based mocking mushkil hai",
      "Wo automatically thread-unsafe hoti hain",
      "Unit test frameworks static classes support hi nahi karte",
    ],
    correctIndex: 1,
    explanation:
      "Static classes koi interface implement nahi kar sakti (static members interfaces me polymorphic dispatch nahi ho sakte traditional tareeke se) — isliye dependency-injection-based mocking (jo interfaces pe rely karta hai) inke saath kaam nahi karta, jo unit testing me friction badhata hai jab koi dependency isolate karni ho. Option C galat hai — thread-safety depend karti hai ki state mutable hai ya nahi, sirf static hone se automatically unsafe nahi ban jaati.",
    difficulty: "hard",
  },
];

export default quiz;
