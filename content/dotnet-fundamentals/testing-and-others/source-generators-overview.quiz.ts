import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "source-generators-overview-1",
    question:
      "Source generators fundamentally kya karte hain?",
    options: [
      "Runtime pe dynamic code execute karte hain, jaise Reflection.Emit",
      "Compile-time pe code inspect karke additional C# source files generate karte hain, jo compilation me shamil ho jaate hain",
      "Sirf documentation generate karte hain, koi executable code nahi",
      "Runtime pe types ko modify karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Source generators compiler plugins hain jo build time pe chalte hain — existing code inspect karke naya, real C# source generate karte hain jo normal compilation process me shamil ho jaata hai. Ye purely compile-time hai, runtime pe koi extra generation step nahi (option A galat, jo runtime code generation describe karta hai). Options C aur D iska actual purpose galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "source-generators-overview-2",
    question:
      "Source generators ka Native AOT/trimming scenarios me kya specific fayda hai runtime reflection ke comparison me?",
    options: [
      "Koi fayda nahi, dono equally kaam karte hain AOT me",
      "Compiler ko exact pata hota hai konsa code/type access hoga, isliye safely trim/optimize kar sakta hai — reflection ye guarantee nahi deta",
      "Source generators sirf .NET Framework me kaam karte hain",
      "Reflection AOT me automatically source-generated code me convert ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Reflection runtime pe types access karta hai bina compile-time pe unka exact shape declare kiye — isliye trimmer/AOT compiler ko pata nahi chalta konsa member zaroori hai, jo missing-metadata errors ka risk create karta hai. Source-generated code explicitly, statically declared hota hai — compiler ko exact pata hota hai kya chahiye, isliye safe trimming possible hai. Options A, C, aur D factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "source-generators-overview-3",
    question:
      "Ek application developer ko `[GeneratedRegex]` ya `[JsonSerializable]` use karne ke liye kya karna padta hai?",
    options: [
      "Khud ek naya source generator likhna padta hai from scratch",
      "Sirf appropriate attribute apne code pe lagana padta hai — generator .NET/library authors ne already provide kiya hai",
      "Reflection.Emit APIs manually call karni padti hain",
      "Ek separate build tool install karna padta hai jo .NET ka part nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Application developers generally existing, library-provided source generators ko consume karte hain sirf attributes ke through (jaise [GeneratedRegex], [JsonSerializable]) — khud generator likhna ek separate, advanced skill hai jo zyada developers ko nahi karni padti. Options A, C, aur D iska actual usage pattern galat represent karte hain.",
    difficulty: "easy",
  },
  {
    id: "source-generators-overview-4",
    question:
      "Generated code (jaise .g.cs files) ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye hidden, non-inspectable 'magic' hai jise dekha nahi ja sakta",
      "Ye real, readable C# code hai jo IDE me inspect aur debug kiya ja sakta hai",
      "Ye sirf binary/IL format me exist karta hai",
      "Ye sirf test builds me generate hota hai, production build me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Source generators genuinely real C# source text produce karte hain jo compilation me shamil hota hai — ye .g.cs files ki tarah IDE me dikhte hain aur normal debugging tools se step through kiya ja sakta hai. Option A ek common misconception hai. Options C aur D factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
