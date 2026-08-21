import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cachebal-1",
    question: "Account metadata (type, branch, product details) ko cache karna generally safe kyun mana jaata hai?",
    options: [
      "Yeh data encrypted hoti hai",
      "Yeh rarely change hoti hai aur agar briefly stale bhi ho, iska koi direct money-related impact nahi hota",
      "Metadata database mein store hi nahi hoti",
      "Metadata ko cache karna legally required hai",
    ],
    correctIndex: 1,
    explanation:
      "Account metadata jaise branch/account-type rarely change karte hain, aur agar cache thodi stale ho, worst case ek minor display inconsistency hoti hai — koi financial decision iske upar directly based nahi hoti. Encryption (A) is discussion se unrelated hai. Metadata database mein store hoti hai (C galat). Yeh legal requirement nahi, ek engineering choice hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "cachebal-2",
    question: "Current balance ko naively cache karna kyun dangerous hai?",
    options: [
      "Balance data bahut bada hota hai storage ke liye",
      "Stale cached balance se customer overdraft kar sakta hai ya ek legitimate transaction galti se decline ho sakta hai",
      "Redis balance data type support nahi karta",
      "Balance kabhi change hi nahi hota isliye cache karne ka koi fayda nahi",
    ],
    correctIndex: 1,
    explanation:
      "Agar cached balance actual (lower) balance se stale/higher ho, customer usse zyada spend kar sakta hai jitna available hai — ya stale data ke wajah se galat approve/decline decision ban sakta hai. Yeh ek direct financial risk hai jo typical web-app caching se bahut zyada severe hai. Storage size (A) issue nahi hai. Redis data types (C) is problem se unrelated hain. Balance frequently change hota hai (D galat) — isiliye toh yeh problem hai.",
    difficulty: "easy",
  },
  {
    id: "cachebal-3",
    question: "Balance ko safely handle karne ke do patterns discuss kiye gaye — woh kya hain?",
    options: [
      "Balance ko har 24 ghante mein ek baar refresh karo",
      "(1) Authoritative check ke liye cache use hi mat karo, hamesha primary DB hit karo, ya (2) cache ko sirf UI display hint ki tarah use karo jo actual transaction se pehle re-verify hota hai",
      "Balance ko sirf weekends mein cache karo",
      "Balance cache ko kabhi expire mat hone do",
    ],
    correctIndex: 1,
    explanation:
      "Dono safe patterns hain: ya to authoritative debit-time check hamesha primary database se ho (no cache in the decision path), ya cache sirf fast display/pre-check hint ke roop mein use ho jise actual money-movement se pehle source of truth se re-verify kiya jaaye. Baaki options (A, C, D) arbitrary aur incorrect hain — yeh actual patterns nahi hain jo topic mein discuss hue.",
    difficulty: "medium",
  },
  {
    id: "cachebal-4",
    question: "Daily transaction limit check (jaise 'max 10 UPI transactions per day') ke liye Redis INCR-based counter ko 'cache' kyun nahi kehna chahiye?",
    options: [
      "Kyunki Redis technically ek database hai, cache nahi",
      "Kyunki yeh counter khud hi is check ka primary/authoritative store hai, na ki kisi database value ki copy — database-backed check itna slow hota ki har-transaction check ke liye impractical hota",
      "Kyunki daily limits BFSI mein exist hi nahi karte",
      "Kyunki Redis counters kabhi expire nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "Yeh key distinction hai: Redis counter database mein kisi existing authoritative value ko cache nahi kar raha — yeh khud hi authoritative, live count hai (database mein separate source-of-truth count maintain nahi hota jise yeh sync kare). Isse primary mechanism banaya gaya hai kyunki per-transaction DB-backed check bahut slow hota. Redis 'technically database hai' (A) yahan point nahi hai — point yeh hai ki iska role primary store ka hai, cache ka nahi. Daily limits genuinely exist karte hain (C galat). Counter keys explicitly daily-expiring (86400s) set kiye jaate hain (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
