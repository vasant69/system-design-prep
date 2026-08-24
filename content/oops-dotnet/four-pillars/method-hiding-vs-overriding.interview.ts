import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hiding-vs-overriding-tr-1",
    question: "Method hiding (`new`) aur method overriding (`override`) me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon", "Cognizant"],
    shortAnswer: "`override` same virtual slot replace karta hai aur runtime (actual object) type se resolve hota hai. `new` ek naya, unrelated method banata hai jo compile-time (declared reference) type se resolve hota hai.",
    detailedAnswer:
      "Overriding ek existing virtual method ki implementation change karta hai — CLR runtime pe actual object ka type dekh kar sahi version chalata hai (method table lookup). Hiding (`new`) ek completely alag method create karta hai jo sirf naam se base method jaisa dikhta hai, koi virtual relationship nahi — resolution poori tarah compile-time pe reference ke declared type se hoti hai, static binding ki tarah.",
    followUp: "Code likh kar dikhao jahan ye difference actually observable ho.",
  },
  {
    id: "hiding-vs-overriding-tr-2",
    question: "Ye code kya print karega, aur explain karo kyun?\n```csharp\npublic class Animal\n{\n    public string Describe() => \"I am an Animal\";\n    public virtual string Speak() => \"...\";\n}\npublic class Dog : Animal\n{\n    public new string Describe() => \"I am a Dog\";\n    public override string Speak() => \"Woof!\";\n}\n\nAnimal a = new Dog();\nConsole.WriteLine(a.Describe());\nConsole.WriteLine(a.Speak());\n```",
    type: "code-output",
    difficulty: "advanced",
    askedAt: ["Amazon", "Microsoft"],
    shortAnswer: "\"I am an Animal\" phir \"Woof!\" — Describe() hidden hai (declared type Animal se resolve), Speak() overridden hai (actual type Dog se resolve).",
    detailedAnswer:
      "`a` ka declared (compile-time) type Animal hai, actual (runtime) type Dog hai. `Describe()` `new` se hidden hai — resolution declared type (Animal) se hoti hai, isliye Animal.Describe() -> \"I am an Animal\". `Speak()` `override` se overridden hai — resolution actual runtime type (Dog) se hoti hai, isliye Dog.Speak() -> \"Woof!\". Yehi THE classic trap hai — same object, same reference, do methods, do alag resolution rules, do alag results.",
    followUp: "Agar `Dog d = new Dog();` likh ke same do calls karo, kya output badlega?",
  },
  {
    id: "hiding-vs-overriding-tr-3",
    question: "`Dog d = new Dog(); d.Describe();` kya return karega, upar wale hi Animal/Dog example me?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"I am a Dog\" — ab reference ka declared type khud Dog hai, isliye Dog.Describe() (hidden version) resolve hota hai.",
    detailedAnswer:
      "Hiding resolution declared type follow karta hai. Jab `d` ki declared type Dog hai (na ki Animal), `d.Describe()` Dog.Describe() resolve karta hai — 'I am a Dog'. Ye pehle example (`Animal a = new Dog(); a.Describe()`) se contrast karta hai, jahan same underlying object hone ke bawajood declared type Animal hone ki wajah se Animal.Describe() chala tha. Isi se pata chalta hai hiding purely reference type pe depend karti hai, object pe nahi.",
  },
  {
    id: "hiding-vs-overriding-tr-4",
    question: "C# compiler ko kaise pata chalta hai ki developer ne accidentally method hide kar di, aur wo kya karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Agar derived class me same-signature method bina `new` ya `override` ke likha jaaye jo base ke ek non-virtual (ya virtual bina override ke) member se clash kare, compiler CS0108 warning deta hai.",
    detailedAnswer:
      "Warning ka exact text hota hai: \"'Derived.Method()' hides inherited member 'Base.Method()'. Use the new keyword if hiding was intended.\" Ye warning compile fail nahi karti (code chal jaata hai) lekin explicitly batati hai ki implicit hiding ho rahi hai. Best practice: agar hiding genuinely intended hai to `new` add karo (documentation ke roop me bhi), warna `override` use karo (agar base virtual hai) ya method ka naam hi change kar do.",
    followUp: "Agar tum is warning ko consistently ignore karte ho, kya risk build up ho sakta hai?",
  },
  {
    id: "hiding-vs-overriding-tr-5",
    question: "Tumhari team ek NuGet package upgrade karti hai, aur upgrade ke baad ek base class me ek naya (non-virtual) method add ho jaata hai jiska naam accidentally tumhari derived class ke existing method se match kar jaata hai. Kya hoga, aur ye kaise pakdoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Tumhara method ab silently base wale ko hide karega (compiler warning ke saath, agar tum warnings dekh rahe ho). Agar koi code base-typed reference se polymorphically call kar raha tha, uska behavior change ho sakta hai.",
    detailedAnswer:
      "Ye ek genuinely real, hua-hai-production-me scenario hai — library upgrade ke baad naming clash create ho jaata hai jo tumhare control me nahi tha. C# compiler CS0108 warning dega us derived method pe. Agar CI pipeline warnings ko fail-fast treat karta hai (jaise `TreatWarningsAsErrors`), ye build-time pe hi pakda jaayega. Agar nahi, ye silently compile ho jaata hai, aur sirf tab surface hota hai jab koi base-typed reference se call karta hai aur unexpected (hidden) behavior milta hai. Isi wajah se compiler warnings ko seriously lena, especially inheritance-heavy codebases me, zaroori hai.",
    redFlag: "Ye maan lena ki 'agar compile ho gaya, to sab sahi hai' — warnings ko systematically ignore karna is exact bug class ko production tak pahunchne deta hai.",
  },
  {
    id: "hiding-vs-overriding-tr-6",
    question: "Kya method hiding kabhi intentionally, legitimately use ki jaati hai, ya ye hamesha ek mistake hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Rare, legitimate use cases hain — jaise covariant return type dena (derived method ek zyada specific type return kare) — lekin default assumption hamesha `override` honi chahiye jab dono option available ho.",
    detailedAnswer:
      "Ek legitimate case: base method `object GetValue()` return karta hai, derived class chahti hai `string GetValue()` return kare (zyada specific type) — chunki return type change karne se `override` use nahi ho sakta (signature match nahi karega poori tarah), `new` yahan ek valid (though niche) tool ban jaata hai. Lekin ye exception hai, rule nahi — 99% cases me agar `virtual`/`override` available hai, wahi sahi choice hai. Blanket 'hiding hamesha galat hai' bolna bhi thoda oversimplified hai, lekin practically almost hamesha `override` prefer karna chahiye.",
    redFlag: "Extreme positions dono galat hain — 'hiding kabhi use hi nahi karni chahiye' utna hi incomplete hai jitna 'hiding aur overriding same hain.'",
  },
  {
    id: "hiding-vs-overriding-tr-7",
    question: "Agar `Animal` class me `Speak()` `virtual` NAHI hai, aur `Dog` me `public override string Speak()` likhne ki koshish karo, kya hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — `override` sirf ek virtual, abstract, ya already-overridden base member ke against valid hai. Non-virtual member ko override nahi kar sakte.",
    detailedAnswer:
      "`override` keyword C# ko batata hai 'main is EXISTING virtual slot ko replace kar raha hoon' — agar base method virtual/abstract hai hi nahi, koi slot exist nahi karta jise override kiya ja sake. Compiler error dega: \"'Dog.Speak()': cannot override inherited member 'Animal.Speak()' because it is not marked virtual, abstract, or override.\" Fix: ya to base method ko `virtual` banao, ya derived me `new` use karo (agar hiding hi intended hai).",
  },
  {
    id: "hiding-vs-overriding-tr-8",
    question: "Ek `SecurityAuditLogger : BaseAuditLogger` class hai jisme `Log()` accidentally `new` se hidden hai (chahiye tha `override`). Isko fix kaise karoge, aur fix karne ke baad behavior kaise change hoga?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer: "Base class me `Log()` ko `virtual` banao (agar pehle se nahi hai), phir derived class me `new` ki jagah `override` use karo. Fix ke baad, base-typed reference se call karne par bhi hamesha SecurityAuditLogger ka version chalega.",
    detailedAnswer:
      "```csharp\n// Before (buggy — hiding):\npublic class BaseAuditLogger\n{\n    public void Log(string message) => Console.WriteLine($\"[AUDIT] {message}\");\n}\npublic class SecurityAuditLogger : BaseAuditLogger\n{\n    public new void Log(string message) => Console.WriteLine($\"[SECURITY-AUDIT] {message}\");\n}\n\n// After (fixed — overriding):\npublic class BaseAuditLogger\n{\n    public virtual void Log(string message) => Console.WriteLine($\"[AUDIT] {message}\");\n}\npublic class SecurityAuditLogger : BaseAuditLogger\n{\n    public override void Log(string message) => Console.WriteLine($\"[SECURITY-AUDIT] {message}\");\n}\n```\nFix se pehle, `BaseAuditLogger logger = new SecurityAuditLogger(); logger.Log(\"x\");` galat format print karta tha (`[AUDIT]`). Fix ke baad, wahi call sahi (`[SECURITY-AUDIT]`) print karta hai — kyunki ab resolution runtime (actual) type se hoti hai, declared type se nahi.",
  },
];

export default questions;
