import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sorted-legacy-1",
    question: "`SortedDictionary<TKey,TValue>` aur `SortedList<TKey,TValue>` me insert operation ki complexity ka fark kya hai?",
    options: [
      "Dono O(log n) hain, koi fark nahi",
      "`SortedDictionary` insert O(log n) hai (tree-based); `SortedList` insert O(n) hai (array shifting)",
      "`SortedDictionary` insert O(n) hai; `SortedList` insert O(log n) hai",
      "Dono O(1) hain",
    ],
    correctIndex: 1,
    explanation:
      "`SortedDictionary` internally ek red-black tree use karta hai, isliye insert O(log n) hai. `SortedList` internally do parallel sorted arrays use karta hai — sahi sorted position pe insert karne ke liye baaki elements ko shift karna padta hai, isliye O(n). Ye exact opposite trade-off hai unke memory footprint ke — SortedList kam memory leta hai per-item, lekin insert slower hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "sorted-legacy-2",
    question: "```csharp\nArrayList list = new ArrayList();\nlist.Add(10);\nlist.Add(\"hello\");\n```\nYe code compile hoga kya, aur `list.Add(10)` me kya hota hai internally?",
    options: [
      "Compile error — ArrayList sirf ek type accept karta hai",
      "Compile hota hai; `10` ek `object` me box hota hai (heap allocation)",
      "Compile hota hai; `10` bina kisi conversion ke directly store hota hai",
      "Compile error — string aur int ek saath ek ArrayList me nahi ja sakte",
    ],
    correctIndex: 1,
    explanation:
      "`ArrayList` `object` store karta hai, isliye koi bhi type (mixed types bhi) usme add ho sakte hain — compile-time koi restriction nahi hai. `10` (ek `int`, value type) `object` me convert hone ke liye box hota hai — ek heap allocation banti hai jo value ko wrap karti hai. Options A aur D dono galat hain — ArrayList mixed types allow karta hai, ye hi to iski problem hai. Option C galat hai — value types ko object me store karne ke liye boxing zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "sorted-legacy-3",
    question: "Frequent insertions/deletions ke saath ek hamesha-sorted collection chahiye. Memory footprint priority nahi hai. Kaunsa collection best fit hai?",
    options: [
      "`SortedList<TKey,TValue>` — kam memory leta hai",
      "`SortedDictionary<TKey,TValue>` — O(log n) insert/delete, tree-based",
      "`ArrayList` sorted karke",
      "`Dictionary<TKey,TValue>` — bhi sorted order maintain karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Frequent insert/delete ke liye `SortedDictionary` best fit hai kyunki uska tree-based insert O(log n) hai — `SortedList`'s O(n) array-shift se kaafi behtar high-frequency-mutation scenarios me. Option A galat hai kyunki memory priority nahi hai yahan. Option C galat hai — ArrayList manually sort karna har baar O(n log n) hoga, aur boxing bhi hogi. Option D factually galat hai — `Dictionary` koi sorted order guarantee nahi karta.",
    difficulty: "medium",
  },
  {
    id: "sorted-legacy-4",
    question: "`ArrayList` me `int` store karke `(string)list[0]` cast karne ki koshish karna kya karega?",
    options: [
      "Automatically int ko string me convert kar dega (jaise \"5\")",
      "`null` return karega",
      "Runtime pe `InvalidCastException` throw karega",
      "Compile-time hi error dega",
    ],
    correctIndex: 2,
    explanation:
      "`ArrayList` compile-time type safety nahi deta — `(string)list[0]` syntactically valid hai chahe actual element `int` ho. Runtime pe jab actual cast attempt hota hai aur types incompatible hote hain, `InvalidCastException` throw hota hai. Ye exactly wo problem hai jo generics solve karte hain — is tarah ka mismatch generic collections me build-time hi pakda jaata hai. Option A galat hai — koi automatic type-conversion nahi hoti cast operator se. Option B galat hai — exception aata hai, null nahi. Option D galat hai — compiler ko pata hi nahi ki `list[0]` ka actual runtime type kya hai (object hai declared type), isliye compile-time check possible hi nahi.",
    difficulty: "medium",
  },
];

export default quiz;
