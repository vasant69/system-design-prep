import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dependency-injection-and-service-lifetimes-1",
    question:
      "ASP.NET Core me ek HTTP request ke andar `IEmployeeService` do alag classes me inject hota hai. Registration `AddScoped` hai. Dono ko kya milega?",
    options: [
      "Do alag `EmployeeService` instances",
      "Wahi ek `EmployeeService` instance dono jagah",
      "Pehli jagah instance, doosri jagah null",
      "Har call pe naya instance, method-level",
    ],
    correctIndex: 1,
    explanation:
      "Scoped ka matlab ek instance per scope, aur ASP.NET Core me ek scope = ek HTTP request. Us request ke andar jitni baar bhi resolve ho, wahi ek instance. Do alag instances Transient ka behaviour hai. Null tab jab registration hi missing ho. Method-level koi lifetime nahi hoti.",
    difficulty: "easy",
  },
  {
    id: "dependency-injection-and-service-lifetimes-2",
    question:
      "`AddSingleton<IAuditLogger, AuditLogger>()` register kiya, aur `AuditLogger` ke constructor me `IEmployeeRepository` (Scoped) inject kiya. Development me kya hota hai aur kyun bug hai?",
    options: [
      "Kuch nahi, ye valid pattern hai",
      "App startup pe throw karta hai — 'Cannot consume scoped service from singleton'; Singleton us Scoped repo ko hamesha ke liye capture kar leta (captive dependency), jo stale data aur thread-safety crashes deta",
      "Repository apne aap Transient ban jaata hai",
      "Sirf pehli request slow hoti hai, baaki normal",
    ],
    correctIndex: 1,
    explanation:
      "Singleton ek baar banta hai, to uske constructor-injected fields bhi ek baar set hote hain — Scoped repo effectively app-lifetime captive ho jaata hai. Uska `DbContext` dispose nahi hota aur saare threads use share karte hain (thread-safe nahi). Development me `ValidateScopes`/`ValidateOnBuild` isko startup pe pakadta hai. Lifetime kisi ka apne aap nahi badalta; ye ek slow-start issue nahi, correctness bug hai.",
    difficulty: "medium",
  },
  {
    id: "dependency-injection-and-service-lifetimes-3",
    question:
      "Ek Singleton service ko genuinely ek Scoped dependency chahiye kaam ke waqt. Sahi fix kya hai?",
    options: [
      "Scoped ko bhi Singleton bana do",
      "Development me `ValidateScopes = false` set kar do",
      "Singleton me `IServiceScopeFactory` inject karo, aur kaam ke waqt `using var scope = _scopeFactory.CreateScope()` se fresh Scoped instance resolve karo",
      "Dependency ko `static` field me rakh do",
    ],
    correctIndex: 2,
    explanation:
      "`IServiceScopeFactory` khud Singleton hai to use inject karna safe hai; per-operation `CreateScope()` ek fresh scope deta hai jise `using` dispose kar deta hai — koi capture nahi. Scoped ko Singleton banana original bug ko aur phaila deta hai (uski Scoped dependencies bhi captive). `ValidateScopes` off karna bug chhupata hai. `static` field global mutable state aur thread-safety problems laata hai.",
    difficulty: "hard",
  },
  {
    id: "dependency-injection-and-service-lifetimes-4",
    question:
      "Hamare project me `IEmployeeRepository` ko Scoped register kiya gaya hai jabki abhi wo sirf ek `static List` wrap karta hai. Iski sabse achhi wajah?",
    options: [
      "Scoped Transient se tez hota hai",
      "Module 4 me ye `DbContext` wrap karega, jo hamesha Scoped (thread-safe nahi) hota hai — abhi se Scoped rakhne se swap ke din registration nahi badalni padegi",
      "`static` fields sirf Scoped services me allowed hain",
      "Repository interfaces hamesha Scoped hone chahiye, ye ek C# rule hai",
    ],
    correctIndex: 1,
    explanation:
      "Repository request-bound data-access hai; EF Core `DbContext` per-request use hota hai aur thread-safe nahi, isliye Scoped standard hai. Abhi se Scoped rakhna future swap ko no-op banata hai. Lifetime speed ka mamla nahi; `static` fields kisi bhi lifetime me ho sakte hain (aur unse bachna chahiye); aisa koi language rule nahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
