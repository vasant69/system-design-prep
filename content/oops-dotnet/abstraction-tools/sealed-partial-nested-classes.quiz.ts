import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sealed-partial-nested-1",
    question: "`sealed class ApiKeyValidator { }` hai. `public class MyValidator : ApiKeyValidator { }` likhne par kya hoga?",
    options: [
      "Compile ho jaayega normally",
      "Compile error — sealed class se koi bhi further inherit nahi kar sakta",
      "Runtime error aayega jab MyValidator instantiate ho",
      "Sirf ek warning aayegi",
    ],
    correctIndex: 1,
    explanation:
      "`sealed` keyword class ko further inheritance se poori tarah block kar deta hai — compiler isse compile-time pe hi enforce karta hai. Koi bhi `class MyValidator : ApiKeyValidator` likhne ki koshish compile error deti hai. Option A galat hai, ye compile hi nahi hoga. Option C galat hai, error runtime tak pahunchta hi nahi. Option D galat hai, ye hard error hai, warning nahi.",
    difficulty: "easy",
  },
  {
    id: "sealed-partial-nested-2",
    question: "Production codebase me `partial class` ka sabse classic, real-world use case kya hai?",
    options: [
      "Performance improve karne ke liye",
      "Generated code (jaise EF Core scaffolded entities) aur hand-written code ko alag files me rakhna, taaki regeneration custom logic ko overwrite na kare",
      "Multiple developers ko simultaneously same method edit karne dena",
      "Class ka size chhota dikhane ke liye, koi functional reason nahi",
    ],
    correctIndex: 1,
    explanation:
      "Ye `partial` ka sabse well-known, practical use case hai — jaise EF Core scaffolding tool ek entity file generate karta hai, aur developer apna custom logic ek doosri partial file me likhta hai. Regeneration sirf generated file ko touch karta hai, hand-written wali file safe rehti hai. Option A galat hai, `partial` ka koi runtime perf benefit nahi hai. Option C galat hai, ye same method edit karne ke baare me nahi hai, alag members ke baare me hai. Option D galat hai, ye ek functional, maintenance-related reason hai, sirf cosmetic nahi.",
    difficulty: "medium",
  },
  {
    id: "sealed-partial-nested-3",
    question: "Nested class kab appropriate hoti hai?",
    options: [
      "Hamesha, ye organization ke liye best practice hai",
      "Jab inner type genuinely sirf apne container class ke context me hi meaningful ho, kahin aur reusable/standalone nahi",
      "Sirf jab class bahut badi ho jaaye, size kam karne ke liye",
      "Kabhi nahi, C# me nested classes deprecated hain",
    ],
    correctIndex: 1,
    explanation:
      "Nested class ka sahi use case tab hai jab inner type genuinely tightly-coupled ho apne container se, jaise ek Builder pattern ka internal Result type. Option A galat hai, overuse discoverability/testability ko hurt karta hai. Option C ek galat, size-based heuristic hai. Option D factually galat hai, nested classes C# ka valid, currently-supported feature hain, deprecated nahi.",
    difficulty: "medium",
  },
  {
    id: "sealed-partial-nested-4",
    question: "`sealed` aur `private` me kya fundamental difference hai?",
    options: [
      "Dono same cheez hain, interchangeable",
      "`sealed` inheritance ko control karta hai (kaun extend kar sakta hai), `private` visibility ko control karta hai (kaun access kar sakta hai)",
      "`sealed` sirf methods pe lagta hai, `private` sirf classes pe",
      "`private` classes ko seal kar deta hai automatically",
    ],
    correctIndex: 1,
    explanation:
      "Ye dono completely alag concerns handle karte hain — `sealed` decide karta hai ki koi class ise extend kar sakta hai ya nahi (inheritance control), `private` decide karta hai ki kaun us member/type ko access kar sakta hai (visibility control). Option A galat hai, dono alag purposes serve karte hain. Option C reversed/galat hai — `sealed` class ya overridden member dono pe lag sakta hai, `private` bhi class members ya (limited context me) top-level types pe. Option D ek fabricated, incorrect relationship hai.",
    difficulty: "medium",
  },
];

export default quiz;
