import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "multicurr-1",
    question: "Ek monetary `amount` column ke saath `currency_code` column na rakhna sabse risky kyun hai?",
    options: [
      "Isse storage space zyada use hota hai",
      "Yeh implicit single-currency assumption create karta hai jo cross-border payments/forex accounts aane par silently todh jaati hai",
      "SQL databases currency codes ko natively support nahi karte",
      "Isse query performance slow ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina currency_code ke, system implicitly ek single currency assume karta hai — yeh chhoti scale pe unnoticed rehta hai lekin jaise hi multiple currencies involve hoti hain (cross-border, forex accounts), amounts ka meaning ambiguous ho jaata hai aur comparison/aggregation galat results deta hai. Storage (A) ek minor cost hai, main risk nahi. SQL currency codes ko normal CHAR/VARCHAR se easily support karta hai (C galat). Performance (D) is discussion ka core point nahi hai.",
    difficulty: "easy",
  },
  {
    id: "multicurr-2",
    question: "ExchangeRate table ko 'effective-dated' (effective_from/effective_to ke saath) banana kyun zaroori hai, sirf ek current rate rakhne ke bajaye?",
    options: [
      "Isse table ka size chhota rehta hai",
      "Historical/past transactions ko convert karne ke liye us waqt jo rate effective tha wahi use karna chahiye, na ki aaj ka current rate",
      "Database sirf effective-dated tables pe indexes support karta hai",
      "Isse currency codes automatically validate ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Exchange rates continuously change — agar sirf current rate stored ho, to past transactions ko galat (aaj ke) rate se convert kiya jaayega, jo historically inaccurate hai. Effective-dating (SCD-style pattern) ensure karta hai ki har transaction apne time ka sahi rate use kare. Table size (A) is decision ka driver nahi hai, balki effective-dating table ko bada hi karta hai. Indexing (C) aur currency validation (D) is concept se unrelated hain.",
    difficulty: "medium",
  },
  {
    id: "multicurr-3",
    question: "Multi-tenancy ke teen standard approaches mein se, 'shared tables with tenant_id column' ka sabse bada risk kya hai?",
    options: [
      "Yeh approach sabse zyada operational overhead create karta hai",
      "Ek missed WHERE tenant_id filter kisi query mein ek serious cross-tenant data leak ban sakta hai",
      "Yeh approach SQL joins ko completely impossible banata hai",
      "Har tenant ko apna alag database chahiye hota hai is approach mein bhi",
    ],
    correctIndex: 1,
    explanation:
      "Shared tables sabse efficient approach hai operational overhead ke hisaab se, lekin agar koi query tenant_id filter bhool jaaye, to ek tenant doosre tenant ka data dekh sakta hai — yeh serious data leak risk hai, jise row-level security se mitigate kiya jaata hai. Operational overhead (A) actually sabse kam hai is approach mein, sabse zyada nahi. Joins possible hain (C galat). Yeh approach specifically ek shared database use karta hai, alag database ki zaroorat nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "multicurr-4",
    question: "Ek large enterprise BFSI client jise strong compliance aur data-residency guarantees chahiye, uske liye kaunsa multi-tenancy approach typically best fit hai?",
    options: [
      "Shared tables with tenant_id, kyunki yeh sabse simple hai",
      "Separate database per tenant, kyunki yeh sabse strong isolation deta hai even though operational overhead zyada hai",
      "Koi bhi approach chalega, tenancy model compliance se unrelated hai",
      "Separate schema per tenant, kyunki yeh sabse cheap approach hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab tenant count kam ho aur compliance/isolation requirements high hon (jaise ek bade enterprise BFSI client ke liye), separate database per tenant best fit hai — best isolation deta hai, aur operational overhead justify ho jaata hai kyunki tenant count kam hai. Shared tables (A) high-compliance scenario ke liye risky hain. Tenancy model compliance requirements se directly related hai (C galat). Separate schema (D) 'cheapest' nahi balki middle-ground hai, aur single large high-compliance client ke liye separate DB usually better fit hoti hai.",
    difficulty: "hard",
  },
];

export default quiz;
