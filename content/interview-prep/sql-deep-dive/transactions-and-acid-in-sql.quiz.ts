import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "transactions-and-acid-in-sql-1",
    question: "Money transfer transaction mein debit step ho gaya lekin credit step fail ho gaya. ROLLBACK call karne pe kya hoga?",
    options: ["Sirf credit step undo hoga, debit step apply rahega", "Dono steps undo ho jaayenge, jaise transaction hua hi nahi", "Database automatically retry karega credit step ko", "Kuch nahi hoga, ROLLBACK sirf SELECT queries pe kaam karta hai"],
    correctIndex: 1,
    explanation: "Sahi jawab hai dono steps undo — yehi Atomicity ka core hai, ki transaction ke saare steps ek unit hain, ya sab apply honge ya koi nahi. 'Sirf credit undo' galat hai kyunki yeh partial state chhod dega jo atomicity violate karta hai. ROLLBACK automatic retry nahi karta, aur yeh sirf SELECT tak limited nahi hai, balki poori transaction ke DML statements pe apply hota hai.",
    difficulty: "easy",
  },
  {
    id: "transactions-and-acid-in-sql-2",
    question: "Ek transaction Account A ka balance do baar padhta hai apne andar — pehli baar 5000, doosri baar 4200 (beech mein doosre transaction ne update commit kar diya). Yeh kis anomaly ka example hai?",
    options: ["Dirty read", "Non-repeatable read", "Phantom read", "Lost update"],
    correctIndex: 1,
    explanation: "Sahi jawab non-repeatable read hai — same transaction ke andar ek hi row ko baar-baar padhne pe alag values milna, kyunki beech mein doosra transaction commit kar chuka. Dirty read uncommitted data padhne se hota hai, yahan doosra transaction already commit ho chuka tha. Phantom read row SET change hone se hota hai (naye rows), yahan existing row ki value change hui hai.",
    difficulty: "medium",
  },
  {
    id: "transactions-and-acid-in-sql-3",
    question: "Zyadatar production databases (PostgreSQL, MySQL) default kis isolation level pe chalte hain, aur kyun?",
    options: ["Serializable, kyunki safety sabse important hai", "Read Uncommitted, kyunki fastest hai", "Read Committed (ya Repeatable Read), kyunki Serializable throughput ko significantly hit karta hai", "Isolation level databases mein configurable hi nahi hota"],
    correctIndex: 2,
    explanation: "Sahi jawab hai ki production systems Read Committed (ya kuch cases mein Repeatable Read) default use karte hain, kyunki Serializable strict locking/retry overhead ke wajah se throughput significantly kam kar deta hai high-contention workloads mein. Read Uncommitted itna loose hai ki dirty reads bhi allow karta hai, production mein practically use nahi hota. Isolation level definitely configurable hota hai most databases mein.",
    difficulty: "medium",
  },
  {
    id: "transactions-and-acid-in-sql-4",
    question: "ACID mein Consistency ka matlab specifically kya hai?",
    options: ["Concurrent transactions ek doosre ko interfere nahi karti", "Transaction database ko ek valid state se doosre valid state mein le jaata hai, saare constraints respect karte hue", "Commit hone ke baad change crash ke baad bhi persist rehta hai", "Saare transaction steps ek unit ki tarah all-or-nothing execute hote hain"],
    correctIndex: 1,
    explanation: "Sahi jawab Consistency ki definition hai — valid state se valid state, constraints (jaise balance >= 0) hamesha respect hote hain. Pehla option Isolation ki definition hai. Teesra option Durability hai. Chautha option Atomicity hai. Yeh chaaron ACID properties alag-alag cheezein guarantee karti hain, inhe confuse na karna interview mein important hai.",
    difficulty: "hard",
  },
];

export default quiz;
