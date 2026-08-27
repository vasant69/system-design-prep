import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "triggers-views-1",
    question: "Audit logging ke liye (har order update pe old aur new status record karna), kaunsa trigger timing sabse natural fit hai?",
    options: [
      "BEFORE INSERT, kyunki row abhi tak exist nahi karta",
      "AFTER UPDATE, kyunki hume committed change record karna hai without altering the original write",
      "BEFORE DELETE, kyunki row delete hone se pehle backup chahiye",
      "Trigger ki zaroorat hi nahi, application code kaafi hai",
    ],
    correctIndex: 1,
    explanation: "AFTER UPDATE trigger sahi hai kyunki humein sirf ek committed change ko record karna hai, uss change ko modify nahi karna — BEFORE INSERT galat event hai (yeh UPDATE scenario hai), aur BEFORE DELETE bhi wrong event hai. Application code option bhi valid ho sakta hai lekin trigger ka advantage yeh hai ki koi bhi caller isko bypass nahi kar sakta, jabki application-code approach ko koi doosra script/tool bypass kar sakta hai.",
    difficulty: "medium",
  },
  {
    id: "triggers-views-2",
    question: "Trigger chains ka sabse bada practical danger kya hai?",
    options: [
      "Triggers hamesha query syntax error dete hain",
      "Ek simple write silently cascade ho jaati hai multiple tables mein, bina application code mein kahin dikhe",
      "Triggers sirf SELECT queries pe kaam karte hain",
      "Trigger chains database ko automatically crash kar dete hain",
    ],
    correctIndex: 1,
    explanation: "Trigger chains ka asli risk hidden, undocumented cascading writes hai — ek simple INSERT background mein kai tables ko touch kar sakta hai, jo debugging aur performance analysis ko bahut mushkil bana deta hai. Syntax errors ya automatic crash koi inherent property nahi hai triggers ki, aur triggers INSERT/UPDATE/DELETE pe fire hote hain, SELECT pe nahi.",
    difficulty: "medium",
  },
  {
    id: "triggers-views-3",
    question: "Regular view aur materialized view mein sabse important practical difference kya hai?",
    options: [
      "Regular view sirf ek column dikha sakta hai, materialized view multiple columns",
      "Materialized view physically result store karta hai aur fast read deta hai lekin refresh tak stale reh sakta hai; regular view har baar fresh query re-run karta hai",
      "Regular view sirf admin use kar sakte hain",
      "Materialized view kabhi stale nahi hota, hamesha real-time hota hai",
    ],
    correctIndex: 1,
    explanation: "Materialized view result ko disk pe store karta hai, isliye reads fast hain lekin staleness ka risk hai jab tak refresh na ho. Regular view har query pe underlying SELECT re-execute karta hai, isliye hamesha fresh hota hai but potentially slow for complex queries. Column-count ya admin-only restrictions inherent difference nahi hain, aur materialized view definitely stale ho sakta hai — yeh option factually galat hai.",
    difficulty: "easy",
  },
  {
    id: "triggers-views-4",
    question: "Deeply nested views (view A view B pe based hai, jo view C pe based hai) ka practical problem kya hai?",
    options: [
      "Nested views database mein allowed hi nahi hote",
      "Real execution plan aur data lineage samajhna mushkil ho jaata hai, jo performance debugging ko complex bana deta hai",
      "Nested views automatically materialized ho jaate hain",
      "Nested views sirf read-only databases mein kaam karte hain",
    ],
    correctIndex: 1,
    explanation: "Nested views ka asli issue yeh hai ki developer ko underlying complexity (kitne joins, kitne subqueries) dikhti hi nahi jab woh simple `SELECT * FROM view` likhta hai — isse query plan aur performance debugging bahut confusing ho jaata hai. Nested views most databases mein allowed hote hain (yeh galat statement hai), aur woh automatically materialize nahi hote — yeh ek separate feature hai jo explicitly declare karna padta hai.",
    difficulty: "hard",
  },
];

export default quiz;
