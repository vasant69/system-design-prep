import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cpws-1",
    question: "Ek ASP.NET Core Web API project ke main files/folders walk-through karo — kaunsi file kya karti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`.csproj` = SDK + target framework + NuGet packages. `Program.cs` = startup (services + middleware pipeline). `appsettings.json` = config. `Properties/launchSettings.json` = local-dev launch profiles. `Controllers/` = API endpoints.",
    detailedAnswer:
      "`.csproj` batati hai project ka type (`Microsoft.NET.Sdk.Web`), `<TargetFramework>` (jaise `net8.0`), aur `<PackageReference>` NuGet dependencies. `Program.cs` app ka entry point hai — do halves: `app.Build()` se pehle `builder.Services.Add...` DI registration, uske baad `app.Use.../app.Map...` middleware pipeline. `appsettings.json` base configuration hai, `appsettings.Development.json` environment-specific override. `Properties/launchSettings.json` sirf local dev tooling ke liye — port, launch URL, aur `ASPNETCORE_ENVIRONMENT` set karti hai, deploy nahi hoti. `Controllers/` folder me actual endpoints classes hoti hain jo `ControllerBase` se inherit karti hain.",
    followUp: "In dono halves ko `app.Build()` kyun divide karta hai — pehle services register kyun, phir pipeline?",
  },
  {
    id: "cpws-2",
    question: "`dotnet new webapi` ke saath `--use-controllers` flag kyun lagate ho? Na lagao to kya hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      ".NET 8 me `dotnet new webapi` ka default Minimal API hai. `--use-controllers` controller-based template deta hai, jisme `Controllers/` folder hota hai.",
    detailedAnswer:
      ".NET 6/7 tak `dotnet new webapi` controller-based project deta tha. .NET 8 me default badal ke Minimal API ho gaya — endpoints seedhe `Program.cs` me `app.MapGet(...)` se define hote hain, koi `Controllers/` folder nahi. Jobs me abhi bhi controller-based zyada common hai (attribute routing, filters, model binding conventions), isliye course me hamesha `--use-controllers`. Galti se bina flag ke bana liya to sabse saaf raasta project delete karke dobara scaffold karna hai — Minimal se controllers me manually convert karna beginner ke liye confusing hai.",
    followUp: "Minimal API aur controller-based API me actual runtime difference kya hai, ya sirf code style ka farak hai?",
    redFlag: "'Dono bilkul same hain, koi farak nahi' — routing model, filter pipeline aur convention-based binding me genuine differences hain.",
  },
  {
    id: "cpws-3",
    question: "`.csproj` me `<Nullable>enable</Nullable>` aur `<ImplicitUsings>enable</ImplicitUsings>` kya karte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`Nullable` nullable reference types on karta hai — compiler warn karta hai jab `null` ho sakne wali cheez bina check kiye use ho. `ImplicitUsings` common `using` statements har file me auto-available karta hai.",
    detailedAnswer:
      "`<Nullable>enable</Nullable>` se `string` aur `string?` ka farak enforce hota hai — agar tum ek possibly-null reference ko dereference karo bina null-check ke, compiler `CS8602` jaisa warning deta hai. Isse `NullReferenceException` production bugs kaafi kam hote hain. `<ImplicitUsings>enable</ImplicitUsings>` project-wide ek set of global `using`s add karta hai (`System`, `System.Linq`, `System.Collections.Generic`, `Microsoft.AspNetCore.Builder`, etc.) — isliye chhoti files me tum `using` lines nahi dekhte. Dono modern .NET templates me by default on hote hain.",
    followUp: "Agar ek legacy project pe `<Nullable>enable</Nullable>` on karo to hazaaron warnings aayenge — production me kaise incrementally adopt karoge?",
  },
  {
    id: "cpws-4",
    question:
      "Ek developer bolta hai 'local pe Swagger UI nahi khul raha' — `dotnet run` chalta hai, koi exception nahi. Kya check karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`ASPNETCORE_ENVIRONMENT` check karo. Template me `app.UseSwagger()` / `app.UseSwaggerUI()` `if (app.Environment.IsDevelopment())` ke andar hote hain — environment `Development` nahi hai to Swagger register hi nahi hoga.",
    detailedAnswer:
      "Default template Swagger ko sirf Development me expose karta hai. Agar `Properties/launchSettings.json` me active profile ka `ASPNETCORE_ENVIRONMENT` galti se `Production` ho, ya OS-level env variable override kar raha ho, to `IsDevelopment()` false ho jaata hai aur `/swagger` 404 deta hai — bina kisi error ke. Fix: launch profile me `\"ASPNETCORE_ENVIRONMENT\": \"Development\"` set karo, ya `dotnet run --environment Development`. Ye ek classic 'aadha din waste' bug hai kyunki koi exception signal nahi milta.",
    followUp: "Kya Swagger ko Production me expose karna chahiye? Kab haan, kab na?",
    redFlag: "Seedha `if (app.Environment.IsDevelopment())` hata dena taaki 'kaam kar jaaye' — root cause (galat environment) fix kiye bina.",
  },
  {
    id: "cpws-5",
    question: "`.sln` file aur `.csproj` file me kya difference hai? Web API run karne ke liye `.sln` zaroori hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`.csproj` ek actual project define karti hai (code, framework, packages). `.sln` sirf ek container hai jo ek ya zyada projects ko group karta hai — mainly IDE convenience. Run ke liye `.sln` zaroori nahi.",
    detailedAnswer:
      "`dotnet run` / `dotnet build` ek `.csproj` pe kaam karta hai — wahi build unit hai. `.sln` (solution) ek plain-text list hai jo batati hai kaunse projects ek saath belong karte hain (jaise `EmployeeManagement.Api` + `EmployeeManagement.Tests`). Visual Studio aur Rider solution-centric hain, isliye team projects me `.sln` rakhna standard hai, lekin ek single-project API bina `.sln` ke bhi chal jaati hai. Course me humne `dotnet new sln` isliye kiya taaki baad me test project add kar sakein.",
  },
  {
    id: "cpws-6",
    question:
      "Ye `Program.cs` compile aur run hoga?\n```csharp\nvar builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddControllers();\nvar app = builder.Build();\napp.MapControllers();\nbuilder.Services.AddSwaggerGen();\napp.Run();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile ho jaayega, lekin `builder.Services.AddSwaggerGen()` ka koi asar nahi — wo `app.Build()` ke baad call hui hai, jab service collection already freeze ho chuki hai (naye .NET me exception bhi aa sakta hai).",
    detailedAnswer:
      "`builder.Build()` service collection ka snapshot le kar ek immutable `ServiceProvider` bana deta hai. Uske baad `builder.Services` me kuch add karna ya to silently ignore hota hai ya (recent .NET versions me) `InvalidOperationException: Cannot modify ServiceCollection after the application is built` throw karta hai. Rule: saari `builder.Services.Add...` calls `app.Build()` se pehle, saari `app.Use.../app.Map...` uske baad. Yahan Swagger registration line ko `Build()` ke upar move karna chahiye.",
    redFlag: "'Order se koi farak nahi padta, DI to runtime pe resolve hota hai' — build ke baad service collection sealed ho jaati hai.",
  },
  {
    id: "cpws-7",
    question:
      "`Program.cs` me middleware ka order kyun matter karta hai? Ek galat-order example do jo silently toot jaaye.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Middleware pipeline har request pe registration order me upar se neeche chalti hai. `app.UseAuthorization()` ko `app.MapControllers()` ke baad rakh dena — authorization endpoint execute hone ke baad chalega, matlab effectively skip.",
    detailedAnswer:
      "Har `app.Use...` call pipeline me ek step add karta hai; request upar se neeche flow karti hai, response neeche se upar. Isliye jo cheez request ko gate karti hai (HTTPS redirect, authentication, authorization) usko endpoint (`MapControllers`) se pehle aana chahiye. Agar `UseAuthorization()` `MapControllers()` ke baad likha ho, to controller action pehle hi run ho jaayega aur `[Authorize]` enforce hi nahi hoga — koi error nahi, bas security hole. Doosra classic: `UseCors()` ko `UseAuthorization()` ke baad rakhna, jisse pre-flight requests fail hoti hain.",
    followUp: "`UseRouting()` aur `UseEndpoints()` / `MapControllers()` ke beech authentication/authorization kyun aana chahiye — internally kya hota hai?",
  },
  {
    id: "cpws-8",
    question: "Sample `WeatherForecastController.cs` aur `WeatherForecast.cs` ka kya karna chahiye, aur kab?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Dono sirf template ka demo code hain. Apna pehla real controller likhne se pehle (module 2 se pehle) dono delete kar do.",
    detailedAnswer:
      "Template ye do files isliye deta hai taaki `dotnet run` ke turant baad Swagger me ek working endpoint dikhe — ye ek smoke test hai. Real project me inka koi role nahi. Inhe rakhne se: (1) Swagger me ek fake endpoint clutter karta hai, (2) naye team members confuse hote hain ki `WeatherForecast` domain ka hissa hai. `EmployeesController` likhne se pehle `Controllers/WeatherForecastController.cs` aur `WeatherForecast.cs` dono `rm`/delete kar do.",
  },
];

export default questions;
