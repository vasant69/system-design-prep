import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "patterns-tr-1",
    question: "Factory pattern kya solve karta hai, ek real .NET example ke saath?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Amazon"],
    shortAnswer: "Object creation decision (kaunsa concrete type banana hai) ko caller se decouple karke ek jagah centralize karta hai. Payment gateway selection classic example hai.",
    detailedAnswer:
      "IPaymentGatewayFactory ek interface hai jiska Create(gatewayName) method runtime pe decide karta hai kaunsa concrete IPaymentGateway (RazorpayGateway ya PayUGateway) banana hai. Caller code (CheckoutService) ko is decision-making logic se koi matlab nahi, wo bas factory ko call karta hai. Ye particularly useful hai jab konsa concrete type banana hai ye runtime data (user preference, config) pe depend kare.",
    followUp: "Factory aur Strategy pattern ek saath kaise use hote hain?",
  },
  {
    id: "patterns-tr-2",
    question: "Classic GoF Singleton aur ASP.NET Core ke AddSingleton lifetime me kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Dono ek shared instance guarantee dete hain, lekin classic Singleton globally hardcoded state hai (untestable), AddSingleton DI-managed hai (mockable, testable).",
    detailedAnswer:
      "Classic GoF Singleton static field + private constructor use karta hai, jo global mutable state banata hai — koi bhi class isse directly access karti hai, mock nahi kar sakte unit tests me. AddSingleton<ICacheService, InMemoryCacheService>() bhi ek hi instance poore app lifetime me deta hai, lekin interface ke peeche hai, DI container thread-safe creation handle karta hai, aur tests me easily mock ho sakta hai. Same guarantee, bahut better implementation.",
    followUp: "Kya Singleton lifetime ka koi risk hai jo Scoped/Transient dependencies ke saath aata hai?",
  },
  {
    id: "patterns-tr-3",
    question: "Ye code review karo — Decorator pattern sahi implement hua hai kya?\n```csharp\npublic class CachingOrderServiceDecorator : IOrderService\n{\n    private readonly IOrderService _inner;\n    public CachingOrderServiceDecorator(IOrderService inner) => _inner = inner;\n    public Task<Order> GetOrderAsync(int id) => _inner.GetOrderAsync(id);\n}",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Structurally sahi hai (same interface, wraps inner), lekin actual caching logic missing hai — abhi ye sirf ek pass-through hai, real decorator nahi.",
    detailedAnswer:
      "Decorator ka structure (IOrderService implement karna, ek IOrderService ko wrap karna) sahi hai. Lekin GetOrderAsync method sirf _inner.GetOrderAsync(id) directly call kar raha hai bina koi extra behavior (jaise cache check) add kiye — ye ek 'no-op decorator' hai. Real decorator me pehle cache check hona chahiye, phir hi _inner call karna, phir result cache karna.",
  },
  {
    id: "patterns-tr-4",
    question: "Ek naya team member bolta hai 'humari CRUD API chhoti hai, hume Factory + Strategy + Decorator + Mediator sab use karne chahiye taaki design 'best practice' ho.' Kya ye sahi approach hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — patterns tabhi lagane chahiye jab specific problem present ho. Chhoti CRUD API me sab patterns force karna over-engineering hai.",
    detailedAnswer:
      "Design patterns tools hain, goals nahi. Har pattern indirection add karta hai (extra files, extra layers, naye developers ke liye learning curve). Agar chhoti CRUD API me koi multiple-implementation-selection problem nahi hai, Factory unnecessary hai. Agar koi cross-cutting behavior wrap karne ki zaroorat nahi, Decorator unnecessary hai. Sahi approach: simple code se shuru karo, jab genuine complexity/variation aaye tabhi specific pattern reach karo.",
    redFlag: "'Zyada patterns use karna hamesha better design hai' — ye YAGNI (You Aren't Gonna Need It) violate karta hai aur senior interviewers ko red flag lagta hai.",
  },
  {
    id: "patterns-tr-5",
    question: "IOptions<T> aur IOptionsSnapshot<T>/IOptionsMonitor<T> me kya farak hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "IOptions<T> app-lifetime ke liye static config hai (ek baar load hota hai); IOptionsSnapshot<T>/IOptionsMonitor<T> runtime config-reload support karte hain.",
    detailedAnswer:
      "IOptions<T>.Value app startup pe ek baar resolve hota hai aur poore application lifetime me same rehta hai (Singleton-jaisa behavior). IOptionsSnapshot<T> per-request naya value deta hai (Scoped), aur IOptionsMonitor<T> live change-notifications support karta hai (jab config file change ho, callback fire hota hai) bina application restart ke. Ye distinction Options pattern ke advanced usage me important hai — jaise ek feature-flag jo runtime pe toggle honi hai bina redeploy ke, IOptionsMonitor<T> chahiye hoga.",
    followUp: "Ek real scenario do jahan IOptionsMonitor<T> zaroori hoga, IOptions<T> kaafi nahi hoga.",
  },
  {
    id: "patterns-tr-6",
    question: "Production me ek OrdersController hai jisme 15+ direct business-logic calls hain multiple services ko. Kaunsa pattern isko clean karne me help karega, aur kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Mediator pattern (MediatR) — har operation ek Command/Query object ban jaata hai, controller sirf IMediator.Send() call karta hai, handlers alag classes me business logic rakhte hain.",
    detailedAnswer:
      "Controller ko thin rakhna hai — har action method me direct multiple service calls ki jagah, ek Command/Query record define karo (jaise GetOrderQuery, CreateOrderCommand) aur ek corresponding IRequestHandler likho jo actual logic rakhta hai. Controller sirf mediator.Send(query) call karta hai. Ye controllers ko dramatically thin banata hai, aur cross-cutting concerns (validation, logging) ko MediatR pipeline behaviors ke through centrally add kiya ja sakta hai, har handler me repeat kiye bina.",
    followUp: "Isse test karna kaise aasan hota hai compared to direct service calls?",
  },
  {
    id: "patterns-tr-7",
    question: "Ek RazorpayGateway ke liye Payment Gateway Factory design karo jo runtime pe user preference ke basis pe RazorpayGateway ya PayUGateway return kare, DI container use karte hue.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "IPaymentGatewayFactory interface + PaymentGatewayFactory class jo IServiceProvider se sahi concrete gateway resolve kare switch expression ke through.",
    detailedAnswer:
      "```csharp\npublic interface IPaymentGatewayFactory\n{\n    IPaymentGateway Create(string gatewayName);\n}\n\npublic class PaymentGatewayFactory : IPaymentGatewayFactory\n{\n    private readonly IServiceProvider _serviceProvider;\n    public PaymentGatewayFactory(IServiceProvider serviceProvider) => _serviceProvider = serviceProvider;\n\n    public IPaymentGateway Create(string gatewayName) => gatewayName switch\n    {\n        \"Razorpay\" => _serviceProvider.GetRequiredService<RazorpayGateway>(),\n        \"PayU\" => _serviceProvider.GetRequiredService<PayUGateway>(),\n        _ => throw new ArgumentException(\"Unknown gateway\")\n    };\n}\n```\nRegistration: dono concrete gateways aur factory ko DI container me register karo. Caller (CheckoutService) IPaymentGatewayFactory inject karta hai aur runtime pe Create(userPreference) call karta hai.",
  },
  {
    id: "patterns-tr-8",
    question: "Kya Decorator pattern aur ASP.NET Core middleware same cheez hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — conceptually similar (wrap + delegate) hain lekin Decorator ek specific interface/service ko wrap karta hai, middleware poori HTTP pipeline ko.",
    detailedAnswer:
      "Dono 'chain of wrapping' idea share karte hain, lekin scope alag hai. Decorator pattern application-level hai — ek specific service interface (jaise IOrderService) ko wrap karta hai naya behavior add karne ke liye, aur DI container ke through explicitly wire hota hai. Middleware HTTP-request-level hai — poori pipeline ka part hai, har incoming request ke liye chalta hai, `app.UseMiddleware<T>()` se register hota hai. Interview me inhe conflate karna ek common gap hai.",
    redFlag: "'Middleware bhi Decorator hi hai, same baat hai' — technically related idea hai lekin scope/registration mechanism ka farak samajhna zaroori hai.",
  },
];

export default questions;
