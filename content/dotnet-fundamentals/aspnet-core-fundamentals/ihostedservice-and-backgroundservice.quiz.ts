import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "hostedservice-1",
    question: "Ek `BackgroundService` ke constructor me directly `AppDbContext` (Scoped lifetime) inject karne ki koshish ki jaati hai. Kya hoga?",
    options: [
      "Bina kisi issue ke kaam karega",
      "Captive-dependency mismatch — BackgroundService Singleton hai, DbContext Scoped hai; IServiceScopeFactory use karke manually scope create karna padega",
      "DbContext automatically Singleton ban jaayega",
      "BackgroundService khud automatically Scoped ban jaayega",
    ],
    correctIndex: 1,
    explanation:
      "BackgroundService/IHostedService implementations Singleton lifetime pe register hoti hain. Scoped dependency (DbContext) ko directly Singleton ke constructor me inject karna captive-dependency problem hai — DI validation isse catch kar sakta hai. Sahi approach IServiceScopeFactory inject karke har execution cycle me CreateScope() call karna hai. Options A, C, D is lifetime-mismatch ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "hostedservice-2",
    question: "Ek app 3 instances me horizontally scaled hai, aur har instance apna khud ka BackgroundService chala raha hai jo 'daily report generate karo' karta hai. Kya problem hogi?",
    options: [
      "Koi problem nahi, sab instances automatically coordinate kar lenge",
      "Report sirf ek baar generate hoga, baaki instances automatically skip kar denge",
      "Teeno instances independently apna copy chalayenge — report 3 baar duplicate generate/send ho sakta hai",
      "App crash ho jaayegi kyunki multiple instances same service nahi chala sakte",
    ],
    correctIndex: 2,
    explanation:
      "BackgroundService ke paas koi built-in distributed coordination nahi hai — har app instance apna independent copy chalata hai, unhe ek doosre ka pata hi nahi hota. Isliye 'run once globally' type ke jobs har instance pe duplicate chalte hain. Options A, B, D is fundamental limitation ko galat represent karte hain — koi automatic coordination/skip/crash nahi hota.",
    difficulty: "hard",
  },
  {
    id: "hostedservice-3",
    question: "`PeriodicTimer` (.NET 6+) `Task.Delay`-based looping se kaise better hai?",
    options: [
      "PeriodicTimer background threads use nahi karta, isliye zero overhead hai",
      "PeriodicTimer drift-resistant, fixed intervals maintain karta hai (work-duration se independent) aur cancellation ko cleanly respect karta hai",
      "PeriodicTimer sirf synchronous code me use ho sakta hai",
      "Task.Delay deprecated ho chuka hai, sirf PeriodicTimer use karna mandatory hai",
    ],
    correctIndex: 1,
    explanation:
      "Task.Delay-based loop me total cycle time = work time + delay time, jisse actual interval drift kar sakta hai. PeriodicTimer.WaitForNextTickAsync() zyada precise, fixed-interval ticking deta hai independent of work duration, plus cancellation semantics cleaner hain. Options A, C, D PeriodicTimer ke actual benefits/constraints ko galat represent karte hain — Task.Delay deprecated nahi hai, sirf recommended alternative hai.",
    difficulty: "medium",
  },
  {
    id: "hostedservice-4",
    question: "Ek job ko app restart survive karna chahiye, retry-with-backoff chahiye on failure, aur dashboard se monitor hona chahiye. BackgroundService is requirement ke liye sufficient hai kya?",
    options: [
      "Haan, BackgroundService ye sab features built-in provide karta hai",
      "Nahi — BackgroundService ka work app restart pe lost ho jaata hai aur koi persistence/dashboard nahi hai; Hangfire ya Quartz.NET jaisa dedicated scheduler chahiye",
      "Haan, bas PeriodicTimer use karne se ye sab automatic mil jaata hai",
      "Nahi, is requirement ke liye koi .NET solution exist hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "BackgroundService purely in-process hai — restart pe koi persistence nahi, koi built-in retry-with-backoff nahi, koi dashboard nahi. Ye requirements exactly wahi hain jo dedicated job schedulers (Hangfire, Quartz.NET) solve karte hain apne persistent job store aur monitoring tools ke saath. Options A aur C in missing capabilities ko galat represent karte hain; D galat hai kyunki solutions exist karte hain (.NET ecosystem me).",
    difficulty: "medium",
  },
];

export default quiz;
