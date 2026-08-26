import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "structural-patterns-tr-1",
    question: "Adapter pattern kya problem solve karta hai, aur ek real example do jahan ye use hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Razorpay"],
    shortAnswer:
      "Adapter ek incompatible existing interface ko client ke expected interface me convert karta hai — jaise ek legacy/third-party SDK ko apne app ke interface shape me wrap karna.",
    detailedAnswer:
      "Jab tumhare paas ek existing class (third-party SDK ya legacy code) hai jiska interface tumhare app ke expected interface se match nahi karta, aur us existing code ko modify nahi kar sakte, Adapter ek wrapper class banata hai jo tumhare expected interface implement karta hai aur internally purane interface ko call karta hai. Example: ek `LegacyPaymentAdapter` jo `IPaymentGateway` implement karta hai lekin internally ek differently-shaped `LegacyPaymentSdk` ko call karta hai — baaki app ko pata hi nahi chalta ki underlying implementation kitni different hai.",
    followUp: "Agar future me is legacy SDK ko replace karna pade, kya changes karni padengi?",
  },
  {
    id: "structural-patterns-tr-2",
    question: "Proxy aur Decorator pattern implementation me kaafi similar dikhte hain — dono kaise differentiate karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Intent se — Proxy access control/lazy-loading provide karta hai, Decorator naya behavior add karta hai, dono same interface wrap karte hain.",
    detailedAnswer:
      "Structurally dono near-identical hain — ek object jo same interface implement karta hai aur ek 'inner' instance ko hold karke calls forward karta hai. Difference purely intent ka hai: Proxy access ko control karta hai — caching (agar cache hit hai to real object ko call hi nahi karta), lazy-initialization, ya authorization check. Decorator hamesha real object ko call karta hai aur uske upar extra behavior layer karta hai (logging, validation) bina control-flow ko skip kiye. Ye classification kaafi subjective hai — real codebases me naming aur documentation se clear hoti hai, code-shape se nahi.",
    followUp: "Ek logging wrapper jo sirf errors ko log karta hai aur success case me kuch nahi karta — ye Proxy hai ya Decorator?",
  },
  {
    id: "structural-patterns-tr-3",
    question: "Facade pattern kab use karoge, aur ye MediatR command handlers se kaise relate karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jab ek operation ke liye multiple subsystems coordinate karne padte hain — MediatR handlers often Facade ki tarah kaam karte hain, ek command ke peeche multi-step orchestration hide karte hue.",
    detailedAnswer:
      "Facade tab fit hota hai jab client (jaise controller) ko ek complex, multi-step process (inventory reserve, payment charge, shipping schedule, notification send) ke saath directly deal nahi karna chahiye — sirf ek single method call karni chahiye jo poora orchestration internally handle kare. MediatR ke command handlers exactly yahi role play karte hain: `PlaceOrderCommandHandler` internally multiple services coordinate karta hai, controller sirf `mediator.Send(command)` call karta hai — controller ko orchestration details nahi pata honi chahiye.",
  },
  {
    id: "structural-patterns-tr-4",
    question: "Composite pattern typical Web API work me kam kyun dikhta hai, aur ye kab genuinely useful hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Web APIs mostly flat/relational data handle karte hain, Composite genuinely tree-shaped domain data ke liye useful hai — file systems, org charts, nested category/menu structures.",
    detailedAnswer:
      "Zyaadatar Web API endpoints flat DTOs/entities ke saath deal karte hain (Order, Product, User) jo naturally hierarchical nahi hote. Composite tab shine karta hai jab domain data genuinely recursive/tree-shaped ho — jaise ek e-commerce menu ki nested categories, ek org-chart ki reporting hierarchy, ya ek file-system-jaisa folder structure. Is scenario me leaf (individual item) aur branch (category jisme aur items/categories hain) dono ek hi interface implement karte hain, taaki operations (jaise total price calculate karna) uniformly recurse ho sakein bina explicit type-checking ke.",
  },
  {
    id: "structural-patterns-tr-5",
    question: "Ye code kya output dega?\n```csharp\nvar category = new MenuCategory();\ncategory.Add(new MenuItem { Price = 100 });\nvar sub = new MenuCategory();\nsub.Add(new MenuItem { Price = 50 });\ncategory.Add(sub);\nConsole.WriteLine(category.GetPrice());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "150 — GetPrice() recursively sabhi leaf items ka sum karta hai, chahe wo direct ho ya nested category ke andar.",
    detailedAnswer:
      "`category` me ek direct `MenuItem` (100) aur ek nested `sub` category (jisme ek `MenuItem` of 50 hai) add kiye gaye hain. `category.GetPrice()` internally `_items.Sum(i => i.GetPrice())` call karta hai — ye `MenuItem` ke liye directly `Price` return karta hai, aur `MenuCategory` (`sub`) ke liye recursively uske apne items ka sum. Total: 100 + 50 = 150. Ye Composite pattern ka core benefit hai — client ko `sub` ke andar kitni depth hai, farak nahi padta.",
  },
  {
    id: "structural-patterns-tr-6",
    question: "Kya ye statement sahi hai: 'Adapter aur Decorator essentially same pattern hain kyunki dono ek object ko wrap karte hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — dono wrapping karte hain, lekin Adapter interface CHANGE karta hai, Decorator interface SAME rakhta hai aur behavior add karta hai.",
    detailedAnswer:
      "Ye ek common interview trap hai. Adapter ka poora purpose hi ye hai ki ek incompatible interface ko ek naye, client-expected interface me translate kare — input aur output interface genuinely alag hote hain. Decorator same interface ko implement karta hai jo wrapped object bhi implement karta hai — koi interface translation nahi hoti, sirf additional behavior layer hota hai. Ye distinction interview me specifically test hoti hai kyunki dono ka code-shape (constructor me ek inner object lena) similar dikhta hai.",
    redFlag: "'Wrapping karne wale sab patterns basically same hain' jaisa generalization — ye batata hai ki intent-based differentiation samjha nahi gaya.",
  },
  {
    id: "structural-patterns-tr-7",
    question: "Ek `CachingReportServiceProxy` class `IReportService` implement karti hai aur cache-miss hone par hi real `ReportService` ko call karti hai. Ye Proxy pattern ka kaunsa variant hai, aur is design ka ek risk kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Caching Proxy — risk ye hai ki stale data serve ho sakta hai agar cache invalidation properly handle na ho.",
    detailedAnswer:
      "Ye ek Caching Proxy hai — real object ke access ko control karta hai taaki repeated, expensive calls avoid ho sakein. Primary risk cache invalidation hai: agar underlying data change ho jaaye (jaise report ka source data update hua) lekin cache abhi bhi purani value serve kar raha ho, client ko stale data milega. Isliye caching proxies me expiration policy (sliding/absolute) ya explicit invalidation triggers zaroori hain — jaisa example me `SlidingExpiration` use kiya gaya tha.",
    followUp: "Agar ye caching multiple server instances (scaled-out deployment) me chal rahi ho, `IMemoryCache` kaafi hoga?",
  },
  {
    id: "structural-patterns-tr-8",
    question: "Facade pattern zyada grow karke kya problem ban sakta hai, aur isse kaise avoid karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "God Object ban sakta hai jisme poora application logic samet jaaye — Facade ko sirf orchestration tak limit rakhna chahiye, business logic subsystems me hi rehni chahiye.",
    detailedAnswer:
      "Agar developers gradually Facade class me business rules, validation logic, aur direct data manipulation add karte jaayein (kyunki 'ek jagah pe hai, easy hai'), Facade khud ek massive, hard-to-test, hard-to-maintain class ban jaata hai — jise God Object anti-pattern kehte hain. Isse avoid karne ka tareeka: Facade sirf subsystem calls ko sequence/coordinate kare, actual business logic har subsystem ke apne service/handler me rahe. Facade sirf ek thin orchestration layer honi chahiye.",
  },
  {
    id: "structural-patterns-tr-9",
    question: "Kaunsa pattern use karoge agar tumhe ek existing `IReportService` ke access ko authorize karna hai — sirf certain roles hi `GenerateAsync` call kar sakein — bina `ReportService` class ko khud modify kiye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Proxy — ek `AuthorizingReportServiceProxy` jo same interface implement kare aur call forward karne se pehle authorization check kare.",
    detailedAnswer:
      "Ye classic Protection Proxy use case hai. `AuthorizingReportServiceProxy` `IReportService` implement karega, constructor me real `ReportService` aur current user context lega. `GenerateAsync` call hone par pehle role/permission check karega — agar authorized hai to inner `ReportService.GenerateAsync` ko forward karega, warna `UnauthorizedAccessException` throw karega ya empty result dega. DI container me `IReportService` ko is proxy se resolve karke wire kiya ja sakta hai, real `ReportService` ko bilkul modify kiye bina.",
  },
];

export default questions;
