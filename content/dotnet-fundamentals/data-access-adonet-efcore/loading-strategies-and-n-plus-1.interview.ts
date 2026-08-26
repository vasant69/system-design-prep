import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "n-plus-1-tr-1",
    question: "N+1 query problem kya hai, aur ye kaise hoti hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "Flipkart"],
    shortAnswer: "1 query se N parent rows fetch hote hain, phir loop ke andar har parent ke related data ke liye alag query fire hoti hai — total N+1 queries.",
    detailedAnswer:
      "Ye tab hota hai jab tum ek collection query karte ho (1 query, N rows), aur phir un rows ko loop karte hue related data access karte ho bina eager loading ke — agar lazy loading enabled hai ya `Include()` missing hai, har row ke liye ek naya database round-trip trigger hota hai. Total queries: 1 (parents) + N (ek per parent, related data ke liye) = N+1. 500 rows ke liye ye 501 (ya zyada, multiple relations ke liye) queries ban sakti hain, jab ki ek single JOIN query se sab ho sakta tha.",
    followUp: "Ye problem production me kaise detect karoge bina code manually padhe?",
  },
  {
    id: "n-plus-1-tr-2",
    question: "Ye code review karo aur batao kya issue hai, kitni queries chalengi 300 customers ke liye:\n```csharp\nvar customers = await _context.Customers.ToListAsync();\nforeach (var c in customers)\n{\n    Console.WriteLine(c.Orders.Count);\n}\n```",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "301 queries (1 + 300) agar lazy loading enabled hai — classic N+1. Fix: .Include(c => c.Orders) add karo.",
    detailedAnswer:
      "`_context.Customers.ToListAsync()` 1 query chalati hai 300 customers fetch karne ke liye. Loop ke andar `c.Orders.Count` access karna — agar `Orders` ek lazy-loaded virtual navigation property hai — har iteration pe ek naya query trigger karta hai us specific customer ke orders fetch karne ke liye. Total: 1 + 300 = 301 queries. Fix: `_context.Customers.Include(c => c.Orders).ToListAsync()` — ab ek (ya do, JOIN complexity pe depend karta hai) query me sab data aa jaata hai, loop me sirf already-loaded `c.Orders.Count` access hota hai bina extra query ke.",
    redFlag: "Candidate ko query count calculate na kar paana, ya issue hi na spot kar paana code dekhkar.",
  },
  {
    id: "n-plus-1-tr-3",
    question: "Eager, Explicit, aur Lazy loading me kya fark hai, aur har ek kab appropriate hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Eager (Include, upfront combined query) — jab related data hamesha chahiye; Explicit (on-demand Load) — jab conditionally chahiye; Lazy (auto on access) — generally risky, N+1 ka source.",
    detailedAnswer:
      "Eager Loading (`.Include()`) related data ko main query ke saath ek combined query me fetch karta hai — best jab tumhe pata hai related data har baar chahiye hoga. Explicit Loading (`context.Entry(x).Collection(...).LoadAsync()`) related data ko separately, on-demand load karta hai — useful jab related data sirf kabhi-kabhi (conditionally) chahiye ho, aur tum control chahte ho kab query fire ho. Lazy Loading related property access hote hi automatically query fire karta hai — convenient dikhta hai lekin queries code me invisible ho jaati hain, jo N+1 ka sabse common source banata hai, isliye kai teams ise explicitly avoid/disable karti hain.",
  },
  {
    id: "n-plus-1-tr-4",
    question: "Ek production API endpoint ka response time data size badhne ke saath linearly (ya worse) degrade ho raha hai, lekin functional tests pass ho rahe hain. Ye kaise diagnose karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "EF Core query logging enable karke, ek single request ke dauraan generated SQL queries count karo — N+1 pattern (repeated near-identical queries) dhoondo.",
    detailedAnswer:
      "Functional tests generally chhote/single-item data ke saath pass ho jaate hain jahan N+1 ka impact negligible hota hai, isliye ye tests is issue ko catch nahi karte. Diagnosis approach: EF Core ka built-in logging (`LogTo` ya `ILoggerFactory` integration) enable karo aur dekho ek single API request kitni SQL queries generate karti hai — agar count data size ke proportional hai (jaise 'N parent rows to N+1 queries'), ye N+1 hai. SQL Profiler ya APM tools (Application Insights, jaise EF Core-specific diagnostics) bhi ye pattern highlight kar sakte hain. Fix: relevant `.Include()`s add karo.",
    followUp: "Query logging ko production me continuously enable rakhna kya trade-offs laata hai?",
  },
  {
    id: "n-plus-1-tr-5",
    question: "Kya ye statement sahi hai: 'Lazy loading hamesha avoid karna chahiye, ye kabhi useful nahi hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Overly absolute — lazy loading genuinely convenient ho sakta hai chhoti/simple applications me, lekin high-traffic/complex systems me N+1 risk ke wajah se generally avoided/disabled kiya jaata hai.",
    detailedAnswer:
      "Ye ek nuanced trade-off hai, absolute rule nahi. Lazy loading chhoti applications ya prototyping me genuinely convenient hai — related data 'automatically' available hota hai bina explicit `Include()` planning ke. Problem scale/complexity ke saath aati hai — jaise-jaise codebase badi hoti hai, invisible queries N+1 patterns me easily slip ho jaate hain jo review me miss ho jaate hain. Isi wajah se production-grade, high-traffic systems me teams often lazy loading proxies package hi add nahi karte, explicit/eager loading ko mandatory pattern banate hain — queries code me visible rehti hain, review-able hoti hain.",
    redFlag: "Ek absolute 'hamesha avoid karo' ya 'hamesha use karo' statement bina context/scale consideration ke.",
  },
  {
    id: "n-plus-1-tr-6",
    question: "Ek query me 5 different `.Include()` calls hain related entities ke liye, lekin API response sirf 2 unme se use karta hai. Isse kya problem ho sakti hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Over-fetching — 3 unnecessary related entities database se fetch ho rahe hain jinka koi use nahi, jo unnecessary bade JOIN/data transfer create karta hai.",
    detailedAnswer:
      "Ye N+1 ka opposite failure mode hai. Har `.Include()` query ki JOIN complexity aur returned data size badhata hai — agar 3 out of 5 included relations genuinely response me use nahi ho rahe, wo database se unnecessarily fetch ho rahe hain, jo query ko slow karta hai aur bandwidth waste karta hai bina koi benefit ke. Fix: sirf wahi `.Include()`s rakho jo genuinely us specific query ke result me use ho rahe hain — agar different endpoints ko different related data chahiye, alag-alag tailored queries likho, ek 'include-everything' query sab jagah reuse mat karo.",
  },
  {
    id: "n-plus-1-tr-7",
    question: "Ek `List<OrderDto>` return karna hai jisme har order ka `CustomerName` aur `TotalItemCount` chahiye. Design karo ki ye kaise efficiently fetch karoge N+1 avoid karte hue.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Ek query me Include(Customer) aur Include(OrderItems) laga kar fetch karo, phir in-memory Select() se DTO banao — total 1-2 queries.",
    detailedAnswer:
      "```csharp\nvar orders = await context.Orders\n    .Include(o => o.Customer)\n    .Include(o => o.OrderItems)\n    .ToListAsync();\n\nvar dtos = orders.Select(o => new OrderDto\n{\n    OrderId = o.Id,\n    CustomerName = o.Customer.Name,\n    TotalItemCount = o.OrderItems.Count\n}).ToList();\n```\nYahan `.Include()` calls saara zaroori related data ek (ya EF Core ke JOIN-splitting behavior ke hisab se do) database query me fetch kar lete hain. Uske baad `.Select()` in-memory LINQ hai (already-loaded data pe) — ye koi extra database query trigger nahi karta, kyunki `orders` list already materialize ho chuki hai `ToListAsync()` se. Result: N+1 (jaisa naive loop-based approach me hota) ki jagah sirf 1-2 total database queries.",
  },
];

export default questions;
