import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "inheritance-tr-1",
    question: "C# multiple class inheritance kyun support nahi karta?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Diamond problem se bachne ke liye — agar do base classes same member define karein to compiler ambiguously resolve nahi kar sakta.",
    detailedAnswer:
      "Agar class C, class A aur B dono se inherit kare, aur dono A aur B ek method Describe() define karte hon, to C.Describe() call karne par compiler ko pata nahi chalega kaunsa version use kare — dono equally valid candidates hain. C# design-time hi is ambiguity ko disallow kar deta hai. Isi reuse-goal ke liye interfaces use karte hain, jo implementation ek hi jagah (implementing class) rakhte hain.",
    followUp: "Interfaces multiple implementation allow karte hain, to unme ye problem kyun nahi aati?",
  },
  {
    id: "inheritance-tr-2",
    question: "Single inheritance aur multilevel inheritance me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Single: ek class, ek direct base class. Multilevel: ek chain — A se B, B se C — har level pichhle sab levels ka accessible content paata hai.",
    detailedAnswer:
      "Single inheritance me `class Manager : Employee` — Manager ke paas sirf Employee ka content hai. Multilevel me `class SeniorManager : Manager` (jo khud Employee se inherit karta hai) — SeniorManager ke paas Employee AND Manager dono ka accessible (public/protected) content hota hai, ek chain ke through. Dono hi C# me fully supported hain, sirf multiple (do ya zyada classes ek saath) inheritance disallowed hai.",
  },
  {
    id: "inheritance-tr-3",
    question: "Ye code kya print karega?\n```csharp\npublic class Vehicle\n{\n    public virtual string Describe() => \"Vehicle\";\n}\npublic class Car : Vehicle\n{\n    public override string Describe() => base.Describe() + \" -> Car\";\n}\npublic class SportsCar : Car\n{\n    public override string Describe() => base.Describe() + \" -> SportsCar\";\n}\n\nVehicle v = new SportsCar();\nConsole.WriteLine(v.Describe());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"Vehicle -> Car -> SportsCar\" — har level base.Describe() call karke chain ko upar se accumulate karta hai.",
    detailedAnswer:
      "SportsCar.Describe() pehle base.Describe() (Car ka) call karta hai, jo pehle apna base.Describe() (Vehicle ka) call karta hai. Vehicle.Describe() \"Vehicle\" return karta hai. Car.Describe() usme \" -> Car\" jodta hai: \"Vehicle -> Car\". SportsCar.Describe() usme \" -> SportsCar\" jodta hai: \"Vehicle -> Car -> SportsCar\". Ye virtual/override ke through multilevel chain ka classic demonstration hai (poora runtime-polymorphism mechanism agle topics me).",
  },
  {
    id: "inheritance-tr-4",
    question: "Kya ye C# me valid hai?\n```csharp\npublic interface IAuditable { }\npublic interface ISoftDeletable { }\npublic class EntityBase { }\n\npublic class Order : EntityBase, IAuditable, ISoftDeletable { }\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Haan, bilkul valid hai — ek base class (EntityBase) plus multiple interfaces, ye exactly C# ka allowed pattern hai.",
    detailedAnswer:
      "C# rule ye hai: sirf ek base class allowed hai (yahan EntityBase), lekin interfaces jitne chaho implement kar sakte ho (yahan IAuditable aur ISoftDeletable). Ye combination — ek base class ke saath multiple interfaces — bilkul valid hai aur idiomatic C# design pattern hai jab tumhe is-a relationship (EntityBase) plus multiple cross-cutting capabilities chahiye hon.",
    followUp: "Agar EntityBase ki jagah ek doosri class bhi add karne ki koshish karo (`: EntityBase, SomeOtherClass, ...`), kya hoga?",
  },
  {
    id: "inheritance-tr-5",
    question: "Tumhara code review me ek 5-level deep inheritance chain hai (Entity -> AuditableEntity -> SoftDeletableEntity -> Order -> DiscountedOrder). Iska kya risk hai, aur alternative kya suggest karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Fragile base class risk — Entity me koi chhota change 4 levels neeche unpredictably kuch todh sakta hai. Alternative: cross-cutting concerns (audit, soft-delete) ko interfaces me move karo, inheritance chain ko shallow rakho.",
    detailedAnswer:
      "Deep chains ka problem ye hai ki har level base ke internal assumptions pe implicitly depend karta hai. Agar Entity me ek field ka default value change ho, DiscountedOrder tak effect propagate ho sakta hai bina obvious connection ke — debug karna mushkil ho jaata hai. Better design: audit/soft-delete jaise cross-cutting behaviors ko IAuditable/ISoftDeletable interfaces bana do, aur actual class hierarchy sirf genuine is-a relationships tak (jaise Order -> DiscountedOrder, agar wo bhi genuinely zaroori hai) limit karo — ya composition consider karo agar 'is-a' clearly fit nahi karta.",
    followUp: "Agar DiscountedOrder Order ka har behavior honor nahi karta (jaise kuch operations restrict karta hai), iska kya implication hai?",
  },
  {
    id: "inheritance-tr-6",
    question: "Do interfaces `IPrintable` aur `ILoggable` dono me same-signature default method `Describe()` hai (dono C# 8+ default implementation ke saath). Ek class dono implement karti hai. Kya hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Compile error — dono interfaces ka default implementation ambiguous ho jaata hai, class ko explicitly resolve karna padega apna khud ka Describe() likh ke.",
    detailedAnswer:
      "Default interface methods (C# 8+) se pehle ye scenario impossible tha kyunki interfaces me implementation hoti hi nahi thi. Ab jab dono interfaces apna default deti hain, compiler decide nahi kar sakta kaunsa use kare — 'class does not implement interface member' jaisa error aata hai. Fix: class khud Describe() explicitly implement kare (ya explicit interface implementation syntax use kare, jaise `string IPrintable.Describe()`), jo ambiguity resolve kar deta hai. Ye ek narrow lekin real diamond-problem-jaisa scenario hai jo C# 8 se introduce hua.",
    redFlag: "Ye bolna ki 'interfaces me to ye problem kabhi aa hi nahi sakti' — default interface methods ke aane ke baad ye ab poori tarah sach nahi hai.",
  },
  {
    id: "inheritance-tr-7",
    question: "Ek `Manager` class hai jo `Employee` se inherit karti hai, lekin `Manager.CalculateSalary()` `NotImplementedException` throw karta hai kyunki 'managers ka salary alag system se aata hai.' Iska kya design problem hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ye Liskov Substitution Principle violate karta hai — Manager, Employee ka poora contract honor nahi kar raha, jo suggest karta hai ki inheritance yahan galat tool hai.",
    detailedAnswer:
      "Agar Manager, Employee jitna base behavior honor nahi kar sakta (yahan CalculateSalary() ek core Employee capability hai), to 'Manager is-a Employee' relationship model karna galat hai — ya to salary calculation ko differently design karna chahiye (jaise ek strategy pattern), ya inheritance ki jagah composition use karni chahiye. Ye ek classic sign hai ki inheritance sirf 'code reuse ke liye convenient tha' isliye use hua, genuine is-a nahi tha.",
    followUp: "Isko composition se kaise redesign karoge?",
  },
  {
    id: "inheritance-tr-8",
    question: "Kya har C# class ka koi na koi base class hota hai, chahe explicitly likha ho ya nahi?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Haan — agar explicitly koi base class na likhi ho, class implicitly `System.Object` se inherit karti hai.",
    detailedAnswer:
      "`public class Foo { }` likhne ka matlab hai Foo implicitly `System.Object` ka derived type hai — isiliye `ToString()`, `Equals()`, `GetHashCode()`, `GetType()` har class pe automatically available hoti hain bina kuch likhe. Ye ek common trap question hai kyunki candidates sochte hain 'Foo ka koi base class hi nahi hai' jo galat hai.",
  },
  {
    id: "inheritance-tr-9",
    question: "Ek `PersonalLoanApplication` aur `HomeLoanApplication` dono `LoanApplication` se inherit karte hain (single inheritance), aur dono ko audit-trail capability bhi chahiye jo `CustomerProfile` (jo loans se unrelated hai) ko bhi chahiye. Iska design kaise karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "`IAuditable` interface banao jisme CreatedAt/audit-related members hon, aur LoanApplication, CustomerProfile dono independently isko implement karein — inheritance chain se bilkul alag.",
    detailedAnswer:
      "```csharp\npublic interface IAuditable\n{\n    DateTime CreatedAt { get; }\n    string CreatedBy { get; }\n}\n\npublic abstract class LoanApplication : IAuditable\n{\n    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;\n    public string CreatedBy { get; init; } = \"\";\n    public decimal RequestedAmount { get; init; }\n}\n\npublic class PersonalLoanApplication : LoanApplication { }\npublic class HomeLoanApplication : LoanApplication { public string PropertyId { get; init; } = \"\"; }\n\npublic class CustomerProfile : IAuditable\n{\n    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;\n    public string CreatedBy { get; init; } = \"\";\n}\n```\nYahan `LoanApplication` inheritance chain (genuine is-a) ko `IAuditable` interface (cross-cutting, unrelated types ke beech shared) se cleanly separate kiya gaya hai — exactly wo pattern jo diamond problem ke bina multi-source reuse deta hai.",
  },
];

export default questions;
