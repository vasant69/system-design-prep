import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "customizing-swagger-openapi-1",
    question: "OpenAPI, Swagger aur Swashbuckle me kya farq hai?",
    options: [
      "Teeno ek hi cheez ke alag naam hain",
      "OpenAPI ek specification (standard) hai; Swagger us spec ke around bana tools ka ecosystem (Swagger UI etc.); Swashbuckle ek .NET library hai jo ASP.NET Core controllers se OpenAPI document generate karti hai",
      "OpenAPI Microsoft ka product hai, Swagger open-source, Swashbuckle paid",
      "Swashbuckle spec hai, OpenAPI library hai, Swagger UI hai",
    ],
    correctIndex: 1,
    explanation:
      "OpenAPI = specification (pehle 'Swagger Specification', 2016 me rename). Swagger = tools ecosystem (UI, Editor, Codegen). Swashbuckle = Swashbuckle.AspNetCore NuGet library jo controllers ko reflect karke swagger.json banati hai aur Swagger UI host karti hai. Teeno alag layers hain.",
    difficulty: "easy",
  },
  {
    id: "customizing-swagger-openapi-2",
    question:
      "Ek action bina `ProducesResponseType` attributes ke hai. Swagger UI response section me kya dikhega?",
    options: [
      "Har possible status code apne DTO ke saath",
      "Sirf ek generic 200 response, bina precise body schema ke — 201/400/409 jaise codes aur unke shapes document nahi honge",
      "Kuch nahi, response section khaali rahega",
      "500 Internal Server Error",
    ],
    correctIndex: 1,
    explanation:
      "ApiExplorer sirf ek default success response infer kar paata hai. Precise status codes (201 with EmployeeDto, 400 with ValidationProblemDetails, 409 with ProblemDetails) batane ke liye har realistic outcome par ek ProducesResponseType attribute chahiye — tabhi frontend/QA ko sahi contract milta hai.",
    difficulty: "medium",
  },
  {
    id: "customizing-swagger-openapi-3",
    question:
      "`IncludeXmlComments` ko galat file path diya gaya (XML file wahan nahi hai). Kya hota hai?",
    options: [
      "App start par crash ho jaata hai",
      "Swashbuckle silently comments skip kar deta hai — koi error nahi, bas endpoint/param descriptions Swagger me gayab rehti hain",
      "Swagger UI hi load nahi hota",
      "Build fail ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Galat XML path par Swashbuckle koi exception nahi phenkta — bas `///` summary/param/response descriptions apply nahi hoti. Isliye path ko `Path.Combine(AppContext.BaseDirectory, xmlFile)` se derive karte hain aur file name ko assembly name se, hardcode nahi. GenerateDocumentationFile csproj me on hona bhi zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "customizing-swagger-openapi-4",
    question: "BFSI API ke liye production me Swagger UI ka safe default kya hai?",
    options: [
      "Hamesha public rakho, developers ko convenient hota hai",
      "Prod me Swagger UI band, ya authentication / internal-network ke peeche — kyunki wo poori API ka contract (endpoints, fields, validation rules) ek attacker ke liye map bana deta hai",
      "Swagger UI rakho par swagger.json block kar do",
      "Sirf GET endpoints Swagger me dikhao",
    ],
    correctIndex: 1,
    explanation:
      "Swagger poori API surface expose karta hai. BFSI default: prod me UseSwagger/UseSwaggerUI sirf non-Production me, ya MapSwagger().RequireAuthorization() / reverse-proxy auth ke peeche. Ye OWASP API9 (improper inventory management) se seedha juda hai. swagger.json CI me generate karke contract tests/codegen ke liye use kar sakte ho bina UI serve kiye.",
    difficulty: "easy",
  },
];

export default quiz;
