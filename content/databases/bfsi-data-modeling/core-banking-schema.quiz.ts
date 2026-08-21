import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cbschema-1",
    question: "`account_type` ko ek hardcoded VARCHAR column banake application code mein conditionals se handle karne ke bajaye, `Product` ko apna alag entity banane ka sabse bada fayda kya hai?",
    options: [
      "Product table storage space bachata hai",
      "Naya account product launch karna sirf ek data/config change ban jaata hai, code deploy ki zaroorat nahi padti",
      "Product table automatically interest calculate kar deta hai bina application logic ke",
      "Yeh sirf query performance improve karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Product ko data ke roop mein model karne ka core fayda yeh hai ki business rules (interest rate, min balance, overdraft) data mein rehte hain, code mein nahi — isliye naya product (jaise senior citizen savings) launch karna ek row insert hai, multi-week code release nahi. Storage (A) is decision ka primary driver nahi hai. Interest calculation abhi bhi application logic use karta hai, bas rate data-driven hai (C thoda misleading). Query performance (D) is decision ka main point nahi hai.",
    difficulty: "easy",
  },
  {
    id: "cbschema-2",
    question: "Is topic mein Branch entity ko 'genuine design decision, not an obvious default' kyun kaha gaya hai?",
    options: [
      "Kyunki Branch table ko SQL mein implement karna technically mushkil hai",
      "Kyunki digital-first banking mein yeh open question hai ki Branch operationally meaningful hai ya sirf historical/regulatory metadata",
      "Kyunki har bank ke paas exactly ek branch hoti hai",
      "Kyunki Branch aur Account ke beech relationship hamesha N:M hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Traditional branch-first banking mein Branch operational entity hai, lekin digital-first systems mein iska role sirf historical/regulatory metadata tak simat sakta hai — yeh context-dependent decision hai, hardcoded assumption nahi. Implementation difficulty (A) is discussion ka point nahi hai. Banks ke paas multiple branches hoti hain (C galat). Branch-Account relationship typically 1:N hoti hai, N:M nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "cbschema-3",
    question: "Core banking schema mein `Account.balance` kahan se aana chahiye, is module ke pichle topics ke hisaab se?",
    options: [
      "Account table pe ek directly stored aur UPDATE se maintain hone wala column",
      "LedgerEntry rows ke sum se computed, ya materialized value jo un entries se reconstructable ho",
      "Product table se, kyunki Product interest rate define karta hai",
      "Branch table se, kyunki branch cash transactions track karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Double-entry ledger topic se yeh principle carry forward hota hai: balance ek mutable standalone column nahi, balki LedgerEntry entries se computed ya reconstructable value hona chahiye — auditability ke liye. Directly stored/UPDATE-based balance (A) wahi naive anti-pattern hai jo reject kiya gaya tha. Product (C) rules define karta hai, balance nahi. Branch (D) balance source nahi hai.",
    difficulty: "medium",
  },
  {
    id: "cbschema-4",
    question: "Is core banking schema mein AccountHolder junction table ka role kya hai?",
    options: [
      "Yeh Product aur Branch ko link karta hai",
      "Yeh Customer aur Account ke beech N:M relationship represent karta hai (joint accounts ke liye), role column ke saath",
      "Yeh LedgerEntry rows ko debit/credit type se categorize karta hai",
      "Yeh sirf audit logging ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "AccountHolder junction table Customer-Account N:M relationship ko implement karta hai — ek Customer ke multiple Accounts, aur ek Account (joint account) ke multiple Customers, plus ek role column (primary/joint holder). Product-Branch linking (A) is table ka kaam nahi hai. Debit/credit categorization (C) LedgerEntry ka apna entry_type column karta hai. Audit logging (D) is table ka primary purpose nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
