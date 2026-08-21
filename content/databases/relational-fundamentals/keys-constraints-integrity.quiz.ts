import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "keycon-1",
    question:
      "Application code already validate karti hai ki balance kabhi negative na ho. Fir bhi database mein CHECK (balance >= 0) constraint kyun add karna chahiye?",
    options: [
      "Kyunki CHECK constraint queries ko fast banata hai",
      "Kyunki application validation bypass ho sakti hai (bugs, direct DB access, doosri services) — DB constraint har write path pe guarantee deta hai",
      "Kyunki SQL standard isse mandatory banata hai har table mein",
      "Kyunki CHECK constraint automatically application code ko update kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Yeh 'push validation down to the database' philosophy hai — application validation ek single code path pe depend karti hai jo bugs ya bypass se fail ho sakta hai, lekin database constraint har write pe check hota hai chahe woh kahin se bhi aaye. Yeh 'last line of defense' hai. Performance (A) is wrong direction — constraints thoda overhead add karte hain, speed nahi. C galat hai, koi aisa SQL standard requirement nahi. D nonsensical hai — DB aur application code independent hain.",
    difficulty: "easy",
  },
  {
    id: "keycon-2",
    question:
      "Account table delete hone pe uske Transaction history rows ka kya hona chahiye, aur kaunsa FK behavior yeh enforce karta hai?",
    options: [
      "ON DELETE CASCADE — Transactions bhi automatically delete ho jaayein",
      "ON DELETE SET NULL — Transactions ka account_id null ho jaaye",
      "ON DELETE RESTRICT — Account ko delete hi na hone do agar uske Transactions exist karte hain",
      "Koi FK behavior specify karne ki zaroorat nahi",
    ],
    correctIndex: 2,
    explanation:
      "Financial history (Transactions) ko kabhi silently delete nahi hona chahiye jab parent Account delete ho — ON DELETE RESTRICT ensure karta hai ki agar Transactions exist karte hain, Account delete hi na ho, jo accidental data loss se bachata hai. CASCADE (A) transaction history ko silently delete kar dega — audit ke liye disaster. SET NULL (B) orphan transactions banayega jinka account link toot jaayega. D galat hai — FK behavior explicitly define karna zaroori hai, default database-specific ho sakta hai aur risky.",
    difficulty: "medium",
  },
  {
    id: "keycon-3",
    question:
      "PAN number Customer table mein UNIQUE constraint ke saath hai, lekin PRIMARY KEY customer_id (surrogate key) hai. Yeh design decision kyun sahi hai?",
    options: [
      "PAN number technically unique nahi ho sakta, isliye PK nahi ban sakta",
      "PK aur UNIQUE same cheez hain, koi farak nahi padta",
      "Surrogate key stable rehta hai identity ke liye, jabki PAN jaisa business-facing field uniqueness enforce karta hai bina row ki actual identity bane",
      "SQL mein VARCHAR column PRIMARY KEY nahi ban sakta",
    ],
    correctIndex: 2,
    explanation:
      "Surrogate key (customer_id) row ki stable, never-changing identity provide karta hai jo foreign keys ke liye reference hoti hai, jabki UNIQUE constraint (PAN number) business rule enforce karta hai ki koi do customers same PAN na rakhein — dono roles alag hain. A galat hai, PAN unique hi hota hai (KYC rule). B galat hai — PK identity + NOT NULL + UNIQUE sab imply karta hai, lekin ek table mein sirf ek PK ho sakta hai jabki multiple UNIQUE constraints ho sakte hain. D factually galat hai, VARCHAR PK ban sakta hai.",
    difficulty: "medium",
  },
  {
    id: "keycon-4",
    question:
      "High-throughput UPI transaction processing (lakhs of transactions/sec) ke context mein, database constraints (FK, CHECK) ke baare mein kaunsa statement sabse accurate hai?",
    options: [
      "Constraints free hote hain, koi performance cost nahi hota",
      "Constraints har write pe check hote hain aur genuine (usually small) overhead add karte hain, lekin BFSI mein correctness ka trade-off almost hamesha worth hota hai",
      "High-throughput systems mein sab constraints hata dene chahiye speed ke liye",
      "Constraints sirf read queries ko slow karte hain, writes ko nahi",
    ],
    correctIndex: 1,
    explanation:
      "Constraints ek genuine trade-off hain — har FK lookup aur CHECK evaluation thoda cost add karta hai har write pe, lekin financial correctness (no orphan transactions, no negative balances) is overhead se kahin zyada valuable hai BFSI mein. A galat hai (free nahi hote). C dangerous advice hai — correctness compromise karna galat trade-off hai. D galat hai, constraints specifically write path pe check hote hain, reads pe nahi.",
    difficulty: "hard",
  },
];

export default quiz;
