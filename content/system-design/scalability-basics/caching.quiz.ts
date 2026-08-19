import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cache-1",
    question: "Write-back (write-behind) caching strategy ka sabse bada risk kya hai?",
    options: [
      "Har write bahut slow ho jaata hai",
      "Cache crash ho jaaye database flush hone se pehle, to woh unflushed data permanently lose ho sakta hai",
      "Yeh strategy sirf read-heavy workloads ke liye kaam karti hai",
      "Write-back mein cache use hi nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Write-back mein data pehle sirf cache mein likha jaata hai aur database mein async flush hota hai — is beech agar cache crash ho jaaye, unflushed data permanently lose ho sakta hai. Writes actually fast hote hain isme, slow nahi (A galat). Yeh specifically high write-throughput workloads ke liye hai (C galat premise). Cache hi core hai is strategy ka (D galat).",
    difficulty: "medium",
  },
  {
    id: "cache-2",
    question: "Cache hit ratio ek system mein 45% hai aur high-traffic read-heavy workload hai. Isse kya indicate hota hai?",
    options: [
      "System perfectly optimized hai, aur kuch karne ki zaroorat nahi",
      "Zyadatar requests phir bhi origin/database tak ja rahe hain — cache ka operational overhead fayde se zyada ho sakta hai, TTL/cache size/access pattern investigate karna chahiye",
      "45% hit ratio ka matlab hai cache bilkul kaam nahi kar raha, use hata dena chahiye",
      "Hit ratio ka database load se koi seedha relation nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Read-heavy system mein 45% hit ratio low hai (target usually 90%+) — matlab caching ka fayda kam mil raha hai aur root cause investigate karna chahiye (chhota TTL, chhota cache size, ya genuinely low-repeat access pattern). Yeh 'optimized' nahi hai (A galat). Turant hata dena premature hai bina cause diagnose kiye (C galat). Hit ratio directly database load determine karta hai — jitna kam hit, utna zyada origin load (D galat).",
    difficulty: "medium",
  },
  {
    id: "cache-3",
    question: "Kaunsa scenario caching ke liye sabse WORST fit hai?",
    options: [
      "Product category listing page jo din mein ek baar update hoti hai",
      "Live stock price data jo har second change hoti hai aur strict real-time accuracy chahiye",
      "User profile data jo rarely update hoti hai",
      "Static images aur CSS/JS files",
    ],
    correctIndex: 1,
    explanation:
      "Highly volatile data jisme strict consistency bhi chahiye (live stock price) caching ke liye worst fit hai — cache turant stale ho jaayega aur invalidation overhead khud bottleneck ban sakta hai. Baaki teeno (rarely-updated listing, user profile, static assets) classic strong caching candidates hain kyunki repeat access hai aur staleness tolerate ho sakti hai.",
    difficulty: "easy",
  },
  {
    id: "cache-4",
    question: "Ek e-commerce checkout flow mein product price/stock ke liye kaunsi approach best hai, given ki overselling ek serious business problem hai?",
    options: [
      "Checkout ke time bhi cache se hi price/stock serve karo, latency sabse important hai",
      "Browse/listing pages ke liye caching use karo (staleness tolerable), lekin checkout ke final confirm step par seedha database se authoritative read lo",
      "Poore site se caching hi hata do taaki koi bhi stale data na ho",
      "Write-back strategy use karo taaki writes fast ho",
    ],
    correctIndex: 1,
    explanation:
      "Layered approach sahi hai — read-heavy, staleness-tolerant browse pages caching se fayda uthate hain, lekin checkout jaisa strict-consistency-critical final step seedha database se authoritative check karta hai taaki overselling na ho. Sirf cache pe checkout karna (A) risky hai. Poori caching hata dena (C) latency/load ko bina wajah worsen karta hai. Write-back (D) yahan aur risky hai kyunki crash pe stock data loss ho sakta hai.",
    difficulty: "hard",
  },
];

export default quiz;
