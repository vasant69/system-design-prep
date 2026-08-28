import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "put-delete-1",
    question: "PUT aur PATCH me kya farq hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "PUT poora resource replace karta hai (jo body me nahi hai wo cleared maana jaata hai); PATCH sirf bheji hui fields update karta hai.",
    detailedAnswer:
      "PUT full-replace semantics rakhta hai aur idempotent hai — same body se N calls = same final state. PATCH partial update hai aur JSON Merge Patch ya JSON Patch format use karta hai. Practically: form-save jaise flows me PUT theek hai kyunki poora object waise bhi jaata hai; mobile ya bandwidth-sensitive clients PATCH prefer karte hain taaki sirf changed field jaaye.",
    followUp: "PATCH idempotent hai kya?",
    redFlag: "Ye kehna ki PUT sirf changed fields update karta hai — wo PATCH ka behaviour hai.",
  },
  {
    id: "put-delete-2",
    question: "PUT aur DELETE idempotent hain — iska matlab kya, aur POST kyun nahi?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Idempotent = ek request N baar bhejo, server ka final state 1 baar jaisa hi. PUT/DELETE aise hain; POST har call par naya resource banata hai.",
    detailedAnswer:
      "PUT id 7 ko ek fixed state par set karta hai — dobara wahi PUT bhejne se kuch naya nahi hota. DELETE id 7 pehli baar hataata hai, agli calls no-op. POST 'create' hai — 5 POST = 5 employees. Isiliye retry logic (timeout ke baad) PUT/DELETE ke liye safe hai, POST ke liye nahi — POST ke liye idempotency key jaisa mechanism chahiye.",
    followUp: "POST ko safe-to-retry kaise banaoge?",
  },
  {
    id: "put-delete-3",
    question: "PUT success par kaunsa status code, aur missing id par kaunsa?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Success par 204 No Content (ya 200 with body agar server ne fields add ki); missing id par 404.",
    detailedAnswer:
      "204 default hai kyunki client ke paas already wo data hai jo usne bheja. 200 with body tab jab server ne kuch compute kiya ho (jaise UpdatedAtUtc) jo client ko wapas chahiye. Invalid body par 400 (ApiController se automatic). Id na milne par 404 — is course me PUT upsert nahi karta.",
    followUp: "Agar concurrency conflict ho to kaunsa code? (Hint: 409 / 412)",
  },
  {
    id: "put-delete-4",
    question:
      "Do users ne same employee ka form khola. A ne Salary badal ke PUT kiya. Phir B ne (jiske form me purana Salary tha) Email badal ke PUT kiya. Kya hua?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "B ke PUT me purana Salary tha, isliye A ki Salary change bina kisi error ke overwrite ho gayi — classic 'lost update'.",
    detailedAnswer:
      "Full-replace PUT me poora object jaata hai, to B ka stale Salary A ki fresh value ko replace kar deta hai. Fix: optimistic concurrency — resource ke saath ek version token (RowVersion / ETag) bhejte hain; PUT me wo token match hona chahiye, warna 409 Conflict ya 412 Precondition Failed. EF Core module me RowVersion ke saath ye implement karenge.",
    followUp: "Optimistic vs pessimistic locking — kab kaunsa?",
    redFlag: "Ye maan lena ki in-memory ya single-user testing me kaam kar gaya to production me bhi theek hai.",
  },
  {
    id: "put-delete-5",
    question: "DELETE endpoint likhte waqt BFSI context me sabse important design decision kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Hard delete mat karo — soft delete (IsActive=false / DeletedAtUtc) karo aur list queries me by default exclude.",
    detailedAnswer:
      "Regulatory aur audit requirements ke liye employee/loan/transaction records ka history physically rehna chahiye. Isliye DELETE /api/employees/{id} internally row ko flag karta hai, hataata nahi. GET list endpoints ek default filter (IsActive == true) lagate hain, aur ek explicit query param se inactive dekhne deta hai. API contract wahi rehta hai (client ko 204 milta hai), implementation soft hoti hai.",
    followUp: "Soft-deleted record ka Email unique constraint ke saath kya karoge jab wahi banda dobara join kare?",
  },
  {
    id: "put-delete-6",
    question: "Ye PUT action code review me aaya. Kya problem hai?\n```csharp\n[HttpPut(\"{id:int}\")]\npublic IActionResult Update(int id, [FromBody] Employee incoming)\n{\n    var existing = _employees.FirstOrDefault(e => e.Id == id);\n    if (existing is null) { _employees.Add(incoming); return Ok(incoming); }\n    existing.Id = incoming.Id;\n    existing.FullName = incoming.FullName;\n    return NoContent();\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Do bugs: missing id par naya record Add kar raha hai (ghost records), aur existing.Id ko body se overwrite kar raha hai (identity badal di).",
    detailedAnswer:
      "Naive upsert se typo id par ghost employee ban jaata hai. existing.Id = incoming.Id identity ko client-controlled bana deta hai — id route se aani chahiye, body se nahi. Saath hi sirf FullName copy ho raha hai, baaki fields nahi — ye ab full-replace bhi nahi raha, aadha PATCH aadha PUT. Sahi: missing par 404, Id ko haath mat lagao, saari fields copy karo.",
    redFlag: "Ye kehna ki 'kaam to kar raha hai' — Swagger me ek happy-path call pass ho jaana correctness proof nahi hai.",
  },
];

export default questions;
