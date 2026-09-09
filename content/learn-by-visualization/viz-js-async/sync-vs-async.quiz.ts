import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sync-vs-async-1",
    question:
      "`console.log('A'); setTimeout(() => console.log('B'), 0); console.log('C');` — output kya hoga?",
    options: ["A B C", "A C B", "B A C", "C B A"],
    correctIndex: 1,
    explanation:
      "`setTimeout` sync nahi hai — callback runtime ko diya jaata hai aur 0ms ke baad bhi wo callback queue mein jaata hai, tab chalta hai jab call stack khaali ho. Isliye sync `console.log('A')` aur `console.log('C')` pehle chalte hain, phir `B`. `A B C` galat kyunki `setTimeout` current script ko block nahi karta.",
    difficulty: "easy",
  },
  {
    id: "sync-vs-async-2",
    question:
      "JavaScript 'single-threaded' hai — iska sabse sahi matlab kya hai?",
    options: [
      "JS ek time pe sirf ek network request kar sakta hai",
      "Aapke JS code ka execution ek hi call stack pe hota hai; I/O jaise kaam runtime ya OS off-thread karta hai",
      "Async code ke liye JS naye threads spawn karta hai",
      "Web Workers ke bina JS kaam hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Single-threaded ka matlab: aapka JS ek hi call stack pe, ek time pe ek frame. Lekin timers, network aur file I/O runtime (browser ya Node) alag se handle karta hai, isliye 100 `fetch` ek dusre ko block nahi karte. Option A galat — parallel requests ban sakti hain. Option C galat — async ke liye naye JS threads nahi bante. Option D galat — Workers optional hain.",
    difficulty: "medium",
  },
  {
    id: "sync-vs-async-3",
    question:
      "Ek 3-second `while` loop jo `Date.now()` check karta hai, wo kya block karega?",
    options: [
      "Kuch nahi, async loop hai",
      "Sirf usi function ko, baaki UI chalti rahegi",
      "Poora main thread — clicks, rendering, timers sab 3s ke liye ruk jaayenge",
      "Sirf pending promises, timers chalte rahenge",
    ],
    correctIndex: 2,
    explanation:
      "Synchronous `while` loop call stack pe baitha rehta hai; jab tak wo return nahi karta, event loop ko chance hi nahi milta koi aur macrotask ya microtask chalane ka. Isliye 3s tak clicks, paint, `setTimeout` callbacks — sab ruk jaate hain (UI jam ho jaati hai). Option D galat — microtasks aur timers dono stack khaali hone ka wait karte hain.",
    difficulty: "medium",
  },
  {
    id: "sync-vs-async-4",
    question:
      "In mein se kaunsa kaam genuinely asynchronous API se karna chahiye?",
    options: [
      "Do numbers add karna",
      "Array ko `.map` se transform karna",
      "Server se user data `fetch` karna",
      "String ko uppercase karna",
    ],
    correctIndex: 2,
    explanation:
      "Async tab chahiye jab kaam JS khud nahi karta — network, disk, timer — aur uska result baad mein aata hai. `fetch` network pe jaata hai, isliye wo promise-based async API hai. Baaki teeno pure CPU-bound sync kaam hain jo turant complete hote hain; unhe async banane ka koi fayda nahi.",
    difficulty: "easy",
  },
];

export default quiz;
