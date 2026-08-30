import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "choosing-sync-vs-async-in-production-1",
    question:
      "App startup pe (server ne abhi `listen` nahi kiya) `config.json` load karne ke liye kaunsa best hai?",
    options: [
      "`fs.createReadStream` + streaming JSON parser, kyunki streams hamesha better hain",
      "`fs.readFileSync` — cold path hai, koi concurrent request nahi, code simple aur fail-fast rehta hai",
      "`fs.promises.readFile` + `await`, kyunki sync production mein kabhi allowed nahi",
      "Config ko har request pe dobara padho taaki latest mile",
    ],
    correctIndex: 1,
    explanation:
      "Startup ek cold path hai — koi request queue nahi ho rahi, toh blocking se kisi ki latency nahi badhti. `readFileSync` simplest hai aur agar file missing/corrupt ho toh thrown error process ko turant gira deta hai (fail-fast), jo desired hai. Option A over-engineering (chhoti bounded file). Option C ka premise galat — startup pe sync fine hai. Option D bekaar aur hot-path pe sync bug.",
    difficulty: "easy",
  },
  {
    id: "choosing-sync-vs-async-in-production-2",
    question:
      "Ek HTTP handler ek 400 MB CSV file client ko download response mein bhejta hai. Sahi choice aur uski wajah?",
    options: [
      "`fs.readFileSync` — seedha aur reliable",
      "`fs.promises.readFile` phir `res.end(buffer)` — async hai toh safe hai",
      "`fs.createReadStream(path)` ko `pipeline`/`pipe` se `res` mein — constant ~64 KB memory chahe file kitni bhi badi ho, backpressure automatic, event loop free",
      "File ko pehle memory mein load karke `JSON.parse` karo, phir bhejo",
    ],
    correctIndex: 2,
    explanation:
      "Bada data + response mein bhejna = streaming ka textbook case. `readFileSync` blocking + 400 MB spike. `fs.promises.readFile` event loop toh bachata hai par memory = 400 MB per request; kuch concurrent requests = OOM. Stream constant memory deta hai aur slow client par read khud slow ho jata hai (backpressure). Option D — CSV ko JSON.parse karna galat aur pointless.",
    difficulty: "medium",
  },
  {
    id: "choosing-sync-vs-async-in-production-3",
    question:
      "\"`fs.promises.readFile` async hai isliye badi files bhi safe hain\" — ye claim kahan tootta hai?",
    options: [
      "Kahin nahi, ye bilkul sahi hai",
      "Memory par — async version bhi poori file ek Buffer mein memory mein leta hai (file size jitni RAM); unbounded/bade input par OOM. Async sirf event loop bachata hai, memory nahi",
      "Sirf tab jab file compressed ho",
      "Sirf Windows par, Linux par safe hai",
    ],
    correctIndex: 1,
    explanation:
      "`await fs.promises.readFile` ke baad tumhare paas poori file ek Buffer/string mein hoti hai — 800 MB file = 800 MB RAM, aur Node ka single Buffer max ~2 GB hai. Async ka fayda sirf itna ki read libuv pool pe hota hai toh event loop free rehta hai. Memory footprint bound karne ke liye `createReadStream` chahiye. OS se koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "choosing-sync-vs-async-in-production-4",
    question:
      "`require()` ke synchronous hone ke baare mein sabse sahi statement kaunsa hai?",
    options: [
      "Ye ek design bug hai jise Node theek nahi kar paya",
      "Ye by design sync hai (predictable module load order); startup pe chalta hai toh theek hai — bas use request handler ke andar bade modules ke liye conditionally mat likho",
      "`require` actually async hai, log galat samajhte hain",
      "`require` ko hamesha `await import()` se replace kar dena chahiye har jagah",
    ],
    correctIndex: 1,
    explanation:
      "`require` deliberately synchronous hai taaki module graph ka evaluation order deterministic rahe; ye load/startup time pe chalta hai (cold path) toh blocking acceptable hai, aur load hone ke baad module cache ho jata hai. Problem sirf tab jab tum ek bade module ko request handler ke andar pehli baar `require` karo — wo request sync load ka cost uthati hai. Isliye modules file ke top pe rakho.",
    difficulty: "easy",
  },
];

export default quiz;
