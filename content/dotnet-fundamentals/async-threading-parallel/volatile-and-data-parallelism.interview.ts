import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "volatile-tr-1",
    question: "`volatile` keyword exactly kya guarantee karta hai, aur kya NAHI karta?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS"],
    shortAnswer:
      "Memory-visibility guarantee karta hai (reads/writes reorder/cache nahi honge) — atomicity NAHI deta, compound operations abhi bhi race condition ho sakte hain.",
    detailedAnswer:
      "`volatile` compiler aur CPU ko us field ke reads/writes reorder karne ya register/cache me hold karne se rokta hai — har access directly main memory se hota hai, isliye ek thread ka write doosre threads ko reliably, bina delay ke visible hota hai. Lekin ye field pe hone wale compound operations (jaise `x++`, ya check-then-act) ko atomic nahi banata — wo ab bhi multiple steps hain jo interleave ho sakte hain. `volatile` sirf visibility solve karta hai, atomicity nahi.",
    followUp: "To phir ek simple `_isRunning` flag ke liye `volatile` kaafi hai, lekin ek counter ke liye kyun nahi?",
  },
  {
    id: "volatile-tr-2",
    question: "Ye code diya gaya hai:\n```csharp\nprivate volatile bool _isRunning = true;\n\npublic void Worker()\n{\n    while (_isRunning)\n    {\n        DoWork();\n    }\n}\n\npublic void Stop() => _isRunning = false;\n```\n`volatile` yahan kyun appropriate use case hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Kyunki ye ek simple, single write / single read pattern hai — koi compound operation nahi, sirf ye ensure karna hai ki `Stop()` ka write `Worker()` ke loop ko turant dikhe.",
    detailedAnswer:
      "Is scenario me sirf ek boolean flag hai jise ek thread set karta hai (`Stop()`) aur doosra thread poll karta hai (`Worker()`'s while condition) — koi read-modify-write compound operation nahi hai. `volatile` yahan exactly wahi guarantee deta hai jiski zaroorat hai: `_isRunning = false` likhne ke baad, `Worker()` loop agli iteration me fresh value dekhega, kisi stale cached copy se nahi. Ye `volatile` ka textbook-correct use case hai.",
  },
  {
    id: "volatile-tr-3",
    question: "Kya ye statement sahi hai: 'agar mai apne shared counter ko `volatile` bana dun, mujhe ab lock ki zaroorat nahi rahegi'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — `volatile` compound operations (increment, check-then-act) ko atomic nahi banata. Counter ke liye still lock ya Interlocked chahiye.",
    detailedAnswer:
      "Ye ek common, dangerous misconception hai. `volatile int _count` bhi `_count++` ko safe nahi banata, kyunki increment abhi bhi read-then-write hai jo interleave ho sakta hai multiple threads ke beech, exactly jaisa non-volatile field ke saath hota. Genuine fix ya to `Interlocked.Increment(ref _count)` (single atomic operation ke liye) ya `lock` (agar counter ke saath koi aur logic bhi group karni hai). `volatile` sirf memory-visibility solve karta hai, kabhi atomicity nahi.",
    redFlag: "'volatile laga diya hai, ab thread-safe hai' bolna kisi bhi compound operation ke context me.",
  },
  {
    id: "volatile-tr-4",
    question: "`Parallel.ForEach` aur `async`/`await` — dono 'concurrency' se related lagte hain. In dono me kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "`Parallel.ForEach` CPU-bound, independent, multi-core-parallelizable work ke liye; `async`/`await` I/O-bound work ke liye jahan thread ko wait ke dauraan block nahi karna chahiye.",
    detailedAnswer:
      "`Parallel.ForEach` multiple CPU cores ko simultaneously utilize karta hai heavy computation ke liye — har core apna chunk of work independently process karta hai, wall-clock time kam hota hai. `async`/`await` ka goal alag hai — I/O-bound operation (network call, disk read) ke wait time ke dauraan calling thread ko free kar dena, taaki wo thread doosra kaam kar sake, block hone ke bajaye. In dono ko mix karna (jaise `Parallel.ForEach` ke andar `await` lagana bina samjhe) subtle bugs create kar sakta hai — `Parallel.ForEach` async lambdas ke liye designed nahi hai by default.",
    followUp: "Agar tumhe I/O-bound operations ko bhi 'parallel' chalana ho (jaise 100 URLs fetch karna), sahi approach kya hoga?",
  },
  {
    id: "volatile-tr-5",
    question: "Ek batch job me 1 million records ko independently transform karna hai (koi shared state nahi, pure CPU computation). Sequential `foreach` vs `Parallel.ForEach` — kaunsa choose karoge aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`Parallel.ForEach`, kyunki records genuinely independent hain aur workload CPU-bound hai — multiple cores use karke wall-clock time significantly kam ho sakta hai.",
    detailedAnswer:
      "Jab work items mutually independent hon (koi ek doosre ke result pe depend nahi karta) aur processing CPU-intensive ho, `Parallel.ForEach` near-linear speedup de sakta hai available core count ke hisaab se (e.g. 8 cores par roughly 6-8x tez, overhead minus karke). Sequential `foreach` sirf ek core use karta hai, baaki idle rehte hain. Agar records ke beech koi shared mutable state hoti (jaise ek running total), extra care/synchronization chahiye hoti — lekin pure independent transformation ke liye `Parallel.ForEach` clearly better fit hai.",
  },
  {
    id: "volatile-tr-6",
    question: "`AsParallel()` (PLINQ) ek existing LINQ query pe laga dene se kya guarantee milta hai, aur kya risk hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Query multiple threads pe parallel execute ho sakti hai — CPU-bound transformations ke liye fayda hai, lekin agar lambda ke andar shared mutable state hai ya operation order-dependent hai, results incorrect ya unpredictable ho sakte hain.",
    detailedAnswer:
      "`.AsParallel()` PLINQ engine ko query ko multiple partitions me split karke parallel execute karne ka signal deta hai. Ye tabhi safe aur beneficial hai jab: (1) transformation function pure/side-effect-free ho (koi shared mutable state touch na kare), (2) operation genuinely CPU-bound ho (I/O-bound operations PLINQ se fayda nahi uthate, thread-pool starve kar sakte hain), (3) order-sensitivity acceptable ho (PLINQ by default order guarantee nahi deta jab tak `.AsOrdered()` na lagaya jaaye). In conditions ke bina blindly `.AsParallel()` laga dena bugs ya even performance regression (overhead of parallelization coordination) de sakta hai chhote ya I/O-heavy queries ke liye.",
    followUp: "`.AsOrdered()` kab zaroori hota hai PLINQ ke saath?",
  },
];

export default questions;
