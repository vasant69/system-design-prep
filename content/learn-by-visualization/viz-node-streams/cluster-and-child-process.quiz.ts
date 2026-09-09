import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cluster-and-child-process-1",
    question: "`cluster` module ka main purpose kya hai?",
    options: [
      "Ek CPU-bound request ko multiple threads pe todkar fast karna",
      "Ek Node app ko har CPU core pe ek worker process ke roop mein chalana, sab ek shared port pe",
      "Alag machines pe Node instances deploy karna",
      "Memory leaks ko automatically detect karna",
    ],
    correctIndex: 1,
    explanation:
      "Ek Node process ek hi core use karta hai. `cluster` master process se `cluster.fork()` karke N worker processes banata hai (aam taur pe core count jitne), aur sab workers ek hi listening port share karte hain — OS/master naye connections unmein round-robin baant deta hai. Isse throughput badhta hai. Ye ek single slow request ko fast nahi karta, aur ek machine tak hi seemit hai (multi-machine ke liye load balancer chahiye).",
    difficulty: "medium",
  },
  {
    id: "cluster-and-child-process-2",
    question: "`spawn` aur `exec` mein kya farak hai?",
    options: [
      "`spawn` sirf Windows pe, `exec` sirf Linux pe chalta hai",
      "`spawn` output ko stream karta hai (bade/lambe output ke liye); `exec` poora output memory buffer mein rakh ke callback mein deta hai (chhote output ke liye, shell ke saath)",
      "`exec` naya process nahi banata, same process mein command chalata hai",
      "Dono bilkul same hain, sirf naam alag",
    ],
    correctIndex: 1,
    explanation:
      "`spawn(cmd, args)` ek process launch karke uske `stdout`/`stderr` ko Readable streams ke roop mein deta hai — lambe ya bade output (jaise `ffmpeg`, `tar`) ke liye ideal, memory constant rehti hai. `exec(cmdString)` ek shell spawn karta hai, poora output ek buffer mein jama karta hai (default ~1MB `maxBuffer`, exceed hone pe error), aur callback mein `(err, stdout, stderr)` deta hai — chhote command output ke liye theek. `exec` shell use karta hai isliye untrusted input pe injection risk hai.",
    difficulty: "medium",
  },
  {
    id: "cluster-and-child-process-3",
    question: "Cluster workers ke beech in-memory data (jaise ek rate-limit counter ya session cache) share hota hai?",
    options: [
      "Haan, cluster automatically saari memory sync karta hai",
      "Nahi — har worker ek alag process hai apni memory ke saath; shared state ke liye Redis/DB ya sticky sessions chahiye",
      "Haan, lekin sirf `global` object",
      "Sirf tab jab `SharedArrayBuffer` use karo",
    ],
    correctIndex: 1,
    explanation:
      "Har cluster worker ek poora alag Node process hai — alag V8 heap, alag memory. Ek worker ne jo `Map` mein counter rakha, doosre worker ko nahi dikhega. Isliye in-memory sessions ya rate-limit state cluster mein tootta hai: ya sticky sessions (same client -> same worker) ya ek external shared store (Redis) use karo. `SharedArrayBuffer` cross-process nahi hai (wo worker_threads ka feature hai).",
    difficulty: "medium",
  },
  {
    id: "cluster-and-child-process-4",
    question: "`child_process.fork()` aur `worker_threads` mein core difference?",
    options: [
      "`fork` ek alag OS process banata hai (isolated memory, message-copy IPC, heavier); worker_threads ek thread hai same process mein (lighter, SharedArrayBuffer se memory share ho sakti hai)",
      "`fork` sirf CPU kaam ke liye, `worker_threads` sirf I/O ke liye",
      "Dono same hain, `fork` purana naam hai",
      "`worker_threads` alag machines pe chal sakta hai, `fork` nahi",
    ],
    correctIndex: 0,
    explanation:
      "`fork` = poora naya Node process: strong isolation (ek crash baaki ko nahi girata), zyada startup + memory cost, IPC sirf structured-clone message-passing. `worker_threads` = same process ke andar ek thread: tez spawn, kam memory, aur `SharedArrayBuffer` + `Atomics` se genuinely shared memory. In-app CPU parallelism ke liye worker_threads; alag program run karna ho ya hard isolation chahiye to `fork`/`spawn`.",
    difficulty: "easy",
  },
];

export default quiz;
