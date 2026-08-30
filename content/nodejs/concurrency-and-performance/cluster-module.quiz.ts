import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cluster-module-1",
    question:
      "`cluster` module N workers ko same port par `listen` kaise karne deta hai bina 'address in use' error ke?",
    options: [
      "Har worker apna alag port use karta hai aur cluster unhe map karta hai",
      "Primary (master) process actual socket rakhta hai aur port par bind karta hai; workers ki `listen` call IPC se primary ko forward hoti hai, aur primary incoming connections accept karke workers ko distribute karta hai (Linux/macOS par round-robin)",
      "Node OS ko batata hai ki port sharing allowed hai via SO_REUSEPORT, har worker independently accept karta hai",
      "Sirf ek worker actually listen karta hai, baaki idle rehte hain",
    ],
    correctIndex: 1,
    explanation:
      "Primary socket banata hai aur `listen` karta hai; workers ka `listen` primary ko forward hota hai. Do distribution modes: round-robin (default Linux/macOS — primary har connection ek worker ko deta hai) aur shared-socket (default Windows — OS kernel decide karta hai kaunsa worker accept kare, uneven ho sakta hai). Option A/D galat. Option C SO_REUSEPORT ka description hai jo cluster ka default mechanism nahi hai.",
    difficulty: "medium",
  },
  {
    id: "cluster-module-2",
    question:
      "Cluster mode on karte hi ek session-heavy app mein intermittent 'logged out' complaints aane lagti hain. Kya wajah?",
    options: [
      "Cluster module sessions ko corrupt kar deta hai",
      "Session ek in-memory `Map` mein ek worker ke andar store ho raha tha; round-robin distribution ke kaaran user ki agli request kisi doosre worker par jaati hai jiske paas wo session nahi — fix: session store ko Redis par move karo (ya sticky sessions, jo fragile hai)",
      "Har worker ka clock alag hota hai isliye session TTL galat calculate hota hai",
      "Cluster mode HTTPS support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Har worker = full process, apni memory. Ek worker ka in-memory session doosre worker ko nahi dikhta. Round-robin ke saath consecutive requests alag workers par jaati hain -> user 'kho' jaata hai. Cluster on karte hi har in-memory assumption audit karo: sessions, in-proc cache, rate-limit counters, WebSocket rooms. Fix: shared store (Redis/DB), ya load balancer par sticky sessions (quick but worker crash = sessions gone). Option A/C/D galat.",
    difficulty: "medium",
  },
  {
    id: "cluster-module-3",
    question:
      "Ek endpoint har request par 300ms CPU leta hai. `cluster` (8 workers) is problem ko solve karta hai?",
    options: [
      "Haan — 8 workers matlab 8x tez, endpoint 37ms le lega",
      "Nahi — `cluster` poore HTTP server ke N copies banata hai (throughput scaling for concurrent requests); har worker mein wahi endpoint apne event loop ko 300ms block karega. Per-request CPU stall ke liye `worker_threads` chahiye (ek CPU-bound function offload)",
      "Haan, lekin sirf agar `UV_THREADPOOL_SIZE` bhi badhaya jaye",
      "Nahi — cluster CPU-bound apps ke liye completely useless hai",
    ],
    correctIndex: 1,
    explanation:
      "`cluster` aur `worker_threads` interchangeable nahi. `cluster` = poora server replicate karo — jab bahut concurrent requests hain, throughput cores ke saath scale hota hai. Lekin ek single request ka 300ms CPU stall har worker mein wahi rahega (har worker ka apna single event loop). Us function ko `worker_threads` par offload karo. Option A math galat hai (ek request ek worker par hi chalti hai). Option D over-states — cluster I/O-heavy multi-request loads ke liye useful hai.",
    difficulty: "hard",
  },
  {
    id: "cluster-module-4",
    question:
      "Kubernetes/ECS par deploy karte waqt `cluster` (ya `pm2 -i max`) container ke andar chalane ke baare mein best practice kya hai?",
    options: [
      "Hamesha `pm2 -i max` use karo maximum performance ke liye",
      "Avoid karo — orchestrator already replicas, health checks, rolling deploys, aur autoscaling deta hai; `cluster` inside a pod se do layers of process management overlap karti hain, CPU limits `os.cpus()` se match nahi karte, aur graceful-shutdown semantics takrati hain. Best practice: 1 process per container, scale via replicas/HPA",
      "Cluster ko sirf tab use karo jab pod mein 16+ cores hon",
      "Container ke andar cluster aur bahar replicas dono ek saath use karo",
    ],
    correctIndex: 1,
    explanation:
      "Orchestrated setups mein: 1 Node process per container, N replicas behind a Service/load balancer. Pod ke andar `cluster`/`pm2 -i max` se: `os.cpus()` host ke cores dikhata hai (cgroup limit nahi), to app zaroorat se zyada workers fork karta hai; crash/restart aur `kubectl rollout` ka graceful shutdown worker-drain logic se takrata hai; resource accounting confusing ho jaati hai. `cluster` single-VM/bare-metal deploys ke liye hai, ya PM2 ke through. Option A/C/D anti-patterns hain.",
    difficulty: "medium",
  },
];

export default quiz;
