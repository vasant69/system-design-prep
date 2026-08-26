import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "adonet-fund-1",
    question: "`SqlDataReader` ko sabse achhe se kaise describe karoge?",
    options: [
      "Disconnected, in-memory snapshot of the entire result set",
      "Connected, forward-only stream jo ek time pe ek row rakhta hai",
      "A caching layer jo repeated queries ko speed up karta hai",
      "Ek ORM jo automatically SQL generate karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`SqlDataReader` connected aur forward-only hota hai — connection open rehta hai jab tak reader use ho raha hai, aur ek time pe sirf current row memory me hoti hai. Option A `DataTable`/`DataSet` ko describe karta hai, disconnected model. Option C aur D dono galat hain — reader caching ya ORM nahi hai, sirf ek raw streaming mechanism hai.",
    difficulty: "easy",
  },
  {
    id: "adonet-fund-2",
    question: "In teen `SqlCommand` execution methods me se kaunsa single scalar value (jaise `COUNT(*)`) ke liye sahi hai?",
    options: ["ExecuteReader()", "ExecuteNonQuery()", "ExecuteScalar()", "ExecuteQuery()"],
    correctIndex: 2,
    explanation:
      "`ExecuteScalar()` first row ka first column return karta hai — single value queries (COUNT, SUM, ya single-cell lookup) ke liye sahi choice. `ExecuteReader()` multiple rows ke liye hai, `ExecuteNonQuery()` INSERT/UPDATE/DELETE ke affected-row count ke liye hai. `ExecuteQuery()` ADO.NET me exist hi nahi karta.",
    difficulty: "easy",
  },
  {
    id: "adonet-fund-3",
    question: "`SqlConnection`, `SqlCommand`, aur `SqlDataReader` ko `using` (ya explicit `Dispose()`) ke bina chhod dene ka sabse likely production consequence kya hai?",
    options: [
      "Koi impact nahi, garbage collector automatically handle kar lega turant",
      "Connection pool exhaust ho sakta hai, jisse baad ki requests timeout hone lagti hain",
      "Query results galat aa jaate hain",
      "Application startup slow ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "In teeno objects ko dispose na karna connections ko pool me wapas release hone se rokta hai. Load ke under, pool exhaust ho jaata hai aur naye requests 'Timeout expired... obtaining a connection from the pool' jaisa error dete hain. Garbage collector eventually finalizer se cleanup kar sakta hai, lekin ye unpredictable aur delayed hota hai — production me bahut der ho chuki hoti hai tab tak. Options C aur D directly is issue se related nahi hain.",
    difficulty: "medium",
  },
  {
    id: "adonet-fund-4",
    question: "EF Core aur Dapper, dono internally kis level pe kaam karte hain?",
    options: [
      "Dono completely apna khud ka database driver likhte hain, ADO.NET use nahi karte",
      "Dono ultimately ADO.NET ke provider classes (`DbConnection`/`DbCommand`/`DbDataReader`) use karte hain",
      "Sirf Dapper ADO.NET use karta hai, EF Core apna alag protocol use karta hai",
      "Sirf EF Core ADO.NET use karta hai, Dapper seedha TCP socket pe likha gaya hai",
    ],
    correctIndex: 1,
    explanation:
      "Dono ORMs (EF Core full ORM, Dapper micro-ORM) ultimately ADO.NET ke provider-agnostic base classes ke upar bane hain — wahi connection/command/reader model jo is topic me cover hua. Ye interview me ek common 'gotcha' point hai — candidates aksar sochte hain ORMs kuch completely alag/lower-level use karte hain, jab ki actually wahi ADO.NET foundation hai.",
    difficulty: "medium",
  },
];

export default quiz;
