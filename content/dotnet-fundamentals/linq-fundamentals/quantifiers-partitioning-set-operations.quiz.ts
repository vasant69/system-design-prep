import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "quantifiers-1",
    question: "```csharp\nvar empty = new List<int>();\nbool result = empty.All(n => n > 100);\n```\n`result` ki value kya hogi?",
    options: [
      "false — kyunki koi element hi 100 se zyada nahi hai",
      "true — vacuous truth ki wajah se, koi element condition violate nahi kar raha",
      "Runtime exception aayega, empty sequence par All call nahi ho sakta",
      "null return hoga",
    ],
    correctIndex: 1,
    explanation:
      "`All()` ek empty sequence par `true` return karta hai — ye 'vacuous truth' ka standard logical rule hai: jab koi element hi nahi hai, koi bhi element condition ko violate nahi kar sakta, isliye 'sab elements condition satisfy karte hain' vacuously true maana jaata hai. Ye ek genuine, well-documented .NET behavior hai, exception nahi. Options A, C, D sab galat hain.",
    difficulty: "hard",
  },
  {
    id: "quantifiers-2",
    question: "```csharp\nvar numbers = new List<int> { 1, 2, 3, 10, 4, 5 };\nvar result = numbers.TakeWhile(n => n < 5).ToList();\n```\n`result` me kya hoga?",
    options: [
      "{ 1, 2, 3, 4 } — sab elements jo 5 se chhote hain",
      "{ 1, 2, 3 } — pehli non-matching element (10) pe ruk jaata hai",
      "{ 1, 2, 3, 10, 4, 5 } — poori sequence, kyunki kuch to match karta hai",
      "Empty list — kyunki 10 condition fail karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`TakeWhile` pehli baar condition false hone par PERMANENTLY ruk jaata hai — `10` par condition (`10 < 5`) false hai, isliye iteration wahin stop ho jaata hai, chahe aage `4` aur `5` phir se condition satisfy karte hon. Result sirf `{1, 2, 3}` hai. Option A `Where`'s behavior hai (poori sequence scan karke sab matches deta), jo yahan galat hai. Options C aur D dono galat hain.",
    difficulty: "hard",
  },
  {
    id: "quantifiers-3",
    question: "Ek `Product` class me `Equals`/`GetHashCode` override nahi kiye gaye hain. `products.Distinct()` call karne par kya hoga agar list me do alag `Product` objects hain jinke saare properties (Id sameet) same hain?",
    options: [
      "Dono ko duplicate maan kar ek hi rakhega, kyunki data same hai",
      "Dono ko alag maanega aur dono rakhega, kyunki bina override kiye reference equality use hoti hai",
      "Compile error dega",
      "Runtime exception aayega",
    ],
    correctIndex: 1,
    explanation:
      "Bina `Equals`/`GetHashCode` override kiye, `Distinct()` (aur `Union`/`Intersect`/`Except`) default `Object.Equals` use karta hai jo reference types ke liye REFERENCE equality hai — do alag object instances, chahe unka data identical ho, unequal maane jaate hain. Isliye `Distinct()` dono ko alag rakhega. Custom set-based comparison chahiye ho to `Equals`/`GetHashCode` override karo ya `IEqualityComparer<T>` supply karo. Options A, C, D sab galat hain.",
    difficulty: "medium",
  },
  {
    id: "quantifiers-4",
    question: "Pagination ke liye page 3, 20 items per page chahiye. Sahi LINQ expression kaunsa hai?",
    options: [
      "products.Take(20).Skip(3)",
      "products.Skip(40).Take(20)",
      "products.Skip(3).Take(20)",
      "products.Take(3).Skip(20)",
    ],
    correctIndex: 1,
    explanation:
      "Page 3 (1-indexed, 20 per page) ka matlab hai pehle 2 pages (40 items) skip karo, phir agle 20 lo — formula: `Skip((page - 1) * pageSize).Take(pageSize)` = `Skip((3-1)*20).Take(20)` = `Skip(40).Take(20)`. Option A order galat rakhta hai (Take pehle karne se sirf pehle 20 items ka subset milta, Skip uska koi fayda nahi). Option C sirf 3 items skip karta hai, 3 pages nahi. Option D bhi galat order/values hai.",
    difficulty: "medium",
  },
];

export default quiz;
