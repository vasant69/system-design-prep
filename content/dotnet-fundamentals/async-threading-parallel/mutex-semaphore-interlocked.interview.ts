import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mutex-semaphore-tr-1",
    question: "`lock`, `Mutex`, `Semaphore`, aur `Interlocked` — chaaron me kya fark hai, aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS", "Accenture"],
    shortAnswer:
      "`lock` = process-scoped mutual exclusion; `Mutex` = cross-process mutual exclusion; `Semaphore`/`SemaphoreSlim` = N-concurrent-threads limit; `Interlocked` = single atomic operation, no lock overhead.",
    detailedAnswer:
      "`lock` (Monitor sugar) ek process ke andar ek time pe sirf ek thread ko critical section me allow karta hai — general-purpose tool. `Mutex` similar hai lekin OS-level hone ki wajah se multiple processes ke beech bhi kaam karta hai (jaise single-instance app enforcement). `SemaphoreSlim` ek counter maintain karta hai aur ek time pe N threads allow karta hai — limited-concurrency scenarios (rate limiting) ke liye. `Interlocked` sabse narrow-scope tool hai — sirf ek single operation (increment, compare-exchange) ko bina kisi OS-level lock ke, CPU-level atomic instructions se safe banata hai, simple counters ke liye sabse fast option.",
    followUp: "Ek scenario do jahan `SemaphoreSlim` sahi choice ho lekin `lock` nahi.",
  },
  {
    id: "mutex-semaphore-tr-2",
    question: "Ek single-instance desktop app banani hai — same app ki do copies simultaneously nahi chalni chahiye. Ise implement karne ka standard tarika kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek named `Mutex` use karo (`new Mutex(true, \"Global\\\\AppName\", out bool createdNew)`) — dusra process launch hote hi `createdNew == false` payega aur exit ho sakta hai.",
    detailedAnswer:
      "Named `Mutex` OS-level hai — sab processes ke liye visible. Jab app start hoti hai, wo ek specific-named `Mutex` create karne ki koshish karti hai. Agar wo naam already exist karta hai (kisi doosre running instance ne banaya hai), `createdNew` false milega — nayi instance ko ye pata chal jaata hai ki koi aur instance already chal rahi hai, aur wo gracefully exit ho sakti hai (ya existing instance ko focus karva sakti hai). Ye exactly wo cross-process coordination hai jo `lock`/Monitor kabhi de hi nahi sakta, kyunki wo process-scoped hai.",
  },
  {
    id: "mutex-semaphore-tr-3",
    question: "`SemaphoreSlim` aur `Semaphore` (non-Slim) me practical difference kya hai, aur day-to-day .NET code me kaunsa zyada common hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`SemaphoreSlim` lightweight, in-process, async-friendly (`WaitAsync()`) hai — day-to-day code me almost hamesha yahi use hota hai. `Semaphore` heavier, cross-process capable hai, rarely needed.",
    detailedAnswer:
      "`SemaphoreSlim` specifically single-process, high-performance scenarios ke liye design kiya gaya — kernel-level wait handle avoid karta hai jab tak genuinely blocking wait na ho, aur `WaitAsync()` deta hai jo async code me non-blocking wait allow karta hai. `Semaphore` (non-Slim) OS-level, named-instance ke through cross-process bhi kaam kar sakta hai, jaisa `Mutex`, lekin heavier hai. Jab tak explicitly cross-process semaphore coordination na chahiye ho, `SemaphoreSlim` hi correct default choice hai.",
    followUp: "`WaitAsync()` vs synchronous `Wait()` — async code me kaunsa use karoge aur kyun?",
  },
  {
    id: "mutex-semaphore-tr-4",
    question: "Ye code kya karega?\n```csharp\nprivate int _counter = 0;\n\npublic void IncrementMany()\n{\n    Parallel.For(0, 100000, _ => Interlocked.Increment(ref _counter));\n    Console.WriteLine(_counter);\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Hamesha exactly 100000 print karega — `Interlocked.Increment` guaranteed atomic hai, koi lost update nahi ho sakta.",
    detailedAnswer:
      "Plain `_counter++` ke ulat, `Interlocked.Increment(ref _counter)` ek single, CPU-level atomic operation hai — koi doosra thread beech me interleave nahi kar sakta us specific read-modify-write ke steps ke beech. Isliye chahe 100000 threads simultaneously increment karein, final value reliably, deterministically exactly 100000 hi hogi, race condition-wale scenario (jaisa plain `++` ke saath hota) ke ulat.",
  },
  {
    id: "mutex-semaphore-tr-5",
    question: "Ek developer ne `Interlocked.Increment(ref _totalAmount)` aur `Interlocked.Increment(ref _transactionCount)` ko do alag statements me likha, ek dusre se independently, ye assume karte hue ki dono field 'atomically together' update ho jaayenge. Kya ye sahi assumption hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — har `Interlocked` call apne aap me atomic hai, lekin do alag `Interlocked` calls ke beech koi combined atomicity guarantee nahi hai. Koi thread dono updates ke beech ek inconsistent state dekh sakta hai.",
    detailedAnswer:
      "`Interlocked` sirf **ek** single operation ko atomic banata hai. Agar do related fields (`_totalAmount` aur `_transactionCount`) ko ek dusre ke saath consistently update karna hai (jaise ek 'transaction record' banate waqt), `Interlocked` ki do alag calls ke beech koi thread in-between state dekh sakta hai — jaise `_totalAmount` update ho chuka hai lekin `_transactionCount` abhi nahi. Agar dono fields ko genuinely ek atomic unit ki tarah update karna hai, `lock` ka istemal karna chahiye poore multi-field update ko wrap karne ke liye.",
    redFlag: "Multiple `Interlocked` calls ko ek dusre se independent statements me likh kar assume karna ki wo collectively bhi atomic hain — ye ek dangerous misconception hai.",
  },
  {
    id: "mutex-semaphore-tr-6",
    question: "`Interlocked.CompareExchange` kya karta hai, aur ye kis pattern ka foundation hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Compare-and-swap (CAS) — agar variable abhi bhi expected value hai, use naye value se replace karta hai, atomically. Ye lock-free algorithms ka foundation hai.",
    detailedAnswer:
      "`Interlocked.CompareExchange(ref location, newValue, expectedValue)` atomically check karta hai ki `location` abhi bhi `expectedValue` ke barabar hai — agar haan, use `newValue` se replace kar deta hai; agar nahi (kisi doosre thread ne beech me change kar diya), koi replacement nahi hota. Return value hamesha original value hoti hai, jisse caller pata laga sakta hai ki operation succeed hua ya nahi. Ye pattern (read, compute, try-swap, agar fail to retry) 'compare-and-swap' kehlaata hai aur bahut saare lock-free data structures aur algorithms (jaise `ConcurrentDictionary` ka internal implementation) is par based hote hain.",
  },
  {
    id: "mutex-semaphore-tr-7",
    question: "Ek batch job me third-party API ko 10 se zyada concurrent connections nahi bhejni. Team ne galti se sirf `Semaphore` (non-Slim) implement kiya, `SemaphoreSlim` nahi. Kya problem ho sakti hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Functionally kaam karega, lekin `Semaphore` heavier hai (OS-level wait handle) — high-throughput, in-process-only scenario me `SemaphoreSlim` zyada efficient hota, especially agar `WaitAsync()` ki zaroorat ho async code me.",
    detailedAnswer:
      "`Semaphore` (non-Slim) OS kernel object use karta hai jo cross-process capability ke liye zaroori hai — lekin agar coordination sirf ek process ke andar chahiye (jo yahan case hai), ye extra overhead unnecessary hai. Bigger issue: `Semaphore` (non-Slim) `WaitAsync()` deta hi nahi — sirf synchronous `WaitOne()` hai, jo async code me thread block kar dega (sync-over-async anti-pattern). `SemaphoreSlim` ka `WaitAsync()` async-friendly hai — is scenario ke liye ye clearly correct choice hai.",
  },
];

export default questions;
