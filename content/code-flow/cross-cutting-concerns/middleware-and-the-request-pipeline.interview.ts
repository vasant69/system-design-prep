import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mw-1",
    question: "What is middleware in ASP.NET Core, and how does the request pipeline work?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Middleware ek chain of `RequestDelegate`s hai. Har component request pe kuch kaam karta hai, phir `await next()` se aage bhejta hai ya short-circuit kar deta hai. Order = Program.cs me registration order.",
    detailedAnswer:
      "Har middleware ek `RequestDelegate` hai — `Task Invoke(HttpContext)`. Pipeline `var app = builder.Build()` ke baad `app.Use.../app.Map...` calls se banti hai, aur execution order bilkul wahi hota hai jis order me tum register karte ho. Request stack me neeche jaati hai (har middleware `await next()` call karta hai), terminal middleware (`MapControllers` ka endpoint) actual action chalata hai, phir response wapas upar aati hai aur har middleware ka `next()` ke baad wala code chalta hai. `next()` se pehle = request phase, baad = response phase.",
    followUp: "`app.Use` aur `app.Run` me kya farq hai?",
    redFlag:
      "Ye kehna ki middleware ka order matter nahi karta, ya ki middleware sirf 'filters jaisa kuch' hai — dono galat.",
  },
  {
    id: "mw-2",
    question: "`app.Use`, `app.Run`, aur `app.Map` — teeno me kya farq hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`Use` = middleware jo `next` call karke pipeline continue karta hai. `Run` = terminal middleware, `next` nahi leta. `Map` / `MapWhen` = path ya predicate pe pipeline branch karta hai.",
    detailedAnswer:
      "`app.Use(async (ctx, next) => { ...; await next(ctx); ... })` — non-terminal, chain continue hoti hai. `app.Run(async ctx => { ... })` — terminal, iske baad kuch nahi chalta (`MapControllers` andar se aisa hi hai). `app.Map(\"/health\", branch => branch.Run(...))` — jab request path `/health` se shuru ho to ek alag branch pipeline chalti hai. `app.MapWhen(predicate, branch => ...)` — kisi bhi condition pe branch. `app.UseWhen(predicate, branch => ...)` — branch chalta hai phir main pipeline me wapas aata hai.",
    followUp: "`UseWhen` aur `MapWhen` me practical farq kya hai?",
  },
  {
    id: "mw-3",
    question:
      "`UseRouting`, `UseAuthentication`, `UseAuthorization`, `MapControllers` — inka order kyun matter karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`UseAuthorization` ko routing metadata chahiye ye jaanne ke liye ki matched endpoint pe `[Authorize]` hai ya nahi — isliye wo `UseRouting` ke baad aur `MapControllers` ke pehle hona chahiye. `UseAuthentication` `UseAuthorization` se pehle, kyunki pehle identity banti hai phir permission check hoti hai.",
    detailedAnswer:
      "`UseRouting` request URL ko endpoint se match karta hai aur endpoint metadata (`[Authorize]`, `[AllowAnonymous]`, policies) `HttpContext` me daalta hai. `UseAuthentication` `Authorization` header parse karke `HttpContext.User` banata hai. `UseAuthorization` us user aur endpoint metadata ko dekh kar 401/403 pe short-circuit karta hai ya aage jaane deta hai. Agar `UseAuthorization` `UseRouting` ke pehle ho to endpoint metadata available nahi hoga aur `[Authorize]` silently ignore ho sakta hai — protected endpoint public ban jaata hai. `MapControllers` sabse aakhir me actual action chalata hai.",
    followUp: "Agar tum `UseRouting` bilkul na likho to kya hota hai .NET 6+ me?",
    redFlag:
      "Ye kehna ki 'order koi bhi ho, framework sambhal leta hai' — ye ek real security bug ka source hai.",
  },
  {
    id: "mw-4",
    question:
      "Ye code kya karega?\n```csharp\napp.Use(async (context, next) =>\n{\n    context.Response.Headers[\"X-App\"] = \"EmployeeApi\";\n});\napp.MapControllers();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Har request pe response header set hoga, lekin `await next()` missing hone se pipeline yahin short-circuit ho jaayegi — `MapControllers` kabhi nahi chalega, koi Controller action hit nahi hoga.",
    detailedAnswer:
      "Lambda `X-App` header set kar deta hai lekin `await next(context)` call nahi karta, isliye request aage nahi jaati. Client ko `200 OK` jaisa empty response milega with the `X-App` header, aur actual `EmployeesController` kabhi execute nahi hoga. Ye classic 'API suddenly returns empty body' bug hai. Fix: lambda ke andar `await next(context);` add karo.",
    redFlag:
      "Ye maan lena ki har `app.Use` lambda automatically `next` call karta hai — nahi, tumhe explicitly likhna padta hai.",
  },
  {
    id: "mw-5",
    question:
      "Ek middleware ko unit-test karna hai aur usme har request pe fresh `AppDbContext` chahiye. Konsa authoring style choose karoge aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`IMiddleware` factory-based middleware — DI me `AddScoped<MyMiddleware>()` se register hota hai, isliye scoped `AppDbContext` constructor me safe hai aur class normally instantiate karke test ho sakti hai.",
    detailedAnswer:
      "Convention-based middleware ek hi baar construct hota hai, isliye scoped service constructor me capture karna captive-dependency bug hai. `IMiddleware` implement karne wala middleware har request pe DI se resolve hota hai — `AddScoped` registration + `app.UseMiddleware<MyMiddleware>()`. Constructor me `AppDbContext` inject karna ab safe hai. Testing ke liye tum `new MyMiddleware(fakeDbContext)` bana ke `InvokeAsync(httpContext, next)` ko directly call kar sakte ho, `next` ke jagah ek stub `RequestDelegate` pass karke.",
    followUp: "Convention-based middleware me scoped service kaise inject karte, agar tumhe wahi rakhna hota?",
  },
  {
    id: "mw-6",
    question:
      "Trap: 'Middleware aur Action Filter ek hi cheez hain, dono request ke beech me chalte hain' — sahi ya galat?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Galat. Middleware HTTP-level hai aur har request pe chalta hai, routing/MVC se pehle bhi. Action Filter MVC pipeline ke andar hai — sirf matched Controller actions pe chalta hai aur usko `ModelState`, action arguments, action result jaisi MVC cheezein dikhti hain.",
    detailedAnswer:
      "Middleware `HttpContext` ke saath kaam karta hai, kisi bhi request pe (static files, health checks, non-MVC endpoints bhi). Action filters (`IActionFilter`, `IAsyncActionFilter`) tab chalte hain jab routing decide kar chuka ho ki konsa action hai — unke paas `ActionExecutingContext` hota hai jisme bound parameters aur `ModelState` available hai. Cross-cutting HTTP concerns (logging, correlation ID, exception handling, security headers) middleware me; MVC-specific concerns (model validation shortcut, action-result shaping, per-action authorization logic) filter me.",
    followUp: "Global exception handling ke liye tum middleware use karoge ya exception filter — aur kyun?",
    redFlag:
      "Middleware aur filter ke beech koi distinction na kar paana — ye batata hai request lifecycle ka mental model incomplete hai.",
  },
  {
    id: "mw-7",
    question:
      "Custom middleware ke liye `IApplicationBuilder` extension method (`app.UseRequestLogging()`) kyun banate hain, seedha `app.UseMiddleware<RequestLoggingMiddleware>()` kyun nahi likhte?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Readability aur encapsulation — `Program.cs` clean rehta hai, aur agar middleware ko options ya multiple sub-middleware chahiye ho to wo sab extension method ke andar chhup jaata hai, ek hi line se sab consumers ko milta hai.",
    detailedAnswer:
      "Functionally dono same hain. Lekin extension method (`public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder app) => app.UseMiddleware<RequestLoggingMiddleware>();`) ek naming convention establish karta hai jo built-in middleware (`UseRouting`, `UseAuthorization`) se match karta hai, aur agar kal ko tumhe do middleware ek saath register karne pade ya `RequestLoggingOptions` pass karna pade, to `Program.cs` badalne ki zaroorat nahi — sirf extension method. Ye 'platform defaults bundle' pattern ka base hai.",
  },
  {
    id: "mw-8",
    question:
      "Production me ek developer ne logging middleware me `await next()` ke baad `context.Response.Headers.Append(...)` likha, aur intermittent `InvalidOperationException: Headers are read-only` aa raha hai. Kya ho raha hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Jab response ka body likhna shuru ho jaata hai, headers 'sent' ho jaate hain aur read-only ban jaate hain. `await next()` ke baad downstream middleware/Controller already response bhej chuka hota hai, isliye header add karna crash karta hai.",
    detailedAnswer:
      "HTTP response me headers body se pehle jaate hain. Jaise hi framework body ka pehla byte flush karta hai, status aur headers commit ho jaate hain. Agar tumhe response header `next()` ke baad set karna hai, to `context.Response.OnStarting(() => { context.Response.Headers[...] = ...; return Task.CompletedTask; })` callback use karo (ye headers flush hone se theek pehle chalta hai), ya response ko buffer karo. Ideally response headers `await next()` ke PEHLE set kar do.",
    followUp: "`OnStarting` callback register karne ka sahi jagah kahan hai — `next()` ke pehle ya baad?",
  },
];

export default questions;
