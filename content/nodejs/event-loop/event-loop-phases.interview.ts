import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "elp-1",
    question: "Node event loop ke phases explain karo — ek tick mein kya hota hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Ek tick 6 phases se guzarta hai, fixed order mein: timers (expired setTimeout/setInterval), pending callbacks (kuch deferred system callbacks), idle/prepare (internal), poll (ready I/O ke callbacks + naye I/O ka block-and-wait), check (setImmediate), close callbacks (socket 'close' etc.). Har phase ke beech aur har callback ke baad microtask queues (nextTick phir Promises) poori drain hoti hain.",
    detailedAnswer:
      "Normally tumhara code sirf 3 phases mein aata hai: timers, poll, check. Poll sabse important hai — wahan (a) complete ho chuke I/O ke callbacks chalte hain aur (b) agar aur kuch pending nahi (na imminent timer, na setImmediate) toh Node wahin `epoll_wait` type call pe block karke naye I/O ka wait karta hai — isiliye idle server CPU nahi khata. Poll timeout calculate hota hai: setImmediate pending → 0, timers pending → nearest timer tak, warna indefinite. Check phase sirf setImmediate ke liye hai. Close phase cleanup callbacks ke liye. Jab koi ref'd handle nahi bachta, loop exit ho jata hai aur process end.",
    followUp: "Poll phase kaise decide karta hai ki kitni der block karna hai?",
    redFlag: "Phases ka order galat batana, ya poll ko timers se pehle rakhna.",
  },
  {
    id: "elp-2",
    question: "`setTimeout(fn, 0)` aur `setImmediate(fn)` mein kya farak hai? Order guaranteed hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`setTimeout(0)` timers phase mein chalta hai (~1ms pe clamp), `setImmediate` check phase mein. Main module se scheduled karo toh order non-deterministic hai (startup timing pe depend). Ek I/O callback ke andar se scheduled karo toh `setImmediate` hamesha pehle — deterministic.",
    detailedAnswer:
      "Main module case:\n\n```javascript\nsetTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('immediate'));\n// kabhi 'timeout immediate', kabhi 'immediate timeout'\n```\n\nKyun: `setTimeout(0)` ~1ms pe clamp hai. Loop ke pehle timers phase pe agar 1ms nikal gaya (startup slow) toh timer ready → pehle; warna loop poll se hote hue check phase mein setImmediate chala deta hai → pehle.\n\nI/O callback case:\n\n```javascript\nfs.readFile(__filename, () => {\n  setTimeout(() => console.log('timeout'), 0);\n  setImmediate(() => console.log('immediate'));\n  // hamesha 'immediate' phir 'timeout'\n});\n```\n\nKyun: readFile callback poll phase mein hai. Poll ke turant baad check phase → setImmediate turant. setTimeout ko agli iteration ke timers phase tak wait. Practical rule: kabhi in dono ke relative order pe logic mat banao jab tak tum guaranteed I/O-callback context mein na ho.",
    followUp: "Toh recursive chunking ke liye tum konsa use karoge aur kyun?",
    redFlag: "\"setImmediate hamesha setTimeout(0) se pehle chalta hai\" — main context se yeh galat hai.",
  },
  {
    id: "elp-3",
    question: "Microtasks event loop phases ke saath kaise interact karti hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Microtasks kisi ek phase ka part nahi hain. Wo har phase ke beech aur har individual callback ke turant baad drain hoti hain — pehle poori process.nextTick queue, phir poori Promise job queue, empty hone tak. Tabhi Node agle callback ya agle phase pe jata hai.",
    detailedAnswer:
      "Matlab agar tum ek timers-phase callback ke andar `Promise.resolve().then(cb)` schedule karo, toh `cb` isi tick mein, agla timer callback chalne se pehle, aur poll phase mein jaane se pehle chal jayega. Yeh 'high priority interleaving' promise chains ko fast aur predictable rakhta hai. Flip side: agar microtask queue kabhi empty na ho (recursive nextTick ya recursive `.then`), toh Node kisi bhi phase se aage nahi badhta — timers aur I/O starve, process hang. Isliye bade kaam ko microtasks se chunk mat karo; `setImmediate` (check phase macrotask) se karo, jo I/O ke saath fair share leta hai.",
    followUp: "Ek I/O callback ke andar nextTick aur setImmediate dono schedule karo — kaunsa pehle?",
  },
  {
    id: "elp-4",
    question: "\"Idle Node server CPU kyun nahi khata?\" — event loop ke terms mein samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Kyunki jab kuch pending nahi hota, Node poll phase mein OS ke `epoll_wait` (Linux) / `kqueue` (macOS) / `IOCP` (Windows) call pe block ho jata hai. Yeh event-driven wakeup hai — OS Node ko tabhi jagata hai jab koi socket/FD ready ho. Beech mein Node spin nahi karta, toh CPU ~0%.",
    detailedAnswer:
      "Bahut se naye developers sochte hain 'event loop' matlab ek `while(true)` jo continuously ghoom raha hai aur CPU jala raha hai. Actually loop ka poll phase blocking hai: agar na koi timer imminent hai, na koi setImmediate, aur sirf incoming connections/data ka wait hai, toh libuv OS ko ek FD-list deke bolta hai 'inmein se koi ready ho toh mujhe jagao' aur so jata hai. 10,000 idle keep-alive connections bhi CPU nahi khate kyunki wo sab ek `epoll_wait` mein registered hain. Jaise hi data aata hai, OS Node ko wake karta hai, wo poll callbacks chalata hai, loop continue. Yeh C10k concurrency ka basis hai.",
    followUp: "Agar ek `setInterval(fn, 1)` chal raha ho toh kya poll phase phir bhi indefinite block karega?",
    redFlag: "\"Event loop ek busy while-loop hai jo hamesha CPU use karta hai.\"",
  },
  {
    id: "elp-5",
    question: "Ek CPU-heavy stream processor same process mein ek admin HTTP API ko slow kar raha hai. Event loop knowledge use karke fix design karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Problem: heavy parsing poll-phase I/O callback ke andar synchronously chal raha hai, poll phase lamba baithta hai, naye admin requests (bhi poll phase) unke piche queue. Fix: kaam ko batch karo aur har batch ke baad `await new Promise(r => setImmediate(r))` — check phase pe yield, beech mein Node wapas poll phase mein jaake admin requests serve karta hai. Ya bhaari kaam `worker_threads` pe le jao.",
    detailedAnswer:
      "Diagnose pehle: `perf_hooks` se event loop delay measure karo — spike ke time high hoga. Root cause single-threaded poll-phase blocking. Options trade-off ke saath: (1) **setImmediate yielding** — har N rows/chunks ke baad `await new Promise(r => setImmediate(r))`. Simple, koi naya thread nahi, lekin total throughput girta hai aur CPU abhi bhi main thread pe. (2) **worker_threads** — parsing ko dedicated worker(s) pe bhejo, main event loop sirf orchestration kare. Best jab kaam sach CPU-bound aur sustained ho; cost: message serialization, worker lifecycle. (3) **backpressure** — stream ko `pause()`/`resume()` se throttle karo taaki input rate processing rate se aage na nikle. (4) alag process/service agar isolation chahiye. Interview mein: pehle measure, phir smallest change jo admin API ka SLA bacha le — aksar (1) ya (3) kaafi hota hai.",
    followUp: "setImmediate yield add karne se total processing time kitna badhega, roughly?",
    redFlag: "\"Bas handler ko async bana do\" — CPU-bound sync parsing async keyword se non-blocking nahi hoti.",
  },
];

export default questions;
