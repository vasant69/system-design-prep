import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "program-cs-line-by-line-1",
    question: "`Program.cs` me `var app = builder.Build();` line ke baad kya karna INVALID hai?",
    options: [
      "`app.UseHttpsRedirection()` call karna",
      "`app.MapControllers()` call karna",
      "`builder.Services.AddScoped<IEmployeeService, EmployeeService>()` call karna",
      "`app.Run()` call karna",
    ],
    correctIndex: 2,
    explanation:
      "`builder.Build()` service collection ko seal kar deta hai — uske baad `builder.Services` me register karna recent .NET me `InvalidOperationException: Cannot modify ServiceCollection after the application is built` deta hai. Options A, B, D sab `app` object pe hain (middleware/pipeline aur server start) — ye sahi jagah `Build()` ke baad hi hain.",
    difficulty: "easy",
  },
  {
    id: "program-cs-line-by-line-2",
    question:
      "Ye order kis problem ko janm deta hai?\n```csharp\napp.UseHttpsRedirection();\napp.MapControllers();\napp.UseAuthorization();\n```",
    options: [
      "App start hi nahi hoga — compile error",
      "`[Authorize]` silently skip ho jaayega, kyunki action `UseAuthorization` se pehle hi run ho jaata hai",
      "Har request `500 Internal Server Error` degi",
      "Swagger UI load nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "Middleware registration order me top-to-bottom chalta hai. `MapControllers()` pehle aane se matched action turant run hoke response bana deta hai — `UseAuthorization()` ka number aata hi nahi, isliye `[Authorize]` enforce nahi hota. Koi error nahi aata (isliye A aur C galat) — bas ek silent security hole. Swagger se iska koi lena-dena nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "program-cs-line-by-line-3",
    question: "`app.Run()` (bina delegate ke) kya karta hai?",
    options: [
      "App ko ek baar chala ke turant band kar deta hai",
      "Ek inline terminal middleware register karta hai jo har request handle karta hai",
      "Kestrel server start karta hai aur current thread ko block kar deta hai jab tak shutdown signal (Ctrl+C) na aaye",
      "Sirf DI container build karta hai, server start nahi karta",
    ],
    correctIndex: 2,
    explanation:
      "Bina-delegate `app.Run()` server start karke thread ko indefinitely block karta hai — isi wajah se uske neeche ka code normally kabhi nahi chalta. Option B alag overload hai — `app.Run(async context => ...)` delegate ke saath ek terminal middleware banata hai, wo yahan nahi. Option D `builder.Build()` ka kaam hai. Option A galat — app band nahi hota, requests sunta rehta hai.",
    difficulty: "medium",
  },
  {
    id: "program-cs-line-by-line-4",
    question:
      "Purane `Startup.cs` model se minimal hosting me aane par kaunsa mapping sahi hai?",
    options: [
      "`ConfigureServices(...)` ka kaam ab `app.Use...` calls karti hain; `Configure(...)` ka kaam `builder.Services.Add...`",
      "`ConfigureServices(...)` ka kaam ab `builder.Services.Add...` calls karti hain; `Configure(...)` ka kaam `app.Use.../app.Map...`",
      "Dono methods ab `builder.Build()` ke andar chali jaati hain automatically",
      "Minimal hosting me DI hoti hi nahi, isliye `ConfigureServices` ka koi equivalent nahi",
    ],
    correctIndex: 1,
    explanation:
      "`Startup.ConfigureServices(IServiceCollection)` = ab `builder.Services.Add...` (DI registration, `app.Build()` se pehle). `Startup.Configure(IApplicationBuilder)` = ab `app.Use.../app.Map...` (middleware pipeline, `app.Build()` ke baad). Option A ulta hai. Option C galat — kuch automatic nahi hota, tum khud likhte ho. Option D galat — DI container minimal hosting me bhi central hai, `builder.Services` uska handle hai.",
    difficulty: "hard",
  },
];

export default quiz;
