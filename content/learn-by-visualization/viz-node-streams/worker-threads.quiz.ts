import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "worker-threads-1",
    question: "Worker threads kis tarah ke kaam ke liye sahi hain?",
    options: [
      "Database queries aur HTTP calls parallel karne ke liye",
      "CPU-bound sync computation (hashing, parsing, image/video processing, compression) jo warna main event loop ko block kar deta",
      "File padhne-likhne ko tez karne ke liye",
      "Overall memory usage kam karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Node ka I/O (fs, net, http) already libuv se async hai — usko worker pe daalne ka koi fayda nahi, ulta overhead. Workers ka asli use: pure-CPU kaam jo single main thread ko seconds tak rok deta hai — `pbkdf2Sync`, bade `JSON.parse`, `sharp` image resize, sync `zlib`, ML inference. Ye alag core pe chalke event loop ko free rakhte hain.",
    difficulty: "medium",
  },
  {
    id: "worker-threads-2",
    question: "`worker.postMessage(obj)` se `obj` worker tak kaise pahunchta hai?",
    options: [
      "Reference se — main aur worker same object share karte hain",
      "Structured clone algorithm se ek deep COPY banti hai; dono taraf alag objects (jab tak SharedArrayBuffer ya transferList use na karo)",
      "`JSON.stringify`/`parse` se — Map, Date, circular refs sab lost ho jaate hain",
      "Object disk pe likh ke uska path bheja jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Default: structured clone — JSON se zyada capable (Map, Set, Date, TypedArray, circular refs OK; functions aur class-instances nahi). Ye ek copy hai, isliye bade payloads pe serialize plus copy cost lagta hai. Zero-copy chahiye: `SharedArrayBuffer` (dono same bytes dekhte hain, `Atomics` se sync) ya `transferList` (ArrayBuffer ka ownership move — sender ke paas se detach ho jaata hai).",
    difficulty: "medium",
  },
  {
    id: "worker-threads-3",
    question: "Har worker thread ke paas apna kya hota hai?",
    options: [
      "Sirf apna variable scope, baaki V8 heap main thread se shared",
      "Apna V8 isolate, apna event loop, apni memory heap, apne globals — par process wahi rehta hai",
      "Apna alag OS process aur apna PID",
      "Kuch nahi, sab kuch main thread se share hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Worker = same process, alag thread, par fully isolated JS environment: naya V8 Isolate, alag heap, alag event loop, alag `require` cache aur globals. Isliye objects implicitly share nahi hote. Process-level cheezein (`process.pid`, env) shared hain. `SharedArrayBuffer` isi wajah se special hai — wahi ek tareeka hai bytes ko genuinely share karne ka.",
    difficulty: "medium",
  },
  {
    id: "worker-threads-4",
    question: "`child_process.fork()` aur `worker_threads` mein ek key difference kya hai?",
    options: [
      "Dono bilkul same hain",
      "`fork` ek alag OS process banata hai (alag memory, JSON-message IPC, heavier startup); worker ek thread hai same process mein (SharedArrayBuffer se memory share ho sakti hai, lighter startup)",
      "`worker_threads` sirf Windows pe kaam karta hai",
      "`fork` CPU work ke liye hai, `worker_threads` I/O ke liye",
    ],
    correctIndex: 1,
    explanation:
      "`fork` = poora naya Node process — strong isolation, crash contained, par zyada startup cost aur sirf message-copy IPC. `worker_threads` = thread in the same process — faster to spawn, kam memory, aur `SharedArrayBuffer` se genuinely shared memory possible. CPU-bound in-app parallelism ke liye workers; alag program run karna ho ya hard isolation chahiye to `fork`/`spawn`.",
    difficulty: "easy",
  },
];

export default quiz;
