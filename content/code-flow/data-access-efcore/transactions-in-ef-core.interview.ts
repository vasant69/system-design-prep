import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "eftx-iq-1",
    question: "EF Core me transactions kaise handle karte ho? Implicit aur explicit me farak?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Har `SaveChangesAsync` call already ek implicit transaction hai — usme jitne bhi writes hon, sab ya koi nahi. Explicit transaction (`Database.BeginTransactionAsync`) tab jab atomic unit ek se zyada `SaveChangesAsync` ya EF + raw SQL me phaila ho.",
    detailedAnswer:
      "Implicit: `SaveChangesAsync` andar `BEGIN`/`COMMIT` khud lagata hai; ek statement fail = poora rollback + exception. To single-call atomic kaam ke liye kuch extra nahi chahiye. Explicit: `await using var tx = await _db.Database.BeginTransactionAsync(ct); try { ...work...; await _db.SaveChangesAsync(ct); ...more work...; await _db.SaveChangesAsync(ct); await tx.CommitAsync(ct); } catch { await tx.RollbackAsync(ct); throw; }`. Jab transaction open hai, EF apna implicit transaction nahi banata — har `SaveChangesAsync` isi open transaction me chalti hai. `await using` ensure karta hai ki agar `CommitAsync` reach na ho to dispose par rollback ho.",
    followUp: "Ek hi `SaveChangesAsync` me 20 entities save ho rahi hain — kya wo bhi atomic hain?",
    redFlag: "Ye kehna ki har `SaveChangesAsync` alag se auto-commit hoti hai, ya ki EF Core transactions support hi nahi karta.",
  },
  {
    id: "eftx-iq-2",
    question:
      "BFSI scenario: employee ko naye department me transfer karna hai AUR ek `EmployeeAuditLog` row likhni hai — dono ya koi nahi. Code kaise likhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek explicit transaction me dono `SaveChangesAsync` — transfer wala update, phir audit wala insert — phir `CommitAsync`. Koi bhi exception par `RollbackAsync` + `throw`.",
    detailedAnswer:
      "```csharp\nawait using var tx = await _db.Database.BeginTransactionAsync(ct);\ntry\n{\n    employee.DepartmentId = newDepartmentId;\n    await _db.SaveChangesAsync(ct);\n\n    _db.AuditLogs.Add(new EmployeeAuditLog\n    {\n        EmployeeId = employee.Id,\n        Action = \"DepartmentTransfer\",\n        OldValue = oldDeptId.ToString(),\n        NewValue = newDepartmentId.ToString(),\n        ChangedBy = changedBy,\n        ChangedAtUtc = DateTime.UtcNow,\n    });\n    await _db.SaveChangesAsync(ct);\n\n    await tx.CommitAsync(ct);\n}\ncatch\n{\n    await tx.RollbackAsync(ct);\n    throw;\n}\n```\nKyunki dono `SaveChangesAsync` ek hi `AppDbContext` par hain, ye ek local transaction hai — koi distributed transaction nahi. Agar audit insert `NOT NULL` violation se fail hua, rollback department update ko bhi undo kar deta hai — compliance ke liye 'transfer without trail' state kabhi nahi banti.",
    followUp: "Audit row ko ek alag audit database me likhna ho to approach kaise badlega?",
    redFlag: "Dono `SaveChangesAsync` ko bina transaction ke likhna aur 'agar audit fail hua to log kar denge' bolna.",
  },
  {
    id: "eftx-iq-3",
    question:
      "Ye code review me aaya. Kya galat hai?\n```csharp\nusing var scope = new TransactionScope();\nawait _repo.TransferAsync(id, newDeptId, ct);\nawait _auditRepo.AddAsync(log, ct);\nscope.Complete();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`TransactionScope` bina `TransactionScopeAsyncFlowOption.Enabled` ke banaya gaya hai. `await` ke baad ambient transaction flow nahi karta — `AddAsync` transaction ke bahar chal ke alag commit ho jaata hai. Constructor me wo option pass karo, ya behtar: `BeginTransactionAsync` use karo.",
    detailedAnswer:
      "Ambient transaction thread-local storage me rehta hai. Pehla `await` ke baad continuation doosre pool thread par resume ho sakta hai; `AsyncFlowOption.Enabled` ke bina ambient transaction us thread par nahi jaata. To `_repo.TransferAsync` shayad transaction me chale, par `_auditRepo.AddAsync` ke andar ka `SaveChangesAsync` transaction ke bahar auto-commit ho jaata hai. Agar baad me `scope.Complete()` na ho aur dispose rollback kare, tab bhi audit row commit ho chuki — orphan. Fix: `new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }, TransactionScopeAsyncFlowOption.Enabled)`. Aur agar dono repos alag `DbContext`/connection use karte hain to distributed escalation ka risk bhi hai — single DB ke liye `BeginTransactionAsync` cleaner hai.",
    followUp: "`TransactionScope` ke andar do alag connections khul gayi to kya hota hai?",
    redFlag: "Code ko 'theek dikh raha hai' bol dena, ya `scope.Complete()` ko problem batana.",
  },
  {
    id: "eftx-iq-4",
    question:
      "`BeginTransactionAsync` aur `TransactionScope` ke beech decision kaise lete ho?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Single database / single `DbContext` — `BeginTransactionAsync` (explicit, native async, koi escalation ya async-flow trap). `TransactionScope` sirf jab genuinely multiple resources (do DBs, DB + doosra store, third-party libraries) ko ek ambient unit me bind karna ho.",
    detailedAnswer:
      "`BeginTransactionAsync`: transaction object explicit hota hai aur ek connection se bandha hai; `CancellationToken` native; local transaction, MSDTC kabhi involve nahi. Downside: agar tumhe do alag contexts ko atomically chahiye to ye seedha kaam nahi karta (`tx.GetDbTransaction()` share karna padta hai). `TransactionScope`: ambient — scope ke andar jo bhi enlist-able resource use ho wo auto join karta hai, code ko pata bhi nahi. Downsides: async ke saath `AsyncFlowOption.Enabled` mandatory, aur 2+ connections par distributed (MSDTC) escalation — jo Linux/cloud me aksar unavailable, runtime exception. Practical rule: 95% cases single DB — `BeginTransactionAsync`. Multi-resource atomicity chahiye to pehle socho kya main outbox pattern se ise single-DB bana sakta hoon.",
    followUp: "Distributed transaction ki jagah outbox pattern kaise atomicity deta hai?",
  },
  {
    id: "eftx-iq-5",
    question:
      "Isolation levels — default kya hai SQL Server me, aur `SERIALIZABLE` kab use karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Default `READ COMMITTED` — sirf committed data padho, par non-repeatable reads possible. `SERIALIZABLE` tab jab 'check then act' race ko rokna ho (jaise balance check phir debit, ya slot booking) — accepting kam throughput aur zyada deadlock.",
    detailedAnswer:
      "`READ COMMITTED` (default): dirty reads nahi, par ek transaction ke do reads ke beech koi commit kar de to values badal sakti hain. `REPEATABLE READ`: padhi hui rows lock, par phantom rows (naya insert matching range me) aa sakte hain. `SERIALIZABLE`: range locks, sab kuch aisa jaise transactions ek ke baad ek chale — sabse safe, sabse kam concurrency, deadlock zyada. `SNAPSHOT` (row-versioning): readers writers ko block nahi karte — read-heavy reporting me achha. `BeginTransactionAsync(IsolationLevel.Serializable, ct)`. Zyadatar CRUD ke liye default chhod do; isolation tabhi badhao jab ek specific anomaly identify ki ho, warna throughput bewajah girta hai.",
    followUp: "`SNAPSHOT` isolation SQL Server me use karne ke liye database-level kya enable karna padta hai?",
  },
  {
    id: "eftx-iq-6",
    question:
      "`catch` block me `await tx.RollbackAsync(ct)` ke baad `throw;` likhna kyun zaroori hai? `throw ex;` se kya farak?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`throw;` ke bina exception swallow ho jaata hai — caller ko lagta hai operation safal hua, jabki rollback ho chuka. `throw ex;` original stack trace ko current line se replace kar deta hai — root cause chhup jaata hai. Hamesha bare `throw;`.",
    detailedAnswer:
      "Agar tum sirf `RollbackAsync` karke method se normally return kar jao, to controller ko koi exception nahi milta — wo `200 OK` return kar dega, par data rollback ho chuka hai. Ye 'silent failure' BFSI me sabse bura outcome hai. `throw;` (bare) current exception ko as-is re-throw karta hai, poora original stack trace preserve karke, taaki global exception handler use `500` (ya mapped `409`/`422`) me convert kare aur logs me asli line dikhe. `throw ex;` ek naya throw point banata hai — stack trace us `catch` line se shuru dikhta hai, debugging mushkil. Note: `await using` bhi dispose par rollback karta hai, par explicit `catch` intent clear rakhta hai aur cancellation par bhi deterministic rollback deta hai.",
    followUp: "`await using` already rollback kar deta hai to explicit `catch` + `RollbackAsync` kyun likhein?",
    redFlag: "`throw ex;` ko 'zyada explicit' ya 'behtar' batana.",
  },
  {
    id: "eftx-iq-7",
    question:
      "Team ne har service method me 'safety ke liye' `BeginTransaction` laga diya, un me bhi jinme ek hi `SaveChangesAsync` hai. Kya problem hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Bewajah — ek `SaveChangesAsync` already atomic hai. Extra explicit transaction lock hold time badhata hai, blocking aur deadlock chance badhata hai, aur connection ko lamba busy rakhta hai. Transaction sirf jab atomic unit ek se zyada `SaveChangesAsync` ya EF + raw SQL ho.",
    detailedAnswer:
      "Explicit transaction jitni der open rahti hai, uske locks utni der hold hote hain. Ek single `SaveChangesAsync` ke around apna `BeginTransaction`/`Commit` lagane se: (1) connection us poore method ke liye busy — thread pool aur connection pool par pressure; (2) do concurrent requests same rows ko alag order me touch karen to deadlock; (3) code noise. Rule jo BFSI teams adopt karti hain: `BeginTransaction` sirf tab jab genuinely 2+ `SaveChangesAsync` ya EF + stored proc ek unit me commit hone chahiye. Warna EF ka implicit transaction hi kaafi hai. Is rule ke baad ek team ka deadlock rate significantly gir gaya.",
    followUp: "Do concurrent transfers deadlock kar rahe hain — code me kya change se rokoge?",
    redFlag: "'Transaction hamesha lagao, safe rehta hai' — trade-off ignore karna.",
  },
  {
    id: "eftx-iq-8",
    question:
      "`EnableRetryOnFailure` (connection resiliency) on hai aur tum manual `BeginTransactionAsync` use kar rahe ho. EF exception deta hai — kyun, aur fix?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Retrying execution strategy user-initiated transaction ke saath directly kaam nahi karta — kyunki retry par wo poora transaction dobara chalana chahega par usko boundaries nahi pata. Fix: poore transaction ko `db.Database.CreateExecutionStrategy().ExecuteAsync(async () => { ... begin/commit/rollback ... })` me wrap karo.",
    detailedAnswer:
      "`EnableRetryOnFailure` transient errors (deadlock victim, timeout, network blip) par operation retry karta hai. Manual transaction me EF ko nahi pata ki retry par kahan se shuru karna hai — isliye wo explicitly exception deta hai (`The configured execution strategy 'SqlServerRetryingExecutionStrategy' does not support user-initiated transactions`). Sahi pattern:\n```csharp\nvar strategy = _db.Database.CreateExecutionStrategy();\nawait strategy.ExecuteAsync(async () =>\n{\n    await using var tx = await _db.Database.BeginTransactionAsync(ct);\n    // ... work + SaveChangesAsync ...\n    await tx.CommitAsync(ct);\n});\n```\nAb strategy poore delegate ko as a unit retry karti hai, transaction boundaries ke saath. Idempotency ka dhyaan rakho — retry par kaam dobara chalega.",
    followUp: "Retry par audit log do baar likha ja sakta hai — usse kaise rokoge?",
    redFlag: "`EnableRetryOnFailure` ko off kar dena taaki error na aaye, resiliency ko chhod ke.",
  },
];

export default questions;
