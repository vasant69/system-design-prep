import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "overloading-1",
    question: "Kya `int Add(int a, int b)` aur `double Add(int a, int b)` ek saath ek class me valid overloads hain?",
    options: [
      "Haan, kyunki return type alag hai",
      "Nahi — sirf return type alag hone se valid overload nahi banta, parameter list same hai isliye compile error aayega",
      "Haan, lekin sirf agar class partial ho",
      "Nahi, kyunki C# me overloading allowed hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Overload ke liye parameter list (count/type/order) alag hona chahiye — return type akela differentiator nahi ban sakta. Yahan dono methods ka signature (Add(int, int)) identical hai, sirf return type alag hai — ye compile error dega. Option A galat assumption hai. Option C irrelevant hai. Option D factually galat hai, overloading C# ka core feature hai.",
    difficulty: "easy",
  },
  {
    id: "overloading-2",
    question: "Overload resolution algorithm ka correct priority order kya hai?",
    options: [
      "params array > implicit conversion > exact match",
      "Exact match > implicit conversion > params array",
      "Sab overloads equally consider hote hain, random pick hota hai",
      "Sirf pehla declared overload use hota hai hamesha",
    ],
    correctIndex: 1,
    explanation:
      "Compiler pehle exact type match dhundhta hai, agar na mile to implicit conversions try karta hai (jaise int se double), aur sabse last resort params array wala overload hai. Options A, C, D sab is priority order ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "overloading-3",
    question: "```csharp\nobject obj = 5;\nvoid Print(int x) => Console.WriteLine(\"int\");\nvoid Print(object x) => Console.WriteLine(\"object\");\nPrint(obj);\n```\nYe kya print karega?",
    options: [
      "\"int\", kyunki obj ki actual runtime value ek int hai",
      "\"object\", kyunki overload resolution obj ke compile-time (declared) type — object — ko dekhta hai, uske runtime content ko nahi",
      "Compile error dega",
      "Random behavior, run se run alag ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Overload resolution poori tarah compile-time decision hai — variable ka DECLARED type dekha jaata hai, actual runtime object nahi. `obj` ka declared type `object` hai (chahe usme boxed int store ho), isliye `Print(object)` resolve hota hai. Ye overloading ko runtime (virtual/override) polymorphism se distinguish karne wala classic example hai.",
    difficulty: "hard",
  },
  {
    id: "overloading-4",
    question: "Agar do overloads ek call ke liye equally good match hote hain (na koi behtar), kya hota hai?",
    options: [
      "Compiler pehla declared overload use kar leta hai",
      "Runtime pe randomly ek choose hota hai",
      "Compile-time 'ambiguous call' error aata hai — code compile hi nahi hota",
      "Dono overloads ek saath call hote hain",
    ],
    correctIndex: 2,
    explanation:
      "Jab compiler ko do overloads equally valid lagte hain, wo koi arbitrary choice nahi karta — ambiguous-call compile error deta hai (CS0121), jisse developer ko explicitly disambiguate karna padta hai (jaise explicit cast se). Ye early-failure design hai. Options A, B, D sab galat behavior describe karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
