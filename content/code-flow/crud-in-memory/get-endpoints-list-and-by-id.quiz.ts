import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "get-endpoints-list-and-by-id-1",
    question:
      "GET /api/employees/500 aata hai aur 500 number ka koi employee nahi hai. By-id action ko kya return karna chahiye?",
    options: [
      "200 OK with body null",
      "200 OK with an empty Employee object",
      "404 Not Found",
      "204 No Content",
    ],
    correctIndex: 2,
    explanation:
      "Single resource by-id lookup me key exist na kare to 404 Not Found — HTTP-level pe hi 'aisa resource nahi' ka signal. 200 + null caller ko har jagah null check karne pe majboor karta hai aur logs me missing lookup ek success jaisa dikhta hai. 200 + empty object aur bhi bura — jhootha data. 204 ka matlab 'success, koi body nahi' hota hai, jo yahan galat message deta hai.",
    difficulty: "easy",
  },
  {
    id: "get-endpoints-list-and-by-id-2",
    question:
      "GET /api/employees?departmentId=99 pe is department me koi employee nahi. Sahi response kya hai?",
    options: [
      "404 Not Found — kyunki kuch nahi mila",
      "200 OK with an empty array []",
      "400 Bad Request — invalid department",
      "500 Internal Server Error",
    ],
    correctIndex: 1,
    explanation:
      "List/collection endpoint pe khaali result ek valid state hai — collection exist karti hai, bas is filter pe koi match nahi. 200 + [] sahi hai. 404 sirf tab jab single resource by-id/by-key exist na kare, ya route hi galat ho. departmentId=99 ek valid query hai (bas match nahi), isliye 400 nahi. Koi exception nahi to 500 nahi.",
    difficulty: "medium",
  },
  {
    id: "get-endpoints-list-and-by-id-3",
    question:
      "GetById me _employees.First(e => e.Id == id) likha hai (FirstOrDefault nahi) aur id ka koi match nahi. Kya hota hai?",
    options: [
      "employee null ho jaata hai, action NotFound() return karta hai",
      "InvalidOperationException phenkta hai, client ko 500 Internal Server Error milta hai",
      "Compile error — First ko predicate nahi de sakte",
      "Pehla employee return ho jaata hai id match kiye bina",
    ],
    correctIndex: 1,
    explanation:
      "First(predicate) match na milne pe InvalidOperationException ('Sequence contains no elements') phenkta hai — unhandled exception 500 ban jaata hai, yaani ek user-error ko server-error bana diya. FirstOrDefault us case me null deta hai jise hum is null se check karke clean 404 de sakte hain. First predicate accept karta hai (compile fine). Match ke bina wo kabhi galat element return nahi karta — wo throw karta hai.",
    difficulty: "medium",
  },
  {
    id: "get-endpoints-list-and-by-id-4",
    question:
      "GetAll ka return type ActionResult<IEnumerable<Employee>> hai. Iska sabse sahi faayda kya hai?",
    options: [
      "Ye automatically saari employees ko database se load kar leta hai",
      "Action ya to data (IEnumerable<Employee>) return kar sakta hai ya ek HTTP result jaise NotFound()/BadRequest(), aur Swagger ko success response type bhi pata chal jaata hai",
      "Ye response ko hamesha 200 status force karta hai",
      "Ye IEnumerable ko List me convert karke performance behtar karta hai",
    ],
    correctIndex: 1,
    explanation:
      "ActionResult<T> se ek hi action se T (yahan employees ki list) ya koi bhi ActionResult (Ok, NotFound, BadRequest) return ho sakta hai — dono return statements compile karte hain — aur framework/Swagger ko T se success response ka schema mil jaata hai. Ye khud DB access nahi karta, status force nahi karta, aur koi type conversion optimization nahi hai.",
    difficulty: "easy",
  },
];

export default quiz;
