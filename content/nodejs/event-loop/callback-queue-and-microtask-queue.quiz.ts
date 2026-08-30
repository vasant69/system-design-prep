import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "callback-queue-and-microtask-queue-1",
    question:
      "Node mein microtask queues kaunse hain aur unka drain order kya hai?",
    options: [
      "Sirf ek microtask queue hai jismein timers aur promises dono aate hain",
      "Do: pehle poori `process.nextTick` queue, phir poori Promise job queue",
      "Do: pehle Promise job queue, phir `process.nextTick` queue",
      "Do: pehle `setImmediate` queue, phir Promise job queue",
    ],
    correctIndex: 1,
    explanation:
      "Node ke paas do microtask queues hain aur order fixed hai: pehle `process.nextTick` queue poori drain hoti hai, phir Promise job queue (`.then`/`.catch`/`.finally`/`await` continuations) poori drain hoti hai. Option C order ulta bata raha hai. Option D galat — `setImmediate` ek macrotask (check phase) hai, microtask nahi. Option A galat — timers alag macrotask queue mein hain.",
    difficulty: "easy",
  },
  {
    id: "callback-queue-and-microtask-queue-2",
    question:
      "`setTimeout(() => console.log('T'), 0)` aur `Promise.resolve().then(() => console.log('P'))` — kaunsa pehle print hoga aur kyun?",
    options: [
      "'T' pehle, kyunki delay 0 hai toh wo turant chalta hai",
      "'P' pehle, kyunki `.then` ek microtask hai jo current macrotask ke turant baad drain hoti hai, jabki `setTimeout` ka callback ek macrotask hai jo agli loop iteration ke timers phase ka wait karta hai",
      "Order non-deterministic hai, dono mein se koi bhi pehle aa sakta hai",
      "'T' pehle, kyunki timers phase Promise jobs se pehle chalta hai",
    ],
    correctIndex: 1,
    explanation:
      "Microtasks (Promise jobs) har macrotask ke baad aur har phase ke beech drain hoti hain — timer callback tak pahunchne se bahut pehle. Isliye 'P' hamesha 'T' se pehle, chahe timeout 0 ho. Yeh deterministic hai (Option C galat). Option A/D 'delay 0 = turant' ki galatfehmi hai — 0 sirf 'jitna jaldi ho sake' hai, aur microtasks phir bhi aage hain.",
    difficulty: "medium",
  },
  {
    id: "callback-queue-and-microtask-queue-3",
    question:
      "Ek function khud ko `process.nextTick(fn)` se recursively schedule karta hai. Sath mein ek `setTimeout(cb, 100)` bhi pending hai. Kya hoga?",
    options: [
      "100ms baad `setTimeout` ka `cb` chal jayega, `nextTick` loop ke sath-sath",
      "`nextTick` queue kabhi khali nahi hoti, isliye Node event loop ke timers phase tak pahunchta hi nahi — `cb` kabhi nahi chalta, process bina crash ke hang ho jata hai",
      "Node 128 iterations ke baad `nextTick` loop ko force-stop kar deta hai",
      "`setTimeout` ka `cb` pehle chalega kyunki uska explicit delay hai",
    ],
    correctIndex: 1,
    explanation:
      "Microtask drain 'empty hone tak' hota hai, aur recursive `nextTick` har drain ke dauraan ek naya callback add karta hai — queue kabhi empty nahi hoti. Node next macrotask ya next phase pe tabhi jata hai jab dono microtask queues khali hon, toh timers phase kabhi nahi aata. `cb` starve ho jata hai, process CPU 100% pe hang dikhta hai. Node koi auto-limit nahi lagata (Option C galat).",
    difficulty: "medium",
  },
  {
    id: "callback-queue-and-microtask-queue-4",
    question:
      "Ek badi in-memory tree (roughly 5 lakh nodes) ko process karna hai bina event loop ko block kiye. Kaunsa scheduling primitive sahi hai?",
    options: [
      "Har node ke liye `process.nextTick(processNext)` — microtask hai toh lightweight",
      "Har node ke liye `Promise.resolve().then(processNext)` — stack overflow se bachata hai",
      "Har N nodes ke baad `await new Promise(r => setImmediate(r))` — `setImmediate` ek macrotask hai jo I/O callbacks ke sath fair share leta hai",
      "Poora tree ek hi synchronous `for` loop mein process karo, wahi sabse fast hai",
    ],
    correctIndex: 2,
    explanation:
      "`setImmediate` check phase ka macrotask hai — beech mein Node poll phase mein jaake pending I/O (health checks, incoming requests) serve kar sakta hai. `nextTick` aur `Promise.then` dono microtasks hain jo 'empty hone tak' drain hoti hain, toh wo tree khatam hone tak I/O ko starve kar dengi (Option A/B). Synchronous loop (Option D) poore duration event loop block kar deta hai. Har-node pe yield karna slow hai, isliye har N nodes pe batch karke yield karo.",
    difficulty: "hard",
  },
];

export default quiz;
