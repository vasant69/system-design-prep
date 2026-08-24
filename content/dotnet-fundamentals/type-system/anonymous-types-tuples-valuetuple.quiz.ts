import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "anon-tuple-1",
    question: "`var person = new { Name = \"Asha\" }; person.Name = \"Riya\";` — dusri line kya karegi?",
    options: [
      "Successfully Name update kar degi",
      "Compile error — anonymous type properties read-only hain",
      "Runtime exception",
      "Naya anonymous type create karegi",
    ],
    correctIndex: 1,
    explanation:
      "Anonymous types ke properties compiler dwara read-only generate kiye jaate hain — sirf `get`, koi `set` nahi. Isliye ek baar create hone ke baad, unke properties reassign nahi ho sakte, ye compile-time error dega.",
    difficulty: "easy",
  },
  {
    id: "anon-tuple-2",
    question: "`Tuple<int, string>` aur `(int, string)` (ValueTuple) me kya fundamental difference hai?",
    options: [
      "Koi difference nahi, dono same cheez hain alag syntax me",
      "Tuple reference type hai (heap allocation), ValueTuple value type hai (no heap allocation), aur named elements support karta hai",
      "ValueTuple sirf .NET Framework me kaam karta hai",
      "Tuple faster hai kyunki purana hai",
    ],
    correctIndex: 1,
    explanation:
      "`Tuple<T1,T2>` ek class hai (reference type), har baar heap allocation hoti hai. `ValueTuple` (C# 7+) ek struct hai (value type), koi extra heap allocation nahi, aur elements ko named kiya ja sakta hai (`(int Id, string Name)`) jo readability improve karta hai. Ye exactly wo reason hai jispe modern C# ValueTuple ko prefer karta hai.",
    difficulty: "medium",
  },
  {
    id: "anon-tuple-3",
    question: "Named tuple elements (jaise `(int Id, string Name)`) runtime pe actually kaise store hote hain?",
    options: [
      "Named elements ka apna separate runtime representation hota hai",
      "Runtime pe still generic Item1/Item2 hi hote hain — naming sirf compile-time metadata hai, zero runtime cost",
      "Named elements ek Dictionary me store hote hain internally",
      "Named tuples runtime pe boxed hote hain, unnamed nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "Named tuple elements `TupleElementNames` attribute ke through sirf compile-time metadata hain. Runtime pe ValueTuple internally still `Item1`, `Item2`, etc. hi use karta hai — compiler tumhe named access dikhata hai source code me, lekin ye purely ek compile-time convenience hai, koi extra runtime structure nahi banti, isliye zero performance cost.",
    difficulty: "hard",
  },
  {
    id: "anon-tuple-4",
    question: "Kab ek proper `record`/`class` banana ValueTuple use karne se behtar hai?",
    options: [
      "Jab tuple sirf ek method ke andar temporarily use ho raha ho",
      "Jab wahi data shape multiple jagah repeat ho rahi ho ya public API contract ka hissa ban rahi ho",
      "Kabhi nahi, tuples hamesha better hote hain",
      "Sirf jab performance matter na kare",
    ],
    correctIndex: 1,
    explanation:
      "Tuples short-lived, local groupings ke liye achhe hain. Jab wahi shape codebase me baar-baar repeat ho, ya public API/library boundary cross kare jahan consumers ko clear, self-documenting contract chahiye, ek proper named type (record/class) better hai — compiler field order/naming mismatches ko compile-time pe catch karta hai, aur future me naye fields add karna easier hota hai.",
    difficulty: "medium",
  },
];

export default quiz;
