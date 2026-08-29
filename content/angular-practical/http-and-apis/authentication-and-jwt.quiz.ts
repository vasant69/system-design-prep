import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "authentication-and-jwt-1",
    question: "Access token ko store karne ki sabse safe practical jagah kya hai?",
    options: [
      "`localStorage` — persist hota hai aur simple hai",
      "In-memory (ek `AuthService` signal) — XSS ke liye kam readable; refresh token ek `httpOnly` Secure cookie me, aur reload par `/auth/refresh` se naya access token le lo",
      "Ek plain JS `window` variable",
      "URL query param me",
    ],
    correctIndex: 1,
    explanation:
      "`localStorage` me token koi bhi script (ya compromised dependency) padh kar account le sakti hai. Access token memory me, refresh token `httpOnly` cookie me — yahi default hona chahiye. Reload par refresh call se session persist hota hai.",
    difficulty: "medium",
  },
  {
    id: "authentication-and-jwt-2",
    question: "Paanch requests ek saath `401` return karti hain. Naive refresh-on-401 interceptor kya galat karega?",
    options: [
      "Kuch nahi",
      "Paanch alag `/auth/refresh` calls fire karega — race conditions, aur kuch requests stale token se replay ho sakti hain. Fix: ek shared in-flight refresh (`BehaviorSubject`/`shareReplay(1)`) jise sab wait karen",
      "App crash ho jaayegi",
      "Sirf pehli request refresh karegi, baaki apne aap ruk jaayengi",
    ],
    correctIndex: 1,
    explanation:
      "Concurrent `401`s ko ek hi refresh operation share karna chahiye. Pehla `401` refresh shuru karein, baaki us same Observable/subject par wait karen, phir sab naye token se replay hon.",
    difficulty: "hard",
  },
  {
    id: "authentication-and-jwt-3",
    question: "Client-side pe JWT payload ko `atob` se decode karke `roles` padhna — ye kis liye theek hai?",
    options: [
      "Security decisions ke liye — agar `roles` me 'admin' hai to admin API allow karo",
      "Sirf UI purposes ke liye (show/hide buttons, expiry countdown) — server signature validate karta hai; client sirf display ke liye decode karta hai, kabhi trust nahi karta",
      "Signature verify karne ke liye",
      "Token ko refresh karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "JWT payload readable hai (encrypted nahi). Client use UI hints ke liye decode kar sakta hai, par har security check server par hota hai. Browser me signature verify karne ke liye koi trusted secret nahi hota.",
    difficulty: "medium",
  },
  {
    id: "authentication-and-jwt-4",
    question: "Refresh token call (`/auth/refresh`) khud fail ho jaaye to interceptor ko kya karna chahiye?",
    options: [
      "Bas error dikhao aur user ko current page par rakho",
      "`AuthService.logout()` call karo aur `/login` par navigate karo — refresh fail = session dead, user ko limbo me mat chhodo",
      "Request ko infinitely retry karo",
      "Access token ko `null` set karke ignore karo",
    ],
    correctIndex: 1,
    explanation:
      "Agar refresh nahi hua to session recover nahi ho sakta. Clean logout + login redirect (with `returnUrl`) sahi UX hai. Server logout bhi call karo taaki refresh token invalidate ho.",
    difficulty: "medium",
  },
];

export default quiz;
