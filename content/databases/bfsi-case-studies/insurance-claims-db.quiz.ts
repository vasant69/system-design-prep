import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "insclaim-1",
    question: "Insurance claims processing ka non-functional priority profile doosre BFSI case studies (jaise credit card authorization) se kaise alag hai?",
    options: [
      "Claims processing mein bhi sabse important cheez raw throughput aur sub-second latency hai",
      "Claims processing correctness aur auditability ko throughput se zyada priority deta hai - yeh real-time hot path nahi hai",
      "Claims processing ke liye koi consistency requirement hi nahi hoti",
      "Claims aur card authorization dono exactly same priority profile share karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Insurance claims processing comparatively low-volume/low-throughput workload hai jahan poori workflow history aur auditability sabse zyada matter karti hai, na ki raw transaction throughput ya millisecond-level latency jaisa card authorization mein hota hai. Options A, C, D is core contrast ko galat represent karte hain.",
    difficulty: "easy",
  },
  {
    id: "insclaim-2",
    question: "ClaimStatusHistory table ko append-only kyun design kiya jaata hai, purane rows update karne ke bajaye?",
    options: [
      "Kyunki append-only tables database mein tezi se query hoti hain hamesha",
      "Kyunki claim ki poori workflow history (customer transparency aur regulatory dispute dono ke liye) reconstructable honi chahiye, sirf current status nahi",
      "Kyunki SQL databases UPDATE statements support nahi karte",
      "Kyunki har insurance company ke paas storage unlimited hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Append-only history ensure karta hai ki har status transition (kab, kisne, kyun) permanently traceable rahe - yeh customer dispute resolution aur regulatory audit dono ke liye zaroori hai. Purane rows edit karne se yeh trail toot jaata hai. Options A, C, D galat/irrelevant reasoning hain.",
    difficulty: "medium",
  },
  {
    id: "insclaim-3",
    question: "Claim ke attached documents (bills, photos, medical reports) ko schema mein kaise store karna best practice hai?",
    options: [
      "Actual files ko ek BLOB column mein database ke andar hi store karo",
      "Files object storage (jaise S3) mein rakho, database mein sirf metadata/reference (storage_url) store karo",
      "Files ko base64 encode karke JSON column mein daal do",
      "Documents store hi nahi karne chahiye, sirf claim ka text description kaafi hai",
    ],
    correctIndex: 1,
    explanation:
      "Actual files object storage mein rakhna best practice hai - relational databases file-serving ke liye optimize nahi hote, BLOB storage se bloat aur slow backups hote hain. Database mein sirf lightweight reference (storage_url) rakhna scalable aur clean design hai. Options A, C, D anti-patterns ya incomplete hain.",
    difficulty: "medium",
  },
  {
    id: "insclaim-4",
    question: "Ek claim reject hone ke baad reopen hoti hai. Isse schema mein sahi tarike se kaise model karein?",
    options: [
      "Purani REJECTED status history row ko edit karke UNDER_REVIEW kar do",
      "Claim row delete karke naya claim record banao",
      "Ek naya status-history row insert karo (REJECTED se UNDER_REVIEW transition), purani history row ko as-is chhod do",
      "claim.approved_amount ko directly modify kar do bina history update kiye",
    ],
    correctIndex: 2,
    explanation:
      "Append-only principle ka extension yehi hai - reopening bhi ek naya status transition hai, jo naya history row banata hai. Purani REJECTED entry apni jagah rehti hai as an accurate historical record ki claim ek baar reject hui thi. Options A, B, D append-only integrity todte hain.",
    difficulty: "hard",
  },
];

export default quiz;
