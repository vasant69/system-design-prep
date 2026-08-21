import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3perf-1",
    question:
      "S3 ka request rate limit (3,500 writes/sec, 5,500 reads/sec) kis level par apply hota hai, aur bucket ka overall throughput kaise scale karta hai?",
    options: [
      "Poore bucket par ek fixed limit hai, chahe kitne bhi prefixes ho",
      "Limit har partitioned prefix par lagti hai, aur bucket me prefixes ki koi limit nahi — isliye keys distribute karke linearly scale kar sakte ho",
      "Limit account-level hai, saare buckets milakar",
      "Limit sirf GET requests par lagti hai, writes unlimited hain",
    ],
    correctIndex: 1,
    explanation:
      "S3 ka rate limit S3 ke internal partitions (prefixes) ke hisaab se hai, poore bucket ke hisaab se nahi. Ek bucket me kitne bhi prefixes ho sakte hain, aur har prefix apna 3,500/5,500 limit rakhta hai — isliye high-cardinality prefix design karke bucket ka overall throughput linearly badhaya ja sakta hai. Option A galat hai kyunki limit bucket-wide nahi hai. Option C galat hai, limit bucket ke andar prefix-level hai. Option D galat hai — writes bhi throttle hoti hain, sirf number alag (3,500 vs 5,500) hai.",
    difficulty: "medium",
  },
  {
    id: "s3perf-2",
    question:
      "Presigned URL ek IAM role ki temporary (session) credentials se generate kiya gaya, `expiresIn: 604800` (7 din) ke saath. URL actually kab tak valid rahega?",
    options: [
      "Poore 7 din, jaisa code me likha gaya",
      "Sirf tab tak jab tak underlying temporary credentials khud valid hain — typically ~1 ghanta, chahe expiresIn zyada ho",
      "Sirf 24 ghante, IAM role credentials ki fixed limit",
      "URL kabhi expire nahi hoga kyunki role-based hai",
    ],
    correctIndex: 1,
    explanation:
      "Temporary/role-based credentials se banaya gaya presigned URL sirf tab tak valid hai jab tak wo underlying session credentials khud expire nahi hote — typically session ki duration (jaise ~1 ghanta), chahe `expiresIn` parameter me kuch bhi likha ho. 7-din tak ka expiry sirf long-lived IAM **user** credentials se possible hai. Options A, C, aur D sab is nuance ko miss karte hain jo interview me common trap hai.",
    difficulty: "hard",
  },
  {
    id: "s3perf-3",
    question:
      "Ek client ko upload size limit enforce karna hai (e.g., max 10 MB) bina server ke through file route kiye. Presigned PUT aur presigned POST me se kaunsa use karoge, aur kyun?",
    options: [
      "Presigned PUT — simpler API hai",
      "Presigned POST — sirf ye `content-length-range` jaisi policy conditions support karta hai; PUT me size limit enforce karne ka koi tareeka nahi hai",
      "Dono equally kaam karte hain, koi fark nahi",
      "Koi bhi nahi — size limit sirf server ke through upload route karke enforce ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Presigned POST me `Conditions` array me `content-length-range` jaisi policy conditions daal sakte ho jo S3 khud enforce karta hai — client agar bade file bhejne ki koshish kare to S3 reject kar dega. Presigned PUT me ye mechanism exist hi nahi karta — jo size chahe upload ho sakti hai jab tak alag se post-upload check na ho. Option A galat hai kyunki simplicity ke against trade-off hai security. Option C galat hai, ye ek real functional difference hai. Option D galat hai — presigned POST exactly isi problem ko solve karta hai bina server ke through route kiye.",
    difficulty: "medium",
  },
  {
    id: "s3perf-4",
    question:
      "React app se S3 par presigned URL se multipart upload ho raha hai, lekin browser JavaScript ETag response header read nahi kar pa raha (multipart complete karne ke liye chahiye). Sabse likely missing configuration kya hai?",
    options: [
      "Bucket policy me `s3:PutObject` allow nahi kiya gaya",
      "CORS configuration me `ExposeHeaders: ['ETag']` missing hai",
      "Presigned URL ka expiry bahut chhota set kiya gaya",
      "Bucket versioning off hai",
    ],
    correctIndex: 1,
    explanation:
      "CORS `ExposeHeaders` list decide karti hai ki browser JavaScript kaunse response headers padh sakta hai. Bina `ETag` ko explicitly expose kiye, browser ETag header ko read nahi kar sakta — jo multipart upload complete karne ke liye zaroori hota hai (har part ka ETag `CompleteMultipartUpload` me bhejna padta hai). Ye Angular/React se direct multipart upload karte waqt sabse common bug hai. Options A, C, aur D valid concerns ho sakte hain lekin diye gaye specific symptom (upload ho raha hai, sirf ETag read nahi ho raha) ka classic cause nahi hain.",
    difficulty: "medium",
  },
];

export default quiz;
