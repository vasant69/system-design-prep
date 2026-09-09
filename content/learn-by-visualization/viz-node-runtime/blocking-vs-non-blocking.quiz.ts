import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "blocking-vs-non-blocking-1",
    question: "`fs.readFileSync()` ek HTTP handler mein call karne ka asar kya hai jab file read 40ms leta hai?",
    options: [
      "Sirf wahi ek request 40ms slow hoti hai, baaki normal",
      "Poore 40ms ke liye main thread frozen — koi doosri request, timer, ya callback nahi chal sakta",
      "Node use automatically background thread pe daal deta hai",
      "Request fail ho jaati hai kyunki sync calls handlers mein allowed nahi",
    ],
    correctIndex: 1,
    explanation:
      "`readFileSync` blocking hai — wo disk read ke poore 40ms main thread pe hi wait karta hai. Node single-threaded JS execution ke saath, us window mein event loop ek tick aage nahi badh sakta: pending requests, `setTimeout` callbacks, promise continuations, health checks — sab 40ms ke liye ruk jaate hain. Isliye hot path pe hamesha `fs.readFile` ya `fs.promises.readFile` (non-blocking) use hota hai.",
    difficulty: "medium",
  },
  {
    id: "blocking-vs-non-blocking-2",
    question: "Non-blocking `fs.readFile(path, cb)` internally kaise kaam karta hai?",
    options: [
      "Wo file ko chhote pieces mein sync padhta hai, beech-beech mein yield karta hai",
      "Read ko libuv ke thread pool (ya OS async) ko offload karta hai, turant return hota hai, aur ready hone par cb ko event loop mein queue karta hai",
      "Ek naya OS process fork karta hai file ke liye",
      "Wo actually blocking hi hai, sirf syntax alag dikhta hai",
    ],
    correctIndex: 1,
    explanation:
      "`fs.readFile` call karte hi Node bindings ke through kaam libuv ko de deta hai — file I/O libuv ke thread pool (default 4) pe hota hai. Call turant return kar jaati hai, main thread aage badh jaata hai. Jab background thread read complete karta hai, tumhara callback event loop ki queue mein daal diya jaata hai aur loop use agle available tick pe run karta hai.",
    difficulty: "medium",
  },
  {
    id: "blocking-vs-non-blocking-3",
    question: "`*Sync` (blocking) APIs use karna kab acceptable hai?",
    options: [
      "Kabhi nahi — wo hamesha bug hain",
      "Startup/initialisation ke time (server traffic accept karne se pehle config load), CLI/build scripts, ya jab genuinely koi concurrency nahi hai",
      "Sirf production mein, development mein nahi",
      "Jab bhi code chhota aur padhne mein simple lage",
    ],
    correctIndex: 1,
    explanation:
      "Blocking calls tab theek hain jab 'sabko rokna' ka koi nuksan nahi — jaise `app.listen()` se pehle ek baar `readFileSync('config.json')`, ek CLI tool jo ek kaam karke exit ho jaata hai, ya build script. Problem tab hai jab server live hai aur concurrent requests serve kar raha hai: waha ek sync call poore process ko stall karta hai.",
    difficulty: "easy",
  },
  {
    id: "blocking-vs-non-blocking-4",
    question: "In mein se kaunsa NON-I/O kaam bhi effectively 'blocking' behave karta hai?",
    options: [
      "`setTimeout(fn, 0)`",
      "Ek bade object pe `JSON.parse` / `JSON.stringify`, ya ek lamba synchronous `for` loop",
      "`fs.promises.readFile`",
      "`await fetch(url)`",
    ],
    correctIndex: 1,
    explanation:
      "Blocking sirf `*Sync` file calls tak seemit nahi. Koi bhi synchronous CPU-heavy kaam — bade payload pe `JSON.parse`/`stringify`, regex on huge strings, `crypto.pbkdf2Sync`, ya ek million-iteration loop — main thread pe hi chalta hai aur jab tak khatam na ho, event loop stuck rehta hai. `setTimeout` aur `fs.promises.readFile` non-blocking hain; `await fetch` bhi async I/O hai.",
    difficulty: "medium",
  },
];

export default quiz;
