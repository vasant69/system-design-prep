import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-storage-lifecycle-1",
    question:
      "Tumhare paas 1 million objects hain, har ek ~10 KB ka. Unhe Standard-IA me move karne se pehle kya cheez check karni chahiye?",
    options: [
      "Kuch nahi — Standard-IA hamesha Standard se sasta hota hai per-GB rate ki wajah se",
      "Standard-IA ka 128 KB minimum billable size — 10 KB objects 128 KB ke hisaab se bill honge, jisse actual cost Standard se ~7x zyada ho sakta hai",
      "Sirf ye ki objects public hain ya private",
      "Sirf ye ki bucket versioning enabled hai ya nahi",
    ],
    correctIndex: 1,
    explanation:
      "Standard-IA me 128 KB minimum billable object size hai. 10 KB ke 1M objects Standard me 10 GB × $0.025 = $0.25 hote, lekin IA me 128 GB (128 KB × 1M) × $0.014 = $1.79 ban jaate — ~7x mehnga. Option A galat hai kyunki per-GB rate poori kahani nahi hai. Options C aur D is decision se irrelevant hain.",
    difficulty: "medium",
  },
  {
    id: "s3-storage-lifecycle-2",
    question:
      "Ek lifecycle rule likhi gayi hai jo Glacier Deep Archive me transition karti hai 5 KB ke objects ke liye, koi size filter ke bina. Ye rule production me kya problem create kar sakti hai?",
    options: [
      "Koi problem nahi, Deep Archive sabse sasta storage class hai isliye ye hamesha behtar hai",
      "One-time transition charge + Glacier ka 32-40 KB metadata overhead, chhote object ke poore mahine ke storage cost se zyada ho sakta hai — transition hi loss ban jaata hai",
      "Deep Archive chhote objects accept hi nahi karta, PUT fail ho jaayega",
      "Ye sirf directory buckets me problem hai",
    ],
    correctIndex: 1,
    explanation:
      "Chhote objects ko Glacier me transition karna paisa barbaad karta hai — one-time transition charge aur 32-40 KB ka metadata overhead mil kar us object ke ek+ mahine ke storage cost se zyada ho sakte hain. Isliye lifecycle rules me ObjectSizeGreaterThan (typically ~128 KB) filter lagana zaroori hai. Option A galat hai kyunki per-GB price poori kahani nahi hai. Option C galat hai (Deep Archive chhote objects accept karta hai, bas economically bura hai). Option D irrelevant hai.",
    difficulty: "hard",
  },
  {
    id: "s3-storage-lifecycle-3",
    question:
      "S3 Intelligent-Tiering ka sabse bada structural fark Standard-IA se kya hai jo ise 'insurance' jaisa banata hai?",
    options: [
      "Intelligent-Tiering me storage rate hamesha Standard-IA se kam hota hai",
      "Intelligent-Tiering me Frequent/Infrequent/Archive Instant tiers ke beech movement pe koi retrieval fee nahi lagti, jabki manually Standard-IA me daala object har GB read pe $0.01 charge karta hai",
      "Intelligent-Tiering sirf Glacier classes ke liye kaam karta hai",
      "Intelligent-Tiering me minimum storage duration bilkul nahi hota, jabki Standard-IA me 30 din hai",
    ],
    correctIndex: 1,
    explanation:
      "Intelligent-Tiering ka core value ye hai ki tier ke beech automatic movement pe (Frequent/Infrequent/Archive Instant) koi retrieval fee nahi lagti — agar access pattern unpredictable nikle, koi bill-shock nahi aata. Standard-IA me manually daala object har GB read par $0.01 charge karta hai. Option A galat hai — rates alag scenarios me alag compare hote hain. Option C galat hai, ye Frequent se Archive Instant tak automatically move karta hai. Option D bhi galat premise hai — asli differentiator retrieval fee ka na hona hai, duration nahi.",
    difficulty: "medium",
  },
  {
    id: "s3-storage-lifecycle-4",
    question:
      "Average object size ~200 KB hai ek bucket me, aur access pattern completely unpredictable hai. Intelligent-Tiering worth hai ya nahi, given ~228 KB ka break-even point?",
    options: [
      "Haan, kyunki 200 KB Standard-IA ke 128 KB minimum se bada hai",
      "Marginal case hai — 200 KB break-even (~228 KB) se thoda neeche hai, isliye monitoring fee tier savings ko lagbhag kha jaayegi; par unpredictable access pattern ki wajah se retrieval-fee-risk avoid karna phir bhi valuable ho sakta hai",
      "Nahi, kyunki Intelligent-Tiering sirf 1 MB+ objects ke liye design hua hai",
      "Isse koi fark nahi padta, sab storage classes same cost dete hain",
    ],
    correctIndex: 1,
    explanation:
      "Break-even math ke hisaab se object size > ~228 KB hona chahiye taaki tier-difference savings monitoring fee se zyada ho. 200 KB is threshold ke thoda neeche hai, to pure cost-savings ke nazariye se ye marginal/negative hai. Lekin Intelligent-Tiering ka doosra fayda — retrieval fee ka zero hona, jo unpredictable access pattern me risk-insurance ki tarah kaam karta hai — is case me alag se consider karna chahiye. Option A 128 KB IA ka threshold hai, Intelligent-Tiering ka nahi. Option C galat hai (koi aisa fixed minimum nahi hai). Option D clearly galat hai.",
    difficulty: "hard",
  },
];

export default quiz;
