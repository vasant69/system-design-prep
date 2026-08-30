import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hofc-1",
    question: "Higher-order function aur callback mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Higher-order function wo hai jo ek function ko argument leta hai ya ek function return karta hai (ya dono). Callback wo function hai jo tum kisi aur function ko dete ho taaki wo use baad mein call kare. `map` ek HOF hai; jo function tum `map` ko dete ho wo callback hai. Dono relative terms hain — ek hi call mein `map` HOF hai aur `x => x*2` callback.",
    detailedAnswer:
      "HOF caller ke perspective se hai — `arr.map(fn)` mein `map` HOF hai kyunki wo `fn` ko argument leta hai; `multiplier(factor) { return n => n*factor; }` HOF hai kyunki function return karta hai. Callback callee ke perspective se hai — wo passed-in function jise andar se invoke kiya jaayega. Har callback ek HOF ko diya jaata hai, par har HOF callback nahi leta (kuch sirf return karti hain). JavaScript mein ye sab isliye possible hai kyunki functions first-class values hain — assign, pass, return sab valid.",
    followUp:
      "Ek HOF ka example do jo function LETA nahi, sirf return karta hai.",
    redFlag:
      "\"Callback hamesha async hota hai\" — map/sort/filter ke callbacks synchronous hain.",
  },
  {
    id: "hofc-2",
    question:
      "Synchronous aur asynchronous callback mein farak? Har ek ka example.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Synchronous callback usi call stack mein, HOF ke return hone se pehle chal jaata hai — `[1,2,3].map(x => x*2)`, `arr.sort(cmp)`, `arr.forEach(fn)`. Asynchronous callback event loop ke kisi future tick pe chalta hai — `setTimeout(fn)`, `el.addEventListener('click', fn)`, `fs.readFile(path, cb)`, `promise.then(fn)`.",
    detailedAnswer:
      "`const doubled = [1,2,3].map(x => x*2); console.log(doubled)` — jab `console.log` chalti hai, callback teeno elements pe chal chuka hai; `map` synchronously poora kaam karke return karta hai. `console.log('a'); setTimeout(() => console.log('b'), 0); console.log('c')` — output `a c b`, kyunki `setTimeout` callback current synchronous code khatam hone ke baad, event loop ke agle tick pe chalta hai — chahe delay `0` ho. Practical impact: async callback ke andar `return` kiya value caller ko nahi milti (caller pehle hi return ho chuka); async errors ko `try/catch` around the HOF call se nahi pakad sakte. isiliye async callbacks ko promises/async-await se replace kiya jaata hai jahan `await` + `try/catch` kaam karte hain.",
    followUp:
      "`setTimeout(fn, 0)` turant kyun nahi chalta agar delay 0 hai?",
  },
  {
    id: "hofc-3",
    question:
      "Ek `once(fn)` function likho jo `fn` ko sirf pehli baar chalaye, baad mein cached result de. `this` aur args bhi sahi handle ho.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Ek closure mein `called` flag aur `result` rakho, ek wrapper function return karo jo pehli call pe `fn.apply(this, args)` chalaye aur result cache kare, aage har call pe wahi cached result de.",
    detailedAnswer:
      "```javascript\nfunction once(fn) {\n  let called = false;\n  let result;\n  return function (...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}\n```\n\nKey points interviewer dekhta hai: (1) `called`/`result` closure mein private hain — har `once(f)` ki apni copy. (2) Returned function `function` hai, arrow nahi, taaki call-site ka `this` mile, aur `fn.apply(this, args)` se wo `this` + saare args original ko forward hon. (3) Pehli call ke baad `fn` kabhi dobara nahi chalta — side effects (setup, analytics init) sirf ek baar. Extension: error aane par `called` `true` hi rehta hai (ya requirement ke hisab se reset). Real use: one-time initialization, event handler jo sirf pehla click count kare.",
    followUp:
      "Agar `fn` pehli call pe throw kar de to `once` ko dobara try karne dena chahiye ya nahi — design decision batao.",
  },
  {
    id: "hofc-4",
    question:
      "`debounce` kya karta hai aur uska basic implementation kya hai?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Debounce ek function ko wrap karta hai taaki wo tabhi chale jab uski aakhri call ke baad `delay` ms tak koi nayi call na aaye. Har call pehle wale pending timer ko `clearTimeout` karti hai aur naya `setTimeout` set karti hai.",
    detailedAnswer:
      "```javascript\nfunction debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n```\n\n`timer` closure mein rakha hai. Har nayi call: pichla scheduled run cancel, naya schedule. Agar 5 calls 100ms ke andar aayein aur delay 300ms hai, to `fn` sirf 1 baar chalega — aakhri call ke 300ms baad. Use cases: search-as-you-type (har keystroke pe API na maaro), window resize / scroll handlers, form auto-save. `throttle` isse alag hai — wo fixed rate pe (har `delay` ms mein max ek baar) chalne deta hai, chahe calls continuous hon. Arrow inside `setTimeout` isliye taaki `this` aur `args` outer `function` se lexically mil jaayein.",
    followUp:
      "Debounce aur throttle mein — infinite scroll ke liye kaunsa, aur search box ke liye kaunsa?",
  },
  {
    id: "hofc-5",
    question:
      "Kab HOFs (`map`/`filter`/`reduce`, composition) code ko behtar banate hain aur kab worse?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Behtar: jab 'operation' hi point ho — transform/filter/aggregate — declarative aur DRY. Worse: nested async callbacks (callback hell), hot-path pe chained `.map().filter()` jo multiple arrays allocate karein, over-abstraction jo team padh na paaye, aur jab `break`/`continue`/early-return chahiye.",
    detailedAnswer:
      "Strong case: `orders.filter(o => o.active).map(o => o.total).reduce((a, b) => a + b, 0)` — intent ek nazar mein clear, koi manual index/accumulator boilerplate nahi. Wrappers (`once`, `debounce`, `withRetry`) original ko chhue bina behaviour add karte hain. Weak case: (1) `getUser(id, u => getPosts(u.id, p => getComments(p[0].id, c => ...)))` — deep nesting, har level pe error handling; promises/async-await se flat. (2) Bade dataset pe `arr.map(f).filter(g).map(h)` teen full passes + teen intermediate arrays — ek `for...of` ya `reduce` mein combine karo jab perf matter kare. (3) `pipe(pipe(...), compose(...))` jise naya dev decode na kar paaye — abstraction ka cost readability se zyada. (4) `forEach` mein `break` nahi hota, `return` sirf callback se nikalta hai — jaldi rukna ho to `for...of` ya `some()`. Rule: HOF jab wo intent ko express kare; loop jab control flow (break/perf/side-effects) khud point ho.",
    followUp:
      "`arr.forEach` aur `for...of` mein — ek concrete case jahan `for...of` zaroori ho jaata hai?",
  },
];

export default questions;
