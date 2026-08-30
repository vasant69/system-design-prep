import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "v8e-1",
    question: "V8 kya hai aur Node me uska role kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "V8 Google ka open-source C++ JavaScript engine hai, jo Chrome me bhi hai. Node me V8 wo component hai jo tumhari JavaScript ko actually execute karta hai — parse, compile to bytecode, JIT-optimize, run — aur memory (heap + garbage collection) manage karta hai. Event loop, `fs`, `http` V8 ka kaam nahi — wo libuv aur Node core library dete hain.",
    detailedAnswer:
      "Node = V8 + libuv + C++ bindings + JS core library. V8 ka scope: (1) Execution — source ko parser AST me todta hai, Ignition interpreter usse bytecode banake chalata hai, aur jo code hot hai use TurboFan optimizing JIT machine code me compile karta hai profiled type information ke saath. (2) Memory — objects heap par allocate karna, aur generational garbage collector se unreachable memory reclaim karna. V8 embeddable hai — Node ne 2009 me use as-is embed kiya, aur har V8 upgrade Node ko naye language features aur perf/memory characteristics deta hai. Jo V8 nahi karta: I/O, timers, event loop — wo Node ka apna layer hai. Ye distinction interview me important hai: \"Node single-threaded hai\" ka matlab V8 ki single JS execution thread, aur \"async I/O\" ka matlab libuv, V8 nahi.",
    followUp: "Agar V8 sirf JS execute karta hai, toh `setTimeout` aur `fs.readFile` kahan se aate hain?",
    redFlag:
      "\"V8 JavaScript ko C++ me convert karta hai\" — nahi, V8 bytecode aur phir machine code generate karta hai; C++ toh V8 khud likha gaya hai.",
  },
  {
    id: "v8e-2",
    question: "JIT compilation kya hai? Ignition aur TurboFan ka role batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "JIT = Just-In-Time compilation: code ko runtime par, jab wo chal raha ho, optimized machine code me compile karna. Ignition V8 ka bytecode interpreter hai — sab code yahan se start hota hai, fast startup. TurboFan optimizing compiler hai — jo function baar-baar chalta hai (hot) use wo profiled types ke saath machine code me compile karta hai. Type assumption tootne par 'deopt' hokar bytecode par wapas.",
    detailedAnswer:
      "Trade-off: pure interpreter = fast start, slow steady-state. Pure ahead-of-time compiler = slow start, fast steady-state, lekin JS dynamic hai (koi variable kabhi bhi kisi type ka ho sakta hai) toh AOT me aggressive optimize karna hard. JIT dono ka faida leta hai: (1) Har function Ignition me bytecode ban ke interpret hota hai — turant start. (2) V8 background me profile karta hai — call count, dekhe hue types (yeh function hamesha numbers pe chala? object shape kya thi?). (3) Hot function TurboFan ko jaata hai jo speculative optimizations karta hai — jaise \"maan lo `a` aur `b` hamesha small integers hain\" — aur bahut fast machine code deta hai. (4) Agar assumption galat nikla (`a` ab string hai), TurboFan deoptimize karta hai: us optimized code ko discard, execution wapas bytecode par, aur function shayad dobara optimize hoga naye info ke saath. Isliye 'polymorphic'/'megamorphic' code (jahan types/shapes vary karti hain) slow rehta hai — TurboFan use profitably optimize nahi kar paata.",
    followUp: "'Deoptimization' costly kyun hai, aur kaunsa code baar-baar deopt trigger karta hai?",
  },
  {
    id: "v8e-3",
    question:
      "Hidden classes (V8 me 'shapes'/'maps') kya hain, aur ye tumhare code likhne ke tareeke ko kaise affect karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "V8 har object ko ek hidden class deta hai jo uski properties ke naam aur memory offsets describe karti hai. Same properties same order me = same hidden class = property access ek fast offset lookup, dictionary search nahi. Takeaway: objects ko consistent shape do — saari properties ek jagah, ek order me init karo; `delete` avoid karo.",
    detailedAnswer:
      "Jab `const o = {}` banta hai, o ke paas ek base hidden class hoti hai. `o.x = 1` ek nayi hidden class C1 banata hai (\"x at offset 0\") aur ek transition. `o.y = 2` C2 banata hai (\"x at 0, y at 1\"). Agar 1000 objects same sequence follow karte hain, sab C2 share karte hain. Ek property-access site jaise `function dist(p) { return p.x*p.x + p.y*p.y }` par V8 ek inline cache rakhta hai: \"pichli baar yahan C2 aaya, x offset 0, y offset 1\". Agli baar C2 mila toh direct memory read — ye monomorphic IC, fastest. Alag shapes aane lage (kabhi `{x,y}`, kabhi `{y,x}`, kabhi `{x,y,z}`) toh IC polymorphic (2-4 shapes) phir megamorphic (5+) ho jaati hai, aur TurboFan us site ko optimize nahi kar paata. Practical rules: (1) constructor/factory me saari fields ek hi order me set karo, chahe kuch `null`/`undefined` hi ho. (2) baad me nayi properties mat add karo. (3) `delete obj.prop` mat karo — wo object ko slow dictionary mode me daal sakta hai; `obj.prop = undefined` use karo. (4) Arrays me mixed types (`[1, 'a', {}]`) se bachо — packed same-type arrays fast hain.",
    followUp: "Array of numbers aur array of mixed types me V8 ke andar kya farak hai?",
  },
  {
    id: "v8e-4",
    question:
      "Ek Node service ke p99 latency me periodic spikes aa rahe hain, average theek hai. V8 ke context me pehla shak kya, aur kaise confirm karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Pehla shak: V8 ke major (mark-sweep-compact) GC pauses, khaas kar agar service bada mutable state / cache heap me rakhti hai. Confirm: `--trace-gc` (ya `perf_hooks` GC observer) se pause durations dekho aur unhe latency spikes se time-correlate karo; `process.memoryUsage().heapUsed` ki growth track karo.",
    detailedAnswer:
      "Reasoning: minor GC (scavenge) sub-millisecond hota hai, wo p99 me dikhega nahi. Major GC old space par chalta hai aur uska kuch part stop-the-world hai — bade heap par tens of ms, aur wo periodically chalta hai jaise-jaise old space bharti hai. Agar service ek unbounded cache ya growing state rakhti hai, old space badhti jaati hai aur har major GC lamba hota jaata hai — classic sawtooth memory graph + latency spikes. Diagnosis steps: (1) `node --trace-gc app.js` — har GC ki type aur pause time log hoti hai; spikes ke timestamps se match karo. (2) `perf_hooks` `PerformanceObserver` with `entryTypes: ['gc']` — programmatic. (3) `--prof` ya `--inspect` CPU profile — GC time as a bucket dikhta hai. (4) Heap snapshot (`node --inspect`, Chrome DevTools Memory tab) do baar leke diff karo — kya reachable set badh raha hai (leak) ya bas working set bada hai. Fixes: cache pe eviction/TTL lagao, `--max-old-space-size` ko container RAM ke ~75% par set karo (bahut bada set karna pause aur bada kar deta hai), object churn kam karo hot paths me, ya extreme case me us component ko alag process/language me nikaal do.",
    followUp: "`--max-old-space-size` bahut bada set karne ka downside kya hai?",
    redFlag:
      "\"Bas `--max-old-space-size` badha do\" — ye OOM ko der se laata hai lekin GC pause aur bada kar deta hai aur leak ko chhupata hai.",
  },
  {
    id: "v8e-5",
    question:
      "Kya ek typical CRUD REST API me V8 micro-optimizations (hidden classes, monomorphic code) par time lagana worth hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Aksar nahi. Typical CRUD API ka bottleneck database queries aur network I/O hota hai — request ka 90%+ time wahan jaata hai, V8 execution me microseconds. Pehle profile karo; agar hot spot actually JS compute nikla (bada data transform, serialization) tabhi shape/allocation optimize karo. Warna readable code likho.",
    detailedAnswer:
      "V8 internals tab matter karte hain jab: (1) high request rate par tight JS loops chal rahe ho (data aggregation, transformation, custom serialization), (2) ek endpoint profiling me unexpectedly CPU-bound nikle, (3) memory churn se GC pauses p99 ko hurt kar rahe ho. In sab ka pehla step MEASURE hai — `node --prof` + `--prof-process`, ya `clinic.js`, ya `--inspect` CPU profile. Agar flame graph me time DB driver / `JSON.stringify` / ek specific loop me hai, tab targeted fix: object shapes stabilize karo, allocations hot path se hatao, streaming serialization use karo. Lekin `for` vs `forEach` vs `map` jaise choices, ya `++i` vs `i++`, real service me noise hain. Interview me sahi answer decision-making dikhata hai: \"main pehle measure karta hoon; zyaadatar APIs me V8 bottleneck nahi hota, toh main clarity ke liye optimize karta hoon aur DB/caching pe focus karta hoon.\"",
    followUp: "Node me ek endpoint ke CPU time ko profile karne ke liye tum kaunse tools use karoge?",
    redFlag:
      "Har object ko manually shape-optimize karna aur `map` ko `for` se replace karna bina profile kiye — premature micro-optimization.",
  },
];

export default questions;
