import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "repo-uow-tr-1",
    question: "Repository aur Unit of Work patterns kya hain, definition ke saath?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer:
      "Repository data access ko interface ke peeche abstract karta hai; Unit of Work multiple changes ko ek atomic transaction me coordinate karta hai.",
    detailedAnswer:
      "Repository pattern me actual persistence logic (SQL query ho, kuch aur ho) ek interface (jaise IOrderRepository) ke peeche chhup jaati hai — consuming code ko pata nahi hota underlying technology kya hai. Unit of Work pattern multiple, alag-alag operations (jaise ek order add karna, inventory update karna) ko ek single, atomic 'commit' me group karta hai — ya to sab save hote hain, ya koi nahi, consistency guarantee ke saath.",
    followUp: "EF Core me ye dono patterns already kahan implement hote hain?",
  },
  {
    id: "repo-uow-tr-2",
    question: "Kya EF Core ke saath Repository + Unit of Work layer likhna zaroori hai? Apna opinion do.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Amazon", "Flipkart"],
    shortAnswer:
      "Zaroori nahi hai — DbContext khud Unit of Work hai aur DbSet<T> khud repository jaisa hai; extra layer sirf specific, genuine reasons hone par worth hai.",
    detailedAnswer:
      "EF Core ki apni documentation DbContext ko 'combination of Repository and Unit of Work patterns' ki tarah describe karti hai. SaveChangesAsync() already atomic multi-entity commits deta hai, aur DbSet<T> already CRUD + LINQ querying deta hai — jo bilkul wahi hai jo ek custom IRepository<T> deta. Isliye default recommendation: seedha DbContext use karo. Extra layer tab add karo jab genuinely ek concrete reason ho — swappable data source, heavy mocking-based unit tests, ya strict domain isolation (DDD) — 'best practice hai' kabhi sufficient justification nahi hai.",
  },
  {
    id: "repo-uow-tr-3",
    question: "Repository layer add karne ke teen genuine, justified reasons batao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Genuinely swappable/composite data sources, DbContext ko mock karne ki awkwardness se bachne ke liye heavy unit-testing, aur DDD-style domain isolation.",
    detailedAnswer:
      "Pehla: agar data genuinely multiple sources se aata hai (SQL + external API/cache), ek repository in dono ko ek consistent interface ke peeche unify kar sakta hai, jo EF Core akela nahi deta. Doosra: DbContext/DbSet<T> ko directly mock karna genuinely awkward hai kyunki IQueryable ka poora behavior fake karna mushkil hai — ek thin interface mock karna kahin easier hai pure, database-free unit tests ke liye. Teesra: strict DDD-style architecture me business/domain layer ko persistence-technology concepts (DbSet, Include, change-tracking) ka bilkul pata nahi hona chahiye — repository ye complete isolation deta hai.",
    followUp: "In teeno me se kaunsa reason sabse common hai real-world Indian product companies me?",
  },
  {
    id: "repo-uow-tr-4",
    question: "Is code ka review karo — koi improvement suggest karoge?\n```csharp\npublic interface IProductRepository\n{\n    IQueryable<Product> GetAll();\n}\n\npublic class EfProductRepository : IProductRepository\n{\n    private readonly AppDbContext _db;\n    public EfProductRepository(AppDbContext db) => _db = db;\n    public IQueryable<Product> GetAll() => _db.Products;\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`IQueryable<Product>` return karna abstraction todta hai — caller ab bhi EF Core-specific query composition pe depend kar raha hai; concrete, specific methods (`GetActiveProductsAsync()`) return karna better hota.",
    detailedAnswer:
      "Ye code compile aur run to karega, lekin ye Repository pattern ka pura point miss kar deta hai. IQueryable<T> return karke, caller (service layer) ab bhi khud query build kar raha hai (.Where(), .Include(), etc.) — jo EF Core-specific concepts hain. Agar kal persistence technology change karni ho, IQueryable<T> ka contract maintain karna mushkil hoga. Better design: `Task<List<Product>> GetActiveProductsAsync()` jaise concrete, intent-revealing methods jo poori query internally encapsulate karein — caller ko sirf result milta hai, query-building capability nahi.",
    followUp: "Agar caller ko genuinely dynamic filtering chahiye ho (jaise search with multiple optional filters), IQueryable leak kiye bina kaise design karoge?",
  },
  {
    id: "repo-uow-tr-5",
    question: "Ye test kya karega, aur ye kyun kaam karta hai bina real database ke?\n```csharp\nvar mockRepo = new Mock<IOrderRepository>();\nmockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Order { Id = 1, Status = \"Pending\" });\nvar service = new OrderService(mockRepo.Object);\n\nvar order = await service.GetOrderAsync(1);\nAssert.Equal(\"Pending\", order.Status);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Test pass hoga bina kisi real database ke — `IOrderRepository` ek interface hai isliye mock (fake implementation) inject kiya ja sakta hai, jo `OrderService` ko fool karta hai ki wo real data se baat kar raha hai.",
    detailedAnswer:
      "Ye exactly wo scenario hai jahan Repository pattern genuine value deta hai. Chunki OrderService IOrderRepository (interface) pe depend karta hai, na ki concrete EfOrderRepository/DbContext pe, DI ke through ek mock implementation inject kiya ja sakta hai. Mock setup batata hai 'jab GetByIdAsync(1) call ho, ye specific Order return karo' — koi real SQL query, koi real connection nahi lagta. Ye test fast, isolated, aur deterministic hai — agar directly DbContext use kiya hota, mocking bahut zyada awkward hoti (IQueryable behavior fake karna mushkil).",
  },
  {
    id: "repo-uow-tr-6",
    question: "Tumhari company ek chhoti internal admin tool bana rahi hai — single SQL Server database, EF Core, koi complex testing strategy nahi (integration tests hi kaafi hain). Ek senior developer insist karta hai 'Repository + Unit of Work pattern hamesha likhna chahiye, ye clean architecture hai.' Kya react karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Respectfully pushback do — is specific context me (single data source, integration-test-based strategy) extra layer sirf boilerplate add karega, koi genuine benefit nahi milega; seedha DbContext use karna better hai.",
    detailedAnswer:
      "'Clean architecture' ka matlab blindly har pattern add karna nahi hai — context-appropriate design karna hai. Chhoti admin tool me, single permanent data source (EF Core) hai, aur testing strategy integration-tests pe based hai (jahan real ya in-memory DB use hoti hai) — in dono conditions me Repository layer ka koi practical benefit nahi hai, sirf extra classes/interfaces/mapping code jo maintain karna padega. Better approach: seedha DbContext/DbSet<T> use karo service layer me, aur is decision ko explicitly document/justify karo taaki future developer confused na ho ki repository kyun missing hai.",
    followUp: "Agar tool badhte-badhte genuinely complex ho jaaye future me, refactor karke Repository add karna kitna costly hoga?",
  },
  {
    id: "repo-uow-tr-7",
    question: "Ek naya requirement aaya: 'Kuch product data ab ek external Product Catalog microservice se aayega (REST API ke through), kuch abhi bhi local DB me hai. Business ko dono seamlessly ek hi tarah dikhne chahiye.' Design kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ye exactly Repository pattern ka genuine use case hai — `IProductRepository` banao jiska implementation internally dono sources (DB + external API) ko combine kare, service layer ko fark hi na pade.",
    detailedAnswer:
      "Ye textbook 'genuinely swappable/composite data source' scenario hai jahan Repository layer real value deta hai. `IProductRepository` interface me `GetByIdAsync(id)` jaisa method ho; implementation (`HybridProductRepository`) internally decide kare ki ye product local `DbContext` se aayega ya external API client se — caller (service layer) ko is decision ka bilkul pata na chale. Ye exactly wo case hai jahan EF Core akela kaafi nahi hai, kyunki EF Core sirf apne configured database se baat karta hai, external API se nahi — is combination ko koi bhi ek layer handle karna hi chahiye, aur Repository interface is job ke liye sahi jagah hai.",
    followUp: "Caching ka is design me kya role ho sakta hai, especially external API call ke liye?",
  },
  {
    id: "repo-uow-tr-8",
    question: "Kya ye statement sahi hai: 'Repository pattern EF Core ke saath kabhi use nahi karna chahiye, kyunki EF Core already sab kuch deta hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Galat — 'kabhi nahi' ek overcorrection hai; EF Core zyadatar cases me sufficient hai, lekin genuine cases (swappable sources, heavy mocking, DDD isolation) me Repository layer sahi choice reh sakti hai.",
    detailedAnswer:
      "Ye ek classic overcorrection trap hai — pehla misconception 'Repository hamesha chahiye' hai, doosra (equally galat) misconception 'Repository kabhi nahi chahiye' hai. Sahi answer beech me hai: default recommendation seedha DbContext use karna hai, lekin specific, concrete reasons (jaise multi-source data, testing strategy jahan mocking genuinely zaroori hai, ya strict domain-layer isolation) hone par Repository layer bilkul justified hai. Har absolute statement — 'hamesha' ya 'kabhi nahi' — is topic ke nuanced, context-dependent nature ko miss kar deta hai, jo exactly wo cheez hai jo senior-level judgement demonstrate karti hai.",
    redFlag: "Kisi bhi pattern ke baare me 'hamesha' ya 'kabhi nahi' jaisa absolute statement bolna, bina context consider kiye — dono directions me overcorrection ek red flag hai.",
  },
  {
    id: "repo-uow-tr-9",
    question: "Ek generic `IRepository<T>` interface likho jisme `GetByIdAsync`, `GetAllAsync`, `AddAsync`, aur `DeleteAsync` methods hon, aur EF Core ke through ek concrete implementation banao jo kisi bhi entity type ke saath reusable ho.",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Generic interface with a type constraint, ek generic `EfRepository<T>` class jo `DbContext` aur `DbSet<T>` use kare internally.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic interface IRepository<T> where T : class\n{\n    Task<T?> GetByIdAsync(int id);\n    Task<List<T>> GetAllAsync();\n    Task AddAsync(T entity);\n    Task DeleteAsync(T entity);\n}\n\npublic class EfRepository<T> : IRepository<T> where T : class\n{\n    private readonly AppDbContext _db;\n    private readonly DbSet<T> _set;\n\n    public EfRepository(AppDbContext db)\n    {\n        _db = db;\n        _set = db.Set<T>();\n    }\n\n    public async Task<T?> GetByIdAsync(int id) => await _set.FindAsync(id);\n\n    public async Task<List<T>> GetAllAsync() => await _set.ToListAsync();\n\n    public async Task AddAsync(T entity)\n    {\n        _set.Add(entity);\n        await _db.SaveChangesAsync();\n    }\n\n    public async Task DeleteAsync(T entity)\n    {\n        _set.Remove(entity);\n        await _db.SaveChangesAsync();\n    }\n}\n\n// Program.cs\nbuilder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));\n```\nKey evaluation points: `where T : class` constraint (EF Core entities are reference types), `db.Set<T>()` used for generic entity access, open generic registration in DI (`typeof(IRepository<>), typeof(EfRepository<>)`), and — ideally — the candidate flagging that this generic version, while less repetitive, still doesn't add much over `DbSet<T>` directly unless combined with one of the genuine justification reasons discussed earlier.",
  },
];

export default questions;
