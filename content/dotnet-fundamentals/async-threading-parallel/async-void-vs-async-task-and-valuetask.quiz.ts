import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-void-task-valuetask-1",
    question: "Ye code kya hoga jab run hoga?\n```csharp\nasync void Risky() { throw new InvalidOperationException(); }\n\ntry { Risky(); }\ncatch (Exception ex) { Console.WriteLine(\"Caught\"); }\n```",
    options: [
      "\"Caught\" print hoga, exception normally handle ho jaayegi",
      "Process crash ho jaayega — exception try/catch ko bypass kar deti hai kyunki async void ke paas koi Task nahi hai exception carry karne ke liye",
      "Compile error aayega",
      "Exception silently ignore ho jaayegi, kuch print nahi hoga aur process chalta rahega",
    ],
    correctIndex: 1,
    explanation:
      "`async void` methods ke andar exceptions ko Task-based 'wapas jaane ka raasta' nahi milta — wo seedha SynchronizationContext par throw hoti hain, jo typically process ko crash kar deta hai. Caller ka try/catch (jaisa is code me hai) ise bilkul catch NAHI kar sakta. Option A galat hai — ye is topic ka sabse common misconception hai. Options C aur D bhi galat hain, code compile hota hai aur exception silently ignore nahi hoti, process crash hota hai.",
    difficulty: "hard",
  },
  {
    id: "async-void-task-valuetask-2",
    question: "`async void` kis scenario me legitimately use karna chahiye?",
    options: [
      "Jab bhi ek method ka result kisi ko chahiye na ho",
      "Event handlers me, kyunki unka signature framework (WinForms/WPF/ASP.NET) dwara fixed hota hai aur wo Task return nahi kar sakte",
      "High-performance hot paths me allocation avoid karne ke liye",
      "Jab method genuinely synchronous ho aur await kuch use na ho raha ho",
    ],
    correctIndex: 1,
    explanation:
      "`async void` ka ek hi legitimate use case hai: event handlers, jinka signature framework dwara void-returning delegate ke roop me fixed hota hai — wo Task return nahi kar sakte structurally. Har doosri jagah `async Task` use karna chahiye, taaki exceptions properly propagate ho sakein. Options A, C, D galat justifications hain.",
    difficulty: "medium",
  },
  {
    id: "async-void-task-valuetask-3",
    question: "`ValueTask<T>` ka main benefit `Task<T>` ke comparison me kya hai?",
    options: [
      "Ye hamesha faster hai chahe kaam async ho ya sync",
      "Jab operation synchronously complete ho jaati hai (jaise cache hit), koi heap allocation nahi hoti, kyunki ValueTask ek struct hai",
      "Isse multiple baar safely await kiya ja sakta hai, Task<T> se zyada",
      "Ye automatically exceptions ko better handle karta hai Task<T> se",
    ],
    correctIndex: 1,
    explanation:
      "`ValueTask<T>` ek struct hai — jab operation synchronously complete hoti hai, value directly struct me store hota hai, koi heap allocation nahi hoti. Ye hot-path, frequent-synchronous-completion scenarios (jaise cache hits) me GC pressure kam karta hai. Option A galat hai — genuinely async path par ValueTask internally Task ko hi wrap karta hai, koi magic speedup nahi. Option C ulta galat hai — ValueTask sirf ek baar safely await ho sakta hai, Task<T> multiple baar. Option D irrelevant/galat hai.",
    difficulty: "hard",
  },
  {
    id: "async-void-task-valuetask-4",
    question: "Ek `ValueTask<int>` ko do baar await kiya jaaye ya uska result do baar access kiya jaaye, to kya hota hai?",
    options: [
      "Bilkul safe hai, Task<T> jaisa hi behavior milta hai",
      "Undefined behavior ho sakta hai — ValueTask sirf ek baar safely await/access ke liye design kiya gaya hai",
      "Compile error aata hai",
      "Automatically ek naya ValueTask create ho jaata hai har baar",
    ],
    correctIndex: 1,
    explanation:
      "`ValueTask<T>`, `Task<T>` ke opposite, multiple-await ke liye safe nahi hai — ye sirf ek baar consume kiye jaane ke liye design kiya gaya hai. Repeated await ya `.Result` access undefined behavior de sakta hai. Ye ek important limitation hai jo `ValueTask` ko sirf specific, measured-performance scenarios tak limit karti hai, general-purpose replacement nahi banati Task<T> ka. Options A, C, D galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
