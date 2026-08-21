import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "optpess-1",
    question:
      "Account A ka balance 1000 hai. Do withdrawals (500-500) simultaneously read-then-write pattern se process hote hain, bina kisi locking ke. Final balance kya banega, aur yeh anomaly kya kehlaati hai?",
    options: [
      "Final balance 0 hoga — yeh dirty read hai",
      "Final balance 500 hoga — yeh lost update anomaly hai, ek withdrawal effectively 'lost' ho gaya",
      "Final balance 1000 hi rahega, kyunki database automatically dono ko serialize kar deta hai",
      "Database error throw karega aur koi bhi write nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "Dono transactions ne same starting value (1000) padha, dono ne 500 subtract karke 500 likha — final balance 500 hai jab ki correct answer 0 hona chahiye tha. Yeh lost update anomaly hai. Option A galat hai, dirty read uncommitted data padhne se hota hai, yahan scenario alag hai. Option C galat hai — bina explicit locking mechanism ke, database automatically aisa serialize nahi karta, especially Read Committed jaisa default level ke saath. Option D galat hai, dono UPDATEs successfully execute honge, koi error nahi aayega — yehi is anomaly ki khaas baat hai ki yeh silently hoti hai.",
    difficulty: "easy",
  },
  {
    id: "optpess-2",
    question:
      "`SELECT balance FROM Account WHERE account_id = 'A' FOR UPDATE` chalane ke baad, koi doosra transaction jo isi row ko `FOR UPDATE` se padhne ki koshish karega, uska kya hoga?",
    options: [
      "Turant purani (stale) value dikha di jaayegi",
      "Wait/block karega jab tak pehla transaction commit ya rollback na kar de",
      "Error throw hoga aur transaction fail ho jaayega",
      "Dono transactions parallel chalte rahenge bina kisi interference ke",
    ],
    correctIndex: 1,
    explanation:
      "`FOR UPDATE` row-level lock leta hai — koi bhi doosra transaction jo usi row ko `FOR UPDATE` se access karne ki koshish karega, block ho jaayega jab tak pehla transaction commit/rollback na ho jaaye. Yehi pessimistic locking ka core mechanism hai. Option A galat hai, isolation ka poora point hi hai ki stale data pe kaam na ho. Option C galat hai — default behavior wait karna hai, error nahi (jab tak koi timeout explicitly set na ho). Option D galat hai, `FOR UPDATE` ka poora purpose hi interference prevent karna hai through blocking.",
    difficulty: "medium",
  },
  {
    id: "optpess-3",
    question:
      "Optimistic locking mein `UPDATE Account SET balance = balance - 500, version = version + 1 WHERE account_id = 'A' AND version = 7` chalane pe rows-affected 0 aata hai. Iska sahi matlab kya hai, aur application ko kya karna chahiye?",
    options: [
      "Account exist hi nahi karta — error dikhao customer ko",
      "Kisi doosre transaction ne beech mein version already change kar diya (conflict hua) — application ko fresh value/version dobara padh ke operation retry karna chahiye",
      "Balance already 0 hai, isliye update nahi hua",
      "Yeh database bug hai, kuch nahi karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Rows-affected 0 ka matlab hai WHERE clause ki condition (version = 7) match nahi hui — yaani koi aur transaction ne beech mein version already badal diya. Yeh optimistic locking ka conflict-detection mechanism hai. Correct response hai fresh balance/version padhna aur operation retry karna. Option A galat hai — account exist na karna alag scenario hai (usually different error handling). Option C galat hai, balance ki value se rows-affected ka koi direct relation nahi hai — yeh sirf version match pe depend karta hai. Option D galat hai, yeh expected behavior hai, bug nahi.",
    difficulty: "medium",
  },
  {
    id: "optpess-4",
    question:
      "Ek popular merchant account jo Diwali sale ke din thousands of simultaneous payment credits receive kar raha hai — is scenario ke liye kaunsi locking strategy zyada appropriate hai, aur kyun?",
    options: [
      "Optimistic locking, kyunki yeh hamesha faster hota hai",
      "Pessimistic locking, kyunki high-contention hot row pe optimistic approach bahut saare wasted retries create karega",
      "Dono equally achhe hain, koi farak nahi padta",
      "Koi locking hi zaroori nahi hai agar database Serializable isolation pe hai",
    ],
    correctIndex: 1,
    explanation:
      "High-contention hot rows (jaise popular merchant account pe thousands of simultaneous credits) ke liye pessimistic locking better hai kyunki optimistic approach mein almost har transaction ka version conflict hoga, jisse bahut saare retries honge — wasted CPU aur latency. Pessimistic locking yahan transactions ko serialize kar deta hai jo predictable aur efficient hai is specific high-contention case mein. Option A galat hai — optimistic locking sirf LOW contention mein faster hota hai, high contention mein nahi. Option C galat hai, yeh topic ka poora point hi hai ki contention level ke hisaab se choice matter karti hai. Option D galat hai — Serializable isolation locking ki zaroorat khatam nahi karta, aur high contention pe khud bhi bahut retries/aborts create karega.",
    difficulty: "hard",
  },
];

export default quiz;
