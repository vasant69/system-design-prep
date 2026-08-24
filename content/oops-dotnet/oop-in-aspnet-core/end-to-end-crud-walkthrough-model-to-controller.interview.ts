import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "e2e-tr-1",
    question: "Ek naya feature banate waqt tum kis order me files likhte ho, aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Model, phir DbContext me DbSet, phir Interface, phir Service, phir Controller, phir Program.cs me DI registration.",
    detailedAnswer:
      "Ye order isliye hai kyunki har piece agle piece ki dependency hai — Service ko pata hona chahiye Model kaisa dikhta hai (isliye Model pehle), Controller ko Service ka interface chahiye inject karne ke liye (isliye Interface aur Service pehle), aur poora wiring DI registration ke bina kaam hi nahi karega (isliye Program.cs sabse last, jab sab kuch already define ho chuka ho). Is fixed order ko follow karne se socha nahi jaata baar-baar 'ab kya likhoon' — muscle memory ban jaata hai.",
    followUp: "Agar tum DbContext se pehle Model likhte, to kya problem aati?",
  },
  {
    id: "e2e-tr-2",
    question: "Model class me business logic (jaise validation, calculations) kyun nahi likhni chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Model sirf data ka shape define karta hai — separation of concerns ke liye logic Service layer me rehta hai.",
    detailedAnswer:
      "Model ek 'dumb' data container hone se do fayde hote hain: (1) ye reusable rehta hai — same Model class EF Core entity ke roop me bhi use ho sakta hai aur simple DTO ke roop me bhi, bina logic ke baggage ke. (2) testing aasan ho jaati hai — business logic Service me hone se usko independently test kiya ja sakta hai, Model ko instantiate karne ki zaroorat nahi padti complex test setup ke bina.",
    redFlag: "Model class ke andar `if` conditions, database calls, ya calculation methods likhna — ye batata hai layers ka clear separation samajh nahi aaya.",
  },
  {
    id: "e2e-tr-3",
    question: "Constructor injection kaise kaam karta hai — jab tum `public ProductService(AppDbContext db)` likhte ho, `db` kahan se aata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "DI container automatically ek AppDbContext instance bana ke constructor parameter me pass karta hai, based on Program.cs ki registration.",
    detailedAnswer:
      "Jab `Program.cs` me `builder.Services.AddDbContext<AppDbContext>(...)` likha jaata hai, DI container ko pata chal jaata hai 'jab kisi ko AppDbContext chahiye, ise aise banao.' Jab request aati hai aur ProductService banane ki zaroorat padti hai (kyunki controller ne IProductService maanga), DI container dekhta hai ProductService ke constructor ko kya chahiye — `AppDbContext` — aur khud-ba-khud ek instance bana ke pass kar deta hai. Developer ko kabhi khud `new ProductService(new AppDbContext(...))` likhne ki zaroorat nahi padti.",
    followUp: "Agar `Program.cs` me AppDbContext register hi na kiya ho to kya hoga jab app start hoga?",
  },
  {
    id: "e2e-tr-4",
    question: "Ye code kya karega?\n```csharp\npublic async Task<Product> CreateAsync(string name, decimal price)\n{\n    var product = new Product { Name = name, Price = price };\n    _db.Products.Add(product);\n    return product;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile aur run hoga, lekin product database me kabhi save nahi hoga — SaveChangesAsync() missing hai.",
    detailedAnswer:
      "`_db.Products.Add(product)` sirf DbContext ke change tracker me object register karta hai — memory me. Actual database insert sirf `await _db.SaveChangesAsync()` call hone par hota hai, jo yahan missing hai. Method compile hoga (koi syntax error nahi), run bhi hoga (koi exception nahi aayega), aur `product` object return bhi ho jaayega with the Name/Price set — lekin database me koi row insert nahi hogi. Ye ek classic silent bug hai jo debug karna mushkil ho jaata hai kyunki koi error signal nahi milta.",
  },
  {
    id: "e2e-tr-5",
    question: "Ye method compile hoga ya error dega?\n```csharp\npublic Task<Product?> GetByIdAsync(int id)\n{\n    return await _db.Products.FindAsync(id);\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — method signature me `async` keyword missing hai, lekin body me `await` use kiya gaya hai.",
    detailedAnswer:
      "`await` keyword sirf un methods ke andar valid hai jinke signature me `async` likha ho. Yahan `public Task<Product?> GetByIdAsync(int id)` me `async` missing hai, lekin body `await _db.Products.FindAsync(id)` use kar raha hai — ye compile error dega: 'The await operator can only be used within an async method.' Fix simple hai: `public async Task<Product?> GetByIdAsync(int id)` likhna chahiye.",
    redFlag: "Ye maan lena ki `Task<T>` return type likhna hi kaafi hai async ke liye — `async` keyword bhi explicitly likhna zaroori hai.",
  },
  {
    id: "e2e-tr-6",
    question: "Production me ek naye developer ne Controller ke andar seedha `AppDbContext` inject karke database calls likh diye, Service layer skip karke. Ye kaam kar raha hai. Iska problem kya hai, aur tum kaise explain karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Kaam abhi ho raha hai, lekin business logic aur HTTP handling mix ho jaate hain — reuse aur testing dono mushkil ho jaate hain.",
    detailedAnswer:
      "Short-term ye approach kaam karta hai, lekin do real problems create karta hai: (1) Agar kal same business logic kahin aur chahiye ho (jaise ek background job, ya ek doosra controller), poora code duplicate karna padega kyunki wo Controller ke andar locked hai. (2) Unit testing mushkil ho jaati hai — Controller ko test karne ke liye ab poori database bhi mock karni padegi, jabki Service-layer approach me sirf `IProductService` mock karna kaafi hota. Fix: business logic ko Service class me nikaal ke, Controller ko sirf HTTP-to-Service delegation tak limit karna.",
    followUp: "Agar tumhe is code ko refactor karna pade production me bina downtime ke, kaise approach karoge?",
  },
  {
    id: "e2e-tr-7",
    question: "Tumhare paas ek `IOrderService` hai jisme abhi ek method hai. Business ne bola ab 'Cancel Order' feature bhi chahiye. Tum kahan-kahan changes karoge, is 5-piece pattern follow karte hue?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Interface me naya method signature add karo, Service me uska implementation likho, Controller me naya endpoint add karo — Model/DbContext/DI registration usually already exist karte honge.",
    detailedAnswer:
      "Agar `Order` Model aur `OrderService`/`IOrderService` already exist karte hain: (1) `IOrderService` interface me `Task<bool> CancelAsync(int orderId);` jaisa naya signature add karo. (2) `OrderService` class me uska actual implementation likho (jaise order ka status 'Cancelled' set karke `SaveChangesAsync` call karna). (3) `OrdersController` me ek naya `[HttpPost(\"{id}/cancel\")]` action add karo jo `_orderService.CancelAsync(id)` call kare. Program.cs me kuch change nahi karna padega kyunki `IOrderService`/`OrderService` already registered hain.",
  },
  {
    id: "e2e-tr-8",
    question: "Kya ye sahi hai: 'Interface likhna extra, unnecessary kaam hai — seedha Service class bana ke Controller me inject kar do, time bachega'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Short-term kaam chal jaata hai, lekin ye statement misleading hai — interface ka real cost bahut kam hai, benefit bada hai.",
    detailedAnswer:
      "Interface likhna genuinely 2-3 extra lines ka kaam hai — bahut chhota upfront cost. Iske badle jo milta hai: testability (mock karna easy), swappability (implementation badalna bina caller code chhue), aur DI ke through loose coupling — ye sab Module 1 ke abstraction pillar ka exact real-world payoff hai. Chhote personal scripts ya throwaway prototypes ke liye interface skip karna reasonable hai, lekin kisi bhi real production codebase me 'time bachega' ka argument weak hai kyunki jo time bachta hai wo baad me testing/maintenance me kai guna zyada kharch hota hai.",
    redFlag: "Bina caveat ke 'interfaces hamesha zaroori hain' ya 'interfaces kabhi zaroori nahi' — dono extreme positions weak hain, context-dependent judgment call dikhana chahiye.",
  },
  {
    id: "e2e-tr-9",
    question: "Ye code likho: ek `IProductService` me ek naya method `Task<List<Product>> GetAllAsync();` add karo, aur `ProductService` me uska implementation likho jo saare products database se fetch kare.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "Interface me signature add karo, Service me `_db.Products.ToListAsync()` use karke implement karo.",
    detailedAnswer:
      "```csharp\n// Interface\npublic interface IProductService\n{\n    Task<Product?> GetByIdAsync(int id);\n    Task<Product> CreateAsync(string name, decimal price);\n    Task<List<Product>> GetAllAsync();\n}\n\n// Service implementation\npublic class ProductService : IProductService\n{\n    private readonly AppDbContext _db;\n\n    public ProductService(AppDbContext db) => _db = db;\n\n    public async Task<List<Product>> GetAllAsync()\n    {\n        return await _db.Products.ToListAsync();\n    }\n\n    // ... existing methods\n}\n```\nKey points: `ToListAsync()` EF Core ka async LINQ method hai (`Microsoft.EntityFrameworkCore` namespace se aata hai), interface aur implementation dono me signature match hona chahiye exactly (return type, parameter types).",
  },
];

export default questions;
