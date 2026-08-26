import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "selectmany-tr-1",
    question: "`Where`, `Select`, aur `SelectMany` me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "Where filters (same shape, fewer elements), Select transforms (new shape, same count), SelectMany flattens nested collections into one flat sequence.",
    detailedAnswer:
      "`Where(predicate)` un elements ko hi rakhta hai jinke liye predicate true ho — result ka element type same rehta hai, sirf count kam hota hai. `Select(selector)` har element ko ek naye shape/type me transform karta hai — ek-to-ek mapping, count generally same. `SelectMany(selector)` jab har element khud ek collection projection karta hai, un sab nested collections ko ek single flat sequence me combine kar deta hai — ye 'one-to-many, then flatten' operator hai, jab `Select` nested result deta (list of lists), `SelectMany` usse flat kar deta hai.",
    followUp: "Ek example do jahan Select use karna galat hoga aur SelectMany chahiye tha.",
  },
  {
    id: "selectmany-tr-2",
    question: "Ye code kya output dega?\n```csharp\nvar orders = new List<Order> {\n    new Order { Items = new List<string> { \"A\", \"B\" } },\n    new Order { Items = new List<string> { \"C\" } }\n};\nvar result1 = orders.Select(o => o.Items).ToList();\nvar result2 = orders.SelectMany(o => o.Items).ToList();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "result1 = [[\"A\",\"B\"], [\"C\"]] (nested, 2 lists). result2 = [\"A\", \"B\", \"C\"] (flat, 3 strings).",
    detailedAnswer:
      "`Select` har `Order` ko uski `Items` list se replace karta hai — 2 orders the, isliye result 2 nested lists ka collection hai (`List<List<string>>`). `SelectMany` un dono nested lists ko flatten karke ek single sequence banata hai jisme har original item individually hai — 3 total strings, ek flat `List<string>`.",
  },
  {
    id: "selectmany-tr-3",
    question: "`SelectMany` ka result-selector overload kya karta hai, aur ye kab useful hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ye flattened child element ko uske parent ke saath ek naye combined shape me project karta hai, ek hi call me — jab parent ki info bhi flattened result me chahiye ho.",
    detailedAnswer:
      "```csharp\nvar withOrderId = orders.SelectMany(\n    o => o.Items,\n    (order, item) => new { order.OrderId, item.ProductName });\n```\nBina is overload ke, tumhe `SelectMany` ke baad ek separate `Select` chahiye hota parent info wapas add karne ke liye — lekin flattening ke baad parent reference already lost ho chuka hota. Ye overload dono steps (flatten + combine-with-parent) ek call me karta hai — reporting queries me common (e.g. 'har order ka har item, uske OrderId ke saath') jahan flattened result me parent context bhi chahiye.",
  },
  {
    id: "selectmany-tr-4",
    question: "`OfType<T>()` aur `Cast<T>()` me kya fark hai jab collection me mixed types hon?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "OfType<T>() non-matching elements ko silently skip karta hai; Cast<T>() non-matching element milte hi InvalidCastException throw karta hai.",
    detailedAnswer:
      "`ArrayList mixed = new ArrayList { 1, \"two\", 3 };` par `mixed.OfType<int>()` sirf `{1, 3}` return karega, `\"two\"` ko silently filter karke. Wahi `mixed.Cast<int>()` `\"two\"` par pahunchte hi `InvalidCastException` throw karega — kyunki `Cast<T>()` assume karta hai HAR element target type ka hai (ya usme cast ho sakta hai), koi filtering nahi karta. `OfType<T>()` use karo jab mixed-type collection ho aur sirf ek type chahiye; `Cast<T>()` use karo jab tumhe pakka pata ho sab elements same type ke hain (jaise non-generic legacy collection ko generic me convert karna).",
  },
  {
    id: "selectmany-tr-5",
    question: "Ek analytics service ko 'sab restaurants ke sab menu items jo ₹500 se zyada hain' chahiye, jahan data `List<Restaurant>` hai aur har `Restaurant` ke andar `List<MenuItem>` hai. Query kaise likhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "restaurants.SelectMany(r => r.MenuItems).Where(m => m.Price > 500)",
    detailedAnswer:
      "Pehle `SelectMany` se saare restaurants ke saare menu items ek flat sequence me nikalo (`SelectMany(r => r.MenuItems)`), phir usi flat sequence par `Where(m => m.Price > 500)` filter chain karo. Agar galti se `Select` use kiya jaaye, result nested (`List<List<MenuItem>>`) ban jaayega aur usse `Where` chain karna galat/confusing behavior dega — `SelectMany` hi is one-to-many-then-filter pattern ke liye sahi tool hai.",
  },
  {
    id: "selectmany-tr-6",
    question: "Kya `Where` ko `Select` se pehle ya baad me chain karne se result badalta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Correctness ke liye zyadatar cases me result same hota hai, lekin performance ke liye order matter karta hai — Where pehle karke fewer elements par expensive Select chalana efficient hota hai.",
    detailedAnswer:
      "Agar `Where` predicate aur `Select` projection independent properties par kaam kar rahe hain, final result set (elements ka set) same rahega chahe order kuch bhi ho. Lekin performance different hoga: `Where` ko pehle chain karna matlab `Select`'s (potentially expensive) transformation sirf filtered, kam elements par chalegi. `Select` pehle karne se poore original set par transformation chalti hai, phir filter — agar kuch elements filter ho kar discard ho jaate hain, un par expensive transform ka kaam waste gaya. Isliye best practice: filter jitni jaldi ho sake, karo.",
    redFlag: "'Order kabhi matter nahi karta LINQ chaining me' bolna — ye performance implications ko miss karta hai.",
  },
  {
    id: "selectmany-tr-7",
    question: "`SelectMany` ka naam 'Select Many' kyun hai — is naam se operator ka intent kaise samajh sakte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "'Select' (project) 'Many' (multiple items per source element) — har source element se kayi result elements produce hote hain, jo sab ek saath flatten ho jaate hain.",
    detailedAnswer:
      "Regular `Select` har source element se EK result element produce karta hai (one-to-one). `SelectMany` har source element se MULTIPLE (many) result elements produce karta hai — jaise ek `Order` se uske saare `Items`. Naam ye directly reflect karta hai: 'select' operation, lekin 'many' results per input element, jo phir automatically ek flat sequence me combine ho jaate hain (agar manually karna hota to nested loops ya `.SelectMany` internally jo karta hai wahi karna padta).",
  },
  {
    id: "selectmany-tr-8",
    question: "`SelectMany` ko manually nested `foreach` loops se replace karna ho, to wo kaisa dikhega — aur isse operator ka internal behavior samajhne me kaise madad milti hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Ek outer loop parent elements par, aur ek inner loop har parent ke nested collection par — SelectMany yehi do-level iteration internally karta hai, ek hi flat output stream me.",
    detailedAnswer:
      "```csharp\n// SelectMany equivalent, manual nested loop se:\nvar flatItems = new List<OrderItem>();\nforeach (var order in orders)\n{\n    foreach (var item in order.Items)\n    {\n        flatItems.Add(item);\n    }\n}\n```\nYe exactly wahi kaam hai jo `orders.SelectMany(o => o.Items)` ek line me karta hai — outer loop `orders` par, inner loop har order ke `Items` par, aur har inner element seedha ek flat result list me add hota hai (koi intermediate nested list nahi banti). Ye mental model samajhna is liye useful hai kyunki bahut developers `SelectMany` ko 'kuch magic flattening function' samajhte hain, jabki ye conceptually ek simple do-level iteration hai jo LINQ ne ek reusable, composable operator me convert kar diya hai.",
  },
];

export default questions;
