import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "swaprepo-iq-1",
    question:
      "Aapke paas ek `IEmployeeRepository` hai jiske peeche in-memory list hai. Ise EF Core + SQL Server par kaise move karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek nayi `EfEmployeeRepository : IEmployeeRepository` likho jo `AppDbContext` inject kare — reads `DbSet` par `ToListAsync`/`FindAsync`/`AnyAsync` se, writes `Add`/`Remove` + `SaveChangesAsync` se. `Program.cs` me sirf DI registration line badlo. Service aur controller untouched.",
    detailedAnswer:
      "Interface `IEmployeeRepository` wahi rehta hai. Nayi class `EfEmployeeRepository` constructor me `AppDbContext` maangti hai (DI se scoped instance). `GetAllAsync` -> `_db.Employees.AsNoTracking().OrderBy(...).ToListAsync(ct)`. `GetByIdAsync` -> `_db.Employees.FindAsync(...)`. `EmailExistsAsync` -> `_db.Employees.AnyAsync(e => e.Email == email, ct)`. `AddAsync` -> `_db.Employees.Add(e); await _db.SaveChangesAsync(ct);`. `RemoveAsync` -> `FindAsync` phir `Remove` phir `SaveChangesAsync`. `Program.cs` me `AddScoped<IEmployeeRepository, InMemoryEmployeeRepository>()` ko `AddScoped<IEmployeeRepository, EfEmployeeRepository>()` kar do. `EmployeeService` (business logic) aur `EmployeesController` me ek line nahi badalti — ye Dependency Inversion ka concrete payoff hai.",
    followUp: "Agar `EmployeeService` ne interface ke bajaye `InMemoryEmployeeRepository` concrete class ko inject kiya hota to kya badalta?",
    redFlag: "Ye kehna ki service me `AppDbContext` inject karna padega ya har data call rewrite karni padegi.",
  },
  {
    id: "swaprepo-iq-2",
    question: "`DbSet.Add()` aur `SaveChangesAsync()` ke beech responsibility ka batwara kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`Add` sirf change tracker me entity ko `Added` mark karta hai — koi SQL nahi. `SaveChangesAsync` saare tracked changes ke liye `INSERT`/`UPDATE`/`DELETE` ek implicit transaction me bhejta hai.",
    detailedAnswer:
      "EF Core ka model do-phase hai. Phase 1 (staging): `Add`, `Remove`, ya ek tracked entity ki property badalna — sab sirf in-memory change tracker ka state badalte hain. Phase 2 (flush): `SaveChangesAsync` tracker ko scan karta hai, har changed entity ke liye SQL generate karta hai, ek transaction open karta hai, sab statements bhejta hai, commit karta hai. Ek statement fail hua to poora rollback. Insert ke baad database-generated values (`IDENTITY` `Id`, `rowversion`, computed columns) EF wapas entity me padh leta hai. Iska matlab: ek repository method me tum multiple `Add`/`Remove` kar sakte ho aur ek `SaveChangesAsync` se sab atomically commit honge.",
    followUp: "Ek hi `SaveChangesAsync` me do entities insert ho rahi hain aur doosri constraint violate karti hai — pehli ka kya hota hai?",
  },
  {
    id: "swaprepo-iq-3",
    question:
      "Ye repository method review me aayi. Kya bug hai?\n```csharp\npublic async Task<Employee> UpdateSalaryAsync(int id, decimal salary, CancellationToken ct)\n{\n    var e = await _db.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);\n    e!.Salary = salary;\n    await _db.SaveChangesAsync(ct);\n    return e;\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`AsNoTracking()` ki wajah se `e` track nahi ho raha, isliye `Salary` change EF ko dikhta hi nahi — `SaveChangesAsync` chup-chaap kuch nahi karega. `AsNoTracking()` hata do (ya `FindAsync` use karo), phir save karo.",
    detailedAnswer:
      "`AsNoTracking()` entity ko change tracker se bahar rakhta hai — ye read-only queries ke liye hai. Yahan hum entity ko edit karke `SaveChangesAsync` karna chahte hain, to use tracked hona chahiye. Fix ke do tareeke: (1) `AsNoTracking()` hata do aur `FirstOrDefaultAsync` ka result tracked rahega; (2) `var e = await _db.Employees.FindAsync(new object?[]{ id }, ct);` — PK lookup, tracked. Ek teesra pattern jab tum disconnected entity (DTO se bani) save kar rahe ho: `_db.Employees.Update(e)` ya `_db.Entry(e).Property(x => x.Salary).IsModified = true`. Is method me sabse simple: `AsNoTracking()` drop karo.",
    followUp: "Agar tum sirf `Salary` column `UPDATE` karna chahte ho, poora entity nahi — kaise?",
    redFlag: "Ye kehna ki code theek hai aur `SaveChangesAsync` har case me `UPDATE` bhej dega.",
  },
  {
    id: "swaprepo-iq-4",
    question:
      "Repository ke andar `AppDbContext` ko `new AppDbContext()` se banana — kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Tab `DbContextOptions` (connection string, provider, retry policy) configure hi nahi hote, aur DI ka scoped lifetime toot jaata hai — ye context request ke doosre components se share nahi hota. Hamesha constructor injection.",
    detailedAnswer:
      "`AddDbContext<AppDbContext>(...)` `Program.cs` me options set karta hai — kaunsa provider, connection string, `EnableRetryOnFailure`, logging. `new AppDbContext()` in sab ko bypass karta hai; parameterless constructor exist bhi nahi karta jab tak tum na banao, aur banaya to hardcoded config. Doosra, DI `AppDbContext` ko scoped register karta hai — ek HTTP request me ek instance, jise repository, `SaveChanges`, aur (transactions ke case me) multiple repositories share karte hain (ek unit of work). `new` se har jagah alag context — ek me `Add` kiya, doosre me `SaveChanges` kiya, kuch save nahi hoga. Sahi: constructor me `AppDbContext db` parameter, DI use inject karega.",
    followUp: "Ek background service (singleton) me `AppDbContext` chahiye — wahan kya karoge?",
    redFlag: "`new AppDbContext()` ko 'thread-safety ke liye behtar' batana.",
  },
  {
    id: "swaprepo-iq-5",
    question:
      "Naya SQL Server database khaali hai. Test data kaise seed karoge, aur reference data (departments) vs bulk test data me farak?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Reference data (departments, roles, document types) ke liye `HasData` in `OnModelCreating` — wo ek migration ka hissa ban jaata hai aur har environment me deterministic. Bulk/dev test data ke liye ek startup seeder jo sirf `IsDevelopment()` me chale.",
    detailedAnswer:
      "`modelBuilder.Entity<Department>().HasData(new Department { Id = 1, Name = \"Retail Lending\", CostCentre = \"CC-101\" })` — fixed PKs chahiye, `dotnet ef migrations add SeedDepartments` isse `InsertData` calls me convert karta hai, aur `database update` har environment me same rows daalta hai. Ye version-controlled aur reviewable hai. Bulk test data (100 fake employees) ke liye `Program.cs` me ek dev-only block: `if (app.Environment.IsDevelopment()) { using var scope = ...; if (!await db.Employees.AnyAsync()) { /* add + SaveChangesAsync */ } }`. Ye production me kabhi nahi chalna chahiye — isliye environment guard aur `AnyAsync` idempotency check. `HasData` ko bulk/random data ke liye use mat karo — har row migration me hardcode ho jaati hai.",
    followUp: "`HasData` se seed ki gayi ek department ka `CostCentre` badalna hai — kaise?",
  },
  {
    id: "swaprepo-iq-6",
    question:
      "Interview me poocha: 'Repository pattern EF Core ke saath zaroori hai? `DbContext` khud ek repository/unit-of-work hai na?'",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Technically zaroori nahi — `DbSet` repository jaisa hai, `SaveChanges` unit of work jaisa. Repository tab add karo jab tum storage swap-ability, ek narrow testable data surface, ya team-wide consistency chahte ho. Generic `IRepository<T>` jo `IQueryable` leak kare — usse bacho.",
    detailedAnswer:
      "Haan, `DbContext` = unit of work aur `DbSet<T>` = generic repository — ye sach hai. Phir bhi ek **specific** `IEmployeeRepository` (intention-revealing methods jaise `GetActiveByDepartmentAsync`, materialized `List<Employee>` return, koi `IQueryable` leak nahi) do reasons se value deta hai: (1) `EmployeeService` ko ek 15-line fake se test kar sakte ho bina EF ke; (2) data-access ek jagah — `AsNoTracking`, includes, paging conventions repository me consistent. Jahan pattern galat hota hai: ek pure generic `IRepository<T>` jo `IQueryable<T> Query()` deta hai — ab in-memory implementation honest nahi ho sakti aur EF detail phir bhi bahar leak karti hai. Chhote apps me jahan storage kabhi nahi badlega, `Service -> DbContext` bhi acceptable hai.",
    followUp: "Aapke project me repository ka concrete faayda kya raha?",
    redFlag: "Dogmatically kehna ki 'repository hamesha chahiye' ya 'repository kabhi nahi chahiye' bina trade-off samjhe.",
  },
  {
    id: "swaprepo-iq-7",
    question:
      "`EmailExistsAsync` implement karne ke do tareeke: `(await _db.Employees.ToListAsync()).Any(e => e.Email == email)` vs `await _db.Employees.AnyAsync(e => e.Email == email)`. Kaunsa aur kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`AnyAsync(predicate)` — wo SQL me `SELECT CASE WHEN EXISTS(...)` translate hota hai, sirf ek boolean network par aata hai. Pehla wala poori `Employees` table memory me le aata hai phir C# me filter karta hai.",
    detailedAnswer:
      "`ToListAsync().Any(...)` client evaluation hai: EF `SELECT * FROM Employees` chalata hai, saari rows objects me materialize karta hai, phir `.Any` C# me chalta hai. 10 lakh employees pe ye disaster hai. `AnyAsync(e => e.Email == email)` predicate ko server par push karta hai — `IF EXISTS (SELECT 1 FROM Employees WHERE Email = @email)` — index ke saath ye O(log n) aur ek boolean return. Rule: filtering/existence/aggregation hamesha `IQueryable` par (server-side); `ToList`/`AsEnumerable` ke baad jo bhi LINQ hai wo memory me chalta hai. Duplicate-email check jaisi cheez har `POST` par chalti hai, to ise `AnyAsync` hona hi chahiye, plus `Email` par unique index.",
    followUp: "`AnyAsync` bhi race-safe nahi hai concurrent inserts me — final safety net kya hai?",
  },
];

export default questions;
