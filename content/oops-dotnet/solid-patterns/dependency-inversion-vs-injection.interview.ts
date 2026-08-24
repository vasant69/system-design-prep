import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dip-tr-1",
    question: "DIP aur DI me kya difference hai? Ye ek classic confused pair hai — precisely explain karo.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Amazon", "Razorpay"],
    shortAnswer: "DIP ek design principle hai (abstraction pe depend karo), DI ek technique hai (dependency bahar se supply karo). Dono independent concepts hain.",
    detailedAnswer:
      "DIP kehta hai high-level modules ko low-level concrete modules pe directly depend nahi karna chahiye, dono ko ek abstraction pe depend karna chahiye. DI ek mechanism/pattern hai jisse dependencies object ke bahar se supply hoti hain (constructor/property/method), khud object internally construct nahi karta. Tum DI kar sakte ho bina DIP follow kiye (concrete class inject karke), aur DIP follow kar sakte ho bina DI container ke (manual factory se).",
    followUp: "Ek code example do jisme DI ho raha ho lekin DIP nahi.",
  },
  {
    id: "dip-tr-2",
    question: "Ye code DIP follow karta hai ya nahi? Reasoning do.\n```csharp\npublic class NotificationService\n{\n    private readonly EmailSender _sender;\n    public NotificationService(EmailSender sender) => _sender = sender;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Nahi, DIP violate karta hai — NotificationService (high-level) directly EmailSender (concrete, low-level) pe depend kar raha hai, koi abstraction beech me nahi hai.",
    detailedAnswer:
      "Constructor injection ho raha hai (DI ho raha hai), lekin dependency type EmailSender ek concrete class hai, interface nahi. Isliye agar kal SmsSender bhi add karna ho, NotificationService ka constructor signature hi badalna padega — high-level module ko low-level implementation detail ka pata hai. DIP-compliant version me `INotificationSender` jaisa interface hota, jo EmailSender implement karta.",
    followUp: "Isko DIP-compliant kaise banaoge — code likh kar dikhao.",
  },
  {
    id: "dip-tr-3",
    question: "Tumhare paas ek codebase hai jisme har class constructor-injected hai (DI heavily use ho raha hai), lekin kai jagah concrete classes directly inject ho rahi hain, interfaces nahi. Kya ye codebase 'well-designed' hai DIP ke perspective se?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Nahi — DI heavily use hone ka matlab DIP follow hona nahi hai. Concrete-class injection abhi bhi tight coupling create karta hai, sirf construction-time coupling se runtime-injected coupling me shift hua hai.",
    detailedAnswer:
      "Ye ek real, common misconception hai — teams sochte hain 'hum DI use kar rahe hain, isliye humara code loosely coupled hai.' Lekin agar dependencies concrete classes hain (interfaces nahi), swap/mock/test karna abhi bhi mushkil hai, sirf object-creation ka jagah badla hai (constructor ke bahar), coupling khatam nahi hua. Sahi fix: audit karo kaunse constructors concrete types le rahe hain, unhe interfaces me convert karo.",
    followUp: "Isko incrementally fix karne ka strategy kya hoga ek bade production codebase me?",
  },
  {
    id: "dip-tr-4",
    question: "Kya ye sahi hai ki 'DI container use karne se automatically DIP follow ho jaata hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — DI container me bhi concrete types register/inject ho sakte hain (`AddScoped<SqlOrderRepository>()`), jo DIP violate karta hai.",
    detailedAnswer:
      "DI container sirf ek mechanism hai dependencies wire karne ka — ye khud kuch enforce nahi karta ki dependencies abstractions hon. `builder.Services.AddScoped<SqlOrderRepository>()` likhna aur seedha SqlOrderRepository inject karna bilkul valid, compiling code hai jo DI use karta hai lekin DIP violate karta hai. DIP follow karna ek design discipline hai jo developer ko interfaces design karke maintain karni padti hai, container ye automatically enforce nahi karta.",
    redFlag: "'Hum DI container use karte hain, isliye humara design SOLID hai' — ye overclaim hai jo interviewer immediately probe karega.",
  },
  {
    id: "dip-tr-5",
    question: "Bina kisi DI container use kiye, sirf plain C# se, DIP-compliant code likh kar dikhao.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "IOrderRepository interface, SqlOrderRepository implementation, aur ek manual factory jo concrete type decide karke OrderService ko abstraction ke through supply kare.",
    detailedAnswer:
      "```csharp\npublic interface IOrderRepository { Task<Order> GetByIdAsync(int id); }\n\npublic class SqlOrderRepository : IOrderRepository\n{\n    public Task<Order> GetByIdAsync(int id) => /* impl */;\n}\n\npublic class OrderService\n{\n    private readonly IOrderRepository _repository;\n    public OrderService(IOrderRepository repository) => _repository = repository;\n}\n\npublic static class ManualFactory\n{\n    public static OrderService CreateOrderService()\n    {\n        IOrderRepository repo = new SqlOrderRepository();\n        return new OrderService(repo);\n    }\n}\n```\nKoi DI container nahi hai yahan, sirf manual wiring — phir bhi OrderService sirf abstraction (IOrderRepository) jaanta hai, koi concrete implementation detail nahi. Ye pure DIP hai bina kisi framework ke.",
  },
  {
    id: "dip-tr-6",
    question: "DIP ka 'second half' (jo log aksar bhool jaate hain) kya hai — sirf 'interfaces use karo' se aage?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Abstractions ko details pe depend nahi karna chahiye — ek interface khud bhi kisi concrete implementation ke leaking details carry nahi karni chahiye.",
    detailedAnswer:
      "DIP ke do parts hain: (1) high-level modules low-level pe depend na karein, dono abstraction pe depend karein — ye popular half hai. (2) abstractions details pe depend na karein, details abstractions pe depend karein — ye kam-discussed half hai. Practically iska matlab: agar `IOrderRepository` interface me ek method `SqlConnection GetRawConnection()` ho, to ye interface khud ek specific implementation detail (SQL) leak kar raha hai — koi bhi non-SQL implementation (jaise MongoOrderRepository) is method ko meaningfully implement nahi kar payega. Interface ko implementation-agnostic rehna chahiye.",
    followUp: "Ek aur example do jahan ek interface accidentally implementation detail leak karta ho.",
  },
  {
    id: "dip-tr-7",
    question: "'Inversion' word DIP me kyun use hota hai — dependency direction kis se kis me invert hoti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Traditional design me high-level module directly low-level concrete module pe depend karta hai; DIP me dono ek shared abstraction pe depend karte hain — direction invert ho jaati hai.",
    detailedAnswer:
      "Traditional (non-DIP) design me OrderService seedha SqlOrderRepository ko naye karta ya directly reference karta hai — dependency arrow high-level se low-level ki taraf jaata hai, aur low-level module ka koi bhi change high-level ko force karta hai adapt karne ke liye. DIP is arrow ko 'invert' karta hai — ab dono, high-level (OrderService) aur low-level (SqlOrderRepository), ek shared abstraction (IOrderRepository) ki taraf point karte hain. Low-level module ab abstraction ko implement karta hai, define nahi karta.",
  },
  {
    id: "dip-tr-8",
    question: "Ek naya candidate interview me bolta hai: 'DIP matlab Dependency Injection Principle hai.' Ye sahi hai ya galat?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Galat — DIP ka full form Dependency INVERSION Principle hai, Dependency Injection Principle nahi (aisi koi cheez SOLID me exist nahi karti).",
    detailedAnswer:
      "Ye ek bahut common naming confusion hai jo candidates real interviews me karte hain. SOLID ka 'D' Dependency INVERSION Principle hai. Dependency Injection alag se ek well-known technique/pattern hai jo DIP-compliant design ko wire karne me help karta hai, lekin ye khud SOLID principles ka part nahi hai. Ye naming slip interview me turant clarity ki kami signal karta hai.",
    redFlag: "'DIP = Dependency Injection Principle' bolna — naam hi galat hai, ye foundational confusion dikhata hai.",
  },
];

export default questions;
