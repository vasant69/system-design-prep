import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "libuv-and-the-thread-pool-1",
    question: "libuv exactly kya hai Node ke context mein?",
    options: [
      "Ek npm package jo async utilities deta hai",
      "V8 engine ka ek module jo garbage collection karta hai",
      "Ek C library jo Node ke saath bundled aati hai aur event loop plus cross-platform async I/O provide karti hai",
      "Node ka HTTP parser",
    ],
    correctIndex: 2,
    explanation:
      "libuv ek C library hai jo Node ke saath aati hai; wo khud event loop implement karti hai aur har OS ke async mechanism (epoll/kqueue/IOCP) ke upar ek uniform async I/O API deti hai. Option A galat — yeh npm package nahi. Option B galat — GC V8 ka kaam hai. Option D galat — HTTP parsing alag component (llhttp) hai.",
    difficulty: "easy",
  },
  {
    id: "libuv-and-the-thread-pool-2",
    question:
      "Ek HTTP server 5000 concurrent TCP connections handle kar raha hai. Yeh network I/O kitne thread pool threads use karta hai?",
    options: [
      "5000 — har connection ko ek thread",
      "4 — default thread pool size, connections usme queue hote hain",
      "0 — network sockets OS-native async (epoll/kqueue/IOCP) pe hote hain, thread pool bilkul use nahi hota",
      "1 per CPU core",
    ],
    correctIndex: 2,
    explanation:
      "Network sockets ke paas OS-level async readiness API hota hai (epoll/kqueue/IOCP), isliye libuv unke liye thread pool use nahi karta — ek hi thread `epoll_wait` jaisi ek call se hazaaron ready sockets ka pata laga leta hai. Thread pool sirf un ops ke liye hai jinka koi async OS API nahi: fs, dns.lookup, pbkdf2, zlib. Isliye answer 0 hai.",
    difficulty: "medium",
  },
  {
    id: "libuv-and-the-thread-pool-3",
    question:
      "In mein se kaunsa operation libuv thread pool use NAHI karta?",
    options: [
      "fs.readFile",
      "crypto.pbkdf2 (callback version)",
      "Ek PostgreSQL query TCP connection ke through",
      "zlib.gzip (async version)",
    ],
    correctIndex: 2,
    explanation:
      "PostgreSQL query ek TCP socket pe jati hai — network I/O — jo OS-native async pe hota hai, thread pool pe nahi. fs.readFile, crypto.pbkdf2, aur zlib.gzip teeno thread pool use karte hain kyunki inke paas async OS API nahi hai (file I/O aur CPU-bound hashing/compression).",
    difficulty: "medium",
  },
  {
    id: "libuv-and-the-thread-pool-4",
    question:
      "Ek service ek 2-core container mein chal rahi hai aur heavy `zlib` compression karti hai. Team `UV_THREADPOOL_SIZE=32` set kar deti hai. Sabse sambhavit result kya hai?",
    options: [
      "Throughput 8x badh jayega kyunki ab 32 parallel compressions honge",
      "Koi farak nahi padega — zlib pool use nahi karta",
      "Throughput girega ya same rahega — 32 CPU-bound threads sirf 2 cores pe context-switch aur cache-thrash karenge",
      "Node crash karega kyunki max pool size 4 hai",
    ],
    correctIndex: 2,
    explanation:
      "zlib CPU-bound hai aur pool use karta hai, lekin sirf 2 cores hain. 32 threads matlab 32-way fight for 2 cores — heavy context switching aur cache thrashing, effective throughput default 4 se behtar nahi, aksar kharab. CPU-bound pool work ke liye size core count ke aas-paas rakhna chahiye. Max pool size 4 se zyada ho sakta hai (historically 128), toh crash nahi hoga.",
    difficulty: "hard",
  },
];

export default quiz;
