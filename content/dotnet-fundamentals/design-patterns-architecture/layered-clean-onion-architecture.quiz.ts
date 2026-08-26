import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "layered-clean-onion-1",
    question: "Classic Layered Architecture me Business Layer kis layer pe directly depend karta hai, aur ye kya problem create karta hai?",
    options: [
      "Presentation Layer pe — UI framework se coupling",
      "Data Access Layer pe — business logic ki testability/reusability infrastructure technology se coupled ho jaati hai",
      "Kisi bhi layer pe nahi, Business Layer independent hota hai",
      "Sirf Database pe, Data Access Layer bypass karke",
    ],
    correctIndex: 1,
    explanation:
      "Layered architecture me Business Layer directly Data Access Layer (aur uske through DbContext/EF Core jaisi technology) pe depend karta hai. Iska matlab business rules ki testability aur reusability infrastructure choices se coupled ho jaati hai — dependency direction wrong-way hai. Option A galat hai, Presentation upar hoti hai, Business us par depend nahi karta. Option C galat hai — ye exact problem hai jo topic explain karta hai. Option D galat hai, Data Access Layer bypass nahi hota, use hi hota hai.",
    difficulty: "medium",
  },
  {
    id: "layered-clean-onion-2",
    question: "Clean/Onion Architecture me Domain layer ki project-reference count (kitne doosre projects ko reference karta hai) kitni honi chahiye?",
    options: [
      "Sirf Infrastructure project ko",
      "Application aur Infrastructure dono ko",
      "Zero — Domain layer pure C# hota hai, koi outward dependency nahi",
      "Sirf database provider package ko",
    ],
    correctIndex: 2,
    explanation:
      "Clean/Onion Architecture ka core principle ye hai ki Domain layer bilkul center me hota hai aur usse koi outward dependency nahi hoti — koi EF Core reference, koi ASP.NET Core reference, koi outer-layer project reference. Ye isse framework-agnostic aur trivially unit-testable banata hai. Options A, B, aur D sab galat hain kyunki koi bhi outward reference Domain layer ke isolation principle ko violate karega.",
    difficulty: "medium",
  },
  {
    id: "layered-clean-onion-3",
    question: "Clean Architecture me `IOrderRepository` interface kahan define hona chahiye, aur iska implementation kahan hona chahiye?",
    options: [
      "Interface Infrastructure me, implementation Application me",
      "Dono Infrastructure layer me",
      "Interface Application layer me (consumer-side), implementation Infrastructure layer me — Dependency Inversion Principle",
      "Dono Domain layer me",
    ],
    correctIndex: 2,
    explanation:
      "Dependency Inversion Principle ka core idea: interface consumer-side (jahan use hoti hai — Application layer) define hoti hai, actual implementation infrastructure-side (jahan technology-specific code hai — EF Core based `EfCoreOrderRepository`) hoti hai. Ye ensure karta hai ki Application layer ko koi outward dependency (EF Core) na ho, sirf abstraction pe depend kare. Options A, B, aur D sab is inversion ko galat direction me ya galat jagah rakhte hain.",
    difficulty: "hard",
  },
  {
    id: "layered-clean-onion-4",
    question: "Ek chhoti, short-lived internal admin tool build karni hai jisme business logic minimal hai (mostly CRUD). Kaunsi architecture approach zyada practical hai, aur kyun?",
    options: [
      "Clean/Onion Architecture — hamesha best practice hai, har project me use karna chahiye",
      "Layered Architecture (ya even simpler single-project setup) — chhoti/simple projects me Clean Architecture ka multi-project structural overhead disproportionate hai",
      "Microservices architecture — scaling ke liye zaroori hai",
      "Koi bhi architecture use na karo, sab code ek hi Controller me likh do",
    ],
    correctIndex: 1,
    explanation:
      "Clean/Onion Architecture ka structural overhead (multiple projects, interfaces, extra indirection) genuinely worth hai jab business logic complex/long-lived ho aur testability priority ho. Chhote, short-lived, CRUD-heavy projects ke liye ye overkill hai — simpler Layered ya even single-project approach zyada practical hai. Option A galat hai — Clean Architecture universal best practice nahi, ek trade-off hai. Option C irrelevant hai, scaling ka is scenario se koi lena-dena nahi. Option D bhi galat hai — koi structure na hona maintainability ko severely hurt karega.",
    difficulty: "medium",
  },
];

export default quiz;
