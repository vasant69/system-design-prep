import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "indexer-op-1",
    question: "Ek type me `==` operator overload karte waqt kya karna strongly recommended hai?",
    options: [
      "Kuch nahi, == overload apne aap me sufficient hai",
      "Equals() aur GetHashCode() ko bhi consistently override karna",
      "Sirf GetHashCode() override karna kaafi hai",
      "!= ko overload karna optional hai",
    ],
    correctIndex: 1,
    explanation:
      "`==` overload karte waqt `Equals()`/`GetHashCode()` ko consistent rakhna zaroori hai, warna Dictionary/HashSet jaise collections (jo Equals/GetHashCode use karte hain) ka behavior `==` operator se mismatch ho sakta hai. Option D galat hai — `!=` ko `==` ke saath overload karna compiler-mandatory hai (pair requirement), optional nahi.",
    difficulty: "medium",
  },
  {
    id: "indexer-op-2",
    question: "Ek class me kitni indexers define ki ja sakti hain?",
    options: [
      "Sirf ek",
      "Multiple, agar unke parameter types different hon (overloading)",
      "Zero, indexers deprecated hain",
      "Sirf int-parameter waali indexer allowed hai",
    ],
    correctIndex: 1,
    explanation:
      "Indexers overload ho sakti hain bilkul methods ki tarah — ek class me ek `int`-parameter indexer aur ek `string`-parameter indexer dono ho sakte hain, jab tak signatures distinguishable hon. Options A, C, D sab galat hain.",
    difficulty: "easy",
  },
  {
    id: "indexer-op-3",
    question: "`Employee + Employee` jaisa operator overload likhna generally kyun avoid kiya jaata hai?",
    options: [
      "C# technically ye allow hi nahi karta",
      "Operator ka meaning ambiguous/surprising hota hai non-value-like entity types ke liye — named method zyada clear hota hai",
      "Ye performance issues create karta hai",
      "Entity types operator overloading support hi nahi karte",
    ],
    correctIndex: 1,
    explanation:
      "C# technically kisi bhi class/struct pe operator overloading allow karta hai (Option A/D galat), lekin jab type ek behavior/entity-driven object ho (jaise Employee) jiske liye `+` ka koi natural, obvious meaning na ho, operator overload karna code ko confusing bana deta hai — ek clearly-named method (jaise `PromoteWith()`) zyada readable hota hai. Option C irrelevant claim hai.",
    difficulty: "medium",
  },
  {
    id: "indexer-op-4",
    question: "Comparison operators (`<`, `>`) overload karne ke saath typically kaunsa interface bhi implement karna best practice hai?",
    options: [
      "IEnumerable<T>",
      "IComparable<T>",
      "IDisposable",
      "ICloneable",
    ],
    correctIndex: 1,
    explanation:
      "`IComparable<T>` implement karna ensure karta hai ki type BCL ke sorting/ordering methods (jaise `Array.Sort()`, `OrderBy()`) ke saath properly integrate ho — sirf operator overload karna in methods ke saath automatically kaam nahi karta, wo `IComparable<T>` pe rely karte hain. Baaki options is context me irrelevant hain.",
    difficulty: "hard",
  },
];

export default quiz;
