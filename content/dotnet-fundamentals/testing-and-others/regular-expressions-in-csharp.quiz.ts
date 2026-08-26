import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "regex-csharp-1",
    question:
      "`RegexOptions.Compiled` use karne ka trade-off kya hai?",
    options: [
      "Koi trade-off nahi, ye hamesha strictly better hai",
      "Upfront JIT-compilation cost lagti hai (pehla use slower), lekin baad ke matches significantly fast hote hain",
      "Ye sirf .NET Framework me kaam karta hai",
      "Ye regex pattern ki accuracy kam kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "RegexOptions.Compiled pattern ko runtime pe JIT-compile karta hai — ek upfront cost hai object creation/first-use time pe, lekin subsequent matches interpreted mode se significantly fast hote hain. Isliye ye hot-path, frequently-reused regex ke liye best hai, one-off use ke liye nahi (option A galat, trade-off genuinely exist karta hai). Options C aur D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "regex-csharp-2",
    question:
      "`[GeneratedRegex]` ka Native AOT deployments me kya fayda hai `RegexOptions.Compiled` ke comparison me?",
    options: [
      "Koi fark nahi, dono equally kaam karte hain AOT me",
      "GeneratedRegex compile-time pe hi matching code generate kar deta hai, jabki Compiled option AOT me runtime JIT na hone ki wajah se interpreted mode pe fallback ho jaata hai",
      "GeneratedRegex sirf .NET Framework me kaam karta hai",
      "Compiled option AOT me compile error deta hai",
    ],
    correctIndex: 1,
    explanation:
      "RegexOptions.Compiled runtime JIT compilation pe depend karta hai, jo Native AOT builds me available nahi hota — isliye ye silently interpreted mode pe fallback ho jaata hai, koi performance gain nahi milta. [GeneratedRegex] build time pe hi actual matching code generate kar deta hai, isliye AOT me bhi compiled-jaisi performance milti hai. Option D galat hai — compile error nahi aata, silent fallback hota hai.",
    difficulty: "hard",
  },
  {
    id: "regex-csharp-3",
    question:
      "`[GeneratedRegex]` attribute use karne ke liye method/class pe kya requirement hai?",
    options: [
      "Method aur class dono `partial` hone chahiye",
      "Koi special requirement nahi, kisi bhi method pe laga sakte hain",
      "Class `sealed` hona chahiye",
      "Method `static` nahi ho sakta",
    ],
    correctIndex: 0,
    explanation:
      "[GeneratedRegex] ek source generator hai jo build time pe method ki implementation generate karta hai — isliye method `partial` hona chahiye (jiski body generator fill karega) aur containing class bhi `partial` honi chahiye. Options B, C, aur D iski actual requirement ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "regex-csharp-4",
    question:
      "Ek regex jo kabhi-kabhar (rarely) call hota hai, uske liye kaunsa approach sabse appropriate hai?",
    options: [
      "RegexOptions.Compiled, hamesha best performance ke liye",
      "[GeneratedRegex], hamesha modern approach hai isliye",
      "Default (interpreted) Regex — upfront compilation cost ka koi fayda nahi milega jab pattern rarely use ho",
      "Regex bilkul use hi nahi karna chahiye",
    ],
    correctIndex: 2,
    explanation:
      "Jab regex rarely call hota hai, RegexOptions.Compiled ya GeneratedRegex ka upfront/compile-time investment fayde se zyada overhead ho sakta hai — default interpreted mode is scenario ke liye sufficient aur appropriate hai. Options A aur B galat hain kyunki ye unnecessary optimization hai low-frequency use ke liye. Option D irrelevant hai.",
    difficulty: "easy",
  },
];

export default quiz;
