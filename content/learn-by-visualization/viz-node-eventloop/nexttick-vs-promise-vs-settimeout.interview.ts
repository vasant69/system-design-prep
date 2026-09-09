import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "npt-1",
    question:
      "`console.log('start'); setTimeout(() => console.log('timeout'), 0); Promise.resolve().then(() => console.log('promise')); process.nextTick(() => console.log('nextTick')); console.log('end');` — kya print hoga aur kyun?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`start`, `end`, `nextTick`, `promise`, `timeout`. Sync code pehle (start, end), phir process.nextTick queue (nextTick), phir Promise microtask queue (promise), phir event loop ka timers phase (timeout).",
    detailedAnswer:
      "Do sync `console.log` seedha chalte hain: `start` aur `end`. Ab stack khali hai. Node priority order lagata hai: sabse pehle `process.nextTick` queue poori drain hoti hai, to `nextTick`. Uske baad Promise microtask queue poori drain hoti hai, to `promise`. Ye dono kisi bhi event loop phase se pehle hote hain. Ab loop apne timers phase mein jaata hai jahan `setTimeout(fn, 0)` ka callback chalta hai, to `timeout`. Note: `0` internally 1ms pe clamp hota hai, par yahan wo bhi macrotask hone ki wajah se hi last hai.",
    followUp: "Agar `Promise.resolve().then` ke andar ek aur `process.nextTick` schedule karein to wo `setTimeout` se pehle chalega ya baad?",
    redFlag: "\"promise nextTick se pehle\" bolna — Node mein nextTick ki priority upar hai.",
  },
  {
    id: "npt-2",
    question: "Node mein microtask aur macrotask kya hain — kaun kis category mein aata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Microtasks: Promise reactions (.then/.catch/.finally), await continuations, queueMicrotask — plus process.nextTick jo inse bhi pehle wali alag queue hai. Macrotasks: setTimeout, setInterval, setImmediate, aur I/O callbacks — ye event loop phases mein chalte hain, ek baari mein ek.",
    detailedAnswer:
      "Macrotask ek unit of work hai jo event loop ke kisi phase se pick hota hai — ek timer callback, ek I/O callback, ek setImmediate. Har macrotask ke baad (aur modern Node mein har phase ke beech) engine microtask queues ko poori tarah khali karta hai: pehle process.nextTick queue, phir Promise/queueMicrotask queue. Isi wajah se `await` ke baad ka code hamesha agle timer se pehle chalta hai. Practically priority: sync code > process.nextTick > promise microtasks > macrotasks. Browser mein process.nextTick nahi hota, sirf ek microtask queue hoti hai.",
    followUp: "Browser aur Node ke microtask model mein kya farak hai?",
  },
  {
    id: "npt-3",
    question:
      "`process.nextTick` aur `Promise.resolve().then` — dono ko log 'microtask' kehte hain. Concrete farak kya hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "process.nextTick ki apni dedicated queue hai jo Promise microtask queue se PEHLE, aur poori, drain hoti hai. Dono hi kisi macrotask se pehle chalte hain, par aapas mein nextTick jeetta hai. nextTick recursion loop ko starve kar sakti hai; excessive promise chaining bhi kar sakti hai par kam common hai.",
    detailedAnswer:
      "Timing: dono current operation ke turant baad chalte hain, kisi bhi timer/I-O se pehle. Order: har draining cycle mein Node pehle poori nextTick queue khatam karta hai (nayi nextTicks samet), phir poori promise microtask queue. Agar promise callback ne nextTick add ki, wo promise queue khatam hone ke baad, agle cycle mein chalti hai. Intent: `process.nextTick` Node-specific hai aur aksar internal use / consistent-async patterns ke liye hai; naye application code mein `queueMicrotask` ya `Promise.resolve().then` prefer karo kyunki wo standard aur cross-platform hai, aur starvation ka risk thoda kam.",
    followUp: "Naya code likhte waqt process.nextTick ke bajaye kya use karna chahiye aur kyun?",
    redFlag: "\"Bilkul same cheez hai, bas naam alag\" — priority aur platform difference miss karna.",
  },
  {
    id: "npt-4",
    question:
      "Ek third-party library har event emit se pehle `process.nextTick` mein 3 kaam schedule karti hai, aur wo kaam khud aur nextTicks schedule karte hain. Production mein latency spikes aur I/O timeouts dikh rahe hain. Kya ho raha hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "nextTick queue lagatar refill ho rahi hai, isliye event loop timers/poll phase tak pahunchne se pehle hi har baar nextTick queue drain karta reh jaata hai. Network I/O callbacks aur timers late chalte hain — yehi latency spikes aur timeouts hain.",
    detailedAnswer:
      "Event loop tabhi agle phase pe badhta hai jab nextTick queue empty ho. Agar har drain khud aur nextTicks paida karta hai, queue effectively kabhi khali nahi hoti, aur poll phase (jahan socket data aur DB response callbacks chalte hain) ko time hi nahi milta. Detect: `perf_hooks` se event loop delay dekho, aur `async_hooks`/profiler se pata karo kaun si nextTicks flood kar rahi hain. Fix: library ke us behaviour ko config se band karo ya patch karo taaki wo `setImmediate` use kare; agar apna code hai to batching (`process.nextTick` ki jagah ek `setImmediate` mein saara kaam) karo; ya library ko aisi version se badlo jo yeh na kare.",
    followUp: "`setImmediate` recursion is starvation se kaise bachti hai?",
    redFlag: "\"nextTick to bas thoda defer karta hai, harmless hai\" — recursion mein wo loop rok deta hai.",
  },
];

export default questions;
