import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "svaj-1",
    question:
      "JavaScript single-threaded hai. Phir ye asynchronous kaam kaise karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "JS ka apna code ek thread, ek call stack pe chalta hai. Slow kaam — network, timers, disk — JS engine khud nahi karta, wo browser ya Node ke APIs ko delegate hota hai jo alag chalte hain. Poora hone pe callback ek queue mein jaata hai, aur event loop use stack khali hone pe chalata hai.",
    detailedAnswer:
      "Runtime ke do hisse samajhne padte hain: (1) JS engine (jaise V8) — is mein call stack aur heap hai, aur ye sirf ek thread pe JS chalata hai. (2) Host environment (browser ya Node) — is mein Web APIs / C++ APIs hain jo timers, network, file I/O handle karti hain, aur ye kaam main JS thread se hat ke hota hai. Flow: tum `fetch(url)` call karte ho, wo turant return karta hai aur actual network kaam browser ke paas chala jaata hai; call stack khali ho jaata hai aur baaki sync code chalta rehta hai; jab response aata hai, uska callback callback queue (ya microtask queue, agar Promise hai) mein jaata hai; event loop dekhta hai stack khali hai to queue se callback uthata hai. Is tarah ek thread pe hazaaron concurrent I/O operations chal sakte hain bina blocking wait ke — lekin JS ka apna code kabhi do jagah ek saath nahi chalta.",
    followUp:
      "Agar main thread pe ek 5-second ka while loop chala doon to fetch ke callbacks ka kya hota hai?",
    redFlag:
      "\"Async matlab JS naye threads bana kar code parallel chalata hai\" — JS code kabhi parallel nahi chalta, sirf delegated I/O background mein hota hai.",
  },
  {
    id: "svaj-2",
    question:
      "Synchronous aur asynchronous code mein practical farak kya hai? Ek example do jaha sync code nuksaan karta hai.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Synchronous code line by line chalta hai — har line pichli ke poora hone ka wait karti hai, isliye ek slow line poora UI freeze kar deti hai. Asynchronous code slow kaam start karke aage badh jaata hai aur result callback/promise se milta hai, isliye thread free rehta hai.",
    detailedAnswer:
      "Maan lo ek button click pe API se data laana hai. Synchronous version: `const data = syncGet(url)` — jab tak server jawab na de (maan lo 2 second), poora tab dead — na scroll, na doosra click, na animation, kyunki call stack us ek line pe atka hai. User ko lagta page hang. Asynchronous version: `fetch(url).then(render)` — `fetch` turant return karta hai, thread free, user baaki page use kar sakta hai; 2 second baad response aane pe `render` callback chalta hai. Dusra classic example: bade dataset pe heavy computation main thread pe — 60fps ka frame budget sirf `~16ms` hai, isse lambi synchronous cheez dropped frames deti hai. Solution: kaam ko `setTimeout`/`requestIdleCallback` se chunks mein tod do ya Web Worker mein bhej do.",
    followUp:
      "Heavy CPU computation ko block kiye bina kaise chalaoge — chunking aur Web Worker mein kya farak hai?",
  },
  {
    id: "svaj-3",
    question:
      "`console.log(1); setTimeout(() => console.log(2), 0); console.log(3);` ka output kya hai aur kyun?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Output: 1, 3, 2. `console.log(1)` aur `console.log(3)` synchronous hain. `setTimeout` ka callback delay `0` hone par bhi callback queue mein jaata hai aur event loop use tabhi chalata hai jab current synchronous code (3 tak) poora ho jaaye.",
    detailedAnswer:
      "Step by step: (1) `console.log(1)` call stack pe chala — output `1`. (2) `setTimeout(cb, 0)` call hua — `setTimeout` turant return karta hai, `cb` browser ke timer ke paas chala jaata hai; `0ms` (practically `~4ms`) baad `cb` callback queue mein rakh diya jaata hai, chalaya nahi jaata. (3) `console.log(3)` chala — output `3`. (4) Ab synchronous code khatam, call stack khali. Event loop callback queue se `cb` uthata hai — output `2`. Isliye `1 3 2`. Key point: `setTimeout(fn, 0)` ka matlab 'turant' nahi, 'as soon as possible, par current sync code aur pending queue ke baad' hai.",
    followUp:
      "Ab isme `Promise.resolve().then(() => console.log(4))` add kar doon — wo 2 se pehle aayega ya baad? Kyun?",
    redFlag:
      "\"Output 1 2 3 hoga kyunki delay 0 hai\" — delay 0 hone se callback synchronous nahi ho jaata.",
  },
  {
    id: "svaj-4",
    question:
      "Blocking aur non-blocking operation mein kya farak hai? Node.js ke context mein samjhao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Blocking operation call stack ko rok kar rakhta hai jab tak kaam poora na ho (jaise `fs.readFileSync`) — us dauran Node koi doosri request handle nahi kar sakta. Non-blocking operation kaam delegate karke turant return karta hai (jaise `fs.readFile` callback ke saath) — thread free rehta hai baaki requests ke liye.",
    detailedAnswer:
      "Node ek single event-loop thread pe requests handle karta hai. Agar ek request handler `const data = fs.readFileSync('big.json')` use kare, to jab tak disk se file na aaye, poora event loop atka — 100 concurrent users mein 100th user ko baaki sabka disk wait bhugatna padega. Non-blocking version `fs.readFile('big.json', (err, data) => {...})` disk kaam libuv ke thread pool ko de deta hai aur turant return karta hai; event loop agli request pe badh jaata hai; file ready hone pe callback queue ho jaata hai. Isiliye Node mein I/O ke liye hamesha async APIs use karte hain, aur `*Sync` versions sirf startup / CLI scripts mein jaha concurrency nahi chahiye. Blocking CPU kaam (bada loop, crypto) ke liye `worker_threads` ya alag process.",
    followUp:
      "`*Sync` version kab use karna theek hai?",
  },
  {
    id: "svaj-5",
    question:
      "Ek report page 2 lakh rows client pe render karta hai aur us dauran poora UI 4 second freeze ho jaata hai. Root cause kya hai aur kaise theek karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Root cause: saara rendering/processing ek synchronous loop mein main thread pe ho raha hai, isliye event loop us dauran clicks, scroll aur paint kuch nahi kar sakta. Fix: kaam ko chunks mein tod do (`setTimeout`/`requestIdleCallback` se), ya virtualization use karo, ya heavy transform Web Worker mein karo.",
    detailedAnswer:
      "Single thread, single call stack — jab tak 2 lakh rows ka loop chal raha hai, koi aur kaam nahi ho sakta. Practical fixes, kam se zyada effort: (1) **Virtualization / windowing** (react-window jaisa) — sirf visible rows render karo, DOM mein ~30 nodes, baaki scroll pe. Ye sabse bada win hai. (2) **Chunking** — agar sab process karna hi hai, `1000` rows process karo phir `setTimeout(next, 0)` — beech mein thread free ho jaata hai, UI responsive, total time thoda badhta hai. (3) **Web Worker** — pure data transformation (sorting, aggregation) worker mein, phir `postMessage` se result. DOM worker mein nahi bana sakte, par calculation offload ho jaata hai. (4) **Server-side pagination** — sabse saaf: ek baar mein 50 rows bhejo. Interview mein: pehchaano ki ye 'main thread blocked' problem hai, phir trade-off ke saath option chuno.",
    followUp:
      "requestIdleCallback aur setTimeout(fn, 0) se chunking mein kya farak hai?",
  },
];

export default questions;
