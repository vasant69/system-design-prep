import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "interfaces-and-why-they-exist-1",
    question:
      "`EmployeesController` ke constructor me kaunsa type maangna chahiye, aur kyun?",
    options: [
      "`EmployeeService` (concrete), kyunki wahi real code chalata hai",
      "`IEmployeeService` (interface), taaki implementation swappable aur mockable rahe",
      "`object`, aur runtime pe cast kar lo",
      "Kuch bhi nahi — controller ko `new EmployeeService()` khud karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Interface maangne se controller implementation se decouple ho jaata hai — test me fake, production me real ya cached, sab chalega bina controller badle. Concrete class maangoge to har unit test me poora real service + repository (+ SQL) chahiye. `object` + cast type-safety todta hai. Controller ko khud `new` karna DI ka poora point kill kar deta hai aur dependency hard-code kar deta hai.",
    difficulty: "easy",
  },
  {
    id: "interfaces-and-why-they-exist-2",
    question:
      "Interface par depend karne se unit testing kaise aasan hoti hai?",
    options: [
      "Interfaces automatically test data generate karti hain",
      "Interface wali classes ko compiler test mode me daal deta hai",
      "Tum ek chhota fake/mock implementation bana ke inject kar sakte ho — real database/HTTP ki zaroorat nahi",
      "Interface methods hamesha `virtual` hote hain isliye tez chalte hain",
    ],
    correctIndex: 2,
    explanation:
      "`EmployeeService` ko test karne ke liye ek fake `IEmployeeRepository` (haath se ya Moq se) inject karo jo predictable data lauta de — `new EmployeeService(fakeRepo)` aur method call. Concrete dependency ke saath tumhe real repository aur module 4 ke baad real SQL Server chahiye hota. Baaki options galat hain — interfaces test data generate nahi karti, koi 'test mode' nahi hota, aur performance ka isse koi lena-dena nahi.",
    difficulty: "easy",
  },
  {
    id: "interfaces-and-why-they-exist-3",
    question:
      "`Program.cs` me `builder.Services.AddScoped<IEmployeeService, EmployeeService>();` hai, lekin controller ka constructor `EmployeesController(EmployeeService service)` maangta hai. App start pe kya hoga?",
    options: [
      "Sab theek chalega — DI concrete class bhi resolve kar leta hai",
      "Runtime exception: 'Unable to resolve service for type EmployeeService' jab controller banega",
      "Compile error build ke time",
      "Controller ko `null` inject hoga",
    ],
    correctIndex: 1,
    explanation:
      "Tumne container me sirf `IEmployeeService -> EmployeeService` mapping register kiya hai, `EmployeeService` khud registered nahi hai. Jab request aati hai aur controller banane ke liye `EmployeeService` maanga jaata hai, container ke paas uske liye koi registration nahi — runtime `InvalidOperationException`. Ye compile error nahi hai (type exist karta hai). Fix: constructor me `IEmployeeService` maango, wahi jo register kiya hai.",
    difficulty: "medium",
  },
  {
    id: "interfaces-and-why-they-exist-4",
    question:
      "In me se kis cheez ke liye interface banana usually pure ceremony (bekaar) hai?",
    options: [
      "`IEmployeeRepository` — data access ke liye",
      "`IPanVerificationClient` — external API call ke liye",
      "`EmployeeDto` — ek plain data-carrier object jisme koi behaviour nahi",
      "`IEmployeeService` — business rules ke liye",
    ],
    correctIndex: 2,
    explanation:
      "Interface un cheezon ke liye hai jo inject/swap/mock hoti hain — Services, Repositories, external clients. `EmployeeDto` ek behaviour-less data carrier hai; use kabhi fake karne ki zaroorat nahi padti, isliye `IEmployeeDto` sirf noise hai. Repository, external client, aur service — teenon legitimately mock/swap hote hain, unke interfaces valid hain.",
    difficulty: "medium",
  },
];

export default quiz;
