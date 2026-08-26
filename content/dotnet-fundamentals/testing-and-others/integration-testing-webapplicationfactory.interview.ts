import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "integration-testing-waf-tr-1",
    question: "Unit test aur integration test me kya fundamental difference hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["Amazon", "Swiggy", "TCS"],
    shortAnswer:
      "Unit test ek isolated unit ko mocked dependencies ke saath test karta hai; integration test poori pipeline (routing, middleware, DI, database) ko real wiring ke saath end-to-end test karta hai.",
    detailedAnswer:
      "Unit tests fast hain aur business logic ke edge cases granularly cover karte hain, dependencies mock ki jaati hain taaki test isolated rahe. Integration tests slower hain lekin genuinely verify karte hain ki poora system — real DI registrations, real middleware ordering, real database interactions — saath me sahi kaam karta hai. Dono complementary hain, ek dusre ka replacement nahi.",
    followUp: "Test pyramid me integration tests ka proportion kitna hona chahiye unit tests ke comparison me?",
  },
  {
    id: "integration-testing-waf-tr-2",
    question: "`WebApplicationFactory<T>` kaise kaam karta hai — actual network pe listen karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi — ye ek in-memory TestServer use karta hai, real app pipeline (middleware/routing/DI) ko boot karta hai bina actual network port involve kiye, aur ek HttpClient deta hai jo real HTTP-jaisa request/response cycle simulate karta hai.",
    detailedAnswer:
      "WebApplicationFactory ASP.NET Core ke TestServer infrastructure ko use karta hai — poora app pipeline genuinely boot hota hai (Program.cs configuration, middleware, DI container sab real hain), lekin requests actual TCP/network layer se nahi jaate. Ye tests ko fast aur reliable banata hai (no port conflicts, no network flakiness) jabki behavior genuinely production-jaisa rehta hai.",
  },
  {
    id: "integration-testing-waf-tr-3",
    question: "EF Core InMemory provider integration tests ke liye kyun risky choice hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Ye real database constraints (foreign key, unique) enforce nahi karta aur SQL-specific query translation ko simulate nahi karta — isse tests green dikhte hain lekin real bugs production tak pahunch sakte hain.",
    detailedAnswer:
      "InMemory provider ek simplified in-process store hai, real SQL engine nahi — isliye constraint violations jo real database catch karta, InMemory silently allow kar sakta hai. Kuch LINQ queries jo real database provider (SQL Server/Postgres) me translate hoke fail hoti (unsupported SQL pattern), InMemory me pass ho jaati hain kyunki wo pure in-memory LINQ-to-Objects hai. Fix: Testcontainers se real database use karo behavior-sensitive tests ke liye.",
    redFlag: "Ye kehna ki InMemory provider 'real database jaisa hi hai, bas faster' — ye galat hai aur real production bugs ko chhupa sakta hai.",
  },
  {
    id: "integration-testing-waf-tr-4",
    question: "Testcontainers kya hai aur ye kaunsi problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek library jo Docker containers me real dependencies (database, message queue, etc.) test-run ke liye spin up karti hai — EF Core InMemory ke behavioral gaps ko solve karta hai, genuinely real database use karke.",
    detailedAnswer:
      "Testcontainers (`Testcontainers.PostgreSql`, `Testcontainers.MsSql` NuGet packages) test-run start hone par ek real database ko Docker container me start karta hai, connection string deta hai, aur test khatam hone par container automatically dispose ho jaata hai. Isse tests real constraints, real transactions, aur real SQL translation ke against verify hote hain — trade-off Docker dependency aur thoda slower startup hai.",
    followUp: "CI pipeline me Docker available na ho to kya karoge?",
  },
  {
    id: "integration-testing-waf-tr-5",
    question: "`IClassFixture<WebApplicationFactory<Program>>` kyun use karte hain, sirf `new WebApplicationFactory<Program>()` har test me kyun nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "App boot karna expensive hai — IClassFixture ek instance ko poore test class ke saare tests ke beech share karta hai, repeated startup cost avoid karke.",
    detailedAnswer:
      "Agar har individual test method apna khud ka WebApplicationFactory banaye, poori app pipeline (DI container setup, configuration loading, middleware registration) baar-baar boot hoti — significant slow-down. `IClassFixture<T>` (xUnit ka mechanism) ensure karta hai ki factory ek baar create ho aur class ke saare tests use kar sakein, jab tak tests isolated state maintain kar rahe hon.",
  },
  {
    id: "integration-testing-waf-tr-6",
    question: "Ek test me database ko real production database ke bajaye replace karna hai. `WithWebHostBuilder` se ye kaise kiya jaata hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`ConfigureServices` me pehle se registered DbContext service descriptor ko dhoond ke remove karo, phir test-specific connection string ke saath naya `AddDbContext` register karo.",
    detailedAnswer:
      "`factory.WithWebHostBuilder(builder => builder.ConfigureServices(services => { ... }))` ke andar `services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>))` se existing registration dhoondte hain, `services.Remove(descriptor)` se hataate hain, phir `services.AddDbContext<AppDbContext>(options => options.UseNpgsql(testConnectionString))` se naya register karte hain. Remove step skip karne se duplicate/conflicting registration ho sakta hai.",
    followUp: "Agar Remove step skip kar do to kya problem aa sakti hai?",
  },
  {
    id: "integration-testing-waf-tr-7",
    question: "Kya integration tests unit tests ko completely replace kar sakte hain?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Nahi — integration tests slower hain aur granular edge-case business logic testing ke liye impractical hain. Dono layers ki apni jagah hai.",
    detailedAnswer:
      "Ek team jo sirf integration tests likhti hai, unhe fast feedback nahi milta (integration tests slow hain — DB/network involved), aur specific business-logic edge cases (jaise 'agar discount negative ho to kya ho') ko isolate karke test karna mushkil ho jaata hai jab poori pipeline involve ho. Test pyramid guidance yahi hai — bahut saare fast unit tests, kam integration tests jo real wiring verify karein.",
    redFlag: "'Hum sirf integration tests likhte hain, unit tests ki zaroorat nahi' — ye ek warning sign hai ki candidate testing strategy ka trade-off nahi samajhta.",
  },
  {
    id: "integration-testing-waf-tr-8",
    question: "Agar tumhare paas CI environment hai jahan Docker available nahi hai, Testcontainers-based tests ka kya alternative hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "SQLite in-memory mode (behavior real SQL se closer hai InMemory provider se, though still not identical), ya CI environment me Docker enable karwana, ya un specific tests ko separate slower CI stage me rakhna.",
    detailedAnswer:
      "Agar Docker genuinely unavailable hai, SQLite ka in-memory connection mode ek middle-ground option hai — ye EF Core InMemory provider se zyada real SQL-jaisa hai (actual SQL engine hai) lekin fir bhi SQL Server/Postgres-specific features match nahi karega. Better long-term fix: CI runner me Docker support enable karwana, kyunki Testcontainers approach ka poora fayda tabhi milta hai jab target production database engine hi test me use ho.",
  },
];

export default questions;
