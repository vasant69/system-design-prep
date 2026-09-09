import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "libuv-and-thread-pool-1",
    question: "In me se kaunsa operation libuv ke thread pool ka use karta hai?",
    options: [
      "`https.get` se ek HTTP request",
      "`fs.readFile` se ek file read",
      "`net.connect` se ek TCP socket",
      "`setTimeout` timer",
    ],
    correctIndex: 1,
    explanation:
      "`fs` file operations thread pool pe chalte hain kyunki portable async file I/O OS-level pe reliable nahi hai. `https.get` aur `net.connect` network I/O hai — wo OS ke epoll/kqueue/IOCP se hota hai, pool se nahi. `setTimeout` sirf event loop ke timers phase ka hissa hai, isme koi thread nahi lagta.",
    difficulty: "medium",
  },
  {
    id: "libuv-and-thread-pool-2",
    question: "libuv thread pool ka default size kya hai aur use kaise badalte hain?",
    options: [
      "CPU cores jitna; badal nahi sakte",
      "4; `UV_THREADPOOL_SIZE` environment variable se (process start se pehle)",
      "1; `--threads` CLI flag se",
      "16; `process.setThreadPoolSize()` se runtime pe",
    ],
    correctIndex: 1,
    explanation:
      "Default 4 hai, chahe machine pe kitne bhi cores ho. Ise `UV_THREADPOOL_SIZE` env var se set karte hain, aur wo pool ke pehli baar use hone se pehle set hona chahiye (practically process launch pe). Koi runtime API (`process.setThreadPoolSize`) ya `--threads` flag exist nahi karta.",
    difficulty: "easy",
  },
  {
    id: "libuv-and-thread-pool-3",
    question:
      "Default pool ke saath 5 `crypto.pbkdf2` calls ek saath fire karte ho. 5th call ka kya hota hai?",
    options: [
      "Turant 5th thread pe chalti hai",
      "Error throw hoti hai — pool full",
      "Queue mein wait karti hai jab tak pehle 4 mein se koi thread free na ho",
      "Main thread pe sync chal jaati hai",
    ],
    correctIndex: 2,
    explanation:
      "Pool mein sirf 4 threads hain, to pehle 4 pbkdf2 jobs parallel chalte hain aur 5th libuv ki internal queue mein wait karta hai. Jaise hi koi thread free hota hai, 5th uspe chalta hai — isliye uska callback baaki 4 se roughly dugne time baad aata hai. Na error hoti hai, na wo main thread block karta hai.",
    difficulty: "medium",
  },
  {
    id: "libuv-and-thread-pool-4",
    question: "`dns.lookup` aur `dns.resolve4` mein thread pool ke hisaab se kya farak hai?",
    options: [
      "Dono thread pool use karte hain",
      "Dono OS network use karte hain, pool koi nahi",
      "`dns.lookup` thread pool pe (getaddrinfo), `dns.resolve4` seedha network DNS query (pool nahi)",
      "`dns.resolve4` thread pool pe, `dns.lookup` network pe",
    ],
    correctIndex: 2,
    explanation:
      "`dns.lookup` OS ke blocking `getaddrinfo` ko call karta hai, isliye libuv use thread pool pe chalata hai — bahut saare `dns.lookup` pool ko bhar sakte hain. `dns.resolve4` (aur baaki `dns.resolve*`) c-ares se seedha DNS server ko network query bhejta hai, thread pool bilkul use nahi karta. High-volume resolution ke liye `dns.resolve*` behtar hai.",
    difficulty: "hard",
  },
];

export default quiz;
