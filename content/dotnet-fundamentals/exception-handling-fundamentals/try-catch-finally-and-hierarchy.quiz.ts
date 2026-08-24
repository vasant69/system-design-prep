import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "trycatch-1",
    question: "Ye code kya print karega?\n```csharp\nstatic string Test()\n{\n    try { return \"A\"; }\n    finally { Console.WriteLine(\"B\"); }\n}\n// Console.WriteLine(Test());\n```",
    options: [
      "Sirf \"A\" print hoga, \"B\" kabhi nahi",
      "\"B\" print hoga phir \"A\" print hoga",
      "Sirf \"B\" print hoga, method \"A\" return nahi karega",
      "Compile error — finally ke baad return allowed nahi",
    ],
    correctIndex: 1,
    explanation:
      "`try` ka return value pehle compute hota hai, phir `finally` execute hota hai, tab jaakar method actually return karta hai. Isliye pehle \"B\" print hota hai (finally ke andar), phir `Test()` ka return value \"A\" outer `Console.WriteLine` print karta hai. Option A galat hai kyunki finally hamesha chalta hai return ke baad bhi. Option C galat hai — return value override nahi hota. Option D galat hai — ye valid, common C# hai.",
    difficulty: "medium",
  },
  {
    id: "trycatch-2",
    question: "Custom exception class banate waqt current Microsoft guidance kya hai?",
    options: [
      "`ApplicationException` se inherit karo, standard practice hai",
      "`SystemException` se inherit karo",
      "`System.Exception` se seedha inherit karo, `ApplicationException` avoid karo",
      "Koi bhi built-in exception se inherit kar sakte ho, sab equally valid hain",
    ],
    correctIndex: 2,
    explanation:
      "Current guidance custom exceptions ko `System.Exception` se directly inherit karne ki hai. `ApplicationException` ek historical convention thi jo consistently follow nahi hui (bahut se genuinely 'application-level' built-in exceptions khud `SystemException` se derive hote hain), isliye ab largely deprecated maani jaati hai. `SystemException` (Option B) CLR/runtime ke apne exceptions ke liye hai, app code ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "trycatch-3",
    question: "Ye code compile hoga ya error dega?\n```csharp\ntry { }\ncatch (Exception ex) { }\ncatch (ArgumentException ex) { }\n```",
    options: [
      "Compile ho jaayega, runtime pe koi issue nahi",
      "Compile error — 'unreachable catch clause' kyunki general catch pehle hai",
      "Runtime warning dega lekin chalega",
      "Ye valid hai kyunki C# catch order ko ignore karta hai",
    ],
    correctIndex: 1,
    explanation:
      "C# compiler catch blocks ko specific-to-general order me enforce karta hai. `catch (Exception ex)` sabse general hai — agar ye pehle likha jaaye, uske baad ka `catch (ArgumentException ex)` kabhi reach hi nahi ho sakta (kyunki `ArgumentException` bhi ek `Exception` hai, pehla catch usko already pakad lega), isliye compiler 'unreachable catch clause' error deta hai.",
    difficulty: "medium",
  },
  {
    id: "trycatch-4",
    question: "In kis scenario me `finally` block guaranteed NAHI chalega?",
    options: [
      "Jab `try` block me ek uncaught exception bubble up ho raha ho",
      "Jab `try` block ke andar `return` statement ho",
      "Jab process forcibly kill ho jaaye ya `Environment.FailFast` call ho",
      "Jab `try` block normally, bina kisi issue ke complete ho",
    ],
    correctIndex: 2,
    explanation:
      "`finally` normal completion, caught exception, uncaught exception (bubbling up ke process me bhi), aur early `return` — in sab cases me guaranteed chalta hai. Sirf process-level crash (forced kill, `Environment.FailFast`, ya `StackOverflowException` jaisi unrecoverable situations) me ye guarantee break hoti hai kyunki poora process hi terminate ho jaata hai normal CLR unwinding ke bina.",
    difficulty: "hard",
  },
];

export default quiz;
