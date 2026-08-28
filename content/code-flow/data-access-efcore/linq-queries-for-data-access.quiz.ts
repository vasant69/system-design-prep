import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "linq-1",
    question: "`_db.Employees.Where(e => e.IsActive).OrderBy(e => e.FullName)` likhne ke baad, next line se pehle database pe kya chala?",
    options: [
      "Ek SELECT query with WHERE and ORDER BY",
      "Kuch nahi — deferred execution, query sirf describe hui hai",
      "Do queries — ek WHERE ke liye, ek ORDER BY ke liye",
      "Poori Employees table memory me load ho gayi",
    ],
    correctIndex: 1,
    explanation:
      "`IQueryable` pe LINQ operators sirf expression tree build karte hain — koi DB call nahi hoti jab tak query enumerate na ho (`ToListAsync`, `FirstOrDefaultAsync`, `foreach`). Isi ko deferred execution kehte hain. Option A/C galat — SQL tabhi banta hai jab terminal operator aata hai, aur poori chain ek hi statement banti hai. Option D tab hota jab `AsEnumerable()`/`ToList()` beech me hota, jo yahan nahi hai.",
    difficulty: "medium",
  },
  {
    id: "linq-2",
    question: "Kaunsa code poori Employees table (200k rows) app ki memory me le aayega?",
    options: [
      "_db.Employees.Where(e => e.DepartmentId == 5).FirstOrDefaultAsync()",
      "_db.Employees.AsEnumerable().Where(e => e.DepartmentId == 5).FirstOrDefault()",
      "_db.Employees.CountAsync(e => e.IsActive)",
      "_db.Employees.AnyAsync(e => e.Email == email)",
    ],
    correctIndex: 1,
    explanation:
      "`AsEnumerable()` boundary cross kar deta hai — us point pe EF `SELECT * FROM Employees` chalata hai aur saari rows materialise karta hai, phir `Where`/`FirstOrDefault` C# me chalte hain. Option A ka `Where` `IQueryable` pe hai to SQL me `WHERE ... TOP(1)` banta hai. Option C ek `COUNT(*)` hai. Option D ek `EXISTS` hai. Teeno DB pe chalte hain, chhota result laate hain.",
    difficulty: "medium",
  },
  {
    id: "linq-3",
    question: "`_db.Employees.Where(e => IsSenior(e)).ToListAsync()` — `IsSenior` ek private C# helper method hai. EF Core 8 pe kya hoga?",
    options: [
      "Theek chalega, EF method ko SQL me convert kar dega",
      "Runtime InvalidOperationException — 'could not be translated'",
      "Compile error — lambda me method call allowed nahi",
      "Poori table load hogi aur filter chupke se C# me chalega",
    ],
    correctIndex: 1,
    explanation:
      "EF Core `IsSenior` ka body (compiled IL) padh ke SQL nahi bana sakta — usse expression tree chahiye. EF Core 3.0 se aise cases silent client-evaluation ke bajaye runtime exception dete hain. Option A galat — arbitrary C# method translate nahi hota. Option C galat — compile ho jaata hai, error runtime pe aata hai. Option D purane EF Core 2.x ka behaviour tha, ab nahi. Fix: predicate inline likho (`e => e.DateOfJoining < cutoff`).",
    difficulty: "hard",
  },
  {
    id: "linq-4",
    question: "Ek list endpoint ke liye sabse behtar approach kya hai jab client ko sirf Id, Name, Email chahiye?",
    options: [
      "_db.Employees.ToListAsync() phir controller me manually DTO banao",
      "_db.Employees.Select(e => new EmployeeListItemDto { Id = e.Id, FullName = e.FullName, Email = e.Email }).ToListAsync()",
      "_db.Employees.Include(e => e.Department).ToListAsync()",
      "SQL string haath se likho aur ExecuteSqlRaw se chalao",
    ],
    correctIndex: 1,
    explanation:
      "Query ke andar projection karne se generated SQL sirf 3 columns `SELECT` karta hai — kam data transfer, kam memory, change tracker pe load nahi, aur `Salary`/`PanNumber` jaise sensitive fields kabhi fetch hi nahi hote. Option A pura entity laata hai (bekaar columns + tracking). Option C aur bhi zyada data laata hai (Department bhi). Option D injection risk aur refactor-unsafe, aur yahan zaroorat hi nahi.",
    difficulty: "medium",
  },
];

export default quiz;
