import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "behavioural-patterns-1",
    question: "C# ka `event` keyword kis behavioural design pattern ka language-level implementation hai?",
    options: [
      "Command",
      "Template Method",
      "Observer",
      "Chain of Responsibility",
    ],
    correctIndex: 2,
    explanation:
      "`event` keyword Observer pattern ka direct implementation hai — ek subject (publisher) apni state change hone par multiple observers (subscribers) ko notify karta hai, bina unhe directly jaante hue. Command (A) ek request ko object me encapsulate karta hai, is scenario me applicable nahi. Template Method (B) algorithm ka skeleton fix karta hai, events se unrelated hai. Chain of Responsibility (D) sequential handler chain hai, broadcast-style notification nahi.",
    difficulty: "easy",
  },
  {
    id: "behavioural-patterns-2",
    question: "Template Method aur Strategy pattern me primary difference kya hai?",
    options: [
      "Template Method composition-based hai, Strategy inheritance-based hai",
      "Template Method inheritance-based hai (base class algorithm skeleton fix karta hai, subclasses steps override karte hain), Strategy composition-based hai (poora algorithm swap hota hai)",
      "Dono exactly same hain, sirf naam alag hai",
      "Template Method sirf static methods ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Template Method inheritance use karta hai — base class me algorithm ka poora skeleton (steps ka order) fixed rehta hai, subclasses sirf specific abstract/virtual steps override karte hain. Strategy composition use karta hai — poora algorithm hi ek interchangeable object hota hai jo runtime pe inject/swap kiya ja sakta hai. Option A reverse hai (galat), option C dono ko same bata raha hai (galat — genuinely different mechanisms hain), option D factually galat hai.",
    difficulty: "medium",
  },
  {
    id: "behavioural-patterns-3",
    question: "ASP.NET Core ka middleware pipeline (`app.Use(...)` chain) kaunsa design pattern demonstrate karta hai?",
    options: [
      "Observer",
      "Command",
      "Chain of Responsibility",
      "Template Method",
    ],
    correctIndex: 2,
    explanation:
      "Middleware pipeline Chain of Responsibility ka canonical real-world .NET example hai — har middleware component request ko receive karta hai, decide karta hai handle karna hai ya next component ko pass karna hai (ya dono), aur sequence me chain ki tarah kaam karta hai. Observer (A) broadcast-style notification hai, applicable nahi. Command (B) request ko object me encapsulate karta hai. Template Method (D) fixed algorithm skeleton hai, sequential handoff se unrelated.",
    difficulty: "easy",
  },
  {
    id: "behavioural-patterns-4",
    question: "MediatR-style CQRS command/query objects (`IRequest<TResponse>` + `IRequestHandler`) kaunse foundational design pattern par based hain?",
    options: [
      "Adapter",
      "Command — ek request ko standalone, executable object me encapsulate karna",
      "Facade",
      "Composite",
    ],
    correctIndex: 1,
    explanation:
      "MediatR ka `IRequest`/`IRequestHandler` pair Command pattern ka framework-level, standardized implementation hai — request khud ek self-contained object hai jo apna execution logic se decoupled hai, taaki queue/log/undo/later-execute kiya ja sake. Adapter (A) incompatible interfaces translate karta hai. Facade (C) multi-subsystem orchestration hide karta hai. Composite (D) tree structures ke liye hai — koi bhi is scenario me applicable nahi.",
    difficulty: "medium",
  },
];

export default quiz;
