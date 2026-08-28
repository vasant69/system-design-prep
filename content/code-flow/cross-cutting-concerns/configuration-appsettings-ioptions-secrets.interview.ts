import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cfg-1",
    question: "ASP.NET Core me default configuration providers kaunse hain aur unka precedence order kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "appsettings.json, phir appsettings.{Environment}.json, phir User Secrets (sirf Development), phir environment variables, phir command-line args. Baad wala pehle wale ko override karta hai.",
    detailedAnswer:
      "WebApplication.CreateBuilder(args) ye providers is order me register karta hai: (1) appsettings.json — base, (2) appsettings.{Environment}.json — environment-specific merge, (3) User Secrets — sirf jab ASPNETCORE_ENVIRONMENT Development ho, (4) environment variables, (5) command-line arguments. Sabhi ek flat IConfiguration me merge hote hain jahan nested JSON `:` se flatten hota hai. Jab same key ek se zyada provider me ho, jo provider baad me add hua uski value jeetti hai — isliye command line sabse strong hai aur environment variables se hi containers/App Service me prod config inject hoti hai.",
    followUp: "Environment variable me nested key kaise likhte ho, jaise Jwt:Key?",
    redFlag: "Ye kehna ki 'appsettings.json hamesha jeetti hai' ya order galat batana — ye batata hai config override kabhi debug nahi kiya.",
  },
  {
    id: "cfg-2",
    question: "IOptions<T>, IOptionsSnapshot<T> aur IOptionsMonitor<T> me kya farq hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "IOptions singleton hai aur ek baar bind hota hai (no reload). IOptionsSnapshot scoped hai aur har request pe re-bind hota hai. IOptionsMonitor singleton hai, CurrentValue se latest deta hai aur OnChange callback bhi.",
    detailedAnswer:
      "Teeno same section ko bind karte hain, farq lifetime aur reload me hai. IOptions<T> — singleton, config change pe update nahi hota, un values ke liye jo kabhi nahi badlengi (issuer, audience). IOptionsSnapshot<T> — scoped, har HTTP request ke shuru me fresh bind, un scoped/transient services ke liye jinhe runtime-changeable config chahiye (feature flags). IOptionsMonitor<T> — singleton-safe, .CurrentValue property har baar latest deta hai, .OnChange(...) se change pe react kar sakte ho. Singleton service me sirf IOptions ya IOptionsMonitor use karo — IOptionsSnapshot nahi.",
    followUp: "IOptionsSnapshot<T> ko singleton service me inject karoge to kya hoga?",
    redFlag: "Teeno ko interchangeable batana, ya ye na jaanna ki IOptionsSnapshot scoped hai.",
  },
  {
    id: "cfg-3",
    question: "Ye code compile aur run hoga? Kya problem hai?\n```csharp\npublic class ReportService // registered as Singleton\n{\n    public ReportService(IOptionsSnapshot<JwtOptions> opts)\n    {\n        Issuer = opts.Value.Issuer;\n    }\n    public string Issuer { get; }\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Compile hoga, lekin app start pe DI validation exception dega — IOptionsSnapshot scoped hai, aur use singleton me inject karna captive dependency hai.",
    detailedAnswer:
      "IOptionsSnapshot<T> DI me scoped registered hota hai. ReportService singleton hai, aur singleton apni dependencies ko lifetime bhar hold karta hai — ek scoped service ko permanently capture karna 'captive dependency' hai. .NET ka default DI container startup pe scope validation karta hai (development me) aur InvalidOperationException throw karta hai: 'Cannot consume scoped service from singleton'. Fix: IOptions<JwtOptions> (agar value stable hai) ya IOptionsMonitor<JwtOptions> (agar reload chahiye) inject karo.",
    followUp: "Agar ReportService ko sach me har baar latest JwtOptions chahiye ho to code kaisa hoga?",
  },
  {
    id: "cfg-4",
    question: "Ek team member JWT signing key ko appsettings.json me daal ke commit karna chahta hai 'kyunki wo bhi to config hai'. Tum kya bologe?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Non-sensitive config appsettings.json me theek hai, lekin secrets nahi — ek baar commit hui to git history me hamesha reh jaati hai. Local pe user-secrets, prod pe env var ya vault.",
    detailedAnswer:
      "Config aur secret alag cheezein hain. Issuer, audience, expiry minutes — ye non-sensitive hai, appsettings.json me theek. Signing key, DB password, API key — ye leak hone pe direct nuksaan karte hain (koi bhi tokens forge kar sakta hai). Ek baar commit hone ke baad key git history se poori tarah nikalna mushkil hai aur usse rotate karna padta hai. Sahi approach: local development me `dotnet user-secrets set` (repo ke bahar user profile me, Development-only), CI/prod me environment variable (`Jwt__Key`) ya Azure Key Vault / AWS Secrets Manager. Bonus: CI me ek check jo `Key`/`Secret`/`Password` naam wali keys appsettings me detect kare.",
    followUp: "Agar key galti se commit ho chuki hai, ab kya steps loge?",
    redFlag: "'Repo private hai to key safe hai' — internal access, forks, aur history exfiltration sab risk hain; private repo secret store nahi hota.",
  },
  {
    id: "cfg-5",
    question: "Options validation kya hai aur .ValidateOnStart() kyun lagate hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Bound options object pe rules enforce karna (DataAnnotations ya custom). .ValidateOnStart() validation ko app boot pe chalata hai, na ki lazily pehli injection pe — fail fast.",
    detailedAnswer:
      "AddOptions<T>().Bind(section).ValidateDataAnnotations() `[Required]`, `[Range]` jaisi annotations ko enforce karta hai. Default me validation lazy hoti hai — jab pehli baar IOptions<T>.Value resolve hota hai. Iska matlab galat config production me pehli matching request pe crash karega, deploy ke ghante baad. .ValidateOnStart() validation ko startup me force karta hai, to bad config ke saath app boot hi nahi hoga — ye BFSI deploys me chahiye behaviour hai, kyunki broken deploy turant rollback ho jaata hai bajaye silently degrade hone ke.",
    followUp: "Custom validation logic (jaise 'ExpiryMinutes AllowedRefreshDays se kam hona chahiye') kaise add karoge?",
  },
  {
    id: "cfg-6",
    question: "appsettings.json aur appsettings.Development.json ke beech kaise decide hota hai kaunsa load hoga, aur ye merge kaise hote hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Dono load hote hain — base pehle, phir environment file uske upar. Kaunsi environment file wo ASPNETCORE_ENVIRONMENT decide karta hai. Merge key-by-key hota hai.",
    detailedAnswer:
      "appsettings.json hamesha load hoti hai. Uske turant baad appsettings.{ASPNETCORE_ENVIRONMENT}.json load hoti hai — local pe launchSettings.json isse Development set karta hai, isliye appsettings.Development.json. Ye files replace nahi karti, merge karti hain: sirf jo keys environment file me hain wo base ki matching keys ko override karti hain, baaki base se aati hain. Isliye environment file me poori config dobara likhne ki zaroorat nahi — sirf jo alag hai.",
    followUp: "Staging environment ke liye kya karna hoga?",
    redFlag: "Ye sochna ki appsettings.Development.json base ko poori tarah replace karti hai.",
  },
  {
    id: "cfg-7",
    question: "Kab raw IConfiguration[\"key\"] use karna theek hai aur kab strongly-typed Options?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Raw access sirf Program.cs bootstrap ke liye (jaise connection string padhna). Baaki har jagah — services, controllers — strongly-typed Options.",
    detailedAnswer:
      "Program.cs me app abhi ban rahi hai, DI ready nahi — wahan `builder.Configuration.GetConnectionString(\"Default\")` ya `builder.Configuration[\"SomeBootstrapFlag\"]` theek hai. Application code me raw access ke problems: har call site pe magic string (typo pe null milta hai, error nahi), koi type conversion nahi (sab string), koi validation nahi, aur unit test me IConfiguration mock karna painful hai. Strongly-typed Options me typed properties, IntelliSense, ValidateOnStart, aur test me `Options.Create(new JwtOptions{...})` — clean. Rule of thumb: agar ek se zyada jagah wahi setting chahiye, ya usme structure hai, Options banao.",
    followUp: "Ek service ko sirf ek int setting chahiye — tab bhi poori Options class banaoge?",
  },
];

export default questions;
