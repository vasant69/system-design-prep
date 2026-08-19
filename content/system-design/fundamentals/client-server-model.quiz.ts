import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "csm-1",
    question: "TLS 1.3 ne handshake latency ko TLS 1.2 ke comparison mein kaise improve kiya?",
    options: [
      "TLS 1.3 encryption hi remove kar deta hai speed ke liye",
      "TLS 1.3 handshake ko 2 RTT se 1 RTT (aur resumption par 0-RTT) tak reduce karta hai",
      "TLS 1.3 sirf UDP ke saath kaam karta hai",
      "TLS 1.3 aur TLS 1.2 ki latency same hai, sirf security better hai",
    ],
    correctIndex: 1,
    explanation:
      "TLS 1.3 handshake ko streamline karke 2 RTT se 1 RTT tak le aaya (aur session resumption ke case mein 0-RTT), bina encryption compromise kiye — encryption remove karna (A) galat hai. TLS TCP ke upar chalta hai, UDP-specific nahi (C). Latency improvement hi TLS 1.3 ka main selling point tha (D galat).",
    difficulty: "medium",
  },
  {
    id: "csm-2",
    question: "Stateless server design ka sabse bada practical advantage kya hai?",
    options: [
      "Har request mein zero data bhejna padta hai",
      "Koi bhi server instance kisi bhi request ko handle kar sakta hai, isliye load balancing aur horizontal scaling simple ho jaati hai",
      "Stateless servers hamesha stateful servers se fast hote hain",
      "Stateless design mein database ki zaroorat nahi padti",
    ],
    correctIndex: 1,
    explanation:
      "Stateless design ka core benefit yeh hai ki koi bhi instance kisi bhi request ko serve kar sakta hai, isliye load balancer trivially requests distribute kar sakta hai aur scaling easy hoti hai. Data toh bhejna padta hai (jaise JWT token) — 'zero data' galat hai (A). Speed guarantee (C) ek myth hai — depends on use-case. Database ki zaroorat state se independent hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "csm-3",
    question: "Interviewer poochta hai 'URL type karne pe kya hota hai'. Candidate seedha bolta hai 'browser server ko HTTP request bhejta hai aur response aata hai'. Is jawab mein sabse badi kami kya hai?",
    options: [
      "Jawab bilkul sahi hai, kuch kami nahi",
      "DNS resolution aur TCP/TLS handshake steps completely skip kar diye gaye — jo latency ka bada hissa hote hain",
      "HTTP ka naam lena hi galat tha",
      "Response ka zikr nahi karna chahiye tha",
    ],
    correctIndex: 1,
    explanation:
      "Sirf 'request bhejta hai aur response aata hai' bolna DNS resolution aur TCP/TLS handshake jaise critical latency-adding steps ko skip kar deta hai — yehi sabse common mistake hai is topic mein. HTTP mention karna sahi tha (C galat), response ka zikr bhi zaroori hai (D galat) — kami sirf completeness ki hai.",
    difficulty: "easy",
  },
  {
    id: "csm-4",
    question: "Zomato jaisi app baar-baar delivery location update fetch karti hai. Har baar naya TCP+TLS handshake avoid karne ke liye kaunsa approach best hai?",
    options: [
      "Har request ke liye ek naya server instance spin up karna",
      "HTTP keep-alive connections ya WebSockets use karna taaki ek hi connection reuse ho",
      "DNS TTL ko zero set kar dena",
      "Requests ko UDP par bhejna instead of HTTP",
    ],
    correctIndex: 1,
    explanation:
      "Keep-alive connections ya WebSockets ek connection ko open rakhte hain multiple updates ke liye, isliye baar-baar handshake nahi karna padta. Naya server instance (A) handshake cost solve nahi karta. DNS TTL zero (C) actually zyada DNS lookups force karega, better nahi. Plain UDP par HTTP nahi chalta (D) — yeh ek galat premise hai.",
    difficulty: "hard",
  },
];

export default quiz;
