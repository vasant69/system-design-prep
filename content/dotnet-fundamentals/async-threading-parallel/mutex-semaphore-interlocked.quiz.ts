import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "mutex-semaphore-1",
    question: "`lock` aur `Mutex` me sabse fundamental fark kya hai?",
    options: [
      "`lock` sirf value types ke saath kaam karta hai, `Mutex` reference types ke saath",
      "`Mutex` cross-process synchronization de sakta hai, `lock` sirf ek process ke andar ke threads ko synchronize karta hai",
      "Dono functionally identical hain, sirf naming alag hai",
      "`lock` async code me kaam nahi karta, `Mutex` karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`lock` (Monitor) ek single process ke andar threads ke beech mutual exclusion deta hai — do alag processes ke beech koi coordination nahi de sakta. `Mutex`, especially ek named instance ke roop me, OS-level construct hai jo multiple processes ke beech bhi mutual exclusion de sakta hai — jaise single-instance app enforcement. Options A, C, D sab factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "mutex-semaphore-2",
    question: "Ek external API ko max 5 concurrent calls tak restrict karna hai. Sabse appropriate primitive kaunsa hai?",
    options: [
      "`Mutex`, kyunki ye mutual exclusion deta hai",
      "`lock`, kyunki ye synchronization ka standard tool hai",
      "`SemaphoreSlim(5, 5)`, kyunki ye ek time pe N threads allow karta hai, sirf 1 nahi",
      "`Interlocked`, kyunki ye atomic operations deta hai",
    ],
    correctIndex: 2,
    explanation:
      "`SemaphoreSlim` ek counter-based primitive hai jo exactly is use case ke liye design kiya gaya hai — ek time pe max N threads ko allow karna. `initialCount: 5, maxCount: 5` se exactly 5 concurrent calls allow honge, baaki `WaitAsync()` pe wait karenge. `lock` (Option B) sirf 1 thread allow karta hai, `Mutex` (Option A) cross-process concern hai yahan irrelevant, aur `Interlocked` (Option D) sirf single atomic operations ke liye hai, concurrency-limiting ke liye nahi.",
    difficulty: "medium",
  },
  {
    id: "mutex-semaphore-3",
    question: "`Interlocked.Increment(ref _count)` ko `lock (obj) { _count++; }` se prefer karne ka main reason kya hai simple counter ke liye?",
    options: [
      "`Interlocked` reference types ke saath bhi kaam karta hai, `lock` nahi",
      "`Interlocked` CPU-level atomic instructions use karta hai, koi OS-level lock/kernel transition nahi — significantly cheaper single operations ke liye",
      "`lock` sirf single-threaded apps me kaam karta hai",
      "`Interlocked` automatically thread-pool size badha deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`Interlocked` hardware-level atomic CPU instructions (jaise x86's LOCK-prefixed instructions) use karta hai — koi OS-level lock acquire/release, koi thread suspend/resume potential, koi kernel transition. Simple single-variable operations ke liye ye `lock`/`Monitor` se significantly faster hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "mutex-semaphore-4",
    question: "`SemaphoreSlim.Release()` ko `finally` block me na rakh kar sirf try block ke end me rakha gaya. Agar critical section me exception aaye to kya hoga?",
    options: [
      "Koi fark nahi padega, .NET automatically release kar dega",
      "Semaphore slot kabhi release nahi hoga — available count permanently kam ho jaayega, baaki waiting threads block reh sakte hain",
      "Exception khud-ba-khud semaphore ko reset kar dega",
      "`SemaphoreSlim` automatically ek naya slot create kar dega",
    ],
    correctIndex: 1,
    explanation:
      "Agar `Release()` sirf try block ke normal-completion path pe hai (finally me nahi), aur exception beech me aa jaaye, `Release()` kabhi call hi nahi hoga — semaphore ka available count permanently ek slot kam reh jaayega, aur agar sab slots is tarah 'leak' ho jaayein, baaki sab `WaitAsync()` calls hamesha ke liye block ho sakte hain. Isiliye `Release()` ko hamesha `finally` block me rakhna critical hai. Options A, C, D sab factually galat hain — .NET aisa koi automatic recovery nahi karta.",
    difficulty: "hard",
  },
];

export default quiz;
