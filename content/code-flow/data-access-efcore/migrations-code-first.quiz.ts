import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "migrations-code-first-1",
    question:
      "`dotnet ef database update` do baar chala diya bina koi nayi migration add kiye. Doosri baar kya hota hai?",
    options: [
      "Saari tables drop ho ke dobara ban jaati hain",
      "Kuch nahi — `__EFMigrationsHistory` me sab already recorded hai, koi pending migration nahi",
      "Error: 'database already up to date' aur command exit code 1 deta hai",
      "Aakhri migration ka `Up()` dobara chal jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`database update` DB ke `__EFMigrationsHistory` table ko dekh kar decide karta hai kaunsi migrations apply ho chuki hain, aur sirf pending wali chalata hai. Sab already applied hain to ye ek no-op hai (idempotent) — isi wajah se ise pipeline me safely re-run kiya ja sakta hai. Option A/D galat: applied migration ka `Up()` dobara nahi chalta. Option C galat: exit code 0 hi aata hai, koi error nahi.",
    difficulty: "easy",
  },
  {
    id: "migrations-code-first-2",
    question:
      "Tumne `AddLastWorkingDate` migration `dotnet ef database update` se apply kar di. Ab tumhe wo migration hatani hai. Sahi tareeka kaunsa hai?",
    options: [
      "Seedha `Migrations/` folder se `.cs` file delete kar do aur `AppDbContextModelSnapshot.cs` bhi",
      "`dotnet ef migrations remove` chala do — wo DB aur files dono clean kar dega",
      "Pehle `dotnet ef database update <PreviousMigration>` se rollback karo, phir `dotnet ef migrations remove`",
      "`dotnet ef database drop` karo aur poora DB dobara banao",
    ],
    correctIndex: 2,
    explanation:
      "`migrations remove` sirf tab safe hai jab migration abhi DB pe apply nahi hui. Apply ho chuki hai to pehle `database update <previous>` se uska `Down()` chala kar rollback karo, tab `migrations remove` files hata dega aur snapshot ko pichhli state me le aayega. Option A snapshot ko de-sync kar deta hai — agli migration ka diff galat niklega. Option B apply hui migration pe chalane par error ya inconsistent state deta hai. Option D poora data uda deta hai — production me kabhi nahi.",
    difficulty: "medium",
  },
  {
    id: "migrations-code-first-3",
    question:
      "`AppDbContextModelSnapshot.cs` ka kaam kya hai aur ise haath se edit karna kyun mana hai?",
    options: [
      "Ye har applied migration ki list rakhta hai; edit karoge to history corrupt ho jayegi",
      "Ye poore model ka current expected picture hai — agli `migrations add` ka diff isi se nikalta hai; hand-edit karoge to diff galat banega",
      "Ye connection string aur provider config rakhta hai; edit karoge to DB connect nahi hoga",
      "Ye sirf ek backup file hai, iska koi active role nahi",
    ],
    correctIndex: 1,
    explanation:
      "Snapshot EF ka 'pehle model kaisa tha' ka record hai. `migrations add` naya model banata hai, use snapshot se compare karta hai, aur farak ko `Up()`/`Down()` me likh deta hai. Snapshot galat hua to diff galat — missing ya extra operations. Applied migrations ki list DB ke `__EFMigrationsHistory` me hoti hai, snapshot me nahi (option A). Provider/connection config `Program.cs` / `appsettings.json` me hai (option C).",
    difficulty: "medium",
  },
  {
    id: "migrations-code-first-4",
    question:
      "Production me EF Core migrations apply karne ka BFSI-safe tareeka kaunsa hai, jahan app service account ke paas sirf `db_datareader` + `db_datawriter` hai?",
    options: [
      "`Program.cs` me `db.Database.Migrate()` startup pe — har instance apne aap schema sync kar lega",
      "App me ek admin endpoint banao jo `Migrate()` call kare, release ke baad hit karo",
      "`dotnet ef migrations script --idempotent` se SQL generate karo, DBA review karke maintenance window me chalaye",
      "Har developer apni machine se production pe `dotnet ef database update` chala de",
    ],
    correctIndex: 2,
    explanation:
      "App ke paas DDL (schema-change) permission nahi hai aur security policy yahi chahti hai, isliye idempotent SQL script generate karke DBA ke through chalana standard hai — script kisi bhi migration state pe safe hai kyunki har statement `__EFMigrationsHistory` check karta hai. Option A multi-instance deploy me race/lock deta hai aur app ko DDL rights chahiye. Option B wahi problem, plus ek khatarnak endpoint. Option D auditable nahi aur galat process.",
    difficulty: "medium",
  },
];

export default quiz;
