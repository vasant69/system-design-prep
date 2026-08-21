import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "scdkyc-1",
    question: "KYC/customer profile data ke liye Type 1 SCD (overwrite, no history) kyun galat hai?",
    options: [
      "Type 1 SQL mein implement karna technically possible nahi hai",
      "Purani value permanently lost ho jaati hai, isliye 'customer ka address kis date pe kya tha' jaisa regulatory question answer nahi kiya ja sakta",
      "Type 1 sirf NoSQL databases mein use hota hai",
      "Type 1 automatically customer ko notify kar deta hai har change pe",
    ],
    correctIndex: 1,
    explanation:
      "Type 1 seedha overwrite karta hai, koi history nahi rakhta — isliye point-in-time queries (jo compliance/audit ke liye zaroori hain) answer nahi ho sakti. Type 1 SQL mein perfectly implementable hai (A galat). Yeh koi database-type-specific concept nahi hai (C galat). Notification is pattern ka part nahi hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "scdkyc-2",
    question: "Type 2 SCD table mein ek customer ka address 'update' actually database level pe kya operation hota hai?",
    options: [
      "Ek simple UPDATE statement jo address column ki value change kar deta hai",
      "Ek transaction jisme purani current row close hoti hai (valid_to set karke) aur ek nayi row insert hoti hai naye valid_from ke saath",
      "Purani row delete hoti hai aur ek naya customer_id assign hota hai",
      "Koi database operation nahi, sirf application cache update hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Type 2 'update' actually 2 operations hai ek transaction mein: purani current row ko close karna (valid_to set, is_current false) aur ek nayi row insert karna nayi value ke saath. Simple UPDATE (A) Type 1 jaisa behavior create karta, history kho degi. Delete + naya customer_id (C) completely galat approach hai, customer identity break karta hai. Cache-only update (D) persistent history nahi rakhta.",
    difficulty: "medium",
  },
  {
    id: "scdkyc-3",
    question: "Type 3 SCD (previous-value ek extra column mein) compliance ke liye zyaadatar insufficient kyun hota hai?",
    options: [
      "Type 3 implement karna sabse mushkil SCD type hai",
      "Yeh sirf ek immediate purani value store karta hai — agar value multiple baar change ho chuki hai, poori history nahi milti",
      "Type 3 sirf integer columns pe kaam karta hai, text pe nahi",
      "Type 3 automatically data ko encrypt kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Type 3 sirf ek extra column (jaise previous_address) rakhta hai — agar address 3 baar change hua hai, sirf sabse recent purani value dikhti hai, poori sequence nahi. Implementation difficulty (A) is discussion ka point nahi hai. Type 3 kisi bhi data type pe kaam kar sakta hai (C galat). Encryption is pattern se unrelated hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "scdkyc-4",
    question: "Ek Type 2 SCD CustomerProfile table ko join karte waqt kya specific risk hai jo Type 1 mein nahi hota?",
    options: [
      "Joins Type 2 tables ke saath SQL mein possible hi nahi hain",
      "Agar join point-in-time aware nahi hai, to accidentally transaction ko customer ki current profile se join kar sakte ho, us profile se nahi jo transaction-time pe valid thi",
      "Type 2 tables mein foreign keys allowed nahi hote",
      "Joins Type 2 tables ke saath hamesha slower hote hain regardless of indexing",
    ],
    correctIndex: 1,
    explanation:
      "Type 2 table mein ek customer ki multiple historical rows hoti hain — agar join sirf is_current pe (ya bina point-in-time filter ke) ho, to galat (current) profile se match ho sakta hai jab actually transaction-time wali profile chahiye thi. Joins Type 2 ke saath possible hain (A galat). Foreign keys allowed hain (C galat). Proper indexing (valid_from/valid_to) se performance manage ho sakta hai (D galat, generalization).",
    difficulty: "hard",
  },
];

export default quiz;
