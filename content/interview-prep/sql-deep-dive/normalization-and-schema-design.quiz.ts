import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "normalization-and-schema-design-1",
    question: "Ek table mein `tags` column ek hi cell mein comma-separated string store karta hai (jaise sql,database,tutorial). Yeh kis normal form ko violate karta hai?",
    options: ["2NF", "3NF", "1NF", "Koi violation nahi hai, yeh valid design hai"],
    correctIndex: 2,
    explanation: "Sahi jawab 1NF hai, kyunki 1NF require karta hai ki har column mein atomic (single) value ho, multiple values ek cell mein nahi. Comma-separated string non-atomic hai. 2NF aur 3NF alag concerns handle karte hain (partial aur transitive dependency), unka is scenario se direct lena-dena nahi hai. Yeh definitely ek violation hai, valid design nahi.",
    difficulty: "easy",
  },
  {
    id: "normalization-and-schema-design-2",
    question: "`order_items(order_id, product_id, product_name, quantity)` table mein, composite primary key `(order_id, product_id)` hai, aur `product_name` sirf `product_id` pe depend karta hai. Yeh kis normal form violation ka example hai?",
    options: ["1NF violation, kyunki product_name non-atomic hai", "2NF violation, kyunki product_name poori composite key pe depend nahi karta, sirf part pe karta hai", "3NF violation, kyunki transitive dependency hai", "Koi violation nahi, yeh sahi design hai"],
    correctIndex: 1,
    explanation: "Sahi jawab 2NF hai — yeh classic partial dependency ka example hai, jahan ek non-key column (product_name) sirf composite key ke ek hisse (product_id) pe depend karta hai, poori key pe nahi. product_name atomic hai isliye 1NF theek hai. 3NF transitive dependency ke baare mein hai (non-key se non-key), yeh alag scenario hai.",
    difficulty: "medium",
  },
  {
    id: "normalization-and-schema-design-3",
    question: "Ek read-heavy reporting dashboard hai jo baar-baar 4 tables join karke slow ho raha hai. Isse improve karne ka sabse practical approach kya hai?",
    options: ["Saare tables ko aur bhi zyada normalize kar do", "Ek denormalized reporting table/view banao jisme joins pre-computed ho", "Indexes hata do taaki writes fast ho jaayein", "Composite primary keys use karna band kar do"],
    correctIndex: 1,
    explanation: "Sahi jawab denormalized reporting table/view banana hai — yeh classic case hai jahan read-heavy workload ke liye jaan-boojh kar redundancy accept karke joins avoid kiye jaate hain. Aur normalize karna problem ko aur bhi worse karega, kyunki isse aur zyada joins lagenge. Indexes hatana reads ko slow karega, help nahi karega. Composite keys ka is problem se direct lena-dena nahi hai.",
    difficulty: "medium",
  },
  {
    id: "normalization-and-schema-design-4",
    question: "`posts(id, title, author_name, author_email)` table mein author_email kis wajah se 3NF violate karta hai?",
    options: ["Kyunki email column mein NULL ho sakta hai", "Kyunki author_email primary key id pe directly depend nahi karta, balki author_name ke through transitively depend karta hai", "Kyunki author_email string type hai", "Yeh 3NF violate nahi karta, yeh valid hai"],
    correctIndex: 1,
    explanation: "Sahi jawab transitive dependency hai — author_email primary key (id) pe directly depend nahi karta, balki ek doosre non-key column (author_name) ke through indirectly depend karta hai. Yeh exactly transitive dependency ki definition hai jo 3NF prevent karta hai. NULL values ya string type ka isse koi lena-dena nahi hai, aur yeh definitely ek violation hai.",
    difficulty: "hard",
  },
];

export default quiz;
