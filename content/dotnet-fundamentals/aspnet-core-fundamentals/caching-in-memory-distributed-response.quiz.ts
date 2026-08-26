import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "caching-1",
    question: "Ek app IMemoryCache use kar rahi hai aur 3 instances (load balancer ke peeche) me deploy hui hai. Instance A ek entry cache karta hai; Instance B ke through underlying data update hota hai. Kya hoga?",
    options: [
      "Instance A ka cache automatically invalidate ho jaayega",
      "Instance A ka cache stale rahega — koi error nahi aayega, bas kabhi-kabhi purana data serve hoga",
      "Poori application crash ho jaayegi",
      "IMemoryCache automatically IDistributedCache me convert ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "IMemoryCache process ki apni local RAM me store hota hai — har instance ka cache completely independent hai, koi cross-instance communication nahi hoti. Instance A ko Instance B ke update ka pata hi nahi chalega, isliye wo silently stale data serve karta rahega bina kisi error/crash ke. Options A, C, D is fundamental per-instance limitation ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "caching-2",
    question: "IDistributedCache, IMemoryCache se dheema kyun hota hai?",
    options: [
      "IDistributedCache internally zyada complex algorithm use karta hai",
      "IDistributedCache ek external store (jaise Redis) ke saath network round-trip involve karta hai, IMemoryCache sirf in-process RAM access karta hai",
      "IDistributedCache hamesha disk pe data store karta hai, RAM me nahi",
      "Ye galat hai, IDistributedCache actually IMemoryCache se fast hota hai",
    ],
    correctIndex: 1,
    explanation:
      "IMemoryCache same process ki RAM se directly read karta hai — sabse fast possible access. IDistributedCache ek separate service (Redis) ke saath network call karta hai, jo inherently in-process memory access se slower hai. Ye trade-off consistency ke liye acceptable hai jab multiple instances hon. Options A, C, D is speed-difference ke actual cause ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "caching-3",
    question: "SlidingExpiration aur AbsoluteExpiration me kya fark hai?",
    options: [
      "Dono same hain, sirf naming convention alag hai",
      "SlidingExpiration last-access se timer reset karta hai; AbsoluteExpiration ek fixed time pe expire hota hai chahe access ho ya na ho",
      "SlidingExpiration sirf IMemoryCache ke liye hai, AbsoluteExpiration sirf IDistributedCache ke liye",
      "AbsoluteExpiration hamesha SlidingExpiration se lamba hota hai",
    ],
    correctIndex: 1,
    explanation:
      "SlidingExpiration ka timer har access pe reset hota hai — agar entry regularly access ho rahi hai, wo kabhi expire nahi hogi jab tak access rukta nahi. AbsoluteExpiration ek fixed cutoff time set karta hai — chahe entry constantly access ho rahi ho, wo us fixed time pe expire ho jaayegi. Options A, C, D in dono mechanisms ke actual behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "caching-4",
    question: "Response Caching (Cache-Control headers) aur Output Caching (.NET 7+) me practical difference kya hai?",
    options: [
      "Dono exactly same cheez hain, sirf naam alag hai",
      "Response Caching sirf headers set karta hai (browser/proxy/CDN-side caching), Output Caching server-side poora response cache karta hai with more control (vary-by, programmatic invalidation)",
      "Response Caching sirf GET requests ke liye hai, Output Caching sirf POST ke liye",
      "Output Caching deprecated ho chuka hai, Response Caching hi use karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Response Caching middleware Cache-Control headers set karta hai — actual caching client/proxy/CDN pe hoti hai, server khud data store nahi karta by default. Output Caching (.NET 7+) server-side hi rendered response ko store karta hai, jisse vary-by-query/header support aur programmatic invalidation jaisi flexibility milti hai jo pure header-based approach me nahi hoti. Options A, C, D in dono mechanisms ke actual scope ko galat represent karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
