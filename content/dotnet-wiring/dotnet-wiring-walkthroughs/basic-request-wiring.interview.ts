import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "brw-1",
    question: "ASP.NET Core Web API me ek HTTP request ka poora journey batao — Program.cs start hone se response tak.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Startup: `CreateBuilder` config/logging/DI set karta hai, `AddControllers` services register karta hai, `Build` container lock karta hai, `app.Use...` pipeline banata hai, `app.Run` Kestrel start karke block karta hai. Per request: Kestrel `HttpContext` banata hai -> middleware pipeline (order me) -> routing method+path match karti hai -> controller instance banta hai -> model binding -> action chalta hai -> `IActionResult` execute (serialize) -> response pipeline se ulta wapas -> Kestrel bytes bhejta hai.",
    detailedAnswer:
      "Do phases alag hain: startup ek baar chalta hai aur pipeline + DI container ki 'shape' fix kar deta hai; per-request phase har request ke liye `HttpContext` ko us fixed pipeline se guzarta hai. Registration (`AddControllers`) aur execution (`MapControllers`) alag steps hain — pehla recipe, doosra pipeline stage.",
    followUp: "Middleware ka order kyun matter karta hai?",
  },
  {
    id: "brw-2",
    question: "`AddControllers()` aur `MapControllers()` me kya farak hai? Ek hata do to kya hoga?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`AddControllers()` DI container me controller infrastructure (routing, model binding, JSON formatters) register karta hai. `MapControllers()` pipeline me wo endpoint stage add karta hai jo actually controller actions ko match aur execute karti hai. `AddControllers` bina: startup par DI error. `MapControllers` bina: app chalta hai par har controller route 404.",
    detailedAnswer:
      "'Add' hamesha `builder.Services` par (registration), 'Use'/'Map' hamesha `app` par (pipeline). Ye pattern poore ASP.NET Core me consistent hai — `AddAuthentication`/`UseAuthentication`, `AddCors`/`UseCors`. Bhoolne par error message aksar seedha bata deta hai kaunsa missing hai.",
  },
  {
    id: "brw-3",
    question: "Ek controller instance ka lifetime kya hai — per request, per action, ya singleton?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Per request. Framework har incoming request ke liye ek naya controller instance banata hai (uske constructor dependencies ko current request scope se resolve karke), action call karta hai, aur request khatam hone par instance garbage-collectible ho jaata hai. Ek request me ek hi action chalta hai, ek hi instance par.",
    detailedAnswer:
      "Isiliye controller me request-specific mutable state rakhna safe hai (har request ka apna instance), par controllers ko stateless-ish rakhna aur logic services me daalna best practice hai. Controller khud effectively 'scoped' hota hai, isliye usme Singleton service inject karna theek hai par Singleton me controller ya scoped service inject karna nahi.",
  },
];

export default questions;
