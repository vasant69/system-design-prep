import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "swagger-and-openapi-1",
    question: "Swagger aur OpenAPI me technically kya difference hai?",
    options: [
      "Dono bilkul same cheez hain, koi difference nahi",
      "OpenAPI specification format ka naam hai, Swagger us spec ke around bane tooling ecosystem (Swagger UI, Swashbuckle) ka naam hai",
      "Swagger sirf .NET ke liye hai, OpenAPI sirf Java ke liye",
      "OpenAPI sirf REST APIs ke liye hai, Swagger GraphQL ke liye",
    ],
    correctIndex: 1,
    explanation: "OpenAPI Specification (pehle Swagger Specification kehlaata tha) machine-readable contract format hai. Swagger ab us spec ko implement karne wale tools (Swagger UI, Swashbuckle) ke ecosystem ka naam reh gaya hai. Dono language-agnostic hain, kisi specific stack tak limited nahi.",
    difficulty: "easy",
  },
  {
    id: "swagger-and-openapi-2",
    question: "XML doc comments (///) Swagger UI me kya value add karte hain jo reflection akele nahi de sakta?",
    options: [
      "Wo endpoints ko fast banate hain",
      "Reflection sirf type/shape batata hai; XML comments field/endpoint ka actual meaning aur intent describe karte hain",
      "XML comments bina inke Swagger UI bilkul kaam nahi karega",
      "Wo automatically authentication add kar dete hain",
    ],
    correctIndex: 1,
    explanation: "Reflection se Swashbuckle ko sirf types, required/optional status, aur route structure pata chalta hai. XML doc comments un fields/endpoints ka human-readable meaning add karte hain (jaise ek field kya represent karta hai). Bina XML comments ke Swagger UI kaam to karega but descriptions blank rahengi.",
    difficulty: "medium",
  },
  {
    id: "swagger-and-openapi-3",
    question: "Production me Swagger UI ko bina restriction ke public open chhodne ka kya risk hai?",
    options: [
      "Koi risk nahi hai, ye sirf documentation hai",
      "API ka poora surface area (routes, DTO shapes, naming conventions) attacker ko reconnaissance ke liye free me mil jaata hai",
      "Sirf performance thodi slow ho jaati hai",
      "Swagger UI khud automatically sab endpoints ko delete kar deta hai",
    ],
    correctIndex: 1,
    explanation: "Publicly accessible Swagger UI attacker ko poore API ka structure — routes, expected request/response shapes, kabhi-kabhi internal naming patterns — bina kisi effort ke de deta hai, jo reconnaissance ke liye valuable hai. Isliye production me kam se kam dev-only enable karna ya authentication ke peeche restrict karna best practice hai.",
    difficulty: "medium",
  },
  {
    id: "swagger-and-openapi-4",
    question: "Generated OpenAPI spec (swagger.json) sirf human-readable documentation ke alawa aur kya use hoti hai?",
    options: [
      "Kuch nahi, ye sirf Swagger UI dikhaane ke liye hai",
      "Client SDK generators (NSwag, openapi-generator, Kiota) us spec se automatically strongly-typed client code multiple languages me generate kar sakte hain",
      "Spec sirf unit tests generate karne ke liye use hoti hai",
      "Spec database migrations automatically generate karti hai",
    ],
    correctIndex: 1,
    explanation: "OpenAPI spec ek machine-consumable contract hai — client generation tools isse read karke kisi bhi target language me strongly-typed client SDK automatically bana sakte hain, jisse manual API client maintenance ki zaroorat khatam ho jaati hai jab contract change ho. Unit tests ya DB migrations se iska direct relation nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
