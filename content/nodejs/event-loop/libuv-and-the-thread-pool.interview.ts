import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "libuv-1",
    question: "libuv kya hai aur Node mein uska role kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "libuv ek C library hai jo Node ke saath bundled aati hai. Wo do cheezein deti hai: khud event loop, aur ek cross-platform async I/O layer jo niche har OS ke async mechanism (Linux epoll, macOS kqueue, Windows IOCP) ko wrap karti hai. Sath mein ek chhota thread pool bhi.",
    detailedAnswer:
      "Node ki JS/C++ layer sirf intent express karti hai — 'yeh file padho, done ho toh yeh callback fire karna'. Actual mechanism libuv sambhalta hai. Wo event loop ki phases (timers, poll, check, close) C mein implement karta hai. Async I/O ke liye uske paas do strategies hain: network sockets ke liye OS-native readiness notification (koi extra thread nahi), aur un ops ke liye jinka async OS API nahi hai (file system, dns.lookup, pbkdf2/scrypt, zlib) ek default-4 thread pool. libuv isliye bhi important hai ki wo Windows aur Unix ke bilkul alag async models ko ek uniform API ke piche chhupa deta hai.",
    followUp: "Event loop ke phases mein se kaunse libuv ke andar hain aur kaunsa part V8/Node ka hai?",
    redFlag: "\"libuv ek npm package hai\" ya \"libuv V8 ka part hai\" — dono galat; wo ek alag C library hai jo Node bundle karta hai.",
  },
  {
    id: "libuv-2",
    question: "Node async I/O ke liye kaunse do mechanism use karta hai, aur kaunsa kab?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "(1) OS-native async: network sockets (TCP/UDP/HTTP) ke liye — epoll/kqueue/IOCP, zero extra threads, ek thread se hazaaron connections. (2) Thread pool (default 4): un ops ke liye jinka koi async OS API nahi — fs.*, dns.lookup, crypto.pbkdf2/scrypt/randomBytes, zlib.*.",
    detailedAnswer:
      "Network I/O ke liye OS khud batata hai ki socket 'ready' hai (readable/writable), toh libuv ko sirf ek `epoll_wait` type call chahiye poll phase mein — koi background thread nahi. File I/O alag hai: POSIX pe genuine async file API practically nahi hai (Linux AIO adhoora, io_uring naya hai), aur `getaddrinfo` (jise `dns.lookup` wrap karta hai) blocking hai. `crypto.pbkdf2` aur `zlib` toh pure CPU hain. In sabke liye libuv ek work queue + 4 worker threads use karta hai jo blocking call background mein karte hain aur result event loop ki queue mein daal dete hain. Consequence: 6 concurrent pbkdf2 → 4 turant, 2 wait.",
    followUp: "`dns.lookup` aur `dns.resolve` mein se kaunsa thread pool use karta hai?",
    redFlag: "Sab async I/O ko 'thread pool pe hota hai' bolna — network sockets pool use nahi karte.",
  },
  {
    id: "libuv-3",
    question: "\"Node multi-threaded hai kyunki uske paas thread pool hai\" — ise nuance karo.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Half-truth. Thread pool exist karta hai (default 4), lekin wo sirf Node ke built-in blocking ops (fs, dns.lookup, pbkdf2, zlib) ke liye hai. Meri JavaScript ek hi thread pe, ek call stack pe chalti hai. Aur network I/O — Node ka sabse bada use case — pool use hi nahi karta, wo OS async pe hai.",
    detailedAnswer:
      "Layers alag karo: (1) **JS execution** — strictly single-threaded, ek call stack. Mera CPU-bound `for` loop kabhi parallel nahi chalega jab tak main khud `worker_threads` na use karun. (2) **Node runtime** — libuv ke through multi-threaded: 4-thread pool blocking built-in ops ke liye. (3) **Network concurrency** — na JS threads, na pool; OS-native epoll/kqueue/IOCP se ek thread hazaaron sockets handle karta hai. Toh statement ka galat implication yeh hai ki 'pool ki wajah se mera code parallel chal sakta hai' — nahi, pool tumhare code ke liye nahi hai. Aur yeh implication bhi galat hai ki high network concurrency pool se aati hai — wo OS async se aati hai.",
    followUp: "Toh agar mujhe ek 8-core box ka poora faayda uthana hai ek CPU-heavy Node service ke liye, kya karun?",
    redFlag: "Confidently bolna ki pool badhane se HTTP throughput badhega.",
  },
  {
    id: "libuv-4",
    question: "`UV_THREADPOOL_SIZE` kya hai, ise kaise aur kab tune karte ho?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Environment variable jo libuv thread pool ka size set karta hai (default 4). Ise process **start hone se pehle** environment mein set karna padta hai — pehli thread-pool operation pe wo lock ho jata hai. Tune karo jab workload heavy fs/dns/crypto/zlib ho aur tum 4 se zyada concurrent pool ops queue hote dekho.",
    detailedAnswer:
      "Decision framework: agar pool work **I/O-bound** hai (file reads/writes, DNS) — threads mostly disk/network pe wait karti hain, CPU idle — toh size ko cores se thoda upar rakhna throughput badhata hai. Agar pool work **CPU-bound** hai (pbkdf2, zlib, brotli) — size ko roughly core count pe rakho; usse zyada matlab context-switch aur cache-thrash, throughput girta hai (khaaskar 1-2 core containers mein). Set karne ka tareeka: launch environment (`UV_THREADPOOL_SIZE=16 node app.js`, ya orchestrator ke env config mein) — `process.env` mein code se set karna reliable nahi. Ek real gotcha: hostname se connect karne pe Node `dns.lookup` chalata hai jo pool pe hai — high-connection service mein 4-slot pool silent bottleneck ban jata hai; fix DNS cache ya `dns.resolve`.",
    followUp: "Kaise measure karoge ki thread pool bottleneck hai?",
    redFlag: "\"Bas hamesha 128 set kar do safety ke liye\" — chhote boxes pe yeh actively nuksaandeh hai.",
  },
  {
    id: "libuv-5",
    question: "Ek Node service kabhi-kabhi random latency spikes deti hai; profiling se pata chalta hai ki spikes ke time file reads aur ek password-hashing endpoint dono active the. Kya ho raha hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Dono `fs` reads aur `crypto.pbkdf2` same libuv thread pool ke slots ke liye compete kar rahe hain. Pool sirf 4 hai — jab pbkdf2 4 slots CPU pe hold kar leta hai, file reads queue mein wait karti hain, aur us request path ki latency spike karti hai.",
    detailedAnswer:
      "pbkdf2 CPU-bound hai aur ek thread ko poore hashing duration ke liye occupy karta hai. Agar 4 concurrent hashing requests aayin, poora pool busy; ab har `fs.readFile` (jo bhi pool pe hai) tab tak wait karega jab tak koi hashing khatam na ho. Spike isliye correlated dikhta hai. Fixes, trade-off ke saath: (1) `UV_THREADPOOL_SIZE` badhao agar cores hain — file reads ko apne slots milenge; (2) hashing ko dedicated `worker_threads` pool pe move karo taaki wo libuv pool ke fs work se compete na kare; (3) hashing cost ko tune karo (iteration count) ya rate-limit karo; (4) agar files chhoti aur hot hain, unhe memory mein cache karo taaki `fs` hit hi kam ho. Sahi fix workload ke shape pe depend karta hai — pehle measure karo pool queue depth.",
    followUp: "worker_threads ka apna pool aur libuv ka pool — yeh kaise interact karte hain?",
    redFlag: "Spike ko 'GC pause' maan lena bina pool contention consider kiye.",
  },
];

export default questions;
