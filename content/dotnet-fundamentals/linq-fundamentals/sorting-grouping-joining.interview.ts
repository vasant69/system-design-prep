import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sort-group-join-tr-1",
    question: "`Join` aur `GroupJoin` me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer:
      "Join = inner join (sirf matches, no-match dropped, flat result). GroupJoin = left-outer-join-like (har left element retained, matches ka group — possibly empty — saath me).",
    detailedAnswer:
      "`Join` do sequences ko key se match karta hai aur sirf wahi pairs result me deta hai jahan match mila — SQL `INNER JOIN` jaisa, unmatched elements gayab ho jaate hain. `GroupJoin` har left-side element ke liye uske saare matching right-side elements ka ek group deta hai — agar koi match na mile, group empty hota hai lekin left element result me phir bhi rehta hai. Ye left-outer-join semantics deta hai, hierarchical (grouped) shape me.",
    followUp: "GroupJoin ke result ko fully flat left-outer-join me kaise convert karoge?",
  },
  {
    id: "sort-group-join-tr-2",
    question: "Ye code kya sort karega?\n```csharp\nvar result = employees.OrderBy(e => e.Department).OrderBy(e => e.Salary);\n```",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Sirf Salary se sort hoga — dusra OrderBy pehle wale Department-based sort ko poori tarah overwrite kar deta hai.",
    detailedAnswer:
      "Ek common misconception ye hai ki dusra `OrderBy` secondary sort add kar dega — actually har `OrderBy` call ek naya, independent sort start karta hai, pehle wale sort ko discard karke. Multi-key sort ke liye `ThenBy`/`ThenByDescending` chahiye: `.OrderBy(e => e.Department).ThenBy(e => e.Salary)` — ye Department ko primary aur Salary ko tie-breaking secondary key banata hai.",
    redFlag: "Do `OrderBy` calls ko chain karna aur expect karna ki dono keys se sorting hogi — ye samajh me bug daalta hai jo silently galat order deta hai, exception nahi.",
  },
  {
    id: "sort-group-join-tr-3",
    question: "`GroupBy` ka result type kya hai, aur `IGrouping<TKey, TElement>` kya represent karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "IEnumerable<IGrouping<TKey, TElement>> — har IGrouping ek group hai jiska apna .Key hai aur jo khud bhi us group ke elements ka IEnumerable hai.",
    detailedAnswer:
      "`GroupBy` ka result ek sequence of groups hai. Har `IGrouping<TKey, TElement>` do cheezein deta hai: `.Key` (jis value se ye group bana), aur khud ek `IEnumerable<TElement>` (us group ke sab elements, foreach se iterate kiye ja sakte hain). Isliye `foreach (var group in employees.GroupBy(e => e.Department)) { var dept = group.Key; foreach (var emp in group) { ... } }` — group khud enumerable hai, nested loop natural lagta hai.",
  },
  {
    id: "sort-group-join-tr-4",
    question: "Ek payroll report chahiye — har department ka naam, employee count, aur total salary. Query kaise likhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "employees.GroupBy(e => e.Department).Select(g => new { Department = g.Key, Count = g.Count(), Total = g.Sum(e => e.Salary) })",
    detailedAnswer:
      "`GroupBy(e => e.Department)` employees ko department ke hisaab se buckets me daalta hai. `Select` phir har group (`IGrouping`) ko ek summary object me project karta hai — `g.Key` group ka department deta hai, `g.Count()` aur `g.Sum(...)` un aggregation operators ko us group ke andar hi apply karte hain (kyunki group khud enumerable hai). Ye `GroupBy` -> `Select` pattern per-group aggregated reports ke liye standard idiom hai.",
  },
  {
    id: "sort-group-join-tr-5",
    question: "Ye code kya result dega, aur `Zip` sequences ki alag lengths ko kaise handle karta hai?\n```csharp\nvar a = new List<string> { \"X\", \"Y\", \"Z\" };\nvar b = new List<int> { 1, 2 };\nvar r = a.Zip(b, (x, y) => x + y).ToList();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "r = [\"X1\", \"Y2\"] — 2 elements, kyunki Zip shorter sequence (b) ki length tak truncate karta hai.",
    detailedAnswer:
      "`Zip` positional pairing karta hai — pehla-pehla, doosra-doosra. Jab sequences ki lengths mismatch karti hain, result shorter sequence ki length tak jaata hai; extra elements (yahan `a` ka \"Z\") silently ignore ho jaate hain. Koi exception nahi aata mismatched lengths ke liye — ye ek deliberate, well-defined behavior hai, error case nahi.",
  },
  {
    id: "sort-group-join-tr-6",
    question: ".NET ka sort algorithm 'stable' hai — iska practical matlab kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Equal-key elements apna original relative order retain karte hain sort ke baad bhi — ye guaranteed, documented behavior hai.",
    detailedAnswer:
      "Agar do employees ka `Salary` equal hai aur unhe `OrderBy(e => e.Salary)` se sort kiya jaaye, wo dono apna original input-order relative sequence retain karenge (jo pehle input me pehle tha, wo result me bhi pehle rahega, agar unki sort-key equal hai). Ye practically important hai jab multi-step sorting (`ThenBy` ke bina, ya composite sorts) kar rahe ho — stability ka matlab hai equal-key ties ka predictable, deterministic resolution.",
  },
  {
    id: "sort-group-join-tr-7",
    question: "Kya `GroupJoin` ko fully-flat left-outer-join result me convert kiya ja sakta hai? Kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — GroupJoin ke baad SelectMany chain karo, DefaultIfEmpty() ke saath, taaki empty groups bhi ek default/null placeholder row de sakein.",
    detailedAnswer:
      "```csharp\nvar flatLeftOuter = customers\n    .GroupJoin(orders, c => c.Id, o => o.CustomerId, (c, custOrders) => new { c, custOrders })\n    .SelectMany(\n        x => x.custOrders.DefaultIfEmpty(),\n        (x, order) => new { x.c.Name, OrderId = order?.OrderId });\n```\n`GroupJoin` grouped result deta hai. `SelectMany` usse flatten karta hai, aur `DefaultIfEmpty()` ye ensure karta hai ki agar group empty hai (koi order nahi), ek single `null`/default entry mile taaki customer phir bhi ek row ke roop me result me aaye (order fields null ke saath) — exactly SQL LEFT OUTER JOIN jaisa flat result.",
  },
  {
    id: "sort-group-join-tr-8",
    question: "`OrderByDescending` aur `.OrderBy(...).Reverse()` me koi practical fark hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Result set same ho sakta hai simple cases me, lekin ThenBy ke saath combine karne par behavior alag hota hai — Reverse() poore sequence ko reverse karta hai, jo multi-key sorts me galat order de sakta hai.",
    detailedAnswer:
      "Single-key sort ke liye `list.OrderBy(x => x.Key).Reverse()` aur `list.OrderByDescending(x => x.Key)` same result de sakte hain. Lekin jaise hi `ThenBy` involve hota hai, ye break ho jaata hai: `OrderBy(a).ThenBy(b).Reverse()` poore combined-sorted sequence ko ulta kar deta hai (jisse `b`'s ascending order bhi reverse ho jaata hai within each `a` group), jabki `OrderByDescending(a).ThenBy(b)` sirf `a` ko descending karta hai, `b` ascending hi rehta hai within each group — dono semantically alag results hain jab multiple keys involve hon.",
    redFlag: "'Reverse() aur OrderByDescending hamesha same hain' bolna — multi-key sorting me ye galat hai.",
  },
];

export default questions;
