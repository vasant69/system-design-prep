import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "change-track-1",
    question: "EF Core ke `EntityState` enum ki paanch values kaunsi hain?",
    options: [
      "New, Old, Changed, Removed, Free",
      "Added, Unchanged, Modified, Deleted, Detached",
      "Insert, Update, Delete, Select, None",
      "Tracked, Untracked, Dirty, Clean, Null",
    ],
    correctIndex: 1,
    explanation:
      "EF Core ke `EntityState` enum me exactly ye paanch values hain: `Added`, `Unchanged`, `Modified`, `Deleted`, `Detached`. `SaveChanges()` in states ko read karke decide karta hai kaunsi SQL statement generate karni hai (ya kuch nahi, `Detached`/`Unchanged` ke liye).",
    difficulty: "easy",
  },
  {
    id: "change-track-2",
    question: "Ek tracked entity ki ek property assign karne ke baad (`product.Price = 99;`), uski state automatically kya ban jaati hai?",
    options: ["Deleted", "Added", "Modified", "Detached"],
    correctIndex: 2,
    explanation:
      "Change tracker property assignments ko original-value snapshot ke against compare karta hai. Jab ek tracked (`Unchanged`) entity ki koi property change hoti hai, state automatically `Modified` ho jaati hai — developer ko explicitly kuch set karne ki zaroorat nahi hoti normal case me.",
    difficulty: "easy",
  },
  {
    id: "change-track-3",
    question: "`AsNoTracking()` se aayi ek entity ko modify karke `SaveChangesAsync()` call karne par kya hota hai?",
    options: [
      "Exception throw hoti hai turant",
      "Changes silently ignore ho jaate hain, koi error nahi aata",
      "Changes normal tareeke se save ho jaate hain",
      "Application crash ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`AsNoTracking()` se aayi entities `Detached` state me hoti hain — change tracker unhe monitor hi nahi karta. Agar aisi entity ko modify karke `SaveChangesAsync()` call kiya jaaye, EF Core ko pata hi nahi ki kuch modify hua hai (koi tracking nahi hai), isliye koi SQL generate nahi hoti, koi exception bhi nahi — changes bas silently lost ho jaate hain. Ye ek subtle, debugging-mushkil bug hai.",
    difficulty: "hard",
  },
  {
    id: "change-track-4",
    question: "Ek high-traffic `GET /api/products` endpoint sirf data read karke JSON return karta hai, kabhi save nahi karta. Performance improve karne ke liye kya lagana chahiye?",
    options: [
      "context.Products.Include() har jagah",
      "context.Products.AsNoTracking() — change tracking overhead skip karne ke liye",
      "context.SaveChanges() explicitly har request ke end me",
      "DbContext ko Singleton bana dena",
    ],
    correctIndex: 1,
    explanation:
      "`AsNoTracking()` exactly is scenario ke liye designed hai — read-only queries jahan data kabhi save nahi hoga. Ye change tracker ka original-value-snapshot overhead skip karta hai, jo bade result sets ke liye performance aur memory dono improve karta hai. Options A, C, D is problem ko address nahi karte (C to actively harmful hai — koi zaroorat nahi hai, D DbContext ko galat lifetime deta hai jo thread-safety issues create karega).",
    difficulty: "medium",
  },
];

export default quiz;
