import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "post-endpoint-and-status-codes-1",
    question:
      "POST /api/employees ek naya employee bana leta hai. Sabse sahi response status aur header kya hai?",
    options: [
      "200 OK, koi extra header nahi",
      "201 Created, plus ek Location header jo naye record ke URL pe point karta hai",
      "204 No Content, body me naya id",
      "202 Accepted, plus Retry-After header",
    ],
    correctIndex: 1,
    explanation:
      "201 Created specific batata hai ki ek naya resource bana, aur convention ke mutabik Location header naye record ka canonical URL deta hai (jaise /api/employees/4) — client ko URL guess nahi karna padta. 200 generic success hai, semantically weak. 204 me body nahi bhej sakte par client ko server-assigned id chahiye. 202 Accepted async processing ke liye hai, yahan create sync hua.",
    difficulty: "easy",
  },
  {
    id: "post-endpoint-and-status-codes-2",
    question:
      "CreatedAtAction me action ka naam plain string `GetEmployeeById` likha gaya, par asli method ka naam `GetById` hai. Kya hota hai?",
    options: [
      "Compile error — CreatedAtAction galat action naam accept nahi karta",
      "POST 201 deta hai par Location header khaali rehta hai",
      "Record list me add ho jaata hai, phir CreatedAtAction route match nahi kar paata aur POST 500 deta hai — client retry karke duplicate bana deta hai",
      "Framework khud sahi action dhoondh leta hai naam ke aage-peeche match karke",
    ],
    correctIndex: 2,
    explanation:
      "CreatedAtAction runtime pe us naam ka route dhoondhta hai. Galat string pe koi match nahi milta — InvalidOperationException 'No route matches the supplied values', response 500. Par record pehle hi _employees.Add se list me aa chuka hota hai, to client ko lagta hai create fail hua aur wo retry karta hai — duplicate record. nameof(GetById) use karo: method rename pe compiler yahin error dega.",
    difficulty: "medium",
  },
  {
    id: "post-endpoint-and-status-codes-3",
    question:
      "Naye employee ka Id assign karne ke liye kaunsa sahi hai, aur kyun?",
    options: [
      "_employees.Count + 1 — hamesha unique hota hai",
      "_employees.Max(e => e.Id) + 1 (khaali list par 1) — beech ka record delete hone par bhi collision nahi",
      "Ek random int — collision ki sambhavna bahut kam",
      "Client jo id bheje wahi — server ko id decide nahi karni chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Count + 1 tab tootta hai jab beech ka koi record delete ho jaye — Count ghat jaata hai aur naya id kisi existing id se clash kar sakta hai. Max(e => e.Id) + 1 hamesha sabse bade id se aage hota hai, is simple in-memory setup me collision-free. DB aane par (module 4) ye identity column ka kaam ban jaata hai. Random int par bhi collision possible hai. Create endpoint me server hi id decide karta hai, client ka bheja id ignore hota hai.",
    difficulty: "medium",
  },
  {
    id: "post-endpoint-and-status-codes-4",
    question:
      "Controller pe [ApiController] laga hai. Action ke andar `if (!ModelState.IsValid) return BadRequest(ModelState);` likhna kaisa hai?",
    options: [
      "Zaroori hai — bina iske invalid body pe validation nahi hoti",
      "Redundant dead code — [ApiController] ye check action se pehle khud karta hai aur 400 + problem-details deta hai",
      "Galat hai — isse valid requests bhi 400 ho jaati hain",
      "Sirf tab zaroori jab custom validation attributes ho",
    ],
    correctIndex: 1,
    explanation:
      "[ApiController] automatic model validation on karta hai — invalid body (missing required field, type mismatch, malformed JSON) par framework action chalne se PEHLE 400 + standard problem-details JSON return kar deta hai. Isliye action ke andar wahi check likhna duplicate, dead code hai. Wo galat nahi hai (valid requests aage jaati hain) par zaroorat nahi. Custom attributes bhi isi automatic pipeline me hi validate hote hain.",
    difficulty: "easy",
  },
];

export default quiz;
