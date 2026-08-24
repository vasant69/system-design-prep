import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "generics-1",
    question: "Generics se pehle `ArrayList` me value types (jaise `int`) store karne ka main downside kya tha?",
    options: [
      "ArrayList me value types add hi nahi ho sakte the",
      "Boxing hoti thi (heap allocation cost) aur koi compile-time type safety nahi thi — galat type add karne pe sirf runtime pe error pakda jaata",
      "ArrayList sirf strings store kar sakta tha",
      "ArrayList thread-safe nahi tha",
    ],
    correctIndex: 1,
    explanation:
      "ArrayList object store karta tha, isliye value types add karne pe boxing (heap allocation) hoti thi, aur type safety compile time pe enforce nahi hoti thi — galat type add karke sirf runtime pe InvalidCastException milta tha retrieve karte waqt. List<T> dono problems generics ke through solve karta hai. Option A galat hai, value types add ho sakte the (boxed hoke). Option C aur D dono is context me irrelevant/galat hain.",
    difficulty: "medium",
  },
  {
    id: "generics-2",
    question: "`where T : new()` constraint ko multiple constraints ke saath combine karte waqt kya rule follow karna padta hai?",
    options: [
      "Ye hamesha pehla constraint hona chahiye",
      "Ye hamesha last constraint hona chahiye jab multiple constraints combine ho rahe hon",
      "Ye kisi bhi position pe ho sakta hai",
      "Ye kabhi doosre constraints ke saath combine nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "C# ka rule hai ki new() constraint, agar multiple constraints combine ki ja rahi hain (jaise where T : class, IEntity, new()), to hamesha list me LAST aana chahiye. Ye ek syntax rule hai jo compiler enforce karta hai. Option A aur C dono is exact ordering rule ko galat batate hain. Option D galat hai — new() bilkul doosre constraints ke saath combine ho sakta hai, bas order matter karta hai.",
    difficulty: "medium",
  },
  {
    id: "generics-3",
    question: "`IEnumerable<string> strings = ...; IEnumerable<object> objects = strings;` — ye code compile kyun hota hai?",
    options: [
      "Kyunki List<T> covariant hai",
      "Kyunki IEnumerable<out T> covariant hai — T sirf output/return positions me use hota hai, isliye more-derived (string) ko less-derived (object) ki jagah safely use kiya ja sakta hai",
      "Kyunki string aur object same type hain",
      "Ye galat statement hai, ye code compile nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "IEnumerable<out T> covariant hai kyunki T sirf output positions (jaise GetEnumerator() ka return type) me appear hota hai, kabhi input parameter ki tarah nahi. Isliye ek IEnumerable<string> ko safely IEnumerable<object> ki jagah treat kiya ja sakta hai — tum sirf 'read' kar rahe ho, aur jo bhi string milegi wo automatically ek valid object bhi hai. Option A galat hai, List<T> khud invariant hai. Option C obviously galat hai. Option D galat hai, ye valid compiling code hai.",
    difficulty: "hard",
  },
  {
    id: "generics-4",
    question: "Generic classes (jaise `List<T>`) C# me variance (covariance/contravariance) support kyun nahi karti?",
    options: [
      "Kyunki classes hamesha sealed hoti hain",
      "Kyunki mutable classes me T input (jaise Add method) aur output (jaise indexer read) dono positions me use hota hai — variance allow karne se type-unsafe writes possible ho jaatin",
      "Kyunki compiler ki limitation hai, future me fix ho sakta hai",
      "Kyunki classes heap pe allocate hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "Variance sirf tab safe hai jab T sirf ek direction (sirf input YA sirf output) me use ho. List<T> jaisi mutable class me Add(T item) T ko input leta hai — agar List<string> ko List<object> ki tarah treat karne diya jaata, koi List<object>-typed reference ke through us list me ek int add kar deta, jo underlying List<string> ko corrupt kar deta. Isliye C# generic classes ko intentionally invariant rakhta hai. Options A, C, D sab irrelevant/galat reasons hain.",
    difficulty: "hard",
  },
];

export default quiz;
