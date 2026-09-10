import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dsl-1",
    question: "Transient, Scoped, aur Singleton lifetimes samjhao aur har ek ka ek use case do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Transient: har resolve par naya instance — stateless helpers, mappers. Scoped: per HTTP request ek instance, us request ke graph me shared — `DbContext`, unit-of-work, per-request context. Singleton: poore app ke liye ek — config, caches, clock; thread-safe hona chahiye.",
    detailedAnswer:
      "Default samajh: agar service kisi shared/mutable state ya per-request identity ko hold karti hai to Scoped. Agar wo pure hai aur sasti banti hai to Transient. Agar wo genuinely app-wide aur immutable (ya carefully locked) hai to Singleton. `AddDbContext` Scoped register karta hai isiliye.",
    followUp: "Startup par ASP.NET Core scope validation kya check karta hai?",
  },
  {
    id: "dsl-2",
    question: "Captive dependency kya hai? Ek concrete example do jo bug deta hai.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Jab ek longer-lived service ek shorter-lived ko inject karti hai aur use apni life tak zinda rakh leti hai. Classic: ek Singleton `CacheWarmer` ek Scoped `DbContext` inject karta hai — ab wo ek `DbContext` app ki poori life tak rakhega, thread-unsafe aur stale.",
    detailedAnswer:
      "Container ki mangi hui lifetime ka rule: kabhi khud se shorter-lived dependency par depend mat karo. Fix: Singleton me `IServiceScopeFactory` inject karo aur jab kaam karna ho tab `CreateScope()` se ek fresh scope aur uska `DbContext` lo, phir dispose karo. .NET dev-time `ValidateScopes` (default in Development) isse startup par catch karta hai.",
    redFlag: "Singleton me `DbContext` ya `HttpContext`-dependent service inject karna aur 'kaam kar raha hai' bolna.",
  },
  {
    id: "dsl-3",
    question: "Constructor injection ke faayde field/service-locator ke upar?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dependencies explicit aur compile-time visible hoti hain (constructor signature poori list hai), unit tests me fakes seedhe pass hote hain, aur container missing registration par startup par fail-fast karta hai. Service locator (`provider.GetService<T>()` andar) ye sab chhupata hai.",
    detailedAnswer:
      "Service-locator pattern (`IServiceProvider` ko around inject karna aur andar resolve karna) dependencies hide karta hai, tests ko poora container set up karne par majboor karta hai, aur runtime tak errors defer karta hai. Constructor injection ko default rakho; `IServiceScopeFactory` sirf genuine scope-management (background work) ke liye.",
  },
];

export default questions;
