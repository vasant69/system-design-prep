import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "process-thread-pool-1",
    question: "Ek process crash ho jaata hai. Iska doosre, alag process par kya effect hota hai?",
    options: [
      "Doosra process bhi automatically crash ho jaata hai, kyunki memory shared hoti hai",
      "Doosra process usually unaffected rehta hai, kyunki processes ka memory space isolated hota hai",
      "Poora operating system crash ho jaata hai",
      "Doosre process ke saare threads pause ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Processes OS-level isolation ke saath chalte hain — har process ka apna khud ka virtual memory address space hota hai. Ek process crash hone par doosra process usually unaffected rehta hai (jab tak wo directly IPC ke through depend na kare). Option A galat hai kyunki memory processes ke beech share nahi hoti (threads ke beech hoti hai, processes ke beech nahi). Options C aur D bahut extreme aur galat claims hain.",
    difficulty: "easy",
  },
  {
    id: "process-thread-pool-2",
    question: "Same process ke andar chal rahe do threads ke baare me kaunsa statement sahi hai?",
    options: [
      "Har thread ka apna alag, isolated heap memory hota hai",
      "Threads sirf CPU registers share karte hain, memory nahi",
      "Threads process ki heap memory share karte hain — same objects dono ko dikhte hain",
      "Threads sirf ek doosre se completely independent chalte hain, koi shared state nahi hota",
    ],
    correctIndex: 2,
    explanation:
      "Same process ke threads process ki heap memory (aur static variables) share karte hain — yahi wajah hai ki shared mutable state pe synchronization (lock, etc.) zaroori hoti hai. Har thread ka apna sirf call stack aur registers hote hain (isolated), lekin heap nahi. Options A, B, D sab is fundamental sharing behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "process-thread-pool-3",
    question: "`Task.Run(() => DoWork())` call karne par work kahan execute hota hai?",
    options: [
      "Ek naya dedicated OS thread create hota hai, jo kaam khatam hone par destroy ho jaata hai",
      "Main/calling thread par hi synchronously execute hota hai",
      "ThreadPool se ek reusable worker thread liya jaata hai, kaam ke baad wo thread pool me wapas chala jaata hai",
      "Ek naya process spawn hota hai",
    ],
    correctIndex: 2,
    explanation:
      "`Task.Run` internally ThreadPool use karta hai — ek existing pooled thread se kaam execute hota hai, aur khatam hone par wo thread destroy nahi hota, pool me wapas available ho jaata hai reuse ke liye. Option A galat hai — ye raw `new Thread()` ka behavior hai, `Task.Run` ka nahi. Option B galat hai — `Task.Run` asynchronously ek doosre thread par run karta hai. Option D bilkul galat hai, process spawn nahi hota.",
    difficulty: "medium",
  },
  {
    id: "process-thread-pool-4",
    question: "Ek high-throughput ASP.NET Core API me, har incoming request ke liye `new Thread()` se ek dedicated thread banaya jaata hai. Peak load par ye approach kyun problematic hai?",
    options: [
      "`Thread` class deprecated hai, use hi nahi ki ja sakti",
      "Har thread ka apna stack allocation (~1MB default) hota hai — hazaaron concurrent requests par memory aur context-switching overhead se system overwhelm ho sakta hai",
      "`new Thread()` sirf single-threaded apps me kaam karta hai",
      "HTTP requests ko threads par process nahi kiya ja sakta, sirf async/await se hi ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Har OS thread ka apna default ~1MB stack allocate hota hai, aur bahut saare dedicated threads banane se memory footprint aur OS-level context-switching cost tezi se badh jaati hai — yahi wajah hai ThreadPool (ya Task) ka reuse model production servers me preferred hai. Options A, C, D factually galat statements hain.",
    difficulty: "hard",
  },
];

export default quiz;
