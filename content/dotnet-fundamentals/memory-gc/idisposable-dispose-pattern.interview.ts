import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dispose-pattern-tr-1",
    question: "Formal Dispose pattern (`Dispose(bool disposing)` two-overload structure) kya hai aur ye kyun exist karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer: "Ek inheritance-safe structure — public non-virtual Dispose(), protected virtual Dispose(bool), aur finalizer Dispose(false) call karta hai — taaki derived classes safely apna cleanup add kar sakein.",
    detailedAnswer:
      "Pattern teen parts me hai: (1) `public void Dispose()` — non-virtual, `Dispose(true)` aur `GC.SuppressFinalize(this)` call karta hai, kabhi override nahi hota. (2) `protected virtual void Dispose(bool disposing)` — asli extension point, derived classes ise override karke `base.Dispose(disposing)` call karte hain. (3) Finalizer, `Dispose(false)` call karta hai. Ye exist karta hai kyunki agar sirf `Dispose()` ko virtual banaya jaaye, derived class `base.Dispose()` call karna bhool sakti hai (silent leak), aur managed-vs-unmanaged distinction clear nahi rehta jab finalizer se call aati hai.",
    followUp: "`disposing` parameter ka exact role kya hai?",
  },
  {
    id: "dispose-pattern-tr-2",
    question: "`disposing` parameter (`true` vs `false`) ka matlab kya hai, aur ye kaise decide karta hai kya cleanup karna safe hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "`true` = Dispose() se call aayi, managed objects abhi zinda hain, safely dispose kar sakte ho. `false` = finalizer se aayi, sirf unmanaged cleanup safe hai.",
    detailedAnswer:
      "`disposing == true` batata hai call explicit `Dispose()` (caller-driven) se aayi hai — is point pe object graph ke doosre managed objects guaranteed abhi collect nahi hue, unhe safely dispose kiya jaa sakta hai. `disposing == false` batata hai call finalizer se aayi hai — finalization order guaranteed nahi hai, isliye doosre managed objects already garbage collect ho chuke ho sakte hain; unhe touch karna crash/undefined behavior de sakta hai. Isliye is branch me sirf apne khud ke unmanaged handles release karne chahiye.",
  },
  {
    id: "dispose-pattern-tr-3",
    question: "Derived class ko is pattern me kya override karna chahiye — `Dispose()` ya `Dispose(bool)`?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Sirf `Dispose(bool disposing)` — public `Dispose()` non-virtual hota hai, kabhi override nahi hota.",
    detailedAnswer:
      "`public Dispose()` deliberately non-virtual rakha jaata hai taaki uska sequence (Dispose(true) + SuppressFinalize) hamesha guaranteed rahe. Derived classes `protected virtual Dispose(bool disposing)` ko override karti hain — apna cleanup add karti hain aur `base.Dispose(disposing)` call karti hain taaki poori inheritance chain ka cleanup ho. Wo apna naya public `Dispose()` ya extra finalizer generally nahi likhtin (finalizer sirf tab agar unka apna unmanaged resource ho jo base class me nahi hai).",
  },
  {
    id: "dispose-pattern-tr-4",
    question: "Ye code review karo:\n```csharp\npublic class Base : IDisposable\n{\n    protected virtual void Dispose(bool disposing) { /* cleanup */ }\n    public void Dispose() { Dispose(true); GC.SuppressFinalize(this); }\n}\npublic class Derived : Base\n{\n    private readonly Socket _socket = new Socket(/*...*/);\n    protected override void Dispose(bool disposing)\n    {\n        if (disposing) _socket?.Dispose();\n    }\n}\n```\nKya bug hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "`Derived.Dispose(bool)` `base.Dispose(disposing)` call nahi kar raha — Base class ka apna cleanup silently skip ho jaayega.",
    detailedAnswer:
      "`Derived.Dispose(bool disposing)` sirf apna `_socket` dispose karta hai, lekin `base.Dispose(disposing)` call nahi karta. Agar `Base` ke andar bhi koi resource hoti (is example me nahi hai, lekin typical real code me hoti), wo cleanup kabhi nahi chalega. Fix: `Dispose(bool disposing)` ke end me `base.Dispose(disposing);` add karna zaroori hai — ye is pattern ka sabse common real-world bug hai.",
  },
  {
    id: "dispose-pattern-tr-5",
    question: "Kya har `IDisposable` class ko ye poora formal `Dispose(bool)` pattern implement karna chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — sirf tab jab class genuinely inheritance ke liye designed hai. Sealed, non-extensible classes simpler Dispose() use kar sakti hain.",
    detailedAnswer:
      "Formal pattern ka poora purpose inheritance safety hai. Agar class `sealed` hai (kabhi extend nahi hogi), sirf `public void Dispose()` likhna aur uske andar directly cleanup karna acceptable hai — Microsoft ki apni guidance bhi ye differentiate karti hai simple vs extensible classes ke beech. Har jagah blindly poora pattern force karna unnecessary complexity add karta hai.",
    redFlag: "'Har IDisposable class me hamesha poora Dispose(bool) pattern hona chahiye, no exceptions' — over-engineering ka signal, context-awareness ki kami dikhata hai.",
  },
  {
    id: "dispose-pattern-tr-6",
    question: "`GC.SuppressFinalize(this)` ko `Dispose(bool)` ke andar call karna kyun galat hoga, `Dispose()` ke andar hi kyun hona chahiye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Agar `Dispose(bool)` ke andar call kare, ye finalizer se aayi call (disposing=false) ko bhi accidentally suppress kar sakta hai jab galat context me chal raha ho — clean separation break ho jaata hai.",
    detailedAnswer:
      "`GC.SuppressFinalize(this)` ka intent hai: 'explicit Dispose() ho chuka hai, ab finalizer run karne ki zaroorat nahi.' Ye sirf tab meaningful hai jab public `Dispose()` se call aa rahi ho. Agar isko `Dispose(bool)` ke andar rakh diya jaaye (jo finalizer se `Dispose(false)` ke through bhi chalta hai), finalizer khud apne aap ko suppress kar dega — jo redundant/no-op hai (finalizer already run ho raha hai) lekin design intent ko confusing bana deta hai aur convention violate karta hai. Standard practice: `SuppressFinalize` sirf public `Dispose()` ke andar, kabhi `Dispose(bool)` ke andar nahi.",
  },
  {
    id: "dispose-pattern-tr-7",
    question: "Ye pattern `oops-dotnet` ke `idisposable-using-finalizers-gc` topic se kaise different hai — dono me overlap kyun nahi hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Us topic ne IDisposable/using/finalizer ka WHY aur basic structure cover kiya; ye topic specifically formal two-overload Dispose(bool) pattern ki inheritance-safety depth pe focus karta hai.",
    detailedAnswer:
      "`oops-dotnet`'s topic already GC ka managed/unmanaged blind spot, `using`'s try/finally guarantee, aur finalizer ka safety-net role deeply cover karta hai, saath me pattern ka ek basic sketch bhi deta hai. Ye topic us foundation ko assume karta hai aur specifically deep jaata hai us ek cheez pe jo tricky hai jab classes ko subclass kiya jaa sakta ho: kyun `Dispose()` ko khud virtual nahi banana chahiye, `disposing` parameter ka exact safety-role, aur `base.Dispose(disposing)` chain karne ki zaroorat — ye sab specifically inheritance scenario me matter karta hai.",
  },
  {
    id: "dispose-pattern-tr-8",
    question: "Ek base class `ResourceHolder` ke teen levels deep subclasses hain — `A -> B -> C`. Agar `B` apni `Dispose(bool)` override me `base.Dispose(disposing)` call karna bhool jaaye, kya `A` (root base) ka cleanup bhi miss hoga, ya sirf `B` ka?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Chain break ho jaati hai us point pe — `A` ka cleanup bhi miss hoga, kyunki `base.Dispose(disposing)` call chain se hi 'A' tak call pahunchti hai.",
    detailedAnswer:
      "`C.Dispose(bool)` apna cleanup karta hai, phir `base.Dispose(disposing)` call karta hai jo `B.Dispose(bool)` ko invoke karta hai. Agar `B` apna cleanup karke `base.Dispose(disposing)` call karna bhool jaaye, chain wahin ruk jaati hai — `A.Dispose(bool)` kabhi call hi nahi hoga, chahe `C` ne sahi se `base` call kiya ho. Ye batata hai ki har level ka `base.Dispose(disposing)` call chain ki ek link hai — ek bhi link miss hone se upar ki poori chain break ho jaati hai.",
  },
];

export default questions;
