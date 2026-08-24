import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "builtin-1",
    question: "Ye code kya karega?\n```csharp\ndouble x = 10.0;\ndouble y = 0.0;\nConsole.WriteLine(x / y);\n```",
    options: [
      "`DivideByZeroException` throw karega",
      "`Infinity` print karega, koi exception nahi",
      "Compile error dega",
      "`0` print karega",
    ],
    correctIndex: 1,
    explanation:
      "Floating-point (`double`/`float`) division by zero IEEE 754 standard follow karta hai — exception nahi deta, `Infinity` (ya `NaN` jab dono 0.0 hon) return karta hai. `DivideByZeroException` sirf INTEGER division ke liye aata hai. Ye ek classic interview trap hai.",
    difficulty: "medium",
  },
  {
    id: "builtin-2",
    question: "`List<int>` ka indexer ek out-of-range index access karne par kaunsa exception deta hai?",
    options: [
      "`IndexOutOfRangeException`",
      "`ArgumentOutOfRangeException`",
      "`InvalidOperationException`",
      "`NullReferenceException`",
    ],
    correctIndex: 1,
    explanation:
      "`List<T>` ka indexer `ArgumentOutOfRangeException` deta hai, `IndexOutOfRangeException` nahi — ye ek subtle distinction hai. `IndexOutOfRangeException` raw arrays ke liye hai (CLR-level), `List<T>` apna wrapper exception deta hai jo public API validation ka part hai.",
    difficulty: "hard",
  },
  {
    id: "builtin-3",
    question: "`int.Parse(\"abc\")` aur `int.TryParse(\"abc\", out var result)` me kya fark hai?",
    options: [
      "Dono same behave karte hain, koi fark nahi",
      "`Parse` `FormatException` throw karta hai; `TryParse` `false` return karta hai, exception nahi",
      "`Parse` sirf integers ke liye hai, `TryParse` sabhi types ke liye",
      "`TryParse` deprecated hai, `Parse` use karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`int.Parse` invalid format pe `FormatException` throw karta hai. `int.TryParse` exception-free alternative hai — `bool` return karta hai (success/failure), aur `out` parameter me result deta hai. Jab invalid input ek expected/common case ho (jaise user input), `TryParse` prefer karo — exceptions control flow ke liye use karna anti-pattern hai.",
    difficulty: "easy",
  },
  {
    id: "builtin-4",
    question: "Ye code kaunsa exception throw karega?\n```csharp\nobject obj = \"hello\";\nint number = (int)obj;\n```",
    options: [
      "`FormatException`",
      "`ArgumentException`",
      "`InvalidCastException`",
      "`NullReferenceException`",
    ],
    correctIndex: 2,
    explanation:
      "Direct cast (`(int)obj`) ek object ko type-incompatible target type me cast karne ki koshish kar raha hai — `string` ko `int` me directly cast nahi kar sakte. Ye `InvalidCastException` deta hai, `FormatException` nahi (jo string PARSING failure ke liye hai, jaise `int.Parse(\"hello\")` — subtly different scenario, casting vs parsing).",
    difficulty: "medium",
  },
];

export default quiz;
