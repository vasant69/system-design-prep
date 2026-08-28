import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ef-core-dbcontext-and-dbset-1",
    question: "AppDbContext me `public DbSet<Employee> Employees` property ka kya matlab hai?",
    options: [
      "Employee class ke andar ek list property",
      "Employees table, jiski har row ek Employee object hai — query/add/remove isi ke through hote hain",
      "Ek in-memory cache jo sirf pehli query ke baad populate hoti hai",
      "Ek SQL view jo read-only hai",
    ],
    correctIndex: 1,
    explanation:
      "`DbSet<Employee>` ek table ko map karta hai (naam by convention property se — `Employees`). Iske through hi `_db.Employees.Where(...)`, `.Add(...)`, `.Remove(...)` hote hain. Option A galat — DbSet context pe hoti hai, entity pe nahi. Option C galat — DbSet lazy cache nahi, ek queryable table handle hai; caching change tracker ka alag concern hai. Option D galat — DbSet by default read-write hai, view nahi.",
    difficulty: "easy",
  },
  {
    id: "ef-core-dbcontext-and-dbset-2",
    question: "Salary (decimal) property ke liye `entity.Property(e => e.Salary).HasPrecision(18, 2)` kyun likhte hain?",
    options: [
      "Taaki Salary NULL na ho sake",
      "Taaki column decimal(18, 2) bane — 18 total digits, 2 decimal places — aur EF Core ki precision warning na aaye",
      "Taaki Salary pe ek unique index ban jaaye",
      "Taaki Salary sirf positive values le",
    ],
    correctIndex: 1,
    explanation:
      "`HasPrecision(18, 2)` column ko `decimal(18, 2)` banata hai aur money ke liye explicit precision set karta hai; iske bina EF Core default deta hai lekin build-time warning bhi. Option A `IsRequired()` ka kaam hai. Option C `HasIndex(...).IsUnique()` ka. Option D ke liye check constraint chahiye — precision ka isse koi lena-dena nahi. Money hamesha decimal + explicit precision, kabhi double/float nahi.",
    difficulty: "medium",
  },
  {
    id: "ef-core-dbcontext-and-dbset-3",
    question: "AppDbContext ka constructor `AppDbContext(DbContextOptions<AppDbContext> options) : base(options)` — ye `options` object kahan se aata hai?",
    options: [
      "Hum khud `new DbContextOptions<AppDbContext>()` banate hain har query se pehle",
      "EF Core reflection se runtime pe generate karta hai",
      "Program.cs me `AddDbContext<AppDbContext>(o => o.UseSqlServer(...))` ise configure karke DI container me daalta hai, aur DI constructor me inject karta hai",
      "appsettings.json se automatically deserialize hota hai",
    ],
    correctIndex: 2,
    explanation:
      "`AddDbContext` provider aur connection string ke saath `DbContextOptions` configure karke register karta hai; jab kisi ko `AppDbContext` chahiye, DI woh options constructor me pass karta hai. Option A galat aur anti-pattern — hum options manually nahi banate. Option B galat — options config-driven hai, reflection-generated nahi. Option D galat — connection string appsettings se aati hai, lekin options object AddDbContext banata hai.",
    difficulty: "medium",
  },
  {
    id: "ef-core-dbcontext-and-dbset-4",
    question: "In-memory list wale `InMemoryEmployeeRepository` ke muqable EF Core-backed approach ka sabse bada practical fayda kya hai (is topic ke context me)?",
    options: [
      "Code kam likhna padta hai kyunki EF Core controller khud generate karta hai",
      "Data process restart ke baad bhi bacha rehta hai, aur schema/constraints (unique Email, precision) database enforce karta hai",
      "EF Core hamesha in-memory list se tez hota hai",
      "EF Core ke saath DTOs ki zaroorat khatam ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Asli database persistence deta hai (restart-safe) aur constraints DB level pe enforce hote hain — unique index, NOT NULL, decimal precision. Option A galat — controller EF Core generate nahi karta; hum repository badalte hain. Option C galat — pure in-memory reads aksar tez hote hain; point persistence + integrity hai, raw speed nahi. Option D galat — DTOs ka kaam (entity ko expose na karna) waisa hi rehta hai.",
    difficulty: "easy",
  },
];

export default quiz;
