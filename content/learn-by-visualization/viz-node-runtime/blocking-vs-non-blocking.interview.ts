import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bnb-1",
    question: "Blocking aur non-blocking call mein Node ke context mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Blocking call main thread ko rok deti hai jab tak wo complete na ho — us dauraan koi doosri request/timer/callback nahi chalta. Non-blocking call kaam shuru karke turant return hoti hai; result baad mein callback ya promise se aata hai jabki event loop baaki kaam karta rehta hai.",
    detailedAnswer:
      "Node ka JS ek single thread pe chalta hai. `fs.readFileSync('x')` blocking hai: disk read ke poore time thread wahin wait karta hai, event loop ek tick aage nahi badh sakta, saare pending clients + timers freeze. `fs.readFile('x', cb)` non-blocking hai: Node read ko libuv/OS ko de deta hai, call turant return hoti hai, thread aage badh jaata hai; jab read khatam hota hai, `cb` event loop ki queue mein aata hai aur run hota hai. Pattern: `*Sync` suffix wali APIs (readFileSync, execSync, pbkdf2Sync) block; plain callback / `fs.promises` versions nahi. Non-I/O CPU-heavy sync code (bada JSON.parse, long loop) bhi practically blocking hota hai.",
    followUp: "Ek endpoint jo readFileSync use karta hai — 100 concurrent requests pe throughput ka kya hoga?",
    redFlag: "\"Sync call sirf us request ko slow karti hai, baaki chalti rehti hain\".",
  },
  {
    id: "bnb-2",
    question: "Ek legacy Express route har request pe `JSON.parse(fs.readFileSync('catalog.json'))` (5MB file) karta hai aur load pe API slow hai. Kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Do blocking ops hain: sync file read + sync 5MB JSON.parse. File ko startup pe ek baar load karke memory mein cache karo (agar wo mostly static hai), ya `await fs.promises.readFile` + parse. Bahut bade/frequent data ke liye streaming JSON parser ya ek worker thread.",
    detailedAnswer:
      "Step 1 — measure: event loop lag (`perf_hooks.monitorEventLoopDelay`) confirm karega ki blocking hai, network nahi. Step 2 — remove the sync read: agar catalog rarely badalta hai, use process start pe ek baar `readFileSync` (traffic se pehle, acceptable) karke ek module-level variable mein rakho, ya `fs.watch` se refresh. Agar per-request fresh chahiye, `await fs.promises.readFile`. Step 3 — the parse is still sync and O(size): 5MB `JSON.parse` bhi event loop ko ~tens of ms block karega. Options: (a) cache the parsed object, parse only on change; (b) stream + incremental parse (`stream-json`); (c) parse in a `worker_thread` and post the result back; (d) move the data to a real store (Redis/DB) with indexed queries so you never load the whole blob. Step 4 — add a bounded cache + ETag so repeat requests skip the work entirely.",
    followUp: "`JSON.parse` khud blocking kyun hai jabki wo file I/O nahi hai?",
  },
  {
    id: "bnb-3",
    question: "Toh kya `*Sync` APIs kabhi use nahi karni chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Nahi, wo galat nahi — bas jagah sahi honi chahiye. Startup/config load (server listen karne se pehle), CLI tools jo ek kaam karke exit ho jaate hain, build/migration scripts — yahan blocking bilkul theek hai. Live server ke request handlers, timers, aur hot paths pe kabhi nahi.",
    detailedAnswer:
      "Blocking ka nuksan sirf tab hai jab koi 'baaki kaam' rukne ke liye maujood ho. `const cfg = JSON.parse(fs.readFileSync('config.json'))` `app.listen()` se pehle: koi traffic nahi hai, kuch block nahi ho raha — aur code simple + linear rehta hai, isliye yahan `readFileSync` preferred hai. Ek CLI jaise `mytool build` jo sequentially files process karke exit karta hai: concurrency hai hi nahi, sync code sahi choice hai. Ulta, ek HTTP server jo hazaaron clients serve kar raha hai: ek `execSync` ya `readFileSync` sabko stall kar deta hai. Rule: 'is process ko abhi kisi aur ke liye responsive rehna hai?' Haan -> async. Nahi -> sync fine.",
    followUp: "Ek script jo 10,000 files process karti hai — sync loop se ya async concurrency-limited se, kaunsa aur kyun?",
  },
  {
    id: "bnb-4",
    question: "Non-blocking `fs.readFile` I/O ko async banata hai — ye kaam actually kahan hota hai? Kya wo 'free' hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "File read libuv ke thread pool (default 4 threads) pe hota hai; call turant return hoti hai aur callback ready hone pe queue hota hai. Free nahi — pool bounded hai, aur callback + JSON parsing waapas main thread pe hi chalte hain.",
    detailedAnswer:
      "`fs.readFile` non-blocking *for the main thread* hai, magar disk I/O phir bhi hota hai — libuv use apne thread pool pe karta hai (network I/O ke ulat, jo OS async epoll/kqueue/IOCP pe hota hai). Implications: (1) Pool ka default size 4 hai — 5+ simultaneous fs/crypto/zlib ops queue karte hain; heavy fs workloads pe `UV_THREADPOOL_SIZE` tuning consider hoti hai. (2) Jab read complete hota hai, tumhara callback main thread pe run hota hai — agar wo callback bada `JSON.parse` ya heavy processing kare, wo phir blocking hai. (3) Buffer memory bhi lagti hai — poori file RAM mein aati hai; multi-hundred-MB files ke liye stream karo. Yaani async I/O 'wait' ko free karta hai, 'work' ko nahi.",
    followUp: "Network request (`await fetch`) aur file read (`fs.readFile`) — dono async hain, par libuv unhe alag tarah handle karta hai. Kaise?",
  },
];

export default questions;
