import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "locking-and-deadlocks-1",
    question: "Ek exclusive lock (X-lock) ke baare mein kaunsa statement sahi hai?",
    options: ["Multiple transactions simultaneously exclusive lock hold kar sakte hain read ke liye", "Sirf ek transaction ek waqt pe exclusive lock hold kar sakta hai, doosre transactions ko wait karna padta hai", "Exclusive lock sirf table-level locking mein use hota hai", "Exclusive lock deadlocks ko completely prevent kar deta hai"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki sirf ek transaction exclusive lock hold kar sakta hai — yeh write operations ke liye hai, aur doosre transactions ko us resource ke liye wait karna padta hai jab tak lock release na ho. Shared locks multiple readers allow karte hain, exclusive nahi. Exclusive lock row-level aur table-level dono mein use hota hai. Exclusive locks deadlocks prevent nahi karte, balki inhi ke wajah se deadlocks ban sakte hain agar lock ordering inconsistent ho.",
    difficulty: "easy",
  },
  {
    id: "locking-and-deadlocks-2",
    question: "T1 driver row lock karke rider row chahta hai, T2 rider row lock karke driver row chahta hai — dono ek doosre ka wait kar rahe hain. Yeh scenario kya hai?",
    options: ["Simple lock contention, resolve ho jaayega thodi der mein", "Deadlock — ek cycle hai jahan koi transaction aage nahi badh sakta bina intervention ke", "Dirty read anomaly", "Yeh normal behavior hai, koi issue nahi hai"],
    correctIndex: 1,
    explanation: "Sahi jawab deadlock hai — yeh classic cycle hai wait-for graph mein, jahan dono transactions ek doosre ka wait kar rahe hain aur koi bhi kabhi aage nahi badh sakta jab tak database intervene na kare. Simple lock contention mein eventually ek transaction release karta hai aur doosra aage badh jaata hai, yahan aisa nahi ho sakta. Dirty read ek alag concept hai (uncommitted data padhna), yahan lock waiting ho raha hai.",
    difficulty: "medium",
  },
  {
    id: "locking-and-deadlocks-3",
    question: "Deadlock prevent karne ka sabse effective aur common practical technique kya hai?",
    options: ["Isolation level ko Serializable set kar dena", "Consistent lock ordering — har transaction resources ko same order mein lock kare", "Table-level locking use karna row-level ke bajaye", "Transactions ko bahut lamba rakhna taaki sab kaam ek saath ho jaaye"],
    correctIndex: 1,
    explanation: "Sahi jawab consistent lock ordering hai — agar har transaction resources ko same order mein lock kare, to cycle ban hi nahi sakta wait-for graph mein. Serializable isolation deadlocks ko prevent nahi karta, balki alag anomalies (phantom reads) handle karta hai. Table-level locking concurrency ko severely limit karta hai, deadlock ka direct solution nahi hai. Lambe transactions actually deadlock risk ko badhate hain, kam nahi karte.",
    difficulty: "medium",
  },
  {
    id: "locking-and-deadlocks-4",
    question: "Jab database ek deadlock detect karta hai, to woh kya karta hai?",
    options: ["Dono transactions ko permanently fail kar deta hai", "Ek transaction ko victim ke roop mein choose karke rollback kar deta hai, doosra aage badh jaata hai", "Database crash ho jaata hai aur restart karna padta hai", "Deadlock ko ignore kar deta hai, transactions hamesha ke liye wait karte rehte hain"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki database ek victim transaction choose karta hai (typically jiska rollback sabse kam costly ho) aur usko forcibly rollback kar deta hai, deadlock error ke saath — doosra transaction phir aage badh sakta hai. Dono transactions permanently fail nahi hote, sirf ek. Database crash nahi hota deadlock ki wajah se. Database deadlock ko ignore nahi karta, activetly detect aur resolve karta hai wait-for graph cycle check karke.",
    difficulty: "hard",
  },
];

export default quiz;
