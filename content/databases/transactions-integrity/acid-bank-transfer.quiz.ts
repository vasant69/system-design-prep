import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "acidbank-1",
    question:
      "Ek bank transfer mein Account A ka balance debit hone ke turant baad, Account B ka credit hone se PEHLE server crash ho jaata hai. Kaunsi ACID property yeh guarantee karti hai ki restart ke baad A ka balance rollback ho jaayega, aur paisa 'vanish' nahi hoga?",
    options: ["Consistency", "Atomicity", "Isolation", "Durability"],
    correctIndex: 1,
    explanation:
      "Atomicity guarantee karti hai ki transaction ke andar saare steps ek single unit ki tarah treat hote hain — ya to sab commit honge, ya crash ki soorat mein poora transaction rollback ho jaayega. Consistency (A) schema/business rules ke baare mein hai, is specific crash-timing problem se directly unrelated. Isolation (C) concurrent transactions ke beech interference se related hai, single transaction ke crash se nahi. Durability (D) committed data ke crash ke baad survive karne se related hai — yahan transaction commit hi nahi hua tha.",
    difficulty: "easy",
  },
  {
    id: "acidbank-2",
    question:
      "`Account` table pe `CHECK (balance >= 0)` constraint lagana ACID ke kis property ko directly enforce karta hai?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctIndex: 1,
    explanation:
      "Consistency guarantee karti hai ki database hamesha ek valid state mein rahe — schema-level constraints (jaise CHECK) is validity ko database khud enforce karta hai, application code pe depend kiye bina. Atomicity (A) all-or-nothing execution ke baare mein hai. Isolation (C) concurrent transactions ke interaction se related hai. Durability (D) committed data ke persist karne se related hai — inmein se koi bhi is specific business-rule enforcement ko directly cover nahi karta.",
    difficulty: "medium",
  },
  {
    id: "acidbank-3",
    question:
      "Customer ne apne app pe 'Transfer Successful' dekha, aur exactly usi second server crash ho gaya. Durability guarantee ke hisaab se restart ke baad kya hona chahiye, aur yeh kis mechanism se ensure hota hai?",
    options: [
      "Transaction ko dobara run karna padega — durability sirf successful reads guarantee karti hai",
      "Transfer database mein permanently reflect hona chahiye — Write-Ahead Logging (WAL) ke through, jisme commit record disk pe fsync hone ke baad hi COMMIT return hota hai",
      "Customer ko dobara login karke balance check karna padega, kyunki durability sirf application-level cache pe apply hoti hai",
      "Kuch guarantee nahi hai, kyunki crash ke baad koi bhi commit unreliable ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Durability guarantee karti hai ki commit ke baad data crash survive karega. Yeh Write-Ahead Logging se hota hai: commit se pehle uska log record disk pe safely likha (fsync) jaata hai, aur crash ke baad restart pe WAL replay karke exact committed state reconstruct ho jaati hai. Option A galat hai kyunki durability sirf commits ke baad ke persistence ke baare mein hai, reads ke baare mein nahi. Option C galat hai kyunki durability database-level guarantee hai, application cache se unrelated. Option D poori tarah galat hai — durability ka poora point hi yeh guarantee dena hai ki commit reliable rahe.",
    difficulty: "medium",
  },
  {
    id: "acidbank-4",
    question:
      "Ek developer application code se seedha do alag UPDATE queries chalata hai (ek A ka balance ghataane ke liye, ek B ka badhaane ke liye) bina inhe ek explicit transaction mein wrap kiye. Yeh kyun ek critical bug hai payments system mein?",
    options: [
      "Kyunki yeh do queries database ko slow kar deti hain",
      "Kyunki iske bina Atomicity guarantee poori tarah bypass ho jaati hai — crash beech mein hua to paisa ek account se nikal sakta hai bina doosre mein pahunche",
      "Kyunki SQL do separate UPDATE statements ko allow hi nahi karta",
      "Kyunki isse database ka schema automatically change ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina explicit transaction ke, dono UPDATEs independent operations ban jaate hain — agar crash pehle UPDATE ke commit hone ke baad aur doosre UPDATE se pehle ho, to A ka balance ghat gaya lekin B ka nahi badha, matlab paisa vanish ho gaya. Yeh exactly wahi Atomicity failure hai jo bank transfer example demonstrate karta hai. Option A performance ke baare mein hai, correctness ke nahi — yeh iska real issue nahi hai. Option C factually galat hai, SQL aise queries allow karta hai. Option D bhi galat hai, schema is scenario se unrelated hai.",
    difficulty: "hard",
  },
];

export default quiz;
