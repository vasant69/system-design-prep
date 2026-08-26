import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "conn-disconn-tr-1",
    question: "Connected aur disconnected data-access architecture me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Cognizant", "Wipro"],
    shortAnswer:
      "Connected (SqlDataReader) connection ko open rakhta hai jab tak data stream ho raha hai; disconnected (DataSet/DataTable) poora data memory me copy karke connection turant close kar deta hai.",
    detailedAnswer:
      "Connected model me `SqlDataReader` database se ek live stream maintain karta hai — connection open rehta hai jab tak rows read ki ja rahi hain, memory footprint minimal hai (ek time pe ek row). Disconnected model me `SqlDataAdapter.Fill()` poora result set ek `DataTable`/`DataSet` me copy karta hai aur turant connection close kar deta hai — data ab offline hai, jitni der chaho process/edit kar sakte ho, lekin memory usage poore result set ke proportional hai.",
    followUp: "Ek bade result set ke liye tum kaunsa model prefer karoge, aur kyun?",
  },
  {
    id: "conn-disconn-tr-2",
    question: "Connection pooling kya hai, aur ye 'baar-baar connection open/close karna expensive hai' assumption ko kaise galat saabit karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Connection pooling physical connections ko close hone par pool me rakh deta hai reuse ke liye — isliye baar-baar open/close karna actually cheap hai, expensive nahi.",
    detailedAnswer:
      "Bina pooling ke, har `Open()` ek naya TCP handshake + SQL Server authentication cycle karta, jo genuinely expensive hai. ADO.NET providers ye automatically pool karte hain — `Close()`/`Dispose()` call karne par physical connection database se turant disconnect nahi hota, ek pool me (same connection string ke liye) wapas rakh diya jaata hai. Agla `Open()` call, agar pool me connection available hai, usi existing physical connection ko turant reuse kar leta hai. Isliye short-lived, `using`-scoped connections best practice hain — pooling ye efficient banata hai.",
  },
  {
    id: "conn-disconn-tr-3",
    question: "Ek team production me 'Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool' error dekhti hai high load ke dauraan. Iske possible root causes kya ho sakte hain?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Connections properly dispose nahi ho rahe (using missing), ya genuine load pool size (default 100) se zyada hai.",
    detailedAnswer:
      "Do common root causes: (1) Code me `SqlConnection`/`SqlCommand`/`SqlDataReader` ko `using` ke bina chhoda gaya hai, ya connections zaroorat se zyada der tak open rakhe ja rahe hain (jaise reader ke andar slow processing) — pool exhaust ho jaata hai kyunki connections release hi nahi ho rahe. (2) Genuinely concurrent demand pool ke `Max Pool Size` (default 100) se zyada hai — is case me pool size tune karna ya connection usage pattern optimize karna zaroori hai. Debugging approach: pehle code audit karo disposal patterns ke liye, phir agar sab sahi hai, load/pool-size mismatch consider karo.",
    followUp: "Kaise diagnose karoge ki ye disposal bug hai ya genuine capacity issue?",
  },
  {
    id: "conn-disconn-tr-4",
    question: "Ye code me kya anti-pattern hai?\n```csharp\npublic class OrderService\n{\n    private static SqlConnection _connection = new SqlConnection(connStr);\n    // saare methods isi _connection ko reuse karte hain\n}\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Ek static, shared connection instance — concurrent requests race karengi, aur ye pooling ka fayda bhi khatam kar deta hai.",
    detailedAnswer:
      "`SqlConnection` instances thread-safe nahi hain concurrent simultaneous operations ke liye. Ek static shared connection use karne se, agar do requests parallel me isi connection se query chalane ki koshish karti hain, unpredictable errors ('connection already has a pending operation') aa sakte hain. Iske alawa, ADO.NET ka connection pooling already efficient reuse deta hai short-lived connections ke through — manually ek connection ko application-lifetime tak hold karna is built-in mechanism ko bypass karta hai, koi genuine benefit nahi deta, sirf risk add karta hai. Fix: har operation apna khud ka `using`-scoped connection banaye.",
    redFlag: "Candidate ko is pattern me koi issue na dikhna, ya 'connection reuse achha hai performance ke liye' bolna without qualifying that pooling already handles this.",
  },
  {
    id: "conn-disconn-tr-5",
    question: "Ek lakh rows wali ek report generate karni hai jo ek file me write hogi. Tum `SqlDataReader` use karoge ya `DataTable`? Justify karo.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "SqlDataReader — streaming se memory footprint minimal rehta hai, ek lakh rows ek saath memory me load karne ki zaroorat nahi.",
    detailedAnswer:
      "`SqlDataReader` is scenario ke liye better hai kyunki tumhe rows ko sequentially process karke file me likhna hai — ek connected, forward-only stream exactly ye pattern support karta hai, aur memory me sirf current row hoti hai. `DataTable` use karna poore ek-lakh-row result ko memory me copy karega jo unnecessary hai jab tumhe data ko modify/re-query nahi karna, sirf ek baar sequentially process karna hai. `DataTable` tab justified hota jab data ko disconnect karke edit/re-sync karna ho.",
  },
  {
    id: "conn-disconn-tr-6",
    question: "Kya connection pooling application-level configuration hai ya connection-string-level?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Connection-string-level — same connection string wale requests ek shared pool use karte hain.",
    detailedAnswer:
      "ADO.NET providers connection strings ke basis pe alag-alag pools maintain karte hain — agar do parts of an application slightly different connection strings use karte hain (jaise alag `Application Name` parameter), unke connections alag pools me jaate hain, effectively pooling ka benefit fragment ho sakta hai. Ye ek subtle gotcha hai — consistent connection strings use karna (unnecessary variation avoid karna) pooling efficiency maintain karta hai.",
    followUp: "Agar tumhare paas multiple microservices same database use kar rahe hon, kya unka connection pool share hota hai?",
  },
  {
    id: "conn-disconn-tr-7",
    question: "Disconnected model (`DataTable`) me data ko modify karke wapas database me kaise sync karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`SqlDataAdapter.Update()` — ye tracked changes (added/modified/deleted rows) ko wapas database me apply karta hai.",
    detailedAnswer:
      "`DataTable` internally row states track karta hai (`Added`, `Modified`, `Deleted`, `Unchanged`) jab tum data ko in-memory modify karte ho. `SqlDataAdapter.Update(dataTable)` call karne par, adapter connection reopen karta hai, tracked changes ke basis pe appropriate INSERT/UPDATE/DELETE statements generate/execute karta hai, aur phir connection wapas close kar deta hai. Ye disconnected-edit-then-sync pattern EF Core ke change tracking se conceptually similar hai, bas bahut zyada manual/low-level hai.",
  },
  {
    id: "conn-disconn-tr-8",
    question: "Kya ye sahi hai ki connected architecture hamesha disconnected se better hai kyunki wo memory-efficient hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — connected model connection ko der tak occupied rakh sakta hai agar processing slow ho, jo high-concurrency scenarios me pool pressure create karta hai.",
    detailedAnswer:
      "Ye ek oversimplification hai. Connected architecture memory-efficient hai, lekin iska trade-off ye hai ki connection tab tak open rehta hai jab tak processing chal rahi hai. Agar processing slow hai (external calls, heavy computation per row), connection unnecessarily der tak busy rehta hai, jo high-concurrency load ke under connection pool pe pressure daalta hai. Disconnected model connection ko turant free kar deta hai — jo high-concurrency, quick-fetch scenarios me actually better ho sakta hai, memory trade-off ke bawajood. 'Better' scenario-dependent hai, universal nahi.",
    redFlag: "Bina context ke ek model ko universally 'better' bol dena — engineering trade-off thinking ki kami dikhata hai.",
  },
];

export default questions;
