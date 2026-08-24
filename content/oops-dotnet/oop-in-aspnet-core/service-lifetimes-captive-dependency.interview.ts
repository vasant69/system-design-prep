import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lifetimes-tr-1",
    question: "Teen service lifetimes explain karo — Transient, Scoped, Singleton — exact semantics ke saath.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Wipro", "Amazon"],
    shortAnswer:
      "Transient = har resolution pe naya instance; Scoped = ek instance per HTTP request; Singleton = ek instance poori app lifetime ke liye.",
    detailedAnswer:
      "Transient services stateless, lightweight cheezon ke liye best hain — har baar container inhe resolve karta hai, naya object milta hai, chahe same request me do jagah use ho raha ho. Scoped services ek request boundary ke andar consistent rehte hain — same request me jahan bhi resolve ho, same instance milega, request khatam hote hi disposed ho jaata hai — DbContext isi wajah se Scoped hai. Singleton services app startup se shutdown tak ek hi instance rehte hain, saare requests aur users ke beech shared — configuration objects, in-memory caches jaise cheezon ke liye sahi hain.",
    followUp: "In teeno me se konsa sabse zyada memory-efficient hai, aur konsa sabse risky agar galat use ho?",
  },
  {
    id: "lifetimes-tr-2",
    question: "Captive dependency kya hai, poore detail me explain karo.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Amazon", "Flipkart"],
    shortAnswer:
      "Jab ek Singleton service apne constructor me ek Scoped/Transient dependency inject karta hai, wo dependency ki lifetime effectively Singleton jaisi ho jaati hai — original intended per-request lifetime se lambi.",
    detailedAnswer:
      "Singleton sirf ek baar banta hai, isliye uske constructor me resolve hui koi bhi dependency bhi sirf ek baar hi resolve hoti hai — chahe wo dependency khud Scoped register hui ho. Us Scoped instance ko Singleton ne 'capture' kar liya — ab wo saare requests ke beech share ho raha hai, jabki uska design intent tha ek fresh instance per request. Isse do problems: stale/shared state across unrelated requests, aur agar wo type thread-safe nahi hai (jaise DbContext), concurrent requests crash kar sakte hain.",
    followUp: "Ye bug production me kaise manifest hota hai, aur usse debug karna kyun mushkil hota hai?",
  },
  {
    id: "lifetimes-tr-3",
    question: "Captive dependency ko fix karne ke do tareeke batao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Ya to IServiceScopeFactory inject karke zaroorat padne par khud ek naya scope create karo, ya jaanch lo ki service ko sach me Singleton hona chahiye ya nahi.",
    detailedAnswer:
      "Option 1: IServiceScopeFactory ko constructor me inject karo (ye khud Singleton-safe hai), aur jab actual kaam karna ho (jaise ek background job run karte waqt), `scopeFactory.CreateScope()` se ek naya scope banao, usse Scoped dependency resolve karo, kaam khatam hone par scope ko dispose (using statement) kar do — fresh, correctly-scoped instance milta hai har baar. Option 2: reconsider design — agar service ko genuinely per-request hona chahiye, usko Singleton se Scoped/Transient kar do, mismatch hi khatam ho jaata hai. Zyadatar production fixes Option 2 se hi ho jaate hain jab team realize karti hai Singleton zaroori hi nahi tha.",
  },
  {
    id: "lifetimes-tr-4",
    question: "Ye registration valid hai ya problematic? Kyun?\n```csharp\nbuilder.Services.AddSingleton<INotificationQueue, InMemoryNotificationQueue>();\nbuilder.Services.AddScoped<IOrderService, OrderService>();\n\npublic class OrderService : IOrderService\n{\n    public OrderService(INotificationQueue queue) { }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Valid hai — ek Scoped service ka Singleton pe depend karna problem nahi hai, sirf reverse (Singleton capturing Scoped) problem hai.",
    detailedAnswer:
      "Ye completely fine hai. `OrderService` (Scoped) `INotificationQueue` (Singleton) ko depend kar raha hai — chhoti lifetime badi lifetime ko refer kar rahi hai, jo bilkul valid hai, kyunki Singleton to hai hi har jagah 'available' pura app lifetime, koi lifetime mismatch nahi hoti. Agar ulta hota — ek Singleton `OrderService` ko constructor me inject karta — tab problem hoti, kyunki OrderService khud AppDbContext (Scoped) hold karta hai andar, jo capture ho jaata.",
    followUp: "Agar OrderService khud kisi Scoped dependency ko hold kare, aur ye poora chain ek Singleton se inject ho jaaye, kya hoga?",
  },
  {
    id: "lifetimes-tr-5",
    question: "Ye code startup pe kya karega (Development environment me)?\n```csharp\nbuilder.Services.AddSingleton<ReportCacheWarmer>();\nbuilder.Services.AddScoped<AppDbContext>();\n\npublic class ReportCacheWarmer\n{\n    public ReportCacheWarmer(AppDbContext db) { }\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Development environment me `ValidateScopes` default true hone ki wajah se app startup pe hi `InvalidOperationException` throw hoga.",
    detailedAnswer:
      "ASP.NET Core Development environment me by default `ValidateScopes = true` set hota hai, jo exactly is tarah ke lifetime mismatches ko detect karta hai — jab container `ReportCacheWarmer` (Singleton) ko resolve karne ki koshish karega aur uske constructor me `AppDbContext` (Scoped) dekhega, ye validation fail ho jaayega aur clear error message ke saath crash hoga: 'Cannot consume scoped service ... from singleton'. Production me ye validation by default off hoti hai, isliye same code Production me silently 'chal jaata' hai — jab tak concurrent load na aaye.",
    followUp: "Production me bhi ye validation enable karne ka koi tareeka hai deployment se pehle catch karne ke liye?",
  },
  {
    id: "lifetimes-tr-6",
    question: "Tumhari team ek `MetricsAggregatorService` bana rahi hai jo har request ka response time track karke ek in-memory rolling average maintain karta hai, poore app ke liye ek hi. Isko kaunsi lifetime deni chahiye, aur agar isko andar `AppDbContext` bhi chahiye ho to design kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "MetricsAggregatorService ko Singleton hona chahiye (shared state across all requests by design); agar DbContext chahiye to IServiceScopeFactory ke through per-use scope banao, direct constructor injection nahi.",
    detailedAnswer:
      "Rolling average jaisa shared, cross-request state Singleton ka bilkul sahi use case hai — yahi to Singleton ka purpose hai. Lekin agar isko occasionally metrics ko DB me persist karna ho (AppDbContext chahiye), direct constructor injection captive dependency create karega. Sahi approach: constructor me `IServiceScopeFactory` lo, jab persist karna ho (jaise ek periodic flush method me) `using var scope = _scopeFactory.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();` — is tarah har flush apna fresh, correctly-scoped DbContext use karta hai, aur Singleton apni asli shared-state responsibility (rolling average) ke liye hi Singleton rehta hai.",
    redFlag: "Seedha AppDbContext ko constructor me inject kar lena 'kyunki convenient hai' — ye bilkul wahi captive dependency bug create karega jo is topic ka core hai.",
  },
  {
    id: "lifetimes-tr-7",
    question: "Code review me tumhe ek `IUserContext` (Scoped, current logged-in user ka data holds karta hai) mila jo ek `AuditLogWriter` (Singleton, sab audit logs ek shared in-memory buffer me collect karta hai) ke constructor me inject ho raha hai. Kya flag karoge, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ye exactly captive dependency hai — Singleton `AuditLogWriter` `IUserContext` (Scoped) ko capture karega, matlab audit logs har request ke liye same (pehli request wale) user ka data dikhayenge.",
    detailedAnswer:
      "Ye bug particularly dangerous hai kyunki symptom silent aur security-relevant hai — audit log entries galat user ko attribute ho sakti hain, jo compliance/BFSI-type context me genuinely serious issue hai. Fix: `AuditLogWriter` ko current user ki info constructor se lene ki jagah, method parameter ke through liya jaana chahiye — jaise `LogAsync(string userId, string action)` — caller (jo khud Scoped/per-request context me hai, jaise ek middleware ya controller) apna current `IUserContext.UserId` pass kare. Ye pattern — Singleton ko per-request data method parameter se lena, constructor se nahi — captive dependency se poori tarah bachta hai.",
    followUp: "Agar IUserContext ko sach me constructor-level dependency banana zaroori ho (redesign possible na ho), koi aur fix hai?",
  },
  {
    id: "lifetimes-tr-8",
    question: "Kya ye statement sahi hai: 'Scoped services thread-safe hote hain kyunki wo per-request hote hain, isliye concurrency ka concern hi nahi'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Galat — Scoped hona sirf 'ek request ke andar same instance' guarantee karta hai, thread-safety guarantee nahi karta agar wahi instance kisi tarah multiple threads se accessed ho (jaise captive dependency ke through).",
    detailedAnswer:
      "Ye ek subtle trap hai. Normally ek single HTTP request ek hi thread (ya sequentially-awaited async flow) pe process hoti hai, isliye practically Scoped service usually single-threaded access hi dekhta hai — lekin ye 'thread-safe hone' ki guarantee nahi hai, ye sirf normal request-processing pattern ka side-effect hai. Agar wahi Scoped instance kisi captive dependency ke through ek Singleton ke andar capture ho jaaye, ab wo instance concurrently multiple requests/threads se access hoga — aur DbContext jaisi Scoped services explicitly thread-unsafe hain, crash karengi. Isliye 'Scoped = thread-safe' ek galat generalization hai — asli guarantee sirf 'per-request instance' hai, thread-safety alag concern hai jo lifetime mismatch hone par bilkul break ho sakta hai.",
    redFlag: "'Scoped hai to thread-safe hai' jaisa absolute statement bol dena — ye exactly wahi misunderstanding hai jo captive dependency bugs ko production me surprising banati hai.",
  },
  {
    id: "lifetimes-tr-9",
    question: "Ek `IJobScheduler` interface likho jo Singleton ke through register hoga, aur usme ek method ho jo internally ek Scoped `AppDbContext` use karke pending jobs fetch kare — captive dependency avoid karte hue poora implementation likho.",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "IServiceScopeFactory constructor me inject karo, method ke andar CreateScope() se fresh DbContext resolve karo, using block se dispose karo.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic interface IJobScheduler\n{\n    Task<List<PendingJob>> GetPendingJobsAsync();\n}\n\npublic class JobScheduler : IJobScheduler\n{\n    private readonly IServiceScopeFactory _scopeFactory;\n\n    public JobScheduler(IServiceScopeFactory scopeFactory)\n    {\n        _scopeFactory = scopeFactory;\n    }\n\n    public async Task<List<PendingJob>> GetPendingJobsAsync()\n    {\n        using var scope = _scopeFactory.CreateScope();\n        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();\n        return await db.PendingJobs\n            .Where(j => !j.IsCompleted)\n            .ToListAsync();\n    }\n}\n\n// Program.cs\nbuilder.Services.AddSingleton<IJobScheduler, JobScheduler>();\nbuilder.Services.AddScoped<AppDbContext>();\n```\nKey evaluation points: no direct `AppDbContext` in the constructor, `IServiceScopeFactory` used correctly, scope disposed via `using`, and the DbContext resolved fresh inside the method rather than captured at construction time.",
  },
];

export default questions;
