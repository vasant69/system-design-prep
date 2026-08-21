import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "auditlog-1",
    question: "`created_at`/`updated_at` columns kis regulatory question ka jawab NAHI de sakte?",
    options: [
      "Row kab create hui thi",
      "Row aakhri baar kab update hui thi",
      "Ek field (jaise kyc_status) ne apni poori history mein kaun se values liye, aur kab-kab, aur kisne change kiya",
      "Table mein kitni rows hain",
    ],
    correctIndex: 2,
    explanation:
      "updated_at sirf latest change ka timestamp deta hai, poori sequence of past values, changes, aur changer identity nahi. Yehi gap hai jo dedicated AuditLog table fill karta hai. created_at (A) aur updated_at (B) yeh columns khud answer karte hain. Row count (D) is discussion se unrelated hai.",
    difficulty: "easy",
  },
  {
    id: "auditlog-2",
    question: "Application-level audit logging (service explicitly audit row likhta hai) vs trigger/CDC-based audit logging — inka main trade-off kya hai?",
    options: [
      "Application-level zyada business context capture kar sakta hai (jaise 'why' change hua) lekin buggy service se skip ho sakta hai; trigger/CDC bulletproof hai lekin context kam hota hai",
      "Trigger-based approach hamesha faster hota hai, isliye hamesha better hai",
      "Application-level approach database permissions ki zaroorat nahi rakhta",
      "In dono mein koi practical difference nahi hai",
    ],
    correctIndex: 0,
    explanation:
      "Application-level audit writes business context (change_reason) capture kar sakte hain lekin ek buggy/forgetful service silently skip kar sakta hai. Trigger/CDC-based approach bypass nahi ho sakta (bulletproof) lekin 'why' context nahi jaanta. Speed comparison (B) yahan main point nahi hai. Immutability dono approaches mein database permissions se enforce honi chahiye (C galat). Trade-off real hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "auditlog-3",
    question: "AuditLog table ki immutability ko sabse reliably kaise enforce karte hain?",
    options: [
      "Application code mein ek comment likh ke ki 'is table ko update mat karo'",
      "Ek dedicated database role banake jise sirf INSERT privilege ho, UPDATE/DELETE na ho, aur application ka service account isi restricted role se connect ho",
      "Table ko regularly backup karke",
      "AuditLog table ko application se completely disconnect karke, manual entry se",
    ],
    correctIndex: 1,
    explanation:
      "Immutability ka reliable enforcement database-level permissions se hota hai — ek INSERT-only role, jisse even buggy ya compromised application code UPDATE/DELETE nahi kar sakta. Comment (A) sirf convention hai, enforce nahi karta. Backup (C) history preserve karne mein help kar sakta hai lekin primary enforcement mechanism nahi hai. Manual entry (D) impractical hai aur automation ka fayda kho deta hai.",
    difficulty: "medium",
  },
  {
    id: "auditlog-4",
    question: "Audit row ko business update ke saath alag database transaction mein likhna kyun risky hai?",
    options: [
      "Yeh sirf performance ko thoda slow karta hai, koi correctness issue nahi",
      "Beech mein crash hone par business change commit ho sakta hai bina corresponding audit row ke, jisse audit trail incomplete reh jaata hai",
      "Database do alag transactions allow hi nahi karta",
      "Yeh sirf NoSQL databases mein problem hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar business update aur audit write alag transactions mein hon, ek crash/failure beech mein ho sakta hai jisse business change persist ho jaaye lekin audit row na bane — audit trail mein permanent gap. Yeh sirf performance issue nahi, correctness/completeness issue hai (A galat). Databases multiple transactions allow karte hain (C galat). Yeh SQL databases mein bhi equally applicable hai (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
