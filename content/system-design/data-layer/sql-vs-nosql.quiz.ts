import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "svn-1",
    question:
      "Interview mein candidate bolta hai 'hum NoSQL use karenge kyunki woh web-scale hai'. Yeh jawab weak kyun mana jaata hai?",
    options: [
      "Kyunki NoSQL databases actually bahut slow hote hain",
      "Kyunki yeh koi technical reasoning nahi deta — data ke access pattern, relationships, aur consistency requirement se decision justify nahi karta",
      "Kyunki SQL databases kabhi bhi scale nahi kar sakte, isliye comparison hi galat hai",
      "Kyunki NoSQL sirf startups use karte hain, enterprise companies nahi",
    ],
    correctIndex: 1,
    explanation:
      "'Web-scale' ek buzzword hai, reasoning nahi — sahi jawab data ke shape, relationships, aur consistency requirement se database choice ko justify karta hai. NoSQL databases slow nahi hote (A galat) — sahi use case mein bahut fast hote hain. SQL databases bhi (read replicas, sharding ke saath) bade scale tak jaate hain (C galat). Bahut si large enterprises (Amazon, Netflix) NoSQL heavily use karti hain (D galat).",
    difficulty: "easy",
  },
  {
    id: "svn-2",
    question:
      "Ek e-commerce system mein order-placement flow hai jahan order create hona, payment deduct hona, aur inventory count kam hona — teeno atomically (sab ho ya koi na ho) hone chahiye. Is requirement ke liye kaunsa data store best fit hai aur kyun?",
    options: [
      "Key-value store, kyunki writes fast hote hain",
      "Graph database, kyunki order-payment-inventory ek relationship graph banate hain",
      "Relational (SQL) database, kyunki multi-row/multi-table ACID transactions is use case ke liye designed hain",
      "Wide-column store, kyunki high write throughput chahiye",
    ],
    correctIndex: 2,
    explanation:
      "Multi-table atomic updates (all-or-nothing) SQL databases ki core strength hai — ACID transactions exactly is problem ke liye design hui hain. Key-value stores (A) fast hain lekin multi-key atomicity guarantee nahi karte. Graph databases (B) relationship-heavy traversal queries ke liye hain, transactional atomicity ke liye nahi. Wide-column stores (D) high write throughput dete hain lekin cross-row transactions weak hote hain.",
    difficulty: "medium",
  },
  {
    id: "svn-3",
    question:
      "Swiggy jaisi app mein delivery-partner ka live GPS location har 3-4 seconds mein update hota hai, lakhs of active deliveries ke across. Yeh access pattern kis NoSQL category ke liye classic fit hai?",
    options: [
      "Document store, kyunki location data nested JSON hoti hai",
      "Graph database, kyunki delivery partners ek network banate hain",
      "Wide-column store, kyunki yeh massive, high-frequency write throughput ke liye optimized hota hai",
      "Yeh use case sirf relational database mein hi sahi se handle ho sakta hai",
    ],
    correctIndex: 2,
    explanation:
      "High-frequency, high-volume writes (jaise location pings ya time-series data) wide-column stores (jaise Cassandra) ka classic use case hai — unka LSM-tree based storage engine writes ke liye optimized hai. Location data zaroori nahi nested JSON ho (A weak fit). Yeh relationship-heavy query nahi hai (B galat premise). Relational database (D) is write volume par lock contention aur index overhead se struggle karega.",
    difficulty: "medium",
  },
  {
    id: "svn-4",
    question:
      "Ek team decide karti hai poore system ke liye — orders, payments, cart, aur catalog sab ke liye — sirf ek single NoSQL database use karenge, 'consistency ke liye poori simplicity chahiye' bolke. Is approach mein sabse bada risk kya hai?",
    options: [
      "NoSQL databases itni slow hoti hain ki poora system down ho jaayega",
      "Payment aur order jaise financially-critical data ko weak transaction guarantees wale store mein rakhne se paisa/inventory galat sync ho sakta hai, jabki cart/catalog jaisa data yahan theek fit karta",
      "NoSQL databases mein schema define karna hi possible nahi hai",
      "Ek single database use karna hamesha galat hota hai, chahe requirement kuch bhi ho",
    ],
    correctIndex: 1,
    explanation:
      "Real risk yeh hai ki financially-critical components (orders, payments) ko weak-consistency store mein daalna galat paisa/stock sync create kar sakta hai, jabki polyglot persistence — component-specific database choice — is risk ko avoid karta hai. NoSQL slow nahi hoti (A galat). Schema define karna NoSQL mein possible hai, bas enforced nahi hota by default (C galat). Kabhi-kabhi ek single database sahi bhi ho sakta hai chhote systems ke liye, 'hamesha galat' overstated hai (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
