import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "indexes-and-query-performance-1",
    question: "Ek table pe kitne clustered indexes ho sakte hain?",
    options: ["Jitne chahe utne", "Sirf ek", "Zyada se zyada teen", "Zero, clustered index deprecated hai"],
    correctIndex: 1,
    explanation: "Sahi jawab 'Sirf ek' hai, kyunki clustered index table ki physical row ordering define karta hai — ek table ek hi physical order mein disk pe store ho sakta hai. Non-clustered indexes multiple ho sakte hain kyunki woh separate structures hote hain, physical order nahi define karte. 'Zero' galat hai kyunki clustered index common aur useful concept hai, deprecated nahi.",
    difficulty: "easy",
  },
  {
    id: "indexes-and-query-performance-2",
    question: "Composite index `(customer_id, status, order_date)` hai. Query `WHERE status = shipped AND order_date > X` hai (customer_id filter nahi hai). Yeh index kitna help karega?",
    options: ["Poori tarah help karega, sabse fast query hogi", "Almost bekaar hoga kyunki leftmost column customer_id use nahi ho raha", "Sirf order_date part help karega", "Composite index column order matter nahi karta"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki yeh index almost bekaar hai — B-Tree leftmost-prefix rule ke hisaab se navigate hota hai, aur agar query us leftmost column (customer_id) ko filter hi nahi karti, to database us index ko efficiently use nahi kar sakta. 'Poori tarah help karega' galat hai kyunki leftmost column missing hai. 'Column order matter nahi karta' bilkul galat hai — composite index ka poora point hi column order pe depend karta hai.",
    difficulty: "medium",
  },
  {
    id: "indexes-and-query-performance-3",
    question: "`WHERE email LIKE %gmail.com%` jaisi query pe normal B-Tree index kyun help nahi karta?",
    options: ["Kyunki email column string type hai", "Kyunki leading wildcard ke wajah se sorted-prefix navigation possible nahi hai", "Kyunki LIKE operator databases support hi nahi karte", "Kyunki email column mein NULL values ho sakte hain"],
    correctIndex: 1,
    explanation: "Sahi jawab hai leading wildcard wala reason — B-Tree sorted values pe based hota hai aur prefix se navigate karta hai, lekin agar pata hi nahi ki string kahan se start hoti hai (leading %), to sorted structure use hi nahi ho sakta. String type ya NULL values ka isse koi lena-dena nahi hai. LIKE operator sab databases support karte hain, yeh galat statement hai.",
    difficulty: "medium",
  },
  {
    id: "indexes-and-query-performance-4",
    question: "Covering index ka main benefit kya hai?",
    options: ["Yeh table ka storage size kam kar deta hai", "Query ko poori tarah index se hi answer mil jaata hai, table heap tak jaane ki zaroorat nahi padti", "Yeh writes ko fast bana deta hai", "Yeh sirf range queries ke liye kaam karta hai, equality ke liye nahi"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki covering index mein query ke saare needed columns already index ke andar hote hain, isliye index-only scan ho jaata hai aur table heap access avoid ho jaata hai. Storage size covering index se badhta hai, kam nahi hota (extra columns include karne se). Writes slow hote hain, fast nahi, kyunki extra index maintain karna padta hai. Yeh equality aur range dono queries ke liye kaam kar sakta hai.",
    difficulty: "hard",
  },
];

export default quiz;
