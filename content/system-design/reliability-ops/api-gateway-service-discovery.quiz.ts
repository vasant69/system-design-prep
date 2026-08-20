import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "agsd-1",
    question: "API Gateway ki cross-cutting responsibilities mein kaunsa sahi set hai?",
    options: [
      "Sirf load balancing, aur kuch nahi",
      "Routing, authentication/authorization at the edge, rate limiting, aur request/response transformation",
      "Sirf database queries ko cache karna",
      "Business logic jaise pricing aur discount rules execute karna",
    ],
    correctIndex: 1,
    explanation:
      "Gateway routing, auth, rate limiting, aur transformation jaisi cross-cutting concerns centralize karta hai, taaki individual services inhe reimplement na karein. A incomplete hai — gateway sirf load balancer nahi hai. C is topic se unrelated hai. D galat hai aur ek genuine anti-pattern hai — business logic gateway mein daalna use hidden monolith bana deta hai.",
    difficulty: "easy",
  },
  {
    id: "agsd-2",
    question: "Agar ek team API Gateway ke andar business rules (jaise 'order amount 500 se zyada to discount apply karo') likhna shuru kar de, to sabse bada risk kya hai?",
    options: [
      "Koi risk nahi, gateway koi bhi logic handle kar sakta hai",
      "Gateway khud ek hidden monolith/bottleneck ban jaata hai, jo microservices split karne ka poora purpose defeat kar deta hai",
      "Yeh sirf latency thodi badha dega, architecturally koi issue nahi",
      "Isse services automatically better isolated ho jaayengi",
    ],
    correctIndex: 1,
    explanation:
      "Jab business logic gateway mein leak hoti hai, saari services us par indirectly dependent ho jaati hain aur gateway ek single coordination point/bottleneck ban jaata hai — exactly wahi problem jo microservices split karke avoid karna tha. A, C, aur D is genuine architectural risk ko miss karte hain.",
    difficulty: "medium",
  },
  {
    id: "agsd-3",
    question: "Client-side service discovery (jaise classic Netflix Eureka + Ribbon pattern) aur server-side discovery (jaise Kubernetes Services) mein core difference kya hai?",
    options: [
      "Client-side discovery mein koi registry hoti hi nahi hai",
      "Client-side discovery mein calling service khud registry query karke instance choose karti hai; server-side discovery mein client sirf ek fixed router/load-balancer ko call karta hai jo internally registry query karta hai",
      "Server-side discovery sirf on-premise systems mein kaam karta hai, cloud mein nahi",
      "Dono approaches bilkul identical hain, sirf naam alag hai",
    ],
    correctIndex: 1,
    explanation:
      "Client-side discovery mein calling service registry se directly baat karke khud instance select/load-balance karti hai (client thoda 'smart' hota hai). Server-side discovery mein client ko registry ka pata hi nahi hota — woh sirf ek stable router/load-balancer address call karta hai, jo internally routing decide karta hai (client simple rehta hai, ek extra hop lagta hai). A galat hai, dono approaches mein registry hoti hai. C aur D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "agsd-4",
    question: "Ek service registry mein ek instance ka entry 'stale/dead' kab mark hoke remove ki jaati hai?",
    options: [
      "Jab tak koi manually registry se entry delete na kare, woh kabhi remove nahi hoti",
      "Jab instance ek certain time window (TTL) ke andar heartbeat ya health-check probe se apni liveness prove nahi kar paata",
      "Har 24 hours mein automatically, chahe instance healthy ho ya na ho",
      "Sirf jab poora datacenter down ho jaaye",
    ],
    correctIndex: 1,
    explanation:
      "Chahe self-registration ho (instance khud heartbeat bhejta hai) ya third-party registrar (external health checks), core mechanism same hai: health checks + TTL/heartbeat. Agar instance defined window ke andar liveness prove nahi karta, registry usse stale maan ke hata deta hai, taaki koi service dead instance ko call na kare. A, C, aur D sab is actual mechanism se galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
