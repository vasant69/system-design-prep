import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "linq-syntax-tr-1",
    question: "LINQ query syntax aur method syntax me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Functionally identical — compiler query syntax ko compile-time pe method syntax me desugar kar deta hai. Fark sirf readability ka hai.",
    detailedAnswer:
      "Query syntax (`from...where...select`) SQL jaisa dikhta hai aur compiler-level language feature hai. Method syntax (`.Where().Select()`) extension-method chaining hai. Compile-time pe query syntax exactly method-syntax calls me convert ho jaati hai, isliye runtime pe zero performance difference hai. Method syntax poora LINQ operator set expose karta hai (Count, Sum, First, Any, etc.), query syntax sirf ek subset — isliye method syntax real-world code me zyada common hai.",
    followUp: "Kya har LINQ operator query syntax me likha ja sakta hai?",
  },
  {
    id: "linq-syntax-tr-2",
    question: "Compiler query syntax ko method syntax me kaise convert karta hai — ye kab hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Compile-time pe, desugaring ke through — runtime pe koi conversion nahi hoti.",
    detailedAnswer:
      "Ye ek compile-time syntactic transformation hai, `foreach` ke `GetEnumerator()`/`MoveNext()` conversion jaisi. Har query-syntax clause ek corresponding method call me map hota hai: `where` -> `.Where()`, `select` -> `.Select()`, `orderby` -> `.OrderBy()`/`.ThenBy()`, `join` -> `.Join()`/`.GroupJoin()`. Compiler ye conversion IL generate karne se pehle kar deta hai — runtime pe sirf method-syntax IL hi execute hoti hai, query syntax runtime pe exist hi nahi karti.",
  },
  {
    id: "linq-syntax-tr-3",
    question: "`Count()` ko query syntax me kaise likhoge?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Poora query expression parenthesis me wrap karke `.Count()` chain karna padta hai — query syntax me directly available nahi.",
    detailedAnswer:
      "```csharp\nvar adultCount = (from p in people\n                  where p.Age >= 18\n                  select p).Count();\n```\n`Count()` ke liye koi query-syntax keyword nahi hai, isliye poore `from...select` expression ko parenthesis me wrap karke uspe method-syntax `.Count()` chain karna padta hai. Yahi pattern `Sum()`, `First()`, `Any()`, `Max()` jaise sab aggregation/element operators ke liye follow hota hai.",
  },
  {
    id: "linq-syntax-tr-4",
    question: "Kya ye do queries exactly same result denge?\n```csharp\nvar q1 = from p in people where p.Age >= 18 select p.Name;\nvar q2 = people.Where(p => p.Age >= 18).Select(p => p.Name);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Haan, exactly same result — dono same compiled code hain.",
    detailedAnswer:
      "`q1` compile-time pe exactly `q2` jaisa ban jaata hai (query syntax method syntax me desugar hoti hai). Dono `IEnumerable<string>` return karenge, same elements, same order, same deferred-execution behavior — koi behavioral difference nahi hai, sirf source code me syntax alag likha gaya hai.",
  },
  {
    id: "linq-syntax-tr-5",
    question: "Ek naya developer kehta hai 'method syntax faster hai kyunki wo directly compiled hoti hai, query syntax pehle parse hoti hai runtime pe.' Ye sahi hai ya galat?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — query syntax bhi compile-time pe hi method syntax me convert ho jaati hai, koi runtime parsing nahi hoti.",
    detailedAnswer:
      "Ye ek common misconception hai. Query syntax C# compiler dwara compile-time pe hi method-syntax calls me desugar ki jaati hai — runtime pe koi 'query syntax parsing' step exist hi nahi karta. Dono exact same IL/expression tree compile hoti hain. Performance difference bilkul zero hai — sirf source-level syntax alag hai, compiled output identical hai.",
    redFlag: "'Query syntax slow hoti hai kyunki wo runtime pe parse hoti hai' bolna — ye batata hai candidate ko desugaring mechanism samajh nahi aaya.",
  },
  {
    id: "linq-syntax-tr-6",
    question: "Kis scenario me query syntax method syntax se genuinely zyada readable hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Multi-table joins aur intermediate `let` calculations wale complex queries me — SQL-jaisi structure mentally parse karna aasan hota hai.",
    detailedAnswer:
      "Jab query me multiple `join` clauses hon (e.g. Orders-Customers-Products 3-way join) ya beech me `let` se intermediate calculated values chahiye hon, query syntax ka SQL-jaisa top-down structure follow karna method-syntax ke deeply nested lambda chains se zyada readable ho jaata hai. Simple single-source filter+project queries ke liye ye advantage kam noticeable hota hai — wahan method syntax hi zyada compact aur common hai.",
  },
  {
    id: "linq-syntax-tr-7",
    question: "Kya query syntax aur method syntax ek hi query me mix ki ja sakti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Haan — query syntax ek IEnumerable/IQueryable return karti hai jispar aage method-syntax operators chain kiye ja sakte hain.",
    detailedAnswer:
      "```csharp\nvar firstAdult = (from p in people\n                  where p.Age >= 18\n                  select p).First();\n```\nYe mixed syntax ka common pattern hai — jo operators query syntax me directly available nahi (Count, First, Sum, Any, etc.), unhe method-syntax chaining se add kiya jaata hai. Compiler ke liye sab kuch eventually method calls hi hain, isliye ye mixing bilkul valid hai.",
  },
  {
    id: "linq-syntax-tr-8",
    question: "LINQ konse C# version me introduce hua, aur query syntax vs method syntax dono launch se hi the?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "C# 3.0 (2007) — dono syntax ek saath launch hue, ek dusre ke baad nahi.",
    detailedAnswer:
      "LINQ C# 3.0 (2007, .NET Framework 3.5) me introduce hua tha, extension methods, lambda expressions, aur anonymous types jaisi related features ke saath. Query syntax aur method syntax dono is release me saath-saath the — query syntax ek naya language-level syntax tha jo internally method syntax (extension methods + lambdas) par hi build tha, isliye dono ek hi time pe available hue, sequential evolution nahi thi.",
  },
];

export default questions;
