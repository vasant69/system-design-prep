import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "clm-1",
    question:
      "Node single-threaded hai — production mein 8-core box par saare cores kaise use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`cluster` module se `cluster.fork()` ko ~`os.cpus().length` baar call karo — N worker processes ek shared listening port par. Primary socket rakhta hai aur connections distribute karta hai (round-robin on Linux/macOS). Orchestrated setups (Kubernetes/ECS) mein iske bajaye N container replicas behind a load balancer.",
    detailedAnswer:
      "Ek Node process ka JS ek core par chalta hai — 8-core box par ek process = 7 cores idle. Options: (1) `cluster` — ek script do roles mein chalti hai: primary `cluster.fork()` se N workers spawn karta hai, har worker isi file ko dobara chalata hai (`cluster.isPrimary` false) aur `http...listen(3000)` karta hai. N workers same port par listen kar sakte hain kyunki actual socket primary ke paas hai. (2) PM2 — `pm2 start app.js -i max` — internally `cluster` + auto-restart, logs, `pm2 reload` (zero-downtime). Most teams khud `cluster` code nahi likhte. (3) Kubernetes/ECS — orchestrator N pods chala deta hai, har pod single-process Node, load balancing platform karta hai — yahan `cluster` mat use karo.\n\nWorker count ~`os.cpus().length`, lekin container mein cgroup CPU limit se derive karo (host cores se nahi) — libraries jaise `physical-cpu-count` ya `WEB_CONCURRENCY` env var.",
    followUp: "N workers same port par kaise listen kar sakte hain bina 'EADDRINUSE' error ke?",
  },
  {
    id: "clm-2",
    question:
      "Tumne `cluster` use kiya — sessions, cache, aur rate-limit counters kaise handle kiye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Har worker = full process, apni memory — koi shared heap nahi. In-memory sessions/cache/counters per-worker isolated ho jaate hain, aur round-robin ke saath user ki consecutive requests alag workers par jaati hain. Fix: shared state ko Redis/DB par move karo. Sticky sessions ek option hai lekin fragile (worker crash = us worker ke saare sessions gone).",
    detailedAnswer:
      "Cluster on karte hi har 'in-memory' assumption audit karna padta hai:\n- **Sessions** — Redis session store (`connect-redis`) ya JWT (stateless). In-memory `Map` -> 'logged out' bugs.\n- **Cache** — ek in-proc LRU har worker mein alag stale copy rakhega; chhota + staleness-OK data ke liye theek (short TTL), warna Redis. Invalidation ke liye Redis pub/sub jo saare workers ka local LRU clear kare.\n- **Rate-limit counters** — in-memory counter cluster mein N× loose (har worker apna count). Redis `INCR` with TTL, ya ek dedicated rate-limit service.\n- **WebSocket rooms / connection maps** — ek user ek worker se connected; doosre worker se broadcast use nahi pahunchega. Redis adapter (`socket.io-redis`) ya ek pub/sub layer.\n\nReal example: ek team ne cluster on kiya, login session in-memory `Map` mein tha, turant intermittent 'logged out' complaints. Fix: Redis session store — koi stickiness nahi chahiye.",
    followUp: "Sticky sessions ke saath ek worker crash ho jaye to kya hota hai?",
    redFlag: "\"Cluster workers memory share karte hain\" — nahi, wo alag OS processes hain.",
  },
  {
    id: "clm-3",
    question:
      "`cluster` aur `worker_threads` mein kya farak hai? Kaunsa kab?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`cluster` poore HTTP server ke N copies banata hai (alag processes, alag memory) — throughput scaling for many concurrent requests. `worker_threads` ek CPU-heavy function ko main event loop se hataata hai (same process, threads, `SharedArrayBuffer` se memory share kar sakte hain). Cluster jab bahut requests hain; worker_threads jab ek endpoint CPU-bound hai.",
    detailedAnswer:
      "`cluster`: 8 workers, har ek full HTTP server, ek shared port. Memory ~N× base RSS (koi shared heap). Ideal jab problem 'ek core par ek process kaafi throughput nahi de raha' hai — I/O-bound, many concurrent connections.\n\n`worker_threads`: ek process, multiple threads, har thread ka apna V8 isolate + event loop, lekin `SharedArrayBuffer` aur `MessageChannel` se communicate/share kar sakte hain. Ideal jab ek specific operation CPU-bound hai (hashing, image processing, big JSON transform) — use worker par bhejo, main loop free rahe.\n\nKey: agar ek endpoint 300ms CPU leta hai, `cluster` se har worker mein wahi endpoint apne event loop ko block karega — problem har worker mein duplicate ho jaati hai, solve nahi hoti. `worker_threads` (ya `piscina` pool) us function ko offload karta hai. Aksar dono saath: cluster/replicas for throughput + worker pool for CPU tasks.",
    followUp: "Ek CPU task ko `worker_threads` par bhejne ka data-transfer cost kya hai?",
  },
  {
    id: "clm-4",
    question:
      "Kubernetes par deploy karte waqt `cluster` (ya `pm2 -i max`) container ke andar chalana kyun anti-pattern hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Orchestrator already replicas, health checks, rolling deploys, aur autoscaling deta hai — `cluster` inside a pod se do layers of process management overlap karti hain. `os.cpus()` host ke cores dikhata hai (pod ka cgroup CPU limit nahi), to app zaroorat se zyada workers fork karta hai; crash/restart aur graceful-shutdown semantics takrati hain. Best practice: 1 process per container, scale via replicas/HPA.",
    detailedAnswer:
      "Concrete problems: (1) **CPU limit mismatch** — pod ko 2 vCPU mila hai lekin `os.cpus()` host ke 32 dikhata hai; `cluster.fork()` × 32 -> massive context-switching, memory blowout. (fix ke liye cgroup-aware count chahiye — `WEB_CONCURRENCY` env). (2) **Double supervision** — pod restart policy + `cluster.on('exit')` re-fork dono active; ek crash-loop confusing ban jaata hai. (3) **Graceful shutdown clash** — `kubectl rollout` `SIGTERM` bhejta hai; ab primary ko workers drain karna hai AUR pod ko terminate hona hai — timing bugs. (4) **Resource accounting** — HPA per-pod CPU dekhkar scale karta hai; ek pod ke andar N workers metrics ko muddy karte hain.\n\nSahi model: Dockerfile mein `CMD ['node', 'server.js']` (single process), `Deployment` mein `replicas: 6` ya HPA. Process management ek jagah (orchestrator), do jagah nahi. `cluster`/PM2 cluster mode single-VM ya bare-metal deploys ke liye reserve karo. PM2 team khud kehti hai: Kubernetes par `-i 1`.",
    followUp: "Agar tum ek single large VM par ho (Kubernetes nahi), to `cluster` vs `pm2` — kya chunoge aur kyun?",
    redFlag: "Container ke andar `pm2 -i max` ko best practice batana.",
  },
  {
    id: "clm-5",
    question:
      "`cluster` ke saath zero-downtime deploy (graceful reload) kaise implement karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Primary ek-ek worker ko cycle karta hai: `worker.disconnect()` (naye connections lena band, existing drain), uske `exit` ka wait, phir `cluster.fork()` — hamesha `n-1` workers live rakhte hue. Worker side par `SIGTERM`/`disconnect` par `server.close()` + in-flight requests complete hone do + `process.exit()`, ek timeout fallback ke saath.",
    detailedAnswer:
      "```javascript\n// primary\nprocess.on('SIGHUP', async () => {\n  for (const id in cluster.workers) {\n    const w = cluster.workers[id];\n    await new Promise((resolve) => {\n      w.on('exit', resolve);\n      w.disconnect();               // no new connections; existing drain\n      setTimeout(() => w.kill('SIGKILL'), 30_000); // fallback\n    });\n    cluster.fork();                 // replace before next\n  }\n});\n\n// worker\nprocess.on('disconnect', () => {\n  server.close(() => process.exit(0)); // finish in-flight, then exit\n  setTimeout(() => process.exit(1), 30_000);\n});\n```\n\nKey ideas: (1) ek-ek karke — hamesha kuch workers serving. (2) `disconnect` naye connections rok deta hai lekin existing requests complete hone deta hai. (3) `server.close(cb)` in-flight drain hone par callback deta hai. (4) Timeout fallback taaki ek stuck request forever na roke. (5) Naya worker fork karo purane ke fully exit hone ke baad (ya pehle, agar capacity chahiye).\n\nPractically: PM2 `pm2 reload` ye sab handle karta hai agar app `SIGTERM`/`disconnect` par server.close kare. Isliye most teams khud nahi likhtin.",
    followUp: "In-flight requests 30s ke timeout ke baad bhi complete nahi hui to kya trade-off hai — force kill karna ya wait karte rehna?",
  },
];

export default questions;
