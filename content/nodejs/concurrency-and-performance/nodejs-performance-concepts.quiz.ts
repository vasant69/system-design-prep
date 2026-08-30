import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nodejs-performance-concepts-1",
    question:
      "Node performance work ka pehla step kya hona chahiye, aur kyun?",
    options: [
      "Saare `for` loops ko `while` loops se replace karna, kyunki wo tez hote hain",
      "Measure karna — baseline throughput/latency (autocannon), flamegraph (clinic / --prof), event loop lag — kyunki bottleneck aksar counter-intuitive jagah hota hai (missing index, N+1 query, await in a loop) aur bina data ke tuning galat cheez optimize karti hai",
      "Redis cache add karna, kyunki caching hamesha fastest win hai",
      "`UV_THREADPOOL_SIZE` ko 128 set karna",
    ],
    correctIndex: 1,
    explanation:
      "Measure-first non-negotiable hai: profiler actual hot spot dikhata hai, jo guess se alag hota hai. Option A ek micro-optimization hai jo I/O-bound app mein bekaar hai. Option C caching ko blindly recommend karta hai bina invalidation story ke aur bina jaane bottleneck cache-able hai bhi. Option D thread pool ko blindly balloon karna hai — cores se zyada threads context-switching overhead dete hain.",
    difficulty: "easy",
  },
  {
    id: "nodejs-performance-concepts-2",
    question:
      "Ek login endpoint dev par 40ms leta hai lekin production mein 30 concurrent logins par p99 1200ms tak chala jaata hai. Kya wajah aur kya fix?",
    options: [
      "DB slow hai; ek bada instance chahiye",
      "Endpoint `crypto.pbkdf2Sync` (ya `scryptSync`) use kar raha hai — har call ~80ms main thread block karta hai, to concurrent logins ek thread par serialize ho jaate hain; fix hai async `crypto.pbkdf2` (libuv thread pool) par switch, aur zaroorat pade to `UV_THREADPOOL_SIZE` badhaana",
      "Node ka event loop concurrent requests handle nahi kar sakta; cluster hi ekmatra solution hai",
      "p99 hamesha aise spike karta hai; ye normal hai",
    ],
    correctIndex: 1,
    explanation:
      "Sync KDF har call event loop ko ~80ms ke liye block karta hai; N concurrent logins → N × 80ms serialized → p99 phat jaata hai, aur baaki endpoints bhi affect hote hain. Async `pbkdf2` kaam libuv thread pool (default 4) ko de deta hai; agar login bursts 4 threads bhi queue karein to `UV_THREADPOOL_SIZE=8`. Option A galat — DB involved hi nahi. Option C galat — event loop concurrent I/O handle karta hai; problem sync CPU block hai. Option D galat — ye ek fixable bug hai.",
    difficulty: "hard",
  },
  {
    id: "nodejs-performance-concepts-3",
    question:
      "In-process LRU cache aur Redis cache ke beech trade-off kya hai?",
    options: [
      "In-proc LRU hamesha better hai kyunki wo network use nahi karta",
      "In-proc LRU sabse fast hai (memory access, koi hop nahi) lekin per-process — cluster/replicas mein har worker ka apna copy, invalidation mushkil, aur process memory kha jata hai; Redis ek network hop leta hai lekin saare instances ke beech shared hai, bada capacity, aur TTL/invalidation clean",
      "Redis hamesha better hai kyunki wo persistent hai",
      "Dono identical hain; sirf syntax ka farak hai",
    ],
    correctIndex: 1,
    explanation:
      "Rule of thumb: chhota + super-hot + staleness-tolerant data → in-proc LRU; shared + larger + needs coordinated invalidation → Redis; production mein aksar dono layers (LRU aage, Redis peeche). Option A ignore karta hai ki LRU per-worker stale copies banata hai. Option C over-generalize karta hai — persistence har cache use case ke liye zaroori nahi. Option D galat — semantics bahut alag hain.",
    difficulty: "medium",
  },
  {
    id: "nodejs-performance-concepts-4",
    question:
      "Kaunsa metric set Node service ki health track karne ke liye sabse relevant hai?",
    options: [
      "Sirf average response time aur total request count",
      "Event loop lag, RSS vs heapUsed (gap growth = native/Buffer leak), p99 latency (average nahi), GC pause time, aur req/sec saath mein error rate",
      "CPU temperature aur disk RPM",
      "node_modules folder ka size aur dependency count",
    ],
    correctIndex: 1,
    explanation:
      "Event loop lag congestion dikhata hai; RSS vs heapUsed leak type distinguish karta hai; p99 (not average) worst-case user experience batata hai; GC pause time allocation problems flag karta hai; req/sec throughput hai lekin error rate ke bina meaningless. Option A par average outliers hide karta hai. Option C infra-level hai, app health nahi. Option D deployment size hai, runtime performance nahi.",
    difficulty: "medium",
  },
];

export default quiz;
