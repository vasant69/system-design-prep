import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "why-layers-controller-service-repository-1",
    question:
      "Hamare project me PAN-number format validation (regex check) kis layer me hona chahiye?",
    options: [
      "Controller me, kyunki wahin request body aati hai",
      "Service me, kyunki ye ek business rule hai",
      "Repository me, kyunki wahin data store hota hai",
      "Model class ke andar, ek method ke roop me",
    ],
    correctIndex: 1,
    explanation:
      "PAN format ek business rule hai ('valid PAN kaisa dikhta hai'), isliye wo Service me jaata hai — taaki API aur ek future import job dono same rule call karein. Controller me rakhne se rule sirf HTTP path pe chalega (background job miss karega). Repository ka kaam pure CRUD hai, rule enforce karna nahi. Model class ko 'dumb' data container rakhte hain taaki wo entity aur DTO dono ke roop me reuse ho.",
    difficulty: "easy",
  },
  {
    id: "why-layers-controller-service-repository-2",
    question:
      "Sabse bada practical reason kya hai business logic ko Controller se Service me nikalne ka?",
    options: [
      "Service classes tez chalti hain controllers se",
      "Compiler Service classes ko pehle build karta hai",
      "Logic testable ho jaata hai aur ek se zyada caller (jaise background job) use reuse kar sakte hain",
      "Controllers me `async` allowed nahi hai",
    ],
    correctIndex: 2,
    explanation:
      "Asli payoff testability + reuse hai: `new EmployeeService(fakeRepo)` bana ke rule 3 line me test ho jaata hai, aur ek nightly import job wahi `IEmployeeService` call karke same rules paata hai. Performance ka isse koi lena-dena nahi — dono in-process method calls hain. Build order ek non-issue hai. Controllers me `async` bilkul allowed hai.",
    difficulty: "easy",
  },
  {
    id: "why-layers-controller-service-repository-3",
    question:
      "Kaunsi cheez batati hai ki Service layer ne apni boundary tod di hai (leaky abstraction)?",
    options: [
      "Service ek `EmployeeDto` return kar raha hai",
      "Service ke constructor me `IEmployeeRepository` inject ho raha hai",
      "Service `NotFound()` / `IActionResult` return kar raha hai ya `HttpContext` padh raha hai",
      "Service me ek `if` condition hai jo duplicate email check karti hai",
    ],
    correctIndex: 2,
    explanation:
      "Service ko HTTP ka pata nahi hona chahiye — `NotFound()`, `IActionResult`, `HttpContext`, `Request` ka use ek clear boundary violation hai; Service ko `null`/entity/exception lautana chahiye aur Controller decide kare wo `404` hai ya `409`. DTO return karna aur `IEmployeeRepository` inject karna bilkul sahi hai. Duplicate-email `if` to Service ka asli kaam hai.",
    difficulty: "medium",
  },
  {
    id: "why-layers-controller-service-repository-4",
    question:
      "Ek 3-endpoint internal admin tool jisme koi business rule nahi hai — sirf raw CRUD. Behtar approach?",
    options: [
      "Poori Controller -> Service -> Repository layering, warna 'best practice' violate hoti hai",
      "Sirf 2 layers ya seedha Controller -> data access — full layering yahan over-engineering hai",
      "Sab kuch ek hi Program.cs Minimal API file me, koi controller bhi nahi",
      "Har endpoint ke liye ek alag microservice",
    ],
    correctIndex: 1,
    explanation:
      "Layering ek cost hai (har endpoint ke liye 3 files). Jab app chhota hai, throwaway hai, ya usme rules hi nahi, to 2 layers (ya `Controller -> DbContext`) kaafi hai — full layering navigate karna mushkil bana deti hai bina fayde ke. 'Best practice' context ke bina apply karna hi anti-pattern hai. Minimal API ya microservices-per-endpoint dono is choti si zaroorat ke liye galat extremes hain.",
    difficulty: "medium",
  },
];

export default quiz;
