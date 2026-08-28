import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "transactions-in-ef-core-1",
    question:
      "Ek repository method ek hi `SaveChangesAsync()` call me teen entities insert karta hai. Doosri entity ka `INSERT` ek constraint violate karta hai. Pehli entity ka kya hota hai?",
    options: [
      "Pehli entity commit ho jaati hai, baaki do fail",
      "Kuch bhi persist nahi hota — EF ek `SaveChangesAsync` ko ek implicit transaction me wrap karta hai, ek statement fail = poora rollback",
      "Teeno insert ho jaati hain aur exception sirf log hota hai",
      "EF pehli do insert karta hai aur teesri ko retry karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek `SaveChangesAsync` call, chahe usme kitne bhi INSERT/UPDATE/DELETE hon, EF Core ke andar ek implicit transaction me chalti hai. Koi bhi statement fail hua to `SaveChangesAsync` throw karta hai aur poora transaction rollback ho jaata hai — database me kuch nahi badalta. Isliye single-call atomic kaam ke liye explicit transaction ki zaroorat nahi.",
    difficulty: "easy",
  },
  {
    id: "transactions-in-ef-core-2",
    question:
      "Employee ka department transfer (`SaveChangesAsync` #1) aur ek audit log row (`SaveChangesAsync` #2) atomic hone chahiye. Sabse sahi approach?",
    options: [
      "Dono `SaveChangesAsync` alag-alag rakho, audit ko try/catch me daal do",
      "`await using var tx = await _db.Database.BeginTransactionAsync(ct)` — dono `SaveChangesAsync`, phir `await tx.CommitAsync(ct)`, `catch` me `await tx.RollbackAsync(ct); throw;`",
      "Dono operations ko ek `SaveChangesAsync` me force karo chahe kaise bhi",
      "`TransactionScope` bina `AsyncFlowOption` ke — wo simplest hai",
    ],
    correctIndex: 1,
    explanation:
      "Atomic unit do `SaveChangesAsync` calls me phaila hai, to explicit transaction chahiye. `BeginTransactionAsync` single connection par local transaction deta hai (koi MSDTC nahi), `CommitAsync` success par, `RollbackAsync` + `throw` exception par. Option A atomicity deta hi nahi. Option C aksar possible nahi (pehle save ke baad generated Id chahiye). Option D silent bug hai — async flow option ke bina ambient transaction `await` ke baad kho jaata hai.",
    difficulty: "medium",
  },
  {
    id: "transactions-in-ef-core-3",
    question:
      "`TransactionScope` ko async EF Core code ke saath use karte waqt `TransactionScopeAsyncFlowOption.Enabled` pass nahi kiya. Kya hota hai?",
    options: [
      "Compile error — ye option required parameter hai",
      "Kuch nahi, wo option sirf performance hint hai",
      "`await` ke baad ambient transaction kho jaata hai; baad ke writes transaction ke bahar auto-commit ho jaate hain — silent inconsistency",
      "`TransactionScope` turant ek distributed transaction me escalate ho jaata hai",
    ],
    correctIndex: 2,
    explanation:
      "Ambient transaction thread-local hai. `await` ke baad continuation kisi doosre thread par resume ho sakta hai, aur `AsyncFlowOption.Enabled` ke bina ambient transaction us continuation ke saath flow nahi karta. Result: `await` ke baad wale `SaveChangesAsync` transaction ke bahar chal jaate hain aur alag se commit ho jaate hain — `scope.Complete()` na hone par bhi. Local/low-concurrency me chhup jaata hai, load par toot-ta hai.",
    difficulty: "hard",
  },
  {
    id: "transactions-in-ef-core-4",
    question:
      "Single SQL Server database, single `AppDbContext`. `BeginTransactionAsync` vs `TransactionScope` — kaunsa default aur kyun?",
    options: [
      "`TransactionScope` — kyunki wo ambient hai aur code ko transaction ka pata nahi hona chahiye",
      "`BeginTransactionAsync` — single connection par local transaction, native async + `CancellationToken`, koi distributed-escalation ya async-flow trap nahi",
      "Dono barabar hain, koi bhi choose kar lo",
      "Na koi — single DB me transaction ki zaroorat hi nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Single database ke liye `BeginTransactionAsync` cleaner hai: transaction object explicit hai, `ct` natively support hota hai, ek connection par local transaction rehta hai (koi MSDTC nahi), aur `TransactionScope` wala `AsyncFlowOption` trap hai hi nahi. `TransactionScope` sirf tab jab genuinely multiple resources (do DBs, ya DB + doosra store) ko ek unit me bind karna ho. Option D galat — multi-`SaveChanges` atomicity ke liye transaction chahiye.",
    difficulty: "medium",
  },
];

export default quiz;
