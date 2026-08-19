import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cei-1",
    question: "Cache eviction aur cache invalidation mein fundamental difference kya hai?",
    options: [
      "Dono ek hi cheez hain, sirf naam alag hai",
      "Eviction ek capacity problem hai (cache full, policy ke basis pe entry hataana); invalidation ek correctness problem hai (underlying data change hone par stale entry hataana)",
      "Eviction sirf LFU mein hota hai, invalidation sirf LRU mein",
      "Invalidation sirf tab hota hai jab cache khaali ho",
    ],
    correctIndex: 1,
    explanation:
      "Eviction capacity management hai — cache full hone par policy (LRU/LFU) ke basis pe entry nikaalna, data correctness se unrelated. Invalidation correctness ka sawaal hai — underlying data badalne par stale cache entry ko remove/update karna. Dono independent axes hain (A galat). Yeh policy-specific split nahi hai (C galat). Invalidation cache khaali ya full dono states mein zaroori ho sakta hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "cei-2",
    question: "LRU cache ko O(1) get aur put ke saath implement karne ka standard approach kya hai?",
    options: [
      "Sirf ek array jisme linear search karke least-recently-used dhoondte hain",
      "Ek doubly linked list (recency order maintain karne ke liye) plus ek hashmap (key se node tak O(1) lookup ke liye)",
      "Ek sorted binary search tree access-time ke basis pe",
      "Ek simple queue jisme FIFO order follow hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Doubly linked list plus hashmap combination hi LRU ko O(1) get/put deta hai — hashmap se node ka direct reference milta hai, aur doubly linked list se us node ko O(1) mein remove/move-to-head kiya ja sakta hai. Array linear search (A) O(n) hai. BST (C) O(log n) hota, aur zyada complex hai bina extra benefit ke. Plain FIFO queue (D) recency track nahi karti, sirf insertion order — yeh LRU nahi, kuch aur policy hogi.",
    difficulty: "medium",
  },
  {
    id: "cei-3",
    question: "LFU eviction policy mein 'stuck favoring old popular items' problem kyun hoti hai, aur fix kya hai?",
    options: [
      "LFU mein koi aisi problem hoti hi nahi",
      "Ek item jo pehle bahut access hua tha uska accumulated count high reh jaata hai chahe ab access na ho raha ho, isliye naye trending items evict ho jaate hain — fix hai periodic aging/decay of counts",
      "Fix hai LFU ko poori tarah LRU se replace kar dena",
      "Yeh problem sirf tab hoti hai jab cache size bahut chhota ho",
    ],
    correctIndex: 1,
    explanation:
      "LFU access count accumulate karta hai — purane popular items ka high count unhe artificially cache mein banaye rakhta hai chahe ab woh access na ho rahe hon, jabki naye trending items low count ki wajah se evict ho jaate hain. Fix hai counts ko periodically decay/age karna. Problem genuinely exist karti hai (A galat). Poori tarah LRU se replace karna (C) ek option hai lekin 'fix' nahi, use-case-dependent choice hai. Problem cache size se independent hai, yeh fundamentally counting mechanism ka issue hai (D galat).",
    difficulty: "hard",
  },
  {
    id: "cei-4",
    question: "Ek bahut popular cache key expire hoti hai aur usi second mein 5000 concurrent requests aati hain. Thundering herd se bachne ka sabse direct mitigation kya hai?",
    options: [
      "Cache ko poori tarah remove kar dena",
      "Request coalescing/single-flight — sirf ek request ko database tak jaane do, baaki sab usi in-flight result ka wait karke share karein",
      "TTL ko infinite kar dena taaki kabhi expire hi na ho",
      "Sab requests ko reject kar dena jab tak cache warm na ho",
    ],
    correctIndex: 1,
    explanation:
      "Request coalescing exactly is problem ke liye designed hai — N concurrent misses ko ek hi origin call mein collapse kar deta hai, baaki requests wahi result share karte hain. Cache hatana (A) origin load hi permanently badha dega. Infinite TTL (C) staleness ka bada problem create karega. Sab requests reject karna (D) ek bad user experience hai aur asli problem solve nahi karta.",
    difficulty: "medium",
  },
];

export default quiz;
