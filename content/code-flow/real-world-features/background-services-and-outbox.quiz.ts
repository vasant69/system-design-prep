import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "background-services-and-outbox-1",
    question:
      "Ek `BackgroundService` ke andar tumhe `AppDbContext` chahiye. `AppDbContext` scoped hai aur hosted service singleton. Sahi tareeka kya hai?",
    options: [
      "`AppDbContext` ko seedha constructor me inject kar do",
      "`IServiceScopeFactory` inject karo aur har unit of work pe `CreateScope()` karke us scope se `AppDbContext` resolve karo",
      "`AppDbContext` ki registration ko singleton bana do",
      "`DbContextOptions` inject karke har baar `new AppDbContext(options)` bana lo",
    ],
    correctIndex: 1,
    explanation:
      "Hosted service singleton hai, isliye usme scoped `DbContext` nahi consume kar sakte. `IServiceScopeFactory` singleton-safe hai; har iteration me `CreateScope()` se ek fresh scope banao aur usse context resolve karo, bilkul jaise framework har HTTP request ke liye karta hai. Option A startup pe error ya app-lifetime context deta hai (change-tracker leak, races). Option C `DbContext` ko singleton banana thread-safety aur stale-data bugs deta hai — ye kabhi nahi karte. Option D partially chalega par connection string / interceptors / pooling config DI se bypass ho jaata hai; scope banana clean aur idiomatic hai.",
    difficulty: "medium",
  },
  {
    id: "background-services-and-outbox-2",
    question:
      "Dual-write problem kya hai jo transactional outbox solve karta hai?",
    options: [
      "Ek hi row ko do threads ek saath update karte hain",
      "DB me change commit karna aur message broker pe event publish karna do alag systems hain bina shared transaction ke — beech me crash se event kho ya duplicate ho jaata hai",
      "Do database connections ek hi request me khulti hain",
      "Ek employee do baar create ho jaata hai kyunki client ne request retry ki",
    ],
    correctIndex: 1,
    explanation:
      "Dual-write = do independent systems (SQL Server + broker) ko atomically update karne ki koshish bina distributed transaction ke. Agar pehle DB save phir publish karo aur publish se pehle crash ho, event kabhi nahi jaata; ulta karo to DB save fail hone par event jhootha chala jaata hai. Outbox dono writes (domain row + outbox row) ko ek local DB transaction me daal deta hai. Option A concurrency issue hai, dual-write nahi. Option C connection management hai. Option D idempotency/dedup ka alag problem hai.",
    difficulty: "medium",
  },
  {
    id: "background-services-and-outbox-3",
    question:
      "Outbox dispatcher publish ke baad `ProcessedAtUtc` set karne se pehle crash ho jaata hai. Restart pe kya hota hai, aur iska design implication kya hai?",
    options: [
      "Message kho jaata hai; isliye outbox reliable nahi hai",
      "Wahi message dobara publish hota hai; isliye consumers ko message-id pe idempotent hona chahiye (at-least-once delivery)",
      "Dispatcher startup pe crash kar jaata hai kyunki row inconsistent hai",
      "EF Core automatically rollback karke message ko dobara pending kar deta hai broker se",
    ],
    correctIndex: 1,
    explanation:
      "Row abhi `ProcessedAtUtc == null` hai, isliye agle poll pe wahi message dobara uthega aur dobara publish hoga — ye at-least-once delivery hai. Design implication: har event me ek unique id bhejo aur consumer 'ye id already process kiya?' check kare (idempotent consumer). At-least-once + idempotent consumer = effectively-once. Option A galat — message committed outbox row me safe hai, kabhi nahi khota. Option C galat — row bilkul valid hai, bas unsent. Option D galat — broker publish EF transaction ka hissa nahi, koi automatic rollback nahi.",
    difficulty: "hard",
  },
  {
    id: "background-services-and-outbox-4",
    question:
      "`ExecuteAsync` ke `PeriodicTimer` loop me iteration body ko `try/catch` me lapetna kyun zaroori hai?",
    options: [
      "Warna `PeriodicTimer` overlapping ticks fire karne lagta hai",
      "Warna ek transient error (DB blip) se poora `ExecuteAsync` complete ho jaata hai aur job app restart tak dobara nahi chalti",
      "`try/catch` ke bina `stoppingToken` cancel nahi hota",
      "Compiler `async` method me `try/catch` mandatory karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar loop body me exception bubble ho jaaye, `ExecuteAsync` ka `Task` faulted/completed ho jaata hai aur background service us process life me dobara nahi chalti — ek DB blip poora job permanently gira deta hai. Isliye har iteration: `try` kaam, `catch (OperationCanceledException) break` (clean shutdown), `catch (Exception) log aur loop me raho`. Option A galat — `PeriodicTimer` khud non-overlapping hai, `try/catch` se iska koi lena-dena nahi. Option C galat — token cancellation host se aata hai. Option D galat — aisa koi compiler rule nahi.",
    difficulty: "medium",
  },
];

export default quiz;
