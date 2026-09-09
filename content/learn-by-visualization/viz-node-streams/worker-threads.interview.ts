import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "wt-1",
    question: "Worker threads kis problem ko solve karte hain, aur kab NAHI use karne chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "CPU-bound sync computation (hashing, bada JSON.parse, image/video processing, sync zlib) main event loop ko rok deta hai — worker thread us kaam ko alag OS thread (apna V8 isolate) pe le jaata hai taaki loop free rahe. I/O ke liye use mat karo — fs/net already async hai.",
    detailedAnswer:
      "Node ka JS ek thread pe chalta hai. Agar ek request handler `pbkdf2Sync` ya `sharp().resize()` jaisa pure-CPU kaam 300ms kare, to us dauraan koi doosri request, timer, ya health-check process nahi hota. worker_threads se: `new Worker('./job.js')` ek alag thread banata hai jiska apna event loop aur heap hai; heavy loop wahan chalta hai (ideally doosre core pe), result `postMessage` se wapas aata hai. Kab nahi: (1) I/O-bound kaam — libuv pehle se non-blocking hai, worker sirf overhead add karega. (2) Bahut chhote tasks — thread spawn + message-copy cost kaam se zyada ho jaata hai; ek pool (Piscina) use karo. (3) Jab data bahut bada hai aur baar-baar copy hoga — SharedArrayBuffer ya transfer consider karo.",
    followUp: "Har request pe naya Worker banane mein kya problem hai, aur pool kaise madad karta hai?",
    redFlag: "\"Worker threads se database queries parallel kar dete hain\" — DB call already async I/O hai.",
  },
  {
    id: "wt-2",
    question: "Main thread aur worker ke beech data kaise jaata hai? `postMessage` kya karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`postMessage(value)` value ko structured-clone algorithm se ek deep COPY banata hai — dono taraf alag objects. Genuinely share karna ho to `SharedArrayBuffer` pass karo (same bytes, Atomics se sync), ya `transferList` se ArrayBuffer ka ownership move karo (sender se detach).",
    detailedAnswer:
      "Default: structured clone — JSON se zyada capable (Map, Set, Date, TypedArray, circular refs OK; par functions, class instances, DOM nodes nahi). Ye copy hai, isliye 50MB object bhejna = serialize + allocate + copy, dono threads ki memory mein. Zero-copy options: (1) `SharedArrayBuffer` — ek hi memory region dono threads dekhte hain; race conditions se bachne ke liye `Atomics.add/wait/notify`. (2) `worker.postMessage(buf, [buf.buffer])` transferList — underlying `ArrayBuffer` ka ownership worker ko move ho jaata hai, sender ke paas wo detached (unusable) ho jaata hai, par copy nahi hoti. Objects implicitly kabhi share nahi hote kyunki har worker ka alag V8 isolate hai.",
    followUp: "SharedArrayBuffer ke saath do threads ek counter increment karein to kya galat ho sakta hai?",
  },
  {
    id: "wt-3",
    question: "worker_threads aur child_process.fork mein kya farak hai? Kaunsa kab?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "fork ek alag OS process banata hai — isolated memory, message-copy IPC, heavier startup, crash contained. worker_threads ek thread hai same process mein — lighter, faster spawn, aur SharedArrayBuffer se shared memory possible. In-app CPU parallelism ke liye workers; alag program ya hard isolation ke liye fork.",
    detailedAnswer:
      "child_process (`fork`/`spawn`): poora naya Node/OS process. Fayde — ek child segfault/crash ho to parent zinda; strong isolation. Nuksan — RAM per process zyada (naya V8 + heap), startup slow, IPC sirf structured-clone messages (shared memory nahi). worker_threads: same process, alag thread. Fayde — spawn sasta, memory kam, `SharedArrayBuffer`/`MessageChannel` se efficient sharing. Nuksan — ek worker ka unhandled crash poore process ko le ja sakta hai agar handle na ho; V8 isolate ke rules follow karne padte hain. Rule of thumb: CPU-heavy JS jo tumhare hi codebase ka hai -> worker_threads (+ pool). Kisi external binary ko run karna (ffmpeg, python) ya jahan process crash-isolation zaroori hai -> child_process.",
    followUp: "Cluster module in dono se kaise related hai?",
  },
  {
    id: "wt-4",
    question: "Ek Express API mein `/thumbnail` endpoint sync image resize karke server ko slow kar raha hai. Kaise fix karoge?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Resize ko ek worker pool pe offload karo. Startup pe ek Piscina (ya khud ka fixed Worker pool) banao; handler mein `await pool.run({ buffer, width })`. Event loop free rehta hai, doosre requests aur timers chalte rehte hain, aur pool concurrency ko CPU count tak bound karta hai.",
    detailedAnswer:
      "Problem: `sharp(buf).resize(200).toBufferSync()` (ya koi pure-JS resize) ~150ms CPU — us window mein poora loop blocked. Fix steps: (1) `const pool = new Piscina({ filename: './resize-worker.js', maxThreads: os.cpus().length - 1 })` module scope mein (per-request Worker mat banao — spawn cost). (2) `resize-worker.js` `module.exports = async ({ buffer, width }) => sharp(buffer).resize(width).toBuffer()`. (3) Handler: `const out = await pool.run({ buffer: req.file.buffer, width: 200 }); res.type('jpeg').send(out)`. (4) Bade buffers pe transferList consider karo taaki copy na ho. (5) Pool ko bounded rakho + queue length pe backpressure/429 taaki overload pe memory na phoote. Ab CPU work doosre cores pe, main thread sirf orchestration.",
    followUp: "Pool ki queue lambi hone lage (sab threads busy) to client ko kya response dena chahiye?",
  },
];

export default questions;
