import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "exception-handling-and-problem-details-1",
    question: "Exception filters aur UseExceptionHandler middleware me scope ka kya farak hai?",
    options: [
      "Dono exactly same scope cover karte hain",
      "Exception filters sirf action execution ke andar aayi exceptions catch karte hain; middleware routing, model binding, aur non-MVC exceptions bhi catch kar sakta hai",
      "Exception filters sirf 500 errors ke liye hain, middleware sirf 400 errors ke liye",
      "Middleware sirf development environment me kaam karta hai",
    ],
    correctIndex: 1,
    explanation: "Exception filters MVC pipeline ke andar, sirf action execution scope tak limited hain. UseExceptionHandler middleware pipeline ke top pe hone ki wajah se routing, model binding, aur non-MVC middleware se aayi exceptions bhi catch kar sakta hai — isliye global safety net ke liye middleware zyada reliable hai.",
    difficulty: "medium",
  },
  {
    id: "exception-handling-and-problem-details-2",
    question: "ProblemDetails (RFC 7807) me kaunse standard fields hote hain?",
    options: [
      "id, message, code, trace",
      "type, title, status, detail, instance",
      "error, description, timestamp",
      "exceptionType, stackTrace, innerException",
    ],
    correctIndex: 1,
    explanation: "RFC 7807 ProblemDetails shape me type, title, status, detail, aur instance fields define kiye gaye hain — ye consistent error response format deta hai chahe error validation ka ho ya server crash ka. Stack trace jaisi internal details is standard shape ka part nahi hain, aur production me expose bhi nahi honi chahiye.",
    difficulty: "easy",
  },
  {
    id: "exception-handling-and-problem-details-3",
    question: "Multiple IExceptionHandler implementations register kiye ho to unka execution order kaisa hota hai?",
    options: [
      "Alphabetical order se try hote hain",
      "Registration order me try hote hain, jo pehla true return kare wahi 'handled' maan liya jaata hai",
      "Sab ek saath parallel me chalte hain",
      "Sirf last registered handler kaam karta hai, baaki ignore ho jaate hain",
    ],
    correctIndex: 1,
    explanation: "IExceptionHandler implementations registration order me try hote hain. Jo handler TryHandleAsync se true return karta hai, wahi exception ko handled maan liya jaata hai aur chain wahin ruk jaati hai — isliye specific handlers ko catch-all/generic handler se pehle register karna important hai.",
    difficulty: "hard",
  },
  {
    id: "exception-handling-and-problem-details-4",
    question: "Production API me exception ka actual message ya stack trace client ko directly return karna kyun bura practice hai?",
    options: [
      "Response size badh jaata hai aur latency increase hoti hai",
      "Internal implementation details, file paths, ya connection info leak ho sakti hain — ye information disclosure security risk hai",
      "JSON serialization fail ho jaata hai",
      "Client-side frameworks stack trace parse nahi kar sakte",
    ],
    correctIndex: 1,
    explanation: "Stack trace ya raw exception message me internal class names, file paths, kabhi-kabhi connection strings jaisi sensitive information ho sakti hai jo attacker ko system ke internals samajhne me madad karti hai. Sahi approach hai generic message client ko dena aur actual details sirf server-side logs me, saath me ek correlation ID.",
    difficulty: "medium",
  },
];

export default quiz;
