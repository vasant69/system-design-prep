import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "win-1",
    question: "Node.js kya hai? V8 aur libuv ka role batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node ek server-side JavaScript runtime hai. V8 JS ko compile karke chalata hai (heap + GC bhi deta hai). libuv event loop aur ek thread pool deta hai jisse file/network I/O non-blocking rehta hai. Upar C++ bindings + Node ki JS stdlib.",
    detailedAnswer:
      "Node = V8 + libuv + C++ bindings + JS standard library, ek executable mein packed. V8 Google ka engine hai — JS ko JIT se machine code banata hai, memory heap aur garbage collector manage karta hai. libuv ek C library hai jo cross-platform event loop deta hai plus ek thread pool (default 4) fs/crypto/zlib/dns ke liye; network I/O ke liye wo OS ke epoll/kqueue/IOCP use karta hai. C++ bindings in native capabilities ko JS objects (`fs`, `net`, `crypto`) ke roop mein expose karte hain. Result: ek hi JS program browser ke bahar chalta hai aur real OS kaam karta hai, non-blocking model ke saath.",
    followUp: "Agar libuv ka thread pool sirf 4 ka hai, to Node hazaaron concurrent connections kaise handle karta hai?",
    redFlag: "\"Node ek programming language hai\" ya \"Node aur Express same cheez hain\".",
  },
  {
    id: "win-2",
    question: "Node aur akela V8 (jaise browser mein) mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "V8 sirf JS execute karta hai. Node usme libuv + bindings + stdlib add karta hai, isliye Node mein `fs`, `http`, `process`, `Buffer`, `require` hote hain jo browser V8 mein nahi. Browser V8 ke paas DOM/`window`/`fetch` hote hain jo Node ke paas nahi (older versions).",
    detailedAnswer:
      "Dono ECMAScript hi chalate hain, magar 'host environment' alag hai. Browser V8 ke host objects: `window`, `document`, DOM APIs, `localStorage`, `fetch`, `alert`. Node ka host: `global`, `process`, `Buffer`, `__dirname`, `require`/`module`, aur `fs`/`net`/`os`/`crypto` jaisi core modules. Event loop dono mein hai par implementation alag — browser ka apna, Node ka libuv-based with distinct phases (timers, poll, check...). Node file system aur raw TCP/UDP de sakta hai; browser security sandbox ki wajah se nahi.",
    followUp: "Node mein `window` kyun nahi hai, aur `globalThis` kis liye aaya?",
  },
  {
    id: "win-3",
    question: "Ye kaise possible hai ki Node single-threaded hoke bhi 10,000 connections serve kar le?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Kyunki JS thread sirf orchestration karta hai, waiting nahi. Har connection ka slow I/O (disk, DB, network) OS/libuv ko de diya jaata hai; thread khali ho jaata hai aur agla event handle karta hai. Callback tab chalta hai jab data ready ho.",
    detailedAnswer:
      "Traditional thread-per-request server mein 10k connections = 10k threads, har ek memory + context-switch cost. Node event loop model mein ek thread ke paas ek queue hai. Jab `db.query(...)` ya `socket.read()` hota hai, wo non-blocking hai — request OS ko jaati hai aur thread turant next callback pe move kar jaata hai. Jab DB response aata hai, uska callback queue hota hai aur loop uthata hai. CPU idle nahi hota kyunki 'waiting' free hai. Catch: agar koi callback CPU-heavy kaam (e.g. bada JSON.parse, sync crypto) kare to poora loop ruk jaata hai — us case mein worker_threads ya offload chahiye.",
    followUp: "Us model mein ek CPU-bound function (jaise password hashing loop) kya damage karega, aur fix kya hai?",
    redFlag: "\"Node har request ke liye naya thread ya process banata hai\".",
  },
  {
    id: "win-4",
    question: "`node app.js` chalne par step-by-step kya hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Node process start, V8 isolate + libuv loop init hote hain. `app.js` ek module wrapper mein wrap hota hai, V8 use compile+run karta hai top se bottom (sync). Async calls (timers, I/O) register ho jaati hain. Sync code khatam hone par event loop chalta hai jab tak koi pending kaam ho.",
    detailedAnswer:
      "(1) Node binary boot: V8 isolate/context banta hai, libuv event loop initialise hota hai, core modules load hote hain. (2) Entry file `app.js` ko Node `(function (exports, require, module, __filename, __dirname) { ... })` wrapper mein daalta hai. (3) V8 us function ko compile karke synchronously execute karta hai — `require()` calls yahin resolve hote hain (CJS sync hai), top-level statements chalte hain. (4) Jo async cheezein mili (`setTimeout`, `fs.readFile`, `server.listen`) unke handles libuv/OS ke paas register ho jaate hain. (5) Script ka sync part khatam. (6) Event loop phases start karta hai; jab callback ka data ready hota hai wo run hota hai; microtasks (promises, `process.nextTick`) har step ke beech drain hote hain. (7) Jab koi pending handle/callback nahi bachta, loop exit karta hai aur process 0 se close ho jaata hai.",
    followUp: "Module wrapper function kis liye hai — top-level `var` truly global kyun nahi hota?",
  },
];

export default questions;
