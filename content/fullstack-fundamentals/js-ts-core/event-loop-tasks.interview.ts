import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "elt-1",
    question: "Event loop samjhao: call stack, macrotask queue, microtask queue.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Synchronous code single call stack par chalta hai. Jab wo khaali hota hai, event loop ek macrotask leta hai (ek `setTimeout` callback, ek I/O callback), use poora chalata hai, phir microtask queue poori drain karta hai (saare promise `.then`s, `queueMicrotask`, `await` continuations) — un microtasks samet jo wo add karte hain — agle macrotask ya render se pehle.",
    detailedAnswer:
      "Bolne layak consequences: promise callbacks hamesha `setTimeout(fn, 0)` se pehle; ek unbounded microtask chain timers aur rendering ko starve kar sakta hai; aur ek lambi synchronous function sab kuch block karti hai kyunki kuch bhi stack ko preempt nahi karta. `await x` continuation ko microtask ke roop me schedule karta hai, macrotask nahi.",
    followUp: "Node me `process.nextTick` aur `setImmediate` kahan fit hote hain?",
  },
  {
    id: "elt-2",
    question: "Predict: `console.log(1); setTimeout(()=>console.log(2)); Promise.resolve().then(()=>console.log(3)); console.log(4)`.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`1, 4, 3, 2`. Sync 1 aur 4 log karta hai. Phir microtask queue drain hoti hai: 3. Phir macrotask: 2.",
    detailedAnswer:
      "Trap ye maan kar `1 4 2 3` jawab dena hai ki `setTimeout(fn, 0)` 'zero delay hai isliye pehle'. Zero ek minimum delay hai; timeout callback ek macrotask hai aur har pending microtask usse upar hai. Promises current loop iteration ke andar resolve hote hain; timers agle ke liye wait karte hain.",
    redFlag: "Ye bolna ki order non-deterministic hai — wo fully specified hai.",
  },
  {
    id: "elt-3",
    question: "Ek page do second ke liye computation ke dauraan freeze ho jaata hai. Kyun, aur bina doosri language me rewrite kiye kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Computation synchronous hai, isliye wo call stack rok leti hai; event loop clicks, timers, promise callbacks, ya paint process nahi kar sakta jab tak wo return na kare. Fix: work ko macrotasks me chunk karo (`setTimeout`/`MessageChannel` chunks ke beech), `requestIdleCallback` use karo, ya use Web Worker / worker thread par le jaao.",
    detailedAnswer:
      "Chunking slices ke beech control yield karta hai taaki loop render aur input handle kar sake; ek Worker CPU work ko main thread se poora hata deta hai aur messages se communicate karta hai. Algorithm micro-optimise karna madad karta hai par single-thread constraint nahi badalta. `async`/`await` akela madad NAHI karta agar body CPU-bound hai — await karne se work offload nahi hota.",
  },
];

export default questions;
