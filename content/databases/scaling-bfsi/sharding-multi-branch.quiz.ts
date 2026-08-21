import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "shardbr-1",
    question: "`branch_id` ko sharding key choose karne ka sabse bada risk kya hai?",
    options: [
      "Branch IDs unique nahi hote",
      "Uneven branch sizes ke wajah se kuch shards heavily overloaded (hotspot) ho jaate hain jabki baaki underutilized",
      "Branch_id kabhi change nahi hota",
      "Yeh SQL mein sharding key ke roop mein invalid hai",
    ],
    correctIndex: 1,
    explanation:
      "Bade urban branches ke paas chhoti rural branches se kahin zyada accounts/transactions hote hain — agar shard branch_id se ho, to kuch shards massively overloaded honge (hotspot) aur baaki idle. Uniqueness (A) issue nahi hai. Branch_id change na hona (C) is context mein irrelevant hai. Yeh SQL restriction (D) nahi hai — koi bhi column sharding key ban sakta hai.",
    difficulty: "easy",
  },
  {
    id: "shardbr-2",
    question: "customer_id/account_id ka hash use karke shard karne se kya breaks ho jaata hai?",
    options: [
      "Account balance calculation galat ho jaata hai",
      "Branch-local queries (jaise 'is branch ke aaj ke saare transactions') ko har shard pe fan-out karna padta hai",
      "Customer login fail hone lagta hai",
      "Sharding ka poora concept invalid ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Hash-based sharding accounts ko evenly distribute karta hai, lekin ek branch ke accounts ab multiple shards mein spread ho jaate hain — isliye branch-local reporting query ko har shard query karke results merge karna padta hai (fan-out), jo latency/complexity badhata hai. Balance calculation (A) affect nahi hota. Login (C) is problem se unrelated hai. Sharding concept (D) invalid nahi hota, sirf iska ek specific trade-off hai.",
    difficulty: "medium",
  },
  {
    id: "shardbr-3",
    question: "Do accounts alag-alag shards pe hain aur unke beech fund transfer karna hai. Yeh kyun harder ho jaata hai single-database case ke comparison mein?",
    options: [
      "Network latency bahut zyada badh jaati hai",
      "Ab yeh single local ACID transaction nahi rehta — saga pattern ya 2PC jaisa distributed coordination chahiye hota hai",
      "Alag shards ke beech transfer legally allowed nahi hai",
      "Sharding automatically transfers ko block kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab dono accounts ek hi database mein hote hain, transfer ek simple BEGIN...COMMIT transaction hoti hai. Alag shards pe hone se yeh atomicity guarantee break ho jaata hai — ab saga pattern ya 2PC se explicitly coordinate karna padta hai, including partial-failure handling (compensating transactions). Latency (A) ek factor ho sakta hai lekin core problem nahi hai. Legal restriction (C) aur automatic blocking (D) dono galat/irrelevant hain.",
    difficulty: "hard",
  },
  {
    id: "shardbr-4",
    question: "Guide ke mutabik, zyaadatar core banking systems apna unified ledger ko sharding se kyun avoid karte hain jitna possible ho?",
    options: [
      "Sharding technically banking data pe kaam hi nahi karta",
      "Vertical scaling + achhi indexing/partitioning ek single bank ke OLTP load ke liye surprisingly far chal jaata hai, aur sharding cross-shard transaction complexity add karta hai",
      "Regulators sharding ko explicitly banned karte hain",
      "Sharding sirf NoSQL databases ke liye applicable hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek single, well-tuned primary (vertical scaling + partitioning/indexing) ek bank ka OLTP load handle karne ke liye often sufficient hota hai — aur sharding ka cost (cross-shard transaction complexity, saga/2PC coordination) itna high hai ki isse tabhi apply karna chahiye jab genuinely zaroorat ho. Sharding technically kaam karta hai (A galat). Regulatory ban (C) fabricated hai. Sharding relational databases pe bhi apply hota hai (D galat).",
    difficulty: "medium",
  },
];

export default quiz;
