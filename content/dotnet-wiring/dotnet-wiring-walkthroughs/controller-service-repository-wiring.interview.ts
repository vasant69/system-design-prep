import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "csr-1",
    question: "Layered Web API me har layer (Controller / Service / Repository) ki zimmedari kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Controller: sirf HTTP — request bind karo, service call karo, status code ke saath result return karo. Service: business logic, validation, orchestration, entity-to-DTO mapping. Repository: sirf data access — EF Core / SQL yahin, baaki layers `DbContext` ko nahi jaante.",
    detailedAnswer:
      "Faayda: har layer alag test hoti hai (service ko fake repo ke saath, controller ko fake service ke saath), aur EF Core ek jagah isolated rehta hai. Over-engineering ka risk: chhoti CRUD app me repository often bas `DbContext` ka thin wrapper hota hai — kuch teams EF Core ko hi repository maankar service se directly use karti hain.",
    followUp: "Repository pattern kab genuinely value deta hai aur kab sirf boilerplate hai?",
  },
  {
    id: "csr-2",
    question: "`_db.Products.Where(p => p.IsActive)` likhne se SQL chal jaati hai? Kab chalti hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Wo ek `IQueryable` build karta hai — deferred. SQL tab translate aur execute hota hai jab tum enumerate karo: `ToListAsync()`, `FirstOrDefaultAsync()`, `CountAsync()`, ya `foreach`. Tab tak `Where`/`OrderBy`/`Select` sirf expression tree banate rehte hain.",
    detailedAnswer:
      "Isiliye `ToList()` ko query ke sabse aakhir me call karo, saare filters ke baad — beech me `ToList()` poora table memory me le aata hai aur baaki filter client par chalega. Jo method EF SQL me translate na kar sake (custom C#) use `Where` me daalna newer EF me exception deta hai.",
    redFlag: "`db.Orders.ToList().Where(o => o.Total > 1000)` likhna aur performance ki shikayat karna.",
  },
  {
    id: "csr-3",
    question: "Entity ke bajaye DTO return karne ke kya faayde hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Over-posting rokta hai (client POST me `IsAdmin`/`IsActive` set nahi kar sakta), circular-reference JSON serialization se bachata hai (navigation properties), aur API contract ko DB schema se decouple karta hai — column rename API break nahi karta. DTO sirf zaroori fields expose/accept karta hai.",
    detailedAnswer:
      "Alag read DTO aur write DTO best practice hai. DTO par validation attributes, per-DTO versioning, aur flattened/aggregated shapes (`CategoryName` instead of full `Category` object) bhi milte hain. Mapping manual ho ya AutoMapper — chhote projects me manual saaf aur debuggable.",
  },
];

export default questions;
