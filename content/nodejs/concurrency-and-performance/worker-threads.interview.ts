import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "wt-1",
    question:
      "worker_threads kya hai aur ise kab use karoge? async I/O se kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "worker_threads ek alag OS thread par JavaScript chalata hai — apna V8 isolate, apna event loop, same process. Ise CPU-bound JS kaam ke liye use karte hain jo warna main event loop ko block karega. async I/O se farak: async I/O tab kaam karta hai jab tum kisi cheez ka wait kar rahe ho (DB, network, disk); worker_threads tab chahiye jab CPU khud busy hai aur koi wait nahi hai.",
    detailedAnswer:
      "Node ka default model I/O ke liye non-blocking hai — ek thread bahut saare concurrent waits handle kar leta hai. Lekin CPU-bound JS (bada JSON.parse, bcrypt/argon2 at high RPS, pure-JS image processing, report/PDF generation, data crunching) main thread par chale to har doosri request rukti hai. worker_threads us kaam ko ek alag thread par le jaata hai jo genuinely dusre CPU core par parallel chalta hai. Key facts: (1) alag V8 isolate — memory sync nahi hoti; communication postMessage (structured clone, copy), workerData (startup input), ya SharedArrayBuffer (zero-copy raw bytes) se. (2) Spawn ~10-50 ms + few MB, isliy production mein pool (piscina), per-request Worker nahi. (3) I/O-bound kaam kabhi worker mein mat daalo — sirf overhead. (4) External program chalana ho to child_process, poora HTTP server multi-core karna ho to cluster.",
    followUp: "postMessage se data bhejne ka cost kya hai bade objects ke liye?",
    redFlag:
      "\"worker_threads se main apni DB queries parallel kar deta hoon\" — DB queries already async/non-blocking hain; worker sirf overhead add karega.",
  },
  {
    id: "wt-2",
    question:
      "worker_threads, child_process, aur cluster — teeno ka istemaal kab hota hai? Ek decision framework do.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "async I/O: jab kaam sirf waiting hai — bas use karo. worker_threads: CPU-bound JS, same process ke andar. child_process: koi alag program chalana (ffmpeg, git, python) ya crash-prone/untrusted kaam isolate karna. cluster: ek HTTP server ko saare CPU cores par scale karna, ek shared port ke saath.",
    detailedAnswer:
      "Framework: pehle poochho kaam CPU-bound hai ya I/O-bound. I/O-bound -> kuch mat karo, async APIs already kaafi hain. CPU-bound -> agla sawaal: kaam JavaScript/WASM mein hai? Haan aur same process theek hai -> worker_threads (pool ke saath). Kaam ek external binary hai (ffmpeg, imagemagick, python script) -> child_process.spawn (streamed stdio) ya execFile. Kaam crash-prone/untrusted hai aur main process ko bilkul affect nahi karna chahiye -> child_process (alag process = alag memory, segfault bhi isolate). Alag problem: tumhara server sirf 1 core use kar raha hai aur tumhe throughput badhana hai -> cluster.fork() N workers jo ek port share karte hain (ya N container replicas behind LB — Kubernetes mein aksar behtar). cluster aur worker_threads orthogonal hain: cluster se saare cores par HTTP handle hota hai, phir bhi har worker ke andar ek heavy CPU function uska event loop block karega — uske liye worker_threads.",
    followUp:
      "Kubernetes environment mein cluster module vs N replicas — tum kya choose karoge aur kyun?",
  },
  {
    id: "wt-3",
    question:
      "Worker aur main thread ke beech communication ke kaunse tareeke hain, aur unke trade-offs?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teen: workerData (startup par one-time structured-clone input), postMessage/parentPort (dono taraf, har message structured-clone = copy), aur SharedArrayBuffer (dono threads raw bytes physically share karte hain, zero-copy, lekin Atomics/careful design se races handle karne padte hain). MessageChannel/MessagePort se do workers ko directly connect kar sakte ho.",
    detailedAnswer:
      "workerData: `new Worker(path, { workerData })` — worker ko startup par milta hai, read-only initial config/input ke liye. Structured-cloned, to bada payload yahan bhi mehenga. postMessage: `worker.postMessage(x)` / `parentPort.postMessage(y)` — bidirectional. Har call structured clone karta hai — receiver ko independent copy milti hai, cost roughly JSON.parse+stringify of that object. Functions, class instances (beyond plain data), sockets, DB handles clone nahi hote. Bade/frequent messages performance kill karte hain. SharedArrayBuffer: fixed-size raw memory dono threads mein shared. Typed arrays (Int32Array etc.) is par banao. Pass karna O(1) — sirf pointer. Lekin ab tum shared mutable state mein ho — Atomics.add/load/store aur Atomics.wait/notify se coordinate karo, warna race conditions/torn reads. Numeric bulk data (matrices, buffers, counters) ke liye ideal; arbitrary objects ke liye nahi. Rule of thumb: chhote results -> postMessage; bade numeric datasets jinpe parallel kaam ho -> SharedArrayBuffer.",
    followUp: "structured clone kis cheez ko copy nahi kar paata?",
  },
  {
    id: "wt-4",
    question:
      "Production mein worker_threads use karte waqt kaunse operational mistakes dekhe hain / avoid karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Per-request Worker spawn (latency + OOM), pool na hona, `error`/`exit` events na handle karna (dead workers, unhandled crashes), bade objects har baar postMessage karna (clone cost main thread par), aur I/O-bound kaam ko worker mein daal dena. Fix: fixed pool (piscina), teeno events handle, graceful shutdown, task granularity check.",
    detailedAnswer:
      "1) Per-request `new Worker` — spawn ~10-50 ms har latency mein add, burst par thousands of threads -> OOM/thread-limit. Startup par pool banao. 2) `worker.on('error')` na hona -> worker ke andar uncaught exception unhandled ho ke process gira sakta hai. `worker.on('exit', code => ...)` na hona -> pool mein dead slots. Teeno (`message`, `error`, `exit`) hamesha. 3) Bade payloads postMessage karna -> structured clone cost main thread par lagta hai, ironically wahi thread jise tum free rakhna chahte the. SharedArrayBuffer ya chhota interface. 4) Chhote tasks (< ~10-20 ms CPU) worker mein bhejna -> clone + scheduling overhead > kaam. Batch karo. 5) Graceful shutdown: SIGTERM par pool ko `destroy()` karo, warna in-flight jobs lost aur process hang. 6) Crash isolation ki galatfehmi — native addon segfault poore process ko le jaata hai; agar true isolation chahiye to child_process.",
    followUp: "Pool ka size kaise decide karoge aur queue unbounded grow kare to kya?",
  },
  {
    id: "wt-5",
    question:
      "Ek endpoint pure-JS se PDF generate karta hai (~250 ms CPU per PDF) aur month-end par poora server timeout karne lagta hai. Step by step kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Confirm karo ki event loop lag PDF load ke saath spike karta hai (CPU-bound). PDF generation ko ek worker_threads pool (piscina, size ~ CPU count) mein move karo taaki main event loop free rahe. Bulk/month-end runs ke liye ek job queue add karo aur API ko 202 Accepted return karwao. Before/after p99 aur event loop lag measure karo.",
    detailedAnswer:
      "Diagnosis: `perf_hooks.monitorEventLoopDelay` ya clinic doctor — PDF traffic ke saath lag 2-4s dikhega, unrelated endpoints (login, txns) timeout. Root cause: 250 ms sync CPU per request main thread par. Fixes in order: (1) PDF generation function ko ek worker file mein nikaalo, `piscina` pool banao (`maxThreads: os.cpus().length`, ek core main ke liye). `pool.run(payload)` -> Promise. Ab N cores parallel PDFs banate hain aur main event loop sirf dispatch/collect karta hai. (2) Interactive single-PDF requests pool se turant serve; month-end bulk ke liye ek queue (Redis/BullMQ) — API job enqueue karke `202` + job id de, client poll ya webhook se result le. Isse spike interactive latency ko touch nahi karta. (3) Optimizations: same inputs ke liye output cache, template ko worker startup par ek baar load (workerData ya module scope), payload chhota rakho. (4) Verify: autocannon se interactive endpoint ka p99 before (~4s) vs after (~120 ms), aur event loop lag < 5 ms. Agar aur scale chahiye -> pool ko alag worker service/fleet bana ke horizontally scale.",
    followUp:
      "cluster module se bhi ye ho sakta tha — kyun worker_threads chuna? Memory angle se samjhao.",
  },
];

export default questions;
