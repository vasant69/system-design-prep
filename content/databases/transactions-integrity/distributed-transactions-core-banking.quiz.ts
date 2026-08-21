import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "disttx-1",
    question:
      "Modern BFSI platforms mein core ledger, rewards, aur notifications alag-alag databases wali independent services kyun ban jaati hain, jo distributed transaction problem ko janam deti hain?",
    options: [
      "Kyunki ek single database itna data handle nahi kar sakta",
      "Kyunki microservices architecture mein har team apni service ko independently scale, deploy, aur own karna chahti hai — is split ka cost yeh hai ki ek ACID transaction ab poore operation ko cover nahi kar sakta",
      "Kyunki SQL databases cross-service transactions support hi nahi karte kabhi bhi",
      "Kyunki regulatory rules alag databases mandate karte hain har service ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Microservices split independent scaling/deployment/ownership ke liye hota hai — yeh ek deliberate architectural choice hai, data volume ki majboori nahi. Iska direct cost yeh hai ki cross-service atomicity ab single local transaction se guarantee nahi ho sakti. Option A galat hai — modern databases bahut bada data handle kar sakte hain single instance/cluster mein bhi, yeh split ka primary reason nahi hai. Option C misleading hai — single database ke andar transactions to normally kaam karte hain, problem cross-DATABASE hai jab services split ho jaati hain. Option D galat hai, yeh generically regulatory requirement nahi hai, architectural decision hai.",
    difficulty: "easy",
  },
  {
    id: "disttx-2",
    question:
      "Two-Phase Commit (2PC) BFSI scale pe rarely kyun use hota hai, iski theoretical atomicity guarantee ke bawajood?",
    options: [
      "Kyunki 2PC data ko corrupt kar deta hai",
      "Kyunki coordinator crash hone pe participants indefinitely blocked reh sakte hain, aur coordinator khud ek single point of failure hai — yeh poor availability aur scaling issues create karta hai",
      "Kyunki 2PC sirf NoSQL databases ke saath kaam karta hai",
      "Kyunki 2PC financial data ke liye legally allowed nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "2PC ka core problem practical hai, correctness ka nahi — coordinator ke prepare phase ke baad crash hone se participants apne locks/resources indefinitely hold kiye reh sakte hain (blocking), aur poora protocol ek central coordinator pe depend karta hai jo khud SPOF hai. High-throughput systems mein yeh availability aur latency dono ko hurt karta hai. Option A galat hai, 2PC correctly implement hone pe data corrupt nahi karta — yeh iska issue nahi hai. Option C factually galat hai, 2PC relational databases ke saath bhi kaam karta hai. Option D bhi galat hai, koi aisi legal restriction nahi hai.",
    difficulty: "medium",
  },
  {
    id: "disttx-3",
    question:
      "Ledger transfer successfully complete ho chuka hai (local ACID transaction, committed). Uske baad Rewards service mein cashback credit karne wala step fail ho jaata hai. Saga pattern ke hisaab se sahi response kya hai?",
    options: [
      "Poora transfer bhi rollback karo, kyunki overall operation fail hua",
      "Sirf ek compensating transaction ('ReverseCashback') run karo agar cashback partially apply hua tha — transfer khud rollback nahi hota, kyunki woh already correctly complete ho chuka tha",
      "Kuch mat karo, dono steps independent hain aur unrelated treat karo",
      "Poore system ko manual review ke liye flag karo aur customer ko error dikhao ki transfer fail ho gaya",
    ],
    correctIndex: 1,
    explanation:
      "Saga ka core philosophy hai: har local transaction apne aap mein complete aur correct hai. Transfer already successfully commit ho chuka tha — usse rollback karna galat hoga kyunki woh valid tha. Sirf downstream failed step (rewards) ka effect compensate hota hai. Option A galat hai — yeh 2PC jaisi 'sab ya kuch nahi' thinking hai, Saga isse deliberately avoid karta hai. Option C galat hai, failure ko silently ignore karna incorrect state (missing/partial cashback) chhod sakta hai bina resolve kiye. Option D galat hai — customer ko batana ki 'transfer fail ho gaya' galat hai, kyunki transfer actually successful tha; sirf ek downstream perk affected hua.",
    difficulty: "medium",
  },
  {
    id: "disttx-4",
    question:
      "Saga pattern mein har local transaction apni business change ke saath ek outbox event bhi 'same atomic transaction' mein kyun likhta hai, alag transaction mein kyun nahi?",
    options: [
      "Performance ke liye — do transactions ek se zyada latency lete hain",
      "Agar business change aur event alag transactions mein likhe jaayein, to beech mein crash hone se event permanently miss ho sakta hai — same transaction mein hone se guarantee milti hai ki agar change commit hua, event bhi guaranteed commit hua",
      "Database engines multiple transactions ek saath allow hi nahi karte",
      "Isse koi farak nahi padta, dono approaches equally reliable hain",
    ],
    correctIndex: 1,
    explanation:
      "Yeh reliability ka sawaal hai, performance ka nahi. Agar business change aur event-write alag transactions hon, ek crash beech mein ho sakta hai jisse business change commit ho jaaye lekin event kabhi likha hi na jaaye (ya vice versa) — is se saga ka agla step kabhi trigger hi nahi hoga, silently. Same atomic transaction mein dono likhne se yeh guarantee milti hai ki dono ek saath commit hote hain ya dono nahi. Option A galat hai — yeh primarily correctness ka issue hai. Option C factually galat hai. Option D poori tarah galat hai, yehi difference is topic ka core insight hai (aur agle topic — Outbox Pattern — ka bhi).",
    difficulty: "hard",
  },
];

export default quiz;
