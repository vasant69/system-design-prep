import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "evloop-1",
    question:
      "Event loop ko samjhao — call stack, queues, aur ek round mein kya hota hai.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Call stack pe sync code chalta hai. Async ke ready callbacks do queues mein jaate hain: macrotask (`setTimeout`, I/O, DOM events) aur microtask (promises, `queueMicrotask`, `await` cont.). Loop: stack khaali -> ek macrotask -> poori microtask queue drain -> render -> repeat.",
    detailedAnswer:
      "Ek round: (1) agar stack khaali hai, macrotask queue se ek task lo aur run karo (uske sync code samet). (2) Us task ke baad microtask queue ko poora drain karo — jo microtasks is dauran add hui wo bhi. (3) Browser mein: rendering steps (style, layout, paint) agar zaroorat ho. (4) Wapas step 1. Consequences: ek promise chain `setTimeout(..., 0)` se hamesha pehle; ek lamba sync task ya infinite microtask loop rendering ko block kar deta hai; `await` ke baad ka code microtask priority pe aata hai.",
    followUp:
      "Node ka event loop browser se kaise alag hai (phases, `process.nextTick`)?",
    redFlag:
      "'Event loop ek background thread hai jo code parallel chalata hai' — wo same thread pe tasks schedule karta hai.",
  },
  {
    id: "evloop-2",
    question:
      "`console.log('start'); setTimeout(() => console.log('timeout'), 0); Promise.resolve().then(() => console.log('p1')).then(() => console.log('p2')); console.log('end');` — output?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`start`, `end`, `p1`, `p2`, `timeout`. Sync pehle, phir poori microtask chain (`p1` -> `p2`), phir macrotask `timeout`.",
    detailedAnswer:
      "Sync: `start`, `end`. `setTimeout` cb macrotask queue mein. Pehla `.then` microtask queue mein. Stack khaali -> microtasks drain: `p1` chalta hai aur apne baad wale `.then` (`p2`) ko queue karta hai; loop wahi drain jaari rakhta hai -> `p2`. Ab microtask queue khaali -> ek macrotask -> `timeout`. Chahe kitni bhi chained `.then` hon, sab `setTimeout` se pehle.",
    followUp:
      "Agar `p1` ke andar `setTimeout(..., 0)` add karein to wo `p2` se pehle aayega ya baad mein?",
    redFlag:
      "`start end p1 timeout p2` bolna — maan liya har macrotask ke beech ek microtask.",
  },
  {
    id: "evloop-3",
    question:
      "Ek page pe ek expensive synchronous calculation (500ms) ek event handler mein hai aur UI freeze ho rahi hai. Event loop ke terms mein samjhao aur fix options do.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Wo 500ms sync kaam call stack pe baitha hai, to event loop na microtasks, na `setTimeout`, na rendering process kar paata — page frozen. Fix: kaam chunk karke `setTimeout` ya `MessageChannel` se yield, `requestIdleCallback` use, ya Web Worker pe offload.",
    detailedAnswer:
      "Event loop ek hi macrotask (aapka handler) chala raha hai; jab tak wo return nahi karta, round complete nahi hota, isliye koi paint nahi (`requestAnimationFrame` bhi nahi), aur clicks queue hote rehte hain. Options: (1) Chunking — kaam ko slices mein todo, har slice ke baad `await new Promise((r) => setTimeout(r))` se loop ko saans do (progress bar update ho jayega). (2) `requestIdleCallback` se idle time mein kaam. (3) Web Worker — heavy computation alag thread pe, main thread bilkul free; result `postMessage` se aata hai. Chunking simple hai par slow; Worker fast hai par data serialize/copy karna padta hai.",
    followUp: "Chunking ke liye `setTimeout(0)` vs `MessageChannel` — farak kya?",
    redFlag:
      "Sirf `async` keyword laga dena — `await` ke bina wo abhi bhi ek hi sync chunk hai.",
  },
  {
    id: "evloop-4",
    question:
      "Microtask queue macrotask queue se kaise alag treat hoti hai, aur 'microtask starvation' kya hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Macrotask: har round mein sirf EK chalti hai. Microtask: pura queue drain hota hai, us dauran queue hui nayi microtasks bhi. Agar microtasks khud ko baar-baar re-queue karein to loop kabhi agle macrotask ya render tak pahunchta hi nahi — ye starvation hai.",
    detailedAnswer:
      "Loop macrotask ke baad microtask queue ko tab tak khaali karta hai jab tak wo bilkul empty na ho. To `function loop() { Promise.resolve().then(loop); }` UI ko permanently freeze kar dega — timers aur paint kabhi chance nahi paate. `setTimeout` recursion aisa nahi karti kyunki har `setTimeout` callback ek alag round mein hai, beech mein render ho jaata hai. Isliye heavy repeated work ke liye `setTimeout` ya `MessageChannel` chunking behtar hai, unbounded microtask chaining nahi.",
    followUp:
      "`queueMicrotask` genuinely kab use karna chahiye, agar starvation risk hai?",
    redFlag:
      "'Microtask aur macrotask same hain, bas naam alag' — drain behaviour aur render timing dono alag hain.",
  },
];

export default questions;
