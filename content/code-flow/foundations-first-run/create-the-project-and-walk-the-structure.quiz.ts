import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "create-the-project-and-walk-the-structure-1",
    question:
      ".NET 8 me `dotnet new webapi -n EmployeeManagement.Api` bina `--use-controllers` chalane par kya milta hai?",
    options: [
      "Ek `Controllers/` folder ke saath controller-based API",
      "Minimal API project — sab endpoints `Program.cs` me, koi `Controllers/` folder nahi",
      "Build error, kyunki template ko flag chahiye hi chahiye",
      "Ek Razor Pages web app",
    ],
    correctIndex: 1,
    explanation:
      "'.NET 8 me `dotnet new webapi` ka default Minimal API hai — endpoints seedhe `Program.cs` me map hote hain. Is course ke liye controller-based chahiye, isliye `--use-controllers` zaroori hai. Option A tab sahi hota jab flag lagaya ho. Option C galat — flag ke bina bhi project banta hai, bas Minimal style me. Option D galat — `webapi` template kabhi Razor Pages nahi deta, wo `webapp`/`razor` hai.",
    difficulty: "easy",
  },
  {
    id: "create-the-project-and-walk-the-structure-2",
    question:
      "`Program.cs` me `var app = builder.Build();` line kya divide karti hai?",
    options: [
      "Compile-time code aur runtime code",
      "Upar service registration (DI container) — neeche middleware pipeline",
      "Development config aur Production config",
      "Synchronous code aur async code",
    ],
    correctIndex: 1,
    explanation:
      "`app.Build()` ke pehle `builder.Services.Add...` se services DI container me register hoti hain; uske baad `app.Use.../app.Map...` se middleware pipeline banti hai jo har request pe upar se neeche chalti hai. Option A galat — dono halves runtime pe hi chalte hain. Option C galat — environment-based config `appsettings.{Environment}.json` merge se aati hai, `Build()` se nahi. Option D galat — `Build()` ka async/sync se koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "create-the-project-and-walk-the-structure-3",
    question:
      "`Properties/launchSettings.json` ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye production server pe deploy hoti hai aur wahan port set karti hai",
      "Ye sirf local development ke liye hai, deploy nahi hoti — port, launch URL aur `ASPNETCORE_ENVIRONMENT` set karti hai",
      "Ye `appsettings.json` ko replace kar deti hai jab present ho",
      "Isme connection strings aur API keys rakhna best practice hai",
    ],
    correctIndex: 1,
    explanation:
      "`launchSettings.json` sirf local dev tooling (`dotnet run`, Visual Studio) padhti hai — production deploy me ye jaati hi nahi. Ye `applicationUrl` (port), `launchUrl` (jaise `swagger`), aur `ASPNETCORE_ENVIRONMENT` set karti hai. Option A galat — deploy nahi hoti. Option C galat — ye configuration merge me part hi nahi, `appsettings` ko replace nahi karti. Option D galat — secrets kabhi yahan nahi (file aksar git me commit ho jaati hai); user-secrets ya environment variables use karo.",
    difficulty: "medium",
  },
  {
    id: "create-the-project-and-walk-the-structure-4",
    question:
      "`appsettings.Development.json` aur `appsettings.json` ka rishta kya hai?",
    options: [
      "Development file base file ko poori tarah replace kar deti hai jab environment Development ho",
      "Development file base `appsettings.json` ke upar merge hoti hai — sirf overridden keys likhni hoti hain, aur wo tabhi load hoti hai jab `ASPNETCORE_ENVIRONMENT=Development`",
      "Dono hamesha load hoti hain aur base file jeetti hai",
      "Development file sirf tab kaam karti hai jab tum `dotnet run --config Development` do",
    ],
    correctIndex: 1,
    explanation:
      "Configuration system pehle `appsettings.json` load karta hai, phir uske upar `appsettings.{Environment}.json` merge karta hai — jo keys environment file me hain wo jeetti hain, baaki base se aati hain. Isliye sirf overrides likho, poori file dobara mat likho. Option A galat — merge hota hai, replace nahi. Option C galat — environment file jeetti hai, base nahi. Option D galat — environment name `ASPNETCORE_ENVIRONMENT` variable se aata hai (launchSettings ya OS env), aisa koi `--config` flag nahi.",
    difficulty: "hard",
  },
];

export default quiz;
