import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "partial-static-tr-1",
    question: "Static class kya hai aur ye kab use karni chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Cognizant"],
    shortAnswer: "Ek class jo instantiate nahi ho sakti, sirf static members rakhti hai — genuinely stateless utility/helper logic ke liye.",
    detailedAnswer:
      "Static class (`static class MathHelpers`) instantiate NAHI ho sakti (`new` compile error deta hai), sirf static members rakh sakti hai, aur implicitly sealed hai. Ye tab use karni chahiye jab type genuinely stateless ho aur koi meaningful 'instance' concept na ho — jaise math utility functions, ya extension methods ka mandatory container. Agar type ka koi genuine per-instance state hona chahiye ya testability ke liye DI/mocking chahiye, static class galat choice hai.",
    followUp: "Static classes testing ke liye kyun problematic maani jaati hain?",
  },
  {
    id: "partial-static-tr-2",
    question: "Partial class ka main real-world use-case kya hai, aur ye kis samasya ko solve karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Generated code (EF Core scaffolding, designer files) ko hand-written code se alag files me rakhna, taaki regeneration hand-written logic ko overwrite na kare.",
    detailedAnswer:
      "Jab ek tool (EF Core scaffolding, WinForms designer) automatically code generate karta hai, aur developer ko us model me apni custom logic bhi add karni hoti hai, do options hain: (1) generated file ko directly edit karo — lekin agla regeneration tumhare changes overwrite kar dega; (2) `partial class` use karo — generated code ek file me (Product.Generated.cs), hand-written logic doosri file me (Product.cs), dono compile-time pe ek class me merge ho jaate hain. Regeneration sirf generated file ko replace karta hai, hand-written file safe rehti hai.",
  },
  {
    id: "partial-static-tr-3",
    question: "Kya static class kisi interface implement kar sakti hai ya kisi class se inherit ho sakti hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi (traditionally) — static classes implicitly sealed hain aur instance-based interfaces implement nahi kar sakti; koi inheritance possible nahi.",
    detailedAnswer:
      "Static class implicitly `sealed` hoti hai — na to koi doosri class isse inherit kar sakti hai, na ye khud kisi (non-`object`) class se inherit kar sakti hai. Traditional instance-based interfaces bhi implement nahi kar sakti kyunki interface members typically instance members hote hain, aur static class ke paas koi instance hi nahi hota jispe wo dispatch ho. (Note: C# 11 ne 'static abstract members in interfaces' introduce kiya hai ek narrow, specific use-case ke liye — generic math jaisa — lekin ye traditional instance-interface implementation se alag concept hai.)",
    redFlag: "Ye assume karna ki static class normal classes jaisi inherit/implement kar sakti hai — ye ek hard language restriction hai.",
  },
  {
    id: "partial-static-tr-4",
    question: "Ek static class me mutable static field use karna kyun risky ho sakta hai ASP.NET Core jaise multi-threaded environment me?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Static field poore application ke liye ek shared, global state hoti hai — multiple concurrent requests bina synchronization ke isse simultaneously modify kar sakte hain, race conditions de sakta hai.",
    detailedAnswer:
      "ASP.NET Core me ek hi application process me multiple requests concurrently handle hote hain, alag-alag threads pe. Agar ek static class me ek mutable static field hai (jaise `static int RequestCounter`), aur multiple requests simultaneously ise increment karne ki koshish karein bina proper locking (`lock`/`Interlocked`) ke, race condition ho sakti hai — lost updates, inconsistent state. Isi wajah se stateless static utility classes safe hain (koi shared mutable state nahi), lekin static classes jo state hold karti hain genuinely dangerous ho sakti hain bina explicit thread-safety measures ke.",
  },
  {
    id: "partial-static-tr-5",
    question: "`partial method` kya hota hai, aur ye `partial class` se kaise related hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek method jiska signature generated code me declare hota hai lekin implementation optional hai hand-written code me — agar implement na ho, compiler call site ko poori tarah hata deta hai.",
    detailedAnswer:
      "```csharp\n// Generated file\npublic partial class Product\n{\n    partial void OnValidated();\n    public void Validate()\n    {\n        // ... validation logic\n        OnValidated(); // hook call\n    }\n}\n\n// Hand-written file — optional implementation\npublic partial class Product\n{\n    partial void OnValidated()\n    {\n        Console.WriteLine(\"Validated!\");\n    }\n}\n```\nAgar `OnValidated()` ko hand-written file me implement nahi kiya jaaye, compiler is method aur uske call ko poori tarah IL se remove kar deta hai (zero overhead) — ye ek 'optional extension hook' pattern hai jo generated code ko hand-written code se safely extend karne deta hai bina forcing ki har hook implement ho.",
    followUp: "Kya partial method ka koi return type ho sakta hai (pre-C# 9 rules)?",
  },
  {
    id: "partial-static-tr-6",
    question: "Kya `Math` class (.NET BCL) ek static class hai? Iska design decision kyun sensible hai?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "Haan, `Math` static class hai — kyunki iske functions (Sqrt, Pow, Abs) purely stateless, input-output based hain, koi instance state ki zaroorat nahi.",
    detailedAnswer:
      "`Math.Sqrt(16)`, `Math.Pow(2, 10)` jaise calls kisi instance state pe depend nahi karte — sirf input le kar output dete hain. Agar `Math` ek regular class hoti, developers ko har jagah `new Math().Sqrt(16)` likhna padta, jo genuinely koi value add nahi karta — 'ek Math object' ka koi meaningful concept hi nahi hai. Static class design isi redundant instantiation-overhead ko eliminate karta hai jab type genuinely stateless ho.",
  },
  {
    id: "partial-static-tr-7",
    question: "Ek team apni business logic (jaise OrderProcessingService) ko static class banane ka decision leti hai 'simplicity' ke naam pe. Ye decision kyun risky ho sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Testability aur DI-friendliness kho jaati hai — static class ko interface ke through mock nahi kiya ja sakta, unit tests real dependencies (DB, external APIs) pe depend karne lagte hain.",
    detailedAnswer:
      "`OrderProcessingService` jaisi business logic typically dependencies rakhti hai (repository, payment gateway client, logger) jo testing ke liye mock/stub karni hoti hain. Agar ye service static hai, use koi interface implement nahi karwaya ja sakta, isliye DI container ke through inject/mock nahi ho sakti — unit tests ko real database ya real external API ke against run karna padega, jo tests ko slow, flaky, aur environment-dependent bana deta hai. Ye ek classic 'simplicity ke naam pe testability sacrifice karna' anti-pattern hai jo interview me discuss karne layak hai.",
    redFlag: "Business/domain logic ko static bana dena 'kyunki instantiate karna extra step lagta hai' — testability ka cost is convenience se zyada bada hai.",
  },
  {
    id: "partial-static-tr-8",
    question: "Static constructor kab run hota hai, aur ye instance constructor se kaise different hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Static constructor automatically pehle static-member-access se pehle ek baar run hota hai — instance constructor har `new` call pe run hota hai.",
    detailedAnswer:
      "Static constructor (`static MathHelpers() { ... }`) parameterless hota hai, explicitly kabhi call nahi hota — CLR ise automatically trigger karta hai jab pehli baar us type ka koi static member access ho ya pehla instance banaya jaaye (whichever pehle ho), aur guaranteed sirf EK BAAR run hota hai poore application lifetime me, thread-safe tareeke se. Ye typically static readonly fields ko complex initialization logic se set karne ke liye use hota hai. Instance constructor iske uljat har `new Type()` call pe alag se run hota hai.",
  },
];

export default questions;
