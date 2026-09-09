import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "what-is-nodejs-1",
    question: "Node.js ko sabse sahi kaise describe karoge?",
    options: [
      "Ek naya programming language jo JavaScript jaisa dikhta hai",
      "Ek web framework jaise Express ya Next.js",
      "Ek JavaScript runtime = V8 + libuv + C++ bindings + JS stdlib",
      "Sirf Google ka V8 engine, doosre naam se",
    ],
    correctIndex: 2,
    explanation:
      "Node ek runtime hai — language nahi (syntax wahi ECMAScript hai) aur framework nahi (Express iske upar banta hai). Andar V8 JS ko compile/run karta hai, libuv event loop + thread pool deta hai, C++ bindings OS features expose karte hain, aur JS stdlib (`fs`, `http`, ...) upar hoti hai. 'Sirf V8' galat hai kyunki akela V8 (browser/Deno) mein `fs`/`process`/`require` nahi hote.",
    difficulty: "easy",
  },
  {
    id: "what-is-nodejs-2",
    question: "`fs.readFile()` call karne par disk se data actually kaun padhta hai?",
    options: [
      "V8 engine, JS execution ke beech mein ruk kar",
      "libuv — background thread pool / OS async, phir callback queue hota hai",
      "Browser ka rendering engine",
      "Ek naya OS process har read ke liye fork hota hai",
    ],
    correctIndex: 1,
    explanation:
      "V8 sirf tumhara JS chalata hai. File read jaisa I/O Node bindings ke through libuv ko jaata hai — libuv apne thread pool (ya OS async facility) pe kaam karwata hai, aur khatam hone par callback ko loop ki queue mein daal deta hai jise V8 baad mein run karta hai. Isliye read async hai aur main thread block nahi hota.",
    difficulty: "medium",
  },
  {
    id: "what-is-nodejs-3",
    question: "libuv ke thread pool ka default size kitna hai aur wo kis liye use hota hai?",
    options: [
      "1 — sirf timers ke liye",
      "CPU cores jitna — har HTTP request ek thread pe",
      "4 — `fs`, `crypto` (pbkdf2 etc.), `zlib`, `dns.lookup` jaise kaam ke liye",
      "Unlimited — jitni parallel calls, utni threads",
    ],
    correctIndex: 2,
    explanation:
      "libuv ka thread pool default 4 threads ka hota hai (`UV_THREADPOOL_SIZE` se badal sakte ho) aur ye file system, kuch `crypto` operations, `zlib` compression aur `dns.lookup` ke liye use hota hai. Network I/O pool use nahi karta — wo OS ke async mechanisms (epoll/kqueue/IOCP) pe chalta hai. HTTP request-per-thread model Node ka nahi hai.",
    difficulty: "medium",
  },
  {
    id: "what-is-nodejs-4",
    question: "Ye statement kitna sahi hai: 'Node.js multithreaded hai'?",
    options: [
      "Bilkul sahi — Node har request ke liye ek thread banata hai",
      "Poora galat — Node mein sirf ek hi thread hota hai, koi aur nahi",
      "Adhoora: tumhara JS ek thread pe chalta hai; libuv ka pool (default 4) + OS kuch I/O background mein karte hain",
      "Sahi — V8 khud 8 threads pe JS parallel chalata hai",
    ],
    correctIndex: 2,
    explanation:
      "Tumhara JavaScript ek single 'main' thread pe execute hota hai — isliye do JS lines kabhi truly parallel nahi chalti. Lekin process ke andar aur threads hain: libuv ka thread pool (default 4) fs/crypto/zlib/dns ke liye, plus GC aur kuch internal threads. Isliye 'Node fully single-threaded' aur 'Node fully multithreaded' dono adhoore hain — sahi jawab: JS single-threaded, I/O offloaded.",
    difficulty: "easy",
  },
];

export default quiz;
