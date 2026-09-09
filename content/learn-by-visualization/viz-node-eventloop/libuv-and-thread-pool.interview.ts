import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ltp-1",
    question: "libuv kya hai aur Node mein iska role kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "libuv ek C library hai jo Node ko cross-platform event loop deti hai aur ek chhota thread pool (default 4). Event loop non-blocking network I/O aur timers handle karta hai; thread pool wo kaam karta hai jinka OS async version nahi hai — fs, kuchh crypto, zlib, dns.lookup.",
    detailedAnswer:
      "Node do bade parts se bana hai: V8 (JS execute karta hai) aur libuv (async I/O ka engine). libuv event loop ko implement karti hai aur phases ko drive karti hai. Network sockets ke liye libuv OS ke efficient mechanisms use karti hai — Linux pe epoll, macOS pe kqueue, Windows pe IOCP — koi extra thread nahi. Lekin file system operations aur kuchh CPU-ish kaam (pbkdf2, scrypt, randomBytes, zlib, getaddrinfo via dns.lookup) ke liye portable async nahi hai, isliye libuv ek thread pool rakhti hai (default 4 threads, `UV_THREADPOOL_SIZE` se badalne yogya). Aisa job pool ke ek thread pe blocking chalta hai; complete hone pe uska result callback event loop ki poll queue mein daal diya jaata hai, jahan wo tumhare JS callback ke roop mein chalta hai.",
    followUp: "Kaunse operations OS async use karte hain aur kaunse thread pool — do-do example do.",
    redFlag: "\"libuv har async cheez ke liye naya thread banata hai\" — network I/O thread-free hai.",
  },
  {
    id: "ltp-2",
    question:
      "Ek Node service ke DB queries fast hain, par jab bhi ek `/report` endpoint (bade zip + PDF banata hai) hit hota hai, saare doosre endpoints slow ho jaate hain. Kyun, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "zlib/crypto/fs kaam thread pool (default 4) pe chalta hai. Ek bada report request 4 mein se kai threads kabza kar leta hai, to baaki requests ka fs/crypto/dns.lookup un threads ke liye wait karta hai. Pool size badhao, kaam ko worker_threads ya alag process pe bhejo, aur report generation ki concurrency cap karo.",
    detailedAnswer:
      "Diagnosis: DB queries network I/O hain (pool-free), isliye wo theek hain. Report path zlib compression, shayad crypto signing, aur fs writes karta hai — sab thread pool pe. Sirf 4 threads hain, to ek heavy report 2-3 threads seconds ke liye rok leta hai; is dauran har doosri request ka file read ya dns.lookup queue mein atakta hai, isliye latency badhti hai. Fixes: (1) launch pe `UV_THREADPOOL_SIZE` ko CPU cores ke aas-paas badhao; (2) report generation ko `worker_threads` ya ek dedicated child process/queue worker pe move karo taaki wo main service ke pool se compete na kare; (3) ek time pe kitne reports ban sakte hain, uspe limit lagao (p-limit / job queue); (4) `monitorEventLoopDelay` aur pool utilization metrics add karo.",
    followUp: "worker_threads aur alag process mein is case ke liye kya trade-off hai?",
    redFlag: "\"CPU zyada de do\" bina ye samjhe ki bottleneck 4 fixed threads hain, cores nahi.",
  },
  {
    id: "ltp-3",
    question: "Node single-threaded hai — to phir thread pool kya cheez hai? Contradiction nahi?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Tumhara JavaScript ek hi thread pe chalta hai — event loop wahi thread hai. Thread pool alag hai: libuv ke andar background C threads jo file/crypto/zlib/dns.lookup jaisa blocking kaam karte hain aur sirf result callback wapas us ek JS thread pe queue karte hain.",
    detailedAnswer:
      "\"Single-threaded\" JS execution model ke baare mein hai: tumhara code, callbacks, promises — sab ek thread pe serialize hote hain, isliye shared-memory race conditions nahi. Lekin Node ke andar (libuv mein) aur bhi threads hain: default 4 ka thread pool, plus kuchh internal helper threads. Ye threads tumhara JS nahi chalate; wo bas blocking OS calls (readFile, pbkdf2) apne upar lete hain taaki main thread free rahe, aur poora hone pe callback event loop ko de dete hain. Isi tarah CPU-bound JS ke liye `worker_threads` real threads dete hain, par har worker ka apna alag V8 isolate hota hai — memory by default share nahi hoti.",
    followUp: "worker_threads aur libuv thread pool mein kya fark hai?",
  },
  {
    id: "ltp-4",
    question: "`UV_THREADPOOL_SIZE` ko kab aur kaise tune karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Tab, jab profiling dikhaye ki fs/crypto/zlib/dns.lookup pool-bound hai (jobs threads ka wait kar rahe). Ise process launch pe env var se set karo — `UV_THREADPOOL_SIZE=8 node app.js` — kyunki pool pehli use pe ban jaata hai. Cores ke aas-paas rakho; andha-dhundh badhana context-switching aur memory badha deta hai.",
    detailedAnswer:
      "Steps: pehle confirm karo bottleneck pool hai — event loop delay high nahi hai par fs/crypto callbacks late aa rahe hain. `UV_THREADPOOL_SIZE` ko launch environment mein set karo (`.env`, systemd unit, Dockerfile ENV, ya `cross-env`), code ke andar `process.env` set karna reliably kaam nahi karta. Ek reasonable value physical core count ke aas-paas hai (e.g. 8), max 1024 allowed. Ise data se validate karo: p99 latency aur pool wait time dono dekho. Behtar long-term fix aksar CPU-heavy kaam ko `worker_threads` pe nikalna ya slow disk ke bajaye cache/CDN use karna hota hai.",
    followUp: "Pool size badha dene ke baad bhi report endpoint slow hai — ab kya dekhoge?",
  },
];

export default questions;
