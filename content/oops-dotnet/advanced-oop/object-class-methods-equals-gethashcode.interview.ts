import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "equals-hashcode-tr-1",
    question: "Equals() aur GetHashCode() ka contract kya hai, aur ise violate karne se kya hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer:
      "Agar do objects Equals() se equal hain, to unka GetHashCode() bhi same hona chahiye — violate karne se Dictionary/HashSet me lookups silently fail ho sakte hain.",
    detailedAnswer:
      "Contract one-directional hai: equal objects ka hash code same hona MUST hai, lekin same hash code wale objects equal hona zaroori nahi (collision allowed hai). Dictionary/HashSet pehle GetHashCode() se bucket locate karte hain, phir us bucket ke andar Equals() se compare karte hain. Agar Equals() override kiya lekin GetHashCode() nahi (default identity-based rehta hai), to equal-by-content objects alag buckets me chale jaate hain — lookup 'not found' return karta hai chahe equal entry maujood ho. Ye exception nahi deta, isliye silently production tak pahunchta hai.",
    followUp: "Agar sirf collision ho (do unequal objects same hash code share karein), to kya problem hai?",
  },
  {
    id: "equals-hashcode-tr-2",
    question: "Equals() ko override karne ke baad `==` operator ka kya behavior hoga?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Kuch nahi badlega — == ek independent operator hai, classes ke liye default reference equality hi rehta hai jab tak explicitly operator== overload na karo.",
    detailedAnswer:
      "Equals() aur == do alag mechanisms hain jo accidentally same lagte hain kyunki value types (int, string) ke liye dono value equality dete hain. Lekin classes ke liye, Equals() override karna == ko automatically nahi badalta. `string` class iska ek exception hai — .NET team ne khud operator== ko bhi explicitly overload kiya hai string ke liye. Apni custom class me agar tum chahte ho ki == bhi value equality de, to operator== aur operator!= dono explicitly overload karne padenge, aur consistency ke liye Equals() ko hi internally call karna best practice hai.",
    redFlag: "Ye maan lena ki Equals() override karne se == automatically sync ho jaata hai — ye bahut common galti hai.",
  },
  {
    id: "equals-hashcode-tr-3",
    question: "Ye kya print karega?\n```csharp\nvar p1 = new Point(3, 4);\nvar p2 = new Point(3, 4);\nConsole.WriteLine(p1 == p2);\nConsole.WriteLine(p1.Equals(p2));\n```\n(Point ne sirf Equals() aur GetHashCode() override kiya hai, operator== nahi)",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "False phir True — == reference equality use karta hai, Equals() overridden value equality use karta hai.",
    detailedAnswer:
      "p1 aur p2 do alag instances hain, chahe unke fields same hon. `p1 == p2` == operator ka default (unoverloaded) behavior use karta hai — classes ke liye ye reference equality hai, aur p1/p2 alag memory locations hain, isliye false. `p1.Equals(p2)` overridden Equals() call karta hai jo X aur Y compare karta hai — dono same hain, isliye true. Ye exactly wahi gap hai jo == aur Equals() ke beech confusion create karta hai.",
    followUp: "Agar Point struct hota class ki jagah, to p1 == p2 ka result kya hota (assuming koi operator overload nahi)?",
  },
  {
    id: "equals-hashcode-tr-4",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic struct Coordinates\n{\n    public int Lat;\n    public int Lng;\n}\n\nvar c1 = new Coordinates { Lat = 1, Lng = 2 };\nvar c2 = new Coordinates { Lat = 1, Lng = 2 };\nConsole.WriteLine(c1 == c2);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile error — user-defined structs ko automatically == operator nahi milta, wo explicitly overload karna padta hai.",
    detailedAnswer:
      "Ye ek common misconception hai ki structs automatically value equality ke saath == support karte hain. Sirf Equals()/GetHashCode() (via System.ValueType) automatically milte hain, lekin == operator custom structs ke liye NAHI milta — CS0019 error dega: 'Operator == cannot be applied to operands of type Coordinates'. Built-in value types jaise int, double ke liye == pehle se defined hai, lekin apne khud ke struct ke liye tumhe explicitly operator== overload karna padega.",
    redFlag: "Ye bolna ki structs ko value types hone ki wajah se == 'free' me mil jaata hai — sirf built-in types ke liye sahi hai, custom structs ke liye nahi.",
  },
  {
    id: "equals-hashcode-tr-5",
    question: "Tumhare paas ek `OrderId` value object hai jo `HashSet<OrderId>` me duplicate-detection ke liye use ho raha hai. Kabhi-kabhi same OrderId dobara add ho jaata hai jab wo already set me maujood hai. Debug kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Check karo ki OrderId ne Equals() AND GetHashCode() dono correctly override kiye hain, aur uske fields immutable hain.",
    detailedAnswer:
      "Sabse pehle confirm karo Equals() override hua hai ya nahi — agar nahi, HashSet default reference equality use karega aur har naya instance 'different' treat hoga chahe same underlying value ho. Agar Equals() hai lekin GetHashCode() nahi override hua, to bhi same problem — HashSet pehle hash code se bucket check karta hai, agar hash code mismatch hai to Equals() call hi nahi hoga. Ye check karne ke baad, ye bhi verify karo ki OrderId ke fields kahin mutate to nahi ho rahe insertion ke baad — mutation se hash code badal jaata hai aur duplicate detection silently break ho jaata hai.",
    followUp: "Agar OrderId ek record hota class ki jagah, to ye poora debugging avoid ho sakta tha kya?",
  },
  {
    id: "equals-hashcode-tr-6",
    question: "Production me ek `Dictionary<CacheKey, Result>` cache hai jahan CacheKey ke fields Equals()/GetHashCode() calculation me use hote hain, aur kisi bug fix ke baad wahi fields caller code me baad me modify kiye ja rahe hain. Kya risk hai aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Cache entries 'lost' ho jaayengi — hash code insertion-time se badal chuka hai to entry apne purane bucket me hi reh jaati hai, dhoondi nahi ja sakti.",
    detailedAnswer:
      "Jab CacheKey ka field mutate hota hai insertion ke baad, GetHashCode() ka result badal jaata hai — lekin Dictionary internally us key ko uske ORIGINAL (insertion-time) hash code ke basis pe store karke rakhta hai. Naye hash code se dobara search karne pe wo bucket nahi milta jahan entry actually padi hai. Result: memory leak jaisa symptom (entry kabhi collect nahi hoti kyunki dictionary usko hold kiye hue hai) plus functional bug (cache miss har baar, chahe entry maujood ho). Fix: CacheKey ko immutable banao (readonly fields, koi setter nahi) — value objects jo hash-key ban rahe hain unke liye ye hamesha best practice honi chahiye.",
    redFlag: "Sirf 'cache clear kar do' bol dena bina root cause (mutable hash-key fields) identify kiye — symptom fix karta hai, cause nahi.",
  },
  {
    id: "equals-hashcode-tr-7",
    question: "Kya ye statement sahi hai: 'Agar do objects ka GetHashCode() same hai, to woh objects Equals() se bhi equal honge'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — same hash code hona equal hone ki guarantee nahi deta, sirf ek hash collision bhi ho sakta hai.",
    detailedAnswer:
      "Contract sirf ek direction me guaranteed hai: equal objects → same hash code. Reverse guaranteed NAHI hai — do completely unequal objects bhi accidentally same hash code produce kar sakte hain (hash collision), jo mathematically normal hai kyunki hash code space (int, ~4 billion values) input space se chhota hota hai. Isi wajah se Dictionary/HashSet bucket ke andar bhi Equals() se explicit compare karte hain, sirf hash code match pe trust nahi karte. Ye statement ulta bol raha hai contract ko.",
    redFlag: "Same hash code dekh kar directly 'equal hain' assume kar lena bina Equals() check kiye — ye khud framework bhi nahi karta, tum bhi mat karo.",
  },
  {
    id: "equals-hashcode-tr-8",
    question: "GetType() ko System.Object ke baaki teen methods (ToString, Equals, GetHashCode) se kya cheez alag banati hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "GetType() virtual nahi hai — ye override nahi kiya ja sakta, jabki baaki teeno virtual hain aur overridable hain.",
    detailedAnswer:
      "ToString(), Equals(object), aur GetHashCode() — teeno System.Object pe virtual declared hain, isliye har derived type apni custom logic de sakta hai. GetType() intentionally virtual NAHI hai — ye hamesha object ka actual runtime type return karega, is guarantee ko compromise nahi kiya ja sakta. Ye design decision isliye hai kyunki reflection, type-checking, aur runtime type identity jaisi core CLR features ko ek tamper-proof, always-accurate type lookup chahiye.",
  },
  {
    id: "equals-hashcode-tr-9",
    question: "Ek Point class ka Equals() method likho jo null aur wrong-type inputs ko sahi tarah handle kare.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "`is` pattern match use karo jo automatically null aur wrong-type dono ko false return kar deta hai.",
    detailedAnswer:
      "```csharp\npublic override bool Equals(object? obj)\n{\n    return obj is Point other && X == other.X && Y == other.Y;\n}\n```\nYe ek line teen cheezein handle karta hai: agar `obj` null hai, `is` pattern automatically false deta hai (koi NullReferenceException nahi). Agar `obj` Point type ka nahi hai, `is` phir se false deta hai. Sirf jab dono conditions pass ho (non-null AND correct type), tab `other` variable populate hota hai aur field comparison chalta hai. Ye `(Point)obj` jaisa direct cast use karne se safer hai, jo wrong type pe InvalidCastException throw karta.",
  },
  {
    id: "equals-hashcode-tr-10",
    question: "IEquatable<T> interface ka kya fayda hai jab Equals(object) already exist karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Ye typed Equals(T) deta hai jo boxing avoid karta hai — value types ke liye ek real perf optimization.",
    detailedAnswer:
      "Equals(object obj) ka parameter object type hai — agar tumhara type ek struct hai, to ise call karne ke liye value ko box karna padta hai (heap allocation). IEquatable<T>.Equals(T other) ek strongly-typed overload deta hai jo direct value comparison karta hai bina boxing ke. List<T>.Contains(), Dictionary internal lookups, aur LINQ ke kai operators IEquatable<T> ko automatically prefer karte hain agar wo implemented ho, warna Equals(object) pe fallback karte hain — extra boxing cost ke saath. Reference types ke liye fayda chhota hai, lekin structs ke liye ye measurable perf difference banata hai.",
    followUp: "Agar tumhara type record hai, to IEquatable<T> manually implement karna padta hai kya?",
  },
];

export default questions;
