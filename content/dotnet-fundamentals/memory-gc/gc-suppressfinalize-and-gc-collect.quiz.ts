import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "suppressfinalize-collect-1",
    question: "`GC.SuppressFinalize(this)` na call karne par ek finalizable object ko fully reclaim hone me kitne GC cycles lagte hain?",
    options: [
      "1 cycle, hamesha",
      "Kam se kam 2 cycles — ek finalizer run karne ke liye, ek memory actually free karne ke liye",
      "0 cycles, object turant reclaim hota hai",
      "Ye depend karta hai object ki size pe, cycles ka koi fixed number nahi"
    ],
    correctIndex: 1,
    explanation:
      "Finalizable object jab unreachable banta hai, GC use turant reclaim nahi karta — pehle finalizer thread ke liye queue karta hai, jahan finalizer run hota hai (cycle 1 ke baad), aur tabhi memory actually free hoti hai (agla cycle). `GC.SuppressFinalize()` is object ko finalization queue se hata kar normal single-cycle reclaim enable karta hai.",
    difficulty: "medium",
  },
  {
    id: "suppressfinalize-collect-2",
    question: "Ek developer sochta hai application ka memory usage high hai, isliye har request ke end me `GC.Collect()` call karta hai 'memory clean rakhne' ke liye. Iska likely result kya hoga?",
    options: [
      "Memory usage kam ho jaayega aur performance improve hogi",
      "Performance generally worse ho jaayegi — GC ke tuned heuristics bypass honge, premature promotion ho sakta hai",
      "Koi fark nahi padega, GC.Collect() sirf ek no-op hint hai",
      "Application crash ho jaayega"
    ],
    correctIndex: 1,
    explanation:
      "GC apne internal heuristics se decide karta hai kab collect karna optimal hai. Manual `GC.Collect()` calls is tuning ko fight karte hain — genuinely short-lived Gen 0 objects bhi force-scan hote hain, aur repeated forced collections objects ko premature promote kar sakte hain higher generations me, jisse Gen 2 (expensive) collection frequency badh jaati hai. Overall result almost hamesha worse performance hota hai, better nahi.",
    difficulty: "medium",
  },
  {
    id: "suppressfinalize-collect-3",
    question: "`GC.SuppressFinalize()` ko ek class pe call karna jisme koi finalizer defined hi nahi hai, iska kya effect hoga?",
    options: [
      "Exception throw hoga",
      "Effectively no-op hai — koi benefit nahi milega kyunki object kabhi finalization queue me tha hi nahi",
      "Object turant collect ho jaayega",
      "GC.Collect() automatically bhi trigger ho jaayega"
    ],
    correctIndex: 1,
    explanation:
      "Agar class me finalizer nahi hai, instance kabhi finalization queue me register hua hi nahi tha (queue registration sirf finalizer-having types ke liye hota hai). Isliye `SuppressFinalize()` call karna kuch nahi 'hataata,' effectively no-op hai — na exception, na koi extra benefit ya harm.",
    difficulty: "hard",
  },
  {
    id: "suppressfinalize-collect-4",
    question: "Kaunsa scenario `GC.Collect()` ka ek genuinely valid, narrow use-case hai?",
    options: [
      "Har HTTP request handle hone ke baad, memory fresh rakhne ke liye",
      "Ek known, large, one-time memory-intensive operation (jaise startup pe bade dataset load) ke turant baad, measured benefit ke saath",
      "Jab bhi memory usage dashboard me 'high' dikhe",
      "Har database query ke baad"
    ],
    correctIndex: 1,
    explanation:
      "Valid use-cases genuinely narrow hain: ek known large one-time operation ke baad jahan measured evidence ho ki immediate reclaim fayda karega, GC-behavior tests, ya profiling baselines. Routine per-request ya per-query calls (Options A, C, D) classic anti-patterns hain jo performance ko hurt karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
