import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "api-harden-1",
    question:
      "Aapne ek Web API bana li. Production pe le jaane se pehle security ke liye kya-kya karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek ordered checklist: HTTPS + HSTS, explicit CORS policy, rate limiting, security headers, request size limits, prod me verbose errors aur server banner off, DTOs, parameterized SQL, secrets in vault, dependency scan.",
    detailedAnswer:
      "Main isse ek list ki tarah bolta hoon: (1) `UseHttpsRedirection` + prod-only `UseHsts`; (2) named CORS policy explicit origins/methods/headers pe, `AllowAnyOrigin` credentials ke saath kabhi nahi; (3) .NET 8 `AddRateLimiter` per-IP aur per-user partition ke saath, login/register/OTP pe sakht; (4) security headers middleware — `X-Content-Type-Options: nosniff`, `X-Frame-Options`/CSP, `Referrer-Policy`; (5) Kestrel aur per-endpoint request size limits; (6) prod me `UseExceptionHandler` + generic `ProblemDetails` (koi stack trace nahi), `AddServerHeader = false`, Swagger band ya authenticated; (7) input DTOs pe bound taaki mass assignment na ho; (8) saara SQL parameterized, `FromSqlRaw` me interpolation nahi; (9) secrets `user-secrets`/env/vault se; (10) CI me `dotnet list package --vulnerable`. End me main inhe OWASP API Security Top 10 se map kar deta hoon taaki ye ad-hoc na lage.",
    followUp: "In me se kaunsa ek internal-only service pe kam relevant hai aur kyun?",
    redFlag:
      "Sirf 'JWT laga diya, secure hai' bolna, ya list bina kisi order/framework ke random points ki tarah dena.",
  },
  {
    id: "api-harden-2",
    question:
      "CORS actually kaam kaise karta hai? Kya wo server ko protect karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "CORS ek browser mechanism hai. Server response headers me batata hai kaunse origins allowed hain; browser decide karta hai cross-origin JavaScript response padh sakta hai ya nahi. Non-browser clients pe iska koi asar nahi.",
    detailedAnswer:
      "Jab origin A ka page origin B ki API call karta hai, browser ya to pehle ek preflight `OPTIONS` bhejta hai ya response aane par `Access-Control-Allow-Origin` jaise headers check karta hai. Agar origin allowed list me nahi hai, browser JavaScript ko response padhne se rokta hai — request server tak pahunch chuki hoti hai. Isliye CORS server-side authorization ka substitute nahi hai: `curl`, Postman, ya ek backend service CORS ko poori tarah ignore karte hain. CORS ka kaam sirf itna hai ki ek malicious website victim ke browser (aur uski session) se tumhari API ka data na padh sake. Real protection auth + authorization deti hai.",
    followUp: "Preflight `OPTIONS` request kab trigger hoti hai?",
    redFlag:
      "Ye kehna ki CORS API ko unauthorized access se bachata hai, ya ki wo backend-to-backend calls pe bhi enforce hota hai.",
  },
  {
    id: "api-harden-3",
    question:
      "Ye `Program.cs` line dekho. Isme kya problem hai?\n```csharp\napp.UseCors(p => p\n    .AllowAnyOrigin()\n    .AllowAnyHeader()\n    .AllowAnyMethod()\n    .AllowCredentials());\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`AllowAnyOrigin()` aur `AllowCredentials()` ek saath invalid hai — CORS spec isse mana karta hai aur ASP.NET Core runtime pe exception phenkta hai. Plus baaki `AllowAny*` bhi over-permissive.",
    detailedAnswer:
      "Wildcard origin ke saath credentials ka matlab hota har website ko victim ke browser se authenticated cross-origin request bhejne dena — spec jaan-boojh kar isse block karta hai, aur .NET is combo pe app start hote hi ya request pe exception deta hai. Chahe exception na bhi hota, `AllowAnyOrigin` + `AllowAnyHeader` + `AllowAnyMethod` matlab koi bhi site browser me tumhari API hit kar sakti hai. Fix: ek named policy jisme `WithOrigins` me exact frontend origins, `WithMethods`/`WithHeaders` me sirf zaroori values, aur tabhi `AllowCredentials()` jab cross-origin cookies/Authorization chahiye.",
    followUp: "Agar tumhe sach me multiple dynamic origins allow karne hain (multi-tenant) to kaise karoge?",
    redFlag:
      "Ye kehna ki ye code theek hai kyunki 'development me to chal raha hai'.",
  },
  {
    id: "api-harden-4",
    question:
      ".NET 8 ke rate limiter me fixed window, sliding window, aur token bucket me kya farak hai? Partition kaise karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Fixed window: per-window count, boundary pe burst possible. Sliding window: window ko segments me todta hai, boundary burst kam. Token bucket: steady refill + burst capacity, smooth shaping. Partition per-IP ya per-user key pe.",
    detailedAnswer:
      "Fixed window sabse simple hai — 1 minute me N — par 0:59 aur 1:00 pe mila kar 2N ka burst ho sakta hai. Sliding window us minute ko 6 segments me baant kar rolling count rakhta hai, to boundary burst chhota. Token bucket ek bucket me tokens refill karta hai fixed rate se; har request ek token leti hai; idle period me tokens jama ho kar ek controlled burst allow karte hain — API traffic shaping ke liye best. Concurrency limiter alag hai — wo simultaneous in-flight requests cap karta hai, time-based nahi. Partitioning: `PartitionedRateLimiter.Create` me key `ctx.User.Identity?.Name` (authenticated) ya `ctx.Connection.RemoteIpAddress` (anonymous) se banao, taaki ek user/IP doosre ko affect na kare. Login jaise endpoint pe ek dedicated named limiter `[EnableRateLimiting]` se.",
    followUp: "Rate limiter ko pipeline me `UseAuthentication` se pehle rakhoge ya baad me, aur kyun?",
  },
  {
    id: "api-harden-5",
    question:
      "Rate limiter per-IP partition kar raha hai, par production me sab requests same IP se aati dikh rahi hain aur legit users 429 kha rahe hain. Kya hua?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "App ek reverse proxy / load balancer ke peeche hai, to `RemoteIpAddress` proxy ka IP hai. Saare users ek partition me. `ForwardedHeaders` middleware se real client IP restore karo.",
    detailedAnswer:
      "Proxy ke peeche har TCP connection proxy se aata hai, isliye `HttpContext.Connection.RemoteIpAddress` proxy ka IP hota hai. Rate limiter sab clients ko ek hi partition me daal deta hai aur ek busy client poora quota kha kar baaki sabko throttle kar deta hai. Fix: pipeline ki shuruaat me `app.UseForwardedHeaders(...)` (`ForwardedHeadersOptions` me `ForwardedHeaders.XForwardedFor`, aur trusted proxy IPs / networks configure karke) taaki `X-Forwarded-For` se real client IP `RemoteIpAddress` pe set ho jaaye. Trusted proxies configure karna zaroori hai warna client khud `X-Forwarded-For` spoof kar sakta hai.",
    followUp: "`X-Forwarded-For` ko blindly trust karna kyun khatarnaak hai?",
    redFlag:
      "Ye kehna ki rate limiter buggy hai aur usse hata dena chahiye.",
  },
  {
    id: "api-harden-6",
    question:
      "Ek pure JSON API pe kaunse security response headers loge aur har ek kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (ya CSP `frame-ancestors 'none'`), `Referrer-Policy: no-referrer`, aur CSP `default-src 'none'`. HSTS transport ke liye.",
    detailedAnswer:
      "`nosniff` browser ko `Content-Type` maan-ne pe majboor karta hai — ek user-uploaded file ko script maan lene wala attack rok deta hai. `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'` page ko iframe me embed hone se rokta hai (clickjacking) — JSON API pe kam relevant par defence-in-depth default. `Referrer-Policy: no-referrer` outbound requests me tumhara URL (jisme id ya token ho sakta hai) `Referer` header me leak nahi hone deta. CSP `default-src 'none'` ek API ke liye theek hai kyunki wo koi HTML/script render nahi karti; agar Swagger UI serve ho rahi hai to us route ke liye relaxed CSP chahiye ya Swagger prod me band. Ye headers ek chhote middleware se ya `NetEscapades.AspNetCore.SecurityHeaders` jaisi library se set hote hain.",
    followUp: "Swagger UI ko in headers ke saath serve karna ho to kya adjust karoge?",
  },
  {
    id: "api-harden-7",
    question:
      "EF Core use kar rahe hain — kya SQL injection ki chinta karni chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Normal LINQ queries automatically parameterized hain, wahan safe. Khatra sirf `FromSqlRaw` / `ExecuteSqlRaw` me string interpolation ya concatenation se user input daalne me hai.",
    detailedAnswer:
      "`Where(e => e.Email == input)` jaisi LINQ EF ko `@p0` parameter banane par le jaati hai — value SQL text ka hissa nahi banti. Agar tum raw SQL likhna chahte ho to `FromSqlInterpolated` use karo — wo interpolated placeholders ko `SqlParameter`s me badal deta hai, dikhta interpolation jaisa hai par safe. Bug tab hai jab koi `FromSqlRaw` ke andar khud se string interpolation ya `+` se user input jod deta hai — tab wo input directly query ban jaata hai. Rule: raw SQL me kabhi khud concat mat karo; hamesha parameters ya `FromSqlInterpolated`.",
    followUp: "`FromSqlInterpolated` aur `FromSqlRaw` with a manually built string — dono me kya andar farak hai?",
    redFlag:
      "Ye kehna ki EF use karne se SQL injection bilkul possible hi nahi.",
  },
  {
    id: "api-harden-8",
    question:
      "Ek VAPT report aati hai jisme kai findings 'Security Misconfiguration' category me hain. Is bucket me typically kya-kya aata hai aur .NET me kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Missing HSTS, exposed server banner, prod me developer exception page, publicly open Swagger, missing security headers, over-permissive CORS. Zyadatar ek `Program.cs` diff + do config keys me fix.",
    detailedAnswer:
      "Ye OWASP API8 hai. Common items: (1) HSTS missing -> prod me `UseHsts`; (2) `Server: Kestrel` header -> `AddServerHeader = false`; (3) prod me detailed errors -> `UseExceptionHandler` + `ProblemDetails`, developer page sirf `IsDevelopment()`; (4) Swagger publicly open -> dev-only ya `[Authorize]` ke peeche; (5) `X-Content-Type-Options` / `X-Frame-Options` / `Referrer-Policy` missing -> headers middleware; (6) CORS `AllowAnyOrigin` -> named policy explicit origins; (7) default/verbose logging jo PII leak kare -> log scrubbing. Best practice: inhe ek reusable hardening extension method / internal NuGet package me daal kar har service me standardize karo taaki agli service me dobara na chhoote.",
    followUp: "Ye findings dobara na aayein iske liye process me kya add karoge?",
  },
];

export default questions;
