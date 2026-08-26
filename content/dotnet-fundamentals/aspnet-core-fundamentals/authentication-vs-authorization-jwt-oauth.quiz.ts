import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "authn-authz-1",
    question: "Ek valid, logged-in user (valid JWT ke saath) ek admin-only endpoint call karta hai jiske liye uske paas permission nahi hai. Sahi status code kya hai?",
    options: [
      "401 Unauthorized",
      "403 Forbidden",
      "400 Bad Request",
      "404 Not Found",
    ],
    correctIndex: 1,
    explanation:
      "User successfully authenticated hai (valid token) — problem authentication me nahi hai. Problem ye hai ki authenticated identity ko is action ki permission nahi hai — yehi authorization failure hai, jiska sahi code 403 Forbidden hai. 401 (Option A) tab hota jab authentication khud fail hoti (invalid/missing token). 400 aur 404 (Options C, D) is scenario se related hi nahi hain.",
    difficulty: "medium",
  },
  {
    id: "authn-authz-2",
    question: "JWT ka payload part encrypted hota hai ya sirf encoded?",
    options: [
      "Encrypted — koi bhi read nahi kar sakta bina key ke",
      "Sirf base64-encoded aur signed — koi bhi decode karke padh sakta hai, signature sirf tampering detect karta hai",
      "Payload compressed hota hai, encrypted nahi",
      "Ye depend karta hai algorithm pe — kuch encrypted hote hain, kuch nahi",
    ],
    correctIndex: 1,
    explanation:
      "JWT payload sirf base64url-encoded hota hai, encrypted nahi. Signature sirf ye guarantee karta hai ki payload tamper nahi hua (integrity), content ko hide nahi karta. Koi bhi token ko decode karke claims padh sakta hai (jwt.io jaisa tool). Isliye sensitive data JWT payload me kabhi nahi daalni chahiye. Options A, C, D sab is fundamental property ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "authn-authz-3",
    question: "ASP.NET Core middleware pipeline me `UseAuthentication()` aur `UseAuthorization()` ka sahi order kya hai, aur kyun?",
    options: [
      "Order matter nahi karta, dono kabhi bhi register ho sakte hain",
      "UseAuthorization() pehle, phir UseAuthentication() — permissions pehle check honi chahiye",
      "UseAuthentication() pehle, phir UseAuthorization() — authorization ko already-established identity chahiye",
      "Dono ek hi call me combine hote hain, alag register nahi hote",
    ],
    correctIndex: 2,
    explanation:
      "Authentication pehle identity establish karta hai (ClaimsPrincipal populate karta hai request context me). Authorization is established identity ke against decisions leta hai — agar authorization pehle chale, usko pata hi nahi hoga user kaun hai, decisions galat honge ya sab kuch fail hoga. Isliye UseAuthentication() hamesha UseAuthorization() se pehle register hona chahiye. Order genuinely matter karta hai (Option A galat), aur ye do alag middleware calls hain (Option D galat).",
    difficulty: "hard",
  },
  {
    id: "authn-authz-4",
    question: "OAuth fundamentally kis cheez ke liye design hua hai?",
    options: [
      "User ki identity verify karna (authentication)",
      "Ek app ko user ke resources access karne dena bina password dekhe (delegated authorization)",
      "Passwords ko encrypt karke store karna",
      "JWT tokens generate karna",
    ],
    correctIndex: 1,
    explanation:
      "OAuth core me ek delegated-authorization protocol hai — 'Sign in with Google' jaisa flow ek app ko user ke resources (email, profile) tak scope-limited access deta hai bina app ko kabhi password handle karne diye. Authentication (Option A) ke liye OpenID Connect (OAuth ke upar built) chahiye — ye ek common confusion hai jo naam 'OAuth' se hi paida hoti hai. Options C aur D OAuth ke actual purpose se related nahi hain.",
    difficulty: "medium",
  },
];

export default quiz;
