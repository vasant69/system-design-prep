import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "attributes-custom-attributes-tr-1",
    question: "Attributes actually kya hain, aur inka khud koi runtime behavior kyun nahi hota?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Attributes declarative metadata hain, compile time pe assembly ki metadata me embed ho jaate hain — khud koi executable behavior nahi rakhte.",
    detailedAnswer:
      "Ek attribute (jaise `[Obsolete]`, `[Required]`) sirf ek data annotation hai — ye kisi type/member/assembly ke saath metadata ke roop me store ho jaata hai compile time pe. Ye khud koi code execute nahi karta. Iska koi bhi 'effect' hamesha kisi doosre code se aata hai jo is metadata ko padhta hai — ya to compiler khud (jaise `[Obsolete]` ke liye warning) ya reflection-based framework code (jaise ASP.NET Core ka `[Required]` validation).",
    followUp: "`[Required]` ka concrete example doge kaise ye 'discover' hota hai?",
  },
  {
    id: "attributes-custom-attributes-tr-2",
    question: "`[Required]` attribute ka model validation me exact mechanism kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "ASP.NET Core model binding ke time reflection se check karta hai kaunsi properties pe Data Annotation attributes lage hain, aur unke basis pe validation apply karta hai.",
    detailedAnswer:
      "Jab ek request model-bind hoti hai, ASP.NET Core ka validation pipeline `System.ComponentModel.DataAnnotations` attributes (jaise `[Required]`, `[Range]`, `[StringLength]`) ke liye model type ki properties ko reflection se scan karta hai. Har attribute apna khud ka `IsValid()`-jaisa validation logic define karta hai (framework ke andar) — attribute khud sirf 'is property required hai' ye metadata carry karta hai, actual check karne wala code framework ke andar hai jo is metadata ko interpret karta hai.",
  },
  {
    id: "attributes-custom-attributes-tr-3",
    question: "Custom attribute banane ke teen key steps kya hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "(1) `System.Attribute` se inherit karo, (2) `[AttributeUsage]` se target/repeatability restrict karo, (3) reflection-based code likho jo ise discover/act kare.",
    detailedAnswer:
      "Step 1: ek class banao jo `System.Attribute` se inherit kare, zaroori data constructor/properties ke through le. Step 2: `[AttributeUsage(AttributeTargets.X, AllowMultiple = ...)]` decorate karo, taaki attribute sirf valid jagah lage aur repeatability clear ho. Step 3 — ye often miss ki jaati hai: attribute ko 'useful' banane ke liye kahi reflection-based code (`GetCustomAttribute<T>()`) likhna padta hai jo ise discover kare aur uske basis pe action le. Bina step 3 ke, attribute sirf dead metadata reh jaata hai.",
    followUp: "Agar step 3 miss ho jaaye to kya observable symptom hoga?",
  },
  {
    id: "attributes-custom-attributes-tr-4",
    question: "Ek naya custom attribute laga diya gaya lekin uska koi visible effect nahi ho raha. Debug kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Check karo koi reflection-based code (filter/interceptor/middleware) genuinely us attribute ko `GetCustomAttribute<T>()` se discover kar raha hai ya nahi.",
    detailedAnswer:
      "Sabse pehle confirm karo attribute syntactically sahi laga hai aur `[AttributeUsage]` ke valid target pe hai. Phir check karo — koi discovering code exist karta hai kya? Attribute khud kabhi kuch 'karta' nahi; agar iska koi framework-level ya custom-written reflection code discover/act nahi kar raha (jaise ek missing action filter registration, ya galat type check), attribute silently no-op reh jaayega. Ye ek common real-world debugging path hai jab log/behavior expected nahi milta.",
  },
  {
    id: "attributes-custom-attributes-tr-5",
    question: "Attribute vs interface — kisi cross-cutting concern (jaise audit logging) ke liye kaunsa choose karoge, aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Attribute jab concern genuinely descriptive/metadata hai aur multiple, unrelated types pe apply hona hai; interface jab ek real behavioral contract enforce karna hai.",
    detailedAnswer:
      "Attributes declarative aur non-invasive hain — class ka actual type contract nahi badalta, sirf ek marker add hota hai, aur unrelated classes pe bhi apply ho sakta hai bina inheritance force kiye. Interfaces genuine compile-time behavioral contract enforce karte hain (jo type interface implement karta hai, uske paas wo methods guaranteed hain). Audit logging jaisa cross-cutting concern typically attribute + interceptor/filter pattern se better fit hota hai — kyunki tumhe har class ko ek specific interface implement karne force nahi karna, sirf method ko tag karna hai.",
  },
  {
    id: "attributes-custom-attributes-tr-6",
    question: "ASP.NET Core me `[Authorize(Roles = \"Admin\")]` request pipeline me kaise act karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Authorization middleware/filter reflection se controller action pe lage `[Authorize]` attribute ko discover karta hai aur request ko allow/deny karta hai uske basis pe.",
    detailedAnswer:
      "Jab ek request kisi controller action tak pahunchti hai, ASP.NET Core ka authorization filter pipeline reflection se check karta hai action (aur controller) pe kaunse `[Authorize]` attributes lage hain, unke `Roles`/`Policy` values padhta hai, aur current user ke claims se compare karke decide karta hai request aage badhne degi ya `403 Forbidden` return karegi. Developer ne khud koi imperative `if (user.IsInRole(...))` check nahi likha — declarative attribute + framework-level reflection discovery ne kaam kiya.",
  },
  {
    id: "attributes-custom-attributes-tr-7",
    question: "Kya ye statement sahi hai: 'Attribute lagana ek chhota, zero-cost decision hai — koi trade-off nahi hota'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — reflection-based discovery ka runtime cost hai, aur attribute constructor me heavy logic daalna genuine anti-pattern hai.",
    detailedAnswer:
      "Do real trade-offs hain: (1) Har baar attribute discover karna (`GetCustomAttribute<T>()`) reflection call hai — hot path me bina caching ke repeatedly discover karna perf cost add karta hai (ASP.NET Core khud isliye routing/authorization attributes ko startup pe ek baar cache karta hai, per-request scan nahi karta). (2) Attribute constructors ko lightweight rehna chahiye — CLR unhe kabhi bhi instantiate kar sakta hai reflection ke through, aur heavy side-effects wala constructor unpredictable behavior de sakta hai. 'Zero cost' bolna in dono nuances ko miss karta hai.",
    redFlag: "'Attributes free hain, jitna chaho use karo bina soche' — reflection discovery cost aur constructor-design considerations ignore karna.",
  },
  {
    id: "attributes-custom-attributes-tr-8",
    question: "Ye code kya print karega agar `CreateOrder()` method pe `[AuditLog(\"OrderCreated\")]` laga hai?\n```csharp\nvar method = typeof(OrderService).GetMethod(\"CreateOrder\");\nvar attr = method.GetCustomAttribute<AuditLogAttribute>();\nConsole.WriteLine(attr?.Action ?? \"none\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"OrderCreated\" print hoga — `GetCustomAttribute<T>()` attribute instance return karta hai jiski `Action` property constructor se set hui thi.",
    detailedAnswer:
      "`GetCustomAttribute<AuditLogAttribute>()` reflection se method ki metadata me `AuditLogAttribute` dhoondta hai. Agar laga hai, ye attribute ka ek instance return karta hai (jo CLR ne compile-time constructor arguments se banaya), aur `attr.Action` `\"OrderCreated\"` hoga — kyunki attribute constructor me exactly wahi value pass ki gayi thi. Agar attribute nahi lagा hota, method `null` return karta, aur `??` operator se `\"none\"` print hota.",
  },
];

export default questions;
