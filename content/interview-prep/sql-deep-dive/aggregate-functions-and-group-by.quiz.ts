import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "agg-1",
    question: "WHERE aur HAVING mein fundamental difference kya hai?",
    options: [
      "Dono same hain, sirf syntax alag hai",
      "WHERE rows ko aggregation se pehle filter karta hai, HAVING groups ko aggregation ke baad filter karta hai",
      "WHERE sirf numbers ke liye hai, HAVING sirf text ke liye",
      "HAVING GROUP BY ke bina bhi use nahi ho sakta, WHERE hamesha GROUP BY ke saath chahiye",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — yahi core distinction hai: WHERE individual rows ko aggregation se pehle filter karta hai, HAVING already-aggregated groups ko baad mein filter karta hai. A galat hai, yeh functionally alag hain. C galat hai, data type se koi lena dena nahi. D galat hai, WHERE ka GROUP BY se koi mandatory dependency nahi hai — WHERE bina GROUP BY ke bhi kaam karta hai.",
    difficulty: "easy",
  },
  {
    id: "agg-2",
    question: "Yeh query kyun error deti hai: SELECT category FROM orders WHERE SUM(amount) > 1000 GROUP BY category?",
    options: [
      "SUM function GROUP BY ke bina kabhi use nahi ho sakta",
      "WHERE clause mein aggregate function use nahi kar sakte kyunki WHERE aggregation se pehle execute hota hai",
      "category column GROUP BY mein hona chahiye tha SELECT se pehle",
      "amount column ka data type galat hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — WHERE logically aggregation (jo GROUP BY ke saath hoti hai) se pehle run hota hai, isliye us waqt SUM(amount) ka koi meaning nahi hota, aggregate function ke liye HAVING chahiye. A galat hai, SUM bina GROUP BY ke bhi use ho sakta hai (poori table ka ek summary). C misleading hai — category to yahan sahi jagah hai, real issue WHERE mein aggregate use karna hai. D irrelevant hai, data type se yeh error connected nahi.",
    difficulty: "medium",
  },
  {
    id: "agg-3",
    question: "SELECT customer_id, customer_name, SUM(amount) FROM orders GROUP BY customer_id — yahan customer_name ke saath kya problem hai?",
    options: [
      "customer_name column exist hi nahi karta orders table mein",
      "customer_name na aggregate function ke andar hai na GROUP BY mein — strict mode mein error, loose mode mein unreliable arbitrary value",
      "customer_name ko hamesha SUM ke andar wrap karna zaroori hai",
      "Koi problem nahi hai, yeh perfectly valid aur reliable query hai har database mein",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — jo column na aggregate mein hai na GROUP BY mein, uska value ambiguous hota hai jab ek group mein multiple rows hon; strict SQL (Postgres) is se error dega, MySQL ka loose mode chalne dega but arbitrary value return karega. A galat hai, yeh assumption hai jo question mein specify nahi hai. C galat hai, SUM sirf numeric aggregation ke liye hai, customer_name text hai. D galat hai, yehi is question ka core issue hai.",
    difficulty: "hard",
  },
  {
    id: "agg-4",
    question: "COUNT(*) aur COUNT(phone_number) mein kya difference aata hai jab phone_number column mein kuch NULL values hon?",
    options: [
      "Dono exactly same result denge, NULL se farak nahi padta",
      "COUNT(*) saari rows count karega (NULL sahit), COUNT(phone_number) sirf non-NULL phone_number wali rows count karega",
      "COUNT(phone_number) error dega agar koi NULL mile",
      "COUNT(*) sirf non-NULL rows count karta hai, COUNT(phone_number) saari rows",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — COUNT(*) row existence count karta hai regardless of NULLs, jabki COUNT(column) sirf un rows ko count karta hai jahan uss specific column ka value non-NULL ho. A galat hai, yeh exactly wahi difference hai jo B mein describe hua. C galat hai, NULL milne pe error nahi aata, bas woh row count nahi hoti. D reverse hai, galat direction mein describe kiya gaya hai.",
    difficulty: "easy",
  },
];

export default quiz;
