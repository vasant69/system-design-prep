import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dfa-1",
    question: "Kaun se chaar principles milke 'designing for auditability' banate hain?",
    options: [
      "Normalization, denormalization, indexing, partitioning",
      "Immutability, traceability, reconstructability, tamper-evidence",
      "Encryption, masking, access control, RLS",
      "ACID, BASE, CAP, PACELC",
    ],
    correctIndex: 1,
    explanation:
      "Auditability specifically in chaar principles pe based hai: immutability (append-only, kabhi overwrite nahi), traceability (kisne/kaunsi request se change kiya), reconstructability (current state history se derivable ho), aur tamper-evidence (retroactive tampering detectable ho, jaise hash-chaining). Baaki options (A, C, D) alag concepts hain — data modeling patterns, security techniques, aur distributed systems theory respectively, auditability ke four principles nahi.",
    difficulty: "easy",
  },
  {
    id: "dfa-2",
    question: "'Reconstructability' principle ka matlab kya hai account balance ke context mein?",
    options: [
      "Balance ko har request pe recalculate karna zaroori hai, cache karna mana hai",
      "Current balance ek standalone trusted number nahi honi chahiye — usse historical ledger entries se derive/verify karna possible hona chahiye",
      "Balance column ko encrypt karna zaroori hai",
      "Balance sirf ek authorized role hi dekh sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Reconstructability ka core idea hai ki current balance kabhi blindly trust na kiya jaaye — woh hamesha SUM(credit) - SUM(debit) jaisi computation se historical ledger entries se independently verify ho sakna chahiye, taaki reconciliation aur mismatch-detection possible ho. Yeh caching (A) ko prohibit nahi karta — cached balance bhi ho sakta hai, bas woh ledger se verifiable/derivable hona chahiye. Encryption (C) aur access restriction (D) alag concerns hain (security-compliance module ke doosre topics).",
    difficulty: "medium",
  },
  {
    id: "dfa-3",
    question: "Permission-level immutability (INSERT-only roles) kis threat model ko FULLY cover NAHI karti?",
    options: [
      "Ek buggy application service jo galti se UPDATE query bhej deta hai",
      "Ek attacker/insider jiske paas already elevated/admin-level database access hai",
      "Normal application flow mein duplicate rows insert hona",
      "Ek service jo audit table pe SELECT query chalata hai",
    ],
    correctIndex: 1,
    explanation:
      "Permission-level immutability (jaise INSERT-only role) effectively rokti hai normal application-level services ko records modify/delete karne se (option A ka case bhi yehi rokti hai — service ke paas UPDATE permission hi nahi hoga). Lekin agar attacker/insider ke paas already admin-level database access hai, woh permission restrictions ko bypass kar sakta hai — isi gap ko tamper-evidence (hash-chaining) address karta hai. SELECT query (D) koi threat hi nahi hai, yeh read-only hai.",
    difficulty: "hard",
  },
  {
    id: "dfa-4",
    question: "Hash-chaining technique (har row apne previous row ka hash store karti hai) kis principle ko implement karti hai, aur kyun?",
    options: [
      "Traceability — kyunki hash se pata chalta hai row kisne banaya",
      "Tamper-evidence — kyunki kisi bhi historical row ko directly database mein modify karne se chain break ho jaati hai, jo detectable hota hai",
      "Reconstructability — kyunki hash se balance calculate hota hai",
      "Immutability — kyunki hash rows ko delete hone se rokta hai",
    ],
    correctIndex: 1,
    explanation:
      "Hash-chaining tamper-evidence implement karta hai — agar koi row directly database mein (application bypass karke) modify kiya jaaye, uska hash us row ke actual content se match nahi karega, aur agli row ka prev_row_hash bhi mismatch karega — poori chain consistently tamper karna practically infeasible hai. Traceability (A) created_by/correlation_id se hoti hai, hash se nahi. Reconstructability (C) SUM-based derivation se hoti hai. Immutability (D) permission-level enforcement se hoti hai — hash khud rows ko delete hone se nahi rokta, sirf tampering ko detectable banata hai.",
    difficulty: "hard",
  },
];

export default quiz;
