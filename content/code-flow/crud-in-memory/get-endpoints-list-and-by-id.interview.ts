import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "get-read-1",
    question: "By-id endpoint pe record na mile to kya return karoge — 404 ya 200 with null? Kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "404 Not Found. 200 + null client ko har jagah null check pe majboor karta hai aur missing lookup logs me success jaisa dikhta hai.",
    detailedAnswer:
      "Single resource by-id lookup me key exist na kare to 404 sahi hai — HTTP status hi bata deta hai 'aisa resource nahi'. Client `response.ok` / status pe branch kar leta hai, monitoring me missing records alag category me aate hain, aur response body me `null` check har caller me duplicate nahi hota. 200 + null 'sab theek hai' ka jhootha signal deta hai. Note: list endpoint pe khaali result 200 + `[]` hota hai, 404 nahi — wahan collection mili, bas khaali hai.",
    followUp: "List endpoint pe filter ka result khaali ho to? (200 + [], 404 nahi)",
    redFlag: "\"404 to error hai, main to bas null bhej dunga\" — 404 client error class hai, exception nahi; missing resource ke liye yahi standard hai.",
  },
  {
    id: "get-read-2",
    question: "FirstOrDefault aur First me kya farq hai, aur lookup me kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "FirstOrDefault: match na mile to default (reference type ke liye null). First: match na mile to InvalidOperationException. Lookup me hamesha FirstOrDefault.",
    detailedAnswer:
      "By-id lookup me match miss hona ek **normal, expected** case hai (galat id, purana bookmark). FirstOrDefault us case me null deta hai jise `is null` se check karke clean 404 de sakte hain. First us case me exception phenkta hai jo unhandled 500 ban jaata hai — yaani user-error ko server-error bana diya. Single() to ek se zyada match pe bhi throw karta hai. Rule: 'zero results legal hai' -> FirstOrDefault; 'zero results ek bug hai' -> First.",
    followUp: "SingleOrDefault kab use karoge FirstOrDefault ke bajaye?",
  },
  {
    id: "get-read-3",
    question: "Ye action kya karega jab id ka koi match nahi?\n```csharp\n[HttpGet(\"{id:int}\")]\npublic ActionResult<Employee> GetById(int id)\n{\n    var e = _employees.First(x => x.Id == id);\n    return Ok(e);\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "First(...) match na milne pe InvalidOperationException phenkta hai -> unhandled -> client ko 500 Internal Server Error.",
    detailedAnswer:
      "`First` predicate ke saath match na mile to 'Sequence contains no elements' InvalidOperationException. Yeh line `Ok(e)` tak pahunchti hi nahi. Exception middleware handle nahi karta (abhi custom handler nahi) to response 500 ban jaata hai, stack trace logs me, on-call ko alert. Sahi code: `var e = _employees.FirstOrDefault(x => x.Id == id); if (e is null) return NotFound(); return Ok(e);` — miss pe clean 404.",
    followUp: "Is 500 ko 404 me kaise badloge bina har action me try/catch likhe? (exception handling middleware, baad ka module)",
    redFlag: "\"200 aayega null body ke saath\" — nahi, First throw karta hai, FirstOrDefault null deta.",
  },
  {
    id: "get-read-4",
    question: "GET request ke do properties kaunse hain jo isse POST se alag karti hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "GET safe hai (server pe koi state change nahi) aur idempotent hai (N calls, same result). POST na safe hai na guaranteed idempotent.",
    detailedAnswer:
      "Safe: GET sirf data padhta hai, kuch banata/badalta/deleta nahi — isliye browsers, proxies, crawlers ise freely call kar sakte hain. Idempotent: ek hi GET 1 baar ya 100 baar karo, server ka observable state same rehta hai. Isi wajah se GET ko cache kiya ja sakta hai aur retry safe hai. POST resource banata hai (state change) aur do baar bhejne se do records ban sakte hain — isliye 'create' kabhi GET nahi hota.",
    followUp: "In dono me se kaunsi property PUT aur DELETE bhi rakhte hain?",
  },
  {
    id: "get-read-5",
    question: "activeOnly jaisa filter route segment me daaloge ya query string me? Kyun?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Query string: GET /api/employees?activeOnly=true. Filter/sort/paginate hamesha query string; route sirf resource identity ke liye.",
    detailedAnswer:
      "Route parameter resource ki pehchaan hai (`/employees/5`). Filters optional aur combine-able hote hain (`?activeOnly=true&departmentId=10&page=2`) — inhe route segment banao to har combination ka alag template chahiye aur URL explode ho jaata hai. Action me `[FromQuery] bool activeOnly = false` — default value se parameter optional ban jaata hai, bina query ke bhi endpoint chalta hai.",
    followUp: "Agar activeOnly required banana ho (default nahi) to kaise?",
    redFlag: "/api/employees/active/true jaisa route — filter ko identity bana diya.",
  },
  {
    id: "get-read-6",
    question: "GetAll ka return type ActionResult<IEnumerable<Employee>> kyun, sirf IEnumerable<Employee> kyun nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "ActionResult<T> se same action se data (T) ya HTTP result (BadRequest/NotFound) dono return kar sakte ho, aur Swagger ko success schema T se mil jaata hai.",
    detailedAnswer:
      "Agar return type sirf `IEnumerable<Employee>` ho, to `return BadRequest()` compile nahi karega — tumhe `IActionResult` pe jaana padega jisme success response ka type Swagger ko explicitly `[ProducesResponseType]` se batana padta hai. `ActionResult<T>` best of both: `return Ok(list)`, `return list`, aur `return NotFound()` teeno legal, aur framework `T` se 200 response ka schema infer kar leta hai. Read endpoints me abhi shayad sirf 200 ho, par pattern consistent rakhna better hai.",
    followUp: "IActionResult aur ActionResult<T> me practical farq kya hai?",
  },
  {
    id: "get-read-7",
    question: "employee == null ke bajaye employee is null likhne ka kya faayda hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "is null hamesha genuine reference/null check hai — koi custom == operator overload ise badal nahi sakta.",
    detailedAnswer:
      "`==` ek type pe overload ho sakta hai (records default me value equality dete hain, kuch structs custom `==` likhte hain). Us case me `x == null` unexpected code chala sakta hai ya compile behaviour badal sakta hai. `is null` pattern language-level null check hai, overload-proof, aur padhne me saaf ('employee is null'). Habit: null checks ke liye hamesha `is null` / `is not null`.",
    followUp: "is not null aur !(x is null) me koi farq? (functionally same, is not null zyada readable)",
  },
];

export default questions;
