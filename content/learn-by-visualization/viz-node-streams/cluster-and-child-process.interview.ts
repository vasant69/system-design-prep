import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ccp-1",
    question: "Node ek single core tak seemit hai — 8-core server pe use fully use kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "cluster module (ya PM2 cluster mode): ek master process har core ke liye ek worker fork karta hai, saare workers ek hi port pe listen karte hain, aur OS/master naye connections unmein round-robin baant deta hai. Shared state process memory se hata ke Redis/DB mein rakho.",
    detailedAnswer:
      "`cluster.isPrimary` branch mein `os.cpus().length` baar `cluster.fork()` karo; `else` branch mein normal `http` server `.listen(3000)`. Node internally SO_REUSEPORT-style handle sharing karta hai taaki ek hi port pe multiple workers bind ho sakein. Master khud requests handle nahi karta — sirf workers ko manage karta hai; `cluster.on('exit')` pe worker restart karke pool bhara rakho. Production mein log yahi PM2 ya container orchestration (har pod ek process, N pods) karta hai. Key: workers memory share nahi karte, isliye sessions/cache/rate-limit counters ek external store mein hone chahiye, warna har worker ka apna alag view hoga.",
    followUp: "Cluster ke saath WebSocket ya in-memory session ka kya issue aata hai, aur sticky sessions se wo kaise fix hota hai?",
    redFlag: "\"cluster ek slow request ko multiple cores pe parallelize kar deta hai\" — wo throughput badhata hai, ek request ki latency nahi.",
  },
  {
    id: "ccp-2",
    question: "`spawn`, `exec` aur `fork` — teeno kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`spawn`: lamba/bada output stream karna hai (ffmpeg, tar, rsync). `exec`: chhota output wala shell command, output ek buffer mein chahiye. `fork`: ek aur Node script chalana hai plus parent-child ke beech message channel chahiye.",
    detailedAnswer:
      "`spawn(cmd, argsArray)` — koi shell nahi (safe from injection jab tak `shell:true` na do), `stdout`/`stderr` Readable streams; constant memory, isliye GB-size output bhi OK. `exec(cmdString, cb)` — ek shell spawn karta hai, poora output `maxBuffer` (default ~1MB) tak jama karta hai, phir `cb(err, stdout, stderr)`; convenient par bade output pe crash aur untrusted input pe injection risk. `execFile` iska safer cousin hai (no shell). `fork(modulePath)` — `spawn` ka special case jo guaranteed ek naya Node process banata hai aur ek IPC channel set karta hai: `child.send(obj)` / `child.on('message', ...)`. CPU-bound JS ke liye aaj `worker_threads` generally behtar hai (lighter), `fork` tab jab process-level isolation chahiye.",
    followUp: "`exec` par `maxBuffer` exceed ho jaaye to kya hota hai, aur usse kaise bachte ho?",
  },
  {
    id: "ccp-3",
    question: "cluster/child_process vs worker_threads — decision kaise loge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "worker_threads: in-app CPU-bound kaam (hashing, parsing, image resize) jahan shared memory ya lightweight parallelism chahiye. cluster: HTTP throughput ko cores pe scale karna. child_process: koi alag program/binary chalana ya hard process isolation chahiye.",
    detailedAnswer:
      "worker_threads same process mein threads hain — spawn sasta, memory kam, aur `SharedArrayBuffer`/`MessageChannel` se efficient data sharing. Best for: request ke andar aane wali CPU-heavy computation jo event loop ko rok rahi hai. cluster processes hain jo ek listening socket share karte hain — best for: 'server ek core pe bottleneck hai, saare cores chahiye'. child_process (`spawn`/`exec`) tab jab tumhe Node ke bahar ka kuch chahiye — `git`, `ffmpeg`, python script — ya jab crash-isolation critical ho (ek child gir jaaye to parent zinda). Practically bahut se deployments cluster/PM2 for scaling + worker_threads for CPU spikes dono use karte hain.",
    followUp: "Ek image-processing API mein tum dono combine karoge — kaise?",
  },
  {
    id: "ccp-4",
    question: "Cluster worker crash ho jaaye to kya karna chahiye, aur zero-downtime restart kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`cluster.on('exit')` pe naya worker fork karke pool bharo. Deploy pe rolling restart: ek-ek worker ko disconnect (naye connections lena band, existing drain) karke replace karo, taaki hamesha kuch workers live rahein.",
    detailedAnswer:
      "Resilience: master `cluster.on('exit', (worker, code) => cluster.fork())` rakhta hai, aur crash-loop se bachne ke liye ek backoff/limit. Zero-downtime code deploy: workers ko ek saath mat maaro. Har worker ke liye — `worker.disconnect()` (server naye connections accept karna band, in-flight requests complete), phir exit hone par naya worker fork jo updated code load karega; agla worker tab lo jab naya 'listening' ho. Is beech purane aur naye code dono briefly chal sakte hain, isliye DB migrations backward-compatible hone chahiye. PM2 `pm2 reload` yahi rolling behaviour deta hai. Health checks + `process.send('ready')` se master ko pata chalta hai worker sach mein serve kar raha hai.",
    followUp: "Rolling restart ke dauraan agar naya code purane se incompatible DB schema maange to kya strategy loge?",
  },
];

export default questions;
