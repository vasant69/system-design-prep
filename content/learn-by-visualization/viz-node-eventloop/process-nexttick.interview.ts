import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pnt-1",
    question: "`process.nextTick` exactly kab chalta hai? Event loop ke saath iska rishta kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Current operation (jo JS abhi chal raha hai) khatam hote hi, event loop ke agle phase pe jaane se pehle, aur Promise microtask queue drain hone se bhi pehle. Technically ye event loop ka phase nahi — ek alag queue hai jo har operation ke baad process hoti hai.",
    detailedAnswer:
      "Jab bhi call stack khali hota hai — chahe wo sync script ke baad ho ya kisi timer/I-O callback ke baad — Node pehle poori `process.nextTick` queue chalata hai, phir poori Promise/queueMicrotask queue, tabhi loop apne agle phase pe badhta hai. Isliye priority: sync code, phir nextTick, phir promise microtasks, phir timers/poll/check. Naam misleading hai: 'nextTick' se lagta hai agla loop iteration, par actually ye 'abhi, is operation ke turant baad' hai. Jo tum sach mein 'agle tick' pe chahte ho wo `setImmediate` hai.",
    followUp: "`process.nextTick` aur `setImmediate` mein — naam ke hisaab se kaunsa zyada 'turant' lagta hai, aur reality kya hai?",
    redFlag: "\"nextTick agle event loop iteration pe chalta hai\" — naam se dhoka khana.",
  },
  {
    id: "pnt-2",
    question: "`process.nextTick` aur `setImmediate` — naam ke hisaab se aur behaviour ke hisaab se farak.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Naam ulta hai. `process.nextTick` 'agle tick' pe nahi, current operation ke turant baad chalta hai (bahut jaldi). `setImmediate` 'immediately' nahi, ek poore phase-cycle baad check phase mein chalta hai. Guideline: I/O ke baad kuchh defer karna ho to `setImmediate`; consistent-async / cleanup ke liye `nextTick`.",
    detailedAnswer:
      "`process.nextTick(cb)` cb ko is operation ke baad, Promise microtasks se bhi pehle chalata hai — effectively 'sabse jaldi possible'. Iska misuse (recursion) event loop ko starve kar deta hai. `setImmediate(cb)` cb ko check phase mein daalta hai, jo poll phase ke baad aata hai; recursion mein bhi safe hai kyunki har tick loop timers/poll/close ko service kar leta hai. Interview mein aksar poocha jaata hai kyunki naam intuition ke ulta hai.",
    followUp: "Recursive chunked processing ke liye kaunsa use karoge aur kyun?",
  },
  {
    id: "pnt-3",
    question:
      "Ek internal utility har call pe `process.nextTick` mein cleanup schedule karti hai, aur cleanup khud aur nextTicks fire karti hai. Load pe HTTP requests timeout hone lage. Diagnose aur fix?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "nextTick queue lagataar refill ho rahi hai, isliye event loop poll phase (jahan socket data callbacks chalte hain) tak pahunch hi nahi paata. Fix: cleanup ko `setImmediate` pe move karo, ya ek nextTick mein saara cleanup batch karo, ya us utility ka use kam karo.",
    detailedAnswer:
      "Symptom classic starvation hai: CPU 100% nahi, par I/O callbacks late aa rahe hain. Root cause: har operation ke baad Node nextTick queue poori khali karne ki koshish karta hai, aur agar wo queue khud ko refill karti rahe, loop kabhi timers/poll pe nahi badhta. Detect: `perf_hooks.monitorEventLoopDelay` se delay spike dekho; `--cpu-prof` ya `async_hooks` se pata karo kaun si nextTicks flood kar rahi hain. Fix priority: (1) recursion todo — `setImmediate` use karo taaki har iteration loop ko yield mile; (2) agar multiple chhote cleanups hain to unhe ek hi `queueMicrotask`/`setImmediate` mein collapse karo; (3) library config se ye behaviour disable/patch karo.",
    followUp: "Kaise confirm karoge ki problem CPU-bound nahi, starvation hai?",
    redFlag: "\"Machine slow hai, bada instance le lo\" — starvation scale karne se theek nahi hoti.",
  },
  {
    id: "pnt-4",
    question:
      "`console.log('1'); process.nextTick(() => console.log('2')); Promise.resolve().then(() => console.log('3')); console.log('4');` — output aur reason.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "`1 4 2 3`. Sync pehle (1, 4). Phir process.nextTick queue (2). Phir Promise microtask queue (3). Dono timers/I-O se pehle, aur nextTick promise se pehle.",
    detailedAnswer:
      "Do sync statements turant chalte hain: `1`, `4`. Stack khali hote hi Node priority order lagata hai: `process.nextTick` queue pehle to `2`, uske baad Promise microtask queue to `3`. Agar yahan `setTimeout(fn, 0)` bhi hota, wo sabse aakhir mein aata kyunki wo macrotask hai. Key takeaway: nextTick promise reactions se bhi upar hai.",
    followUp: "Agar `2` wali nextTick ke andar ek aur `Promise.resolve().then` schedule karein, wo kab chalega?",
  },
];

export default questions;
