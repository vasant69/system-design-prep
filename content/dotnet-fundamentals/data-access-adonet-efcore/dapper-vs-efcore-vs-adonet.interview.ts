import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dapper-efcore-tr-1",
    question: "Dapper, EF Core, aur raw ADO.NET ke beech decide karne ke liye tum kaunsa framework use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Amazon", "Flipkart", "Swiggy"],
    shortAnswer: "Teen dimensions: team productivity needs, query complexity, aur schema-evolution requirements — EF Core default, Dapper profiled hot paths ke liye, raw ADO.NET rarely.",
    detailedAnswer:
      "Main teen dimensions pe socharta hoon: (1) Productivity vs raw performance — CRUD-heavy business logic ke liye EF Core ki productivity genuinely valuable hai; extreme perf-critical paths ke liye Dapper better control deta hai. (2) Query complexity — EF Core LINQ complex, type-safe queries readable rakhta hai; Dapper me complex SQL manually maintain karna padta hai. (3) Schema evolution — EF Core built-in migrations deta hai; Dapper/ADO.NET separate schema-management approach maangte hain. Practically, main EF Core ko default rakhta hoon aur Dapper ko specific, profiled hot paths ke liye reach karta hoon.",
    followUp: "Ek concrete scenario do jahan tum Dapper choose karoge EF Core ke bajaye.",
  },
  {
    id: "dapper-efcore-tr-2",
    question: "Dapper me row-to-object mapping kaise kaam karta hai bina developer ko manual `reader.GetInt32()` jaisi calls likhne ke?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Dapper internally SqlDataReader use karta hai, lekin reflection/IL-emit se column names ko type properties se automatically match karke object map kar deta hai.",
    detailedAnswer:
      "Dapper internally standard ADO.NET (`SqlDataReader`) use karta hai query execute karne ke liye — koi alien mechanism nahi. Lekin ye rows ko manually process karne ki jagah, reflection (aur performance ke liye IL-emit-based caching) use karke automatically har returned column ko target type (`Product`) ki matching-named property se map kar deta hai. Developer sirf `connection.QueryAsync<Product>(sql, params)` likhta hai, poori mapping automatically ho jaati hai — column name `Name` automatically `Product.Name` property me jaata hai, waghera.",
  },
  {
    id: "dapper-efcore-tr-3",
    question: "Ek high-traffic search endpoint hai jo complex aggregation query chalata hai (multiple joins, GROUP BY, subqueries) — profiling ne dikhaya ki EF Core-generated SQL suboptimal hai. Tum kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Is specific endpoint ke liye Dapper use karo hand-tuned SQL ke saath, baaki codebase EF Core pe rehne do.",
    detailedAnswer:
      "Ye exactly wo scenario hai jahan hybrid approach appropriate hai — pura codebase rewrite karne ki zaroorat nahi, sirf is specific, measured, profiled hot path ke liye Dapper reach karo. Hand-written SQL likho jo genuinely optimal ho (indexes ka sahi use, efficient joins), Dapper se result ko strongly-typed objects me map karo. Baaki application (standard CRUD, business logic) EF Core pe as-is rehta hai — koi unnecessary migration effort nahi.",
    followUp: "Kya Dapper aur EF Core dono ka DbContext ka underlying connection share kar sakte hain agar zaroorat pade?",
  },
  {
    id: "dapper-efcore-tr-4",
    question: "Kya ye statement sahi hai: 'Dapper use karna hamesha behtar hai kyunki ye faster hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — performance sirf ek dimension hai; productivity, maintainability, aur migrations jaise features EF Core ko genuinely better choice bana sakte hain most applications ke liye.",
    detailedAnswer:
      "Ye ek oversimplification hai jo interview me specifically test hoti hai. Dapper genuinely faster ho sakta hai raw query-execution terms me, lekin ye ek single dimension hai — poora engineering decision team velocity, codebase maintainability, schema-evolution needs, aur query complexity ko bhi consider karna chahiye. Zyadatar CRUD-heavy business applications ke liye, EF Core ka overhead practically irrelevant hai (network latency, business logic time usually dominate karte hain), jab ki productivity ka fayda genuinely significant hai. 'Hamesha X use karo' jaisa absolute statement senior engineering judgement ki kami dikhata hai.",
    redFlag: "'Dapper hamesha better hai performance ke liye' jaisa unconditional statement bina trade-offs discuss kiye.",
  },
  {
    id: "dapper-efcore-tr-5",
    question: "Kya raw ADO.NET aaj bhi koi genuine use case rakhta hai jab Dapper available hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Bahut narrow — extreme perf edge cases, ya existing legacy code jo already ADO.NET pe hai aur migration ka koi business case nahi hai.",
    detailedAnswer:
      "Dapper zyadatar practical scenarios me raw ADO.NET ka poora control retain karta hai bahut kam boilerplate ke saath, isliye naye code me raw ADO.NET likhne ka case bahut weak ho gaya hai Dapper ke aane ke baad. Genuine reasons abhi bhi ho sakte hain: (1) ek existing legacy codebase already ADO.NET pe hai aur poora rewrite karne ka risk/cost unjustified hai, (2) extreme, micro-optimized perf paths jahan Dapper ka bhi (minimal) mapping overhead avoid karna ho. Dono narrow, specific cases hain — default choice modern .NET development me EF Core ya Dapper hi hoti hai.",
  },
  {
    id: "dapper-efcore-tr-6",
    question: "Ek naya developer sochta hai ki Dapper use karne se SQL injection risk automatically khatam ho jaata hai kyunki 'ye ek library hai jo safe hai.' Kya ye sahi hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — Dapper automatic parameterization deta hai JAB tum @param syntax use karte ho, lekin agar developer manually string concatenate kare, wahi SQL injection risk exist karta hai.",
    detailedAnswer:
      "Dapper khud automatically SQL injection se protect nahi karta 'library hone ki wajah se' — ye protection tab milta hai jab developer properly `@param` placeholders aur anonymous object/parameters use karta hai (jo internally `SqlParameter` bante hain, wahi mechanism jo `parameterized-queries-and-stored-procedures` topic me cover hua). Agar koi developer manually SQL string concatenate/interpolate kare Dapper ke saath bhi (`$\"SELECT * FROM Users WHERE Name = '{userInput}'\"`), wahi vulnerability exist karti hai jo raw ADO.NET me hoti — Dapper is galti ko prevent nahi karta, sirf sahi pattern use karna easy banata hai.",
    redFlag: "'Dapper safe hai by design, SQL injection possible hi nahi' jaisa galat confident statement.",
  },
  {
    id: "dapper-efcore-tr-7",
    question: "Ek CRUD-heavy internal admin tool bana rahe ho jisme koi extreme performance requirement nahi hai, aur schema evolve hota rahega feature additions ke saath. Kaunsa approach choose karoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "EF Core — productivity, built-in migrations for evolving schema, aur ye ek typical CRUD scenario hai jahan performance overhead practically irrelevant hoga.",
    detailedAnswer:
      "Is scenario me EF Core clearly better fit hai: (1) CRUD-heavy hai, jahan LINQ-based querying aur change tracking genuinely development speed badhate hain, (2) schema evolve hoga — EF Core Migrations exactly isi ke liye design ki gayi hain, schema history version-controlled rehti hai code ke saath, (3) 'internal admin tool, koi extreme performance requirement nahi' explicitly bata raha hai ki EF Core ka overhead is context me irrelevant hai. Dapper yahan unnecessary complexity add karega bina meaningful benefit ke — is scenario me EF Core ka trade-off (thoda overhead, poori productivity) clearly sahi choice hai.",
  },
];

export default questions;
