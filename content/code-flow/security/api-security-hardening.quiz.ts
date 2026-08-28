import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "api-security-hardening-1",
    question:
      "Ek CORS policy me `AllowAnyOrigin()` aur `AllowCredentials()` dono lagane par kya hota hai?",
    options: [
      "Sab kuch theek chalta hai, ye recommended setup hai",
      "Ye combo CORS spec me invalid hai aur ASP.NET Core runtime pe exception phenkta hai",
      "Credentials silently ignore ho jaate hain",
      "Sirf GET requests ke liye kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Wildcard origin ke saath credentials ka matlab hota 'kisi bhi website ko authenticated cross-origin request karne do', jo CORS spec jaan-boojh kar mana karta hai. ASP.NET Core is combo pe runtime exception deta hai. Credentials chahiye to origins ko `WithOrigins` me explicitly list karna padta hai. Ye silently ignore nahi hota aur method-specific bhi nahi hai.",
    difficulty: "medium",
  },
  {
    id: "api-security-hardening-2",
    question:
      ".NET 8 rate limiter behind a reverse proxy chal raha hai aur partition key `RemoteIpAddress` par hai. Bina `ForwardedHeaders` middleware ke kya galat hoga?",
    options: [
      "Rate limiter bilkul kaam nahi karega",
      "Har request ka source proxy ka IP hoga, to saare users ek hi partition me gir kar ek doosre ko throttle karenge",
      "Har request ko alag partition milega, limit kabhi enforce nahi hogi",
      "Sirf HTTPS requests count hongi",
    ],
    correctIndex: 1,
    explanation:
      "Proxy ke peeche `RemoteIpAddress` proxy ka IP hota hai, real client ka nahi. Sab clients ek hi partition me aa jaate hain, to ek busy user poora quota kha kar baaki sabko 429 dila deta hai. `ForwardedHeaders` middleware `X-Forwarded-For` se real client IP restore karta hai. Limiter kaam to karta hai, bas galat key par; aur alag-alag partition wali baat iska ulta hai.",
    difficulty: "hard",
  },
  {
    id: "api-security-hardening-3",
    question:
      "EF Core me SQL injection ka asli khatra kaunse case me hai?",
    options: [
      "Normal LINQ query jaise `Where(e => e.Email == input)`",
      "`FromSqlRaw` ke andar string interpolation ya string concatenation se user input daalna",
      "`FromSqlInterpolated` with an interpolated string argument",
      "`SaveChangesAsync` call karna",
    ],
    correctIndex: 1,
    explanation:
      "EF ki normal LINQ queries automatically parameterized hoti hain — `input` ek `@p0` parameter banta hai, concat nahi. `FromSqlInterpolated` bhi interpolated string ko `SqlParameter`s me convert karta hai, isliye safe hai. Khatra sirf `FromSqlRaw` ke andar interpolation ya `+` concatenation me hai — wahan user input seedha SQL text ban jaata hai. `SaveChangesAsync` ka injection se koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "api-security-hardening-4",
    question:
      "Production me `UseHsts()` aur developer exception page ke baare me kaunsa statement sahi hai?",
    options: [
      "`UseHsts()` dev aur prod dono me lagao; developer exception page prod me rakhna theek hai",
      "`UseHsts()` sirf prod me (dev me localhost HTTPS pe pin ho jaata hai); developer exception page prod me band, uski jagah generic ProblemDetails",
      "`UseHsts()` sirf dev me lagao; prod me kabhi nahi",
      "Dono cheezein sirf tab matter karti hain jab API cookies use kare",
    ],
    correctIndex: 1,
    explanation:
      "`UseHsts()` browser ko domain pe hamesha HTTPS use karne ko bolta hai — dev me lagane se `localhost` browser me HTTPS pe pin ho jaata hai aur local kaam tootta hai, isliye prod-only. Developer exception page stack trace, file paths aur SQL leak karta hai; prod me `UseExceptionHandler` + generic `ProblemDetails` + `traceId` (detail sirf logs me). Ye transport aur error-disclosure concerns hain, cookies se independent.",
    difficulty: "easy",
  },
];

export default quiz;
