import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "extract-the-service-layer-1",
    question:
      "Service layer nikaalne ke baad `EmployeesController.Create` action me ideal roop se kya hona chahiye?",
    options: [
      "Duplicate-email check, PAN regex, entity banana, aur DTO mapping",
      "Sirf `_service.Create(dto)` call karna aur result ko `CreatedAtAction` me wrap karna",
      "`static List<Employee>` par `Add` aur `_nextId++`",
      "PAN check controller me, baaki rules service me",
    ],
    correctIndex: 1,
    explanation:
      "Refactor ka poora point: controller me sirf HTTP bache. `Create` action service ko call karta hai aur return value ko `201 Created` me translate karta hai. Rules (duplicate email, PAN), entity banana, aur DTO mapping — sab `EmployeeService` me. `static List` access aur `_nextId` bhi ab service (aur agle topic me repository) ke andar. Rules ko baant dena (kuch controller, kuch service) sabse kharaab — koi ek jagah nahi rehti.",
    difficulty: "easy",
  },
  {
    id: "extract-the-service-layer-2",
    question:
      "`EmployeesController` ka constructor `IEmployeeService` leta hai. Ye instance kaun banata aur pass karta hai?",
    options: [
      "Controller khud `new EmployeeService()` karta hai constructor me",
      "ASP.NET Core ka DI container, `Program.cs` ki `AddScoped<IEmployeeService, EmployeeService>()` registration ke basis par",
      "`[ApiController]` attribute automatically",
      "Middleware pipeline har request pe reflection se",
    ],
    correctIndex: 1,
    explanation:
      "Constructor injection ka matlab class apni dependency bahar se maangti hai. Jab request pe controller banana hota hai, DI container constructor parameters dekhta hai, `IEmployeeService` ke liye `Program.cs` me registered mapping (`AddScoped<IEmployeeService, EmployeeService>()`) dhoondta hai, `EmployeeService` banata hai, aur inject karta hai. Controller khud `new` kare to DI ka point khatam. `[ApiController]` model binding/validation ke liye hai, DI ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "extract-the-service-layer-3",
    question:
      "`EmployeeService.GetById` unknown id ke liye kya return karna chahiye, aur controller usse kya banata hai?",
    options: [
      "Service `NotFound()` return kare; controller wahi aage bhej de",
      "Service `throw new Exception(\"not found\")` kare; controller `500` de",
      "Service `null` (`EmployeeDto?`) return kare; controller `return dto is null ? NotFound() : Ok(dto)`",
      "Service `new EmployeeDto()` (empty) return kare; controller `200` de",
    ],
    correctIndex: 2,
    explanation:
      "Service ko HTTP nahi pata — wo `EmployeeDto?` (nullable) lautaye. `NotFound()` ek `Microsoft.AspNetCore.Mvc` type hai; usse service me use karna boundary todta hai. Exception + `500` galat hai — 'not found' ek normal outcome hai, error nahi. Empty DTO return karna client ko jhootha `200` deta hai. Controller `null` ko `404` me aur value ko `200` me translate karta hai.",
    difficulty: "medium",
  },
  {
    id: "extract-the-service-layer-4",
    question:
      "Sab compile ho gaya, lekin pehli request pe: 'Unable to resolve service for type IEmployeeService while attempting to activate EmployeesController'. Sabse likely wajah?",
    options: [
      "`EmployeeService` ne `IEmployeeService` implement nahi kiya",
      "`Program.cs` me `builder.Services.AddScoped<IEmployeeService, EmployeeService>();` add karna bhool gaye",
      "`[ApiController]` attribute missing hai",
      "`IEmployeeService` interface `public` nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye error DI container se aata hai: controller ko `IEmployeeService` chahiye, lekin container me uski koi registration nahi. Fix: `Program.cs` me `app.Build()` se pehle `AddScoped<IEmployeeService, EmployeeService>()`. Agar `EmployeeService` ne interface implement na kiya hota to compile error aata (runtime nahi). `[ApiController]` missing hone se ye specific message nahi aata. Interface `public` na ho to alag compile-time issue hota.",
    difficulty: "medium",
  },
];

export default quiz;
