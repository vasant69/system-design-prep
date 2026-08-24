import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "generics-fund-tr-1",
    question: "Generics kyun introduce kiye gaye the C# me — konse do genuine problems solve karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Type safety (compile-time me galat type add karna error ban jaata hai) aur boxing overhead khatam karna (value types directly store hote hain, koi heap allocation nahi).",
    detailedAnswer:
      "Generics se pehle collections (`ArrayList`, `Hashtable`) `object` store karte the. Do problems the: (1) Type safety — kisi bhi type ko kisi bhi collection me daala ja sakta tha, mismatch runtime pe `InvalidCastException` deta tha, bahut late pakda jaata tha. (2) Boxing overhead — value types (`int`, etc.) ko `object` collection me store karne ke liye heap pe box karna padta tha, jo extra allocation aur GC pressure add karta tha. Generics dono solve karte hain — compile-time type checking, aur `List<int>` jaise specialized versions jisme value directly store hoti hai, boxing ke bina.",
    followUp: "Boxing exactly kya hota hai mechanism ke level pe?",
  },
  {
    id: "generics-fund-tr-2",
    question: "Ye code compile hoga ya error dega?\n```csharp\npublic class Cache<T> where T : class\n{\n    public T? Item;\n}\n\nvar c = new Cache<int>();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — `int` ek value type hai, `where T : class` constraint ki wajah se sirf reference types allowed hain.",
    detailedAnswer:
      "`where T : class` explicitly restrict karta hai ki `T` sirf reference types ho sakta hai (`string`, koi bhi class, interface, delegate, array). `int` ek value type (struct) hai, isliye `Cache<int>` instantiate karna compile-time error dega: 'The type int must be a reference type in order to use it as parameter T.'",
  },
  {
    id: "generics-fund-tr-3",
    question: "Ek generic `Repository<T>` banana hai jo kisi bhi entity ke liye kaam kare, aur usme `T.Id` access karna hai plus `new T()` bhi call karna hai. Konse constraints lagaoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`where T : Entity, new()` — Entity base class constraint se `Id` property guaranteed hoti hai, `new()` constraint se parameterless constructor guarantee hoti hai.",
    detailedAnswer:
      "`Id` access karne ke liye compiler ko pata hona chahiye ki `T` ke paas `Id` property hai — iske liye ek base class (jaise `Entity`, jisme `Id` defined ho) ko constraint banana hoga: `where T : Entity`. `new T()` call karne ke liye `where T : new()` bhi chahiye. Dono constraints ek saath combine ho sakte hain comma se, `new()` hamesha last position pe: `where T : Entity, new()`.",
  },
  {
    id: "generics-fund-tr-4",
    question: "Bina koi constraint lagaye, ek generic method me `T` par kaunse members call kiye ja sakte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Sirf `System.Object` ke members — `ToString()`, `Equals()`, `GetHashCode()`, `GetType()`. Kuch aur nahi, kyunki compiler ko `T` ke actual type ke baare me koi extra guarantee nahi hai.",
    detailedAnswer:
      "Bina constraint ke, compiler `T` ko sirf `object` ke roop me treat karta hai member-access ke purposes ke liye — chahe caller kisi bhi specific type ko substitute kare. Isliye sirf universally-guaranteed `object` members (`ToString`, `Equals`, `GetHashCode`, `GetType`) safely call kiye ja sakte hain. Kuch aur access karna ho — ek property, ek method, `new T()` — to us guarantee ko explicit constraint ke through provide karna padega.",
  },
  {
    id: "generics-fund-tr-5",
    question: "Kya generics sirf collections (List, Dictionary) ke liye use hote hain?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — generic methods, generic interfaces (`IComparable<T>`), aur generic delegates (`Func<T>`, `Action<T>`) sab equally common hain.",
    detailedAnswer:
      "Collections generics ka sabse visible use case hain, lekin generics ek general-purpose language feature hai. Generic methods (`T FindMax<T>(...)`), generic interfaces (`IComparable<T>`, `IEnumerable<T>`), generic delegates (`Func<T, TResult>`, `Action<T>`), aur generic classes jo collections bilkul nahi hain (jaise `Lazy<T>`, `Nullable<T>`) — sab isi mechanism ka use karte hain. 'Generics = collections' sochna ek common lekin incomplete mental model hai.",
    redFlag: "Generics ko sirf collection-specific feature ki tarah describe karna interview me — ye samajh ki depth ki kami dikhata hai.",
  },
  {
    id: "generics-fund-tr-6",
    question: "`public class Box<T> where T : IComparable<T>, new()` — is constraint list me order kyun important hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "`new()` constraint hamesha sabse last aani chahiye jab multiple constraints combine ho rahe hon — ye C# language rule hai.",
    detailedAnswer:
      "C# specification ke mutabik, jab ek type parameter ke liye multiple constraints ho (class/struct constraint, interface constraints, base class constraint, `new()`), unka order fix hai: pehle `class` ya `struct` (agar ho), phir base class, phir interfaces, aur `new()` hamesha sabse aakhri me. `where T : IComparable<T>, new()` valid hai; `where T : new(), IComparable<T>` compile error dega.",
  },
  {
    id: "generics-fund-tr-7",
    question: "Ye code kya print karega?\n```csharp\nList<int> nums = new List<int> { 3, 1, 4, 1, 5 };\nnums.Add(\"nine\");\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Compile error — `\"nine\"` ek string hai, `List<int>` sirf `int` accept karta hai.",
    detailedAnswer:
      "`List<int>` ek generic collection hai jisme type parameter `T = int` specify kiya gaya hai. `Add(\"nine\")` type-mismatch hai — compiler build-time pe hi ise pakad leta hai, koi runtime error nahi hota, code compile hi nahi hoga. Ye exactly wo type safety hai jo `ArrayList` (jo koi bhi `object` accept karta) nahi deta.",
  },
  {
    id: "generics-fund-tr-8",
    question: "Ek naya candidate kehta hai: 'Generics sirf syntax sugar hain, runtime pe koi real difference nahi hota `ArrayList` se'. Kya ye sahi hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — generics runtime pe genuine, measurable difference banate hain, especially value types ke liye (boxing completely eliminate hoti hai). Ye sirf compile-time cheez nahi hai.",
    detailedAnswer:
      "Ye ek serious misconception hai. `List<int>` runtime pe JIT ke through apna khud ka type-specialized version generate karta hai (generic type specialization) jisme `int` values directly, bina boxing ke store hoti hain — ye ek real memory-layout aur allocation-behavior difference hai, sirf compile-time type-checking ka convenience nahi. `ArrayList` me har `int` Add karna ek heap allocation (box) banata hai; `List<int>` me nahi. Isliye generics sirf 'syntax sugar' nahit hain — inka runtime performance impact genuinely measurable hai, especially high-volume numeric/value-type-heavy code me.",
    redFlag: "Generics ko 'sirf compile-time convenience' bolna bina boxing-elimination ka mention kiye — ye batata hai runtime mechanism samjha nahi gaya.",
  },
];

export default questions;
