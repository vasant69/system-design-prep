import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "volatile-1",
    question: "`private volatile int _count = 0;` field par multiple threads `_count++` karte hain. Kya ye thread-safe hai?",
    options: [
      "Haan, `volatile` sab operations ko atomic bana deta hai",
      "Nahi, `volatile` sirf memory-visibility guarantee karta hai, `_count++` compound operation hai jo abhi bhi race condition hai",
      "Haan, lekin sirf agar `int` ka size 4 bytes se kam ho",
      "Nahi, kyunki `volatile` int type ke saath use hi nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "`volatile` sirf ensure karta hai ki reads/writes memory se directly hon (koi caching/reordering nahi) — ye atomicity nahi deta. `_count++` ab bhi read-increment-write ke 3 separate steps hai, jo multiple threads interleave kar sakte hain, exactly wahi race condition jo `volatile` ke bina hoti. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "volatile-2",
    question: "`volatile` ka most appropriate, correct use case kaunsa hai?",
    options: [
      "Ek shared counter jo multiple threads increment karte hain",
      "Ek simple boolean flag (jaise `_isRunning`) jo ek thread set karta hai aur doosra thread poll karta hai",
      "Ek `List<T>` jisme multiple threads items add karte hain",
      "Ek `Dictionary<K,V>` jisme concurrent reads/writes hote hain",
    ],
    correctIndex: 1,
    explanation:
      "`volatile` narrow use case ke liye best fit hai — ek simple flag jaha ek thread write karta hai, doosra sirf poll/read karta hai, koi compound operation involved nahi. Options A, C, D sab compound/multi-step operations involve karte hain jinke liye `volatile` (bina lock/concurrent-collection ke) insufficient hai.",
    difficulty: "medium",
  },
  {
    id: "volatile-3",
    question: "`Parallel.ForEach` kis type ke workload ke liye best suited hai?",
    options: [
      "I/O-bound work jaise network calls",
      "CPU-bound, independent work jo multiple cores ke beech split ho sakta ho",
      "Sequential work jahan har step pichhle step pe depend karta ho",
      "Single-item, non-repeating operations",
    ],
    correctIndex: 1,
    explanation:
      "`Parallel.ForEach` CPU-bound, mutually-independent work items ko multiple CPU cores ke beech distribute karta hai, jisse wall-clock time kam ho jaata hai. I/O-bound work (Option A) ke liye ye galat tool hai — threads block ho jaate hain wait karte hue, jo thread-pool waste karta hai; async/await better fit hai. Options C aur D bhi galat hain — dependent-sequential work parallelize nahi ho sakta effectively, aur single-item operations me koi parallelism benefit nahi milta.",
    difficulty: "medium",
  },
  {
    id: "volatile-4",
    question: "Ek developer `Parallel.ForEach` use karta hai aur andar ek shared, plain `List<int>` me results add karta hai bina kisi lock/concurrent-collection ke. Kya ye safe hai?",
    options: [
      "Haan, `Parallel.ForEach` automatically thread-safety deta hai lambda ke andar",
      "Nahi — `Parallel.ForEach` khud sirf work distribute karta hai, lambda ke andar ki shared-state operations ki thread-safety developer ki responsibility hai",
      "Haan, kyunki `List<T>` internally thread-safe hai",
      "Nahi, kyunki `Parallel.ForEach` sirf single-threaded execution deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`Parallel.ForEach` sirf iteration ko multiple threads me distribute karta hai — ye koi automatic synchronization nahi deta lambda ke andar ki logic ke liye. Plain `List<T>` thread-safe nahi hai (Option C galat), isliye multiple threads se concurrently `Add()` karna race condition/corruption risk create karta hai. Sahi approach: `ConcurrentBag<T>` use karna, ya `lock` lagana, ya `Parallel.ForEach`'s thread-local aggregation overload use karna. Options A aur D dono factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
