import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "findtype-1",
    question:
      "0.1 + 0.2 IEEE 754 double precision floating point mein 0.30000000000000004 kyun deta hai, aur isse money ke liye kyun avoid karna chahiye?",
    options: [
      "Yeh ek database bug hai jo modern databases mein fix ho chuka hai",
      "Binary floating point exact decimal fractions represent nahi kar sakta — yeh approximation errors millions of transactions mein compound hote hain",
      "Yeh sirf JavaScript ka issue hai, SQL databases mein nahi hota",
      "FLOAT sirf bade numbers ke liye accurate nahi hota, chhote decimals ke liye theek hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Binary floating point representation mein most decimal fractions (jaise 0.1) ko exactly represent karna possible nahi hota — yeh ek fundamental IEEE 754 limitation hai, bug nahi. Individual transaction mein error tiny hota hai lekin millions of transactions/calculations mein accumulate hoke real discrepancy ban jaata hai. C galat hai — yeh IEEE 754 standard ka universal behavior hai, sirf JavaScript-specific nahi. D galat hai — chhote decimals specifically hi worst affected hote hain kyunki woh binary mein repeat karte hain.",
    difficulty: "easy",
  },
  {
    id: "findtype-2",
    question:
      "Balance column ke liye NUMERIC(19, 4) recommend kiya jaata hai instead of NUMERIC(19, 2). Extra 2 decimal places (4 total) kyun rakhte hain?",
    options: [
      "Kyunki database engine ko exactly 4 decimal places chahiye hote hain",
      "Taaki intermediate calculations (interest accrual, FX conversion) precise rahein, phir display ke time currency ke actual decimal places pe round karein",
      "Kyunki 2 decimal places SQL mein invalid hain",
      "Isse koi farak nahi padta, sirf convention hai",
    ],
    correctIndex: 1,
    explanation:
      "Extra precision (4 decimal places) intermediate calculations jaise interest rate application ya FX conversion ke liye zaroori hoti hai, taaki rounding sirf final display step pe controlled tareeke se ho, har intermediate step pe nahi. A aur C factually galat hain — dono valid SQL configurations hain. D galat hai, yeh genuine precision-preservation reason hai, arbitrary convention nahi.",
    difficulty: "medium",
  },
  {
    id: "findtype-3",
    question:
      "Stripe jaisa payment system amount ko DECIMAL ki jagah smallest currency unit (paise/cents) mein BIGINT integer ke roop mein store karta hai. Iska main benefit kya hai?",
    options: [
      "BIGINT DECIMAL se zyada storage-efficient hota hai hamesha",
      "Integer arithmetic mein koi rounding ambiguity nahi hoti — addition/subtraction exact hoti hai",
      "BIGINT automatically currency conversion handle kar leta hai",
      "Yeh SQL mein CHECK constraints support nahi karta isliye simpler hai",
    ],
    correctIndex: 1,
    explanation:
      "Integer arithmetic (jaise paise mein amounts) mein floating point jaisa koi rounding ambiguity possible hi nahi hota — yeh ek valid, zero-ambiguity pattern hai. A ek overgeneralization hai, storage efficiency depend karta hai specific case pe. C galat hai — currency conversion application logic hai, data type se automatic nahi hota. D galat hai — BIGINT bhi CHECK constraints (jaise >= 0) support karta hai, yeh benefit nahi hai.",
    difficulty: "medium",
  },
  {
    id: "findtype-4",
    question:
      "BFSI system jo multiple time zones mein operate karta hai, timestamps ke liye kaunsa approach sahi hai?",
    options: [
      "Naive local time store karo, jahan bhi transaction ho wahi ka local time",
      "Hamesha UTC mein timezone-aware timestamps store karo, display ke time local timezone mein convert karo",
      "Timezone jo bhi server default ho, use kar lo",
      "Timestamps ko VARCHAR mein human-readable string ke roop mein store karo",
    ],
    correctIndex: 1,
    explanation:
      "UTC ek single, unambiguous reference point deta hai jo DST transitions aur multiple time zones ke across correctly compare hota hai — display ke time hi local timezone conversion karna chahiye. Naive local time (A) DST transitions ke around ambiguous/duplicate times create kar sakta hai. Server default timezone (C) inconsistent aur environment-dependent hota hai, production bugs ka source. VARCHAR string (D) sorting, comparison, aur arithmetic ke liye inefficient aur error-prone hai.",
    difficulty: "hard",
  },
];

export default quiz;
