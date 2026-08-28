import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "csn-1",
    question: "Field aur property me kya difference hai, aur Web API models me tum kaunsa use karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Field ek plain variable hai; property ek variable jaisa dikhta hai lekin andar get/set logic hota hai. API models me hamesha property (auto-property).",
    detailedAnswer:
      "Field: `public string FullName;` — seedha memory slot, koi control nahi. Property: `public string FullName { get; set; }` — compiler ek hidden backing field banata hai aur get/set ke through access deta hai, jaha baad me validation ya change-notification add ki ja sakti hai bina caller ka code toote. ASP.NET Core ka model binding, JSON serialization (System.Text.Json), aur validation attributes sab properties pe kaam karte hain — public field ko woh aksar ignore kar dete hain. Isliye rule: models aur DTOs me sirf properties.",
    followUp: "Auto-property me `{ get; init; }` ka kya matlab hai aur kab use karoge?",
    redFlag: "Yeh kehna ki 'dono same hain, bas syntax alag hai' — serialization/binding ka farak nahi pata.",
  },
  {
    id: "csn-2",
    question: "class aur record me kya farak hai? Kaunsa kab use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "record bhi reference type hai lekin value equality, short positional syntax aur immutability defaults deta hai. record = DTO/immutable data, class = mutable entity.",
    detailedAnswer:
      "record positional syntax (`public record EmployeeSummary(int Id, string FullName);`) ek line me constructor, read-only properties, value-based `Equals`/`GetHashCode`, `ToString`, aur `with` expression de deta hai. Do records equal maane jaate hain agar unki saari values equal hon — DTOs, API request/response, config objects ke liye perfect. class reference equality use karta hai aur mutable hota hai — EF Core entities jaise `Employee` (jinhe hum load karke update karte hain) ke liye class hi chahiye, kyunki EF Core mutable properties aur reference identity par depend karta hai.",
    followUp: "Agar tum EF Core entity ko record bana do to concrete kya tootega?",
  },
  {
    id: "csn-3",
    question: "`var` static typing ko weak kar deta hai — sahi ya galat? Samjhao.",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Galat. var sirf type ko compiler se infer karwata hai; type compile time pe fix ho jaata hai, runtime pe koi farak nahi.",
    detailedAnswer:
      "`var employees = new List<Employee>();` compile hone ke baad bilkul `List<Employee> employees = ...` jaisa hi hai — `employees` me kabhi koi doosra type nahi daala ja sakta. Jo cheez sach me dynamic typing deti hai woh `dynamic` keyword hai, jo compile-time checks bypass karta hai. var ka asli trade-off readability ka hai: jab right-hand side se type saaf dikhe (`new ...`, obvious literal) tab var theek hai; jab `var x = Process(data);` ho aur type na dikhe, explicit likhna behtar.",
    redFlag: "Yeh maan lena ki var aur dynamic ek jaise hain.",
  },
  {
    id: "csn-4",
    question:
      "Ye code compile hoga?\n```csharp\npublic class Employee\n{\n    public string FullName { get; set; }\n    public string? PanNumber { get; set; }\n}\n```\n`<Nullable>enable</Nullable>` set hai.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile ho jaayega, lekin `FullName` par nullable warning aayega (non-null property initialize nahi hui). `PanNumber` theek hai.",
    detailedAnswer:
      "Nullable context on hone par compiler dekhta hai ki `FullName` ek non-nullable `string` hai lekin constructor ke baad guaranteed non-null nahi — warning CS8618. Build fail nahi hoga (default me warning, error nahi), lekin CI me `TreatWarningsAsErrors` ho to fail karega. Fix ke options: `= string.Empty;` default, `required string FullName { get; set; }`, ya constructor me set karna. `PanNumber` `string?` hai isliye null hona allowed hai, koi warning nahi.",
    followUp: "`required` keyword laga do to caller ke liye kya badal jaata hai?",
  },
  {
    id: "csn-5",
    question:
      "Naya banda `Employee.Salary` ko `double` declare kar deta hai. Tum code review me kya bologe?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "Paisa hamesha `decimal`. `double`/`float` binary floating point hain, unme rounding errors aate hain jo BFSI me unacceptable hain.",
    detailedAnswer:
      "`double` 0.1 jaise values ko exactly represent nahi kar sakta, isliye additions/multiplications me chhote errors jama hote hain — payroll, interest, tax calculations me ye galat totals de sakta hai aur reconciliation fail karta hai. `decimal` base-10 hai, 28-29 significant digits, money ke liye .NET ka standard. Change: `public decimal Salary { get; set; }`, literals me `900000m` suffix, aur EF Core mapping me `HasColumnType(\"decimal(18,2)\")`.",
    redFlag: "'Farak nahi padta, values chhoti hain' — precision bug scale pe hi dikhta hai, tab tak late ho chuka hota hai.",
  },
  {
    id: "csn-6",
    question:
      "Method ka return type `IEnumerable<Employee>` rakhne ka kya matlab hai, aur `List<Employee>` return karne se ye kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`IEnumerable<Employee>` bolta hai 'iterate karne layak kuch de raha hoon' — caller foreach kar sakta hai lekin Add/Remove/index nahi. `List` woh concrete capabilities bhi deta hai.",
    detailedAnswer:
      "`IEnumerable<T>` ek read-only, forward-only contract hai. Return type isko rakhne se implementation ki azaadi rehti hai — aaj `List` return karo, kal `yield return` se lazy sequence ya EF Core query — caller ka code nahi badlega. Nuksaan: caller ko `.Count` ya index chahiye to use pehle `.ToList()` karna padega, aur agar underlying cheez ek deferred LINQ query hai to multiple enumeration se DB do baar hit ho sakti hai. Rule of thumb: API/service boundary pe `IEnumerable<T>` ya `IReadOnlyList<T>`; andar concrete `List<T>`.",
    followUp: "Deferred execution kya hai, aur ye `IEnumerable` return karte waqt kaise bug ban sakta hai?",
  },
  {
    id: "csn-7",
    question:
      "`namespace`, `using`, aur `ImplicitUsings` — teeno ka role ek chhote paragraph me batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "namespace classes ko group karta hai (naam-clash roka jaata hai); using ek file me kisi namespace ki classes short naam se use karne deta hai; ImplicitUsings common namespaces ko har file me auto-add karta hai.",
    detailedAnswer:
      "`namespace EmployeeManagement.Api.Models;` batata hai ki is file ki classes kis logical dabbe me hain — do alag `Employee` classes alag namespaces me co-exist kar sakti hain. `using EmployeeManagement.Api.Models;` file ke top pe likhne se us namespace ki classes ko full path ke bina reference kar sakte ho. `.csproj` ka `<ImplicitUsings>enable</ImplicitUsings>` SDK-defined common namespaces (`System`, `System.Linq`, `System.Collections.Generic`, `Microsoft.AspNetCore.Builder`, etc.) ko compile ke waqt har file me daal deta hai, isliye minimal templates me `using` lines kam dikhti hain. Extra global usings tum `GlobalUsings.cs` me `global using ...` se add kar sakte ho.",
    redFlag: "Yeh sochna ki using se code 'import' ya bundle hota hai — using sirf naam resolve karta hai, assembly reference `.csproj` deta hai.",
  },
  {
    id: "csn-8",
    question:
      "Ek concrete failure batao jo sirf isliye aata hai ki koi language basic galat use hua.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Optional field ko non-nullable `string` declare karna aur seed data me set na karna — runtime pe un rows par NullReferenceException.",
    detailedAnswer:
      "`public string PanNumber { get; set; }` (bina `?`), aur kuch employees bina PAN ke seed hue. Build warning ke saath pass ho gaya. Jab response serialize hua ya kisi ne `emp.PanNumber.Trim()` call kiya, sirf un rows par jinme PAN missing tha, `NullReferenceException` aaya — reproduce karna mushkil kyunki baaki sab rows theek chal rahe the. Root fix: field genuinely optional hai to `string?`, aur har use se pehle `if (emp.PanNumber is not null)` ya `emp.PanNumber?.Trim()`. Ye batata hai ki nullable warnings ko suppress karne ke bajaye address karna chahiye.",
    followUp: "Nullable warning ko `#pragma warning disable` se dabana kab acceptable hai?",
  },
];

export default questions;
