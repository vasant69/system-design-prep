import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "perf-1",
    question:
      "Ek API endpoint slow hai — tum step by step kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Pehle measure — load test se p95 baseline. Phir `dotnet-trace` ya Application Insights se sabse bada single contributor dhoondho (DB query, serialization, external call, GC). Ek targeted fix karo, phir dobara load test se confirm. Ek waqt me ek change.",
    detailedAnswer:
      "Process: (1) Load test (k6 / NBomber) se p50/p95/p99 latency aur throughput ka baseline. (2) `dotnet-counters` se live picture (thread-pool queue, GC pauses, requests/sec), phir `dotnet-trace` ka CPU flame-graph ya App Insights ka request trace — kaunsa stage sabse mehnga: middleware, auth, EF query, business logic, ya serialization. (3) Us stage ka lever: EF query hai to `AsNoTracking` + `Select` projection + right index; deep pagination hai to keyset; reference data hai to `IMemoryCache`/Redis; response badi hai to compression + output caching; external call hai to `IHttpClientFactory` + caching. (4) Fix ke baad wahi load test dobara — improvement aur koi regression confirm. (5) Repeat jab tak p95 SLA ke andar na aaye, phir ruk jao. Bina before-number ke koi change merge nahi.",
    followUp: "N+1 query problem kya hai aur tum use kaise pakdoge?",
    redFlag:
      "Turant fixes list karna (`caching laga doonga, index add kardoonga`) bina ye kahe ki pehle measure karke bottleneck confirm karoonga.",
  },
  {
    id: "perf-2",
    question:
      "EF Core read performance ke liye kaunse levers use karte ho?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`AsNoTracking()` reads par, `Include`-everything ki jagah `Select` projection, N+1 fix, `AsSplitQuery()` for multiple collections, `EF.CompileAsyncQuery` for the hottest query, `AddDbContextPool`, aur filter/sort columns par indexes.",
    detailedAnswer:
      "`AsNoTracking()` change-tracking snapshot skip karta hai — read-only endpoints par kam CPU/memory. `Select(e => new Dto(...))` projection SQL ki `SELECT` list chhoti karta hai, payload aur serialization dono saste, aur `JOIN` se N+1 se bachata hai. `AsSplitQuery()` do+ collection `Include` hone par cartesian explosion rokta hai — trade-off multiple round-trips vs ek bloated result. `EF.CompileAsyncQuery` LINQ-to-SQL translation ek baar cache karta hai — micro gain, sirf sabse hot query par. `AddDbContextPool` context allocation overhead bachata hai (query time nahi). Indexes: `Email`, `DepartmentId`, `IsActive`, `DateOfJoining` — jo columns `WHERE`/`ORDER BY` me aate hain. Deep pages ke liye keyset pagination, `Skip().Take()` nahi.",
    followUp: "`AsNoTracking()` kab NAHI use karna chahiye?",
    redFlag:
      "`AsNoTracking()` ko har query par blindly lagana, including update paths — changes silently persist nahi honge.",
  },
  {
    id: "perf-3",
    question:
      "N+1 query problem samjhao aur ek example do humare Employee/Department model se.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek query se N parent rows aate hain, phir har parent ke liye ek extra query chal jaati hai child data ke liye — total 1 + N round-trips. Fix: ek `Select` projection ya `Include` jo single `JOIN` bane.",
    detailedAnswer:
      "Galat code:\n```csharp\nvar employees = await _db.Employees.ToListAsync(ct);\nforeach (var e in employees)\n    e.DepartmentName = (await _db.Departments.FindAsync(e.DepartmentId)).Name;\n```\n100 employees = 101 SQL round-trips, har ek me network latency. Fix:\n```csharp\nvar list = await _db.Employees\n    .AsNoTracking()\n    .Select(e => new EmployeeListItemDto(e.Id, e.FullName, e.Department.Name))\n    .ToListAsync(ct);\n```\nEk query, ek `JOIN`. Pakadne ka tarika: EF Core SQL logging on karo (`optionsBuilder.LogTo(Console.WriteLine)`) aur ek endpoint hit karke gino kitni `SELECT` statements chali. Lazy loading enabled ho to N+1 aksar chup-chaap hota hai — isliye kai teams lazy loading disable rakhti hain.",
    followUp:
      "`Include` aur `Select` projection me se kaunsa prefer karoge ek list endpoint ke liye, aur kyun?",
  },
  {
    id: "perf-4",
    question:
      "Response compression aur output caching ka kya trade-off hai, aur kis endpoint par kaunsa nahi lagaoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Compression: bytes-on-wire roughly 60-80% kam, par CPU cost (Brotli zyada, Gzip fallback). Output caching: DB tak request jaati hi nahi, par sirf anonymous, non-personalized GETs par — warna ek user ka data dusre ko serve ho jaata hai.",
    detailedAnswer:
      "`AddResponseCompression` (Brotli + Gzip, `EnableForHttps = true`) JSON text ko kaafi chhota karta hai — bandwidth-bound clients (mobile) ke liye latency win, CPU thoda zyada. `.NET 8` ka `AddOutputCache` poori response server par cache karta hai; `[OutputCache(Duration = 30)]` ya `.CacheOutput()`. Yeh sirf anonymous, non-personalized GETs par — `GET /api/employees/{id}` jo user ke role ke hisaab se alag data deta hai us par lagaoge to cross-user leak. Authenticated ya per-user responses par `VaryByHeader`/`VaryByValue` ke bina output caching mat lagao. CDN/`Cache-Control` client-side caching ek alag layer hai.",
    followUp:
      "Ek authenticated endpoint jiska data 5 minute tak fresh chalega — use kaise cache karoge safely?",
    redFlag:
      "Har `GET` par output caching enable kar dena, including authenticated per-user endpoints.",
  },
  {
    id: "perf-5",
    question:
      "Ye code load ke niche intermittent failures deta hai — kya galat hai?\n```csharp\npublic async Task<bool> VerifyPanAsync(string pan)\n{\n    using var client = new HttpClient();\n    var res = await client.GetAsync($\"https://pan-api/verify/{pan}\");\n    return res.IsSuccessStatusCode;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Har call par `new HttpClient()` — sockets `TIME_WAIT` me atak jaate hain (socket exhaustion), aur DNS changes pick nahi hote. `IHttpClientFactory` / typed client use karo jo handlers pool karta hai.",
    detailedAnswer:
      "`HttpClient` `IDisposable` hai par ise per-call dispose karna anti-pattern hai: underlying `HttpMessageHandler` aur uska TCP connection dispose ke baad bhi `TIME_WAIT` me kuch der rehta hai. High throughput par outbound port range khatam ho jaati hai — `SocketException` intermittently. Fix: `builder.Services.AddHttpClient<IPanVerificationClient, PanVerificationClient>(c => c.BaseAddress = new Uri(...))`, aur class me constructor se `HttpClient` inject karo. Factory `HttpMessageHandler` instances ko pool karta hai (default ~2 minute lifetime) aur DNS rotation handle karta hai. Ek static `HttpClient` bhi socket exhaustion fix karta hai par DNS staleness reh jaati hai.",
    followUp: "Static `HttpClient` vs `IHttpClientFactory` — factory kya extra deta hai?",
    redFlag:
      "`using var client = new HttpClient()` ko sahi bata dena kyunki `HttpClient` `IDisposable` hai.",
  },
  {
    id: "perf-6",
    question:
      "BenchmarkDotNet aur load testing (k6 / NBomber) me kya farak hai? Kaunsa kab?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "BenchmarkDotNet ek chhote method ke implementations ka precise micro-comparison deta hai (mean, allocations) — in-process, single-threaded focus. Load testing poore deployed endpoint par realistic concurrent traffic daal kar p50/p95/p99 aur throughput naapta hai.",
    detailedAnswer:
      "BenchmarkDotNet: `[Benchmark]` methods, warmup + multiple iterations, statistically rigorous — `manual mapping vs AutoMapper`, `string concat vs StringBuilder`, `Newtonsoft vs System.Text.Json` jaise micro decisions ke liye. Ye system-level bottleneck (DB, network, GC under concurrency) nahi dikhata. Load testing (NBomber C# me test project ke andar, k6 alag JS-scripted tool): N concurrent virtual users, ramp-up, sustained load — batata hai endpoint 50 users par theek par 500 par p99 5s ho jaata hai. Tuning workflow me: load test se bottleneck-level baseline aur final validation; BenchmarkDotNet se ek specific hot method ke do versions choose karna. Dono complementary hain.",
    followUp:
      "Load test ka p95 dekhna zaroori kyun hai, average latency kyun nahi?",
  },
  {
    id: "perf-7",
    question:
      "Interviewer: `premature optimization is the root of all evil` — is context me tumhara practical rule kya hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Bina measurement ke optimize mat karo. Readable, correct code pehle likho; jab load test / trace ek real bottleneck dikhaye tabhi us specific jagah tune karo, aur before/after naapo.",
    detailedAnswer:
      "Practical rule: (1) Default code readable aur straightforward rakho — `Select` projection aur `AsNoTracking` jaise cheap, low-risk habits theek hain, par custom object pools, `Span<T>` micro-tricks, aggressive caching tab tak nahi jab tak profiler na bole. (2) Har perf change ka ek before-number ho (p95, allocations, query time) aur ek after-number — agar fark naap nahi sakte to improvement claim mat karo. (3) Sabse bade contributor par kaam karo, chhote par nahi — 900ms serialization ko 200ms karna 5ms method ko 2ms karne se zyada value. (4) Ek waqt me ek change taaki attribution clear rahe. Trap answer ye hai ki `hamesha fastest code likho` — woh complexity aur bugs deta hai bina measurable gain ke.",
    followUp:
      "Kaunse optimizations `by default` theek hain bina profiling ke (low risk, known win)?",
    redFlag:
      "`Main hamesha har method ko maximally optimize karta hoon` — ye maintainability aur measurement dono ignore karta hai.",
  },
];

export default questions;
