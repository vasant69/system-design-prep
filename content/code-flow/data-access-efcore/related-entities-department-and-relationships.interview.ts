import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rel-iq-1",
    question:
      "EF Core me one-to-many relationship kaise define karte ho? `Employee` aur `Department` ka example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "FK property (`Employee.DepartmentId`) + reference navigation (`Employee.Department`) + collection navigation (`Department.Employees`), aur `OnModelCreating` me `HasOne(e => e.Department).WithMany(d => d.Employees).HasForeignKey(e => e.DepartmentId).OnDelete(...)`.",
    detailedAnswer:
      "Entities me: `Department` ke paas `ICollection<Employee> Employees`, `Employee` ke paas `int DepartmentId` (FK column) aur `Department Department` (reference nav). EF convention `DepartmentId` ko FK maan leta hai, par explicit config clear hai:\n```csharp\nmodelBuilder.Entity<Employee>()\n    .HasOne(e => e.Department)\n    .WithMany(d => d.Employees)\n    .HasForeignKey(e => e.DepartmentId)\n    .OnDelete(DeleteBehavior.Restrict);\n```\n`HasOne` Employee ki taraf se ek Department, `WithMany` doosri taraf se many Employees — dono navigation link ho jaate hain. Explicit `DepartmentId` property rakhna best practice hai kyunki tum bina poora `Department` load kiye employee ka department set/filter kar sakte ho.",
    followUp: "Agar `Employee` me sirf `Department` navigation ho, `DepartmentId` property na ho, to EF kya karega?",
    redFlag: "Ye kehna ki relationship ke liye dono taraf collection/navigation properties zaroori hain — one-way navigation bhi valid hai.",
  },
  {
    id: "rel-iq-2",
    question: "N+1 query problem kya hai aur EF Core me use kaise fix karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "1 parent list query, phir loop me har parent ki related navigation touch karne se N alag child queries — 500 parents matlab 501 queries. Fix: `Include`, ya list ke liye behtar, projection.",
    detailedAnswer:
      "N+1 tab hota hai jab tum `_db.Employees.ToListAsync()` (1 query) karte ho aur phir `foreach` me `e.Department.Name` touch karte ho — lazy loading ya explicit per-item load har iteration pe ek `SELECT ... FROM Departments WHERE Id = @p` maar deta hai. EF logs me ye ek parent SELECT ke baad barah-barah same-shape child SELECT ke roop me dikhta hai. Fix 1: eager load `_db.Employees.Include(e => e.Department)` — ek JOIN, ek round-trip. Fix 2 (list/read endpoints ke liye best): projection `.Select(e => new EmployeeListItemDto { DeptName = e.Department.Name })` — EF khud JOIN add karta hai aur sirf zaroori columns aate hain, tracking bhi off. Lazy loading proxies is problem ko chhupa dete hain isliye web API me aksar off rakhe jaate hain.",
    followUp: "EF Core logs me N+1 ka fingerprint exactly kaisa dikhta hai?",
    redFlag: "Fix ke naam pe 'cache laga do' bolna bina query pattern samjhe.",
  },
  {
    id: "rel-iq-3",
    question:
      "Eager, explicit, aur lazy loading me farak batao. Web API me kaunsa avoid karte ho aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Eager = `Include` (query ke saath JOIN). Explicit = baad me `Entry(...).Collection(...).LoadAsync()`. Lazy = proxies auto-query on navigation access. Web API me lazy avoid — hidden N+1, serialization query-storm, `ObjectDisposedException`.",
    detailedAnswer:
      "Eager loading: `_db.Employees.Include(e => e.Department).ThenInclude(...)` — related data usi query me JOIN se aata hai, tab use karo jab tumhe poore entities chahiye. Explicit loading: pehle parent load karo, phir on demand `await _db.Entry(dept).Collection(d => d.Employees).LoadAsync(ct)` — jab parent hamesha chahiye par children kabhi-kabhi. Lazy loading: `Microsoft.EntityFrameworkCore.Proxies` + `UseLazyLoadingProxies()` + har navigation `virtual`; phir navigation access karte hi EF chupke se query maar deta hai. Web API me lazy loading khatarnak hai kyunki (a) ek innocent property access DB call ban jaata hai — N+1 ka sabse bada source, (b) JSON serializer har navigation touch karke queries ki jhadi laga deta hai, (c) `DbContext` dispose hone ke baad access `ObjectDisposedException`. Isliye teams explicit `Include`/projection prefer karti hain — control me rehta hai kab kya load hoga.",
    followUp: "Lazy loading ke liye navigation properties `virtual` kyun honi chahiye?",
    redFlag: "Lazy loading ko 'convenient default' bata ke recommend karna production web API ke liye.",
  },
  {
    id: "rel-iq-4",
    question:
      "`DeleteBehavior` options kaunse hain? BFSI `Department -> Employee` relationship ke liye kaunsa aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`Cascade`, `Restrict`, `SetNull`, `ClientSetNull`/`NoAction`. `Department -> Employee` ke liye `Restrict` — department delete tab hi jab usme koi employee na ho; audit/integrity safe rehti hai.",
    detailedAnswer:
      "`Cascade`: parent delete hote hi child rows bhi delete — sirf tab jab child ka parent ke bina koi matlab hi na ho (jaise `OrderLine` under `Order`). `Restrict` (effectively `NoAction`): child rows exist karti hain to parent delete DB error deta hai. `SetNull`: child ka FK `null` ho jaata hai (FK nullable hona chahiye). BFSI me `Department -> Employee` pe `Cascade` chhodna disaster hai — ek test department delete karne se 1200 employees aur unke audit-log rows silently ud sakte hain, backup restore karna padega. Isliye standard: har parent-child pe `OnDelete` explicitly set karo, aksar `Restrict`. Employee ko department se alag karna ho to pehle use kisi doosre department me move karo, department khaali hone par hi delete.",
    followUp: "Agar `Employee.DepartmentId` ko nullable bana dein to `SetNull` acceptable hai kya BFSI me?",
    redFlag: "EF ke default delete behaviour pe bharosa karna bina explicitly likhe.",
  },
  {
    id: "rel-iq-5",
    question:
      "Ye repository method review me aaya. Kya galat hoga runtime pe?\n```csharp\nvar emp = await _db.Employees.FirstOrDefaultAsync(e => e.Id == id, ct);\nreturn emp.Department.Name;\n```\nLazy loading proxies OFF hain.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`NullReferenceException` — proxies off hone par `emp.Department` `null` hai jab tak `Include` ya explicit load na ho. (Aur `emp` khud `null` ho sakta hai agar id match na kare.)",
    detailedAnswer:
      "Proxies off means navigation properties automatically populate nahi hoti. `FirstOrDefaultAsync` sirf `Employees` table ki row laata hai — `emp.Department` `null` rahega, aur `.Name` pe `NullReferenceException`. Fix options: `_db.Employees.Include(e => e.Department).FirstOrDefaultAsync(...)`, ya projection `_db.Employees.Where(e => e.Id == id).Select(e => e.Department.Name).FirstOrDefaultAsync(...)`. Alag se, `emp` bhi `null` ho sakta hai agar koi employee us id se na mile — us case ko bhi handle karo (`if (emp is null) return null;`). Do bugs ek line me.",
    followUp: "Projection wala version aur `Include` wala version — generated SQL me kya farak hoga?",
    redFlag: "Ye kehna ki EF navigation ko 'kabhi na kabhi apne aap' load kar lega proxies off hone par bhi.",
  },
  {
    id: "rel-iq-6",
    question:
      "Ek endpoint pe `.Include(e => e.Department).Include(e => e.Documents).Include(e => e.Projects)` lagaya aur response phool gaya. Kya ho raha hai aur fix kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Multiple collection includes ek single JOIN me cartesian explosion karte hain — rows parent x child1 x child2 tak multiply. Fix: `.AsSplitQuery()`, ya list endpoint ko projection me badlo.",
    detailedAnswer:
      "Do ya zyada collection navigations ek hi query me `Include` karo to EF ek bada JOIN banata hai jisme har employee ki row uske har document x har project ke combination ke liye repeat hoti hai — 2000 employees x 5 docs x 3 projects = 30000 rows wire pe, 40MB response, SQL Server memory-grant warnings, p99 seconds me. Fix 1: `.AsSplitQuery()` — EF har included collection ke liye alag SELECT chalata hai (N collections = N+1 chhoti queries), duplicate data khatam; trade-off multiple round-trips aur single-transaction consistency thodi kamzor. Fix 2 (behtar for lists): endpoint ko projection me badlo — sirf `Id`, `FullName`, `DepartmentName` — aur detail endpoint pe hi `AsSplitQuery()` ke saath full graph do. Ek real case me p99 12s se 250ms aa gaya.",
    followUp: "Single collection `Include` ke liye bhi `AsSplitQuery()` lagana chahiye kya?",
    redFlag: "`AsSplitQuery()` ko har jagah default bana dena bina consistency trade-off samjhe.",
  },
  {
    id: "rel-iq-7",
    question: "Explicit `DepartmentId` FK property rakhne ke kya fayde hain shadow property ke muqable?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Explicit FK se tum bina poora `Department` load kiye employee ka department set/change/filter kar sakte ho, aur DTOs me FK id directly expose/bind kar sakte ho.",
    detailedAnswer:
      "Agar tum sirf `Employee.Department` navigation rakho, EF ek 'shadow' FK property (`DepartmentId`) model me bana leta hai jo C# code me visible nahi hoti. Explicit `int DepartmentId` property rakhne se: (1) POST/PUT me client `departmentId` bhejta hai, tum seedha `employee.DepartmentId = dto.DepartmentId` set karte ho bina `Departments` table hit kiye; (2) `Where(e => e.DepartmentId == 5)` filter bina navigation ke; (3) migrations aur queries padhne me clear. Shadow property use karni ho to `EF.Property<int>(employee, \"DepartmentId\")` likhna padta hai — verbose aur refactor-unsafe. Best practice: FK property hamesha explicit.",
    followUp: "Nullable relationship chahiye to `DepartmentId` ko `int?` banana kaafi hai ya aur kuch?",
  },
  {
    id: "rel-iq-8",
    question:
      "Interviewer: 'Tum `Include` kab use karoge aur projection kab?' — ek clear rule do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Projection = list/read endpoints ka default (kam columns, no tracking, no N+1). `Include` = jab tumhe poore entities chahiye — update ke liye ya business logic jo poore object graph pe chale.",
    detailedAnswer:
      "Projection (`.Select` to DTO): read-only scenarios jahan sirf kuch fields chahiye — response chhota, change tracker pe load nahi, sensitive columns (`Salary`, `PanNumber`) fetch hi nahi hote, N+1 nahi. `Include`: jab tum entities ko modify karke `SaveChangesAsync` karne wale ho, ya koi domain method poore graph (employee + department + documents) pe chalti hai. Explicit loading: parent hamesha, children conditionally. Lazy loading: sirf tab jab team ne consciously decide kiya ho aur serialization boundary control me ho — web API me aksar avoid. Code review me ye decision roz aata hai; default projection, `Include` jab justify ho.",
    followUp: "Ek `PUT /employees/{id}` me tum entity `Include` ke saath load karoge ya projection? Kyun?",
    redFlag: "Har jagah `Include` lagana 'safe rahega' soch ke, ya har jagah projection karke update-path tod dena.",
  },
];

export default questions;
