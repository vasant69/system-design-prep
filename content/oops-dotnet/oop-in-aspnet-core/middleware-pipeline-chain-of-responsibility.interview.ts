import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "middleware-cor-tr-1",
    question: "Middleware pipeline ko ek design pattern se connect karke explain karo.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Amazon", "TCS"],
    shortAnswer:
      "Middleware pipeline Chain of Responsibility pattern ka implementation hai — har component request ko khud handle kar sakta hai, pass kar sakta hai, ya dono.",
    detailedAnswer:
      "Chain of Responsibility ek behavioral design pattern hai jahan ek request handlers ki chain se guzarti hai, aur har handler independently decide karta hai ki wo request ko process karega ya agle handler ko pass karega. ASP.NET Core middleware exactly yahi karta hai — har middleware ek `RequestDelegate next` reference rakhta hai, apna kaam karta hai, aur decide karta hai `next(context)` call karna hai ya nahi. Requester (yahan, incoming HTTP request) ko pipeline ki internal structure ka koi idea nahi hota — sirf entry point milta hai.",
    followUp: "Ye pattern kahin aur bhi common hai .NET/production systems me?",
  },
  {
    id: "middleware-cor-tr-2",
    question: "Middleware pipeline me polymorphism kaise apply hota hai, formal interface ke bina bhi?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Convention-based polymorphism — har middleware ek constructor (RequestDelegate accept karta hai) aur ek InvokeAsync method follow karta hai, koi formal interface enforce nahi hota lekin shape consistent rehta hai.",
    detailedAnswer:
      "Traditional polymorphism interfaces/abstract classes ke through compile-time enforce hoti hai. ASP.NET Core middleware ek relaxed, convention-based version use karta hai — framework reflection se check karta hai ki class ka constructor `RequestDelegate` accept karta hai aur ek `InvokeAsync` (ya `Invoke`) method hai jo `Task` return karta hai. Ye formal type-checking nahi hai, lekin effect same hai — pipeline ko sirf ye shape pata hona chahiye, internal logic ka nahi. Ye dikhata hai polymorphism sirf strict interfaces tak limited nahi, convention se bhi achieve ho sakta hai.",
  },
  {
    id: "middleware-cor-tr-3",
    question: "Middleware order kyun important hai, aur ek real example do jahan galat order ek subtle bug create kare.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Order execution sequence decide karta hai; `UseAuthorization()` ko `UseAuthentication()` se pehle rakhna authorization checks ko bina authenticated user ke run karwa dega.",
    detailedAnswer:
      "Middleware registration order literally request flow ka sequence hai — pipeline ye order khud infer nahi karta, jaisa likha hai waisa hi chalta hai. Agar `UseAuthorization()` `UseAuthentication()` se pehle aata hai, `HttpContext.User` abhi populate nahi hua hoga jab authorization check chalega, jisse valid users bhi galat tarike se unauthorized ho sakte hain — ye subtle hai kyunki koi exception nahi aati, sirf galat behavior hota hai jo dhoondhna mushkil hai.",
    followUp: "Kaunse doosre middleware pairs hain jinka order strictly matter karta hai?",
  },
  {
    id: "middleware-cor-tr-4",
    question: "Ye code kya output karega, aur kis order me?\n```csharp\napp.Use(async (context, next) =>\n{\n    Console.WriteLine(\"A - before\");\n    await next();\n    Console.WriteLine(\"A - after\");\n});\n\napp.Use(async (context, next) =>\n{\n    Console.WriteLine(\"B - before\");\n    await next();\n    Console.WriteLine(\"B - after\");\n});\n\napp.Run(async context => Console.WriteLine(\"Terminal\"));\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Order: 'A - before', 'B - before', 'Terminal', 'B - after', 'A - after' — request forward order me, response reverse order me.",
    detailedAnswer:
      "Har middleware apna 'before' code chalata hai, phir `next()` call karta hai jo agle middleware ko control deta hai. Chain: A ka before → B ka before → terminal handler → wapas B ka after (kyunki B ne next() call kiya tha, ab uske baad ka code chalega) → wapas A ka after. Ye exactly stack-jaisa (LIFO) unwind pattern hai — Chain of Responsibility me forward pass aur return pass dono ek predictable order follow karte hain.",
    followUp: "Agar A middleware `next()` call hi na kare, output kya hoga?",
  },
  {
    id: "middleware-cor-tr-5",
    question: "Ye middleware me kya bug hai?\n```csharp\npublic class RateLimitMiddleware\n{\n    private readonly RequestDelegate _next;\n    private int _requestCount = 0; // instance field\n\n    public RateLimitMiddleware(RequestDelegate next) => _next = next;\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        _requestCount++;\n        if (_requestCount > 100)\n        {\n            context.Response.StatusCode = 429;\n            return;\n        }\n        await _next(context);\n    }\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`_requestCount` ek instance field hai jo poore application ke liye shared hota hai (middleware instance typically ek baar banta hai) — ye thread-safe increment nahi hai, race condition ka risk hai concurrent requests ke beech.",
    detailedAnswer:
      "Middleware instances ASP.NET Core me typically app startup pe ek baar create hote hain aur saare requests ke beech share hote hain (Singleton-jaisa behavior, chahe formally register na kiya ho) — isliye `_requestCount` sabhi concurrent requests ke beech shared state hai. `_requestCount++` atomic operation nahi hai C# me — concurrent requests se race condition ho sakti hai jahan count galat calculate ho (missed increments). Fix: `Interlocked.Increment(ref _requestCount)` use karo thread-safe increment ke liye, ya better, ek proper distributed/thread-safe rate-limiting store use karo.",
    followUp: "Middleware instance ko per-request kaise banaya ja sakta hai agar genuinely zaroorat ho?",
  },
  {
    id: "middleware-cor-tr-6",
    question: "Tumhe ek requirement mili hai: har request/response ka total processing time measure karke response header me add karna hai (`X-Response-Time-Ms`). Middleware design karo — kahan `next()` se pehle code chalega, kahan baad me?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Stopwatch `next()` se pehle start karo, `next()` ke baad stop karo aur header set karo — dono jagah code chahiye, before aur after.",
    detailedAnswer:
      "Chain of Responsibility ka 'before and after both' pattern yahan exactly fit hota hai: `InvokeAsync` me sabse pehle `var sw = Stopwatch.StartNew();` chalao, phir `await _next(context);` se poori downstream chain complete hone do, uske baad `sw.Stop();` karke `context.Response.Headers[\"X-Response-Time-Ms\"] = sw.ElapsedMilliseconds.ToString();`. Note: response header `next()` ke baad set karna zaroori hai kyunki headers response start hone se pehle hi set ho sakte hain — agar controller ne already response write start kar diya, header add karna fail ho sakta hai, isliye is middleware ki position pipeline me early honi chahiye.",
    followUp: "Agar `next()` exception throw kare, kya time measurement still accurately capture hoga?",
  },
  {
    id: "middleware-cor-tr-7",
    question: "Production me tumhara `UseExceptionHandler` middleware kabhi kabhi exceptions catch nahi kar pa raha — kuch requests raw 500 error page ke saath fail ho rahi hain bina custom error format ke. Kya galat ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Sabse likely cause: `UseExceptionHandler` pipeline me kahin neeche (baad me) register hua hai — usse pehle wale middleware ke exceptions wo catch hi nahi kar sakta.",
    detailedAnswer:
      "Chain of Responsibility me ek handler sirf unhi exceptions ko catch kar sakta hai jo uske **neeche** (chain me aage) hue ho, uske **upar** (pehle) wale middleware ke exceptions nahi — kyunki wo exceptions is handler tak pahunchte hi nahi, unke apne try/catch se pehle hi bubble ho jaate hain. Agar `UseExceptionHandler` `UseAuthentication`/`UseHttpsRedirection` ke baad likha gaya hai, un middleware ke andar aane wale exceptions raw, unhandled reh jaate hain. Fix: `UseExceptionHandler` ko pipeline ke bilkul shuru me (sabse pehle) register karo, taaki wo har downstream middleware/controller ke exceptions ko wrap kar sake.",
    followUp: "Agar exception khud UseExceptionHandler middleware ke andar aa jaaye (jaise error page render karte waqt), kya hoga?",
  },
  {
    id: "middleware-cor-tr-8",
    question: "Ek naya developer bolta hai: 'Middleware pipeline basically ek event system hai, jaise C# events — har middleware ek subscriber hai.' Kya ye comparison sahi hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Nahi, ye galat comparison hai — events me saare subscribers independently, bina order-dependency ke, notify hote hain; middleware pipeline sequential hai aur har link agle ko explicitly control deta hai (aur chain rok sakta hai).",
    detailedAnswer:
      "Events (Observer pattern) me saare subscribers ek broadcast receive karte hain — koi ek subscriber doosre ko 'block' nahi kar sakta, order guarantee nahi hoti (aam taur pe), aur publisher ko fark nahi padta kaun sun raha hai. Middleware pipeline (Chain of Responsibility) me har link ka agle pe explicit control hota hai — wo decide kar sakta hai chain continue karni hai ya nahi (short-circuit), aur order strictly registration-sequence-dependent hai. Ye do fundamentally different patterns hain — Observer 'notify everyone independently', Chain of Responsibility 'sequential, controlled hand-off'.",
    redFlag: "Middleware ko events/Observer pattern samajh lena — is confusion se short-circuiting jaisa core middleware behavior hi samajh nahi aata.",
  },
  {
    id: "middleware-cor-tr-9",
    question: "Ek custom middleware likho jo har request ke liye ek unique correlation ID generate kare (agar `X-Correlation-Id` header already na ho), usko `HttpContext.Items` me store kare taaki downstream code use kar sake, aur response me bhi wahi header add kare.",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Constructor me RequestDelegate lo, InvokeAsync me header check karo ya naya Guid banao, HttpContext.Items me store karo, next() call karo, response header set karo.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic class CorrelationIdMiddleware\n{\n    private const string HeaderName = \"X-Correlation-Id\";\n    private readonly RequestDelegate _next;\n\n    public CorrelationIdMiddleware(RequestDelegate next) => _next = next;\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var correlationId = context.Request.Headers.TryGetValue(HeaderName, out var existing)\n            ? existing.ToString()\n            : Guid.NewGuid().ToString();\n\n        context.Items[\"CorrelationId\"] = correlationId;\n\n        context.Response.OnStarting(() =>\n        {\n            context.Response.Headers[HeaderName] = correlationId;\n            return Task.CompletedTask;\n        });\n\n        await _next(context);\n    }\n}\n\n// Program.cs\napp.UseMiddleware<CorrelationIdMiddleware>(); // early in the pipeline\n```\nKey evaluation points: constructor takes `RequestDelegate`, method is `InvokeAsync`, `HttpContext.Items` used to pass data downstream (not a static/instance field — that would leak across requests), and `Response.OnStarting` used correctly since headers must be set before the response body starts writing.",
  },
];

export default questions;
