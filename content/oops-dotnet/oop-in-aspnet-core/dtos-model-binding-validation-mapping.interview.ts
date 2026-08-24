import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dtos-tr-1",
    question: "Entity ko directly API boundary cross karne dene se kya problems aate hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer:
      "Do main risks — over-posting (client unintended fields set kar sakta hai) aur DB schema ka API contract se tight coupling.",
    detailedAnswer:
      "Over-posting: agar entity directly model-bind hoti hai, model binder request body ke saare matching fields set kar deta hai, jisme internal/sensitive fields (jaise approval flags, computed scores) bhi shamil ho sakte hain jo client ko touch nahi karne chahiye. Coupling: entity ko response me directly serialize karne se API consumers DB schema ke internal shape pe depend karne lagte hain — kal agar ek column rename ho ya EF Core navigation property add ho, API response bhi break ho sakta hai, jabki API contract stable rehna chahiye tha.",
    followUp: "In dono problems ko DTO kaise exactly solve karta hai?",
  },
  {
    id: "dtos-tr-2",
    question: "DTOs ke liye `record` type ko class ke bajaye kyun prefer kiya jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "DTO ka purpose sirf data carry karna hai, behavior nahi — record ki immutability aur built-in structural equality is purpose ke liye natural fit hain, minimal boilerplate ke saath.",
    detailedAnswer:
      "DTOs ideally immutable hone chahiye — ek baar client se data aaya, usko modify karne ki koi zaroorat nahi (mutation ka koi legitimate use case nahi hai ek pure data-carrier ke liye). record positional syntax se compact declaration deta hai, aur value-based equality automatically milti hai jo testing me useful hai (do DTOs compare karna without custom Equals). Ye Module 4 ke record/immutability concept ka bilkul direct real-world application hai.",
  },
  {
    id: "dtos-tr-3",
    question: "Manual mapping aur AutoMapper-style mapping ka trade-off explain karo, aur apna opinion do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Manual mapping explicit/debuggable hai lekin bade objects ke liye repetitive; AutoMapper boilerplate kam karta hai lekin 'magic' debug karna mushkil hota hai. Chhote DTOs ke liye manual, bade object graphs ke liye tool-assisted.",
    detailedAnswer:
      "Manual mapping (`new Order { ProductId = dto.ProductId, ... }`) me har field explicitly dikhta hai — koi hidden convention-based behavior nahi, IDE navigate karna easy hai, aur naya team member bina extra library seekhe samajh sakta hai. Downside: 20+ field wale objects me repetitive ho jaata hai, aur ek field bhool jaana easy hai. AutoMapper convention-based hai — naming match karne wale fields automatically map ho jaate hain, boilerplate drastically kam — lekin jab kuch galat map ho, debug karna harder hota hai kyunki mapping logic explicit code me nahi dikhta. Meri recommendation: chhote DTOs (5-6 fields) ke liye manual, genuinely bade/complex graphs ke liye hi tool-assisted mapping consider karo — default AutoMapper mat bana do har jagah.",
    followUp: "AutoMapper me ek mapping bug production me kaise typically manifest hota hai?",
  },
  {
    id: "dtos-tr-4",
    question: "Ye code kya response dega jab `Quantity` field 0 bheja jaaye?\n```csharp\npublic record CreateOrderDto([property: Required] string ProductId, [property: Range(1, 100)] int Quantity);\n\n[HttpPost]\npublic IActionResult Create(CreateOrderDto dto) => Ok(dto);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`400 Bad Request` — `Quantity = 0` `[Range(1, 100)]` violate karta hai, `[ApiController]` automatic validation ke through action method chalne se pehle hi reject ho jaata hai.",
    detailedAnswer:
      "`[Range(1, 100)]` ka matlab hai valid range 1 se 100 (inclusive) hai — 0 is range ke bahar hai. `[ApiController]` attribute (jo controller pe implicitly ya explicitly laga hota hai) model-validation automatically check karta hai request aane par; agar koi DataAnnotations rule fail ho, framework khud `400 Bad Request` (validation errors ke saath) return kar deta hai, `Create` method ka body execute hi nahi hota — `Ok(dto)` line kabhi nahi chalti.",
    followUp: "Agar `[ApiController]` attribute na laga ho controller pe, ye same behavior hoga?",
  },
  {
    id: "dtos-tr-5",
    question: "Ye code me kya issue hai?\n```csharp\npublic record OrderDto(int Id, string ProductId, int Quantity, string InternalNotes, decimal CostPrice);\n\n[HttpPost]\npublic IActionResult Create(OrderDto dto) { /* create order from dto */ }\n\n[HttpGet(\"{id}\")]\npublic IActionResult GetById(int id) => Ok(_repository.GetById(id).ToDto()); // returns same OrderDto\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Ek hi `OrderDto` request aur response dono ke liye use ho raha hai — `InternalNotes`/`CostPrice` jaise internal fields client ko response me leak ho rahe hain, aur `Create` request me client inhe over-post bhi kar sakta hai.",
    detailedAnswer:
      "Ye exactly wo mistake hai jo topic warn karta hai — single shared DTO reuse karna. `Create` action me client `InternalNotes`/`CostPrice` bhi apni marzi se set kar sakta hai (over-posting), aur `GetById` response me ye internal fields poore client base ko expose ho rahe hain jo unhe dekhne ki zaroorat hi nahi thi. Fix: `CreateOrderDto` (sirf ProductId, Quantity) aur `OrderResponseDto` (sirf client-relevant response fields, InternalNotes/CostPrice ke bina) — do alag, purpose-specific DTOs.",
  },
  {
    id: "dtos-tr-6",
    question: "Product team bolti hai: 'Order create response me ab ek naya field chahiye — `EstimatedDeliveryDate`, jo DB me store nahi hoti, request time pe compute hoti hai.' Design kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`OrderResponseDto` me `EstimatedDeliveryDate` field add karo, `Order` entity ko touch mat karo — ye exactly wo scenario hai jo request/response DTOs ko entity se decouple karne se easy ban jaata hai.",
    detailedAnswer:
      "Chunki `OrderResponseDto` entity se already decoupled hai, service layer me sirf `EstimatedDeliveryDate` compute karke response DTO me add kar sakte ho — koi migration, koi entity change, koi schema touch nahi karna padta. Agar entity directly expose kiya hota, ya to entity me ek fake/unpersisted property add karni padti (design smell — entity ko purely DB-mapping ki jagah response-shaping ke liye bhi use karna) ya migration karni padti unnecessarily. Ye exactly wo flexibility hai jo DTO layer deta hai.",
    followUp: "Agar EstimatedDeliveryDate calculation heavy ho (external API call), kahan compute karoge — controller, service, ya DTO khud?",
  },
  {
    id: "dtos-tr-7",
    question: "Ek naya developer sujhaav deta hai: 'Sabhi validations frontend (React form) me already ho rahi hain, backend DataAnnotations dobara likhna duplicate effort hai, hata dete hain.' Kya react karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Backend validation kabhi optional nahi honi chahiye — API kisi bhi client (Postman, mobile app, direct curl call) se call ho sakta hai jo frontend validation completely bypass kar sakta hai; backend hi asli, enforceable boundary hai.",
    detailedAnswer:
      "Frontend validation UX ke liye hai — user ko turant feedback dena, unnecessary network calls avoid karna. Ye kabhi security/data-integrity boundary nahi hai kyunki client-side code fully user ke control me hai — koi bhi Postman ya curl se directly API endpoint hit kar sakta hai, frontend ko completely bypass karke. Agar backend DataAnnotations hata di jaayein, koi bhi invalid data directly database tak pahunch sakta hai. Duplication yahan zaroori hai — dono layers apna alag role play karte hain (UX vs correctness/security).",
    redFlag: "Frontend validation ko backend validation ke replacement ki tarah treat karna — ek security-critical misunderstanding hai jo interviewer ke liye red flag hai.",
  },
  {
    id: "dtos-tr-8",
    question: "Kya ye statement sahi hai: 'DTO aur ViewModel same cheez hain, farak sirf naming ka hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Partially — dono ka concept overlap karta hai (data-carrying object) lekin traditionally ViewModel term Razor/MVC view-rendering context se aata hai jabki DTO term general API/layer-boundary data transfer ke liye use hota hai; pure Web API me hum consistently 'DTO' bolte hain.",
    detailedAnswer:
      "Ye trap thoda subtle hai kyunki structurally dono kaafi similar ho sakte hain — ek simple, purpose-built data-carrying object. Lekin terminology ka origin alag hai: ViewModel historically MVC pattern se aata hai, jahan wo specifically ek Razor view ko render karne ke liye data shape karta hai (aksar UI-specific concerns bhi carry karta hai, jaise dropdown options). DTO ek broader term hai — kisi bhi do layers/boundaries ke beech data transfer karne wala object, chahe wo API request/response ho ya internal service-to-service call. Chunki ye section pure Web APIs (no views) hai, hum consistently 'DTO' terminology use karte hain — 'ViewModel' technically misleading hoga is context me kyunki koi view hai hi nahi.",
    redFlag: "Dono terms ko bina context ke completely interchangeable bol dena — interviewer specifically ye probe karta hai ki candidate terminology ki origin/nuance samajhta hai ya sirf buzzwords use kar raha hai.",
  },
  {
    id: "dtos-tr-9",
    question: "Ek `UpdateProductDto` record likho jisme `Name` (required, max 100 chars), `Price` (0.01 se 100000 ke beech), aur `Description` (optional, max 500 chars) ho, DataAnnotations validation ke saath. Fir ek `PUT` action likho jo isko use kare.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Positional record with property-targeted DataAnnotations attributes, aur ek PUT action jo dto accept kare aur service ko delegate kare.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic record UpdateProductDto(\n    [property: Required, StringLength(100)] string Name,\n    [property: Range(0.01, 100000)] decimal Price,\n    [property: StringLength(500)] string? Description\n);\n\n[ApiController]\n[Route(\"api/products\")]\npublic class ProductsController : ControllerBase\n{\n    private readonly IProductService _productService;\n    public ProductsController(IProductService productService) => _productService = productService;\n\n    [HttpPut(\"{id}\")]\n    public async Task<IActionResult> Update(int id, UpdateProductDto dto)\n    {\n        var result = await _productService.UpdateAsync(id, dto);\n        if (result is null) return NotFound();\n        return Ok(result);\n    }\n}\n```\nKey evaluation points: `Description` correctly nullable (optional means no `[Required]`), `Range` used with decimal-appropriate bounds, `[property: ...]` targeting used correctly on a positional record, and the action delegates to a service rather than doing entity mapping directly in the controller.",
  },
];

export default questions;
