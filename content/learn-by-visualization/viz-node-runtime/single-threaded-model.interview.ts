import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "stm-1",
    question: "\"Node.js single-threaded hai\" — ye statement kitna sahi hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Adhoora. Tumhara JavaScript ek main thread pe chalta hai (do JS lines kabhi parallel nahi). Par process ke andar aur threads hain: libuv ka thread pool (default 4) fs/crypto/zlib/dns ke liye, plus V8 ke GC/JIT threads. Sahi framing: JS execution single-threaded, I/O offloaded.",
    detailedAnswer:
      "Ek 'main' thread event loop chalata hai aur tumhara saara JS (callbacks, promise continuations, timers) us par execute hota hai. Isi liye tumhare code mein memory-level data races nahi hote. Lekin Node process khud multithreaded hai: libuv ek thread pool rakhta hai (default 4, `UV_THREADPOOL_SIZE`) jo blocking OS operations — file system, `crypto.pbkdf2`, `zlib`, `dns.lookup` — ko background mein karta hai; network I/O ke liye libuv OS ke async facilities (epoll/kqueue/IOCP) use karta hai, pool nahi. V8 alag se GC aur optimizing compiler ke liye threads chalata hai. Aur `worker_threads`/`cluster` se tum khud aur threads/processes add kar sakte ho. To 'fully single-threaded' aur 'fully multithreaded' dono galat — nuance yeh hai.",
    followUp: "Agar libuv ka pool sirf 4 threads ka hai, to 5 parallel `fs.readFile` calls ka kya hota hai?",
    redFlag: "\"Node har request ke liye ek thread ya process banata hai\".",
  },
  {
    id: "stm-2",
    question: "Ek CPU-bound function (jaise password hashing loop ya bada JSON.parse) is model ko kaise nuksan pahunchata hai, aur fix kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Sync CPU work main thread pe chalta hai, to jab tak wo chal raha hai poora event loop stall — koi doosri request, timer, ya callback nahi. Fix: kaam ko worker_threads/pool pe offload karo, ya async library version use karo (e.g. `crypto.pbkdf2` instead of `pbkdf2Sync`), ya kaam ko chunks mein todo.",
    detailedAnswer:
      "Event loop tabhi aage badhta hai jab current callback return karta hai. Agar callback 500ms ka `for` loop ya `JSON.parse` (bade payload) chala raha hai, event loop us poore 500ms ke liye kuch aur nahi kar sakta — p99 latency spike, dropped health checks, timeouts. Diagnosis: `--prof`/clinic.js, ya event-loop-lag metric (`perf_hooks.monitorEventLoopDelay`). Fixes, preference order: (1) async built-in use karo jo libuv pool pe jaaye (`pbkdf2`, `gzip`, `fs.promises`). (2) In-house CPU JS ko `worker_threads` (pool jaise Piscina) pe bhejo — data `postMessage`/`SharedArrayBuffer` se. (3) Kaam ko `setImmediate` chunks mein todo taaki loop beech mein saans le sake. (4) Poore endpoint ko alag service/queue worker bana do agar kaam bhaari aur frequent hai.",
    followUp: "Tum kaise measure karoge ki event loop actually block ho raha hai, sirf network slow nahi?",
  },
  {
    id: "stm-3",
    question: "Node event loop model traditional thread-per-request server se kaise better scale karta hai idle-heavy workloads pe?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Thread-per-request mein har connection ek thread rok leta hai — stack memory (~MB each) + context-switch overhead — chahe wo mostly DB/network ka wait hi kyun na kar raha ho. Node mein waiting koi thread nahi rokti: ek loop connections ke beech switch karta hai jab kuch ready hota hai.",
    detailedAnswer:
      "Maan lo 10k connections, har ek 95% time DB response ka wait kar raha hai. Thread-per-request: 10k OS threads, ~10GB+ stack RAM, scheduler thrash. Event loop: ek thread, ek queue; jab connection kuch nahi maang raha (wait), wo effectively 'muft' hai — koi resource hold nahi. Jab data aata hai, callback queue hota hai, loop use handle karta hai microseconds mein. Yeh 'C10k' problem ka classic answer hai. Trade-off: yeh model I/O-bound, high-concurrency workloads (APIs, gateways, chat) pe shine karta hai; CPU-bound workloads (video encoding, ML) pe nahi — waha threads/processes chahiye.",
    followUp: "Kis tarah ke workload pe tum Node ke bajaye ek multithreaded runtime chunoge?",
    redFlag: "\"Node hamesha har cheez ke liye fastest hai\" — CPU-bound par ye jeet nahi hai.",
  },
  {
    id: "stm-4",
    question: "`UV_THREADPOOL_SIZE` kya hai aur ise badalna kab meaningful hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "libuv ke thread pool ka size (default 4). Ye pool `fs`, `crypto` (pbkdf2/scrypt), `zlib`, aur `dns.lookup` handle karta hai. Agar app in operations pe heavy hai aur tumhare paas cores hain, size badhane se throughput improve ho sakta hai; network I/O par koi asar nahi.",
    detailedAnswer:
      "Env var `UV_THREADPOOL_SIZE` process start se pehle set karni padti hai (max 1024). 4 se zyada parallel fs/crypto/zlib operations ho to 5th call queue mein wait karti hai jab tak pool thread free na ho — is se latency badhti hai. Agar profiling bataye ki ye operations bottleneck hain aur machine pe idle cores hain, to pool ko core-count ke aas-paas set karna madad karta hai. Lekin: (1) network sockets pool use nahi karte, to un pe koi fayda nahi. (2) Bahut bada pool context-switching aur memory badha ke ulta nuksan kar sakta hai. (3) Ye CPU-bound *JS* ke liye nahi hai (wo main thread pe hai) — uske liye `worker_threads`. Practically zyadatar apps default 4 pe theek chalti hain; ise ek measured tuning knob samjho, default change nahi.",
    followUp: "Ek endpoint jo har request pe `bcrypt.hash` (sync) karta hai — pool size badhane se ya worker threads se, kaunsa better aur kyun?",
  },
];

export default questions;
