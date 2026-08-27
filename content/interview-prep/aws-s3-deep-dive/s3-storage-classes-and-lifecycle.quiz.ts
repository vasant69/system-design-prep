import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-storage-1",
    question: "S3 ke sabhi storage classes (Standard se Glacier Deep Archive tak) me kya cheez common/same rehti hai",
    options: [
      "Availability percentage",
      "Retrieval latency",
      "Durability - 11 nines (99.999999999%)",
      "Per-GB storage price",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab durability hai — sabhi S3 storage classes 11-nines durability dete hain, farak sirf availability, latency, aur price me hota hai. Availability (option 1) actually vary karti hai (99.99% vs 99.9%), retrieval latency (option 2) bahut alag hoti hai (ms se 48 hours), aur price (option 4) bhi class ke hisaab se badalti hai.",
    difficulty: "easy",
  },
  {
    id: "s3-storage-2",
    question: "One Zone-IA storage class ka sabse bada risk kya hai",
    options: [
      "Retrieval fee Standard-IA se zyada hota hai",
      "Data sirf ek Availability Zone me store hota hai, us AZ ke fail hone pe data loss ho sakta hai",
      "Minimum storage duration 90 din hai",
      "Ye sirf archive data ke liye available hai, active data ke liye nahi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — One Zone-IA multi-AZ redundancy nahi deta, sirf ek AZ me store hota hai, isliye us AZ ke fail hone pe data permanently lost ho sakta hai. Option 1 galat hai, retrieval fee Standard-IA jaisa hi hota hai. Option 3 galat number hai (30 din, Standard-IA jaisa). Option 4 galat hai, One Zone-IA infrequent access data ke liye hai, archive-only nahi.",
    difficulty: "medium",
  },
  {
    id: "s3-storage-3",
    question: "Ek team apne compliance logs (kabhi access nahi hote, sirf 7 saal legally rakhne hain) ke liye kaunsi storage class sabse appropriate hai",
    options: [
      "S3 Standard",
      "S3 Intelligent-Tiering",
      "Glacier Deep Archive",
      "Glacier Instant Retrieval",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab Glacier Deep Archive hai — sabse sasta storage class, 12-48 hour retrieval acceptable hai kyunki data legally rakha ja raha hai but kabhi actively access nahi hota. Standard (option 1) bahut costly hoga unused data ke liye. Intelligent-Tiering (option 2) unpredictable access patterns ke liye best hai, yaha access pattern predictable hai (almost zero). Glacier Instant Retrieval (option 4) unnecessarily costly hai jab instant access ki zaroorat hi nahi.",
    difficulty: "medium",
  },
  {
    id: "s3-storage-4",
    question: "Chhote objects (jaise 10 KB files) ko lifecycle rule se Standard-IA ya Glacier me transition karna kis wajah se cost-negative ho sakta hai",
    options: [
      "Chhote objects transition hi nahi ho sakte",
      "Minimum storage duration aur per-object overhead charge storage saving se zyada pad sakta hai",
      "Chhote objects ki durability kam ho jaati hai",
      "S3 chhote objects ko automatically delete kar deta hai IA me",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — IA/Glacier classes me minimum storage duration (jaise 30 din) aur per-object billing overhead lagta hai jo chhote objects ke actual storage-cost-saving se zyada ho sakta hai, isliye net cost badh jaata hai. Option 1 galat hai, chhote objects transition ho sakte hain. Option 3 galat hai, durability same rehti hai. Option 4 galat hai, aisa automatic delete exist nahi karta.",
    difficulty: "hard",
  },
];

export default quiz;
