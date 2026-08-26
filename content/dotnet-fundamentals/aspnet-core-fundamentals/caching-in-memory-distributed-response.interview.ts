import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "caching-tr-1",
    question: "IMemoryCache aur IDistributedCache me kya fundamental difference hai, aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Flipkart"],
    shortAnswer: "IMemoryCache in-process, fast, per-instance hai; IDistributedCache shared external store (Redis) hai, thoda slower lekin multi-instance consistent.",
    detailedAnswer:
      "IMemoryCache process ki apni local RAM me data store karta hai — bahut fast (no network hop), lekin har instance ka cache independent hota hai. Single-instance apps ke liye ideal. IDistributedCache ek shared external store (typically Redis) use karta hai — sab instances same data dekhte hain, isliye horizontally-scaled deployments me consistency milti hai, network round-trip ki extra latency cost ke saath. Choice deployment topology pe depend karti hai — agar app kabhi multiple instances me scale hogi, IDistributedCache safer default hai.",
    followUp: "Agar app abhi single-instance hai lekin future me scale ho sakti hai, kaunsa design decision lena chahiye?",
  },
  {
    id: "caching-tr-2",
    question: "Ye scenario explain karo: ek production e-commerce app single instance pe theek chal rahi thi IMemoryCache ke saath. Traffic badhne pe 3 instances add ki gayin, aur customers ko intermittently purani price dikhne lagi. Root cause kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "IMemoryCache per-instance hai — jab price update ek instance ke through hui, doosri instances ka cache us update se unaware raha, unhone stale price serve karna continue kiya.",
    detailedAnswer:
      "Jab app single-instance thi, sirf ek IMemoryCache tha — update aur read dono usi cache ko affect karte the, consistency naturally maintain rehti thi. 3 instances add hone ke baad, har instance ki apni alag IMemoryCache copy hai. Price update jis instance ke through hui, sirf uska local cache update/invalidate hua — baaki do instances ka cache purani value hold karta raha jab tak wo naturally expire na ho (TimeSpan-based). Load balancer requests ko round-robin/random distribute karta hai, isliye customer ko kaunsi price dikhegi, ye is baat pe depend karta hai ki request kaunsi instance ne handle ki — intermittent, non-deterministic symptom. Fix: IDistributedCache (Redis) pe migrate karna taaki sab instances same source of truth se read/write karein.",
  },
  {
    id: "caching-tr-3",
    question: "Cache-aside pattern kya hai, aur ye kis problem ko solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Application khud cache aur data source ke beech coordinate karta hai — cache check karo, miss ho to source se fetch karo, cache populate karo, return karo.",
    detailedAnswer:
      "Cache-aside (lazy loading) sabse common caching pattern hai: request aane par pehle cache check hota hai. Agar hit, cached value directly return. Agar miss, actual data source (database/API) se fetch karke value get ki jaati hai, phir cache me store karke return ki jaati hai. Ye pattern ensure karta hai ki sirf actually-requested data cache ho (na ki poori dataset preemptively load ho), aur cache miss hone pe application gracefully source se fallback kar sake. Iska trade-off ye hai ki pehli request (cache miss) hamesha thodi slower hogi source-fetch ki wajah se.",
  },
  {
    id: "caching-tr-4",
    question: "Kya ye statement sahi hai: 'Caching lagane se application hamesha faster ho jaati hai, isliye jitna zyada cache karo utna better'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — caching frequently-changing data pe stale-data bugs create karti hai, aur unnecessary caching complexity/memory overhead badhati hai bina proportional benefit ke.",
    detailedAnswer:
      "Caching ka benefit tab hi milta hai jab data (a) read-heavy ho, (b) compute/fetch karna expensive ho, aur (c) relatively rarely change ho. Frequently-changing data (jaise real-time stock prices, live inventory counts) ko aggressively cache karna stale-data bugs create karta hai jo genuinely production incidents ban sakte hain. Har cheez cache karna bhi unnecessary memory overhead (IMemoryCache) ya operational complexity/cost (Redis infrastructure) add karta hai bina proportional performance benefit ke. Sahi approach hai selectively cache karna — data ke change-frequency aur fetch-cost ke against evaluate karke.",
    redFlag: "'Zyada caching hamesha better hai' jaisa blanket statement — ye data-characteristics-based decision-making ki absence dikhata hai.",
  },
  {
    id: "caching-tr-5",
    question: "Response Caching middleware aur Output Caching (.NET 7+) me kab kaunsa choose karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Response Caching simple, header-driven, client/CDN-side scenarios ke liye theek hai; Output Caching zyada control chahiye ho (vary-by, programmatic invalidation, server-side storage) to better hai.",
    detailedAnswer:
      "Response Caching primarily Cache-Control headers set karta hai — ye tab useful hai jab tumhe browser ya CDN-level caching chahiye, aur server ko khud response store karne ki zaroorat nahi. Output Caching server-side actual response body store karta hai ek configurable cache store me, aur vary-by-query-string/header policies, tag-based invalidation jaisi richer features deta hai — programmatically kisi specific cached entry ko invalidate karna possible hai (jaise ek product update hone par sirf uska cached response clear karna). Jab fine-grained control chahiye ho, ya CDN involved na ho, Output Caching zyada flexible choice hai.",
  },
  {
    id: "caching-tr-6",
    question: "Agar Redis (IDistributedCache backing store) temporarily unavailable ho jaaye, application ko kaise design karna chahiye?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Cache failure ko gracefully handle karo — fallback directly source (database) se fetch karo, poori request fail nahi honi chahiye sirf isliye ki cache down hai.",
    detailedAnswer:
      "Ek robust caching layer cache-store-unavailability ko ek non-fatal condition treat karta hai — agar Redis call timeout/exception de, application code ko catch karke directly underlying data source se fetch karna chahiye (effectively cache-miss jaisa treat karna), na ki poori request 500 error ke saath fail karna. Production-grade implementations often ek circuit-breaker pattern (jaise Polly library se) bhi add karte hain taaki repeated failed Redis calls unnecessary latency add na karein jab Redis clearly down ho — turant fallback ho jaaye bina retry-wait kiye.",
  },
  {
    id: "caching-tr-7",
    question: "IDistributedCache ka raw API (GetStringAsync/SetStringAsync) use karte waqt kya extra kaam karna padta hai jo IMemoryCache me automatically hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Manual JSON serialization/deserialization — IDistributedCache byte-array/string based hai, IMemoryCache directly .NET objects store kar sakta hai.",
    detailedAnswer:
      "IMemoryCache.Set()/Get() directly kisi bhi .NET object ko reference ke roop me store kar sakta hai (kyunki same process memory hai) — koi serialization nahi chahiye. IDistributedCache ek external store (Redis) ke saath communicate karta hai jo sirf bytes/strings samajhta hai, isliye object ko manually JSON (ya kisi format) me serialize karna padta hai set karte waqt, aur deserialize karna padta hai get karte waqt. Ye ek common reason hai ki teams IDistributedCache ke upar apna thin, type-safe wrapper helper likhte hain taaki har jagah manual serialization code na dohrana pade.",
  },
  {
    id: "caching-tr-8",
    question: "Ye code kya output karega assuming product 5 pehle se cache me hai aur GetOrCreate ka factory delegate register hai?\n```csharp\nvar p1 = cache.GetOrCreate(\"product-5\", entry => { Console.WriteLine(\"Fetching from DB\"); return FetchFromDb(5); });\nvar p2 = cache.GetOrCreate(\"product-5\", entry => { Console.WriteLine(\"Fetching from DB\"); return FetchFromDb(5); });\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "'Fetching from DB' sirf ek baar print hoga — pehli call cache miss hai (factory chalta hai), dusri call cache hit hai (factory skip hota hai).",
    detailedAnswer:
      "GetOrCreate() pehle cache me key check karta hai. Pehli call pe 'product-5' cache me nahi hai (ya expired ho chuka), isliye factory delegate execute hota hai, 'Fetching from DB' print hota hai, aur result cache me store ho jaata hai. Dusri call pe same key ab cache me maujood hai (abhi expire nahi hua), isliye factory delegate bilkul call hi nahi hota — cached value directly return ho jaati hai bina 'Fetching from DB' print kiye dubara.",
  },
];

export default questions;
