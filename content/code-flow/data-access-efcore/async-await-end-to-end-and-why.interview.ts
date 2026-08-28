import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "async-iq-1",
    question:
      "Web API me async/await kyun use karte hain? Ye to ek request ko tez nahi karta?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Async ek request ko tez nahi karta — wo I/O wait ke dauraan thread ko thread pool me wapas kar deta hai, jisse same threads se bahut zyada concurrent requests serve hoti hain.",
    detailedAnswer:
      "ASP.NET Core har request ko thread pool se ek thread deta hai. Sync DB call (`_db.Employees.ToList()`) me wo thread 40-50ms tak sirf SQL Server ka jawab wait karta hai — kuch kaam nahi karta, par pool ke liye 'busy' hai. Bahut saari concurrent requests pe pool starve ho jaata hai: threads block, nayi requests queue me, latency spike. `await _db.Employees.ToListAsync()` me jaise hi call I/O wait me jaati hai, thread pool me wapas chala jaata hai aur doosri request serve karta hai; DB ka jawab aane pe koi bhi free thread continuation utha leta hai. Isliye Controller se Service se Repository poora chain `async Task` hota hai.",
    followUp: "Agar async request ko tez nahi karta, to latency kabhi improve hoti hai kya?",
    redFlag:
      "Yeh kehna ki async se query ya CPU kaam tez ho jaata hai, ya ki 'async matlab multithreading'.",
  },
  {
    id: "async-iq-2",
    question:
      "I/O-bound aur CPU-bound kaam me farq kya hai? async/await dono me faydemand hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "I/O-bound = thread kisi external cheez ka wait kar raha (DB, HTTP, file) — yahan async hamesha win. CPU-bound = thread khud calculation kar raha — yahan async se throughput nahi badhta.",
    detailedAnswer:
      "DB call, `HttpClient` call, file read, Redis call — sab I/O-bound. Waiting ke dauraan thread ko chhoda ja sakta hai, isliye `await` faydemand. Image resize, PDF generation, bade loops — CPU-bound. Kaam CPU pe chal hi raha hai, use 'async' karne se kaam kam nahi hota. `Task.Run` sirf request thread se pool thread pe kaam shift karta hai — ek web app me wo bhi ulta ho sakta hai kyunki pool thread hi requests serve karne wale hain. Heavy CPU kaam ko background service ya queue (Hangfire, hosted service) pe daalo, request path pe nahi.",
    followUp: "To ek endpoint jo bada Excel generate karta hai, use kaise design karoge?",
    redFlag: "Har CPU-heavy method ko `Task.Run(...)` me wrap karke 'ab ye async hai' maan lena.",
  },
  {
    id: "async-iq-3",
    question:
      "`_service.GetEmployeeAsync(id).Result` — is line me kya problem hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Sync-over-async: thread block ho jaata hai jabki pura point use free karna tha (starvation), aur kuch contexts me deadlock.",
    detailedAnswer:
      "`.Result`, `.Wait()`, `.GetAwaiter().GetResult()` async Task ko synchronously block karke result nikaalte hain. Do dikkatein: (1) wo thread block rehta hai — agar 200 concurrent requests har ek `.Result` pe ek thread block karein to thread pool starve, health check timeout, pod restart loop; (2) jahan `SynchronizationContext` hota hai (WPF, WinForms, purana ASP.NET) wahan classic deadlock — continuation ko chalane ke liye wahi thread chahiye jo block hai. ASP.NET Core me context nahi hai to deadlock kam hota hai, par blocking wali dikkat poori bani rehti hai. Fix: pura call chain `async Task` banao, ya genuinely sync API use karo.",
    followUp: "ASP.NET Core me `SynchronizationContext` nahi hai — to kya `.Result` yahan safe hai?",
    redFlag: "Yeh kehna ki ASP.NET Core me `.Result` bilkul safe hai kyunki deadlock nahi hota.",
  },
  {
    id: "async-iq-4",
    question:
      "Ye method review me aaya. Kya galat hai?\n```csharp\npublic async void SaveAudit(AuditEntry entry)\n{\n    _db.AuditEntries.Add(entry);\n    await _db.SaveChangesAsync();\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`async void` hai. Koi Task nahi jise await/observe kar sako; isme exception aaya to caller ka try/catch nahi pakadta aur process crash kar sakta hai.",
    detailedAnswer:
      "`async void` sirf UI event handlers ke liye hai. Yahan return type `Task` hona chahiye taaki caller `await SaveAudit(entry)` kar sake, exception observe kar sake, aur completion ka pata ho. `async void` me `SaveChangesAsync` fail hui (DB down, constraint violation) to exception `SynchronizationContext` pe re-throw hota hai — caller ke `try/catch` ke bahar — aur `AppDomain.UnhandledException` ke through process gira sakta hai. Fix: `public async Task SaveAuditAsync(AuditEntry entry)` aur caller me `await`. Bonus: `SaveChangesAsync(ct)` ko `CancellationToken` bhi pass karo.",
    followUp: "`async void` aur `async Task` me exception handling ka farq exactly kya hai?",
  },
  {
    id: "async-iq-5",
    question:
      "Controller action me `CancellationToken` parameter ka kya kaam hai? Use EF calls tak pass na karein to kya hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Client connection tootne (tab band, timeout, gateway 504) pe token trip hota hai. EF ko pass karo to chalti query cancel hoti hai aur thread turant free.",
    detailedAnswer:
      "ASP.NET Core controller action me `CancellationToken` ko model binding se auto-inject karta hai — `HttpContext.RequestAborted` se joda hota hai. Client bhaag gaya to token cancelled ho jaata hai. Agar tum `ToListAsync(ct)` / `SaveChangesAsync(ct)` me `ct` pass karte ho, EF `SqlCommand` ko cancel bhejta hai, `OperationCanceledException` uthti hai, aur wo request DB pe kaam karna band kar deti hai. Pass na karo to: ek slow report query 30s tak chalti rahegi chahe client 5s pehle chala gaya ho — bekaar DB CPU, locks, aur connection pool pressure. Ye BFSI dashboards me common issue hai jahan users bar-bar refresh maarte hain.",
    followUp: "`OperationCanceledException` ko controller me catch karke 200 return kar dein — theek hai?",
    redFlag:
      "Yeh kehna ki `CancellationToken` ke liye manually `HttpContext` se kuch wire karna padta hai, ya ki wo useless hai.",
  },
  {
    id: "async-iq-6",
    question:
      "Application code (controller/service/repository) me `ConfigureAwait(false)` lagane se kya hota hai ASP.NET Core me?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Practically kuch nahi — ASP.NET Core me `SynchronizationContext` hai hi nahi, continuation waise bhi kisi bhi pool thread pe chalta hai.",
    detailedAnswer:
      "Pre-Core ASP.NET me ek `SynchronizationContext` continuation ko wapas original request thread pe force karta tha; `ConfigureAwait(false)` usse bachne ke liye deadlock aur perf overhead kam karta tha. ASP.NET Core me wo context hata diya gaya — continuation seedha thread pool pe schedule hota hai. Isliye app code me `ConfigureAwait(false)` ka koi practical farak nahi, sirf noise hai. Reusable library code (NuGet package) me abhi bhi convention ke taur pe likha jaata hai kyunki library ko nahi pata usse kaun, kaunse context me call karega.",
    followUp: "To ek shared internal NuGet library likhte waqt kya karoge?",
  },
  {
    id: "async-iq-7",
    question:
      "Ye service method sahi hai?\n```csharp\npublic Task<List<Employee>> GetActiveAsync(CancellationToken ct)\n{\n    return _repo.GetActiveAsync(ct);\n}\n```\nKoi `async`/`await` nahi hai.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Bilkul sahi. Method sirf Task forward kar raha hai, isliye `async`/`await` chodna ek chhota optimisation hai (ek state machine kam).",
    detailedAnswer:
      "Jab method `await` ke baad koi kaam nahi karta — na `try/catch`, na `using`, na result transform — to `return someTask;` likhna theek hai aur thoda efficient bhi (compiler state machine generate nahi karta). Lekin agar aisa hota:\n```csharp\npublic async Task<List<Employee>> GetActiveAsync(CancellationToken ct)\n{\n    using var _ = _metrics.Track(\"get-active\");\n    return await _repo.GetActiveAsync(ct);\n}\n```\ntab `async`/`await` zaroori hai — warna `using` scope Task complete hone se pehle dispose ho jaayega. Ek aur gotcha: `try/catch` ke andar bina `await` ke Task return karoge to exception us catch me kabhi nahi aayegi.",
    followUp: "Ek `try/catch` ke andar Task return kar diya bina await ke — exception kahan jaayegi?",
    redFlag: "Yeh kehna ki har async method me `async`/`await` keyword hona hi chahiye warna wo async nahi hai.",
  },
  {
    id: "async-iq-8",
    question:
      "Ek endpoint p99 latency load pe 8s tak ja rahi thi, servers idle the. Kaise diagnose aur fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Classic thread-pool starvation — kahin sync-over-async ya sync I/O chhupa hai. Threads block, requests queue. Sync I/O dhoondho aur `await` karo.",
    detailedAnswer:
      "Symptom: CPU low, latency high, `ThreadPool` queue length badh raha (dotnet-counters `threadpool-queue-length`, `threadpool-thread-count`). Matlab threads kaam nahi kar rahe, block hain. Common culprits: ek `AuditLogger` jo synchronous `SaveChanges` maar raha, ek `httpClient.GetAsync(...).Result`, ek `File.ReadAllText` request path pe, ya `.GetAwaiter().GetResult()`. Fix: har I/O ko `...Async` + `await` karo, `CancellationToken` flow karo, `.Result`/`.Wait()` hatao. Ek real case me sirf ek stray `.Result` aur ek sync `SaveChanges` fix karne se p99 8s se 400ms aa gayi — bina ek bhi extra server ke.",
    followUp: "Kaunse metrics/counters confirm karenge ki ye starvation hai, na ki slow DB?",
    redFlag: "Seedha 'aur servers add kar do' ya 'cache laga do' bina root cause dhoonde.",
  },
];

export default questions;
