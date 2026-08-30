import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-loop-phases-1",
    question: "Node event loop ke phases ka sahi order kya hai?",
    options: [
      "poll → timers → check → pending callbacks → idle/prepare → close callbacks",
      "timers → pending callbacks → idle/prepare → poll → check → close callbacks",
      "timers → poll → check → close callbacks → pending callbacks → idle/prepare",
      "check → timers → poll → pending callbacks → close callbacks → idle/prepare",
    ],
    correctIndex: 1,
    explanation:
      "Fixed order hai: timers (expired setTimeout/setInterval) → pending callbacks (deferred system callbacks) → idle/prepare (internal) → poll (ready I/O callbacks, plus block-and-wait for new I/O) → check (setImmediate) → close callbacks (socket 'close' etc.). Baaki options phases ko galat order mein rakh rahe hain — khaaskar poll hamesha timers ke baad aur check se pehle aata hai.",
    difficulty: "medium",
  },
  {
    id: "event-loop-phases-2",
    question:
      "Poll phase ka special behaviour kya hai jab koi timer imminent nahi hai aur koi `setImmediate` scheduled nahi hai?",
    options: [
      "Node turant check phase pe chala jata hai",
      "Node ek busy-loop mein CPU 100% pe naye I/O ka wait karta hai",
      "Node poll phase mein block karta hai (`epoll_wait` type call pe), CPU ~0%, jab tak naya I/O event na aaye",
      "Node process ko exit kar deta hai",
    ],
    correctIndex: 2,
    explanation:
      "Poll phase wahi jagah hai jahan Node genuinely I/O ka wait karta hai. Agar aur kuch pending nahi, wo OS ke `epoll_wait`/`kqueue`/`IOCP` pe block ho jata hai — event-driven wakeup, CPU ~0%, koi busy-loop nahi (Option B galat). Agar `setImmediate` pending hota toh block na karke check phase pe jata (Option A tabhi sahi hota). Process tabhi exit karta hai jab koi ref'd handle na bache (Option D galat yahan).",
    difficulty: "medium",
  },
  {
    id: "event-loop-phases-3",
    question:
      "Yeh code ek I/O callback ke andar hai: `fs.readFile(f, () => { setTimeout(() => console.log('T'), 0); setImmediate(() => console.log('I')); });` — output order?",
    options: [
      "Non-deterministic — kabhi 'T' pehle, kabhi 'I'",
      "Hamesha 'T' phir 'I', kyunki setTimeout ka delay explicit hai",
      "Hamesha 'I' phir 'T', kyunki callback poll phase mein chal raha hai aur check phase (setImmediate) turant next hai; setTimeout ko agli iteration ke timers phase tak wait karna padta hai",
      "Dono ek saath print honge",
    ],
    correctIndex: 2,
    explanation:
      "I/O callback poll phase mein execute hota hai. Poll ke turant baad check phase aata hai, toh `setImmediate` ka callback usi tick mein chal jata hai. `setTimeout(0)` ko poori loop ghoom ke agli iteration ke timers phase tak wait karna padta hai. Isliye 'I' hamesha 'T' se pehle — yeh deterministic hai. Non-determinism sirf main module se scheduling pe hota hai (Option A).",
    difficulty: "hard",
  },
  {
    id: "event-loop-phases-4",
    question:
      "Main module (top-level) se `setTimeout(fn, 0)` aur `setImmediate(fn)` — order kabhi-kabhi badalta kyun hai?",
    options: [
      "Node random number generator se order decide karta hai",
      "`setTimeout(0)` actually ~1ms pe clamp hota hai; agar process startup 1ms se zyada leta hai toh loop ke pehle timers phase pe timer ready hota hai aur pehle chalta hai, warna loop poll se hote hue check phase mein setImmediate pehle chala deta hai — yeh startup timing machine load pe depend karti hai",
      "`setImmediate` ka priority har even iteration mein badal jata hai",
      "Order deterministic hai, hamesha `setImmediate` pehle — jo log 'badalta' bolte hain wo galat hain",
    ],
    correctIndex: 1,
    explanation:
      "`setTimeout(0)` ~1ms minimum pe clamp hota hai. Jab loop pehli baar timers phase pe pahunchta hai, timer 'ready' hai ya nahi yeh ispe depend karta hai ki startup mein kitna time laga — jo machine load ke saath badalta hai. Isliye main context se order non-deterministic hai. I/O callback ke andar se yeh deterministic ho jata hai (setImmediate pehle). Option D isi exception ko overgeneralize kar raha hai.",
    difficulty: "hard",
  },
];

export default quiz;
