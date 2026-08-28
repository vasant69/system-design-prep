import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "authnz-1",
    question: "Authentication aur authorization me kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Authentication identity verify karta hai — kaun ho, credentials se prove. Authorization decide karta hai us identity ko ye action allowed hai ya nahi. AuthN pehle, AuthZ baad me.",
    detailedAnswer:
      "Authentication me caller apna proof deta hai (password, token, certificate), server verify karke ek identity banata hai — ASP.NET Core me `HttpContext.User` ek `ClaimsPrincipal` ke roop me. Authorization us already-known identity ke against rules evaluate karta hai: role, policy, ya claim requirement. Sequence fixed hai — authorization ke paas judge karne ke liye identity chahiye, jo authentication banata hai. Missing/invalid identity pe 401, valid identity par insufficient permission pe 403.",
    followUp: "In dono ke corresponding middleware kaunse hain aur pipeline me kis order me lagte hain?",
    redFlag:
      "'Dono ek hi cheez hain' ya '401 aur 403 ka koi khaas farak nahi' bolna — ye turant fail kar deta hai.",
  },
  {
    id: "authnz-2",
    question: "Program.cs me UseRouting, UseAuthentication, UseAuthorization, MapControllers ka order kya hoga aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "UseRouting → UseAuthentication → UseAuthorization → MapControllers.",
    detailedAnswer:
      "Routing pehle isliye ki authorization ko pata hona chahiye kaunsa endpoint match hua taaki uske `[Authorize]` / policy metadata dekh sake. Authentication uske baad `HttpContext.User` ko `ClaimsPrincipal` se bharta hai. Authorization phir us `User` ke against endpoint ki requirements check karta hai aur zaroorat pe request short-circuit karta hai (401/403). MapControllers last — tab hi action chalti hai jab sab pass ho. Agar authentication authorization ke baad rakh do, `User` populate hi nahi hoga aur har protected request 401 dega.",
    followUp: "Agar UseAuthentication bilkul bhool jao to endpoint ke [Authorize] ka kya behavior hoga?",
    redFlag: "Order yaad na hona ya 'order matter nahi karta' kehna.",
  },
  {
    id: "authnz-3",
    question: "ClaimsPrincipal, ClaimsIdentity aur Claim ka aapas me kya relation hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "ClaimsPrincipal = poora user; usme 1+ ClaimsIdentity; har identity me 0+ Claim (key/value strings jaise name, role, sub).",
    detailedAnswer:
      "`ClaimsPrincipal` current user ko represent karta hai aur `HttpContext.User` isi type ka hai. Usme ek ya zyada `ClaimsIdentity` ho sakti hain (multiple auth schemes ke liye), aur har `ClaimsIdentity` ke andar `Claim` objects ki list — har claim ek `Type`/`Value` pair (`ClaimTypes.Name`, `ClaimTypes.Role`, `ClaimTypes.NameIdentifier`, ya custom `dept`). Code me `User.FindFirstValue(ClaimTypes.NameIdentifier)`, `User.IsInRole(\"Admin\")`, `User.Claims` se padhte ho. JWT bearer handler token ke payload claims ko in `Claim` objects me map karta hai.",
    followUp: "Role claim ka default claim type kaunsa hai aur JWT me wo kis key se aata hai?",
  },
  {
    id: "authnz-4",
    question:
      "Ek team keh rahi hai 'humne JWT authentication laga diya hai, ab API secure hai'. Isme kya galat hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Authentication sirf 'kaun' batata hai. Bina authorization ke har authenticated user sab kuch kar sakta hai — write endpoints abhi bhi khule hain.",
    detailedAnswer:
      "Authentication ke baad ek naya joinee bhi valid token le sakta hai aur `DELETE /api/employees/5` chala sakta hai — token valid tha to request pass. Secure karne ke liye har write endpoint pe authorization chahiye: bare `[Authorize]` (koi bhi authenticated) se aage badh kar `[Authorize(Roles=\"Admin,HrManager\")]` ya ek policy. AuthN + AuthZ dono chahiye; ek missing ho to system ya andha hai ya khula.",
    followUp: "Hamare Employee endpoints pe tum kaunse verbs open rakhoge aur kaunse lock, aur kaise?",
    redFlag: "Ye maan lena ki valid token = full access, aur authorization ko optional samajhna.",
  },
  {
    id: "authnz-5",
    question: "APIs ke liye cookie authentication ki jagah bearer token kyun choose karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Bearer token stateless hai, har client type (SPA, mobile, service) se chalta hai, aur browser use apne aap attach nahi karta isliye CSRF surface nahi.",
    detailedAnswer:
      "Cookie auth server-managed session pe depend karta hai aur browser cookie ko har same-site request pe apne aap bhejta hai — server-rendered apps ke liye theek, par cross-domain SPA/mobile pe dard aur CSRF ka risk. Bearer token self-contained JWT hai jo client explicitly `Authorization: Bearer <token>` header me bhejta hai: server ko kuch store nahi karna (horizontal scaling easy), same token web/mobile/service-to-service sab jagah, aur automatic attach na hone se CSRF nahi. Trade-off: token client ke paas hai, leak hua to expiry tak valid — isliye short access token + refresh token.",
    followUp: "Bearer token ka sabse bada downside kya hai aur usse kaise handle karte ho?",
  },
  {
    id: "authnz-6",
    question:
      "Code-output: ek action me `if (User.Identity?.IsAuthenticated != true) return Unauthorized();` hai. Agar request bina kisi Authorization header ke aaye to kya hota hai, aur agar galat token ho to?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Dono case me `IsAuthenticated` false ya null, to action `Unauthorized()` yaani 401 return karti hai.",
    detailedAnswer:
      "Bina header ke: authentication handler koi identity nahi banata, `User` anonymous principal rehta hai, `User.Identity?.IsAuthenticated` false — 401. Galat/expired token: JWT bearer handler validation fail karta hai, identity attach nahi hoti, wahi anonymous `User` — 401. Note: `UseAuthorization` khud bhi anonymous user ko `[Authorize]` endpoint pe 401 de deta, ye manual check tab useful hai jab endpoint pe `[AllowAnonymous]` ho par tum andar conditionally behave karna chahte ho.",
    followUp: "Agar tum `return Forbid()` likh dete anonymous case me to client ke liye kya galat signal jaata?",
    redFlag: "Ye kehna ki bina token ke request server tak pahunchti hi nahi — pahunchti hai, bas User anonymous hota hai.",
  },
  {
    id: "authnz-7",
    question: "Authentication 'scheme' aur 'handler' kya hote hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Scheme ek naam hai (jaise \"Bearer\", \"Cookies\"); handler wo class hai jo us scheme ke liye request se identity banati hai.",
    detailedAnswer:
      "`AddAuthentication(\"Bearer\")` default scheme ka naam set karta hai; `.AddJwtBearer(\"Bearer\", ...)` us naam ke against `JwtBearerHandler` register karta hai. Handler hi request inspect karta hai (header padhna, signature/claims validate karna) aur success pe `AuthenticateResult` me ek `ClaimsPrincipal` deta hai. Multiple schemes ho sakti hain — ek API cookie aur bearer dono accept kar sakti hai, aur `[Authorize(AuthenticationSchemes = \"Bearer\")]` se per-endpoint choose kar sakte ho. Bare `[Authorize]` default scheme use karta hai.",
    followUp: "Ek endpoint pe do schemes allow karni ho to kaise likhoge?",
  },
  {
    id: "authnz-8",
    question:
      "Non-controller code (jaise ek service class) me current user ki id kaise nikaaloge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`IHttpContextAccessor` inject karo aur `_httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)` padho.",
    detailedAnswer:
      "Controller me `User` property directly milti hai, par service layer me nahi. `builder.Services.AddHttpContextAccessor()` register karo, phir service ke constructor me `IHttpContextAccessor` inject karo. Better pattern: ek chhota `ICurrentUser` abstraction banao jo `HttpContext.User` se id/role nikaal ke expose kare — isse service testable rehti hai aur HTTP concern leak nahi hota. Kabhi bhi static/thread-local se current user mat dhoondho, wo ASP.NET Core me reliable nahi.",
    followUp: "ICurrentUser abstraction ko unit test me kaise fake karoge?",
    redFlag: "`Thread.CurrentPrincipal` ya kisi static holder se user nikaalna — .NET Framework ki purani aadat.",
  },
];

export default questions;
