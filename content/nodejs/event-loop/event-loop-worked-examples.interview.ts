import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "elwe-1",
    question:
      "\"Output order batao\": `console.log('a'); setTimeout(() => console.log('b'), 0); Promise.resolve().then(() => console.log('c')); console.log('d');` — jawaab aur reasoning.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`a, d, c, b`. Saara sync code pehle (`a`, `d`). Phir stack khali — microtasks drain hoti hain timers phase se pehle: `c`. Phir loop timers phase: `b`. Microtask (`.then`) hamesha `setTimeout(0)` se pehle — deterministic.",
    detailedAnswer:
      "Tick by tick: (1) `console.log('a')` — sync, print. (2) `setTimeout(cb, 0)` — `cb` timers macrotask queue mein. (3) `Promise.resolve().then(cb)` — promise already resolved, `cb` Promise microtask queue mein. (4) `console.log('d')` — sync, print. (5) Main script khatam, stack khali. Ab microtasks drain hoti hain — timers phase se PEHLE — Promise queue: print `c`. (6) Microtasks empty. Loop timers phase: print `b`.\n\nDo rules jo har aisa question solve karte hain: (1) sync code poora pehle; phir loop: timers -> poll -> check -> close. (2) Har callback ke baad aur har phase ke beech: pehli poori `process.nextTick` queue, phir poori Promise queue. Priority: sync > nextTick > Promise > macrotasks.",
    followUp: "Agar `.then` ke andar ek aur `setTimeout` schedule ho jaye to wo kab chalega?",
  },
  {
    id: "elwe-2",
    question:
      "`process.nextTick` aur `Promise.resolve().then` — dono microtasks hain. Farak kya hai? Ek snippet se dikhao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Do ALAG microtask queues hain. Pehle POORI `process.nextTick` queue drain hoti hai, phir POORI Promise job queue — chahe `.then` code mein pehle likha ho. `nextTick` higher priority.",
    detailedAnswer:
      "```javascript\nconsole.log('1');\nPromise.resolve().then(() => console.log('2: promise'));\nprocess.nextTick(() => console.log('3: nextTick'));\nconsole.log('4');\n// Output: 1, 4, 3: nextTick, 2: promise\n```\n\nSync pehle: `1`, `4`. Phir microtask drain: pehle poori nextTick queue -> `3: nextTick`, phir poori Promise queue -> `2: promise`. `.then` code mein pehle likha tha, phir bhi `nextTick` pehle chala.\n\nPractical implication: ek recursive `process.nextTick` event loop ko permanently 'starve' kar sakta hai — kyunki nextTick queue har phase ke beech poori drain hoti hai, ek self-scheduling `nextTick` loop ko kabhi timers/poll/check phase tak nahi pahunchne dega. `queueMicrotask` (Promise queue) is problem se thoda safer hai.",
    followUp: "Ek library ne internal deferral `process.nextTick` se `queueMicrotask` par move kiya aur downstream code toota — kyun?",
  },
  {
    id: "elwe-3",
    question:
      "`setTimeout(fn, 0)` vs `setImmediate(fn)` ka order — kya wo hamesha predictable hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Main module se: NON-deterministic — kabhi timeout pehle, kabhi immediate. `setTimeout(0)` ~1ms par clamp hota hai; agar startup + script execution mein 1ms se zyada laga to timer 'ready' hai jab loop timers phase par pahunchta hai. Ek I/O callback ke ANDAR se: `setImmediate` HAMESHA `setTimeout(0)` se pehle — deterministic.",
    detailedAnswer:
      "Main module case:\n```javascript\nsetTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('immediate'));\n```\nMain script khatam hone ke baad loop timers phase par aata hai. Agar timer clamp (~1ms) nikal chuka -> `timeout` pehle, phir next iteration ke check phase mein `immediate`. Agar nahi nikla -> loop poll se check phase mein pahunchta hai -> `immediate` pehle. Startup time machine load par depend karti hai, to order bhi. Interview mein ise 'non-deterministic, dono orders valid' bolna points deta hai.\n\nI/O callback case:\n```javascript\nfs.readFile('x', () => {\n  setTimeout(() => console.log('timeout'), 0);\n  setImmediate(() => console.log('immediate'));\n});\n// HAMESHA: immediate, timeout\n```\nKyunki `readFile` callback poll phase mein chalta hai; poll ke turant baad check phase aata hai (`setImmediate`), aur timers phase agli iteration mein. To yahan order guaranteed hai.",
    followUp: "Is non-determinism ki wajah se ek test flaky ho raha hai — kaise fix karoge?",
    redFlag: "Main module se `setTimeout(0)` vs `setImmediate` ke relative order par production logic banana.",
  },
  {
    id: "elwe-4",
    question:
      "Nested case: ek `setTimeout` callback ke andar ek `Promise.then` schedule hota hai. Wo `.then` kab chalega — usi tick mein ya agli iteration mein?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Usi tick mein — us `setTimeout` callback ke turant baad, agle timer callback ya agle phase se pehle. Kyunki microtasks har callback ke baad drain hoti hain, sirf har phase ke beech nahi.",
    detailedAnswer:
      "```javascript\nconsole.log('start');\nsetTimeout(() => {\n  console.log('timeout fired');\n  Promise.resolve().then(() => {\n    console.log('promise inside timeout');\n    setImmediate(() => console.log('immediate inside promise'));\n  });\n}, 0);\nprocess.nextTick(() => console.log('nextTick top level'));\nconsole.log('end');\n// Output: start, end, nextTick top level, timeout fired, promise inside timeout, immediate inside promise\n```\n\nKey step: `timeout fired` print hone ke baad, `Promise.resolve().then(inner)` `inner` ko Promise microtask queue mein daalta hai. `setTimeout` callback khatam hone par — agle timer callback ya agle phase se PEHLE — microtask drain hoti hai, to `inner` usi tick mein chalta hai. `inner` ke andar ka `setImmediate` naturally check phase mein aata hai (jo timers ke baad hi hai). Log galti se nested `.then` ko 'agle event loop tick' mein daal dete hain.",
    followUp: "Agar us `.then` ke andar `process.nextTick` hota `setImmediate` ki jagah, to output kaise badalta?",
  },
  {
    id: "elwe-5",
    question:
      "Ek interviewer ek 6-line snippet deta hai aur 'output order?' poochta hai. Tum systematically kaise solve karoge? Kaunse points bolna high-signal hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teen buckets banao: [sync], [micro: nextTick pehle, phir Promise], [macro: timers, poll, check]. Har line ko bucket mein daalo. Order: poora sync -> poora micro -> macro phase-order mein, aur har macro callback ke baad micro bucket dobara drain. Jahan non-determinism hai (main se `setTimeout(0)` vs `setImmediate`) usse explicitly call out karo.",
    detailedAnswer:
      "Steps jo bolne/dikhane hain: (1) 'Poora synchronous code top se bottom chalega, koi callback nahi.' (2) 'Phir nextTick queue poori, phir Promise queue poori.' (3) 'Phir timers, phir poll, phir check (`setImmediate`).' (4) 'Har callback ke baad microtasks re-check — nested `.then`/`nextTick` usi tick mein.' (5) 'Yahan `setTimeout(0)` vs `setImmediate` main module se hai — order guaranteed nahi, dono valid.'\n\nDeterministic parts: sync -> nextTick -> Promise -> `setTimeout(0)` (vs `setImmediate` I/O callback se). Non-deterministic: `setTimeout(0)` vs `setImmediate` main se. Interviewer memorised-definition vs real-understanding distinguish karna chahta hai — systematic solving (guess nahi) aur non-determinism ko call out karna dono signal dete hain.",
    followUp: "Ye snippet solve karo: `console.log('a'); setImmediate(() => console.log('b')); Promise.resolve().then(() => { console.log('c'); process.nextTick(() => console.log('d')); }); process.nextTick(() => console.log('e')); console.log('f');`",
    redFlag: "Guess karke jump karna; `setImmediate` ko sabse pehle rakhna; nextTick aur Promise ko same queue maan lena.",
  },
];

export default questions;
