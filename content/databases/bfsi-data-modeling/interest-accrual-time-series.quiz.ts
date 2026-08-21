import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "interestacc-1",
    question: "Ek nightly job jo directly computed interest ko `Account.balance` mein add kar deta hai (bina kisi per-period record ke) kis fundamental problem se juzhta hai?",
    options: [
      "Yeh sirf slow hota hai large tables pe",
      "Not auditable (kis rate/period se interest aaya pata nahi chalta) aur double-counting ka risk (retry pe interest do baar add ho sakta hai)",
      "SQL decimal columns pe addition operation support nahi karta",
      "Yeh sirf loan accounts ke liye problem hai, savings ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "Yeh exact wahi problem hai jo mutable balance column mein tha ledger topic mein — koi record nahi ki interest kis rate/period se aaya, aur agar job retry ho (crash ke baad) bina idempotency ke, to double-counting ho sakta hai. Performance (A) core issue nahi hai. SQL decimal addition support karta hai (C galat). Yeh problem savings aur loan dono types ke accounts pe equally apply hoti hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "interestacc-2",
    question: "`DailyInterestAccrual` table mein `rate_applied` aur `principal_used` ko alag se store karna (sirf `amount_accrued` ke bajaye) kyun zaroori hai?",
    options: [
      "Isse table ka storage size chhota ho jaata hai",
      "Agar kisi specific period ke liye rate galat thi, to exact affected rows identify aur targeted correction kar sakte hain, bina poori history touch kiye",
      "Database engine ko rate aur principal alag chahiye hote hain constraint validation ke liye",
      "Yeh sirf reporting dashboards ke liye useful hai, correction ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "Rate aur principal separately store karne se, agar ek period mein galat rate use hui, to woh specific rows precisely identify ho sakti hain (WHERE rate_applied = wrong_rate) aur sirf unhe targeted correction se fix kiya ja sakta hai. Yeh storage size badhata hai, ghatata nahi (A galat). Constraint validation ka yeh primary reason nahi hai (C galat). Correction ke liye bhi equally critical hai, sirf reporting ke liye nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "interestacc-3",
    question: "Interest 'accrue daily, post quarterly' pattern mein 'posting' step actually kya karta hai?",
    options: [
      "Sirf ek email notification customer ko bhejta hai",
      "Accumulated unposted daily accrual rows ko consolidate karke ek proper LedgerEntry debit/credit pair banata hai aur accruals ko posted mark karta hai",
      "Purani accrual rows ko permanently delete kar deta hai",
      "Interest rate ko database mein update kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Posting job accumulated unposted daily accruals ko utha ke, unka total nikal ke, ek proper LedgerEntry pair banata hai (double-entry principle se), aur accrual rows ko posted_to_ledger = TRUE mark kar deta hai. Notification (A) is process ka core function nahi hai. Rows delete karna (C) audit history destroy kar dega. Rate update (D) is step ka role nahi hai.",
    difficulty: "medium",
  },
  {
    id: "interestacc-4",
    question: "Ek bank ke saath 50 million accounts, DailyInterestAccrual table jaisi high-volume time-series table ko manage karne ke liye kaunsa approach standard hai?",
    options: [
      "Table ko ek single unpartitioned table rakhna aur regularly full-table backup lena",
      "accrual_date pe monthly/quarterly partitioning, aur posted, retention-window-expired partitions ko aggressively archive karna",
      "Har din pichli saari rows delete karke sirf latest day rakhna",
      "Table ko in-memory cache mein rakhna, disk pe kabhi persist na karna",
    ],
    correctIndex: 1,
    explanation:
      "Date-based partitioning query performance maintain karta hai aur already-posted, retention-satisfied partitions ko clean archival allow karta hai (poori table touch kiye bina). Unpartitioned + full backup (A) scale nahi karta aur archival ko messy banata hai. Purani rows delete karna (C) audit/regulatory retention requirements todta hai. In-memory-only (D) durability aur compliance dono ke liye unacceptable hai financial data ke liye.",
    difficulty: "hard",
  },
];

export default quiz;
