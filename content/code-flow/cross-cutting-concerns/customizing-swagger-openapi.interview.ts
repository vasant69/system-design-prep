import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "swagger-1",
    question: "OpenAPI, Swagger aur Swashbuckle — teeno ko ek line me distinguish karo.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "OpenAPI = specification (standard). Swagger = us spec ke tools ka ecosystem (UI, Editor, Codegen). Swashbuckle = .NET library jo controllers se OpenAPI document generate karti hai.",
    detailedAnswer:
      "OpenAPI ek machine-readable format hai jisme REST API ke paths, params, request/response schemas aur auth describe hote hain (pehle 'Swagger Specification', 2016 me rename). Swagger un tools ka naam hai jo is spec ke around bane — sabse common Swagger UI, ek interactive docs page. Swashbuckle (Swashbuckle.AspNetCore) ek NuGet library hai jo ASP.NET Core ke ApiExplorer se actions padhkar swagger.json banati hai aur Swagger UI serve karti hai.",
    followUp: ".NET 8 ke baad framework ka apna Microsoft.AspNetCore.OpenApi kya deta hai, Swashbuckle se farq?",
  },
  {
    id: "swagger-2",
    question:
      "`ProducesResponseType` attributes kyun likhte hain? Ye kaunsa problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Swagger ko har realistic status code aur uski body ka shape batane ke liye — bina inke Swagger sirf ek generic success response infer karta hai.",
    detailedAnswer:
      "ApiExplorer return type se ek default 200/201 to nikaal leta hai, lekin 400 (ValidationProblemDetails), 404, 409 (ProblemDetails) jaise codes aur unke shapes automatically nahi pata chalte. `[ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status201Created)]` jaisi lines har outcome ko document karti hain taaki frontend/mobile developer aur codegen tools ko exact contract mile — kaunsa code, kaunsa JSON shape.",
    followUp: "ApiController automatic 400 deta hai — uska shape kya hota hai aur usko kaise document karoge?",
    redFlag: "Ye kehna ki attributes optional hain kyunki Swagger 'waise bhi sab dikha deta hai'.",
  },
  {
    id: "swagger-3",
    question:
      "Swagger UI me endpoint descriptions aane chahiye the (XML `///` comments se) par aa nahi rahe. Debugging kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Do cheezein check karo: csproj me GenerateDocumentationFile true hai kya, aur IncludeXmlComments ko sahi path mila kya — galat path par Swashbuckle silently skip karta hai.",
    detailedAnswer:
      "Pehle csproj me `<GenerateDocumentationFile>true</GenerateDocumentationFile>` — warna XML file banti hi nahi. Phir `Program.cs` me `options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile))` jahan xmlFile assembly name se derive ho (`{Assembly.GetExecutingAssembly().GetName().Name}.xml`). Agar path galat hai ya file bin output me nahi hai to Swashbuckle koi error nahi deta, bas comments apply nahi hote. bin folder me `.xml` file exist karti hai ya nahi, wahi confirm karo.",
    followUp: "NoWarn 1591 kis liye add karte hain?",
  },
  {
    id: "swagger-4",
    question:
      "Swagger UI me protected (`[Authorize]`) endpoints ko 'Try it out' se test karne ke liye kya setup chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "AddSwaggerGen me AddSecurityDefinition('Bearer', ...) se Authorize button add karo, aur AddSecurityRequirement se batao ki endpoints us scheme se protected hain.",
    detailedAnswer:
      "AddSecurityDefinition ek 'Bearer' scheme define karta hai (Type Http, Scheme bearer, In Header) — isse Swagger UI me ek 'Authorize' button aata hai jahan tum JWT paste karte ho. AddSecurityRequirement (jisme Reference Id 'Bearer' upar wali definition se match kare) UI ko batata hai ki har request me Authorization: Bearer <token> header lagana hai. Iske bina protected endpoints hamesha 401 dete rahenge Swagger se.",
    followUp: "Reference Id typo ho jaaye to kya symptom dikhega?",
  },
  {
    id: "swagger-5",
    question:
      "Production BFSI API me Swagger UI ke saath kya karoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Prod me Swagger UI band, ya authentication / internal-network ke peeche — kyunki wo poori API surface (endpoints, fields, validation rules) publicly expose kar deta hai.",
    detailedAnswer:
      "Swagger ek complete map hai — attacker ke liye reconnaissance ready. Safe patterns: `if (!app.Environment.IsProduction()) { app.UseSwagger(); app.UseSwaggerUI(); }`, ya prod me chahiye to `app.MapSwagger().RequireAuthorization()` / reverse-proxy basic auth. swagger.json ko CI me generate karke contract tests aur client codegen ke liye use kar sakte ho bina UI serve kiye. Ye OWASP API9 (improper inventory management) se seedha juda hai.",
    followUp: "swagger.json ko CI me contract-diff ke liye kaise use karoge?",
    redFlag: "Ye maanna ki Swagger UI public rakhna theek hai kyunki 'endpoints to waise bhi guessable hote hain'.",
  },
  {
    id: "swagger-6",
    question: "Swashbuckle vs NSwag vs .NET 9 built-in OpenAPI vs Scalar — kab kya?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Swashbuckle = .NET 8 mainstream (doc + Swagger UI). NSwag = doc + C#/TS client codegen. .NET 9 built-in = sirf doc generation, UI ke liye alag renderer chahiye. Scalar = modern UI layer jo swagger.json consume karta hai.",
    detailedAnswer:
      "Swashbuckle .NET 8 (LTS) me default choice hai — swagger.json + Swagger UI dono. NSwag tab jab org me typed clients auto-generate hote hain (C#/TypeScript), kyunki wo codegen bhi karta hai. .NET 9 ka Microsoft.AspNetCore.OpenApi (AddOpenApi/MapOpenApi) framework-native document generation deta hai par UI nahi — usko Swagger UI ya Scalar ke saath pair karte hain. Scalar sirf ek behtar-dikhne wala reference UI hai, wahi swagger.json render karta hai.",
    followUp: "Ek existing .NET 8 project ko .NET 9 built-in OpenAPI par migrate karne me kya badalna padega?",
  },
  {
    id: "swagger-7",
    question:
      "API me enum field `DocumentType` Swagger schema aur JSON dono me `0` / `1` ki tarah dikh raha hai, `\"PAN\"` / `\"Aadhaar\"` nahi. Fix?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "JsonStringEnumConverter register karo — AddControllers().AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())).",
    detailedAnswer:
      "Default me System.Text.Json enums ko numeric serialize karta hai. JsonStringEnumConverter add karne se request/response me enum values string ki tarah aati-jaati hain, aur Swagger schema me bhi readable enum values dikhti hain. BFSI clients ke liye ye important hai — `\"PAN\"` self-documenting hai, `0` nahi, aur ek nayi enum value insert hone par numbers shift nahi hote.",
    followUp: "Enum me beech me nayi value add karne par numeric serialization kyun khatarnak hai?",
  },
];

export default questions;
