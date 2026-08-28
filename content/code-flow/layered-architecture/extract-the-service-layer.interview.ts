import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "extract-svc-1",
    question:
      "Ek fat controller diya hai jisme validation, DB calls aur mapping sab hai. Step by step kaise refactor karoge ek service layer me?",
    type: "scenario",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Interface define karo, ek service class banao jo use implement kare, controller ke andar ka rules + orchestration + mapping usme move karo, controller me `IEmployeeService` inject karo, `Program.cs` me register karo — ek waqt me ek cheez.",
    detailedAnswer:
      "1) `IEmployeeService` — 5 method signatures (`GetAll`, `GetById`, `Create`, `Update`, `Delete`), koi body nahi. 2) `EmployeeService : IEmployeeService` — abhi `static List` field ke saath. 3) Har controller action ke andar ka business logic (duplicate email, PAN regex, 'active delete nahi'), LINQ, aur `ToDto` mapping ko corresponding service method me copy karo. 4) Controller action ko 2-4 line pe le aao: service call + HTTP translation. 5) Constructor injection: `EmployeesController(IEmployeeService service)`. 6) `builder.Services.AddScoped<IEmployeeService, EmployeeService>()`. Repository next step hai — Service abhi list se seedha baat karti hai taaki ek move me ek hi cheez badle aur build break isolate rahe.",
    followUp:
      "Refactor ke dauraan tumhe kaise pata chalega ki behaviour change nahi hua?",
    redFlag:
      "Service aur Repository dono ek saath nikalna aur phir build tootne par pata na lagna kaunse move ne toda.",
  },
  {
    id: "extract-svc-2",
    question:
      "Constructor injection kya hai? Line by line samjhao: `public EmployeesController(IEmployeeService service) => _service = service;`",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Class apni dependency `new` nahi karti, constructor parameter ke roop me maangti hai; DI container use resolve karke pass karta hai.",
    detailedAnswer:
      "`private readonly IEmployeeService _service;` — field ka type interface hai, `readonly` matlab constructor ke baad reassign nahi. Constructor `IEmployeeService` parameter leta hai — controller ye instance khud nahi banata. Jab request pe DI container `EmployeesController` activate karta hai, wo constructor parameters inspect karta hai, `IEmployeeService` ki registration (`AddScoped<IEmployeeService, EmployeeService>()`) dhoondta hai, `EmployeeService` banata hai, aur pass karta hai. `=> _service = service;` ek expression-bodied constructor hai — `{ _service = service; }` ka short form. Faayda: controller ko real service ka pata nahi (test me fake inject ho sakta hai), aur dependency explicit hai (constructor dekh ke pata chal jaata hai class ko kya chahiye).",
    followUp:
      "Property injection aur method injection bhi hote hain — constructor injection default kyun hai?",
  },
  {
    id: "extract-svc-3",
    question:
      "Ye service method review me aaya:\n```csharp\npublic ActionResult<EmployeeDto> GetById(int id)\n{\n    var e = _employees.FirstOrDefault(x => x.Id == id);\n    return e is null ? new NotFoundResult() : new OkObjectResult(ToDto(e));\n}\n```\nKya galat hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Service `ActionResult` / `NotFoundResult` / `OkObjectResult` return kar rahi hai — yaani usko HTTP ka pata hai. Boundary violation.",
    detailedAnswer:
      "Compile to hoga (agar `Microsoft.AspNetCore.Mvc` reference hai), lekin design galat. Sahi shape: `public EmployeeDto? GetById(int id) => _employees.FirstOrDefault(x => x.Id == id) is { } e ? ToDto(e) : null;` — service plain `EmployeeDto?` lautaye. Controller decide kare: `return dto is null ? NotFound() : Ok(dto);`. Isse service ko ek console job, gRPC service, ya dusra controller bhi call kar sakta hai bina HTTP types drag kiye, aur unit test me `Assert.Null(service.GetById(99))` likhna trivial hai vs `IActionResult` ko unwrap karna.",
    redFlag:
      "'Chal to raha hai, kya farak padta hai' — leaky abstraction ka long-term cost na dekhna.",
  },
  {
    id: "extract-svc-4",
    question:
      "Sab compile hua, app start hua, request bheji — 'Unable to resolve service for type IEmployeeService while attempting to activate EmployeesController'. Kya hua aur fix kya hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`Program.cs` me `AddScoped<IEmployeeService, EmployeeService>()` registration missing hai. Controller ko interface chahiye, container ke paas uski koi mapping nahi.",
    detailedAnswer:
      "DI container constructor parameters inspect karta hai; `IEmployeeService` ke liye registration dhoondta hai; nahi milti to `InvalidOperationException` throw karta hai jab controller activate hota hai (compile-time nahi, request-time). Fix: `builder.Services.AddScoped<IEmployeeService, EmployeeService>();` `app.Build()` se pehle. Related trap: constructor me `EmployeeService` (concrete) maang lena jabki register `IEmployeeService` kiya — same error, ulta case. Rule: constructor me wahi type maango jo register kiya.",
    followUp:
      "Agar tum chahte ho ki ye galti compile time pe pakdi jaaye, kya options hain? (e.g. DI validation on build, integration test)",
  },
  {
    id: "extract-svc-5",
    question:
      "Business rule violation (duplicate email) ko service se controller tak kaise communicate karoge? Exception, result object, ya kuch aur?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Do common approaches: custom exception (`DomainRuleException`) jise ek global handler `409`/`400` me map kare, ya ek Result/Either type jo success ya error carry kare. Dono me controller HTTP decide karta hai.",
    detailedAnswer:
      "Exception approach: service `throw new DomainRuleException(\"...\")` karti hai; ek exception-handling middleware ya `IExceptionFilter` ise catch karke `409` return karta hai. Simple, lekin control flow exceptions par depend karta hai. Result approach: service `Result<EmployeeDto>` lautaye jisme `IsSuccess`, `Error` ho; controller `result.IsSuccess ? Ok(...) : Conflict(result.Error)`. Zyada explicit, no exceptions for expected failures, lekin thoda boilerplate. Kaunsa bhi ho — key ye hai ki service `Conflict()` khud return na kare. Chhote projects me exception + global handler pragmatic hai.",
    followUp:
      "Result pattern me nested calls (service A calls service B) ka error propagation kaisa dikhega?",
    redFlag:
      "Service ke andar hi `return Conflict(...)` — HTTP status code service me decide karna.",
  },
  {
    id: "extract-svc-6",
    question:
      "Kya `EmployeeService` ke saare methods `async Task<...>` hone chahiye, chahe abhi storage ek in-memory `List` hi ho?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Abhi koi real I/O nahi hai, to sync methods theek hain. `Task.FromResult` se fake async banana sirf noise hai. Async module 4 me EF Core ke `SaveChangesAsync` ke saath aayega.",
    detailedAnswer:
      "`async` ka faayda tab hai jab thread ko I/O (DB, network, disk) ke intezaar me free kiya ja sake. In-memory `List` operations synchronous aur instant hain — unhe `async` banane se koi thread free nahi hota, ulta state-machine overhead aur `Task` allocation add hota hai. `public Task<EmployeeDto> Create(...) => Task.FromResult(...)` sirf signature ganda karta hai. Jab module 4 me repository EF Core use karega, tab interface `Task<...>` return karega aur service `await _repo.AddAsync(...)` karega — us waqt genuinely async hoga. Premature async utna hi bura hai jitna missing async.",
    followUp:
      "Jab module 4 me interface async ho jaayega, controller me kya-kya badlega?",
  },
  {
    id: "extract-svc-7",
    question:
      "Service layer nikaalne ke baad bhi teen business rules (duplicate email, PAN, active-delete) service me hain. In rules ko test karne ka setup fat-controller vs layered me compare karo.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Layered: `new EmployeeService()` banao, method call karo, exception assert karo — 3 line. Fat controller: `WebApplicationFactory` ya `HttpContext` mock, routing, model binding — poora HTTP stack.",
    detailedAnswer:
      "Layered design me `EmployeeService` ek plain class hai jise koi bhi `new` kar sakta hai (ya DI se le sakta hai). Duplicate-email test: `var s = new EmployeeService(); s.Create(validDto); Assert.Throws<DomainRuleException>(() => s.Create(sameEmailDto));`. Koi server, koi TestServer, koi JSON. Fat-controller me wahi rule ek action ke andar hai jise `HttpContext` chahiye — ya to `Mock<HttpContext>` set karo, ya `WebApplicationFactory<Program>` se pura app boot karo aur real HTTP request bhejo. Dono slow aur flaky. Isliye rule of thumb: rules aise jagah rakho jahan unhe test karne ke liye framework boot na karna pade.",
    followUp:
      "Jab repository aa jaayega, service test me use kaise handle karoge — real InMemory repo ya mock?",
  },
];

export default questions;
