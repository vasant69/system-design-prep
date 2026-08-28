import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "solid-1",
    question: "SOLID kya hai? Har letter ek line me batao aur apne project se ek example do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Paanch OOP design principles: SRP (ek class, ek badalne ki wajah), OCP (extension ke liye open, modification ke liye closed), LSP (derived type base ki jagah bina surprise chale), ISP (client ko unused methods implement na karwao), DIP (high aur low dono abstraction pe depend karein).",
    detailedAnswer:
      "Ratta-maari se bachne ke liye har letter ko project ke refactor se jodo. SRP: `EmployeeService.CreateAsync` me validation + PAN call + email + DB sab tha, humne `IEmployeeValidator`, `IPanVerificationClient`, `IEmployeeNotifier` nikaale aur service ko orchestrator bana diya. OCP: payroll ki grade `if-else` chain ko `ISalaryRule` per-grade strategies me toda, naya grade ab nayi class + ek DI line. LSP: `ReadOnlyEmployeeRepository` jo `AddAsync` pe exception phenkta tha, use `IEmployeeReader` ke peeche shift kiya. ISP: 15-method `IEmployeeRepository` ko `IEmployeeReader` / `IEmployeeWriter` / `IEmployeeStatsReader` me toda. DIP: Controller to `IEmployeeService`, Service to `IEmployeeRepository` — hum already karte the, bas naam diya.",
    followUp: "In paanch me se kaunse do sabse zyada related hain aur kaise?",
    redFlag:
      "Sirf full-forms bolna bina kisi concrete before/after ke — signal deta hai ki padha hai, use nahi kiya.",
  },
  {
    id: "solid-2",
    question: "SRP aur ISP me farak kya hai? Dono to 'chhota rakho' hi keh rahe hain.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "SRP class ke baare me hai — ek class ke paas badalne ki ek wajah. ISP interface ke baare me hai — client ko sirf wahi methods dikhein jo wo use karta hai. Ek class SRP-clean ho sakti hai par ek fat interface implement kar rahi ho.",
    detailedAnswer:
      "SRP kehta hai `EmployeeService` ko email bhejna, validate karna, aur persist karna — teeno khud nahi karna chahiye, kyunki teeno alag reason se badalte hain. ISP kehta hai agar `ReportingService` ko sirf `CountActiveAsync` chahiye to usse 15-method `IEmployeeRepository` mock karne pe majboor mat karo — usse `IEmployeeStatsReader` do. Ek EF repository class teeno role interfaces implement kar sakti hai (SRP ke hisaab se wo ab bhi 'ek responsibility: Employee persistence' serve karti hai), par consumers ko apna-apna slice milta hai. SRP producer-side discipline hai, ISP consumer-side.",
    followUp: "Agar ek class teen interfaces implement karti hai, kya wo SRP violate karti hai?",
    redFlag: "'Dono same cheez hain' — depth ki kami dikhata hai.",
  },
  {
    id: "solid-3",
    question:
      "OCP ka matlab kya hai ki main kabhi purani class edit na karoon? Bug fix ke liye bhi nahi?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Bug fix ke liye edit karna bilkul theek hai. OCP tab lagao jab tumhe pehle se pata ho ek axis pe naye cases aate rahenge — jaise naye salary grades ya naye document types.",
    detailedAnswer:
      "OCP ka practical roop: jab ek known variation-axis ho (grades, payment providers, KYC document types), us axis pe naya case add karna existing code ko chhue bina ho sake — `ISalaryRule` per grade, DI se `IEnumerable<ISalaryRule>` inject, naya grade = nayi class + registration line. Isse regression risk girta hai. Lekin har cheez ko abhi se pluggable banana over-engineering hai (YAGNI). Bug fix, refactor, ya requirement change ke liye class edit karna OCP violation nahi hai — OCP anticipated extension ke baare me hai, general 'kabhi mat chhuo' rule nahi.",
    followUp: "Kaise decide karoge ki kaunsa axis pluggable banana worth hai?",
    redFlag: "'OCP matlab classes immutable' — literal aur galat interpretation.",
  },
  {
    id: "solid-4",
    question:
      "Ye code dekho — kaunsa SOLID principle todta hai aur kyun?\n```csharp\npublic class EmployeeService : IEmployeeService\n{\n    private readonly EfEmployeeRepository _repo = new EfEmployeeRepository();\n    private readonly HttpClient _http = new HttpClient();\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "DIP violation. Service ke andar concrete classes ka `new` hai — compile-time coupling infrastructure detail se. Fix: `IEmployeeRepository` aur ek `IPanVerificationClient` inject karo constructor se.",
    detailedAnswer:
      "`new EfEmployeeRepository()` matlab `EmployeeService` ab EF Core, connection string, SQL provider — sab transitive dependencies se bandha hai. Isse do concrete taklifein: (1) unit test me repository mock nahi kar sakte, har test asli DB maangega; (2) `EfEmployeeRepository` ko `DapperEmployeeRepository` se badalne pe `EmployeeService` bhi edit karna padega. Fix: constructor me `IEmployeeRepository repo` aur `IPanVerificationClient pan` lo, `Program.cs` me `AddScoped<IEmployeeRepository, EfEmployeeRepository>()` aur `AddHttpClient<IPanVerificationClient, PanVerificationClient>()` se wire karo. Ab dependency arrow detail se abstraction ki taraf 'invert' ho gaya.",
    followUp: "`HttpClient` ko `new` karna alag se bhi problem hai — kaunsi?",
    redFlag: "Ise 'SRP violation' bolna — yahan responsibilities to theek hain, dependency direction galat hai.",
  },
  {
    id: "solid-5",
    question:
      "Ek developer ne `ReadOnlyEmployeeRepository : IEmployeeRepository` banaya jisme `AddAsync` `throw new NotSupportedException()` karta hai. Kya galat hai aur sahi design kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "LSP violation. `IEmployeeRepository` ka contract `AddAsync` promise karta hai; ye implementation runtime pe crash karti hai. Fix: interface ko `IEmployeeReader` / `IEmployeeWriter` me segregate karo aur read-only class sirf `IEmployeeReader` implement kare.",
    detailedAnswer:
      "Koi bhi code jo `IEmployeeRepository` leta hai wo `AddAsync` call karne ka haqdaar hai — contract ne kaha hai. Agar galti se `ReadOnlyEmployeeRepository` inject ho gaya to `CreateAsync` production me `NotSupportedException` ke saath girega, aur compile-time pe sab theek dikhega — yahi khatra hai. Sahi design ISP se juda hai: `IEmployeeReader` (GetById, GetAll, EmailExists) aur `IEmployeeWriter` (Add, Update, SaveChanges) alag. `IEmployeeRepository : IEmployeeReader, IEmployeeWriter` full repo ke liye. `ReadOnlyEmployeeRepository` sirf `IEmployeeReader` implement kare — koi `throw` nahi, substitution safe.",
    followUp: "LSP sirf exception phenkne se todta hai, ya aur bhi tarike hain?",
    redFlag:
      "'Bas `NotSupportedException` ki jagah no-op likh do' — silent data loss, aur bhi khatarnak.",
  },
  {
    id: "solid-6",
    question:
      "Tumhare unit test me ek service ke liye 8 mocks setup karne pad rahe hain. Ye kis baat ka signal hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Lagbhag hamesha SRP ya ISP violation ka. Service bahut saari cheezein khud kar rahi hai, ya bahut fat interfaces pe depend kar rahi hai. Test ka dard design smell ka sabse imaandaar detector hai.",
    detailedAnswer:
      "8 collaborators matlab service 8 alag reasons se badal sakti hai — SRP gaya. Ya phir wo 15-method `IEmployeeRepository` jaisa fat interface le rahi hai jabki use 3 method chahiye — ISP gaya, mock me 12 unused method baithe hain. Refactor: responsibilities ko focused collaborators me nikaalo (`IEmployeeValidator`, `IEmployeeNotifier`), aur fat interfaces ko role-based interfaces me toro. Result: har test 1-2 seam mock karta hai, poori duniya nahi. Agar service genuinely ek orchestrator hai jise 5 real steps chahiye, to 5 mocks acceptable hain — par 8+ pe ruko aur socho.",
    followUp: "Har jagah interface laga dena bhi to test-friendly hai — isme kya problem hai?",
  },
  {
    id: "solid-7",
    question:
      "OCP ke liye .NET DI ka kaunsa feature backbone hai? Ek chhota example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Jab ek interface ke multiple implementations registered hon, DI container unhe `IEnumerable<TService>` ke roop me inject kar deta hai. Isi se strategy pattern OCP-friendly banta hai.",
    detailedAnswer:
      "`Program.cs` me `AddSingleton<ISalaryRule, GradeL1SalaryRule>()`, `...GradeL2SalaryRule`, `...GradeL3SalaryRule` — teen registrations. `SalaryCalculator` ka constructor `IEnumerable<ISalaryRule> rules` leta hai aur container saari registered implementations ko us collection me daal deta hai. `rules.ToDictionary(r => r.Grade)` se grade-string se fast lookup ban jaata hai. Naya grade 'L5' add karna = ek nayi `GradeL5SalaryRule` class + ek registration line; `SalaryCalculator` aur baaki rules bilkul untouched. Ye OCP hai — behaviour extend hua, existing code closed raha.",
    followUp: "Agar do rules ka same `Grade` ho to `ToDictionary` kya karega, aur isse kaise handle karoge?",
    redFlag: "Ye maan lena ki DI sirf ek implementation resolve kar sakta hai per interface.",
  },
  {
    id: "solid-8",
    question:
      "Chhote CRUD app me poora SOLID lagana chahiye? Trade-off batao.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Nahi, blanket nahi. SOLID ka cost hai — zyada files, interfaces, indirection. Ek flow trace karne me 4-5 files kholni padti hain. Chhote/stable feature pe wo over-engineering ban jaata hai.",
    detailedAnswer:
      "SOLID lagao jab: class 200+ lines ho rahi ho, ek axis pe baar-baar variation aa raha ho (grades, providers, document types), ya test setup dard de raha ho. Skip karo jab: requirement stable ho aur ek hi implementation kabhi rahegi — tab ek interface + ek class sirf ceremony hai, koi value nahi. Practical approach: simplest design se shuru karo (ek `EmployeeService`, direct dependencies), aur jab pain signal aaye (God class, test me 10 mocks, har release me regression) tab targeted refactor karo. SOLID ek judgement tool hai, checklist nahi.",
    followUp: "Kaunse 2-3 concrete signals pe tum ek service ko todna shuru karoge?",
    redFlag: "'SOLID hamesha best practice hai, har jagah lagao' — context se decouple karna, maturity ki kami.",
  },
];

export default questions;
