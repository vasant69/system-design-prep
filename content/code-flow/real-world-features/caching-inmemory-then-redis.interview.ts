import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cache-1",
    question:
      "Ek read-heavy endpoint ko cache kaise karoge? Cache-aside pattern samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Cache-aside: pehle cache dekho, hit pe return, miss pe source (DB) se load karo, cache me daalo, phir return. `IMemoryCache.GetOrCreateAsync` isko ek call me deta hai, ek absolute expiration aur `SizeLimit` ke saath.",
    detailedAnswer:
      'Application dono cheezein manage karta hai — cache aur DB — cache ko DB ka pata nahi hota.\n```csharp\nreturn (await _cache.GetOrCreateAsync("departments:all", async entry =>\n{\n    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);\n    entry.SlidingExpiration = TimeSpan.FromMinutes(2);\n    entry.Size = 1;\n    return await _db.Departments.AsNoTracking()\n        .Select(d => new DepartmentDto(d.Id, d.Name, d.CostCentre))\n        .ToListAsync(ct);\n}))!;\n```\nFactory sirf miss pe chalti hai. Absolute expiration max staleness cap karta hai; `SizeLimit` (cache pe) + `entry.Size` unbounded growth rokte hain. Har write path pe `_cache.Remove(key)`.',
    followUp: "Sirf sliding expiration rakho, absolute nahi — kya risk hai?",
    redFlag:
      "Cache entry bina kisi expiry ke daal dena — `IMemoryCache` me ye ek slow memory leak plus permanent stale data hai.",
  },
  {
    id: "cache-2",
    question: "Cache stampede (dogpile) kya hai aur kaise rokte ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Key expire hone ke turant baad N concurrent requests sab miss karti hain aur sab ek saath factory (DB query) chalati hain — wahi load jisse bachna tha. Fix: factory ke around ek `SemaphoreSlim` gate, expiry me jitter, ya `HybridCache` (.NET 9) jo stampede protection built-in deta hai.",
    detailedAnswer:
      "Ek `SemaphoreSlim(1,1)` se sirf ek request factory chalati hai; baaki `await _gate.WaitAsync()` pe rukti hain aur jab pehli cache populate kar deti hai to wo cache se le leti hain. Double-check pattern: lock lene ke baad dobara cache check karo (ho sakta hai kisi ne bhar diya ho). Alternative: expiry pe thodi randomness (e.g. 10 min +/- 60s) taaki saari keys ek saath expire na hon, aur background/early refresh jo expiry se pehle value refresh kar de.",
    followUp: "Per-key stampede protection chahiye (ek global lock nahi) to kya karoge?",
  },
  {
    id: "cache-3",
    question:
      "`IMemoryCache` aur `IDistributedCache` (Redis) me kab kaunsa? Trade-offs?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`IMemoryCache` single instance ya chhote always-identical data ke liye — nanosecond reads, zero infra, par per-process aur restart pe gone. Redis multi-instance ke liye — shared truth, survives restarts, cost is a network hop + serialize/deserialize.",
    detailedAnswer:
      "Multi-instance me `IMemoryCache` do problems deta hai: (1) har pod ki alag copy, ek pod ka evict baaki tak nahi pahunchta — inconsistent reads; (2) deploy/restart pe har pod cold, sab ek saath DB hit. `AddStackExchangeRedisCache` ek shared out-of-process store deta hai; `IDistributedCache` sirf `byte[]`/`string` samajhta hai isliye JSON serialize karna padta hai (CPU + size cost). `InstanceName` prefix se ek shared Redis me apps ki keys separate rehti hain. Rule: source query Redis hop + deserialize se meaningfully mehngi honi chahiye, warna caching ne latency badha di.",
    followUp:
      "Ek 2-level cache (L1 in-memory + L2 Redis) kab banate ho aur invalidation kaise?",
    redFlag:
      "Har chhoti query ko Redis se wrap kar dena — ek 2 ms indexed query ke liye network hop + JSON parse ulta slow hota hai.",
  },
  {
    id: "cache-4",
    question:
      "Distributed cache me invalidation ka dual-write problem kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "DB update aur `cache.RemoveAsync(key)` do alag systems hain. Agar DB commit ho jaaye par `RemoveAsync` se pehle pod crash ho, Redis me stale value uski TTL tak rah jaati hai. Gap ko chhoti TTL, reliable (outbox-style) invalidation, ya pub/sub se manage karte ho.",
    detailedAnswer:
      "Practical stance: TTL ko safety net maano — worst-case staleness = TTL, isliye changeable data pe TTL chhoti rakho. Zyada strict chahiye to invalidation ko ek outbox row bana do jo reliably `RemoveAsync` retry kare. Ya DB write ke baad ek Redis pub/sub message publish karo jise har pod sun kar apni local L1 cache drop kare. Order bhi matter karta hai: pehle DB commit, phir cache remove (kabhi ulta nahi, warna do read ke beech stale value dobara cache ho jaayegi).",
    followUp: "Pehle cache remove phir DB commit karo to kya specific bug aata hai?",
  },
  {
    id: "cache-5",
    question:
      "Ek dev ne account-summary action pe `[OutputCache(Duration = 30)]` laga diya. Endpoint pe `[Authorize]` hai. Kya hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Output caching poore response (status + headers + body) ko cache karta hai. Bina `VaryBy` ke ye user se vary nahi karta — user A ka cached account summary agle 30 second me user B ko serve ho sakta hai. Ye ek data leak hai.",
    detailedAnswer:
      "Output caching bahut fast hai (serialization tak nahi, ready bytes) par isliye hi authorized/personalised responses ke liye khatarnaak. Sirf anonymous, everyone-identical endpoints pe use karo — public price list, reference lookup. Agar authorized endpoint pe chahiye hi to `VaryByValue` / `VaryByHeader` se user identity pe partition karo, aur phir bhi carefully — sensitive data pe main generally avoid karta hoon. `[OutputCache]` kabhi `[Authorize]` action pe bina explicit vary ke nahi.",
    followUp:
      "Response caching (client/proxy `Cache-Control`) aur output caching me farak kya hai?",
    redFlag:
      "OutputCache aur ResponseCache ko ek hi cheez samajhna — ek server-side store hai, doosra HTTP cache headers.",
  },
  {
    id: "cache-6",
    question:
      "BFSI API me tum kya cache karoge aur kya bilkul nahi? Kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Cache karo: reference/lookup data — departments, branch list, IFSC codes, product catalogue, currency codes, holiday calendar (low churn, non-sensitive, sabke liye same). Never: account balances, transaction lists, loan status, KYC results.",
    detailedAnswer:
      "Rule ye hai: agar stale value ek galat financial decision ya compliance breach de sakti hai, wo cache nahi hoti. Balance/transactions authoritative reads hain — regulator inhe fresh expect karta hai. Beech ka category (user profile, permission set) short TTL + per-user key + write pe invalidation ke saath cache ho sakti hai. Reference data pe aggressive caching bilkul theek hai kyunki wo mahine me shayad ek baar badalta hai.",
    followUp: "Permission/role data cache karoge to ek user ka role revoke hone par kya karoge?",
  },
  {
    id: "cache-7",
    question:
      "Ye code kya problem dega?\n```csharp\nbuilder.Services.AddMemoryCache();\n// ...\n_cache.Set(key, bigList);   // no options\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Do issues: (1) entry ki koi expiry nahi — permanent stale data aur ek entry jo kabhi evict nahi hoti; (2) cache pe koi `SizeLimit` nahi aur entry pe koi `Size` nahi, to alag-alag keys ke saath ye unbounded grow karke process ko OOM kar sakti hai.",
    detailedAnswer:
      'Fix:\n```csharp\nbuilder.Services.AddMemoryCache(o => o.SizeLimit = 1024);\n// ...\n_cache.Set(key, bigList, new MemoryCacheEntryOptions\n{\n    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),\n    Size = 1\n});\n```\nAgar `SizeLimit` set hai to har entry ko `Size` dena mandatory hai warna `Set`/`GetOrCreateAsync` exception phenkta hai. Absolute expiration max staleness guarantee deta hai. `IMemoryCache` app ki hi memory me hai, isliye bounded rakhna zaroori hai.',
    followUp: "`Size` ki unit kya hai — bytes?",
    redFlag: "'Memory cache apne aap manage ho jaati hai' — bina `SizeLimit` ke ye grow karti rehti hai.",
  },
  {
    id: "cache-8",
    question:
      "Cache warm hai. DB me directly (kisi aur system se) ek department update ho jaata hai — tumhare app ko pata nahi chala. User ko kya dikhega aur ye kaise handle karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "App ka cache stale hai aur invalidate karne ka koi trigger nahi chala, to user ko TTL khatam hone tak purana data dikhega. Handle: chhoti TTL as a backstop, ya CDC / DB change notification, ya sabhi writes ko app ke through force karo.",
    detailedAnswer:
      "Cache-aside sirf tabhi consistent hai jab har write app ke code path se jaaye (jahan tum evict karte ho). Out-of-band writes (DBA script, doosra service, ETL job) us evict ko bypass kar dete hain. Options: (1) TTL ko upper bound of staleness maano aur business ke saath acceptable window decide karo; (2) SQL Server ke `SqlDependency` / change tracking / Debezium-style CDC se change events le kar cache invalidate karo; (3) architectural rule: is data ka single write path yahi service hai. BFSI me option 3 preferred hai — shared mutable tables bina ownership ke waise bhi ek problem hain.",
    followUp: "TTL ko bahut chhota (5s) kar dena ek fix hai — iska downside kya hai?",
  },
];

export default questions;
