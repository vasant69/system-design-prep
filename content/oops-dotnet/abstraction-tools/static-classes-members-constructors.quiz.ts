import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "static-classes-1",
    question: "`BankAccount` class me `static int _totalAccountsCreated` field hai jo constructor me increment hota hai. `acc1` aur `acc2` dono `BankAccount` instances hain. `acc1.TotalAccountsCreated` aur `acc2.TotalAccountsCreated` (assume ek public static property expose karta hai) — kya relationship hai?",
    options: [
      "Dono alag values honge, har object apna alag counter rakhta hai",
      "Dono EXACT SAME value dikhaayenge — ek hi shared, per-type copy hai, per-instance nahi",
      "Dusra hamesha pehle se ek zyada hoga",
      "Compile error aayega, static field ko instance se access nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "Static field poore type ka ek hi shared copy hota hai, har instance ka apna alag copy nahi hota. Isliye acc1 aur acc2 dono se access karne par same value milegi. Option A instance fields ke behavior se confuse ho raha hai. Option C ek random, incorrect guess hai. Option D technically static member ko instance reference se access karna allowed hai (compiler warning de sakta hai lekin error nahi), value wahi shared value hoti hai.",
    difficulty: "medium",
  },
  {
    id: "static-classes-2",
    question: "Static constructor ke baare me kaunsa statement SAHI hai?",
    options: [
      "Parameters accept kar sakta hai jaise normal constructor",
      "Explicitly `TypeName.StaticConstructor()` jaise call kiya jaa sakta hai",
      "CLR guarantee karta hai ye type ke first use se pehle, exactly ek baar, thread-safe tareeke se chalega",
      "Har baar jab bhi `new TypeName()` ho, static constructor bhi phir se chalta hai",
    ],
    correctIndex: 2,
    explanation:
      "Static constructor no-parameter hota hai, kabhi explicitly call nahi hota, aur CLR isse type ke first use (static member access YA pehla instance banna, jo pehle ho) se pehle, sirf EK baar, thread-safe guarantee ke saath chalata hai. Option A aur B dono galat hain — no parameters, no explicit call. Option D galat hai — dusri aur teesri baar `new TypeName()` karne par static constructor dobara NAHI chalta, ek hi baar chalta hai poori lifetime me.",
    difficulty: "medium",
  },
  {
    id: "static-classes-3",
    question: "Static state aur DI Singleton me kya key difference hai jo interview me mention karna chahiye?",
    options: [
      "Koi difference nahi hai, dono same cheez hain",
      "Static state AppDomain-global aur hard-to-mock hota hai; DI Singleton container-scoped, interface-based aur testable hota hai",
      "Static state hamesha faster hota hai",
      "DI Singleton sirf ASP.NET Core me kaam karta hai, static har jagah",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek important, senior-level distinction hai — static field poore application/AppDomain ke liye global rehta hai, tests me reset karna mushkil hai. DI Singleton container ke lifetime se scoped hota hai, interface ke through mockable/replaceable hota hai testing me. Option A galat hai, dono me real, practically important differences hain. Option C ek unfounded performance claim hai. Option D galat hai, static keyword C# ka core language feature hai, ASP.NET Core-specific nahi.",
    difficulty: "hard",
  },
  {
    id: "static-classes-4",
    question: "`public static class Helpers { public int X; }` — kya problem hai is code me?",
    options: [
      "Koi problem nahi, ye valid code hai",
      "Compile error — static class ke andar sab members static hone chahiye, `X` non-static hai",
      "X automatically static ban jaayega",
      "Sirf runtime pe warning aayegi",
    ],
    correctIndex: 1,
    explanation:
      "Static class ke andar HAR member ko explicitly static declare karna zaroori hai — compiler ise enforce karta hai. `public int X;` (bina static ke) ek compile-time error deta hai kyunki static class me instance member allowed hi nahi. Option A galat hai, ye valid code nahi hai. Option C galat hai, compiler automatically kuch add nahi karta, tumhe explicitly `static` likhna hi padega. Option D galat hai, ye hard compile error hai, warning nahi.",
    difficulty: "easy",
  },
];

export default quiz;
