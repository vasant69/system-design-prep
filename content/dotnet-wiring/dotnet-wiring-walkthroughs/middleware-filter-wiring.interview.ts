import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mfw-1",
    question: "Middleware aur action filter execution order me kaise relate karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Middleware bahar hai, filter andar. Order: middleware-before (registration order me) -> routing/auth -> MVC endpoint stage -> action filter `OnActionExecuting` -> action -> action filter `OnActionExecuted` -> result execution -> middleware-after (ulta order me). Nested onion.",
    detailedAnswer:
      "Middleware `await _next()` ke around code chalata hai — pehla registered sabse bahar. Filters sirf MVC endpoint stage ke andar chalte hain, action method ke immediate around. Isiliye filter ko routed action, model-bound arguments, aur `ModelState` dikhti hai; middleware ko sirf raw `HttpContext`.",
    followUp: "Filter types (authorization, resource, action, exception, result) ka order kya hai?",
  },
  {
    id: "mfw-2",
    question: "Custom middleware me `await _next(context)` call karna bhool jaao to kya hota hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Pipeline wahin short-circuit ho jaati hai — us middleware ke baad wale stages (routing, controller) kabhi nahi chalte. Client ko woh response milta hai jo tab tak bana (aksar 200 with empty body), aur middleware ka `_next` ke baad wala code bhi nahi chalta.",
    detailedAnswer:
      "Kabhi-kabhi ye jaan-boojh kar karte hain — jaise ek middleware jo invalid API key par 401 likh kar return kar de bina `_next` call kiye. Galti se karo to 'endpoint hit ho raha hai par 200 empty aa raha hai' jaisa confusing bug milta hai.",
  },
  {
    id: "mfw-3",
    question: "Ek cross-cutting concern (jaise logging) — middleware me rakhoge ya action filter me? Kaise decide?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Agar concern har request par (static files, health checks, non-MVC endpoints samet) chahiye aur sirf raw `HttpContext` kaafi hai -> middleware. Agar concern ko routed action ka naam, bound parameters, `ModelState`, ya action ka return value chahiye -> action filter.",
    detailedAnswer:
      "Middleware pehle chalta hai aur poore pipeline ko cover karta hai; filter MVC-specific context deta hai. Example: request/response timing -> middleware theek. 'Is action ke `[FromBody]` model ko audit log karo' ya 'action result ko wrap karo ek envelope me' -> filter, kyunki middleware ko wo details nahi dikhti.",
  },
];

export default questions;
