import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "mvm-1",
    question: "Interview mein 'microservices modern hain, monolith legacy hai' jaisa framing sunke ek achha interviewer kya samajhta hai?",
    options: [
      "Candidate ko latest trends ka gyaan hai, positive signal hai",
      "Yeh ek unearned bias hai — candidate ne team size, operational maturity, ya actual scaling need discuss kiye bina microservices ko default maan liya",
      "Interviewer ko is statement se koi fark nahi padta",
      "Yeh dikhata hai ki candidate ne dono architectures production mein use ki hain",
    ],
    correctIndex: 1,
    explanation:
      "Yeh bias interviewer turant pakad leta hai — dono architectures legitimate hain aur bahut saari 'famous microservices companies' (Amazon, Netflix) saalon tak monolith pe successfully scale kar chuki hain. Bina context (team size, operational readiness, specific scaling need) ke microservices ko default maan lena shallow, trend-following thinking ka signal hai, positive nahi (A galat).",
    difficulty: "easy",
  },
  {
    id: "mvm-2",
    question: "Monolith ke genuine advantages mein se kaunsa sahi hai?",
    options: [
      "Monolith horizontally scale nahi ho sakta, sirf ek machine pe chal sakta hai",
      "Ek shared database/process ki wajah se ACID transactions simple hote hain, aur components ke beech function calls hote hain (network latency nahi)",
      "Monolith mein har module apni khud ki technology stack choose kar sakta hai",
      "Monolith automatically fault-isolated hota hai — ek module crash baaki ko affect nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Monolith mein order aur inventory jaisi cheezein same database/process mein hone se ek simple ACID transaction se atomically update ho sakti hain, aur inter-module calls function calls hain, network involved nahi. A galat hai — well-designed monolith replicas ke saath horizontally scale ho sakta hai. C aur D microservices ke advantages hain, monolith ke nahi (monolith mein ek unhandled exception poora process crash kar sakta hai).",
    difficulty: "medium",
  },
  {
    id: "mvm-3",
    question: "Order service aur inventory service ko alag microservices mein split karne ke baad, dono ko atomically update karna (ek hi transaction jaisa) kyun mushkil ho jaata hai, aur iska common solution kya hai?",
    options: [
      "Mushkil nahi hota, normal database transaction hi kaam karta hai across services",
      "Alag databases hone ki wajah se single ACID transaction possible nahi; Saga pattern jaisi distributed transaction machinery (local transactions + compensating actions) chahiye hoti hai",
      "Iska solution hai dono services ko wapas monolith mein merge kar dena, koi aur tareeka nahi hai",
      "Microservices mein transactions ki zaroorat hi nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Jab order aur inventory alag services apni-apni database own karti hain, ek simple ACID transaction se dono ko atomically update nahi kiya ja sakta — Saga pattern (multiple local transactions + compensating/rollback actions) jaisi significantly complex machinery chahiye hoti hai. A galat hai kyunki cross-database ACID transactions distributed setting mein practically possible nahi. C ek overcorrection hai — selective extraction ek valid alternative hai. D galat hai, transactions ki zaroorat rehti hai, bas mechanism badal jaata hai.",
    difficulty: "hard",
  },
  {
    id: "mvm-4",
    question: "Decision framework ke hisaab se, microservices adopt karne ka sabse strong justification kaunsa hai?",
    options: [
      "Team ne recently ek conference mein microservices ke baare mein suna hai",
      "Team size/structure (Conway's Law) independent ownership support karti hai, ek specific component ko genuinely independent scaling chahiye, aur operational readiness (tracing, discovery, gateway) maujood hai",
      "Codebase bahut purana hai, isliye naye architecture mein rewrite karna chahiye",
      "Competitor companies microservices use kar rahi hain",
    ],
    correctIndex: 1,
    explanation:
      "Teen genuine factors hain: Conway's Law (independent teams jo services genuinely own kar sakein), koi specific component jisko dramatically different scaling profile chahiye, aur operational maturity (distributed tracing, service discovery, API gateway already set up karne ki capacity). A, C, aur D sab superficial/peer-pressure reasons hain jo interviewer red-flag ki tarah dekhta hai — codebase ki age ya competitor choices genuine architectural justification nahi hain.",
    difficulty: "medium",
  },
];

export default quiz;
