import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "anon-tuple-tr-1",
    question: "Anonymous type kya hai, aur iska sabse common real-world use-case kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Compiler-generated, read-only, scoped type — sabse common use-case LINQ projections hai jab existing object ka sirf subset chahiye.",
    detailedAnswer:
      "`new { Name = \"Asha\", Age = 28 }` compiler ko batata hai ek naya, unnamed class generate karo jiske properties read-only hon. Ye sabse zyada LINQ `.Select()` projections me use hota hai — jab tumhe ek `Order` object ka sirf `Id` aur `TotalAmount` chahiye, poora object nahi, anonymous type ek lightweight shape deta hai bina naya named class define kiye.",
    followUp: "Anonymous type ko method se return kar sakte ho kya?",
  },
  {
    id: "anon-tuple-tr-2",
    question: "Kya anonymous type ko ek method se strongly-typed return value ke roop me return kiya ja sakta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Effectively nahi — anonymous type ka koi naam hi nahi hai jo method signature me likha ja sake, sirf object/dynamic ke roop me return kiya ja sakta hai jo purpose defeat karta hai.",
    detailedAnswer:
      "Anonymous type compiler-generated hai, uska koi accessible type name nahi hota jo tum method return type me likh sako. Tum isse `object` ya `dynamic` return type ke roop me return kar sakte ho, lekin tab caller ko strongly-typed access nahi milta (dynamic ka use karna padega, jo runtime resolution overhead aur compile-time safety loss dono laata hai). Isliye method boundaries cross karne wale data ke liye ValueTuple ya proper record use karna better hai.",
    redFlag: "'Anonymous type ko return kar sakte hain normally' bol dena bina caveat ke — ye batata hai type ka scope-limitation nahi samjha gaya.",
  },
  {
    id: "anon-tuple-tr-3",
    question: "Tuple<T1,T2> (class) aur ValueTuple me performance perspective se kya difference hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Tuple har baar heap allocate karta hai (reference type). ValueTuple struct hai, koi extra heap allocation nahi (jab tak boxed na ho).",
    detailedAnswer:
      "`Tuple<T1,T2>` ek class hai, isliye `Tuple.Create(1, \"Asha\")` har call pe heap pe allocate hota hai — GC pressure add karta hai agar hot path/loop me repeatedly use ho. `ValueTuple` ek struct hai, stack pe (ya containing structure ke andar) directly store hota hai, koi separate heap allocation nahi — hot paths me significantly cheaper.",
  },
  {
    id: "anon-tuple-tr-4",
    question: "Ye code kya print karega?\n```csharp\n(int min, int max) GetRange(int[] nums) => (nums.Min(), nums.Max());\nvar (lo, hi) = GetRange(new[] { 5, 2, 9, 1 });\nConsole.WriteLine($\"{lo}-{hi}\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"1-9\" — deconstruction lo aur hi ko respectively min aur max se assign karta hai.",
    detailedAnswer:
      "`GetRange` ek named ValueTuple `(int min, int max)` return karta hai jiski values array ka minimum (1) aur maximum (9) hain. `var (lo, hi) = ...` deconstruction syntax hai jo tuple ke elements ko naye local variables me unpack karta hai positionally — `lo` ko min (1) milta hai, `hi` ko max (9). Output: \"1-9\".",
  },
  {
    id: "anon-tuple-tr-5",
    question: "Ek public library method multiple values return kar raha hai. ValueTuple use karna theek hai ya proper class banani chahiye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Depends — agar shape simple aur stable hai to ValueTuple chalega, lekin agar API evolve hogi (naye fields, ya semantic meaning important hai), proper record better hai.",
    detailedAnswer:
      "Public API boundaries pe ValueTuple ka risk hai: field order ya naming me consistency maintain karna consumers ke across manually karna padta hai, aur naya field add karna existing tuple shape ko break kar sakta hai (positional mismatch risk). Ek `record` self-documenting hai, compiler naming/order errors ko catch karta hai, aur naya optional field add karna backward-compatible ho sakta hai (with default values) — jo tuple ke saath possible nahi.",
  },
  {
    id: "anon-tuple-tr-6",
    question: "Kya do anonymous type instances `Equals()` se compare kiye ja sakte hain, aur kya milega agar unke same properties/values hon?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Haan — anonymous types structural (value-based) equality support karte hain, compiler auto-generated Equals/GetHashCode ke through, jaisa record karta hai.",
    detailedAnswer:
      "Compiler anonymous types ke liye `Equals()` aur `GetHashCode()` bhi auto-generate karta hai, jo property-by-property (structural) comparison karta hai — records ki tarah. Isliye `new { Name = \"A\" }.Equals(new { Name = \"A\" })` `true` dega, chahe ye do alag instances hon, agar property names/types/values match karte hon.",
  },
  {
    id: "anon-tuple-tr-7",
    question: "Tuple class ab modern C# codebases me kyun rarely dikhta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "ValueTuple (C# 7) ne isko largely obsolete kar diya — better performance (value type) aur better readability (named elements).",
    detailedAnswer:
      "`Tuple<T1,T2>` class C# 4.0 me aaya tha ek reasonable solution ke roop me, lekin do genuine limitations thi: heap allocation har baar, aur unreadable `Item1`/`Item2` naming. C# 7.0 (2017) me `ValueTuple` aane ke baad, jo dono problems solve karta hai (struct + named elements), naye code me `Tuple` class ka use largely band ho gaya — sirf legacy codebases ya bahut purane APIs ke saath interop me dikhta hai.",
  },
  {
    id: "anon-tuple-tr-8",
    question: "Ek anonymous type ko var ke bina declare karne ki koshish karoge (jaise explicit type name likh ke) — possible hai kya?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — anonymous type ka koi accessible naam hi nahi hai jo tum likh sako, isliye `var` use karna mandatory hai jab anonymous type banaya jaaye.",
    detailedAnswer:
      "Anonymous type ka naam compiler internally generate karta hai (kuch aisa jaisa `<>f__AnonymousType0`), jo source code me likhna possible nahi hai aur reliable bhi nahi (compiler-specific, version-to-version change ho sakta hai). Isliye `var` anonymous types ke saath effectively mandatory hai — ye `var` ka ek genuine, necessary use-case hai, sirf convenience nahi.",
    redFlag: "Ye sochna ki anonymous type ka bhi ek explicit type name likha ja sakta hai kahin — ye fundamental misunderstanding hai ki anonymous type 'anonymous' kyun kehlata hai.",
  },
];

export default questions;
