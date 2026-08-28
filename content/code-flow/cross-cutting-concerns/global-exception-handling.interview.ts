import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "geh-1",
    question: "Web API me exceptions globally kaise handle karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      ".NET 8 me `IExceptionHandler` implement karta hoon, `AddProblemDetails()` + `AddExceptionHandler<T>()` + `app.UseExceptionHandler()` se wire karta hoon, aur domain exceptions ko status codes + RFC 7807 `ProblemDetails` par map karta hoon.",
    detailedAnswer:
      "Ek chhoti domain-exception hierarchy banata hoon (`NotFoundException`, `ConflictException`, `DomainValidationException`) jo service se throw hoti hai. Controllers sirf happy path likhte hain — koi `try/catch` nahi. `AppExceptionHandler : IExceptionHandler` ke `TryHandleAsync` me exception type par `switch` karke `(status, title)` nikalta hoon, `IProblemDetailsService.TryWriteAsync` se `application/problem+json` response likhta hoon. `500` par `Detail = null` rakhta hoon aur `traceId` extension add karta hoon.\n\n```csharp\nbuilder.Services.AddProblemDetails();\nbuilder.Services.AddExceptionHandler<AppExceptionHandler>();\n\nvar app = builder.Build();\napp.UseExceptionHandler();\n```",
    followUp: "`500` par client ko exactly kya bhejoge?",
    redFlag:
      "Har controller me `try/catch` likh kar `catch (Exception ex) { return StatusCode(500, ex.Message); }` — duplication plus leak.",
  },
  {
    id: "geh-2",
    question: "`500` response me client ko kya bhejna chahiye aur kya nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Generic title + `traceId` bhejo. `exception.Message`, stack trace, SQL text, ya kisi internal detail ko kabhi mat bhejo.",
    detailedAnswer:
      "`500` matlab unexpected error — client kuch kar nahi sakta iske baare me, aur internal detail bhejna information-disclosure vulnerability hai (SQL constraint names, file paths, connection strings leak). `ProblemDetails` me `Status`, generic `Title` (`An unexpected error occurred`), `Instance = path`, aur `Extensions[\"traceId\"] = httpContext.TraceIdentifier`. Server side par full exception `LogError` se log hoti hai; support engineer `traceId` se wahi log line dhoond leta hai. Expected exceptions (`404`/`409`) par `exception.Message` dena theek hai kyunki wo safe business text hota hai.",
    followUp: "`traceId` distributed tracing ke saath kaise correlate hota hai?",
    redFlag:
      "'Detail me exception.Message daal do taaki frontend dev ko debugging easy ho' — production me ye security finding ban jaata hai.",
  },
  {
    id: "geh-3",
    question:
      "`IExceptionHandler` .NET 8 se pehle log exceptions kaise globally handle karte the? Ab bhi wo approaches valid hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Hand-written exception-handling middleware (`try { await _next(ctx); } catch { ... }`), ya `app.UseExceptionHandler(\"/error\")` + error controller, ya `UseExceptionHandler(lambda)`. Sab abhi bhi valid — `IExceptionHandler` inka framework-blessed, testable version hai.",
    detailedAnswer:
      "Sabse common tha ek custom middleware jo poore downstream ko `try/catch` karta tha aur exception ko JSON me map karta tha. `UseExceptionHandler(\"/error\")` re-executes the pipeline towards an error endpoint jahan ek `[ApiController]` `[Route(\"/error\")]` action `IExceptionHandlerFeature` se exception nikalta hai. `IExceptionFilter` (MVC filter) bhi hai par wo sirf action-level exceptions pakadta hai — routing ya middleware errors nahi — isliye global handling ke liye prefer nahi kiya jaata. `IExceptionHandler` ke faayde: DI, multiple handlers chained, ek plain class jise unit-test kar sakte ho.",
    followUp: "Ek custom middleware aur `IExceptionHandler` me practical farq kya hai?",
  },
  {
    id: "geh-4",
    question:
      "Multiple `IExceptionHandler` register kiye hain. Framework unhe kaise call karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Registration order me, ek-ek karke. Pehla handler jo `TryHandleAsync` se `true` return karta hai, wahi jeetta hai — baaki call nahi hote. Sab `false` de to default `500 ProblemDetails`.",
    detailedAnswer:
      "`AddExceptionHandler<A>()` phir `AddExceptionHandler<B>()` matlab `A` pehle try hoga. Isliye specific handlers pehle, general baad me. Practical example: ek `SqlExceptionHandler` jo `DbUpdateException` ke andar unique-constraint violation ko `409` me map karta hai, aur ek general `AppExceptionHandler` jo domain exceptions handle karta hai plus fallback `500`. Agar general handler jo har exception par `true` deta hai use pehle register kar diya, to specific handler kabhi nahi chalega.",
    followUp: "Agar tumhara general handler har exception par `true` deta hai to kya problem hai?",
    redFlag:
      "Ye maan lena ki sab handlers hamesha chalte hain (jaise middleware chain) — nahi, pehla `true` short-circuit karta hai.",
  },
  {
    id: "geh-5",
    question:
      "Har `if (employee is null)` ko `throw new NotFoundException(...)` me convert kar dena — sahi hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Agar 'kuch nahi mila' ek valid, expected outcome hai to seedha `return NotFound()` sasta hai. Exceptions ka runtime cost hota hai — hot path me hazaaron/sec throw karna mehnga.",
    detailedAnswer:
      "Rule of thumb: exception tab jab caller ka aage badhna galat hi hai (deep service call se bubble up karna hai, ya invariant tuta hai). Simple `return NotFound()` tab jab controller ko turant pata hai ki resource nahi hai aur ye ek normal branch hai (jaise search filter se koi match nahi). Exception throw + stack capture + handler dispatch ka overhead ek plain `ActionResult` return se kaafi zyada hai. Consistency ke liye dono cases `ProblemDetails` shape de sakte hain — `[ApiController]` `NotFound()` ko bhi `ProblemDetails` banata hai.",
    followUp: "`[ApiController]` khud `return NotFound()` ko kis shape me badalta hai?",
  },
  {
    id: "geh-6",
    question:
      "`app.UseExceptionHandler()` ko pipeline me kahan rakhna chahiye, aur `UseDeveloperExceptionPage()` ka kya?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`UseExceptionHandler()` sabse upar (pehli cheezon me se), taaki wo har downstream middleware/controller ko wrap kar sake. `UseDeveloperExceptionPage()` sirf `if (app.Environment.IsDevelopment())` ke andar.",
    detailedAnswer:
      "Exception handler ko wo sab catch karna hai jo uske baad register hua hai, isliye wo `UseRouting`, `UseAuthentication`, `MapControllers` se pehle aata hai (request-logging middleware ke thoda baad rakh sakte ho taaki failed requests bhi log ho). `UseDeveloperExceptionPage()` full stack trace ka HTML deta hai — production me ye wahi leak hai jise hum rok rahe hain, isliye strictly dev-only.\n\n```csharp\napp.UseExceptionHandler();\nif (app.Environment.IsDevelopment())\n    app.UseDeveloperExceptionPage();\napp.UseHttpsRedirection();\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapControllers();\n```",
    followUp: "Agar `UseExceptionHandler()` ko `MapControllers()` ke baad rakh do to kya hoga?",
    redFlag:
      "`UseDeveloperExceptionPage()` ko unconditionally add karna — har prod `500` par client ko stack trace HTML mil jaata hai.",
  },
  {
    id: "geh-7",
    question:
      "Validation errors ko global handler se kaise return karoge taaki frontend har field ke neeche message dikha sake?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek `DomainValidationException` jo `IReadOnlyDictionary<string, string[]>` carry karti hai; handler use `400` par map karke `ProblemDetails.Extensions[\"errors\"]` me wo dictionary daal deta hai — bilkul `ValidationProblemDetails` jaisa shape.",
    detailedAnswer:
      "`[ApiController]` model-binding/DataAnnotation errors ko khud `ValidationProblemDetails` (`400`, `errors` object) banata hai. Business-rule violations jo service me detect hote hain (jaise salary negative, ya PAN already exists) unke liye `DomainValidationException` throw karo aur handler me:\n\n```csharp\nif (exception is DomainValidationException dve)\n    problemDetails.Extensions[\"errors\"] = dve.Errors;\n```\n\nIsse client-side ek hi `errors` parsing logic dono sources (framework validation + domain validation) ke liye kaam karta hai.",
    followUp: "DTO-level `[Required]` validation aur service-level domain validation me line kahan kheechte ho?",
  },
  {
    id: "geh-8",
    question:
      "Global handler laga hone ke baad bhi ek dev ne controller me `try/catch` chhod diya jo `catch (Exception ex) { return StatusCode(500, ex.Message); }` karta hai. Kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Wo local catch exception ko nigal leta hai, isliye global handler ko wo dikhta hi nahi — error shape phir inconsistent ho jaata hai aur `ex.Message` leak ho jaata hai.",
    detailedAnswer:
      "Double handling anti-pattern hai. Global handler tabhi kaam karta hai jab exception controller se bubble out ho. Local `try/catch` jo response likh deta hai wo pipeline ko 'success' dikhta hai, `UseExceptionHandler` trigger hi nahi hota, `traceId`/`ProblemDetails` consistency chali jaati hai, aur `ex.Message` raw form me client tak. Sahi: controllers me koi generic `catch` nahi; sirf tab catch karo jab tum genuinely recover kar rahe ho (jaise retry ya fallback value), aur us case me bhi ya to handle karo ya re-throw.",
    followUp: "Kis situation me controller/service me `try/catch` rakhna genuinely sahi hai?",
    redFlag:
      "'Extra safety ke liye har action ko try/catch me wrap kar deta hoon' — ye global handler ko bypass kar deta hai.",
  },
];

export default questions;
