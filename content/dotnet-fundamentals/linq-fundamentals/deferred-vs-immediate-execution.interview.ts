import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "deferred-tr-1",
    question: "Deferred execution aur immediate execution me kya fark hai LINQ me?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer:
      "Deferred execution me query sirf ek 'recipe' hoti hai jo enumeration tak nahi chalti; immediate execution turant poori query chala kar concrete result deta hai.",
    detailedAnswer:
      "`Where`, `Select`, `OrderBy` jaise operators deferred hain — call karte hi kuch execute nahi hota, sirf ek `IEnumerable<T>` return hota hai jo 'jab enumerate kiya jaaye tab ye kaam karna' describe karta hai. Enumeration `foreach`, `ToList()`, ya koi bhi iteration trigger karta hai. `ToList()`, `Count()`, `Sum()`, `First()` jaise operators immediate hain — call hote hi poori query enumerate ho jaati hai aur ek concrete value/collection milta hai. Ye difference practically important hai kyunki underlying data source query-definition aur enumeration ke beech change ho sakta hai.",
    followUp: "Agar main ek deferred query ko 2 baar enumerate karoon, kya vo 2 baar execute hogi?",
  },
  {
    id: "deferred-tr-2",
    question: "Ye code kya print karega?\n```csharp\nvar list = new List<int> { 1, 2, 3 };\nvar q = list.Select(x => x * 2);\nlist.Add(4);\nforeach (var x in q) Console.Write(x + \" \");\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "2 4 6 8 — kyunki Select deferred hai, foreach ke time current list (jisme 4 bhi hai) use hoti hai.",
    detailedAnswer:
      "`Select` deferred execution use karta hai — `q` sirf ek query description hai. `list.Add(4)` ke baad, jab `foreach` enumerate karta hai, tab actual multiplication chalti hai against current state of `list`, jisme ab `{1,2,3,4}` hai. Isliye output `2 4 6 8` hota hai, `2 4 6` nahi — jo agar developer galat se snapshot expect kar raha ho to surprising lag sakta hai.",
  },
  {
    id: "deferred-tr-3",
    question: "In operators ko deferred aur immediate me classify karo: `Where`, `ToArray`, `GroupBy`, `Count`, `Take`, `First`.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Deferred: Where, GroupBy, Take. Immediate: ToArray, Count, First.",
    detailedAnswer:
      "Deferred operators sirf query describe karte hain: `Where` (filtering), `GroupBy` (grouping), `Take` (partitioning) — sab `IEnumerable<T>` return karte hain jo enumeration tak execute nahi hote. Immediate operators turant enumerate karke concrete value dete hain: `ToArray` (materialized array), `Count` (int), `First` (single element). General pattern: agar operator ek `IEnumerable<T>`/`IQueryable<T>` return karta hai, usually deferred hai; agar wo ek concrete scalar ya materialized collection return karta hai, usually immediate hai.",
  },
  {
    id: "deferred-tr-4",
    question: "Ek dashboard me ek hi deferred LINQ query 3 alag components me reuse ki gayi (count, list, export). Beech me background job data update kar raha hai. Kya problem aa sakti hai, aur fix kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Har component alag time pe enumerate karega, isliye teeno alag results dikha sakte hain — fix: query ko ek baar .ToList() se materialize karke wahi shared result reuse karo.",
    detailedAnswer:
      "Deferred query koi caching nahi karti — har enumeration current source state ke against fresh execution hai. Agar background job enumerations ke beech data change kar raha hai, count/list/export teeno slightly different (inconsistent) data dikha sakte hain, jo ek race-condition jaisa symptom deta hai bina actual threading bug ke. Fix: query ko ek jagah `.ToList()` se materialize karo (ek consistent snapshot), aur wahi materialized list teeno components ko do — sab guaranteed same, consistent data dekhenge.",
  },
  {
    id: "deferred-tr-5",
    question: "Kya deferred execution ka koi genuine performance fayda hai, ya ye sirf ek gotcha hai jise avoid karna chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Genuine fayda hai — composability aur 'sirf jitna zaroorat utna hi kaam karna' (e.g. Take(5) ke saath poora source process nahi hota).",
    detailedAnswer:
      "Deferred execution sirf ek gotcha nahi, ek deliberate design hai. Isse multiple operators chain karke ek combined operation banti hai jo sirf enumeration ke time chalti hai — intermediate collections allocate nahi hote har step par. Aur agar sirf kuch results chahiye (`Take(5)` ya `First()`), poora source process karne ki zaroorat nahi padti kyunki iterator lazily, on-demand, ek-ek element process karta hai. Gotcha tab banta hai jab developer ye assume kar le ki query 'already executed' hai jab actually wo abhi describe hui hai.",
  },
  {
    id: "deferred-tr-6",
    question: "Ye code exception kyun deta hai, aur ye is topic se kaise related hai?\n```csharp\nvar list = new List<int> { 1, 2, 3 };\nforeach (var x in list.Where(n => n > 0))\n{\n    if (x == 2) list.Remove(x);\n}\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "InvalidOperationException: Collection was modified — kyunki deferred query enumeration ke DAURAN hi `list` ko modify kiya ja raha hai.",
    detailedAnswer:
      "`Where` deferred hai, isliye filtering `foreach` ke andar hi, live enumeration ke beech, chalti hai. Jab `list.Remove(x)` call hota hai enumeration ke beech, .NET ka enumerator internal version-check mechanism (modification detection) ye pakad leta hai aur `InvalidOperationException` throw karta hai. Ye is topic se directly related hai kyunki deferred execution ka matlab hai query source ka live reference rakhti hai — agar source enumeration ke DAURAN badle (definition se pehle nahi, balki beech me), ye ek alag, sharper problem banti hai jo exception deti hai.",
    redFlag: "Ye na jaanna ki `foreach` ke andar collection modify karna exception dega — ye ek bahut common real-world bug hai.",
  },
  {
    id: "deferred-tr-7",
    question: "`FirstOrDefault()` deferred hai ya immediate? Kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Immediate — turant enumerate karke ek single concrete value (ya default) return karta hai, koi IEnumerable nahi.",
    detailedAnswer:
      "`FirstOrDefault()` ek element operator hai — call hote hi query ko utna enumerate karta hai jitna zaroorat hai first matching element dhoondne ke liye (ya poore source ko agar koi match nahi mila, default return karne se pehle), aur ek concrete `T` (ya `default(T)`) return karta hai, `IEnumerable<T>` nahi. Isliye ye immediate execution hai — call ke baad source change hone se return kiya gaya value affected nahi hota, kyunki value already compute ho chuka hai.",
  },
  {
    id: "deferred-tr-8",
    question: "Ek expensive-to-evaluate LINQ query (jaise ek heavy computation wala Select) ko galti se ek loop ke andar baar-baar enumerate kiya jaa raha hai. Iska performance impact kya hoga, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Har enumeration poora computation dobara chalayegi — N enumerations = N baar full cost. Fix: ek baar .ToList() se materialize karke result reuse karo.",
    detailedAnswer:
      "Deferred query koi result cache nahi karti — har baar enumerate karne par poori pipeline (Select ke andar ka expensive computation sameet) dobara chalti hai. Agar ye query loop ke andar N baar enumerate ho rahi hai, total cost N times ho jaata hai, jabki intent shayad sirf ek baar compute karke reuse karna tha. Fix seedha hai: query ko loop se pehle ek baar `.ToList()` se materialize karo, phir loop ke andar us materialized list ko access karo — computation sirf ek baar chalega.",
  },
];

export default questions;
