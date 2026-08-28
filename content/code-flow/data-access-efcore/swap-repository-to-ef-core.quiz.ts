import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "swap-repository-to-ef-core-1",
    question:
      "In-memory repository ko `EfEmployeeRepository` se replace karne ke baad `EmployeeService` aur `EmployeesController` me kitni lines badalni padti hain?",
    options: [
      "Dono me constructor aur har data call badalni padti hai",
      "Sirf controller me — service data-access se decoupled hai",
      "Zero — sirf `Program.cs` ki registration line badalti hai",
      "Sirf service me `AppDbContext` inject karna padta hai",
    ],
    correctIndex: 2,
    explanation:
      "Service `IEmployeeRepository` interface par depend karti hai, concrete class par nahi. Nayi implementation (`EfEmployeeRepository`) same contract satisfy karti hai, isliye DI registration line badalne se hi swap ho jaata hai. Yahi Dependency Inversion ka payoff hai. Baaki options galat hain kyunki na service, na controller interface ke peeche ki class ko jaante hain.",
    difficulty: "easy",
  },
  {
    id: "swap-repository-to-ef-core-2",
    question:
      "`_db.Employees.Add(employee)` call karne ke baad, `SaveChangesAsync()` call kiye bina, database me kya hota hai?",
    options: [
      "Row turant `INSERT` ho jaati hai, `SaveChangesAsync` sirf commit karta hai",
      "Kuch nahi — `Add` sirf change tracker me entity ko `Added` mark karta hai; `INSERT` `SaveChangesAsync` par jaata hai",
      "Ek open transaction ban jaata hai jo agli query par commit hota hai",
      "EF Core ek exception phenkta hai kyunki `SaveChangesAsync` missing hai",
    ],
    correctIndex: 1,
    explanation:
      "`Add`/`Remove` sirf staging hain — change tracker me entity ka state set hota hai (`Added` / `Deleted`), koi SQL nahi jaata. `SaveChangesAsync` hi saare tracked changes ke liye `INSERT`/`UPDATE`/`DELETE` ek implicit transaction me bhejta hai. Isiliye `SaveChangesAsync` bhoolna ek silent bug hai: API success dikhaayega par row DB me nahi hogi.",
    difficulty: "medium",
  },
  {
    id: "swap-repository-to-ef-core-3",
    question:
      "GET-all endpoint ke liye repository query par `AsNoTracking()` kyun lagate hain, aur kab NAHI lagana chahiye?",
    options: [
      "Hamesha lagao — ye query ko cache karta hai",
      "Read-only list ke liye lagao (tez, kam memory); jab entity ko edit karke `SaveChanges` karna ho tab mat lagao",
      "Sirf tab lagao jab table me 1000+ rows hon",
      "`AsNoTracking()` sirf `FindAsync` ke saath kaam karta hai, `ToListAsync` ke saath nahi",
    ],
    correctIndex: 1,
    explanation:
      "`AsNoTracking()` EF ko batata hai ki materialized entities ko change tracker me mat rakho — read-only scenarios me thoda tez aur kam memory. Lekin agar tum us entity ko property set karke `SaveChangesAsync` karna chahte ho, to no-tracking entity ke changes EF detect nahi karega aur save chup-chaap no-op ho jaayega. Isliye edit-and-save path pe `AsNoTracking()` nahi.",
    difficulty: "medium",
  },
  {
    id: "swap-repository-to-ef-core-4",
    question:
      "`FindAsync(id)` aur `FirstOrDefaultAsync(e => e.Id == id)` me practical farak kya hai?",
    options: [
      "Dono bilkul same hain, sirf naam alag",
      "`FindAsync` pehle change tracker me dekhta hai (tracked entity ho to 0 DB round-trip); `FirstOrDefaultAsync` hamesha DB pe jaata hai aur `Include` / non-PK conditions allow karta hai",
      "`FirstOrDefaultAsync` sirf pehli row deta hai chahe condition kuch bhi ho",
      "`FindAsync` async nahi hai, wo blocking call hai",
    ],
    correctIndex: 1,
    explanation:
      "`FindAsync` primary-key optimized hai: pehle already-loaded (tracked) entities me dekhta hai, mila to DB hit nahi karta. Lekin wo sirf PK se kaam karta hai aur `Include` support nahi karta. `FirstOrDefaultAsync` ek predicate leta hai, hamesha DB query karta hai, aur `Include`/joins ke saath use ho sakta hai. Isliye PK lookup = `FindAsync`, baaki sab = `FirstOrDefaultAsync`.",
    difficulty: "hard",
  },
];

export default quiz;
