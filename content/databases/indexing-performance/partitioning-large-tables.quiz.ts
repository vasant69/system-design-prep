import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "partition-1",
    question: "Partitioning aur sharding mein fundamental difference kya hai?",
    options: [
      "Dono same cheez hain, alag naam se",
      "Partitioning ek hi server ke andar table split karta hai; sharding data ko multiple alag database servers mein split karta hai",
      "Partitioning sirf date columns pe kaam karta hai, sharding kisi bhi column pe",
      "Sharding sirf NoSQL databases mein hota hai, partitioning sirf SQL mein",
    ],
    correctIndex: 1,
    explanation:
      "Partitioning ek single database server ke andar ek logical table ko physical pieces mein todta hai. Sharding fundamentally bigger scaling problem hai — data ko multiple alag machines/servers mein distribute karna. Option A galat hai, yeh alag-alag scaling levers hain. Option C galat hai — dono range, list, ya hash key pe ho sakte hain. Option D bhi galat hai — sharding relational databases mein bhi common hai.",
    difficulty: "easy",
  },
  {
    id: "partition-2",
    question: "Transaction table ko date (month-wise) se range-partition karne ka sabse bada reason kya hai BFSI context mein?",
    options: [
      "Date columns naturally sabse chhote data type hote hain",
      "BFSI queries almost hamesha date-range-scoped hoti hain (statements, quarterly reports), isliye partition pruning irrelevant partitions ko skip kar sakta hai",
      "Date partitioning storage cost ko zero kar deta hai",
      "SQL databases sirf date columns pe partitioning support karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Financial transaction queries ka dominant access pattern date-range based hota hai — 'is mahine ka statement,' 'pichle quarter ke transactions.' Isse optimizer sirf relevant partitions touch karta hai (partition pruning), baaki sabko skip karke. Option A irrelevant hai. Option C galat hai, storage cost zero nahi hoti. Option D factually galat hai — range, list, hash sab tarah ke columns pe partitioning ho sakti hai.",
    difficulty: "medium",
  },
  {
    id: "partition-3",
    question: "5 saal purana transaction data delete karna hai regulatory retention rules ke hisaab se. Ek partitioned table mein iska sabse efficient tareeka kya hai?",
    options: [
      "DELETE FROM transaction WHERE transaction_date < '2021-01-01' chalana",
      "Purani date partitions ko DROP karna (near-instant metadata operation)",
      "Poori table ko drop karke naya banana",
      "Har row ko manually ek-ek karke check karke delete karna",
    ],
    correctIndex: 1,
    explanation:
      "Agar table date-partitioned hai, to purani partitions ko DROP karna near-instant metadata operation hai — bulk row-by-row DELETE (option A) ke bajaye bahut faster aur kam locking cause karta hai. Poori table drop karna (C) sara current data bhi delete kar dega, jo galat hai. Manual row-by-row (D) sabse slow aur impractical approach hai.",
    difficulty: "medium",
  },
  {
    id: "partition-4",
    question: "Ek Transaction table date-partitioned hai, lekin ek query 'saare accounts ke across-all-time total balance' chalati hai bina date filter ke. Yeh query partition pruning ka benefit paayegi?",
    options: [
      "Haan, partitioning hamesha sabhi queries ko fast karta hai",
      "Nahi, kyunki query partition key (date) pe filter nahi kar rahi, isliye har partition touch karni padegi",
      "Haan, lekin sirf agar table chhoti ho",
      "Nahi, kyunki cross-partition queries SQL mein allowed hi nahi hain",
    ],
    correctIndex: 1,
    explanation:
      "Partition pruning sirf tab kaam karta hai jab query partition key pe filter kare. Is query mein date filter hi nahi hai, isliye optimizer ko har partition scan karni padegi — pruning ka benefit nahi milta. Option A galat hai, yeh universal benefit nahi hai. Option C table size se unrelated hai. Option D factually galat hai — cross-partition queries valid SQL hain, bas slow ho sakti hain.",
    difficulty: "hard",
  },
];

export default quiz;
