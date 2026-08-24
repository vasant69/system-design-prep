import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "system-object-tr-1",
    question: "System.Object se har C# type ko kaunse methods inherit hote hain?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "ToString(), Equals(object), GetHashCode(), aur GetType() — pehle teen virtual hain, GetType() nahi.",
    detailedAnswer:
      "Har C# type — class ho ya struct — implicitly System.Object se derive karta hai. Isse 4 methods milte hain: ToString() (readable string representation), Equals(object) (equality check), GetHashCode() (hashing collections ke liye), aur GetType() (runtime type info, sealed). Pehle teen override kiye ja sakte hain kyunki virtual hain, GetType() nahi kyunki wo deliberately sealed hai.",
    followUp: "GetType() ko sealed kyun rakha gaya hai, virtual kyun nahi?",
  },
  {
    id: "system-object-tr-2",
    question: "GetType() virtual kyun nahi hai, jabki baaki teen methods hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Taaki runtime type identity ek reliable guarantee rahe — agar override ho sakta, koi derived class jhoothi type-info de sakti thi.",
    detailedAnswer:
      "GetType() ka poora purpose hai actual runtime type reliably return karna — reflection, type-checking, aur serialization jaisi cheezein isi guarantee pe depend karti hain. Agar ye virtual hota, ek malicious ya buggy derived class isko override karke galat type-info return kar sakti thi, jo poore type-system ki reliability ko todta. Isliye .NET design me ye deliberately sealed rakha gaya.",
  },
  {
    id: "system-object-tr-3",
    question: "Ye code kya print karega?\n```csharp\nclass Point { public int X, Y; }\nvar p1 = new Point { X = 1, Y = 2 };\nvar p2 = new Point { X = 1, Y = 2 };\nConsole.WriteLine(p1.Equals(p2));\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "False — class ka default Equals() reference equality karta hai, aur p1/p2 alag heap objects hain.",
    detailedAnswer:
      "`Point` ek class hai (reference type), aur `Equals()` override nahi kiya gaya. Default `Equals()` reference equality karta hai — sirf tab True dega jab dono variables same heap object point karein. `p1` aur `p2` do alag `new` calls se bane hain, isliye alag objects hain, chahe field values identical hon. Isliye output `False` hai.",
    followUp: "Agar Point struct hota to output kya hota?",
  },
  {
    id: "system-object-tr-4",
    question: "Same code agar `Point` ek struct hota, output kya hota, aur kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "True — struct ka default Equals() reflection-based field-by-field comparison karta hai.",
    detailedAnswer:
      "Struct (value type) ka default `Equals()` `System.ValueType` se inherit hota hai, jo reflection use karke har field ko compare karta hai. `p1` aur `p2` ke saare fields (X aur Y) same hain, isliye `Equals()` True return karega — chahe ye do independent value-type instances hon, memory me alag jagah stored. Ye class ke default behavior se fundamentally different mechanism hai.",
  },
  {
    id: "system-object-tr-5",
    question: "ToString() override karna kab worth hai, aur kab nahi?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "Jab bhi type ka meaningful, human-readable output chahiye — logging, debugging, console display. Purely internal/short-lived helper types ke liye zaroori nahi.",
    detailedAnswer:
      "Domain models, DTOs, ya koi bhi type jo logs, exceptions, ya UI me display hoti hai, unke liye ToString() override karna low-risk, high-value hai — default fully-qualified type name se kahin zyada useful hota hai. Purely internal implementation-detail types (jinka string representation kabhi observe nahi hoga) ke liye ye zaroori nahi, lekin harm bhi nahi karta.",
  },
  {
    id: "system-object-tr-6",
    question: "Kya `Equals()` override karke `GetHashCode()` ko ignore karna safe hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — dono ka contract saath maintain karna zaroori hai, warna Dictionary/HashSet silently break ho sakte hain.",
    detailedAnswer:
      "Agar `Equals()` custom logic ke saath override kiya jaaye lekin `GetHashCode()` default (identity-based) reh jaaye, to logically-equal objects alag hash codes de sakte hain — ye Dictionary/HashSet ke internal bucket-lookup ko silently todta hai, exception nahi deta, bas galat results deta hai. Ye poora contract aur uske consequences dedicated depth ke saath cross-linked prerequisite topic me cover hote hain.",
    redFlag: "'Sirf Equals override kar diya, kaam ho gaya' bol dena — ye batata hai candidate ko Equals/GetHashCode contract ka pata nahi.",
  },
  {
    id: "system-object-tr-7",
    question: "Ek `object`-typed variable ke actual concrete runtime type ko kaise pata karoge?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`.GetType()` call karo instance pe — hamesha actual runtime type return karta hai, declared type nahi.",
    detailedAnswer:
      "Chahe variable ka static/declared type `object` ho, `.GetType()` hamesha actual, concrete runtime type deta hai — kyunki ye har object ke saath internally stored 'type handle' se read karta hai, static type info se nahi. Ye `typeof(SomeType)` (compile-time construct) se contrast karta hai, jo alag topic (is/as/typeof conversions) me cover hota hai.",
  },
];

export default questions;
