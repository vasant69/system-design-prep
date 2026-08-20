import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nfi-1",
    question:
      "Fan-out-on-write (push) model ka sabse bada problem kab surface hota hai?",
    options: [
      "Jab ek naya user sign up karta hai lekin kisi ko follow nahi karta",
      "Jab ek celebrity account (jiske tens of millions followers hain) post karta hai — ek single post ka matlab lakhon/crores writes ban jaata hai",
      "Jab user apna feed refresh karta hai baar baar",
      "Jab ek post delete kiya jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Push model mein har post ke liye har follower ke feed cache mein write hota hai — celebrity ke case mein yeh tens of millions of writes ek single post ke liye ban jaata hai, jo massive write amplification hai. Naya user (A) is problem se unrelated hai. Feed refresh (C) ek read operation hai, push model ka issue nahi. Post delete (D) alag concern hai, fan-out ka nahi.",
    difficulty: "easy",
  },
  {
    id: "nfi-2",
    question:
      "Real production news feed systems (jaise Instagram) actually kaunsa approach use karte hain?",
    options: [
      "Purely fan-out-on-write, sab accounts ke liye same tarah",
      "Purely fan-out-on-read, sab accounts ke liye same tarah",
      "Hybrid — regular users ke liye push, celebrity/high-follower accounts ke liye pull, dono ko read-time par merge kiya jaata hai",
      "Koi bhi fan-out nahi — har feed request database ka ek full table scan karti hai",
    ],
    correctIndex: 2,
    explanation:
      "Production systems hybrid approach use karte hain — regular users ke posts push hote hain follower caches mein (fast reads), lekin celebrity posts push nahi hote, unhe read-time par pull karke merge kiya jaata hai. Purely push (A) celebrity write explosion se toot jaata hai. Purely pull (B) normal users ke liye bhi har feed load ko expensive bana deta hai. Full table scan (D) is scale pe practically impossible hai.",
    difficulty: "medium",
  },
  {
    id: "nfi-3",
    question:
      "Feed cache (jaise Redis) mein typically kya store kiya jaata hai, poora post content ya kuch aur?",
    options: [
      "Poora post content (text, image bytes, sab kuch) directly cache mein",
      "Sirf post IDs (ek per-user sorted list), actual content alag se denormalized fetch hota hai read time par",
      "Sirf follower count, post data nahi",
      "Kuch bhi nahi, cache sirf ranking scores store karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Feed cache mein recent post IDs store hote hain (jaise ek per-user sorted structure, timestamp se sorted), actual post content (text, media URL, likes) separately fetch hota hai jab feed assemble ho raha ho. Poora content cache mein rakhna (A) cache ko bloat karta hai aur edits/deletes handle karna mushkil banata hai. Follower count (C) aur sirf ranking scores (D) dono incomplete/galat description hain is cache ke actual purpose ka.",
    difficulty: "medium",
  },
  {
    id: "nfi-4",
    question:
      "Ek naya post follower ke feed mein turant nahi, 1-2 second delay ke saath dikhta hai. Yeh news feed system ke context mein kaisa issue hai?",
    options: [
      "Yeh ek critical bug hai jise turant fix karna chahiye, jaise payment system mein wrong balance",
      "Yeh acceptable hai — feed system explicitly eventual consistency ke saath design hota hai, availability aur read speed ko strong consistency se zyada priority di jaati hai",
      "Yeh sirf tab acceptable hai jab user offline ho",
      "Is system mein aisa delay ho hi nahi sakta agar design sahi ho",
    ],
    correctIndex: 1,
    explanation:
      "News feed systems AP-leaning hote hain (payment systems ke bilkul ulta jo CP hote hain) — chhota delay ya thoda stale feed acceptable hai, kyunki availability aur fast reads yahan zyada priority rakhte hain strong consistency se. Ise critical bug (A) maanna is system ki fundamental design philosophy ko galat samajhna hai. Yeh online/offline (C) se independent hai. Delay ka zero ho jaana (D) unrealistic hai kisi bhi distributed push-based system mein.",
    difficulty: "hard",
  },
];

export default quiz;
