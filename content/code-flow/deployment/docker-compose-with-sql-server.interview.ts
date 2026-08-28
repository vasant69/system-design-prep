import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "compose-1",
    question:
      "Apni .NET API aur SQL Server ko local pe ek saath kaise chalate ho? docker-compose.yml walk-through do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Do services: `api` (`build: .` se Dockerfile) aur `db` (`mcr.microsoft.com/mssql/server:2022-latest` with `ACCEPT_EULA=Y`, `MSSQL_SA_PASSWORD`). `db` pe sqlcmd healthcheck, `api` me `depends_on: db: condition: service_healthy`. Connection string `Server=db,1433` (compose network DNS). Named volume `/var/opt/mssql` par data persistence.",
    detailedAnswer:
      "`services:` block me `db`: image `mssql/server:2022-latest`, `environment` me `ACCEPT_EULA` set to `Y` plus `MSSQL_SA_PASSWORD`, `volumes: - mssql-data:/var/opt/mssql` (named volume, data survives restarts), aur ek `healthcheck` jo `sqlcmd` se ek trivial `SELECT 1` (with `-b`) chalata hai `interval: 10s` / `start_period: 30s` ke saath. `api`: `build: .`, `depends_on: db: condition: service_healthy` (API tabhi start jab DB genuinely ready), `environment` me `ConnectionStrings__Default=Server=db,1433;Database=EmployeeDb;...` — `db` service name compose ke default bridge network par DNS se resolve hota hai. Top-level `volumes: mssql-data:` block volume ko declare karta hai. `docker compose up --build` sab uthata hai, `down` band karta hai, `down -v` DB volume bhi delete karta hai.",
    followUp:
      "Host port publish line (`1433` to `1433`) hata do to kya toot-ta hai aur kya nahi?",
    redFlag:
      "Connection string me `Server=localhost` — container ke andar localhost matlab wahi container, DB nahi.",
  },
  {
    id: "compose-2",
    question:
      "`depends_on: [db]` kaafi kyun nahi hai? `condition: service_healthy` exactly kya add karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Plain `depends_on` sirf start-order deta hai — `db` container start ho chuka, bas. SQL Server phir bhi 20-40s warm-up leta hai. `condition: service_healthy` API ko tab tak start nahi karne deta jab tak `db` ka healthcheck pass na ho.",
    detailedAnswer:
      "Container 'started' hone aur andar ka process 'ready' hone me farak hai. `db` pe ek healthcheck (`sqlcmd` with `-S localhost -U sa -P ... -C` running `SELECT 1` and `-b`) har `interval` par chalta hai; jab tak wo non-zero return karta hai service `starting` hai, phir `healthy`. `api` me `depends_on: db: condition: service_healthy` compose ko batata hai ki `db` ke `healthy` hone tak `api` create/start hi na kare. Iske bina API boot par EF Core `SqlException: connection refused` de kar crash karti hai, aur CI me pehla integration test flaky fail hota hai. `start_period: 30s` warm-up ke fail count ignore karta hai.",
    followUp:
      "Healthcheck command me `-C` flag kyun chahiye 2022 image me?",
    redFlag:
      "'App me bas ek Thread.Sleep(30000) daal do boot se pehle' — brittle, timing pe depend karta hai.",
  },
  {
    id: "compose-3",
    question:
      "Compose me database ke liye named volume kyun define karte ho? Bina uske kya hota hai?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "SQL Server apna data `/var/opt/mssql` me rakhta hai. Named volume us path ko ek Docker-managed volume pe map karta hai, to container recreate/delete hone par bhi data bacha rehta hai. Bina volume ke har `down` ya recreate = poora database gaya.",
    detailedAnswer:
      "`volumes: - mssql-data:/var/opt/mssql` (service level) + `volumes: mssql-data:` (top level). Container ka apna writable layer ephemeral hota hai — container hataao to gaya. `.mdf`/`.ldf` files, system databases, migrations, seed data sab `/var/opt/mssql` me hote hain. Named volume unhe container lifecycle se decouple karta hai. `docker compose down` volume rakhta hai (data bacha), `down -v` use bhi delete karta hai (fresh start). Developer local pe `down` (bina `-v`) karke seed data bachaa sakta hai; CI hamesha `-v` deta hai deterministic runs ke liye.",
    followUp:
      "Bind mount (`./data:/var/opt/mssql`) vs named volume — SQL Server ke liye kaunsa aur kyun?",
  },
  {
    id: "compose-4",
    question:
      "EF Core migrations ko container database pe apply karne ke kaunse tareeke hain aur kaunsa kab?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Teen: (1) startup migrator — `db.Database.MigrateAsync()` on boot, `IsDevelopment()` guard ke saath, local ke liye. (2) migration bundle — `dotnet ef migrations bundle` se executable, pipeline ka alag step, staging/prod. (3) init container — API se pehle chalta hai, migrate karta hai, exit. Prod = bundle ya init container.",
    detailedAnswer:
      "Startup migrator: `Program.cs` me `if (app.Environment.IsDevelopment()) { using var scope = ...; await db.Database.MigrateAsync(); }`. Pros: zero tooling, compose up ke baad DB current. Cons prod me: do replicas boot par race karte hain (migration history lock), app ko DDL permission chahiye (least-privilege violation), slow migration se health probe fail -> restart -> crash loop. Migration bundle: `dotnet ef migrations bundle --project Infrastructure --startup-project Api` ek self-contained exe deta hai; deploy pipeline ise ek baar chalata hai ek alag `migrator` SQL login se jiske paas hi DDL hai, app runtime login ke paas sirf DML. Init container / compose `migrator` service: `api` `depends_on: migrator: condition: service_completed_successfully`. Rule: dev me guarded startup migrator, prod me bundle (Kubernetes ho to init container).",
    followUp:
      "Zero-downtime deploy me migration aur naya code ka order kya hona chahiye (expand/contract)?",
    redFlag:
      "Production API replicas ke startup pe bina guard `MigrateAsync()` chalana — replica race aur schema-owner permission dono red flags.",
  },
  {
    id: "compose-5",
    question:
      "`ACCEPT_EULA` aur `MSSQL_SA_PASSWORD` set nahi kiye ya password weak diya — kya symptom dikhega aur kaise debug karoge?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`db` container chup-chaap exit ho jaata hai (Exited status). `api` `service_healthy` ka wait karti reh jaati hai aur kabhi start nahi hoti. `docker compose logs db` me `You must accept the EULA` ya `Password validation failed` clearly dikhta hai.",
    detailedAnswer:
      "SQL Server image boot par EULA acceptance aur password policy (min 8 chars, upper + lower + digit/symbol me se 3) enforce karta hai. Fail hone par process turant exit karta hai, restart policy na ho to container `Exited (1)`. Debugging: `docker compose ps` (db `Exit 1` dikhega), phir `docker compose logs db` — pehli 20 lines me exact reason. Common galti: `ACCEPT_EULA` ki value ko YAML me bina quotes chhodna (kuch parsers use boolean bana dete hain — ise quoted string rakho), ya `Password123` jaisa password jo policy pass nahi karta.",
    followUp:
      "`MSSQL_PID` kya karta hai aur `Developer` vs `Express` me kya farak hai?",
    redFlag:
      "'Container start nahi hua, shayad Docker ka bug hai' — logs check kiye bina guess karna.",
  },
  {
    id: "compose-6",
    question:
      "Compose file me `$${MSSQL_SA_PASSWORD}` me double dollar kyun hai? Single dollar likhne se kya hota?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compose khud `$VAR` / `${VAR}` ko apni variable substitution (build-time, host `.env` se) samajhta hai. `$$` ek literal `$` ban kar container ke andar jaata hai taaki wahan ki shell environment variable expand kare. Single `$` likha to Compose use host pe resolve karne ki koshish karega — aksar khaali string.",
    detailedAnswer:
      "Healthcheck ka `CMD-SHELL` command container ke andar `/bin/sh -c` se chalta hai, aur `MSSQL_SA_PASSWORD` container ke environment me hai, host pe nahi. Agar hum single-dollar `$MSSQL_SA_PASSWORD` likhein, Compose parse time pe apni substitution rules lagata hai: agar host env / `.env` me wo key nahi mili to warning ke saath empty string. Double-dollar `$$` Compose ke escape mechanism se ek literal `$` produce karta hai, jo phir container ki shell dekh kar sahi value bharti hai. Ye ek aam gotcha hai jab command me runtime env var chahiye.",
    followUp:
      "Agar password me hi special characters (`$`, `!`) hon to connection string / compose me kaise handle karoge?",
  },
  {
    id: "compose-7",
    question:
      "Compose local dev ke liye badhiya hai — production orchestration ke liye kyun nahi? Aur production database kahan rakhoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Compose single-host tool hai — no rolling update, no autoscale, no multi-node scheduling, `depends_on`/healthcheck ek machine tak seemit. Production DB ko kabhi ephemeral compose service mat banao — managed SQL (Azure SQL, RDS) ya properly backed-up dedicated instance.",
    detailedAnswer:
      "Compose ka scope: ek Docker host pe kuch containers ko wire karna. Production me chahiye rolling / blue-green deploys, health-based traffic shifting, horizontal autoscale, node failure pe reschedule, secret management — ye Kubernetes / ECS-Fargate / Azure Container Apps dete hain, Compose nahi. Database ke liye to aur bhi: compose `db` service ka data ek local volume par hai, koi automated backup / PITR / HA / patching nahi. Production me app container orchestrator me, database ek managed service (Azure SQL Database, Amazon RDS for SQL Server) ya ek dedicated managed instance. Compose ka `db` sirf dev aur integration-test convenience hai.",
    followUp:
      "Compose se Kubernetes manifests generate karne ke liye kya use hota hai, aur wo production-ready kyun nahi hota?",
    redFlag:
      "'Compose file ko `docker compose` ke bajaye seedha prod server pe chala denge' — no zero-downtime, no scaling, DB data at risk.",
  },
];

export default questions;
