import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "readrep-1",
    question: "Ek end-of-day batch report primary OLTP database pe hi chalaya ja raha hai. Iska sabse bada risk kya hai?",
    options: [
      "Report ka result galat aa sakta hai",
      "Heavy query CPU/I/O/locks consume karke live transactions (ATM, UPI) ko slow ya timeout kar sakti hai",
      "Report chalne mein zyada time lagega",
      "Primary database crash ho jaayega turant",
    ],
    correctIndex: 1,
    explanation:
      "Reporting queries jo primary pe chalti hain, woh resources (CPU, I/O, locks) consume karti hain jo live transaction processing ko chahiye — isse ATM withdrawals ya UPI payments slow/timeout ho sakte hain, jo BFSI mein ek genuinely dangerous failure mode hai. Report ka result (A) galat nahi hota, sirf slow environment ban jaata hai. Zyada time lagna (C) ek symptom hai, main risk nahi. Crash (D) extreme aur usually immediate case nahi hai.",
    difficulty: "easy",
  },
  {
    id: "readrep-2",
    question: "Read replica se query karte waqt sabse important trade-off consider karna hota hai?",
    options: [
      "Replica hamesha primary se zyada storage leta hai",
      "Replication lag ke wajah se replica data thoda stale ho sakta hai",
      "Replica pe writes allowed nahi hote",
      "Replica sirf ek hi query type support karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Async replication ka core trade-off replication lag hai — replica primary se kuch ms se seconds peeche reh sakta hai, jisse reports thodi stale data pe chal sakte hain. Storage (A) directly related nahi hai is trade-off se. Writes allowed na hona (C) replica ka design constraint hai, lekin yeh 'trade-off' nahi, architectural fact hai. Query type restriction (D) galat hai — replica koi bhi read query serve kar sakta hai.",
    difficulty: "medium",
  },
  {
    id: "readrep-3",
    question: "Customer ATM se withdrawal kar raha hai aur system uski current balance check kar raha hai. Yeh check kahan chalni chahiye?",
    options: [
      "Read replica pe, kyunki fast hai",
      "Primary pe, kyunki balance check money movement decide karta hai aur staleness overdraft risk create kar sakta hai",
      "Dono pe, average nikaal ke",
      "Kisi bhi replica pe, jo bhi free ho",
    ],
    correctIndex: 1,
    explanation:
      "Balance check jaise queries jo directly money movement approve/deny karte hain, unhe hamesha primary pe chalna chahiye — replica ka replication lag stale balance dikha sakta hai, jisse system galti se overdraft allow kar sakta hai. Speed (A) yahan correctness se important nahi hai. Averaging (C) meaningless approach hai. 'Koi bhi replica' (D) staleness risk ko ignore karta hai.",
    difficulty: "medium",
  },
  {
    id: "readrep-4",
    question: "Kaunsi query safely read replica pe route ki ja sakti hai?",
    options: [
      "Withdrawal se pehle current balance verification",
      "Real-time fraud detection check jo turant decision leta hai",
      "Pichle mahine ka account statement generate karna",
      "Ek naya transaction insert karna",
    ],
    correctIndex: 2,
    explanation:
      "Pichle mahine ka statement historical, non-time-critical data hai — replication lag isse affect nahi karta, isliye replica pe safe hai. Balance verification (A) aur fraud check (B) money-critical decisions hain jinhe primary pe hi chalna chahiye kyunki staleness dangerous hai. Insert (D) ek write hai — replicas sirf reads serve karte hain, writes primary pe hi hote hain.",
    difficulty: "hard",
  },
];

export default quiz;
