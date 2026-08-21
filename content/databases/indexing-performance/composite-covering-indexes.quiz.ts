import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "compidx-1",
    question: "Ek composite index `(account_id, transaction_date)` par hai. Query `WHERE transaction_date = '2026-01-01'` (bina account_id filter ke) is index ko efficiently use kar payegi?",
    options: [
      "Haan, kyunki dono columns index mein hain",
      "Nahi, kyunki leftmost-prefix rule ke according index account_id se pehle sorted hai, aur transaction_date values index mein bikhri hui hain",
      "Haan, lekin sirf agar table chhoti ho",
      "Nahi, kyunki composite indexes sirf equality filters ke liye kaam karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Composite index physically account_id ke order mein sorted hota hai, aur uske andar transaction_date sorted hota hai. Sirf transaction_date pe filter karna leftmost column ko skip karta hai, isliye index ka sorted structure is query ke liye kaam nahi aata. Option A galat hai kyunki sirf columns present hone se use guarantee nahi hoti — order matter karta hai. Option C table size se unrelated hai. Option D galat hai — composite indexes range filters bhi handle karte hain, jab tak leftmost prefix maintain ho.",
    difficulty: "medium",
  },
  {
    id: "compidx-2",
    question: "Covering index ka main benefit kya hai?",
    options: [
      "Woh table ka storage size kam kar deta hai",
      "Query poori tarah index se hi answer ho sakti hai, actual table row ko touch kiye bina (index-only scan)",
      "Woh writes ko fast bana deta hai",
      "Woh sirf equality queries ke liye kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Covering index mein query ke saare needed columns (filter + select) present hote hain, isliye database ko extra 'table lookup' step nahi karna padta — yeh index-only scan hai, jo faster hota hai kyunki ek extra random disk read avoid hota hai. Storage (A) actually badhta hai, kam nahi hota, kyunki index wider hai. Writes (C) slower hote hain, faster nahi, extra maintenance cost ki wajah se. Option D galat hai, range queries bhi cover ho sakti hain.",
    difficulty: "easy",
  },
  {
    id: "compidx-3",
    question: "Index `(transaction_date, account_id)` banaya gaya (date pehle, account_id baad mein). 'Get all transactions for account X' query is index se kitna benefit paayegi?",
    options: [
      "Poora benefit, kyunki account_id index mein present hai",
      "Kam ya zero benefit, kyunki account_id leftmost position pe nahi hai aur yeh query ka sabse common filter hai",
      "Yeh index tab hi kaam karega jab table mein bahut kam rows hon",
      "Koi fark nahi padta, column order sirf storage affect karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Column order composite index ki sorted structure decide karta hai. Yahan index date se pehle sorted hai, isliye account_id-only filter is index ko leftmost-prefix rule ke violation ki wajah se efficiently use nahi kar payega — column present hona kaafi nahi hai, position bhi matter karta hai. Options A aur D is rule ko galat represent karte hain. Option C table size se unrelated hai — yeh structural limitation hai, size-dependent nahi.",
    difficulty: "hard",
  },
  {
    id: "compidx-4",
    question: "Composite/covering indexes ko 'speculative' tarike se (bina measured query pattern ke) banana kyun risky hai?",
    options: [
      "Kyunki woh database crash kar sakte hain",
      "Kyunki woh reads ko slow kar dete hain",
      "Kyunki woh writes pe extra maintenance cost daalte hain (index wider hota hai) bina guaranteed read benefit ke",
      "Kyunki SQL databases ek se zyada composite index allow nahi karte",
    ],
    correctIndex: 2,
    explanation:
      "Composite/covering indexes single-column indexes se wider hote hain, isliye har insert/update jo unn columns ko touch kare, extra maintenance cost pay karta hai. Agar index kisi actual hot query pattern ke liye nahi banaya gaya, to yeh cost bina proportional read benefit ke pay hota hai. Option A aur B factually galat hain. Option D bhi galat hai — multiple composite indexes ek table pe allowed hain, bas har ek apna cost laata hai.",
    difficulty: "medium",
  },
];

export default quiz;
