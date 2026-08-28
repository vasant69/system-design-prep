import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "post-sc-1",
    question: "Create endpoint ka response kya hona chahiye — status code aur headers?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "201 Created, plus ek Location header jo naye record ke canonical URL pe point karta hai, aur usually body me naya record (server-assigned id ke saath).",
    detailedAnswer:
      "200 OK generic success hai — 'kuch theek hua'. 201 Created specific hai — 'ek naya resource bana'. 201 ke saath Location header aata hai (jaise Location: /api/employees/4) jisse client ko naye record ka URL guess nahi karna padta — wo seedha us URL pe GET ya redirect kar sakta hai. Body me naya record bhejna client ko turant server-assigned id de deta hai, dobara GET nahi karna padta. ASP.NET Core me CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee) teeno — status, header, body — ek saath deta hai.",
    followUp: "CreatedAtAction aur CreatedAtRoute me kya farak hai?",
    redFlag: "'201 aur 200 me koi practical farak nahi' — Location header aur semantic clarity dono 201 ke saath aate hain.",
  },
  {
    id: "post-sc-2",
    question: "CreatedAtAction me action ka naam nameof(GetById) se do, plain string se nahi — kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "nameof refactor-safe hai — method rename karo to compiler yahin error dega. Plain string silently purana naam rakhta hai, aur CreatedAtAction runtime pe route match nahi kar paata.",
    detailedAnswer:
      "CreatedAtAction diye gaye action naam ka route runtime pe dhoondhta hai. Agar string galat ho (typo, ya baad me method rename ho gaya), to koi match nahi milta — InvalidOperationException 'No route matches the supplied values', POST 500 deta hai. Aur khatarnaak baat: record pehle hi list/DB me add ho chuka hota hai, to client ko lagta hai create fail hua aur wo retry karta hai — duplicate. nameof(GetById) compile-time pe string ban jaata hai; method rename pe compiler har jagah pakadta hai.",
    followUp: "Agar CreatedAtAction 500 de par record add ho chuka ho, to ye kis cheez ka lack dikhata hai? (create + response ka ek atomic unit na hona)",
    redFlag: "'String aur nameof bilkul same hain' — nameof rename pe compile-time safety deta hai, string nahi.",
  },
  {
    id: "post-sc-3",
    question: "Naye employee ka Id kaise assign karoge is in-memory list me? _employees.Count + 1 chalega?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Count + 1 nahi. _employees.Max(e => e.Id) + 1, aur khaali list par 1. Count + 1 beech ka record delete hone par existing id se clash kar sakta hai.",
    detailedAnswer:
      "Maan lo list me ids 1, 2, 3 hain (Count 3). Id 2 delete ho gaya — ab Count 2 hai, ids 1 aur 3. Count + 1 = 3, jo already exist karta hai — collision. Max(e => e.Id) + 1 = 4, safe. Khaali list par Max exception deta hai isliye us case me 1 hardcode. Ye sirf demo hack hai — module 4 me database identity column ye kaam karega aur ye logic hat jaayega.",
    followUp: "Do requests ek saath POST karein aur dono Max + 1 padhein to kya ho sakta hai? (same id, race condition — DB identity ise solve karta hai)",
  },
  {
    id: "post-sc-4",
    question: "[ApiController] laga hai. Invalid JSON body ya missing required field aane par kya hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Framework action chalne se pehle 400 Bad Request + ek standard problem-details JSON return kar deta hai. Action ke andar ModelState.IsValid check karne ki zaroorat nahi.",
    detailedAnswer:
      "[ApiController] automatic model validation on karta hai. Model binding ke baad agar ModelState invalid hai (JSON parse fail, required field missing, salary: 'abc' jaisa type mismatch), to action invoke hi nahi hoti — seedha 400 + RFC 7807 problem-details body jaata hai jisme har invalid field ka error hota hai. Iska matlab action ke andar employee hamesha at-least-bound hota hai, aur manual if (!ModelState.IsValid) return BadRequest(...) dead code ban jaata hai.",
    followUp: "Agar tumhe automatic 400 ka response shape customize karna ho to kahan karoge? (ApiBehaviorOptions.InvalidModelStateResponseFactory)",
  },
  {
    id: "post-sc-5",
    question: "Poori Employee entity ko [FromBody] bind karne ka security risk kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Over-posting / mass-assignment — client body me Salary, IsActive, Id jaise server-controlled fields bhej sakta hai aur wo bind ho jaate hain. Fix: ek CreateEmployeeDto jisme sirf allowed fields hon.",
    detailedAnswer:
      "Jab action parameter poori entity ho, model binder JSON ki har matching property set kar deta hai — client { salary: 99999999, isActive: true, id: 500 } bhej sakta hai. Humne Id to manually overwrite kar diya, par Salary aur IsActive client ke control me aa gaye. Ye over-posting hai — ek real vulnerability class (mass-assignment). Sahi fix ek input DTO (CreateEmployeeDto) hai jisme sirf wahi fields hain jo client ko bhejne allowed hain; server-controlled fields DTO me hote hi nahi to bind hi nahi ho sakte.",
    followUp: "DTO ke bina [Bind] attribute ya [JsonIgnore] se kaam chal sakta hai? (partial, aur error-prone — DTO zyada explicit)",
    redFlag: "'Client to sirf sahi data bhejega' — API ko kabhi client ki niyat pe bharosa nahi karna chahiye.",
  },
  {
    id: "post-sc-6",
    question: "POST idempotent hai ya nahi? Iska practical asar kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "POST non-idempotent hai — do identical POST se do alag records ban sakte hain. Isliye retry/network-timeout par client ko duplicate ka dhyan rakhna padta hai.",
    detailedAnswer:
      "Idempotent ka matlab: same request N baar bhejo, server ka observable state same rahe. GET, PUT, DELETE idempotent hain; POST nahi. Agar client POST bhejta hai, response network me kho jaata hai, aur client retry karta hai — server do baar create kar deta hai. Isse bachne ke liye idempotency key (client ek unique key header me bhejta hai, server usse dedupe karta hai) ya natural unique constraint (jaise Email/PAN unique) use hota hai.",
    followUp: "Client-generated id ke saath create karna ho to POST ke bajaye kaunsa verb better hai? (PUT — idempotent create-or-replace)",
  },
  {
    id: "post-sc-7",
    question: "Ek request me do [FromBody] parameters likh sakte ho? Jaise Create([FromBody] Employee e, [FromBody] Address a)?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Ek request me sirf ek [FromBody] parameter allowed hai — request body stream ek hi baar padha jaata hai. Do [FromBody] par framework startup/invoke pe error deta hai.",
    detailedAnswer:
      "HTTP request ka body ek forward-only stream hai — use ek baar deserialize kiya to dobara nahi padh sakte. Isliye ASP.NET Core ek action me ek se zyada [FromBody] allow nahi karta (InvalidOperationException). Agar do cheezein chahiye to unhe ek wrapper/DTO me combine karo (jaise CreateEmployeeRequest { Employee..., Address... }) aur wo ek parameter bind karo. Baaki parameters [FromRoute]/[FromQuery]/[FromHeader] se aa sakte hain, sirf body ek hi hota hai.",
    followUp: "Ek complex object aur ek route id ek saath chahiye to signature kaisa hoga? (Update(int id, [FromBody] UpdateEmployeeDto dto))",
  },
];

export default questions;
