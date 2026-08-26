import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "configureawait-1",
    question: "`ConfigureAwait(false)` ka primary purpose kya hai?",
    options: [
      "Async operation ko cancel karna",
      "Continuation ko original synchronization context capture kiye bina, kisi bhi thread-pool thread pe resume karne dena",
      "Task ko synchronous bana dena",
      "Exception handling ko disable karna",
    ],
    correctIndex: 1,
    explanation:
      "`ConfigureAwait(false)` `await` ke continuation ko original `SynchronizationContext`/`TaskScheduler` capture karne se rokta hai — isse continuation kisi bhi available thread-pool thread pe resume ho sakta hai, jo perf overhead kam karta hai aur UI-thread-jaisa deadlock risk avoid karta hai. Option A galat hai — ye cancellation se unrelated hai. Option C galat hai — Task ab bhi asynchronously chalta hai. Option D galat hai — exception propagation is se affect nahi hota.",
    difficulty: "medium",
  },
  {
    id: "configureawait-2",
    question: "`CancellationToken` cancellation ko kaise implement karta hai?",
    options: [
      "Thread ko forcibly kill karke",
      "Cooperative signaling se — operation khud check karta hai aur gracefully rukta hai",
      "Process ko restart karke",
      "Memory ko forcibly clear karke",
    ],
    correctIndex: 1,
    explanation:
      "`CancellationToken` ek cooperative model use karta hai — caller signal bhejta hai (`CancellationTokenSource.Cancel()`), lekin running operation ko khud check karna padta hai (`IsCancellationRequested` ya `ThrowIfCancellationRequested()`) aur gracefully stop hona padta hai. Forceful thread-kill unsafe hai kyunki resources locked reh sakte hain — ye .NET jaanbujhkar avoid karta hai. Options A, C, D sab galat mechanisms hain jo .NET actually use nahi karta.",
    difficulty: "easy",
  },
  {
    id: "configureawait-3",
    question: "Ek `CancellationToken` method me accept kiya jaata hai lekin andar ke koi bhi nested `await` call me pass nahi kiya jaata. Iska result kya hoga?",
    options: [
      "Compile error aayega",
      "Cancellation automatically sab jagah propagate ho jaayega",
      "Cancellation request silently ignore ho jaayega us nested call ke liye — operation poora chalta rahega",
      "Runtime pe exception aayega turant",
    ],
    correctIndex: 2,
    explanation:
      "Token explicitly pass karna zaroori hai har us async call me jise cancellation respect karni chahiye. Agar ek nested `await` call ko token nahi diya gaya, wo call cancellation ke baare me kuch nahi jaanta aur poora chalta rahega — cancellation silently us jagah break ho jaata hai. Ye compile-time issue nahi hai (Option A galat), automatic propagation nahi hota (Option B galat), aur koi immediate exception bhi nahi aata (Option D galat) — bug silently, gradually reveal hota hai.",
    difficulty: "hard",
  },
  {
    id: "configureawait-4",
    question: "ASP.NET Core (modern, .NET Core+) me `ConfigureAwait(false)` ki deadlock-prevention zaroorat classic ASP.NET se kaise alag hai?",
    options: [
      "Bilkul same hai, koi fark nahi",
      "ASP.NET Core me koi request-bound SynchronizationContext hi nahi hoti, isliye wo classic .Result/.Wait() deadlock scenario hi exist nahi karta",
      "ASP.NET Core async/await support hi nahi karta",
      "ASP.NET Core me ConfigureAwait mandatory hai, warna app crash hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Classic ASP.NET ek request-bound `SynchronizationContext` maintain karta tha jisse `.Result`/`.Wait()` deadlock ho sakta tha. ASP.NET Core ne is context ko hata diya — isliye wahi deadlock scenario ASP.NET Core me structurally exist nahi karta, aur `ConfigureAwait(false)` uss specific problem ke liye zaroori nahi reh jaata (library authors phir bhi habit ke taur pe use karte hain kyunki unka code kisi bhi host me use ho sakta hai). Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
