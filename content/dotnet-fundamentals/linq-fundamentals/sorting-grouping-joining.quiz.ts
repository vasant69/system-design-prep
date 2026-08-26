import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sort-group-join-1",
    question: "```csharp\nvar result = employees.OrderBy(e => e.Department).OrderBy(e => e.Salary);\n```\nYe code employees ko primarily Department se aur secondarily Salary se sort karega — sahi ya galat?",
    options: [
      "Sahi — ye exactly do-level sorting karta hai",
      "Galat — dusra OrderBy pehle wale Department-based sort ko poori tarah overwrite kar deta hai, sirf Salary se sort hota hai",
      "Sahi, lekin sirf agar Department values unique hon",
      "Compile error — OrderBy do baar chain nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "Dusra `OrderBy` ek naya, independent sort start karta hai — pehle wale `OrderBy(e => e.Department)` ka result poori tarah discard ho jaata hai. Final result sirf `Salary` ke hisaab se sorted hoga, Department ka koi asar nahi rahega. Multi-key sorting ke liye `ThenBy` chahiye: `.OrderBy(e => e.Department).ThenBy(e => e.Salary)`. Options A, C, D sab galat hain.",
    difficulty: "hard",
  },
  {
    id: "sort-group-join-2",
    question: "`employees.GroupBy(e => e.Department)` ka return type kya hai?",
    options: [
      "Dictionary<string, List<Employee>>",
      "IEnumerable<IGrouping<string, Employee>>",
      "IEnumerable<Employee>",
      "List<string>",
    ],
    correctIndex: 1,
    explanation:
      "`GroupBy` ek `IEnumerable<IGrouping<TKey, TElement>>` return karta hai — har `IGrouping` khud ek `IEnumerable<TElement>` hai plus ek `.Key` property. Ye seedha `Dictionary` nahi hai (Option A galat), aur na hi flat `IEnumerable<Employee>` hai (Option C galat) — group structure preserve rehta hai. Option D bhi galat hai.",
    difficulty: "medium",
  },
  {
    id: "sort-group-join-3",
    question: "`customers.Join(orders, c => c.Id, o => o.CustomerId, (c, o) => ...)` aur `customers.GroupJoin(orders, ...)` me ek customer ke liye jiska koi order nahi hai, kya fark hoga?",
    options: [
      "Dono me wo customer result me nahi aayega",
      "Join me customer result se gayab ho jaayega; GroupJoin me customer ek empty orders-group ke saath result me rahega",
      "Dono me customer ek empty group ke saath aayega",
      "Join exception throw karega agar koi match na mile",
    ],
    correctIndex: 1,
    explanation:
      "`Join` inner-join semantics follow karta hai — sirf matching pairs result me aate hain, isliye no-match wala customer gayab ho jaata hai. `GroupJoin` har left-side (customer) element ke liye ek result deta hai, uske matches ka group (jo empty ho sakta hai) ke saath — customer phir bhi result me rehta hai, sirf uska orders-group empty hoga. Options A, C, D sab is core difference ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "sort-group-join-4",
    question: "```csharp\nvar names = new List<string> { \"A\", \"B\", \"C\" };\nvar nums = new List<int> { 1, 2 };\nvar zipped = names.Zip(nums, (n, x) => $\"{n}{x}\").ToList();\n```\n`zipped` me kitne elements honge?",
    options: [
      "3 — longer sequence ki length tak",
      "2 — shorter sequence ki length tak, extra element silently ignore",
      "ArgumentException throw hoga kyunki lengths match nahi karti",
      "5 — dono sequences ke total combined elements",
    ],
    correctIndex: 1,
    explanation:
      "`Zip` result shorter sequence ki length tak truncate hota hai — yahan `nums` sirf 2 elements ka hai, isliye `names`'s teesra element (\"C\") silently ignore ho jaata hai aur result me sirf 2 pairs (\"A1\", \"B2\") aate hain. Koi exception nahi aata length mismatch par. Options A, C, D sab galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
