import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "task-vs-thread-1",
    question: "`Task.FromResult(42)` call karne par internally kya hota hai?",
    options: [
      "ThreadPool se ek thread liya jaata hai jo turant 42 return kar deta hai",
      "Koi ThreadPool involvement nahi — ek already-completed Task<int> directly return ho jaata hai, koi genuine kaam nahi hota",
      "Ek naya background thread spawn hota hai jo async me value compute karta hai",
      "Compile error aata hai kyunki value already known hai",
    ],
    correctIndex: 1,
    explanation:
      "`Task.FromResult` koi actual asynchronous kaam nahi karta — ye sirf ek already-available value ko ek already-completed `Task<T>` me wrap kar deta hai, synchronously, bina kisi ThreadPool involvement ke. Options A aur C galat hain kyunki koi thread involve nahi hota. Option D bhi galat hai, ye valid, common pattern hai.",
    difficulty: "medium",
  },
  {
    id: "task-vs-thread-2",
    question: "Ek `Dictionary` se ek instant, in-memory lookup return karne wale async-signature method me, `Task.Run(() => dict[key])` use karne ka kya downside hai `Task.FromResult(dict[key])` ke comparison me?",
    options: [
      "Koi downside nahi, dono exactly same performance dete hain",
      "Task.Run ek unnecessary ThreadPool thread schedule-execute-return round-trip karta hai ek trivial, instant kaam ke liye — pure overhead",
      "Task.Run compile hi nahi hoga",
      "Task.Run galat result return karega",
    ],
    correctIndex: 1,
    explanation:
      "`Task.Run` genuinely ThreadPool ko kaam schedule karta hai — ek thread lena, execute karna, result wapas dena — is poore round-trip ka overhead hota hai. Ek instant, in-memory dictionary lookup jaise trivial kaam ke liye ye overhead pure waste hai, kyunki `Task.FromResult` same result zero overhead ke saath de sakta hai. Options A, C, D galat hain.",
    difficulty: "hard",
  },
  {
    id: "task-vs-thread-3",
    question: "`Task` aur `Thread` ke abstraction level me kya fundamental fark hai?",
    options: [
      "Dono exactly same level par kaam karte hain, sirf naam alag hai",
      "Thread ek low-level, direct OS construct hai; Task ek higher-level abstraction hai jo thread se decoupled hota hai (khaas taur par I/O-bound work ke liye)",
      "Task hamesha Thread se zyada slow hota hai",
      "Thread sirf CPU-bound kaam ke liye hai, Task sirf I/O-bound kaam ke liye",
    ],
    correctIndex: 1,
    explanation:
      "`Thread` directly ek OS-level construct hai. `Task` ek higher-level abstraction hai — kaam ko represent karta hai, thread se directly coupled nahi hota (I/O-bound async work ke liye koi dedicated thread involve nahi hota, jabki CPU-bound `Task.Run` ke liye ek ThreadPool thread involve hota hai). Options A, C, D is distinction ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "task-vs-thread-4",
    question: "Ek unit test suite me mock `IPaymentGateway.ChargeAsync()` implementation `Task.Run(() => \"success\")` use kar rahi hai. Ye tests ko slow kyun bana sakta hai?",
    options: [
      "Task.Run hamesha compile-time error deta hai tests me",
      "Har mock call ThreadPool par ek genuine schedule-execute-return cycle kar rahi hai, jabki result already trivially known hai — hazaaron test cases me ye overhead accumulate hota hai",
      "Task.Run tests me allowed hi nahi hai",
      "Ye galat result return karega, isliye tests fail honge",
    ],
    correctIndex: 1,
    explanation:
      "Har `Task.Run` call ek real ThreadPool scheduling round-trip karta hai, chahe kaam trivial ho. Ek large test suite me jahan ye pattern har mock call me repeat hota hai, ye overhead accumulate hokar noticeable slowdown de sakta hai. `Task.FromResult(\"success\")` same result zero scheduling overhead ke saath deta — options A, C, D factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
