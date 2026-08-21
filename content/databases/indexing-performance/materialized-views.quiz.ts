import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "matview-1",
    question: "Regular view aur materialized view mein sabse bada functional difference kya hai?",
    options: [
      "Regular view sirf SELECT allow karta hai, materialized view INSERT bhi allow karta hai",
      "Materialized view query result ko physically disk pe store karta hai; regular view sirf ek saved query hai jo har baar fresh run hoti hai",
      "Dono same hain, sirf syntax alag hai",
      "Regular view sirf single table pe ban sakta hai, materialized view multiple tables pe",
    ],
    correctIndex: 1,
    explanation:
      "Yeh core distinction hai: materialized view precomputed result ko actually store karta hai (jaise ek table), isliye reads fast hote hain. Regular view sirf query definition store karta hai — har access pe underlying query dobara run hoti hai, koi performance benefit nahi milta. Options A, C, aur D is fundamental difference ko galat represent karte hain.",
    difficulty: "easy",
  },
  {
    id: "matview-2",
    question: "Current account balance ko materialized view se serve karna kyun risky hai?",
    options: [
      "Materialized views balance calculations support hi nahi karte",
      "Materialized view refresh ke beech stale ho jaata hai, aur balance jaisi cheez ke liye stale value dikhana customer trust/regulatory issue ban sakta hai",
      "Materialized views sirf text data store kar sakte hain, numbers nahi",
      "Materialized views bahut zyada storage lete hain balance ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Materialized view sirf apne last refresh tak ka snapshot dikhata hai — beech mein naye transactions aa chuke ho sakte hain jo abhi reflect nahi hue. Balance jaisi real-time-critical value ke liye yeh staleness unacceptable hai, especially BFSI mein jahan galat balance dikhana serious issue hai. Options A aur C factually galat hain. Option D irrelevant hai — storage concern nahi hai yahan asli issue.",
    difficulty: "medium",
  },
  {
    id: "matview-3",
    question: "Full refresh aur incremental refresh mein trade-off kya hai?",
    options: [
      "Full refresh hamesha faster hota hai",
      "Full refresh poori view dobara compute karta hai (simple, but expensive on large data); incremental refresh sirf naya data merge karta hai (efficient, but more complex to implement/support)",
      "Incremental refresh sirf chhoti tables ke liye available hai",
      "Dono ka performance same hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Full refresh simplicity ke liye poora recompute karta hai from scratch, jo bade datasets pe minutes-hours le sakta hai. Incremental refresh sirf changed/new data ko merge karta hai, jo zyada efficient hai lekin implement karna complex hai aur har database/query shape isko support nahi karta. Options A, C, aur D is trade-off ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "matview-4",
    question: "Materialized view ko manual application-level denormalization (jaise Account.last_transaction_amount ko code se update karna) se kaise compare karte hain?",
    options: [
      "Dono exactly same guarantee dete hain",
      "Materialized view database-native, query-driven denormalization hai (consistent-by-refresh, but stale); manual denormalization real-time hota hai but bug-prone (missed update se data inconsistent ho sakta hai)",
      "Manual denormalization hamesha better hai kyunki woh real-time hai",
      "Materialized view hamesha better hai kyunki woh automatic hai",
    ],
    correctIndex: 1,
    explanation:
      "Yeh ek genuine trade-off hai, ek-tarfa jawab nahi: materialized view refresh cycle ke hisaab se accurate hota hai (predictable, database-managed) lekin real-time nahi. Manual denormalization real-time update ho sakta hai, lekin agar koi ek jagah update code mein miss ho jaaye, data silently inconsistent ho sakta hai. Options C aur D dono ek-tarfa absolute claims hain jo context-dependent trade-off ko ignore karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
