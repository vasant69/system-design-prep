import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "iqueryable-tr-1",
    question: "`IEnumerable` aur `IQueryable` me kya fark hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "TCS", "Infosys"],
    shortAnswer:
      "IEnumerable = LINQ to Objects, lambda ek delegate ban kar memory me chalta hai. IQueryable = LINQ to Entities, lambda ek Expression Tree ban kar provider dwara SQL me translate hota hai.",
    detailedAnswer:
      "`IEnumerable<T>` ke saath LINQ operators (`Where`, `Select`) compiled C# delegates hain jo already-in-memory data par directly chalte hain. `IQueryable<T>` (jaise EF Core ka `DbSet<T>`) ke saath, wahi lambda ek Expression Tree me compile hota hai — ek data structure jo operation describe karti hai. Provider (EF Core) is tree ko SQL me translate karta hai aur data-source-side execute karta hai, sirf result network se wapas aata hai. `IQueryable<T>` `IEnumerable<T>` se inherit karta hai.",
    followUp: "Agar `.ToList()` bahut jaldi call kar diya jaaye, kya hoga?",
  },
  {
    id: "iqueryable-tr-2",
    question: "Ye do queries me performance-wise kya fark hoga, aur kyun?\n```csharp\nvar a = dbContext.Orders.ToList().Where(o => o.Total > 1000);\nvar b = dbContext.Orders.Where(o => o.Total > 1000).ToList();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "`a` poori Orders table memory me le aata hai phir filter karta hai; `b` filtering database-side (SQL WHERE) karta hai — bade table ke liye `b` bahut zyada fast hai.",
    detailedAnswer:
      "`a` me `.ToList()` pehle call hota hai — is point pe `IQueryable` execute ho kar SAARI rows database se le aata hai memory me, phir `.Where()` in-memory LINQ to Objects filtering karta hai. `b` me `.Where()` abhi bhi `IQueryable` par chain ho raha hai (query material nahi hui), isliye poora `Where(...).ToList()` ek hi SQL query me translate hota hai jisme `WHERE Total > 1000` shamil hai — sirf matching rows database se network par aati hain. Agar table me lakhon rows hain, `a` genuinely orders-of-magnitude slower ho sakta hai.",
  },
  {
    id: "iqueryable-tr-3",
    question: "Kya `IQueryable` par har LINQ expression SQL me translate ho jaayega?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — provider ki translation capability limited hoti hai; complex custom C# method calls translate nahi ho paate aur runtime exception dete hain.",
    detailedAnswer:
      "Expression Tree ko SQL me translate karna provider (jaise EF Core) ki responsibility hai, aur ye har arbitrary C# construct ko handle nahi kar sakta. Agar `.Where()` ke andar ek custom, non-trivial C# helper method call ho jo SQL equivalent nahi rakhta, provider translation ke waqt fail hota hai aur ek runtime exception throw karta hai ('could not be translated'). Ye compile-time pe nahi pakda jaa sakta, kyunki compiler ko provider ki translation capability ka pata nahi hota — ye ek genuinely runtime concern hai.",
    redFlag: "'IQueryable par jo bhi C# code likho wo automatically SQL ban jaata hai' bolna — ye batata hai candidate ne translation ki limitation samjhi hi nahi.",
  },
  {
    id: "iqueryable-tr-4",
    question: "Ek production banking API me `dbContext.Transactions.ToList().Where(t => t.AccountId == accountId)` likha gaya tha aur response time 8-10 seconds tha. Root cause aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Root cause: .ToList() poori Transactions table memory me le aa raha tha filtering se pehle. Fix: .Where() ko .ToList() se pehle move karo taaki filtering database-side, indexed AccountId column par ho.",
    detailedAnswer:
      "`.ToList()` call hote hi poori `Transactions` table (potentially lakhon rows) database se memory me load ho rahi thi, aur uske baad `.Where()` sirf ek specific account ke liye in-memory filter kar raha tha — massive wasted I/O aur memory. Fix: `.Where(t => t.AccountId == accountId).ToList()` likhna, jisse poora predicate SQL me translate ho kar `WHERE AccountId = @accountId` ban jaata hai — agar `AccountId` par index hai, ye database-side ek fast, targeted query ban jaati hai, aur sirf relevant rows network se aati hain.",
  },
  {
    id: "iqueryable-tr-5",
    question: "`IQueryable<T>` ko ek method me pass kiya jo parameter type `IEnumerable<T>` accept karta hai. Kya isse koi problem ho sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Haan — silent risk hai. IQueryable IEnumerable se inherit karta hai isliye ye compile ho jaata hai, lekin us method ke andar agar IEnumerable-only extension methods use hue, query in-memory execution me switch ho sakti hai bina kisi warning ke.",
    detailedAnswer:
      "Type-hierarchy ki wajah se ye assignment/pass valid hai — `IQueryable<T>` ek `IEnumerable<T>` bhi hai. Lekin ek baar method ke andar variable ko `IEnumerable<T>`-typed treat kiya jaata hai, agar us par LINQ operators call hote hain, C# compiler `System.Linq.Enumerable`'s extension methods resolve karta hai (na ki `Queryable`'s) — jo delegate-based, in-memory execution hai. Result: database-side translation ka fayda silently kho jaata hai, koi compile error ya runtime exception nahi, sirf performance degrade hoti hai — is wajah se ye bug detect karna mushkil hota hai.",
  },
  {
    id: "iqueryable-tr-6",
    question: "EF Core context me, `IQueryable<T>` se `IEnumerable<T>` interfaces kis relationship me hain, aur ye kyun important hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "IQueryable<T> IEnumerable<T> se inherit karta hai — ye important hai kyunki ye determine karta hai konse extension methods (Queryable vs Enumerable) resolve honge aur isliye execution kahan hogi.",
    detailedAnswer:
      "`public interface IQueryable<T> : IEnumerable<T>` — is inheritance ki wajah se `IQueryable<T>` variable par LINQ operators call karte waqt, agar static type `IQueryable<T>` hai, `System.Linq.Queryable`'s expression-tree-building overloads resolve hote hain. Agar static type kisi wajah se `IEnumerable<T>` ban jaaye (explicit cast, parameter type, ya kisi extension method jo sirf `IEnumerable` accept karta hai), `System.Linq.Enumerable`'s delegate-based overloads resolve ho jaate hain — aur execution location badal jaati hai.",
  },
  {
    id: "iqueryable-tr-7",
    question: "Ye code kya karega?\n```csharp\nIEnumerable<Employee> employees = dbContext.Employees;\nvar seniors = employees.Where(e => e.Age > 40).ToList();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Filtering in-memory hogi, database-side nahi — kyunki `employees` ko explicitly IEnumerable<T> type diya gaya hai.",
    detailedAnswer:
      "Variable `employees` ko explicitly `IEnumerable<Employee>` declare kiya gaya hai, isliye compile-time pe `.Where()` call `System.Linq.Enumerable.Where` (delegate-based, in-memory) resolve hota hai, `System.Linq.Queryable.Where` (expression-tree-based) nahi — is se pehle EF Core ko `dbContext.Employees` (jo asal me `DbSet<Employee>`, ek `IQueryable<Employee>` hai) ko poora enumerate karna padega taaki `IEnumerable` ko satisfy kiya ja sake, matlab poori table pehle memory me aa jaayegi, phir filter memory me hoga. Ye exact wahi silent-fallback risk hai jo `IQueryable`-inherits-`IEnumerable` ki wajah se hota hai.",
  },
  {
    id: "iqueryable-tr-8",
    question: "General rule of thumb kya honi chahiye ye decide karne ke liye ki `.ToList()`/`.AsEnumerable()` kab call karein?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jitna possible ho utni der tak IQueryable rehne do — sirf tab materialize karo jab query 'server-side evaluatable' na rahe, ya jab result multiple baar reuse karna ho.",
    detailedAnswer:
      "Filtering, projection, sorting, aggregation jo bhi SQL-translatable hai, sab `.ToList()` se PEHLE `IQueryable` ke through chain karo — isse maximum kaam database-side hota hai aur minimum data network se travel karta hai. Sirf tab materialize karo jab: (1) agar aage genuinely complex C# logic chahiye jo provider translate nahi kar sakta, (2) result ko multiple baar reuse karna ho (deferred-execution repeated-query problem se bachne ke liye), ya (3) query ab further modify nahi hogi aur ek concrete snapshot chahiye.",
  },
];

export default questions;
