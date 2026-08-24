import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "properties-tr-1",
    question: "`init`-only setter kya problem solve karta hai jo constructor-only immutability se solve nahi hota tha?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Object-initializer syntax (`new X { A = 1 }`) ke saath immutability combine karta hai — pehle ye dono ek saath possible nahi the.",
    detailedAnswer:
      "Immutability chahiye to (pre-C#9) ya to constructor-only property (`{ get; }`) use karo — object-initializer syntax kaam nahi karega, sirf constructor call. Ya public setter do — object-initializer syntax kaam karega, lekin immutability toot jaayegi. `init` (C# 9) dono deta hai — property object-initializer me set ho sakti hai (`new Person { Name = \"Amit\" }`), lekin construction complete hone ke baad wo readonly ban jaati hai — koi doosra assignment compile error deta hai.",
    followUp: "`required` ne init ke upar kya additional guarantee add ki C# 11 me?",
  },
  {
    id: "properties-tr-2",
    question: "`required` member kya guarantee deta hai, aur kya nahi deta?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Guarantee: property object-initializer me zaroor set hogi (compile-time). Nahi deta: value ki validity/correctness — wo alag concern hai.",
    detailedAnswer:
      "`public required string Email { get; init; }` compiler ko force karta hai ki koi bhi `new Person { ... }` call `Email` include kare — agar na kare, compile error. Lekin `Email = \"\"` (empty string) bhi technically 'set' mana jaata hai — `required` value ki business-validity check nahi karta. Genuine validation (format check, non-empty check) ab bhi ek setter ke andar ya constructor logic me explicitly likhni padti hai agar chahiye.",
  },
  {
    id: "properties-tr-3",
    question: "Ye code compile hoga ya error dega?\n```csharp\npublic class Dto\n{\n    public required string Name { get; init; }\n}\n\nvar d = new Dto();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — Name required hai lekin object-initializer me set nahi kiya gaya.",
    detailedAnswer:
      "`required` compiler-enforced hai — `new Dto()` ke through Name ko set kiye bina object banane ki koshish compile-time pe fail ho jaati hai ('Required member Name must be set in the object initializer'). Sahi tareeka: `var d = new Dto { Name = \"Amit\" };`.",
  },
  {
    id: "properties-tr-4",
    question: "Ek `Rectangle` class banao jisme `Area` property `Width`/`Height` se computed ho, koi backing field nahi.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Expression-bodied get-only property use karo: `public double Area => Width * Height;`",
    detailedAnswer:
      "```csharp\npublic class Rectangle\n{\n    public double Width { get; init; }\n    public double Height { get; init; }\n    public double Area => Width * Height;\n}\n```\n`Area` ka koi backing field nahi hai — har access pe expression recompute hoti hai. Ye tab appropriate hai jab property ek DERIVED value ho, jo apne aap kisi independent state ki tarah stored nahi honi chahiye — Width/Height badalne par Area automatically consistent rehta hai (agar Width/Height mutable hote, jo yahan init hone ki wajah se nahi hain).",
  },
  {
    id: "properties-tr-5",
    question: "Kya `init` aur `set` ek hi property pe ek saath use ho sakte hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ek property ya to `init` accessor rakh sakti hai ya `set`, dono nahi — `init` aur `set` mutually exclusive hain.",
    detailedAnswer:
      "`public string Name { get; init; set; }` COMPILE ERROR deta hai — `init` aur `set` ek hi property pe simultaneously define nahi ho sakte, kyunki inka semantic hi conflicting hai (`init` = only-during-construction, `set` = anytime). Agar kabhi genuinely dono behaviors chahiye (kuch scenarios me settable during construction AND later), alag properties ya methods design karne padenge — ye ek deliberate language restriction hai.",
    redFlag: "Ye assume karna ki init aur set combine ho sakte hain ek property pe 'extra flexibility' ke liye.",
  },
  {
    id: "properties-tr-6",
    question: "`{ get; private set; }` aur `{ get; init; }` me practical difference kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`private set` sirf class ke andar (koi bhi method me) settable hai; `init` sirf object-construction ke exact moment settable hai, class ke andar bhi baad me nahi.",
    detailedAnswer:
      "`{ get; private set; }` — property class ke andar KISI BHI instance method se set ki ja sakti hai, chahe wo construction ke bahut baad ho (jaise ek `UpdateStatus()` method jo internally `Status = newValue;` kare). `{ get; init; }` — property SIRF construction ke exact moment (constructor ya object-initializer) me set ho sakti hai, class ke andar bhi koi baad ka method use ise modify nahi kar sakta. `init` genuinely strict, true immutability-after-construction deta hai; `private set` sirf external-mutation ko rokta hai, internal mutation allow karta hai.",
  },
  {
    id: "properties-tr-7",
    question: "Ek KYC onboarding DTO design karo jahan PanNumber mandatory ho lekin MiddleName optional ho, modern C# syntax use karke.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`required string PanNumber { get; init; }` mandatory field ke liye, `string? MiddleName { get; init; }` optional ke liye.",
    detailedAnswer:
      "```csharp\npublic class KycDto\n{\n    public required string PanNumber { get; init; }\n    public string? MiddleName { get; init; }\n    public required string FullName { get; init; }\n}\n```\n`required` fields compiler-level pe guarantee karte hain ki `new KycDto { ... }` inhe zaroor include kare — missing-PAN-number wala object banana hi possible nahi hai. `MiddleName` (nullable, no `required`) genuinely optional rehta hai — bina set kiye bhi object ban sakta hai.",
  },
  {
    id: "properties-tr-8",
    question: "Kya `required` ka use karna records ke saath overlap karta hai — records already immutability provide karte hain na?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Records `init`-only properties default dete hain (immutability), lekin `required` alag concern solve karta hai — 'set karna mandatory hai ya nahi', jo records bhi automatically provide nahi karte.",
    detailedAnswer:
      "Ek `record Person(string Name, int Age)` ke saath positional syntax use karne par saare parameters effectively 'mandatory' feel hote hain (constructor-jaisa), lekin agar record ko object-initializer-style banaya jaaye (`record Person { public string Name { get; init; } }`), Name optional ho jaata hai jab tak `required` explicitly na lagaya jaaye. Isliye `required` records ke saath bhi genuinely relevant hai jab record property-syntax use kar raha ho (positional syntax nahi), aur developer chahta hai ki kuch fields ko object-initializer bhi mandatory-enforce kare.",
    redFlag: "Ye maan lena ki records automatically sab kuch 'required' bana dete hain — sirf positional-constructor syntax use karne par ye effectively true hai, property-syntax records me nahi.",
  },
];

export default questions;
