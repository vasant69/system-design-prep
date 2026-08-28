import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mig-iq-1",
    question: "EF Core migrations kya hain? Code-first aur database-first me farak samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Migrations code-first workflow hai schema evolve karne ka — C# entities source of truth, `migrations add` model ka diff nikaal ke versioned migration banata hai, `database update` use DB pe apply karta hai. Database-first me DB pehle banta hai aur C# usse scaffold hota hai.",
    detailedAnswer:
      "Code-first me tum entity classes aur `DbContext` config likhte ho; wahi schema ka source of truth hai. `dotnet ef migrations add <Name>` current model ko pichhle `ModelSnapshot` se compare karke ek timestamped C# class banata hai jisme `Up()` (aage ka change) aur `Down()` (ulta) hota hai, plus snapshot update. `dotnet ef database update` pending migrations ko order me apply karta hai aur har ek ka id `__EFMigrationsHistory` table me likh deta hai — isi wajah se re-run idempotent hai. Database-first me DBA SQL me schema banata hai aur `dotnet ef dbcontext scaffold` usse entity classes generate karta hai — legacy DB ya jahan DB team schema own karti hai wahan. Naye greenfield projects me code-first default hai kyunki schema git me version-controlled rehta hai aur change code review me hi dikh jaata hai.",
    followUp: "Ek team already 200 tables wale legacy SQL Server pe kaam kar rahi hai — tum code-first choose karoge ya database-first?",
    redFlag: "Ye kehna ki migrations sirf `Update-Database` GUI button hai, ya ki code-first matlab EF khud production DB alter karta hai deploy pe.",
  },
  {
    id: "mig-iq-2",
    question: "`__EFMigrationsHistory` table kya hai aur ye kyun zaroori hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "DB me EF ki apni chhoti table jo har applied migration ka id (+ EF version) rakhti hai. Isi se `database update` decide karta hai kya pending hai.",
    detailedAnswer:
      "Jab tum `database update` chalao, EF pehle `__EFMigrationsHistory` padhta hai — usme jitni migration ids hain wo apply ho chuki, baaki pending. Pending wali order me chalti hain aur har ek ke baad uska id is table me insert hota hai. Isi mechanism se: re-run no-op hota hai, ek naya environment ek command se sync hota hai, aur `--idempotent` SQL script kisi bhi state wale DB pe safely chal jaati hai (har statement pehle history check karta hai). Table sirf ek `MigrationId` column aur ek `ProductVersion` column rakhti hai.",
    followUp: "Agar koi galti se `__EFMigrationsHistory` se ek row delete kar de to kya hoga?",
  },
  {
    id: "mig-iq-3",
    question:
      "Applied migration ko production me rollback kaise karoge? `Down()` method ka role kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`dotnet ef database update <PreviousMigration>` — ye beech ki migrations ke `Down()` methods reverse order me chalata hai. `Down()` `Up()` ka exact ulta hona chahiye.",
    detailedAnswer:
      "Rollback target ek pehli migration ka naam hota hai: `dotnet ef database update AddDepartment` schema ko us point tak wapas le aata hai, uske baad wali saari migrations ka `Down()` ulte order me chal jaata hai. Poora empty tak jaana ho to `dotnet ef database update 0`. Catch: `Down()` aksar auto-generated hota hai aur untested — agar `Up()` ne column drop kiya tha to `Down()` `AddColumn` karega par purana data wapas nahi aayega. Isliye production me destructive migrations ke liye alag data-migration plan chahiye, sirf `Down()` pe bharosa nahi. BFSI me rollback aksar forward-fix migration se karte hain (nayi migration jo galti theek kare) taaki audit trail linear rahe.",
    followUp: "Ek migration ne `DropColumn(Salary)` kiya aur deploy ho gaya. `Down()` chalane se `Salary` data wapas aayega?",
    redFlag: "Ye maan lena ki `database update <previous>` hamesha data-safe hai aur `Down()` har cheez perfectly reverse kar deta hai.",
  },
  {
    id: "mig-iq-4",
    question:
      "Ye migration review me aayi. Kya problem hai?\n```csharp\nprotected override void Up(MigrationBuilder migrationBuilder)\n{\n    migrationBuilder.DropColumn(name: \"MiddleName\", table: \"Employees\");\n    migrationBuilder.AddColumn<string>(name: \"MiddleName\", table: \"Employees\", nullable: true);\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "EF ne ek column rename ko drop+add likh diya hai — poore `MiddleName` column ka data silently chala jayega. Rename ke liye `RenameColumn` chahiye tha.",
    detailedAnswer:
      "Jab tum entity me property ka naam badalte ho, EF ko sirf itna dikhta hai ki purani property gayab, nayi aa gayi — wo `DropColumn` + `AddColumn` generate kar deta hai, `RenameColumn` nahi. Deploy hote hi `MiddleName` column drop hoke naya khaali column ban jayega — sab data gaya, aur `Down()` bhi wapas nahi la sakta. Fix: migration file me haath se `migrationBuilder.RenameColumn(name: \"MiddleName\", table: \"Employees\", newName: \"MiddleNames\")` likho, ya migration remove karke property rename ko EF ko `RenameColumn` hint ke saath dobara generate karwao. Yahi wajah hai ki har generated `Up()`/`Down()` commit se pehle padhna zaroori hai.",
    followUp: "EF ko kaise pata chale ki ye rename hai, drop+add nahi?",
    redFlag: "Migration ko bina padhe 'EF ne banaya hai to sahi hi hoga' bol ke approve kar dena.",
  },
  {
    id: "mig-iq-5",
    question:
      "`db.Database.Migrate()` ko `Program.cs` me startup pe rakhna — kab theek hai, kab nahi?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Local dev aur single-instance chhote apps ke liye theek. Multi-instance production deploy me nahi — do instances ek saath migrate karenge, race ya lock timeout, deploy fail. Plus app ko DDL rights chahiye.",
    detailedAnswer:
      "Startup migration sabse aasan hai: app chalte hi pending migrations lag jaati hain. Problem tab hai jab Kubernetes/ECS rolling deploy me 4 replicas ek saath boot hote hain — chaaron `Migrate()` call karte hain, ek `__EFMigrationsHistory` pe lock leta hai, baaki timeout pe crash karte hain, orchestrator restart-loop me daal deta hai. Doosra, app service account ke paas production DB pe DDL permission chahiye, jo BFSI security policy allow nahi karti. Sahi approach: production me deploy se pehle ek dedicated pipeline stage `dotnet ef database update` ya generated idempotent SQL script ek baar chalata hai, phir app replicas deploy hote hain. Local pe `if (app.Environment.IsDevelopment()) db.Database.Migrate();` theek hai.",
    followUp: "Pipeline stage bhi to DB access maangega — wo startup migration se behtar kaise hua?",
    redFlag: "Ye kehna ki `Migrate()` on startup 'best practice' hai kyunki 'zero manual step'.",
  },
  {
    id: "mig-iq-6",
    question:
      "Do developers ne alag-alag branches me migration add ki. Merge ke baad kya problem aati hai aur kaise resolve karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Dono ne `AppDbContextModelSnapshot.cs` change kiya — merge conflict. Resolve: ek branch ki migration `migrations remove` karo, doosri merge karo, phir apni migration dobara generate karo taaki wo latest snapshot ke upar bane.",
    detailedAnswer:
      "Snapshot poore model ka single file picture hai — do parallel migrations dono usme edit karti hain, to `git merge` pe conflict. Blindly conflict resolve karna galat snapshot deta hai. Sahi tareeka: (1) apni local migration ko `dotnet ef migrations remove` se hatao (agar apply nahi hui), (2) doosre dev ki migration + snapshot merge le lo, (3) `dotnet ef migrations add <YourChange>` dobara chalao — ab ye current snapshot ke upar clean diff banayegi aur ordering timestamp se sahi rahegi. Team practice: migration-heavy PRs ko jaldi merge karo, aur ek 'migration lock' convention rakho (ek time pe ek hi open migration PR).",
    followUp: "Agar dono migrations already alag environments pe apply ho chuki hain to?",
    redFlag: "Snapshot conflict ko manually text-merge karke aage badh jaana bina migration regenerate kiye.",
  },
  {
    id: "mig-iq-7",
    question:
      "`dotnet ef migrations script --idempotent` ka output normal `dotnet ef migrations script` se kaise alag hai, aur BFSI release me isse kyun prefer karte hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Idempotent script har migration ke around ek `IF NOT EXISTS (SELECT ... FROM __EFMigrationsHistory ...)` guard lagata hai, isliye wo kisi bhi migration state wale DB pe safely chal sakta hai. Plain script maanta hai DB ek exact known state me hai.",
    detailedAnswer:
      "Plain script sirf `Up()` statements ko seedha SQL me likh deta hai — agar target DB pehle se kuch migrations pe hai to wo statements fail karenge (table already exists, etc.). `--idempotent` har migration block ko `IF NOT EXISTS (SELECT 1 FROM __EFMigrationsHistory WHERE MigrationId = N'...')` me wrap karta hai aur end me history row insert karta hai. Result: ek hi script UAT, staging, prod — sab pe chal jaati hai chahe unki current migration state alag ho. BFSI me DBA ko ek reviewable artifact chahiye jo change-ticket me attach ho, aur jo kisi bhi environment pe deterministic ho — idempotent script exactly wahi deta hai. `--from <A> --to <B>` se ek specific range ka script bhi bana sakte ho.",
    followUp: "Idempotent script me ek migration ne raw `Sql(\"UPDATE ...\")` kiya tha — wo bhi guard hota hai kya?",
  },
  {
    id: "mig-iq-8",
    question:
      "Ek nayi non-nullable column `Employee` me add karni hai jisme har existing row ke liye value chahiye. Migration kaise likhoge bina deploy tootne diye?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Do tarike: column ko `defaultValue` ke saath add karo (`AddColumn` me `defaultValue:`), ya pehle nullable add karo + ek data-backfill `Sql(\"UPDATE ...\")` + phir ek doosri migration me `AlterColumn` non-nullable. Seedha non-nullable bina default add karna existing rows pe fail karta hai.",
    detailedAnswer:
      "SQL Server ek `NOT NULL` column bina default value ke tab hi add karne deta hai jab table khaali ho. Options: (1) `migrationBuilder.AddColumn<int>(name: \"Grade\", table: \"Employees\", nullable: false, defaultValue: 1)` — sabhi purani rows ko `1` mil jayega, phir chaho to baad me default hata do. (2) Backward-compatible teen-step (expand/contract): pehli migration column nullable add kare, ek `Sql(\"UPDATE Employees SET Grade = ...\")` se realistic values backfill kare, aur ek follow-up migration `AlterColumn` se `nullable: false` kare — tab tak naya code jo column likhta hai wo deploy ho chuka ho. BFSI large tables me step-2 approach lock/downtime kam rakhta hai. Kabhi bhi seedha `nullable: false` bina default aur bina backfill ke deploy mat karo — production pe migration fail, deploy stuck.",
    followUp: "Table me 5 crore rows hain — ek `UPDATE` se backfill karna theek hai ya batch me?",
    redFlag: "Ye kehna ki EF apne aap existing rows ke liye 'kuch reasonable' value bhar deta hai.",
  },
];

export default questions;
