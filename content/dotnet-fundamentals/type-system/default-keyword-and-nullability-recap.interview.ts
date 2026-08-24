import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "default-keyword-tr-1",
    question: "default(T) kya karta hai, aur type-category ke hisaab se result kaise differ karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Type ki default value return karta hai — numeric ke liye 0, bool ke liye false, reference type ke liye null, struct ke liye saare fields zeroed instance.",
    detailedAnswer:
      "`default(T)` (ya sirf `default` jab compiler infer kar sake) us type ki 'no explicit initialization' value deta hai. Numeric types (int, double) ke liye ye zero hai, bool ke liye false, char ke liye null character, reference types (class, string) ke liye null, aur struct ke liye ek instance jiske saare fields recursively apni default value pe hon.",
    followUp: "Generic code me default(T) kyun specifically zaroori hota hai?",
  },
  {
    id: "default-keyword-tr-2",
    question: "Generic method ke andar default(T) kyun zaroori hai — 0 ya null seedha kyun nahi likh sakte?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki T ka actual type compile-time pe pata nahi hota jab method likha ja raha hai — 0/null sirf specific type-categories ke liye valid hain, default(T) sabke liye generically kaam karta hai.",
    detailedAnswer:
      "Ek generic method likhte waqt, `T` ek placeholder hai jo koi bhi type ban sakta hai jab actually call ho. `0` sirf numeric types ke liye syntactically valid hai, `null` sirf reference/nullable types ke liye. `default(T)` compiler-level construct hai jo runtime pe resolve hone wale actual `T` ke liye sahi default value deta hai, chahe wo kuch bhi ho — isliye generic collections/utilities me heavily use hota hai.",
  },
  {
    id: "default-keyword-tr-3",
    question: "Ye code kya output dega?\n```csharp\nstruct Coordinates { public double Lat, Lng; }\nvar c = default(Coordinates);\nConsole.WriteLine($\"{c.Lat}, {c.Lng}\");\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"0, 0\" — struct ka default instance hai jiske double fields apni default value (0) pe set hain.",
    detailedAnswer:
      "`Coordinates` ek struct hai, kabhi null nahi ho sakta. `default(Coordinates)` ek valid instance return karta hai jiske dono fields (`Lat`, `Lng`, dono `double`) apni type ki default value (0) pe set hain. Isliye output \"0, 0\" hoga, exception ya null reference nahi.",
  },
  {
    id: "default-keyword-tr-4",
    question: "Ek generic cache helper T GetOrDefault<T>(string key) cache-miss pe default(T) return karta hai. Agar T = int hai, iska koi business-logic risk hai kya?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Haan — 'cache miss' aur 'genuine value 0' dono same default(int) = 0 dete hain, jo distinguish nahi ho pate, ek real ambiguity bug.",
    detailedAnswer:
      "Agar `T` `int` hai aur cache-miss `default(int)` (0) return karta hai, caller ye distinguish nahi kar sakta ki 'data nahi mila' vs 'genuinely stored value 0 thi.' Ye ek real production bug-source hai jab 0 ek meaningful business value ho sakti hai (jaise score ya balance). Fix: return type `int?` banao, taaki cache-miss `default(int?)` = `null` de, jo genuinely-zero se clearly distinguishable hai.",
    redFlag: "Cache-miss handling ke liye default(T) ka use bina consider kiye ki T's default value genuinely valid business data se collide kar sakti hai.",
  },
  {
    id: "default-keyword-tr-5",
    question: "default(int?) aur default(int) me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "default(int) = 0. default(int?) = null (HasValue false), kyunki Nullable<int> khud struct hai jiska default state 'no value' hota hai.",
    detailedAnswer:
      "`int` plain value type hai, uski default value `0` hai. `int?` (`Nullable<int>`) khud technically ek struct hai, lekin uska semantic default 'no value' hai — internally `HasValue = false`. Isliye `default(int?)` `null` deta hai, `0` nahi — ye reflects karta hai nullable value types ka poora purpose: missing-value state ko genuinely represent karna, `0` se confuse kiye bina.",
  },
  {
    id: "default-keyword-tr-6",
    question: "default literal (bina explicit type ke, jaise int x = default;) kab se available hai, aur ye kaise resolve hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "C# 7.1 se — compiler assignment/parameter context se type infer kar leta hai, `default(T)` explicit likhne ki zaroorat nahi.",
    detailedAnswer:
      "C# 7.1 ne `default` literal introduce kiya jo `default(T)` ka shorthand hai jab compiler surrounding context (jaise variable declaration ka type, ya method parameter ka declared type) se `T` infer kar sake. Ye verbosity kam karta hai, especially long/generic type names ke saath, lekin functionally identical hai `default(T)` ke.",
  },
  {
    id: "default-keyword-tr-7",
    question: "Ek array `int[] arr = new int[5];` create karne ke baad, uske elements ki initial value kya hogi?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Har element `0` hoga — array creation implicitly har slot ko uske element type ki default value se initialize karta hai.",
    detailedAnswer:
      ".NET me arrays creation ke time automatically zero-initialized hote hain — har element apni type ki `default` value pe set hoti hai. `int[]` ke liye ye `0` hai, `string[]` ke liye ye `null` hota, `bool[]` ke liye `false`. Ye behavior CLR-level guarantee hai, developer ko explicitly loop chala ke initialize karne ki zaroorat nahi.",
  },
  {
    id: "default-keyword-tr-8",
    question: "Kya `default(SomeInterfaceType)` kabhi ek non-null value de sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — interface hamesha ek reference type hai (chahe implementing type struct ho), isliye `default(SomeInterface)` hamesha `null` dega.",
    detailedAnswer:
      "Interfaces khud reference types hain C# me — chahe koi struct us interface ko implement kare, `default(IInterfaceType)` ka default value hamesha `null` hoga, kyunki `T` yahan `IInterfaceType` hai, us struct ka concrete type nahi. Ye difference tab matter karta hai jab generic constraints me `T : IInterfaceType` ho — `default(T)` ka behavior depend karega ki `T` genuinely kya resolve hota hai runtime pe, interface-typed reference nahi.",
    redFlag: "Interface aur uski implementing struct ke default() behavior ko confuse karna — interface hamesha reference-type default (null) deta hai.",
  },
];

export default questions;
