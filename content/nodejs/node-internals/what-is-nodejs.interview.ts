import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "win-1",
    question: "Node.js kya hai? Ek-do line me batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node.js ek JavaScript runtime hai — Google ke V8 engine ko libuv (async I/O + event loop) aur ek JS core library ke saath package karke banaya gaya. Isse JavaScript browser ke bahar, server ya laptop par chalti hai. Ye na language hai na framework.",
    detailedAnswer:
      "Node.js 4 cheezon ka bundle hai jo ek executable (`node`) me compile hota hai: (1) V8 — C++ me likha JS engine jo code ko machine code me chalata hai, same engine jo Chrome me hai; (2) libuv — C library jo asynchronous file/network I/O, timers, aur ek thread pool deti hai, aur event loop bhi isi me hai; (3) C++ bindings — glue jo `fs.readFile` jaise JS calls ko actual OS syscalls se jodta hai; (4) JS core library — `fs`, `http`, `path`, `crypto`, `stream`, `events` jo bundled aate hain. Iska design non-blocking, event-driven I/O ke around hai: ek single thread par JavaScript chalti hai, lekin I/O ke wait me thread block nahi hota, isliye ek instance hazaaron concurrent connections handle kar leta hai. Express ya NestJS frameworks hain jo Node ke upar chalte hain — Node khud routing ya middleware nahi deta.",
    followUp: "Node aur Express me kya farak hai?",
    redFlag:
      "\"Node ek server-side programming language hai\" — ye category error hai. Language JavaScript hai; Node use run karne wala environment hai.",
  },
  {
    id: "win-2",
    question:
      "Node ki motivation kya thi? Thread-per-request model me kya problem thi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ryan Dahl (2009) blocking I/O solve karna chahte the. Apache jaise servers har connection ke liye ek thread/process dete the; jab thread DB ya disk ka wait karta, wo block ho jata — memory occupy karta bina kaam kiye. 10k connections par RAM khatam (C10k problem). Node ka non-blocking event loop ek thread par hi hazaaron connections handle karta hai.",
    detailedAnswer:
      "Traditional model: request aayi -> thread assign -> thread DB query fire karta hai -> thread us query ke complete hone tak BLOCKED, stack + context memory hold karke -> result aaya -> thread response bhejta hai -> free. Har blocked thread ~1 MB+ stack leta hai. Concurrency badhao toh threads badhao toh memory linearly badhti hai, plus context-switching overhead. Ryan Dahl ka insight: JavaScript pehle se single-threaded aur callback-driven hai (browser events isi tarah), aur non-blocking I/O ke liye epoll/kqueue jaise OS primitives already the. Inko libuv me wrap karke ek runtime banaya jahan I/O call turant return hoti hai aur completion par callback event loop se chalta hai. Ek thread, ek event loop, thousands of connections — kyunki thread kabhi idle wait nahi karta. Trade-off: CPU-bound kaam ab poore server ko block karta hai, jabki thread-per-request model me ek slow request sirf ek thread khaata.",
    followUp: "Agar ek request CPU-heavy ho jaye toh Node me kya hota hai, aur uska fix kya hai?",
  },
  {
    id: "win-3",
    question:
      "\"Node single-threaded hai\" — kya ye poori tarah sach hai? Explain karo.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Half-truth. Tumhari JavaScript ek hi thread (ek event loop) par execute hoti hai — ek waqt me ek statement. Lekin libuv ka ek thread pool (default 4) file I/O aur crypto jaise kaam parallel karta hai, OS networking apne kernel threads use karta hai, aur `worker_threads` module se tum explicitly extra JS threads bana sakte ho.",
    detailedAnswer:
      "Do levels alag karo. JS execution level: single-threaded — is wajah se tumhe locks/mutex nahi chahiye shared state ke liye, race conditions ka wo class hi nahi hai, lekin ek blocking statement sab kuch rok deta hai. I/O level: multi-threaded — `fs.readFile`, `crypto.pbkdf2`, `zlib`, DNS lookups libuv thread pool (4 threads default, `UV_THREADPOOL_SIZE` se badhao) par chalte hain; network sockets kernel ke async facilities (epoll/kqueue/IOCP) use karte hain, thread pool bhi nahi. Isliye jab log \"Node single-threaded\" kehte hain toh unka matlab JS callback execution hai. Real-world implication: agar tumhare paas 5 concurrent `crypto.pbkdf2` calls hain aur pool 4 ka hai, toh 5th queue me wait karega — ye ek classic latency bug hai jise `UV_THREADPOOL_SIZE` badha kar fix karte hain.",
    followUp: "Race conditions Node me hote hain ya nahi? Agar haan toh kis form me?",
    redFlag:
      "\"Node bilkul ek OS thread use karta hai, kuch bhi parallel nahi\" — thread pool aur kernel async I/O ko ignore karna.",
  },
  {
    id: "win-4",
    question:
      "Ek client ne bola \"humari image-processing service Node me likho\". Tum kya recommend karoge aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Node ko sirf HTTP/orchestration layer ke liye use karo — request accept, validate, queue. Actual image processing (resize, filters, encoding) CPU-bound hai, use `worker_threads` me daalo ya ek alag service (Go/Rust/native binary jaise sharp/libvips ke through) me. Main event loop par heavy pixel work kabhi mat chalao.",
    detailedAnswer:
      "Reasoning: har image transform 100ms-2s CPU le sakta hai. Agar ye main thread par chala, toh us dauraan har doosra request — health checks bhi — freeze. Options: (1) `sharp` library use karo — ye libvips (native C) ko bind karti hai aur kaam libuv thread pool par offload karti hai, toh main loop free rehta hai; pool size (`UV_THREADPOOL_SIZE`) throughput ke hisaab se tune karo. (2) Bade/batch jobs ke liye `worker_threads` pool banao — har worker ek CPU core. (3) Agar volume bahut high ho toh processing ko ek dedicated microservice (Go ya Rust) me nikaal do aur Node sirf API gateway rahe. Interview me point ye hai: tum tool ko workload ke shape se match kar rahe ho, blindly \"sab Node me\" nahi keh rahe.",
    followUp: "`worker_threads` aur `cluster` module me kya farak hai?",
  },
  {
    id: "win-5",
    question:
      "Node aur Express (ya NestJS) me kya farak hai? Interview me ye galti kyun matter karti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node runtime hai — wo JavaScript chalata hai aur `http`, `fs` jaise low-level modules deta hai. Express/NestJS libraries/frameworks hain jo Node ke `http` module ke upar routing, middleware, body parsing, error handling ka structure add karte hain. Tum Node ke bina Express nahi chala sakte; Express ke bina Node chala sakte ho.",
    detailedAnswer:
      "Node core se server aisa dikhta hai: `http.createServer((req, res) => { ... })` — tumhe khud URL parse karna, method check karna, JSON body chunks jodna, routing if-else likhni. Express ye sab abstract karta hai: `app.get('/users/:id', handler)`, `app.use(express.json())`, middleware chain, `next()`. NestJS aur ek layer upar — decorators, dependency injection, modules, TypeScript-first structure. Interview me farak isliye matter karta hai kyunki agar tum \"Node se API banayi\" bolte ho jab actually Express use kiya, toh interviewer ko lagta hai tumhe layers ka pata nahi — kaun sa concern kis layer par solve hota hai. Sahi tarika: \"Node runtime par, Express framework use karke, ye REST API banayi.\"",
    followUp: "Agar Express na ho toh tum routing kaise handle karoge Node core me?",
    redFlag:
      "\"Node aur Express basically same cheez hain\" ya \"Node ek framework hai\" — layer confusion.",
  },
];

export default questions;
