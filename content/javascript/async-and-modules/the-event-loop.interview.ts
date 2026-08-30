import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "el-1",
    question: "Event loop kya hai? Iske mukhya parts batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Event loop wo mechanism hai jo single-threaded JavaScript ko async kaam handle karne deta hai. Parts: call stack (JS code chalta hai), Web APIs / Node APIs (timers, network, I/O — main thread ke bahar), macrotask (task) queue, microtask queue, aur khud event loop jo decide karta hai stack khali hone par agla kaam kaha se uthana hai.",
    detailedAnswer:
      "Call stack ek hi hai aur ek waqt mein ek hi cheez chalati hai. Jab tum `setTimeout` ya `fetch` call karte ho, wo kaam host environment (browser/Node) ke APIs ko delegate ho jaata hai jo alag chalte hain. Kaam poora hone par uska callback ek queue mein jaata hai: `setTimeout`/I/O/UI events -> macrotask queue; promise `.then`/`.catch`/`.finally` aur `await` continuations -> microtask queue. Event loop ka kaam: (1) call stack ko empty hone tak chalao; (2) poori microtask queue drain karo; (3) browser mein render kar sakta hai; (4) macrotask queue se exactly ek task uthao; (5) wapas step 1. Sabse important detail: har ek macrotask ke baad poori microtask queue drain hoti hai — isliye promise callbacks hamesha `setTimeout` callbacks se pehle chalte hain.",
    followUp: "Microtask queue aur macrotask queue mein exactly kya-kya jaata hai?",
    redFlag: "\"JavaScript multithreaded hai kyunki event loop parallel kaam karta hai\" — event loop ek hi thread par serialize karta hai.",
  },
  {
    id: "el-2",
    question:
      "Output predict karo aur reasoning do:\n\n```javascript\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3)).then(() => console.log(4));\nconsole.log(5);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Output: 1, 5, 3, 4, 2. `1` aur `5` synchronous. Phir call stack khali hone par microtask queue drain hoti hai — `3`, phir uske resolve hone par chained `4`. Microtask queue khali hone ke baad ek macrotask — `setTimeout` ka `2`.",
    detailedAnswer:
      "Step by step: (1) `console.log(1)` — sync, output `1`. (2) `setTimeout(cb, 0)` — `cb` timer ke paas; expire par macrotask queue mein. (3) `Promise.resolve().then(A)` — `A` microtask queue mein enqueue; `.then(B)` abhi enqueue nahi (`A` chalne ke baad hoga). (4) `console.log(5)` — sync, output `5`. (5) Sync code khatam, stack khali. Event loop microtask queue drain karta hai: `A` -> output `3`; `A` ke return se `B` ab microtask queue mein -> queue khali nahi -> `B` -> output `4`. (6) Microtask queue khali. Event loop ek macrotask leta hai: `setTimeout` `cb` -> output `2`. Final: `1 5 3 4 2`. Key rule: saari microtasks (poori promise chain) kisi bhi macrotask se pehle.",
    followUp: "Agar `.then(() => console.log(4))` ke andar bhi ek `setTimeout(() => console.log(6), 0)` hota, to `6` kaha aata?",
  },
  {
    id: "el-3",
    question: "`setTimeout(fn, 0)` really 0 milliseconds baad chalta hai? Kyun / kyun nahi?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Nahi. `0` ka matlab hai 'as soon as possible, par current synchronous task aur poori microtask queue ke baad, ek macrotask ke roop mein'. Upar se HTML spec 5+ nested timers ke baad ~4ms ka minimum clamp lagata hai, aur background/inactive tabs mein timers 1000ms+ tak throttle ho jaate hain.",
    detailedAnswer:
      "Do reasons: (1) Scheduling — `fn` timer callback hai, macrotask queue mein jaata hai, jo tabhi process hoti hai jab call stack khali ho aur microtask queue drain ho chuki ho. Agar bahut saara sync ya promise kaam pending hai, `fn` bahut late chal sakta hai. (2) Clamping — browsers minimum delay enforce karte hain (~4ms after nesting), aur throttling policies (background tab, battery saver) delay ko aur badha deti hain. Isliye `setTimeout(fn, 0)` ka sahi use 'ek kaam ko current task ke baad defer karke thread/render ko saans dena' hai — precise timing (animation, benchmarking) ke liye `requestAnimationFrame` + `performance.now()` use karo.",
    followUp: "Ek heavy task ko chunk karke UI responsive rakhna ho to `setTimeout(next, 0)` vs `queueMicrotask(next)` — kaunsa aur kyun?",
    redFlag: "\"Haan, 0ms matlab agli line ke turant baad\" — ignore karta hai ki wo macrotask hai aur microtasks pehle chalti hain.",
  },
  {
    id: "el-4",
    question:
      "Ek Node API endpoint kabhi kabhi saari requests ke liye slow ho jata hai jab ek particular request aati hai. Us handler mein ek 4MB JSON ka `JSON.parse` aur ek sync loop hai. Kya ho raha hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Wo synchronous `JSON.parse` + loop event loop ke call stack ko occupy kar lete hain. Jab tak wo chal rahe hain, event loop na koi doosri request ka callback, na koi timer, na I/O completion process kar sakta — isliye saari concurrent requests us duration ke liye ruk jaati hain ('event loop blocked').",
    detailedAnswer:
      "Node ek single event-loop thread par requests handle karta hai. CPU-bound synchronous kaam (bada parse, `bcrypt` sync, image resize, regex backtracking) us thread ko hog kar leta hai. Fixes: (1) Payload size limit karo — 4MB JSON body shayad accept hi nahi karni chahiye; streaming parser use karo. (2) CPU kaam `worker_threads` mein offload karo ya alag microservice mein. (3) Kaam ko async chunks mein tod do (`setImmediate`/`setTimeout` se) taaki beech-beech mein event loop doosri requests handle kar sake. (4) 'event loop lag' ko monitor karo (e.g. `perf_hooks` / APM) — agar ek tick 100ms+ leta hai to alert. Interview point: async I/O Node ko scale karta hai, par synchronous CPU kaam us model ko tod deta hai.",
    followUp: "`worker_threads` aur `child_process` mein CPU offload ke liye kya farak hai?",
  },
  {
    id: "el-5",
    question:
      "Browser aur Node ke event loop mein practical farak kya hai? Ek code-visible difference batao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Core idea same hai — sync, phir microtasks, phir ek macrotask. Farak: Node ke event loop ke defined phases hain (timers, pending callbacks, poll, check, close), `setImmediate` 'check' phase mein aur `setTimeout(0)` 'timers' phase mein chalta hai, aur `process.nextTick` ki apni queue hai jo promise microtasks se bhi pehle drain hoti hai. Browser mein rendering bhi loop ka hissa hai (`requestAnimationFrame`).",
    detailedAnswer:
      "Node-specific: `process.nextTick(fn)` callbacks har operation ke baad, promise microtasks se bhi pehle chalte hain — isse recursive `nextTick` promise queue ko starve kar sakta hai. `setImmediate` vs `setTimeout(fn, 0)`: main module ke top-level par order non-deterministic ho sakta hai, par ek I/O callback ke andar `setImmediate` hamesha pehle chalta hai (kyunki 'check' phase 'poll' ke turant baad aata hai). Browser mein aisa phase-split nahi; iske bajaye render steps (style, layout, paint) task aur microtask checkpoints ke beech aate hain, aur `requestAnimationFrame` callbacks paint se theek pehle. Code-visible example: `setTimeout(() => console.log('t'), 0); setImmediate(() => console.log('i'));` — Node mein I/O ke andar `i` pehle; browser mein `setImmediate` hai hi nahi (non-standard).",
    followUp: "process.nextTick ka overuse kya problem create karta hai?",
  },
];

export default questions;
