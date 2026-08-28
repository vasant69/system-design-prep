import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "routing-1",
    question: "Attribute routing aur conventional routing me kya farq hai, aur Web API kaunsa use karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Conventional = ek central controller/action/id pattern (MVC views). Attribute = har action pe uska exact URL+verb. Web API attribute routing use karti hai.",
    detailedAnswer:
      "Conventional routing Program.cs me ek pattern register karti hai jaise `{controller}/{action}/{id?}` aur URL se action ka naam derive hota hai — MVC views ke liye theek. Attribute routing me `[Route]`, `[HttpGet(\"{id:int}\")]` seedha controller/action pe likha hota hai. Web API attribute routing pe hai kyunki: (1) RESTful URLs jaise `/api/employees/5/documents` kisi `{controller}/{action}` pattern me fit nahi baithte, (2) ek resource pe GET/POST/PUT/DELETE alag actions pe jaate hain same URL ke liye, (3) `[ApiController]` attribute routing ko mandatory bana deti hai.",
    followUp: "[ApiController] attribute aur kya-kya karta hai routing ke alawa?",
  },
  {
    id: "routing-2",
    question: "Route parameter aur query string me se kya kab use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Route parameter = resource ki identity (/employees/5). Query string = us collection ko filter/sort/paginate karna (?department=10&page=2).",
    detailedAnswer:
      "Test: value badalne se agar bilkul doosra resource milta hai to wo identity hai — route parameter. Agar same collection ka subset ya alag view milta hai to wo filter/pagination hai — query string. `GET /api/employees/5` employee 5, `GET /api/employees?department=10&active=true&page=2` employees ki filtered list. Query params optional aur combine-able hote hain, isliye unko route me daalne se URL explode ho jaata hai.",
    followUp: "Query string wale parameters action method me kaise aate hain?",
    redFlag: "Filters ko route segments bana dena: /api/employees/department/10/active/true.",
  },
  {
    id: "routing-3",
    question: "Ye code kya karega jab app start hoga?\n```csharp\n[HttpGet(\"{id}\")]\npublic ActionResult<Employee> GetById(int id) => Ok();\n\n[HttpGet(\"{name}\")]\npublic ActionResult<Employee> GetByName(string name) => Ok();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "App startup pe AmbiguousMatchException se crash — dono actions ka template GET api/employees/{something} hai, framework distinguish nahi kar sakta.",
    detailedAnswer:
      "Dono templates effectively `GET api/employees/{x}` hain — ek segment, koi constraint nahi. `GET /api/employees/5` aane pe framework ko do candidate actions milte hain aur wo decide nahi kar paata, isliye AmbiguousMatchException. Ye request time pe nahi, app build/first-request pe pata chalta hai. Fix: templates distinct karo — `[HttpGet(\"{id:int}\")]` aur `[HttpGet(\"by-name/{name}\")]` — constraint ya literal segment se.",
    followUp: "Agar dono ko `{id:int}` aur `{name:alpha}` de doon to `GET /api/employees/5` kaha jaayega?",
  },
  {
    id: "routing-4",
    question: "Route constraint jaise {id:int} kya karta hai — kya ye validation hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Constraint ek route-match filter hai. Match na ho to action select hi nahi hota — result 404, validation-style 400 nahi.",
    detailedAnswer:
      "`:int`, `:guid`, `:alpha`, `:length(10)` — ye sab batate hain ki is template ko match karne ke liye segment ka shape kya hona chahiye. `GET /api/employees/abc` `{id:int}` template ko match nahi karta, to framework aage doosre routes dekhta hai, koi na mile to 404. Business rules ('id positive ho', 'PAN valid format') ke liye alag validation layer chahiye (DataAnnotations / FluentValidation, module 5) — waha invalid input pe 400 with error detail milta hai.",
    redFlag: "\"{id:int} laga diya to negative/zero id validate ho gaya\" — nahi, -5 bhi int hai, match ho jaayega.",
  },
  {
    id: "routing-5",
    question: "[Route(\"api/[controller]\")] me [controller] token kya karta hai, aur tum ise use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Class name se 'Controller' suffix hata kar route banata hai (EmployeesController -> api/employees). Main explicit literal prefer karta hoon.",
    detailedAnswer:
      "`[controller]` ek token replacement hai — compile time pe class ka naam le kar route bana deta hai. Fayda: controller rename karo to route auto-update. Nuksan: URL grep karne pe file nahi milti, aur rename se URL silently badal jaata hai jo consumers ke liye breaking change hai. Production APIs me main `[Route(\"api/employees\")]` explicit likhta hoon — thoda zyada typing, par URL hamesha visible aur rename-safe.",
    followUp: "[action] token bhi hota hai — Web API me use karna chahiye?",
  },
  {
    id: "routing-6",
    question: "Ek action pe do [HttpGet] attributes laga sakte ho? Kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Haan — dono URLs same action pe jaayenge. Mostly ek purana URL deprecate karte waqt, warna avoid karo.",
    detailedAnswer:
      "```csharp\n[HttpGet(\"{id:int}\")]\n[HttpGet(\"details/{id:int}\")]\npublic ActionResult<Employee> GetById(int id) => Ok();\n```\nDono templates ek hi action pe map hote hain. Legit use-case: URL structure change kiya, purana consumers abhi bhi purane URL pe aa rahe hain, dono ko kuch time support karna hai. Steady state me ek resource ka ek canonical URL better hai — multiple routes se caching, logging, aur analytics me confusion hota hai.",
  },
  {
    id: "routing-7",
    question: "Digital lending API me GET /api/loans/5 aur nested GET /api/loans/5/schedule dono chahiye. Aur EMI schedule ko independently bhi query karna hai. URLs kaise design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Nested route rakho ek loan ki schedule ke liye; agar schedule item ko independently address karna hai to use apna top-level route bhi do.",
    detailedAnswer:
      "`GET /api/loans/5` — ek loan. `GET /api/loans/5/schedule` — us loan ki poori EMI schedule (child, parent ke context me). Agar ek individual installment ko independently access/update karna hai (jaise payment mark karna), to `GET /api/installments/{installmentId}` / `PUT /api/installments/{installmentId}` — top-level. Rule: list/collection parent ke neeche nest kar sakti hai, par individual child ko action karne ke liye flat route zyada clean rehta hai. 2 se zyada nesting levels avoid.",
    followUp: "Nested POST — POST /api/loans/5/schedule — idempotent hona chahiye ya nahi?",
  },
  {
    id: "routing-8",
    question: "Kya ye URLs sahi hain: POST /api/employees/create, GET /api/getAllEmployees, POST /api/employees/5/delete?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Nahi — teeno URL me verb ghusa hua hai. URL sirf noun/resource hona chahiye, verb HTTP method deta hai.",
    detailedAnswer:
      "Sahi versions: `POST /api/employees` (create), `GET /api/employees` (list), `DELETE /api/employees/5` (delete). RESTful design me method = action, URL = resource. `/create`, `/getAll`, `/delete` RPC-style hain — kaam to karenge par convention todte hain, tooling (Swagger grouping, HTTP caching, proxies) unke saath kam predictable rehti hai, aur team ke liye inconsistent surface ban jaata hai.",
    redFlag: "\"URL me action likhne se clear hota hai kya ho raha hai\" — method already clear kar deta hai.",
  },
];

export default questions;
