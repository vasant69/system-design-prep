import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "globalex-tr-1",
    question: "ASP.NET Core me global exception handling ke kitne main approaches hain, aur unme kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Amazon", "Flipkart"],
    shortAnswer: "Do main layers — middleware-level (`UseExceptionHandler`/`IExceptionHandler`, app-wide) aur MVC-level (`IExceptionFilter`, action-pipeline-scoped, richer MVC context).",
    detailedAnswer: "Middleware-level handling (`UseExceptionHandler` delegate, ya .NET 8+ ka typed `IExceptionHandler`) request pipeline ke top-level pe kaam karta hai — MVC controllers, minimal APIs, custom middleware, sabki exceptions ko catch karta hai. `IExceptionFilter` (aur async version `IAsyncExceptionFilter`) sirf MVC action-invocation pipeline ke andar chalta hai — narrower scope, lekin `ActionDescriptor`/`ModelState` jaisa rich MVC-specific context milta hai jo middleware ko nahi dikhta.",
    followUp: "Agar dono layers ek saath configured hain, aur ek MVC action me exception aaye jo IExceptionFilter handle na kare, kya hota hai?",
  },
  {
    id: "globalex-tr-2",
    question: "Ek MVC action me exception throw hoti hai. `IExceptionFilter` use handle nahi karta (koi matching condition nahi). Ab kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Exception filter se aage propagate hoke middleware-level global handler (`UseExceptionHandler`/`IExceptionHandler`) tak pahunchega, agar wo configured hai.",
    detailedAnswer: "MVC filter pipeline aur middleware pipeline layered hain — MVC filters middleware pipeline ke andar hi ek stage hain (routing/MVC middleware ke through). Agar `IExceptionFilter` exception ko genuinely handle nahi karta (`ExceptionHandled` false rehta hai), exception apne normal path se aage bubble up karta hai, eventually middleware-level exception handler tak pahunchta hai (agar configured hai) jo ek fallback response deta hai.",
  },
  {
    id: "globalex-tr-3",
    question: "`ExceptionHandled = true` set karna kyun zaroori hai `IExceptionFilter.OnException` ke andar, chahe `context.Result` bhi set kiya ho?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "`context.Result` set karna sirf response body/status decide karta hai; `ExceptionHandled = true` explicitly batata hai ki exception ko aage propagate nahi karna.",
    detailedAnswer: "Ye ek genuine gotcha hai — sirf `context.Result` set karna kaafi nahi hai. `ExceptionHandled` flag alag concern hai: ye MVC framework ko batata hai ki is exception ko handled maana jaaye, isliye aage koi aur exception handler (ya default framework behavior) trigger na ho. Agar isko set karna bhool jaao, framework kabhi-kabhi exception ko still unhandled treat kar sakta hai, jisse inconsistent ya duplicate error handling ho sakta hai.",
    redFlag: "'Sirf `context.Result` set karna kaafi hai' bolna, `ExceptionHandled` flag ki zaroorat ko na samajhna.",
  },
  {
    id: "globalex-tr-4",
    question: "`IExceptionHandler` interface (.NET 8+) me multiple handlers register kiye jaayein to unka execution order kaise decide hota hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Jis order me `AddExceptionHandler<T>()` call kiya gaya, usi order me try hote hain, jab tak koi handler `true` return na kare (matlab 'maine handle kar liya').",
    detailedAnswer: "`AddExceptionHandler<T>()` ko multiple baar call kar sakte ho alag-alag handler types ke saath — registration order hi execution order hota hai. Har handler ka `TryHandleAsync` call hota hai, agar wo `false` return kare (matlab 'ye exception mera scope nahi'), next registered handler try hota hai. Ye pattern specific-exception-type handlers ko generic fallback handler se pehle rakhne deta hai — similar to catch-block ordering, but for the whole app's exception pipeline.",
  },
  {
    id: "globalex-tr-5",
    question: "Production API me client ko error response me exception ka `StackTrace` ya raw `Message` bhej dena kyun risky hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Internal implementation details, file paths, database schema hints, ya sensitive logic leak ho sakti hai — security aur information-disclosure risk.",
    detailedAnswer: "Raw exception details me aksar internal file paths, class/method names, SQL query fragments, ya connection string hints tak leak ho sakte hain — attacker ke liye reconnaissance information. Best practice: generic, safe `ProblemDetails` response client ko do (jaise 'An unexpected error occurred', ek correlation/trace ID ke saath jo internally logs se match kiya ja sake), detailed exception info sirf server-side structured logs me rakho, kabhi HTTP response body me nahi (except explicitly controlled Development-environment debugging pages).",
  },
  {
    id: "globalex-tr-6",
    question: "Kya `IExceptionFilter` minimal API endpoints (`app.MapGet(...)`) ki exceptions ko catch kar sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — `IExceptionFilter` sirf MVC controller action-invocation pipeline ka part hai, minimal API endpoints is pipeline se nahi guzarte.",
    detailedAnswer: "Minimal APIs (`MapGet`/`MapPost` waghera) MVC ke controller/action filter pipeline use nahi karte — wo alag, lightweight routing/endpoint pipeline se serve hote hain. `IExceptionFilter` sirf traditional MVC controllers ke liye applicable hai. Agar app minimal APIs aur MVC controllers dono use karta hai, aur unified exception handling chahiye, `UseExceptionHandler`/`IExceptionHandler` (middleware-level) hi consistent choice hai kyunki wo dono ke liye common pipeline layer pe baithta hai.",
    redFlag: "Ye assume karna ki filters (MVC-specific concept) minimal API code pe bhi automatically apply ho jaayenge.",
  },
  {
    id: "globalex-tr-7",
    question: "Ek team ko sirf ek specific controller (jaise `PaymentsController`) ke liye custom exception handling chahiye, baaki app ke liye default behavior hi theek hai. Kaunsa approach use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`IExceptionFilter` ko sirf us controller pe attribute se ya per-controller filter registration se apply karo — global middleware ko touch mat karo.",
    detailedAnswer: "Filters (`IExceptionFilter`) ko globally (`options.Filters.Add<T>()`), controller-level, ya action-level bhi apply kiya ja sakta hai — ye exactly is scoped-scenario ke liye design kiya gaya hai. `[ServiceFilter(typeof(PaymentsExceptionFilter))]` jaisa attribute sirf `PaymentsController` pe laga sakte ho, baaki controllers untouched rahenge, aur app-wide `UseExceptionHandler` fallback bhi apni jagah rehta hai baaki sab ke liye.",
  },
  {
    id: "globalex-tr-8",
    question: "`ProblemDetails` (RFC 7807) use karne ka fayda kya hai plain custom JSON error shape ke upar?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Ek standardized, well-known error response format hai — clients aur tooling ismein consistent fields (`title`, `status`, `detail`, `type`) expect kar sakte hain across different APIs.",
    detailedAnswer: "`ProblemDetails` ek IETF-standardized JSON shape hai HTTP API error responses ke liye — `type`, `title`, `status`, `detail`, `instance` jaise standard fields ke saath, plus extensible custom fields. Isse client-side error-handling code alag-alag APIs ke against reusable ban sakta hai (ek consistent shape expect kar sakta hai), aur ASP.NET Core `AddProblemDetails()` se ise automatically wire karta hai bina manually custom error DTO design kiye.",
  },
];

export default questions;
