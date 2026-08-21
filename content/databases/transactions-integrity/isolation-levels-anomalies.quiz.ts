import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "isolvl-1",
    question:
      "T1 Account A ka balance debit karta hai lekin commit nahi karta. T2 usi waqt A ka balance padh leta hai (uncommitted value). T1 phir ROLLBACK ho jaata hai. Yeh kaunsi anomaly hai, aur kaunsa isolation level ise prevent karta hai?",
    options: [
      "Non-repeatable read; Repeatable Read se prevent hota hai",
      "Dirty read; Read Committed ya usse strict koi bhi level prevent karta hai",
      "Phantom read; sirf Serializable prevent karta hai",
      "Yeh koi anomaly nahi hai, normal behavior hai",
    ],
    correctIndex: 1,
    explanation:
      "T2 ne T1 ka UNCOMMITTED data padha — yeh exactly dirty read ki definition hai. Read Committed level (aur usse strict sab levels) guarantee karta hai ki sirf committed data hi padha jaaye, isliye yeh prevent ho jaata. Non-repeatable read (A) same transaction ke andar ek hi row ki do reads mismatch hone se hota hai, yahan scenario alag hai. Phantom read (C) naye rows insert/delete hone se hota hai, yeh scenario existing row ke uncommitted value se related hai. Option D galat hai — yeh ek genuine correctness problem hai jo galat downstream decisions le sakti hai.",
    difficulty: "easy",
  },
  {
    id: "isolvl-2",
    question:
      "T1 ek transaction ke andar Account A ka balance do baar padhta hai aur do alag values milti hain, kyunki beech mein T2 ne ek transfer commit kar diya. Read Committed is anomaly ko prevent karta hai ya nahi?",
    options: [
      "Haan, Read Committed non-repeatable reads bhi prevent karta hai",
      "Nahi, Read Committed sirf dirty reads prevent karta hai — non-repeatable read ke liye Repeatable Read ya strict level chahiye",
      "Yeh sirf Read Uncommitted mein hota hai, Read Committed mein possible hi nahi",
      "Isolation level se koi farak nahi padta, yeh hamesha hoga",
    ],
    correctIndex: 1,
    explanation:
      "Read Committed sirf yeh guarantee karta hai ki tum kabhi kisi ka uncommitted data nahi padhoge — lekin agar doosra transaction beech mein commit kar de, tumhari agli read us naye committed value ko dikha sakti hai, jo non-repeatable read hai. Ise prevent karne ke liye Repeatable Read ya usse strict level chahiye (jo snapshot-consistency provide karta hai). Option A galat hai — yehi is topic ka key nuance hai. Option C galat hai kyunki non-repeatable read Read Committed mein bhi possible hai, sirf Read Uncommitted mein nahi. Option D galat hai kyunki isolation level directly determine karta hai ki yeh anomaly possible hai ya nahi.",
    difficulty: "medium",
  },
  {
    id: "isolvl-3",
    question:
      "Zyadatar production databases default kaunsa isolation level use karte hain, aur kyun?",
    options: [
      "Serializable, kyunki BFSI systems mein correctness sabse zaroori hai",
      "Read Uncommitted, kyunki yeh sabse fast hai",
      "Read Committed, kyunki yeh performance aur correctness ka reasonable balance deta hai — Serializable ka locking/retry overhead high-throughput systems mein zyada costly hota hai",
      "Repeatable Read, kyunki yeh SQL standard ka mandatory default hai",
    ],
    correctIndex: 2,
    explanation:
      "Production databases (jaise PostgreSQL) Read Committed ko default rakhte hain kyunki yeh dirty reads jaisa sabse dangerous anomaly prevent karta hai jabki throughput high rakhta hai — Serializable jaisa strict level zyada aborts/retries lata hai jo high-concurrency systems mein latency aur contention badha deta hai. Option A galat hai — yeh exactly woh naive assumption hai jo is topic mein explicitly warn kiya gaya hai. Option B galat hai, Read Uncommitted itna unsafe hai ki financial systems mein practically use hi nahi hota. Option D galat hai, SQL standard koi single mandatory default define nahi karta, aur Read Committed hi most common default hai.",
    difficulty: "medium",
  },
  {
    id: "isolvl-4",
    question:
      "Ek interview mein candidate bolta hai: 'Hum hamesha Serializable isolation level use karte hain, isse sab race conditions solve ho jaate hain.' Yeh answer kyun weak signal hai?",
    options: [
      "Kyunki Serializable actually koi anomaly prevent nahi karta",
      "Kyunki yeh throughput cost ignore karta hai — real systems har operation ke liye loosest isolation level choose karte hain jo abhi bhi safe ho, na ki blanket Serializable everywhere",
      "Kyunki Serializable sirf read-only queries pe apply hota hai",
      "Kyunki Serializable deprecated hai modern databases mein",
    ],
    correctIndex: 1,
    explanation:
      "Blanket Serializable everywhere use karna throughput ko significantly hurt kar sakta hai, especially high-contention hot rows pe, jahan transactions frequently abort/retry hone lagti hain. Real BFSI-scale systems per-operation basis pe decide karte hain — kuch reads Read Committed pe fine hain, sirf genuinely critical write operations ko strict isolation ya explicit locking chahiye. Option A factually galat hai — Serializable sabse strict level hai aur sab teen anomalies prevent karta hai, yehi iska point hai. Option C galat hai, Serializable reads aur writes dono pe apply hota hai. Option D bhi galat hai, Serializable ek standard SQL isolation level hai, deprecated nahi.",
    difficulty: "hard",
  },
];

export default quiz;
