import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-closures-1",
    question: "Ye code kya output dega?\n```csharp\nint x = 5;\nFunc<int> getX = () => x;\nx = 100;\nConsole.WriteLine(getX());\n```",
    options: [
      "5 — lambda ne capture-time ki value snapshot li",
      "100 — closure variable ko reference se capture karta hai, current value dikhta hai",
      "Compile error — x reassign nahi ho sakta lambda capture ke baad",
      "0 — default value milegi kyunki x out of scope ho gaya",
    ],
    correctIndex: 1,
    explanation:
      "Closure variable ko REFERENCE se capture karta hai, value ka snapshot nahi leta. `x` ko lambda define hone ke baad reassign kiya gaya (100), aur jab `getX()` invoke hota hai, wo `x` ki CURRENT value dekhta hai — 100. Option A galat hai kyunki koi snapshot nahi liya jaata. Option C galat hai — reassignment bilkul valid hai. Option D galat hai, x scope me hi rehta hai jab tak closure use ho raha hai.",
    difficulty: "medium",
  },
  {
    id: "lambda-closures-2",
    question: "```csharp\nvar actions = new List<Action>();\nfor (int i = 0; i < 3; i++)\n{\n    actions.Add(() => Console.WriteLine(i));\n}\nforeach (var a in actions) a();\n```\nYe kya print karega?",
    options: [
      "0 1 2",
      "3 3 3",
      "0 0 0",
      "Compile error",
    ],
    correctIndex: 1,
    explanation:
      "`for` loop me counter variable `i` poore loop me EK hi variable hai, har iteration me reused hota hai — lambda usi shared variable ko reference se capture karta hai. Loop khatam hone tak `i` ki value 3 ho chuki hoti hai, isliye sab teeno lambdas '3 3 3' print karte hain. Option A galat hai — ye `foreach` (C# 5+) ka behavior hota, `for` ka nahi. Options C, D dono galat hain.",
    difficulty: "hard",
  },
  {
    id: "lambda-closures-3",
    question: "`foreach` loop me C# 5.0 (2012) se kya specifically change kiya gaya?",
    options: [
      "foreach ab for se faster ho gaya",
      "Har iteration ko apna, alag scoped loop variable milne laga — isse loop-variable capture bug fix ho gaya foreach ke liye",
      "foreach loops me lambdas use karna ab illegal ho gaya",
      "for loop ka behavior bhi automatically foreach jaisa ho gaya",
    ],
    correctIndex: 1,
    explanation:
      "C# 5.0 ne `foreach` loop variable ke scoping ko change kiya — pehle (C# 5 se pehle) `foreach` bhi `for` jaisa ek shared variable use karta tha, jisse closures galat value capture karte the. C# 5.0 ne har iteration ko apna alag variable dena shuru kiya, jisse closures sahi, per-iteration value capture karte hain. Ye `for` loop pe apply NAHI hota — `for` loop aaj bhi shared-variable behavior rakhta hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "lambda-closures-4",
    question: "Anonymous methods (C# 2.0) aur lambda expressions (C# 3.0) me ek genuine functional difference kya hai?",
    options: [
      "Anonymous methods return value nahi de sakte, lambdas de sakte hain",
      "Lambda expressions Expression Trees me convert ho sakte hain (jaise IQueryable ke liye), anonymous methods nahi",
      "Anonymous methods sirf static context me use ho sakte hain",
      "Koi functional difference nahi, sirf naam alag hai",
    ],
    correctIndex: 1,
    explanation:
      "Lambda expressions ko compiler Expression Trees (`Expression<Func<T, bool>>`) me convert kar sakta hai — ye EF Core jaise IQueryable providers ke liye essential hai (jo expression tree ko SQL me translate karte hain). Anonymous methods (`delegate {}` syntax) ye capability nahi rakhte. Options A aur C dono factually galat hain. Option D galat hai kyunki ye genuine functional difference hai, sirf naming ka nahi.",
    difficulty: "hard",
  },
];

export default quiz;
