import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "web-api-project-anatomy-1",
    question: ".NET 6 ke minimal hosting model me Startup.cs ka functionality kahan gaya?",
    options: [
      "Poori tarah hata diya gaya, aur uski koi zaroorat nahi rahi",
      "Program.cs me merge ho gaya — ConfigureServices ka kaam builder.Services banta hai, Configure ka kaam app.Use...() calls",
      "Ek naya file StartupConfig.cs me move ho gaya",
      "wwwroot folder me configuration JSON ke roop me chala gaya",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — Startup.cs delete nahi hua, uska kaam Program.cs ke andar merge ho gaya: ConfigureServices ka equivalent builder.Services hai, Configure ka equivalent app.Use...() middleware calls hain. Option 1 galat hai kyunki functionality still zaroori hai, bas jagah badli. Option 3 aur 4 fictional locations hain, .NET me aise koi convention nahi hai.",
    difficulty: "easy",
  },
  {
    id: "web-api-project-anatomy-2",
    question: "builder.Build() call hone ke baad, agar tum ek naya service builder.Services.AddScoped se register karne ki koshish karo to kya hota hai?",
    options: [
      "Bina kisi issue ke register ho jaata hai, WebApplicationBuilder hamesha open rehta hai",
      "Yeh galat pattern hai — Build() ke baad DI container frozen ho jaata hai, sab registrations Build() se pehle honi chahiye",
      "App automatically restart hokar naya service pick kar leta hai",
      "Sirf Development environment me allowed hai, Production me disallowed",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — builder.Build() ke baad container frozen ho jaata hai, standard flow me is point ke baad services register karna galat pattern hai; sab AddXxx() calls Build() se pehle honi chahiye. Option 1, 3, aur 4 sab incorrect behavior describe karte hain jo ASP.NET Core me exist nahi karta.",
    difficulty: "medium",
  },
  {
    id: "web-api-project-anatomy-3",
    question: "appsettings.json aur appsettings.Development.json dono me ek hi configuration key different values ke saath hai, aur ASPNETCORE_ENVIRONMENT=Development set hai. Kaunsi value effective hogi?",
    options: [
      "appsettings.json ki value, kyunki wo base file hai",
      "appsettings.Development.json ki value, kyunki environment-specific file baad me load hoti hai aur per-key override karti hai",
      "Dono values merge hoke ek array ban jaayenge",
      "Undefined behavior — app crash ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — configuration providers layered order me load hote hain, aur appsettings.{Environment}.json baad me load hokar us specific key ko override kar deta hai (per-key merge, poori file replace nahi). Option 1 configuration precedence order ko ulta samajh raha hai. Option 3 aur 4 ASP.NET Core configuration system ka actual behavior nahi hain.",
    difficulty: "medium",
  },
  {
    id: "web-api-project-anatomy-4",
    question: "ASPNETCORE_ENVIRONMENT environment variable set nahi hai. Application kaunse environment me chalega by default?",
    options: [
      "Development",
      "Staging",
      "Production",
      "App start hi nahi hoga bina environment set kiye",
    ],
    correctIndex: 2,
    explanation:
      "Sahi jawab option 3 (Production) hai — ASPNETCORE_ENVIRONMENT unset hone pe ASP.NET Core default 'Production' treat karta hai, jo kabhi kabhi local testing me confusion create karta hai jab log ho ki Development-only features (jaise detailed error pages) kaam kyun nahi kar rahe. Option 1 aur 2 galat environments hain, option 4 galat hai kyunki app bina explicit environment set kiye bhi normally start ho jaata hai.",
    difficulty: "easy",
  },
];

export default quiz;
