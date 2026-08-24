import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "filters-tr-1",
    question: "Filters kya hain, aur inke 5 types kaunse hain, exact order ke saath?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys"],
    shortAnswer:
      "Filters MVC action-invocation ke specific points pe chalte hain — order: Authorization, Resource, Action, Exception, Result.",
    detailedAnswer:
      "Authorization filters sabse pehle chalte hain, user allowed hai ya nahi decide karte hain (`[Authorize]` isi ka implementation hai). Resource filters model binding se pehle chalte hain, caching jaise use cases ke liye. Action filters action method ke exactly pehle aur baad chalte hain — sabse common custom filter type. Exception filters kisi bhi upar wale stage me hui exception ko handle karne ka mauka dete hain. Result filters action ka result client ko bhejne se pehle aur baad chalte hain, response modify karne ke liye.",
    followUp: "Resource filter aur Action filter me practical difference kya hai — kab ek dusre ke bajaye use karoge?",
  },
  {
    id: "filters-tr-2",
    question: "Filters middleware se kaise different hain — scope aur context dono ke terms me?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Middleware poori HTTP pipeline wrap karta hai (raw HttpContext hi milta hai); filters sirf MVC action-invocation ke andar chalte hain, jahan action-level context (controller, action, arguments) available hota hai.",
    detailedAnswer:
      "Middleware ka scope broader hai — ye routing se pehle bhi chal sakta hai, static files serve kar sakta hai, kisi controller se koi lena-dena nahi hota, sirf HttpContext access hota hai. Filters specifically MVC framework ke andar hi meaningful hain — inhe ActionDescriptor, action arguments, model-binding result jaisi cheezein pata hoti hain jo middleware ke paas available hi nahi hain. Isliye jab action-level detail chahiye ho (jaise 'is action pe kaunsa attribute laga hai'), filter sahi tool hai; broad, controller-agnostic concerns (CORS, static files) ke liye middleware sahi hai.",
  },
  {
    id: "filters-tr-3",
    question: "Attributes + reflection ka 'metadata-driven behavior' pattern explain karo, ek non-filter example ke saath.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Attribute sirf ek type/method pe metadata attach karta hai declaratively; reflection use karke koi bhi code baad me us metadata ko read/act kar sakta hai, bina explicit wiring ke.",
    detailedAnswer:
      "Ye ek declarative programming pattern hai — instead of imperatively likhne 'is method ke liye ye extra behavior chalao,' tum sirf ek marker (`[Audit(\"action\")]`) laga dete ho. Framework (ya koi bhi tool) `typeof(T).GetMethod(\"X\").GetCustomAttribute<AuditAttribute>()` jaise reflection calls se runtime pe us attribute ko discover kar sakta hai aur uske data (jaise Action property) ke basis pe kuch bhi kar sakta hai. Non-filter example: `[Obsolete(\"Use NewMethod instead\")]` — compiler khud reflection-jaisi mechanism se isko detect karta hai aur warning deta hai, JSON serializers `[JsonPropertyName]` attribute se property naming customize karte hain — sab isi pattern ke instances hain.",
    followUp: "Reflection-based discovery ka koi performance cost hai? Framework isko kaise mitigate karta hai?",
  },
  {
    id: "filters-tr-4",
    question: "Ye code me kya output hoga jab GET request aaye ek invalid `id` (jaise negative number) ke saath?\n```csharp\npublic class ValidateIdAttribute : ActionFilterAttribute\n{\n    public override void OnActionExecuting(ActionExecutingContext context)\n    {\n        if (context.ActionArguments[\"id\"] is int id && id <= 0)\n        {\n            context.Result = new BadRequestObjectResult(\"id must be positive\");\n        }\n    }\n}\n\n[ValidateId]\n[HttpGet(\"{id}\")]\npublic IActionResult GetById(int id) => Ok(new { id });\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Action method `GetById` kabhi call hi nahi hoga — `context.Result` set karne se action execution short-circuit ho jaata hai, seedha `400 BadRequest` response chala jaata hai.",
    detailedAnswer:
      "`OnActionExecuting` me `context.Result` set karna ek explicit short-circuit signal hai — jab ye set hota hai, MVC pipeline actual action method ko call hi nahi karta, seedha wahi result response bana deta hai. Ye Action filters ka ek core capability hai: validation logic action method chalne se pehle hi rok sakti hai, controller code me duplicate validation likhne ki zaroorat nahi.",
    followUp: "Agar id valid ho, `OnActionExecuted` me is filter ko kya extra karna chahiye taaki symmetric ho?",
  },
  {
    id: "filters-tr-5",
    question: "Ye code compile hoga? Agar issue hai to kya?\n```csharp\npublic class CacheAttribute : ActionFilterAttribute\n{\n    private object? _cachedResult; // instance field\n\n    public override void OnActionExecuted(ActionExecutedContext context)\n    {\n        _cachedResult = context.Result;\n    }\n}\n\n[Cache]\n[HttpGet]\npublic IActionResult GetAll() => Ok(_products);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Compile hoga, lekin design bug hai — attribute instances filter pipeline me typically **per-request naya nahi** guaranteed hote agar `TypeFilterAttribute`/service-based registration na ho; concurrent requests ke beech `_cachedResult` unpredictable state share kar sakta hai.",
    detailedAnswer:
      "Attribute-based filters (directly `[Cache]` jaisa lagaya gaya) framework dwara internally instantiate hote hain — behavior versions/configurations ke across differ kar sakta hai, isliye instance field me per-request/mutable state store karna risky assumption hai. Agar genuinely caching chahiye, sahi approach ek proper `IMemoryCache`/`IDistributedCache` service inject karna hai (jo khud thread-safe design hota hai), instance field me raw object store karne ke bajaye. Ye bilkul wahi class of bug hai jo middleware instance fields ke saath dekha tha — filters bhi is trap se safe nahi hain.",
    followUp: "IMemoryCache use karke ye caching filter kaise sahi likhoge?",
  },
  {
    id: "filters-tr-6",
    question: "Tumhe requirement mili hai: sirf `Admin` role wale users hi ek specific action call kar sakein, aur agar koi aur try kare to ek custom JSON error shape (`{ error: \"Forbidden\", requiredRole: \"Admin\" }`) return ho, default framework error page nahi. Kaise design karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek custom `IAuthorizationFilter` (ya `[Authorize(Roles=\"Admin\")]` ke saath ek custom result handling) likho jo role check kare aur `context.Result` ko custom `ObjectResult` set kare.",
    detailedAnswer:
      "Built-in `[Authorize(Roles = \"Admin\")]` role check kar sakta hai lekin default 403 response shape customize karna seedha nahi hai. Better approach: ek custom `IAuthorizationFilter` likho jo `context.HttpContext.User.IsInRole(\"Admin\")` check kare, agar false ho to `context.Result = new ObjectResult(new { error = \"Forbidden\", requiredRole = \"Admin\" }) { StatusCode = 403 };` set karo. Ye Authorization filter stage me chalta hai — sabse pehle, isliye agar authorization fail ho, action method ya downstream koi bhi filter chalta hi nahi, resources bachte hain.",
    followUp: "Ye filter globally (har controller pe) apply karna hai ya sirf specific actions pe — design kaise decide karoge?",
  },
  {
    id: "filters-tr-7",
    question: "Ek `AuditLogAttribute` filter production me sirf kabhi-kabhi log entries miss kar raha hai — kuch requests audit ho rahi hain, kuch nahi, bina kisi obvious pattern ke. Kya debug approach loge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Check karo ki filter kis stage me hai (Action vs Exception) — agar action method exception throw kare aur filter sirf OnActionExecuted (non-exception path) me log karta hai, exception ke case me log miss ho sakta hai.",
    detailedAnswer:
      "Ye ek real, subtle bug pattern hai. Agar `AuditLogAttribute` sirf `OnActionExecuted` me logging karta hai aur action method beech me exception throw kar de, `OnActionExecuted` `context.Exception` ke saath call hota hai lekin agar code us case ko explicitly handle nahi karta (ya sirf successful result assume karta hai), log entry likhna skip ho sakta hai ya galat data likh sakta hai. Fix: `OnActionExecuted` ke andar `context.Exception != null` case ko explicitly handle karo, ya ek alag Exception filter bhi add karo jo failure-case audit entries guarantee kare — dono paths (success aur failure) explicitly cover karna zaroori hai.",
    redFlag: "Sirf 'happy path' (successful action) ke liye logic likhna aur exception path ko implicitly ignore kar dena.",
  },
  {
    id: "filters-tr-8",
    question: "Kya ye statement sahi hai: 'Filters middleware ka replacement hain, ASP.NET Core me MVC use kar rahe ho to middleware ki zaroorat hi nahi'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Galat — filters aur middleware alag scope solve karte hain; MVC apps me bhi middleware zaroori hota hai (jaise routing setup se pehle chalne wali cheezein — CORS, static files, exception handling ka outer layer).",
    detailedAnswer:
      "Ye ek common misconception hai. Filters sirf MVC action-invocation ke andar meaningful hain — inhe koi controller/action context na ho to wo exist hi nahi kar sakte. Poori pipeline-level concerns — jaise HTTPS redirection, static file serving, CORS, ya ek outer exception-handling safety net jo filters ke bhi bahar ki exceptions catch kare — sirf middleware se possible hain, filters se nahi. Ek production ASP.NET Core app almost hamesha dono use karta hai: middleware broad, pipeline-wide concerns ke liye, filters narrow, MVC-action-specific concerns ke liye.",
    redFlag: "'MVC me sab kuch filters se ho sakta hai' jaisa absolute statement — ye scope ka fundamental misunderstanding dikhata hai.",
  },
  {
    id: "filters-tr-9",
    question: "Ek custom `ValidateModelAttribute` (ActionFilterAttribute se derive) likho jo agar `ModelState.IsValid` false ho, action ko short-circuit karke ek consistent `400` response de jisme saari validation errors ek array me hon.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "OnActionExecuting override karo, ModelState.IsValid check karo, agar invalid to errors nikal ke context.Result set karo.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic class ValidateModelAttribute : ActionFilterAttribute\n{\n    public override void OnActionExecuting(ActionExecutingContext context)\n    {\n        if (!context.ModelState.IsValid)\n        {\n            var errors = context.ModelState\n                .Where(kvp => kvp.Value?.Errors.Count > 0)\n                .Select(kvp => new { field = kvp.Key, messages = kvp.Value!.Errors.Select(e => e.ErrorMessage) });\n\n            context.Result = new BadRequestObjectResult(new { errors });\n        }\n    }\n}\n\n// Usage\n[ValidateModel]\n[HttpPost]\npublic IActionResult Create(CreateProductDto dto) => Ok(dto);\n\n// Or globally in Program.cs:\nbuilder.Services.AddControllers(options => options.Filters.Add<ValidateModelAttribute>());\n```\nKey evaluation points: correctly overrides `OnActionExecuting` (not `OnActionExecuted` — validation must short-circuit before the action runs), reads `ModelState` correctly, and sets `context.Result` to short-circuit rather than throwing an exception. Bonus: noting that with `[ApiController]` already present, this exact behavior is partially automatic — a good candidate should flag that overlap.",
  },
];

export default questions;
