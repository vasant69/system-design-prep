import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-driven-architecture-1",
    question:
      "Reactor pattern (event-driven architecture) ka core idea kya hai?",
    options: [
      "Har incoming request ke liye ek naya OS thread banao taaki wo parallel chale",
      "Program events mein interest register karta hai, aur ek single loop ready events ko watch karke unke callbacks pe dispatch karta hai",
      "Har function ko ek alag process mein chalao aur inter-process messages se coordinate karo",
      "CPU-heavy kaam ko chhote tukdon mein tod ke round-robin schedule karo",
    ],
    correctIndex: 1,
    explanation:
      "Reactor pattern = 'register interest in events + ek loop + dispatch to handlers'. Node ka libuv isi ka implementation hai. Option A thread-per-request model hai — reactor iska ulta hai. Option C multi-process model hai, alag cheez. Option D cooperative scheduling ka description hai, reactor pattern nahi.",
    difficulty: "easy",
  },
  {
    id: "event-driven-architecture-2",
    question:
      "Thread-per-request model 10,000 mostly-idle concurrent connections par kyun struggle karta hai, jahan event-driven model theek chalta hai?",
    options: [
      "Threads sirf ek CPU core use kar sakte hain, isliye 10,000 threads ek core par bhaari padte hain",
      "Har thread ~1 MB stack + kernel scheduling overhead leta hai; 10,000 mostly-waiting threads = gigabytes memory aur bahut context-switching, jabki event-driven mein idle connection sirf socket state jitni memory leta hai",
      "Thread-per-request model non-blocking I/O support nahi karta, isliye har request fail ho jaati hai",
      "Event-driven model internally 10,000 threads banata hai lekin unhe hide karta hai, isliye tez lagta hai",
    ],
    correctIndex: 1,
    explanation:
      "C10k problem: idle connections ke liye dedicated threads memory (stacks) aur CPU (context switches) waste karte hain. Event loop ek thread par hazaaron idle sockets watch karta hai chhoti memory mein. Option A galat — OS threads multiple cores use kar sakte hain; problem memory/scheduling hai, core count nahi. Option C galat — thread-per-request blocking I/O ke saath kaam karta hai, bas scale nahi karta. Option D galat — event-driven Node ka JS ek hi thread par chalta hai, chhupe hue 10,000 threads nahi hote.",
    difficulty: "medium",
  },
  {
    id: "event-driven-architecture-3",
    question:
      "`emitter.emit('data', payload)` call karne par kya hota hai?",
    options: [
      "Payload ek queue mein daala jata hai aur listeners agle event loop tick par chalte hain",
      "Us naam ke saare registered listeners usi line par, registration order mein, synchronously call ho jaate hain — emit ke return hone se pehle",
      "Sirf sabse pehle registered listener chalta hai; baaki tab tak wait karte hain jab tak wo return na kare",
      "Listeners ek alag thread pool par parallel chalte hain",
    ],
    correctIndex: 1,
    explanation:
      "`emit` synchronous hai: wo saare matching listeners ko registration order mein turant call karta hai aur tabhi return hota hai. Isliye ek slow ya throwing listener emit karne wale ko block/throw karwa deta hai. Option A galat — koi queue/next-tick nahi (async chahiye to listener ke andar setImmediate lagao). Option C galat — sabhi listeners chalte hain, sirf pehla nahi. Option D galat — sab main thread par.",
    difficulty: "medium",
  },
  {
    id: "event-driven-architecture-4",
    question:
      "Ek Express route handler ke andar ek 400ms ka synchronous JSON transform hai. Event-driven model mein iska kya asar hai?",
    options: [
      "Kuch nahi — event loop dusre requests ko parallel handle karta rahega",
      "Un 400ms ke dauran event loop block rehta hai: koi doosra request, timer, ya I/O callback nahi chalta, saari concurrency ruk jaati hai",
      "Node automatically us transform ko thread pool par bhej deta hai",
      "Sirf usi ek client ki request slow hoti hai, baaki clients unaffected",
    ],
    correctIndex: 1,
    explanation:
      "Node ka JavaScript ek hi thread par chalta hai. Ek synchronous CPU-heavy block us pure dauran event loop ko rok deta hai — har waiting request/timer/callback delayed. Event-driven concurrency I/O-wait ke dauran overlap deti hai, CPU work parallel nahi karti. Option A/D galat isi wajah se. Option C galat — Node sirf specific operations (fs, dns, crypto KDF, zlib) ko thread pool par bhejta hai, tumhara arbitrary JS sync code nahi; uske liye worker threads chahiye.",
    difficulty: "hard",
  },
];

export default quiz;
