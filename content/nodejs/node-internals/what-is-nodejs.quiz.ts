import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "what-is-nodejs-1",
    question: "Node.js ko sabse sahi tarah kaise describe karoge?",
    options: [
      "Ek programming language jo JavaScript ka server-side version hai",
      "Ek backend framework jaisa Express, jo routing aur middleware deta hai",
      "Ek JavaScript runtime — V8 engine plus libuv plus ek core library — jo JS ko browser ke bahar chalata hai",
      "Ek browser jo bina UI ke JavaScript chalata hai",
    ],
    correctIndex: 2,
    explanation:
      "Node ek runtime hai: V8 (engine) + libuv (event loop/async I/O) + C++ bindings + JS core library, ek executable me packaged. Option A galat — language JavaScript hai, Node nahi. Option B galat — Express ek framework hai jo Node ke upar chalta hai; Node khud routing/middleware nahi deta. Option D galat — Node me koi browser engine, DOM, ya rendering nahi hai.",
    difficulty: "easy",
  },
  {
    id: "what-is-nodejs-2",
    question:
      "Ryan Dahl ne 2009 me Node banane ki main motivation kya thi?",
    options: [
      "JavaScript ko type-safe banana",
      "Traditional thread-per-request servers me blocking I/O ki memory cost — har blocked thread RAM leta hai bina kaam kiye (C10k problem)",
      "Browser me JavaScript ko tez chalana",
      "Ek naya package manager (npm) banana",
    ],
    correctIndex: 1,
    explanation:
      "Apache jaise servers har connection ke liye thread/process spawn karte the; I/O wait par thread block hota, memory occupy karta, kuch productive nahi karta — 10k connections par RAM khatam. Node ka non-blocking event-driven model isi ko solve karta hai. Option A galat — Node type-safety add nahi karta. Option C galat — wo V8 team ka kaam tha, alag. Option D galat — npm baad me aaya, motivation nahi tha.",
    difficulty: "medium",
  },
  {
    id: "what-is-nodejs-3",
    question:
      "\"Node single-threaded hai\" — is statement ka sabse accurate matlab kya hai?",
    options: [
      "Node ka poora process bilkul ek hi OS thread use karta hai, kahin koi parallelism nahi",
      "Tumhara JavaScript ek waqt me ek statement execute karta hai (ek event loop), lekin libuv ke paas thread pool hai aur OS networking apne threads use karta hai",
      "Node ek baar me sirf ek HTTP request handle kar sakta hai",
      "Node me Worker threads ka koi support nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Single-threaded ka matlab: JS execution serialized hai — ek time par ek cheez. Under the hood libuv ka thread pool (default 4) file I/O aur crypto parallel karta hai, aur kernel networking alag. Option A galat — thread pool aur worker threads exist karte hain. Option C galat — event loop hazaaron concurrent connections interleave karta hai. Option D galat — `worker_threads` module hai.",
    difficulty: "medium",
  },
  {
    id: "what-is-nodejs-4",
    question:
      "In workloads me se kaunsa Node.js ke liye SABSE KHARAB fit hai?",
    options: [
      "Ek REST API jo har request par 5 microservices se data aggregate karti hai",
      "Ek real-time chat server jo WebSocket connections manage karta hai",
      "Ek service jo har request par ek 4K video file ko re-encode karti hai on the main thread",
      "Ek CLI tool jo project ke files scan karke lint errors report karta hai",
    ],
    correctIndex: 2,
    explanation:
      "Video re-encoding CPU-bound hai — wo single event loop ko seconds tak block karega, is dauraan koi doosri request handle nahi hogi. Option A aur B pure I/O-bound hain — Node ka sweet spot. Option D fast startup aur file access chahta hai — Node CLI tooling ke liye ideal. CPU-heavy kaam ko worker threads ya alag service me daalna chahiye.",
    difficulty: "easy",
  },
];

export default quiz;
