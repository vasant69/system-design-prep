import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "func-action-predicate-1",
    question: "`Func<string, int, bool>` me last type parameter (`bool`) ka kya matlab hai?",
    options: [
      "Ye ek input parameter hai",
      "Ye method ka return type hai",
      "Ye batata hai delegate multicast hai ya nahi",
      "Ye batata hai method static hai ya instance",
    ],
    correctIndex: 1,
    explanation:
      "`Func<>` me hamesha LAST type parameter return type hota hai, baaki sab (yahan `string` aur `int`) input parameters hain. To `Func<string, int, bool>` ek method represent karta hai jo `string` aur `int` leta hai, `bool` return karta hai. Options A, C, D sab galat interpretations hain.",
    difficulty: "easy",
  },
  {
    id: "func-action-predicate-2",
    question: "`Action<int>` aur `Func<int, void>` — dono valid hain kya?",
    options: [
      "Dono valid hain, functionally identical",
      "`Action<int>` valid hai, lekin `Func<int, void>` compile error deta hai — `void` ek valid generic type argument nahi hai",
      "`Func<int, void>` valid hai, `Action<int>` deprecated ho chuka hai",
      "Dono invalid hain, `void` kabhi generic delegate me use nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "`void` C# me ek valid generic type argument nahi hai — `Func<int, void>` likhna compile error dega. Isi wajah se `Action<>` ek separate delegate family hai jo void-returning methods ke liye explicitly design hui — return-type slot hi nahi hota. Options A, C, D sab factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "func-action-predicate-3",
    question: "`Predicate<T>` aur `Func<T, bool>` me practical difference kya hai?",
    options: [
      "`Predicate<T>` faster hai runtime pe",
      "Koi functional difference nahi — dono ek hi cheez represent karte hain, sirf naam/history alag hai. Modern LINQ code `Func<T, bool>` use karta hai, `Predicate<T>` mostly List<T> ke legacy methods me dikhta hai",
      "`Predicate<T>` multiple parameters accept kar sakta hai, `Func<T, bool>` sirf ek",
      "`Predicate<T>` sirf value types ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`Predicate<T>` aur `Func<T, bool>` functionally identical hain — same signature shape. Farak sirf historical/naming hai: `Predicate<T>` List<T>'s older methods (`FindAll`, `Find`, `RemoveAll`) ke signatures me reh gaya, jabki LINQ (baad me aaya) consistently `Func<T, bool>` use karta hai. Options A, C, D sab galat hain — koi perf/parameter-count/type-constraint difference nahi hai.",
    difficulty: "medium",
  },
  {
    id: "func-action-predicate-4",
    question: "`Func<>` aur `Action<>` kitne parameters tak overloads support karte hain?",
    options: [
      "Sirf 4 tak",
      "0 se 16 tak",
      "Unlimited, koi limit nahi",
      "Sirf 1 ya 2, zyada ke liye custom delegate zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "`Func<>` (`Func<TResult>` se `Func<T1...T16, TResult>` tak) aur `Action<>` (`Action` se `Action<T1...T16>` tak) dono 0 se 16 input parameters tak pre-defined overloads ke saath aate hain. Isse zyada parameters chahiye ho to custom delegate declare karna padega. Options A, C, D sab incorrect hain.",
    difficulty: "medium",
  },
];

export default quiz;
