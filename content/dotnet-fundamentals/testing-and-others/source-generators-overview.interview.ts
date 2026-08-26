import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "source-generators-overview-tr-1",
    question: "Source generators kya hain aur ye kaunsi problem solve karte hain?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon"],
    shortAnswer:
      "Compiler plugins jo build-time pe code inspect karke additional real C# source generate karte hain — inka main use-case runtime reflection ko eliminate karna hai performance-sensitive scenarios me.",
    detailedAnswer:
      "Source generators (C# 9+) build process ke dauraan chalte hain, existing code (attributes, class shapes) inspect karte hain, aur naya C# source produce karte hain jo compilation me shamil ho jaata hai. Ye specifically un scenarios ke liye useful hain jahan pehle reflection use hota tha (JSON serialization, regex matching) — ab wahi kaam compile time pe resolve ho jaata hai, runtime pe direct method calls hote hain reflection ke bajaye.",
    followUp: "Ye Native AOT scenarios me kyun specifically critical hain?",
  },
  {
    id: "source-generators-overview-tr-2",
    question: "Reflection ka Native AOT/trimming ke saath kya fundamental incompatibility hai jo source generators solve karte hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Trimmer/AOT compiler ko compile-time pe pata nahi hota reflection runtime pe konsa specific member access karega, isliye wo us code ko safely optimize/trim nahi kar sakta — missing-metadata errors ka risk create hota hai.",
    detailedAnswer:
      "Reflection (`typeof(T).GetProperties()`, `Activator.CreateInstance()`) dynamically, runtime pe type information access karta hai. Jab trimming ya AOT compilation hoti hai, compiler unused code/metadata hatane ki koshish karta hai — lekin agar wo nahi jaanta ki reflection kaunsa specific member baad me access karega, wo galti se zaroori metadata hata sakta hai, jisse runtime errors aate hain. Source-generated code explicitly, statically declared hota hai — compiler ko exact pata hota hai kya chahiye.",
  },
  {
    id: "source-generators-overview-tr-3",
    question: "Ek team apne microservice ko Native AOT me migrate kar rahi hai aur unka reflection-based JSON serialization runtime errors de raha hai. Kya fix recommend karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "System.Text.Json ka source-generated serialization context (JsonSerializerContext) use karo, jo reflection-free, AOT-compatible serialization deta hai.",
    detailedAnswer:
      "Ye exactly wo problem hai jo System.Text.Json's source generator solve karne ke liye design hua — `[JsonSerializable(typeof(T))]` attribute wale ek `JsonSerializerContext` class banao, aur serialization calls me isse pass karo (`JsonSerializer.Serialize(obj, MyContext.Default.T)`). Isse compiler build-time pe hi serialization logic generate kar deta hai, koi runtime reflection nahi, aur AOT trimming safely apply ho sakti hai.",
    followUp: "Kya poori codebase ko is pattern pe migrate karna zaroori hai, ya selectively kiya ja sakta hai?",
  },
  {
    id: "source-generators-overview-tr-4",
    question: "Kya application developers ko khud source generators likhne padte hain regular projects me?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Generally nahi — most developers sirf library-provided generators ko attributes ke through consume karte hain, khud generator likhna ek separate advanced skill hai.",
    detailedAnswer:
      "Practical use-case me, .NET runtime team ya third-party NuGet package authors generators provide karte hain (jaise [GeneratedRegex], [JsonSerializable]). Application developer ka kaam sirf appropriate attribute apply karna hai apne code pe. Khud ek custom source generator likhna (Roslyn's Incremental Generator API use karke) ek niche, advanced skill hai jo typically library/framework authors ke liye relevant hai, everyday application code ke liye nahi.",
    redFlag: "Ye assume karna ki [GeneratedRegex] use karne ke liye khud ek generator implement karna padega — ye galat hai aur is feature ke actual consumption model ko misunderstand karta hai.",
  },
  {
    id: "source-generators-overview-tr-5",
    question: "Source generators aur runtime code generation (jaise System.Reflection.Emit) me kya difference hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Source generators purely compile-time hain — deployment ke baad koi generation step nahi hota. Reflection.Emit runtime pe dynamically IL generate karta hai, jo AOT-incompatible hai.",
    detailedAnswer:
      "Ye do genuinely different mechanisms hain jo kabhi confuse ho jaate hain. Source generators build ke dauraan real C# source text produce karte hain jo phir normally compile hota hai — end result ek static, compiled assembly hai. Reflection.Emit runtime pe dynamically IL code generate karta hai app ke chalte hue — ye powerful hai lekin Native AOT ke saath fundamentally incompatible hai kyunki AOT me runtime code generation possible hi nahi hota.",
  },
  {
    id: "source-generators-overview-tr-6",
    question: "Generated .g.cs files ko debug kaise karte hain agar unme koi issue ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ye real, valid C# code hain — IDE ke 'generated files' view me dikhte hain aur normal breakpoints/step-through debugging se debug kiye ja sakte hain, koi special tooling nahi chahiye.",
    detailedAnswer:
      "Ek common misconception hai ki generated code kisi 'black box' me hidden hai. Reality me Visual Studio/Rider jaisi IDEs ek dedicated 'Analyzers > Generated Files' node dikhati hain jahan actual .g.cs content browse kiya ja sakta hai, aur normal C# debugging tools (breakpoints, step-into) is code me bhi kaam karte hain jaise kisi hand-written file me.",
  },
  {
    id: "source-generators-overview-tr-7",
    question: "'GeneratedRegex' aur 'RegexOptions.Compiled' dono compiled-jaisi performance dete hain — inme fundamental difference kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "GeneratedRegex compile-time source generation hai (koi runtime JIT delay nahi, AOT-friendly); RegexOptions.Compiled runtime JIT-compilation hai (upfront delay first use pe, AOT me fallback ho jaata hai).",
    detailedAnswer:
      "Ye exactly wo distinction hai jo is topic aur regular-expressions-in-csharp topic ko connect karta hai — GeneratedRegex ek source generator hai jo matching logic ko build time pe hi C# code ki tarah emit karta hai, isliye runtime pe koi extra compilation step nahi hota aur Native AOT me bhi seamlessly kaam karta hai. RegexOptions.Compiled runtime pe JIT-compilation use karta hai, jo AOT builds me available nahi hoti, isliye wahan silently interpreted mode pe fallback ho jaata hai.",
  },
];

export default questions;
