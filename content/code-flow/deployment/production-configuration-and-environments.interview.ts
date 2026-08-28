import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "prodcfg-1",
    question:
      "Production me configuration kaise manage karte ho, aur secrets kahan rakhte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Non-secret environment differences appsettings.{Environment}.json me (commit OK). Secrets — connection string, keys — kabhi committed file me nahi; environment variables ya ek secrets manager (Key Vault / AWS Secrets Manager) se, jo ek config provider ke roop me add hota hai.",
    detailedAnswer:
      "Do buckets hain. Non-secret, environment-specific values — log level, feature flag, external API ka base URL — appsettings.Production.json me jaati hain, jise commit karna theek hai. Secret values — SQL password, JWT signing key, KYC provider key, Redis endpoint — kisi bhi committed file me nahi, chahe base appsettings.json ho ya gitignored file. Ye deploy environment se aati hain: environment variables (`ConnectionStrings__Default`, double underscore nested key ke liye) ya ek secrets manager jise `builder.Configuration.AddAzureKeyVault(...)` jaise config provider ke roop me add karte hain — wo bhi bas precedence chain me ek aur layer hai. `ASPNETCORE_ENVIRONMENT` decide karta hai kaunsi env file load ho. Aur main har required settings class pe `AddOptions<T>().Bind(section).ValidateDataAnnotations().ValidateOnStart()` lagata hoon taaki missing setting boot pe crash kare.",
    followUp:
      "Environment variable me nested key kaise likhte ho, jaise ConnectionStrings:Default?",
    redFlag:
      "'appsettings.Production.json me password daal do, wo to sirf prod me load hoti hai' — wo file bhi commit hoti hai, secret git history me leak ho jaata hai.",
  },
  {
    id: "prodcfg-2",
    question:
      "Default config providers ka precedence order kya hai, aur nested key env var me kaise likhte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "appsettings.json -> appsettings.{Env}.json -> User Secrets (sirf Development) -> environment variables -> command-line args. Baad wala jeetta hai. Nested key env var me double underscore `__` se: `ConnectionStrings__Default`.",
    detailedAnswer:
      "`WebApplication.CreateBuilder(args)` ye sources is order me add karta hai aur sab ek flat IConfiguration me merge hote hain. Jo provider baad me add hua uski value same key ke liye jeetti hai, isliye command line sabse strong hai aur containers/App Service me prod config environment variables se inject hoti hai. JSON me nested key `ConnectionStrings:Default` hota hai, lekin `:` sab OS shells me valid env var char nahi — isliye .NET `__` (double underscore) ko `:` ki tarah treat karta hai. Single underscore `ConnectionStrings_Default` kaam nahi karega — bind silently fail hoga aur value null aayegi.",
    followUp:
      "Agar same key appsettings.Production.json aur environment variable dono me ho, kaun jeetega?",
    redFlag:
      "'appsettings.json hamesha jeetti hai' ya order ulta batana — config override kabhi debug nahi kiya.",
  },
  {
    id: "prodcfg-3",
    question:
      "`.AddOptions<T>().Bind(section).ValidateDataAnnotations().ValidateOnStart()` me `ValidateOnStart()` exactly kya badalta hai, aur wo production me kyun chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Bina iske validation lazy hoti hai — pehli baar jab `IOptions<T>` resolve hota hai (pehli matching request pe). Iske saath validation boot pe chalti hai: missing/invalid setting = process start hi nahi hoti.",
    detailedAnswer:
      "Default lazy validation ka matlab: galat config ka pata deploy ke ghanton baad, pehli request pe 500 ke roop me chalta hai — deploy 'successful' dikhta hai. `ValidateOnStart()` validation ko startup me force karta hai, to bad config ke saath app boot hi nahi hoti; container crash-loop me jaata hai aur orchestrator naya deploy roll back kar deta hai. Ye BFSI deploys ka desired behaviour hai — broken deploy turant fail ho, silently degrade na kare. Fail fast, fail loud.",
    followUp:
      "Custom validation (jaise 'ExpiryMinutes RefreshDays se kam hona chahiye') kaise add karoge?",
    redFlag:
      "Ye sochna ki `ValidateOnStart` per-request re-validate karta hai ya config ko reload karta hai — wo `IOptionsMonitor` ka kaam hai.",
  },
  {
    id: "prodcfg-4",
    question:
      "Kestrel ek reverse proxy (Nginx / load balancer) ke peeche chal raha hai. App ke logs me client IP proxy ka IP dikh raha hai aur HTTPS redirection loop me ja raha hai. Kya galat hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Forwarded headers process nahi ho rahe. `app.UseForwardedHeaders()` pipeline me sabse pehle chahiye, `X-Forwarded-For` / `X-Forwarded-Proto` ke saath, aur `KnownProxies`/`KnownNetworks` set hone chahiye.",
    detailedAnswer:
      "Proxy TLS terminate karke andar plain HTTP me forward karta hai aur original client IP + scheme `X-Forwarded-For` / `X-Forwarded-Proto` headers me daalta hai. Bina `UseForwardedHeaders` ke `HttpContext.Connection.RemoteIpAddress` proxy ka IP aur `Request.Scheme` `http` dikhta hai — isliye `UseHttpsRedirection` sochta hai request insecure thi aur redirect karta hai, jabki bahar wo pehle se HTTPS thi (loop). Fix: `Configure<ForwardedHeadersOptions>` me `ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto`, `KnownProxies.Add(proxyIp)`, aur `app.UseForwardedHeaders()` ko baaki har middleware se pehle — taaki auth, rate limiting, https redirection sab sahi IP/scheme dekhe.",
    followUp:
      "`KnownProxies` khaali chhod diya ya clear kar diya to security risk kya hai?",
    redFlag:
      "`options.KnownProxies.Clear()` karke 'sabko trust karo' — koi bhi caller `X-Forwarded-For` bhej ke IP spoof kar sakta hai, rate limit aur audit trail bekaar.",
  },
  {
    id: "prodcfg-5",
    question:
      "Framework-dependent vs self-contained vs ReadyToRun / Native AOT publish — trade-offs kya hain aur default kya chunoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Framework-dependent (default): chhota artifact, par host pe .NET 8 runtime chahiye. Self-contained: runtime bundled (~70+ MB), koi runtime dependency nahi, RID mandatory. R2R/AOT: faster cold start, bada/riskier image; AOT reflection-heavy libs tod sakta hai.",
    detailedAnswer:
      "`dotnet publish -c Release` framework-dependent output deta hai — sirf app code + dependency DLLs + deps.json + host executable; target machine pe .NET 8 runtime installed hona chahiye. Chhoti image, runtime alag se patch hota hai, par version mismatch risk. `-r linux-x64 --self-contained true` runtime bundle kar deta hai — no pre-installed runtime, lekin ~70+ MB aur platform-specific. `-p:PublishReadyToRun=true` code ka hissa AOT compile karke cold start tez karta hai (serverless me farq dikhta hai), image thoda bada. `-p:PublishAot=true` poori app native binary — sabse fast start, sabse kam memory, par reflection-heavy code (kuch EF Core scenarios, kuch serializers) break ho sakta hai, isliye Web API me selective. Default: framework-dependent Release publish, runtime Docker image se — sabse simple aur standard.",
    followUp:
      "Docker setup me tum konsa chunoge aur runtime kahan se aayega?",
  },
  {
    id: "prodcfg-6",
    question:
      "Ye scenario: base `appsettings.json` me `\"Jwt:Key\": \"dev-secret\"` chhod diya gaya, aur production me `Jwt__Key` env var set karna bhool gaye. App boot ho gayi. Kya hua aur kaise rokte?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Base file har environment me load hoti hai, to app ko ek value mili — publicly-known dev key — aur wo chup-chaap us key se tokens sign karti rahi. Koi error nahi. `ValidateOnStart` + base file me empty string isse rokta.",
    detailedAnswer:
      "Base `appsettings.json` sabse pehle load hoti hai aur har environment me active rehti hai. Agar usme ek real default secret hai, to missing env var 'no config' error nahi banata — config chain ko value mil jaati hai, bas galat wali. Result: production tokens ek known dev key se sign hote hain, koi forge kar sakta hai. Do fix ek saath: (1) base/prod committed files me secret ki jagah hamesha empty string, taaki missing env var pe value truly missing ho; (2) `AddOptions<JwtOptions>().Bind(...).ValidateDataAnnotations().ValidateOnStart()` with `[Required, MinLength(...)]` — empty key pe app boot pe crash, deploy rollback. Bonus: CI check jo `Key`/`Password`/`Secret` naam wali non-empty keys committed appsettings me detect kare.",
    followUp:
      "Key already commit ho chuki hai — ab kya steps loge?",
    redFlag:
      "'Repo private hai to dev-secret rakhna theek hai' — internal access, forks, history exfiltration sab risk; aur known key production me kabhi acceptable nahi.",
  },
  {
    id: "prodcfg-7",
    question:
      "Production me `dotnet publish` kis configuration me karna chahiye aur kyun? Aur `appsettings.Development.json` publish output me kyun dikhti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`-c Release` — optimizations on, `DEBUG` symbol off, dev-only branches inactive. `appsettings.Development.json` output me copy to hoti hai par production me load nahi hoti kyunki `ASPNETCORE_ENVIRONMENT` `Development` nahi hota.",
    detailedAnswer:
      "`dotnet publish EmployeeManagement.Api -c Release -o out` — Release config JIT optimizations enable karta hai, `#if DEBUG` code hata deta hai, extra diagnostics off. `Debug` build production me bhejna matlab slow code aur dev-only paths live. Output folder me `EmployeeManagement.Api.dll`, saari dependency DLLs, `deps.json`, ek host executable, aur saari `appsettings*.json` files (Development wali bhi) copy hoti hain. Development file harmless hai — config system usse tab hi load karega jab environment naam `Development` ho; production me `ASPNETCORE_ENVIRONMENT=Production`, to wo file ignore hoti hai.",
    followUp:
      "`out/` folder me kaun sa executable app ko host karta hai, aur wo framework-dependent build me kya karta hai?",
  },
];

export default questions;
