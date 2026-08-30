import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "os-module-1",
    question:
      "Ek Docker container jiska limit `--cpus=2` hai, ek 32-core host pe chal raha hai. `os.cpus().length` kya return karega?",
    options: [
      "2 — container ka CPU limit",
      "32 — host machine ke logical cores; os.cpus() cgroup limits ko nahi dekhta",
      "1 — kyunki Node single-threaded hai",
      "0 — container mein CPU info available nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "os.cpus() (aur os.totalmem()) host machine ke values dete hain, container ke cgroup limits ke nahi. Isliye pool/worker sizing ke liye `os.availableParallelism()` (Node 18.19+) prefer karo — wo cgroup aur CPU affinity aware hai. Warna 32 workers spawn honge jabki sirf 2 cores usable hain.",
    difficulty: "medium",
  },
  {
    id: "os-module-2",
    question:
      "Ek cross-platform `/health` endpoint mein tum alerting `os.loadavg()[0]` pe baandhte ho. Windows pe kya problem aayegi?",
    options: [
      "Windows pe loadavg 100x bada hota hai",
      "Windows load average support nahi karta — `os.loadavg()` wahan hamesha `[0, 0, 0]` deta hai, toh alert kabhi trigger nahi hoga",
      "Windows pe os.loadavg() exception throw karta hai",
      "Koi problem nahi, values identical hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "Load average ek Unix concept hai (run-queue length over 1/5/15 min). Windows mein equivalent nahi hai, isliye Node `[0, 0, 0]` return karta hai — throw nahi karta. Windows-inclusive health checks ke liye `process.cpuUsage()` ya OS perf counters use karo, aur loadavg-based alerts sirf Unix pe enable karo.",
    difficulty: "easy",
  },
  {
    id: "os-module-3",
    question:
      "Temp file banane ke liye kaunsa approach sahi hai jo Windows, macOS, aur Linux teeno pe kaam kare?",
    options: [
      "`fs.writeFile('/tmp/data.csv', ...)`",
      "`fs.writeFile(path.join(os.tmpdir(), 'data.csv'), ...)` — os.tmpdir() har OS ka sahi temp folder aur TMPDIR/TEMP env vars respect karta hai",
      "`fs.writeFile('./data.csv', ...)` current folder mein",
      "`fs.writeFile(os.homedir() + '/data.csv', ...)`",
    ],
    correctIndex: 1,
    explanation:
      "`/tmp` Windows pe exist nahi karta aur kuch hardened Linux setups mein noexec/per-user hota hai. `os.tmpdir()` OS ka canonical temp location deta hai (Windows pe AppData\\Local\\Temp) aur TMPDIR/TEMP/TMP env vars ko honour karta hai. OS apne temp cleanup se orphaned files bhi hata deta hai. Option C/D temp semantics nahi dete (no auto-cleanup, wrong location).",
    difficulty: "easy",
  },
  {
    id: "os-module-4",
    question:
      "Ek Node memory leak debug karna hai. Kaunsa API is process ka actual memory footprint deta hai?",
    options: [
      "`os.totalmem()` minus `os.freemem()`",
      "`process.memoryUsage()` — `.heapUsed`, `.rss`, `.external` is Node process ke liye",
      "`os.loadavg()`",
      "`os.cpus()[0].times`",
    ],
    correctIndex: 1,
    explanation:
      "`os.*mem()` poori machine ki RAM batata hai — usme baaki saare processes bhi shamil hain, toh leak isolate nahi hoti. `process.memoryUsage()` sirf is Node process ka: heapUsed (V8 objects), rss (total resident), external (C++ objects like Buffers), arrayBuffers. Leak track karne ke liye heapUsed ko over time monitor karo. Option C/D CPU-related hain.",
    difficulty: "medium",
  },
];

export default quiz;
