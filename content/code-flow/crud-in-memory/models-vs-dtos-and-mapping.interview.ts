import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dto-1",
    question: "Controller se entity directly return ya bind karne me kya problem hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer:
      "Over-posting, API-DB schema coupling, versioning dard, aur internal field leak — isliye har endpoint request DTO leta hai aur response DTO deta hai.",
    detailedAnswer:
      "Char alag costs: (1) Over-posting/mass assignment — poori entity bind karne se client `Salary`, `IsActive` jaise sensitive fields set kar sakta hai. (2) Contract coupling — GET agar entity return kare to DB column rename karte hi har client toot jaata hai. (3) Versioning — `/v2` me field badalni ho to entity pe kiya to migrations aur internal code sab hilte hain; DTO pe sirf mapping badalti hai. (4) Leak — entity me kal `RowVersion`, `InternalRiskScore` aa sakte hain jo JSON me chale jaayenge. Fix: `CreateEmployeeDto` (allowed input), `UpdateEmployeeDto` (editable fields), `EmployeeResponseDto` (safe output), beech me explicit mapping.",
    followUp: "Ek hi DTO ko create, update aur response teeno ke liye reuse karna theek hai kya?",
    redFlag:
      "'DTO bas extra boilerplate hai, chhote API me entity theek hai' — over-posting internal tool me bhi risk hai.",
  },
  {
    id: "dto-2",
    question:
      "Over-posting kya hai? Ek concrete example do aur batao request DTO isse structurally kaise rokta hai.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Client entity ki koi bhi field body me bhej deta hai; agar field request DTO me nahi hai, model binder use kahin se bind hi nahi kar sakta.",
    detailedAnswer:
      "Example: `POST /api/employees` `[FromBody] Employee` leta hai. Tester body me `salary: 5000000, isActive: true` add karta hai — record us salary ke saath ban jaata hai aur payroll batch use pick kar leta hai. BFSI me ye reportable incident hai. `CreateEmployeeDto` me `Salary` HR-only rakha jaata ya `IsActive` hota hi nahi — to binder ke paas woh field aane ka koi raasta nahi. Ye `if` check nahi, structural guarantee hai. Purana workaround `[Bind(nameof(...))]` allow-list tha, par alag DTO cleaner aur explicit hai.",
    followUp: "PATCH endpoint me over-posting ka risk PUT se zyada kyun ho sakta hai?",
  },
  {
    id: "dto-3",
    question:
      "Ye do mapping approaches diye hain — manual extension methods vs AutoMapper. Trade-offs compare karo aur batao kab kaunsa.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Manual: explicit, greppable, zero dependency, rename pe compile error — par bahut saare DTOs pe repetitive. AutoMapper: boilerplate kam — par silent mis-maps, debugging mushkil, reflection cost, ab commercial license.",
    detailedAnswer:
      "Manual mapping har field haath se assign karta hai — koi field chhoot jaaye to code me dikhta hai, aur source property rename hone pe build fail hota hai. Cost sirf typing hai jab 50+ DTOs ho. AutoMapper same-naam properties convention se map karta hai, rules ek `Profile` me — par rename pe woh field chup-chaap default (`0`, `null`) reh jaati hai bina error, stack traces me AutoMapper internals aate hain, aur startup pe reflection cost hai. Beech ka option Mapperly — ek source generator jo readable mapping code generate karta hai, zero reflection, aur unmapped member pe compile-time warning/error. Course ka stand: is project size pe manual; DTO count badhe to Mapperly; AutoMapper sirf bade codebase me jahan team already fluent ho.",
    followUp: "AutoMapper me `AssertConfigurationIsValid()` kya karta hai aur kab call karna chahiye?",
    redFlag:
      "'AutoMapper hamesha use karo, industry standard hai' — cons na jaanna aur silent mis-map ka risk na batana.",
  },
  {
    id: "dto-4",
    question:
      "Team ne `Employee.Salary` ko `AnnualCtc` rename kiya. `EmployeeResponseDto` me abhi bhi `Salary` hai. AutoMapper aur Mapperly me alag-alag kya hoga?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "AutoMapper: koi error nahi, `Salary` default `0` map hota hai, runtime pe galat data. Mapperly: build warning/error, bug ship hi nahi hota.",
    detailedAnswer:
      "AutoMapper reflection se naam match karta hai — `Salary` naam source `Employee` me ab hai hi nahi (`AnnualCtc` hai), to destination `Salary` unmapped reh jaata hai aur `decimal` default `0` set hota hai. `CreateMap<Employee, EmployeeResponseDto>()` par `AssertConfigurationIsValid()` is specific case ko pakad sakta hai agar destination member ko unmapped mana jaaye, par aksar teams ise call nahi karti aur bug do din reports me zero-salary rows ke roop me dikhta hai. Mapperly compile time pe generated mapper ke andar `AnnualCtc` -> `Salary` mapping likhne ki koshish karta hai, naam match nahi hota, aur `RMG` diagnostic warning/error deta hai — CI red ho jaati hai. Manual mapping bhi compile fail karti kyunki `e.Salary` ab valid property nahi.",
    followUp: "AutoMapper config ko unit test se kaise guard karoge?",
  },
  {
    id: "dto-5",
    question:
      "`UpdateEmployeeDto` design kar rahe ho. `Email`, `PanNumber`, `IsActive`, `Id` — inme se kaunse rakhoge aur kaunse nahi, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Char me se ek bhi nahi. `Id` route se aata hai; `Email`/`PanNumber` identity-jaise fields hain jo PUT se nahi badalte; `IsActive` ke liye alag activate/deactivate endpoint hota hai.",
    detailedAnswer:
      "PUT ke DTO me sirf woh fields honi chahiye jo us operation me genuinely editable hain — hamare case me `FullName`, `MiddleName`, `DepartmentId`, `Salary`. `Id` body me rakhna khatarnak hai (client identity badal sakta hai) aur zaroori nahi (route se aata hai). `Email` aur `PanNumber` ko badalna alag workflow hai (verification, audit) — general update me nahi. `IsActive` ek lifecycle transition hai, uske liye `POST /api/employees/{id}/deactivate` jaisa dedicated endpoint clearer hai (audit reason capture kar sakte ho). DTO me field na hone se ye sab structurally protected hain.",
    followUp: "Email change ko safe tareeke se kaise expose karoge?",
    redFlag: "Ek bada 'EmployeeDto' banake usme sab kuch daal dena aur create/update/response teeno me reuse karna.",
  },
  {
    id: "dto-6",
    question:
      "Interviewer: 'Humne DTOs bana liye, ab request validation ho gayi na?' Iska sahi jawaab?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Nahi. DTO sirf shape control karta hai (kaunsi fields bind ho sakti hain). 'PAN sahi format me hai', 'Salary positive hai' — ye validation alag layer hai.",
    detailedAnswer:
      "DTO over-posting rokta hai aur contract define karta hai, par field-level rules enforce nahi karta. `[ApiController]` sirf malformed JSON ya type-mismatch pe automatic `400` deta hai. Actual rules — `[Required]`, `[RegularExpression]` (DataAnnotations), ya FluentValidation ke `RuleFor(x => x.PanNumber).Matches(...)` — ek alag topic/module hai. DTO aur validation dono chahiye: DTO batata hai kya aa sakta hai, validation batata hai jo aaya wo valid hai ya nahi.",
    followUp: "DataAnnotations aur FluentValidation me kya farq hai, kab kaunsa?",
  },
  {
    id: "dto-7",
    question:
      "`EmployeeResponseDto` me `PanNumber` full aa raha hai. BFSI context me isko kaise handle karoge aur code me kahan?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Response DTO ki mapping me PAN ko mask karo (`ABCPS****K`) — ek jagah, entity me nahi, har controller me nahi.",
    detailedAnswer:
      "Masking ek presentation concern hai, isliye entity `PanNumber` full rakhti hai (business logic ko chahiye), par `Employee -> EmployeeResponseDto` mapping me ek `MaskPan(e.PanNumber)` helper lagta hai. Manual mapping me ye ek line `ToResponse()` me; AutoMapper me `.ForMember(d => d.PanNumber, o => o.MapFrom(s => MaskPan(s.PanNumber)))`. Fayda: koi bhi endpoint jo `EmployeeResponseDto` return karta hai, automatically masked PAN deta hai — leak ek hi jagah rok di. Full PAN chahiye to ek alag, authorized endpoint/DTO banao with explicit audit logging.",
    followUp: "Logs me PAN accidentally aa jaaye to usko kaise rokoge?",
    redFlag: "Har controller action me alag-alag masking logic likhna, ya masking entity ke andar daal dena.",
  },
  {
    id: "dto-8",
    question:
      "Mapping code kahan rehna chahiye — controller ke andar, ek static helper me, ya service layer me? Hamare project ke stage pe kya theek hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Ek dedicated jagah — abhi ek static `EmployeeMappings` class (extension methods). Service layer aane pe mapping service ke andar chali jaayegi, controller ko sirf DTOs dikhenge.",
    detailedAnswer:
      "Is module me abhi service layer nahi hai, isliye controller mapping helper call karta hai — par mapping logic controller ki body me inline nahi honi chahiye (har action me repeat hoga). Ek `Mapping/EmployeeMappings.cs` me `ToEntity()`/`ToResponse()` extension methods — ek jagah, testable, greppable. Layered-architecture module me jab `EmployeeService` extract hoga, mapping wahan move ho jaayegi (`Create` DTO leta hai, DTO return karta hai), aur controller kabhi `Employee` entity dekhta hi nahi. AutoMapper use karein to `IMapper` service me inject hota hai, controller me nahi.",
    followUp: "Jab service layer aayega, controller ka signature kaisa dikhega?",
  },
];

export default questions;
