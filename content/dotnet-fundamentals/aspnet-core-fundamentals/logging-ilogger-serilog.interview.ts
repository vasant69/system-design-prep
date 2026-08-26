import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "logging-tr-1",
    question: "ASP.NET Core ke six log levels kya hain, aur har ek kab use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Wipro"],
    shortAnswer: "Trace (most verbose), Debug, Information (normal flow), Warning (unexpected but recovered), Error (operation failed), Critical (application-wide failure).",
    detailedAnswer:
      "Trace sabse granular, step-by-step detail hai, almost kabhi production me enabled nahi. Debug development-time diagnostics ke liye hai. Information normal application flow record karta hai (order created, user logged in) — general operational visibility. Warning kuch unexpected signal karta hai jo application ne handle kar liya (retry hua, fallback path liya). Error ek specific operation ki failure hai (exception caught) jo application ko crash nahi karti. Critical application-wide, immediate-attention-chahiye failure hai (database completely unreachable).",
    followUp: "Production me typically kaunsa minimum level enabled rakhte ho, aur kyun?",
  },
  {
    id: "logging-tr-2",
    question: "Structured logging kya hai, aur ye string concatenation/interpolation se fundamentally kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft"],
    shortAnswer: "Structured logging message-template placeholders (`{PropertyName}`) use karta hai jo named, queryable fields banate hain; interpolation values ko permanently ek flat string me bake kar deta hai.",
    detailedAnswer:
      "`_logger.LogInformation(\"Order {OrderId} created for {CustomerId}\", orderId, customerId)` me `{OrderId}` aur `{CustomerId}` distinct properties ke roop me logger ko pass hoti hain — modern sinks (Seq, Elasticsearch, Application Insights) inhe searchable/filterable fields ke roop me store karte hain. `$\"Order {orderId} created\"` string interpolation use karne se value already runtime pe ek single flat string me merge ho chuki hoti hai jab tak logger call hota hai — logger ko sirf ek opaque text milta hai, koi structure nahi. Isse baad me 'CustomerId = 12345 wale saare orders dikhao' jaisi precise query chalana possible nahi rehta.",
  },
  {
    id: "logging-tr-3",
    question: "Serilog me Sinks aur Enrichers me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Sinks destination hain (logs kahan jaate hain — Console, File, Seq); Enrichers automatically extra context add karte hain har log event me.",
    detailedAnswer:
      "Sinks configure karte hain ki log output kahan write hoga — Console, rolling File, Seq (structured search UI), Elasticsearch, Application Insights — aur ek hi log call multiple sinks ko simultaneously bhej sakta hai. Enrichers automatically extra properties har log event me attach karte hain bina developer ko har log call me manually pass kiye — jaise machine name, environment, ya Enrich.FromLogContext() se request-scoped correlation ID jo poore ek request ke lifecycle ke saare logs me automatically appear hota hai.",
  },
  {
    id: "logging-tr-4",
    question: "Ye code review comment sahi hai ya galat: 'Hum production me sensitive customer data (jaise full card number) ko log kar rahe hain taaki debugging easy ho — ye theek hai kyunki logs internal hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — log files/sinks aksar less-secured hote hain actual production database se, aur ye ek real data-leak/compliance risk hai (PCI-DSS jaise regulations explicitly is tarah ka logging prohibit karte hain).",
    detailedAnswer:
      "Log storage (files, third-party log aggregation services, cloud log sinks) typically primary database jitni strict access-control/encryption nahi rakhte, aur access karne wale developers/support staff ka set bhi zyada bada hota hai. Full card numbers, passwords, ya tokens ko log karna ek genuine security/compliance violation hai — PCI-DSS jaise standards explicitly is tarah ki data ko logs me appear hone se prohibit karte hain. Debugging ke liye sensitive data ka masked/partial version (jaise last-4-digits) ya ek internal reference ID log karna chahiye, actual sensitive value nahi.",
    redFlag: "'Logs internal hain isliye safe hain' — ye assumption production incident me data leak ka common root cause banta hai.",
  },
  {
    id: "logging-tr-5",
    question: "`_logger.LogError(ex.Message)` aur `_logger.LogError(ex, \"An error occurred processing order {OrderId}\", orderId)` me practical difference kya hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Pehla sirf top-level message string capture karta hai, dusra poora exception object (stack trace samet) plus structured context (OrderId) capture karta hai.",
    detailedAnswer:
      "ex.Message sirf ek short summary string hoti hai — 'Object reference not set to an instance of an object' jaisi. Ye batata hai kya hua, lekin kahan (stack trace) nahi batata. Overload jo exception object ko pehle parameter ke roop me leta hai (LogError(ex, template, args)) poora exception detail (stack trace, inner exceptions, exception type) capture karta hai, plus message template se additional structured context (jaise OrderId) bhi record hota hai. Production debugging me stack trace ke bina root cause dhoondna bahut harder ho jaata hai.",
  },
  {
    id: "logging-tr-6",
    question: "Ek team har environment (Dev, Staging, Production) me same fixed log level use karti hai. Ye approach kyun suboptimal hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Dev me verbose (Debug/Trace) logging development ke liye useful hai, lekin Production me wahi verbosity storage cost badhati hai aur noise create karti hai — per-environment configurable rakhna better practice hai.",
    detailedAnswer:
      "appsettings.{Environment}.json (jaise appsettings.Development.json vs appsettings.Production.json) me alag Logging:LogLevel settings rakhna standard practice hai — Development me Debug/Trace enabled rakhkar detailed local debugging milta hai, Production me Information/Warning se upar rakhkar sirf actionable signals capture hote hain bina unnecessary storage cost/noise ke. Fixed single level har environment me use karna ya to Dev me insufficient detail deta hai ya Production me excessive verbosity, dono suboptimal hain.",
  },
  {
    id: "logging-tr-7",
    question: "`ILogger<OrderService>` inject karne ka fayda kya hai `ILogger` (non-generic) inject karne ke comparison me?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "`ILogger<T>` automatically T (yahan OrderService) ko log category ke roop me attach karta hai, jisse logs source-class ke hisaab se automatically filterable/traceable ban jaate hain.",
    detailedAnswer:
      "`ILogger<T>` DI container ko batata hai ki jab OrderService is dependency ko request kare, ek logger instance milna chahiye jiska category name automatically 'Namespace.OrderService' set ho — bina developer ko manually category string pass kiye. Ye har log entry me source class ki traceability deta hai, aur log filtering configuration (jaise appsettings.json me specific namespace ke liye different log level set karna) is category ke basis pe possible hoti hai.",
  },
];

export default questions;
