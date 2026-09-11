import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aw-1",
    question: "UseAuthentication aur UseAuthorization me kya farak hai, aur order kyun matter karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Authentication = 'tum kaun ho' — token/cookie validate karke `HttpContext.User` populate karta hai. Authorization = 'tumhe allowed hai' — `[Authorize]` ke rules `User` ke against check karta hai. Authorization ko populated `User` chahiye, isliye `UseAuthentication` hamesha `UseAuthorization` se pehle aana chahiye.",
    detailedAnswer:
      "Order palat do to authorization check ek khaali/anonymous `User` dekhega chahe valid token ho ya na ho — sab authenticated endpoints galat tarike se reject ho sakte hain (ya agar authorization 'default allow' ho to sab kuch bina check ke through nikal sakta hai, jo bada security hole hai). Middleware order isi wajah se interview me bahut poocha jaata hai.",
    followUp: "`[Authorize(Roles = \"admin\")]` extra kya check karta hai jo bare `[Authorize]` nahi karta?",
  },
  {
    id: "aw-2",
    question: "`[Authorize]` wali request reject hoti hai to controller ka constructor chalta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Reject hone par `UseAuthorization` middleware stage khud hi response par `401`/`403` likh kar pipeline **short-circuit** kar deta hai — request `MapControllers` endpoint stage tak pahunchti hi nahi. Controller instantiate nahi hota, action kabhi nahi chalta.",
    detailedAnswer:
      "Isiliye action ke andar 'agar user null hai to 401 return karo' jaisa manual check likhne ki zaroorat nahi — framework `[Authorize]` se hi ye guard middleware level par laga deta hai, action ka code sirf authorized path ke liye likha jaata hai.",
    redFlag: "Action ke andar `if (User == null) return Unauthorized();` likhna jabki `[Authorize]` already lagi hai — dead code.",
  },
  {
    id: "aw-3",
    question: "Missing token aur expired/invalid-signature token — dono 401 dete hain. Reject decision kahan hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Dono me `UseAuthentication` stage `HttpContext.User` ko 'unauthenticated' bana deta hai (missing token: kuch validate karne ko nahi mila; invalid token: validation fail hui) — koi error abhi nahi. Actual `401` `UseAuthorization` stage se aata hai jab wo dekhta hai `User.Identity.IsAuthenticated == false`.",
    detailedAnswer:
      "Framework by default client ko ye batakar differentiate nahi karta ki 'token tha hi nahi' vs 'token galat tha' — dono `401`. Ye jaan-boojh kar hai: attacker ko extra info (ki unka forged token 'close' tha) nahi dena. Debugging ke liye server logs me `AuthenticationFailed` event handle karke reason dekha ja sakta hai.",
  },
];

export default questions;
