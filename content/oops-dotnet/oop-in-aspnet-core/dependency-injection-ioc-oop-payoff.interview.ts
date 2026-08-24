import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "di-ioc-tr-1",
    question: "Inversion of Control aur Dependency Injection me exact difference samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "IoC ek principle hai (control bahar chala jaata hai), DI uska ek specific implementation technique hai (dependency constructor ke through inject hoti hai).",
    detailedAnswer:
      "IoC broader hai — 'kaun decide karta hai kaunsi implementation use hogi, ye control object ke andar nahi, bahar hai' — ye Service Locator pattern se bhi achieve ho sakta hai, DI se bhi. DI specifically matlab hai dependency ko object ke andar create karne ke bajaye bahar se pass (inject) karna — constructor, property, ya method ke through. ASP.NET Core DI ko primary technique ki tarah use karta hai apne IoC container ke through.",
    followUp: "Service Locator pattern DI se better ya worse hai — aur kyun ASP.NET Core DI ko prefer karta hai?",
  },
  {
    id: "di-ioc-tr-2",
    question: "ASP.NET Core ka DI container internally kaise resolve karta hai ki ek dependency kis se banegi?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Registration (Program.cs) ek mapping table banata hai interface-se-concrete-type; resolution ke time container reflection se constructor parameters dekh kar recursively har dependency resolve karta hai.",
    detailedAnswer:
      "Startup pe `AddScoped<IOrderService, OrderService>()` jaisi calls ek internal registry me entry daalti hain. Jab kisi type ki zaroorat padti hai (jaise ek controller banate waqt), container uske constructor ko reflection se inspect karta hai, har parameter type ke liye registry check karta hai, aur agar wo dependency ki bhi apni dependencies hain, unhe bhi recursively resolve karta hai — poora object graph bottom-up bana ke top-level object return karta hai.",
    followUp: "Agar do implementations same interface ke liye register ho jaayein, container kya karega?",
  },
  {
    id: "di-ioc-tr-3",
    question: "Constructor injection hi kyun preferred hai property ya method injection ke upar?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Constructor injection dependency ko readonly bana deta hai (immutability), aur missing dependency startup/first-request pe hi fail-fast ho jaati hai.",
    detailedAnswer:
      "Constructor injection se dependency ek baar set hoti hai aur `readonly` field me store hoti hai — koi baad me accidentally overwrite nahi kar sakta. Ye bhi guarantee deta hai ki object kabhi 'half-initialized' state me nahi hota — jaise hi object bana, uski saari dependencies present hain. Agar koi dependency register nahi hui, error turant surface hota hai (startup validation ya first request pe), na ki kisi random method call ke beech NullReferenceException ki tarah. Property injection is guarantee ko todta hai — property kabhi bhi null ho sakti hai agar set na ki gayi ho.",
  },
  {
    id: "di-ioc-tr-4",
    question: "Ye code compile hoga? Agar haan, `Program.cs` me kya missing hai jo runtime error dega?\n```csharp\npublic interface IReportService { string Generate(); }\npublic class ReportService : IReportService\n{\n    public string Generate() => \"report\";\n}\n\n[ApiController]\n[Route(\"api/reports\")]\npublic class ReportsController : ControllerBase\n{\n    private readonly IReportService _svc;\n    public ReportsController(IReportService svc) => _svc = svc;\n\n    [HttpGet]\n    public IActionResult Get() => Ok(_svc.Generate());\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Code compile hoga, lekin agar `builder.Services.AddScoped<IReportService, ReportService>()` (ya Singleton/Transient) register nahi hua to request aane par `InvalidOperationException` throw hoga.",
    detailedAnswer:
      "Compilation ke time container ka koi role nahi hota — ye ek pure runtime concern hai. Jab `ReportsController` ke liye ek request aati hai, ASP.NET Core controller ko activate karne ke liye `IReportService` resolve karne ki koshish karta hai. Agar registration missing hai, `InvalidOperationException: Unable to resolve service for type 'IReportService'...` throw hoga — request fail hoga 500 ke saath. Fix: `Program.cs` me `builder.Services.AddScoped<IReportService, ReportService>();` add karna.",
    followUp: "Startup pe hi is tarah ki missing registrations ko catch karne ka koi tareeka hai?",
  },
  {
    id: "di-ioc-tr-5",
    question: "Ye code kya karega — koi issue hai?\n```csharp\npublic class OrderService : IOrderService\n{\n    private readonly AppDbContext _db;\n    private readonly INotificationService _notifier;\n\n    public OrderService(AppDbContext db, INotificationService notifier)\n    {\n        _db = db;\n        _notifier = notifier;\n    }\n}\n\n// Program.cs\nbuilder.Services.AddScoped<IOrderService, OrderService>();\n// INotificationService registration missing\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`IOrderService` resolve karte waqt container `INotificationService` bhi resolve karne ki koshish karega — missing hone par usi request pe `InvalidOperationException` aayega.",
    detailedAnswer:
      "Container jab `OrderService` banata hai `IOrderService` ke liye, wo uska poora constructor inspect karta hai — sirf `AppDbContext` nahi, `INotificationService` bhi resolve karne ki koshish karega, kyunki wo bhi ek constructor dependency hai. `INotificationService` registered nahi hai, isliye resolution fail hoga, aur error message specifically batayega ki `INotificationService` resolve nahi ho paaya (na ki `IOrderService`) — recursive resolution ka exactly yahi behavior hai.",
  },
  {
    id: "di-ioc-tr-6",
    question: "Tumhare paas `PaymentController` hai jo directly `new RazorpayGateway()` create karke use karta hai (DI nahi). Product team kehti hai 'agle sprint me PayU bhi support karna hai, runtime pe config se decide hoga kaunsa gateway use hoga'. Kya karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`IPaymentGateway` interface banao, dono gateways implement karein, controller ko interface pe depend karwao, aur DI container me config-based registration karo.",
    detailedAnswer:
      "Sabse pehle `IPaymentGateway` interface define karo common methods (InitiatePayment, VerifyPayment) ke saath. `RazorpayGateway` aur `PayUGateway` dono implement karein. `PaymentController` ka constructor `new RazorpayGateway()` ki jagah `IPaymentGateway` accept kare. `Program.cs` me registration ko config-driven banao — jaise `if (config[\"Gateway\"] == \"Razorpay\") services.AddScoped<IPaymentGateway, RazorpayGateway>(); else services.AddScoped<IPaymentGateway, PayUGateway>();`. Runtime pe switch appsettings change karke ho sakta hai, code redeploy ke bina agar config externally managed hai.",
    followUp: "Agar dono gateways ko ek hi request me use karna ho (fallback ke liye), design kaise badlega?",
  },
  {
    id: "di-ioc-tr-7",
    question: "Ek `OrderService` ka constructor 7 dependencies leta hai. Interview me is design pe tumhara comment kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ye Single Responsibility Principle violation ka strong signal hai — class shayad bahut zyada kaam kar rahi hai, refactor karke split karna chahiye.",
    detailedAnswer:
      "DI khud problem nahi hai yahan — problem ye hai ki class ko itni saari cheezon ki zaroorat kyun hai. 7 dependencies matlab class probably multiple unrelated responsibilities handle kar rahi hai (order creation + notification + inventory + pricing + logging + audit + payment). Isse split karna chahiye — jaise `OrderCreationService`, `OrderNotificationService` alag classes, har ek apni 2-3 dependencies ke saath, aur agar zaroorat ho to ek thin orchestrator unhe compose kare. DI container ye masking kar deta hai ki design me problem hai kyunki wiring 'automatically' ho jaati hai — isiliye constructor size ek design-smell signal hai jo dhyan me rakhna chahiye.",
    redFlag: "Sirf itna kehna 'DI hai to koi issue nahi, container handle kar lega' — DI ek design problem ko chhupa deta hai, solve nahi karta.",
  },
  {
    id: "di-ioc-tr-8",
    question: "Kya ye statement sahi hai: 'DI use karne ke baad performance bhi improve hoti hai kyunki objects reuse hote hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Galat hai in general — DI khud performance improve nahi karta; reuse sirf tab hota hai jab lifetime Singleton/Scoped ho, aur reflection-based resolution ka apna chhota cost bhi hai.",
    detailedAnswer:
      "Ye ek classic trap hai kyunki 'Singleton' lifetime wale services reuse to hote hain, lekin ye DI ka inherent benefit nahi hai — ye tumhare chosen lifetime ka effect hai. `Transient` services har baar naya instance banate hain, koi reuse nahi. Aur container khud reflection use karke object graph resolve karta hai, jo hand-written `new` calls se thoda slower hai (though negligible for most apps). DI ka asli value maintainability, testability, aur loose coupling hai — raw performance nahi. Interviewer ye statement isliye poochta hai dekhne ke liye ki candidate DI ke actual trade-offs samajhta hai ya sirf buzzwords repeat kar raha hai.",
    redFlag: "Bina qualify kiye 'DI performance ke liye achha hai' bol dena — ye reasoning galat hai aur signal deta hai ki lifetimes ka concept clear nahi hai.",
  },
  {
    id: "di-ioc-tr-9",
    question: "Ek `IInventoryChecker` interface likho jise `OrderService` use kar sake stock verify karne ke liye, aur dikhao DI ke through kaise wire hoga — interface, ek implementation, aur registration line.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Interface banao ek method ke saath, concrete class implement kare, constructor injection se `OrderService` me use karo, aur `Program.cs` me register karo.",
    detailedAnswer:
      "Expected solution shape:\n```csharp\npublic interface IInventoryChecker\n{\n    Task<bool> IsInStockAsync(string productId, int quantity);\n}\n\npublic class SqlInventoryChecker : IInventoryChecker\n{\n    private readonly AppDbContext _db;\n    public SqlInventoryChecker(AppDbContext db) => _db = db;\n\n    public async Task<bool> IsInStockAsync(string productId, int quantity)\n    {\n        var product = await _db.Products.FindAsync(productId);\n        return product is not null && product.StockCount >= quantity;\n    }\n}\n\npublic class OrderService : IOrderService\n{\n    private readonly IInventoryChecker _inventory;\n    public OrderService(IInventoryChecker inventory) => _inventory = inventory;\n\n    public async Task<Order> PlaceOrderAsync(CreateOrderDto dto)\n    {\n        if (!await _inventory.IsInStockAsync(dto.ProductId, dto.Quantity))\n            throw new InvalidOperationException(\"Out of stock\");\n        // ... proceed with order creation\n        return new Order();\n    }\n}\n\n// Program.cs\nbuilder.Services.AddScoped<IInventoryChecker, SqlInventoryChecker>();\n```\nKey evaluation points: interface-first design, constructor injection (not `new` inside `OrderService`), and the registration line matching the interface-to-concrete mapping.",
  },
];

export default questions;
