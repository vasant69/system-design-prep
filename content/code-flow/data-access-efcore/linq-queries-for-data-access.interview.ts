import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "linq-iq-1",
    question: "IQueryable aur IEnumerable me farq kya hai? EF Core ke context me kyun matter karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "IQueryable pe LINQ expression tree banta hai jo SQL me translate hoke DB pe chalta hai; IEnumerable pe LINQ compiled delegate hai jo in-memory chalta hai.",
    detailedAnswer:
      "`DbSet<T>` `IQueryable<T>` hai. Uspe `Where`/`Select`/`OrderBy` lagane se ek expression tree banta hai — EF Core us tree ko padh ke ek SQL statement generate karta hai, jo filtering/sorting/paging database pe (jahan indexes hain) karta hai. Jaise hi tum `ToList()`, `AsEnumerable()`, ya `ToArray()` call karte ho, sequence `IEnumerable<T>` ban jaati hai aur us point ke baad ke saare operators C# delegates ki tarah tumhari app ki memory me row-by-row chalte hain. Matter isliye karta hai kyunki agar tum jaldi materialise kar do, to ek `Where` jo SQL `WHERE` ho sakta tha wo poori table app me kheench ke filter karega.",
    followUp: "To `AsNoTracking()` kahan fit hota hai is picture me?",
    redFlag: "Ye kehna ki dono same hain aur EF apne aap optimise kar deta hai.",
  },
  {
    id: "linq-iq-2",
    question: "Deferred execution kya hai? Ek example do jahan ye bug ban jaata hai.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "LINQ query build karne pe execute nahi hoti — sirf enumerate karne pe (ToListAsync, foreach). Bug: query variable ko do baar enumerate karna do DB round-trips.",
    detailedAnswer:
      "`var q = _db.Employees.Where(e => e.IsActive);` koi DB call nahi karta. `await q.CountAsync()` phir `await q.ToListAsync()` — do alag SQL statements, do round-trips, aur beech me data badal sakta hai (inconsistent). Doosra classic bug: `foreach` loop ke andar disposed `DbContext` pe deferred query enumerate karna — `ObjectDisposedException`. Fix: query ko ek baar materialise karo (`var list = await q.ToListAsync();`) aur uske baad list pe kaam karo.",
    followUp: "Agar mujhe count aur page dono chahiye ek endpoint me, kaise karoge bina do baar table scan kiye?",
  },
  {
    id: "linq-iq-3",
    question: "Projection (Select to DTO) query me karna vs entity fetch karke controller me map karna — kya farq padta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Query me Select karne se SQL sirf zaroori columns laata hai, no change tracking, kam memory, aur sensitive columns fetch hi nahi hote.",
    detailedAnswer:
      "`.Select(e => new EmployeeListItemDto { Id = e.Id, FullName = e.FullName })` generate karta hai `SELECT [e].[Id], [e].[FullName]` — 2 columns. Pura entity fetch karna `SELECT` sabhi columns karta hai (`Salary`, `PanNumber`, `DateOfJoining`...), un sab objects ko change tracker me daalta hai (memory + CPU), aur phir tum manually map karte ho. BFSI me projection ek security control bhi hai — jo column query me nahi hai wo API response me galti se bhi nahi aa sakta. Related data (`e.Department.Name`) project karne pe EF apne aap `JOIN` add karta hai, `Include` ki zaroorat nahi.",
    redFlag: "Har jagah pura entity fetch karke AutoMapper se DTO banana, chahe list 10 columns ki ho ya 50k rows.",
  },
  {
    id: "linq-iq-4",
    question: "Ye code kya karega?\n```csharp\nvar names = _db.Employees\n    .Where(e => e.IsActive)\n    .Select(e => FormatName(e.FullName))\n    .ToList();\n```\n`FormatName` ek static string helper hai.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "EF Core 3+ pe runtime InvalidOperationException — `FormatName` SQL me translate nahi ho sakta.",
    detailedAnswer:
      "`Select` ke andar arbitrary C# method call EF translate nahi kar sakta. EF Core 3.0 se ye silent client-eval ke bajaye exception phenkta hai: 'The LINQ expression ... could not be translated.' Fix do tarah ke: (1) agar formatting SQL me ho sakta hai (jaise `e.FullName.ToUpper()`), inline likho; (2) agar genuinely C# chahiye, pehle translate-able part project karo phir materialise karke format karo: `.Select(e => e.FullName).ToList().Select(FormatName)`. Purane EF Core 2.x pe ye chalta tha lekin poore result set ko memory me laa ke — ek chhupa hua performance disaster.",
    followUp: "Aur agar `FormatName` `Where` ke andar hota (predicate me) — kya farak?",
  },
  {
    id: "linq-iq-5",
    question: "FirstOrDefaultAsync vs SingleOrDefaultAsync — kab kaunsa? SQL me farak?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "First = pehla match chahiye, `TOP(1)`. Single = exactly ek match expect karo, `TOP(2)` + agar 2 mile to exception.",
    detailedAnswer:
      "`FirstOrDefaultAsync` `SELECT TOP(1)` generate karta hai — jab tumhe bas koi ek match chahiye (aksar `OrderBy` ke saath). `SingleOrDefaultAsync` `SELECT TOP(2)` karta hai aur agar do rows aayi to `InvalidOperationException` deta hai — use tab karo jab business rule kehti hai match unique hona chahiye, jaise PAN number ya Email se lookup. Agar `SingleOrDefault` exception de raha hai to wo tumhare data me duplicate ka signal hai, jise tum silently `First` se chhupana nahi chahte.",
    followUp: "Performance-critical hot path me dono me se kaunsa prefer karoge aur kyun?",
  },
  {
    id: "linq-iq-6",
    question: "Ek endpoint p95 latency 2s dikha raha hai. Repository me hai: `_db.Employees.ToList().Where(e => e.FullName.Contains(term)).Take(20)`. Kya galat hai, kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`ToList()` pehle poori table laa raha hai, filter aur Take C# me chal rahe hain. Filter/Take ko IQueryable pe le jao.",
    detailedAnswer:
      "`ToList()` yahan boundary hai — `SELECT * FROM Employees` chalega, saari rows network + memory me aayengi, phir `Contains`/`Take` C# me. Fix: `await _db.Employees.Where(e => EF.Functions.Like(e.FullName, $\"%{term}%\")).OrderBy(e => e.FullName).Take(20).Select(e => new EmployeeListItemDto{...}).ToListAsync()`. Ab SQL `WHERE ... LIKE ... ORDER BY ... OFFSET/FETCH` karega, sirf 20 projected rows aayengi. `FullName` pe index ho to aur bhi. Bonus: `AsNoTracking()` since read-only.",
    followUp: "`Contains` LIKE me translate hota hai — leading wildcard `%term%` index use kar paayega? Iska kya alternative hai bade data pe?",
    redFlag: "Yeh kehna ki 'cache laga do' bina root cause (poori table materialise) fix kiye.",
  },
  {
    id: "linq-iq-7",
    question: "Query syntax aur method syntax me koi performance ya capability farak hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Nahi — compiler query syntax ko method syntax me convert kar deta hai. Same expression tree, same SQL.",
    detailedAnswer:
      "`from e in _db.Employees where e.IsActive select e` aur `_db.Employees.Where(e => e.IsActive)` bilkul same cheez compile karti hain. Farak sirf readability ka hai — complex `join`/`group by`/`let` wali queries query syntax me kabhi zyada padhne layak hoti hain, baaki 95% code method (lambda) syntax me likha jaata hai kyunki `Skip`/`Take`/`Include`/`AsNoTracking` jaise EF-specific methods query syntax me directly nahi aate.",
  },
  {
    id: "linq-iq-8",
    question: "Existence check ke liye `CountAsync(...) > 0`, `Any(...)`, aur `Where(...).ToList().Count > 0` — teeno me best kaunsa aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`AnyAsync(predicate)` — SQL `EXISTS`, pehle match milte hi ruk jaata hai, koi row transfer nahi.",
    detailedAnswer:
      "`AnyAsync(e => e.Email == email)` generate karta hai `SELECT CASE WHEN EXISTS(...) THEN 1 ELSE 0 END` — DB pehla matching row milte hi return kar deta hai. `CountAsync() > 0` poore matching set ko count karta hai (bekaar kaam agar tumhe sirf haan/na chahiye). `Where(...).ToList().Count > 0` sabse bura — matching rows ko materialise karta hai app memory me sirf ye jaanne ke liye ki koi hai ya nahi.",
    followUp: "Aur `.Any()` bina predicate ke, `IQueryable` pe — wo bhi `EXISTS` banta hai?",
  },
];

export default questions;
