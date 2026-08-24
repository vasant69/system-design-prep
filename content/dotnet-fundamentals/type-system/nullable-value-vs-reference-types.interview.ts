import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nullable-tr-1",
    question: "Nullable value types aur nullable reference types me exact fark kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer:
      "Nullable value types (int?) real runtime struct hain (C# 2.0); nullable reference types (string?) sirf compile-time annotation hain (C# 8), zero runtime difference.",
    detailedAnswer:
      "`int?` asal me `Nullable<int>` hai — ek genuine struct jo `HasValue` aur `Value` track karta hai, runtime pe real behavior hai. `string?` (Nullable Reference Types, C# 8) sirf compiler ko extra information deta hai static analysis ke liye — runtime pe `string` aur `string?` ka IL bilkul same hota hai, koi wrapper nahi banta. Ek genuine runtime feature hai, doosra pure compile-time tooling hai.",
    followUp: "Agar NRT runtime pe kuch nahi karta, to iska fayda kya hai?",
  },
  {
    id: "nullable-tr-2",
    question: "`Nullable<T>.Value` ko bina check kiye access karne par kaunsa exception aata hai, aur kyun ye `NullReferenceException` nahi hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`InvalidOperationException` — kyunki value type kabhi `null` ho hi nahi sakta, ye genuinely ek 'invalid state access' hai, not a null reference.",
    detailedAnswer:
      "`NullReferenceException` tab aata hai jab ek reference (pointer) `null` ho aur usko dereference kiya jaaye. `int?` ek struct hai — kabhi `null` (in the pointer sense) hota hi nahi, wo ek valid struct instance hota hai jiska `HasValue` field `false` hai. `.Value` property internally check karti hai `HasValue`, aur agar false hai to explicitly `InvalidOperationException` throw karti hai — ye ek deliberate design hai, accidental null-dereference nahi.",
  },
  {
    id: "nullable-tr-3",
    question: "NRT (`<Nullable>enable</Nullable>`) enable karne ke baad bhi production me `NullReferenceException` aana possible hai — kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — NRT sirf warnings deta hai, enforcement nahi. `!` operator, external/legacy code, ya ignored warnings sab se NRE aa sakta hai.",
    detailedAnswer:
      "Teen common raaste: (1) Developer ne null-forgiving operator `!` use kiya bina genuinely verify kiye (`value!.Property`), jo warning suppress kar deta hai bina safety add kiye. (2) Data ek external library ya legacy `#nullable disable` code se aaya, jahan NRT track hi nahi kar raha tha. (3) CI pipeline `TreatWarningsAsErrors` nahi set kar rahi, isliye warnings visible hote hue bhi merge ho gaye. In sab cases me runtime behavior bilkul waisa hi hai jaisa NRT ke bina hota — NRT sirf compile-time signal hai, runtime guarantee nahi.",
    followUp: "Team ke liye tum kya process suggest karoge taaki NRT ka real benefit mile?",
  },
  {
    id: "nullable-tr-4",
    question: "Ye code kya print karega?\n```csharp\nint? a = null;\nint b = a ?? 10;\nConsole.WriteLine(b);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "10 — null-coalescing operator `??` `a` null hone par right-side value use karta hai.",
    detailedAnswer:
      "`??` (null-coalescing operator) left operand check karta hai — agar wo null hai (yahan `a` null hai), right operand (`10`) return karta hai. `int? a` null hone se `b` ko `10` mil jaata hai, aur `b` ek plain `int` hai (non-nullable) kyunki `??` result guaranteed non-null hai jab right side ek non-nullable literal ho.",
  },
  {
    id: "nullable-tr-5",
    question: "Ye code compile hoga ya error dega (NRT enabled maan kar)?\n```csharp\n#nullable enable\nstring? name = GetName();\nConsole.WriteLine(name.Length);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile hoga, lekin ek warning dega — `name.Length` par possible null dereference.",
    detailedAnswer:
      "`string?` matlab `name` null ho sakta hai. `name.Length` bina null check ke access karna compiler warning trigger karta hai: 'Dereference of a possibly null reference.' Ye sirf warning hai, error nahi (jab tak `TreatWarningsAsErrors` na ho) — code compile aur run dono hoga, aur agar `GetName()` genuinely null return kare, runtime pe `NullReferenceException` aayega.",
  },
  {
    id: "nullable-tr-6",
    question: "Kya ye statement sahi hai: 'NRT enable karne se hamari codebase me NullReferenceException kabhi nahi aa sakta'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — NRT sirf compile-time warnings deta hai, koi runtime guarantee nahi.",
    detailedAnswer:
      "Ye ek classic misconception hai jo interview me specifically test hoti hai. NRT feature 'on' karna sirf compiler ko extra static-analysis power deta hai — warnings dikhata hai jahan possible null-dereference ho sakta hai. Lekin: developers `!` se warnings suppress kar sakte hain, external/legacy code NRT-unaware ho sakta hai, aur agar CI warnings ko errors nahi treat karta to warnings ignored reh sakte hain. Runtime pe `string` aur `string?` identical IL hain — koi runtime check inserted nahi hota. Isliye NRE bilkul aa sakta hai, feature enabled hone ke bawajood.",
    redFlag: "'NRT enable kar diya, ab NRE nahi aayega' jaisa confident lekin galat statement bolna — ye batata hai feature ka mechanism samjha nahi gaya.",
  },
  {
    id: "nullable-tr-7",
    question: "Ek naya `DiscountPercentage` field database se aa raha hai jo genuinely `NULL` ho sakta hai (koi discount nahi hai). Is field ko C# entity class me kaise represent karoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`decimal? DiscountPercentage` — Nullable value type, kyunki 'missing value' ek genuinely valid state hai jo `0` se semantically alag hai.",
    detailedAnswer:
      "Agar `DiscountPercentage` ko plain `decimal` banaya jaaye, 'no discount' aur 'discount is exactly 0%' ko distinguish nahi kiya ja sakta — dono `0` dikhenge. `decimal?` (Nullable<decimal>) is ambiguity ko solve karta hai: `null` = 'no discount data,' `0` = 'explicitly zero discount.' Ye exact wahi problem hai jo Nullable value types solve karne ke liye design kiye gaye the — database NULL ko C# me faithfully represent karna.",
  },
  {
    id: "nullable-tr-8",
    question: "`GetValueOrDefault()` aur `??` dono `Nullable<T>` ke saath use ho sakte hain default value dene ke liye. Inme practical difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Functionally similar for a fixed default, lekin `GetValueOrDefault()` parameterless overload type ka apna default (0/false) deta hai, `??` koi bhi custom expression allow karta hai.",
    detailedAnswer:
      "`age.GetValueOrDefault()` (bina parameter) type ke default value (`int` ke liye `0`) return karta hai agar `HasValue` false ho. `age.GetValueOrDefault(18)` custom default le sakta hai. `age ?? 18` same result deta hai `??` operator ke through, aur syntactically zyada readable maana jaata hai jab right-side ek simple expression ho. Dono largely interchangeable hain simple cases me — style/readability ka choice, functional difference minimal hai.",
  },
];

export default questions;
