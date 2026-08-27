import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "joins-1",
    question: "Ek query chahiye jo sab customers dikhaye, chahe unhone order kiya ho ya na kiya ho. Kaunsa join sahi hai?",
    options: [
      "INNER JOIN customers with orders",
      "LEFT JOIN customers with orders (customers left table)",
      "CROSS JOIN customers with orders",
      "RIGHT JOIN orders with customers (orders left table, customers right)",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — 'sab X do chahe Y ho ya na ho' signal LEFT JOIN ka hai, customers ko left table rakhna hoga taaki uski saari rows preserve hon. A galat hai kyunki INNER JOIN un customers ko drop kar dega jinka koi order nahi hai. C galat hai, CROSS JOIN Cartesian product banayega, business question ka answer nahi. D technically kaam kar sakta hai (RIGHT JOIN orders se customers, orders right mein) lekin yeh option jaisa likha hai woh galat direction hai — orders left, customers right ka RIGHT JOIN customers ki saari rows nahi degi.",
    difficulty: "easy",
  },
  {
    id: "joins-2",
    question: "Yeh query kya problem create karti hai: SELECT c.name, o.order_id FROM customers c, orders o; (koi WHERE ya ON nahi)?",
    options: [
      "Query error dega kyunki JOIN keyword missing hai",
      "Sirf matching rows return hongi, jaise INNER JOIN",
      "Cartesian product banega — har customer row har order row se combine hogi",
      "Sirf pehli customer row return hogi",
    ],
    correctIndex: 2,
    explanation: "Sahi answer C hai — comma-separated FROM syntax bina WHERE/ON condition ke ek implicit CROSS JOIN hai, jo Cartesian product banata hai (rows(customers) x rows(orders)). A galat hai, yeh valid (though dangerous) SQL syntax hai, error nahi dega. B galat hai, bina condition ke matching ka koi concept nahi hai. D galat hai, saari rows ka combination banega, sirf pehli row nahi.",
    difficulty: "medium",
  },
  {
    id: "joins-3",
    question: "LEFT JOIN customers se orders, phir WHERE o.status = 'shipped' laga diya. Yeh kya problem create karta hai?",
    options: [
      "Koi problem nahi, yeh expected behavior hai",
      "Query error deti hai kyunki WHERE ke saath LEFT JOIN allowed nahi",
      "LEFT JOIN silently INNER JOIN jaisa behave karne lagta hai — bina order wale customers filter ho jaate hain",
      "Yeh sirf shipped orders wale customers ko duplicate kar deta hai",
    ],
    correctIndex: 2,
    explanation: "Sahi answer C hai — jin customers ka koi order nahi hai unke liye o.status NULL hota hai, aur NULL = 'shipped' hamesha false evaluate hota hai, isliye WHERE unhe filter kar deta hai, effectively LEFT JOIN ka behavior INNER JOIN jaisa ban jaata hai. A galat hai, yeh ek real, silent bug hai. B galat hai, syntax valid hai, koi error nahi aata. D galat hai, duplication ka koi related mechanism yahan nahi hai.",
    difficulty: "hard",
  },
  {
    id: "joins-4",
    question: "Employee-manager hierarchy ke liye (jahan CEO ka manager_id NULL hota hai), SELF JOIN karte waqt kaunsa join type use karna chahiye taaki CEO bhi result mein aaye?",
    options: [
      "INNER JOIN, kyunki dono tables same hain",
      "LEFT JOIN, taaki employee row preserve rahe chahe manager match na mile",
      "CROSS JOIN, taaki har employee-manager combination mile",
      "Koi bhi join type chalega, result same hi aayega",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — LEFT JOIN employees table (employee side) ki saari rows preserve karta hai, aur CEO jaise employee jinka manager_id NULL hai unke liye manager_name bhi NULL aa jaata hai lekin employee row result mein rehti hai. A galat hai, INNER JOIN un employees ko drop kar dega jinka manager match nahi milta (jaise CEO). C galat hai, CROSS JOIN har employee ko har dusre employee se combine kar dega, jo meaningless hai. D galat hai, join type se result directly affect hota hai jaisa upar explain kiya.",
    difficulty: "medium",
  },
];

export default quiz;
