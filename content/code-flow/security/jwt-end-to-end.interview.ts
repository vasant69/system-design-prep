import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "jwt-e2e-1",
    question: "Ek JWT ki structure explain karo — usme kya-kya hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Teen base64url parts dot se separated: header (alg, typ), payload (claims jaise sub, role, exp, iss, aud), aur signature.",
    detailedAnswer:
      "JWT = `base64url(header).base64url(payload).base64url(signature)`. Header ek chhota JSON hai jisme `alg` (jaise HS256) aur `typ` hota hai. Payload me claims hote hain — registered claims `sub`, `iss`, `aud`, `exp`, `nbf`, `iat`, `jti` aur custom claims jaise `dept`. Signature header aur payload ko join karke server secret se HMAC-SHA256 hash hai. Base64url normal base64 jaisa hai par URL-safe — `+` aur `/` ki jagah `-` aur `_`, padding hata hua. Poora token `Authorization: Bearer <token>` header me jaata hai.",
    followUp: "Payload me tum kaunse claims kabhi nahi daaloge aur kyun?",
    redFlag:
      "Ye kehna ki JWT me username aur password store hota hai, ya signature ko token ka chautha part batana.",
  },
  {
    id: "jwt-e2e-2",
    question:
      "JWT signed hota hai ya encrypted? Iska practical matlab kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Signed hota hai, encrypted nahi. Payload base64url me plain hai — koi bhi decode karke padh sakta hai. Signature sirf tampering rokti hai.",
    detailedAnswer:
      "Standard JWT (JWS) sirf signed hota hai. Payload ko jwt.io pe paste karke ya `atob` se koi bhi bina key ke padh sakta hai. Signature ka kaam integrity hai — agar koi `role: User` ko `role: Admin` banaye to server pe signature recompute karne pe mismatch ho jaayega aur token reject hoga. Isliye password, PAN number, salary jaisi sensitive value kabhi claim me nahi jaati — sirf id, role, aur non-secret data. Agar payload ko sach me chhupana ho to JWE (encrypted JWT) use hota hai, par typical API auth me nahi.",
    followUp: "Agar tumhe payload ki confidentiality chahiye to kya options hain?",
    redFlag:
      "'JWT encrypted hai isliye usme sensitive data safe hai' — ye classic galti hai.",
  },
  {
    id: "jwt-e2e-3",
    question:
      "Server bina database dekhe ek JWT ko validate kaise karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Wahi secret se signature dobara compute karke token ki signature se compare karta hai, plus issuer, audience aur lifetime claims check karta hai — sab kuch token ke andar hai.",
    detailedAnswer:
      "JwtBearer handler `Authorization` header se token nikaalta hai, `Bearer ` prefix hataata hai, phir `TokenValidationParameters` ke rules chalata hai: `ValidateIssuerSigningKey` — server secret se HMAC-SHA256 recompute karke token ki signature se match; `ValidateIssuer` — `iss` claim hamare issuer se equal; `ValidateAudience` — `aud` claim hamare audience se equal; `ValidateLifetime` — `exp` aur `nbf` current UTC time ke against (`ClockSkew` tolerance ke saath). Sab pass hue to handler ek `ClaimsPrincipal` banata hai aur `HttpContext.User` set karta hai. Koi DB round-trip nahi — isi wajah se JWT stateless aur horizontally scalable hai.",
    followUp: "Iska downside kya hai — token ko turant invalid karna ho to?",
    redFlag:
      "Ye kehna ki server har request pe token ko database me stored token se compare karta hai — tab wo stateless nahi rahega.",
  },
  {
    id: "jwt-e2e-4",
    question: "HS256 aur RS256 me kya farak hai, aur kab kaunsa chunoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "HS256 symmetric hai — ek hi secret sign aur verify dono karta hai. RS256 asymmetric hai — private key sign karti hai, public key verify. Multiple verifiers ho to RS256.",
    detailedAnswer:
      "HS256 (HMAC-SHA256) me sign aur verify dono ke liye same secret chahiye — matlab jo verify kar sakta hai wo forge bhi kar sakta hai. Ek single API jo apna hi token issue aur validate karti hai, uske liye HS256 simple aur kaafi hai. RS256 me issuer ke paas private key hoti hai (sirf wahi sign kar sakta hai) aur consumers ke paas public key (sirf verify). Microservices ya ek central auth server + kai downstream services wale setup me RS256 better hai — downstream services ko sign karne ki power diye bina verify karne deta hai. Trade-off: RS256 thoda slower aur key management zyada.",
    followUp: "Microservices me har service ko public key kaise milti hai?",
  },
  {
    id: "jwt-e2e-5",
    question:
      "Ye code dekho. Isme kya problem hai?\n```csharp\nvar expires = DateTime.Now.AddMinutes(_jwt.AccessTokenMinutes);\nvar token = new JwtSecurityToken(\n    issuer: _jwt.Issuer,\n    audience: _jwt.Audience,\n    claims: claims,\n    expires: expires,\n    signingCredentials: creds);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`DateTime.Now` local time hai. `exp` claim UTC seconds me convert hota hai, to non-UTC server pe token galat expiry ke saath banega. `DateTime.UtcNow` chahiye.",
    detailedAnswer:
      "`JwtSecurityToken` `expires` ko UTC maan kar `exp` (Unix seconds) me likhta hai. Agar server IST (UTC+5:30) pe hai aur tum `DateTime.Now` do, to token effectively 5.5 ghante pehle expire ho jaayega — kai baar issue hote hi expired. Ulti timezone pe token zaroorat se zyada lamba valid rahega. Fix: hamesha `DateTime.UtcNow.AddMinutes(...)`. Yahi baat `notBefore` pe bhi lagti hai. Code compile aur run karega — ye ek silent, environment-dependent bug hai.",
    followUp: "`ClockSkew` is problem ko mask kaise kar sakta hai aur wo bura kyun hai?",
    redFlag:
      "Ye kehna ki `DateTime.Now` aur `DateTime.UtcNow` me koi practical farak nahi.",
  },
  {
    id: "jwt-e2e-6",
    question:
      "`ClockSkew` kya hai, uska default kya hai, aur production me kya set karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ye lifetime validation me allowed clock difference hai. Default 5 minute — production me 30 se 60 second.",
    detailedAnswer:
      "Server aur token issuer ki ghadiyan bilkul sync me nahi hoti, isliye `ValidateLifetime` thoda buffer deta hai — `ClockSkew`. Default poore 5 minute hai, matlab ek expired token 5 minute aur accept hota rahega, aur ek `nbf` wala token 5 minute pehle hi chal jaayega. BFSI jaise context me ye bahut zyada hai. NTP se ghadiyan sync rakho aur `ClockSkew` ko explicit `TimeSpan.FromSeconds(30)` ya 60 karo. 0 karna theek nahi — thoda drift real hota hai aur exactly-expiry pe flaky failures aayenge.",
    followUp: "Agar tum `ClockSkew` zero kar do to kaunsi flaky failure dikhegi?",
  },
  {
    id: "jwt-e2e-7",
    question:
      "JWT stateless hai to logout kaise kaam karta hai? Ek chori hua token turant kaise band karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Access token ko turant server-side revoke nahi kar sakte. Isliye short TTL + refresh token rotation, aur zaroorat pe ek server-side deny-list.",
    detailedAnswer:
      "Chunki server har request pe sirf signature aur claims check karta hai, ek valid signed token apne `exp` tak kaam karega — chahe user logout kar de. Practical strategies: (1) access token bahut short rakho, 15-30 minute, taaki damage window chhota rahe; (2) ek long-lived refresh token DB me hashed store karo — logout ya breach pe usko revoke kar do, to naya access token nahi ban paayega; (3) high-security endpoints ke liye ek `jti`-based deny-list (Redis) rakho jise auth middleware check kare — isse thoda stateful ho jaata hai par instant revoke milta hai. Bank-grade systems aksar (2) + (3) dono karte hain.",
    followUp:
      "Refresh token rotation ka matlab kya hai aur reuse detection kaise karte ho?",
    redFlag:
      "Ye kehna ki logout pe bas frontend se token delete kar dete hain aur wo kaafi security hai.",
  },
  {
    id: "jwt-e2e-8",
    question:
      "Ek team `Program.cs` me `ValidateIssuer = false` aur `ValidateAudience = false` set kar deti hai kyunki 'token accept nahi ho raha tha'. Ye kyun khatarnaak hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Isse kisi bhi issuer ka, kisi bhi API ke liye bana token accept ho jaata hai — jabki galti sirf config mismatch thi.",
    detailedAnswer:
      "`ValidateIssuer`/`ValidateAudience` confirm karte hain ki token hamare hi auth server ne banaya aur hamari hi API ke liye hai. Off karne se ek attacker ya ek doosri service ka token — jo bilkul valid signature ka ho agar secret shared ho — hamari API pe chal jaayega. Asli problem 99% baar `appsettings` me issuer/audience string ka mismatch hoti hai (environment ke hisaab se alag value). Fix values theek karna hai, validation band karna nahi. Signing key validation to kabhi bhi off nahi karni.",
    followUp:
      "`ValidateIssuerSigningKey = false` karne se kya hoga?",
    redFlag:
      "Validation flags ko debugging ke liye off karke waisa hi chhod dena.",
  },
  {
    id: "jwt-e2e-9",
    question:
      "Login pe token issue karne ke steps code me batao — verify se lekar string tak.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Credentials verify karo, `Claim[]` banao, `SymmetricSecurityKey` + `SigningCredentials(HmacSha256)`, `JwtSecurityToken` banao UTC expiry ke saath, phir `WriteToken`.",
    detailedAnswer:
      "```csharp\nvar user = await _users.ValidateCredentialsAsync(req.Username, req.Password);\nif (user is null)\n    return Unauthorized(); // generic 401 — kabhi mat batao kaunsa field galat tha\n\nvar claims = new[]\n{\n    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),\n    new Claim(ClaimTypes.Name, user.Username),\n    new Claim(ClaimTypes.Role, user.Role),\n    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())\n};\n\nvar key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));\nvar creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);\nvar expires = DateTime.UtcNow.AddMinutes(_jwt.AccessTokenMinutes);\n\nvar token = new JwtSecurityToken(\n    issuer: _jwt.Issuer, audience: _jwt.Audience,\n    claims: claims, notBefore: DateTime.UtcNow, expires: expires,\n    signingCredentials: creds);\n\nvar tokenString = new JwtSecurityTokenHandler().WriteToken(token);\n```\nKey points: secret `IOptions<JwtOptions>` se aata hai hardcoded nahi, expiry UTC me, generic error message, aur `Jti` future revocation ke liye. Nayi API me `JsonWebTokenHandler.CreateToken(SecurityTokenDescriptor)` recommended hai — concept same.",
    followUp:
      "Is logic ko `AuthController` se `ITokenService` me nikaalne ka kya fayda hai?",
  },
];

export default questions;
