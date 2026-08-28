import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "efctx-1",
    question: "EF Core kya hai, aur DbContext ka role kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "EF Core ek ORM hai — C# entities ko relational tables se map karta hai, LINQ ko SQL me translate karta hai. DbContext database ke saath ek session hai jisme DbSet properties tables ko represent karti hain.",
    detailedAnswer:
      "EF Core (Entity Framework Core) .NET ka official object-relational mapper hai. Iska kaam do mismatched worlds ko jodna hai — C# objects aur relational rows. `DbContext` ek unit-of-work + session hai: usme change tracking hoti hai, LINQ queries SQL me translate hoti hain, aur `SaveChangesAsync()` pe sabhi pending changes ek transaction me DB pe jaate hain. Har `DbSet<T>` property ek table ko map karti hai. `DbContext` scoped hota hai (ek request jitna) aur thread-safe nahi hai.",
    followUp: "DbContext ka lifetime scoped kyun rakhte hain, singleton kyun nahi?",
    redFlag:
      "\"EF Core sirf ek SQL generator hai\" — change tracking aur unit-of-work ka zikr na karna batata hai candidate ne sirf tutorials copy kiye hain.",
  },
  {
    id: "efctx-2",
    question: "EF Core aur EF6 me kya farak hai? Naye project me kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "EF6 purana, Windows/.NET Framework-only, maintenance mode. EF Core naya, cross-platform rewrite. Naye project me hamesha EF Core.",
    detailedAnswer:
      "EF6 (`EntityFramework` package) .NET Framework ke daur ka hai — sirf Windows, ab sirf bug-fix maintenance. EF Core (`Microsoft.EntityFrameworkCore.*`) ground-up rewrite hai: cross-platform, modular providers (SqlServer, Npgsql, SQLite), better LINQ translation, migrations improved. Concepts (DbContext, DbSet, migrations) similar hain lekin API alag hai. .NET 8 project = EF Core 8.",
    followUp: "EF Core me 'provider' ka kya matlab hai, aur SQL Server se Postgres pe switch karna kitna kaam hai?",
  },
  {
    id: "efctx-3",
    question: "OnModelCreating kis liye hai? Ek example do jo conventions se express nahi ho sakta.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Fluent API se model configure karne ke liye — keys, indexes, column types, relationships jo conventions ya attributes se nahi aate. Example: composite unique index, ya decimal precision.",
    detailedAnswer:
      "Conventions bahut kuch de dete hain — `Id` = PK, string = `nvarchar(max)`, `int` PK = identity. Lekin jo ye infer nahi kar sakte woh `OnModelCreating` me: `entity.HasIndex(e => e.Email).IsUnique()` (unique constraint), `entity.Property(e => e.Salary).HasPrecision(18, 2)` (money precision), `entity.Property(e => e.PanNumber).HasMaxLength(10).IsFixedLength()` (char(10)), relationships ki delete behavior, multi-column indexes. Attributes se bhi kuch hota hai (`[Required]`, `[MaxLength]`) lekin Fluent API zyada powerful hai aur entity class ko persistence-annotations se saaf rakhta hai.",
    followUp: "Attributes vs Fluent API — team me kaunsa standardize karoge aur kyun?",
  },
  {
    id: "efctx-4",
    question:
      "Ye AppDbContext compile hoga?\n```csharp\npublic class AppDbContext : DbContext\n{\n    public DbSet<Employee> Employees { get; set; }\n\n    protected override void OnModelCreating(ModelBuilder mb)\n    {\n        mb.Entity<Employee>().Property(e => e.Salary).HasPrecision(18, 2);\n    }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile hoga, lekin DI ke saath kaam nahi karega — `DbContextOptions` lene wala constructor missing hai, to `AddDbContext` ise inject nahi kar paayega.",
    detailedAnswer:
      "Class syntactically valid hai. Problem runtime/DI pe: `AddDbContext<AppDbContext>(o => o.UseSqlServer(...))` expect karta hai ki context me ek `public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)` constructor ho, taaki configured options pass ho sakein. Uske bina app startup pe ya pehle resolve pe exception: 'no suitable constructor'. Fix: woh constructor add karo. Nullable-warning ke liye `DbSet` ko `=> Set<Employee>()` form me likhna bhi behtar hai.",
    redFlag: "Ye kehna ki 'constructor optional hai, EF Core default constructor use kar lega' — DI-registered context ke saath nahi.",
  },
  {
    id: "efctx-5",
    question: "Employee.Salary ko decimal ke bajaye double banate to production me kya scenario tootega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Floating-point rounding — salary additions, tax deductions, payroll totals me paisa off-by-a-paisa ho jaayega; reconciliation aur audit fail.",
    detailedAnswer:
      "`double` binary floating-point hai — `0.1` exactly represent nahi hota. Payroll me hazaaron salaries add karo, ya percentage-based deductions lagao, to accumulated error rupees me dikh sakta hai. BFSI me ledger totals match nahi karenge, auditor findings dega, aur customer ko galat amount credit/debit ho sakta hai. Fix: `decimal` (base-10, exact for money) + `HasPrecision(18, 2)`. Rule: currency = `decimal`, hamesha.",
    followUp: "decimal(18, 2) me 18 aur 2 ka kya matlab hai, aur agar salary 2 se zyada decimal places rakhe (jaise per-hour rate) to kya karoge?",
  },
  {
    id: "efctx-6",
    question: "Change tracking kya hai? Jab tum ek loaded Employee ka Salary badalte ho aur SaveChangesAsync call karte ho, EF Core andar kya karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "DbContext har loaded entity ka snapshot rakhta hai. SaveChanges pe woh current values ko snapshot se compare karta hai, badle hue entities ko Modified mark karta hai, aur sirf unke liye UPDATE bhejta hai.",
    detailedAnswer:
      "Jab entity query se aati hai, DbContext usko track karta hai aur uski original property values ka snapshot store karta hai. `emp.Salary = 90000` sirf in-memory object badalta hai. `SaveChangesAsync()` pe EF Core DetectChanges chalata hai — har tracked entity ke current vs original values compare — jise change mila usko `EntityState.Modified` milta hai, aur EF Core `UPDATE Employees SET Salary = @p WHERE Id = @id` generate karta hai sirf badle columns ke liye (default). `Add` se `Added`, `Remove` se `Deleted`. Sab ek transaction me. Isi wajah se tumhe `Update()` explicitly call karne ki zaroorat nahi jab entity already tracked ho.",
    followUp: "`AsNoTracking()` kab use karoge, aur uska trade-off kya hai?",
    redFlag: "Ye sochna ki har property assignment turant DB pe jaati hai — kuch nahi jaata jab tak SaveChanges na ho.",
  },
  {
    id: "efctx-7",
    question: "AddDbContext by default kaunsa service lifetime use karta hai, aur agar tum galti se DbContext ko ek singleton service me inject kar do to kya hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Scoped. Singleton me inject karne se captive dependency ban jaati hai — ek hi DbContext instance poori app life bhar chalta hai, cross-request state leak aur concurrency exceptions.",
    detailedAnswer:
      "`AddDbContext` context ko Scoped register karta hai — ek instance per HTTP request, request end pe dispose. Agar ek Singleton service constructor me `AppDbContext` maange, to woh scoped context singleton ke andar 'captured' ho jaata hai (captive dependency) aur effectively singleton ban jaata hai. Consequences: (1) do parallel requests same context share karengi -> 'A second operation was started on this context instance' exception, kyunki DbContext thread-safe nahi. (2) change tracker kabhi clear nahi hota -> memory grow, stale data. Fix: singleton ko `IServiceScopeFactory` ya `IDbContextFactory<AppDbContext>` inject karo aur per-operation short-lived context banao.",
    followUp: "IDbContextFactory kya hai aur background service me DbContext kaise safely use karoge?",
  },
  {
    id: "efctx-8",
    question: "InMemoryEmployeeRepository se EF Core pe jaane ka faisla — interviewer poochta hai 'kya tumhe abhi bhi IEmployeeRepository interface chahiye?'",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Haan — interface hi wo seam hai jiski wajah se hum sirf ek DI line badal ke poora data layer swap kar paate hain, service aur controller ko chhue bina.",
    detailedAnswer:
      "Module 3 me humne `IEmployeeRepository` banaya tha aur `InMemoryEmployeeRepository` diya. Ab `EfEmployeeRepository` banega jo wahi interface implement karta hai `AppDbContext` se. `Program.cs` me sirf `AddScoped<IEmployeeRepository, EfEmployeeRepository>()` — baaki sab same. Ye interface ka payoff hai. Kuch log kehte hain 'EF Core khud ek abstraction hai, DbContext ko repository pattern me wrap karna redundant' — ye valid critique hai, lekin is course me interface testing (Moq se service test) aur is exact swap demo ke liye rakha gaya hai. Real projects me team decide karti hai; dono positions defensible hain.",
    followUp: "Repository-over-EF-Core anti-pattern kyun kaha jaata hai? Kaunse cases me tum DbContext ko directly service me inject karoge?",
  },
];

export default questions;
