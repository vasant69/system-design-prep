import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "adonet-tr-1",
    question: "ADO.NET ke core object model ke chaar main players kaun hain, aur har ek ka role kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "SqlConnection (connection), SqlCommand (SQL statement to run), SqlDataReader (connected streaming result), aur DataSet/DataTable (disconnected in-memory alternative).",
    detailedAnswer:
      "`SqlConnection` database se ek physical connection represent karta hai. `SqlCommand` ek SQL statement ya stored procedure call represent karta hai jo us connection ke upar execute hota hai — `ExecuteReader`/`ExecuteNonQuery`/`ExecuteScalar` teen execution paths hain. `SqlDataReader` connected, forward-only, streaming result set hai jo `ExecuteReader()` return karta hai. `DataSet`/`DataTable` older, disconnected model hai jahan poora result memory me load ho jaata hai aur connection close ho sakta hai.",
    followUp: "Modern code me `DataSet`/`DataTable` kyun rarely use hota hai?",
  },
  {
    id: "adonet-tr-2",
    question: "`SqlDataReader` (connected) aur `DataTable` (disconnected) me practical difference kya hai, aur kab kaunsa better hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "SqlDataReader memory-efficient hai (ek time pe ek row) lekin connection open rakhna padta hai; DataTable poora data memory me load karta hai lekin connection turant release ho jaata hai aur data offline edit ho sakta hai.",
    detailedAnswer:
      "`SqlDataReader` bade result sets ke liye better hai kyunki memory footprint minimal hai — sirf current row hold hoti hai. Trade-off: connection us poore duration me open rehni chahiye jab tak reading chal rahi hai, jo connection pool pe pressure daal sakta hai agar processing slow ho. `DataTable` chhote result sets ya scenarios ke liye better hai jahan data ko modify karke baad me wapas save karna ho (disconnected editing) — connection sirf fill/update ke liye briefly open hoti hai. Modern high-throughput APIs almost always `SqlDataReader`-style streaming (ya ORM ka equivalent) prefer karte hain.",
  },
  {
    id: "adonet-tr-3",
    question: "Ye code me kya problem hai?\n```csharp\nSqlConnection conn = new SqlConnection(connStr);\nconn.Open();\nSqlCommand cmd = new SqlCommand(\"SELECT * FROM Orders\", conn);\nvar reader = cmd.ExecuteReader();\n// process reader...\n```",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Koi `using`/`Dispose()` nahi hai — connection, command, aur reader kabhi explicitly release nahi ho rahe.",
    detailedAnswer:
      "`SqlConnection`, `SqlCommand`, aur `SqlDataReader` teeno `IDisposable` hain. Bina `using` (ya try/finally + explicit Dispose) ke, connection pool me turant release nahi hoti — garbage collector eventually finalizer se cleanup kar sakta hai, lekin ye unpredictable timing pe hota hai. Load ke under ye connection pool exhaustion aur timeout errors ki taraf le jaata hai. Fix: `using SqlConnection conn = ...` (ya block-scoped `using (...)`) har teen object ke liye.",
    redFlag: "Candidate ko code dekhkar bhi disposal issue turant na dikhna — ye ek basic-hygiene gap signal karta hai.",
  },
  {
    id: "adonet-tr-4",
    question: "`ExecuteReader()`, `ExecuteNonQuery()`, aur `ExecuteScalar()` — kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "ExecuteReader = SELECT jo multiple rows return kare; ExecuteNonQuery = INSERT/UPDATE/DELETE; ExecuteScalar = single value.",
    detailedAnswer:
      "`ExecuteReader()` un queries ke liye hai jo rows return karti hain (SELECT) — result ek `SqlDataReader` hota hai jise iterate karte ho. `ExecuteNonQuery()` un statements ke liye hai jo rows return nahi karte (INSERT/UPDATE/DELETE, ya DDL) — return value affected rows ka count hota hai. `ExecuteScalar()` tab use hota hai jab query ek hi value return karti ho (jaise `SELECT COUNT(*)` ya `SELECT MAX(Price)`) — sirf first row, first column return karta hai, baaki silently ignore ho jaata hai.",
  },
  {
    id: "adonet-tr-5",
    question: "Ek high-traffic ASP.NET Core API me sync `SqlCommand.ExecuteReader()` use ho raha hai async `ExecuteReaderAsync()` ki jagah. Isse kya problem aa sakti hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Sync I/O call karne wale thread-pool thread ko block karta hai — high concurrency load ke under thread-pool starvation ho sakta hai.",
    detailedAnswer:
      "ASP.NET Core requests thread-pool threads pe handle hoti hain. Ek sync `ExecuteReader()` call database I/O complete hone tak calling thread ko fully block karta hai — us thread se koi doosra kaam nahi ho sakta. High concurrency ke under (bahut saare simultaneous requests, har ek database call kar rahi hai), ye jaldi thread-pool starvation create kar sakta hai — naye requests process karne ke liye threads available nahi hote, latency spike hoti hai. `ExecuteReaderAsync()`/`OpenAsync()` use karne se thread I/O wait ke dauraan pool me wapas chala jaata hai, doosre requests serve kar sakta hai.",
    followUp: "Ye same principle EF Core ke async methods (`ToListAsync`, `SaveChangesAsync`) pe kaise apply hota hai?",
  },
  {
    id: "adonet-tr-6",
    question: "Kya ye statement sahi hai: 'EF Core aur ADO.NET completely alag, unrelated technologies hain'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — EF Core internally ADO.NET provider classes (DbConnection/DbCommand/DbDataReader) use karta hai.",
    detailedAnswer:
      "EF Core ek higher-level abstraction hai jo LINQ ko SQL me translate karta hai, change tracking karta hai, migrations manage karta hai — lekin actual database ke saath communication ke liye, ye ultimately ADO.NET ke provider-agnostic base classes hi use karta hai. Query execute karne ka final step wahi hai jo raw ADO.NET me manually likha jaata — command execute, reader se rows padhna, objects me map karna. EF Core ye boilerplate automate karta hai, replace nahi karta.",
    redFlag: "'EF Core apna khud ka database protocol use karta hai' jaisa confidently galat statement — batata hai stack ka layering samjha nahi gaya.",
  },
  {
    id: "adonet-tr-7",
    question: "`DataSet`/`DataTable` aaj bhi kis tarah ke codebases me milte hain, aur kyun modern code inhe avoid karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Legacy WinForms/enterprise codebases me — modern code strongly-typed ORM objects prefer karta hai kyunki DataTable weakly-typed hai (casting chahiye).",
    detailedAnswer:
      "`DataTable`/`DataSet` .NET Framework-era WinForms/enterprise applications me common the jahan disconnected, editable in-memory data grids chahiye the. Modern code inhe avoid karta hai kyunki access weakly-typed hai (`row[\"Name\"]` returns `object`, manual casting chahiye — no compile-time safety), aur EF Core/Dapper zyada ergonomic, strongly-typed alternative dete hain bina extra boilerplate ke.",
  },
  {
    id: "adonet-tr-8",
    question: "Ek `SqlDataReader` se rows padhte waqt, kya usi connection pe ek naya `SqlCommand` execute karna safe hai bina pehle reader close kiye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi (default), unless `MultipleActiveResultSets=true` connection string me set ho — warna InvalidOperationException aayega.",
    detailedAnswer:
      "Default SQL Server ADO.NET behavior me, ek connection ek time pe sirf ek active `SqlDataReader` support karta hai. Reader open hote hue dusra command run karne ki koshish karne par 'There is already an open DataReader associated with this Connection' exception aata hai. Fix: ya to reader ko pehle close/dispose karo, ya connection string me `MultipleActiveResultSets=true` (MARS) enable karo — lekin MARS apna perf overhead laata hai, isliye default-off hai aur judiciously use karna chahiye.",
  },
  {
    id: "adonet-tr-9",
    question: "Aaj kal seedha ADO.NET (bina EF Core/Dapper) kab likha jaata hai production code me?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Narrow cases — extreme perf-critical bulk operations, ya existing legacy systems jahan migration ka business case weak hai.",
    detailedAnswer:
      "Zyadatar modern .NET code EF Core (productivity, change tracking, migrations) ya Dapper (perf + explicit control, minimal overhead) use karta hai. Raw ADO.NET tab likha jaata hai jab: (1) ek extremely perf-critical path hai jahan har allocation/abstraction layer matter karta hai (jaise bulk-insert operations), ya (2) ek legacy system already ADO.NET pe hai aur poora rewrite karne ka risk/cost benefit se zyada hai. Nayi greenfield development me raw ADO.NET likhna rare hai.",
  },
];

export default questions;
