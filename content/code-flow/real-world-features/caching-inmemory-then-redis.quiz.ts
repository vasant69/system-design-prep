import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "caching-inmemory-then-redis-1",
    question:
      "Cache-aside pattern me `GetOrCreateAsync` ki factory (DB load) kab chalti hai?",
    options: [
      "Har request pe, aur uska result cache se compare hota hai",
      "Sirf cache miss pe — key na mile ya expire ho chuki ho",
      "Sirf app startup pe ek baar",
      "Har baar jab koi write hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`GetOrCreateAsync` pehle key dekhta hai; hit pe cached value seedha return, factory chalti hi nahi. Factory sirf miss pe (key absent ya expired) chalti hai, aur uska result cache me daal kar return hota hai. Option A galat — hit pe DB ko touch nahi karte, wahi to point hai. Option C galat — ye lazy hai, startup pe nahi. Option D galat — write pe hum evict karte hain (`Remove`), factory tab nahi chalti; agli read pe chalti hai.",
    difficulty: "easy",
  },
  {
    id: "caching-inmemory-then-redis-2",
    question:
      "Ek entry pe sirf `SlidingExpiration = 2 min` set hai, koi absolute expiration nahi. Kya risk hai?",
    options: [
      "Entry 2 minute baad hamesha evict ho jaayegi chahe access ho ya na ho",
      "Agar entry ko har 2 minute ke andar access hota rahe, wo kabhi refresh nahi hogi aur unbounded stale ho sakti hai",
      "`IMemoryCache` exception phenkega kyunki absolute mandatory hai",
      "Sliding expiration `IMemoryCache` me supported hi nahi",
    ],
    correctIndex: 1,
    explanation:
      "Sliding expiration har access pe reset hota hai. Ek hot entry jise lagataar padha jaa raha hai wo kabhi expire nahi hogi — data mahino purana ho sakta hai. Isliye sliding ke saath ek absolute expiration bhi do jo max staleness cap kare. Option A galat — sliding idle timeout hai, hard deadline nahi. Option C galat — absolute mandatory nahi hai (bas recommended). Option D galat — dono supported hain.",
    difficulty: "medium",
  },
  {
    id: "caching-inmemory-then-redis-3",
    question:
      "App 4 instances pe chal raha hai. `IMemoryCache` me department list cached hai. Admin ek department rename karta hai; us request ko handle karne waala pod apni cache evict kar deta hai. Ab kya hota hai?",
    options: [
      "Saare 4 pods ki cache turant evict ho jaati hai",
      "Baaki 3 pods apni purani cache serve karte rehte hain jab tak unki TTL khatam na ho — user ko pod ke hisaab se naya ya purana naam dikhta hai",
      "Load balancer automatically saari cache clear kar deta hai",
      "Rename fail ho jaata hai kyunki cache locked hai",
    ],
    correctIndex: 1,
    explanation:
      "`IMemoryCache` per-process hai — har pod ki apni alag copy. Ek pod ka `Remove` sirf usi pod ko affect karta hai; baaki 3 apni stale copy TTL tak serve karte hain, isliye response instance ke hisaab se inconsistent. Ye exactly wo reason hai ki multi-instance pe `IDistributedCache` + Redis (shared store) chahiye. Option A/C galat — cross-process eviction ka koi built-in mechanism nahi. Option D galat — cache read/write se writes block nahi hote.",
    difficulty: "medium",
  },
  {
    id: "caching-inmemory-then-redis-4",
    question:
      "In me se kaunsa data ek BFSI API me cache karna sabse zyada khatarnaak hai?",
    options: [
      "Branch list aur IFSC codes",
      "Product catalogue aur currency codes",
      "Account balance aur transaction history",
      "Public holiday calendar",
    ],
    correctIndex: 2,
    explanation:
      "Account balance aur transaction history authoritative reads hain — stale value pe user ya system ek galat financial decision le sakta hai, aur regulator inhe fresh expect karta hai. Baaki teen options reference/lookup data hain: low churn, non-sensitive, sabke liye same — caching ke liye ideal. Balance jaisa data agar cache karna bhi ho to bahut short TTL + per-user key + write pe strict invalidation, aur aksar bilkul nahi.",
    difficulty: "easy",
  },
];

export default quiz;
