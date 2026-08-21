import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ermod-1",
    question: "Ek naive schema design mein Account table pe seedha ek customer_id column daal diya jaata hai. Yeh kis real-world case mein break ho jaata hai?",
    options: [
      "Jab customer apna PAN number update kare",
      "Joint accounts ke case mein, jahan ek Account ke multiple Customers ho sakte hain",
      "Jab account balance zero ho jaaye",
      "Jab customer ek naya account khole",
    ],
    correctIndex: 1,
    explanation:
      "Joint accounts banate hain ki Account-to-Customer relationship N:M ho, na ki simple 1:N — ek Account ke multiple holders (customers) ho sakte hain, aur ek Customer ke multiple accounts. Seedha customer_id column sirf 1:N handle karta hai, N:M nahi. Baaki options (A, C, D) is structural problem se unrelated hain.",
    difficulty: "easy",
  },
  {
    id: "ermod-2",
    question: "account_number ko primary key banane ka sabse bada risk kya hai?",
    options: [
      "Account number bahut lamba hota hai storage ke liye",
      "Account number kabhi reissue/port ho sakta hai, jisse har foreign key reference cascade update karna padega",
      "Account number unique nahi hota",
      "SQL account_number ko PK nahi bana sakta",
    ],
    correctIndex: 1,
    explanation:
      "Natural keys jaise account number business reasons se (merger, migration, IFSC change) badal sakte hain — agar yeh PK hai, to har table jo isse reference karta hai update karna padega, jo production mein risky/expensive hai. Storage size (A) ek minor concern hai, main issue nahi. Uniqueness (C) alag issue hai — unique constraint se solve hota hai, PK banane se nahi. SQL mein koi restriction nahi hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "ermod-3",
    question: "Ek N:M relationship (jaise Account aur Customer joint accounts ke through) ko relational schema mein kaise represent karte hain?",
    options: [
      "Dono tables mein ek dusre ka foreign key daal ke",
      "Ek alag junction/bridge table banake jisme dono sides ke foreign keys hon",
      "Ek JSON array column mein sab related IDs store karke",
      "N:M relationships ko avoid hi karna chahiye schema design mein",
    ],
    correctIndex: 1,
    explanation:
      "Junction table (jaise AccountHolder) approach hi standard relational way hai N:M represent karne ka — isme dono entities ke foreign keys hote hain, aur extra attributes (jaise 'role') bhi add ho sakte hain. Dono tables mein direct foreign key (A) N:M ke liye structurally kaam nahi karta. JSON array (C) referential integrity aur efficient joins todta hai. N:M relationships avoid karna (D) hamesha possible ya sahi nahi hota — real business rules yehi maangte hain.",
    difficulty: "medium",
  },
  {
    id: "ermod-4",
    question: "BFSI schema design mein audit columns (created_at, updated_at, created_by) ko 'almost mandatory' kyun kaha gaya hai?",
    options: [
      "Yeh columns query performance improve karte hain",
      "Compliance aur debugging ke liye zaroori hote hain — regulatory audits mein aksar required bhi hote hain",
      "Yeh SQL standard ke according required hain har table mein",
      "Bina inke primary key kaam nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Audit columns record rakhte hain ki data kab aur kisne change kiya — yeh financial systems mein debugging aur regulatory compliance ke liye critical hai. Yeh performance (A) improve nahi karte, seedha overhead hi hain (chhota sa). SQL standard (C) mein aisi koi mandatory requirement nahi hai — yeh ek best practice hai, rule nahi. Primary key (D) inse independent kaam karta hai.",
    difficulty: "hard",
  },
];

export default quiz;
