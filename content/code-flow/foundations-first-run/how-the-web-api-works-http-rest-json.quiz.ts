import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "http-rest-json-1",
    question: "Client ek naya employee banane ke liye request bhejta hai. RESTfully sabse sahi kya hai?",
    options: [
      "GET /api/createEmployee, success par 200",
      "POST /api/employees, success par 201 Created + Location header",
      "PUT /api/employees, success par 204 No Content",
      "POST /api/getEmployees, success par 200",
    ],
    correctIndex: 1,
    explanation:
      "Naya resource collection me banane ke liye verb `POST` collection URL par, aur convention success par `201 Created` + `Location: /api/employees/{newId}`. Option A galat — URL me verb (`createEmployee`) nahi hona chahiye aur create GET par nahi (GET safe hai). Option C galat — PUT ek known id par replace/create ke liye hai, naye item ke liye POST; aur 204 create ke liye typical nahi. Option D galat — URL me verb + POST se 'get' karna dono galat.",
    difficulty: "easy",
  },
  {
    id: "http-rest-json-2",
    question: "In verbs me se kaunse teen idempotent maane jaate hain (same request N baar = same end state)?",
    options: [
      "GET, POST, PATCH",
      "POST, PUT, DELETE",
      "GET, PUT, DELETE",
      "GET, POST, DELETE",
    ],
    correctIndex: 2,
    explanation:
      "GET (kuch badalta nahi), PUT (poora resource same URL par replace — 10 baar bhejo, same result), DELETE (pehli baar delete, aage bhi resource gaya hi rehta hai) — teeno idempotent. POST idempotent nahi: 3 baar `POST /api/employees` = 3 employees. PATCH generally idempotent nahi maana jaata. Isliye A, B, D sab galat hain kyunki unme POST ya PATCH shaamil hai.",
    difficulty: "medium",
  },
  {
    id: "http-rest-json-3",
    question: "User logged in hai (valid token) lekin doosre employee ka salary field update karne ki permission nahi hai. Server kaunsa status de?",
    options: [
      "401 Unauthorized",
      "403 Forbidden",
      "400 Bad Request",
      "404 Not Found",
    ],
    correctIndex: 1,
    explanation:
      "Authentication ho chuki hai (server jaanta hai user kaun hai) lekin authorization fail — is action ki permission nahi. Yahi `403 Forbidden` hai. Option A galat — `401` tab jab token missing ya invalid ho (pehchaan hi nahi hui). Option C galat — request malformed nahi hai. Option D galat — resource exist karta hai, bas access nahi.",
    difficulty: "medium",
  },
  {
    id: "http-rest-json-4",
    question: "Statelessness ka REST me kya matlab hai?",
    options: [
      "Server database use nahi karta",
      "Har request self-contained hoti hai; server do requests ke beech client ki session-memory nahi rakhta, auth har request me aata hai",
      "Response me kabhi body nahi hoti",
      "Client ko cookies bilkul use nahi karni chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Stateless matlab server request ke beech client-specific conversational state nahi rakhta — jo bhi chahiye (jaise auth token) har request khud le kar aati hai. Isse koi bhi server instance koi bhi request handle kar sakta hai, scaling aasan. Option A galat — server data store kar sakta hai, baat client-session state ki hai. Option C galat — body normally hoti hai. Option D galat — statelessness cookies ban nahi karta, bas server-side session memory par depend nahi karta.",
    difficulty: "hard",
  },
];

export default quiz;
