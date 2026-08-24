import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "local-fn-tr-1",
    question: "Local function kya hai, aur ye lambda se kaise different hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Method inside a method, only callable within it — lambda ek delegate value hai jo pass ho sakti hai; local function nahi, bina wrapping ke.",
    detailedAnswer:
      "Local function (C# 7) ek regular method jaisi syntax use karti hai lekin kisi doosre method ke andar defined hoti hai — sirf us enclosing method ke andar callable hai. Lambda ek anonymous function EXPRESSION hai jo ek delegate (`Func`/`Action`) value ban jaati hai — kahin bhi value ki tarah pass ho sakti hai. Local function ko delegate ki tarah pass karne ke liye explicit wrapping chahiye, lambda already delegate-compatible hai.",
    followUp: "Agar local function koi outer variable capture kare, kya hoga performance-wise?",
  },
  {
    id: "local-fn-tr-2",
    question: "Local functions recursion ke liye kyun natural fit hain, lambda ke against?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Local function directly apna naam use kar sakti hai recursive call ke liye; lambda ko pehle null-initialize karna padta hai apne aap ko reference karne ke liye.",
    detailedAnswer:
      "```csharp\nint Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1); // local function — clean\n\nFunc<int, int> factorial = null;\nfactorial = n => n <= 1 ? 1 : n * factorial(n - 1); // lambda — needs null-init trick\n```\nLambda recursion me self-reference karne ke liye variable ko pehle declare karna padta hai (aksar `null` se), phir assign karna padta hai — ye ek awkward pattern hai. Local function directly apna naam use kar sakti hai, jaisa ek normal named method karti hai — syntactically cleaner.",
  },
  {
    id: "local-fn-tr-3",
    question: "Expression-bodied constructor kaise likha jaata hai? Ek example do.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`public Point(int x, int y) => (X, Y) = (x, y);` — tuple deconstruction assignment ke saath, C# 7.",
    detailedAnswer:
      "```csharp\npublic class Point\n{\n    public int X { get; }\n    public int Y { get; }\n    public Point(int x, int y) => (X, Y) = (x, y);\n}\n```\nYe (C# 7+) tuple-deconstruction-assignment ke saath expression-bodied constructor syntax hai — `(X, Y) = (x, y)` ek single expression hai jo dono properties ek saath assign kar deta hai. Block-body equivalent: `{ X = x; Y = y; }` — same IL, sirf syntax difference.",
  },
  {
    id: "local-fn-tr-4",
    question: "Ek scenario batao jahan local function use karna genuinely lambda se better choice hai performance ke liye.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ek hot-path recursive helper jo koi outer variable capture nahi karti — local function no-allocation reh sakti hai, equivalent capturing lambda closure allocate karegi.",
    detailedAnswer:
      "Maan lo ek `IsPrime(int n)` helper hai jo sirf apne parameter pe depend karti hai, koi outer variable use nahi karti, aur ek hot-loop me bar-bar call hoti hai. Agar ise local function ki tarah likha jaaye, compiler koi closure object allocate nahi karta (koi capture nahi hai). Agar isi logic ko ek lambda (`Func<int,bool> isPrime = n => ...;`) ki tarah likha jaaye jo kisi outer variable ko bhi capture kare (jaise ek cache dictionary), compiler ek closure class heap pe allocate karega — jo GC pressure add karta hai hot-path me. No-capture local function is overhead se bachti hai.",
  },
  {
    id: "local-fn-tr-5",
    question: "Kya expression-bodied properties ke saath side-effects (jaise logging) rakhna sahi practice hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Generally nahi — property getters se side-effect-free, fast, predictable behavior expect kiya jaata hai; expression-bodied ya block-bodied, dono me ye convention hold karta hai.",
    detailedAnswer:
      "`public string FullName => LogAccess() ?? $\"{FirstName} {LastName}\";` jaisa code technically compile hota hai, lekin property getters se caller expect karta hai ki wo lightweight, side-effect-free, aur idempotent honge (multiple baar call karna safe ho) — .NET design guidelines explicitly ye convention document karti hain. Expression-bodied syntax khud is convention ko encourage karta hai (chhota, simple expression), lekin agar developer force-fit kare complex/side-effecting logic ko, wo convention violate ho jaata hai, syntax chahe jo bhi ho.",
    redFlag: "Property getter me database call, file I/O, ya mutation jaisa heavy/side-effecting kaam karna, expression-bodied ho ya na ho.",
  },
  {
    id: "local-fn-tr-6",
    question: "Local functions kis C# version me aaye, aur expression-bodied members kis version me?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Local functions — C# 7.0 (2017). Expression-bodied methods/properties — C# 6.0 (2015); constructors/finalizers/accessors — C# 7.0.",
    detailedAnswer:
      "Expression-bodied members ne shuruaat C# 6.0 (2015) me ki, sirf methods aur read-only properties ke liye. C# 7.0 (2017) ne coverage badhaya — constructors, finalizers, aur get/set accessors bhi expression-bodied ho sakte hain. Local functions bhi C# 7.0 me hi introduce hue — dono features roughly saath-saath aaye is version me, C# ko concise aur locally-scoped code likhne ki taraf push karte hue.",
  },
  {
    id: "local-fn-tr-7",
    question: "Ek argument-validation + recursive-computation pattern likho jo local function use kare taaki validation sirf ek baar ho, recursion clean rahe.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Outer method me validation karo, phir kaam ek local function ko delegate karo jo recursively call hoti rahe bina baar-baar validate kiye.",
    detailedAnswer:
      "```csharp\npublic long Fibonacci(int n)\n{\n    if (n < 0) throw new ArgumentException(\"n must be non-negative\", nameof(n));\n\n    return Calculate(n);\n\n    long Calculate(int x) // local function, no re-validation on each recursive call\n    {\n        return x <= 1 ? x : Calculate(x - 1) + Calculate(x - 2);\n    }\n}\n```\nYe pattern common hai — outer public method ek baar input validate karta hai, phir actual recursive logic ek local function me hoti hai jo baar-baar validation check nahi karti (kyunki input already validated hai outer scope me).",
  },
  {
    id: "local-fn-tr-8",
    question: "Kya local function ko `static` mark kiya ja sakta hai? Iska kya benefit hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Haan, C# 8 se `static` local function allowed hai — compiler-enforced guarantee ki wo koi outer variable capture nahi karegi.",
    detailedAnswer:
      "`static` local functions (C# 8.0) explicitly disallow karte hain outer scope ke kisi bhi instance member ya local variable ko capture karna — agar koi capture attempt ho, compile error aata hai. Ye ek intentional guarantee dene ka tarika hai ki ye function genuinely closure-free/allocation-free rahegi, aur accidental capture (jo silently performance degrade kar sakta hai) compile-time pe hi catch ho jaata hai.",
  },
];

export default questions;
