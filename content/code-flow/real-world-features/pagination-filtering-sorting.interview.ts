import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pfs-1",
    question: "ASP.NET Core Web API me tum pagination kaise implement karte ho? Poori flow batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Client `page`/`pageSize` query params bhej ta hai, main ek parameters model me bind karta hoon with default pageSize aur ek hard max clamp, phir `IQueryable` ko filter -> CountAsync -> OrderBy -> Skip/Take -> Select DTO -> ToListAsync ke order me compose karke ek PagedResult envelope return karta hoon.",
    detailedAnswer:
      "Ek `EmployeeQueryParameters` class banata hoon: `Page = 1`, `PageSize = 20` default, aur `PageSize` ke setter me `MaxPageSize` (say 100) pe clamp taaki koi poori table na maang le. Controller `[FromQuery] EmployeeQueryParameters` se bind karta hai. Service me:\n```csharp\nvar query = _db.Employees.AsNoTracking();\nif (!string.IsNullOrWhiteSpace(p.Department))\n    query = query.Where(e => e.Department.Name == p.Department);\nvar total = await query.CountAsync(ct);\nquery = ApplySort(query, p.SortBy, p.SortDir);\nquery = query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize);\nvar items = await query\n    .Select(e => new EmployeeListItemDto(e.Id, e.FullName, e.Email, e.Department.Name, e.IsActive))\n    .ToListAsync(ct);\nreturn new PagedResult<EmployeeListItemDto>(items, p.Page, p.PageSize, total);\n```\nDo SQL round-trips: ek COUNT, ek data. Envelope me items, page, pageSize, totalCount, totalPages, hasNext/hasPrevious. Optionally `X-Pagination` header ya RFC 5988 `Link` header.",
    followUp: "CountAsync ko Skip/Take ke baad rakhoge to kya hoga?",
    redFlag:
      "Poore `Employee` entities ko `ToListAsync` karke phir C# me `.Skip().Take()` lagana — matlab poori table DB se aa gayi, pagination ka point hi gaya.",
  },
  {
    id: "pfs-2",
    question: "Offset pagination kab tootta hai? Alternative kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Deep pages pe slow ho jaata hai kyunki `OFFSET` throwaway rows read karta hai, aur inserts/deletes ke beech pages shift ho kar rows duplicate ya skip hoti hain. Alternative: keyset/cursor pagination.",
    detailedAnswer:
      "`OFFSET 100000 FETCH NEXT 20` ke liye SQL Server ko 100,020 rows read karke 100,000 phenkni padti hain — cost O(offset) hota hai. Doosra problem: tum page 2 dekh rahe ho, koi page 1 pe naya row add kar de, ab page 2 ka top row page 3 pe chala gaya — tumne ek row do baar dekha ya ek miss kiya. Keyset pagination: `WHERE Id > @lastSeenId ORDER BY Id LIMIT 20` — index seek, constant speed, aur cursor ek stable pointer hai isliye churn se immune. Trade-off: jump-to-page nahi milta aur total count typically nahi dete.",
    followUp: "Keyset pagination me sort column `CreatedAt` ho aur woh unique na ho to?",
    redFlag: "'Offset kabhi nahi tootta, bas index laga do' — index deep OFFSET ki throwaway-rows cost fix nahi karta.",
  },
  {
    id: "pfs-3",
    question:
      "Client `sortBy` aur `sortDir` query params bhej ta hai. Tum inhe safely kaise handle karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Client string ko kabhi seedha dynamic LINQ me nahi daalta — ek `switch` whitelist se known column names ko real lambda expressions pe map karta hoon, aur unknown input pe `OrderBy(e => e.Id)` fallback.",
    detailedAnswer:
      "`OrderBy(p.SortBy)` (string overload / System.Linq.Dynamic) column probing aur expression-injection surface deta hai. Sahi:\n```csharp\nreturn sortBy?.ToLowerInvariant() switch\n{\n    \"fullname\" => desc ? q.OrderByDescending(e => e.FullName) : q.OrderBy(e => e.FullName),\n    \"email\"    => desc ? q.OrderByDescending(e => e.Email)    : q.OrderBy(e => e.Email),\n    _ => q.OrderBy(e => e.Id),\n};\n```\nHar arm ek compile-time-checked property access hai. Fallback deterministic order deta hai taaki `Skip`/`Take` stable rahe. Har naya sortable column ek explicit code change + test hai.",
    followUp: "Agar 15 sortable columns ho to ye switch bahut lamba ho jaata hai — kya karoge?",
    redFlag: "System.Linq.Dynamic.Core add karke `OrderBy(sortBy)` — 'library sanitize kar deti hai' maan lena.",
  },
  {
    id: "pfs-4",
    question:
      "Ye code kya karega?\n```csharp\nvar employees = await _db.Employees.ToListAsync();\nvar page = employees\n    .Where(e => e.IsActive)\n    .OrderBy(e => e.FullName)\n    .Skip(20).Take(20)\n    .ToList();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Ye poori Employees table DB se memory me le aata hai, phir filtering/sorting/paging C# me hoti hai — DB pe koi WHERE/ORDER BY/OFFSET nahi jaata. Bada table pe ye API kill kar dega.",
    detailedAnswer:
      "`await _db.Employees.ToListAsync()` pe query wahin execute ho jaati hai — `SELECT * FROM Employees`, saari rows. Uske baad ka `.Where().OrderBy().Skip().Take()` LINQ-to-Objects hai, in-memory. Fix: sab kuch `IQueryable` pe rakho `ToListAsync` se pehle:\n```csharp\nvar page = await _db.Employees.AsNoTracking()\n    .Where(e => e.IsActive)\n    .OrderBy(e => e.FullName)\n    .Skip(20).Take(20)\n    .Select(e => new EmployeeListItemDto(/*...*/))\n    .ToListAsync();\n```\nTab EF Core ek single SQL query with `WHERE`, `ORDER BY`, `OFFSET 20 ROWS FETCH NEXT 20` bhej ta hai.",
    followUp: "Kaise pehchanoge code review me ki filtering DB pe ho rahi hai ya memory me?",
    redFlag: "'Dono same result dete hain to farak nahi padta' — result same, performance aur scalability zameen-aasman.",
  },
  {
    id: "pfs-5",
    question:
      "Total count nikaalna mehnga hai (bada filtered set, slow COUNT). Kya options hain?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Count ko cache karo (short TTL), ya approximate count (SQL Server stats / `sys.dm_db_partition_stats`) dikhao, ya total count dena hi band karo aur keyset pagination + hasNext flag pe switch karo.",
    detailedAnswer:
      "Practical options: (1) `COUNT(*)` ka result ek short-lived cache (30-60s) me rakho — list pages me exact-to-the-second total zaroori nahi hota. (2) Filtered set bahut bada ho to approximate row count (table statistics) 'about 2,340,000 results' style dikhao — Google jaisa. (3) Total count feature hi drop karo: keyset pagination + `Take(pageSize + 1)` karke check karo ki `hasNext` hai ya nahi, page numbers mat dikhao. (4) Agar filters limited hain to per-filter-combination materialized count table maintain karo background job se.",
    followUp: "Cached count aur actual data ke beech mismatch user ko dikhe to kaise handle karoge?",
  },
  {
    id: "pfs-6",
    question:
      "`PagedResult<T>` envelope banao vs plain array return karke pagination info headers me — kaunsa aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Dono valid hain. Envelope (items + metadata ek JSON object me) frontend ke liye simplest hai; headers (`X-Pagination` / RFC 5988 `Link`) REST purists ko pasand aur body ko clean rakhte hain. Main aksar dono deta hoon.",
    detailedAnswer:
      "Envelope approach: `{ items: [...], page, pageSize, totalCount, totalPages, hasNext, hasPrevious }` — ek hi response me sab, client ko extra header parsing nahi karni. Downside: response shape ab collection nahi rahi, generic HTTP clients ke liye thoda awkward. Header approach: body sirf `EmployeeListItemDto[]` hai, aur `X-Pagination` header me JSON metadata ya standard `Link` header with `rel=\"next\"/\"prev\"/\"first\"/\"last\"` (RFC 5988, GitHub API style). Main practically envelope primary rakhta hoon aur `X-Pagination` header bhi set kar deta hoon — dono audiences cover.",
    followUp: "`Link` header me `rel=\"last\"` banane ke liye kya chahiye?",
  },
  {
    id: "pfs-7",
    question:
      "Trap: ek dev ne `Page` aur `PageSize` ko `int` rakha bina kisi guard ke. Client bhejta hai `?page=-3&pageSize=0`. Kya hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`page=-3` se `Skip((-3-1)*pageSize)` = negative `Skip` — EF Core exception ya undefined behavior. `pageSize=0` se `Take(0)` — hamesha empty page, client infinite-loop me 'load more' karta rahega.",
    detailedAnswer:
      "Guards zaroori: `PageSize` setter me `< 1 ? 1 : (> max ? max : value)`, aur service me `var page = Math.Max(1, p.Page)`. Ya model pe `[Range(1, int.MaxValue)]` / `[Range(1, 100)]` DataAnnotations laga kar invalid input ko `400 Bad Request` bana do. Bina guard ke negative `Skip` runtime error deta hai aur `Take(0)` silently har page khaali kar deta hai — dono production incidents ban chuke hain.",
    followUp: "Guard karke clamp karna better hai ya `400 Bad Request` dena — kab kaunsa?",
    redFlag: "'Client galat value bhejega hi nahi' — har public/internal API ko hostile input assume karna chahiye.",
  },
  {
    id: "pfs-8",
    question:
      "Filtering me `e.FullName.Contains(search)` use kiya. Bade table pe ye slow hai — kyun, aur kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`Contains` `LIKE '%search%'` banta hai — leading wildcard, isliye B-tree index use nahi hota, full scan. Options: prefix search (`StartsWith` -> `LIKE 'search%'`, index-friendly), full-text index, ya ek dedicated search engine.",
    detailedAnswer:
      "`LIKE '%x%'` me leading `%` hone se SQL Server normal index seek nahi kar sakta, poora scan karta hai. Agar business ko sirf 'naam ki shuruaat' search chahiye to `StartsWith` use karo — `LIKE 'x%'` sargable hai, index lagta hai. Agar 'kahin bhi match' chahiye to SQL Server Full-Text Search (`CONTAINS`/`FREETEXT`) ya ek external index (Elasticsearch / Azure AI Search) — EF Core se woh out of band hota hai. Chhote tables (few thousand rows) pe `Contains` bilkul theek hai — pehle measure karo, phir optimize.",
    followUp: "`EF.Functions.Like(e.FullName, $\"{search}%\")` aur `e.FullName.StartsWith(search)` me koi farak hai?",
  },
];

export default questions;
