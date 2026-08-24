import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "abstract-classes-tr-1",
    question: "Abstract class kya hoti hai, aur ye normal class se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Abstract class ek incomplete base class hai jo directly instantiate nahi ho sakti aur abstract + concrete members dono rakh sakti hai.",
    detailedAnswer:
      "`abstract` keyword se mark ek class directly `new` nahi ho sakti. Ye sirf inheritance ke liye ban ti hai — derived classes isse extend karti hain. Normal class ke against difference: normal class fully complete hoti hai, seedha instantiate ho sakti hai. Abstract class me kuch members `abstract` (sirf signature, no body) ho sakte hain jo derived class ko implement karne padte hain, aur kuch concrete (poori implementation ke saath) jo derived classes ko free me milte hain.",
    followUp: "Agar ek abstract class me ek bhi abstract member nahi hai, phir bhi wo abstract kyun mark ki jaa sakti hai?",
  },
  {
    id: "abstract-classes-tr-2",
    question: "Abstract class aur interface me kya fundamental difference hai (pre-default-interface-methods context me)?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Abstract class instance state (fields) aur concrete implementation dono rakh sakti thi; interface sirf contract (signatures) de sakta tha.",
    detailedAnswer:
      "C# 8 se pehle interface me koi implementation allowed hi nahi thi — sirf method/property signatures. Abstract class me dono possible tha: abstract members (contract) aur concrete members (real, shared implementation), plus instance fields jo har derived object apna alag copy rakhta. Aaj bhi, default interface methods (C# 8) ke baad bhi, interfaces instance fields nahi rakh sakte — ye asli deciding factor hai jab shared state ki zaroorat ho.",
    followUp: "To phir aaj, C# 8 ke baad, abstract class kab reach for karoge interface ki jagah?",
  },
  {
    id: "abstract-classes-tr-3",
    question: "Abstract class ka constructor ka kya use hai jab class khud kabhi instantiate nahi hoti?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Constructor derived classes ke base() call ke through chalta hai — shared initialization logic ek jagah likhne ke liye.",
    detailedAnswer:
      "Har derived class ka constructor implicitly (parameterless base ke liye) ya explicitly (`: base(args)`) abstract class ke constructor ko call karta hai. Ye ek jagah shared setup (jaise ek common ILogger field assign karna, ya required validation) likhne deta hai, jo har derived class me duplicate nahi karna padta. Constructor khud directly `new AbstractClass()` se call nahi ho sakta, lekin har derived instantiation ke path me guaranteed chalta hai.",
    redFlag: "Ye bolna ki 'abstract class ka constructor kabhi execute hi nahi hota' — galat hai, ye har derived instance banne par zaroor chalta hai.",
  },
  {
    id: "abstract-classes-tr-4",
    question: "Ye code compile hoga ya error dega?\n```csharp\npublic abstract class Shape\n{\n    public abstract double Area();\n}\n\nvar s = new Shape();\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Compile error — abstract class ka direct instance nahi ban sakta.",
    detailedAnswer:
      "`new Shape()` compile-time error deta hai kyunki Shape abstract hai aur incomplete hai (Area() ka koi body nahi). Compiler runtime tak pahunchne hi nahi deta — ye error IDE me hi turant highlight ho jaata hai. Fix: koi concrete class jo Shape se derive karke Area() implement kare, use instantiate karo.",
  },
  {
    id: "abstract-classes-tr-5",
    question: "Ye output kya hoga?\n```csharp\npublic abstract class Base\n{\n    public Base() => Console.WriteLine(\"Base ctor\");\n    public void Greet() => Console.WriteLine(\"Hello from Base\");\n}\n\npublic class Derived : Base { }\n\nvar d = new Derived();\nd.Greet();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"Base ctor\" phir \"Hello from Base\" — Base ka parameterless constructor implicitly chalta hai, Greet() concrete hone ki wajah se direct available hai.",
    detailedAnswer:
      "`new Derived()` call hone par, Derived ka (implicit, compiler-generated) constructor pehle implicitly `Base()` ko call karta hai — isliye \"Base ctor\" print hota hai. Phir `d.Greet()` call hota hai — Greet() Base me concrete method hai, Derived isse bina kuch likhe inherit karta hai, isliye \"Hello from Base\" print hota hai.",
  },
  {
    id: "abstract-classes-tr-6",
    question: "Ye compile hoga ya error dega, aur kyun?\n```csharp\npublic abstract class Base\n{\n    public void Greet() => Console.WriteLine(\"Base Greet\");\n}\n\npublic class Derived : Base\n{\n    public override void Greet() => Console.WriteLine(\"Derived Greet\");\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile error — Base.Greet() `virtual` nahi hai, isliye `override` nahi kiya ja sakta.",
    detailedAnswer:
      "Concrete (non-abstract) methods abstract class me by default non-virtual hote hain, jaise normal class me. `override` sirf `virtual`, `abstract`, ya `override` marked members pe hi legal hai. Yahan Base.Greet() plain, non-virtual method hai, isliye `override` compile error deta hai (CS0506-type error — 'no suitable method found to override'). Fix: Base.Greet() ko `virtual` mark karo, ya Derived me `new` keyword use karo (jo override nahi, hiding karega — alag behavior).",
    followUp: "Agar `override` ki jagah `new` keyword use kar diya jaaye, to polymorphic call pe (Base reference ke through) kaunsa Greet() chalega?",
  },
  {
    id: "abstract-classes-tr-7",
    question: "Tumhare paas teen document verifiers hain — PanCardVerifier, AadhaarVerifier, PassportVerifier — jo sab same logging pattern aur same IAuditService dependency share karte hain, lekin har ek ka actual verification logic alag hai. Isse design kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek abstract DocumentVerifierBase banao jisme shared constructor (IAuditService inject karke) aur shared logging concrete method ho, aur ek abstract VerifyAsync() method jo har verifier apna implement kare.",
    detailedAnswer:
      "Ye textbook abstract-class use case hai — genuinely shared state (IAuditService field) aur shared implementation (logging helper) hai, sirf naam-match wala contract nahi. DocumentVerifierBase abstract class banao: constructor IAuditService accept kare aur field assign kare, ek concrete `LogVerificationAttempt()` method ho jo sab verifiers use karein, aur `abstract Task<bool> VerifyAsync(byte[] document)` ho jo har concrete verifier apne document type ke hisaab se implement kare.",
    followUp: "Agar kal ek naya requirement aaye ki PassportVerifier ko ek extra interface bhi implement karna hai (jaise IExternallyCallable), kya wo abstract class inheritance ke saath possible hai?",
  },
  {
    id: "abstract-classes-tr-8",
    question: "Ek naya developer ne poora shared logic (fields + methods) ek interface me daalne ki koshish ki, DIM (default interface methods) use karke, kyunki 'C# 8 ke baad interface bhi implementation de sakta hai.' Kya ye abstract class ka poora replacement hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — default interface methods implementation de sakte hain, lekin interface aaj bhi instance fields (state) nahi rakh sakta.",
    detailedAnswer:
      "Ye ek common misconception hai. DIM (C# 8, 2019) interfaces ko default method BODIES dene ki permission deta hai, lekin interfaces ab bhi instance-level mutable state (fields) store nahi kar sakte — sirf properties define kar sakte hain jinka backing store implementing class ko khud provide karna padta hai. Agar shared logic ko ek shared FIELD chahiye (jaise ek logger reference jo constructor me set hota hai), sirf abstract class ye de sakti hai. DIM API evolution ke liye hai (naye methods add karna bina existing implementers todhe), state-sharing ke liye nahi.",
    redFlag: "Ye bolna ki 'C# 8 ke baad abstract classes ki zaroorat hi khatam ho gayi, sab interface se ho sakta hai' — ye field/state limitation ko miss karta hai.",
  },
  {
    id: "abstract-classes-tr-9",
    question: "Kya ek abstract class me sealed method ho sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Haan — ek override kiye hue virtual/abstract member ko `sealed override` mark karke aage further override hone se rok sakte ho, ek abstract class ke andar bhi.",
    detailedAnswer:
      "Ye interviewers ka ek sharp trap hai. `sealed` normally poori class pe lagta hai, lekin ek specific member pe bhi lag sakta hai — condition ye hai ki wo member pehle se `override` ho (kisi base ke virtual/abstract member ka). Ek intermediate abstract class ek base ke abstract method ko implement karke `sealed override` mark kar sakti hai, taaki aage ki derived classes use aur override na kar paayein — baaki abstract members still overridable rehte hain.",
  },
  {
    id: "abstract-classes-tr-10",
    question: "Production me tumhara NotificationSender abstract class hai jisme constructor ILogger ko null-check karta hai. Ek naya EmailNotificationSender likha gaya jisne base() call hi nahi kiya. Kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Agar base class me sirf ek parameterized constructor hai (koi parameterless nahi), to derived class compile hi nahi hogi jab tak wo explicitly base(logger) call na kare.",
    detailedAnswer:
      "C# compiler automatically ek parameterless base() call insert karta hai agar derived class explicitly kuch na likhe — LEKIN sirf tab jab base class ka koi parameterless constructor available ho. Agar NotificationSender ka sirf ek constructor hai jo ILogger parameter maangta hai, to Derived class ko explicitly `: base(logger)` likhna hi padega, warna compile error aayega ('does not contain a constructor that takes 0 arguments'). Ye ek safety net hai — tumhe accidentally shared initialization skip karne se rokta hai.",
  },
];

export default questions;
