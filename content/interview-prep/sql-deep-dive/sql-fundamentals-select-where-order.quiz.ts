import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sql-fund-1",
    question: "Query likhne ka order kya hota hai vs database ke actually execute karne ka logical order?",
    options: [
      "Dono order hamesha same hote hain, koi difference nahi",
      "Written: SELECT-FROM-WHERE-ORDER BY; Execution: FROM-WHERE-SELECT-ORDER BY",
      "Written: FROM-WHERE-SELECT; Execution: SELECT-FROM-WHERE",
      "Execution order database vendor ke hisaab se completely random hota hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — hum query SELECT se likhna start karte hain, lekin database pehle FROM (source table locate), phir WHERE (filter), phir SELECT (project) execute karta hai. A galat hai kyunki order same nahi hota. C ne order reverse kar diya galat tarike se. D galat hai — logical execution order standard SQL semantics follow karta hai, vendor-specific nahi.",
    difficulty: "easy",
  },
  {
    id: "sql-fund-2",
    question: "Yeh query kyun fail hoti hai zyadatar databases mein: SELECT price * qty AS total FROM orders WHERE total > 100?",
    options: [
      "SQL syntax galat hai, AS keyword allowed nahi hai",
      "WHERE clause SELECT se pehle execute hota hai, isliye total alias us waqt tak exist nahi karta",
      "Multiplication WHERE clause mein allowed nahi hai",
      "total ek reserved keyword hai isliye use nahi ho sakta",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — WHERE logically SELECT se pehle chalta hai, isliye SELECT list mein banaya gaya alias (total) WHERE ke time available nahi hota. A galat hai, AS syntax correct hai. C galat hai, multiplication WHERE mein allowed hai (jaise WHERE price * qty > 100). D galat hai, total koi reserved keyword nahi hai (though database-specific reserved words alag ho sakte hain, yeh is case ki wajah nahi hai).",
    difficulty: "medium",
  },
  {
    id: "sql-fund-3",
    question: "ORDER BY clause mein SELECT list ka column alias use kar sakte hain, lekin WHERE mein nahi. Iska reason kya hai?",
    options: [
      "ORDER BY ek special keyword hai jo alias ko automatically resolve kar deta hai",
      "ORDER BY logically SELECT ke baad execute hota hai, isliye us waqt tak alias ban chuka hota hai",
      "Yeh sirf ek SQL convention hai, koi technical reason nahi hai",
      "ORDER BY hamesha WHERE se pehle chalta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — logical execution order mein ORDER BY, SELECT ke baad aata hai, isliye jab tak ORDER BY evaluate hota hai tab tak SELECT list ke aliases already ban chuke hote hain. A galat hai, koi special magic nahi hai, yeh sirf execution order ka natural result hai. C galat hai kyunki yeh genuinely execution order se related hai. D completely galat hai, ORDER BY WHERE ke baad execute hota hai.",
    difficulty: "medium",
  },
  {
    id: "sql-fund-4",
    question: "LIMIT clause (ya TOP/FETCH FIRST) execution order mein kahan apply hota hai?",
    options: [
      "Sabse pehle, table scan se pehle hi rows limit ho jaate hain",
      "WHERE se pehle, taaki filtering kam rows pe ho",
      "Sabse last mein, sorting (ORDER BY) complete hone ke baad",
      "SELECT se pehle, projection se pehle hi rows limit ho jaate hain",
    ],
    correctIndex: 2,
    explanation: "Sahi answer C hai — LIMIT logical execution order ka aakhri step hai, jo ORDER BY ke baad apply hota hai, taaki 'top N' rows meaningful ho (sort ke baad). A, B, aur D sab galat hain kyunki LIMIT in kisi bhi step se pehle apply nahi hota — agar aisa hota to bina sort kiye arbitrary rows return ho jaate, jo 'top N' ka matlab hi nahi rakhta.",
    difficulty: "easy",
  },
];

export default quiz;
