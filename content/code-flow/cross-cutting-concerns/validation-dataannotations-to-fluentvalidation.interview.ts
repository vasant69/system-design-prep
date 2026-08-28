import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "val-1",
    question: "Web API me incoming request ka data kaise validate karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Simple cases me DataAnnotations DTO properties par; `[ApiController]` automatically `400 ValidationProblemDetails` de deta hai bina action call kiye. Async DB checks, cross-field ya conditional rules aane par FluentValidation.",
    detailedAnswer:
      "Request flow: model binding JSON ko DTO me badalta hai, phir validation `ModelState` populate karti hai, phir action. `[ApiController]` invalid `ModelState` par action ko call kiye bina RFC 7807 `ValidationProblemDetails` (`errors` object) bhejta hai. Do rule sources isi step me plug hote hain: DataAnnotations (`[Required]`, `[EmailAddress]`, `[StringLength]`, `[Range]`, `[RegularExpression]`) — built-in, zero setup; aur FluentValidation — ek alag `AbstractValidator<T>` class jisme `RuleFor(...)`, DI se repository inject, `MustAsync` for uniqueness, `.When()` for conditional.\n\n```csharp\nbuilder.Services.AddValidatorsFromAssemblyContaining<CreateEmployeeDtoValidator>();\nbuilder.Services.AddFluentValidationAutoValidation();\n```",
    followUp: "DataAnnotations chhod kar FluentValidation kab pick karoge?",
    redFlag:
      "Har controller action ke andar haath se `if (dto.Email == null) return BadRequest()` likhna — 40 endpoints me duplicate, ek jagah bhool gaye to hole.",
  },
  {
    id: "val-2",
    question: "`[Required]` attribute `public int DepartmentId` par kaam karega?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Practically nahi. Non-nullable value type kabhi null nahi hota aur `0` uski default value hai jise validator present maanta hai. `int?` banao ya `[Range(1, int.MaxValue)]` lagao.",
    detailedAnswer:
      "`[Required]` sirf tab meaningful hai jab property `null` ho sakti hai — reference type ya nullable value type (`int?`, `decimal?`, `DateOnly?`). `int DepartmentId` par client agar key bhi na bheje to model binder `0` set kar deta hai, aur `[Required]` `0` ko missing nahi maanta. Agar zero ek invalid id hai to `[Range(1, int.MaxValue)]`; agar tumhe genuinely distinguish karna hai ki client ne bheja hi nahi vs bheja `0`, to property nullable banao.",
    followUp: "`decimal Salary` par tum negative value kaise rokoge?",
    redFlag:
      "'Value type par bhi `[Required]` sab handle kar leta hai' — ye galat mental model production bugs deta hai.",
  },
  {
    id: "val-3",
    question:
      "Rule chahiye: same `Email` ya `PanNumber` se dobara employee create nahi ho — ye async DB lookup hai. DataAnnotations me kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "DataAnnotations me practically nahi karna chahiye — `IsValid` sync hai aur DI-friendly nahi. FluentValidation ka `MustAsync` use karo jo repository inject karke DB hit karta hai.",
    detailedAnswer:
      "```csharp\nRuleFor(x => x.Email)\n    .NotEmpty().EmailAddress()\n    .MustAsync(async (email, ct) => !await repository.EmailExistsAsync(email))\n    .WithMessage(\"An employee with this email already exists.\");\n```\n\nValidator constructor me `IEmployeeRepository` inject hota hai kyunki `AddValidatorsFromAssemblyContaining` validators ko scoped register karta hai. Async rules sirf async validation pipeline me chalte hain (`AddFluentValidationAutoValidation` ya `await validator.ValidateAsync(dto)`). Kabhi bhi DataAnnotations custom attribute ke andar `repository.EmailExistsAsync(email).Result` mat karo — deadlock aur thread-pool starvation.",
    followUp: "`UpdateEmployeeDto` ke liye ye uniqueness check kaise adjust hoga?",
    redFlag:
      "`ValidationAttribute.IsValid` ke andar `.GetAwaiter().GetResult()` se async repo call — classic deadlock.",
  },
  {
    id: "val-4",
    question:
      "DTO validation aur domain/business validation me line kahan kheechte ho?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "DTO validation = 'request ka shape sahi hai?' (required fields, format, range). Domain invariants = 'ye operation business ke hisaab se allowed hai?' — wo service/domain layer me, jahan poora entity aur DB state available hai.",
    detailedAnswer:
      "DTO validator me rakho: `FullName` required aur length, `Email` format, `PanNumber` regex, `Salary` non-negative, `DateOfJoining` future me nahi, `DepartmentId` present. Service/domain me rakho: 'inactive employee ko promote nahi kar sakte', 'department cost-centre ke saath salary band match kare', 'notice-period ke andar transfer allowed nahi'. Reason: ye rules poore `Employee` entity aur current DB state par depend karte hain, ek incoming DTO par nahi. Service me violation par `DomainValidationException` throw karo jise global handler `400` `ValidationProblemDetails` shape me badal deta hai — client side ek hi errors parser dono ke liye.",
    followUp: "Service se thrown `DomainValidationException` client tak `400` kaise banti hai?",
  },
  {
    id: "val-5",
    question:
      "FluentValidation wire karne ke `AddValidatorsFromAssemblyContaining<T>()` aur `AddFluentValidationAutoValidation()` — dono kya karte hain, aur ek bhool gaye to?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`AddValidatorsFromAssemblyContaining<T>()` us assembly ke saare validators ko DI me scoped register karta hai (DI inject enable). `AddFluentValidationAutoValidation()` ek MVC filter lagata hai jo binding ke baad matching `IValidator<T>` chala kar failures `ModelState` me daalta hai.",
    detailedAnswer:
      "Sirf `AddValidatorsFromAssemblyContaining` laga aur auto-validation nahi to validators DI me hain par apne aap chalte nahi — tumhe `IValidator<T>` inject karke `ValidateAsync` khud call karna padega. Sirf `AddFluentValidationAutoValidation` laga aur registration bhool gaye to filter ko koi validator milta hi nahi — invalid requests silently service tak. Bahut teams jaanbujhkar auto-validation off rakhti hain aur service me explicit `await _validator.ValidateAsync(dto)` + `throw new DomainValidationException(result.ToDictionary())` karti hain — flow dikhta hai, magic kam.",
    followUp: "Explicit `IValidator<T>` injection auto-validation se behtar kab hai?",
    redFlag:
      "Validator class likh kar 'ho gaya' maan lena bina koi registration line ke — kuch validate hota hi nahi.",
  },
  {
    id: "val-6",
    question:
      "Ye PAN regex `[RegularExpression(\"[A-Z]{5}[0-9]{4}[A-Z]\")]` — isme kya galti hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`^` aur `$` anchors missing hain. Bina anchors ke ye sirf ek substring match dhoondhta hai, to `junk ABCDE1234F more` bhi pass ho jaata hai. Sahi: `^[A-Z]{5}[0-9]{4}[A-Z]$`.",
    detailedAnswer:
      "DataAnnotations ka `[RegularExpression]` `IsMatch`-style check karta hai — agar pattern string ke kisi bhi hisse me milta hai to valid. Indian PAN exactly 10 chars ka hai (5 letters, 4 digits, 1 letter), isliye pattern ko poore input par anchor karna zaroori hai: `^[A-Z]{5}[0-9]{4}[A-Z]$`. Yahi galti phone number, pincode, IFSC jaise har format check me hoti hai. FluentValidation me `.Matches(\"^[A-Z]{5}[0-9]{4}[A-Z]$\")`.",
    followUp: "Lowercase PAN aaye to reject karna hai ya normalize karke accept — kaunsa better?",
  },
  {
    id: "val-7",
    question:
      "Ek DTO par DataAnnotations bhi lage hain aur ek FluentValidation validator bhi. Kya hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Dono chalte hain, error messages duplicate ya conflicting aa sakte hain, aur maintainer confuse hota hai ki kaunsa rule kahan hai. Ek DTO ke liye ek validation approach pick karo.",
    detailedAnswer:
      "Auto-validation setup me framework pehle DataAnnotations evaluate karta hai, phir FluentValidation validator bhi run hota hai aur uske failures bhi `ModelState` me add ho jaate hain. Result: ek hi field ke liye do messages (`The Email field is not a valid e-mail address.` plus `Please provide a valid email.`), ya ek rule dono jagah slightly alag. Convention: chhote projects DataAnnotations only; jaise hi FluentValidation aaya, us DTO se DataAnnotations hata do (`[Required]` bhi) taaki single source of truth rahe.",
    followUp: "Team me ye convention kaise enforce karoge?",
    redFlag:
      "'Dono laga do, double safety' — ye maintainability aur error-contract dono todta hai.",
  },
  {
    id: "val-8",
    question:
      "DataAnnotations ke saath jo rule ship nahi hota — jaise `DateOfJoining` future me nahi ho — woh kaise add karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`ValidationAttribute` subclass banao aur `IsValid(object? value, ValidationContext context)` override karo; `ValidationResult.Success` ya error message wala `ValidationResult` return karo. Attribute stateless rakho.",
    detailedAnswer:
      "```csharp\npublic sealed class NotFutureDateAttribute : ValidationAttribute\n{\n    protected override ValidationResult? IsValid(object? value, ValidationContext context)\n    {\n        if (value is null) return ValidationResult.Success;\n        var date = value switch\n        {\n            DateOnly d => d,\n            DateTime dt => DateOnly.FromDateTime(dt),\n            _ => throw new InvalidOperationException($\"{context.MemberName} is not a date.\"),\n        };\n        return date <= DateOnly.FromDateTime(DateTime.UtcNow)\n            ? ValidationResult.Success\n            : new ValidationResult(ErrorMessage ?? \"Date cannot be in the future.\");\n    }\n}\n```\n\nAttribute har request pe reuse hota hai — usme mutable field mat rakho. FluentValidation me yahi `RuleFor(x => x.DateOfJoining).LessThanOrEqualTo(today)` ek line hai.",
    followUp: "Isi rule ko FluentValidation me port karo — kitni line lagegi aur test karna kitna aasan hai?",
  },
];

export default questions;
