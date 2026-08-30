import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nodejs-is-single-threaded-what-that-means-1",
    question:
      "Node single-threaded hai, phir bhi ek process hazaaron concurrent HTTP connections kaise handle kar leta hai?",
    options: [
      "Node har connection ke liye ek naya OS thread bana leta hai",
      "Idle connections bas wait kar rahe hote hain; unka I/O libuv (OS non-blocking APIs + chhota thread pool) handle karta hai, aur JS thread sirf ready callbacks chalati hai",
      "V8 automatically JS ko multiple cores par distribute kar deta hai",
      "Har request ek alag Promise thread par chalti hai",
    ],
    correctIndex: 1,
    explanation:
      "JS execution single-threaded hai, lekin I/O main thread par nahi hota — libuv OS ke non-blocking interfaces (epoll/kqueue/IOCP) aur ek 4-thread pool use karta hai. Idle connections koi CPU nahi maangte, bas wait karte hain, isliye ek thread unke liye kaafi hai. Option A wahi classic galatfehmi hai. Option C galat — V8 khud multi-core distribution nahi karta. Option D galat — 'Promise thread' jaisi koi cheez nahi.",
    difficulty: "easy",
  },
  {
    id: "nodejs-is-single-threaded-what-that-means-2",
    question:
      "Ek request handler ke andar tum 10 MB JSON par `JSON.parse` karte ho. Is dauraan doosri aayi hui `/health` request ka kya hota hai?",
    options: [
      "Wo turant respond ho jaati hai kyunki JSON.parse alag thread pool par chalta hai",
      "Wo tab tak wait karti hai jab tak JSON.parse khatam nahi hota, kyunki JSON.parse synchronous hai aur event loop thread ko block karta hai",
      "Node automatically use ek naye worker thread par bhej deta hai",
      "Wo fail ho jaati hai 503 ke saath",
    ],
    correctIndex: 1,
    explanation:
      "`JSON.parse` synchronous, CPU-bound operation hai jo poori tarah event loop thread par chalta hai. Jab tak wo 10 MB parse nahi kar leta (roughly 10-30 ms), koi doosra callback — including /health — nahi chal sakta. Option A galat, JSON.parse thread pool use nahi karta. Option C galat, Node aisa automatic offload nahi karta. Option D galat, request drop nahi hoti, bas delay hoti hai.",
    difficulty: "medium",
  },
  {
    id: "nodejs-is-single-threaded-what-that-means-3",
    question:
      "libuv ka default thread pool size kya hai aur kaunsa kaam usse guzarta hai?",
    options: [
      "16; har HTTP request ek pool thread par chalti hai",
      "1; sirf DNS lookups",
      "4; `fs` operations, `dns.lookup`, `crypto.pbkdf2`, aur `zlib` — network socket I/O nahi (wo OS async hota hai)",
      "CPU cores ke barabar; sab kuch usi se guzarta hai",
    ],
    correctIndex: 2,
    explanation:
      "Default `UV_THREADPOOL_SIZE` 4 hai. File system, `dns.lookup` (getaddrinfo), aur CPU-heavy built-ins jaise `crypto.pbkdf2` aur `zlib` is pool ko use karte hain. Network I/O (TCP/HTTP sockets) OS ke non-blocking interfaces par chalta hai, pool par nahi. Option A/D galat — HTTP requests aur 'sab kuch' pool use nahi karte. Option B galat size aur scope dono.",
    difficulty: "medium",
  },
  {
    id: "nodejs-is-single-threaded-what-that-means-4",
    question:
      "Ek CPU-bound hashing loop ko `async function` ke andar daal dene se kya fayda hota hai (bina worker thread ke)?",
    options: [
      "Loop apne aap ek background thread par chala jaata hai",
      "Kuch nahi — loop abhi bhi main thread par sync chalega aur event loop ko utni hi der block karega; `async` sirf tab help karta hai jab andar real awaitable I/O ho",
      "Loop 4x tez ho jaata hai kyunki thread pool use hota hai",
      "Event loop lag zero ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`async` keyword sirf batata hai ki function ek Promise return karta hai; wo code ko kisi doosre thread par nahi le jaata. Ek sync `for`/`while` loop `async` function ke andar bhi main thread par hi chalega aur event loop block karega. Real fix worker_threads ya external service hai. Baaki options galat premises par hain — koi automatic threading ya speedup nahi hota.",
    difficulty: "easy",
  },
];

export default quiz;
