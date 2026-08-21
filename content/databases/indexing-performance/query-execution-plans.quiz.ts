import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "qplan-1",
    question: "EXPLAIN aur EXPLAIN ANALYZE mein basic difference kya hai?",
    options: [
      "Dono same hain, sirf naam alag hai",
      "EXPLAIN sirf planned strategy dikhata hai bina run kiye; EXPLAIN ANALYZE query ko actually run karke real timings dikhata hai",
      "EXPLAIN sirf SELECT queries ke liye kaam karta hai",
      "EXPLAIN ANALYZE sirf indexes list karta hai",
    ],
    correctIndex: 1,
    explanation:
      "EXPLAIN optimizer ka planned execution strategy dikhata hai bina query execute kiye — zero cost. EXPLAIN ANALYZE query ko actually execute karta hai aur real row counts/timings dikhata hai, jo zyada reliable diagnostic hai lekin actual execution cost bhi laata hai. Option A galat hai — dono ka behavior different hai. Option C aur D functionality ko galat describe karte hain.",
    difficulty: "easy",
  },
  {
    id: "qplan-2",
    question: "Ek query staging (1000 rows) mein fast thi lekin production (50 crore rows) mein timeout ho rahi hai. EXPLAIN ANALYZE 'Seq Scan' dikhata hai bina relevant index ke. Sabse likely fix kya hai?",
    options: [
      "Table ko chhota karna",
      "Filter column pe ek index create karna",
      "Staging environment ko production jitna bada banana",
      "Query ko rewrite karke sirf column names badalna",
    ],
    correctIndex: 1,
    explanation:
      "Seq Scan on a large table for a highly selective filter (jaise ek specific account_id) matlab index missing hai — filter column pe index create karne se optimizer Index Scan choose karega, jo dramatically fast hoga. Table chhota karna (A) practical/valid fix nahi hai. Staging ko bada karna (C) sirf issue ko earlier catch karne mein madad karta, root cause fix nahi karta. Sirf column names badalna (D) scan strategy change nahi karega.",
    difficulty: "medium",
  },
  {
    id: "qplan-3",
    question: "EXPLAIN ANALYZE output mein 'actual rows' aur 'estimated rows' ke beech bada mismatch dekha jaaye, iska sabse likely reason kya hai?",
    options: [
      "Database corrupt ho gaya hai",
      "Table statistics stale hain, optimizer ko table ki current shape ka sahi idea nahi hai",
      "Index missing hai",
      "Query syntax galat hai",
    ],
    correctIndex: 1,
    explanation:
      "Optimizer apne decisions (scan type, join strategy) table statistics ke basis pe leta hai. Agar table recently significantly grow/change hui hai aur statistics update nahi hue, estimate aur actual rows mein bada gap dikhega — fix hai ANALYZE chalana taaki stats refresh ho jaayein. Database corruption (A) is symptom se directly related nahi hai. Missing index (C) alag symptom hai (usually Seq Scan se pehchana jaata hai, estimate mismatch se nahi). Syntax error (D) query ko fail karwa deta, plan nahi dikhata.",
    difficulty: "hard",
  },
  {
    id: "qplan-4",
    question: "EXPLAIN ANALYZE ko production mein ek UPDATE query pe chalane se pehle kya precaution zaroori hai?",
    options: [
      "Kuch nahi, EXPLAIN ANALYZE hamesha read-only hota hai",
      "Query ko transaction mein wrap karna aur ROLLBACK karna, kyunki EXPLAIN ANALYZE actually query execute karta hai",
      "Sirf off-peak hours mein chalana",
      "Database ko restart karna pehle",
    ],
    correctIndex: 1,
    explanation:
      "EXPLAIN ANALYZE query ko actually execute karta hai — agar woh query ek UPDATE/DELETE ho, to real data modify ho jaayega. Isliye BEGIN; EXPLAIN ANALYZE ...; ROLLBACK; pattern use karna safe practice hai. Option A galat hai — EXPLAIN ANALYZE read-only nahi hai jab query khud write ho. Off-peak hours (C) is specific risk ko address nahi karta. Restart (D) is scenario ke liye irrelevant hai.",
    difficulty: "medium",
  },
];

export default quiz;
