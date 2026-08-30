import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "blocking-vs-non-blocking-1",
    question:
      "100 concurrent requests aa rahi hain aur ek request handler `fs.readFileSync` call karta hai jo 200 ms leta hai. Baaki 99 requests ka kya hota hai?",
    options: [
      "Wo alag threads pe parallel serve hoti rehti hain",
      "Wo sab wait karti hain — event loop us 200 ms tak block hai, koi doosri request/callback nahi chal sakti",
      "Node automatically ek naya thread bana ke unhe handle karta hai",
      "Sirf usi route ki requests wait karti hain, baaki routes normal chalte hain",
    ],
    correctIndex: 1,
    explanation:
      "JS ek single thread pe chalta hai. Sync call us thread ko busy rakhti hai, toh event loop aage nahi badhta — har pending request/timer/callback wait karta hai, chahe wo kisi bhi route ka ho. Option A/C galat: Node JS code ke liye naye threads nahi banata. Option D galat: block poore event loop ka hota hai, per-route nahi.",
    difficulty: "easy",
  },
  {
    id: "blocking-vs-non-blocking-2",
    question:
      "Ek endpoint ek 60 MB array pe heavy calculation karta hai (koi I/O nahi) aur event loop ko 800 ms block karta hai. Sabse sahi fix kya hai?",
    options: [
      "Calculation ko `setTimeout(fn, 0)` mein wrap kar do — ab non-blocking hai",
      "`fs.readFile` ki tarah kisi async version se replace kar do",
      "Kaam ko `worker_threads` pe daal do ya chhote chunks mein todo — ye CPU-bound blocking hai, async isse solve nahi karta",
      "`UV_THREADPOOL_SIZE` badha do",
    ],
    correctIndex: 2,
    explanation:
      "Ye CPU-bound blocking hai — kaam khud lamba hai, I/O wait nahi. `setTimeout` sirf kaam ko baad mein shift karta hai; jab chalega tab utni hi der block karega. Koi 'async version' hai hi nahi kyunki I/O nahi. Thread pool size sirf libuv I/O ke liye hai. Sahi jawaab: worker thread ya kaam ko todna.",
    difficulty: "medium",
  },
  {
    id: "blocking-vs-non-blocking-3",
    question:
      "App startup ke waqt (server ne abhi `listen` nahi kiya) config file ko `fs.readFileSync` se padhna — ye theek hai ya galat?",
    options: [
      "Galat — `readFileSync` kabhi bhi use nahi karna chahiye",
      "Theek hai — abhi koi concurrent request serve nahi ho rahi, toh block karne se kisi ki latency nahi badhti, aur code simpler rehta hai",
      "Galat — isse Node crash ho jayega",
      "Theek hai, lekin sirf agar file 1 KB se chhoti ho",
    ],
    correctIndex: 1,
    explanation:
      "Blocking ka nuksaan tab hai jab wo doosri pending requests ko rokta hai. Startup pe koi request queue nahi hoti, isliye sync read bilkul acceptable hai aur sync code padhne mein aasaan hota hai. Option A dogmatic aur galat. Option C galat — sync read se crash nahi hota. Option D — file size startup pe practically matter nahi karta.",
    difficulty: "easy",
  },
  {
    id: "blocking-vs-non-blocking-4",
    question:
      "Production Node service 'randomly slow' ho rahi hai — kabhi p99 latency spike, kabhi normal. Blocking confirm/detect karne ka standard metric kaunsa hai?",
    options: [
      "CPU temperature",
      "Total memory usage (RSS)",
      "Event loop delay / lag — ek timer schedule karke dekhna wo expected se kitna late fire hua; healthy under 10 ms, sustained 100 ms+ matlab blocking",
      "Open file descriptors ki count",
    ],
    correctIndex: 2,
    explanation:
      "Event loop delay directly measure karta hai ki event loop kitni der kisi cheez me atka raha. `perf_hooks.monitorEventLoopDelay()` ya APM tools yahi dete hain — healthy under 10 ms. Memory/FD/temperature blocking ke direct indicators nahi hain; blocking hone par bhi wo normal dikh sakte hain.",
    difficulty: "medium",
  },
];

export default quiz;
