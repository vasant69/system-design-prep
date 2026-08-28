import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "apiver-1",
    question: "Ek ASP.NET Core Web API ko version kaise karoge? Kaunsi strategy aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`Asp.Versioning.Mvc` packages use karta hoon. Default strategy URL segment — `/api/v1/...` — external clients ke liye, kyunki wo cache-friendly aur browser/curl se test karna aasan hai. `DefaultApiVersion` plus `AssumeDefaultVersionWhenUnspecified` se versioning add karna backward compatible rehta hai.",
    detailedAnswer:
      "Packages: `Asp.Versioning.Mvc` (routing + attributes) aur `Asp.Versioning.Mvc.ApiExplorer` (per-version Swagger). Purana naam `Microsoft.AspNetCore.Mvc.Versioning` tha. `Program.cs` me `AddApiVersioning` me `DefaultApiVersion = new ApiVersion(1, 0)`, `AssumeDefaultVersionWhenUnspecified = true`, `ReportApiVersions = true`, aur `ApiVersionReader.Combine(...)` se chahe to ek se zyada readers. Controllers par `[ApiVersion]` attribute lagta hai aur route `api/v{version:apiVersion}/employees` hota hai. Char strategies hain — URL segment (default, cache-friendly), query string (simple par log-invisible), header (clean URL par browser test tootta hai aur `Vary` chahiye), aur media type (sabse RESTful par worst tooling). External clients ke liye URL segment, internal service-to-service ke liye aksar header.",
    followUp: "Ek se zyada version readers combine karne ka nuksan kya hai?",
    redFlag:
      "'Bas controller ka naam `EmployeesV2Controller` rakh do' — routing/attribute wiring ke bina wo automatically kisi version se map nahi hota.",
  },
  {
    id: "apiver-2",
    question: "Breaking change kya count hota hai? Additive changes ke examples do jo bump nahi maangte.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Breaking: field rename/remove, field ka type ya meaning badalna, koi field ab required ho jaana jo pehle optional tha, ya default behaviour badalna. Additive (no bump): naya response field, naya optional query param, naya endpoint, error response me extra detail.",
    detailedAnswer:
      "Rule ek hi hai: 'kya koi existing client bina code badle toot sakta hai?'. Naya field add karna safe hai kyunki purane clients use ignore karte hain. Naya optional parameter safe hai. Naya endpoint safe hai. Lekin `FullName` ko `FirstName`/`LastName` me todna, `status` ka type string se object me badalna, page size default 20 se 50 karna, ya kisi optional field ko required banana — ye sab kisi client ka parsing ya assumption tod sakte hain, isliye `v2`. Additive ko additive rakhna important hai kyunki har live version ka apna maintenance, test suite aur doc cost linear badhta hai.",
    followUp: "Agar tumhe ek existing field ka meaning subtly badalna ho par naam wahi rakhna ho — bump karoge?",
    redFlag: "Har chhote field addition par version bump karna — 8 mahine me `v7` tak pahunch jaana.",
  },
  {
    id: "apiver-3",
    question:
      "`[ApiVersion]` attribute par version 1.0 ke saath `Deprecated = true` lagane se kya hota hai? Version turant band ho jaata hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Nahi. Version poori tarah kaam karta rehta hai — sirf response header (`api-deprecated-versions`) aur Swagger me 'deprecated' flag lagta hai. Yeh ek signal hai, removal nahi.",
    detailedAnswer:
      "Deprecation ek soft warning hai: `ReportApiVersions = true` ke saath har response me `api-deprecated-versions: 1.0` header aata hai, aur per-version Swagger doc me description me 'This version is deprecated' likha jaa sakta hai. Client tooling is se warn kar sakta hai. Actual retirement ek alag step hai — ek sunset date announce karo (BFSI me 90 se 365 din notice), traffic monitor karo jab tak zyadatar clients migrate na kar jaayein, phir `v1` controller/DTO delete karo. Deprecate karke `ReportApiVersions` off rakhna aur koi communication na karna — clients ko pata hi nahi chalega aur retire ke din bade pemane par breakage hoga.",
    followUp: "Kaise pata karoge ki `v1` ab safely remove kiya jaa sakta hai?",
  },
  {
    id: "apiver-4",
    question:
      "Ek team ne `v2` banate waqt `v1` DTO class delete kar di aur `v1` action ko 'temporarily' `v2` DTO return karwa diya. Ek partner ka reconciliation job jo `FullName` padhta tha silently `null` padhne laga. Root cause aur sahi rule kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Purana version byte-level frozen hona chahiye tha. `v1` ka contract badal gaya jab uska DTO badla — koi error nahi aaya, partner ko `null` mila aur galat data audit table me chala gaya. Naya version = naya DTO class, purana untouched.",
    detailedAnswer:
      "`[MapToApiVersion]` se ek controller do versions serve kar sakta hai, par har version ka apna DTO hona chahiye — `EmployeeV1Dto(int Id, string FullName, string Email)` aur `EmployeeV2Dto(int Id, string FirstName, string LastName, string Email)`. `v1` action ko `v2` DTO return karwane ka matlab `FullName` field gayab — JSON serializer bas use skip kar dega, aur ek lenient client `null` ya missing-key ke saath aage badh jaayega, exception nahi. Yahi silent corruption khatarnak hai. Rule: `v1` ka exact shape freeze karo (ideally ek OpenAPI JSON snapshot test se jo `v1` shape badalne par CI fail kare). Naya version banate waqt purane DTO/controller ko chhuo mat jab tak wo version retire na ho.",
    followUp: "`v1` shape ko regression se bachane ke liye kaunsa test likhoge?",
    redFlag:
      "'Logic same hai to ek hi action dono ko serve kar sakta hai' — logic share karo, contract (DTO) nahi.",
  },
  {
    id: "apiver-5",
    question:
      "URL segment vs query string vs header vs media-type versioning — trade-offs ek-ek line me.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "URL segment: sabse saaf, cache-friendly, browser-testable; version badalne par sab client URLs badalte hain. Query string: URL structure same, add karna aasan; logs/analytics me miss, proxies strip kar sakte hain. Header: URL bilkul clean; browser test nahi, CDN ke liye `Vary` chahiye. Media type: sabse RESTful; sabse kam samjha jaata hai, tooling weak.",
    detailedAnswer:
      "Production advice: ek primary strategy chuno — external ke liye URL segment, internal ke liye header aksar — aur zaroorat ho to `ApiVersionReader.Combine(new UrlSegmentApiVersionReader(), new HeaderApiVersionReader(X_Api_Version_placeholder))` se ek se zyada accept karo. Har extra reader ek ambiguity ka source hai, isliye combine list chhoti rakho. `MediaTypeApiVersionReader` (`Accept: application/json;v=2.0`) technically content negotiation ke sabse kareeb hai par debugging painful hai.",
    followUp: "Internal microservices ke beech tum header kyun prefer karoge URL segment par?",
  },
  {
    id: "apiver-6",
    question:
      "Per-version Swagger docs kaise generate karte ho taaki UI ke dropdown me `V1` aur `V2` alag dikhein?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`AddApiExplorer` ke saath `GroupNameFormat = 'v'VVV` aur `SubstituteApiVersionInUrl = true`. Phir ek `IConfigureOptions<SwaggerGenOptions>` jo har `IApiVersionDescriptionProvider.ApiVersionDescriptions` ke liye ek `SwaggerDoc` register kare, aur `UseSwaggerUI` me `app.DescribeApiVersions()` par loop karke har group ka endpoint add kare.",
    detailedAnswer:
      "`AddApiExplorer` versioned API metadata expose karta hai. `GroupNameFormat = 'v'VVV` group names `v1`, `v2`, `v1.1` banata hai. `SubstituteApiVersionInUrl = true` Swagger UI me `api/v{version}/employees` ki jagah asli `api/v1/employees` dikhata hai taaki 'Try it out' kaam kare. `ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>` me `_provider.ApiVersionDescriptions` par loop karke `options.SwaggerDoc(desc.GroupName, new OpenApiInfo { ... Version = desc.ApiVersion.ToString(), Description = desc.IsDeprecated ? deprecatedText : null })`. `builder.Services.ConfigureOptions<ConfigureSwaggerOptions>()` se wire hota hai. `UseSwaggerUI` me har `app.DescribeApiVersions()` entry ke liye `ui.SwaggerEndpoint(...)`.",
    followUp: "Deprecated version ko Swagger UI me visually alag kaise mark karoge?",
  },
  {
    id: "apiver-7",
    question:
      "Kab API versioning NAHI karni chahiye — kahan wo sirf ceremony hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jab ek hi frontend hai jise tumhari hi team same repo/deploy me ship karti hai. Frontend aur backend saath deploy hote hain, to koi purana client hi nahi bachta — versioning sirf overhead hai.",
    detailedAnswer:
      "Versioning ka cost tab justify hota hai jab clients tumhare control me nahi hain, ya alag-alag deploy hote hain — mobile apps (purana version months tak phones me), partner/BFSI integrations (slow change-management), doosri teams. Agar ek SPA hai jo same pipeline me backend ke saath jaata hai, to breaking change dono taraf ek saath handle ho jaata hai; versioning duplicate controllers aur DTOs ke saath maintenance badhata hai bina kisi payoff ke. Ek integrator ne internal HR API me har additive change par bump kiya aur `v7` tak pahunch gaya — audit me pata chala koi bump zaroori hi nahi tha. Discipline: additive = no bump, aur single-client internal API = no versioning.",
    followUp: "Agar aaj single-client hai par 6 mahine baad ek partner aane wala hai — abhi versioning add karoge?",
    redFlag: "'Versioning hamesha best practice hai, har API me lagao' — context se decouple, over-engineering.",
  },
];

export default questions;
