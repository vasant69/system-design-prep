import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "iface-1",
    question:
      "C# me interface kya hai? Ek abstract class se kaise alag hai, aur hum Controller ko `IEmployeeService` par depend karwate hain `EmployeeService` par kyun nahi?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer:
      "Interface ek pure contract hai — method signatures, koi body nahi, koi state nahi. Caller interface par depend kare to implementation swappable aur mockable ho jaati hai.",
    detailedAnswer:
      "Interface sirf batata hai 'jo bhi ye sign karega usme ye methods honge' — `IReadOnlyList<EmployeeDto> GetAll()`, `EmployeeDto? GetById(int id)`, wagairah — bina kisi implementation ke. Abstract class me partial implementation, fields aur constructor ho sakte hain, aur ek class sirf ek abstract class inherit kar sakti hai lekin kai interfaces implement kar sakti hai. `EmployeesController` ko `IEmployeeService` dene ka matlab: controller ko farak nahi padta andar `EmployeeService` hai, `CachedEmployeeService` hai ya test ka `FakeEmployeeService`. Ye decoupling 4 cheezein deti hai — swappable impls, mockability, parallel development (signature freeze karke), aur Dependency Inversion.",
    followUp:
      "Wo 4 fayde ek-ek karke concrete example ke saath samjhao — hamare project me.",
    redFlag:
      "'Interface aur abstract class same cheez hai' ya sirf 'good practice hai' bolna bina decoupling ka reason diye.",
  },
  {
    id: "iface-2",
    question:
      "Dependency Inversion Principle (SOLID ka 'D') kya kehta hai, aur `IEmployeeService` isko kaise satisfy karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "High-level module (Controller) aur low-level module (EmployeeService) dono ko ek abstraction (`IEmployeeService`) par depend karna chahiye — ek doosre par nahi.",
    detailedAnswer:
      "DIP: 'high-level policy code ko low-level detail par depend nahi karna chahiye; dono ko abstraction par depend karna chahiye.' Bina interface ke `EmployeesController` seedha `EmployeeService` par point karta hai — dependency ka teer policy se detail ki taraf. Interface daalne par dono `IEmployeeService` ki taraf point karte hain: Controller usse consume karta hai, `EmployeeService` usse implement karta hai. Ab compile-time dependency `Controllers` folder se `Services` folder ke concrete code par nahi rahi — bas contract par. Yahi 'inversion' hai.",
    followUp:
      "Dependency Injection aur Dependency Inversion — ye do alag cheezein hain ya same? Farak batao.",
  },
  {
    id: "iface-3",
    question:
      "Interface par depend karne se unit testing exactly kaise aasan hoti hai? Ek `EmployeeService.Create()` ka duplicate-email test likh ke dikhao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`EmployeeService` ko `IEmployeeRepository` chahiye — test me ek 2-line fake repo inject karo, koi real database ya HTTP nahi.",
    detailedAnswer:
      "`EmployeeService` `IEmployeeRepository` par depend karta hai, concrete `InMemoryEmployeeRepository` par nahi. Test:\n\n```csharp\nvar fakeRepo = new FakeEmployeeRepository();\nfakeRepo.Seed(new Employee { Email = \"asha@corp.in\" });\nvar service = new EmployeeService(fakeRepo);\n\nAssert.Throws<DomainRuleException>(\n    () => service.Create(new CreateEmployeeDto { Email = \"asha@corp.in\" }));\n```\n\nKoi `WebApplicationFactory`, koi routing, koi SQL Server nahi. Moq use karo to `Mock<IEmployeeRepository>` bhi chalega. Concrete dependency hoti to module 4 ke baad har service test ke liye real DbContext + connection string chahiye hota — slow aur flaky.",
    followUp:
      "Fake haath se likhna vs Moq/NSubstitute use karna — kab kya choose karoge?",
    redFlag:
      "'Interface test ko fast bana deti hai' bina ye samjhaye ki mechanism kya hai (fake/mock inject karna).",
  },
  {
    id: "iface-4",
    question:
      "Ye code compile hoga?\n```csharp\npublic class EmployeeService : IEmployeeService\n{\n    public IReadOnlyList<EmployeeDto> GetAll() => _repo.GetAll().Select(Map).ToList();\n    public EmployeeDto? GetById(int id) => Map(_repo.GetById(id));\n    public EmployeeDto Create(CreateEmployeeDto dto) => throw new NotImplementedException();\n}\n```\n(interface me 5 methods hain: GetAll, GetById, Create, Update, Delete)",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Nahi. Compile error — `EmployeeService` ne `Update` aur `Delete` implement nahi kiye, to wo `IEmployeeService` contract poora nahi karti.",
    detailedAnswer:
      "`: IEmployeeService` likhne ka matlab hai compiler force karega ki interface ke saare 5 methods `public`, exact signature ke saath moujood hon. `Update` aur `Delete` missing hain — error: \"'EmployeeService' does not implement interface member 'IEmployeeService.Update(int, UpdateEmployeeDto)'\". `throw new NotImplementedException()` likhna theek hai (method exist to karta hai, bas kaam nahi karta) — lekin method ka bilkul na hona compile todta hai. Ye compiler-enforced contract ka poora point hai.",
    redFlag:
      "'Haan compile hoga, bas runtime pe fail hoga' — interface member missing hona compile-time error hai, runtime nahi.",
  },
  {
    id: "iface-5",
    question:
      "`Program.cs` me `builder.Services.AddScoped<IEmployeeService, EmployeeService>();` likha hai, lekin controller ka constructor `EmployeesController(EmployeeService service)` maangta hai. Kya hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Runtime `InvalidOperationException`: 'Unable to resolve service for type EmployeeService'. Container me sirf `IEmployeeService` registered hai, concrete `EmployeeService` nahi.",
    detailedAnswer:
      "`AddScoped<IEmployeeService, EmployeeService>()` container ko sirf ek mapping deta hai: 'jise `IEmployeeService` chahiye, usse `EmployeeService` bana ke do'. Concrete `EmployeeService` khud ek registered service nahi hai. Jab pehli request pe controller banane ke liye DI `EmployeeService` maangta hai, container ke paas koi entry nahi milti — exception. Ye compile error nahi (type valid hai). Fix: constructor me wahi type maango jo register kiya hai — `IEmployeeService`. Ya (galat, but works) `AddScoped<EmployeeService>()` bhi register kar do — lekin phir do registrations, do instances per scope, confusion.",
    followUp:
      "Agar tum `AddScoped<IEmployeeService, EmployeeService>()` aur `AddScoped<EmployeeService>()` dono likh do to ek scope me kitne `EmployeeService` bante hain?",
  },
  {
    id: "iface-6",
    question:
      "Kya har class ke liye interface banana chahiye? `IEmployeeMapper`, `IEmployeeDto`, `IEmployee` — theek hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Interface sirf un cheezon ke liye jo inject/swap/mock hoti hain — Services, Repositories, external clients. DTOs, entities, records, aur trivial stateless helpers ke liye interface pure ceremony hai.",
    detailedAnswer:
      "Rule: interface tab banao jab 'is cheez ki jagah kuch aur rakhne ki zaroorat pad sakti hai' — real vs cached vs fake vs EF vs in-memory. `EmployeeDto` ek behaviour-less data carrier hai, use kabhi fake nahi karoge — `IEmployeeDto` sirf noise. `Employee` entity same. Ek stateless `EmployeeMapper` jise tum `new` karte ho aur jiska ek hi implementation kabhi hoga — uska interface bhi navigation overhead hai. Framework ne khud ye line pakdi hai: `ILogger`, `IConfiguration` inject hote hain, lekin `string` ya `DateTime` ke interfaces nahi. Blanket 'interface for everything' cargo-culting hai.",
    followUp:
      "Ek din tumhe `EmployeeMapper` ke do variants chahiye (v1 API shape, v2 API shape). Ab interface justify hoti hai?",
    redFlag:
      "'Testability ke liye har class ka interface hona chahiye' — over-abstraction, aur ye nahi samajhna ki behaviour-less types mock nahi hote.",
  },
  {
    id: "iface-7",
    question:
      "Explicit interface implementation kya hai? `void IEmployeeService.Delete(int id)` aur normal `public void Delete(int id)` me farak?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Explicit implementation method ko sirf interface reference se callable banata hai, class reference se nahi. Zaroorat lagbhag 5% cases me — jab do interfaces me same-named method ho aur unhe alag rakhna ho.",
    detailedAnswer:
      "Implicit (`public void Delete`) — method `EmployeeService` variable se bhi call hota hai aur `IEmployeeService` variable se bhi. Explicit (`void IEmployeeService.Delete(int id) { ... }`) — method public surface pe nahi aata; use call karne ke liye reference `IEmployeeService` type ka hona chahiye (ya cast). Main use-case: ek class `IEmployeeService` aur koi `ILegacyEmployeeApi` dono implement kare jinme dono me `Delete(int)` hai, lekin behaviour alag chahiye — dono ko explicitly implement karo. Hamare project me hum sirf implicit use karte hain; explicit ka bas exist karna jaan lena kaafi hai.",
  },
  {
    id: "iface-8",
    question:
      "`IEmployeeRepository` interface me `IQueryable<Employee> Query()` ya `DbSet<Employee> Set()` expose karna — kya problem hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ye EF Core ka detail contract me leak kar deta hai. `InMemoryEmployeeRepository` ise honestly implement nahi kar sakti, aur query behaviour poore codebase me phail jaata hai.",
    detailedAnswer:
      "Interface ka poora point implementation-agnostic hona hai. `IQueryable<Employee>` return karte hi contract keh raha hai 'mujhe ek deferred, provider-backed query source do' — jo sirf EF/LINQ-to-SQL de sakta hai. `List<Employee>` wali in-memory repo `AsQueryable()` se kaam chala legi lekin `.Include()`, async materialization, ya SQL translation ka semantics match nahi karega — test aur prod alag behave karenge. Doosra problem: ab har caller `.Where().OrderBy().Skip().Take()` khud likhega, yaani query logic Service me wapas aa gaya jise Repository me rakhna tha. Contract ko intention-revealing rakho: `GetActiveByDepartment(int departmentId)`, `EmailExists(string email)` — provider-neutral methods.",
    followUp:
      "Agar pagination chahiye to interface kaisa dikhega bina `IQueryable` leak kiye?",
    redFlag:
      "'`IQueryable` return karo taaki flexible rahe' — ye leaky abstraction hai, flexibility nahi.",
  },
];

export default questions;
