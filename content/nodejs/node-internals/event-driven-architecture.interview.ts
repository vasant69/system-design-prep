import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "eda-1",
    question:
      "Node ki event-driven architecture ka matlab kya hai? Apne shabdon mein samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Node program kaam ke liye wait nahi karta — wo events mein interest register karta hai (request aayi, socket par data, file padh gayi, timer fire hua) aur ek single loop (libuv) un ready events ko unke callbacks pe dispatch karta hai. Isko reactor pattern kehte hain.",
    detailedAnswer:
      "Ek blocking program 'line chalao, I/O ke liye ruko, agli line' karta hai — ruakna matlab thread us dauran bekaar. Event-driven program bolta hai 'jab ye ready ho tab mera callback chalao' aur tab tak doosra kaam karta hai. Mechanism: (1) event sources register hote hain — sockets, files, timers, child processes; (2) event loop OS se `epoll`/`kqueue`/IOCP ke through ek call mein hazaaron FDs ka readiness poochta hai; (3) har ready event ka registered callback main thread par chalta hai; (4) callback chhota rehta hai — kaam karo ya aur async schedule karo, return ho jao. Node mein libuv ye loop chalata hai (6 phases), network I/O OS-level non-blocking hai, aur jo non-blocking nahi milta (fs, dns lookup, crypto KDF, zlib) wo ek chhote thread pool (default 4) par jata hai. `EventEmitter` yahi pattern JavaScript-land mein class ki tarah deta hai.",
    followUp:
      "Agar sab kuch ek thread par hai to Node 'concurrent' kaise hai?",
    redFlag:
      "'Node multi-threaded hai isliye fast hai' — nahi, Node ka JavaScript ek hi thread par chalta hai; concurrency I/O-wait ke overlap se aati hai, parallel threads se nahi.",
  },
  {
    id: "eda-2",
    question:
      "Event-driven model aur thread-per-request model mein farak batao. Node ne event-driven kyun chuna?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Thread-per-request: har connection ko ek dedicated OS thread. Simple mental model, lekin har thread ~1 MB stack + scheduling overhead leta hai, to 10,000 mostly-idle connections par memory aur context-switching se server dhah jata hai (C10k problem). Event-driven: ek loop hazaaron sockets watch karta hai, idle connection ≈ bas socket state.",
    detailedAnswer:
      "Thread-per-request (classic Apache prefork, purane Java servlet containers): connection aayi -> thread assign -> wo thread us request ki puri lifecycle blocking-style handle karta hai. Fayda: code top-to-bottom, debugging simple. Dikkat: 10,000 concurrent connections = 10,000 threads = ~5-10 GB sirf stacks, aur CPU ka bada hissa context-switching mein, jabki zyaadatar connections idle (keep-alive, slow client) hote hain — resources ghere baithe bekaar threads.\n\nEvent-driven (Nginx, Node): chhota number of worker loops, har ek `epoll` se hazaaron FDs watch karta. 10,000 idle connections = 10,000 FDs + chhoti per-connection state, flat memory, CPU sirf actually-ready events par. Nginx ne isi se Apache ko high-concurrency par beat kiya; Node ne yahi model application-server layer mein JavaScript + libuv ke saath laaya.\n\nTrade-off jo bolna zaroori hai: event-driven mein ek CPU-heavy synchronous callback poore loop ko block kar deta hai — thread-per-request mein wo sirf ek thread ko block karta. Isliye Node I/O-bound high-concurrency ke liye great hai, CPU-bound ke liye nahi.",
    followUp:
      "Go ki goroutines is trade-off ko kaise address karti hain?",
  },
  {
    id: "eda-3",
    question:
      "`EventEmitter` kya hai aur wo event-driven architecture se kaise juda hai? Ek chhota custom emitter likh ke dikhao.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`EventEmitter` (core `node:events` module) wahi register-interest-plus-dispatch pattern ek class ki tarah deta hai: `.on(name, fn)` se listener register karo, `.emit(name, ...args)` se saare listeners synchronously call ho jaate hain. Node ke `http.Server`, `net.Socket`, streams, `process` — sab isse extend karte hain.",
    detailedAnswer:
      "Reactor pattern internally libuv deta hai; `EventEmitter` wahi idea user code mein exposed karta hai — tum apne domain objects ko event sources bana sakte ho.\n\n```javascript\nconst EventEmitter = require('node:events');\n\nclass Job extends EventEmitter {\n  run() {\n    this.emit('start');\n    setImmediate(() => {\n      try {\n        const result = 42;\n        this.emit('done', result);\n      } catch (err) {\n        this.emit('error', err);\n      }\n    });\n  }\n}\n\nconst job = new Job();\njob.on('start', () => console.log('started'));\njob.once('done', (r) => console.log('result', r));\njob.on('error', (e) => console.error('failed', e.message));\njob.run();\n```\n\nKey points: `emit` synchronous hai — saare listeners registration order mein turant chalte hain. `once` ek baar chal ke khud remove ho jata hai. `'error'` event special hai: agar emit ho aur koi listener na ho to Node process crash kar deta hai — isliye har emitter par error listener lagao. Ek naam par 10+ listeners lagane par Node memory-leak warning deta hai (`defaultMaxListeners`).",
    followUp:
      "`emit` synchronous hai — agar tumhe listener ko caller se decouple karna ho (fire-and-forget) to kya karoge?",
    redFlag:
      "'emit async hai, listeners next tick par chalte hain' — galat; emit blocking synchronous call hai.",
  },
  {
    id: "eda-4",
    question:
      "Ek endpoint par tumhare paas ek CPU-heavy operation hai (bade payload ka hashing + transform, ~300ms). Event-driven server par iska kya asar padega aur tum kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Un 300ms ke dauran event loop block rehta hai — us worker/process par koi doosra request, timer, ya I/O callback nahi chalta, saari concurrency ruk jaati hai aur p99 latency phat jaati hai. Fix: CPU work ko worker thread pool par offload karo, ya ek alag service/queue mein nikaal do; measure karke confirm karo (event loop lag).",
    detailedAnswer:
      "Event-driven concurrency ka source I/O-wait ka overlap hai — jab ek request DB/network ka wait kar rahi hoti hai, loop doosri request handle karta hai. CPU-bound kaam mein koi wait nahi hota; wo main thread ko poore 300ms ke liye kabza kar leta hai. Under load, requests queue mein pile up hoti hain, event loop lag (`perf_hooks.monitorEventLoopDelay`) badhti hai, aur healthy-dikhne wale endpoints bhi slow ho jaate hain kyunki wo bhi usi loop ka wait kar rahe hain.\n\nOptions, order of preference: (1) kya wo kaam sach mein zaroori hai request path mein? Pre-compute ya cache karo. (2) `worker_threads` pool banao — CPU function ko worker par chalao, main loop free rahe; `piscina` jaisi library ye manage karti hai. (3) Kaam ko ek background queue (BullMQ / SQS) mein daalo aur response async/webhook se do. (4) Us specific workload ke liye ek alag service (shayad ek dusri language) jo CPU-parallel ho.\n\nGalat 'fixes': `setTimeout(fn, 0)` — sync kaam abhi bhi block karega, bas thoda baad. `cluster` — har worker mein wahi endpoint apne loop ko block karega; throughput thoda badhega cores ke hisaab se par per-request stall wahi rahega.",
    followUp:
      "`worker_threads` aur `cluster` mein is context mein kya farak hai?",
  },
  {
    id: "eda-5",
    question:
      "Event-driven architecture kab use karni chahiye aur kab nahi? Iske main downsides kya hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Use for I/O-bound, high-concurrency workloads — web APIs, proxies/gateways, real-time (WebSocket) servers, BFF layers — jahan hazaaron connections mostly wait kar rahe hote hain, aur jahan components ko loosely couple karna ho. Avoid for CPU-bound work (encoding, big transforms, heavy crypto) jo ek thread ke loop ko freeze kar deta hai.",
    detailedAnswer:
      "Fit hai jab: (a) kaam I/O-bound hai — DB, HTTP calls, file, sockets; ek process lakhs idle connections chhoti memory mein rakh leta hai. (b) Real-time / streaming — chunks over time. (c) Loose coupling chahiye — emitter/listener se producer ko consumers ka pata nahi (jaise ek `orderCreated` event par email, analytics, inventory alag listeners).\n\nFit nahi jab: (a) CPU-bound — ek slow synchronous callback poore loop ko block karta hai, 'one slow guest starves the rest'. (b) Request logic genuinely sequential + compute-heavy hai — thread-per-request ka mental model simpler. (c) Jahan har emit ka error-handling cost bhaari ho — bhoola hua `'error'` listener = crash.\n\nDownsides: (1) single thread — CPU work blocks everything; (2) control flow bikhar jata hai callbacks/listeners mein, follow karna mushkil; (3) error propagation manual — async callback ka `throw` upar nahi jata, `'error'` event miss = crash; (4) ek buggy listener (exception/infinite loop) baaki sabko affect karta hai; (5) listeners add karke remove na karna = memory leak.",
    followUp:
      "Har chhoti cheez ke liye EventEmitter use karna kyun anti-pattern ho sakta hai — kab ek plain function call better hai?",
    redFlag:
      "'Event-driven har workload ke liye best hai' — CPU-bound work ke liye nahi; wahan wo throughput aur latency dono kharab karta hai.",
  },
];

export default questions;
