import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sorted-legacy-tr-1",
    question: "`ArrayList`/`Hashtable` ko naye C# code me kyun avoid kiya jaata hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "Do problems — value types ke liye boxing overhead, aur zero compile-time type safety (mismatches sirf runtime pe InvalidCastException se pakde jaate hain).",
    detailedAnswer:
      "`ArrayList`/`Hashtable` `object` store karte hain, kisi specific type ke bajaye. Isse do problems hote hain: (1) har value type (int, double, struct) add karne par boxing hoti hai — extra heap allocation, extra GC pressure. (2) koi compile-time type checking nahi — galat type add karna silently compile ho jaata hai, aur cast karte waqt runtime pe `InvalidCastException` aata hai, jo bahut late catch hota hai. Generics (C# 2.0) ne dono problems solve kar diye — `List<T>`/`Dictionary<TKey,TValue>` type-specific, boxing-free, compile-time-safe hain.",
    followUp: "Boxing exact mechanism kya hai?",
  },
  {
    id: "sorted-legacy-tr-2",
    question: "`SortedDictionary<TKey,TValue>` aur `SortedList<TKey,TValue>` me choose karna hai. Konse factors decide karenge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Frequent inserts/deletes ho to `SortedDictionary` (O(log n) tree-based); mostly read-heavy aur memory-conscious ho to `SortedList` (array-based, kam overhead).",
    detailedAnswer:
      "`SortedDictionary` internally red-black tree hai — insert/delete/lookup sab O(log n). `SortedList` internally do parallel sorted arrays hain — insert/delete O(n) (shifting), lekin index-based lookup O(log n) (binary search) aur per-item memory overhead kam hai (koi tree-node pointers nahi). Agar collection ek baar populate hoke mostly reads hi lete rehna hai, `SortedList` behtar hai. Agar frequent mutation ho rahi hai, `SortedDictionary` better hai.",
  },
  {
    id: "sorted-legacy-tr-3",
    question: "Ye code kya karega?\n```csharp\nHashtable table = new Hashtable();\ntable[\"count\"] = 5;\nint c = (int)table[\"count\"];\ntable[\"count\"] = \"five\";\nint c2 = (int)table[\"count\"];\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Pehla cast (`c`) safely 5 assign karega; doosra cast (`c2`) runtime pe `InvalidCastException` throw karega kyunki actual value ab ek string hai.",
    detailedAnswer:
      "`Hashtable` key ke against koi bhi type ka value store kar sakta hai (koi type-safety hai hi nahi). Pehle `table[\"count\"] = 5` — int box hota hai. `(int)table[\"count\"]` safely unbox hokar `5` deta hai. Phir `table[\"count\"] = \"five\"` — ab same key ke against ek string store hai. `(int)table[\"count\"]` ab fail hoga kyunki actual stored value string hai, int nahi — `InvalidCastException`. Ye exactly ye demonstrate karta hai ki `Hashtable` me koi type consistency guarantee nahi hoti.",
  },
  {
    id: "sorted-legacy-tr-4",
    question: "Ek naya developer kehta hai: 'Hashtable thread-safe hai for multiple readers/single writer, Dictionary nahi hai — isliye Hashtable better hai.' Kya ye ek valid reason hai Hashtable use karne ka?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Weak reasoning — ye historical trivia sahi hai, lekin agar genuine thread-safety chahiye, `ConcurrentDictionary` proper modern solution hai, `Hashtable` ka boxing/no-type-safety cost is benefit se bahut zyada hai.",
    detailedAnswer:
      "Ye technically ek true fact hai — `Hashtable` documented tha 'multiple readers, single writer' ke liye safe. Lekin ye ek weak justification hai `Hashtable` use karne ke liye aaj — genuine thread-safety chahiye to `System.Collections.Concurrent.ConcurrentDictionary<TKey,TValue>` exactly is purpose ke liye design kiya gaya hai, generics ke saath, without boxing, with much richer atomic operations (`GetOrAdd`, `AddOrUpdate`). `Hashtable` ka boxing aur type-safety cost is thin thread-safety benefit ko bahut outweigh karta hai.",
    redFlag: "Historical trivia ko modern justification bana dena — 'ye purane C# me aisa tha' aaj ke best-practice ke against argue karne ke liye kaafi nahi hai.",
  },
  {
    id: "sorted-legacy-tr-5",
    question: "Ek 15-saal purani legacy .NET Framework codebase me `ArrayList` heavily use hoti hai. Kya migration priority honi chahiye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ideally haan, incrementally — har `ArrayList`/`Hashtable` ko `List<T>`/`Dictionary<TKey,TValue>` me convert karne se boxing overhead khatam hota hai aur compile-time type safety milti hai, jo migration ke dauraan hi latent bugs pakadti hai.",
    detailedAnswer:
      "Legacy `ArrayList`/`Hashtable` code ko generic collections me migrate karna do concrete faayde deta hai: (1) manual casts khatam ho jaate hain, jisse compiler khud type mismatches ko catch kar leta hai — migration process me hi kai chhupe hue bugs surface ho sakte hain. (2) high-volume scenarios me boxing-related GC pressure kam hoti hai, jo measurable performance improvement de sakta hai. Priority high honi chahiye especially un areas me jo performance-critical hain ya jahan type-related bugs pehle dekhe gaye hain.",
  },
  {
    id: "sorted-legacy-tr-6",
    question: "Kya `Dictionary<TKey,TValue>` foreach loop me hamesha insertion order me hi elements deta hai, jaisa ki aksar practically dikhta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye guaranteed nahi hai, sirf current implementation detail hai. Guaranteed sorted/consistent order chahiye to SortedDictionary use karo.",
    detailedAnswer:
      "`Dictionary<TKey,TValue>` explicitly documented hai ki enumeration order guaranteed nahi hai — ye implementation-specific hai aur .NET versions ke beech change ho sakta hai. Interview me isko `SortedDictionary` se confuse karna common mistake hai — sirf `SortedDictionary`/`SortedSet`/`SortedList` explicitly, guaranteed order maintain karte hain (key ke basis pe sorted).",
    redFlag: "'Dictionary hamesha insertion order deta hai kyunki maine dekha hai' — observed behavior ko guaranteed contract samajhna.",
  },
  {
    id: "sorted-legacy-tr-7",
    question: "`SortedSet<T>` aur `HashSet<T>` me kya fark hai, aur kab `SortedSet` genuinely zaroori hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`SortedSet<T>` sorted order maintain karta hai (tree-based, O(log n)), `HashSet<T>` koi order guarantee nahi karta (hash-based, O(1) average). Jab tumhe sorted, unique elements chahiye without a separate sort step, SortedSet zaroori hai.",
    detailedAnswer:
      "`HashSet<T>` faster hai raw operations ke liye (O(1) average vs O(log n)), lekin koi ordering guarantee nahi deta. `SortedSet<T>` thoda slower hai per-operation, lekin hamesha sorted iteration deta hai bina ek separate `.OrderBy()` call ke — jaise ek leaderboard jo hamesha sorted-by-score dikhna chahiye har baar naya score add hone par, bina explicit re-sort call kiye.",
  },
  {
    id: "sorted-legacy-tr-8",
    question: "Ye code kya karega, aur kya ye legacy ArrayList ka realistic use case hai?\n```csharp\nArrayList mixedData = new ArrayList { 1, \"two\", 3.0, true };\nforeach (var item in mixedData) Console.WriteLine(item.GetType());\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Ye print karega Int32, String, Double, Boolean — ArrayList mixed types ko silently allow karta hai. Ye technically valid hai, lekin real production code me almost kabhi desired behavior nahi hota.",
    detailedAnswer:
      "`ArrayList` `object` store karta hai isliye koi bhi mix of types ek collection me daale ja sakte hain — code compile aur run dono karega, har item ka actual runtime type print hoga: `System.Int32`, `System.String`, `System.Double`, `System.Boolean`. Ye ArrayList ki 'flexibility' hai, lekin practically ye almost hamesha ek design smell hai — production code me typically ek collection ek consistent type ki cheezein hi store karti hai, aur agar genuinely heterogeneous data chahiye, ek well-defined type (jaise `List<object>` explicitly, ya better, ek discriminated-union-jaisa design) zyada intentional hota hai.",
  },
];

export default questions;
