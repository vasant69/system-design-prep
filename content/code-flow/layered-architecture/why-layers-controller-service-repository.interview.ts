import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "why-layers-tr-1",
    question: "Layered architecture kya hai? Ek ASP.NET Core Web API me kaunsi layers hoti hain aur har ek ka kaam kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Code ko responsibility ke hisaab se stack me baantna: Controller = HTTP, Service = business rules + orchestration, Repository = data access. Request neeche jaati hai, result upar.",
    detailedAnswer:
      "Layering ek logical separation hai (alag DLL zaroori nahi). Controller sirf HTTP handle karta hai — route match, model binding, status code (`200`/`201`/`404`/`409`). Service application ke rules rakhta hai — 'duplicate email nahi', 'PAN format valid ho', 'active employee delete nahi' — aur multiple repository/service calls ko orchestrate karta hai. Repository sirf data laata/rakhta hai — Add, GetById, GetAll, Update, Remove — koi rule nahi. Har layer sirf apne se neeche wali ko call karti hai, isse har layer independently test, replace aur reuse ho sakti hai.",
    followUp: "In sab ko ek hi controller me likh dein to kya-kya kharab hoga?",
  },
  {
    id: "why-layers-tr-2",
    question: "Fat controller (sab logic controller me) ke saath 3 concrete problems batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Untestable (poora HTTP stack chahiye test ke liye), un-reusable (background job logic call nahi kar sakti), aur logic duplication (same rule Create aur Update dono me).",
    detailedAnswer:
      "1) Testability: rule test karne ke liye routing + model binding + `HttpContext` spin karna padta hai; Service alag ho to `new EmployeeService(fakeRepo)` aur method call kaafi. 2) Reuse: ek nightly CSV-import job ke paas `HttpContext` nahi hota, isliye wo controller ke andar bandh rules call hi nahi kar sakti — rules copy ho jaate hain aur do versions ban jaate hain. 3) Duplication: PAN regex `Create` aur `Update` dono actions me copy hota hai; ek galat nikla to teeno jagah fix yaad rakhna padta hai.",
    redFlag: "Sirf 'clean/readable code ke liye' bolna — asli technical cost (testing, reuse, duplication) miss karna.",
  },
  {
    id: "why-layers-tr-3",
    question: "Agar hum seedha `Controller -> Service -> Database` se kaam chala sakte hain, to Repository layer kyun add karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Taaki data-access detail ek interface ke peeche chhup jaaye — aaj in-memory list, kal EF Core + SQL — bina Service ko chhue swap ho jaaye.",
    detailedAnswer:
      "`Controller -> Service -> Database` chhote apps ke liye theek hai. Repository do cheezein deta hai: (1) storage swappability — hamara `IEmployeeRepository` aaj `InMemoryEmployeeRepository` hai, module 4 me `EfEmployeeRepository` ban jaayega, Service ko farak nahi padega. (2) LINQ/query code Service se bahar rehta hai, isse Service test karte waqt sirf `IEmployeeRepository` mock karna padta hai, poora DbContext nahi. Trade-off: ek aur interface + class har entity ke liye.",
    followUp: "Kya EF Core ke upar Repository pattern ek anti-pattern hai? Dono side batao.",
  },
  {
    id: "why-layers-tr-4",
    question:
      "Ye code review me aaya. Kya theek hai?\n```csharp\npublic class EmployeeService\n{\n    public IActionResult GetById(int id)\n    {\n        var e = _repo.GetById(id);\n        if (e is null) return new NotFoundResult();\n        return new OkObjectResult(_mapper.ToDto(e));\n    }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile to hoga, lekin design galat hai — Service `IActionResult` / `NotFoundResult` / `OkObjectResult` return kar raha hai, yaani usko HTTP ka pata hai.",
    detailedAnswer:
      "Ye ek boundary violation hai. Service ko `Microsoft.AspNetCore.Mvc` pe depend nahi karna chahiye. Sahi shape: Service `EmployeeDto?` (nullable) return kare, aur Controller decide kare — `return dto is null ? NotFound() : Ok(dto);`. Isse Service ek console job ya gRPC service se bhi call ho sakta hai bina HTTP types drag kiye. `IActionResult` ko unit-test me assert karna bhi zyada painful hota hai plain object ke muqable.",
    redFlag: "'Chalega to hai, kya dikkat hai' — leaky abstraction ka long-term cost na dekhna.",
  },
  {
    id: "why-layers-tr-5",
    question:
      "Ek naya requirement: nightly job CSV se 5000 employees import karega, wahi validation ke saath. 3-layer design me tumhe kya karna padega vs fat-controller design me?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "3-layer me: job `IEmployeeService.Create()` ko loop me call kar de — rules automatically apply. Fat-controller me: saare rules job ke andar dobara likhne padte hain.",
    detailedAnswer:
      "Layered design me `EmployeeService` ek plain class hai jise koi bhi `new` ya DI se le sakta hai. Import job ek `IHostedService`/console job banata hai, `IEmployeeService` inject karta hai, har CSV row ke liye `_service.Create(dto)` call karta hai. Duplicate-email, PAN check — sab ek hi jagah se. Fat-controller design me ye logic `HttpContext`-bound action ke andar hai, job use call nahi kar sakti, isliye developer PAN regex + duplicate check copy karta hai — aur 3 mahine baad API side regex update hota hai, job side nahi.",
    followUp: "Import job aur API dono ek saath same employee add karein to concurrency kaise handle karoge? (module 4/transactions me)",
  },
  {
    id: "why-layers-tr-6",
    question: "Kya har project me Controller-Service-Repository layering honi chahiye? Kab NA karein?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Chhote/throwaway apps, prototypes, ya bina business rules wale 3-endpoint tools me full layering over-engineering hai — 2 layers ya seedha `Controller -> DbContext` kaafi hai.",
    detailedAnswer:
      "Layering ka cost hai: ek endpoint ke liye interface + service + repository — 3+ files. Jab app ka lifespan chhota hai, ek hi developer hai, ya logic pure CRUD hai (koi rule nahi), tab ye files sirf navigation overhead hain. Aisa tool ke liye `Controller -> DbContext` bilkul acceptable hai. Layering tab justify hoti hai jab: rules hain, multiple callers hain, storage badal sakta hai, ya team badi hai. 'Best practice' ko context ke bina lagana hi asli anti-pattern hai.",
    redFlag: "'Hamesha teeno layers, warna best practice violate' — blanket rule, trade-off ka awareness nahi.",
  },
  {
    id: "why-layers-tr-7",
    question:
      "Anemic Service layer kya hai aur wo ek problem kyun ho sakti hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Jab Service ke saare methods sirf `return _repo.GetAll()` type pass-through hote hain — koi rule add nahi karti. Tab wo layer ek dead middleman hai.",
    detailedAnswer:
      "Anemic (ya 'pass-through') Service layer wo hai jo repository ke method ko bina kuch add kiye aage forward kar deti hai. Thodi si consistency ke liye ye chal jaata hai, lekin agar poori Service aisi hai to wo sirf indirection add kar rahi hai — har call ek extra file. Do options: (a) agar app me genuinely abhi rules nahi hain, Service layer defer karo, Controller seedha repository use kare; (b) jaise rules aayein (validation, orchestration, cross-entity checks), Service ko real weight do. Point ye hai ki layer tab banao jab usko kaam ho.",
  },
  {
    id: "why-layers-tr-8",
    question:
      "'Layering' ka matlab kya hai — alag Visual Studio projects/DLLs, ya kuch aur?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Zaroori nahi alag projects. Ek hi project me alag folders (`Controllers/`, `Services/`, `Repositories/`) bhi layering hai — ye logical separation hai.",
    detailedAnswer:
      "Layering pehle logical hai: har class ka ek clear role, dependencies ek direction me (Controller -> Service -> Repository). Ye ek single `.csproj` me folders se achieve hota hai — hamara EmployeeManagement.Api abhi aisa hi hai. Alag assemblies (`Domain.dll`, `Application.dll`, `Infrastructure.dll` — Clean/Onion Architecture) ek aur step hai jo compile-time me galat dependency rok deta hai, lekin wo baad ka aur bada decision hai ('Quality & Architecture' module). Chhote-mid apps ke liye folders kaafi hain.",
    followUp: "Alag assemblies me todne se kya extra guarantee milti hai jo sirf folders nahi de sakte?",
  },
];

export default questions;
