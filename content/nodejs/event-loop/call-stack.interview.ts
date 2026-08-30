import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cs-1",
    question: "Call stack kya hai? Ek chhote example se push/pop samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Call stack ek LIFO stack of frames hai — har frame ek function call jo abhi chal rahi hai, uske args, locals, aur 'return kahan jana hai' ka pointer. Function call pe frame push, return pe pop. Stack khali matlab engine free.",
    detailedAnswer:
      "Jab `a()` `b()` ko call karta hai aur `b()` `c()` ko, toh stack banta hai `[a, b, c]` — `c` top pe. `c` return karta hai toh `c` pop, control `b` mein wapas usi line pe jahan se `c` call hua tha; phir `b` pop, phir `a` pop, stack `[]`. Engine hamesha sirf **top** frame execute karta hai. Yeh breadcrumb trail isliye chahiye taaki nested calls ke baad control sahi jagah wapas jaye. V8 mein yeh ek fixed-size memory region hai (Node main thread pe roughly 984 KB), isliye bahut deep recursion ise bhar deti hai.",
    followUp: "Stack aur heap mein kya farak hai?",
    redFlag: "\"Call stack aur callback queue same cheez hai\" — queue event loop ka part hai jahan pending callbacks wait karte hain; stack wo hai jahan code actually execute hota hai.",
  },
  {
    id: "cs-2",
    question: "\"JavaScript single-threaded hai\" — iska matlab kya hai, aur kya Node sach mein sab kuch ek thread pe karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Matlab ek hi call stack hai, toh tumhara JS code kabhi do jagah parallel nahi chalta — ek waqt mein ek frame. Lekin poora Node process single-threaded nahi: libuv ka thread pool (default 4) file I/O, DNS, aur crypto ko background threads pe genuinely parallel chalata hai; unke callbacks wapas isi ek stack pe aate hain.",
    detailedAnswer:
      "Distinction yeh hai: **JavaScript execution** single-threaded hai, **Node runtime** nahi. Jab tum `fs.readFile` call karte ho, wo call turant return ho jati hai, actual disk read libuv ke ek worker thread pe hota hai, aur jab wo khatam ho toh callback event loop ki queue mein daala jata hai — jise event loop tab uthata hai jab main call stack khali ho. Network I/O (sockets) toh thread bhi nahi leta, wo OS-level async (epoll/kqueue/IOCP) pe hota hai. Toh 'single-threaded' ka practical matlab: mera code serialize hota hai, race conditions kam, lekin ek blocking sync frame poore server ko rok deta hai.",
    followUp: "Agar JS single-threaded hai toh 4 CPU cores ka faayda kaise uthaoge?",
    redFlag: "\"Node multi-threaded hai\" bina yeh clarify kiye ki JS code khud ek thread pe chalta hai.",
  },
  {
    id: "cs-3",
    question: "\"Blocking\" ka call stack ke terms mein exact matlab kya hai? Ek example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Blocking matlab ek frame call stack pe baith ke lamba synchronous kaam kar raha hai, isliye stack khali nahi hoti aur event loop koi dusra callback, timer, ya I/O result uthaa nahi sakta. Poora process us duration ke liye ruk jata hai.",
    detailedAnswer:
      "Example: ek Express handler ke andar `const hash = crypto.pbkdf2Sync(pw, salt, 1_000_000, 64, 'sha512')`. Yeh sync call roughly kuch sau ms leti hai aur poore us waqt ek frame stack pe rehti hai. Us dauraan `/health` bhi respond nahi karta, dusre users ki requests queue mein wait karti hain, timers late fire hote hain. Non-blocking version `crypto.pbkdf2` (callback/async) hota — wo kaam thread pool pe chala jata aur stack turant khali ho jata. Rule of thumb: request path mein koi bhi `...Sync` API, bada `for` loop, ya heavy `JSON.parse` ek blocking risk hai.",
    followUp: "`JSON.parse` ek 50 MB string pe — blocking hai ya non-blocking?",
    redFlag: "Sochna ki `async` keyword laga dene se sync loop non-blocking ho jata hai — `await` sirf tab yield karta hai jab actually kisi async cheez pe wait ho.",
  },
  {
    id: "cs-4",
    question: "Yeh code chalega? `function r() { return r(); } r();` — output kya, aur kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`RangeError: Maximum call stack size exceeded` throw hoga. `r()` har baar khud ko call karta hai bina return kiye, toh frames push hote rehte hain, base case kabhi nahi aata, aur fixed-size stack (roughly 984 KB) bhar jata hai.",
    detailedAnswer:
      "Har `r()` call ek naya frame push karti hai `[r, r, r, ...]`. Koi frame kabhi pop nahi hota kyunki `return r()` pehle andar wale `r()` ke complete hone ka wait karta hai. Typically kuch hazaar se lekar ~15,000 frames ke aas-paas V8 stack limit hit karta hai aur synchronous `RangeError` throw karta hai — jise `try { r() } catch (e) {}` se pakad sakte ho. Agar isko `setImmediate(() => r())` se async bana do toh `RangeError` nahi aayega (har call naye khali stack pe), lekin ab yeh ek infinite loop ban jayega jo event loop ko forever busy rakhega aur memory grow karega — async wrap missing base case ko theek nahi karta.",
    followUp: "Tail-call optimization se yeh fix ho sakta tha? Node mein wo enabled hai?",
    redFlag: "Yeh sochna ki yeh error async hai aur `process.on('unhandledRejection')` se aayega.",
  },
  {
    id: "cs-5",
    question: "Ek CPU-heavy computation (image resize, bade dataset ka aggregation) request handler mein hai aur latency spikes aa rahe hain. Call stack ke context mein diagnose aur fix karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Diagnosis: wo computation ek frame ke andar synchronously chal raha hai, poore us waqt call stack occupied, event loop blocked, isliye baaki requests ki latency spike karti hai. Fix options: kaam ko `setImmediate`/chunks mein todo, `worker_threads` pe offload karo, ya ek alag service/queue mein nikaalo.",
    detailedAnswer:
      "Confirm karne ke liye event-loop lag measure karo (`perf_hooks` monitorEventLoopDelay, ya clinic.js) — spike ke time lag high hoga. Root cause: single call stack pe heavy sync kaam. Options trade-off ke saath: (1) **Chunking** — loop ko batches mein todo, har batch ke baad `await new Promise(r => setImmediate(r))`; simple, lekin total kaam slow ho jata hai aur CPU abhi bhi main thread pe. (2) **worker_threads** — computation ko alag thread pe bhejo, main event loop free; best jab kaam sach mein CPU-bound ho aur bar-bar ho, cost: serialization overhead aur worker management. (3) **External job queue** (BullMQ + separate worker process) — jab kaam long-running ho aur user ko synchronous response ki zaroorat na ho. Interview mein: pehle measure, phir smallest fix jo SLA meet kare.",
    followUp: "worker_threads aur child_process mein kab kaunsa choose karoge?",
    redFlag: "\"Bas `async` laga do handler pe\" — CPU-bound sync loop `async` se non-blocking nahi hota.",
  },
];

export default questions;
