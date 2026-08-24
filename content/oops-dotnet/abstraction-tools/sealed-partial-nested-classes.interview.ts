import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sealed-partial-nested-tr-1",
    question: "`sealed` keyword kya karta hai, aur ise kyun use karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Class ko further inherit hone se rokta hai — primary reason intentional design lock hai, secondary ek chhota JIT perf benefit.",
    detailedAnswer:
      "`sealed class Foo { }` likhne par koi bhi class Foo se derive nahi kar sakti — compile error aata hai agar koi koshish kare. Main reason: design intent enforce karna, jaise ek core business-logic class jisko koi extend karke galat/inconsistent behavior inject na kar sake. Secondary benefit: JIT compiler ko guarantee milta hai ki koi override kabhi nahi aayega, isliye virtual calls ko de-virtualize (direct call resolve) kar sakta hai — chhota lekin real perf gain hot paths me.",
    followUp: "Kya `sealed` sirf poori class pe lagta hai, ya individual members pe bhi?",
  },
  {
    id: "sealed-partial-nested-tr-2",
    question: "`partial` class kya hai, aur production me iska sabse common use case kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek class ko multiple files me split karne deta hai; sabse common use case generated code aur hand-written code ko alag rakhna.",
    detailedAnswer:
      "`partial class Foo` alag-alag files me likha jaa sakta hai, compiler sabko compile time pe ek hi class me merge kar deta hai. Classic production use case: EF Core scaffolding jab ek entity class generate karta hai, developer apna custom logic ek doosri partial file me likhta hai — taaki agli baar scaffold command re-run hone par sirf generated file overwrite ho, hand-written file untouched rahe.",
  },
  {
    id: "sealed-partial-nested-tr-3",
    question: "Nested class kya hoti hai, aur kab use karni chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek class ke andar declare ki gayi doosri class — jab inner type genuinely sirf apne container ke context me meaningful ho, tab use karo.",
    detailedAnswer:
      "Nested class tightly-coupled helper types ke liye hoti hai — jaise ek Builder pattern ka internal Result type, ya ek custom collection ka Enumerator. Ye outer class ke private members tak bhi access rakhti hai. Overuse se bachna chahiye — agar inner type standalone/reusable ban sakta hai, top-level class better rehti hai (discoverability aur testability ke liye).",
    followUp: "Nested class outer class ke private static members access kar sakti hai? Aur ek external class?",
  },
  {
    id: "sealed-partial-nested-tr-4",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic class Base\n{\n    public virtual void Greet() => Console.WriteLine(\"Base\");\n}\npublic class Mid : Base\n{\n    public sealed override void Greet() => Console.WriteLine(\"Mid\");\n}\npublic class Derived : Mid\n{\n    public override void Greet() => Console.WriteLine(\"Derived\");\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile error — Mid.Greet() `sealed override` hai, isliye Derived ise phir se override nahi kar sakta.",
    detailedAnswer:
      "`sealed override` ek specific member ko further override hone se rokta hai, chahe poori class sealed na ho. Mid class khud sealed nahi hai (isse aage inherit ho sakta hai, jaisa Derived ne kiya), lekin uska Greet() method sealed hai — isliye Derived is Greet() ko phir override nahi kar sakta. Fix: Derived ko Greet() ke liye ek naya `new` method (hiding, override nahi) likhna padega agar genuinely alag behavior chahiye, ya Mid se `sealed` hatana padega.",
  },
  {
    id: "sealed-partial-nested-tr-5",
    question: "Ye compile hoga? File1.cs aur File2.cs dono me ye code hai:\n```csharp\n// File1.cs\npublic partial class Customer\n{\n    public string Name { get; set; } = \"\";\n}\n// File2.cs\npartial class Customer\n{\n    public string Email { get; set; } = \"\";\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — dono partial declarations ki accessibility match honi chahiye; File1 me `public`, File2 me koi modifier nahi (implicitly internal) — mismatch hai.",
    detailedAnswer:
      "Partial class ki har piece ko same accessibility modifier explicitly (ya consistently) declare karna zaroori hai. File1.cs me `public partial class Customer` hai, File2.cs me sirf `partial class Customer` hai bina `public` ke — ye ek accessibility mismatch create karta hai jo compile error deta hai. Fix: dono jagah explicitly `public` likho.",
  },
  {
    id: "sealed-partial-nested-tr-6",
    question: "Tumhara team ek `FareCalculator` class likh raha hai jo poore ride-hailing platform me fare calculate karti hai. Business ne clearly bola hai ki ye logic sirf ek jagah, ek consistent implementation me honi chahiye — koi bhi team apna custom fare logic inject na kar sake. Design decision kaunsa lagoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "FareCalculator ko `sealed` mark karo — inheritance-based extension ko language-level pe block kar do.",
    detailedAnswer:
      "Ye exactly `sealed` ka intentional-design-lock use case hai. `sealed class FareCalculator { ... }` guarantee karta hai ki koi bhi team `class CustomFareCalculator : FareCalculator` likh ke inconsistent, unaudited fare logic inject nahi kar sakti. Agar genuinely alag fare strategies chahiye (jaise surge pricing ke variants), composition/strategy pattern (ek interface, multiple implementations) better fit hoga inheritance ke against — lekin agar sirf ek correct implementation honi chahiye, sealed sahi choice hai.",
    followUp: "Agar kal genuinely multiple fare strategies chahiye ho jaayein (city-specific pricing), kya design change karoge?",
  },
  {
    id: "sealed-partial-nested-tr-7",
    question: "Ek naya developer EF Core scaffolded `ApplicationUser.cs` file me directly ek custom `MaskedEmail` property add kar deta hai, seedha generated file me. Kya risk hai, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Risk: agli scaffold-regeneration me ye custom code silently overwrite ho jaayega. Fix: `partial class` pattern use karo — custom logic ek alag file me.",
    detailedAnswer:
      "EF Core scaffolding tool jab dobara run hota hai (schema change ke baad), ye generated file ko poora phir se likh deta hai — koi bhi manual edit us file me silently lost ho jaata hai, bina kisi warning ke. Fix: `ApplicationUser` ko `partial class` banao (agar generator khud partial nahi banata, verify karo), aur custom `MaskedEmail` property ko ek naya file (`ApplicationUser.Custom.cs`) me, same `partial class ApplicationUser` declaration ke saath likho — ye kabhi scaffolding tool se touch nahi hoga.",
    redFlag: "Generated files me directly custom logic likhna 'kyunki abhi to kaam kar raha hai' — ye ek time-bomb hai jo agli regeneration me fatega.",
  },
  {
    id: "sealed-partial-nested-tr-8",
    question: "Kya ye sahi hai: 'sealed class ke andar koi bhi nested class bhi automatically sealed ho jaati hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — `sealed` sirf us specific type pe apply hota hai jispe likha gaya hai; nested types apna independent sealed/unsealed status rakhte hain.",
    detailedAnswer:
      "Ye ek tempting-lekin-galat assumption hai. Agar `OuterClass` sealed hai, iska matlab sirf ye hai ki koi `OuterClass` ko extend nahi kar sakta. Agar `OuterClass` ke andar ek `public class InnerHelper { }` nested hai (bina apne khud ke `sealed` ke), `InnerHelper` ko koi bhi (jahan tak accessibility allow kare) extend kar sakta hai — outer class ki sealed status nested types tak automatically inherit/propagate nahi hoti.",
    redFlag: "'Sealed outer class ka matlab sab kuch andar bhi sealed hai' — ye galat hai, har type apna independent seal-status rakhta hai.",
  },
  {
    id: "sealed-partial-nested-tr-9",
    question: "Kya ye sahi hai: 'sealed lagane se class ka performance hamesha significantly better ho jaata hai, isliye har class ko by default sealed banana chahiye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — perf benefit chhota aur context-dependent hai (sirf hot paths me measurable); har class ko blindly sealed banana extensibility ko unnecessarily limit karta hai.",
    detailedAnswer:
      "De-virtualization ka benefit real hai lekin typically bahut chhota — sirf tight loops ya extremely high-call-count scenarios me measurable, jyadatar business/CRUD code me negligible. 'Har class by default sealed banao' ek overcorrection hai jo legitimate extension scenarios (jaise testing ke liye mocking/subclassing, ya future genuine extensibility needs) ko unnecessarily block kar deta hai. `sealed` ka decision design-intent se aana chahiye ('kya koi ise extend kare, ye sahi hai?'), performance se nahi.",
    redFlag: "'Sealed = free performance, hamesha lagao' — perf gain ko overstate karta hai aur design-intent consideration ko skip karta hai.",
  },
];

export default questions;
