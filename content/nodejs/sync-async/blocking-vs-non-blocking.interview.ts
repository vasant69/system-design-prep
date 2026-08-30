import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bnb-1",
    question:
      "Node single-threaded hai — phir bhi ye hazaaron concurrent connections kaise handle karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Kyunki I/O non-blocking hai. Jab ek request disk/DB/network ka wait karti hai, Node us wait me baithta nahi — wo kaam libuv ya OS ko de deta hai aur wahi single thread doosri requests serve karta hai. I/O complete hone par callback queue me aata hai. Ek thread, lekin kabhi idle-wait nahi.",
    detailedAnswer:
      "Traditional 'thread per connection' model me har connection ek OS thread leta hai (~1 MB stack + context-switch cost), toh 10k connections machine ko gira dete hain (C10k problem). Node ka model: ek event loop thread jo JS chalata hai, plus libuv ka chhota thread pool (default 4) file I/O ke liye, plus OS-level event notification (epoll/kqueue/IOCP) sockets ke liye. Flow: request aati hai -> handler `db.query(cb)` call karta hai -> query driver kaam OS/pool ko deta hai, call turant return -> event loop agli request pe -> query result aane par callback queue me -> stack khali hote hi callback chalta hai. Poore process me thread kabhi 'wait' me nahi jata, isliye ek core par bhi bahut concurrency. Sharat: JS code kabhi block na kare.",
    followUp: "Is model ki sabse badi kamzori kya hai?",
    redFlag:
      "\"Node me multithreading hoti hai background me har request ke liye\" — nahi, JS ek hi thread pe; sirf kuch I/O ek chhote fixed pool pe.",
  },
  {
    id: "bnb-2",
    question:
      "Blocking operation ke do alag types kaunse hain? Dono ka fix same hai kya?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Synchronous I/O — `fs.readFileSync`, `execSync`: fix hai async/stream version. (2) CPU-bound work — bada loop, huge `JSON.parse`, sync hashing: fix hai `worker_threads` ya kaam ko todna. Async API CPU-bound ko solve nahi karta.",
    detailedAnswer:
      "Synchronous I/O: thread isliye ruka hai kyunki wo disk/network ke result ka wait kar raha hai on the main thread. Har aise call ka ek non-blocking version hai (`fs.readFile`, `fs.promises`, streams) jo kaam libuv pool/OS ko offload karta hai. Ye asli 'sync vs async' choice hai.\n\nCPU-bound: thread isliye ruka hai kyunki calculation khud lambi hai — koi wait nahi, pure computation. Ise `setTimeout` ya Promise me wrap karna sirf shuru hone ka time shift karta hai; jab chalega tab utni hi der event loop rokega. Sahi fix: `worker_threads` (alag thread, main event loop free), kaam ko chhote chunks me todna aur beech me `setImmediate` se yield karna, ya kaam ko alag process/queue worker pe bhejna.\n\nInterview me dono ko alag karke btao — ye samajh dikhata hai ki 'async' silver bullet nahi hai.",
    followUp: "worker_threads aur child_process me kab kya choose karoge?",
    redFlag: "Dono ke liye \"bas async kar do\" bolna.",
  },
  {
    id: "bnb-3",
    question:
      "Ek dev bolta hai '`fs.readFileSync` kabhi use mat karo'. Kya ye sahi hai? Kab acceptable hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Blanket rule galat hai. `readFileSync` acceptable hai jab koi concurrency nahi ho: app startup (server ne abhi listen nahi kiya), one-off CLI/build scripts, DB migrations, test setup. Galat sirf request-serving hot path me ya kisi shared long-running worker me.",
    detailedAnswer:
      "Blocking ka nuksaan = wo pending concurrent work ko rokta hai. Startup pe koi request queue nahi hoti, toh config/cert/key ko sync padhna theek hai aur code simple rehta hai — actually recommended, kyunki tum chahte ho app fully loaded hone ke baad hi `listen` kare. CLI ek kaam karke exit hota hai, concurrency hai hi nahi. Ulta: per-request `readFileSync` ek classic production bug hai — dev me file local aur chhoti, 0.1 ms; prod me network mount ya bada file, 200 ms, aur poora event loop thok deta hai. Rule ye nahi ki 'sync banned', rule ye hai 'request path me kabhi sync nahi, aur user-controlled size pe kabhi sync nahi'.",
    followUp: "Startup pe padhi hui config ko baad me reload karna ho (bina restart) toh kaise?",
  },
  {
    id: "bnb-4",
    question:
      "Production me event loop 'block' ho raha hai — isse kaise detect aur diagnose karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Metric: event loop delay/lag — `perf_hooks.monitorEventLoopDelay()` ya APM (Datadog/New Relic). Healthy under 10 ms, sustained 100 ms+ matlab blocking. Diagnose: `clinic doctor` / `clinic flame` ya `--prof` se flame graph nikaalo — jo function stack me sabse zyada time le raha hai wahi culprit (aksar sync fs, sync crypto, bada regex, huge JSON.parse).",
    detailedAnswer:
      "Detection: ek baseline timer (`setInterval` 1000 ms) ka actual fire time measure karo — extra = lag. Better: `monitorEventLoopDelay({ resolution: 20 })` jo ek histogram deta hai (mean, p99, max). APM tools yahi metric alert karte hain.\n\nDiagnosis steps: (1) Confirm lag spikes traffic/endpoint se correlate karte hain ya nahi. (2) `clinic doctor` run karo — wo bata deta hai bottleneck event loop hai, GC hai, ya I/O. (3) `clinic flame` ya `node --prof` + `--prof-process` se CPU flame graph — sabse wide frame = sabse zyada blocking wala function. (4) Common culprits check karo: `*Sync` calls (`grep -r 'Sync('`), `JSON.parse` on large payloads, catastrophic-backtracking regex on user input (ReDoS), synchronous logging in tight loops, bade `crypto` operations bina async version ke.\n\nFix pattern: I/O ko async/stream karo; CPU-bound ko worker thread ya queue pe; regex ko `re2` se; logging ko pino async transport pe.",
    followUp: "GC pauses aur blocking code me event-loop-lag graph pe farak kaise pehchanoge?",
    redFlag:
      "Sirf CPU% ya memory dekhna aur event-loop-specific metric na dekhna — blocking hote hue bhi CPU 100% na ho (agar wait-based) ya memory normal ho sakti hai.",
  },
  {
    id: "bnb-5",
    question:
      "Code output: is server me `/ping` route hai jo turant `pong` deta hai, aur `/report` route jo `fs.readFileSync` se 2-second wala kaam karta hai. Ek client `/report` hit karta hai, 100 ms baad doosra client `/ping` hit karta hai. `/ping` ka response kab milega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`/ping` ka response tab milega jab `/report` ka `readFileSync` khatam hoga — yaani roughly 1.9 second baad (2 s total minus wo 100 ms jo pehle beet chuke). Event loop `/report` ke sync call me atka hai, toh `/ping` ka handler chal hi nahi sakta jab tak wo release na ho.",
    detailedAnswer:
      "Timeline: t=0 `/report` request aati hai, handler `fs.readFileSync` pe pahunchta hai aur event loop block ho jata hai. t=100 ms `/ping` ki TCP connection OS accept kar leta hai aur data socket buffer me aa jata hai, lekin Node ka JS us request ka handler run nahi kar sakta kyunki thread abhi `readFileSync` me hai. t=2000 ms `readFileSync` return karta hai, `/report` response bhej diya jata hai, event loop aage badhta hai, ab `/ping` ka handler chalta hai aur `pong` turant bhej deta hai — total wait `/ping` client ke liye ~1900 ms. Yahi blocking ka core demo hai: ek unrelated slow route ne ek trivially-fast route ko poori tarah rok diya. Agar `/report` `fs.promises.readFile` ya stream use karta, toh `/ping` ~0 ms me serve ho jata.",
    followUp: "Agar `/report` ka kaam CPU-bound hota (I/O nahi), toh async version se `/ping` bach jata kya?",
    redFlag:
      "\"Dono routes alag hain toh ek doosre ko affect nahi karega\" — same event loop, ek block sabko block karta hai.",
  },
];

export default questions;
