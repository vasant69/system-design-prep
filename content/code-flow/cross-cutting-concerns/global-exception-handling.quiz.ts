import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "global-exception-handling-1",
    question:
      "`EmployeeService.CreateAsync` me duplicate PAN par `SaveChangesAsync` ek `DbUpdateException` throw karta hai, aur kisi ne use catch nahi kiya. Global handler nahi laga hua. Client ko kya milta hai?",
    options: [
      "`400 Bad Request` with a clean validation message",
      "`409 Conflict` with `An employee with this PAN already exists.`",
      "`500 Internal Server Error` with the raw SQL text including the table aur unique index ka naam",
      "`204 No Content` — exception silently swallow ho jaata hai",
    ],
    correctIndex: 2,
    explanation:
      "Bina global handler ke, unhandled exception `500` banta hai aur default response me internal exception message (SQL constraint name, table name) leak ho sakta hai — ye information-disclosure vulnerability hai, BFSI audit me instant fail. Option 1/2 galat: framework khud se `DbUpdateException` ko `400`/`409` me map nahi karta — wo mapping tumhein `IExceptionHandler` me likhni padti hai. Option 4 galat: exception swallow nahi hota, request fail hoti hai.",
    difficulty: "medium",
  },
  {
    id: "global-exception-handling-2",
    question:
      "`AppExceptionHandler.TryHandleAsync` me tumne `NotFoundException` ke liye response likh diya aur `return true` kiya. Iska matlab kya hai?",
    options: [
      "Exception ab bhi re-throw hoti hai aur agla handler bhi chalega",
      "Handler ne exception handle kar liya — response written hai, koi aur handler ya default `500` nahi chalega",
      "`true` sirf logging ke liye hai, response par koi asar nahi",
      "`UseExceptionHandler` `true` ko ignore karta hai aur hamesha `500` bhejta hai",
    ],
    correctIndex: 1,
    explanation:
      "`IExceptionHandler.TryHandleAsync` ka `bool` return hi contract hai: `true` = maine handle kar liya, pipeline ruk jaati hai; `false` = ye exception mera nahi, agla registered handler try kare. Sab handler `false` de to framework default `500 ProblemDetails` (bina detail) bhejta hai. Isliye ordering matter karti hai — pehla `true` dene wala jeetta hai.",
    difficulty: "easy",
  },
  {
    id: "global-exception-handling-3",
    question:
      "`500` (unexpected) case me `ProblemDetails.Detail` ko kya set karna chahiye?",
    options: [
      "`exception.ToString()` taaki debugging aasan ho",
      "`exception.Message`",
      "`null` — sirf generic title aur `traceId` bhejo, exception detail nahi",
      "Poora stack trace, lekin sirf `application/problem+json` content type ke saath",
    ],
    correctIndex: 2,
    explanation:
      "`500` pe client ko internal detail bhejna information disclosure hai — SQL text, file paths, connection info leak hote hain. Sahi shape: generic title (`An unexpected error occurred`) + `traceId` extension, aur `Detail = null`. Support engineer `traceId` se server logs me exact exception dhoondh leta hai. Expected exceptions (`NotFound`, `Conflict`) pe `exception.Message` dena theek hai kyunki wo safe, business-friendly text hota hai.",
    difficulty: "medium",
  },
  {
    id: "global-exception-handling-4",
    question:
      "Tumne `AddExceptionHandler<AppExceptionHandler>()` aur `app.UseExceptionHandler()` to laga diya, par `AddProblemDetails()` register karna bhool gaye. Sabse sambhavit natija?",
    options: [
      "App start hi nahi hoga — startup exception aayega",
      "`IProblemDetailsService.TryWriteAsync` `false` return kar sakta hai / default fallback response jaata hai jo tumhare custom `ProblemDetails` fields (jaise `traceId`, `errors`) drop kar deta hai",
      "Sab kuch normal chalega — `AddProblemDetails()` optional hai aur koi farq nahi padta",
      "Har response `application/xml` me chala jaayega",
    ],
    correctIndex: 1,
    explanation:
      "`AddProblemDetails()` `IProblemDetailsService` ko DI me register karta hai aur framework ko bolta hai error responses RFC 7807 shape me generate kare. Iske bina `_problemDetailsService.TryWriteAsync(...)` `false` de sakta hai ya framework ka bare fallback chalta hai jo tumhare traceId / errors extensions ko serialize nahi karta. App crash nahi karta (option 1 galat), aur farq zaroor padta hai (option 3 galat).",
    difficulty: "hard",
  },
];

export default quiz;
