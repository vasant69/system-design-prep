import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "concurrency-1",
    question: "Jab tum ek `DbContext` me multiple entities modify karke ek hi `SaveChangesAsync()` call karte ho, kya guarantee milti hai?",
    options: [
      "Har entity apni khud alag transaction me save hoti hai",
      "Saari changes ek single atomic transaction me wrap hoti hain — sab succeed ya sab fail",
      "Koi transaction guarantee nahi hoti, partial saves ho sakte hain",
      "Sirf pehli entity actually save hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "`SaveChanges()`/`SaveChangesAsync()` automatically saari pending tracked changes ko ek single database transaction me wrap karta hai — ye atomic guarantee deta hai: ya to saari changes commit hoti hain, ya koi nahi (rollback on failure). Ye ek core, default EF Core behavior hai.",
    difficulty: "medium",
  },
  {
    id: "concurrency-2",
    question: "`[Timestamp]`/`RowVersion` column ka purpose kya hai optimistic concurrency me?",
    options: [
      "Row kab create hui thi wo store karta hai",
      "Har UPDATE pe automatically database dwara badal diya jaata hai, aur UPDATE ke WHERE clause me original value check karke conflict detect kiya jaata hai",
      "Manually application code se increment kiya jaata hai concurrency track karne ke liye",
      "Sirf logging purposes ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`RowVersion` ek database-managed value hai jo automatically har row modification pe change hoti hai. EF Core UPDATE ke WHERE clause me original (read-time) RowVersion include karta hai — agar koi aur meanwhile update kar chuka hai, actual current RowVersion match nahi karega, 0 rows affected honge, aur `DbUpdateConcurrencyException` throw hoga. Ye application-managed nahi hai (option C galat) aur creation-time (option A) ke liye nahi hai.",
    difficulty: "medium",
  },
  {
    id: "concurrency-3",
    question: "'Optimistic concurrency conflicts ko prevent karta hai' — kya ye statement sahi hai?",
    options: [
      "Haan, ye conflicts ko hone hi nahi deta",
      "Nahi — ye conflicts ko save-time pe DETECT karta hai, prevent nahi karta edit-time pe (koi lock nahi liya jaata)",
      "Sirf partially sahi hai, ye 50% conflicts prevent karta hai",
      "Ye statement meaningless hai, optimistic concurrency ka koi conflict-handling nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Ye statement galat hai. Optimistic concurrency edit ke dauraan koi database lock nahi leta — dono users freely simultaneously data edit kar sakte hain. Conflict sirf `SaveChanges()` call hone par detect hota hai (RowVersion mismatch se). Prevention (pehle se hi doosre user ko blokna) pessimistic locking ka kaam hai, jo alag, zyada throughput-costly approach hai.",
    difficulty: "hard",
  },
  {
    id: "concurrency-4",
    question: "Ek `DbUpdateConcurrencyException` catch hone par, current actual database values (jo dusre user ne save kiye) kaise fetch karte ho conflict resolve karne ke liye?",
    options: [
      "ex.Message string parse karke",
      "ex.Entries.Single().GetDatabaseValuesAsync() se",
      "Ek naya SqlConnection bana kar raw SQL query chalao",
      "Ye information exception se nahi mil sakti kabhi",
    ],
    correctIndex: 1,
    explanation:
      "`DbUpdateConcurrencyException.Entries` conflicting entity entries ka access deta hai, aur `GetDatabaseValuesAsync()` current, actual database state fetch karta hai us entity ke liye — jo standard conflict-resolution logic (client-wins/database-wins/merge decide karne) ke liye use hota hai. Ye EF Core ka built-in, designed-for-this-purpose mechanism hai.",
    difficulty: "medium",
  },
];

export default quiz;
