import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "param-query-1",
    question: "Parameterized queries SQL injection ko fundamentally kaise prevent karte hain?",
    options: [
      "Special characters ko automatically escape karke",
      "User input ko SQL text se alag ek separate data channel pe bhejkar, jise database kabhi SQL syntax ki tarah interpret nahi karta",
      "Input ki length ko limit karke",
      "Sirf alphanumeric characters allow karke",
    ],
    correctIndex: 1,
    explanation:
      "Parameterization ka core mechanism ye hai ki parameter value ko query text se completely separate bheja jaata hai — database driver query ko placeholder ke saath precompile karta hai, aur value ko strictly data ki tarah treat karta hai. Ye escaping (option A) se fundamentally different aur zyada robust hai — attack surface eliminate hota hai, patch nahi hota. Options C aur D dono galat/incomplete approaches hain jo actual mechanism nahi hain.",
    difficulty: "medium",
  },
  {
    id: "param-query-2",
    question: "Kya stored procedures automatically SQL injection se safe hote hain?",
    options: [
      "Haan, hamesha — stored procedures inherently safe hote hain",
      "Sirf tab jab unke andar bhi parameters properly use ho rahe hon, na ki concatenated dynamic SQL",
      "Nahi, stored procedures kabhi safe nahi ho sakte",
      "Sirf agar procedure encrypted ho",
    ],
    correctIndex: 1,
    explanation:
      "Stored procedures khud automatically safe nahi hain — agar procedure ke andar dynamic SQL string concatenation se banaya ja raha hai (jaise `EXEC` ya `sp_executesql` with concatenated strings), wo utna hi vulnerable hai jitna application-level concatenation. Safety proper parameterization se aati hai, chahe wo application code me ho ya procedure ke andar.",
    difficulty: "hard",
  },
  {
    id: "param-query-3",
    question: "Ek output parameter ko `SqlDataReader` close karne SE PEHLE read karne ki koshish karne par kya hota hai typically?",
    options: [
      "Correct value milta hai hamesha",
      "Stale ya default/unpopulated value mil sakta hai, kyunki output parameter reliably reader close hone ke baad hi populate hota hai",
      "Exception aata hai turant",
      "Application crash ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Output parameters SQL Server se typically tabhi fully populate hote hain jab result set poora consume ho chuka ho aur reader close ho gaya ho. Reader close se pehle read karne ki koshish karna stale ya default value de sakta hai, silently — ye ek subtle bug hai jo interview me specifically test kiya jaata hai.",
    difficulty: "hard",
  },
  {
    id: "param-query-4",
    question: "`AddWithValue` vs explicit `SqlDbType` specify karna — kya difference hai?",
    options: [
      "Koi difference nahi, dono identical hain",
      "`AddWithValue` type ko implicitly infer karta hai jo kabhi-kabhi wrong SQL type choose kar sakta hai; explicit `SqlDbType` predictable hai",
      "`AddWithValue` SQL injection se safe nahi hai",
      "Explicit `SqlDbType` sirf stored procedures ke liye zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "`AddWithValue` .NET value se SQL type ko implicit infer karta hai, jo kabhi-kabhi ek suboptimal ya galat type choose kar leta hai (jaise ek chhoti string ko `NVARCHAR(MAX)` maan lena), jo query plan caching/performance affect kar sakta hai. Explicit `SqlDbType` (jaise `Parameters.Add(\"@Name\", SqlDbType.NVarChar, 50)`) predictable, production-recommended approach hai. Dono equally SQL-injection-safe hain (option C galat hai) — ye ek performance/predictability distinction hai, security distinction nahi.",
    difficulty: "medium",
  },
];

export default quiz;
