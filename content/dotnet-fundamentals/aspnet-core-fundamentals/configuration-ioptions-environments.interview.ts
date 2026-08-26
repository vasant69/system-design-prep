import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "config-ioptions-tr-1",
    question: "ASP.NET Core configuration providers ka precedence order kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys"],
    shortAnswer:
      "appsettings.json -> appsettings.{Environment}.json -> User Secrets (dev only) -> environment variables -> command-line args, jahan baad wala pehle wale ko override karta hai.",
    detailedAnswer:
      "WebApplication.CreateBuilder() ye chain default me register karta hai. Har provider apni values set karta hai IConfiguration ke andar, aur agar same key multiple providers me exist karti hai, sabse baad me register hua provider jeetta hai. Isliye command-line args sabse high precedence rakhte hain, base appsettings.json sabse low.",
    followUp: "Agar tumhe deployment-time pe kisi ek value ko bina code change kiye override karna ho, kaunsa provider use karoge aur kyun?",
  },
  {
    id: "config-ioptions-tr-2",
    question: "IOptions<T>, IOptionsSnapshot<T>, aur IOptionsMonitor<T> me exact difference batao.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Accenture"],
    shortAnswer: "Lifetime aur reload behavior alag hai — IOptions Singleton/no-reload, IOptionsSnapshot Scoped/per-request reload, IOptionsMonitor Singleton/live-reload.",
    detailedAnswer:
      "IOptions<T> Singleton hai aur config sirf ek baar, app startup pe bind hoti hai — kabhi refresh nahi hoti chahe underlying source change ho jaaye. IOptionsSnapshot<T> Scoped hai — har naya HTTP request scope create hone par fresh recompute hoti hai agar source change hua ho. IOptionsMonitor<T> Singleton hai lekin `.CurrentValue` property hamesha latest value reflect karti hai, plus `.OnChange(callback)` se explicit change-notification subscribe kar sakte ho — isliye Singleton services ke andar bhi live config chahiye to yahi use hota hai.",
  },
  {
    id: "config-ioptions-tr-3",
    question: "ASPNETCORE_ENVIRONMENT variable ka role kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Ye decide karta hai kaunsi appsettings.{Environment}.json file load hogi, aur IWebHostEnvironment.IsDevelopment()/IsProduction() jaise checks ko drive karta hai.",
    detailedAnswer:
      "Convention teen standard values hain — Development, Staging, Production — lekin ye sirf strings hain, custom naam bhi ho sakta hai. Local dev me launchSettings.json isse set karta hai; deployed environment me actual OS/container env var. Iske base pe framework decide karta hai kaunsi appsettings.{Environment}.json merge karni hai, aur app code me app.Environment.IsDevelopment() jaise checks isi variable pe based hote hain — jaise Development me detailed exception page dikhana, Production me generic error page.",
  },
  {
    id: "config-ioptions-tr-4",
    question: "Ye code snippet me kya problem hai?\n```csharp\nbuilder.Services.AddSingleton<EmailService>();\n// EmailService constructor me IOptionsSnapshot<SmtpSettings> inject kiya gaya hai\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Captive dependency — Scoped IOptionsSnapshot ko Singleton service me inject karna DI validation error dega.",
    detailedAnswer:
      "IOptionsSnapshot<T> Scoped lifetime hai, jabki EmailService Singleton hai. Singleton services poori app lifetime ke liye ek hi baar create hote hain, jabki Scoped dependencies har request ke saath naya banna chahiye. Ye mismatch — Singleton apne andar ek Scoped dependency 'capture' kar leta hai jo kabhi refresh nahi hogi, ulta expected behavior ka — .NET's built-in scope validation (Development environment me default enabled) startup pe hi exception throw kar deta hai. Fix: EmailService me IOptionsMonitor<SmtpSettings> use karo instead (jo Singleton-compatible hai aur live-update bhi deta hai), ya EmailService khud Scoped bana do.",
  },
  {
    id: "config-ioptions-tr-5",
    question: "Production me database connection string kahan store karoge, aur kyun appsettings.json me nahi?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Environment variable ya ek secret manager (Azure Key Vault, AWS Secrets Manager) me — appsettings.json repo me commit hoti hai, secrets leak ho sakte hain.",
    detailedAnswer:
      "appsettings.json source control me commit hoti hai — koi bhi jisko repo access hai wo secrets dekh sakta hai, plus git history me bhi rehte hain even agar baad me remove kiya jaaye. Production secrets deployment pipeline ke through environment variables (ya cloud secret manager, jo runtime pe fetch hota hai) se inject hone chahiye — code kabhi actual secret value repo me carry nahi karta. Local development ke liye dotnet user-secrets tool use hota hai, jo values ko user profile directory me (repo ke bahar) store karta hai.",
  },
  {
    id: "config-ioptions-tr-6",
    question: "Kya ye statement sahi hai: 'IOptionsMonitor hamesha IOptions se better hai, isliye hamesha IOptionsMonitor use karna chahiye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — jab config genuinely kabhi change nahi hogi (ya app restart ke saath hi update hona acceptable hai), IOptions simpler aur sufficient hai.",
    detailedAnswer:
      "IOptionsMonitor extra API surface (OnChange callback, live CurrentValue tracking) add karta hai jo har scenario me zaroori nahi. Agar config values genuinely static hain runtime ke dauran (jaise app-wide constants jo sirf deployment ke time set hote hain), IOptions<T> simpler hai aur intent ko zyada clearly communicate karta hai — 'ye value change nahi hogi.' Har jagah IOptionsMonitor use karna unnecessary complexity hai jab actual requirement sirf startup-time binding ho.",
    redFlag: "Blanket statement dena ki ek variant 'hamesha better' hai bina use-case-specific trade-off samjhe — ye shows candidate ne sirf feature list yaad kiya hai, actual reasoning nahi.",
  },
  {
    id: "config-ioptions-tr-7",
    question: "Configuration binding ke liye POCO class ka use karna raw IConfiguration[\"key\"] string access se better kyun hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Type safety aur compile-time errors — string-key typo silently null deta hai, POCO binding se refactoring-safe aur testable code milta hai.",
    detailedAnswer:
      "IConfiguration['Smtp:Host'] jaisa string-based access me typo (jaise 'Smtp:Hots') compile time pe pakda hi nahi jaata — runtime pe silently null ya default value mil jaata hai. Services.Configure<SmtpSettings>(section) se ek strongly-typed POCO class me bind karne par, wrong property naam compile error deta hai, IDE autocomplete milta hai, aur unit testing me fake SmtpSettings object directly pass kiya ja sakta hai bina IConfiguration mock kiye.",
  },
  {
    id: "config-ioptions-tr-8",
    question: "reloadOnChange parameter ka role kya hai JSON configuration provider me?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "File-system watcher enable karta hai — bina isi ke, IOptionsSnapshot/IOptionsMonitor bhi file edits pick up nahi karenge.",
    detailedAnswer:
      "AddJsonFile('appsettings.json', optional: true, reloadOnChange: true) — reloadOnChange true hone par framework file ko watch karta hai aur change hone par IConfiguration ko refresh karta hai. WebApplication.CreateBuilder() default appsettings.json ke liye ye already true set karta hai, lekin agar tum manually koi extra JSON config file add karo (AddJsonFile call), reloadOnChange explicitly set karna padta hai — warna wo file kabhi live-reload nahi hogi, chahe IOptionsMonitor use kar rahe ho.",
  },
];

export default questions;
