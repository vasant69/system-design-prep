import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "upistore-1",
    question:
      "PaymentTransaction table mein reference_id column pe UNIQUE constraint lagane ka primary purpose kya hai?",
    options: [
      "Query performance improve karna joins mein",
      "Client-generated idempotency key ko enforce karna, taaki ek retry duplicate payment na bana sake",
      "Column ko sort order mein rakhna",
      "Storage space bachana",
    ],
    correctIndex: 1,
    explanation:
      "UNIQUE constraint database level pe hi guarantee karta hai ki same reference_id (jo client ne request bhejne se pehle generate kiya) dobara insert nahi ho sakta — yehi idempotency ka foundation hai. Performance (A), sort order (C), aur storage (D) is constraint ka primary purpose nahi hain.",
    difficulty: "easy",
  },
  {
    id: "upistore-2",
    question:
      "PaymentStatusEvent ko ek separate append-only table banaya gaya hai, na ki sirf PaymentTransaction pe ek status column overwrite kiya jaata hai. Iska sabse bada reason kya hai?",
    options: [
      "Append-only tables SQL mein faster hoti hain by default",
      "Hop-by-hop poori status history auditable rehni chahiye, taaki dispute/reconciliation mein exactly pata chale payment kahan ruka",
      "PaymentTransaction table mein extra columns add karna allowed nahi hota",
      "Status values string hote hain, isliye alag table chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Agar sirf status column overwrite ho, to poori hop-by-hop journey ka trace kho jaata hai — dispute ya reconciliation ke time yeh pata karna mushkil ho jaata hai ki transaction kahan tak pahuncha. Append-only event log yeh full auditability deta hai. Option A ek generic galat claim hai, C aur D irrelevant/galat reasons hain.",
    difficulty: "medium",
  },
  {
    id: "upistore-3",
    question:
      "PaymentStatusEvent jaisi hot-write table ke liye indexing strategy ke baare mein kya sahi hai?",
    options: [
      "Jitne zyada indexes utna behtar, kyunki queries fast ho jaati hain",
      "Deliberately minimal indexes rakhne chahiye — har extra index insert path ko slow karta hai jo is table pe extremely frequent hai",
      "Indexing is table pe zaroori hi nahi hai",
      "Sirf primary key ke alawa koi bhi index allowed nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Yeh table extremely write-heavy hai (har hop ek insert), isliye trade-off deliberately reads ke against jaata hai — kam indexes rakhte hain (jaise sirf transaction_id+timestamp composite) taaki insert throughput na ghate. Option A generic galat hai high-write context mein. C aur D extreme/galat statements hain — ek minimal, targeted index (jaise status-history query ke liye) still zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "upistore-4",
    question:
      "Ek payment transaction 'FORWARDED' status pe 10 minute se stuck hai, aage koi update nahi aaya. Schema-level design mein iska sahi solution kya hai?",
    options: [
      "Kuch nahi karna, eventual consistency ka matlab hai wait karte raho",
      "Transaction ko manually database se delete kar dena",
      "Ek reconciliation/timeout-sweep batch job jo stale transactions detect kare, status-check call kare, aur threshold cross hone pe explicitly FAILED mark kare",
      "Payer ko naya payment retry karne bolna bina kuch aur kiye",
    ],
    correctIndex: 2,
    explanation:
      "Eventual consistency acceptable hai lekin 'forever ambiguous' nahi — isliye ek timeout-sweep job stale transactions ko query karke ya to status-check se resolve karta hai ya threshold ke baad explicitly fail marks karta hai, taaki har transaction eventually ek terminal state pe pahunche. Kuch na karna (A) forever-pending risk chhodta hai. Delete karna (B) audit trail todta hai. Sirf retry bolna (D) underlying stuck-state problem ko solve nahi karta aur duplicate payment risk create kar sakta hai agar idempotency handle na ho.",
    difficulty: "hard",
  },
];

export default quiz;
