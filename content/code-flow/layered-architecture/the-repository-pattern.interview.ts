import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "repo-pattern-1",
    question:
      "Repository pattern kya hai? Aur Service layer se alag Repository layer kyun chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer:
      "Repository data access ko ek interface ke peeche rakhta hai jisme sirf CRUD hai. Service business rules rakhti hai; repository sirf store se laata-rakhta hai. Alag isliye taaki storage badle to Service na badle, aur Service bina DB ke test ho.",
    detailedAnswer:
      "`IEmployeeRepository` ek contract hai: `GetAll`, `GetById`, `EmailExists`, `Add`, `Update`, `Remove` — koi rule nahi, koi DTO nahi, koi HTTP nahi. `InMemoryEmployeeRepository` aaj ek `static List` wrap karta hai; module 4 me `EfEmployeeRepository` `DbContext` wrap karega — same interface, isliye `EmployeeService` untouched. Faayde: (1) storage swap ek file me contain, (2) EF Core types (`IQueryable`, `Include`, tracking) domain se bahar, (3) Service tests ek plain `List`-backed fake se chalte hain, koi DB/provider nahi, (4) query logic ka ek naam aur ek jagah, cross-cutting filters (branch/tenant/soft-delete) ek spot pe.",
    followUp:
      "Repository `Employee` entity return kare ya `EmployeeDto`? Kyun?",
    redFlag:
      "Repository me duplicate-email ya PAN validation daal dena — 'wahi to data hai'. Rule Service ka kaam hai, repository ka nahi.",
  },
  {
    id: "repo-pattern-2",
    question:
      "“Repository over EF Core is an anti-pattern” — is baat pe tumhari kya position hai? Dono side batao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Dono side valid hain. EF ka `DbContext` khud repo + unit-of-work hai, aur generic repo jo `IQueryable` chhupaye query composition maar deta hai. Lekin specific repo jo materialized entities de, wo aaj bhi useful hai — testing aur cross-cutting filters ke liye.",
    detailedAnswer:
      "Against: `DbSet<T>` already ek repository jaisa hai; `SaveChanges()` unit-of-work commit hai; ek generic `IRepository<T>` jo `IEnumerable` return kare filtering ko memory me le jaata hai ya method explosion (`GetActiveByDepartment`, `GetJoinedAfter`) deta hai; aur EF Core InMemory / SQLite in-memory se `DbContext` bina wrapper ke bhi test ho jaata hai. For: LINQ-to-Entities aur EF types Service/domain se bahar rehte hain; query logic named aur ek jagah; branch/tenant/soft-delete filter ek spot pe enforce; genuine multi-provider swap (EF default, Dapper hot paths) possible; unit tests ko koi provider nahi chahiye. Pragmatic line: ek *specific* `IEmployeeRepository` jo entities return kare — theek. Ek *generic* `IRepository<T>` jo `IQueryable<T>` leak kare — wahi anti-pattern wali complaint sach ho jaati hai.",
    followUp:
      "Agar tum generic base repository chahte ho bina IQueryable leak kiye, kaise design karoge?",
    redFlag:
      "Ek side ko blindly 'anti-pattern hai bas' bol dena bina EF ke DbContext = repo + UoW wali baat samjhe.",
  },
  {
    id: "repo-pattern-3",
    question:
      "Ye repository method review me aaya:\n```csharp\npublic IQueryable<Employee> GetAll() => _context.Employees;\n```\nProblem kya hai aur fix kya?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`IQueryable` leak ho raha hai — callers ab EF ke against arbitrary LINQ compose kar sakte hain, cross-cutting filters bypass, aur in-memory implementation is contract ko honestly nahi nibha sakti.",
    detailedAnswer:
      "`IQueryable` return karne se query ka execution caller ke paas chala jaata hai, jahan wo `.Where().Include().OrderBy()` kuch bhi laga sakta hai. Isse teen dikkatein: (1) `InMemoryEmployeeRepository` ko `IQueryable` par LINQ-to-Objects milega, EF ko LINQ-to-Entities — behaviour (case sensitivity, null handling, `string.Contains`) alag, to test-vs-prod mismatch; (2) branch-scoping ya soft-delete filter jo repository me lagna tha wo skip ho sakta hai; (3) `DbContext` scope se bahar query chali to `ObjectDisposedException`. Fix: materialized aur intention-revealing methods — `IReadOnlyList<Employee> GetAll()`, `IReadOnlyList<Employee> GetActiveInDepartment(int departmentId)` — jo andar `.ToList()` kar ke deti hain.",
    redFlag:
      "'IQueryable dena flexible hai' — leaky abstraction ko feature samajhna.",
  },
  {
    id: "repo-pattern-4",
    question:
      "In-memory repository me `Update(Employee employee)` ka body khaali hai. Wo method interface me kyun rakha hai phir?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "In-memory me `GetById` jo object deta hai wo wahi reference hai jo list me hai, to fields badalne se list already updated — kuch persist nahi karna. Method interface me isliye hai kyunki EF Core version me yahan `SaveChanges` aayega.",
    detailedAnswer:
      "Interface aaj ke ek implementation ke liye nahi, sab (future EF Core included) ke liye design hota hai. `InMemoryEmployeeRepository.Update` no-op hai kyunki reference semantics; `EfEmployeeRepository.Update` me `_context.Employees.Update(employee); _context.SaveChanges();` hoga. Agar tum method hata do to module 4 me interface aur saare callers badalne padenge — jo poore repository pattern ka point maar deta hai.",
    followUp:
      "Agar `GetById` ne entity ki ek copy (clone) di hoti, to `Update` ka behaviour kaise badalta?",
  },
  {
    id: "repo-pattern-5",
    question:
      "`_nextId++` aur Id assignment pehle Service me tha, ab tumne Repository ke `Add` me daala. Kyun?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Id generate karna ek persistence concern hai, business rule nahi. Database identity/sequence se yahi kaam karta hai — data-access layer me. Service ko sirf 'employee valid hai kya' dekhna hai.",
    detailedAnswer:
      "Rule of thumb: agar koi cheez storage technology ke saath badal jaayegi, wo Repository me hai. In-memory me Id ek counter se aata hai; SQL me `IDENTITY` column se; Cosmos me ek GUID se. Service ko in me se kisi ka pata nahi hona chahiye — wo bas `_repo.Add(employee)` call karti hai aur Repository saved entity (Id ke saath) wapas deta hai. Duplicate-email aur PAN check Service me rehte hain kyunki wo har storage me same hain — wo domain rules hain.",
    followUp:
      "Module 4 me EF Core Id kab set karta hai — `Add()` ke turant baad ya `SaveChanges()` ke baad?",
    redFlag:
      "Id generation ko 'business logic' keh dena, ya duplicate-email check ko repository me daal dena.",
  },
  {
    id: "repo-pattern-6",
    question:
      "Ek nightly CSV-import job aur REST API dono employees create karte hain. Repository pattern isme kaise help karta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Dono `IEmployeeService` call karte hain, jo `IEmployeeRepository` call karti hai. Rules (duplicate email, PAN) ek jagah, aur storage swap dono callers ke liye ek saath hota hai.",
    detailedAnswer:
      "Job aur controller alag entry points hain lekin same Service + Repository stack reuse karte hain. Faayde: (1) PAN/duplicate-email rule sirf `EmployeeService` me — job usse skip nahi kar sakti; (2) module 4 me `InMemoryEmployeeRepository` se `EfEmployeeRepository` swap dono callers ke liye ek registration change; (3) job ke tests ek fake repository ke against chalte hain, koi DB nahi. Agar rules controller me hote aur job ne unhe copy kiya hota, to ek din regex fix ek jagah hota aur doosri jagah reh jaata — hazaaron galat PAN rows, BFSI audit penalty.",
    followUp:
      "Job bulk insert karta hai — 50,000 rows. In-memory `Add` ek-ek kar ke; EF me tum isko kaise optimize karoge?",
  },
  {
    id: "repo-pattern-7",
    question:
      "Kab Repository pattern skip karna theek hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Chhota app, storage kabhi nahi badlega, aur team EF Core InMemory / SQLite ke against test karne me comfortable hai — tab `Service -> DbContext` seedha acceptable hai.",
    detailedAnswer:
      "Repository ki cost: per-aggregate ek interface + impl file aur ek indirection hop. Agar app 3-endpoint admin tool hai, ya team ne decide kiya EF Core hi rahega aur integration tests SQLite in-memory se honge, to wrapper value add nahi karta. Lekin agar tumhe provider-free unit tests chahiye, multiple data sources possible hain, ya cross-cutting query filters chahiye — repository justified hai. Sabse bura middle ground: ek generic `IRepository<T>` jo `IQueryable` deta hai — na testability milti hai na encapsulation.",
    redFlag:
      "'Har project me repository, hamesha, generic base ke saath' — context ke bina cargo-culting.",
  },
];

export default questions;
