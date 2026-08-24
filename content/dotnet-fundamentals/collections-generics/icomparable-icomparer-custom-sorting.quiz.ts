import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "icomparable-icomparer-1",
    question: "Ek `Product` list ko kabhi Price se, kabhi Name se sort karna hai, depending on user selection. Sabse appropriate approach kya hai?",
    options: [
      "`IComparable<Product>` me ek flag parameter add karke dono orderings handle karna",
      "Alag-alag `IComparer<Product>` classes banana har ordering ke liye, aur `list.Sort(comparer)` use karna",
      "Har baar naya `Product` class banana alag ordering ke liye",
      "Ye possible hi nahi hai C# me",
    ],
    correctIndex: 1,
    explanation:
      "`IComparable<T>` sirf ek natural ordering support karta hai — flag-based hacks isse abuse karna anti-pattern hai. Sahi approach separate `IComparer<T>` classes (ya `Comparer<T>.Create` lambda) banana hai, ek har ordering strategy ke liye, aur `list.Sort(comparer)` me sahi wala pass karna. Options A galat approach hai (design smell), C aur D dono factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "icomparable-icomparer-2",
    question: "Ek custom class `Equals()` override karti hai lekin `GetHashCode()` nahi. Isko `HashSet<T>` me use karne par kya risk hai?",
    options: [
      "Compile error aayega",
      "Runtime exception turant aayega jab object add kiya jaayega",
      "Silent bug — do 'equal' objects ko HashSet different bucket me daal sakta hai, isliye Contains() galat 'false' de sakta hai bhale hi ek logically-equal object already present ho",
      "Koi issue nahi, .NET automatically GetHashCode() ko Equals() se sync kar deta hai",
    ],
    correctIndex: 2,
    explanation:
      "`Equals()` aur `GetHashCode()` ko consistently saath override karna zaroori hai — agar do objects `Equals()` se true dete hain lekin unka default (reference-based) `GetHashCode()` alag hai, `HashSet`/`Dictionary` unhe different buckets me daal sakta hai. Result: `Contains()` galat 'false' de sakta hai chahe ek logically-equal object already collection me ho — ye silent hai, koi exception nahi aata. Options A aur B galat hain — ye compile bhi hota hai aur turant exception bhi nahi deta. Option D galat hai — .NET koi automatic syncing nahi karta, developer ki responsibility hai.",
    difficulty: "hard",
  },
  {
    id: "icomparable-icomparer-3",
    question: "`IComparable<T>.CompareTo()` method ka return value convention kya hai?",
    options: [
      "Sirf `true`/`false` return karta hai",
      "Negative = current object pehle aata hai, zero = equal, positive = current object baad me aata hai",
      "Hamesha ek positive integer return karta hai",
      "String return karta hai jo comparison describe karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`.NET`'s comparison convention: negative return value ka matlab current instance sort order me pehle aata hai comparand se; zero matlab dono equal hain (ordering purposes ke liye); positive matlab current instance baad me aata hai. Ye convention `IComparer<T>.Compare()` bhi follow karta hai, aur `List<T>.Sort()`, `Array.Sort()` jaisi saari .NET sorting APIs isi convention pe rely karti hain. Options A, C, D sab factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "icomparable-icomparer-4",
    question: "Ek `ProductId` object ka `GetHashCode()` uske `Value` field pe based hai. Agar `Value` object ko `HashSet` me daalne ke baad change ho jaaye (mutable field), kya hoga?",
    options: [
      "Koi issue nahi, HashSet automatically update ho jaayega",
      "`HashSet` ab us object ko sahi tareeke se find nahi kar payega — kyunki hash change hone se wo galat bucket me 'search' hoga",
      "`ArgumentException` throw hoga immediately",
      "Object automatically HashSet se remove ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "`HashSet`/`Dictionary` internally object ke hash (jo Add ke time compute hua tha) ke basis pe use ek specific bucket me store karte hain. Agar us object ka hash-defining field baad me change ho jaaye, uska CURRENT hash different ho jaayega us bucket se jahan wo actually stored hai — future `Contains()`/`Remove()` calls galat bucket me search karenge aur object 'nahi milega,' chahe wo technically collection me abhi bhi present ho. Options A, C, D sab galat hain — .NET is scenario ko automatically detect ya fix nahi karta.",
    difficulty: "hard",
  },
];

export default quiz;
