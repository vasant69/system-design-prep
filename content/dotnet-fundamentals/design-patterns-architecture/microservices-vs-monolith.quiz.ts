import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "microservices-monolith-1",
    question: "Monolith architecture me components ke beech calls kaise hote hain, aur microservices me?",
    options: [
      "Dono me network calls hote hain",
      "Monolith me in-process method calls, microservices me network calls (HTTP/gRPC/message queue)",
      "Monolith me network calls, microservices me in-process calls",
      "Dono me sirf message queues use hote hain",
    ],
    correctIndex: 1,
    explanation:
      "Monolith ke saare components ek hi process me chalte hain, isliye calls in-process method calls hote hain — fast, transactional, almost-never-fail. Microservices independent processes/machines pe deploy hote hain, isliye services ek doosre se network ke through baat karte hain (HTTP, gRPC, ya message queue) — slower, aur genuinely fail ho sakte hain. Options A, C, aur D sab factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "microservices-monolith-2",
    question: "Microservices architecture me ACID transactions ki jagah typically kya use karna padta hai jab multiple services ke across data update karna ho?",
    options: [
      "Kuch nahi, ACID transactions microservices me bhi automatically kaam karte hain",
      "Saga pattern jaisi distributed-transaction approach, eventual consistency ke saath",
      "Sirf ek shared database use karna sab services ke liye",
      "Transactions ki zaroorat hi nahi padti microservices me",
    ],
    correctIndex: 1,
    explanation:
      "Monolith me ek single database ke against ek `SaveChangesAsync()` call atomically sab kuch commit kar deta hai. Microservices me har service ka typically apna alag database hota hai, isliye ek single ACID transaction cross-service possible nahi — Saga pattern jaisi distributed-transaction approach chahiye hoti hai, jo eventual consistency accept karti hai (beech me data temporarily inconsistent state me reh sakta hai). Option A galat hai — ye exactly wo problem hai jo microservices introduce karte hain. Option C galat hai — shared database use karna microservices ke independent-ownership principle ko hi violate kar deta hai. Option D galat hai, transactions ki zaroorat rehti hai, sirf mechanism alag hota hai.",
    difficulty: "hard",
  },
  {
    id: "microservices-monolith-3",
    question: "'Monolith-first' approach ka kya matlab hai, aur ye kyun widely recommend kiya jaata hai?",
    options: [
      "Hamesha monolith hi rakhna chahiye, microservices kabhi use nahi karne chahiye",
      "Naye project ko monolith se shuru karna aur genuinely organizational/scaling problems face hone par selectively split karna, kyunki shuru me service boundaries galat draw karna baad me costly hota hai",
      "Pehle microservices banao, phir monolith me convert karo agar problem aaye",
      "Monolith aur microservices dono ek saath din 1 se use karna",
    ],
    correctIndex: 1,
    explanation:
      "'Monolith-first' ka matlab hai simple shuru karna kyunki business requirements aur service boundaries shuru me clear nahi hote — galat boundaries draw karna aur baad me fix karna (do live services ke beech data-ownership refactor karna) monolith ke andar module refactor karne se kaafi zyada costly hai. Ye unconditional 'never use microservices' nahi hai (option A galat) — genuine scaling/organizational need aane par selectively split kiya jaata hai. Option C reverse order hai (galat). Option D bhi galat hai, ye approach ka opposite hai.",
    difficulty: "medium",
  },
  {
    id: "microservices-monolith-4",
    question: "Ek team apne microservices ke service boundaries ko 'UI Service', 'Business Logic Service', 'Database Service' jaise technical layers ke around draw karti hai instead of business capabilities. Iska likely result kya hoga?",
    options: [
      "Ye perfect microservices design hai, koi problem nahi",
      "Distributed monolith — saari distributed-systems complexity milegi (network calls, eventual consistency) bina microservices ke real benefits (independent scaling/deployment) ke",
      "Ye automatically better performance dega",
      "Ye monolith se zyada simple ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Service boundaries technical layers ke around draw karna (jaise 'UI Service' vs 'Database Service') ek anti-pattern hai jise 'distributed monolith' kehte hain — services ab bhi tightly coupled hain (ek feature change karne ke liye multiple services touch karne padte hain) lekin ab network calls ki latency/failure-modes bhi jhelni padti hai. Boundaries business capabilities (Order Service, Payment Service) ke around honi chahiye taaki har service independently deployable/scalable ho. Options A, C, aur D sab is anti-pattern ke actual negative consequences ko miss karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
