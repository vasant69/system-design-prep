import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "wsl-1",
    question: "Plain polling (fixed interval, jaise har 5 second) ki sabse badi do problems kya hain?",
    options: [
      "Yeh sirf HTTPS pe kaam karti hai aur bahut secure nahi hai",
      "Wasteful hai (bina data ke bhi requests jaate hain) aur laggy hai (update ka pata interval jitni der baad chalta hai)",
      "Yeh sirf mobile devices pe kaam karti hai",
      "Server isse never respond kar paata",
    ],
    correctIndex: 1,
    explanation:
      "Plain polling fixed interval pe fire hoti hai chahe naya data ho ya na ho — isse unnecessary requests (waste) aur staleness (lag, kyunki update interval ke beech mein aaya to agla poll tak dikhega hi nahi) dono problems hoti hain. Baaki options factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "wsl-2",
    question: "SSE (Server-Sent Events) long polling se kis specific tareeke se better hai?",
    options: [
      "SSE bidirectional communication allow karta hai, long polling nahi",
      "SSE ek hi connection pe multiple updates stream kar sakta hai bina har update ke baad naya connection banaye — connection churn avoid hota hai",
      "SSE WebSockets se fast hai har use-case mein",
      "SSE HTTP use nahi karta, isliye zyada secure hai",
      "SSE ka koi difference nahi hai long polling se",
    ],
    correctIndex: 1,
    explanation:
      "SSE ek single long-lived connection pe multiple updates stream karta hai, jisse long polling ke response-per-connection churn se bacha jaata hai. SSE bidirectional nahi hai (A galat) — yeh WebSockets ki property hai. SSE 'faster than WebSockets' (C) galat generalization hai. SSE plain HTTP pe hi banaya gaya hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "wsl-3",
    question: "Ek live stock price ticker banani hai jahan sirf server updates push karta hai, client kabhi kuch nahi bhejta. Sabse operationally simple sufficient choice kya hai?",
    options: [
      "WebSockets, kyunki sabse modern hai",
      "SSE, kyunki one-way server push ke liye sufficient hai aur plain HTTP pe based hone se operationally simpler hai",
      "Plain polling har 1 second, kyunki simplest hai",
      "Long polling, kyunki yeh WebSockets se zyada secure hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab sirf server-to-client push chahiye aur bidirectional need nahi, SSE sufficient hai aur WebSockets ke comparison mein operationally simpler (plain HTTP, koi sticky-session complexity nahi). WebSockets (A) yahan unnecessary complexity add karega. Plain polling (C) wasteful aur laggy hai. 'Security' (D) yahan irrelevant factor hai is decision ke liye.",
    difficulty: "medium",
  },
  {
    id: "wsl-4",
    question: "WebSockets ko large scale pe deploy karte waqt sabse bada operational challenge kya hai jo stateless HTTP APIs mein nahi hota?",
    options: [
      "WebSockets JSON support nahi karte",
      "Har connection stateful hai aur server resources hold karta hai jab tak khula hai — isliye load balancing ke liye sticky sessions ya connection-aware routing chahiye",
      "WebSockets sirf ek user ko support kar sakte hain per server",
      "WebSockets automatically encrypt nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "WebSocket connections stateful hote hain aur ek specific server se 'pinned' rehte hain jab tak connection open hai — isliye load balancer ko sticky sessions ya ek connection-aware routing layer chahiye, jo stateless HTTP mein zaroorat nahi hoti (koi bhi instance kisi bhi request ko handle kar sakta hai). Baaki options factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
