import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "routing-tr-1",
    question: "Attribute routing aur conventional routing me kya fark hai, aur Web API me kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Cognizant"],
    shortAnswer: "Attribute routing route ko controller/action ke saath co-locate karta hai (Web API standard); conventional routing central template-based hai (MVC-view-app legacy).",
    detailedAnswer:
      "Attribute routing me har action apna `[Route]`/`[HttpGet]` jaisa attribute carry karta hai, isliye endpoint ka exact URL uske definition ke saath hi dikhta hai — koi central lookup nahi. Conventional routing `Program.cs` me ek generic pattern (`{controller}/{action}/{id}`) define karta hai jo naming convention se controllers/actions ko map karta hai — Razor-view MVC apps ke liye design hua tha. Web APIs me attribute routing standard hai kyunki RESTful resource URLs (nested paths, multiple verbs same path pe) is style me naturally express hote hain.",
    followUp: "Ek nested resource route jaise orders/{orderId}/items/{itemId} conventional routing me kaise express karoge?",
  },
  {
    id: "routing-tr-2",
    question: "Route constraint (`{id:int}`) aur action method ke andar business validation me kya difference hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Constraint sirf URL-shape filter karta hai (routing-match time); business validation actual domain rules check karta hai (action ke andar).",
    detailedAnswer:
      "`{id:int}` ye ensure karta hai ki route sirf tab match ho jab URL segment ek valid integer format me ho — agar `/orders/abc` aaye, ye route match hi nahi hoga (404 ya doosra route try hoga). Ye purely syntax-level filtering hai. Business validation — jaise 'kya ye order ID actually exist karta hai database me,' ya 'kya current user is order ko access kar sakta hai' — action method ke andar hoti hai, kyunki wo domain-specific logic hai jo routing engine ko pata nahi ho sakta.",
  },
  {
    id: "routing-tr-3",
    question: "Ye do actions same controller me hain:\n```csharp\n[HttpGet(\"{id:int}\")]\npublic IActionResult GetById(int id) => Ok();\n\n[HttpGet(\"{id:guid}\")]\npublic IActionResult GetByGuid(Guid id) => Ok();\n```\nRequest `/api/orders/5` aur `/api/orders/3fa85f64-...` ke liye kya hoga?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Route constraints dono actions ko disambiguate kar dete hain — integer request GetById pe jaata hai, GUID request GetByGuid pe.",
    detailedAnswer:
      "`{id:int}` sirf integer-format segments match karta hai, `{id:guid}` sirf valid GUID format. `/api/orders/5` sirf int constraint satisfy karta hai isliye GetById invoke hota hai. `/api/orders/3fa85f64-5717-4562-b3fc-2c963f66afa6` GUID format hai, int nahi, isliye GetByGuid invoke hota hai. Bina constraints ke, dono actions same route template share karte aur ambiguous-match exception aata.",
  },
  {
    id: "routing-tr-4",
    question: "`[controller]` token ka use karne se kya practical benefit milta hai versus har controller me route hardcode karna?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Consistency aur refactor-safety — controller class rename hone par route automatically update ho jaata hai.",
    detailedAnswer:
      "Agar `[Route(\"api/Orders\")]` hardcode kiya jaaye aur baad me class ka naam `OrdersController` se `OrderManagementController` rename ho jaaye, route string manually update karni padegi — bhool jaana easy hai. `[Route(\"api/[controller]\")]` use karne se ye automatically sync rehta hai class naam ke saath, kyunki `[controller]` runtime pe resolve hota hai class naam se.",
  },
  {
    id: "routing-tr-5",
    question: "Minimal APIs (`app.MapGet(...)`) ka routing model attribute routing se conceptually kitna alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Conceptually bahut similar — explicit route + verb per endpoint, same constraint syntax — bas controller class ke bajaye inline lambda syntax hai.",
    detailedAnswer:
      "Dono approaches me route aur HTTP verb explicitly, per-endpoint declare hote hain — koi convention-based inference nahi. `{id:int}` jaisi constraint syntax dono me identical hai. Fark sirf hosting mechanism ka hai: attribute routing controller class + action method use karta hai (DI, model binding, filters ka poora MVC pipeline), Minimal APIs direct lambda registration use karte hain jo lighter-weight hai lekin conceptually same routing philosophy follow karta hai.",
  },
  {
    id: "routing-tr-6",
    question: "Ek naya team member ek action pe route constraint likhna bhool jaata hai (`{id}` instead of `{id:int}`) aur action parameter `int id` hai. `/api/orders/abc` request bhejne par kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Model binding fail hoga — action invoke hoga lekin id bind nahi ho payega, jisse model state invalid ho jaayega aur (ApiController ke saath) automatic 400 response milega.",
    detailedAnswer:
      "Bina constraint ke, route `/api/orders/{id}` `abc` ko bhi match kar leta hai (kyunki koi type-filtering nahi hai). Routing action tak pahunch jaati hai, lekin model binding `abc` ko `int` me convert nahi kar paata — model state invalid mark hota hai. Agar controller pe `[ApiController]` attribute hai, framework automatically 400 Bad Request return kar deta hai bina action code chalne ke. Constraint hota to ye request route-match-level pe hi filter ho jaati, action tak pahunchti hi nahi — dono approaches end-result me similar hain lekin constraint zyada explicit aur early-filtering hai.",
  },
  {
    id: "routing-tr-7",
    question: "Kya ye statement sahi hai: 'Ek controller me kabhi bhi attribute routing aur conventional routing dono ek saath use ho sakte hain, bina kisi issue ke'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — agar controller ke kisi bhi action pe attribute routing hai, poora controller attribute-routed ban jaata hai aur conventional routes se match nahi hoga.",
    detailedAnswer:
      "Ye ek genuine gotcha hai. ASP.NET Core ka routing system per-controller decide karta hai ki wo attribute-routed hai ya conventionally-routed — agar controller ke andar kisi bhi action pe `[Route]` ya HTTP-verb attribute mila, poora controller attribute-routing mode me switch ho jaata hai, chahe koi conventional route bhi define ho `Program.cs` me. Ye mix-and-match silently break ho sakta hai — kisi action ka expected route match hi nahi hoga.",
    redFlag: "Confidently kehna ki dono styles freely mix ho sakti hain bina is per-controller switching behavior ko mention kiye.",
  },
  {
    id: "routing-tr-8",
    question: "`{id?}` aur `{id:int?}` me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`{id?}` sirf optional hai (koi bhi format), `{id:int?}` optional bhi hai aur agar present ho to integer format bhi enforce karta hai.",
    detailedAnswer:
      "`?` route parameter ko optional banata hai — matlab wo URL me present na ho to bhi route match ho jaata hai (action parameter ko default/nullable value milta hai). `{id:int?}` do cheezein combine karta hai: parameter optional hai, LEKIN agar present hai to `int` format hi honi chahiye — agar koi non-integer value di gayi (jaise `/orders/abc`), ye route match nahi hoga (jabki plain `{id?}` match kar leta).",
  },
];

export default questions;
