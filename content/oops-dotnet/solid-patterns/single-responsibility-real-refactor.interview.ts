import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "srp-tr-1",
    question: "SRP kya hai? Iski common misinterpretation kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer:
      "SRP: ek class ka sirf ek hi reason to change hona chahiye. Common misinterpretation hai isko 'ek class me ek hi method' samajhna.",
    detailedAnswer:
      "Robert Martin ki actual definition 'one reason to change' hai — matlab sirf ek actor ya business concern us class ko modify karwa sake. Log isko galat samajh lete hain method-count ke hisaab se, jo galat hai. Ek class me 4-5 methods ho sakte hain aur phir bhi SRP follow kar sakti hai agar sab methods EK hi responsibility ke around hain.",
    followUp: "Ek real example do jahan tumne SRP violation dekha ya fix kiya ho.",
  },
  {
    id: "srp-tr-2",
    question: "Ye class SRP violate karti hai ya nahi? Kyun?\n```csharp\npublic class UserValidator\n{\n    public void ValidateEmail(string email) { /* ... */ }\n    public void ValidatePassword(string password) { /* ... */ }\n}\n```",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi, SRP violate nahi karti — dono methods EK hi responsibility (validation) ke around hain.",
    detailedAnswer:
      "Ye ek trap question hai jo test karta hai ki candidate SRP ko method-count se confuse to nahi karta. Do methods hone ka matlab SRP violation nahi hai — dono methods 'user input validate karna' ke hi under aate hain, ek hi actor (business rules team) dono ko change karwayega. Agar iske andar ek DB-saving method bhi hoti, tab SRP violate hoti.",
    redFlag: "Ye bolna 'haan violate karti hai kyunki do methods hain' — ye method-count misconception hai.",
  },
  {
    id: "srp-tr-3",
    question: "Production me ek UserRegistrationService hai jo validation + persistence + email sab karti hai. Tumhe isko refactor karne ko kaha gaya hai. Kaise approach karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Teen responsibilities ko IUserValidator, IUserRepository, IWelcomeNotifier interfaces me split karo, ek thin orchestrator class se coordinate karo.",
    detailedAnswer:
      "Pehle identify karo kitne alag 'reasons to change' hain — is case me teen (validation rules, storage, notification). Har ek ko apni class/interface do. UserRegistrationService khud ek orchestrator ban jaati hai jo constructor-injected teeno interfaces ko sequence me call karti hai. Isse har part independently testable aur changeable ho jaata hai, aur ek change doosre ko accidentally break nahi karta.",
    followUp: "Isse unit testing kaise easier hoti hai — concrete example do.",
  },
  {
    id: "srp-tr-4",
    question: "Ye code kya problem create karta hai jab tum sirf validation logic test karna chahte ho?\n```csharp\npublic class UserRegistrationService\n{\n    private readonly AppDbContext _db;\n    private readonly SmtpClient _smtp;\n    public async Task RegisterAsync(RegisterUserDto dto)\n    {\n        if (dto.Password.Length < 8) throw new ArgumentException(\"short\");\n        _db.Users.Add(new User { Email = dto.Email });\n        await _db.SaveChangesAsync();\n        await _smtp.SendMailAsync(new MailMessage(\"a@b.com\", dto.Email, \"Hi\", \"body\"));\n    }\n}",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Sirf validation test karne ke liye bhi real ya mocked AppDbContext aur SmtpClient dono chahiye honge — validation logic isolate nahi ho sakti.",
    detailedAnswer:
      "Kyunki teeno responsibilities ek hi method me tightly coupled hain, koi bhi unit test 'sirf validation check karo' likhne ke liye poori DbContext aur SmtpClient dependency chain ko mock/stub karna padega, chahe wo test sirf password-length validation ke baare me ho. Ye SRP violation ka ek concrete testability symptom hai — split karne ke baad IUserValidator ko isolate test karna trivial ho jaata hai, koi DB/SMTP mock ki zaroorat nahi.",
  },
  {
    id: "srp-tr-5",
    question: "Kya SRP ka matlab hai ki har class me maximum 1-2 methods hi hone chahiye?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — SRP method count ke baare me nahi hai, reasons-to-change ke baare me hai.",
    detailedAnswer:
      "Ye ek bahut common trap hai. SRP directly method count ko limit nahi karta. Ek class me 10 methods ho sakte hain aur phir bhi SRP follow kar sakti hai agar sab EK hi cohesive responsibility ke around hain (jaise ek StringFormatter class ke andar FormatDate, FormatCurrency, FormatPercentage — sab 'formatting' ki hi responsibility hai). Ulta, 2 methods wali class bhi violate kar sakti hai agar wo do methods do alag unrelated concerns handle karte hain.",
    redFlag: "'Har class me ek method hona chahiye' bolna — ye SRP ki definition nahi hai.",
  },
  {
    id: "srp-tr-6",
    question: "SRP-compliant classes banane ka downside/risk kya ho sakta hai agar overdo kiya jaaye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Bahut zyada chhoti classes banane se unnecessary indirection aur navigation complexity badh jaati hai bina real maintainability benefit ke.",
    detailedAnswer:
      "SRP ek principle hai, dogma nahi. Agar har chhoti operation ko alag class/interface me daal diya jaaye bina genuine independent-change-reason ke, to codebase me bahut saari tiny files/classes ban jaati hain jinko samajhne ke liye developer ko multiple jumps karne padte hain — 'indirection fatigue.' Judgment call zaroori hai: split tabhi karo jab do responsibilities genuinely alag actors/timelines pe change hoti hon.",
    followUp: "To phir kaise decide karoge ki split karna chahiye ya nahi ek specific case me?",
  },
  {
    id: "srp-tr-7",
    question: "Interview me tumse pucha jaaye 'Controller me business logic kyun nahi likhni chahiye' — SRP ke context me jawaab do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Controller ki responsibility HTTP concerns (routing, model binding, status codes) hai, business logic alag actor (product/business team) ke through change hoti hai.",
    detailedAnswer:
      "Agar Controller me business logic bhi ho, to do alag reasons se change hoga — HTTP-layer concerns badlein (jaise response format) YA business rules badlein. In dono ko alag rakhna (Controller thin, Service business logic) matlab dono independently evolve ho sakte hain bina ek dusre ko affect kiye. Ye ASP.NET Core ke apne Controller/Service layering me hi demonstrate hota hai.",
  },
  {
    id: "srp-tr-8",
    question: "Ye refactored code me kya galat hai?\n```csharp\npublic class UserValidator : IUserValidator\n{\n    private readonly AppDbContext _db;\n    public void Validate(RegisterUserDto dto)\n    {\n        if (dto.Password.Length < 8) throw new ArgumentException(\"short\");\n        if (_db.Users.Any(u => u.Email == dto.Email)) throw new ArgumentException(\"duplicate\");\n    }\n}",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "UserValidator ab bhi do responsibilities mix kar raha hai — pure validation (password length) aur DB-dependent uniqueness check.",
    detailedAnswer:
      "Refactor ka naam SRP fix hai, lekin yahan UserValidator ab DbContext pe depend karta hai duplicate-email check ke liye — ye validation aur persistence-query dono ko wapas mix kar raha hai, bas dusri class ke andar. Cleaner approach: duplicate-check ko IUserRepository.ExistsByEmailAsync() jaisa method me rakho, orchestrator dono ko sequence kare — validator sirf format/rules check kare, repository sirf data query kare.",
    redFlag: "Ye maan lena ki 'interface pe split kar diya to SRP automatically follow ho gaya' — split karna necessary hai lekin sufficient nahi, andar bhi responsibility clean honi chahiye.",
  },
];

export default questions;
