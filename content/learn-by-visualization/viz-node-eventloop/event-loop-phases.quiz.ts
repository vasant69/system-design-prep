import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-loop-phases-1",
    question:
      "`console.log('a'); setTimeout(() => console.log('b'), 0); Promise.resolve().then(() => console.log('c')); process.nextTick(() => console.log('d'));` — output order?",
    options: ["a b c d", "a d c b", "a c d b", "a b d c"],
    correctIndex: 1,
    explanation:
      "Sync pehle: `a`. Phir stack khali hone pe Node microtasks drain karta hai — pehle `process.nextTick` queue (`d`), phir Promise microtask queue (`c`). Ye dono event loop ke kisi bhi phase se pehle. `setTimeout` timers phase mein aata hai jo microtasks ke baad shuru hota hai, isliye `b` last. `a b c d` galat hai (microtasks ko timers ke baad rakhta hai); `a c d b` galat (nextTick promise se pehle chalti hai).",
    difficulty: "medium",
  },
  {
    id: "event-loop-phases-2",
    question:
      "`fs.readFile(f, () => { setTimeout(() => console.log('T'), 0); setImmediate(() => console.log('I')); });` — I/O callback ke andar kaunsa pehle print hota hai?",
    options: [
      "`T` pehle, hamesha",
      "`I` pehle, hamesha",
      "Non-deterministic, run-to-run vary karta hai",
      "Dono exactly ek saath",
    ],
    correctIndex: 1,
    explanation:
      "readFile callback poll phase mein chalta hai. Poll ke turant baad check phase aata hai — jahan `setImmediate` (`I`) chalta hai. `setTimeout` ke liye loop ko wapas timers phase tak ghoomna padta hai (agla tick), isliye `T` baad mein. Isliye I/O callback ke andar `setImmediate` hamesha `setTimeout(fn, 0)` se pehle — ye deterministic hai, main module ke ulat jahan order vary karta hai.",
    difficulty: "medium",
  },
  {
    id: "event-loop-phases-3",
    question: "`setImmediate(cb)` ka callback event loop ke kaunse phase mein chalta hai?",
    options: ["timers phase", "poll phase", "check phase", "close callbacks phase"],
    correctIndex: 2,
    explanation:
      "`setImmediate` specifically check phase ke liye hai, jo poll phase ke turant baad aata hai. Naam misleading hai — 'immediate' ka matlab 'abhi' nahi, balki 'poll ke baad wale check phase mein'. timers phase `setTimeout`/`setInterval` ke liye hai, poll phase normal I/O callbacks ke liye, close phase `'close'` events ke liye.",
    difficulty: "easy",
  },
  {
    id: "event-loop-phases-4",
    question: "Node 11+ mein `process.nextTick` aur promise microtasks kab drain hote hain?",
    options: [
      "Sirf poore event loop ke ek complete chakkar ke end pe",
      "Har phase ke beech, aur har individual macrotask callback ke baad bhi",
      "Sirf sync code khatam hone pe, ek hi baar",
      "Kabhi automatically nahi — manually trigger karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Modern Node har phase transition pe AUR har macrotask callback (jaise ek `setTimeout` callback) ke turant baad microtask queues drain karta hai — pehle nextTick queue poori, phir promise queue poori. Purane Node (10 aur pehle) mein sirf phase boundaries pe hota tha. 'Ek hi baar sync ke baad' galat hai — loop ke har step pe hota hai. Draining automatic hai, manual trigger ki zaroorat nahi.",
    difficulty: "hard",
  },
];

export default quiz;
