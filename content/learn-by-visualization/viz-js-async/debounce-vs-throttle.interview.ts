import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dvt-1",
    question:
      "Debounce aur throttle mein farak kya hai? Har ek ka ek real use case do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Debounce: rapid events ke baad ek quiet gap ka wait, phir fn ek baar — search box, resize-then-recalculate. Throttle: fn har interval mein max ek baar chalta hai jab tak events aate rahein — scroll, mousemove, drag, infinite scroll.",
    detailedAnswer:
      "Debounce 'settle hone ka intezaar' hai: har event timer reset karta hai, fn tabhi jab events `delay` ms ke liye ruk jayein. Isliye burst ke dauran 0 calls, end pe 1. Throttle 'rate cap' hai: fn chalta hai, phir `interval` ms tak koi aur call nahi, phir agla allowed. Burst ke dauran regular calls (har interval mein 1). Ek line ka rule: 'sirf final state chahiye' -> debounce; 'chalte-chalte updates chahiye par kam frequency pe' -> throttle.",
    followUp:
      "Debounce mein 'leading edge' (pehle call turant) option ka kya matlab hai?",
    redFlag:
      "Dono ko interchangeable batana — scroll handler pe debounce lagane se update tabhi hoga jab scroll ruk jaye, beech mein UI frozen dikhega.",
  },
  {
    id: "dvt-2",
    question: "Ek basic `debounce(fn, delay)` implement karke dikhao.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Outer function ek `timer` variable rakhti hai aur ek wrapper return karti hai jo har call pe `clearTimeout(timer)` karke naya `setTimeout(() => fn.apply(this, args), delay)` set karta hai.",
    detailedAnswer:
      "```js\nfunction debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n```\nKey points: `timer` closure mein hai (call-to-call persist). `fn.apply(this, args)` se original `this` aur arguments forward hote hain — isliye regular `function` use ki, arrow nahi (arrow ka apna `this` nahi hota, par yahan outer arrow bhi chal jata agar call-site `this` na chahiye). Extras jo interviewer maang sakta hai: leading-edge call, ek `cancel()` method, ya trailing ke saath immediate-first.",
    followUp: "Isme `cancel()` method kaise add karoge?",
    redFlag:
      "`timer` ko wrapper ke andar declare karna — har call pe naya `timer`, clear kabhi effective nahi, debounce toota.",
  },
  {
    id: "dvt-3",
    question:
      "Ek dashboard pe `window.resize` pe expensive layout recalculation ho raha hai aur resize karte waqt page laggy hai. Kaunsa tool, kaunsi settings?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Zyadatar cases mein debounce (lagbhag 150-250ms) — user ke resize khatam karne pe ek recalculation. Agar resize ke dauran bhi kuch live feedback chahiye to throttle (lagbhag 100ms) + end pe ek final debounce-style call.",
    detailedAnswer:
      "`resize` burst events deta hai. Pure recalculation sirf final size pe matter karta hai, to debounce sabse kifayti hai — beech ke sabhi intermediate sizes skip. Lekin agar layout resize ke saath-saath dikhna chahiye (e.g. chart ko roughly resize karna), to throttle se har lagbhag 100ms mein update karo, aur ek trailing call se aakhri exact size pe settle karo (kai libraries ka throttle `trailing: true` yahi karta hai). `ResizeObserver` + `requestAnimationFrame` bhi ek modern option hai jo paint ke saath sync rehta hai.",
    followUp: "`requestAnimationFrame`-based throttle ka kya fayda hai plain `setTimeout` ke muqable?",
    redFlag:
      "Recalculation ko seedha `resize` listener mein chhod dena, ya delay itna bada rakhna ki UI 'atki hui' lage.",
  },
  {
    id: "dvt-4",
    question:
      "`el.addEventListener('input', debounce(handler, 300))` — theek. Par `el.addEventListener('input', () => debounce(handler, 300))` — isme kya bug hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Doosre case mein har `input` event pe ek NAYA debounced function banta hai aur turant discard ho jaata hai — use kabhi call hi nahi kiya jaata. `handler` kabhi nahi chalega. Debounced function ek baar banao, phir use listener ki tarah pass karo.",
    detailedAnswer:
      "`debounce(handler, 300)` ka return value wo function hai jise call karna hai. Pehle case mein wo return value hi listener hai — sahi. Doosre case mein listener ek arrow hai jo har event pe `debounce(...)` call karta hai (naya wrapper banata hai, jiska apna fresh `timer` hai) aur uska result throw kar deta hai bina invoke kiye. Har event apna alag timer banata hai jo kabhi reset nahi hota. Fix: `const onInput = debounce(handler, 300); el.addEventListener('input', onInput);`.",
    followUp:
      "React component mein har render pe naya debounced function na bane, iske liye kya karoge?",
    redFlag:
      "Debounce/throttle ko event listener ke andar call karna instead of ek baar banake reference pass karna.",
  },
];

export default questions;
