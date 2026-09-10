import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "efc-1",
    question: "N+1 query problem kya hai EF Core me, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek query parent list laati hai (1), phir har parent ke liye ek aur query uski related data ke liye (N) — loop me navigation property access karne se. Fix: `Include(a => a.Books)` (eager load, ek JOIN), ya read-only ho to `Select` projection jo sirf zaroori columns laaye.",
    detailedAnswer:
      "Isse pakadne ke liye SQL logging on karo (`EnableSensitiveDataLogging` dev me) — 50 rows par 51 queries turant dikhti hain. `Include` tab jab entities chahiye; projection tab jab bas display karna hai (chhoti SELECT, no change tracking). Split queries (`AsSplitQuery`) bade Includes ke cartesian-explosion se bachate hain.",
    followUp: "`Include` aur ek DTO projection me kaunsa kab prefer karoge?",
  },
  {
    id: "efc-2",
    question: "`IQueryable` vs `IEnumerable` — filter kis par lagana chahiye aur kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`IQueryable` par — us par lagaya `Where`/`OrderBy`/`Select` SQL me translate hoke DB par chalta hai. `IEnumerable` (jaise `ToList()` ke baad) par lagana matlab poora table memory me aa chuka aur filter ab client par chalega — badi table par disaster.",
    detailedAnswer:
      "Rule: `ToList()`/`ToArray()`/`AsEnumerable()` ko query ke *sabse aakhir* me call karo, saare filters/projections ke baad. Ek method jise EF SQL me translate nahi kar sakta (custom C# logic) `Where` me daalna newer EF me exception deta hai — jaan-boojh kar `AsEnumerable()` se pehle move karo aur cost samjho.",
    redFlag: "`db.Orders.ToList().Where(o => o.Total > 1000)` likhna aur perf ki shikayat karna.",
  },
  {
    id: "efc-3",
    question: "Change tracking kya hai, aur `AsNoTracking()` kab use karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "EF loaded entities ka snapshot rakhta hai; `SaveChanges` par wo unhe current values se compare karke `UPDATE`/`INSERT`/`DELETE` generate karta hai. `AsNoTracking()` snapshotting skip karta hai — read-only queries (lists, reports, GET endpoints) ke liye use karo: kam memory, tez.",
    detailedAnswer:
      "Tracking tabhi chahiye jab tum entity ko modify karke wapas save karoge. Ek GET jo bas data return karta hai use tracking ki zaroorat nahi, aur bade result sets par snapshot overhead noticeable hota hai. `context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking` isse default bhi bana sakte ho aur jahan chahiye wahan `AsTracking()` opt-in.",
  },
];

export default questions;
