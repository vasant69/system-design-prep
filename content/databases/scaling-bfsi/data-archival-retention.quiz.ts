import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "archival-1",
    question: "Transaction table 500 million rows ho gaya hai aur query performance degrade ho rahi hai. BFSI mein sahi approach kya hai?",
    options: [
      "Sabse purana data permanently delete kar do",
      "Purani data ko date-based partitions se archive karo (cheaper, still-queryable storage mein move karo) — delete nahi",
      "Poora table drop karke naya bana do",
      "Sirf indexes add karo aur data ko as-is rakho forever",
    ],
    correctIndex: 1,
    explanation:
      "BFSI mein regulatory retention requirements ki wajah se purana transaction data delete nahi ho sakta — sirf archive (relocate to cheaper, still-queryable storage) ho sakta hai. Delete karna (A) regulatory violation hai. Table drop (C) sab data loss kar dega. Sirf indexes add karke forever rakhna (D) long-term mein table ko unmanageable bana dega aur cost badhaega.",
    difficulty: "easy",
  },
  {
    id: "archival-2",
    question: "Date-based partitioning archival ko operationally easy kyun banata hai?",
    options: [
      "Partitions automatically encrypt ho jaate hain",
      "Ek poori purani partition ko bulk move/detach kiya ja sakta hai, ek slow row-by-row DELETE/migration ki jagah",
      "Partitioning se data automatically compress ho jaata hai",
      "Partitions regulatory retention period khud decide kar lete hain",
    ],
    correctIndex: 1,
    explanation:
      "Agar table already date se partitioned hai, to ek purani partition already ek logical, self-contained chunk hai jo bulk move/detach ki ja sakti hai — yeh row-by-row migration se kahin fast aur less disruptive hai. Encryption (A) aur compression (C) partitioning ka automatic side-effect nahi hain. Retention period (D) compliance/legal decide karta hai, partitions nahi.",
    difficulty: "medium",
  },
  {
    id: "archival-3",
    question: "'Still accessible' requirement ka archived data ke context mein kya matlab hai?",
    options: [
      "Archived data ko primary database mein hi rehna chahiye",
      "Archived data regulatory audit requests ke liye queryable rehna chahiye, chahe slower response time ke saath, na ki sirf ek backup dump ho",
      "Archived data ko delete karne se pehle ek email bhejna chahiye",
      "Archived data ko unlimited time tak hot storage mein rakhna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Regulators audit ke waqt archived data query kar sakte hain — isliye yeh sirf ek inaccessible backup dump nahi ban sakta, ek separate archival DB/warehouse mein queryable rehna chahiye (chahe slower). Primary mein rehna (A) archival ka purpose hi defeat karta hai (cost/performance). Email notification (C) fabricated hai. Unlimited hot storage (D) archival ka concept hi nahi hai — cold/cheaper storage ka use yehi to hai.",
    difficulty: "medium",
  },
  {
    id: "archival-4",
    question: "Retention period (kitne saal data rakhna hai) kaun decide karta hai?",
    options: [
      "Engineering team apni convenience ke hisaab se",
      "Compliance/legal team, based on regulatory requirements — engineering unilaterally assume nahi karta",
      "Database vendor ka default setting",
      "Yeh decide karne ki koi zaroorat nahi, jitna storage allow kare utna rakho",
    ],
    correctIndex: 1,
    explanation:
      "Retention period regulatory requirement hai (jaise RBI mandates) — engineering team ko compliance/legal se confirm karna padta hai, khud assume nahi karna chahiye, warna premature deletion (violation) ya unnecessary cost dono risk hain. Engineering convenience (A) galat driver hai. Vendor default (C) regulatory requirement se unrelated hai. 'Jitna storage allow kare' (D) na to compliant hai na cost-efficient.",
    difficulty: "hard",
  },
];

export default quiz;
