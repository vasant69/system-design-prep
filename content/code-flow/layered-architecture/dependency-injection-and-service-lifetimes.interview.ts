import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "di-lifetimes-1",
    question: "Dependency injection kya hai aur ASP.NET Core ka DI container kya karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Class apni dependencies khud `new` nahi karti, bahar se (constructor se) maangti hai. Container ek registry hai jo service type ko 'aise banao' se map karta hai aur poora dependency graph resolve karke deta hai.",
    detailedAnswer:
      "Do hisse: `IServiceCollection` — `Program.cs` me registrations ki list (`AddScoped<IEmployeeService, EmployeeService>()`). `IServiceProvider` — `app.Build()` pe usse banta hai, aur jab koi type maanga jaata hai to uske constructor parameters inspect karke, un sabki registrations dhoondh ke, poora graph `new` kar deta hai. Faayda: loose coupling (interface pe depend), testability (fake inject), aur lifetime management container ke haath me. Isko Inversion of Control kehte hain — object banane ka control class se container ke paas chala gaya.",
    followUp: "Constructor injection ke alawa property/method injection bhi hote hain — default constructor kyun?",
  },
  {
    id: "di-lifetimes-2",
    question: "Transient, Scoped aur Singleton me farak samjhao, aur har ek ka ek real use bta.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Transient = har injection pe naya instance; Scoped = 1 instance per HTTP request; Singleton = 1 instance poore app me (thread-safe/immutable hona chahiye).",
    detailedAnswer:
      "Transient: ek stateless chhota mapper/helper — banane me kuch nahi, cache karne ka fayda nahi. Scoped: repository, service, `DbContext` — sab request-bound; ek request ke andar wahi instance, request khatam to gaya. Singleton: `IConfiguration`, ek in-memory cache wrapper, ek `IDateTimeProvider`/clock helper — poore app me ek, sab threads share karte hain isliye state immutable ya thread-safe honi chahiye. ASP.NET Core me scope = HTTP request, aur scope dispose pe uske Scoped/Transient `IDisposable` instances dispose ho jaate hain.",
    followUp: "Ek request ke andar Scoped aur Singleton dono resolve karo to kaun-kaun se instances milte hain?",
    redFlag: "'Sab kuch Singleton rakh do, tez rahega' — captive dependency aur thread-safety ka pata na hona.",
  },
  {
    id: "di-lifetimes-3",
    question:
      "Captive dependency kya hai? Hamare project ke code se example do aur fix bta.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek longer-lived service (Singleton) ek shorter-lived service (Scoped) ko constructor se inject kar leti hai — ab wo Scoped instance longer-lived object ke saath hamesha ke liye 'captive' ho jaata hai.",
    detailedAnswer:
      "Example: ek `AuditLogger` jo `IEmployeeRepository` (Scoped) inject karta hai aur `AddSingleton<IAuditLogger, AuditLogger>()` register hai. `AuditLogger` ek baar banta hai, `_repo` ek baar set hota hai — wahi repo (aur module 4 me uska `DbContext`) app-lifetime zinda reh jaata hai. Do problem: (1) us Scoped ka `DbContext` pehli request ke saath dispose hona chahiye tha, ab stale hai; (2) `DbContext` thread-safe nahi, ab saare concurrent requests wahi captive context hit karte hain -> 'A second operation was started on this context' random 500s. Development me `ValidateScopes`/`ValidateOnBuild` isko startup pe throw karta hai. Fix: `AuditLogger` me `IServiceScopeFactory` inject karo (wo Singleton hai, safe), aur `Record(...)` ke andar `using var scope = _scopeFactory.CreateScope(); var repo = scope.ServiceProvider.GetRequiredService<IEmployeeRepository>();` — har call ka apna short-lived scope.",
    followUp: "Transient service ko Singleton me inject karne pe kya hota hai — wo bhi captive hota hai kya?",
    redFlag: "Scope-validation error ko `ValidateScopes = false` se dabaa dena taaki app chal jaaye.",
  },
  {
    id: "di-lifetimes-4",
    question:
      "Ye line samjhao token by token: `builder.Services.AddScoped<IEmployeeService, EmployeeService>();`",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "`.Services` = registration list; `AddScoped` = lifetime Scoped; pehla generic = service type (jo maangoge), doosra = implementation (jo container `new` karega).",
    detailedAnswer:
      "`builder` — `WebApplicationBuilder`. `.Services` — `IServiceCollection`, saari registrations isi pe. `.AddScoped` — extension method, lifetime = ek instance per HTTP request; `AddSingleton`/`AddTransient` isi shape ke, sirf lifetime alag. `<IEmployeeService, EmployeeService>` — service type (key, constructor me yahi maangoge) + implementation type (concrete class jo banega). `()` — koi factory lambda nahi, container khud `new EmployeeService(...)` karega aur uske constructor params bhi resolve karega. Call `IServiceCollection` return karti hai to `.AddScoped(...).AddScoped(...)` chain bhi ho sakti hai.",
    followUp: "Agar `EmployeeService` ka constructor `IEmployeeRepository` maangta hai to wo kaise resolve hota hai?",
  },
  {
    id: "di-lifetimes-5",
    question:
      "App compile ho gaya, start hua, pehli request pe: 'Unable to resolve service for type IEmployeeService while attempting to activate EmployeesController'. Kya hua?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`Program.cs` me `AddScoped<IEmployeeService, EmployeeService>()` registration missing hai. Container ke paas `IEmployeeService` ki koi mapping nahi.",
    detailedAnswer:
      "DI container controller ke constructor params inspect karta hai, `IEmployeeService` ki registration dhoondta hai, nahi milti to controller activate karte waqt `InvalidOperationException` throw karta hai (compile-time nahi, request-time). Fix: `builder.Services.AddScoped<IEmployeeService, EmployeeService>();` `app.Build()` se pehle. Ulta trap: constructor me `EmployeeService` (concrete) maang lena jabki `IEmployeeService` register kiya — same error, ulti direction. Rule: constructor me wahi type maango jo register hua.",
    followUp: "Is galti ko startup/compile ke kareeb kaise pakad sakte ho? (ValidateOnBuild, integration test)",
  },
  {
    id: "di-lifetimes-6",
    question:
      "`EmployeeService` ko koi 'performance ke liye' `AddSingleton` kar deta hai. `EmployeeService` `IEmployeeRepository` (Scoped) leta hai. Kya hoga — dev me aur agar prod me ship ho gaya?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Dev: startup pe crash — 'Cannot consume scoped service IEmployeeRepository from singleton IEmployeeService'. Prod (validation off): captive repo/`DbContext`, load pe random concurrency 500s jo reproduce karna mushkil.",
    detailedAnswer:
      "Development me `ValidateOnBuild` + `ValidateScopes` default on hain, to app boot hi nahi hoga — accha, bug jaldi pakda gaya. Agar koi `ValidateScopes = false` karke deploy kar de, to Singleton `EmployeeService` pehli request ka repo capture kar leta hai; wo repo ka `DbContext` (module 4) poore app ke liye ek ho jaata hai, saare threads use share karte hain, aur EF Core thread-safe na hone se 'A second operation was started on this context instance' wale intermittent 500s aate hain jo load ke bina reproduce nahi hote. Fix seedha hai: `EmployeeService` ko wapas `AddScoped`. Service/repository request-bound hain, unhe Singleton banana galat.",
    followUp: "Singleton service me thread-safe mutable cache chahiye to kya use karoge?",
    redFlag: "Ye maan lena ki local single-request test pass ho gaya to lifetime theek hai.",
  },
  {
    id: "di-lifetimes-7",
    question:
      "`IServiceScopeFactory` khud kaunsa lifetime rakhta hai, aur usse Singleton ke andar scope banana thread-safe kyun hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`IServiceScopeFactory` Singleton hai (framework register karta hai), isliye use kisi bhi Singleton me inject karna safe hai. Har `CreateScope()` ek naya, independent scope deta hai — koi shared mutable state nahi.",
    detailedAnswer:
      "Factory ka kaam sirf naye scopes banana hai, wo khud stateless/thread-safe hai. `using var scope = _scopeFactory.CreateScope()` har call pe ek fresh `IServiceScope` deta hai jiska apna `IServiceProvider` hai — ussе resolve kiye Scoped instances us scope tak seemit rehte hain aur `using` block ke end pe dispose ho jaate hain. Do threads jo ek saath `CreateScope()` call karte hain, unhe do alag scopes milte hain, do alag `DbContext`. Isliye pattern background services (`IHostedService`), Singletons, aur message consumers me standard hai jahan per-message/per-tick ek Scoped unit of work chahiye.",
    followUp: "`IHostedService` / `BackgroundService` me DB access karne ka sahi pattern kya hai?",
  },
  {
    id: "di-lifetimes-8",
    question:
      "Naya service register karte waqt lifetime kaise decide karoge? Ek simple rule aur uske exceptions bta.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Default Scoped (request/DB/user-bound sab). Singleton sirf jab cheez stateless ya thread-safe/immutable ho aur genuinely shared ho. Transient sirf jab sasta aur stateless ho.",
    detailedAnswer:
      "Rule: 'request/DB touch karti hai? -> Scoped'. Repository, service, `DbContext`, `HttpContext`-dependent cheezein — Scoped. 'Poore app me ek hi, aur state nahi ya thread-safe hai?' -> Singleton: config, cache wrapper, clock/id-generator, `IHttpClientFactory`-managed clients. 'Chhota stateless helper jise cache karne ka fayda nahi?' -> Transient: mappers, validators (agar stateless). Exceptions/traps: Transient ko Singleton me inject karoge to wo bhi captive; heavy object Transient banana allocation churn; Singleton me mutable `List`/`Dictionary` bina `Concurrent*`/lock ke race condition. Jab doubt ho — Scoped.",
    followUp: "FluentValidation ke validators ko kaunse lifetime pe register karte ho aur kyun?",
    redFlag: "Har cheez ek hi lifetime pe daal dena (sab Transient ya sab Singleton) bina soche.",
  },
];

export default questions;
