import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "clean-arch-1",
    question: "Clean Architecture ko explain karo — layers kaunse hain aur dependencies kis direction me jaati hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Chaar concentric layers: Domain (centre), Application, Infrastructure, Api. Saari source dependencies andar Domain ki taraf point karti hain; Domain kisi framework par depend nahi karta.",
    detailedAnswer:
      "Domain me pure business entities, value objects, domain exceptions aur repository/service interfaces hote hain — koi framework reference nahi. Application me use-case services, DTOs, validators aur ports (jaise `IPanVerificationClient`) hote hain; ye sirf Domain ko reference karta hai. Infrastructure me `AppDbContext`, repository implementations, external API clients aur file storage hote hain; ye Application + Domain ko reference karta hai. Api me controllers, `Program.cs`, middleware aur composition root hota hai jahan interfaces ko implementations se map kiya jaata hai. Dependency Rule ye hai ki har arrow bahar se andar jaata hai, Domain ka out-degree zero hota hai.",
    followUp: "Domain project me kya-kya nahi hona chahiye?",
    redFlag: "Layers ke naam yaad hain lekin dependency direction ulti bata dena, ya ye kehna ki Domain ko database access ke liye Infrastructure chahiye.",
  },
  {
    id: "clean-arch-2",
    question: "`IEmployeeRepository` interface aur uska `EmployeeRepository` implementation — dono kahan rakhoge aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Interface Domain (ya Application) me, implementation Infrastructure me. Ye Dependency Inversion hai.",
    detailedAnswer:
      "Abstraction andar rehta hai taaki Application/Domain sirf contract dekhein, concrete class nahi. Implementation bahar Infrastructure me rehta hai jahan EF Core, connection strings aur SQL details ke saath kaam hota hai. Isse Application ko Infrastructure ka koi reference nahi chahiye — build-time par ye enforce ho jaata hai ki business layer persistence details se coupled nahi hai. Agar interface Infrastructure me hoti to Application ko Infrastructure reference karna padta aur dependency direction ulti ho jaati.",
    followUp: "Agar interface Infrastructure me daal doge to compile-time par kya galat hoga?",
  },
  {
    id: "clean-arch-3",
    question: "DTOs aur validators kis project me rehte hain, aur agar unhe Api project me rakh diya jaaye to kya problem aati hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "DTOs aur validators Application me rehte hain. Api me rakhne se Application ko Api reference karna padega — ulta ya circular dependency.",
    detailedAnswer:
      "Application services request/response DTOs return aur accept karte hain, isliye woh types Application me hone chahiye. Validators (FluentValidation) bhi use-case ke input par lagte hain, isliye wahi. Agar DTOs Api me hote, to `EmployeeService` (Application me) ko Api project ka reference chahiye hota — jo Dependency Rule todta hai aur aksar circular reference deta hai jo compile hi nahi hoga. Api sirf Application ke DTOs consume karta hai; kabhi-kabhi Api ke apne alag view-model/response-shaping types ho sakte hain jo Application DTOs se map hote hain.",
    redFlag: "Ye kehna ki 'DTO kahin bhi rakh sakte ho, farq nahi padta' — dependency direction ka matlab samajh nahi aaya.",
  },
  {
    id: "clean-arch-4",
    question: "Ye csproj setup dekho — kya ye Clean Architecture ke Dependency Rule ko satisfy karta hai?\n```xml\n<!-- EmployeeManagement.Domain.csproj -->\n<ItemGroup>\n  <ProjectReference Include=\"..\\EmployeeManagement.Infrastructure\\EmployeeManagement.Infrastructure.csproj\" />\n</ItemGroup>\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Domain, Infrastructure ko reference kar raha hai — dependency bahar ki taraf ja rahi hai, jo Dependency Rule ka seedha violation hai.",
    detailedAnswer:
      "Domain sabse andar ki layer hai; usko kisi bhi bahari layer (Application, Infrastructure, Api) ka reference nahi hona chahiye. Yahan Domain -> Infrastructure ka reference hai, jiska matlab Domain ab EF Core, HttpClient aur baaki framework details ke transitive dependencies utha raha hai. Sahi direction: Infrastructure -> Application -> Domain. Repository implementation Infrastructure me hai lekin uska interface Domain me hona chahiye, taaki Domain ko Infrastructure ki zaroorat hi na pade.",
    followUp: "Is galti ko fix karne ke liye tum interface aur implementation ko kaise rearrange karoge?",
  },
  {
    id: "clean-arch-5",
    question: "Onion Architecture, Hexagonal Architecture, aur Ports and Adapters — kya ye alag cheezein hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Nahi, teeno essentially same idea hain: business core ke chaaron taraf interfaces (ports), unme implementations (adapters), aur dependencies andar core ki taraf.",
    detailedAnswer:
      "Hexagonal / Ports and Adapters (Alistair Cockburn) app ke chaaron taraf ports define karta hai jinme driving adapters (controllers) aur driven adapters (DB, external APIs) plug hote hain. Onion Architecture (Jeffrey Palermo) same cheez ko concentric rings ke roop me dikhata hai with Domain centre me. Clean Architecture (Robert Martin) in dono ko consolidate karta hai aur 'use case' ko ek explicit layer bana deta hai. Interview me kisi bhi naam par jawaab same hai: dependencies inward, framework bahar, business rules framework-independent.",
    redFlag: "In teeno ko ek doosre ke fundamentally different architectures batana, ya inme se kisi ko ek specific framework/library samajhna.",
  },
  {
    id: "clean-arch-6",
    question: "Client bolta hai 'har naya project Clean Architecture template se hi banega, exceptions nahi'. Tumhari raay?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Blanket rule galat hai. Clean Architecture ka cost hai — chhote services me woh over-engineering ban jaata hai. Decision problem ke size par depend karta hai.",
    detailedAnswer:
      "Clean Architecture tab worth hai jab multiple entry points same logic share karte hain, persistence/provider change ka realistic chance hai, team badi hai (4+), ya compliance ke liye business rules isolate rakhne hain. Ek 3-endpoint internal tool ke liye 4 projects sirf slow build, zyada boilerplate aur 'ye kahan rakhoon' friction dete hain — ek startup ne aise tool ko 6 mahine baad single project me collapse kiya. Better rule: default single project + folders; jab dard mehsoos ho (logic duplication across hosts, ya ek service class 800 lines ka), tab split karo. Ye judgment call maturity dikhata hai.",
    followUp: "Kis concrete signal par tum ek single-project service ko multi-project me todoge?",
    redFlag: "Bina caveat ke 'Clean Architecture hamesha best hai' — pattern ko context se decouple karna.",
  },
  {
    id: "clean-arch-7",
    question: "CQRS aur MediatR kya hain, aur inhe kab add karna chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "CQRS commands (writes) aur queries (reads) ko alag models/handlers me todta hai. MediatR ek in-process dispatcher hai jo command/query ko uske handler tak route karta hai. Add tab karo jab use-case count aur cross-cutting logic itna badh jaaye ki ek service class unwieldy ho.",
    detailedAnswer:
      "CQRS ke saath har use-case apni chhoti class ban jaata hai: `CreateEmployeeCommand` + `CreateEmployeeHandler : IRequestHandler<CreateEmployeeCommand, int>`. Controller `IMediator.Send(command)` call karta hai. Fayda: focused single-responsibility handlers, aur cross-cutting concerns (logging, validation, transactions) pipeline behaviors me ek jagah. Nuksaan: extra indirection — `Send()` se handler tak go-to-definition seedha nahi jaata; har chhota read = command + handler + response teen files; chhoti team confuse hoti hai. Rule: 40+ use-cases ya bahut saara cross-cutting logic ho to lo; warna plain `EmployeeService` inject karna kaafi hai.",
    followUp: "MediatR pipeline behavior kya hota hai aur usme validation kaise plug karoge?",
    redFlag: "MediatR ko 'controllers thin dikhane' ke liye add karna aur ye maan lena ki isse architecture automatically clean ho jaata hai.",
  },
  {
    id: "clean-arch-8",
    question: "DI wiring multiple projects me kaise hoti hai jab concrete classes Infrastructure me hain lekin Api hi composition root hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Har project (Infrastructure, Application) apna ek `IServiceCollection` extension method deta hai jaise `AddInfrastructure(config)`; `Program.cs` sirf un extension methods ko call karke sab compose karta hai.",
    detailedAnswer:
      "Infrastructure me ek `public static class DependencyInjection` hota hai with `AddInfrastructure(this IServiceCollection services, IConfiguration config)` jo `AddDbContext`, `AddScoped<IEmployeeRepository, EmployeeRepository>()`, `AddHttpClient<IPanVerificationClient, PanVerificationClient>()` waghairah register karta hai. Application ka apna `AddApplication()` validators aur services register karta hai. `Program.cs` me sirf `builder.Services.AddApplication(); builder.Services.AddInfrastructure(builder.Configuration);` — Api ko ye jaanne ki zaroorat nahi ki Infrastructure ke andar kaunse concrete types hain. Yahi 'composition root' pattern hai: interface-to-implementation mapping ek hi jagah, application ke edge par.",
    followUp: "Agar Application aur Infrastructure dono ek hi interface register karein alag implementations ke saath, last kaun jeetega?",
  },
];

export default questions;
