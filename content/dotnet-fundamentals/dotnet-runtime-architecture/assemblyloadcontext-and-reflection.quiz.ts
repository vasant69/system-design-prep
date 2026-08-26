import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "assemblyloadcontext-reflection-1",
    question: ".NET Core me `AppDomain` ka role kis primitive ne le liya hai?",
    options: [
      "`AssemblyLoadContext`",
      "`Reflection.Emit`",
      "`Task Parallel Library`",
      "`Dependency Injection Container`",
    ],
    correctIndex: 0,
    explanation:
      "`AppDomain` .NET Framework ka isolation model tha jo .NET Core ke cross-platform CLR design me fit nahi baitha, isliye ye largely non-functional stub reh gaya. `AssemblyLoadContext` iska direct architectural replacement hai — lighter-weight, isolated assembly-loading boundary. Options B, C, D unrelated concepts hain.",
    difficulty: "medium",
  },
  {
    id: "assemblyloadcontext-reflection-2",
    question: "Ek `AssemblyLoadContext` ko `isCollectible: true` ke saath banane ka kya fayda hai?",
    options: [
      "Isse assembly load hone ki speed badh jaati hai",
      "Isse ALC baad me `Unload()` kiya ja sakta hai — plugin ke memory ko host process restart kiye bina free kiya ja sakta hai",
      "Isse reflection ki zaroorat khatam ho jaati hai",
      "Isse assembly automatically encrypted ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "`isCollectible: true` ek ALC ko unload-able banata hai — `Unload()` call karne par us context me loaded assemblies aur unke resources eventually garbage-collected ho sakte hain, bina poori host process ko restart kiye. Ye plugin hot-reload jaise scenarios me useful hai. Options A, C, D galat/unrelated claims hain.",
    difficulty: "medium",
  },
  {
    id: "assemblyloadcontext-reflection-3",
    question: "Reflection kya karta hai?",
    options: [
      "Sirf compile-time pe code ko optimize karta hai",
      "Runtime pe types/members (methods, properties, fields) ki metadata inspect karta hai aur unhe dynamically invoke karne deta hai",
      "Sirf unit testing ke liye use hota hai",
      "Memory allocation ko directly control karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Reflection (`System.Reflection`) runtime pe kisi type ki metadata (methods/properties/fields) inspect karne aur dynamically invoke karne ki capability deta hai, bina compile-time pe us type ko directly reference kiye. Ye khaaskar tab useful hai jab exact type compile-time pe pata na ho (jaise plugin systems me). Options A, C, D scope ko galat describe karte hain.",
    difficulty: "easy",
  },
  {
    id: "assemblyloadcontext-reflection-4",
    question: "Reflection-based method calls ko performance-critical hot paths me kaise handle karna chahiye?",
    options: [
      "Har baar fresh `Type.GetMethod()`/`MethodInfo.Invoke()` call karna, ye already optimized hai",
      "Reflection use hi na karna, kabhi bhi",
      "Resolved `MethodInfo`/`PropertyInfo` ko ek baar resolve karke cache karna, ya compiled expression trees/delegates use karna",
      "Reflection calls ko async bana dena performance improve karne ke liye",
    ],
    correctIndex: 2,
    explanation:
      "Reflection lookups (type/method resolution) meaningfully slower hain direct calls se. Best practice hai resolved `MethodInfo`/`PropertyInfo` ko cache karna taaki repeated lookup avoid ho, ya performance-critical scenarios me compiled expression trees/delegates use karna jo reflection overhead bypass karte hain. Option A galat hai (har baar fresh lookup slow hai), Option B overly restrictive hai (reflection genuinely zaroori hoti hai kai scenarios me), Option D async se ye specific overhead solve nahi hota.",
    difficulty: "hard",
  },
];

export default quiz;
