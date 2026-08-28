import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "middleware-and-the-request-pipeline-1",
    question:
      "Tumne `app.UseRequestLogging()` ko `Program.cs` me `app.MapControllers()` ke BAAD likha. `GET /api/employees` hit karne par kya hoga?",
    options: [
      "Middleware normally chalega aur request log hogi",
      "Middleware matched Controller routes ke liye kabhi nahi chalega, kyunki MapControllers terminal hai",
      "App start hi nahi hoga — compile error aayega",
      "Middleware chalega lekin status code hamesha 404 log karega",
    ],
    correctIndex: 1,
    explanation:
      "`MapControllers` terminal middleware hai — jab route match ho jaata hai, wo `next` call nahi karta, isliye uske baad register kiya gaya middleware us request ke liye kabhi execute nahi hota. Option 1 galat: order matter karta hai. Option 3 galat: ye valid code hai, compile hota hai. Option 4 galat: middleware chalta hi nahi to kuch log nahi hoga. Fix: `UseRequestLogging()` ko `MapControllers()` se pehle rakho.",
    difficulty: "medium",
  },
  {
    id: "middleware-and-the-request-pipeline-2",
    question:
      "Ek convention-based middleware class ke constructor me tum `AppDbContext` (scoped) inject karte ho. Iska result kya hai?",
    options: [
      "Perfectly fine — har request pe naya DbContext milega",
      "Captive dependency problem — middleware effectively singleton hai, scoped service constructor me galat hai; use `InvokeAsync` parameter me lo",
      "Compile error — middleware constructors DI support nahi karte",
      "DbContext null aayega kyunki middleware DI container ke bahar hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Convention-based middleware ek hi baar construct hota hai (app lifetime), isliye constructor me capture kiya gaya scoped `AppDbContext` sabhi requests ke beech share ho jaayega — ye captive dependency hai aur stale/disposed context deta hai. Sahi tareeka: `public async Task InvokeAsync(HttpContext ctx, AppDbContext db)` — framework har request pe scoped `db` resolve karta hai. Option 1 galat: naya DbContext nahi milega. Option 3 galat: constructor injection singleton-safe deps ke liye kaam karta hai (jaise `ILogger`). Option 4 galat: middleware DI se hi resolve hota hai.",
    difficulty: "hard",
  },
  {
    id: "middleware-and-the-request-pipeline-3",
    question:
      "Middleware ke `InvokeAsync` me `await _next(context)` ke PEHLE likha code kab chalta hai, aur BAAD wala code kab?",
    options: [
      "Dono request aane par ek saath",
      "Pehle wala response phase me, baad wala request phase me",
      "Pehle wala request phase (going in), baad wala response phase (coming back out)",
      "Baad wala code sirf tab chalta hai jab exception aaye",
    ],
    correctIndex: 2,
    explanation:
      "Pipeline onion-model follow karti hai: request stack me neeche jaati hai, phir response wapas upar aati hai. `await _next()` se pehle likha code request ke going-in phase me chalta hai; `next` ke complete hone ke baad likha code response ke coming-out phase me chalta hai — isliye `Stopwatch` `next` se pehle start hota hai aur elapsed time `next` ke baad log hota hai. Option 4 galat: baad wala code normally hamesha chalta hai (exception aane par `finally` use karo).",
    difficulty: "easy",
  },
  {
    id: "middleware-and-the-request-pipeline-4",
    question:
      "In teeno me se kaunsa middleware banane ka tareeka scoped dependency ko safely inject karne aur unit-test karne ke liye best hai?",
    options: [
      "Convention-based class jisme constructor me sab kuch inject ho",
      "Inline `app.Use(async (context, next) => ...)` lambda",
      "`IMiddleware` factory-based middleware jo DI me `AddScoped` se register hota hai",
      "`app.Run(...)` terminal handler",
    ],
    correctIndex: 2,
    explanation:
      "`IMiddleware` implement karne wala middleware har request pe DI container se resolve hota hai, isliye usme scoped services constructor me inject karna safe hai aur class ko normal class ki tarah instantiate karke test kiya ja sakta hai. Convention-based class effectively singleton hai (scoped constructor injection galat). Inline lambda quick hai lekin alag se testable nahi. `app.Run` terminal handler hai, ye middleware-authoring ka pattern nahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
