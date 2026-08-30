import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nst-1",
    question:
      "Node single-threaded hai — phir ye hazaaron concurrent requests kaise handle karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Meri JavaScript ek hi thread par chalti hai, lekin I/O uspe nahi hota. Network, disk, DNS jaise kaam libuv ko jaate hain — jo OS ke non-blocking APIs (epoll/IOCP) aur ek chhote thread pool (default 4) ka use karta hai. Node callback register karke aage badh jaata hai, aur I/O ready hone par event loop wo callback wapas meri thread par chala deta hai. Idle connections bas wait karte hain, isliye ek thread unke liye kaafi hai.",
    detailedAnswer:
      "Do alag cheezein hain: JS execution aur I/O. JS execution single-threaded hai — ek V8 call stack, ek waqt mein ek function. Lekin jab main `fs.readFile`, ek DB query, ya `http` request maarta hoon, wo kaam meri JS thread par nahi hota. Node use OS ko (network ke liye non-blocking socket APIs) ya libuv thread pool ko (file system, `dns.lookup`, `crypto.pbkdf2`, `zlib`) de deta hai, ek callback register karta hai, aur turant aage badh jaata hai. Jab operation complete hota hai, uska callback event loop ki queue mein aata hai aur agle free moment par meri thread par chalta hai. Isliye 10,000 idle connections ka cost bas thodi memory hai — wo koi CPU nahi maang rahe. Ye model I/O-heavy workloads (API gateways, BFF, proxies, real-time) ke liye ideal hai. Problem sirf tab hai jab main thread par CPU-bound kaam aa jaaye.",
    followUp: "libuv thread pool ka default size kya hai, aur kaunse operations use karte hain?",
    redFlag:
      "\"Node har request ke liye naya thread spawn karta hai\" — ye galat hai; yahi thread-per-connection model Node avoid karta hai.",
  },
  {
    id: "nst-2",
    question:
      "\"Blocking the event loop\" ka kya matlab hai? Ek concrete example do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jab tumhara koi callback main thread par lamba synchronous kaam karta hai, tab tak event loop kuch aur nahi kar sakta — naye connections, timers, ready-ho-chuke I/O callbacks sab ruk jaate hain. Example: ek request handler mein 10 MB body ka sync `JSON.parse` plus ek sync hashing loop.",
    detailedAnswer:
      "Event loop ek loop hai jo callbacks ko ek-ek karke JS thread par chalata hai. Agar ek callback 500 ms sync chala, to poore 500 ms koi doosra callback nahi chalega. Concrete: ek `POST /report` endpoint jo bada request body `JSON.parse` karta hai (sync, ~10-30 ms per 10 MB), phir har record ka SHA-256 sync compute karta hai (loop). Load ke andar, is dauraan aayi har doosri request — `/login`, `/health` — bhi utne ms atak jaati hai, kyunki unka callback chalane ke liye thread free nahi hai. p99 latency spike ho jaati hai. Chhupe blockers: bada `JSON.stringify`, `zlib` sync variants, `fs.*Sync`, catastrophic-backtracking regex, bade nested loops. Detect: event loop lag monitor karo (`perf_hooks.monitorEventLoopDelay` ya `clinic doctor`) — sustained 50 ms+ = incident. Fix: CPU kaam ko `worker_threads` pool mein bhejo, body ko stream/limit karo, repeated inputs ke liye cache lagao.",
    followUp: "Event loop lag production mein kaise measure aur alert karoge?",
  },
  {
    id: "nst-3",
    question:
      "Ek 8-core server par tum default Node app deploy karte ho. Kitne cores use ho rahe hain aur poora CPU kaise use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Default ek Node process = ek JS thread = practically ek core (plus thread pool ka thoda). Baaki 7 cores idle. Poora CPU use karne ke liye `cluster` module se N worker processes chalao (usually `os.cpus().length`) jo ek listening port share karein, ya N container replicas behind a load balancer.",
    detailedAnswer:
      "Ek Node process ka JS ek thread par chalta hai, to CPU-bound throughput ~1 core tak limited hai. libuv thread pool (default 4) kuch aur cores ko file/crypto kaam ke liye use kar sakta hai, lekin tumhara application logic nahi scale hota. Options: (1) `cluster.fork()` — master process N workers banata hai jo same port par listen karte hain; non-Windows par OS/master round-robin se connections distribute karta hai. Har worker full process hai (apni memory) — shared state Redis/DB mein rakho, aur sticky sessions ya shared session store chahiye. (2) N replicas / containers behind a load balancer — Kubernetes environment mein ye aksar preferred hai kyunki orchestrator already restarts, health checks, aur scaling handle karta hai; cluster ka logic bahar chala jaata hai. (3) PM2 — cluster ko wrap karta hai plus restarts/logs deta hai. `worker_threads` alag problem solve karta hai (CPU-bound JS in-process), pura HTTP server scale karne ke liye nahi.",
    followUp: "Kubernetes mein N replicas vs cluster module — kya trade-off hai?",
  },
  {
    id: "nst-4",
    question:
      "Ye code — kya print hoga aur kis order mein? `console.log('A'); const s = Date.now(); while (Date.now() - s < 2000) {} setTimeout(() => console.log('B'), 0); console.log('C');",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Order: `A`, phir 2 second ka freeze, phir `C`, phir `B`. Aur agar is dauraan koi HTTP request aati, wo bhi 2s ke liye atak jaati.",
    detailedAnswer:
      "`console.log('A')` turant chalta hai. Phir `while` loop 2000 ms tak main thread ko sync block karta hai — is dauraan kuch bhi nahi chal sakta, koi callback nahi, koi I/O nahi. Loop ke baad `setTimeout(fn, 0)` timer register hota hai, phir `console.log('C')` chalta hai (abhi bhi current synchronous run mein). Current run khatam hone par event loop timers phase mein `B` chalata hai. Toh: `A` -> (2s freeze) -> `C` -> `B`. Key insight: `setTimeout(fn, 0)` ka matlab 'abhi' nahi, 'current sync code khatam hone ke baad, jaldi se jaldi'. Aur wo `while` loop yeh dikhata hai ki ek sync loop poore process ko rok deta hai — agar ye ek HTTP server hota, har concurrent request 2s slow hoti.",
    followUp: "Us `while` loop ko non-blocking kaise banaoge bina logic badle?",
    redFlag:
      "\"B pehle aayega kyunki delay 0 hai\" — timer callback current synchronous execution ke baad hi chalta hai, chahe delay 0 ho.",
  },
  {
    id: "nst-5",
    question:
      "Tumhare API mein ek endpoint hai jo uploaded images ko resize karta hai (pure-JS library se). Load badhne par sab endpoints slow ho gaye. Kya hua aur kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Image resize CPU-bound hai aur main thread par sync chal raha hai, to har resize ke dauraan event loop block hota hai aur baaki sab endpoints (jo I/O-bound hain) bhi ruk jaate hain. Fix: resize ko main thread se hatao — `worker_threads` pool (piscina) mein, ya `sharp` jaisi native library jo apne kaam ko libuv thread pool par chalati hai, ya ek alag image-processing service/queue.",
    detailedAnswer:
      "Diagnosis: event loop lag monitor karo — resize load ke saath lag spike karega, confirming CPU block. Pure-JS image manipulation CPU-heavy hai aur poori tarah JS thread par chalti hai. Fixes, preference order mein: (1) `sharp` (libvips binding) use karo — ye kaam native code mein libuv thread pool par karta hai, JS thread free rehta hai; default 4 pool threads, `UV_THREADPOOL_SIZE` tune kar sakte ho. (2) Agar pure-JS hi rakhna hai, to ek `worker_threads` pool (`piscina`) banao aur har resize job usme bhejo — main thread bas coordinate kare. (3) High volume par: upload ko object storage mein rakho, ek message queue mein job daalo, aur ek alag worker fleet resize kare — API turant `202 Accepted` de. Isse API latency resize se decouple ho jaati hai. Saath mein: input size limits, concurrency cap per instance, aur output caching (same image + same dimensions).",
    followUp: "worker pool ka size kaise decide karoge — kitne workers?",
  },
];

export default questions;
