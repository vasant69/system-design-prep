import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pfr-1",
    question: "Forward proxy aur reverse proxy mein fundamental difference kya hai?",
    options: [
      "Forward proxy sirf HTTPS ke liye hai, reverse proxy sirf HTTP ke liye",
      "Forward proxy client ki taraf se internet se baat karta hai (client hidden); reverse proxy server ki taraf se client se baat karta hai (server hidden)",
      "Dono exactly same kaam karte hain, sirf naam alag hai",
      "Forward proxy sirf mobile apps ke liye hai, reverse proxy sirf web ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Forward proxy client ka representative hai internet ki taraf (destination server ko sirf proxy dikhta hai, client nahi), reverse proxy server ka representative hai client ki taraf (client ko sirf proxy dikhta hai, backend servers nahi). Protocol-based split (A) galat hai. Dono genuinely different problems solve karte hain (C galat). Platform-based split (D) bhi galat hai.",
    difficulty: "easy",
  },
  {
    id: "pfr-2",
    question: "Load balancer aur reverse proxy ka relationship kya hai?",
    options: [
      "Load balancer aur reverse proxy poori tarah unrelated concepts hain",
      "Load balancer essentially ek specialized reverse proxy hai jiska primary focus traffic distribution hai",
      "Reverse proxy load balancer ka ek subset hai",
      "Load balancer sirf forward proxy ka doosra naam hai",
    ],
    correctIndex: 1,
    explanation:
      "Load balancer reverse proxy category ka hi ek specific, common use case hai — reverse proxy broader hai (SSL termination, routing, compression bhi isme aate hain), load balancing usme se ek specialization hai. Yeh unrelated concepts nahi hain (A galat). Relationship ulta hai — load balancer reverse proxy ka subset hai, opposite nahi (C galat). Forward proxy se koi relation nahi hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "pfr-3",
    question: "Ek company apne saare employees ka outbound internet traffic monitor aur filter karna chahti hai (kaunsi websites access ho sakti hain control karna). Yeh kaunsa use case hai?",
    options: [
      "Reverse proxy ka SSL termination use case",
      "Forward proxy ka corporate network egress control/filtering use case",
      "Load balancer ka least-connections algorithm",
      "CDN ka origin shielding",
    ],
    correctIndex: 1,
    explanation:
      "Employees ke outbound traffic ko ek common proxy ke through route karke filter/monitor karna classic forward proxy use case hai — proxy client (employees) ki taraf se internet se baat karta hai. SSL termination (A) reverse proxy ka server-side use case hai, unrelated. Load balancer algorithm (C) aur CDN origin shielding (D) dono is scenario se unrelated concepts hain.",
    difficulty: "medium",
  },
  {
    id: "pfr-4",
    question: "Reverse proxy ke use cases mein se kaunsa sahi NAHI hai?",
    options: [
      "SSL/TLS termination, taaki backend servers ko encryption ka CPU load na uthaana pade",
      "Internal backend topology ko client se hide karna",
      "Client ki identity ko destination server se chhupaana jab woh internet browse kar raha ho",
      "Multiple backend services ke beech URL path ke basis pe request route karna",
    ],
    correctIndex: 2,
    explanation:
      "Client ki identity ko destination server se chhupaana forward proxy ka kaam hai, reverse proxy ka nahi — reverse proxy ulta backend server ki identity/topology client se chhupaata hai. SSL termination, topology hiding, aur path-based routing teeno genuine reverse proxy use cases hain.",
    difficulty: "hard",
  },
];

export default quiz;
