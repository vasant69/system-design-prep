import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dispose-pattern-1",
    question: "Formal Dispose pattern me `protected virtual void Dispose(bool disposing)` kyun zaroori hai, sirf public `Dispose()` ko virtual kyun nahi banaya jaata?",
    options: [
      "Performance ke liye — virtual `Dispose()` slow hota hai",
      "Taaki derived classes ek consistent extension point pe override karein, aur public API ka exact sequence (Dispose(true) + SuppressFinalize) guaranteed rahe",
      "C# me public methods virtual nahi ho sakte",
      "`IDisposable` interface isko explicitly require karta hai syntax level pe"
    ],
    correctIndex: 1,
    explanation:
      "Public `Dispose()` ko non-virtual rakhne se guarantee milta hai ki har call same sequence follow kare (Dispose(true) phir SuppressFinalize). Derived classes ke liye ek separate, protected virtual extension point (`Dispose(bool)`) dena unhe apna cleanup add karne deta hai bina is guaranteed sequence ko accidentally break kiye. Options A, C, D factually galat hain — C# public methods virtual ho sakte hain, ye performance issue nahi hai, aur `IDisposable` interface sirf `Dispose()` signature require karta hai, `Dispose(bool)` ek convention hai.",
    difficulty: "hard",
  },
  {
    id: "dispose-pattern-2",
    question: "`Dispose(bool disposing)` ke andar `disposing == false` branch me kya karna SAFE nahi hai?",
    options: [
      "Unmanaged native handles release karna",
      "Doosre managed objects (jaise koi field jo ek doosra IDisposable object hai) ko access/dispose karna",
      "Local primitive variables use karna",
      "`_disposed` flag set karna"
    ],
    correctIndex: 1,
    explanation:
      "`disposing == false` ka matlab hai call finalizer se aayi hai — is context me doosre managed objects already garbage collect ho chuke ho sakte hain (finalization order guaranteed nahi hai), unhe access karna undefined behavior ya crash de sakta hai. Isliye is branch me sirf unmanaged resources (Option A) clean karna safe hai. Options C aur D safe operations hain, managed-object-access ka issue nahi hai.",
    difficulty: "hard",
  },
  {
    id: "dispose-pattern-3",
    question: "Ek derived class `Dispose(bool disposing)` override karti hai apna cleanup ke liye, lekin `base.Dispose(disposing)` call karna bhool jaati hai. Iska result kya hoga?",
    options: [
      "Compile error — base.Dispose(disposing) call karna mandatory hai",
      "Base class ka cleanup silently skip ho jaayega — resource leak ho sakta hai bina koi obvious error ke",
      "Runtime exception aayega automatically",
      "Kuch nahi hoga, C# automatically base cleanup call kar deta hai"
    ],
    correctIndex: 1,
    explanation:
      "`base.Dispose(disposing)` call karna ek convention hai, compiler-enforced rule nahi (Option A galat). Agar miss ho jaaye, base class ka apna cleanup logic kabhi chalega hi nahi — ye silently resource leak ban sakta hai bina kisi explicit error ke (Option C, D galat). Yahi wajah hai ki ye is pattern ka sabse common real-world bug hai, aur static analyzers (CA-rules) isko flag karne ki koshish karte hain.",
    difficulty: "medium",
  },
  {
    id: "dispose-pattern-4",
    question: "Kya har `IDisposable` class ko formal `Dispose(bool)` pattern implement karna chahiye?",
    options: [
      "Haan, hamesha, bina exception ke",
      "Nahi — sirf tab genuinely zaroori hai jab class inheritance ke liye designed hai (non-sealed, extensible); sealed classes simpler Dispose() use kar sakti hain",
      "Nahi, ye pattern deprecated ho chuka hai .NET 6+ me",
      "Sirf tab zaroori hai jab class me finalizer ho, IDisposable alone ke liye nahi"
    ],
    correctIndex: 1,
    explanation:
      "Formal two-overload pattern ka poora purpose inheritance safety hai — ye zaroori hai jab class subclass ho sakti hai. Ek `sealed` class jo kabhi extend nahi hogi, simpler `public void Dispose()` (bina bool overload split ke) use kar sakti hai, unnecessary complexity avoid karte hue. Option A over-engineering hai, Options C aur D factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
