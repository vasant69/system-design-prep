import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "fhp-1",
    question: "Retry storm kya hota hai aur kyun dangerous hai?",
    options: [
      "Jab ek service khud ko baar-baar restart karta hai",
      "Jab bahut saare clients ek struggling dependency ko simultaneously, bina delay ke retry karte hain, jisse load aur badh jaata hai aur partial outage total outage ban sakta hai",
      "Jab database ek query ko bahut baar execute karta hai internally",
      "Jab load balancer health checks bahut frequently bhejta hai",
    ],
    correctIndex: 1,
    explanation:
      "Retry storm tab hota hai jab naive, un-delayed retries se already-struggling dependency par aur load pad jaata hai, jisse partial failure cascading total outage ban sakta hai. Options A, C, aur D unrelated internal mechanisms describe karte hain, retry storm se related nahi hain.",
    difficulty: "easy",
  },
  {
    id: "fhp-2",
    question: "Exponential backoff ke saath jitter add karna kyun zaroori hai?",
    options: [
      "Jitter retries ko poori tarah band kar deta hai",
      "Jitter delay ko randomize karta hai taaki hazaaron clients synchronized waves mein ek saath retry na karein, jo warna khud ek load spike create kar deta",
      "Jitter sirf UI animations ke liye use hota hai, backend retries se related nahi",
      "Jitter backoff delay ko hamesha zero kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina jitter ke, sab clients same fixed backoff schedule follow karke synchronized retry waves create karte hain, jo effectively retry storm jaisa hi problem hai bas delayed. Jitter delay randomize karke load ko time ke across spread karta hai. Retries band karna circuit breaker ka kaam hai (A galat), jitter backend concept hai (C galat), aur delay zero nahi karta (D galat).",
    difficulty: "medium",
  },
  {
    id: "fhp-3",
    question: "Circuit breaker ki 'Half-Open' state ka purpose kya hai?",
    options: [
      "Poori tarah requests band kar dena permanently",
      "Ek test request dependency ko bhejna yeh check karne ke liye ki woh recover ho gaya hai ya nahi, baaki traffic still fail-fast rehta hai",
      "Har request ko half latency ke saath process karna",
      "Circuit ko permanently Closed state mein force karna",
    ],
    correctIndex: 1,
    explanation:
      "Half-Open state mein sirf ek probe/test request dependency ko bheja jaata hai recovery check karne ke liye — agar succeed hota hai circuit Closed ho jaata hai, fail hota hai to wapas Open. Permanent band karna (A) Open state ka galat description hai, 'half latency' (C) ek fabricated concept hai, aur permanently Closed force karna (D) poori state machine ka purpose hi khatam kar deta.",
    difficulty: "medium",
  },
  {
    id: "fhp-4",
    question: "Ek system mein Service A, Service B, aur Service C ko call karta hai, sab ek hi shared thread pool use karke. Service B slow ho jaata hai aur poora thread pool exhaust kar deta hai. Bulkhead pattern ye problem kaise solve karta hai?",
    options: [
      "Service B ko poori tarah band karke",
      "Har downstream dependency (B aur C) ko apna alag, dedicated thread/connection pool dekar, taaki B ka slowness C ke calls ko starve na kare",
      "Sab requests ko ek single queue mein daal ke sequential process karke",
      "Retry count ko zero kar ke",
    ],
    correctIndex: 1,
    explanation:
      "Bulkhead pattern har dependency ko apna isolated resource pool deta hai — ship ke watertight compartments jaisa — taaki ek dependency ka resource exhaustion doosre dependency ke calls ko affect na kare. Service B ko band karna (A) availability hi khatam kar deta hai. Sequential processing (C) throughput ko drastically kam karega bina isolation problem solve kiye. Retry count zero karna (D) bulkhead se unrelated hai aur transient failure recovery hi remove kar dega.",
    difficulty: "hard",
  },
];

export default quiz;
