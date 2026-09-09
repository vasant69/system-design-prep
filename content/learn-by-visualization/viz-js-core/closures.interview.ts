import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "clo-1",
    question: "Closure kya hai? Ek practical example do jahan closure genuinely zaroori ho.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Closure = function + uske lexical scope ke variables ka reference, jo outer function return hone ke baad bhi zinda rehte hain. Practical: private state — jaise `makeCounter()` jo ek chhupa hua `count` deta hai jise sirf returned `inc`/`value` touch kar sakte hain.",
    detailedAnswer:
      "Jab ek inner function apne outer function ke variables use karta hai aur wo inner function outer se bahar jaata hai (return / callback / event listener), to JS us outer scope ko garbage-collect nahi karta — inner function ka closure use pakde rehta hai. Common real use: (1) private state / encapsulation (`makeCounter`, ek `once(fn)` wrapper), (2) function factories (`const add5 = adder(5)`), (3) memoize / cache jo calls ke beech persist kare, (4) event handlers jo apni config (`elementId`, `apiUrl`) yaad rakhein. Sab isi wajah se possible hain ki JS lexical-scoped hai — function apne birth-place ke variables dekhta hai, call-place ke nahi.",
    followUp: "Closure ka variable capture 'by reference' hai ya 'by value'? Isse loop mein kya farak padta hai?",
    redFlag: "\"Closure outer variables ki copy bana leta hai\" — nahi, wo live reference rakhta hai; update dono taraf dikhta hai.",
  },
  {
    id: "clo-2",
    question:
      "`for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` kya print karega? `let` karne se kya badlega, aur `let` ke bina fix kaise karte the?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`var`: `3 3 3`. `let`: `0 1 2`. `var i` puri loop ke liye ek binding hai, aur teeno callbacks usi ek `i` par closure banate hain — jab wo async chalte hain `i` `3` ho chuka hota hai. `let i` har iteration ka fresh binding banata hai.",
    detailedAnswer:
      "`var` version mein teeno arrow functions same `i` par closure banate hain. `setTimeout` callbacks event loop ke baad ke tick mein chalte hain — tab tak loop `i` ko `3` tak badha chuka hai, isliye `3 3 3`. `let` version mein spec ke mutabik har iteration ka apna block-scoped `i` hota hai (pichhli value se copy hoke), to har callback apni value capture karta hai -> `0 1 2`. `let` se pehle classic fix tha ek IIFE se per-iteration scope banana: `for (var i = 0; i < 3; i++) { (function (j) { setTimeout(() => console.log(j), 0); })(i); }` — ya `setTimeout(fn, 0, i)` se value pass karna.",
    followUp: "IIFE fix mein `j` alag kyun kaam karta hai jabki `i` nahi karta tha?",
  },
  {
    id: "clo-3",
    question: "Ek `once(fn)` function likho jo `fn` ko sirf pehli baar chalaye aur uske baad har call par pehla hi result de.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Ek `called` flag aur ek `result` variable closure mein rakho. Pehli call par `fn` chalao, result store karo, flag set karo; aage har call par stored result return karo.",
    detailedAnswer:
      "```js\nfunction once(fn) {\n  let called = false;\n  let result;\n  return function (...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}\n\nconst init = once(() => { console.log('setup'); return 42; });\ninit(); // logs 'setup', returns 42\ninit(); // no log, returns 42\n```\n`called` aur `result` bahar se invisible hain — yeh closure-backed private state hai. `fn.apply(this, args)` se original context aur arguments preserve rehte hain. Yehi pattern lodash ke `_.once` aur singleton-init me use hota hai.",
    followUp: "Agar `fn` async (promise return karta) ho to `once` ko kaise adjust karoge?",
  },
  {
    id: "clo-4",
    question: "Closures memory leak kaise kar sakte hain? Ek example do.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Closure apne poore outer scope ke variables ko zinda rakhta hai jab tak wo khud reachable hai. Agar ek long-lived closure galti se ek bade object ya detached DOM node ka reference pakde rehta hai, wo memory kabhi free nahi hoti.",
    detailedAnswer:
      "Classic case: ek event listener (jo ek closure hai) jise `removeEventListener` se hataya nahi gaya — wo apne saath capture kiya hua `bigData` array aur shayad ek DOM node bhi memory mein pakde rakhta hai, node DOM se hatne ke baad bhi (detached node leak). Doosra: ek module-level cache/`Map` jisme closures keys ke saath bade values daalte rehte hain par kabhi evict nahi karte. Fixes: listeners cleanup karo (React `useEffect` return, `AbortController`), closure mein sirf zaroori fields capture karo (poora object nahi), aur caches par size limit / `WeakMap` use karo taaki key GC ho sake.",
    followUp: "`WeakMap` yahan `Map` se behtar kaise hai?",
  },
];

export default questions;
