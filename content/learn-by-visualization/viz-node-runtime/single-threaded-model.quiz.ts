import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "single-threaded-model-1",
    question: "Node single-threaded hoke bhi 10,000 concurrent connections kaise serve karta hai?",
    options: [
      "Har connection ke liye ek naya thread banata hai",
      "JS thread wait nahi karta — slow I/O OS/libuv ko offload hota hai, thread free hokar agla event handle karta hai, callback baad mein run hota hai",
      "V8 JS ko 8 threads pe parallel chalata hai",
      "Har connection ke liye ek naya process fork hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Concurrency 'parallel execution' se nahi, 'not waiting' se aati hai. Jab handler `db.query()` ya `socket.read()` karta hai, wo non-blocking hai — kaam OS/libuv ko jaata hai aur main thread turant agle ready event pe chala jaata hai. Jab data aata hai, uska callback event loop ki queue mein aata hai. 10k connections mostly idle hote hain (waiting), aur waiting free hai — isliye ek thread kaafi hai. Thread/process-per-connection Node ka model nahi hai.",
    difficulty: "medium",
  },
  {
    id: "single-threaded-model-2",
    question: "Ek request handler mein 2 second ka sync `for` loop (pure CPU) chalta hai. Us dauraan kya hota hai?",
    options: [
      "Sirf wahi ek request slow hoti hai, baaki normal chalti rehti hain",
      "Poora event loop block — 2s tak koi doosri request, timer, ya callback nahi chal sakta",
      "Node automatically use doosre thread pe move kar deta hai",
      "V8 loop ko background mein daal deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Sync CPU-bound code main thread pe hi chalta hai. Jab tak wo `for` loop chal raha hai, event loop ek tick aage nahi badh sakta — pending HTTP requests, `setTimeout`/`setInterval` callbacks, promise continuations, health checks, sab 2 second ke liye ruk jaate hain. Isi liye CPU-heavy kaam ko `worker_threads` pe ya async chunks mein todna padta hai.",
    difficulty: "medium",
  },
  {
    id: "single-threaded-model-3",
    question: "Node process ke andar tumhare JS thread ke alawa aur threads hote hain?",
    options: [
      "Nahi, bilkul ek hi thread — poora process single-threaded hai",
      "Haan — libuv ka thread pool (default 4) fs/crypto/zlib/dns.lookup ke liye, plus V8 GC/compiler threads; par tumhara JS ek hi thread pe",
      "Haan, har `require` ek naya thread banata hai",
      "Sirf tab jab tum `cluster` use karo",
    ],
    correctIndex: 1,
    explanation:
      "'Single-threaded' sirf tumhare JavaScript execution ke baare mein hai. Process ke andar libuv ka thread pool (default 4, `UV_THREADPOOL_SIZE` se badalta hai) file system, kuch crypto (pbkdf2, scrypt), zlib compression aur `dns.lookup` ke liye kaam karta hai. V8 ke apne background threads GC aur JIT compilation ke liye hote hain. Network I/O pool use nahi karta — wo OS async (epoll/kqueue/IOCP) pe hai.",
    difficulty: "medium",
  },
  {
    id: "single-threaded-model-4",
    question: "Single-threaded event loop model ka ek genuine FAYDA (thread-per-request ke muqable) kya hai?",
    options: [
      "CPU-bound kaam automatically fast ho jaata hai",
      "Tumhare application code mein lock/mutex aur data-race bugs nahi hote, aur idle connections sasta scale karte hain (no per-thread stack RAM)",
      "Memory leaks kabhi nahi hote",
      "Node kisi bhi kaam ko infinite parallelism deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek thread pe tumhara JS chalne ka matlab shared mutable state pe do lines kabhi ek saath nahi chalti — isliye application code mein locks, mutexes, aur classic race conditions ki zaroorat nahi (async interleaving bugs ho sakte hain, par memory-level races nahi). Saath hi 10k mostly-idle connections = 10k threads ka stack memory + context switching bachta hai. Trade-off: CPU-bound kaam ko khud offload karna padta hai.",
    difficulty: "easy",
  },
];

export default quiz;
