import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "selectmany-1",
    question: "`orders` ek `List<Order>` hai, har `Order` ke andar `Items` property ek `List<OrderItem>` hai. `orders.Select(o => o.Items)` ka result type kya hoga?",
    options: [
      "IEnumerable<OrderItem> — flat list of all items",
      "IEnumerable<List<OrderItem>> — nested, ek list per order",
      "IEnumerable<Order> — koi change nahi",
      "Compile error — Select nested collections ke saath kaam nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "`Select` har `Order` ko uski `Items` property se replace kar deta hai, ek-to-ek mapping — result har order ke liye ek `List<OrderItem>` hoga, matlab overall result nested (`IEnumerable<List<OrderItem>>`) hai. Flat combined list chahiye ho to `SelectMany` chahiye, `Select` nahi. Options A, C, aur D sab galat hain.",
    difficulty: "medium",
  },
  {
    id: "selectmany-2",
    question: "Same scenario me, saare orders ke saare items ek single flat list me chahiye. Konsa operator sahi hai?",
    options: [
      "orders.Select(o => o.Items).ToList()",
      "orders.SelectMany(o => o.Items)",
      "orders.Where(o => o.Items)",
      "orders.Cast<OrderItem>()",
    ],
    correctIndex: 1,
    explanation:
      "`SelectMany` exactly is problem ke liye design kiya gaya hai — har element se ek nested collection nikal kar sabko ek single flat sequence me combine karta hai. Option A `Select` hi hai (nested result), `.ToList()` lagane se nested hona khatam nahi hota. Option C compile hi nahi hoga (`Where` bool predicate chahta hai). Option D galat hai — `Cast<T>` type-casting ke liye hai, flattening ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "selectmany-3",
    question: "`ArrayList mixed = new ArrayList { 1, \"two\", 3 };` par `mixed.OfType<int>()` call karne se kya hoga?",
    options: [
      "InvalidCastException throw hoga jab 'two' encounter ho",
      "{ 1, 3 } return hoga — sirf int elements, non-matching silently skip",
      "Poora collection unchanged return hoga",
      "Compile error — OfType non-generic ArrayList ke saath kaam nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "`OfType<T>()` non-matching elements ko exception throw kiye bina silently skip kar deta hai, sirf matching-type elements return karta hai (aur unhe cast bhi kar deta hai). `OfType` `ArrayList` (non-generic `IEnumerable`) ke saath bhi kaam karta hai, isliye ye ek common non-generic-to-generic conversion pattern hai. Option A `Cast<T>()` ka behavior hai, `OfType<T>()` ka nahi. Options C aur D galat hain.",
    difficulty: "medium",
  },
  {
    id: "selectmany-4",
    question: "Performance ke hisaab se, in dono me se kaunsa generally behtar hai jab ek expensive `Select` projection hai?\n```csharp\n// A: employees.Select(e => ExpensiveTransform(e)).Where(r => r.IsValid)\n// B: employees.Where(e => e.IsActive).Select(e => ExpensiveTransform(e))\n```",
    options: [
      "A behtar hai — projection pehle karna hamesha sahi hota hai",
      "B behtar hai — filtering pehle karke, sirf kam (active) elements par expensive transform chalta hai",
      "Dono exactly same performance dete hain",
      "Ye depend karta hai sirf collection ke size par, order ka koi fark nahi padta",
    ],
    correctIndex: 1,
    explanation:
      "Option B me `Where` pehle chain hai, isliye sirf filtered (active) elements par expensive `ExpensiveTransform` chalta hai — total work kam hota hai. Option A me har element (chahe wo baad me invalid nikle) par pehle expensive transform chalta hai, phir filter hota hai — wasted work un elements par jo aakhir me discard ho jaate. Options C aur D dono is real, practical trade-off ko galat represent karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
