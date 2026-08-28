import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bso-1",
    question:
      "ASP.NET Core me tum ek recurring background job kaise banaoge? Lifecycle bhi samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek class `BackgroundService` se inherit karti hai, `ExecuteAsync(stoppingToken)` override karti hai, andar ek `PeriodicTimer` loop chalta hai jo `stoppingToken` cancel hone tak repeat karta hai. `Program.cs` me `AddHostedService` se register.",
    detailedAnswer:
      'Host boot pe har hosted service ka `StartAsync` chalta hai (registration order me); `BackgroundService` ka `StartAsync` internally tumhara `ExecuteAsync` call karke uska `Task` store kar leta hai — long-running loop yahin chalta hai. Shutdown pe host `stoppingToken` cancel karta hai aur `StopAsync` `ExecuteAsync` ke khatam hone ka wait karta hai, default ~30s (`HostOptions.ShutdownTimeout`) tak, phir force kill.\n```csharp\nprotected override async Task ExecuteAsync(CancellationToken stoppingToken)\n{\n    using var timer = new PeriodicTimer(TimeSpan.FromHours(1));\n    while (await timer.WaitForNextTickAsync(stoppingToken))\n    {\n        try { await DoWorkAsync(stoppingToken); }\n        catch (OperationCanceledException) { break; }\n        catch (Exception ex) { _logger.LogError(ex, "tick failed"); }\n    }\n}\n```\n`PeriodicTimer` non-overlapping hai — agla tick tab tak queue nahi hota jab tak pichhla kaam chal raha hai.',
    followUp: "Loop body me exception catch na karo to kya hota hai?",
    redFlag:
      "`Task.Run` me ek `while (true)` + `Thread.Sleep` chala dena bina `stoppingToken` ke — shutdown pe hang karta hai aur graceful stop todta hai.",
  },
  {
    id: "bso-2",
    question:
      "Scoped-in-singleton problem kya hai aur `BackgroundService` me `DbContext` kaise use karte ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`AddHostedService` service ko singleton register karta hai, par `AppDbContext` scoped hai aur thread-safe nahi. Seedha inject nahi kar sakte — `IServiceScopeFactory` inject karo, har iteration pe `CreateScope()`, us scope se `AppDbContext` resolve karo.",
    detailedAnswer:
      'Singleton se scoped consume karne pe DI startup error deta hai, ya `IServiceProvider` se manually resolve karo to ek context poore app life tak zinda rehta hai — change-tracker phoolta hai, memory leak, aur concurrent ticks pe race.\n```csharp\npublic MyService(IServiceScopeFactory scopeFactory) => _scopeFactory = scopeFactory;\n\nprivate async Task DoWorkAsync(CancellationToken ct)\n{\n    using var scope = _scopeFactory.CreateScope();\n    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();\n    // ... query, SaveChangesAsync(ct)\n}\n```\nScope dispose hote hi context bhi dispose — bilkul jaise framework har HTTP request ke liye ek scope banata hai.',
    followUp:
      "`IServiceScopeFactory` aur `IServiceProvider` dono se scope ban sakta hai — farak kya hai?",
    redFlag:
      "`DbContext` ki registration ko singleton bana dena taaki inject ho jaaye — ye thread-safety aur stale-data bugs ka pitara khol deta hai.",
  },
  {
    id: "bso-3",
    question:
      "Employee create hone par payroll aur access-card system ko event bhejna hai. Reliably kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Request ke andar broker call mat karo — dual-write gap ban jaata hai. Employee row aur ek `OutboxMessage` row ek hi `SaveChangesAsync` transaction me likho; ek background dispatcher unsent rows poll karke publish karta hai aur `ProcessedAtUtc` set karta hai.",
    detailedAnswer:
      'Agar `SaveChangesAsync` ke baad `await _bus.PublishAsync(...)` karo aur broker down ho, employee DB me hai par event kabhi nahi gaya — silent drift.\n```csharp\n_db.Employees.Add(employee);\n_db.OutboxMessages.Add(new OutboxMessage {\n    Id = Guid.NewGuid(),\n    Type = "EmployeeCreated",\n    Payload = JsonSerializer.Serialize(new { employee.Id, employee.Email }),\n    CreatedAtUtc = DateTime.UtcNow\n});\nawait _db.SaveChangesAsync(ct);   // dono ek transaction me\n```\nDispatcher (`BackgroundService`, 5s poll): unsent rows `CreatedAtUtc` order me, `Take(20)`, publish, success pe `ProcessedAtUtc = now`, fail pe `RetryCount++`. Delivery at-least-once hai, isliye consumers message-id pe idempotent.',
    followUp:
      "Publish succeed hua par `ProcessedAtUtc` save se pehle pod crash — kya hoga?",
    redFlag:
      "Bas ek try/catch laga do publish ke around aur retry loop — crash / pod kill retry loop ko bhi maar deta hai; row committed hona chahiye.",
  },
  {
    id: "bso-4",
    question:
      "At-least-once aur exactly-once delivery me farak? Outbox kaunsa deta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Outbox at-least-once deta hai — ek message do baar aa sakta hai (publish ke baad, mark-sent hone se pehle crash se). Exactly-once practically distributed systems me nahi milta; effectively-once = at-least-once + idempotent consumer se approximate karte hain.",
    detailedAnswer:
      "Exactly-once ke liye publish aur mark-sent ek atomic operation hona chahiye across broker + DB — wahi distributed-transaction problem jise outbox avoid karta hai. Isliye outbox deliberately at-least-once chunta hai. Consumer side pe ek processed-message-ids table rakho: message aane par uski id `INSERT` try karo (unique constraint) — duplicate mila to message ignore. Handler ka side effect + id insert ek hi consumer-side transaction me. Isse duplicate delivery harmless ho jaati hai.",
    followUp:
      "Consumer ka side effect ek external API call ho (khud idempotent nahi) to?",
  },
  {
    id: "bso-5",
    question:
      'Ye code review me aaya. Kya galat hai?\n```csharp\npublic class SweeperService : BackgroundService\n{\n    private readonly AppDbContext _db;\n    public SweeperService(AppDbContext db) => _db = db;\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            var expired = await _db.Employees\n                .Where(e => e.IsActive && e.LastWorkingDate < DateOnly.FromDateTime(DateTime.UtcNow))\n                .ToListAsync();\n            foreach (var e in expired) e.IsActive = false;\n            await _db.SaveChangesAsync();\n            await Task.Delay(TimeSpan.FromHours(1));\n        }\n    }\n}\n```',
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Do bade issues: (1) scoped `AppDbContext` ko singleton hosted service me inject kiya — startup error ya app-lifetime context; (2) loop body me koi `try/catch` nahi, aur `SaveChangesAsync`/`Task.Delay` ko `stoppingToken` nahi diya, to ek error poora service gira dega aur shutdown 1 ghante tak hang kar sakta hai.",
    detailedAnswer:
      "Fix: constructor me `IServiceScopeFactory`, har iteration me `using var scope = _scopeFactory.CreateScope()` + `scope.ServiceProvider.GetRequiredService<AppDbContext>()`. `Task.Delay` ki jagah `PeriodicTimer` + `WaitForNextTickAsync(stoppingToken)` (non-overlapping, cancellable). Har iteration `try` kaam, `catch (OperationCanceledException) break` (clean shutdown), `catch (Exception ex)` log aur loop me raho. `SaveChangesAsync(stoppingToken)` pass karo. Bonus: multi-instance pe ye har pod pe chalega — ek advisory lock chahiye.",
    followUp: "Isko multi-instance-safe kaise banaoge?",
    redFlag:
      "Sirf `Task.Delay` ko `PeriodicTimer` se badal do — scoped-context aur error-handling bug rah jaate hain.",
  },
  {
    id: "bso-6",
    question:
      "3 pods pe ye deactivation sweeper deploy hai. Har raat kaam 3 baar ho raha hai. Kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Sirf ek pod ko sweep chalane do: leader election (host lease), ya ek DB advisory lock (`sp_getapplock`), ya claim-by-`UPDATE` pattern jahan pod ek batch ko `UPDATE ... OUTPUT` se claim karta hai before processing.",
    detailedAnswer:
      "Options: (1) `sp_getapplock` — sweep start pe exclusive app lock lo; nahi mila to skip. Simple, SQL Server pe built-in. (2) Ek Leases table with a single row aur TTL; jo pod row ko `UPDATE ... WHERE Expiry < now` se claim kare wahi leader, baaki wait. (3) Outbox dispatch ke liye row-level claim: `UPDATE TOP (20) OutboxMessages SET LockedBy=@pod, LockedUntil=@t OUTPUT inserted.Id WHERE ProcessedAtUtc IS NULL AND (LockedUntil IS NULL OR LockedUntil < now)` — har pod alag rows uthata hai, koi double-publish nahi. (4) Hangfire — usme distributed locks aur single-execution guarantee built-in hai.",
    followUp:
      "Lease-holder pod crash ho jaaye to kaam ruk jaayega? Kaise handle karoge?",
  },
  {
    id: "bso-7",
    question:
      "Outbox dispatcher ka poll interval kaise choose karoge? Trade-offs?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Chhota interval (1-2s) = kam event latency, zyada DB load aur zyada empty polls. Bada interval (30s+) = kam load, par downstream ko event der se milta hai. Typical: 2-10 seconds; batch size 20-100.",
    detailedAnswer:
      "Tuning knobs: poll interval, batch size, aur index. `(ProcessedAtUtc, CreatedAtUtc)` pe ek filtered index (`WHERE ProcessedAtUtc IS NULL`) empty polls ko practically free bana deta hai. Latency critical ho to hybrid: poll + ek in-process signal (`Channel`) jo request handler outbox row likhne ke baad set kare, taaki dispatcher turant jaage aur idle me 10s pe fall back kare. High volume pe multiple dispatcher instances + row-claim se parallelism.",
    followUp:
      "Ek `Channel` signal add karke poll bilkul hata sakte ho? Kyun nahi?",
  },
  {
    id: "bso-8",
    question:
      "Plain `BackgroundService` + `PeriodicTimer` ke bajaye Hangfire ya Quartz.NET kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Jab job persistence (process restart ke baad bache), automatic retries, ek dashboard, delayed/enqueued jobs, cron scheduling, ya multi-instance single-execution chahiye. Plain timer loop simple periodic work ke liye theek hai, orchestration ke liye nahi.",
    detailedAnswer:
      "Hangfire: jobs DB me store hote hain, `RecurringJob.AddOrUpdate` ek cron ke saath, automatic retry with backoff, ek web dashboard, aur distributed locks se har job ek hi baar chalta hai. Quartz.NET: rich cron, calendars, misfire handling, clustering. Plain `BackgroundService`: zero dependencies, poora control, par persistence/dashboard/leader-election khud likhna. Rule: ek do periodic sweeps + ek outbox loop = plain. Dozens of ad-hoc + scheduled + retried jobs with visibility = Hangfire.",
    followUp:
      "Hangfire jobs DB me store karta hai — wo tumhare application DB me hone chahiye ya alag?",
    redFlag:
      "Hangfire hamesha better hai — ek chhote service me Hangfire ke tables + dashboard + polling ek overkill dependency hai.",
  },
];

export default questions;
