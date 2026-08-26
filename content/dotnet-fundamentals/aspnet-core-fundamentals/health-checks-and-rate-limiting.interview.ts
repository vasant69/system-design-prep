import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "healthchecks-tr-1",
    question: "Liveness aur readiness probes me exact fark kya hai, aur inhe alag rakhna kyun genuinely important hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Amazon", "TCS"],
    shortAnswer: "Liveness = 'process alive hai kya', fail -> restart. Readiness = 'traffic serve karne ready hai kya', fail -> traffic paused, no restart.",
    detailedAnswer:
      "Liveness probe ek minimal check hai jo sirf ye confirm karta hai ki app process fundamentally responsive hai — fail hone par orchestrator assume karta hai process kisi unrecoverable state (deadlock, hang) me hai aur restart kar deta hai. Readiness probe comprehensive hai — dependencies (database, downstream services) bhi verify karta hai — fail hone par orchestrator sirf load-balancer se traffic route karna rok deta hai, restart nahi karta, kyunki underlying issue (jaise database temporarily down) restart se solve nahi hoga. Inhe alag rakhna zaroori hai kyunki agar dependency checks liveness me chale jaayen, transient dependency issues unnecessary, potentially cascading container restarts trigger kar sakte hain jo actual problem ko address nahi karte.",
    followUp: "Ek scenario do jahan readiness fail ho lekin liveness pass ho — is state me app ka behavior kya hoga end-to-end?",
  },
  {
    id: "healthchecks-tr-2",
    question: "Ek naya developer database health check ko liveness probe me add kar deta hai 'thoroughness' ke liye. Ye kyun problematic hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Transient database issues (jo readiness ka concern hain) liveness me hone se unnecessary container restarts trigger karte hain, jo problem solve nahi karte aur cascading disruption create kar sakte hain.",
    detailedAnswer:
      "Database temporarily slow/unreachable hona ek recoverable, transient condition hai — restart karne se database wapas nahi aata, sirf ek perfectly healthy app process ko unnecessarily kill kiya jaata hai. Agar multiple instances same time pe is issue face karein (jaise database ek short outage se guzar raha ho), sab instances simultaneously restart honge — jab wo restart ho rahe honge, traffic serve karne ke liye koi instance available nahi hoga, jo situation ko worse bana deta hai (ek transient DB blip se poora service outage). Sahi jagah is check ki readiness probe hai, jahan failure sirf traffic-routing pause karta hai, restart nahi.",
    redFlag: "'Thoroughness ke liye sab checks liveness me daal do' jaisi soch — ye liveness aur readiness ke fundamentally different operational responses ko samajhne ki kami dikhata hai.",
  },
  {
    id: "healthchecks-tr-3",
    question: "Rate limiting ke 4 built-in algorithms (.NET 7+) kya hain, aur inme se kaunsa 'time-based' nahi hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Fixed Window, Sliding Window, Token Bucket, aur Concurrency Limiter — Concurrency Limiter time-based nahi hai, ye simultaneously in-flight requests count limit karta hai.",
    detailedAnswer:
      "Fixed Window, Sliding Window, aur Token Bucket teeno 'requests per time period' ko control karte hain, alag mechanisms se. Concurrency Limiter fundamentally alag dimension hai — ye time se independent hai, sirf ye limit karta hai ki ek saath, simultaneously kitne requests process ho rahe hain. Ye useful hai jab underlying constraint genuinely concurrency-based ho — jaise ek downstream external API jo sirf N simultaneous connections accept karta hai, chahe total request-rate kuch bhi ho.",
  },
  {
    id: "healthchecks-tr-4",
    question: "Fixed window rate limiter ka boundary-burst issue ek concrete example ke saath explain karo.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Agar limit 100 requests/minute hai, ek client window ke last second me 100 requests bhej sakta hai, phir naya window start hote hi turant 100 aur — effectively 200 requests ~2 seconds me, jo intended average rate se bahut zyada hai.",
    detailedAnswer:
      "Fixed window discrete, non-overlapping time buckets use karta hai (jaise 12:00:00-12:01:00, phir 12:01:00-12:02:00). Ek client jaanbujh kar (ya accidentally) 12:00:59 pe 100 requests bhej sakta hai (window 1 ka full limit use karke), aur phir 12:01:00 pe turant 100 aur bhej sakta hai (window 2 ka full limit, jo turant reset ho gaya). Result: sirf 1-2 seconds ke andar 200 requests process hui, jabki intended rate 100 requests/minute (roughly 1.67/second average) thi. Sliding window ya token bucket is exploit ko naturally prevent karte hain kyunki wo ek hard, discrete boundary pe rely nahi karte.",
  },
  {
    id: "healthchecks-tr-5",
    question: "Rate-limited request reject hone par kaunsa status code return hona chahiye, aur kaunsa additional header helpful hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "429 Too Many Requests, saath me typically Retry-After header jo client ko batata hai kitni der baad retry karna chahiye.",
    detailedAnswer:
      "429 specifically rate-limiting scenarios ke liye designed status code hai — ye client ko clear signal deta hai ki request khud invalid nahi thi (400 nahi), sirf temporarily throttled hui hai. Retry-After header (seconds ya ek HTTP date) client ko batata hai kab tak wait karna chahiye retry karne se pehle, jo well-behaved clients ko exponential-backoff ki jagah ek precise wait-time deta hai — better resource utilization dono sides ke liye.",
  },
  {
    id: "healthchecks-tr-6",
    question: "Ek external payment-gateway integration sirf 10 concurrent connections accept karta hai, chahe overall request-rate kuch bhi ho. Kaunsa rate limiting algorithm is constraint ko sabse accurately model karega?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Concurrency Limiter — kyunki constraint time-window-based nahi hai, ye simultaneously-in-flight requests pe hai.",
    detailedAnswer:
      "Fixed/Sliding Window aur Token Bucket sab 'requests per time unit' control karte hain — ye is scenario ko galat model karenge, kyunki underlying constraint actually 'kitni requests ek saath in-flight hain,' na ki 'kitni requests per second/minute.' Ek app 5 requests/second bhej sakti hai bina kisi window-limit todhe, lekin agar har request ka response time lamba hai (jaise 3 seconds), 15 requests simultaneously in-flight ho sakti hain — jo 10-concurrent-connection limit todh degi even though rate limits satisfied the. Concurrency Limiter directly is exact constraint ko model karta hai — max N requests simultaneously process ho sakti hain, chahe rate kuch bhi ho.",
  },
  {
    id: "healthchecks-tr-7",
    question: "Health check endpoints ko authentication ke peeche protect karna chahiye kya production me?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Generally nahi — orchestrators (Kubernetes) typically bina credentials ke in endpoints ko hit karte hain; auth lagane se health checks consistently fail dikhenge aur orchestrator galat action lega.",
    detailedAnswer:
      "Kubernetes liveness/readiness probes typically simple, unauthenticated HTTP GET requests bhejte hain configured endpoint pe — orchestrator credentials pass nahi karta by default. Agar health check endpoint [Authorize] ke peeche lock ho, probe hamesha 401/403 receive karega, jo orchestrator health-check-failure treat karega — resulting me app healthy hone ke bawajood restart-loop ya traffic-routing issues face karegi. Health endpoints ko authentication-free rakhna standard practice hai, lekin unhe sensitive information leak karne se bachana chahiye (jaise detailed exception messages ya internal architecture details) — sirf high-level healthy/unhealthy status expose karna sufficient hai.",
    redFlag: "'Security ke liye sab endpoints authenticate karo, health checks bhi' — ye operational requirement (orchestrator access) ko na samajhna dikhata hai.",
  },
  {
    id: "healthchecks-tr-8",
    question: "Sliding window rate limiting fixed window ke boundary-burst problem ko kaise reduce karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Sliding window ek single fixed boundary pe rely nahi karta — window ko chhote sub-segments me divide karke smoothly slide karta hai, isliye 2x-burst-at-boundary exploit possible nahi rehta.",
    detailedAnswer:
      "Fixed window discrete, non-overlapping buckets use karta hai jisme ek hard reset point hota hai — yahi exploit ka source hai. Sliding window internally window ko chhote segments me tod deta hai aur request-count ko in segments ke weighted-average ya rolling basis pe calculate karta hai, effectively ek continuously-moving window simulate karta hai discrete jump ke bajaye. Isse koi single, predictable moment nahi rehta jahan client double-burst kar sake — rate limit har point pe zyada consistently enforce hota hai, thodi extra memory/compute cost ke saath jo per-segment tracking maintain karne me lagti hai.",
  },
];

export default questions;
