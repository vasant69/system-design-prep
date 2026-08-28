import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "the-repository-pattern-1",
    question:
      "`IEmployeeRepository` ke andar kya hona chahiye aur kya nahi?",
    options: [
      "Pure CRUD jaise `GetById`, `Add`, `Remove` plus query helpers jaise `EmailExists` — koi business rule nahi",
      "CRUD plus 'duplicate email allowed nahi' rule plus PAN validation",
      "CRUD plus DTO mapping (`Employee` se `EmployeeDto`)",
      "Sirf ek `IQueryable<Employee> Query()` method jise callers filter karein",
    ],
    correctIndex: 0,
    explanation:
      "Repository ka ek hi kaam: entity ko store se laana aur rakhna. `EmailExists` ek pure data query hai, isliye theek hai; lekin 'duplicate email reject karo' ek decision hai jo Service me rehta hai. DTO mapping bhi Service ka kaam — repository domain entity return karta hai. Ek generic `IQueryable Query()` expose karna EF ka detail leak karta hai aur `InMemory` implementation use honestly nibha nahi sakti.",
    difficulty: "easy",
  },
  {
    id: "the-repository-pattern-2",
    question:
      "Module 4 me storage `static List` se EF Core + SQL Server ho jaayega. Repository pattern hone se kya-kya rewrite karna padega?",
    options: [
      "`EmployeeService` aur `EmployeesController` dono, kyunki data access unke andar hai",
      "Sirf `EmployeeService`, kyunki wo LINQ queries rakhti hai",
      "Sirf ek naya `EfEmployeeRepository` (ya `InMemoryEmployeeRepository` ko badalna) — Service aur Controller untouched",
      "`IEmployeeRepository` interface, kyunki uske method signatures EF ke hisaab se badlenge",
    ],
    correctIndex: 2,
    explanation:
      "Yahi repository ka main faayda hai: data access ek implementation class me contain hai. `EfEmployeeRepository : IEmployeeRepository` likho, `Program.cs` ki ek registration line badlo — Service aur Controller ki koi line nahi badalti. Agar signatures async ho jaayein (`Task<...>`) to interface aur callers thoda badalte hain, lekin wo ek alag choice hai; core CRUD contract same reh sakta hai.",
    difficulty: "medium",
  },
  {
    id: "the-repository-pattern-3",
    question:
      "Claim: repository over EF Core is an anti-pattern. Is claim ka sabse strong technical point kya hai?",
    options: [
      "Repository classes compile time badha deti hain",
      "EF Core ka `DbContext` khud already Repository plus Unit-of-Work hai, aur ek generic repo jo `IQueryable` chhupata hai server-side query composition maar deta hai",
      "Repository pattern SOLID ke against hai",
      "EF Core interfaces support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "`DbSet<T>` ek repository jaisa hai aur `SaveChanges()` unit-of-work commit hai, to ek aur repository redundant lag sakti hai. Aur agar repository `IEnumerable` return kare to filtering/paging memory me hoti hai (`GetAll()` phir `.Where()`), ya har filter ke liye ek naya method banta hai. Ye points valid hain — isliy counter ye hai ki ek *specific* repo jo *materialized* entities return kare (IQueryable nahi) mostly uncontroversial hai. Repository SOLID ke against nahi hai, aur EF Core interfaces perfectly support karta hai.",
    difficulty: "hard",
  },
  {
    id: "the-repository-pattern-4",
    question:
      "Generic `IRepository<T>` vs specific `IEmployeeRepository` — specific ka sabse bada practical faayda?",
    options: [
      "Kam code likhna padta hai",
      "Har entity ke liye bilkul same API milta hai",
      "Aggregate-specific, intention-revealing methods (`EmailExists`, `GetActiveInDepartment`) fit ho jaate hain bina `IQueryable` leak kiye, aur cross-cutting filters ek jagah enforce hote hain",
      "Generic repository .NET me compile nahi hota",
    ],
    correctIndex: 2,
    explanation:
      "Generic `IRepository<T>` kam code deta hai aur consistent shape deta hai — wo iska faayda hai, specific ka nahi. Specific ka faayda: har method ek named, meaningful, testable operation hai; koi `IQueryable` leak nahi; aur branch/tenant/soft-delete jaise filters ek spot par lagte hain. Generic repository theek se compile hota hai — issue design ka hai, syntax ka nahi.",
    difficulty: "medium",
  },
];

export default quiz;
