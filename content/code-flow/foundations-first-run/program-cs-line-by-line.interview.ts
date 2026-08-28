import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pcl-1",
    question: "Apni `Program.cs` walk-through karo — kaunsa hissa kya karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Do halves, split by `app.Build()`. Upar `builder.Services.Add...` se services DI container me register hoti hain. Neeche `app.Use.../app.Map...` se middleware pipeline banti hai. `app.Run()` server start karke block ho jaata hai.",
    detailedAnswer:
      "`var builder = WebApplication.CreateBuilder(args)` ek builder deta hai jisme configuration (`appsettings` + env vars), logging aur DI container pre-wired hote hain. Phir `builder.Services.AddControllers()`, `AddEndpointsApiExplorer()`, `AddSwaggerGen()` — aur aage `AddDbContext`, service classes, auth — sab register hoti hain. `var app = builder.Build()` service collection ko seal karke `WebApplication` deta hai. Uske baad middleware: `UseHttpsRedirection`, `UseAuthentication`, `UseAuthorization`, `MapControllers` — ye har request pe registration order me top-to-bottom chalti hain. `app.Run()` Kestrel start karke thread block kar deta hai jab tak Ctrl+C na aaye.",
    followUp: "In dono halves ka boundary `app.Build()` hi kyun hai — build ke baad service register kyun nahi kar sakte?",
  },
  {
    id: "pcl-2",
    question: "`AddControllers()`, `AddEndpointsApiExplorer()`, `AddSwaggerGen()` — teeno alag-alag kya karte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`AddControllers` = MVC/Web API core (routing, model binding, JSON, validation). `AddEndpointsApiExplorer` = endpoint metadata expose karta hai. `AddSwaggerGen` = us metadata se OpenAPI/Swagger document generate karta hai.",
    detailedAnswer:
      "`AddControllers()` ke bina koi `[HttpGet]`/`[HttpPost]` action route hi nahi hoga — ye controller discovery, attribute routing, `System.Text.Json` formatters, aur `[ApiController]` model validation register karta hai. `AddEndpointsApiExplorer()` ek feature hai jo runtime pe available endpoints ki list/metadata expose karta hai — Swagger aur dusre tools isse padhte hain. `AddSwaggerGen()` Swashbuckle ka hissa hai jo controllers scan karke ek OpenAPI JSON doc banata hai; `app.UseSwaggerUI()` us doc se interactive `/swagger` page render karta hai.",
    followUp: "Agar `AddControllers()` likhna bhool jaao aur `MapControllers()` rakh do — app start hoga? Endpoints kaam karenge?",
    redFlag: "'Teeno Swagger ke liye hain' — `AddControllers()` core Web API hai, Swagger optional add-on hai.",
  },
  {
    id: "pcl-3",
    question:
      "Middleware pipeline me order kyun matter karta hai? Ek concrete galat-order do jo bina error ke security break kare.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Har `app.Use...` registration order me chalti hai. `app.UseAuthorization()` ko `app.MapControllers()` ke baad rakhne se action pehle run ho jaata hai aur `[Authorize]` kabhi enforce nahi hota — koi error nahi, bas security hole.",
    detailedAnswer:
      "Pipeline ek chain hai: request top-to-bottom, response bottom-to-top. Jo cheez request ko gate karti hai — HTTPS redirect, authentication, authorization — usko endpoint execution (`MapControllers`) se pehle aana chahiye. Galat order:\n```csharp\napp.UseHttpsRedirection();\napp.MapControllers();   // action yahin run + response ready\napp.UseAuthorization(); // number hi nahi aata\n```\nYahan `[Authorize]` laga protected employee endpoint bina token ke `200` de dega. Sahi order: `UseHttpsRedirection` -> `UseAuthentication` -> `UseAuthorization` -> `MapControllers`. Doosra common bug: `UseCors()` ko `UseAuthorization()` ke baad rakhna, jisse browser pre-flight `OPTIONS` fail hoti hai.",
    followUp: "`UseAuthentication()` aur `UseAuthorization()` me se pehle kaunsa aur kyun?",
  },
  {
    id: "pcl-4",
    question:
      "Ye code compile hoga? Run pe kya hoga?\n```csharp\nvar builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddControllers();\nvar app = builder.Build();\nbuilder.Services.AddSwaggerGen();\napp.MapControllers();\napp.Run();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile ho jaayega, lekin `builder.Services.AddSwaggerGen()` line `app.Build()` ke baad hai — recent .NET me `InvalidOperationException: Cannot modify ServiceCollection after the application is built` throw hoga app start pe.",
    detailedAnswer:
      "`builder.Build()` service collection ka snapshot le kar immutable `ServiceProvider` banata hai aur collection ko seal kar deta hai. Uske baad `builder.Services.Add...` karna modern .NET me startup pe exception deta hai (purane versions me silently ignore hota tha, jo ghante debugging deta tha). Fix: `AddSwaggerGen()` ko `var app = builder.Build();` se upar le jao. Rule: saari `builder.Services.Add...` calls `Build()` se pehle, saari `app.Use.../app.Map...` uske baad.",
    redFlag: "'Order se farak nahi, DI runtime pe resolve hota hai' — build ke baad collection sealed hai.",
  },
  {
    id: "pcl-5",
    question: "Minimal hosting model aur purana `Startup.cs` model — difference kya hai? Concept badla ya sirf syntax?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Sirf shape badli. `.NET 5` tak `Startup.cs` me `ConfigureServices` (DI) + `Configure` (middleware) alag methods the. `.NET 6+` me dono ek `Program.cs` me top-level statements ban gaye. Concept identical.",
    detailedAnswer:
      "`Startup.ConfigureServices(IServiceCollection services)` = ab `builder.Services.Add...`. `Startup.Configure(IApplicationBuilder app, IWebHostEnvironment env)` = ab `app.Use.../app.Map...`. `Program.cs` jo pehle sirf `Host.CreateDefaultBuilder(...).UseStartup<Startup>()` chalata tha, ab poora startup khud hold karta hai. Purane codebases me `Startup.cs` dikhe to samajh lena wo bas ek reorganization hai. Naya code minimal hosting me hi likho; mixed-style avoid karo.",
    followUp: "Bade project me `Program.cs` 200 lines ka ho jaaye to kaise organize karoge?",
  },
  {
    id: "pcl-6",
    question: "`app.Run()` ke neeche `Console.WriteLine(\"app stopped\")` likha hai. Ye kab print hoga?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Normal flow me kabhi nahi. `app.Run()` (bina delegate ke) thread ko block kar deta hai jab tak shutdown signal na aaye — control uske neeche return hi nahi karta normally.",
    detailedAnswer:
      "`app.Run()` internally `app.RunAsync().GetAwaiter().GetResult()` jaisa hai — ye tab tak wait karta hai jab tak host stop na ho (Ctrl+C, SIGTERM, ya `IHostApplicationLifetime.StopApplication()`). Uske baad process usually exit kar raha hota hai, to neeche wali line reliably nahi chalti. Agar tumhe shutdown pe kuch karna hai to `app.Lifetime.ApplicationStopping` register karo, ya `IHostedService.StopAsync` use karo — `app.Run()` ke neeche code likh ke nahi.",
    redFlag: "Startup seeding ya migration `app.Run()` ke neeche likhna, ye soch ke ki 'startup ke baad chalega'.",
  },
  {
    id: "pcl-7",
    question:
      "`if (app.Environment.IsDevelopment())` block me Swagger kyun wrap kiya hota hai? Isko hata dein to?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Taaki Swagger/OpenAPI sirf local dev me expose ho, Production me nahi — API surface aur schema public na ho jaaye. Hata do to Production me `/swagger` live ho jaayega.",
    detailedAnswer:
      "Swagger UI poore API ka structure — routes, DTO shapes, auth scheme — publicly document kar deta hai. Kuch teams jaan-boojh ke Production me rakhti hain (internal tools, partner APIs), lekin default template ise Development tak seemit rakhta hai for safety. `IsDevelopment()` ka result `ASPNETCORE_ENVIRONMENT` variable se aata hai. Ek classic bug: developer ki machine pe env galti se `Production` set ho jaaye, to `if` false ho jaata hai aur 'Swagger toota hai' ka aadha din debugging jaata hai — jabki asli issue environment variable hai.",
    followUp: "Production me Swagger chahiye ho lekin sirf authenticated internal users ke liye — kaise karoge?",
  },
  {
    id: "pcl-8",
    question:
      "`builder.Services` ka type kya hai, aur `AddControllers()` jaisi methods usme kaise aati hain jabki wo `IServiceCollection` interface me define nahi hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`builder.Services` ka type `IServiceCollection` hai. `AddControllers()`, `AddSwaggerGen()` extension methods hain — har package `IServiceCollection` pe apni `AddXxx()` extension method deta hai jo `IServiceCollection` wapas return karti hai (chaining ke liye).",
    detailedAnswer:
      "`IServiceCollection` bas ek `List<ServiceDescriptor>` jaisa abstraction hai. `AddControllers()` MVC package ki `static` extension method hai `public static IMvcBuilder AddControllers(this IServiceCollection services)`. Ye pattern har cross-cutting library follow karti hai — `AddDbContext`, `AddAutoMapper`, `AddAuthentication` — isliye `Program.cs` readable rehta hai aur har package apna registration khud encapsulate karta hai. Return type (`IServiceCollection` ya ek specialized builder jaise `IMvcBuilder`) further configuration chaining allow karta hai, jaise `AddControllers().AddJsonOptions(...)`.",
    followUp: "Apni khud ki `AddApplicationServices(this IServiceCollection services)` extension method likho jo `IEmployeeService` register kare.",
  },
];

export default questions;
