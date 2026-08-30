import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "npc-1",
    question:
      "Ek Node API slow hai. Tum kaise approach karoge? Ek checklist do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Pehle measure — baseline throughput/latency (`autocannon`), flamegraph (`clinic` / `node --prof`), event loop lag, aur slow-query log. Uske baad bottleneck type ke hisaab se checklist: event loop block hataao, I/O efficient karo (stream, pool, keep-alive), kaam kam karo (cache, paginate, compress), logging hot path se hataao, cores use karo. Har change ke baad dobara measure.",
    detailedAnswer:
      "Measure-first non-negotiable hai kyunki asli bottleneck aksar guess se alag hota hai — missing index, N+1 query, `await` in a loop, ek sync `JSON.parse`. Steps:\n\n1. Baseline: `autocannon -c 50 -d 20`, note p99 aur req/s aur error rate.\n2. Flamegraph: `clinic flame` ya `node --prof` — CPU hot spot dikhta hai.\n3. Event loop lag: `perf_hooks.monitorEventLoopDelay()` — `<10ms` healthy, `>100ms` congested.\n4. Then, based on findings:\n   - CPU block on main thread → `worker_threads` pool, cache the result, no `*Sync` in handlers.\n   - Too many / slow DB calls → add index, fix N+1, connection pool, cache hot reads.\n   - Large payloads / memory spikes → stream via `pipeline`, paginate, compress, smaller JSON.\n   - Not using all cores → cluster / replicas (+ shared state to Redis).\n   - GC pauses → reduce allocations, stream instead of buffer.\n5. Re-measure and compare p99, req/s, error rate.\n\nMain guess karke tune nahi karta — har suggestion ke saath uska 'kyun' hota hai aur measurement se back hota hai.",
    followUp:
      "Agar flamegraph flat hai (koi CPU hot spot nahi) lekin latency high hai, to kahan dekhoge?",
    redFlag:
      "Bina profile kiye 'performance refactor' shuru karna — aksar galat cheez optimize hoti hai.",
  },
  {
    id: "npc-2",
    question:
      "\"Event loop ko block mat karo\" ka matlab kya hai aur wo Node performance mein #1 concern kyun hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Node ka JavaScript ek thread par chalta hai. Ek synchronous CPU-heavy operation (bada `JSON.parse`, `crypto.*Sync`, image resize, tight loop, catastrophic regex) us dauran poore server ko rok deta hai — koi doosra request, timer, ya I/O callback nahi chalta. Isliye ek endpoint ka CPU spike har concurrent request ka p99 badha deta hai.",
    detailedAnswer:
      "Concurrency ka source Node mein I/O-wait ka overlap hai — jab ek request DB/network ka wait kar rahi hoti hai, loop doosri handle karta hai. CPU-bound sync kaam mein koi wait nahi; wo main thread ko poore duration ke liye kabza karta hai. 50 req/s par ek 200ms block ≈ 10 requests stalled, aur wo saari 200ms+ latency dekhti hain chahe unka apna kaam 2ms ho.\n\nFixes: (1) kya wo CPU kaam request path mein zaroori hai? Pre-compute / cache. (2) `worker_threads` pool (`piscina`) — function ko worker par, main loop free. (3) Background queue (BullMQ/SQS) + async response. (4) Alag service.\n\nGalat 'fixes': `setTimeout(fn, 0)` — sync kaam abhi bhi block karega, bas baad mein. `cluster` — throughput cores ke saath badhega par per-request stall wahi rahega (har worker ka apna loop block hoga). Diagnostic: event loop lag metric spike karega jab ye ho raha ho.",
    followUp:
      "Kaunse operations Node automatically thread pool par offload karta hai, aur kaunse nahi?",
  },
  {
    id: "npc-3",
    question:
      "Caching add karne ka decision — in-process LRU vs Redis — kaise lete ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "In-proc LRU (`lru-cache`): fastest (memory, no network), lekin per-process — cluster/replicas mein har worker ka apna copy, invalidation mushkil, process memory kha jata hai. Redis: ek network hop (sub-ms LAN), lekin shared across instances, bada capacity, TTL/invalidation clean. Chhota + super-hot + staleness-tolerant → in-proc; shared + larger + needs invalidation → Redis; aksar dono layers.",
    detailedAnswer:
      "Concrete decision factors: (1) Data size — MBs of reference data har worker mein duplicate karna memory waste, Redis better. (2) Consistency — agar stale data unacceptable hai aur multiple instances hain, LRU alone galat (har worker alag stale), Redis + short TTL + pub/sub invalidation. (3) Hit latency — LRU ~0.1ms, Redis ~1ms; agar endpoint ultra-hot hai aur staleness OK, LRU aage laga do Redis ke saath peeche. (4) Cold start — naya worker/instance ka LRU khali; Redis use warm rakhta hai.\n\nHamesha ek invalidation story: TTL kya, invalidate kaise (event / pub-sub / versioned key), staleness kitna tolerable. Cache without invalidation strategy ek bug hai, optimization nahi.\n\nReal pattern: `/config` endpoint — 60s LRU per worker + 5min Redis behind it; config update par Redis pub/sub message jo saare workers ka local LRU clear karta hai. p99 90ms → 3ms, DB volume −99%.",
    followUp:
      "Cluster mode mein in-proc LRU ka hit rate kyun gir jaata hai?",
    redFlag:
      "Cache add karna bina TTL ya invalidation — stale data serve hota hai aur har worker ka apna alag stale copy.",
  },
  {
    id: "npc-4",
    question:
      "Kaunse metrics tum ek Node service ke liye monitor karoge aur har ek kya batata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Event loop lag (loop congestion — `<10ms` healthy), RSS vs heapUsed (leak detection — badhta gap = native/Buffer leak, dono ka steady growth = JS leak), p99 latency (worst-case UX, average nahi), GC pause time (allocation problems), aur req/sec saath mein error rate (throughput jo errors ke bina meaningful hai).",
    detailedAnswer:
      "1. **Event loop lag**: `perf_hooks.monitorEventLoopDelay()` — ek timer scheduled T ms baad kitni der se chala. Consistently `>100ms` matlab CPU block ya overload. Ye Node-specific health signal hai.\n2. **RSS vs heapUsed**: `process.memoryUsage()`. `heapUsed` = live JS objects; `rss` = total process (heap + buffers + native). Growing gap = Buffer/native leak; both growing steadily = JS object leak. Trend dekho, single value nahi.\n3. **p99 (aur p99.9) latency**: average ek 2s outlier ko hide kar deta hai jo 1% users ko har baar hit karta hai. SLOs aur alerts percentiles par.\n4. **GC pause time**: `--trace-gc` ya `perf_hooks`. Frequent long pauses = allocation churn; streaming aur kam allocation se fix.\n5. **req/sec + error rate**: throughput number, lekin 5% errors ke saath high req/s koi win nahi. Dono saath.\n\nInfra metrics (CPU%, memory%) bhi rakho lekin ye app-level signals pehle dekhne chahiye.",
    followUp:
      "RSS steady hai lekin heapUsed sawtooth pattern mein badh-ghat raha hai — kya ye leak hai?",
  },
  {
    id: "npc-5",
    question:
      "`UV_THREADPOOL_SIZE` kya hai? Ise kab aur kaise adjust karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "libuv ka thread pool (default 4) jo file system operations, DNS `lookup`, `crypto.pbkdf2`/`scrypt`, aur async `zlib` chalata hai. Ise tab badhao jab measurement dikhaye ki ye operations queue ho rahe hain — load par latency badhti hai bina CPU saturate hue — aur CPU cores ke aas-paas rakho, blindly 128 nahi.",
    detailedAnswer:
      "Node ka network I/O OS-level non-blocking hai aur thread pool use nahi karta. Lekin kuch cheezein OS non-blocking nahi deta: fs operations, `dns.lookup` (getaddrinfo), CPU-heavy crypto KDFs, aur async compression. Wo 4-thread pool par chalte hain; agar tumhari app bahut concurrent file I/O ya password hashing karti hai, 4 threads bottleneck ban jate hain — kaam queue mein baithta hai chahe CPU free ho.\n\nDiagnosis: load test mein latency badhti hai lekin CPU % saturated nahi, aur affected operations sab thread-pool wale hain (uploads, logins with KDF). Fix: `UV_THREADPOOL_SIZE=8` (env var, process start se pehle set karni padti hai — runtime mein nahi badalti). Cores ke aas-paas ya thoda upar rakho.\n\nCatch: har thread memory leta hai, aur CPU cores se kaafi zyada threads context-switching overhead dete hain — 128 karna aksar ulta padta hai. Aur ye per-request CPU stall (arbitrary JS sync code) ko fix nahi karta — wo `worker_threads` ka domain hai.",
    followUp:
      "`dns.lookup` thread pool use karta hai lekin `dns.resolve` nahi — kyun, aur iska kya practical asar hai?",
  },
];

export default questions;
