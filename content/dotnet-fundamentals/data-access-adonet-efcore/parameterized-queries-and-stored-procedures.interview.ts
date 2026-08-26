import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "param-query-tr-1",
    question: "Parameterized queries kya hain aur ye SQL injection ko kaise prevent karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer:
      "User input ko SQLParameter ke through ek separate data channel se bhejna, jise database kabhi SQL syntax ki tarah interpret nahi karta — sirf literal data ki tarah.",
    detailedAnswer:
      "String concatenation me user input SQL text ka literal hissa ban jaata hai, isliye attacker special characters (quotes, `--`, `;`) inject karke query ka logic badal sakta hai. Parameterized queries me, query ek placeholder (`@Username`) ke saath precompile hoti hai, aur value alag se ek data channel pe bheja jaata hai. Database driver ye value ko kabhi SQL syntax parse nahi karta — chahe usme kuch bhi ho, wo hamesha ek literal data value treat hoga. Isse attack surface structurally eliminate ho jaata hai, escaping/sanitization jaisa reactive patch nahi hota.",
    followUp: "EF Core aur Dapper me parameterization manually karni padti hai kya?",
  },
  {
    id: "param-query-tr-2",
    question: "Ye code me kya vulnerability hai?\n```csharp\nstring sql = $\"SELECT * FROM Users WHERE Username = '{username}' AND Password = '{password}'\";\nvar cmd = new SqlCommand(sql, connection);\n```",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Classic SQL injection — user input directly SQL string me concatenate ho raha hai.",
    detailedAnswer:
      "Ye string interpolation direct SQL injection vulnerability hai. Agar `username` = `admin' --`, final query ban jaayegi `SELECT * FROM Users WHERE Username = 'admin' --' AND Password = '...'` — `--` SQL me comment start karta hai, isliye password check completely ignore ho jaata hai, authentication bypass ho jaata hai. Fix: parameterized query use karo — `WHERE Username = @Username AND Password = @Password` with `SqlParameter` values.",
    redFlag: "Candidate ko is code me vulnerability na dikhna, ya 'input validate kar lenge frontend pe' jaisa insufficient answer dena.",
  },
  {
    id: "param-query-tr-3",
    question: "Stored procedure ko ADO.NET se call karne ke liye kya setup chahiye, aur output parameter kaise capture karte ho?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "CommandType.StoredProcedure set karo, SqlParameter add karo with ParameterDirection.Output, aur reader close hone ke baad value read karo.",
    detailedAnswer:
      "`command.CommandType = CommandType.StoredProcedure;` set karke procedure name pass karte ho command text ki jagah. Input parameters normal `SqlParameter` ki tarah add hote hain. Output parameter ke liye, `Direction = ParameterDirection.Output` set karke `SqlParameter` add karte ho command ke parameters collection me. Command execute hone aur (agar `SqlDataReader` use hua hai) reader close hone ke baad, `outputParam.Value` se actual output value read kar sakte ho.",
  },
  {
    id: "param-query-tr-4",
    question: "Kya ye statement sahi hai: 'Stored procedure use karna automatically SQL injection se protect karta hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — sirf tab safe hai jab procedure ke andar bhi parameters properly use ho, dynamic-SQL-string-concatenation na ho.",
    detailedAnswer:
      "Ye ek common misconception hai. Ek stored procedure jo apne andar `EXEC('SELECT * FROM Users WHERE Username = ''' + @Username + '''')` jaisa dynamic SQL banata hai string concatenation se, utna hi vulnerable hai jitna application-level concatenation — sirf vulnerability location badal gayi hai, mechanism nahi. Genuine safety tab aati hai jab stored procedure ke andar bhi properly-typed parameters directly query me use ho, koi concatenated dynamic SQL na ho.",
    redFlag: "'Hum stored procedures use karte hain isliye SQL injection possible hi nahi' jaisa unconditional confident statement.",
  },
  {
    id: "param-query-tr-5",
    question: "`AddWithValue` ke saath ek production issue mila hai jahan same query different execution plans use kar rahi hai different string lengths ke saath. Ye kyun ho sakta hai, aur fix kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "AddWithValue implicit type/size infer karta hai .NET value se, jo query plan cache fragmentation cause kar sakta hai; explicit SqlDbType/size specify karna fix hai.",
    detailedAnswer:
      "`AddWithValue` .NET string value ki actual length se parameter size infer karta hai (jaise `NVARCHAR(5)` ek 5-character string ke liye, `NVARCHAR(10)` ek 10-character string ke liye) — different lengths alag SQL parameter signatures create karte hain, jo SQL Server ke query plan cache me alag entries bana sakta hai (plan cache bloat/fragmentation), aur consistent plan reuse rokta hai. Fix: explicit `SqlDbType` aur fixed size specify karo (`Parameters.Add(\"@Name\", SqlDbType.NVarChar, 100)`), taaki parameter signature consistent rahe chahe actual value ki length kuch bhi ho.",
    followUp: "Ye issue EF Core me automatically kaise avoid hota hai?",
  },
  {
    id: "param-query-tr-6",
    question: "`ParameterDirection` enum ki chaar values kya hain, aur `ReturnValue` kab use hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Input, Output, InputOutput, ReturnValue — ReturnValue stored procedure ke RETURN statement ka integer value capture karta hai.",
    detailedAnswer:
      "`Input` (default) — value application se database ko jaati hai. `Output` — value database se application ko wapas aati hai (execution ke baad). `InputOutput` — dono directions, initial value pass hoti hai, procedure use modify kar sakta hai. `ReturnValue` — specifically stored procedure ke T-SQL `RETURN` statement ka integer value capture karta hai (jo typically status codes ke liye use hota hai, actual data ke liye nahi — data ke liye output parameters ya result sets use karte hain).",
  },
  {
    id: "param-query-tr-7",
    question: "Ek team debate kar rahi hai: naya feature ke liye stored procedure likhein ya application-layer parameterized SQL/EF Core use karein? Trade-offs kya hain?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Stored procs: fewer round-trips, DBA-managed, fine-grained permissions, lekin logic split ho jaata hai; app-layer: unified codebase, easier version control/testing.",
    detailedAnswer:
      "Stored procedures favor karte hain jab: complex multi-step logic database ke andar hi efficient hai (network round-trips minimize), DBAs independently procedure logic manage/optimize karna chahte hain, ya fine-grained execute-only permissions chahiye (application ko sirf specific procs execute karne diya jaaye, direct table access nahi). Application-layer (EF Core/parameterized ADO.NET/Dapper) favor karte hain jab: business logic ek jagah (application code) rehna chahiye version-control/code-review/testing ke liye consistency ke saath, aur team primarily application-side skills-heavy hai. Koi universal 'correct' answer nahi — team/org context pe depend karta hai.",
    followUp: "Agar tum ek greenfield microservice bana rahe ho, kaunsa default choose karoge aur kyun?",
  },
  {
    id: "param-query-tr-8",
    question: "Kya EF Core/Dapper use karte waqt developer ko manually parameterization ka khayal rakhna padta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "EF Core me nahi (LINQ automatically parameterize hota hai); Dapper me bhi automatic hai jab tum `@param` syntax use karte ho object ke saath.",
    detailedAnswer:
      "EF Core LINQ queries ko hamesha parameterized SQL me translate karta hai — developer ko explicitly kuch nahi karna padta, ye by-design safe hai. Dapper bhi jab tum `connection.Query<T>(\"SELECT * FROM Users WHERE Id = @Id\", new { Id = userId })` jaisa syntax use karte ho, automatically parameterize karta hai. Risk sirf tab aata hai jab developer manually string concatenation/interpolation karke SQL banata hai (jaise dynamic table/column names ke liye) — dono tools me ye galti se possible hai agar developer explicitly raw string concatenation kare.",
  },
];

export default questions;
