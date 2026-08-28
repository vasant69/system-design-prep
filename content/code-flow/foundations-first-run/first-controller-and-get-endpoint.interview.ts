import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fcge-1",
    question: "ControllerBase aur Controller me kya farak hai? Web API ke liye kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "ControllerBase = API helpers (Ok, NotFound, CreatedAtAction, ModelState, User), koi View support nahi. Controller = ControllerBase + View(), ViewBag, TempData. JSON API ke liye ControllerBase.",
    detailedAnswer:
      "ControllerBase me sab kuch hai jo ek JSON API ko chahiye — action result helpers, model binding, ModelState, User principal. Controller isse inherit karke Razor/MVC ke liye View(), PartialView(), ViewBag, ViewData, TempData add karta hai. Agar tum HTML pages render nahi kar rahe, Controller use karna sirf ek bhaari base class dhone jaisa hai jiska aadha kabhi nahi chalega. Convention: API controllers hamesha ControllerBase se aur uspe [ApiController] attribute.",
    followUp: "[ApiController] attribute kya extra behaviours on karta hai?",
    redFlag: "'Dono same hain, bas naam alag hai' — Controller me poori View-rendering machinery extra hoti hai.",
  },
  {
    id: "fcge-2",
    question: "[ApiController] attribute lagane se kya-kya automatically milta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Automatic 400 on invalid model (action se pehle), binding-source inference (complex type = [FromBody], simple = route/query), aur attribute routing mandatory ho jaati hai.",
    detailedAnswer:
      "Teen bade behaviours: (1) Automatic model validation — invalid body par framework action chalne se pehle 400 + problem-details JSON deta hai, tumhe ModelState.IsValid manually check nahi karna. (2) Binding source inference — Employee jaisa complex type by default [FromBody], int id jaisa simple type route ya query se; explicit attributes optional ho jaate hain. (3) Attribute routing required — convention-based {controller}/{action} routing off, har action ko [HttpGet]/[HttpPost]/[Route] chahiye, jo API ke liye achha hai kyunki routes explicit rehte hain.",
    followUp: "Automatic 400 ka response format kaunsa standard follow karta hai? (RFC 7807 problem-details)",
  },
  {
    id: "fcge-3",
    question: "ActionResult<T> aur IActionResult me practical farak kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "ActionResult<T> se tum T bhi return kar sakte ho aur HTTP result bhi, aur Swagger success body ka schema T se auto-infer kar leta hai. IActionResult sirf 'koi HTTP result' hai — success type Swagger ko [ProducesResponseType] se batana padta hai.",
    detailedAnswer:
      "IActionResult ke saath return Ok(list) aur return NotFound() dono chalte hain, par compiler/Swagger ko nahi pata 200 ki body ka type kya hai — isliye [ProducesResponseType(typeof(List<Employee>), 200)] manually likhna padta hai. ActionResult<T> me return Ok(list), return list (direct T), aur return NotFound() teeno legal hain, aur framework T se 200 response schema khud infer karta hai. Naye code me ActionResult<T> default. IActionResult tab bhi theek hai jab action ke multiple success shapes hon.",
    followUp: "Agar ek action kabhi Employee kabhi ProblemDetails return karti ho to return type kya rakhoge?",
  },
  {
    id: "fcge-4",
    question: "Controller me demo data ki list ko static kyun banaya, instance field kyun nahi?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "ASP.NET Core har request pe ek naya controller instance banata hai. Instance field wali list har request pe seed pe reset ho jaati; static list process me ek hi baar banti hai aur sab requests share karti hain.",
    detailedAnswer:
      "Controller ka lifetime per-request hota hai — DI container har incoming request ke liye naya EmployeesController banata hai aur request ke baad dispose kar deta hai. Agar _employees ek instance field ho to har request ki apni fresh list hogi seed records ke saath, aur pichhli request ka POST/PUT/DELETE agli request me gaayab. static field type ke saath bandha hota hai instance ke saath nahi, isliye wo process-wide ek hi rehta hai. Ye sirf demo hack hai — module 4 me DbContext aane par ye static list hat jaati hai.",
    followUp: "static mutable list ka concurrency problem kya hai agar do requests ek saath Add karein?",
    redFlag: "'Controller singleton hota hai to farak nahi padta' — controller by default per-request (transient/scoped-jaisa) hota hai, singleton nahi.",
  },
  {
    id: "fcge-5",
    question: "Is controller me ek latent bug hai. Batao kya, aur GET /api/employees abhi kya return karega?\n```csharp\n[ApiController]\npublic class EmployeesController : ControllerBase\n{\n    private readonly List<Employee> _employees = Seed();\n\n    [HttpGet]\n    public ActionResult<IEnumerable<Employee>> GetAll() => Ok(_employees);\n}\n```\n(`Seed()` seed ke 3 records deta hai; controller me aage POST/PUT/DELETE actions bhi aayenge.)",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Compile aur run dono theek. GET har baar seed list (jaise 3 records) return karega. Bug tab dikhega jab POST add hoga — instance field hone se har request fresh list, POST kiya record agle GET me gaayab.",
    detailedAnswer:
      "Is snippet me sirf GET hai to sab normal lagta hai — har request naya controller, _employees dobara Seed() se bhar jaati hai, GetAll 3 records deta hai. Problem latent hai: _employees static nahi hai. Jaise hi ek POST action _employees.Add(...) karega, wo change us ek request ke instance tak simit rahega; agli request ka naya instance phir se Seed() ke 3 records dikhayega. Fix: private static readonly List<Employee> _employees = Seed();",
    followUp: "Agar Seed() har call pe DB hit karta to instance field hone ka ek aur nuksaan kya hota? (har request pe redundant load)",
  },
  {
    id: "fcge-6",
    question: "Route me `[controller]` token use karna chahiye ya literal string `api/employees`? Trade-off kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "[controller] DRY hai — class rename pe route auto-update. Literal safe hai — URL ek public contract hai, use accidental class rename se nahi bandhna chahiye. BFSI/public APIs me aksar literal.",
    detailedAnswer:
      "[controller] token EmployeesController ko employees me badal deta hai, to route template `api/[controller]` ban jaata hai `api/employees`. Fayda: class rename karo to route apne aap chalta hai. Nuksaan: agar koi refactor me EmployeesController ko StaffController kar de, route chup-chaap `api/staff` ban jaayega aur har external client 404 khaane lagega — koi compile error nahi. Literal `api/employees` is failure mode ko rok deta hai. Course readability ke liye token use karta hai par production public API me literal recommend hota hai.",
    followUp: "API versioning aane par route template kaisa dikhega? (jaise api/v1/employees ya [Route with version segment])",
    redFlag: "'Koi farak nahi, dono same URL dete hain' — aaj same, par rename-safety aur contract-stability me farak hai.",
  },
  {
    id: "fcge-7",
    question: "Sample WeatherForecast files ka kya karna chahiye aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Delete kar do — Controllers/WeatherForecastController.cs aur WeatherForecast.cs. Ye sirf template demo hai, hamare Employee domain se sambandhit nahi.",
    detailedAnswer:
      "dotnet new webapi ek working example ke liye WeatherForecast controller + model deta hai. Ye hamare project ka hissa nahi — chhodne se naye contributors confuse hote hain (kya WeatherForecast ek real feature hai?), Swagger me ek fake endpoint dikhta hai, aur code search me noise aata hai. Pehla real controller likhne se pehle dono files hata do; koi aur code inhe reference nahi karta to build clean rehta hai.",
    followUp: "Agar delete ke baad build toot jaaye to kya check karoge? (Program.cs ya kisi test me stray reference)",
  },
];

export default questions;
