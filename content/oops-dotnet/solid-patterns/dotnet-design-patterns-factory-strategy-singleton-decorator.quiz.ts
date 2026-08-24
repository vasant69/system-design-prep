import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "patterns-1",
    question: "Classic GoF Singleton pattern (static instance + private constructor) ko modern ASP.NET Core me anti-pattern kyun mana jaata hai?",
    options: [
      "Kyunki ye compile nahi hota .NET 8 me",
      "Kyunki ye global mutable state create karta hai, testability todta hai (mock nahi kar sakte), aur thread-safety manually handle karni padti hai",
      "Kyunki Singleton pattern khud outdated ho chuka hai aur kisi bhi form me use nahi hona chahiye",
      "Kyunki ASP.NET Core Singleton lifetime support hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Classic static-instance Singleton problematic hai kyunki wo global state banata hai jo unit testing me mock nahi ho sakta, aur thread-safe instantiation manually handle karni padti hai. Option A galat hai (ye valid compiling code hai). Option C galat hai — Singleton PATTERN khud problematic nahi hai, uska classic IMPLEMENTATION hai; DI container ka AddSingleton wahi guarantee properly deta hai. Option D bilkul galat hai, ASP.NET Core explicitly AddSingleton support karta hai.",
    difficulty: "medium",
  },
  {
    id: "patterns-2",
    question: "Decorator pattern ka core purpose kya hai?",
    options: [
      "Ek naya concrete type runtime pe decide karke banana",
      "Ek existing implementation ko same-interface wrapper se wrap karna taaki naya behavior (jaise caching/logging) add ho bina original class modify kiye",
      "Multiple unrelated interfaces ko ek class me combine karna",
      "Ek class ko further inheritance se rokna",
    ],
    correctIndex: 1,
    explanation:
      "Decorator pattern (jaisa CachingOrderServiceDecorator example) same interface implement karke ek real implementation ko wrap karta hai, cross-cutting behavior add karta hai bina us real implementation ko touch kiye. Option A Factory pattern ki definition hai. Option C aur D dono unrelated concepts hain (D `sealed` keyword se related hai).",
    difficulty: "medium",
  },
  {
    id: "patterns-3",
    question: "IOptions<T> pattern (Options pattern) kis problem ko solve karta hai?",
    options: [
      "Database connections ko pool karna",
      "Strongly-typed, DI-integrated configuration binding — appsettings.json values ko typed C# classes me bind karna, magic strings avoid karke",
      "HTTP requests ko cache karna",
      "Multiple threads ke beech data share karna",
    ],
    correctIndex: 1,
    explanation:
      "Options pattern configuration values ko strongly-typed classes me bind karta hai (jaise EmailSettings), jo Configuration['Email:SmtpHost'] jaisi magic-string based access se better hai — compile-time safety aur DI-friendly. Options A, C, D sab unrelated concerns hain jo Options pattern se match nahi karte.",
    difficulty: "medium",
  },
  {
    id: "patterns-4",
    question: "Mediator/MediatR pattern controllers me kya problem solve karta hai?",
    options: [
      "Controller ko database se directly connect karta hai",
      "Controller ko directly service methods call karne ki jagah, ek request object ko central dispatcher (IMediator) ko bhejta hai jo sahi handler dhoondh kar call karta hai — decoupling",
      "HTTP routing ko automatically generate karta hai",
      "Sirf microservices architecture me hi use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Mediator pattern controller aur actual business-logic-handling code ke beech direct coupling hatata hai — controller ek query/command object bhejta hai, IMediator sahi handler ko route karta hai. Options A aur C unrelated hain. Option D galat hai — Mediator/CQRS monoliths me bhi useful hai, microservices-specific nahi.",
    difficulty: "hard",
  },
];

export default quiz;
