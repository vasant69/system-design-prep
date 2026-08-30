import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "os-1",
    question: "Node app ko machine ke saare CPU cores use karwane ho toh kya karoge, aur kitne workers?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek Node process JS ke liye ek core use karta hai, toh cluster module (ya PM2 / container replicas) se ek process per core spawn karo. Count = `os.availableParallelism()` — ye container/cgroup-aware hai, `os.cpus().length` nahi.",
    detailedAnswer:
      "```javascript\nconst cluster = require('node:cluster');\nconst os = require('node:os');\nif (cluster.isPrimary) {\n  const n = os.availableParallelism();\n  for (let i = 0; i < n; i++) cluster.fork();\n} else {\n  require('./server'); // har worker apna HTTP server\n}\n```\n\nOS incoming TCP connections ko workers ke beech distribute karta hai. Count tuning: CPU-bound work ke liye N = cores theek hai. I/O-bound ke liye thoda kam rakh sakte ho (context-switch overhead), ya as-is chhod do kyunki idle workers sasta hai. Constraint: N workers ka combined RSS machine RAM ke andar rahe — har worker ka apna heap hota hai.",
    followUp: "Container mein `os.cpus().length` galat kyun deta hai?",
    redFlag: "\"Node multi-threaded hai, ek process saare cores use kar lega\" — JS execution single-threaded hai.",
  },
  {
    id: "os-2",
    question: "Ek `/health` endpoint mein os module se kya-kya report karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Memory pressure: `(os.totalmem() - os.freemem()) / os.totalmem()` as percent. CPU pressure: `os.loadavg()[0]` (Unix). Identity: `os.hostname()`. Liveness: `process.uptime()`. Optionally `os.uptime()` (machine) aur `process.memoryUsage().rss`.",
    detailedAnswer:
      "Ek useful health payload:\n\n```javascript\n{\n  status: 'ok',\n  hostname: os.hostname(),      // kaunsa instance\n  uptimeSec: process.uptime(),  // kab restart hua\n  memUsedPct: Math.round((1 - os.freemem() / os.totalmem()) * 100),\n  load1m: os.loadavg()[0],\n  rssMb: Math.round(process.memoryUsage().rss / 1e6),\n}\n```\n\nDo caveats: (1) `os.*mem()` container mein host ke numbers deta hai — pod limit ke against galat lag sakta hai; `process.memoryUsage().rss` ko pod limit se compare karo. (2) `os.loadavg()` Windows pe `[0,0,0]`. Performance: `os.freemem()`/`loadavg()` ko per-request call mat karo, ek interval pe sample karke cache karo.",
    followUp: "Container mein memory usage sahi kaise measure karoge?",
  },
  {
    id: "os-3",
    question: "`os.cpus().length` aur `os.availableParallelism()` mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`os.cpus().length` = host machine ke logical cores, cgroup/affinity limits ignore karke. `os.availableParallelism()` (Node 18.19+) = is process ke liye actually usable parallelism — cgroup CPU quota aur CPU affinity mask ko dekhta hai. Pool sizing ke liye hamesha availableParallelism.",
    detailedAnswer:
      "Bare metal pe dono same. Difference container/constrained env mein: ek 64-core host pe `docker run --cpus=4` ke andar `os.cpus().length === 64` par `os.availableParallelism() === 4`. Agar tum cpus().length se workers spawn karoge toh 64 processes, har ek RAM khaayega, aur kernel CFS unhe 4 cores ke quota mein throttle karega — latency spikes. availableParallelism sahi count deta hai. Fallback purane Node ke liye: cgroup files (`/sys/fs/cgroup/cpu.max` ya `cpu.cfs_quota_us`) padho, ya `process.env` se explicit `WEB_CONCURRENCY` set karo.",
    followUp: "Agar Node version purana hai aur availableParallelism nahi hai toh?",
    redFlag: "\"Dono same cheez hain\" — container mein bahut alag values.",
  },
  {
    id: "os-4",
    question: "`os.uptime()` aur `process.uptime()` — farak?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`os.uptime()` = poori machine kitni der se boot hai (seconds). `process.uptime()` = ye Node process kitni der se chal raha hai (seconds). Restart detection ke liye `process.uptime()` chahiye.",
    detailedAnswer:
      "Common mistake: health check mein `os.uptime()` daal dena ye samajh ke ki 'app kab se up hai'. Machine hafton se up ho sakti hai jabki app abhi 10 second pehle crash-restart hua. Deploy/crash detect karne ke liye `process.uptime()` — agar wo bar-bar chhota hota hai toh app crash-loop mein hai. `os.uptime()` sirf tab useful hai jab tum machine-level events (reboot) track kar rahe ho.",
    followUp: "Crash-loop detect karne ke liye aur kya signal use karoge?",
  },
  {
    id: "os-5",
    question: "os module se platform-specific behaviour kaise handle karoge? Ek example.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`os.platform()` return karta hai `'linux'` / `'darwin'` / `'win32'`. Us pe branch karo — jaise file ko OS default app mein kholne ke liye `win32` → `start`, `darwin` → `open`, else `xdg-open`. `os.arch()` (`x64`/`arm64`) native binary select karne ke liye.",
    detailedAnswer:
      "```javascript\nconst { platform } = require('node:os');\nconst opener = { win32: 'start', darwin: 'open' }[platform()] || 'xdg-open';\n```\n\nDoosre uses: `os.EOL` (`'\\r\\n'` Windows, `'\\n'` else) line endings ke liye; `os.tmpdir()` / `os.homedir()` OS-correct paths; `os.arch()` se `prebuilds/${platform}-${arch}/addon.node` load karna. Note: `os.platform()` === `process.platform` — dono same value dete hain, koi bhi use kar lo. Prefer os module explicitly jab code 'system info' ke context mein ho.",
    followUp: "`os.platform()` aur `process.platform` mein koi farak hai?",
  },
];

export default questions;
