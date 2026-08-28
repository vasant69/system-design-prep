import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "emp-model-1",
    question: "Aapke paas ek Salary ya Amount field hai. Kaunsa C# type use karoge aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "decimal. double/float binary floating point hain, money me rounding errors jama hote hain; decimal base-10 exact hai.",
    detailedAnswer:
      "Money, tax, interest rate, percentage — sab decimal. double aur float base-2 floating point hain, isliye 0.1 jaisi values ko bhi exactly represent nahi kar sakte. Ek-ek operation me chhoti rounding error aati hai, aur lakhs of rows ke totals me wo error visible ho jaati hai — reconciliation aur audit fail hote hain, jo BFSI me reportable incident hota hai. decimal 128-bit base-10 hai, ~28 significant digits, paise tak exact. double sirf scientific/measurement data (temperature, GPS) ke liye. Literal me suffix lagana padta hai: `var s = 1450000m;`",
    followUp: "PAN number ya mobile number kis type me store karoge?",
    redFlag: "\"double chalega, salary to chhoti value hai\" — money me kabhi double nahi.",
  },
  {
    id: "emp-model-2",
    question: "PAN number, Aadhaar, account number — inhe int/long me store karna theek hai kya?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — ye identifiers hain, numbers nahi. Hamesha string.",
    detailedAnswer:
      "Ek simple test: kya is value pe kabhi jodna-ghatana karoge? PAN pe nahi. To wo numeric quantity nahi, ek identifier hai. Numeric types leading zeros gira dete hain (0451... becomes 451), aur PAN me to letters bhi hain (AAAAA9999A) jo int me fit hi nahi honge. String me store karo, format validation alag se (FluentValidation, module 5). Yahi rule phone numbers, PIN codes, IFSC, account numbers pe bhi.",
    followUp: "Phir string PanNumber pe format AAAAA9999A kaise enforce karoge?",
  },
  {
    id: "emp-model-3",
    question: "POCO kya hai, aur Employee model ko POCO kyun rakhte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Plain Old CLR Object — sirf properties, koi framework dependency ya logic nahi. Reusable aur test-friendly rehta hai.",
    detailedAnswer:
      "POCO matlab ek normal class jisme na database code hai, na HTTP code, na business rules — sirf data ka shape. Fayde: (1) same class EF Core entity bhi ban sakti hai aur mapping ka source bhi, bina logic ke baggage ke. (2) koi bhi layer ise safely pass kar sakti hai. (3) unit test me bas `new Employee { ... }` — koi mock setup nahi. Logic (tenure calculation, formatting, validation) service layer ya DTO me jaata hai.",
    redFlag: "Model me CalculateTenure(), Validate(), ya DB call daalna.",
  },
  {
    id: "emp-model-4",
    question: "Nullable reference types on hain. Ye class compile pe warning kyun degi?\n```csharp\npublic class Employee\n{\n    public int Id { get; set; }\n    public string FullName { get; set; }\n    public string? MiddleName { get; set; }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "FullName non-nullable string hai lekin initialise nahi hui — compiler warn karta hai ki constructor ke baad null ho sakti hai.",
    detailedAnswer:
      "`<Nullable>enable</Nullable>` ke saath, non-nullable reference type ko ya to constructor me set karna padta hai ya inline default dena padta hai. `FullName` dono nahi karti, isliye warning CS8618. Fix: `public string FullName { get; set; } = string.Empty;` ya `required public string FullName { get; set; }` (C# 11 / .NET 7+). `MiddleName` pe warning nahi kyunki `string?` ka matlab hi hai null allowed. `Id` int hai, uski default 0 valid hai.",
    followUp: "required aur = string.Empty me se kaunsa kab use karoge?",
  },
  {
    id: "emp-model-5",
    question: "DateOfJoining ke liye DateOnly aur DateTime me se kya chunoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "DateOnly — joining ki sirf taareekh matter karti hai, time nahi. Timezone bugs bhi bachte hain.",
    detailedAnswer:
      "DateTime me hamesha ek time component hota hai (00:00:00) jo yahan meaningless hai, aur agar UTC conversion beech me aa jaaye to date ek din shift ho sakti hai. DateOnly (.NET 6+) exactly 'ek calendar date' represent karta hai — koi time, koi timezone nahi. .NET 8 ka System.Text.Json ise bina extra config `\"2021-06-14\"` string me serialize/deserialize karta hai. DateTime use karo tab jab actual timestamp chahiye (CreatedAt, LastLoginAt) — waha bhi DateTimeOffset ya UTC.",
    redFlag: "DateTime le kar har jagah .Date lagana — intent chhup jaata hai aur ek jagah bhoolne pe bug.",
  },
  {
    id: "emp-model-6",
    question: "Entity ke liye class aur DTO ke liye record — ye distinction kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Entity mutable hai, EF track karta hai, navigation properties chahiye — class. DTO ek immutable data snapshot hai — record fit baithta hai.",
    detailedAnswer:
      "Entity (Employee) ki life lambi hoti hai: banti hai, update hoti hai, EF Core change-tracking karta hai, relationships (Department navigation) lagti hain — iske liye mutable class with `get; set;` natural hai. DTO ek request/response ka snapshot hota hai jo banne ke baad badalna nahi chahiye — record ka init-only properties, value equality, aur `with` expression yahan perfect hain. Isliye is module ke DTO topic me `CreateEmployeeDto`, `EmployeeResponseDto` sab record honge, aur Employee class rahegi.",
    followUp: "record struct aur record class me kya farq hai, DTO ke liye kaunsa?",
  },
  {
    id: "emp-model-7",
    question: "Ek junior ne Employee model me `public decimal AnnualBonus => Salary * 0.10m;` computed property add ki. Kya problem hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Business rule (bonus 10%) model me chala gaya. Rule badla to model badalna, aur ye value model se chipak gayi — service/DTO me honi chahiye.",
    detailedAnswer:
      "Do dikkatein: (1) Bonus percentage ek business rule hai jo department, grade, ya year ke hisaab se badal sakta hai — usko ek POCO field expression me hardcode karna future refactor ko mushkil banata hai. (2) Ye computed field ab har jagah aa jaayega jaha Employee use hota hai, chahe wo context bonus se related ho ya na ho — aur EF Core (module 4) isko map karne ki koshish me confuse ho sakta hai. Sahi jagah: ek EmployeeSalaryService jo bonus calculate kare, aur EmployeeResponseDto me AnnualBonus field jo service se bhare.",
    redFlag: "\"expression-bodied property to bas ek shortcut hai, logic thodi hai\" — value derive karna bhi logic hai.",
  },
  {
    id: "emp-model-8",
    question: "In-memory list me naya Employee add karte waqt Id kaise assign karoge, aur module 4 me kya badlega?",
    type: "coding",
    difficulty: "beginner",
    shortAnswer:
      "In-memory: `_employees.Any() ? _employees.Max(e => e.Id) + 1 : 1`. Database me: identity column auto-generate karega, hum Id set hi nahi karenge.",
    detailedAnswer:
      "```csharp\nvar newId = _employees.Count == 0 ? 1 : _employees.Max(e => e.Id) + 1;\nvar employee = new Employee { Id = newId, /* ...baaki fields... */ };\n_employees.Add(employee);\n```\nYe sirf single-threaded demo ke liye theek hai — concurrent requests me Max+1 do baar same id de sakta hai. Module 4 me SQL Server ka IDENTITY column ya EF Core ka value generation ye kaam karega; hum POST me client se aayi Id ko ignore karenge aur SaveChanges ke baad DB-generated Id wapas milega.",
    followUp: "Concurrent POST requests me Max + 1 approach kaise fail hoga?",
  },
];

export default questions;
