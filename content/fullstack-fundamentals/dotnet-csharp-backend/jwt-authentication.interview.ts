import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "jwt-1",
    question: "JWT ke teen parts kya hain, aur uska trust model kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Header (algorithm), payload (claims jaise `sub`, `role`, `exp`), aur signature (server ki key se banaya). Trust signature se aata hai: server har request par signature verify karta hai; agar valid hai to payload tamper-free hai. Payload sirf base64url encoded hai, encrypted nahi.",
    detailedAnswer:
      "Kyunki koi bhi payload decode kar sakta hai, usme secrets nahi jaate. Signature validation stateless auth enable karta hai — koi DB session lookup nahi, isliye API servers horizontally scale karte hain. Server ko expected `alg`, `iss`, `aud`, aur `exp` sab validate karne chahiye.",
    followUp: "`alg: none` attack kya hai aur usse kaise bachte ho?",
  },
  {
    id: "jwt-2",
    question: "Stateless JWT ke saath logout / 'is user ko abhi block karo' kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Pure JWT server-side revoke nahi hota — client token discard karta hai, bas. Instant revocation ke liye: access token short-lived rakho (5-15 min) + ek DB-backed refresh token jo revoke/rotate ho sakta hai, ya ek server-side deny-list (jti / user-version) jise auth middleware har request par check kare.",
    detailedAnswer:
      "Trade-off: pure stateless (no lookup, par revocation ke liye up-to-15-min window) vs deny-list check (instant revoke, par har request par ek fast cache/DB hit — stateless ka poora faayda nahi). Common production choice: short access token + refresh token rotation, aur security events (password change, admin block) par refresh token invalidate.",
    redFlag: "Ye kehna ki 'logout par token invalidate ho jaata hai' bina revocation mechanism ke.",
  },
  {
    id: "jwt-3",
    question: "Authentication aur authorization me farak, .NET terms me?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Authentication = 'tum kaun ho' — token valid hai, `HttpContext.User` populate hota hai (`UseAuthentication`). Authorization = 'tumhe ye karne ki permission hai' — `[Authorize]`, `[Authorize(Roles=\"admin\")]`, ya policies check karti hain (`UseAuthorization`, jo authentication ke baad aana chahiye).",
    detailedAnswer:
      "Middleware order isi wajah se matter karta hai: authorization ko populated `User` chahiye. Fine-grained rules ke liye policies (`AddPolicy(\"CanApproveLoans\", p => p.RequireClaim(...))`) roles se behtar scale karti hain. `[AllowAnonymous]` ek protected controller ke andar specific action ko opt-out karta hai.",
  },
];

export default questions;
