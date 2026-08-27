import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "filters-and-action-filters-1",
    question: "Filters ka execution order kya hai?",
    options: [
      "Action, Authorization, Resource, Result, Exception",
      "Authorization, Resource, Action, Exception, Result",
      "Resource, Action, Authorization, Exception, Result",
      "Order random hota hai, registration sequence pe depend karta hai",
    ],
    correctIndex: 1,
    explanation: "Filter pipeline ka order framework-defined hai: pehle Authorization (access decide), phir Resource (model binding se pehle, caching/short-circuit ke liye), phir Action (action ke around), phir Exception (agar throw hui), aur last Result (response shape hone se pehle/baad). Ye middleware jaisa registration-order-dependent nahi hai.",
    difficulty: "medium",
  },
  {
    id: "filters-and-action-filters-2",
    question: "Filters middleware se fundamentally kaise alag hain?",
    options: [
      "Filters sirf synchronous ho sakte hain, middleware async hota hai",
      "Filters MVC pipeline ke andar hi chalte hain aur unhe action arguments/ModelState jaisa MVC-specific context milta hai, jo raw middleware ko nahi milta",
      "Filters sirf GET requests pe kaam karte hain",
      "Koi real difference nahi hai, dono same cheez hain",
    ],
    correctIndex: 1,
    explanation: "Middleware har request pe chalta hai (static files bhi) aur sirf raw HttpContext dekhta hai. Filters sirf tab chalte hain jab request MVC/API controller action tak pahunchti hai, aur unko action arguments, ModelState, ActionDescriptor jaisi rich context milti hai. Filters async ho sakte hain (IAsyncActionFilter).",
    difficulty: "easy",
  },
  {
    id: "filters-and-action-filters-3",
    question: "Ek action filter me context.Result set kar diya jaaye to kya hota hai?",
    options: [
      "Kuch nahi hota, Result sirf logging ke liye hai",
      "Pipeline short-circuit ho jaata hai — action method aur baad ke filters execute nahi hote",
      "App crash ho jaata hai",
      "Sirf response headers change hote hain, baaki pipeline normal chalta hai",
    ],
    correctIndex: 1,
    explanation: "context.Result set karna filter ko batata hai ki response ready hai — framework action method ko call nahi karta aur seedha result unwind hone lagta hai. Ye pattern validation failure ya cache-hit scenarios me common hai.",
    difficulty: "medium",
  },
  {
    id: "filters-and-action-filters-4",
    question: "IAsyncActionFilter ko sync ActionFilterAttribute (OnActionExecuting/OnActionExecuted) ke bajaye kab prefer karte hain?",
    options: [
      "Jab performance improve karni ho, kyunki async hamesha fast hota hai",
      "Jab before/after action logic ko ek hi method me, ek shared local state ke saath likhna ho — jaise timing ya transaction wrapping",
      "Sync filters ab deprecated hain aur kabhi use nahi karne chahiye",
      "IAsyncActionFilter sirf exception filters ke liye hota hai",
    ],
    correctIndex: 1,
    explanation: "IAsyncActionFilter.OnActionExecutionAsync ek method me next() call karke action ke aage-peeche ka control deta hai, jisse local variables (jaise Stopwatch) safely share ho sakte hain bina instance fields use kiye — jo sync two-method split me thread-safety issue create kar sakta hai. Sync filters deprecated nahi hain, sirf is use case ke liye async cleaner hai.",
    difficulty: "hard",
  },
];

export default quiz;
