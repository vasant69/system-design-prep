import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dip-1",
    question: "DIP aur DI me exact difference kya hai?",
    options: [
      "Dono same cheez hain, sirf naam alag hai",
      "DIP ek design principle hai (kis pe depend karna chahiye — abstractions pe); DI ek technique hai (dependencies kaise supply hoti hain — bahar se)",
      "DIP sirf interfaces ke liye hai, DI sirf abstract classes ke liye",
      "DI hamesha DIP ko automatically follow karta hai",
    ],
    correctIndex: 1,
    explanation:
      "DIP ek design principle hai jo batata hai high-level modules ko abstractions pe depend karna chahiye. DI ek technique hai jo batata hai dependencies ko kaise supply karna hai (constructor/property/method se, bahar se). Dono related hain lekin independent — option D galat hai kyunki DI concrete classes ke saath bhi ho sakta hai jo DIP violate karta hai. Options A aur C dono factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "dip-2",
    question: "Ye code DI follow karta hai ya DIP, ya dono, ya koi nahi?\n```csharp\npublic class OrderService\n{\n    private readonly SqlOrderRepository _repository;\n    public OrderService(SqlOrderRepository repository) => _repository = repository;\n}\n```",
    options: [
      "Sirf DIP follow karta hai, DI nahi",
      "Sirf DI follow karta hai (dependency bahar se aa rahi hai) — DIP violate karta hai kyunki concrete class pe depend hai, abstraction pe nahi",
      "Dono follow karta hai",
      "Koi bhi nahi follow karta",
    ],
    correctIndex: 1,
    explanation:
      "Constructor dependency ko bahar se accept kar raha hai — ye DI hai. Lekin dependency type SqlOrderRepository ek CONCRETE class hai, interface nahi — isliye OrderService (high-level) directly SqlOrderRepository (low-level detail) pe depend kar raha hai, jo DIP violate karta hai. Ye exact wahi classic 'DI without DIP' trap hai.",
    difficulty: "hard",
  },
  {
    id: "dip-3",
    question: "Kya DIP follow karne ke liye ek DI container (jaise ASP.NET Core ka built-in container) zaroori hai?",
    options: [
      "Haan, DI container ke bina DIP follow karna technically impossible hai",
      "Nahi — DIP sirf 'abstraction pe depend karo' ke baare me hai; ye manual factory se bhi achieve ho sakta hai, DI container sirf wiring ko automate/scale karta hai",
      "Haan, lekin sirf ASP.NET Core me, dusre frameworks me nahi",
      "DIP aur DI container ka koi connection hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "DIP ek design-level principle hai — high-level module abstraction pe depend kare. Ye manual factory pattern se bhi achieve ho sakta hai (concrete implementation ek jagah decide karke, abstraction ke through pass karke). DI container sirf is wiring ko convenient aur scalable banata hai bade codebases ke liye, ye DIP ka hard requirement nahi hai. Options A aur C dono galat overclaim hain.",
    difficulty: "medium",
  },
  {
    id: "dip-4",
    question: "DIP me 'high-level module' aur 'low-level module' ka kya matlab hai?",
    options: [
      "High-level matlab bada/complex code, low-level matlab chhota/simple code",
      "High-level matlab business policy/logic (jaise OrderService), low-level matlab implementation details (jaise DB access, file I/O)",
      "High-level matlab UI layer, low-level matlab hamesha database layer",
      "Ye terms sirf microservices architecture me use hote hain",
    ],
    correctIndex: 1,
    explanation:
      "High-level modules wo hain jo business rules/policy define karte hain (jaise OrderService jo order-processing flow decide karta hai). Low-level modules implementation details hain (jaise SqlOrderRepository jo actual DB query karta hai). Ye code size ya complexity (option A) se related nahi hai, na hi ye specifically UI/DB layers tak limited hai (option C), aur ye general OOP design principle hai, microservices-specific nahi (option D).",
    difficulty: "medium",
  },
];

export default quiz;
