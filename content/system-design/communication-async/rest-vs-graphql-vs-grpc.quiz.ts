import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rgg-1",
    question: "REST API mein 'over-fetching' problem ka sabse accurate example kaunsa hai?",
    options: [
      "Client ko ek resource fetch karne ke liye 3 alag API calls karni padti hain",
      "Client sirf user ka naam chahta hai lekin server poora user object (address, preferences, sab) bhej deta hai",
      "Server response bhejne mein bahut time leta hai",
      "Client galat HTTP method (POST instead of GET) use karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Over-fetching tab hota hai jab response mein zaroorat se zyada data aa jaaye — jaise sirf naam chahiye tha lekin poora object mil gaya. Multiple calls karna (A) under-fetching hai, alag problem. Slow response (C) aur galat method (D) over-fetching se unrelated hain.",
    difficulty: "easy",
  },
  {
    id: "rgg-2",
    question: "GraphQL ka N+1 query problem kya hai aur usko typically kaise solve karte hain?",
    options: [
      "GraphQL server crash ho jaata hai N+1 requests ke baad — rate limiting se solve hota hai",
      "Naively resolve karne par nested fields (jaise har post ke comments) ke liye alag-alag database query fire ho jaati hai — DataLoader jaisa batching pattern isse solve karta hai",
      "Client N+1 baar same query bhejta hai — caching se solve hota hai",
      "Yeh sirf REST mein hota hai, GraphQL mein nahi",
    ],
    correctIndex: 1,
    explanation:
      "N+1 problem backend resolver-level issue hai — nested data resolve karte waqt har parent record ke liye alag query fire ho jaati hai agar batching na ho. DataLoader jaisa pattern requests ko batch/cache karke ek query mein combine karta hai. Baaki options premise hi galat hain.",
    difficulty: "hard",
  },
  {
    id: "rgg-3",
    question: "Internal microservice-to-microservice communication ke liye, jahan latency aur throughput critical hai, kaunsa approach typically best fit hai?",
    options: [
      "GraphQL, kyunki flexible queries allow karta hai",
      "REST with JSON, kyunki universal hai",
      "gRPC, kyunki binary Protobuf serialization aur HTTP/2 multiplexing fast, strongly-typed communication dete hain",
      "Long polling, kyunki simple hai",
    ],
    correctIndex: 2,
    explanation:
      "gRPC specifically internal service-to-service ke liye design hua hai — Protobuf ka binary format JSON se chhota/fast hota hai, aur HTTP/2 multiplexing plus strong typing se contracts compile-time pe validate hote hain. GraphQL client-driven flexibility ke liye better hai, REST public APIs ke liye, long polling real-time updates ke liye — inme se koi bhi is specific use-case ka best fit nahi hai.",
    difficulty: "medium",
  },
  {
    id: "rgg-4",
    question: "gRPC ko ek public, third-party-facing browser API ke liye choose karna kyun aksar galat decision hota hai?",
    options: [
      "gRPC HTTPS support nahi karta",
      "gRPC sirf internal networks mein hi kaam karta hai technically",
      "Historically browsers gRPC ko directly support nahi karte the, aur binary Protobuf format debugging/tooling (Postman, curl se quick inspect) ke liye human-readable nahi hai",
      "gRPC JSON se dheema hai",
    ],
    correctIndex: 2,
    explanation:
      "gRPC ka browser support historically weak raha hai (grpc-web jaisa proxy workaround chahiye), aur binary format ko directly read/debug karna mushkil hai jaisa REST/JSON mein trivial hota hai. HTTPS support (A) available hai. Yeh koi network-restriction (B) ka issue nahi hai. gRPC JSON se slow nahi, balki generally fast hai (D galat).",
    difficulty: "medium",
  },
];

export default quiz;
