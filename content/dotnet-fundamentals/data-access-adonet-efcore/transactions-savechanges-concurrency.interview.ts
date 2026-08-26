import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "concurrency-tr-1",
    question: "`SaveChanges()` transactions ke saath kaise kaam karta hai by default?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "TCS", "Amazon"],
    shortAnswer: "Automatically saari pending tracked changes (across multiple entities/DbSets) ek single atomic transaction me wrap karta hai.",
    detailedAnswer:
      "Jab `SaveChanges()`/`SaveChangesAsync()` call hota hai, EF Core saari tracked entities (Added/Modified/Deleted state wali) ko dekhta hai, unke liye SQL statements generate karta hai, aur inhe **automatically ek single database transaction** ke andar execute karta hai. Agar koi ek statement fail hoti hai (jaise ek constraint violation), poora transaction rollback ho jaata hai — koi partial state database me nahi bachta. Multiple `SaveChanges()` calls ko ek transaction me combine karna ho, explicit `context.Database.BeginTransactionAsync()` chahiye.",
    followUp: "Agar tumhe do alag DbContext instances ke operations ko ek hi transaction me combine karna ho, kaise karoge?",
  },
  {
    id: "concurrency-tr-2",
    question: "Optimistic concurrency control ko step-by-step implement karo — code likho jo RowVersion use kare.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Entity me [Timestamp] byte[] RowVersion add karo; SaveChangesAsync try-catch me wrap karo DbUpdateConcurrencyException ke liye.",
    detailedAnswer:
      "```csharp\npublic class Product\n{\n    public int Id { get; set; }\n    public int Stock { get; set; }\n    [Timestamp]\n    public byte[] RowVersion { get; set; } = null!;\n}\n\ntry\n{\n    product.Stock -= quantity;\n    await context.SaveChangesAsync();\n}\ncatch (DbUpdateConcurrencyException ex)\n{\n    var entry = ex.Entries.Single();\n    var dbValues = await entry.GetDatabaseValuesAsync();\n    if (dbValues == null) { /* row deleted by someone else */ }\n    else { /* resolve: client-wins, database-wins, or merge */ }\n}\n```\n`[Timestamp]` column database-managed hai — har UPDATE pe automatically badalta hai. EF Core generated UPDATE ke WHERE clause me original RowVersion include karta hai; mismatch hone par exception throw hoti hai.",
  },
  {
    id: "concurrency-tr-3",
    question: "Do users simultaneously ek hi `Product.Stock` field update karte hain bina concurrency control ke. Kya problem ho sakta hai, aur ye kaise manifest hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Lost update problem — jo bhi baad me save kare, uski value final rehti hai, pehle wale user ka change silently overwrite ho jaata hai.",
    detailedAnswer:
      "Ye 'lost update' problem hai. Maano dono users ek hi original `Stock = 100` padhte hain. User A `Stock = 90` set karke save karta hai (successful). User B, apni memory me abhi bhi `Stock = 100` hai, `Stock = 95` set karke save karta hai — bina concurrency check ke, ye simply overwrite kar deta hai, final value `95` ho jaati hai, jab ki dono changes ko combine karke actual correct value kuch aur honi chahiye thi. User A ka change silently 'lost' ho gaya, koi error, koi notification nahi. Ye exactly wo problem hai jo optimistic concurrency (RowVersion check) prevent/detect karta hai.",
    redFlag: "Candidate ko is problem ka naam ('lost update') na pata hona, ya sirf 'race condition' bol kar chhod dena bina specific mechanism explain kiye.",
  },
  {
    id: "concurrency-tr-4",
    question: "Optimistic aur Pessimistic concurrency control me kya trade-off hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Optimistic: no locks, higher throughput, conflict detected (not prevented) at save time — good for low-contention. Pessimistic: locks held during edit, prevents conflicts upfront, reduces concurrency/throughput — good for high-contention.",
    detailedAnswer:
      "Optimistic concurrency koi lock nahi leta jab data edit ho raha hota hai — high throughput, kyunki multiple users freely simultaneously read/edit kar sakte hain. Trade-off: conflict sirf save-time pe pata chalta hai, aur agar hota hai to ek user ko retry karna padta hai (kuch kaam waste hota hai). Pessimistic locking database-level locks leta hai jab tak ek user edit kar raha ho, dusre users ko us record ke liye wait karna padta hai — conflicts upfront prevent ho jaate hain, lekin throughput significantly reduce hota hai kyunki concurrent access serialize ho jaata hai. Optimistic zyada common hai web applications me (typical low-contention, high-read scenarios); pessimistic tab justified hai jab conflicts genuinely frequent hon aur retry-based flow acceptable na ho (jaise financial ledger operations kabhi-kabhi).",
    followUp: "SQL Server me pessimistic locking kaise implement karte ho EF Core ke saath?",
  },
  {
    id: "concurrency-tr-5",
    question: "Ek `DbUpdateConcurrencyException` catch hone par teen standard resolution strategies kya hain, aur ek concrete scenario do jahan har ek appropriate ho.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Client-wins (apni values force karo), database-wins (current DB state accept karo), merge (field-by-field decide karo) — scenario-dependent.",
    detailedAnswer:
      "**Client-wins:** `entry.OriginalValues.SetValues(databaseValues)` set karke phir dobara `SaveChangesAsync()` — user ki changes ko force apply karo, current DB state ko overwrite karo. Appropriate jab user explicitly 'meri changes final honi chahiye' expect karta hai (jaise admin override). **Database-wins:** `entry.CurrentValues.SetValues(databaseValues)` — user ki changes discard karke DB ka current state accept karo, user ko notify karo. Appropriate jab conflict resolution simple honi chahiye aur user ko simply refresh karke phir se try karne ko kaha jaa sake (jaise ticket booking). **Merge:** field-by-field manually decide karo (jaise agar `Stock` conflict hai lekin `Name` nahi, sirf `Stock` ke liye specific business logic apply karo — jaise dono users ke deductions ko combine karna). Appropriate jab business logic genuinely field-level intelligent merging support karti ho.",
  },
  {
    id: "concurrency-tr-6",
    question: "Kya `RowVersion` column ko application code se manually increment/set karna chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — ye database-managed hona chahiye, automatically update hota hai har row change pe. Manually set karna concurrency mechanism ko break karta hai.",
    detailedAnswer:
      "`RowVersion` (SQL Server `rowversion`/`timestamp` type) database engine dwara automatically manage kiya jaata hai — har baar jab row modify hoti hai, database khud is value ko naya, unique binary value assign kar deta hai, application code ki involvement ke bina. Agar developer manually is value ko set karne ki koshish kare (jaise ek counter ki tarah increment karna application logic se), ye concurrency detection mechanism ko fundamentally break kar deta hai, kyunki ab ye guarantee nahi rehti ki value genuinely 'is row change hone ke baad kabhi nahi dekha gaya' represent karti hai.",
    redFlag: "Candidate ka ye sochna ki RowVersion ek normal application-managed field hai jise manually control karna chahiye.",
  },
  {
    id: "concurrency-tr-7",
    question: "Kya optimistic concurrency check EF Core me ek extra database round-trip add karta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — RowVersion check UPDATE statement ke WHERE clause me hi included hota hai, ek separate SELECT/check nahi karni padti.",
    detailedAnswer:
      "Ek common misconception ye hai ki EF Core pehle RowVersion 'check' karta hai (ek separate read), phir update karta hai. Actually, EF Core generated UPDATE statement khud hi WHERE clause me original RowVersion condition include kar deta hai (`WHERE Id = @id AND RowVersion = @originalRowVersion`) — ye ek hi atomic database operation hai. Agar 0 rows affected hoti hain (WHERE clause match nahi hua), EF Core ise concurrency conflict ki tarah interpret karta hai. Koi extra round-trip nahi lagta compared to ek normal UPDATE ke.",
  },
];

export default questions;
