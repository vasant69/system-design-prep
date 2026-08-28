import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "authentication-vs-authorization-1",
    question:
      "Ek request valid JWT ke saath aati hai, lekin user ka role endpoint ke liye kaafi nahi hai. Server kya response deta hai?",
    options: ["401 Unauthorized", "403 Forbidden", "400 Bad Request", "500 Internal Server Error"],
    correctIndex: 1,
    explanation:
      "Identity valid hai (authenticated) par permission nahi — yahi 403 ka matlab hai. 401 tab aata hai jab token missing ya invalid ho (identity hi nahi bani). 400 malformed request ke liye hai, 500 server bug ke liye — dono yahan relevant nahi.",
    difficulty: "easy",
  },
  {
    id: "authentication-vs-authorization-2",
    question: "Program.cs me in middleware ka sahi order kya hai?",
    options: [
      "UseAuthorization → UseAuthentication → UseRouting → MapControllers",
      "UseRouting → UseAuthorization → UseAuthentication → MapControllers",
      "UseRouting → UseAuthentication → UseAuthorization → MapControllers",
      "UseAuthentication → MapControllers → UseAuthorization → UseRouting",
    ],
    correctIndex: 2,
    explanation:
      "Routing pehle endpoint match karta hai taaki authorization uske [Authorize] attributes dekh sake. Phir authentication HttpContext.User banata hai, phir authorization usse evaluate karta hai, phir action chalti hai. Authentication authorization se pehle hona zaroori hai warna User populate hi nahi hota; baaki options me ya order ulta hai ya MapControllers galat jagah hai.",
    difficulty: "medium",
  },
  {
    id: "authentication-vs-authorization-3",
    question: "HttpContext.User ke baare me kaunsa statement sahi hai?",
    options: [
      "Anonymous request pe wo null hota hai, isliye har jagah null-check karo",
      "Wo hamesha ek ClaimsPrincipal hota hai; anonymous request pe User.Identity.IsAuthenticated false hota hai",
      "Wo sirf cookie authentication ke saath populate hota hai, bearer token ke saath nahi",
      "Wo UseRouting me set hota hai, UseAuthentication me nahi",
    ],
    correctIndex: 1,
    explanation:
      "User kabhi null nahi hota — anonymous case me bhi ek ClaimsPrincipal hota hai jiska IsAuthenticated false hai. Cookie aur bearer dono schemes usse populate karte hain. Set karne ka kaam UseAuthentication karta hai, UseRouting nahi.",
    difficulty: "medium",
  },
  {
    id: "authentication-vs-authorization-4",
    question:
      "APIs (SPA + mobile + service-to-service) ke liye bearer token ko cookie auth ke muqable kyun prefer kiya jaata hai?",
    options: [
      "Bearer token encrypt hota hai isliye claims chhupe rehte hain",
      "Bearer token stateless hai, har client type se chalta hai, aur browser use apne aap attach nahi karta isliye CSRF surface nahi",
      "Cookie auth .NET 8 me support hi nahi hai",
      "Bearer token ko server-side instantly revoke karna cookie se aasan hai",
    ],
    correctIndex: 1,
    explanation:
      "Bearer token ki asli wajah: stateless (server ko session store nahi chahiye), portable (mobile/SPA/services sab), aur client khud header me bhejta hai to CSRF nahi. JWT signed hota hai encrypted nahi — claims base64url me readable hain. Cookie auth .NET 8 me poori tarah supported hai. Instant server-side revoke to bearer/stateless ka kamzor pehlu hai, fayda nahi.",
    difficulty: "hard",
  },
];

export default quiz;
