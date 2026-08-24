import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "abstraction-tr-1",
    question: "Abstraction kya hai, aur encapsulation se ye kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Abstraction complexity chhupata hai (sirf zaroori 'what' expose karna); encapsulation state ko protect karta hai (kaun 'modify' kar sakta hai).",
    detailedAnswer:
      "Ye dono related hain lekin alag concerns solve karte hain. Encapsulation ka focus state pe hai — jaise Order.Total ko private set rakhna taaki invariant break na ho. Abstraction ka focus implementation detail pe hai — jaise IOrderService interface, jisse controller ko sirf pata hai 'PlaceOrderAsync call karo,' andar database/payment/email kaise handle ho raha hai wo hidden hai.",
    followUp: "Ek class encapsulated ho sakti hai bina abstract hue — example do.",
  },
  {
    id: "abstraction-tr-2",
    question: "Abstraction implement karne ke C# me kaunse do primary tools hain, aur structural difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Interface (pure contract) aur abstract class (contract + optional shared implementation). Class multiple interfaces implement kar sakti hai lekin sirf ek base class extend kar sakti hai.",
    detailedAnswer:
      "Interface sirf 'what' define karta hai — method signatures, koi implementation nahi (default interface methods, C# 8+, ek exception hain). Abstract class 'is-a' relationship ke saath shared implementation bhi de sakta hai — jaise Shape.Describe() sab shapes ke liye common ho sakta hai jabki Area() har shape apna implement kare. C# single class inheritance allow karta hai lekin multiple interface implementation — ye asymmetry decision framework drive karti hai (poora detail Module 3 me).",
    followUp: "To phir kab abstract class choose karoge interface ke upar?",
  },
  {
    id: "abstraction-tr-3",
    question: "Ye code kya print karega?\n```csharp\npublic interface INotifier { Task SendAsync(string to, string msg); }\npublic class SmsNotifier : INotifier\n{\n    public Task SendAsync(string to, string msg)\n    {\n        Console.WriteLine($\"SMS to {to}: {msg}\");\n        return Task.CompletedTask;\n    }\n}\n\nINotifier notifier = new SmsNotifier();\nawait notifier.SendAsync(\"9876543210\", \"OTP: 1234\");\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"SMS to 9876543210: OTP: 1234\" print hoga.",
    detailedAnswer:
      "Variable `notifier` ka declared type `INotifier` hai, lekin actual object `SmsNotifier` hai. `SendAsync` call karne par SmsNotifier ki implementation hi chalti hai (interface ke through call karna implementation ko hide karta hai, lekin behavior wahi rehta hai jo actual object provide karta hai). Ye abstraction ka basic demonstration hai — caller sirf INotifier jaanta hai, lekin actual work SmsNotifier karta hai.",
  },
  {
    id: "abstraction-tr-4",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic interface IShape\n{\n    double Area();\n}\n\nvar s = new IShape(); // this line\n```",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Compile error — interfaces (aur abstract classes) directly instantiate nahi ho sakte, `new` sirf concrete types pe chalta hai.",
    detailedAnswer:
      "Interface ek contract hai, koi concrete implementation nahi (default interface methods ke alawa) — isliye `new IShape()` invalid hai, 'Cannot create an instance of the abstract type or interface' error dega. Isko implement karne waali koi concrete class (jaise `class Circle : IShape`) hi instantiate ho sakti hai. Abstract classes ka bhi yahi rule hai.",
    redFlag: "Ye sochna ki interface bhi 'just another class hai jo new ho sakti hai' — interfaces aur abstract classes fundamentally non-instantiable hote hain.",
  },
  {
    id: "abstraction-tr-5",
    question: "Tumhara `IOrderService.PlaceOrderAsync` method underlying `SqlException` seedha throw kar deta hai jab database call fail hoti hai. Interviewer poochta hai — 'iska kya problem hai abstraction ke perspective se?'",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Ye leaky abstraction hai — implementation detail (SQL Server use ho raha hai) contract se leak ho gayi, jo abstraction ka purpose hi defeat karta hai.",
    detailedAnswer:
      "Achhi abstraction apne domain-specific exceptions define karti hai (jaise `OrderPlacementException`), aur underlying technology-specific errors (SqlException, HttpRequestException) ko internally catch karke wrap kar deti hai. Agar SqlException seedha bahar throw hoti hai, caller ko (chahe wo chahe ya na chahe) SQL Server ke baare me jaanna padta hai apna catch block likhne ke liye — abstraction 'leak' ho gayi. Ye khaaskar tab problematic hota hai jab kal database Postgres me switch ho — ab exception type bhi change ho jaayega, aur caller code break hoga.",
    redFlag: "Ye bolna ki 'exceptions to exceptions hote hain, kaunsa type throw ho raha hai isse koi farak nahi padta' — ye abstraction leakage ke real impact ko miss karta hai.",
  },
  {
    id: "abstraction-tr-6",
    question: "Ek naya team member kehta hai 'har class ke liye ek interface bana do, ye best practice hai.' Kya tum agree karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Nahi — agar kabhi doosri implementation nahi aani, na hi testing me swap karna hai, to interface layer sirf unnecessary indirection add karti hai.",
    detailedAnswer:
      "Abstraction tab meaningful hai jab actual variability hai — multiple implementations (RazorpayGateway/PayUGateway), ya testability ke liye mock/fake swap karna ho. Ek class jo genuinely single-implementation hai aur kabhi swap nahi hogi (jaise ek simple value-object ya utility class) ke liye interface banana sirf boilerplate hai, koi real abstraction benefit nahi deta. Judgement call hai — 'YAGNI' (You Aren't Gonna Need It) yahan bhi apply hota hai.",
    followUp: "To phir kis signal se pata chalta hai ki ab interface extract karne ka time aa gaya hai?",
  },
  {
    id: "abstraction-tr-7",
    question: "Payment gateway integration me `IPaymentGateway` interface use karke Razorpay se PayU switch karna kitna easy hota hai, agar poora system sirf interface pe depend karta ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Sirf DI registration line change karni padti hai — business logic, controllers, services kuch touch nahi hota.",
    detailedAnswer:
      "Agar `OrderService` sirf `IPaymentGateway` pe depend karta hai (constructor injection ke through), to switch karne ke liye bas `services.AddScoped<IPaymentGateway, RazorpayGateway>()` ko `services.AddScoped<IPaymentGateway, PayUGateway>()` me badalna hai. Poora business logic — order placement, validation, notification — bilkul untouched rehta hai kyunki wo kabhi bhi concrete gateway class ko jaanta hi nahi tha, sirf contract ko.",
    followUp: "Agar Razorpay aur PayU ke request/response shapes bilkul alag hain, ye difference kahan handle hoga?",
  },
  {
    id: "abstraction-tr-8",
    question: "Abstraction hamesha runtime pe koi cost lagata hai kya (jaise interface ke through call karna)?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Technically ek chhota overhead hota hai (virtual dispatch ke through call), lekin ye itna negligible hai ki 99% real-world code me irrelevant hota hai.",
    detailedAnswer:
      "Interface method call CLR level pe ek indirect call hota hai (interface method table ke through, similar concept virtual method dispatch se — poora detail runtime-polymorphism topic me hai) — direct concrete method call se thoda slower. Lekin ye difference nanoseconds ka hota hai, aur JIT compiler kai cases me devirtualize bhi kar sakta hai jab type statically known ho. Design flexibility ka benefit is tiny cost se kaafi zyada hota hai — bas interview me ye nuance pata hona chahiye, na ki 'zero cost' bol dena.",
    followUp: "Kis tarah ke extremely hot-path code me ye consideration actually matter karega?",
  },
];

export default questions;
