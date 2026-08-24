import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "runtime-poly-1",
    question: "```csharp\nShape s = new Circle { Radius = 5 };\nConsole.WriteLine(s.Area());\n```\nAgar `Area()` `Shape` me `virtual` aur `Circle` me `override` hai, kaunsa version chalega?",
    options: [
      "Shape.Area(), kyunki s ka declared type Shape hai",
      "Circle.Area(), kyunki runtime pe s ka ACTUAL type Circle hai",
      "Compile error aayega",
      "Dono versions ek saath chalenge",
    ],
    correctIndex: 1,
    explanation:
      "Virtual method dispatch runtime pe object ka ACTUAL type dekhta hai, declared reference type nahi. `s` declared to Shape hai, lekin actual object Circle hai, isliye Circle.Area() chalega. Option A overloading (compile-time) ke saath confuse kar raha hai. Options C aur D dono is mechanism ko galat represent karte hain.",
    difficulty: "easy",
  },
  {
    id: "runtime-poly-2",
    question: "CLR ka method table (vtable) kis level pe exist karta hai?",
    options: [
      "Har individual object apni khud ki alag method table carry karta hai",
      "Per-type — ek baar type-load time pe banta hai, aur us type ke saare objects usi shared table ka reference carry karte hain",
      "Method tables sirf abstract classes ke liye hote hain",
      "Method tables sirf interfaces ke liye hote hain",
    ],
    correctIndex: 1,
    explanation:
      "Method table per-TYPE hoti hai, per-instance nahi — CLR ek baar type load hone par table banata hai, aur us type ke har object me sirf ek pointer/handle hota hai jo us shared table ki taraf point karta hai. Option A galat hai (memory-wasteful bhi hota agar aisa hota). Options C aur D scope ko galat restrict karte hain — concrete classes ke virtual members ke liye bhi method tables hoti hain.",
    difficulty: "hard",
  },
  {
    id: "runtime-poly-3",
    question: "Virtual method call ka non-virtual call ke against kya real cost hai?",
    options: [
      "Koi cost nahi, dono bilkul identical hain",
      "Ek extra indirection — runtime method table lookup — jo chhota hai lekin genuinely real hai",
      "Virtual calls hamesha 10x slow hote hain",
      "Virtual calls extra heap memory allocate karte hain har call pe",
    ],
    correctIndex: 1,
    explanation:
      "Virtual dispatch me object ki actual type se method table lookup karni padti hai — ye ek extra indirection hai jo non-virtual (directly resolved) call me nahi hoti. Ye cost real hai lekin typically nanoseconds ka, jo 99% applications me irrelevant hai. Option A galat hai (zero-cost claim). Options C aur D exaggerated/incorrect claims hain.",
    difficulty: "medium",
  },
  {
    id: "runtime-poly-4",
    question: "`abstract` method ke baare me kaunsa statement sahi hai?",
    options: [
      "Abstract methods virtual nahi hote",
      "Abstract methods implicitly virtual hote hain, aur unhe mandatory override karna padta hai kyunki koi default implementation exist hi nahi karti",
      "Abstract methods kabhi override nahi ho sakte",
      "Abstract methods sirf interfaces me define ho sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Abstract member implicitly virtual hota hai aur uska koi body/default implementation nahi hoti — har concrete derived class ko usse mandatorily override karna hota hai. Option A factually galat hai. Option C is behavior ko ulta bataata hai. Option D galat hai — abstract methods abstract classes me bhi hote hain, interfaces alag concept hain.",
    difficulty: "medium",
  },
];

export default quiz;
