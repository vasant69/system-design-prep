import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fafb-1",
    question:
      "Production mein ek endpoint under load slow hai. Shuru se end tak apna debugging process batao.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Repeatable load test banao (`autocannon`, production-shaped payload + concurrency) aur baseline lo (p99, req/s, error rate). Symptoms se hypothesis banao — 'dev fine, load bad, high CPU, p50 OK p99 bad' = event loop blocking. Confirm karo loop lag se. Flamegraph lo load ke dauran (`clinic doctor` + `node --cpu-prof`). Widest frame pehle fix karo, ek change at a time, har baar wahi load test dobara.",
    detailedAnswer:
      "1. **Repro + baseline**: `autocannon -m POST -b @prod-sized-payload.json -c 50 -d 30 <url>`. Record p50, p99, req/s, error rate. Ye exact command har change ke baad dobara chalega.\n2. **Hypothesis**: dev par theek + load par kharab + CPU high + p50 acceptable but p99 terrible → event-loop congestion (kuch sync CPU work har request par loop block kar raha).\n3. **Confirm**: server mein `perf_hooks.monitorEventLoopDelay()` enable karo, load ke dauran mean/p99 print karo. `<10ms` healthy; `200ms+` = severe.\n4. **Profile under load**: `clinic doctor` high-level diagnosis ('synchronous work') deta hai; `node --cpu-prof` exact functions. Chrome DevTools ya speedscope.app mein kholo. Single request par nahi — contention sirf concurrent load par dikhti hai.\n5. **Read flamegraph**: width = time. Widest frames = hot spots.\n6. **Fix iteratively**: widest tower pehle, ek change, re-run load test, next.\n7. **Negative check**: agar flamegraph flat hai (CPU idle) to problem CPU nahi — downstream I/O. Distributed tracing + slow-query logs.\n\nCommon culprits jo main pehle suspect karta hoon: sync `JSON.parse` of a large body, sync `crypto` (`*Sync` / KDF), missing cache on a hot lookup, `await` in a loop.",
    followUp:
      "Flamegraph bilkul flat hai aur CPU 20% par hai lekin p99 3s hai. Ab kya?",
    redFlag:
      "'Bas aur instances add kar dete hain' — bina profile kiye scaling se congestion har instance par wahi rahega aur cost badh jayegi.",
  },
  {
    id: "fafb-2",
    question:
      "Event loop lag kya hai, kaise measure karte ho, aur healthy value kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Event loop lag = ek timer jo `T` ms baad scheduled tha, wo actually kitni der se chala — yaani loop ek iteration mein kitna 'behind' ho raha hai. Measure: `perf_hooks.monitorEventLoopDelay()` (histogram: mean, percentile, max). Healthy `< 10ms`; consistently `> 100ms` matlab loop congested hai (CPU block ya overload).",
    detailedAnswer:
      "```javascript\nconst { monitorEventLoopDelay } = require('node:perf_hooks');\nconst h = monitorEventLoopDelay({ resolution: 20 });\nh.enable();\nsetInterval(() => {\n  console.log('mean', (h.mean / 1e6).toFixed(1),\n              'p99', (h.percentile(99) / 1e6).toFixed(1),\n              'max', (h.max / 1e6).toFixed(1));\n  h.reset();\n}, 2000);\n```\n\nValues nanoseconds mein aate hain, isliye `/ 1e6` for ms. Ye metric batata hai ki koi callback loop ko kitni der ke liye kabza kar raha hai — agar ek request handler ek 200ms sync `JSON.parse` karta hai, us dauran lag 200ms ke aas-paas dikhega. Production mein ise ek gauge metric ke roop mein export karo (Prometheus etc.) aur alert `>50-100ms` par. Ek quick-and-dirty version bina perf_hooks ke: `let last = Date.now(); setInterval(() => { const drift = Date.now() - last - 1000; last = Date.now(); console.log('drift', drift); }, 1000);` — 1s interval kitni der se fire hua.",
    followUp:
      "Loop lag high hai lekin CPU sirf 40% par hai — kya iska matlab CPU-bound blocking nahi hai?",
  },
  {
    id: "fafb-3",
    question:
      "`clinic doctor`, `node --cpu-prof`, aur `node --prof` mein kya farak hai? Tum kaunsa kab use karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`clinic doctor` ek high-level diagnosis deta hai (CPU / event loop / memory / handles graphs + ek plain-English guess jaise 'synchronous work'). `node --cpu-prof` ek `.cpuprofile` file deta hai jise DevTools/speedscope mein flamegraph ki tarah kholte ho — exact functions aur self-time. `node --prof` V8 ka raw tick profiler hai, `--prof-process` se text report — same info, kam friendly. Main pehle `clinic doctor` for direction, phir `--cpu-prof` for the exact frame.",
    detailedAnswer:
      "Workflow: (1) `clinic doctor --on-port '<autocannon cmd>' -- node server.js` — HTML report jo bolta hai bottleneck kis category mein hai. Agar 'event loop delay high, likely synchronous work' — ab exact function chahiye. (2) `node --cpu-prof --cpu-prof-dir=./prof server.js`, load test chalao, `SIGINT`. `./prof/*.cpuprofile` ko https://speedscope.app ya Chrome DevTools Performance tab mein drop karo — flamegraph, width = time, widest = hot spot. (3) `node --prof` + `node --prof-process isolate-*.log > processed.txt` — same underlying data, text form; CI/headless environments mein useful jahan GUI nahi.\n\nAlways under load, not a single request. `clinic flame` bhi hai — wo directly flamegraph deta hai `--cpu-prof` + viewer ke ek step mein. Production mein `--cpu-prof` ka overhead low hai lekin non-zero — short windows mein use karo, ya continuous profiling tools (Pyroscope, Datadog) jo sampling karti hain.",
    followUp:
      "Flamegraph mein ek frame wide hai lekin uska 'self time' lagbhag zero hai — iska kya matlab?",
  },
  {
    id: "fafb-4",
    question:
      "Ek endpoint bade JSON bodies (2-5 MB) accept karta hai aur `JSON.parse` flamegraph ka 45% hai. Kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Do cheezein: (1) ek body size limit lagao (`express.json({ limit: '1mb' })`) — zyaadatar bade payloads bug ya abuse hote hain, aur limit se wo blocking parse se pehle `413` reject ho jaate hain. (2) Jo genuinely bade hain, unke liye ek streaming JSON parser (`stream-json`) jo chunks process karta hai aur loop ko yield karta hai, ya clients ko ek async/queue-backed bulk endpoint par migrate karo.",
    detailedAnswer:
      "`JSON.parse` synchronous aur CPU-bound hai — ek 3 MB string par ~60-90ms, jo poore event loop ko block karta hai. Concurrent load par ye serialize ho ke p99 phaad deta hai.\n\nApproach: (1) **Input bound** — realistic max payload decide karo (reports usually `<1 MB`), `limit` set karo. Ye 80% cases solve kar deta hai kyunki 'bade' payloads aksar unintended hote hain. (2) **Streaming parse** — agar business genuinely bade documents chahti hai: `stream-json` se `req` ko pipe karo, records ko ek-ek process karo bina poora array RAM mein banaye — CPU spread ho jaata hai aur loop beech-beech mein saans leta hai. (3) **Shape change** — NDJSON (newline-delimited JSON) endpoint jahan har line ek record, ya ek async `POST /bulk` jo job queue karke `202 Accepted` deta hai.\n\nNote: `JSON.parse` ko `worker_threads` par bhejna bhi possible hai lekin bade string ko worker ko pass karna khud copy cost leta hai (jab tak `SharedArrayBuffer` na use karo) — pehle input bound aur streaming try karo.",
    followUp:
      "Body limit lagane se ek legitimate client toot gaya jo sach mein 8 MB reports bhejta hai. Ab?",
  },
  {
    id: "fafb-5",
    question:
      "Tumne teen fixes kiye aur endpoint 4.6x tez ho gaya. Interviewer poochta hai: 'aage kya monitor karoge taaki ye regress na ho?' Kya jawaab?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Event loop lag, p99 (aur p99.9) latency, req/sec + error rate, RSS vs heapUsed, aur GC pause time — dashboards par, alerts p99 aur loop-lag thresholds par. Plus ek load test CI job jo har release par baseline se compare kare, aur body-size / payload-shape metrics taaki input assumptions change hone par pata chale.",
    detailedAnswer:
      "1. **Continuous metrics**: event loop lag as a gauge (alert `>50ms` sustained), p99/p99.9 latency per endpoint, req/s with error rate, `process.memoryUsage()` (RSS aur heapUsed dono, taaki growth pakde), GC pause time (`--trace-gc` ya perf_hooks). \n2. **Regression gate**: ek automated load test (`autocannon`) staging par har release se pehle, results ko last-known-good baseline se compare — agar p99 X% se zyada badha to fail.\n3. **Input monitoring**: request body size distribution (p50/p99) — kyunki Fix 1 ek assumption thi ('bodies `<1 MB`'); agar clients bade bhejne lage to alert.\n4. **Cache health**: Fix 3 ke LRU ka hit rate aur size — low hit rate ya eviction storm matlab TTL/size galat.\n5. **Profiling on demand**: continuous profiler (Pyroscope/Datadog) ya ek documented runbook: 'loop lag spike → `--cpu-prof` for 60s → compare flamegraph'.\n\nGoal: jo teen cheezein todi thi (large sync parse, sync crypto, uncached hot read) unme se koi wapas aaye to metric turant flag kare, na ki agla incident.",
    followUp:
      "Staging load test aur production traffic mein farak ho to regression gate kaise trustworthy rakhoge?",
  },
];

export default questions;
