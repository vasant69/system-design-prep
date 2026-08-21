import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dels-1",
    question: "Ek single mutable `balance` column ko `UPDATE balance = balance - 100` se maintain karna kyun fundamentally galat hai production banking system ke liye?",
    options: [
      "Yeh query bahut slow hoti hai large tables pe",
      "Yeh not auditable hai, safely retriable nahi hai, aur transfer ko atomic coherent record ki tarah represent nahi karta",
      "SQL mein UPDATE statement decimal columns pe allowed nahi hai",
      "Yeh sirf NoSQL databases mein problem create karta hai, SQL mein theek hai",
    ],
    correctIndex: 1,
    explanation:
      "Single mutable balance column teen fundamental problems create karta hai: koi history/audit trail nahi (balance kyun woh value hai, pata nahi chalta), retry par accidental double-apply ho sakta hai, aur transfer (jo do accounts touch karta hai) ek single coherent record ke roop mein represent nahi hota. Performance (A) is discussion ka core issue nahi hai. UPDATE decimal pe allowed hai (C galat). Yeh SQL ya NoSQL dono mein equally problem hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "dels-2",
    question: "Double-entry ledger design mein ek transfer transaction kam se kam kitni `LedgerEntry` rows banata hai, aur kaise?",
    options: [
      "1 row, jisme source aur destination account dono columns hote hain",
      "2 rows — ek debit aur ek matching credit — jo ek common transaction_id se linked hoti hain",
      "3 rows — debit, credit, aur ek summary row",
      "0 rows — balance directly Account table mein update ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Double-entry pattern mein har transaction minimum 2 linked rows banata hai: ek debit entry (jis account se paisa gaya) aur ek credit entry (jis account mein paisa aaya), dono same transaction_id se linked. Single row (A) do accounts ko affect karne wale event ko properly represent nahi karta. Summary row (C) is core pattern ka part nahi hai (though fees jaisi complex transactions mein extra rows ho sakti hain). Direct balance update (D) hi wo naive approach hai jise yeh pattern replace karta hai.",
    difficulty: "medium",
  },
  {
    id: "dels-3",
    question: "Double-entry ledger ka 'golden invariant' kya hai, aur usse kaise verify karte hain?",
    options: [
      "Har account ka balance zero se bada hona chahiye, daily balance check se",
      "SUM(saari debit entries) hamesha SUM(saari credit entries) ke equal hona chahiye, system-wide — nightly reconciliation job se check hota hai",
      "Har customer ke paas exactly ek account hona chahiye, KYC verification se",
      "Har transaction 24 ghante ke andar complete honi chahiye, timeout monitoring se",
    ],
    correctIndex: 1,
    explanation:
      "Golden invariant yeh hai ki total debits total credits ke barabar rahein, poore system mein, hamesha — kyunki har valid transaction equal debit aur credit contribute karti hai. Nightly reconciliation job yeh SUM comparison chalake mismatch detect karta hai, jo bug ka signal hota hai. Balance zero se bada hona (A) ek alag business rule hai, core double-entry invariant nahi. Ek customer-ek account (C) aur 24-ghante completion (D) is pattern se unrelated hain.",
    difficulty: "medium",
  },
  {
    id: "dels-4",
    question: "Debit aur credit `LedgerEntry` rows ko alag-alag database transactions mein insert karna (ek transfer ke liye) kyun risky hai?",
    options: [
      "Yeh do baar disk I/O cost karta hai, jo performance issue hai",
      "Crash ya failure debit aur credit insert ke beech ho sakta hai, jisse ek unmatched entry reh jaati hai jo golden invariant tod deti hai",
      "Database dono transactions ko automatically merge kar deta hai, isliye koi farak nahi padta",
      "SQL standard alag transactions mein related rows insert karne se rokta hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar debit aur credit rows alag transactions mein insert ho, to beech mein crash ya failure hone par ek row commit ho sakti hai bina doosri ke — resulting mein ek unmatched entry jo SUM(debits) = SUM(credits) invariant tod deti hai. Isliye dono rows ek hi atomic DB transaction mein insert honi chahiye. Performance cost (A) secondary concern hai, core correctness issue nahi. Databases automatically merge nahi karte (C galat). SQL standard mein aisi koi restriction nahi hai (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
