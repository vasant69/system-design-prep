import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "worker-threads-1",
    question: "worker_threads kis tarah ke kaam ke liye sahi hai?",
    options: [
      "Kai DB queries ko parallel chalane ke liye",
      "CPU-bound JavaScript kaam jo warna main event loop ko block karta — jaise pure-JS image processing, bcrypt at high RPS, bada JSON.parse",
      "Ek HTTP server ko multiple cores par scale karne ke liye",
      "Ek external program jaise ffmpeg chalane ke liye",
    ],
    correctIndex: 1,
    explanation:
      "worker_threads ka maksad CPU-bound JS ko main thread se hataana hai. Option A galat — DB queries already non-blocking hain, worker sirf overhead. Option C `cluster` / replicas ka kaam hai. Option D `child_process` (spawn/execFile) ka kaam hai. worker_threads = CPU-bound JS, same process.",
    difficulty: "easy",
  },
  {
    id: "worker-threads-2",
    question:
      "`worker.postMessage(bigObject)` aur `SharedArrayBuffer` ke beech kya fundamental farak hai?",
    options: [
      "Dono same hain, SharedArrayBuffer sirf naya syntax hai",
      "postMessage data ko structured-clone karke ek copy bhejta hai (bade payloads mehenge); SharedArrayBuffer raw memory dono threads mein sach mein share karta hai, koi copy nahi (Atomics se safe access)",
      "postMessage sirf strings bhej sakta hai; SharedArrayBuffer objects bhej sakta hai",
      "SharedArrayBuffer sirf child_process ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "postMessage structured clone use karta hai — receiver ko ek alag copy milti hai, roughly JSON round-trip jitni cost. SharedArrayBuffer ke bytes dono threads physically share karte hain (O(1) pass), lekin tumhe races se Atomics/careful design se bachna padta hai. Option A/C/D sab galat premises.",
    difficulty: "medium",
  },
  {
    id: "worker-threads-3",
    question:
      "Ek API endpoint har request par ek naya `new Worker(...)` banata hai CPU kaam ke liye. High load par kya galat hoga?",
    options: [
      "Kuch nahi, ye recommended pattern hai",
      "Har spawn ~10-50 ms latency add karta hai, aur burst load par hazaaron threads ban ke process OOM ya OS thread-limit tak pahunch sakta hai; iske bajaye ek fixed pool + job queue use karo",
      "Workers automatically reuse ho jaate hain, to koi cost nahi",
      "Sirf memory badhti hai, latency par koi asar nahi",
    ],
    correctIndex: 1,
    explanation:
      "Worker spawn ~10-50 ms aur few MB memory leta hai. Per-request spawn se ye cost har request ki latency mein add hota hai, aur unbounded concurrency se resource exhaustion. Solution: startup par ek pool (piscina ya khud ka, size ~CPU count) banao aur tasks queue karo. Baaki options spawn cost ko galat samajhte hain.",
    difficulty: "medium",
  },
  {
    id: "worker-threads-4",
    question:
      "Tumhare paas ek endpoint hai jo `ffmpeg` se video transcode karta hai aur wo poore server ko slow kar raha hai. Sabse sahi tool kya hai?",
    options: [
      "worker_threads — transcoding kaam ek worker file mein daal do",
      "cluster.fork() — N worker processes bana do",
      "child_process (spawn) — ffmpeg ek alag binary hai; use ek separate process ke roop mein streamed stdio ke saath chalao",
      "setImmediate se transcoding ko chunk kar do",
    ],
    correctIndex: 2,
    explanation:
      "ffmpeg ek external program hai, JavaScript nahi — isliye worker_threads (jo JS chalata hai) fit nahi. child_process.spawn use ffmpeg ko alag process ke roop mein chalata hai, streamed stdout/stderr ke saath, bina main event loop block kiye. cluster alag problem (HTTP scaling) hai. setImmediate CPU kaam ko sirf defer karta hai, hataata nahi — aur yahan kaam JS mein hai bhi nahi.",
    difficulty: "medium",
  },
];

export default quiz;
