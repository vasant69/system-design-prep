import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "related-entities-department-and-relationships-1",
    question:
      "EF Core me `Employee` aur `Department` ke beech one-to-many relationship ke teen hisse kaunse hain?",
    options: [
      "Ek `[ForeignKey]` attribute, ek `[Required]` attribute, ek `[Key]` attribute",
      "FK property (`Employee.DepartmentId`), reference navigation (`Employee.Department`), collection navigation (`Department.Employees`)",
      "Ek primary key, ek unique index, ek check constraint",
      "`HasOne`, `HasMany`, `HasData` — teenon `OnModelCreating` me",
    ],
    correctIndex: 1,
    explanation:
      "Relationship banti hai: FK property jo actual column hai (`DepartmentId`), reference navigation jo ek employee ka department object deta hai, aur collection navigation jo department ke saare employees deta hai. Option A/C DB constraints hain, relationship ka structure nahi. Option D galat mix hai — configuration `HasOne(...).WithMany(...)` se hoti hai, `HasMany`/`HasData` yahan relevant nahi.",
    difficulty: "easy",
  },
  {
    id: "related-entities-department-and-relationships-2",
    question:
      "500 employees ki list par loop chala ke `e.Department.Name` access kar rahe ho, lazy loading proxies on hain, koi `Include` nahi. Kitni DB queries chalti hain?",
    options: [
      "1 — EF sab kuch ek JOIN me le aata hai",
      "2 — ek employees ke liye, ek saare departments ke liye",
      "501 — 1 employees query + 500 alag Department queries (N+1)",
      "0 — data already memory me hai",
    ],
    correctIndex: 2,
    explanation:
      "Ye classic N+1: 1 parent query employees laati hai, phir loop me har employee ki `Department` navigation touch hote hi lazy loading ek naya `SELECT ... FROM Departments WHERE Id = @p` maar deta hai — 500 baar. Total 1 + 500 = 501. Fix: `Include(e => e.Department)` (1 JOIN) ya projection `.Select(e => new Dto { DeptName = e.Department.Name })`. Option A tab sach hota jab `Include` hota. Option B galat — EF per-row query karta hai, ek batch nahi.",
    difficulty: "medium",
  },
  {
    id: "related-entities-department-and-relationships-3",
    question:
      "`.OnDelete(DeleteBehavior.Restrict)` ka kya asar hai jab tum ek department delete karne ki koshish karo jisme abhi employees hain?",
    options: [
      "Department delete ho jaata hai aur uske saare employees bhi delete ho jaate hain",
      "Department delete ho jaata hai aur employees ka `DepartmentId` `null` ho jaata hai",
      "DB error deta hai — parent delete block ho jaata hai jab tak child rows exist karti hain",
      "EF chupke se pehle saare employees ko doosre department me move kar deta hai",
    ],
    correctIndex: 2,
    explanation:
      "`Restrict` ka matlab: agar child rows (employees) hain to parent (department) delete nahi hone dega — DB constraint error uthta hai. BFSI me audit/integrity ke liye yahi safe default hai. Option A `Cascade` ka behaviour hai (khatarnak — saare employees ud jaate). Option B `SetNull` ka (tab `DepartmentId` nullable hona chahiye). Option D EF kabhi nahi karta.",
    difficulty: "medium",
  },
  {
    id: "related-entities-department-and-relationships-4",
    question:
      "Ek `GET /api/employees` list endpoint jise sirf `Id`, `FullName`, aur department ka naam chahiye — sabse behtar approach kaunsa hai?",
    options: [
      "`_db.Employees.Include(e => e.Department).ToListAsync()` phir controller me map karo",
      "`_db.Employees.Select(e => new EmployeeListItemDto { Id = e.Id, FullName = e.FullName, DepartmentName = e.Department.Name }).AsNoTracking().ToListAsync()`",
      "Lazy loading proxies on karo aur entity ko directly serialize kar do",
      "`_db.Employees.ToListAsync()` phir har employee ke liye `_db.Departments.FindAsync(e.DepartmentId)`",
    ],
    correctIndex: 1,
    explanation:
      "Projection me EF sirf 3 columns `SELECT` karta hai, `Department.Name` touch karne se `JOIN` khud add ho jaata hai, no change tracking, no N+1, aur `Salary`/`PanNumber` jaise sensitive columns fetch hi nahi hote. Option A poora entity + department entity laata hai (extra columns, tracking). Option C serializer har navigation touch karke query-storm aur circular-reference risk deta hai. Option D N+1 hi hai, bas explicit.",
    difficulty: "medium",
  },
];

export default quiz;
