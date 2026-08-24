import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "conversion-tr-1",
    question: "Implicit aur explicit conversion me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer: "Implicit: automatic, sirf tab allowed jab no data loss guaranteed ho. Explicit: manually likhna padta hai, data loss ya failure possible.",
    detailedAnswer:
      "Implicit conversion compiler khud kar deta hai bina kisi syntax ke, jab source type destination type me bina data loss ke fit ho sakta hai (jaise int se long). Explicit conversion (cast, `(Type)value`) tumhe manually likhna padta hai jab conversion lossy ho sakti hai (double se int, precision loss) ya fail ho sakti hai (base reference ko wrong derived type me cast karna, InvalidCastException).",
    followUp: "as operator direct cast se kaise different hai?",
  },
  {
    id: "conversion-tr-2",
    question: "as operator aur direct cast me kya fark hai, kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "as failure pe null return karta hai (sirf reference types), direct cast InvalidCastException throw karta hai.",
    detailedAnswer:
      "`as` operator tab use karo jab cast failure ek normal, expected case hai — ye null return karta hai instead of throwing, jise tum gracefully null-check kar sakte ho. Direct cast `(Type)value` tab use karo jab tum confident ho type sahi hoga, aur agar galat ho to ye genuinely ek bug hai jo turant exception ke through surface honi chahiye. `as` sirf reference types aur Nullable<T> ke saath compile hota hai.",
  },
  {
    id: "conversion-tr-3",
    question: "typeof() aur GetType() me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "typeof compile-time hai, type name se directly resolve hota hai. GetType() runtime hai, ek instance ka actual concrete type deta hai.",
    detailedAnswer:
      "`typeof(Person)` compile-time operator hai — koi instance ki zaroorat nahi, seedha type name se Type object milta hai, generic types ke saath bhi (`typeof(List<int>)`). `obj.GetType()` runtime call hai — ek actual object instance chahiye, aur ye hamesha us instance ka concrete, actual runtime type return karta hai, chahe declared/static type kuch aur ho (jaise `object`-typed variable jo actually `Person` hai).",
    followUp: "Do alag typeof(Person) calls same Type object return karenge kya?",
  },
  {
    id: "conversion-tr-4",
    question: "Ye code kya karega?\n```csharp\nobject obj = \"hello\";\nint x = (int)obj;\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Runtime InvalidCastException — obj actually string hai, int nahi.",
    detailedAnswer:
      "`obj` ka declared type `object` hai lekin actual runtime type `string` hai. `(int)obj` ek direct cast hai jo runtime pe check karta hai ki actual object `int`-compatible hai ya nahi — nahi hai, isliye ye `InvalidCastException` throw karta hai. Ye compile-time error nahi hai kyunki compiler ko pata nahi ki `object` ke andar actually kya type hai — sirf runtime pe pata chalta hai.",
  },
  {
    id: "conversion-tr-5",
    question: "Ek external API se aaya JSON data ko ek base-class collection me deserialize kiya gaya hai, aur ab tumhe specific derived types ke properties access karni hain. Ye kaise handle karoge safely?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`is` pattern matching (ya `as` + null check) use karo, direct cast avoid karo — kyunki data source ke hisaab se type mismatch ek expected/possible case hai.",
    detailedAnswer:
      "External/untrusted data ke saath, type mismatch ek normal scenario hai (naya derived type add hua ho, ya malformed data ho), exceptional bug nahi. Isliye `if (item is DerivedType dt) { ... }` pattern matching (ya `as` + null check) use karna chahiye — ye gracefully un-matching items ko skip/handle karne deta hai bina exception throw kiye, jabki direct cast crash kar dega.",
  },
  {
    id: "conversion-tr-6",
    question: "Kya `as` operator plain `int` ke saath use ho sakta hai (`5 as int`)?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — compile error, kyunki `as` sirf reference types aur Nullable<T> ke saath kaam karta hai.",
    detailedAnswer:
      "`as` operator ka core semantic hai 'failure pe null return karo.' Plain value types (jaise `int`, non-nullable struct) kabhi null nahi ho sakte, isliye `as` unke saath meaningless hai aur compiler compile-time error deta hai. `int?` (Nullable<int>) ke saath `as` kaam karta hai, kyunki wo null represent kar sakta hai.",
    redFlag: "Ye maan lena ki `as` har type ke saath kaam karta hai — value type restriction bhool jaana ek common gap hai.",
  },
  {
    id: "conversion-tr-7",
    question: "`if (obj is string) { var s = (string)obj; ... }` aur `if (obj is string s) { ... }` — dono functionally equivalent hain, to farak kya hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Dusra (pattern-matching) version concise hai aur ek hi type check double compute nahi karta — modern, preferred style.",
    detailedAnswer:
      "Pehla approach do separate operations karta hai: `is` se check, phir alag se cast — thoda verbose, aur agar refactor karte waqt type change ho, dono jagah update karna padta hai. Doosra approach (C# 7+ pattern matching) check aur cast ek hi expression me karta hai, `s` ko directly usable variable ke roop me deta hai — cleaner aur less error-prone. Behavior functionally same hai, style/safety preference dusre ke favor me hai.",
  },
  {
    id: "conversion-tr-8",
    question: "Ek switch expression me multiple type patterns combine karke likhna ho (jaise 'ya to string ho ya int ho'), is/as se kaise achieve karoge?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Switch expression ke andar multiple `is`-style type patterns ek saath likhe ja sakte hain, `or` pattern combinator ke saath.",
    detailedAnswer:
      "C# 9+ pattern matching switch expressions me `is`-style type patterns ko `or` se combine kiya ja sakta hai: `var result = obj switch { string or int => \"primitive-ish\", _ => \"other\" };` — ye internally wahi type-check mechanism use karta hai jo `is` operator karta hai, bas ek declarative, multi-branch syntax me. Ye is topic ka natural extension hai jo control-flow-and-pattern-matching topic me full depth ke saath cover hota hai.",
  },
];

export default questions;
