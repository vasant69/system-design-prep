import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "solid-principles-as-refactors-1",
    question:
      "Hamare `EmployeeService.CreateAsync` me validation, external PAN call, mapping, DB save aur welcome email — sab ek hi method me hai. Ye sabse seedha kaunsa SOLID principle todta hai?",
    options: [
      "Open/Closed Principle",
      "Single Responsibility Principle",
      "Liskov Substitution Principle",
      "Dependency Inversion Principle",
    ],
    correctIndex: 1,
    explanation:
      "SRP kehta hai ek class ke paas badalne ki sirf ek wajah honi chahiye. Yahan paanch wajah hain (validation rules, PAN API contract, mapping, DB, email template) — clear SRP violation. OCP variation-axis ke baare me hai, yahan wo primary issue nahi. LSP substitution ke baare me hai — koi inheritance/override yahan involved nahi. DIP already satisfied hai kyunki service interfaces (`IEmployeeRepository`) pe depend karti hai, concrete class pe nahi.",
    difficulty: "easy",
  },
  {
    id: "solid-principles-as-refactors-2",
    question:
      "Payroll me `if (grade == \"L1\") ... else if (grade == \"L2\") ...` chain ko `ISalaryRule` strategies me convert kiya. `SalaryCalculator` ka constructor `IEnumerable<ISalaryRule>` leta hai. Naya grade \"L5\" add karne ke liye kya karna padega?",
    options: [
      "`SalaryCalculator` ke andar ek naya `else if` branch aur ek naya test",
      "`ISalaryRule` interface me `L5` ke liye ek naya method add karna",
      "Ek nayi `GradeL5SalaryRule` class banana aur `Program.cs` me ek registration line — existing classes untouched",
      "Har existing rule class me `L5` handle karne ka code add karna",
    ],
    correctIndex: 2,
    explanation:
      "Yahi OCP ka poora point hai: extension ke liye open (nayi class add), modification ke liye closed (purani classes aur `SalaryCalculator` chhue bina). DI container saari registered `ISalaryRule` implementations ko `IEnumerable` me inject kar deta hai, isliye `SalaryCalculator` ko naye rule ka pata apne aap chal jaata hai. Baaki options me existing code edit karna padta hai — wahi OCP violate karta hai.",
    difficulty: "medium",
  },
  {
    id: "solid-principles-as-refactors-3",
    question:
      "`ReadOnlyEmployeeRepository : IEmployeeRepository` jisme `AddAsync` aur `SaveChangesAsync` `throw new NotSupportedException()` karte hain — ye kaunsa principle todta hai aur sahi fix kya hai?",
    options: [
      "SRP todta hai; fix: class ko do classes me todo",
      "LSP todta hai; fix: interface ko `IEmployeeReader` / `IEmployeeWriter` me segregate karo aur read-only class sirf `IEmployeeReader` implement kare",
      "OCP todta hai; fix: `NotSupportedException` ki jagah ek no-op likho",
      "DIP todta hai; fix: `IEmployeeRepository` ko concrete class bana do",
    ],
    correctIndex: 1,
    explanation:
      "LSP violation hai: `IEmployeeRepository` ka contract `AddAsync` promise karta hai, par ye implementation runtime pe crash karti hai — substitution unsafe. Fix ISP se juda hai: interface ko role ke hisaab se todo taaki read-only repo sirf wahi (`IEmployeeReader`) implement kare jo wo sach me nibha sakta hai. No-op likhna (option C) aur bhi khatarnaak hai — silent data loss. DIP yahan involved nahi.",
    difficulty: "medium",
  },
  {
    id: "solid-principles-as-refactors-4",
    question:
      "`EmployeesController` `IEmployeeService` pe depend karta hai, `EmployeeService` `IEmployeeRepository` pe, aur `EfEmployeeRepository` `IEmployeeRepository` ko implement karta hai. Is arrangement ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye DIP ka example hai — high-level policy aur low-level detail dono beech me rakhi abstraction pe depend karte hain",
      "Ye DIP violate karta hai kyunki controller ke andar service inject ho rahi hai",
      "Ye ISP ka example hai kyunki har layer ka apna interface hai",
      "Ye OCP violate karta hai kyunki `EfEmployeeRepository` ko badalne ke liye interface edit karni padegi",
    ],
    correctIndex: 0,
    explanation:
      "Yahi Dependency Inversion hai: compile-time dependency detail (`EfEmployeeRepository`) se abstraction (`IEmployeeRepository`) ki taraf 'invert' ho gayi hai, aur infrastructure ka arrow upar abstraction ki taraf jaata hai. Isi wajah se repo swap ya mock karna bina Service chhue possible hai. Controller me service inject karna DIP ka sahi istemaal hai, violation nahi. ISP interface ke methods ki sankhya ke baare me hai, ye scenario uske baare me nahi. `EfEmployeeRepository` badalne pe interface edit nahi hoti — wahi to point hai.",
    difficulty: "hard",
  },
];

export default quiz;
