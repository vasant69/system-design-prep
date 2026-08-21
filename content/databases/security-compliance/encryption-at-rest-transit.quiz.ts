import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "enc-1",
    question: "Ek bank ka database TDE (Transparent Data Encryption) use karta hai, lekin primary-to-replica replication traffic TLS ke bina chalta hai. Yeh kya risk create karta hai?",
    options: [
      "Kuch risk nahi, TDE hi kaafi hai",
      "Ek attacker jo replication traffic intercept kar le, woh plaintext data dekh sakta hai chahe disk pe data encrypted ho",
      "Database ki query performance slow ho jaayegi",
      "TDE automatically replication ko bhi encrypt kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "TDE sirf at-rest data (disk pe stored files) protect karta hai — network pe travel karte waqt data ko protect karne ke liye alag se in-transit encryption (TLS) chahiye. Agar replication traffic unencrypted hai, woh ek independent failure mode hai jo TDE cover nahi karta. Option C (performance) is scenario se unrelated hai, aur option D galat hai — TDE aur TLS do alag mechanisms hain, ek doosre ko automatically cover nahi karte.",
    difficulty: "easy",
  },
  {
    id: "enc-2",
    question: "Field-level (column-level) encryption ek card_number column pe apply ki gayi hai standard randomized encryption ke saath. Iske baad kya problem aati hai?",
    options: [
      "Column ab bilkul store hi nahi ho sakta",
      "WHERE card_number = ? jaisi equality lookup normally kaam nahi karti, kyunki same plaintext har baar different ciphertext deta hai",
      "Column ka data type change karna padta hai VARCHAR se INT",
      "Encryption automatically sab existing rows delete kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Standard randomized encryption same plaintext ko har baar alag ciphertext deta hai, isliye normal equality ya range queries kaam nahi karti — isko solve karne ke liye deterministic encryption ya ek separate hash column chahiye hota hai lookup ke liye. Options A, C, aur D factually galat hain — encryption na to storage ko impossible banata hai, na data type change maangta hai, na existing data delete karta hai.",
    difficulty: "medium",
  },
  {
    id: "enc-3",
    question: "Encryption keys ko database ke saath same server/backup mein store karna kyun risky hai?",
    options: [
      "Isse database ka storage space kam ho jaata hai",
      "Agar data store compromise ho, key bhi saath mein compromise ho jaati hai, jisse encryption ka poora security model defeat ho jaata hai",
      "Keys database ke saath store nahi ho sakti technically",
      "Isse query performance improve ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Encryption ki security poori tarah key ki secrecy pe depend karti hai — agar attacker ko encrypted data aur key dono ek saath mil jaayein (jaise ek stolen backup jisme dono ho), to encryption ka koi practical benefit nahi bacha. Isliye HSM/KMS jaisi dedicated, separate key management service use hoti hai. Options A, C, aur D is core security concern se unrelated/galat hain.",
    difficulty: "medium",
  },
  {
    id: "enc-4",
    question: "Field-level encryption sirf PAN number, card number jaise specific fields pe apply ki jaati hai, poori table pe blanket nahi. Iski sabse badi wajah kya hai?",
    options: [
      "Field-level encryption bahut expensive hardware maangti hai",
      "Har encrypted column normal indexing/query capability lose karta hai, isliye yeh sirf genuinely sensitive fields ke liye reserve ki jaati hai",
      "SQL standard sirf ek encrypted column allow karta hai per table",
      "Encrypted columns ko backup nahi kiya ja sakta",
    ],
    correctIndex: 1,
    explanation:
      "Har encrypted field ke saath query complexity aur performance trade-off aata hai (range queries break ho jaati hain, equality ke liye extra mechanism chahiye) — isliye yeh sirf un fields pe use hoti hai jinhe genuinely iski zaroorat hai, na ki har column pe. Options A, C, D factually incorrect hain — koi aisa hardware ya SQL-standard restriction nahi hai, aur encrypted columns normally backup ho sakte hain (TDE unhe bhi cover karta hai).",
    difficulty: "hard",
  },
];

export default quiz;
