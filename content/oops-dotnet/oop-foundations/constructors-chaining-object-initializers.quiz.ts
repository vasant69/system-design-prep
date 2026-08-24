import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "constructors-1",
    question: "Agar ek class me developer explicitly ek parameterized constructor likh de aur koi parameterless constructor na likhe, to kya hoga?",
    options: [
      "Compiler khud parameterless constructor bhi add kar dega, jaisa har class me hota hai",
      "Ab `new ClassName()` (bina arguments ke) compile error dega — explicit constructor likhne ke baad compiler default parameterless constructor generate karna band kar deta hai",
      "Ye ek runtime error dega jab koi parameterless call karega",
      "Class instantiate hi nahi ho sakegi kabhi",
    ],
    correctIndex: 1,
    explanation:
      "Compiler sirf tab implicit parameterless constructor generate karta hai jab koi explicit constructor define na kiya ho. Jaise hi tum koi bhi custom constructor likhte ho, ye implicit generation ruk jaata hai — parameterless version bhi chahiye to explicitly likhna padega. Options A, C, D is compile-time behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "constructors-2",
    question: "```csharp\npublic class Debug\n{\n    public int Value { get; set; }\n    public Debug() { Value = 100; Console.WriteLine(\"ctor ran, \" + Value); }\n}\n\nvar d = new Debug { Value = 5 };\n```\nConsole pe kya print hoga, aur `d.Value` ki final value kya hogi?",
    options: [
      "'ctor ran, 5' print hoga, d.Value == 5",
      "'ctor ran, 100' print hoga, d.Value == 5 — constructor pehle poora run hota hai (Value=100), phir object-initializer Value ko 5 se overwrite karta hai",
      "'ctor ran, 100' print hoga, d.Value == 100 — object-initializer sirf naya object bana deta hai constructor ke bina",
      "Compile error, ek hi property do baar set nahi ho sakti",
    ],
    correctIndex: 1,
    explanation:
      "Constructor object-initializer se PEHLE poora run hota hai — isliye console pe 'ctor ran, 100' print hota hai (us waqt Value 100 tha). Uske baad object-initializer ki assignment (`Value = 5`) run hoti hai, jo Value ko overwrite karke 5 kar deti hai. Final d.Value 5 hai. Options A, C, D is exact sequencing ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "constructors-3",
    question: "`: this(...)` constructor chaining ka primary purpose kya hai?",
    options: [
      "Do alag classes ke constructors ko link karna",
      "Ek constructor doosre (usi class ke) constructor ko call kare, taaki common initialization logic duplicate na ho",
      "Constructor ko async banana",
      "Multiple inheritance simulate karna",
    ],
    correctIndex: 1,
    explanation:
      "`: this(...)` sirf USI class ke andar ek constructor se doosre ko call karne ke liye hai — DRY principle follow karte hue common init logic ek jagah rakhne ke liye. Base class ka constructor call karne ke liye `: base(...)` use hota hai, ye alag syntax hai. Options A, C, D factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "constructors-4",
    question: "Primary constructors (C# 12) ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye sirf structs ke liye available hain, classes ke liye nahi",
      "Class declaration ke parentheses me parameters likh sakte ho, jo poore class scope me available rehte hain — boilerplate kam karte hain simple classes ke liye",
      "Ye traditional constructors se completely alag ek naya OOP concept hai jisme inheritance kaam nahi karta",
      "Primary constructor use karne par object-initializer syntax disable ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Primary constructors (C# 12, 2023) class declaration line me hi parameters define karne dete hain (jaise `class Order(string productId)`), jo poore class body me available rehte hain, boilerplate kam karte hain. Ye classes aur structs dono ke liye available hai, inheritance normal tarah kaam karta hai, aur object-initializer syntax bhi normally kaam karta hai. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
