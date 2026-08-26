import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "regex-csharp-tr-1",
    question: "RegexOptions.Compiled kya karta hai aur ise kab use karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys"],
    shortAnswer:
      "Regex pattern ko runtime pe JIT-compile karta hai — upfront cost ke badle repeated matches significantly fast hote hain; hot-path/frequently-reused regex ke liye appropriate.",
    detailedAnswer:
      "Default Regex ek interpreted engine use karta hai — har match call pattern ko interpret karta hai. Compiled option pattern ko actual IL me convert kar deta hai, jisse per-match speed improve hoti hai, lekin ye compilation upfront cost lagti hai. Isliye ye tab worth karta hai jab same regex bahut baar call ho (jaise per-request validation), na ki one-off use ke liye.",
    followUp: "Native AOT deployment me ye kaise different behave karta hai?",
  },
  {
    id: "regex-csharp-tr-2",
    question: "[GeneratedRegex] ka RegexOptions.Compiled se kya fundamental difference hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon"],
    shortAnswer:
      "GeneratedRegex compile-time source generator hai jo build ke time hi matching code generate karta hai; Compiled option runtime JIT-compilation use karta hai. GeneratedRegex compiled-level speed deta hai bina runtime startup delay ke.",
    detailedAnswer:
      "RegexOptions.Compiled first-use pe ek runtime JIT-compilation delay pay karta hai. [GeneratedRegex] (C# 11/.NET 7) ek source generator hai jo actual matching logic ko build time pe hi C# code ki tarah generate kar deta hai — runtime pe koi extra compilation step nahi hota. Isse compiled-jaisi speed milti hai bina uske startup-cost drawback ke, aur Native AOT ke saath bhi kaam karta hai kyunki koi runtime JIT dependency nahi hai.",
  },
  {
    id: "regex-csharp-tr-3",
    question: "Native AOT deployment me RegexOptions.Compiled use karne se kya hota hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Ye silently interpreted mode pe fallback ho jaata hai — koi error nahi aata, lekin expected performance gain bhi nahi milta, kyunki AOT me runtime JIT available nahi hota.",
    detailedAnswer:
      "RegexOptions.Compiled ka fundamental mechanism runtime JIT compilation pe depend karta hai. Native AOT builds me code pehle se hi native machine code me compiled hota hai, runtime JIT step exist hi nahi karta — isliye Compiled option ka intended optimization silently apply nahi hota, aur regex interpreted engine jaisa hi behave karta hai, bina kisi warning/error ke.",
    redFlag: "Ye assume karna ki Compiled option hamesha, har deployment scenario me, guaranteed performance dega — AOT context is assumption ko break karta hai.",
  },
  {
    id: "regex-csharp-tr-4",
    question: "Ek high-volume log-processing service ek regex ko per-line call karta hai, millions of lines process karta hai. Kaunsa approach recommend karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "[GeneratedRegex] (agar .NET 7+ hai) — hot-path use case hai jahan compiled-level performance genuinely fayda dega, aur GeneratedRegex ka zero-runtime-startup-cost benefit bhi milega.",
    detailedAnswer:
      "Ye classic hot-path scenario hai jahan regex compilation ka investment justify hota hai. [GeneratedRegex] RegexOptions.Compiled se better hai kyunki ye same performance deta hai bina JIT-compilation delay ke, aur agar service Native AOT me deploy ho to bhi correctly kaam karega. Agar .NET 7 se pehle ka target framework hai, RegexOptions.Compiled next-best option hai.",
  },
  {
    id: "regex-csharp-tr-5",
    question: "[GeneratedRegex] attribute use karne ke liye class/method structure me kya specific requirement hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Containing class `partial` honi chahiye, aur method khud `partial static` (ya partial instance) hona chahiye — koi body nahi, generator use fill karta hai.",
    detailedAnswer:
      "`[GeneratedRegex(@\"pattern\")] private static partial Regex MyRegex();` — method ka koi implementation nahi likha jaata, source generator build time pe iski body generate kar deta hai. Class bhi `partial` declare honi chahiye kyunki generator ek dusri partial class definition (compiler-generated) add karta hai jisme actual implementation hoti hai.",
  },
  {
    id: "regex-csharp-tr-6",
    question: "Kya regex complex nested HTML parsing ke liye appropriate tool hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi — regex flat text patterns ke liye designed hai, genuinely nested/recursive structures (jaise HTML/XML) ke liye ek proper parser use karna chahiye.",
    detailedAnswer:
      "Regular expressions theoretically regular languages match karte hain, jinme unlimited nesting/recursion express karna fundamentally mushkil (ya asymmetric hacky) hota hai. HTML jaisa nested markup properly parse karne ke liye dedicated parser (jaise HtmlAgilityPack .NET me) use karna chahiye — regex simple, flat pattern-matching (validation, extraction, replace) ke liye best suited hai, structural parsing ke liye nahi.",
    redFlag: "Regex se poora HTML document parse karne ki koshish karna — ye classic anti-pattern hai jo edge cases me silently galat results deta hai.",
  },
  {
    id: "regex-csharp-tr-7",
    question: "Ek method har baar call hone par naya `new Regex(pattern, RegexOptions.Compiled)` banata hai. Ismein kya problem hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compiled option ka poora fayda tabhi milta hai jab instance reuse ho — har call pe naya instance banane se compilation cost baar-baar pay hoti hai, jo default interpreted regex se bhi slower ho sakta hai.",
    detailedAnswer:
      "RegexOptions.Compiled ka upfront JIT-compilation cost sirf ek baar pay karne layak hai agar instance reuse ho, kyunki fir subsequent matches fast hote hain. Agar har method call pe naya compiled instance banaya jaaye, har call ye compilation cost bhugatega bina reuse ka benefit paye — ye scenario ko worse bana deta hai default (interpreted, no compilation overhead) Regex se bhi. Fix: Regex instance ko static/cached field me store karo.",
  },
];

export default questions;
