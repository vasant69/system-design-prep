import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "policy-authz-tr-1",
    question: "Role-based, claims-based, aur policy-based authorization me exact hierarchy/difference batao.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Paytm"],
    shortAnswer: "Role-based sabse simple/static hai; claims-based ise generalize karta hai kisi bhi claim tak; policy-based composable, named, custom logic allow karta hai.",
    detailedAnswer:
      "Role-based authorization (`[Authorize(Roles = \"Admin\")]`) sirf ek specific claim type (role) ki static membership check karta hai. Claims-based authorization is idea ko generalize karta hai — kisi bhi claim (jaise Department, DateOfBirth) ke against check kar sakta hai, sirf role tak limited nahi. Policy-based authorization sabse flexible hai — ek named policy multiple role/claim checks compose kar sakti hai, ya ek poora custom IAuthorizationRequirement/IAuthorizationHandler encapsulate kar sakti hai jo koi bhi arbitrary logic evaluate kare. Controller code sirf policy ka naam reference karta hai (jaise Policy = \"MinimumAge\"), underlying logic se decoupled rehta hai.",
    followUp: "Policy-based approach ka maintainability benefit kya hai jab business rule change ho?",
  },
  {
    id: "policy-authz-tr-2",
    question: "Resource-based authorization ki zaroorat kab padti hai, aur ye role/policy-based se kaise alag hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft"],
    shortAnswer: "Jab decision resource ki specific data pe depend kare (jaise 'apna khud ka resource'), sirf user ki identity pe nahi.",
    detailedAnswer:
      "Role/claims/policy-based authorization sab sirf user ke ClaimsPrincipal (identity/claims) ko dekhte hain — resource ko bilkul nahi dekhte. Resource-based authorization ek custom IAuthorizationHandler use karta hai jise actual resource object (jaise ek fetched Order entity) pass hota hai, taaki decision us resource ki actual state (jaise order.CreatedByUserId == currentUserId) pe based ho sake. Ye tabhi possible hai jab resource ko pehle explicitly fetch kiya jaaye — is wajah se ye [Authorize] attribute se automatic nahi hoti, action code ke andar explicit AuthorizationService.AuthorizeAsync() call chahiye hoti hai.",
  },
  {
    id: "policy-authz-tr-3",
    question: "Ye code kya karega?\n```csharp\n[Authorize(Roles = \"Admin\")]\n[Authorize(Roles = \"Manager\")]\npublic IActionResult Approve() => Ok();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "AND logic — user ke paas dono, Admin AUR Manager, roles hone chahiye, kyunki multiple [Authorize] attributes independently evaluate hote hain aur sab pass hone chahiye.",
    detailedAnswer:
      "Ek single [Authorize(Roles = \"Admin,Manager\")] me comma OR hota hai — koi bhi ek role kaafi. Lekin do ALAG stacked [Authorize] attributes har ek apni condition independently enforce karte hain, aur dono ko pass hona zaroori hai — effectively AND logic. Ye syntax subtlety interview me specifically test hoti hai kyunki visually similar dikhte hue bhi (dono me 'Roles' likha hai) semantics completely alag hai.",
  },
  {
    id: "policy-authz-tr-4",
    question: "Ek developer role explosion kar deta hai — har chhote business rule ke liye naya role banata hai (jaise 'SeniorManagerWithSalesAccess'). Ye approach kyun problematic hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Roles static identity attributes ke liye design hue hain; complex/combined conditions ke liye policy-based approach zyada maintainable hai.",
    detailedAnswer:
      "Har naye business-rule-combination ke liye ek naya role banana — 'role explosion' — jaldi hi unmanageable ho jaata hai: roles ka count business-rule-combinations ke saath exponentially badh sakta hai, user-management (kisko kaunsa role assign karein) complicated ho jaata hai, aur roles semantically diluted ho jaate hain (ek role ab pure identity attribute nahi rehta, ek complex conditional flag ban jaata hai). Policy-based authorization isi problem ko solve karta hai — multiple simple roles/claims ko ek named policy me compose kiya ja sakta hai bina naye roles invent kiye, aur logic ek jagah maintain hoti hai.",
    redFlag: "Har naye access-control requirement ke liye pehla instinct 'naya role bana do' hona — ye policy-based/claims-based alternatives ko consider na karne ka signal hai.",
  },
  {
    id: "policy-authz-tr-5",
    question: "Custom IAuthorizationHandler ko typically Singleton kyun register kiya jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Handlers typically stateless evaluation logic hote hain — koi per-request mutable state nahi rakhte, isliye ek hi instance safely reuse ho sakta hai.",
    detailedAnswer:
      "Authorization handlers typically sirf ek function ki tarah behave karte hain — input (context, requirement) lete hain, evaluate karte hain, Succeed()/nothing call karte hain, koi internal mutable state maintain nahi karte requests ke beech. Isliye Singleton lifetime safe aur efficient hai — har request ke liye naya instance banane ki zaroorat nahi. Agar handler ko genuinely per-request state chahiye ho (jaise Scoped DbContext dependency), Scoped registration bhi valid hai — decision handler ki actual dependencies pe depend karta hai.",
  },
  {
    id: "policy-authz-tr-6",
    question: "Ek scenario: `AuthorizeAsync()` call karne ke baad `authResult.Succeeded == false` hai. Controller me is case ko kaise handle karoge, aur kaunsa status code return karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "return Forbid() — 403, kyunki user authenticated tha, sirf specific resource ke liye permission nahi mili.",
    detailedAnswer:
      "AuthorizeAsync() failure ka matlab hai user ne authentication successfully pass ki (warna wo request yahan tak pahunchti hi nahi, [Authorize] attribute pehle hi reject kar deta), lekin is specific resource ke liye required permission nahi hai. ControllerBase.Forbid() helper 403 Forbidden response generate karta hai, jo is scenario ke liye semantically sahi hai — NotFound() (404) ya Unauthorized() (401) galat signal denge, kyunki resource exist karta hai aur user authenticated hai.",
  },
  {
    id: "policy-authz-tr-7",
    question: "Kya ek policy me role check aur custom requirement dono combine ho sakte hain ek saath?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — AddPolicy builder me RequireRole(), RequireClaim(), aur Requirements.Add() sab chain/combine kiye ja sakte hain, sab conditions AND logic se evaluate hoti hain.",
    detailedAnswer:
      "AuthorizationPolicyBuilder fluent API allow karta hai multiple requirements ek policy me add karne ke — jaise policy.RequireRole(\"Manager\").RequireClaim(\"Department\", \"Sales\").Requirements.Add(new CustomRequirement()). Jab policy evaluate hoti hai, saare requirements ko satisfy hona chahiye (AND logic) — agar koi bhi ek fail ho, poori policy fail ho jaati hai. Ye policy-based approach ki flexibility dikhata hai — role, claim, aur custom logic ek hi named policy ke andar combine ho sakte hain.",
  },
];

export default questions;
