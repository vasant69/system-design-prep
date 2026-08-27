import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sql-injection-1",
    question: "Ek login query string concatenation se banti hai, aur attacker username field mein apostrophe-OR-apostrophe-1-equals-1 type input daalta hai. Yeh attack kaam kyun karta hai?",
    options: [
      "Kyunki database passwords ko plain text mein store karta hai",
      "Kyunki input query ke SQL structure ka hi part ban jaata hai, aur WHERE clause ko always-true bana deta hai",
      "Kyunki attacker ne database ka admin password guess kar liya",
      "Kyunki application server crash ho jaata hai aur default login de deta hai",
    ],
    correctIndex: 1,
    explanation: "Yahan asli issue yeh hai ki string concatenation ki wajah se attacker ka input SQL query ke syntax ka hi hissa ban jaata hai, jisse WHERE clause practically hamesha true ho jaata hai — password store karne ka tareeka is attack se unrelated hai, koi password guess nahi ho raha, aur yeh server crash bhi nahi hai, balki query logic ka manipulation hai.",
    difficulty: "easy",
  },
  {
    id: "sql-injection-2",
    question: "Input ko escape karna (jaise single quotes ko backslash-quote mein convert karna) SQL injection ka poora fix kyun nahi maana jaata?",
    options: [
      "Kyunki escaping databases mein support hi nahi hoti",
      "Kyunki yeh manual aur error-prone hai — ek bhi missed edge case ya database-specific syntax difference se bypass ho sakta hai, aur second-order injection jaise cases cover nahi karta",
      "Kyunki escaping query ko bahut slow bana deti hai",
      "Kyunki escaping sirf UPDATE queries pe kaam karti hai, SELECT pe nahi",
    ],
    correctIndex: 1,
    explanation: "Escaping ek manual workaround hai jo human error aur database-specific syntax differences ki wajah se fragile hai, aur cases jaise second-order injection ko cover nahi karta. Escaping databases mein support hoti hai (yeh galat hai), significant slowdown ka issue nahi hai, aur yeh query type (SELECT vs UPDATE) specific nahi hai.",
    difficulty: "medium",
  },
  {
    id: "sql-injection-3",
    question: "Parameterized queries (prepared statements) SQL injection ko structurally kaise prevent karte hain?",
    options: [
      "Woh user input ko automatically delete kar dete hain agar suspicious lage",
      "Woh query ka structure aur user data ko separately database ko bhejte hain, isliye input kabhi bhi SQL syntax ki tarah parse nahi hota",
      "Woh sirf numeric input allow karte hain",
      "Woh database ko read-only mode mein daal dete hain",
    ],
    correctIndex: 1,
    explanation: "Parameterized queries mein query structure aur actual data values alag-alag bheje jaate hain database ko, isliye value chahe kuch bhi ho, woh sirf ek literal data value ki tarah treat hoti hai, kabhi SQL code ki tarah nahi. Yeh input delete nahi karte, sirf numeric input tak limited nahi hain, aur database ko read-only nahi banate.",
    difficulty: "medium",
  },
  {
    id: "sql-injection-4",
    question: "Ek team kehti hai humein injection ki chinta nahi kyunki hum ORM use karte hain. Yeh assumption kab galat sabit ho sakta hai?",
    options: [
      "Kabhi nahi, ORM 100% guarantee deta hai",
      "Jab developer ORM ke andar raw SQL escape hatch (jaise raw query methods) use karke string concatenation kar deta hai",
      "Jab database MySQL ke bajaye PostgreSQL ho",
      "Jab application HTTPS use nahi kar raha ho",
    ],
    correctIndex: 1,
    explanation: "ORMs by default parameterize karte hain unke standard query API se, lekin unmein aksar ek raw-SQL escape hatch hota hai — agar developer wahan string concatenation kare, injection wapas possible ho jaata hai. Database vendor (MySQL vs PostgreSQL) is issue se unrelated hai, aur HTTPS transport-layer security hai, SQL injection se directly unrelated.",
    difficulty: "hard",
  },
];

export default quiz;
