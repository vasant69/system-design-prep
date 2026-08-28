import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "routing-in-web-api-1",
    question:
      "[ApiController] lagi hui controller me conventional routing (central {controller}/{action} pattern) kaam karti hai kya?",
    options: [
      "Haan, dono routing styles saath chalti hain",
      "Nahi — [ApiController] ke saath attribute routing mandatory hai, har action pe [HttpX] template chahiye",
      "Haan, lekin sirf GET requests ke liye",
      "Nahi, kyunki conventional routing .NET 8 me hata di gayi hai",
    ],
    correctIndex: 1,
    explanation:
      "[ApiController] attribute routing ko mandatory bana deti hai — har reachable action pe [HttpGet]/[HttpPost] jaisa route attribute hona chahiye. Conventional routing MVC views/pages ke liye abhi bhi exist karti hai (hataya nahi gaya), bas [ApiController] controllers me use nahi hoti. 'Sirf GET' waali baat galat hai.",
    difficulty: "easy",
  },
  {
    id: "routing-in-web-api-2",
    question:
      "GET /api/employees/5/documents jaisa nested route kab sahi hai?",
    options: [
      "Hamesha — jitni deep nesting utna RESTful",
      "Jab child resource (documents) sirf parent (employee) ke context me hi meaningful ho; independent resource ko top-level route do",
      "Kabhi nahi — nesting anti-pattern hai",
      "Sirf tab jab child resource ki table na ho",
    ],
    correctIndex: 1,
    explanation:
      "Nesting tab theek hai jab child parent ke bina bemaani ho — ek employee document kisi employee se juda hi hota hai. Department jaisa independent resource /api/departments pe rehna chahiye, /api/employees/5/departments pe nahi. 'Jitna deep utna acha' galat hai — 2 level se zyada nesting maintain karna painful hai. Nesting per se anti-pattern nahi.",
    difficulty: "medium",
  },
  {
    id: "routing-in-web-api-3",
    question:
      "GET /api/employees/abc request aati hai aur action [HttpGet(\"{id:int}\")] hai. Kya hoga?",
    options: [
      "400 Bad Request — kyunki abc int nahi hai",
      "500 Internal Server Error — parsing exception",
      "404 Not Found — route constraint match nahi hua, ye action select hi nahi hota",
      "Action chalta hai id = 0 ke saath",
    ],
    correctIndex: 2,
    explanation:
      "Route constraint (:int) ek match filter hai, validation nahi. 'abc' int nahi hai to ye template match hi nahi karta, framework doosre templates dekhta hai, koi na mile to 404. 400 tab aata jab value bind hoti par model validation fail hoti. 500 nahi kyunki koi exception nahi. id = 0 waala action tabhi chalta jab binding hoti — yahan hoti hi nahi.",
    difficulty: "medium",
  },
  {
    id: "routing-in-web-api-4",
    question:
      "Kaunsa URL design RESTful convention follow karta hai employee create ke liye?",
    options: [
      "GET /api/employees/create?name=Aarti",
      "POST /api/createEmployee",
      "POST /api/employees",
      "POST /api/employees/new",
    ],
    correctIndex: 2,
    explanation:
      "RESTful design me URL sirf resource (noun) hota hai aur HTTP method verb — create ke liye POST /api/employees. 'create', 'new', 'createEmployee' sab URL me verb daal rahe hain jo galat hai. GET se create karna to double galat — GET safe/idempotent hona chahiye, data change nahi karna chahiye.",
    difficulty: "easy",
  },
];

export default quiz;
