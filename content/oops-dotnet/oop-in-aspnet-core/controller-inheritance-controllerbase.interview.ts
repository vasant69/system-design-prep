import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "controller-base-tr-1",
    question: "`ControllerBase` aur `Controller` me exact difference kya hai, aur Web API me konsa use karna chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer:
      "`ControllerBase` HTTP API essentials deta hai bina view support ke; `Controller` usi se derive karke Razor view-rendering members add karta hai. Pure Web API me `ControllerBase` sahi hai.",
    detailedAnswer:
      "ControllerBase me Ok(), NotFound(), CreatedAtAction(), ModelState, model binding jaise members hote hain — ye sab kuch jo ek HTTP JSON API ko chahiye. Controller khud ControllerBase se derive karta hai aur View(), ViewBag, ViewData jaise Razor-specific members add karta hai. Chunki ye section pure Web APIs likh raha hai (koi server-rendered HTML nahi), ControllerBase hi sahi, minimal base hai — Controller extend karna unnecessary surface area add karta hai jo kabhi use hi nahi hoga.",
    followUp: "Agar galti se Controller extend kar liya, kya koi real problem hoga ya sirf unused members honge?",
  },
  {
    id: "controller-base-tr-2",
    question: "Ye module mostly composition ko inheritance ke upar prefer karne ki baat karta hai. Controller inheritance is theme ko contradict kyun nahi karta?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Kyunki controller-to-base relationship ek genuine 'is-a' hai, aur framework khud (routing, model binding) directly is hierarchy ke members pe operate karta hai — ye ek framework-integrated, justified inheritance use hai.",
    detailedAnswer:
      "Composition-first guidance mainly apni khud ki business-logic classes ke liye hai (services, repositories) jahan deep, custom hierarchies fragile ban jaati hain. Controllers alag scenario hain — ASP.NET Core routing engine, model binder, aur filter pipeline sab ControllerBase ke exact members (ModelState, HttpContext, action result helpers) ko expect karte hain. Ye ek pehle-se-designed, framework-maintained hierarchy hai jisme tum extend kar rahe ho, apni khud ki fragile hierarchy nahi bana rahe. Isliye ye ek genuine exception hai, contradiction nahi.",
  },
  {
    id: "controller-base-tr-3",
    question: "Apna khud ka `BaseApiController` kab banana chahiye, aur kab nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Genuinely shared, cross-cutting logic ho tab banao (jaise Result-to-HTTP mapping); agar sirf 1-2 controllers use karenge ya logic har jagah alag hai, mat banao.",
    detailedAnswer:
      "BaseApiController ka value tabhi hai jab logic genuinely saare (ya zyadatar) controllers me repeat ho raha ho — jaise ek standard error response shape banana ya Result<T> ko IActionResult me convert karna. Agar sirf ek-do controllers ko kuch specific helper chahiye, wo unhi controllers me local rehna chahiye, ya ek injected service/extension method better fit hai. BaseApiController ko 'har cheez daal do' bana dena khud ek anti-pattern hai — fragile, sabko force-fit karne wali hierarchy, exactly wo problem jo composition-first design avoid karta hai.",
    followUp: "Agar do groups of controllers hain jinki alag-alag cross-cutting needs hain, kya karoge?",
  },
  {
    id: "controller-base-tr-4",
    question: "Ye code compile hoga? Kya issue hai agar hai?\n```csharp\n[ApiController]\n[Route(\"api/products\")]\npublic class ProductsController : Controller\n{\n    [HttpGet]\n    public IActionResult GetAll() => Ok(new List<string>());\n}\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Compile hoga aur kaam bhi karega, lekin design-wise galat base class use ho raha hai — pure API controller ko `ControllerBase` se derive karna chahiye, `Controller` se nahi.",
    detailedAnswer:
      "Ye code functionally sahi hai — Controller khud ControllerBase se derive karta hai isliye Ok() bilkul available hai, koi compile error nahi. Lekin ye best practice violation hai: ye controller kabhi koi view render nahi karega, isliye Controller se milne wale View()/ViewBag/ViewData members sirf dead weight hain. Microsoft ki guidance follow karte hue, isko `ProductsController : ControllerBase` hona chahiye.",
    followUp: "Ye 'galat lekin working' code production me kya real downside laata hai — sirf style issue hai ya kuch aur bhi?",
  },
  {
    id: "controller-base-tr-5",
    question: "Ye output kya hoga jab `Name` field missing bheja jaaye?\n```csharp\npublic record CreateProductDto(string Name, decimal Price);\n\n[ApiController]\n[Route(\"api/products\")]\npublic class ProductsController : ControllerBase\n{\n    [HttpPost]\n    public IActionResult Create([FromBody] CreateProductDto dto)\n    {\n        if (string.IsNullOrEmpty(dto.Name)) return BadRequest(\"Name required\");\n        return Ok(dto);\n    }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Agar `Name` bilkul missing hai JSON body me (aur required hai), `[ApiController]` khud hi automatic model validation ke through 400 de dega, action method body ka manual `if` check tak nahi pahunchega.",
    detailedAnswer:
      "`[ApiController]` attribute automatic model-state validation enable karta hai. Agar `Name` required (non-nullable, no default) property hai aur request body me missing hai, model binding hi fail ho jaata hai aur framework khud ek 400 response bhej deta hai — action method call hi nahi hota. Method ke andar ka manual `if (string.IsNullOrEmpty(...))` check tabhi trigger hoga jab `Name` present ho lekin empty string ho (missing hone se different case hai) — dono cases 400 return karte hain lekin different mechanism se.",
  },
  {
    id: "controller-base-tr-6",
    question: "Tumhari team ke 12 controllers hain, sab alag-alag tareeke se errors handle kar rahe hain — kuch `BadRequest(string)`, kuch `BadRequest(object)`, kuch custom exception throw karte hain. Product ne bola sabka error response shape consistent hona chahiye. OOP principles use karke kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek `BaseApiController` banao jisme ek `HandleResult<T>` (ya similar) helper ho jo standard error shape return kare, aur saare 12 controllers isse extend karein.",
    detailedAnswer:
      "Sabse pehle ek standard `Result<T>`/`ApiError` shape define karo. `BaseApiController : ControllerBase` banao jisme ek protected `HandleResult<T>(Result<T> result)` method ho jo internally consistent logic se Ok()/NotFound()/BadRequest() choose kare, ek fixed response shape ke saath. Har controller ab is BaseApiController ko extend kare, aur apni actions me direct BadRequest()/Ok() calls ki jagah HandleResult() use karein. Ye multilevel inheritance ka genuine, production-appropriate use hai — 12 jagah duplicate logic ki jagah, ek jagah maintain hoti hai.",
    followUp: "Agar kal ek naya controller aaye jise error handling thoda different chahiye (jaise extra logging), design kaise flexible rahega?",
  },
  {
    id: "controller-base-tr-7",
    question: "Tumhari company me 20+ controllers hain aur ek naya developer sujhaav deta hai: 'Sabko ek hi mega `AppBaseController` se derive karwao jisme pagination, caching, logging, authentication check, error handling — sab common helpers ho, taaki sab jagah available rahe.' Is idea pe tumhara comment?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ye anti-pattern hai — bahut saari unrelated responsibilities ek base class me daalna fragile 'God controller base' banata hai; sirf genuinely universal logic hi wahan honi chahiye, baaki ko separate concerns (filters, services, specific base classes) me split karo.",
    detailedAnswer:
      "Ye ek classic over-engineering trap hai. Pagination sabko nahi chahiye, caching sabko nahi chahiye, authentication requirements bhi controllers ke beech vary karte hain — sab kuch ek base class me daalna matlab har controller un saari responsibilities ko 'inherit' kar leta hai chahe use kare ya na kare, aur base class change karna sabko risk me daal deta hai. Better approach: sirf genuinely universal cheez (jaise error-response shape) BaseApiController me; pagination ek reusable service/extension method; caching ek attribute/filter; authentication `[Authorize]` attributes aur policies ke through — har concern apni sahi jagah pe, ek God base class me nahi.",
    redFlag: "Is idea ko bina pushback ke accept kar lena — ye signal deta hai candidate ko fragile inheritance hierarchies ke risks samajh nahi aate.",
  },
  {
    id: "controller-base-tr-8",
    question: "Kya ye statement sahi hai: 'Chunki ye module composition ko prefer karta hai, controller inheritance bhi avoid karke, controllers ko interfaces implement karwane chahiye, ControllerBase extend nahi karna chahiye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Galat — controller ko `ControllerBase` se derive karna zaroori/correct hai, ye framework contract hai; composition-first guidance apni khud ki business-logic classes ke liye hai, framework-integrated base classes ke liye nahi.",
    detailedAnswer:
      "Ye ek tempting-lekin-galat over-generalization hai. 'Composition over inheritance' ek general guideline hai apni khud ki domain/business logic design karte waqt — jahan deep custom hierarchies fragile ban sakti hain. Ye ASP.NET Core ke framework contracts pe apply nahi hota — routing, model binding, filters sab `ControllerBase` ke concrete members expect karte hain, aur ye replace nahi ho sakta kisi interface se bina framework khud ko reimplement kiye. Har rule ko bina context ke universally apply kar dena — ye exactly wo mistake hai jo is trap question test karta hai.",
    redFlag: "'Composition-first' rule ko bina exception samjhe blindly har jagah apply kar dena — real engineering judgement missing signal deta hai.",
  },
  {
    id: "controller-base-tr-9",
    question: "Ek `BaseApiController` likho jisme `ControllerBase` extend ho aur do protected helper methods hon: `HandleResult<T>(Result<T> result)` (Ok/NotFound/BadRequest map kare) aur `CurrentUserId` (ek property jo `User.FindFirst` se claim nikale). Fir dikhao ek `ProductsController` ise kaise use karta hai.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Abstract BaseApiController class banao ControllerBase se derive karke, do protected members add karo, concrete controller usse extend kare.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic abstract class BaseApiController : ControllerBase\n{\n    protected IActionResult HandleResult<T>(Result<T> result) =>\n        result switch\n        {\n            { IsSuccess: true, Value: not null } => Ok(result.Value),\n            { IsSuccess: true } => NotFound(),\n            _ => BadRequest(result.Error),\n        };\n\n    protected string? CurrentUserId =>\n        User.FindFirst(\"sub\")?.Value;\n}\n\n[ApiController]\n[Route(\"api/products\")]\npublic class ProductsController : BaseApiController\n{\n    private readonly IProductService _productService;\n    public ProductsController(IProductService productService) => _productService = productService;\n\n    [HttpGet(\"{id}\")]\n    public async Task<IActionResult> GetById(int id)\n    {\n        var result = await _productService.GetByIdAsync(id, CurrentUserId);\n        return HandleResult(result);\n    }\n}\n```\nKey evaluation points: `BaseApiController` correctly extends `ControllerBase` (not `Controller`), helpers are `protected` (accessible to derived controllers, not public API surface), and `ProductsController` demonstrates actually using both inherited members.",
  },
];

export default questions;
