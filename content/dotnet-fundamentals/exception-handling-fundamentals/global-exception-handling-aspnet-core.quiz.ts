import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "globalex-1",
    question: "`IExceptionFilter` aur `UseExceptionHandler` middleware me sabse bada structural fark kya hai?",
    options: [
      "Koi fark nahi, dono identical hain",
      "`IExceptionFilter` sirf MVC action-invocation pipeline ke andar chalta hai; middleware-level handling poore request pipeline ko cover karta hai",
      "`IExceptionFilter` sirf minimal APIs ke liye hai",
      "`UseExceptionHandler` sirf development environment me kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`IExceptionFilter` MVC-specific hai — sirf action-invocation pipeline ke andar exceptions ko catch karta hai. Middleware-level handling (`UseExceptionHandler`/`IExceptionHandler`) poore request pipeline ka part hai — MVC controllers, minimal API endpoints, custom middleware, sab jagah se aayi exceptions ko cover karta hai.",
    difficulty: "medium",
  },
  {
    id: "globalex-2",
    question: "`IExceptionFilter.OnException` method me exception handle karne ke baad `context.ExceptionHandled = true` set na kiya jaaye to kya hoga?",
    options: [
      "Compile error aayega",
      "Exception silently swallow ho jaayega, koi response nahi jaayega",
      "Exception filter ke baad bhi aage propagate hota rahega, jaise filter ne kuch kiya hi nahi",
      "Filter dobara automatically call hoga",
    ],
    correctIndex: 2,
    explanation:
      "`ExceptionHandled = true` explicitly batata hai ki exception ko handle kar liya gaya hai, ab aage propagate mat karo. Iske bina, chahe filter ne `context.Result` set kar diya ho, exception technically ab bhi 'unhandled' maana jaayega aur aage propagate hota rahega, jo confusing behavior create karta hai.",
    difficulty: "hard",
  },
  {
    id: "globalex-3",
    question: ".NET 8 me introduce hua `IExceptionHandler` interface `UseExceptionHandler`-style delegate approach se kis wajah se better hai?",
    options: [
      "Ye faster hai runtime pe",
      "Ye testable, DI-composable hai, aur multiple handlers chain ho sakte hain jo order me try hote hain",
      "Ye sirf minimal APIs support karta hai",
      "Ye automatically sab exceptions ko log kar deta hai bina kisi code ke",
    ],
    correctIndex: 1,
    explanation:
      "`IExceptionHandler` ek proper class hai jo dependency injection le sakti hai (jaise `ILogger`), unit-testable hai, aur multiple handlers register kiye ja sakte hain jo order me try hote hain jab tak koi `true` return na kare — ye purane single-delegate `UseExceptionHandler` approach se zyada composable/maintainable design hai.",
    difficulty: "medium",
  },
  {
    id: "globalex-4",
    question: "`IExceptionFilter` ke `ExceptionContext` me kaunsi cheez available hoti hai jo middleware-level exception handling me directly available nahi hoti?",
    options: [
      "HTTP status code",
      "MVC-specific context jaise ActionDescriptor, RouteData, ModelState",
      "Request headers",
      "Response body",
    ],
    correctIndex: 1,
    explanation:
      "Middleware pure HTTP request/response level pe operate karta hai — usse MVC-specific concepts (kaunsa action fail hua, route data, model state) directly nahi dikhte. `IExceptionFilter` ka `ExceptionContext` MVC pipeline ka part hone ki wajah se ye rich, action-level context expose karta hai.",
    difficulty: "medium",
  },
];

export default quiz;
