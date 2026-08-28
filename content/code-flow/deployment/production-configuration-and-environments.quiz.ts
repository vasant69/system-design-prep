import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "production-configuration-and-environments-1",
    question:
      "Production me connection string aur JWT signing key kahan rakhni chahiye?",
    options: [
      "appsettings.Production.json me, kyunki wo file production me hi load hoti hai",
      "Base appsettings.json me ek default value ke saath taaki app kabhi crash na ho",
      "Environment variables ya ek secrets manager (Key Vault / AWS Secrets) me — kisi bhi committed file me nahi",
      "launchSettings.json me, kyunki wo deploy nahi hoti",
    ],
    correctIndex: 2,
    explanation:
      "Secrets deployment environment se aate hain — env vars ya secrets manager, jo ek config provider ke roop me add hota hai. Option A galat: `appsettings.Production.json` commit hoti hai, isliye secret git history me leak ho jaayega. Option B galat aur khatarnak: base file har environment me load hoti hai, prod env var bhool jaao to app dev secret ke saath chup-chaap chalti rahegi. Option D galat: `launchSettings.json` sirf local dev ke liye hai aur production me exist hi nahi karti.",
    difficulty: "easy",
  },
  {
    id: "production-configuration-and-environments-2",
    question:
      "`.AddOptions<T>().Bind(section).ValidateDataAnnotations().ValidateOnStart()` me `ValidateOnStart()` kya badalta hai?",
    options: [
      "Validation ko async bana deta hai",
      "Validation boot pe chalti hai — missing/invalid setting par app start hi nahi hoti, pehli request ka wait nahi",
      "Config ko har request pe re-validate karta hai",
      "appsettings.json ko read-only lock kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina `ValidateOnStart()` ke validation tab hoti hai jab pehli baar `IOptions<T>` resolve hota hai (pehli request pe). Iske saath validation startup pe hoti hai — galat config = process boot pe exit = deploy fail hota hai aur rollback trigger hota hai, na ki live traffic pe 500s. Option A galat: validation sync hi rehti hai. Option C galat: `IOptionsMonitor` reload karta hai, `ValidateOnStart` nahi — aur ye per-request nahi. Option D galat: file lock ka isse koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "production-configuration-and-environments-3",
    question:
      "Kestrel ek reverse proxy (Nginx / load balancer) ke peeche chal raha hai. `app.UseForwardedHeaders()` ke saath `KnownProxies` set na karne ka risk kya hai?",
    options: [
      "App bilkul start nahi hogi",
      "HTTPS redirection permanently disable ho jaata hai",
      "Koi bhi client apna X-Forwarded-For header bhej ke apna client IP spoof kar sakta hai — rate limiting aur audit trail bekaar",
      "Swagger production me expose ho jaata hai",
    ],
    correctIndex: 2,
    explanation:
      "`KnownProxies`/`KnownNetworks` batata hai kaunse upstream IP ko trust karke unke forwarded headers accept karne hain. Set na karo (ya clear kar do) to middleware kisi bhi source ka `X-Forwarded-For` maan lega, jisse client IP spoofable ho jaata hai. Option A galat: app start hoti hai, bas headers galat trust hote hain. Option B galat: forwarded headers ke bina scheme `http` dikh sakta hai, lekin redirection disable nahi hota. Option D galat: Swagger ka gate `IsDevelopment()` check hai, forwarded headers nahi.",
    difficulty: "medium",
  },
  {
    id: "production-configuration-and-environments-4",
    question:
      "`dotnet publish -c Release -o out` ke framework-dependent (default) aur `--self-contained true` output me sabse bada practical farq kya hai?",
    options: [
      "Self-contained output me source code (.cs files) bhi hoti hain",
      "Framework-dependent output ko target machine pe .NET 8 runtime installed chahiye; self-contained runtime ko bundle karta hai (~70+ MB bada) aur koi pre-installed runtime nahi chahiye",
      "Framework-dependent hamesha Debug build hoti hai",
      "Self-contained output cross-platform ek hi folder se chalti hai bina runtime identifier ke",
    ],
    correctIndex: 1,
    explanation:
      "Framework-dependent = chhota output, par host pe .NET 8 runtime hona chahiye. Self-contained = runtime bundled, artifact bada (~70+ MB), koi runtime dependency nahi, lekin ek runtime identifier (`-r linux-x64`) chahiye hota hai. Option A galat: dono me compiled DLLs jaati hain, source nahi. Option C galat: `-c Release` dono ke liye Release build deta hai. Option D galat: self-contained platform-specific hoti hai, RID mandatory hai.",
    difficulty: "easy",
  },
];

export default quiz;
