import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "avb-1",
    question: "Bank transfer example mein (account A se 1000 rupaye debit, account B mein credit), ACID ka kaunsa letter guarantee karta hai ki agar credit step fail ho jaaye to debit bhi automatically rollback ho jaaye?",
    options: [
      "Consistency",
      "Atomicity",
      "Isolation",
      "Durability",
    ],
    correctIndex: 1,
    explanation:
      "Atomicity guarantee karta hai ki transaction ke saare steps 'sab ya koi nahi' execute hon — agar credit fail hua, poora transaction (debit sameet) rollback ho jaata hai. Consistency valid-state-to-valid-state ke baare mein hai, Isolation concurrent transactions ke interference ke baare mein, aur Durability committed data ke crash-survival ke baare mein — teeno is specific rollback behavior ko directly guarantee nahi karte.",
    difficulty: "easy",
  },
  {
    id: "avb-2",
    question: "Ek transaction same row ko do baar padhta hai aur beech mein doosra transaction commit kar deta hai jisse dono reads different value dete hain. Yeh kaunsi anomaly hai, aur kaunsa isolation level ise prevent karta hai?",
    options: [
      "Dirty read; Read Uncommitted level prevent karta hai",
      "Non-repeatable read; Repeatable Read (ya stricter) level prevent karta hai",
      "Phantom read; Read Committed level prevent karta hai",
      "Yeh koi standard anomaly nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Same row ko baar-baar padhne pe different value milna non-repeatable read hai, aur Repeatable Read isolation level (ya usse strict, Serializable) ise prevent karta hai. Dirty read uncommitted data padhne se hota hai (option A galat hai kyunki Read Uncommitted actually is anomaly ko allow karta hai, prevent nahi). Phantom read range queries mein naye rows insert hone se hota hai, single-row repeated read se nahi (C galat).",
    difficulty: "medium",
  },
  {
    id: "avb-3",
    question: "BASE (Basically Available, Soft state, Eventual consistency) ke baare mein kaunsa statement sahi hai?",
    options: [
      "BASE ACID ka ek kamzor/incomplete version hai jo sirf legacy systems mein use hota hai",
      "BASE ek deliberate design trade-off hai — distributed systems availability aur scale ke liye consciously strict consistency ko trade karte hain",
      "BASE ka matlab hai system kabhi bhi consistent state pe nahi pahunchta",
      "BASE sirf relational databases mein use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "BASE ek deliberate, alag design philosophy hai — 'kamzor ACID' nahi. Distributed/NoSQL systems consciously availability aur scale ke liye strict consistency trade karte hain. C galat hai — 'eventual consistency' ka matlab hai system eventually converge karega, bas time-bound guarantee nahi hai. D galat hai — BASE typically non-relational/distributed NoSQL systems mein use hota hai, relational mein nahi.",
    difficulty: "medium",
  },
  {
    id: "avb-4",
    question: "Ek e-commerce system mein payment processing aur 'product view count' dono features hain. Consistency model choose karte waqt sahi approach kya hai?",
    options: [
      "Poore system ko ACID pe rakhna, kyunki correctness hamesha sabse important hai",
      "Poore system ko BASE pe rakhna, kyunki availability aur scale hamesha priority honi chahiye",
      "Payment ko ACID pe rakhna (double-debit ek real financial loss hai) aur view count ko BASE pe rakhna (thodi staleness acceptable hai, availability zyada matter karti hai)",
      "Dono ko same consistency model pe rakhna zaroori hai, taaki system simple rahe",
    ],
    correctIndex: 2,
    explanation:
      "Real systems (jaise Amazon, Flipkart) component-by-component decide karte hain — payments jaisi financially-critical operations ACID pe (overselling/double-debit real business loss hai), jabki view counts jaise engagement metrics BASE pe (staleness ka koi real cost nahi, availability/latency zyada matter karti hai). A aur B dono ek extreme hain jo galat trade-offs create karte hain — poora ACID unnecessary latency/throughput cost daalta hai low-stakes data pe, poora BASE payments jaisi critical data ko risk mein daal deta hai. D ek false constraint hai — consistency model per-component decide hota hai, poore system ke liye uniform hona zaroori nahi.",
    difficulty: "hard",
  },
];

export default quiz;
