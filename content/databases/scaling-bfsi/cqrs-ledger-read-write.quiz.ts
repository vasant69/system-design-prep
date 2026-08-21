import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cqrs-1",
    question: "CQRS mein write side aur read side ka basic separation kya hota hai?",
    options: [
      "Write side fast hota hai, read side slow",
      "Write side normalized/append-only hota hai (correctness ke liye), read side denormalized projection hota hai (query speed ke liye)",
      "Write side sirf ek server pe hota hai, read side multiple servers pe",
      "Write aur read side dono same table use karte hain, bas alag indexes hote hain",
    ],
    correctIndex: 1,
    explanation:
      "CQRS mein write model (jaise normalized, append-only LedgerEntry) correctness/auditability ke liye optimized hota hai, jabki read model ek separate denormalized structure hota hai jo query speed ke liye optimized hota hai. Speed comparison (A) galat framing hai. Server count (C) CQRS ka defining characteristic nahi hai. Same table with different indexes (D) CQRS nahi hai — CQRS mein explicitly alag data models hote hain.",
    difficulty: "easy",
  },
  {
    id: "cqrs-2",
    question: "Har balance check pe saare historical LedgerEntry rows sum karna kyun problematic hai?",
    options: [
      "SQL SUM function financial data pe kaam nahi karta",
      "Jaise-jaise account purana hota hai aur transactions badhte hain, yeh query slower hoti jaati hai — scale nahi karta",
      "Ledger entries encrypted hoti hain isliye sum nahi ho sakti",
      "Yeh sirf ek UI problem hai, database pe koi impact nahi",
    ],
    correctIndex: 1,
    explanation:
      "Millions of historical rows ko har single balance-read pe sum karna — account jitna purana/active ho utna slower hota jaata hai, jo ek high-frequency balance-check API ke liye completely impractical hai. SUM function (A) fine kaam karta hai, yeh performance issue hai functionality issue nahi. Encryption (C) is context mein irrelevant hai. Yeh database-level performance problem hai, sirf UI issue nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "cqrs-3",
    question: "Guide ke mutabik, account balance ka read model kis pattern se update hona chahiye, aur kyun?",
    options: [
      "Async/eventually consistent, kyunki CQRS mein saare reads async hote hain",
      "Synchronously, same transaction mein jisme ledger entry insert hoti hai, kyunki stale balance overdraft jaisa dangerous risk create karta hai",
      "Har raat batch job se ek baar update hota hai",
      "Balance update ki koi zaroorat nahi, hamesha live sum karo",
    ],
    correctIndex: 1,
    explanation:
      "Balance itni critical field hai ki isse same transaction mein synchronously update kiya jaata hai jisme ledger entry insert hoti hai — taaki balance kabhi ledger se out-of-sync na ho. 'Saare reads async' (A) ek galat generalization hai jo topic explicitly reject karta hai. Nightly batch (C) bahut stale ho jaayega live banking ke liye. Har baar live sum karna (D) scale nahi karta — yehi to CQRS solve karta hai.",
    difficulty: "medium",
  },
  {
    id: "cqrs-4",
    question: "Spending-by-category dashboard ko async/eventually-consistent read model rakhna kyun acceptable hai, jabki balance nahi?",
    options: [
      "Dashboard data kabhi update hi nahi hota",
      "Dashboard ki staleness se real financial harm nahi hota, jabki stale balance overdraft/declined-payment jaisa direct financial risk create karta hai",
      "Dashboard database mein store hi nahi hota",
      "Async updates hamesha zyada accurate hote hain",
    ],
    correctIndex: 1,
    explanation:
      "CQRS ka senior-level nuance yehi hai — consistency requirement per read-model criticality pe based hoti hai. Dashboard jaisi non-critical view ke liye kuch minutes ki staleness harmless hai, jabki balance ke liye staleness directly money-related risk hai. Dashboard update hota hai, bas async (A galat). Yeh database mein store hoti hai (C galat). Async updates accuracy guarantee nahi karte, sirf timing different hoti hai (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
