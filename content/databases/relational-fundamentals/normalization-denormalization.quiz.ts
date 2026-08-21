import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "normdenorm-1",
    question:
      "Ek Transaction table mein branch_name aur branch_address directly store kiye gaye hain (branch_id ke saath). Yeh kis normal form ko violate karta hai, aur kaunsi anomaly create karta hai?",
    options: [
      "1NF violate hota hai — repeating groups ki wajah se",
      "3NF violate hota hai (transitive dependency) — branch move hone pe update anomaly",
      "Koi normal form violate nahi hota, yeh sahi design hai",
      "2NF violate hota hai kyunki primary key composite nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "branch_address depend karta hai branch_name/branch_id pe, na ki directly transaction_id pe — yeh transitive dependency hai, jo 3NF violate karti hai. Isse update anomaly hoti hai: branch address change hone pe har matching transaction row update karni padegi. 1NF (A) atomic values ke baare mein hai, yahan values already atomic hain. 2NF (D) sirf composite keys pe apply hota hai — yahan primary key simple hai. C galat hai kyunki yeh genuinely anomaly-prone design hai.",
    difficulty: "medium",
  },
  {
    id: "normdenorm-2",
    question:
      "BFSI systems mein denormalization ka sabse safe/standard jagah kaunsi hai?",
    options: [
      "Core OLTP banking ledger jahan transactions directly likhte hain",
      "Read replica, reporting table, ya materialized view — kabhi bhi ek defined sync mechanism ke saath",
      "Kahin bhi, jahan bhi query slow lage",
      "Sirf Customer table mein, kabhi Transaction table mein nahi",
    ],
    correctIndex: 1,
    explanation:
      "Standard practice hai ki core OLTP write path normalized rahe (correctness priority), aur denormalization sirf read-optimized layers (replica/reporting/materialized view) mein ho, jahan staleness acceptable hai aur ek sync mechanism (CDC, ETL) defined hai. Option A galat hai — yeh exactly wahi jagah hai jahan denormalize NAHI karna chahiye. C bahut generic/risky approach hai. D ek incorrect blanket rule hai — denormalization decision table-specific nahi, use-case-specific hota hai.",
    difficulty: "medium",
  },
  {
    id: "normdenorm-3",
    question: "Denormalization ka genuine cost/trade-off kya hai?",
    options: [
      "Reads slow ho jaate hain",
      "Data stale ho sakta hai aur writes ko multiple copies sync karni padti hain",
      "SQL queries likhna mushkil ho jaata hai",
      "Primary keys kaam karna band kar dete hain",
    ],
    correctIndex: 1,
    explanation:
      "Denormalization reads ko fast banata hai (A galat — ulta hota hai), lekin cost yeh hai ki redundant copies ko sync mein rakhna padta hai, aur agar sync fail/lag ho, data stale dikh sakta hai. Writes bhi complex ho jaate hain kyunki ek logical update multiple jagah reflect karna padta hai. Queries actually simpler ho jaati hain denormalized data pe (C galat — ulta). Primary keys ka denormalization se koi direct relation nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "normdenorm-4",
    question:
      "Ek composite key (account_id, txn_date) wali summary table mein account_type column hai jo sirf account_id pe depend karta hai, txn_date pe nahi. Yeh kis normal form ka violation hai?",
    options: [
      "1NF — atomic values ka issue",
      "2NF — partial dependency on composite key",
      "3NF — transitive dependency",
      "BCNF — overlapping candidate keys",
    ],
    correctIndex: 1,
    explanation:
      "2NF specifically composite keys ke context mein apply hoti hai: agar koi non-key column sirf composite key ke ek part pe depend karta hai (poore composite key pe nahi), to yeh partial dependency hai — 2NF violation. 1NF (A) atomic values ka issue hai, yahan values atomic hain. 3NF (C) non-key-to-non-key dependency ke baare mein hai, yeh case directly key ke ek part pe depend karta hai. BCNF (D) yahan applicable nahi kyunki issue candidate key overlap ka nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
