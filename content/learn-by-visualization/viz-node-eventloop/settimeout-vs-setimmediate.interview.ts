import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "svi-1",
    question:
      "`const fs = require('fs'); fs.readFile(__filename, () => { setTimeout(() => console.log('timeout'), 0); setImmediate(() => console.log('immediate')); });` — kya print hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Hamesha `immediate` phir `timeout`. readFile callback poll phase mein chalta hai; agla phase check hai jahan setImmediate chalta hai, jabki setTimeout ke liye loop ko wapas timers phase (agla tick) tak jaana padta hai.",
    detailedAnswer:
      "Jab `fs.readFile` ka callback invoke hota hai, event loop poll phase ke andar hai. Wahan se aage badhte hi check phase aata hai — `setImmediate` ka ghar — to `immediate` pehle print hota hai. `setTimeout(fn, 0)` timers phase mein hai, jo is tick ke liye already nikal chuka; use agle loop iteration ka intzaar hai, isliye `timeout` baad mein. Yahi order kisi bhi I/O callback ke andar reliable hai. Main module ke top se yahi do lines likhoge to order guaranteed nahi rehta.",
    followUp: "Main module se ye do lines likho — output kya aur kyun vary karta hai?",
    redFlag: "\"setImmediate hamesha setTimeout(0) se pehle\" bina I/O-callback context batae.",
  },
  {
    id: "svi-2",
    question: "`setImmediate` aur `setTimeout(fn, 0)` mein farak — event loop phases ke terms mein.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "setImmediate check phase mein chalta hai (poll ke turant baad). setTimeout(fn, 0) timers phase mein chalta hai (loop iteration ke shuru mein), aur 0 clamp hoke 1ms ban jaata hai. Intent bhi alag: setImmediate ka matlab 'is I/O ke turant baad', setTimeout ka matlab 'kam se kam itni der baad'.",
    detailedAnswer:
      "Event loop har tick mein timers, pending, poll, check, close phases se guzarta hai. `setTimeout`/`setInterval` timers phase mein service hote hain, aur unka delay ek minimum hai, exact nahi — busy loop mein late ho sakta hai. `setImmediate` sirf check phase mein service hota hai. Practical rule: agar tum already ek I/O callback (poll phase) mein ho aur kaam usi tick mein aage defer karna chahte ho, `setImmediate` use karo — deterministic aur bina 1ms timer overhead ke. Agar tumhe genuinely wall-clock delay chahiye, `setTimeout` use karo.",
    followUp: "Recursive kaam ko chunk karne ke liye setImmediate ya setTimeout(0) — kaunsa aur kyun?",
  },
  {
    id: "svi-3",
    question:
      "Interviewer: main module se `setTimeout(() => {}, 0)` aur `setImmediate(() => {})` — kaunsa pehle chalega? Guarantee de sakte ho?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi, koi guarantee nahi. Ye race hai jo is baat pe depend karta hai ki process ko event loop ke pehle timers-phase check tak pahunchne mein 1ms se zyada laga ya nahi. Output run-to-run flip ho sakta hai.",
    detailedAnswer:
      "Jab script ka sync part khatam hota hai, loop shuru hota hai. Sabse pehle timers phase aata hai: agar us waqt tak `setTimeout` ka 1ms threshold beet chuka hai, callback ready hai aur pehle chalega; agar nahi, loop check phase pe jaake `setImmediate` pehle chalata hai, aur timer agle tick mein. Startup work, machine load, sab isko influence karte hain. Deterministic order chahiye to dono ko ek I/O callback ke andar rakho — wahan `setImmediate` hamesha pehle.",
    followUp: "In dono ko deterministic order mein kaise chalaoge?",
    redFlag: "Bina soche \"setTimeout pehle kyunki 0ms\" — clamp aur phase-order dono galat samajhna.",
  },
  {
    id: "svi-4",
    question:
      "Ek 500k items ki list process karni hai bina event loop block kiye. `setImmediate` se chunk karoge ya `setTimeout(fn, 0)` se? Kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "setImmediate. Har chunk ke baad `setImmediate(nextChunk)` call karo — check phase har tick mein aata hai, aur beech mein loop timers, poll (I/O), aur close callbacks ko service kar leta hai. setTimeout(fn, 0) har chunk pe kam se kam 1ms add karta hai, to total kaafi slow ho jaata hai.",
    detailedAnswer:
      "Dono approaches loop ko saans dene ka mauka dete hain (unlike `process.nextTick` recursion jo starve karti hai). Lekin `setTimeout(fn, 0)` ka clamp har iteration pe ~1ms floor laga deta hai — 500k / batch size iterations pe ye seconds add kar sakta hai. `setImmediate` ka aisa koi floor nahi; wo bas 'is tick ka baaki kaam nipta ke phir mujhe chalao' kehta hai, isliye tez aur fir bhi fair. Pattern: ek index rakho, ek chunk (e.g. 1000 items) process karo, phir `if (i < len) setImmediate(run)`.",
    followUp: "process.nextTick se chunk karte to kya galat hota?",
  },
];

export default questions;
