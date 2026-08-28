import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "connstr-1",
    question: "Connection string kahan store karte ho, aur secrets kaise handle karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Config ke `ConnectionStrings` section me — lekin asli credentials nahi. Local pe `dotnet user-secrets`, production me environment variable ya Key Vault.",
    detailedAnswer:
      "`appsettings.json` ke `ConnectionStrings:Default` me ek non-secret default ya placeholder rakhta hoon. Asli credentials wali string local pe `dotnet user-secrets` me jaati hai (repo ke bahar, per-machine, git-ignored by design). Production me `ConnectionStrings__Default` environment variable, ya ek dedicated secret store jaise Azure Key Vault jo config provider ki tarah add hota hai. Code me hamesha `Configuration.GetConnectionString(\"Default\")` — source badalta hai, code nahi.",
    followUp: "appsettings.json git me commit hoti hai — usme kya rakhna safe hai aur kya nahi?",
    redFlag: "\"Main appsettings.json me hi username-password rakhta hoon\" — ye seedha security red flag hai.",
  },
  {
    id: "connstr-2",
    question: "SQL Server connection string ke main parts kaunse hain? `Trusted_Connection=True` ka kya matlab hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`Server=`, `Database=`, authentication (`Trusted_Connection=True` = Windows auth, ya `User Id=`+`Password=` = SQL auth), aur `TrustServerCertificate` local ke liye.",
    detailedAnswer:
      "`Server=` batata hai kaunsa SQL Server instance (`localhost`, `(localdb)\\MSSQLLocalDB`, `tcp:host,1433`). `Database=` kaunsa DB us server pe. `Trusted_Connection=True` (== `Integrated Security=True`) ka matlab Windows Authentication — jo OS user app chala raha hai usi se SQL Server login, koi password string me nahi. Iska alternative SQL Authentication hai: explicit `User Id` aur `Password`, jo docker/Linux/Azure me use hota hai aur jo secret part hai. `TrustServerCertificate=True` local self-signed cert ke liye.",
    followUp: "Windows auth production me kab use karoge aur kab SQL auth?",
  },
  {
    id: "connstr-3",
    question: "ASP.NET Core config sources kis order me merge hote hain? Agar same key appsettings.json aur environment variable dono me ho to kaunsi jeetti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Order: appsettings.json -> appsettings.{Environment}.json -> User Secrets (Dev only) -> environment variables -> command-line args. Baad wala jeetta hai, to env var appsettings.json ko override kar deta hai.",
    detailedAnswer:
      "`WebApplication.CreateBuilder` ye providers is order me register karta hai: `appsettings.json`, phir `appsettings.{ASPNETCORE_ENVIRONMENT}.json`, phir Development me User Secrets, phir environment variables, phir CLI args. Baad wale ka value pehle wale ko override karta hai. To agar `ConnectionStrings:Default` json me bhi hai aur `ConnectionStrings__Default` env var me bhi, effective value env var wali hogi. Isi se ek build sab environments me chalti hai.",
    followUp: "Custom config source (jaise Key Vault) is chain me kahan add karoge aur precedence kaise control karoge?",
  },
  {
    id: "connstr-4",
    question:
      "Ye Program.cs chalega?\n```csharp\nvar cs = builder.Configuration.GetConnectionString(\"Default\");\nbuilder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));\n```\nConfig me `ConnectionStrings` section hai hi nahi.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile hoga aur app start bhi ho jaayega, lekin `cs` null hai — pehli DB operation pe (ya `UseSqlServer` ke andar) exception aayega, message confusing hoga.",
    detailedAnswer:
      "`GetConnectionString` `string?` return karta hai; section missing ho to `null`. `UseSqlServer(null)` kuch versions me turant `ArgumentNullException` deta hai, kuch me lazily first-use pe. Best practice: `?? throw new InvalidOperationException(\"Connection string 'Default' not found.\")` laga do taaki startup pe hi ek clear message mile. Ye 'fail fast on misconfiguration' pattern hai.",
    redFlag: "Ye kehna ki 'null connection string se EF Core apne aap LocalDB use kar lega' — aisa koi fallback hota hi nahi hai.",
  },
  {
    id: "connstr-5",
    question:
      "Production me app 'A network-related or instance-specific error... certificate chain was issued by an authority that is not trusted' de raha hai, local pe bilkul theek chal raha tha. Kya dekhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Local pe `TrustServerCertificate=True` tha jo cert validation skip kar raha tha. Production me proper trusted TLS certificate chahiye, ya server-side cert configuration fix karni hai — production me blindly trust nahi karte.",
    detailedAnswer:
      "Naye `Microsoft.Data.SqlClient` me `Encrypt` default `True` hai. Local pe hum `TrustServerCertificate=True` laga ke self-signed cert accept kar lete hain. Production string me woh flag nahi hona chahiye — iska matlab SQL Server ke paas ek asli CA-issued (ya enterprise-CA-issued) certificate hona chahiye jo app host ko trusted ho. Fix DB/infra side pe: valid cert install karo. Agar internal CA hai to app host ke trust store me CA root add karo. `TrustServerCertificate=True` production me daalna encryption to rakhta hai lekin MITM protection hata deta hai — security review me fail.",
    followUp: "`Encrypt=True` aur `TrustServerCertificate=True` me exact farak kya hai?",
  },
  {
    id: "connstr-6",
    question: "LocalDB, SQL Server Express, aur Docker SQL Server — teeno me kya farak hai aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "LocalDB — Windows dev-only, zero setup, on-demand. Express — real background service, free, ~10 GB limit. Docker — Linux/Mac dev ya CI, `sa` + password se connect.",
    detailedAnswer:
      "LocalDB (`(localdb)\\MSSQLLocalDB`) Visual Studio ke saath aata hai, sirf development ke liye, process on-demand start hota hai — quick prototyping ke liye best, sirf Windows. SQL Server Express ek proper Windows service hai jo hamesha chalti hai, free, per-DB ~10 GB — small production ya team dev server ke liye. Docker image (`mcr.microsoft.com/mssql/server`) cross-platform hai — Mac/Linux devs aur CI pipelines yahi use karte hain, connection `Server=localhost,1433;User Id=sa;Password=...`. Production usually full SQL Server ya managed (Azure SQL / RDS).",
    followUp: "CI pipeline me integration tests ke liye SQL Server kaise spin up karoge?",
  },
  {
    id: "connstr-7",
    question: "Ek dev ne debugging ke liye `logger.LogInformation(\"Connecting with {Cs}\", connectionString)` add kiya. Isme kya problem hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Connection string me password ho sakta hai — woh ab plain-text log files aur log aggregator (Seq, ELK, App Insights) me chala gaya, jahan bahut zyada logon ke paas access hai.",
    detailedAnswer:
      "SQL-auth connection string me `Password=...` hota hai. Use log karna matlab secret ko har log sink me duplicate kar dena — retention ke hisaab se mahino tak. Log aggregators ka access surface DB ke access surface se bada hota hai. Agar connection info log karni hi ho to string parse karke sirf `Server` aur `Database` nikaalo, ya `SqlConnectionStringBuilder` se sensitive keys strip karke log karo. Better: structured logging me sensitive fields ke liye redaction configure karo.",
    redFlag: "\"Log file to sirf server pe hai, koi issue nahi\" — logs ship hote hain, aur internal threat + breach dono me ye exposure hai.",
  },
];

export default questions;
