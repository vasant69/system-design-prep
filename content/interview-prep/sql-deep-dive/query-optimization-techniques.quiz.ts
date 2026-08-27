import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "query-opt-1",
    question: "Sirf yeh check karna hai ki kisi customer ne kabhi order kiya hai ya nahi (yes/no). Sabse efficient approach kaunsa hai?",
    options: [
      "JOIN customers with orders and use DISTINCT",
      "EXISTS subquery, kyunki optimizer pehla match milte hi short-circuit kar sakta hai",
      "SELECT * FROM orders aur application code mein count karna",
      "Do alag queries chalake results ko manually compare karna",
    ],
    correctIndex: 1,
    explanation: "EXISTS sabse efficient hai pure existence check ke liye kyunki optimizer ko poora result set chahiye hi nahi, pehla match milte hi confirm ho jaata hai. JOIN with DISTINCT extra unnecessary work karta hai (duplicate rows produce karke unhe filter karna), aur poora orders table SELECT karke application mein count karna sabse zyada wasteful approach hai.",
    difficulty: "easy",
  },
  {
    id: "query-opt-2",
    question: "WHERE clause mein `YEAR(order_date) = 2024` likhne se query kyun slow ho sakti hai, chahe order_date pe index ho?",
    options: [
      "Kyunki YEAR() function database mein exist hi nahi karta",
      "Kyunki function ko har row pe evaluate karna padta hai, jisse query non-sargable ban jaati hai aur index range lookup use nahi ho paata",
      "Kyunki YEAR() sirf VARCHAR columns pe kaam karta hai",
      "Kyunki 2024 ek invalid value hai comparison ke liye",
    ],
    correctIndex: 1,
    explanation: "Indexed column pe function apply karne se query non-sargable ban jaati hai — database ko har row ke liye function evaluate karna padta hai, isliye woh directly index range lookup use nahi kar paata aur seq scan lena padta hai. YEAR() ek valid function hai most databases mein, VARCHAR-specific nahi hai, aur 2024 ek perfectly valid value hai.",
    difficulty: "medium",
  },
  {
    id: "query-opt-3",
    question: "Ek order-history page 30 orders dikhata hai, aur code har order ke liye alag query chalata hai uske line items fetch karne ke liye. Yeh pattern kya kehlata hai aur fix kya hai?",
    options: [
      "Cartesian product problem hai, fix hai JOIN hata dena",
      "N+1 query problem hai, fix hai saare order_ids ek IN list mein batch karke single query chalana",
      "Deadlock problem hai, fix hai transaction isolation level badalna",
      "Yeh normal behavior hai aur optimize karne ki zaroorat nahi",
    ],
    correctIndex: 1,
    explanation: "Yeh classic N+1 pattern hai — 1 query orders ke liye, phir N alag queries line items ke liye. Fix hai ek single batched query jo saare order_ids ko IN list mein pass kare. Yeh cartesian product ya deadlock issue nahi hai, aur ise ignore karna galat hai kyunki yeh real load mein significant latency add karta hai (dozens of extra round-trips).",
    difficulty: "medium",
  },
  {
    id: "query-opt-4",
    question: "EXPLAIN ANALYZE output mein `Seq Scan on orders ... Rows Removed by Filter: 999992` dikh raha hai jab query sirf 8 rows return kar rahi hai. Iska sabse likely matlab kya hai?",
    options: [
      "Query syntax mein error hai",
      "Filter column pe koi usable index nahi hai, database poora table scan kar raha hai sirf kuch rows return karne ke liye",
      "Table mein data corrupt ho gaya hai",
      "Yeh normal aur optimal behavior hai kisi bhi table size ke liye",
    ],
    correctIndex: 1,
    explanation: "Yeh output directly bata raha hai ki database ne lagbhag 10 lakh rows padhe sirf 8 return karne ke liye — classic sign hai ki filter column pe usable index missing hai ya query non-sargable hai. Yeh syntax error nahi hai (query chal rahi hai), data corruption ka indicator nahi hai, aur bade table pe itni high-selectivity query ke liye Seq Scan definitely optimal nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
