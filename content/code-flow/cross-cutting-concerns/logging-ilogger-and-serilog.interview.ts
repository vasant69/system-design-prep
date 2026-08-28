import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "log-1",
    question: "ASP.NET Core me logging kaise karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Built-in `ILogger<T>` har class me inject karta hoon aur message templates use karta hoon — `_logger.LogInformation(\"Employee {EmployeeId} created\", id)` — string interpolation kabhi nahi. Production me Serilog isi abstraction ke peeche plug karta hoon.",
    detailedAnswer:
      "`ILogger<T>` DI se milta hai; `T` category ban jaata hai (source tag). Call site par message template deta hoon: named holes (`{EmployeeId}`) queryable fields ban jaate hain, aur level filter fail hone par string allocate hi nahi hoti. Levels: `Trace`/`Debug` dev-only, `Information` normal flow, `Warning` recoverable, `Error` operation failed, `Critical` system down. Errors par exception pehle argument: `_logger.LogError(ex, \"...\", args)`. Filtering `appsettings.json` ke `Logging:LogLevel` se per-category, longest prefix jeetta hai. Default providers sirf Console/Debug/EventSource hain — koi file ya central sink nahi, isliye production me Serilog: `builder.Host.UseSerilog(...)`, `ReadFrom.Configuration`, sinks Console + rolling File + Seq, `app.UseSerilogRequestLogging()`.",
    followUp: "Message template aur string interpolation me farq kya hai — dono to same output dete hain?",
    redFlag:
      "`_logger.LogInformation($\"...\")` ko theek maan lena — isse structure aur PII-safety dono todte hain.",
  },
  {
    id: "log-2",
    question:
      "`_logger.LogInformation($\"Employee {id} created\")` vs `_logger.LogInformation(\"Employee {EmployeeId} created\", id)` — dono me kya farq hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Pehla ek interpolated string hai — logger ko dekhne se pehle hi ban jaati hai, koi named field nahi, aur level filter ke bawajood allocation hota hai. Doosra template hai — `EmployeeId` ek real field ban jaata hai jispe Seq me filter kar sakte ho.",
    detailedAnswer:
      "Interpolation ke saath: (1) `Information` level agar disabled hai to bhi string build hoti hai — wasted CPU/allocations; (2) structured sink ke paas sirf ek flat text milta hai, `EmployeeId = 42` pe search nahi kar sakte; (3) PII (PAN, salary) aksar isi tarah accidental log me ghus jaati hai. Template ke saath Serilog message aur uske parameters ko alag store karta hai — same template wali saari lines ek event ke roop me group hoti hain, aur filtering/alerting possible ho jaati hai.",
    followUp: "Agar ek hi line me 5 fields chahiye har call pe, har baar likhne se kaise bachoge?",
    redFlag:
      "'Performance ka farq negligible hai' — high-throughput API me disabled-level string building measurable overhead hai.",
  },
  {
    id: "log-3",
    question:
      "Log levels — `Trace`, `Debug`, `Information`, `Warning`, `Error`, `Critical` — har ek kab use karoge? Production default kya hona chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`Trace`/`Debug` sirf local/dev diagnostics. `Information` normal business events. `Warning` kuch unexpected par app chal rahi hai (retry, fallback). `Error` ek operation fail (unhandled exception, `500`). `Critical` app/subsystem down. Production default `Information`, framework categories `Warning`.",
    detailedAnswer:
      "Rule of thumb: `Information` normal flow ka narrative, `Warning` 'dekh lena kabhi', `Error` 'abhi dekho, ek cheez tooti', `Critical` 'sab ruk gaya, aadmi ko utha do'. `appsettings.json` me `Default: Information`, `Microsoft.AspNetCore: Warning` (per-request noise silence), `Microsoft.EntityFrameworkCore.Database.Command: Warning` (har SQL statement rokna). `Trace`/`Debug` production me on chhodne se log volume aur bill dono badhte hain aur real `Error` noise me dab jaati hai.",
    followUp: "`Microsoft.EntityFrameworkCore.Database.Command` ko `Warning` karne se kya band hota hai?",
  },
  {
    id: "log-4",
    question:
      "BFSI Employee API me logs me kya cheezein kabhi log nahi karni chahiye, aur uski jagah kya log karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Kabhi nahi: PAN, Aadhaar, full salary figures, passwords/hashes, JWT tokens, API keys, card numbers, OTPs, KYC endpoints ke full request bodies. Uski jagah: ids aur outcomes — `EmployeeId`, `DepartmentId`, `\"PAN verification failed\"` (bina PAN ke), zaroorat par masked values.",
    detailedAnswer:
      "Logs kai teams, third-party tools (Seq, Elasticsearch, Datadog) aur backups me chale jaate hain — wahan PII rakhna audit finding aur breach surface hai. Ek quick guard: agar field ka naam `Password`, `Pan`, `Aadhaar`, `Salary`, `Token`, `Secret`, `Otp` me se kuch hai to wo log line me nahi. `_logger.LogInformation(\"Creating employee {@Dto}\", dto)` jaisa full-object destructuring khatarnaak hai — poora DTO (PAN, salary samet) log ho jaata hai. CI me ek regex check bhi laga sakte ho jo in field-names ko log calls ke aas-paas flag kare.",
    followUp: "`{@Dto}` destructuring aur `{Dto}` me farq kya hai Serilog me?",
    redFlag:
      "'Debugging ke liye poora request body log kar deta hoon' — BFSI audit me instant finding.",
  },
  {
    id: "log-5",
    question:
      "Ek request 3 microservices se guzarti hai. Support ko ek user-reported error ki poori journey ek jagah chahiye. Kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek correlation id: middleware me `X-Correlation-ID` header padho ya `TraceIdentifier` use karo, `LogContext.PushProperty(\"CorrelationId\", id)` se har log line par attach karo, aur wahi id response header me wapas do. Seq me `CorrelationId = \"...\"` filter se sab lines ek jagah.",
    detailedAnswer:
      "```csharp\napp.Use(async (context, next) =>\n{\n    var correlationId = context.Request.Headers[\"X-Correlation-ID\"].FirstOrDefault()\n        ?? context.TraceIdentifier;\n    using (Serilog.Context.LogContext.PushProperty(\"CorrelationId\", correlationId))\n    {\n        context.Response.Headers[\"X-Correlation-ID\"] = correlationId;\n        await next();\n    }\n});\n```\n\n`Enrich.FromLogContext()` ki wajah se har log line `CorrelationId` field carry karti hai. Downstream services same header forward karti hain. Support ticket me user response se mili id paste karta hai, engineer Seq me filter lagata hai. `IExceptionHandler` ka `traceId` bhi isi tarah correlate hota hai — par woh tabhi kaam ka hai jab us request ka koi log line likhi gayi ho.",
    followUp: "`traceId` (ProblemDetails wala) aur ye `CorrelationId` — dono me kya relation hai?",
  },
  {
    id: "log-6",
    question:
      "Serilog kyun chahiye jab built-in `ILogger<T>` already hai? Aur usse controller code kitna badalta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Built-in ke paas sirf Console/Debug/EventSource hain — koi rolling file, koi searchable dashboard, koi JSON output. Serilog ye sab deta hai aur usi `ILogger<T>` ke peeche plug hota hai, to controller/service code ek line nahi badalta.",
    detailedAnswer:
      "`builder.Host.UseSerilog((ctx, services, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration).Enrich.FromLogContext()...)` default providers ko replace kar deta hai. Sinks aur levels `appsettings.json` ke `Serilog` section me — ops production me sink add kar sakte hain bina rebuild. `app.UseSerilogRequestLogging()` framework ke multi-line per-request logs ko ek structured summary line (method, path, status, elapsed ms) se replace karta hai. Enrichers: `WithMachineName`, `WithThreadId`, `FromLogContext`. File sink `rollingInterval: \"Day\"` + `retainedFileCountLimit: 14` = do hafte ki files.",
    followUp: "`app.UseSerilogRequestLogging()` ko pipeline me kahan rakhna chahiye aur kyun?",
  },
  {
    id: "log-7",
    question:
      "`_logger.LogError(\"Employee update failed\")` — is line me kya missing hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Exception object. Sahi: `_logger.LogError(ex, \"Employee {EmployeeId} update failed\", id)` — pehla argument exception hota hai to sink stack trace bhi capture karta hai.",
    detailedAnswer:
      "`ILogger` ke `Log*` overloads ka ek form `(Exception? exception, string message, params object[] args)` hai. Exception pass na karo to log me sirf ek message text jaata hai — kaunsi line par, kaunsa inner exception, kuch nahi. Debugging ke waqt yehi sabse zaroori info hoti hai. `catch (Exception ex)` block me hamesha `_logger.LogError(ex, \"...\", args)`. Aur agar tum re-throw kar rahe ho to yahi exception global handler bhi log karega — ek hi jagah log karo, dono jagah nahi.",
    followUp: "Ek hi exception ko service me aur global handler dono me log karna theek hai?",
    redFlag:
      "Sirf `ex.Message` ko string me daal kar `LogError(\"failed: \" + ex.Message)` — stack trace aur inner exceptions gayab.",
  },
];

export default questions;
