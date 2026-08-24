import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ocp-tr-1",
    question: "Open/Closed Principle kya hai, ek real example ke saath samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Class extension ke liye open honi chahiye, modification ke liye closed. Discount calculation ka if/else-to-Strategy refactor classic example hai.",
    detailedAnswer:
      "OCP kehta hai naya behavior add karne ke liye naya code likho, purane tested code ko edit mat karo. Ek DiscountService jisme har discount type ke liye if/else branch tha — usko IDiscountStrategy interface + ek class per discount type me refactor karke, naya discount add karna sirf ek nayi class likhna reh gaya, DiscountService kabhi touch nahi hoti.",
    followUp: "DI container is refactor me kya role play karta hai?",
  },
  {
    id: "ocp-tr-2",
    question: "Ye code me kya OCP violation hai?\n```csharp\npublic decimal Calculate(string type, decimal amount)\n{\n    if (type == \"A\") return amount * 0.1m;\n    if (type == \"B\") return amount * 0.2m;\n    return 0;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Naya type add karne ke liye is method ko edit karna padega — ek naya if branch — jo existing tested branches ke risk me daalta hai.",
    detailedAnswer:
      "Ye method 'closed for modification' nahi hai — koi bhi naya discount type (\"C\") add karne ke liye is exact method ko modify karna padega. Risk: naya branch insert karte waqt typo ya galat placement purane, already-working \"A\"/\"B\" logic ko accidentally affect kar sakta hai. Fix: Strategy pattern — har type ke liye ek class, interface ke peeche.",
  },
  {
    id: "ocp-tr-3",
    question: "Business ne bola hai ki agle 6 mahine me 10 naye discount types launch honge, har mahine ek-do. Design kaise karoge taaki har launch risk-free ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "IDiscountStrategy interface banao, har discount type apni class ho, DI container me register karo — naya launch matlab ek nayi class deploy, existing code untouched.",
    detailedAnswer:
      "Strategy pattern is exact scenario ke liye design kiya gaya hai — jab tumhe genuinely pata hai variation aane wala hai (yahan explicit business commitment hai). IDiscountStrategy interface define karo, DiscountService sirf `IEnumerable<IDiscountStrategy>` resolve kare DI se. Har naya launch: ek nayi class + ek DI registration line, poori existing discount logic untouched rehti hai — deployment risk sirf naye code tak limited.",
    followUp: "Agar kal koi discount type REMOVE karna pade production se, kya karoge?",
  },
  {
    id: "ocp-tr-4",
    question: "Kya OCP ka matlab hai ki tumhe HAR class ke liye upfront interface banani chahiye, 'just in case' future variation aaye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye premature abstraction hai. OCP tabhi apply karo jab variation genuinely expected/likely ho, speculative future-proofing ke liye nahi.",
    detailedAnswer:
      "Ye ek classic over-application trap hai. Har jagah 'just in case' interfaces banana unnecessary indirection add karta hai bina real benefit ke — code padhna harder ho jaata hai, aur agar variation kabhi aaya hi nahi to wo abstraction sirf overhead thi. OCP ek judgment call hai: apply karo jahan concrete evidence ho (business requirement, historical pattern of frequent additions) ki naye variants aayenge.",
    redFlag: "'Maximum flexibility ke liye har class ko interface ke peeche daal do' — ye YAGNI (You Aren't Gonna Need It) violate karta hai.",
  },
  {
    id: "ocp-tr-5",
    question: "Strategy pattern refactor karne ke baad, ek naya discount add kiya gaya lekin production me kaam nahi kar raha (silently 0 return kar raha hai). Debug kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Sabse pehle check karo ki naya IDiscountStrategy implementation DI container me register hua hai ya nahi — ye sabse common miss hai.",
    detailedAnswer:
      "`DiscountService.CalculateDiscount` internally `_strategies.FirstOrDefault(s => s.DiscountType == discountType)` karta hai — agar naya strategy `Program.cs` me `AddScoped<IDiscountStrategy, X>()` se register nahi hua, to `FirstOrDefault` null return karega aur method silently `0` return karega, koi exception nahi throw hoga. Ye ek real, easy-to-miss bug hai jo Strategy pattern DI-based implementations me common hai.",
    followUp: "Isko fail-fast kaise bana sakte ho taaki silent 0 ki jagah clear error aaye?",
  },
  {
    id: "ocp-tr-6",
    question: "OCP aur SRP dono ka goal 'change ko manage karna' hai — inme fundamental difference kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "SRP ek class ke ANDAR responsibilities ko separate karta hai; OCP naye VARIANTS ko add karne ka mechanism deta hai bina existing code chhue.",
    detailedAnswer:
      "SRP poochta hai 'ye class kitne reasons se change hogi' aur unhe split karta hai. OCP poochta hai 'naya VARIANT/TYPE add karne par kya existing code touch hota hai' aur usko avoid karta hai extension points (interfaces) ke through. Dono often saath chalte hain — SRP se split hui ek class (jaise DiscountService) phir OCP se further extensible banayi jaati hai (Strategy pattern) taaki naye discount TYPES add karna existing code na chhue.",
  },
  {
    id: "ocp-tr-7",
    question: "Ye statement sahi hai ya galat: 'OCP follow karne ke baad, tumhe kabhi bhi kisi existing class ko edit karne ki zaroorat nahi padegi'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — OCP sirf specific anticipated variation ke against protect karta hai, har tarah ke change ke against nahi.",
    detailedAnswer:
      "Agar `IDiscountStrategy` interface ka signature hi badalna pade (jaise `Calculate` ko ab ek extra `CustomerTier` parameter chahiye), to HAR implementing class ko edit karna padega — chahe wo 3 ho ya 30. OCP is tarah ke 'abstraction-level' change se protect nahi karta, sirf 'naya implementation add karna' se protect karta hai. Interview me isko explicitly acknowledge karna senior-level understanding signal karta hai.",
    redFlag: "'OCP follow karne ke baad koi file kabhi edit nahi hoti' — ye overclaim hai, real systems me interface signature changes hote hi hain.",
  },
  {
    id: "ocp-tr-8",
    question: "Ye code review comment sahi hai ya galat: 'Yahan sirf 2 discount types hain aur business ne kabhi teesra add karne ka plan nahi bataya — Strategy pattern zaroorat se zyada hai, simple if/else theek hai'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Context ke hisaab se sahi ho sakta hai — agar genuinely koi evidence nahi hai future variation ka, to Strategy pattern premature abstraction ban sakta hai.",
    detailedAnswer:
      "Ye ek nuanced trap hai jahan 'sahi' answer context-dependent hai, aur interviewer candidate ka judgment test kar raha hai, na ki ek fixed rule. Agar genuinely 2 hi types hain aur koi business signal nahi hai growth ka, simple if/else zyada readable ho sakta hai Strategy pattern ke overhead se. OCP ek principle hai, blanket rule nahi — apply karna hai jab evidence ho, na ki har jagah reflexively.",
  },
];

export default questions;
