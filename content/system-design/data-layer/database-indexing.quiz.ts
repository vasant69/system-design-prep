import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "di-1",
    question: "Databases index ke liye B-Tree use karte hain, plain binary tree nahi. Iski asli wajah kya hai?",
    options: [
      "B-Tree binary tree se implement karna aasan hai",
      "B-Tree ka wide fan-out tree ki depth kam rakhta hai, isliye kam disk seeks lagte hain — jabki binary tree same data ke liye bahut zyada levels deep hota",
      "Binary tree sirf integers store kar sakta hai, strings nahi",
      "B-Tree memory mein hota hai, binary tree disk pe",
    ],
    correctIndex: 1,
    explanation:
      "B-Tree har node mein hundreds of keys fit karta hai (disk page size ke hisaab se), isliye 10 lakh+ rows sirf 3-4 levels deep tree mein aa jaate hain — matlab kam disk seeks. Binary tree har node mein sirf 2 keys rakhta hai to depth bahut zyada ho jaati (~20 levels), jo zyada disk I/O maangta. Implementation ease (A) core reason nahi hai. Binary tree strings bhi store kar sakta hai (C galat). Dono disk-backed ho sakte hain, memory/disk distinction wajah nahi hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "di-2",
    question: "Ek table pe composite index `(city, category, created_at)` bana hai. Ek query hai `WHERE category = 'electronics'` (sirf category filter, city nahi). Kya yeh index is query ke liye use hoga?",
    options: [
      "Haan, kyunki category index mein kahin na kahin present hai",
      "Nahi, kyunki leftmost prefix rule ke hisaab se city (sabse pehla column) filter mein missing hai, isliye database index efficiently use nahi kar sakta",
      "Haan, lekin sirf tab jab query mein ORDER BY bhi ho",
      "Nahi, kyunki composite indexes sirf 2 columns tak support karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Leftmost prefix rule ke hisaab se composite index tabhi efficiently use hota hai jab query leftmost column(s) se filter kare. Yahan `city` missing hai, isliye database is index ko is query ke liye use nahi kar payega (full scan ya alag index chahiye hoga). Category kahin present hona (A) leftmost rule ko nahi todta, use nahi hota. ORDER BY (C) is limitation ko change nahi karta. Composite indexes 2 se zyada columns support kar sakte hain (D galat).",
    difficulty: "hard",
  },
  {
    id: "di-3",
    question: "Ek write-heavy events-logging table pe 8 indexes hain, aur insert latency slow ho gayi hai. Sabse likely reason kya hai?",
    options: [
      "Indexes sirf reads ko affect karte hain, insert latency ka indexes se koi lena-dena nahi",
      "Har insert ko table row ke saath-saath sabhi 8 indexes ko bhi update karna padta hai, isliye zyada indexes = zyada write overhead",
      "8 indexes se database automatically slow mode mein chala jaata hai",
      "Yeh sirf tab hota hai jab primary key missing ho",
    ],
    correctIndex: 1,
    explanation:
      "Har index ek alag data structure hai jise har insert/update/delete par bhi update karna padta hai — jitne zyada indexes, utna zyada per-write overhead. Indexes reads ko fast karte hain lekin writes ko slow karte hain, yeh classic trade-off hai (A galat premise). Koi 'slow mode' concept nahi hai (C). Primary key se is problem ka direct connection nahi hai (D galat) — yeh kisi bhi extra secondary index ke saath hota hai.",
    difficulty: "medium",
  },
  {
    id: "di-4",
    question: "Ek boolean column `is_active` (jisme sirf true/false values hain, roughly 70% true) pe index banaya gaya, lekin query plan (`EXPLAIN`) dikhata hai database ab bhi full table scan kar raha hai us column ko filter karte waqt. Yeh kyun ho raha hai?",
    options: [
      "EXPLAIN command galat output de raha hai, bug hai database mein",
      "Boolean column ka index corrupt ho gaya hai",
      "Low cardinality (sirf 2 distinct values, ek value ka bada chunk match karta hai) ki wajah se query planner ne judge kiya ki index se filter karke row fetch karna, seedha full scan se zyada costly hoga",
      "Index sirf numeric columns pe kaam karta hai, boolean pe nahi",
    ],
    correctIndex: 2,
    explanation:
      "Low-cardinality columns (jaise boolean, jahan ek value bhi 70% rows match karta hai) ke liye index se filter karke phir har matching row fetch karna, seedha table scan karne se zyada expensive ho sakta hai — isliye planner intelligently index ignore kar deta hai. EXPLAIN buggy nahi hai (A galat) — yeh exactly is decision ko surface karne ke liye hai. Index corruption ek alag, rare issue hai (B). Indexes boolean columns pe bhi kaam karte hain, technically valid hote hain (D galat) — issue selectivity ka hai, support ka nahi.",
    difficulty: "hard",
  },
];

export default quiz;
