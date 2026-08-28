import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "logging-ilogger-and-serilog-1",
    question:
      "In dono me se kaunsa structured logging correctly karta hai aur PII leak nahi karta?",
    options: [
      "`_logger.LogInformation($\"Employee {employee.Pan} created\")`",
      "`_logger.LogInformation(\"Employee {EmployeeId} created in department {DepartmentId}\", id, deptId)`",
      "`_logger.LogInformation(\"Employee \" + employee.Pan + \" created\")`",
      "`_logger.LogInformation(string.Format(\"Employee {0} created\", employee.Pan))`",
    ],
    correctIndex: 1,
    explanation:
      "Option 2 ek message template hai: `{EmployeeId}` aur `{DepartmentId}` named holes ban jaate hain jinpe Seq/Elasticsearch me filter/search hota hai, aur level filter fail hone par string allocate hi nahi hoti. Option 1, 3, 4 sab pehle se poori string bana dete hain — koi queryable field nahi, aur teeno me PAN (PII) log line me chala jaata hai jo compliance violation hai.",
    difficulty: "easy",
  },
  {
    id: "logging-ilogger-and-serilog-2",
    question:
      "`appsettings.json` me `Logging:LogLevel` ke andar ye keys hain: `Default: Information`, `Microsoft.AspNetCore: Warning`, `EmployeeManagement.Api.Controllers.EmployeesController: Debug`. `EmployeesController` se `_logger.LogDebug(...)` call hoti hai — kya wo likhi jaayegi?",
    options: [
      "Nahi — `Default` `Information` hai to `Debug` har jagah filter ho jaata hai",
      "Haan — longest matching category prefix jeetta hai, aur us controller ke liye minimum level `Debug` set hai",
      "Sirf tab jab `ASPNETCORE_ENVIRONMENT` `Development` ho",
      "Haan, lekin sirf `Debug` provider par, `Console` par nahi",
    ],
    correctIndex: 1,
    explanation:
      "Category filtering longest-prefix-match par kaam karti hai. `EmployeesController` ki full category `EmployeeManagement.Api.Controllers.EmployeesController` is exact key se match hoti hai (jo `Default` se lamba/specific hai), to uske liye minimum level `Debug` ho jaata hai aur `LogDebug` pass hota hai. Baaki categories `Default` `Information` par hi rehti hain. Environment ya provider se koi seedha lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "logging-ilogger-and-serilog-3",
    question:
      "`WebApplication.CreateBuilder(args)` by default kaunse logging providers add karta hai?",
    options: [
      "Console, Debug, EventSource — koi file, database ya central server sink nahi",
      "Console aur ek rolling File sink `logs/` folder me",
      "Sirf Console",
      "Console, File, aur Seq",
    ],
    correctIndex: 0,
    explanation:
      "Out of the box sirf teen providers milte hain: Console (stdout, jo Docker/Kubernetes capture karte hain), Debug (IDE Output window), aur EventSource (`dotnet-trace`/ETW). Koi file, DB ya searchable dashboard nahi — yahi gap hai jiski wajah se production me Serilog (rolling File + Seq/Elasticsearch) plug kiya jaata hai. File/Seq default me nahi aate.",
    difficulty: "easy",
  },
  {
    id: "logging-ilogger-and-serilog-4",
    question:
      "Serilog packages add kiye, `Log.Logger = new LoggerConfiguration()...CreateLogger()` bhi set kiya, par `builder.Host.UseSerilog(...)` call karna bhool gaye. Natija?",
    options: [
      "App start pe crash — Serilog aur default logging conflict karte hain",
      "`ILogger<T>` abhi bhi default providers (Console/Debug/EventSource) par jaata hai; naye sinks (File, Seq) ko kuch nahi milta",
      "Sab kuch normal — `Log.Logger` set karna hi kaafi hai",
      "Sirf `Log.Information(...)` static calls kaam karti hain, `ILogger<T>` bilkul band ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`builder.Host.UseSerilog(...)` hi wo line hai jo poore app ke logging providers ko Serilog se replace karti hai — iske bina DI se inject hone wala `ILogger<T>` framework ke default providers par hi likhta rehta hai, aur tumhare configure kiye File/Seq sinks ko koi event nahi milta. Crash nahi hota (option 1 galat), aur `ILogger<T>` band nahi hota (option 4 galat) — bas galat jagah likhta hai.",
    difficulty: "hard",
  },
];

export default quiz;
