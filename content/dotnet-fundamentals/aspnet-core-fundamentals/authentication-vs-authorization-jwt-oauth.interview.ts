import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "authn-authz-tr-1",
    question: "Authentication aur authorization me exact difference batao, ek concrete example ke saath.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Paytm"],
    shortAnswer: "Authentication = identity verify karna (who are you); authorization = us identity ki permissions check karna (what can you do).",
    detailedAnswer:
      "Authentication ek request ke credentials (password, token) check karke confirm karta hai user genuinely who it claims to be — successful hone par ek ClaimsPrincipal establish hota hai. Authorization is established identity ke against decide karta hai wo kya kar sakti hai — jaise ek 'Customer' role wale authenticated user ko 'Admin'-only endpoint access karne se rokna. Example: ek user valid credentials se login karta hai (authentication pass) lekin admin panel access karne ki koshish karta hai jiske liye uske paas role nahi hai (authorization fail) — response 403 Forbidden hoga, 401 nahi, kyunki identity already verified thi.",
    followUp: "In dono failures ke liye ASP.NET Core kaunse exact status codes return karta hai?",
  },
  {
    id: "authn-authz-tr-2",
    question: "JWT ke teen parts kya hain, aur har ek ka role kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Amazon"],
    shortAnswer: "Header (algorithm/type), Payload (claims — data), Signature (integrity/tamper-detection) — dot-separated, base64url-encoded.",
    detailedAnswer:
      "Header token type (JWT) aur signing algorithm (jaise HS256, RS256) specify karta hai. Payload actual claims carry karta hai — standard claims (sub, exp, iss, aud) aur custom claims (roles, email). Signature header aur payload ka cryptographic hash hai, secret ya private key se signed — server ye verify kar sakta hai ki koi bhi part tamper nahi hua bina database check kiye. Teeno base64url-encoded hain aur dot (.) se separated string banate hain: header.payload.signature.",
  },
  {
    id: "authn-authz-tr-3",
    question: "Kya ye statement sahi hai: 'JWT encrypted hota hai, isliye payload me user ka pura profile data safely store kar sakte hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — JWT payload sirf base64-encoded aur signed hai, encrypted nahi. Koi bhi payload decode karke padh sakta hai.",
    detailedAnswer:
      "Ye ek classic misconception hai. Signature sirf integrity guarantee karta hai — agar payload modify ho, signature verification fail ho jaayegi, isliye tampering detectable hai. Lekin base64url encoding ek encryption nahi hai — reversible hai, koi bhi (jaise jwt.io tool se) token le kar payload decode kar sakta hai bina kisi key ke. Isliye sensitive data (passwords, full financial info, PII jo hide honi chahiye) JWT payload me kabhi nahi honi chahiye. Agar genuinely confidentiality chahiye, JWE (JSON Web Encryption) ek alag, encryption-focused standard hai — plain signed JWT (JWS) nahi.",
    redFlag: "'JWT encrypted hai' bolna signed aur encrypted ke fundamental difference ko na samajhna dikhata hai — ye security-sensitive misconception hai.",
  },
  {
    id: "authn-authz-tr-4",
    question: "JWT-based (stateless) authentication vs cookie-based (stateful session) authentication me trade-offs kya hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "JWT stateless aur horizontally-scale-friendly hai lekin revocation mushkil hai; cookie sessions revoke karna easy hai lekin server-side session store chahiye.",
    detailedAnswer:
      "JWT self-contained hai — server ko har request pe database/session-store check karne ki zaroorat nahi, sirf signature/expiry verify karna hota hai. Ye horizontally scaled, load-balanced APIs ke liye ideal hai kyunki koi shared session state maintain nahi karni. Trade-off: ek issued JWT ko genuinely 'revoke' karna hard hai — ye apni expiry tak valid rehta hai jab tak explicit revocation-list (blacklist check, jo statelessness ko partially defeat karta hai) na ho. Cookie-based session auth server-side session store maintain karta hai — session ko turant invalidate karna easy hai (bas server-side entry delete karo), lekin ye har request pe session-store lookup maangta hai aur horizontal scaling ke liye shared/sticky session infrastructure chahiye. Modern API/SPA/mobile scenarios me JWT zyada common hai; traditional server-rendered browser apps me cookie session bhi still valid choice hai.",
  },
  {
    id: "authn-authz-tr-5",
    question: "OAuth aur OpenID Connect (OIDC) me kya fark hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "OAuth delegated authorization protocol hai; OIDC OAuth ke upar ek authentication layer add karta hai.",
    detailedAnswer:
      "OAuth core purpose hai ek app ko user ke resources ka scope-limited access dena bina password share kiye — ye fundamentally authorization ke baare me hai ('is app ko ye kaam karne do'). OpenID Connect OAuth 2.0 ke upar build hota hai aur ek standardized identity layer add karta hai — ek ID Token (khud ek JWT) provide karta hai jo user ki identity ko authenticate karta hai. Practically, 'Sign in with Google/Microsoft' flows OIDC use karte hain (identity verify karne ke liye), jabki pure OAuth scenarios (jaise 'is app ko meri Google Drive files access karne do') sirf authorization ke baare me hote hain, identity claim ke baare me nahi.",
    followUp: "Ek ID Token aur Access Token OIDC/OAuth flow me kya alag role play karte hain?",
  },
  {
    id: "authn-authz-tr-6",
    question: "Ye code review scenario: ek developer ne UseAuthorization() ko UseAuthentication() se pehle register kar diya. Kya symptom dikhega?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Authorization checks fail hongi ya galat behave karengi kyunki User (ClaimsPrincipal) abhi tak populate nahi hua hoga jab authorization evaluate ho rahi hai.",
    detailedAnswer:
      "UseAuthentication() middleware request ke credentials process karke HttpContext.User ko ek populated ClaimsPrincipal se set karta hai. Agar UseAuthorization() isse pehle chalta hai, us waqt HttpContext.User abhi tak anonymous/unauthenticated state me hoga — [Authorize] attributes wale endpoints consistently 401/403 denge chahe valid credentials bhi bheje jaayen, kyunki authorization stage ko pata hi nahi ki authentication ne kya establish kiya (jo abhi hua hi nahi hai us point tak). Fix simple hai: order swap karo — UseAuthentication() phir UseAuthorization().",
  },
  {
    id: "authn-authz-tr-7",
    question: "Ek naya intern kehta hai 'humein sirf [Authorize] laga dena chahiye har controller pe, authentication automatically ho jaayegi.' Ye statement kahan galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "[Authorize] sirf authorization enforce karta hai (request ko authenticated hona chahiye) — authentication scheme (jaise JWT bearer) already configure aur middleware pipeline me register honi chahiye, warna [Authorize] bhi kaam nahi karega.",
    detailedAnswer:
      "[Authorize] attribute authorization middleware ka trigger hai — ye check karta hai ki current request authenticated hai ya nahi (aur agar roles/policy specify ki hain, wo bhi). Lekin authentication khud AddAuthentication()/AddJwtBearer() (ya jo bhi scheme use ho) se explicitly configure honi chahiye Program.cs me, aur UseAuthentication() middleware pipeline me register honi chahiye. Bina in setup steps ke, [Authorize] attribute laga dene se bhi requests properly authenticate nahi hongi — framework ko pata hi nahi hoga tokens kaise validate karne hain.",
    redFlag: "[Authorize] attribute ko poora authentication setup samajh lena — ye sirf enforcement point hai, actual authentication mechanism (scheme, validation parameters) alag se configure karni hoti hai.",
  },
  {
    id: "authn-authz-tr-8",
    question: "Ek fintech API me high-value transfers ke liye extra authorization layer chahiye jo sirf role-based [Authorize(Roles=\"...\")] se possible nahi (jaise 'sirf apna khud ka account access kar sakte ho, transfer amount account tier limit ke andar hona chahiye'). Kaunsa approach use karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Policy-based ya resource-based authorization (custom IAuthorizationHandler) — role-based authorization itni fine-grained, data-dependent logic express nahi kar sakta.",
    detailedAnswer:
      "Role-based [Authorize(Roles=\"...\")] sirf static role membership check kar sakta hai, resource ke actual data (jaise 'is this account mine', 'is amount within my tier limit') ke against decide nahi kar sakta. Is scenario ke liye policy-based authorization ya explicitly resource-based authorization chahiye — ek custom IAuthorizationHandler likhna jo current user ke claims aur requested resource (account, amount) dono ko dekh kar decide kare. Ye topic policy-and-role-based-authorization me detail se cover hota hai.",
  },
];

export default questions;
