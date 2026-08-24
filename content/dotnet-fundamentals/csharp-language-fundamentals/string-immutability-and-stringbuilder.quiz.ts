import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "string-immut-1",
    question: "```csharp\nstring a = \"hello\";\nstring b = a;\nb += \" world\";\nConsole.WriteLine(a);\n```\nYe kya print karega?",
    options: [
      "\"hello world\"",
      "\"hello\"",
      "Compile error",
      "null",
    ],
    correctIndex: 1,
    explanation:
      "`string` immutable hai — `b += \" world\"` `b` ko ek NAYE string object (\"hello world\") ki taraf point karwa deta hai, lekin `a` still original \"hello\" object ko point karta hai, jo unchanged hai. `a` print karega \"hello\", \"hello world\" nahi.",
    difficulty: "easy",
  },
  {
    id: "string-immut-2",
    question: "Ek loop me 100,000 baar `result += someString;` karne ka time-complexity impact kya hai?",
    options: [
      "O(n) — string concatenation hamesha linear hai",
      "O(n^2) — har concatenation poore purane content ko copy karta hai",
      "O(log n)",
      "O(1) — .NET automatically optimize kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Har `+=` ek naya string object banata hai jo purane poore content ko copy karta hai plus naya part — n iterations me total character-copy work O(n^2) ban jaata hai. Option D galat hai, .NET compiler is pattern ko automatically StringBuilder me convert nahi karta (Roslyn analyzer sirf warning de sakta hai, auto-fix nahi karta by default).",
    difficulty: "medium",
  },
  {
    id: "string-immut-3",
    question: "`string a = \"test\"; string b = \"test\"; ReferenceEquals(a, b)` — kya return karega, aur kyun?",
    options: [
      "False, kyunki alag variables hain",
      "True — compile-time literals interning ke through same object share karte hain",
      "Compile error",
      "Depends on runtime, unpredictable",
    ],
    correctIndex: 1,
    explanation:
      "Compile-time string literals CLR ke intern pool me store hote hain — identical literal values same object ko point karte hain automatically. Isliye `a` aur `b` genuinely same object reference karte hain, `ReferenceEquals` `True` return karta hai. Ye sirf compile-time literals ke liye hai, runtime-constructed equal-content strings ke liye nahi.",
    difficulty: "hard",
  },
  {
    id: "string-immut-4",
    question: "5 concatenations ek baar (loop ke bahar) karni hain. Best practice kya hai?",
    options: [
      "Hamesha StringBuilder use karo, chahe kitni bhi concatenations hon",
      "Plain `+`/string interpolation kaafi hai — StringBuilder ka creation overhead is chhote case me unnecessary hai",
      "StringBuilder aur plain concatenation dono equally bad hain",
      "String.Concat() kabhi use nahi karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "StringBuilder genuinely value tab deta hai jab concatenation count bada ho ya loop ke andar ho (repeated). 5 one-off concatenations ke liye StringBuilder object banane ka khud ka overhead plain `+`/`$\"\"` se zyada ho sakta hai — 'hamesha StringBuilder use karo' ek over-generalization hai jo yahan galat fit hai.",
    difficulty: "medium",
  },
];

export default quiz;
