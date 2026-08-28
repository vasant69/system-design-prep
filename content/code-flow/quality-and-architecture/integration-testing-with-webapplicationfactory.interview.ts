import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "inttest-1",
    question:
      "ASP.NET Core Web API ko end-to-end test kaise karoge bina deploy kiye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`Microsoft.AspNetCore.Mvc.Testing` ka `WebApplicationFactory<Program>` app ko in-memory boot karta hai; `factory.CreateClient()` ek `HttpClient` deta hai jo asli middleware, routing, controllers aur EF Core se guzarta hai. DB ko SQLite in-memory ya Testcontainers se swap karta hoon, auth ko test handler se.",
    detailedAnswer:
      "Test project me `Microsoft.AspNetCore.Mvc.Testing` add karo aur `Program.cs` me `public partial class Program { }` daalo. Ek custom `EmployeeApiFactory : WebApplicationFactory<Program>` banao jo `ConfigureWebHost` me SQL Server ki `DbContextOptions<AppDbContext>` registration `services.Remove(...)` se hataye aur SQLite in-memory `AddDbContext` daale, phir `EnsureCreated()`. `factory.CreateClient()` se mila `HttpClient` asli pipeline hit karta hai — `client.PostAsJsonAsync(/api/employees_route, body)`, phir `response.StatusCode` aur `await response.Content.ReadFromJsonAsync<EmployeeDto>()` assert karo. Har endpoint ka happy path plus key sad paths — `404`, `400`, `401`, `403`, `409`. Per-test isolation ke liye `IClassFixture<T>` (ek factory share) aur `IAsyncLifetime.InitializeAsync` (tables clear + re-seed).",
    followUp: "`Program` class ko `public partial` kyun banana padta hai?",
    redFlag:
      "`return`-type controller method ko direct `new EmployeesController(...)` se call karna aur use integration test bolna — wo middleware, routing, filters, auth kuch nahi chalata.",
  },
  {
    id: "inttest-2",
    question:
      "Integration test me database kaise replace karte ho — SQLite in-memory vs Testcontainers, kaunsa kab?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Default SQLite in-memory — tez, no Docker. SQL Server-specific queries (rowversion, `DATEDIFF`, collation, raw SQL) wale tests Testcontainers `MsSqlContainer` pe, jo asli SQL Server container start karta hai.",
    detailedAnswer:
      "SQLite in-memory: `ConfigureWebHost` me `DbContextOptions<AppDbContext>` descriptor `Remove` karo, ek `SqliteConnection(DataSource_memory)` khol kar factory ki lifetime tak khula rakho (band hote hi DB wipe), `options.UseSqlite(connection)`, phir `EnsureCreated()`. Suite ~2-4 second, CI aur laptop dono pe bina setup. Trade-off: SQLite aur SQL Server har cheez me same nahi — `rowversion`, computed columns, `DATEDIFF`, case-sensitive collation, `MERGE`, raw SQL. Aise queries ke tests ke liye Testcontainers: `new MsSqlBuilder().WithImage(...).Build()`, `await container.StartAsync()`, `options.UseSqlServer(container.GetConnectionString())`, `Database.Migrate()`. Docker chahiye, boot 5-15 second, par asli provider. Practical: 90% tests SQLite pe, SQL Server-specific 10% Testcontainers pe, aur ek nightly CI stage jo poori suite real SQL Server pe chalati hai.",
    followUp:
      "SQLite pe test green tha par SQL Server pe production `500` de raha hai — debugging kaise karoge?",
    redFlag:
      "EF Core InMemory provider (`UseInMemoryDatabase`) ko integration test ka DB bana dena — wo relational constraints, transactions aur kai LINQ translations enforce hi nahi karta, false confidence deta hai.",
  },
  {
    id: "inttest-3",
    question:
      "Integration tests me authentication/authorization kaise handle karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Do options: ek test `AuthenticationHandler<AuthenticationSchemeOptions>` jo har request ko known user + role deta hai (default scheme test factory me), ya app ke wahi signing key se ek real JWT mint karke `Authorization` header me bhejna. Plus ek `401` (no token) aur ek `403` (wrong role) test.",
    detailedAnswer:
      "Fake handler: `HandleAuthenticateAsync` me `ClaimsIdentity` banao (`ClaimTypes.Name`, `ClaimTypes.NameIdentifier`, `ClaimTypes.Role`), `AuthenticateResult.Success(ticket)` return karo. Factory me `services.AddAuthentication(Test_scheme).AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(...)` — sirf test project me. Role ko configurable rakho taaki ek test `HR` pe `200` aur dusra `Viewer` pe `403` check kare. Anonymous ke liye `_factory.WithWebHostBuilder(...)` se ek naya client jisme koi valid scheme na ho, `401` expect karo. Real-JWT approach zyada faithful hai (asli `JwtBearer` middleware, issuer/audience/expiry validation bhi test hota hai) par test me token minting boilerplate. Chhoti suite ke liye fake handler kaafi, security-sensitive API ke liye real JWT behtar.",
    followUp:
      "Real JWT mint karne ka faayda kya hai fake handler ke over?",
    redFlag:
      "Saare protected endpoints ko `AllowAnonymous` test factory se test karke maan lena ki auth theek hai — `401`/`403` paths kabhi assert hi nahi hote.",
  },
  {
    id: "inttest-4",
    question:
      "Tumhare integration tests CI pe kabhi-kabhi randomly fail hote hain, locally hamesha pass. Sabse likely wajah aur fix?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Tests ke beech shared DB state reset nahi ho raha — ek test ka data dusre me leak karta hai, aur execution order pe result badalta hai. Fix: har test ke pehle tables clear karke fresh seed daalo.",
    detailedAnswer:
      "`IClassFixture<EmployeeApiFactory>` ek hi factory (aur ek hi SQLite in-memory DB) poori class me share karta hai. Agar seed sirf constructor me ek baar hota hai aur tests insert/update/delete karte hain, to state accumulate hoti hai. xUnit tests parallel bhi chal sakte hain (alag collections). Fix: `IAsyncLifetime.InitializeAsync` me `db.Employees.RemoveRange(db.Employees)` type se tables clear karo aur known rows dobara seed karo — har `[Fact]` ke pehle. Aur likhte waqt hard-coded IDs pe depend mat karo jab tak seed unhe explicitly set na kare. Alternative: har test ko ek transaction me wrap karke rollback, par SQLite in-memory ke saath simple clear+seed zyada reliable hai.",
    followUp:
      "xUnit me do test classes ek hi DB share karein to kya use karoge?",
  },
  {
    id: "inttest-5",
    question:
      "Ye code compile nahi ho raha — kya galat hai?\n```csharp\npublic class EmployeeApiFactory : WebApplicationFactory<Program> { }\n// Program.cs top-level statements ke saath, kuch aur nahi\n```\nError: `Program` is inaccessible due to its protection level.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Top-level statements ke saath compiler jo `Program` class banata hai woh `internal` hai. `Program.cs` ke aakhir me `public partial class Program { }` add karo.",
    detailedAnswer:
      "`WebApplicationFactory<TEntryPoint>` ke generic parameter ke liye class accessible honi chahiye. Top-level `Program.cs` ka synthesized `Program` `internal` hota hai aur alag test assembly use nahi dekh pati. Do fix: (1) `Program.cs` ke last line pe `public partial class Program { }` — synthesized class ke saath merge ho kar use `public` bana deta hai; (2) test project ke `.csproj` me `InternalsVisibleTo` add karna, par (1) standard hai. Iske baad `WebApplicationFactory<Program>` theek compile hota hai.",
    followUp:
      "`InternalsVisibleTo` approach ka nuksan kya hai (1) ke muqable me?",
    redFlag:
      "`WebApplicationFactory<Startup>` likhna — .NET 6+ minimal hosting me `Startup` class hoti hi nahi.",
  },
  {
    id: "inttest-6",
    question:
      "Unit test aur integration test me kya farak hai, aur test pyramid kya kehta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Unit test: ek class, dependencies mocked, koi I/O, milliseconds. Integration test: asli app + asli DB + asli HTTP pipeline, sub-second se kuch second. Pyramid: roughly 70% unit, 20% integration, 10% end-to-end.",
    detailedAnswer:
      "Unit test business rules, calculators, validators, state transitions ke liye — jahan tumhari decision logic hai. Integration test routing, middleware order, `[ApiController]` model binding, `[Authorize]` policies, EF Core LINQ-to-SQL translation, DI wiring, serialization, aur full CRUD happy + sad paths ke liye — yeh sab unit test kabhi nahi pakadta. End-to-end test deployed environment, asli external services, critical journeys ke liye — mehnge aur flaky, isliye kam. Zyada integration tests = slow suite jo developers locally chalate nahi; kam = wiring bugs production me. `EmployeeManagement.Api` ke liye: har rule permutation unit me, har endpoint ka ek representative flow + key error paths integration me.",
    followUp:
      "`[ApiController]` ka automatic `400` behaviour — unit test karoge ya integration?",
    redFlag:
      "`in-memory` EF provider pe LINQ query test karke use unit test bolna aur maan lena ki production SQL me bhi waise hi chalegi.",
  },
  {
    id: "inttest-7",
    question:
      "Production me ek bug aaya: `Viewer`-role user `DELETE /api/employees/1` maar kar employee delete kar pa raha tha. Integration testing ke through iska regression guard kaise banaoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Pehle ek failing integration test likho jo `Viewer` token ke saath `DELETE` bhej kar `403 Forbidden` expect kare — dekho woh red hai, phir `[Authorize(Roles = ...)]` fix karke green karo. Woh test hamesha ke liye pehra dega.",
    detailedAnswer:
      "Steps: (1) `EmployeesAuthTests` me test — `TestAuthHandler.Role = Viewer`, `_factory.CreateClient()`, `await client.DeleteAsync(/api/employees/1)`, `response.StatusCode.Should().Be(HttpStatusCode.Forbidden)`. (2) Run — abhi `204` aata hai, test red, bug confirmed. (3) Controller pe `[Authorize(Roles = HR_Admin)]` ya policy fix karo. (4) Green. Saath me ek `401` test (no token) aur ek positive `HR` token pe `204` bhi add karo taaki teeno cases lock ho. Post-mortem action: har protected endpoint ke liye correct-role `200`/`204` aur wrong-role `403` mandate — auth sabse aasani se toot-ne wali cheez hai aur unit test use kabhi nahi pakadta.",
    followUp:
      "Authorization guard controller attribute me hona chahiye ya service layer me? Kyun?",
  },
  {
    id: "inttest-8",
    question:
      "`WebApplicationFactory` slow hai — poori suite 40 second le rahi hai. Speed up karne ke kya tarike hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Factory ko `IClassFixture`/`ICollectionFixture` se share karo (har test pe boot mat karo), SQLite in-memory use karo Testcontainers ki jagah jahan possible ho, business rule permutations unit tests me shift karo, aur `EnsureCreated` ko `Migrate` ke bajaye rakho.",
    detailedAnswer:
      "Sabse bada cost app boot + DB setup hai. `IClassFixture<EmployeeApiFactory>` ek factory instance poori class me share karta hai; `ICollectionFixture` multiple classes me. Testcontainers har suite pe container boot karta hai (5-15s) — sirf SQL Server-specific tests wahan rakho, baaki SQLite in-memory pe (~ms boot). Har rule ka permutation HTTP ke through test karna slow hai — un, valid-PAN 5 cases type tests, `EmployeeServiceTests` unit me jaayein. `EnsureCreated()` model se schema banata hai (fast); `Migrate()` har migration replay karta hai (slow), sirf tab jab migration correctness bhi test karni ho. Parallelization: alag collections parallel chal sakti hain agar DB isolation ho.",
    followUp:
      "Testcontainers container ko poore test run me ek baar start karke saari classes me reuse kaise karoge?",
    redFlag:
      "Har `[Fact]` me `new WebApplicationFactory<Program>()` banana — app har test pe dobara boot hota hai, suite 10x slow.",
  },
];

export default questions;
