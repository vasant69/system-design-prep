import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sqlqf-1",
    question: "'Sab customers ki list do, chahe unka account activate ho ya na ho' — is requirement ke liye kaunsa JOIN sahi hai?",
    options: ["INNER JOIN", "LEFT JOIN (Customer as left table)", "RIGHT JOIN (Account as left table)", "Koi JOIN nahi chahiye"],
    correctIndex: 1,
    explanation:
      "'Chahe ho ya na ho' phrase LEFT JOIN ka signal hai — left table (Customer) ki saari rows chahiye, Account match kare ya na kare. INNER JOIN (A) sirf matching rows dega, un customers ko drop kar dega jinka account nahi hai. RIGHT JOIN with Account as left (C) technically equivalent result de sakta hai lekin galat table ko 'left' bataya gaya hai is option mein, confusing hai. Koi JOIN na hona (D) requirement ko poora nahi karta kyunki dono tables se data chahiye.",
    difficulty: "easy",
  },
  {
    id: "sqlqf-2",
    question: "Ek GROUP BY query ke SELECT list mein ek column hai jo GROUP BY clause mein nahi hai aur aggregate function bhi nahi hai. Iska kya risk hai?",
    options: [
      "Query hamesha error dega, kabhi run nahi hoga",
      "Result silently galat ya undefined ho sakta hai (strict mode mein error, loose mode mein arbitrary value)",
      "Query automatically us column ko GROUP BY mein add kar dega",
      "Koi risk nahi hai, yeh valid SQL hai",
    ],
    correctIndex: 1,
    explanation:
      "Database ke SQL mode pe depend karta hai — strict mode mein error aa sakta hai, lekin loose/permissive mode mein query silently chal jaati hai aur us column ka arbitrary/undefined value return karti hai, jo financial reports mein dangerous hai. 'Hamesha error' (A) galat hai kyunki yeh mode-dependent hai. Automatic GROUP BY addition (C) nahi hoti. 'Koi risk nahi' (D) galat hai — yeh exactly risky pattern hai.",
    difficulty: "medium",
  },
  {
    id: "sqlqf-3",
    question: "N+1 query problem kya hai, aur isse kaise fix karte hain?",
    options: [
      "Database mein N+1 tables ban jaana — normalization se fix hota hai",
      "Ek list fetch karne ke baad har row ke liye alag query chalana (loop mein) — ek batched JOIN ya WHERE IN query se fix hota hai",
      "Query mein N+1 columns select karna — SELECT * use karke fix hota hai",
      "N+1 ek index-related problem hai jo sirf indexing se fix hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "N+1 problem application-level pattern hai — 1 query se list fetch karo, phir loop mein har item ke liye alag query (N queries) — total N+1 round trips. Fix: ek single JOIN ya WHERE account_id IN (...) query se sab kuch ek baar mein fetch karo. Baaki options (A, C, D) is problem ko galat concepts se define karte hain.",
    difficulty: "medium",
  },
  {
    id: "sqlqf-4",
    question: "Interview mein 'write a query to fetch recent transactions for an account' pucha jaata hai. Query likhne ke baad ek strong senior-level move kya hai?",
    options: [
      "Bas query submit karke chup ho jaana",
      "Proactively bolna ki is query ko fast chalane ke liye account_id (aur shayad date) pe index chahiye hoga",
      "Query ko as complex banana jitna ho sake",
      "Sirf SELECT * use karna taaki sab columns mil jaayein",
    ],
    correctIndex: 1,
    explanation:
      "Proactively index requirement bolna production-awareness dikhata hai — yeh exactly wahi signal hai jo interviewer dhoondta hai. Chup rehna (A) ek missed opportunity hai. Query ko unnecessarily complex banana (C) koi value nahi deta. SELECT * (D) generally bad practice hai — sirf zaroori columns select karne chahiye, especially bade tables pe.",
    difficulty: "hard",
  },
];

export default quiz;
