import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "drw-1",
    question: "ASP.NET Core ko kaise pata chalta hai ki controller ke constructor me kaunsa service inject karna hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Constructor parameter ke **type** se. Framework constructor ko reflect karta hai, har parameter type ko ek DI token ki tarah leta hai, aur current request scope se us token ka instance resolve karta hai (`Program.cs` me register kiya hua). Nahi mila to startup/request par exception.",
    detailedAnswer:
      "DI container ek registry hai: token (usually interface) -> factory + lifetime. Pehli maang par factory chalti hai, instance lifetime ke hisaab se cache hota hai. Isiliye controllers ko interfaces par depend karwao — testing me fake register kar sakte ho, implementation swap ho sakti hai.",
    followUp: "Constructor injection ke faayde service-locator (`HttpContext.RequestServices.GetService`) ke upar?",
  },
  {
    id: "drw-2",
    question: "Transient, Scoped, Singleton — har ek kab, aur galat choose karne se kya bug aata hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Transient: har resolve par naya — stateless helpers. Scoped: per HTTP request ek, us request ke poore graph me shared — `DbContext`, unit-of-work, per-request context. Singleton: poore app ke liye ek — config, caches, clock; thread-safe hona chahiye. Sabse bada bug: captive dependency — Singleton me Scoped inject karna use effectively singleton bana deta hai (stale, thread-unsafe `DbContext`).",
    detailedAnswer:
      "Rule: kabhi apne se shorter-lived dependency par depend mat karo. `EnableScopeValidation` (Development me default) is galti ko startup par pakadta hai. Background service (singleton-jaisa) me scoped chahiye to `IServiceScopeFactory.CreateScope()` se ek fresh scope banao.",
    redFlag: "Singleton service me `DbContext` inject karke 'kaam kar raha hai' bolna.",
  },
  {
    id: "drw-3",
    question: "Ek HTTP request me 'scope' ka kya matlab hai, aur wo kab banti aur dispose hoti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Har incoming request ke liye framework ek DI scope (child container) banata hai. Us request ke dauraan resolve kiye gaye saare Scoped services us scope me ek-ek instance rakhte hain aur share hote hain. Request khatam hone par scope dispose hoti hai — us scope ke `IDisposable` services ka `Dispose()` chalta hai.",
    detailedAnswer:
      "Isiliye do requests apna alag `DbContext` paati hain (Scoped), par ek request ke andar controller aur uski services wahi ek `DbContext` share karti hain — ek consistent unit of work. Middleware ke andar `context.RequestServices` bhi isi request scope se resolve karta hai.",
  },
];

export default questions;
