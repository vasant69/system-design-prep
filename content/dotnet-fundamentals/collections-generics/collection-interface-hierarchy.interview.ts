import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "collection-hierarchy-tr-1",
    question: "`IEnumerable<T>`, `ICollection<T>`, aur `IList<T>` ki hierarchy explain karo — har ek kya adds karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "`IEnumerable<T>` sirf iterate; `ICollection<T>` +Count/mutation; `IList<T>` +index-based access/insert. Har ek pichhle ka strict superset hai.",
    detailedAnswer:
      "`IEnumerable<T>` sabse minimal hai — sirf `GetEnumerator()`, forward-only, read-only iteration. `ICollection<T>` isko extend karta hai, `Count`, `Add`, `Remove`, `Clear`, `Contains` add karta hai — ab tum size jaan sakte ho aur mutate kar sakte ho, lekin index access nahi. `IList<T>` `ICollection<T>` ko extend karta hai, indexer (`this[int]`), `IndexOf`, `Insert`, `RemoveAt` add karta hai — full array/List-jaisi capability.",
    followUp: "IQueryable<T> is hierarchy me kahan fit hota hai?",
  },
  {
    id: "collection-hierarchy-tr-2",
    question: "Ek method `void PrintAll(List<string> items)` signature ke saath likha gaya hai. Isme kya problem hai, aur behtar signature kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Over-restrictive — method ko sirf iteration chahiye, isliye `List<string>` unnecessarily caller ko forces karta hai ek List hi pass kare. `IEnumerable<string>` behtar hai.",
    detailedAnswer:
      "`List<string> items` parameter type caller ko sirf `List<string>` (ya usse implicitly-convertible) pass karne deta hai — agar caller ke paas ek `string[]`, `HashSet<string>`, ya LINQ query result ho, use explicitly `.ToList()` call karke convert karna padega, jo unnecessary overhead hai (aur agar source `IQueryable<string>` hai, premature database materialization bhi ho sakta hai). Agar method sirf `foreach` karta hai, `IEnumerable<string> items` sahi signature hai — maximum caller flexibility, koi forced conversion nahi.",
  },
  {
    id: "collection-hierarchy-tr-3",
    question: "Ye code compile hoga kya?\n```csharp\nIEnumerable<int> numbers = new List<int> { 1, 2, 3 };\nnumbers.Add(4);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — `IEnumerable<T>` me `Add` method exist hi nahi karta, chahe underlying actual object ek List ho.",
    detailedAnswer:
      "Declared type (`IEnumerable<int>`) compiler ke liye decide karta hai kaunse members accessible hain, actual runtime type (`List<int>`) nahi. `IEnumerable<T>` sirf `GetEnumerator()` expose karta hai — `Add` uska member hi nahi hai (wo `ICollection<T>` me hai). Isliye `numbers.Add(4)` compile-time error dega: 'IEnumerable<int> does not contain a definition for Add'.",
  },
  {
    id: "collection-hierarchy-tr-4",
    question: "'Accept the least-specific interface you need' principle ko ek concrete example se explain karo.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "LINQ's Where/Select/OrderBy sab IEnumerable<T> (ya IQueryable<T>) accept karte hain, List<T> nahi — isse ye literally kisi bhi collection type pe kaam kar jaate hain.",
    detailedAnswer:
      "`.NET`'s LINQ extension methods (`Where<T>(this IEnumerable<T> source, ...)`) ko sirf iteration chahiye, isliye unka `this` parameter `IEnumerable<T>` type ka hai — is design decision ki wajah se `Where()` ek array, `List<T>`, `HashSet<T>`, `Dictionary<TKey,TValue>.Values`, kisi bhi custom `IEnumerable<T>` implementation, sab pe kaam karta hai bina kisi conversion ke. Agar LINQ ne `List<T>` maanga hota, ye itna universally useful nahi hota.",
  },
  {
    id: "collection-hierarchy-tr-5",
    question: "`IQueryable<T>` ko `IEnumerable<T>` samajh kar treat karna kya risk create kar sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Execution model ka misunderstanding — IQueryable ka execution deferred aur provider-translated hota hai. Ek galat `.ToList()` placement se premature ya repeated database round-trips ho sakte hain.",
    detailedAnswer:
      "`IQueryable<T>` `IEnumerable<T>` se inherit karta hai, isliye syntactically inhe interchangeably treat kiya ja sakta hai — lekin semantically execution model bilkul alag hai. Agar developer `IQueryable<T>` ko `IEnumerable<T>` samajh kar kaam kare (jaise usme ek in-memory-only LINQ operation chain kare jo SQL provider translate nahi kar sakta), ya usse baar-baar re-enumerate kare bina realize kiye ki har enumeration ek naya database round-trip hai, performance aur correctness dono issues aa sakte hain — classic `.ToList()` too-early/too-late gotcha jo `ienumerable-vs-iqueryable-linq` topic me detail se cover hota hai.",
    redFlag: "IQueryable aur IEnumerable ko 'basically same' bolna interview me — ye execution-model ki depth ki kami dikhata hai.",
  },
  {
    id: "collection-hierarchy-tr-6",
    question: "Ek method ko genuinely `Count` aur `Contains` chahiye lekin index-based access nahi. Kaunsa interface accept karega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`ICollection<T>` — Count/Contains/Add/Remove deta hai bina indexer ke, jo exactly required capability hai, na kam na zyada.",
    detailedAnswer:
      "`ICollection<T>` yahan sahi choice hai — `IEnumerable<T>` insufficient hoga (`Count`/`Contains` nahi deta efficiently), aur `IList<T>` over-specification hoga (indexer force karta hai jo caller ke paas har collection type me nahi hoga, jaise `HashSet<T>` jo `IList<T>` implement hi nahi karta). `ICollection<T>` exactly required capability expose karta hai.",
  },
  {
    id: "collection-hierarchy-tr-7",
    question: "Kya `HashSet<T>` `IList<T>` implement karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `HashSet<T>` `ICollection<T>` aur `IEnumerable<T>` implement karta hai, lekin `IList<T>` nahi, kyunki HashSet ka koi meaningful index-based ordering hi nahi hai.",
    detailedAnswer:
      "`HashSet<T>` unordered hai (koi guaranteed positional ordering nahi), isliye index-based access (`this[int]`) semantically meaningless hoga — is wajah se `HashSet<T>` `IList<T>` implement nahi karta. Ye ek practical demonstration hai ki agar tum method parameter `IList<T>` bana do jabki actually sirf `ICollection<T>`-level capability chahiye thi, `HashSet<T>` jaise valid collections ko caller pass hi nahi kar payega — over-specification real callers ko exclude kar deta hai.",
    redFlag: "Ye assume karna ki sab collections IList<T> implement karte hain — HashSet aur Dictionary jaise common collections nahi karte.",
  },
  {
    id: "collection-hierarchy-tr-8",
    question: "Ye code kya karega?\n```csharp\npublic static int CountItems(IEnumerable<int> items) => items.Count();\n\nvar query = dbContext.Orders.Select(o => o.Id); // IQueryable<int>\nint total = CountItems(query);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile aur run dono karega — `IQueryable<int>` `IEnumerable<int>` bhi hai, isliye pass ho sakta hai. Lekin `.Count()` yahan EF Core provider ke through database-side `COUNT(*)` translate ho sakta hai (agar provider supports), depend karta hai kis extension method resolve hua (IEnumerable ka ya IQueryable ka).",
    detailedAnswer:
      "`IQueryable<T>` `IEnumerable<T>` extend karta hai, isliye ek `IQueryable<int>` seedha `IEnumerable<int>` parameter me pass ho sakta hai — koi compile error nahi. Method ke andar, `items.Count()` call hota hai jahan `items` ka STATIC/declared type `IEnumerable<int>` hai (parameter type), isliye C# `Enumerable.Count()` (LINQ to Objects) resolve karega, `Queryable.Count()` (jo SQL translate karta) nahi — matlab poori query pehle in-memory enumerate hogi phir count hoga, database-side `COUNT(*)` optimization miss ho jaayega. Ye ek subtle performance trap hai jab IQueryable ko IEnumerable-typed parameter me pass kiya jaata hai.",
    followUp: "Isse kaise avoid karoge — method signature me kya change karoge?",
  },
];

export default questions;
