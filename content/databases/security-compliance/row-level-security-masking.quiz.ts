import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rls-1",
    question: "Ek multi-tenant table pe RLS (Row-Level Security) policy enabled hai. Ek developer galti se ek query likhta hai bina WHERE tenant_id clause ke. Kya hota hai?",
    options: [
      "Query fail ho jaati hai error ke saath",
      "Database khud automatically sirf current session ke tenant ki rows return karta hai, cross-tenant data leak nahi hota",
      "Saari tenants ki rows return ho jaati hain, jaisa application-only filtering mein hota",
      "Query poori tarah block ho jaati hai, koi bhi row return nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "RLS ka poora point yehi hai ki database policy ke through automatically filter karta hai, chahe query mein explicit WHERE clause ho ya nahi — isliye ek missing filter bhi cross-tenant leak cause nahi karta. Option A galat hai, query fail nahi hoti, silently filtered result aata hai. Option C exactly woh problem hai jo RLS prevent karta hai. Option D galat hai — matching tenant ki rows to return hoti hain, sirf doosri tenants ki nahi.",
    difficulty: "easy",
  },
  {
    id: "rls-2",
    question: "Ek call-center support agent customer ka card number 'ending in 1234' confirm karta hai identity verify karne ke liye. Yeh use case kis technique se best solve hota hai?",
    options: [
      "Row-Level Security",
      "Data masking — agent ko sirf last 4 digits dikhna, poora card number nahi",
      "TDE (Transparent Data Encryption)",
      "Normalization",
    ],
    correctIndex: 1,
    explanation:
      "Yeh classic data masking use case hai — agent ko row access to chahiye (RLS ka concern nahi, woh already correct customer ki row dekh raha hai) lekin poora sensitive value nahi, sirf ek verification ke liye kaafi partial value. TDE (C) at-rest encryption solve karta hai, is access-level problem ko nahi. Normalization (D) is problem se completely unrelated hai.",
    difficulty: "easy",
  },
  {
    id: "rls-3",
    question: "Database-level (dynamic) masking, application-level masking se zyada 'bulletproof' kyun mana jaata hai?",
    options: [
      "Database-level masking free hoti hai, application-level paid hoti hai",
      "Database-level masking kabhi bhi query ya application se bypass nahi hoti — chahe koi naya tool ya service directly database query kare, masking still apply hoti hai",
      "Application-level masking SQL syntax error deti hai",
      "Database-level masking automatically encryption bhi kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Application-level masking sirf us specific application tak limited hai jisne masking logic likha hai — koi bhi doosra service, tool, ya direct SQL access is protection ko bypass kar sakta hai. Database-level masking (view/function ke through) har consumer ke liye apply hoti hai, chahe woh kisi bhi application se aaye. Options A, C, D factually galat/irrelevant hain.",
    difficulty: "medium",
  },
  {
    id: "rls-4",
    question: "RLS aur data masking ka relationship kaise describe kiya jaata hai?",
    options: [
      "Yeh dono ek hi cheez hain, interchangeably use hoti hain",
      "RLS decide karta hai kaun si rows dikhengi, masking decide karta hai un rows ke andar fields kitna dikhenge — dono complementary hain",
      "RLS sirf masking ke baad hi use ho sakta hai, pehle nahi",
      "Masking RLS ko replace kar deta hai bade systems mein",
    ],
    correctIndex: 1,
    explanation:
      "RLS aur masking do alag concerns solve karte hain jo saath kaam karte hain — RLS row-level access control hai (kaun si rows), masking field-level exposure control hai (kitna dikhega). Yeh interchangeable nahi hain (A galat), koi enforced ordering nahi hai (C galat), aur ek doosre ko replace nahi karte (D galat) — dono independently zaroori hote hain.",
    difficulty: "medium",
  },
];

export default quiz;
