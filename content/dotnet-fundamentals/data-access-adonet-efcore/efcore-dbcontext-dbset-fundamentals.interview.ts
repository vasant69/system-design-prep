import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "efcore-fund-tr-1",
    question: "EF Core kya hai, aur ye raw ADO.NET ke comparison me kya problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "TCS", "Infosys"],
    shortAnswer: "EF Core .NET ka official ORM hai jo manual column-to-object mapping boilerplate ko LINQ-based automatic mapping se replace karta hai.",
    detailedAnswer:
      "Raw ADO.NET me, har query ke liye developer ko manually SQL likhna padta hai aur `SqlDataReader` se columns ko index/name se padhkar objects construct karne padte hain — ye boilerplate entity aur query count ke saath scale hota hai. EF Core is process ko automate karta hai: entities C# classes ki tarah define hoti hain, `DbSet<T>` properties tables represent karte hain, aur LINQ queries EF Core khud SQL me translate karke execute karta hai, results ko automatically objects me map karta hai. Cost: kuch runtime overhead aur kam granular SQL control.",
    followUp: "Kya EF Core hamesha sahi choice hai? Kab raw ADO.NET/Dapper better hoga?",
  },
  {
    id: "efcore-fund-tr-2",
    question: "`DbContext` aur `DbSet<T>` ka relationship samjhao — dono kaise saath kaam karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "DbContext ek database session/unit-of-work hai jo multiple DbSet<T> properties hold karta hai, har ek ek table represent karta hai.",
    detailedAnswer:
      "`DbContext` overall session coordinate karta hai — connection management, query translation, change tracking. Ek `DbContext` subclass (jaise `AppDbContext`) me multiple `DbSet<T>` properties hoti hain (`DbSet<Product> Products`, `DbSet<Order> Orders`), har ek apni respective table ka queryable, trackable window hai. Jab tum `context.Products.Where(...)` likhte ho, `DbSet<Product>` LINQ ko capture karta hai; jab tum `context.SaveChangesAsync()` call karte ho, `DbContext` saari `DbSet`s ke across tracked changes ko ek transaction me commit karta hai.",
  },
  {
    id: "efcore-fund-tr-3",
    question: "Ye code me kya problem hai?\n```csharp\npublic class AppDbContext : DbContext { ... }\n\n// Program.cs\nservices.AddSingleton<AppDbContext>();\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "DbContext ko Singleton register karna galat hai — ye thread-safe nahi hai, Scoped hona chahiye.",
    detailedAnswer:
      "`DbContext` thread-safe nahi hai — ek hi instance ko multiple concurrent requests use karein to change tracker corrupt ho sakta hai, race conditions aa sakti hain (ek request dusre ka in-flight query/tracking state overwrite kar sakti hai). ASP.NET Core convention Scoped lifetime hai — `services.AddDbContext<AppDbContext>(...)` (jo internally Scoped register karta hai) taaki har HTTP request apna independent, isolated instance le. Singleton is guarantee ko break karta hai.",
    redFlag: "Candidate ko is registration me koi issue na dikhna, ya 'Singleton fast hai isliye better hai' jaisa galat justification dena.",
  },
  {
    id: "efcore-fund-tr-4",
    question: "Kya `context.Products.Where(p => p.Price > 100)` likhne se turant database query execute ho jaati hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye deferred hai, query tab tak execute nahi hoti jab tak enumerate na kiya jaaye (ToList/foreach/etc.).",
    detailedAnswer:
      "`DbSet<T>` `IQueryable<T>` hai — `Where()` ek LINQ expression tree build karta hai, execute nahi karta turant. SQL tabhi generate aur run hoti hai jab query ko enumerate kiya jaaye — `ToListAsync()`, `foreach`, `FirstOrDefaultAsync()` waghera call karke. Ye deferred execution `linq-fundamentals` module ka core concept hai, aur EF Core ke context me genuinely important hai — isse pata chalta hai kab exactly database hit hota hai, jo N+1 jaise bugs debug karne me critical hai.",
    followUp: "Ye behavior IEnumerable-based LINQ (in-memory collections) se kaise same/different hai?",
  },
  {
    id: "efcore-fund-tr-5",
    question: "Ek naya team member kehta hai 'EF Core to bas magic hai, main koi SQL likhne ki zaroorat nahi hai, kabhi bhi kuch bhi LINQ me likh sakta hoon bina consequence soche.' Isse kya risk hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Har LINQ query real SQL me translate hoti hai — poorly-written LINQ genuinely inefficient/incorrect SQL generate kar sakta hai (N+1, over-fetching, translation failures).",
    detailedAnswer:
      "EF Core 'magic' nahi hai — har LINQ expression database-specific SQL me deterministically translate hota hai. Agar developer ye samajhta hi nahi ki uska LINQ query kya SQL generate karega, wo easily N+1 query problems create kar sakta hai (agla topic), unnecessary columns fetch kar sakta hai, ya aisa LINQ likh sakta hai jo provider translate hi nahi kar sakta (runtime exception). Effective EF Core use ke liye samajhna zaroori hai ki tumhara LINQ code actually kaunsi SQL banata hai — is samajh ke bina, EF Core production performance issues ka source ban jaata hai.",
    redFlag: "Candidate ka ye maan lena ki EF Core hamesha optimal SQL generate karta hai bina kisi awareness ke.",
  },
  {
    id: "efcore-fund-tr-6",
    question: "Ek `DbContext` instance ko application ke ek hi request ke andar bahut saare unrelated operations ke liye reuse kiya ja raha hai bina disposal ke, aur samay ke saath queries slow ho rahi hain. Kya ho raha hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Change tracker bloat — bahut saari entities track ho rahi hain jo genuinely zaroorat nahi thi, jo memory aur SaveChanges performance degrade karta hai.",
    detailedAnswer:
      "Har query jo entities return karti hai (bina `AsNoTracking()` ke), unhe `DbContext` ke change tracker me register kar deti hai. Agar ek `DbContext` instance ko bahut lambi/complex operation ke liye reuse kiya jaaye bina scope discipline ke, change tracker me hundreds/thousands entities accumulate ho sakti hain — jo memory consume karta hai aur `SaveChanges()` ko slow karta hai kyunki wo har baar poore tracked-entity set ko scan karta hai changes detect karne ke liye. Fix: `DbContext` scope ko tight rakho (request-scoped, ya explicitly short-lived operations ke liye), read-only queries ke liye `AsNoTracking()` use karo (agle module topics me detail).",
  },
  {
    id: "efcore-fund-tr-7",
    question: "Agar tumhare paas ek `Product` entity hai bina EF Core ke, tumhe raw ADO.NET me kya-kya manually likhna padta? EF Core ye kaise automate karta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "SQL string, SqlCommand setup, SqlDataReader se column-by-column mapping — EF Core sab automate karta hai DbSet<Product> + LINQ se.",
    detailedAnswer:
      "Raw ADO.NET me: SQL string likhna, `SqlCommand` banana, parameters add karna, `SqlDataReader` se `reader.GetInt32(0)`/`reader.GetString(1)` jaisi calls se har column manually padhna, `Product` object construct karna, list me add karna — ye sab har query, har entity ke liye repeat hota hai. EF Core me: `context.Products.Where(p => p.Price > 100).ToListAsync()` — EF Core khud SQL generate karta hai (`Product` class ki mapping configuration se), execute karta hai, aur rows ko automatically `Product` instances me convert karta hai, koi manual column-reading code nahi.",
  },
];

export default questions;
