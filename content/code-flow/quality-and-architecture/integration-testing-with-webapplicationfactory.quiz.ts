import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "integration-testing-with-webapplicationfactory-1",
    question:
      "`WebApplicationFactory<Program>` use karne ke liye top-level-statements wali `Program.cs` me ek line add karni padti hai. Kaunsi, aur kyun?",
    options: [
      "`app.Run();` ko `app.RunAsync();` karna padta hai taaki test host ise await kar sake",
      "`public partial class Program { }` add karna padta hai, kyunki generated `Program` class `internal` hoti hai aur test project use access nahi kar pata",
      "`[assembly: TestHost]` attribute lagana padta hai",
      "`builder.WebHost.UseTestServer();` add karna padta hai production `Program.cs` me",
    ],
    correctIndex: 1,
    explanation:
      "Top-level statements ke saath compiler ek `internal` `Program` class banata hai, aur `WebApplicationFactory<Program>` ka generic parameter accessible hona chahiye. `public partial class Program { }` (usually `Program.cs` ke last line pe) use `public` bana deta hai. Iske bina compile error aata hai jo `Program` ke protection level ke baare me hota hai. `UseTestServer` factory khud lagati hai, production code me nahi. `app.RunAsync` ya koi fake attribute yahan relevant nahi.",
    difficulty: "medium",
  },
  {
    id: "integration-testing-with-webapplicationfactory-2",
    question:
      "Integration test me SQL Server `DbContext` ko SQLite in-memory se replace karne ke liye `ConfigureWebHost` me sabse pehle kya karna zaroori hai?",
    options: [
      "Kuch nahi — `AddDbContext` dobara call karne se purani registration apne aap hat jaati hai",
      "Service collection me se `DbContextOptions<AppDbContext>` wala `ServiceDescriptor` dhoondh kar `services.Remove(...)` karna, phir SQLite wala `AddDbContext` add karna",
      "`appsettings.json` ka connection string test project me override karna kaafi hai",
      "`AppDbContext` ko `sealed` se `partial` banana padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Real `Program.cs` ki registrations pehle chalti hain. Agar tum dobara `AddDbContext` call karo bina purani `DbContextOptions<AppDbContext>` descriptor hataye, to DI me do options registrations reh jaati hain aur behaviour ambiguous/galat ho jaata hai (aksar last-registered jeetta hai, par options resolution predictable nahi). Isliye pehle `SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>))` se descriptor dhoondh kar `Remove`, phir SQLite `AddDbContext`. Sirf connection string badalne se provider abhi bhi SQL Server rehta hai. `sealed`/`partial` ka isse koi lena-dena nahi.",
    difficulty: "hard",
  },
  {
    id: "integration-testing-with-webapplicationfactory-3",
    question:
      "SQLite in-memory database ke saath test likhte waqt `no such table` errors aa rahe hain. Sabse common wajah kya hai?",
    options: [
      "SQLite EF Core support hi nahi karta — SQL Server LocalDB use karna padega",
      "`DataSource=:memory:` wali database sirf tab tak zinda rehti hai jab tak uska connection khula hai; har naye `DbContext` pe naya connection banane se schema wipe ho jaata hai",
      "`EnsureCreated()` ki jagah `Migrate()` call karna hamesha zaroori hai, warna table nahi bante",
      "SQLite me tables case-sensitive hote hain aur `Employees` ko `EMPLOYEES` likhna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "SQLite in-memory DB connection-scoped hoti hai: jaise hi aakhri connection band hota hai, DB (schema + data) gayab. Agar har `DbContext` instance apna naya `SqliteConnection` khole, to ek context ne jo table banaya woh agle context ko nahi dikhta. Fix: ek `SqliteConnection` factory ki lifetime tak khula rakho aur wahi connection har `DbContext` ko do. `EnsureCreated()` schema bana deta hai (migrations ke bina); `Migrate()` tab chahiye jab migrations ki correctness bhi test karni ho. SQLite table names case-insensitive hote hain by default.",
    difficulty: "medium",
  },
  {
    id: "integration-testing-with-webapplicationfactory-4",
    question:
      "SQLite in-memory vs Testcontainers SQL Server integration tests ke liye — sahi trade-off statement kaunsa hai?",
    options: [
      "Testcontainers hamesha behtar hai; SQLite in-memory production jaisa kuch bhi verify nahi karta",
      "SQLite in-memory tez hai (seconds, no Docker) par SQL Server se drift karta hai (`rowversion`, `DATEDIFF`, collation, raw SQL); Testcontainers asli provider deta hai par Docker chahiye aur boot slow hai — default SQLite, aur sirf SQL Server-specific queries wale tests Testcontainers pe",
      "Dono bilkul same hain; farak sirf package ke naam ka hai",
      "SQLite in-memory sirf unit tests ke liye hai, integration tests hamesha Testcontainers maangte hain",
    ],
    correctIndex: 1,
    explanation:
      "SQLite in-memory suite typically 2-4 seconds me chalti hai, koi Docker daemon nahi chahiye, CI aur laptop dono pe bina setup — isliye achha default. Par SQLite aur SQL Server har jagah same nahi: `rowversion`/`timestamp`, computed columns, `DATEDIFF`, case-sensitive collation, `MERGE`, raw SQL inpe behave alag karte hain, to SQLite ka green jhootha ho sakta hai. Testcontainers ek asli SQL Server container start karta hai (real migrations, real translation) par Docker + slower boot ki keemat pe. Practical: default SQLite, aur woh test classes jo SQL Server-specific features touch karti hain unhe Testcontainers pe.",
    difficulty: "hard",
  },
];

export default quiz;
