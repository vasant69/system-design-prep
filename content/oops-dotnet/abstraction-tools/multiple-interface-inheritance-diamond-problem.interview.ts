import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "diamond-problem-tr-1",
    question: "Kya C# me diamond problem hoti hai? Explain karo.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["Amazon", "TCS"],
    shortAnswer: "Classic multi-base-class diamond problem C# me nahi hoti (multiple class inheritance hi disallowed hai), lekin default interface methods ke saath ek narrower version possible hai.",
    detailedAnswer:
      "C# ek class ko sirf ek base class extend karne deta hai, isliye traditional diamond problem (do base classes, common ancestor, ambiguous resolution) language design se hi avoid ho jaata hai. Lekin C# 8 me default interface methods (DIM) aane ke baad, agar do interfaces same-signature member ko default implementation dete hain aur ek class dono implement kare bina apna implementation diye, compiler ambiguity error deta hai — ye ek chhota, compile-time-hi-caught version hai diamond problem ka.",
    followUp: "Ye ambiguity exactly kaise resolve karte ho — code ke saath dikhao.",
  },
  {
    id: "diamond-problem-tr-2",
    question: "C# multiple class inheritance kyun disallow karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ambiguous member resolution avoid karne ke liye — agar do base classes same member define karein, compiler ko pata nahi chalega kaunsa use karna hai.",
    detailedAnswer:
      "Agar C# multiple class inheritance allow karta (`class C : A, B`), aur A, B dono ek same-named field/method define karte, `c.SomeMember` call karne par ambiguity ho jaati — kaunsa version chalega? C++ isse allow karta hai (virtual inheritance jaisi complex mechanisms ke saath), lekin C# ne simplicity choose ki: single class inheritance, aur reuse ke liye multiple interfaces — jinme ye ambiguity, DIM aane tak, exist hi nahi karti thi.",
  },
  {
    id: "diamond-problem-tr-3",
    question: "Default interface methods ke context me diamond problem exactly kab trigger hoti hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Jab do interfaces, jo ek doosre se related nahi hain, same-signature member ko dono apna default implementation dete hain, aur implementing class kuch khud nahi likhti.",
    detailedAnswer:
      "Condition precise hai: (1) do interfaces same method signature define karte hain, (2) dono ke paas apna default body hai, (3) na to interface doosre se derive karta hai (agar karta, to 'most specific override' rule automatically decide kar deta), (4) implementing class khud koi implementation nahi deti. In sab conditions ke saath hi genuine ambiguity hoti hai, aur compiler error deta hai.",
    followUp: "Agar IB, IA se derive karta ho (interface IB : IA), kya tab bhi ambiguity hogi agar dono Ping() ko override karte hain?",
  },
  {
    id: "diamond-problem-tr-4",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic interface IA\n{\n    void Ping() => Console.WriteLine(\"IA\");\n}\npublic interface IB\n{\n    void Ping() => Console.WriteLine(\"IB\");\n}\npublic class C : IA, IB { }\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile error — na IA na IB ka Ping() 'most specific' hai, C ne khud kuch resolve nahi kiya.",
    detailedAnswer:
      "Dono interfaces unrelated hain aur dono ek default Ping() dete hain — compiler decide nahi kar sakta kaunsa 'zyada specific' hai (koi inheritance relationship IA-IB ke beech nahi hai jo isse resolve kar sake). C class ne khud koi Ping() implementation nahi di, isliye compile error aayega: C ko IA.Ping() implement karna hi hai. Fix ke liye C apna khud ka Ping() de, ya dono explicitly implement kare.",
  },
  {
    id: "diamond-problem-tr-5",
    question: "Ab is fix ke baad kya output aayega?\n```csharp\npublic class C : IA, IB\n{\n    public void Ping() => Console.WriteLine(\"C\");\n}\n\nIA a = new C();\nIB b = new C();\na.Ping();\nb.Ping();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"C\" phir \"C\" — C ka apna public Ping() dono interface references se hi call hota hai, kyunki wo 'most specific' hai.",
    detailedAnswer:
      "Jab class apna khud ka (public, non-explicit) Ping() implementation deti hai, ye automatically dono interfaces ke default se 'zyada specific' maana jaata hai — chahe reference IA ka ho ya IB ka, dono `C.Ping()` par hi resolve hote hain. Isliye dono lines \"C\" print karti hain, IA/IB ke apne defaults kabhi nahi chalte.",
  },
  {
    id: "diamond-problem-tr-6",
    question: "Tumhare paas ek `OrderStatusChangeHandler` class hai jo `IEmailNotifiable` aur `IPushNotifiable` dono implement karti hai — dono ka default `NotifyAsync` hai. Business requirement hai ki email me full detail jaaye, push me sirf ek short summary. Design kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Dono NotifyAsync ko explicitly implement karo, har ek apna alag content bhejta hua.",
    detailedAnswer:
      "Ye ek genuine-different-behavior-per-interface case hai, isliye single unified implementation kaam nahi karega. `Task IEmailNotifiable.NotifyAsync(string message)` full detail bheje, `Task IPushNotifiable.NotifyAsync(string message)` short summary bheje — dono explicit, taaki caller jab `IEmailNotifiable` reference se call kare to email-specific behavior mile, aur `IPushNotifiable` reference se push-specific.",
    followUp: "Agar kal ek teesra channel (SMS) add karna ho isi handler me, design kaise scale karega?",
  },
  {
    id: "diamond-problem-tr-7",
    question: "Tumhara colleague kehta hai: 'Interfaces me multiple inheritance allowed hai, isliye C# me bhi utna hi severe diamond problem hai jitna C++ me.' Kya ye sahi hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Nahi — C# ka DIM-diamond scenario purely compile-time signature-resolution issue hai, C++ ka diamond problem memory-layout/runtime-level zyada complex problem hai.",
    detailedAnswer:
      "C++ me diamond problem me actual data members duplicate ho sakte hain memory me (virtual inheritance ke bina), aur runtime resolution complex ho sakta hai. C# ka scenario bahut narrower hai: sirf tab trigger hota hai jab do interfaces same-signature member ko DEFAULT IMPLEMENTATION dete hain, aur ye hamesha ek clean compile-time error hota hai jo predictable tareeke se resolve hota hai — koi runtime ambiguity, koi memory duplication nahi. Severity comparison galat hai.",
    redFlag: "C# aur C++ ke diamond problems ko equally severe bolna — underlying mechanics bahut alag hain.",
  },
  {
    id: "diamond-problem-tr-8",
    question: "Kya ye trap statement sahi hai: 'Do interfaces me same-signature method ho to hamesha diamond problem hoga'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — sirf tab jab dono interfaces default implementation dete hain. Agar signatures sirf declare hi hue hain (no body), ye sirf ek naming collision hai, trivially explicit implementation se resolve hota hai, koi genuine ambiguity nahi.",
    detailedAnswer:
      "Ye ek common overgeneralization hai. Signature-only (no default body) interfaces me same-name member hona bilkul normal aur unproblematic hai — class ek public method se dono ko satisfy kar sakti hai, ya explicit implementations se alag kar sakti hai, koi compiler ambiguity error nahi aata kyunki koi COMPETING implementation hi nahi hai resolve karne ko. Genuine diamond-via-DIM sirf tab hota hai jab dono interfaces apna-apna default BODY dete hain.",
    redFlag: "'Same naam ka method do interfaces me matlab diamond problem' — ye DIM (default body) ki zaroorat ko miss karta hai, sirf naming collision aur genuine diamond me farak nahi karta.",
  },
  {
    id: "diamond-problem-tr-9",
    question: "Kya ye sahi hai: 'DIM diamond ambiguity runtime pe crash karti hai, jaise ek NullReferenceException'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye hamesha COMPILE-TIME error hai. Code kabhi run hi nahi hoga jab tak ambiguity resolve na ho.",
    detailedAnswer:
      "Ye ek dangerous misconception hai — agar candidate isse runtime issue samajhta hai, wo galat mental model rakhta hai ki 'code chal jaayega aur kabhi kabhi fail hoga.' Reality: agar diamond ambiguity exist karti hai (do unrelated interfaces, competing defaults, class ne resolve nahi kiya), build hi fail ho jaata hai — koi deployment, koi runtime exception ka sawaal hi nahi aata. Ye compile-time-hi-caught hone ki wajah se production me kabhi silently nahi todhta.",
    redFlag: "Isse runtime bug bolna — ye completely build-time hi surface hota hai, production risk zero hai is specific scenario ka.",
  },
];

export default questions;
