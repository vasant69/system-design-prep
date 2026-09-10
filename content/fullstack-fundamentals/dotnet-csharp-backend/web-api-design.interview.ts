import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "wad-1",
    question: "Entity ko directly Web API se expose karna kyun galat hai? DTO kya solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Entity expose karne se: over-posting (client `IsAdmin`/`Balance` set kar de POST me), circular JSON serialization (navigation properties), aur DB schema API ka contract ban jaata hai — column rename = breaking API change. DTO ek stable, minimal, intentional boundary deta hai.",
    detailedAnswer:
      "Read DTO sirf wahi fields expose karta hai jo client ko chahiye; write DTO sirf wahi accept karta hai jo client ko set karne diya jaaye. Mapping (manual ya AutoMapper) beech me. Bonus: DTO par validation attributes, versioning per-DTO, aur aggregated/flattened shapes (`CategoryName` instead of full `Category`).",
    followUp: "Read aur write ke liye ek hi DTO reuse karne me kya problem hai?",
  },
  {
    id: "wad-2",
    question: "Middleware pipeline order kyun matter karta hai? Ek galat order aur uska result do.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Har middleware `next` se pehle aur baad me code chala sakta hai, ek nested pipeline banake. `UseAuthorization` `UseAuthentication` ke pehle rakho aur `User` populate hone se pehle authorization chalta hai — endpoints anonymous jaisa behave karte hain ya sab 401. `UseCors` galat jagah = missing CORS headers.",
    detailedAnswer:
      "Typical sahi order: exception handler -> HSTS/HTTPS redirect -> static files -> routing -> CORS -> authentication -> authorization -> endpoints. Exception handler jaldi taaki wo neeche sab kuch wrap kare. `next` call karna bhool jaao to pipeline short-circuit ho jaati hai aur request hang/empty response.",
    redFlag: "Order ko random/cosmetic samajhna.",
  },
  {
    id: "wad-3",
    question: "REST me kaunse status codes: successful POST-create, successful DELETE, GET on missing id, validation failure?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "POST-create: 201 Created + `Location` header (ya body me resource). DELETE success: 204 No Content. GET missing: 404 Not Found. Validation failure: 400 Bad Request (ASP.NET Core ProblemDetails). Server exception: 500.",
    detailedAnswer:
      "`[ApiController]` invalid model par automatic 400 with a problem-details body deta hai, isliye manual `if (!ModelState.IsValid)` ki zaroorat nahi. `CreatedAtAction(nameof(Get), new { id }, dto)` 201 + Location dono set karta hai. Idempotent PUT update par 200 (with body) ya 204 dono acceptable hain — consistent raho.",
  },
];

export default questions;
