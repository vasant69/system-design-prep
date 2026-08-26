import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cors-1",
    question: "CORS kis layer pe enforce hota hai?",
    options: [
      "Server pe — server request ko reject kar deta hai agar origin allowed na ho",
      "Browser pe — server response process karta hai, browser sirf JavaScript ko response read karne se rokta hai",
      "Network firewall pe — packet level filtering hoti hai",
      "Database pe — query execution level pe check hota hai",
    ],
    correctIndex: 1,
    explanation:
      "CORS ek browser-enforced mechanism hai. Server hamesha request process karta hai aur response bhej deta hai — CORS sirf decide karta hai ki browser us response ko cross-origin JavaScript code ko read karne dega ya nahi. Options A, C, D CORS ke actual enforcement point ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "cors-2",
    question: "Postman se ek API call bhejne par CORS error kabhi kyun nahi aata, chahe server ki CORS policy kuch bhi ho?",
    options: [
      "Postman automatically saare CORS headers add kar deta hai",
      "Postman ek browser nahi hai — CORS sirf browser-JavaScript context me enforce hota hai",
      "Postman server ko special bypass token bhejta hai",
      "CORS sirf HTTPS requests pe apply hota hai, Postman HTTP use karta hai",
    ],
    correctIndex: 1,
    explanation:
      "CORS same-origin policy ka relaxation mechanism hai jo specifically browsers JavaScript engines enforce karte hain. Postman ek standalone HTTP client hai, browser nahi — isme koi 'JavaScript running on a webpage' context hi nahi hai jo CORS ko trigger kare. Options A, C, D sab incorrect mechanisms describe karte hain.",
    difficulty: "medium",
  },
  {
    id: "cors-3",
    question: "`AllowAnyOrigin()` (`*`) ko `AllowCredentials()` ke saath combine karne ki koshish karne par kya hota hai?",
    options: [
      "Kaam kar jaata hai, sab origins credentials ke saath bhi allowed ho jaate hain",
      "Ye spec-level restriction violate karta hai — combine nahi ho sakte, specific origins explicitly list karni padti hain",
      "AllowAnyOrigin automatically AllowCredentials ko disable kar deta hai silently",
      "Sirf HTTPS origins ke liye kaam karta hai, HTTP ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "CORS spec explicitly disallow karta hai wildcard origin (*) ko credentials ke saath combine karna — security reasons se (agar allowed hota, koi bhi website credentials-bearing requests bhej sakta victim ke cookies/auth ke saath). Credentials chahiye ho to specific origins WithOrigins() se list karni padti hain. Options A, C, D is restriction ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "cors-4",
    question: "Kaunsi request preflight OPTIONS trigger karegi?",
    options: [
      "Ek simple GET request bina custom headers ke",
      "Ek POST request Content-Type: application/json ke saath",
      "Ek HTML form submission Content-Type: application/x-www-form-urlencoded ke saath",
      "Ek plain-text GET request",
    ],
    correctIndex: 1,
    explanation:
      "'Non-simple' requests preflight trigger karti hain — jaise application/json content-type (jo real Web APIs me almost universal hai), custom headers (Authorization), ya PUT/DELETE verbs. Simple GET requests (Options A, D) aur form-urlencoded POST (Option C) 'simple request' criteria satisfy karte hain, isliye preflight trigger nahi karte.",
    difficulty: "medium",
  },
];

export default quiz;
