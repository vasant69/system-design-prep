import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "elp-1",
    question: "Node ke event loop ke phases order mein batao, aur har phase kis kaam ke liye hai.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Paanch main phases har tick mein: timers (setTimeout/setInterval), pending callbacks (kuchh deferred system I/O), poll (naye I/O events + zyadatar I/O callbacks), check (setImmediate), close callbacks ('close' events). Har phase ke beech nextTick phir promise microtasks drain hote hain.",
    detailedAnswer:
      "libuv har loop iteration ko in phases se chalata hai. timers phase wo `setTimeout`/`setInterval` callbacks chalata hai jinka threshold pura ho chuka. pending callbacks phase kuchh system operations ke callbacks chalata hai jo pichle tick se defer hue, jaise TCP socket errors (ECONNREFUSED). poll phase naye I/O events retrieve karta hai aur unke callbacks chalata hai — fs done, incoming socket data, lagbhag sab I/O; agar kuchh scheduled nahi hai to Node yahin block karke wait karta hai. check phase sirf `setImmediate` callbacks ke liye hai. close callbacks phase `socket.on('close', ...)` type events chalata hai. Har phase apni queue khatam karke hi aage badhta hai, aur beech mein Node pehle poori `process.nextTick` queue phir poori Promise microtask queue drain karta hai — isliye ye do hamesha timer, immediate aur I/O callbacks se pehle.",
    followUp: "poll phase kab block karke wait karta hai aur kab turant aage badh jaata hai?",
    redFlag: "\"Event loop bas ek queue hai jahan sab callbacks FIFO chalte hain\" — phases aur microtask priority miss karna.",
  },
  {
    id: "elp-2",
    question:
      "Ye script kya print karti hai: `console.log('a'); setTimeout(() => console.log('b')); setImmediate(() => console.log('c')); process.nextTick(() => console.log('d')); Promise.resolve().then(() => console.log('e'));`",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`a` (sync), phir `d` (nextTick), phir `e` (promise microtask), phir `b` aur `c` — jinka aapasi order main module se non-deterministic hai (`b c` ya `c b`).",
    detailedAnswer:
      "Sync code pehle: `a`. Stack khali hote hi microtasks: `process.nextTick` queue pehle to `d`, phir Promise microtask queue to `e`. Ab event loop chalu hota hai: timers phase mein `setTimeout` callback `b`, check phase mein `setImmediate` callback `c`. Main module se `b` vs `c` ka order fixed nahi — depend karta hai ki process ko loop start tak pahunchne mein 1ms laga ya nahi. Agar yehi `setTimeout` aur `setImmediate` kisi I/O callback ke andar hote, to `c` (setImmediate) hamesha `b` se pehle aata.",
    followUp: "`b` aur `c` ka order deterministic kaise banaoge?",
    redFlag: "Confidently `a b c d e` bolna — microtasks ko galat jagah rakhta hai.",
  },
  {
    id: "elp-3",
    question:
      "Production mein ek Node API ke saare requests periodically 300ms slow ho jaate hain, aur event loop lag metric spike karta hai. Event loop ke terms mein diagnosis kya?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Koi synchronous CPU-heavy kaam ek callback mein chal raha hai — bada JSON.parse/stringify, sync crypto, catastrophic regex, ya sync fs. Jab tak wo callback return nahi karta, loop kisi bhi phase pe aage nahi badh sakta, isliye saare pending timers aur I/O callbacks utni der wait karte hain.",
    detailedAnswer:
      "Event loop single-threaded hai: ek phase callback jab tak sync chal raha hai, loop ruka hai. 300ms ka regular block matlab kahin ek operation 300ms sync le raha hai. Common culprits: bade payload ka `JSON.parse`/`JSON.stringify`, `crypto.*Sync` ya bina thread pool wala hashing, backtracking-heavy regex, bade file pe `fs.readFileSync`, ya ek badi in-memory loop. Fix: us kaam ko `worker_threads` pe bhejo, chunks mein todo (`setImmediate` ke beech yield karke), streaming parser use karo, ya result cache karo. Diagnose karne ke liye `perf_hooks` ka `monitorEventLoopDelay`, `--prof`, ya clinic.js use karo.",
    followUp: "worker_threads ke alawa is block ko kam karne ke do aur tarike batao.",
    redFlag: "\"Bas aur instances/replicas add kar do\" — bina root cause dekhe; CPU block har instance mein rahega.",
  },
  {
    id: "elp-4",
    question: "`setTimeout(fn, 0)` aur `setImmediate(fn)` — inme se kaunsa pehle chalega?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Main module se: non-deterministic — dono mein se koi bhi pehle aa sakta hai. Kisi bhi I/O callback ke andar se: `setImmediate` hamesha pehle.",
    detailedAnswer:
      "`setTimeout(fn, 0)` timers phase mein chalta hai (`0` internally 1ms pe clamp hota hai). `setImmediate` check phase mein, poll ke turant baad. Top-level module se jab loop pehli baar shuru hota hai, agar 1ms already beet chuka to timer ready hai aur pehle chalega, warna check pehle — isliye race. Lekin agar aap already loop ke andar hain, jaise `fs.readFile` callback (poll phase), to next phase check hai, isliye `setImmediate` pehle; `setTimeout` ke liye poora loop ghoom ke timers tak wapas aana padta hai. Isliye 'I/O ke turant baad kuchh defer karna hai' ke liye `setImmediate` predictable choice hai.",
    followUp: "`setImmediate` recursion loop ko starve kyun nahi karti, jabki `process.nextTick` recursion karti hai?",
    redFlag: "\"setImmediate hamesha setTimeout(0) se pehle\" — I/O-callback context ke bina ye galat hai.",
  },
];

export default questions;
