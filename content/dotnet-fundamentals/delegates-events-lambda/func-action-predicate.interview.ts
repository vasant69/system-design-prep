import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "func-action-predicate-tr-1",
    question: "`Func`, `Action`, aur `Predicate` me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "`Func` value return karta hai, `Action` void return karta hai, `Predicate<T>` single-parameter bool-returning special case hai (Func<T, bool> jaisa).",
    detailedAnswer:
      "`Func<T1, ..., TResult>` ka last type parameter return type hota hai. `Action<T1, ...>` sab type parameters input hain, void return karta hai. `Predicate<T>` sirf ek parameter leta hai aur hamesha bool return karta hai — functionally `Func<T, bool>` ke identical hai, sirf naam alag hai aur mostly List<T>'s legacy methods me use hota hai.",
    followUp: "Ye teeno kab se available hain .NET me?",
  },
  {
    id: "func-action-predicate-tr-2",
    question: "`Func<int, string, bool>` ka signature explain karo — kaunse parameters input hain, kya return hota hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`int` aur `string` input parameters hain, `bool` return type hai — last type parameter hamesha return type hota hai.",
    detailedAnswer:
      "`Func<>` ki convention hai: sab type parameters left-to-right input parameters hain EXCEPT last wala, jo return type hai. To `Func<int, string, bool>` ek method represent karta hai jiska signature `bool Method(int x, string y)` jaisa hai.",
  },
  {
    id: "func-action-predicate-tr-3",
    question: "`Action<int>` ki jagah `Func<int, void>` kyun nahi likh sakte?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "`void` ek valid generic type argument nahi hai C# me — isliye `Func<int, void>` compile error deta hai.",
    detailedAnswer:
      "C# ka type system `void` ko generic type parameter ki jagah accept nahi karta (`void` ek 'first-class' type nahi hai is sense me). Isi limitation ki wajah se .NET team ne `Action<>` ko ek alag delegate family banaya, jisme koi return-type slot hi nahi hota — sirf input parameters. Ye teeno delegate families (`Func`, `Action`, `Predicate`) is limitation ko elegantly side-step karte hain.",
    redFlag: "`Func<T, void>` likhne ki koshish karna — ye batata hai candidate ko C# ke generic type constraints ka basic samajh nahi hai.",
  },
  {
    id: "func-action-predicate-tr-4",
    question: "LINQ ka `Where` method `Predicate<T>` kyun nahi, `Func<T, bool>` kyun accept karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Historical/design consistency — LINQ (.NET 3.5) ne consistently Func<> family use ki poori API surface me, Predicate<T> pehle se List<T> me tha aur wahin reh gaya.",
    detailedAnswer:
      "`Predicate<T>` .NET 2.0 se `List<T>` ke saath aaya (`FindAll`, `Find`, `RemoveAll`). LINQ .NET 3.5 me aaya aur design consistency ke liye har jagah `Func<>` family use ki — `Where(Func<T, bool>)`, `Select(Func<T, TResult>)`, `OrderBy(Func<T, TKey>)`. Dono functionally equivalent hote hue bhi, LINQ ne apna consistent vocabulary choose kiya rather than reusing List<T>'s older Predicate<T>.",
  },
  {
    id: "func-action-predicate-tr-5",
    question: "Ye code compile hoga?\n```csharp\nPredicate<int> isPositive = (int a, int b) => a > 0 && b > 0;\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Nahi — compile error. `Predicate<T>` sirf EK parameter leta hai, do parameters wala lambda assign nahi ho sakta.",
    detailedAnswer:
      "`Predicate<T>` ka signature `bool Predicate<T>(T obj)` hai — sirf ek parameter. Do-parameter lambda (`(a, b) => ...`) is signature ko match nahi karta, isliye compile-time type mismatch error aayega. Agar do numbers check karne hain, `Func<int, int, bool>` use karna padega.",
  },
  {
    id: "func-action-predicate-tr-6",
    question: "Kab tumhe custom delegate declare karna chahiye, `Func`/`Action` use karne ke bajaye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab ref/out parameters chahiye ho, ya jab method signature ka naam khud documentation ki tarah kaam kare (domain-specific clarity).",
    detailedAnswer:
      "`Func<>`/`Action<>` `ref`/`out` parameters support nahi karte — agar wo chahiye, custom delegate declare karna padega. Doosra genuine reason: readability. `Func<Order, Customer, decimal, bool>` se kuch samajh nahi aata; `public delegate bool DiscountEligibilityCheck(Order order, Customer customer, decimal threshold);` self-documenting hai. Business-domain-heavy signatures ke liye named delegate better API design hai.",
    followUp: "Kya delegate ke bajaye ek interface (jaise Strategy pattern) use karna better hota kabhi?",
  },
  {
    id: "func-action-predicate-tr-7",
    question: "`Action` (bina generic parameter ke, no `<>`) ka use case kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Ek parameter-less, void-returning method represent karta hai — jaise ek simple callback jo koi input nahi leta.",
    detailedAnswer:
      "`Action` (non-generic) `Action<>` family ka base/zero-parameter version hai — `void Method()` jaisa signature. Common use: `Action onComplete = () => Console.WriteLine(\"Done\");` — koi input parameter nahi, kuch return bhi nahi karta, sirf side-effect perform karta hai.",
  },
  {
    id: "func-action-predicate-tr-8",
    question: "Ek `List<Product>` me se 500 se zyada price wale products filter karne ke liye `FindAll` aur LINQ `Where` dono use ho sakte hain. Signature-wise inme kya difference hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`List<T>.FindAll` `Predicate<T>` expects karta hai, LINQ `Where` `Func<T, bool>` expects karta hai — lambda syntax identical rehta hai, sirf parameter type wrapper alag hai.",
    detailedAnswer:
      "`products.FindAll(p => p.Price > 500)` — yahan lambda `Predicate<Product>` me convert hoti hai. `products.Where(p => p.Price > 500)` — yahan wahi lambda `Func<Product, bool>` me convert hoti hai. Business logic identical, sirf underlying delegate type alag — is wajah se code migrate karna (List method se LINQ) almost always seamless hota hai.",
  },
];

export default questions;
