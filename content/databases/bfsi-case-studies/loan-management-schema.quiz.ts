import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "loanmgmt-1",
    question:
      "RepaymentSchedule ko loan approval ke time hi generate karke ek separate table mein store kyun kiya jaata hai, on-the-fly compute karne ke bajaye?",
    options: [
      "Kyunki EMI formula bahut complex hai aur compute karna slow hai",
      "Kyunki payments ko match karne aur audits ke liye ek stable, unambiguous reference chahiye jo baar-baar recalculate na ho",
      "Kyunki SQL databases mein computed columns allowed nahi hote",
      "Kyunki loan ka interest rate kabhi change nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Agar schedule har baar recompute ho, to rounding ya calculation-logic changes ki wajah se do computations mismatch ho sakte hain, jisse payment matching aur disputes ambiguous ho jaate hain. Stored schedule ek stable reference deta hai. Performance concern (A) reason nahi hai (yeh formula itni bhi heavy nahi), computed columns ka restriction (C) galat hai, aur interest rate change (D) irrelevant hai is decision se.",
    difficulty: "medium",
  },
  {
    id: "loanmgmt-2",
    question:
      "RepaymentSchedule row mein sirf emi_amount store karne ke bajaye principal_component aur interest_component alag se kyun store karte hain?",
    options: [
      "Storage space bachane ke liye",
      "Regulatory audit ya dispute ke time exactly pata hona chahiye har installment ka split kaise calculate hua tha",
      "Kyunki EMI amount kabhi bhi fixed nahi hota",
      "SQL mein decimal columns ki limit hoti hai ek row mein",
    ],
    correctIndex: 1,
    explanation:
      "Interest Accrual topic ke principle ke hisaab se, rate/basis (yahan: har installment ka exact principal-interest split) store karna zaroori hai taaki baad mein koi dispute ya audit exactly verify kar sake ki calculation kya thi, bina purani logic re-run kiye. Storage (A) ek minor factor hai, main reason nahi. EMI amount actually fixed hi rehta hai (C galat). Decimal column limit (D) ek fabricated/galat reason hai.",
    difficulty: "medium",
  },
  {
    id: "loanmgmt-3",
    question:
      "Collections team ko roz 'saari overdue installments across all loans' query chalani hai. Is query ko efficient banane ke liye sabse zaroori index kya hai?",
    options: [
      "loan_id pe akela ek index",
      "installment_id (primary key) pe index",
      "Ek composite index (due_date, status)",
      "customer_id pe ek index loan_account table pe",
    ],
    correctIndex: 2,
    explanation:
      "Query due_date aur status dono pe filter karti hai poore repayment_schedule table mein (saare loans), isliye ek composite index (due_date, status) directly is access pattern ko serve karta hai. loan_id (A) is query mein filter hi nahi ho raha (yeh cross-loan query hai). Primary key (B) already har row unique deta hai lekin range/status filter ke liye useful nahi. customer_id (D) ek alag table pe hai aur is specific query se directly related nahi.",
    difficulty: "medium",
  },
  {
    id: "loanmgmt-4",
    question:
      "Customer apna loan foreclose (prepay) kar deta hai. RepaymentSchedule ke remaining unpaid installment rows ka kya karna chahiye?",
    options: [
      "Unhe DELETE kar dena kyunki ab woh irrelevant hain",
      "Unhe status = 'superseded' jaisa mark karna, delete nahi karna, taaki original schedule history preserve rahe",
      "Unke due_date ko aaj ki date pe update kar dena",
      "Unhe as-is chhod dena bina kisi status change ke",
    ],
    correctIndex: 1,
    explanation:
      "Poore module mein consistent immutability principle apply hota hai: purane rows delete/edit nahi karte, balki unhe superseded mark karte hain, taaki audit ke liye original schedule aur uske baad kya hua, dono trace ho sakein. DELETE (A) history destroy karta hai. due_date update (C) ek galat/misleading approach hai jo asal fact ko chhupata hai. Rows ko as-is chhod dena (D) unresolved/ambiguous state chhod deta hai jab loan actually close ho chuka hai.",
    difficulty: "hard",
  },
];

export default quiz;
