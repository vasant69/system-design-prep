import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "auth-jwt-1",
    question: "ASP.NET Core middleware pipeline me UseAuthentication() aur UseAuthorization() ka sahi order kya hai, aur kyun?",
    options: [
      "UseAuthorization() pehle, phir UseAuthentication() — kyunki permission pehle check honi chahiye",
      "UseAuthentication() pehle, phir UseAuthorization() — kyunki authorization ko already-established identity chahiye hoti hai",
      "Order koi matter nahi karta, dono independent hain",
      "Dono ek saath, single middleware call me register hote hain",
    ],
    correctIndex: 1,
    explanation: "UseAuthentication() ClaimsPrincipal populate karta hai request context me — UseAuthorization() usi identity ke against decisions leta hai, isliye authentication pehle chahiye. Agar order ulta ho, authorization checks ko pata hi nahi chalega user kaun hai aur galat tarike se fail ho jayenge. Option A ulta order hai (galat), C galat hai kyunki order genuinely matter karta hai, D galat hai kyunki ye do separate middleware calls hain, ek nahi.",
    difficulty: "medium",
  },
  {
    id: "auth-jwt-2",
    question: "JWT payload ke baare me sabse accurate statement kaunsa hai?",
    options: [
      "Payload encrypted hota hai, isliye sensitive data safe hai usme daalna",
      "Payload sirf base64-encoded aur signed hai, encrypted nahi — koi bhi decode karke content padh sakta hai",
      "Payload sirf server hi decode kar sakta hai, client nahi",
      "Payload automatically expire ho jaata hai signature verify hone ke baad",
    ],
    correctIndex: 1,
    explanation: "JWT payload signed hota hai (tampering detect karne ke liye) lekin encrypted nahi — base64url-encoding hai, jo koi bhi easily decode kar sakta hai (jwt.io jaisi site pe). Isliye sensitive data (password, full card number) kabhi payload me nahi honi chahiye. Option A galat hai kyunki encryption nahi hoti, C galat hai kyunki client bhi decode kar sakta hai, D irrelevant/galat statement hai.",
    difficulty: "easy",
  },
  {
    id: "auth-jwt-3",
    question: "Role-based authorization ke comparison me policy-based authorization ka main advantage kya hai?",
    options: [
      "Policy-based hamesha faster execute hota hai runtime pe",
      "Policy-based custom, multi-condition logic (jaise claims combination ya resource-based checks) support karta hai, ek central jagah define hokar",
      "Role-based sirf admin users ke liye kaam karta hai",
      "Policy-based JWT ki zaroorat khatam kar deta hai",
    ],
    correctIndex: 1,
    explanation: "Policy-based authorization named policies define karta hai (RequireAssertion, RequireClaim, custom IAuthorizationHandler) ek central jagah, jo complex/composable logic support karta hai aur controllers me scattered role-string-checks se zyada maintainable hota hai. Option A ek unrelated/galat claim hai, C galat hai (role-based kisi bhi role ke saath kaam karta hai), D irrelevant hai — authentication mechanism alag concern hai.",
    difficulty: "medium",
  },
  {
    id: "auth-jwt-4",
    question: "Refresh token rotation (har refresh call pe naya refresh token issue karke purana invalidate karna) kyun zaroori practice hai?",
    options: [
      "Isse access token ki zaroorat hi khatam ho jaati hai",
      "Isse database load kam ho jaata hai",
      "Agar rotate na karein aur ek refresh token leak ho jaaye, attacker indefinitely naye access tokens generate kar sakta hai jab tak explicit expiry na aaye",
      "Rotation JWT signature verification ko fast banata hai",
    ],
    correctIndex: 2,
    explanation: "Bina rotation ke, ek leaked refresh token attacker ke haath me indefinitely valid rehta hai (uski apni expiry tak), jisse wo baar-baar naye access tokens generate kar sakta hai. Rotation is risk ko limit karta hai — har use pe purana token invalidate ho jaata hai. Options A, B, aur D sab galat/irrelevant claims hain jo rotation ka actual security purpose nahi capture karte.",
    difficulty: "hard",
  },
];

export default quiz;
