import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "layered-clean-onion-tr-1",
    question: "Apne last project ki architecture explain karo.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "Ek genuinely good answer Layered vs Clean/Onion me se ek specific approach naam se bataye, dependency direction explain kare, aur ye bhi bataye ki approach kyun choose kiya gaya.",
    detailedAnswer:
      "'MVC use kiya' architecture ka jawab nahi hai — MVC presentation-layer pattern hai. Strong answer: 'Humne Layered architecture use kiya — Controller se Service (business layer) se Repository (data layer), har layer sirf neeche wali layer pe depend karta tha.' Ya: 'Humne Clean Architecture use kiya kyunki business rules complex the aur testability priority thi — Domain layer ko koi EF Core/ASP.NET Core dependency nahi thi, Application layer interfaces define karta tha jo Infrastructure implement karta tha.' Dono valid hain — important part ye bata pana hai ki dependency kis direction me flow karta tha aur wo choice kyun ki gayi.",
    followUp: "Us architecture ka koi trade-off face kiya jo team ko baad me realize hua?",
  },
  {
    id: "layered-clean-onion-tr-2",
    question: "Layered Architecture me kya problem chhupi rehti hai jo Clean/Onion Architecture solve karti hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Business Layer directly Data Access Layer pe depend karta hai — wrong-direction coupling jo business logic ki testability/portability infrastructure se tie kar deta hai.",
    detailedAnswer:
      "Layered architecture me Business Layer (jaise `IOrderService`) directly `IOrderRepository`/`DbContext` types reference karta hai. Iska matlab business rules ki reusability aur testability underlying data-access technology se coupled ho jaati hai — agar EF Core se Dapper switch karna ho, ya business logic ko kisi doosre context (background job) me reuse karna ho, dependency wrong direction me hai. Clean/Onion Architecture Dependency Inversion Principle apply karke ise fix karti hai — Domain/Application sirf interfaces jaante hain, actual implementation Infrastructure layer me hoti hai jo dono ko reference karta hai, ulta nahi.",
  },
  {
    id: "layered-clean-onion-tr-3",
    question: "Clean Architecture aur Onion Architecture me kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Conceptually near-identical — dono dependency-inversion-centric, concentric-layer approaches hain, farak mostly naming/diagram-style ka hai.",
    detailedAnswer:
      "Robert C. Martin ka Clean Architecture aur Jeffrey Palermo ka Onion Architecture dono same core principle share karte hain: dependencies andar ki taraf point karte hain, domain center me hota hai aur usse koi outward dependency nahi hoti. Practical implementation me ye almost indistinguishable hain — donon multi-layer, interfaces-defined-at-consumer-side approach follow karte hain. Interview me over-differentiate karne ki zaroorat nahi — ye samajhna important hai ki dono ka underlying mechanism Dependency Inversion Principle hai.",
  },
  {
    id: "layered-clean-onion-tr-4",
    question: "Ek multi-project Clean Architecture setup me `MyApp.Domain` project ko `MyApp.Infrastructure` ko reference karne ki koshish ki jaaye, to kya hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Ye ulti direction hai isliye normally allowed nahi karte — agar koi galti se add kar de, build to ho jaayega (agar reference technically add ho sake) lekin ye poore Clean Architecture ke principle ko violate karega.",
    detailedAnswer:
      "Standard Clean Architecture setup me `MyApp.Domain` project literally koi project reference nahi rakhta — na Application ka, na Infrastructure ka. Agar koi developer galti se `MyApp.Domain.csproj` me `MyApp.Infrastructure` ka `<ProjectReference>` add kar de, .NET compiler ise allow kar dega (koi automatic circular-reference detection is direction me nahi hai jab tak Infrastructure wapas Domain ko na reference kare, jo circular dependency error dega). Isliye ye discipline team convention/code-review se maintain honi chahiye — architecture tests (jaise `NetArchTest` library) is tarah ki violations ko automated CI check se catch karne ka common practical solution hai.",
    followUp: "Architecture tests kaise likhoge jo automatically verify karein ki Domain project kisi outer layer ko reference nahi kar raha?",
  },
  {
    id: "layered-clean-onion-tr-5",
    question: "Kya Clean Architecture har .NET project ke liye best practice hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye ek trade-off hai (structure/testability vs simplicity/speed), universal best practice nahi. Chhote/simple projects ke liye overkill ho sakta hai.",
    detailedAnswer:
      "Ye ek classic interview trap hai jahan candidates 'best practices' ko blindly recite karte hain bina context consider kiye. Clean Architecture genuinely valuable hai jab business logic complex/long-lived hai, multiple teams involved hain, infrastructure swap hone ki real possibility hai, ya testability business-critical hai. Ye overkill hai chhote, short-lived, CRUD-heavy projects ke liye — extra projects, extra files, extra indirection bina proportional benefit ke. Senior-level answer honesty dikhata hai: 'depends on the project' — har architectural choice ek trade-off hai, universal upgrade nahi.",
    redFlag: "'Clean Architecture hamesha better hai, hum sab projects me use karte hain' jaisa unconditional statement — context-awareness ki kami dikhata hai.",
  },
  {
    id: "layered-clean-onion-tr-6",
    question: "Ek existing Layered architecture project me EF Core se Dapper switch karna hai. Layered vs Clean Architecture setup me is change ka impact kaise differ karega?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Layered me business layer ke andar bhi changes lag sakte hain agar EF Core types leak ho gaye the; Clean/Onion me sirf Infrastructure layer ka naya implementation likhna padega, Application/Domain untouched rahega.",
    detailedAnswer:
      "Agar Layered architecture me `IOrderService` ne kahin EF Core-specific types (jaise `IQueryable`, `DbSet`) directly use kiye hain, Dapper switch karne par business logic ke andar bhi changes karne padenge. Clean/Onion Architecture me Application layer sirf `IOrderRepository` interface jaanta hai — actual implementation (`EfCoreOrderRepository`) Infrastructure layer me hai. Switch karne ke liye sirf ek naya `DapperOrderRepository : IOrderRepository` likhna hai aur DI registration change karni hai — Application/Domain layers ka ek bhi test case ya line change nahi hogi. Ye exactly wo scenario hai jahan Clean Architecture ka structural investment pay off karta hai.",
  },
  {
    id: "layered-clean-onion-tr-7",
    question: "Domain layer me 'zero outward dependencies' ka matlab practically kya hai — kya iska matlab Domain layer bilkul kuch reference nahi karta?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Domain layer .NET base class library (System namespace) to use kar sakta hai — 'zero outward dependencies' ka matlab hai koi framework/infrastructure-specific package (EF Core, ASP.NET Core, external SDKs) reference nahi karna, na hi kisi outer-layer project ko.",
    detailedAnswer:
      "Domain layer plain C# classes hoti hain jo `System` namespace jaisi built-in .NET types use kar sakti hain (jaise `List<T>`, `DateTime`) — ye 'framework dependency' nahi hai, ye language ka hi part hai. 'Zero outward dependencies' specifically matlab hai: koi NuGet package jo infrastructure-specific ho (EF Core, ASP.NET Core, HTTP clients, logging frameworks) aur koi project reference jo Application/Infrastructure/Presentation layers ki taraf jaaye. Ye isliye zaroori hai taaki Domain layer bina kisi framework setup ke, sirf plain unit tests se completely test ho sake.",
  },
  {
    id: "layered-clean-onion-tr-8",
    question: "Ek team Clean Architecture setup follow kar rahi hai, lekin ek developer ne 'jaldi ke liye' Controller me directly `DbContext` inject kar diya, bypass karke Application layer ko. Ye kya problem create karega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ye poore architecture ke guarantee ko silently break karta hai — Presentation ab directly Infrastructure pe depend kar raha hai, jo Clean Architecture ka core rule violate karta hai, aur future me isse pehchanna mushkil ho jaata hai kyunki koi compile error nahi aata.",
    detailedAnswer:
      "Agar `Controller` (Presentation layer) directly `DbContext` (Infrastructure) inject kar leta hai, do problems create hoti hain: (1) Business logic bypass ho gayi — validation/rules jo Application layer me honi chahiye thi, ab controller me ya kahin nahi hain. (2) Presentation ab Infrastructure ke saath tightly coupled ho gaya — agar EF Core switch ho, controller code bhi break hoga. Ye compile-time error nahi deta (agar project references technically allow karte hain) isliye ye discipline se hi maintain hota hai — code review, architecture tests (`NetArchTest`), ya project reference restrictions is tarah ki 'shortcuts' ko catch karne ke liye zaroori hain.",
    followUp: "Isse prevent karne ke liye kya automated safeguard add karoge CI pipeline me?",
  },
];

export default questions;
