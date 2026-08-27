import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "action-results-and-status-codes-1",
    question: "ActionResult<T> ka IActionResult ke muqable primary advantage kya hai?",
    options: [
      "ActionResult<T> sirf synchronous actions me kaam karta hai",
      "Method signature me hi success payload type declare ho jaata hai, jisse Swagger/OpenAPI documentation better generate hoti hai",
      "ActionResult<T> automatically caching enable kar deta hai",
      "IActionResult .NET 8 me deprecated ho chuka hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — ActionResult<T> method signature me hi success payload ka type declare kar deta hai (jaise ActionResult<Order>), jisse Swagger/OpenAPI tooling bina extra [ProducesResponseType] attributes ke better documentation generate kar sakta hai, aur implicit conversions se NotFound()/BadRequest() bhi seedha return ho sakte hain. Options 1, 3, aur 4 factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "action-results-and-status-codes-2",
    question: "Ek POST action naya resource create karta hai. REST semantics ke hisaab se sabse precise response kaunsa hai?",
    options: [
      "Ok(resource) -- 200 status code",
      "CreatedAtAction(...) -- 201 status code with a Location header pointing at the new resource",
      "NoContent() -- 204 status code",
      "Accepted() -- 202 status code",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — POST se successfully naya resource create hone pe REST convention 201 Created expect karta hai, saath me Location header jo naye resource ka URL batata hai; CreatedAtAction ye dono automatically handle karta hai. Option 1 generic hai aur creation-specific information (Location) miss karta hai. Option 3 no-body response hai jo creation ke liye galat hai kyunki created resource return karna useful hota hai. Option 4 async processing ke liye hai, synchronous creation ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "action-results-and-status-codes-3",
    question: "ProblemDetails (RFC 7807) standard use karne ka primary fayda kya hai?",
    options: [
      "Ye API ko faster banata hai response serialization ke through",
      "Error responses ka ek consistent, machine-readable JSON shape milta hai jo consumers predictably parse kar sakte hain across saari APIs",
      "Ye automatically database transactions rollback kar deta hai",
      "Ye sirf authentication errors ke liye specific hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — ProblemDetails ek standardized error response shape define karta hai (RFC 7807) jisse consumers ko har endpoint ke liye alag parsing logic nahi likhni padti; [ApiController]'s automatic validation-error response bhi isi shape (ValidationProblemDetails) ka use karta hai. Options 1, 3, aur 4 iske actual purpose se related nahi hain.",
    difficulty: "easy",
  },
  {
    id: "action-results-and-status-codes-4",
    question: "Kab raw type (jaise `public Order GetById(int id)`) return karna appropriate hota hai ek Web API action se?",
    options: [
      "Hamesha, ye sabse simple aur recommended approach hai",
      "Jab action genuinely hamesha same response shape return karta hai, kabhi alternate outcome (not found, invalid) nahi de sakta",
      "Sirf GET requests ke liye, kabhi POST ke liye nahi",
      "Jab controller [ApiController] attribute use nahi kar raha ho",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — raw type sirf tab appropriate hai jab action ka outcome hamesha ek hi shape ka ho, koi alternate response (404, 400) ki zaroorat na ho; real-world APIs me ye rarely sufficient hota hai kyunki 'not found' jaisa case almost hamesha ek normal outcome hota hai jo exception ke through handle karna anti-pattern hai. Options 1, 3, aur 4 incorrect generalizations hain.",
    difficulty: "medium",
  },
];

export default quiz;
