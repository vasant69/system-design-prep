import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cbledger-1",
    question:
      "Core banking ledger schema mein Account table pe seedha ek 'balance' column kyun nahi rakha jaata?",
    options: [
      "Kyunki decimal columns storage mein bahut mehenge hote hain",
      "Kyunki balance ledger_entry rows se derive/compute hona chahiye — auditability aur retry-safety ke liye",
      "Kyunki SQL databases mein balance naam ka reserved keyword hota hai",
      "Kyunki Account table already bahut columns rakhta hai",
    ],
    correctIndex: 1,
    explanation:
      "Double-entry principle ke hisaab se balance ek derived value hai jo ledger_entry rows ke sum se aata hai (ya ek materialized column jo transactionally update hoti hai) — isse audit trail aur safe retries milte hain. Storage cost (A) ya reserved keyword (C) irrelevant hain, aur column count (D) design decision ka reason nahi hai.",
    difficulty: "easy",
  },
  {
    id: "cbledger-2",
    question:
      "CAP theorem ke context mein, core banking ledger ko interview mein kaise categorize karna chahiye?",
    options: [
      "AP system — availability sabse zaroori hai, thoda stale balance chalega",
      "CA system — banking systems distributed hi nahi hote isliye CAP apply nahi hota",
      "CP system — partition ke during correctness ko prioritize karo, stale/wrong balance dikhane ke bajaye error do",
      "CAP theorem sirf NoSQL databases pe apply hota hai, relational core banking pe nahi",
    ],
    correctIndex: 2,
    explanation:
      "Core ledger ke liye galat balance dikhana (jaise ek withdrawal jo already ho chuka hai woh na dikhana) availability se zyada dangerous hai — isliye yeh CP choice banata hai. AP (A) galat priority hai financial correctness ke liye. CA (B) unrealistic hai kyunki modern banking systems replicated/distributed hote hain. CAP (D) relational systems pe bhi utna hi apply hota hai jitna NoSQL pe, jab woh distributed/replicated ho.",
    difficulty: "hard",
  },
  {
    id: "cbledger-3",
    question:
      "'All transactions for reconciliation' jaisi heavy batch query kis database target pe route honi chahiye, aur kyun?",
    options: [
      "Primary OLTP database pe, kyunki data hamesha fresh hona chahiye",
      "Ek read replica pe, kyunki heavy scan live transaction processing ko slow/lock nahi karni chahiye",
      "Directly production backup file pe, database ko touch kiye bina",
      "Har account ke liye alag query chala ke, ek loop mein",
    ],
    correctIndex: 1,
    explanation:
      "Read Replicas for Reporting pattern ke hisaab se, heavy analytical/batch scans ko primary se isolate karna chahiye taaki live balance checks aur transfers slow na hon. Primary pe chalana (A) risk create karta hai. Backup file (C) practical nahi hai live reconciliation ke liye. Per-account loop (D) sirf inefficient hai, root problem solve nahi karta.",
    difficulty: "medium",
  },
  {
    id: "cbledger-4",
    question:
      "Ek transaction reverse karni hai (customer complaint ke baad). Sahi approach kya hai?",
    options: [
      "Original ledger_entry rows ko UPDATE karke unka amount zero kar do",
      "Original ledger_entry rows ko DELETE kar do taaki galat transaction history mein na rahe",
      "Ek nayi compensating debit/credit entry pair insert karo jo original ko reverse kare, original rows ko chhedo mat",
      "Sirf Account table ke balance column ko manually correct kar do",
    ],
    correctIndex: 2,
    explanation:
      "Ledger append-only hona chahiye — reversal ek nayi compensating entry pair hoti hai, taaki history mein dono facts preserve rahein (original transaction hua, aur baad mein reverse hua). UPDATE (A) ya DELETE (B) audit trail todte hain. Manual balance correction (D) applicable hi nahi hai kyunki balance ek stored mutable column nahi hai is design mein.",
    difficulty: "medium",
  },
];

export default quiz;
