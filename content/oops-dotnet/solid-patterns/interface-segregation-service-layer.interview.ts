import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "isp-tr-1",
    question: "ISP kya hai? Ek real fat-interface example do.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Clients ko sirf zaroori methods pe depend karna chahiye. IOrderService jisme 8 unrelated methods hon, ek fat interface example hai.",
    detailedAnswer:
      "Ek IOrderService jisme read, write, invoicing, aur export sab methods ek saath hon, ek fat interface hai. Ek read-only reporting service ko is interface ko implement karte waqt CreateOrderAsync, RefundOrderAsync jaisi irrelevant methods bhi stub karni padengi. Fix hai IOrderReader, IOrderWriter, IOrderInvoicing jaisi role-specific interfaces me split karna.",
    followUp: "SRP se ye kaise alag hai?",
  },
  {
    id: "isp-tr-2",
    question: "Ye class review karo — kya problem hai?\n```csharp\npublic class ReportingService : IOrderService\n{\n    public Task<Order> GetOrderAsync(int id) => RealImpl();\n    public Task<Order> CreateOrderAsync(CreateOrderDto dto) => throw new NotImplementedException();\n    public Task CancelOrderAsync(int id) => throw new NotImplementedException();\n}",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "ISP violation — ReportingService ko IOrderService ke unrelated methods stub karne pad rahe hain jo uske use-case me irrelevant hain.",
    detailedAnswer:
      "Do methods NotImplementedException throw kar rahe hain — ye batata hai IOrderService interface fat hai. Agar koi caller generically IOrderService type pe kaam kare aur galti se ReportingService ko CreateOrderAsync ke liye pass kar de, runtime crash hoga. Fix: interface ko IOrderReader (jo ReportingService actually use karta hai) me segregate karo.",
    followUp: "Agar koi existing caller pehle se poore IOrderService pe depend karta hai, migration kaise karoge?",
  },
  {
    id: "isp-tr-3",
    question: "Tumhare team lead ne ek naya IUserService banaya hai jisme authentication, profile management, aur admin-only user-banning sab ek interface me hain. Tumhe lagta hai isse problem ho sakti hai. Kaise explain karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ye fat interface hai — teen alag concerns ek jagah, jisse har consumer (login flow, profile page, admin panel) ko poora interface implement/mock karna padega bhale unhe sirf ek concern chahiye ho.",
    detailedAnswer:
      "Explain karo ki login flow sirf authentication methods use karta hai, profile page sirf profile methods, admin panel sirf ban-related methods — lekin agar sab ek IUserService me hain, to unit testing me har jagah poore interface ko mock karna padega, aur ek naya admin method add hone par un consumers ko bhi recompile/reconsider karna padega jo admin functionality use hi nahi karte. Suggest karo IAuthService, IUserProfileService, IUserAdminService me split karna.",
    followUp: "Kya har consumer ko sab teen interfaces alag-alag inject karni padengi, ya ek class sabko implement kar sakti hai?",
  },
  {
    id: "isp-tr-4",
    question: "Kya ISP ka matlab hai ki har interface me sirf ek method hona chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — ISP 'role-specific' interfaces chahta hai, matlab related methods ek saath rakhna theek hai, sirf UNRELATED methods ko alag karo.",
    detailedAnswer:
      "Ye ek common misconception hai. IOrderReader interface me GetOrderAsync aur GetOrdersByCustomerAsync dono ho sakte hain kyunki dono 'reading' role ke under aate hain — ye ISP violate nahi karta. ISP tab violate hota hai jab UNRELATED concerns (reading + writing + invoicing) ek hi interface me force kiye jaate hain, jisse ek consumer ko unrelated methods bhi lena padta hai.",
    redFlag: "'Har interface me ek method' bolna over-segregation ki taraf le jaata hai jo utna hi problematic hai jitna fat interface.",
  },
  {
    id: "isp-tr-5",
    question: "Segregation ke baad, ek OrderService class jo genuinely sab (read, write, invoicing) karti hai, uska interface declaration kaisa dikhega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`public class OrderService : IOrderReader, IOrderWriter, IOrderInvoicing` — C# multiple interfaces ek saath implement karne deta hai.",
    detailedAnswer:
      "C# me ek class multiple interfaces implement kar sakti hai (unlike multiple class inheritance jo disallowed hai). Isliye OrderService sab teen role-specific interfaces implement kar sakti hai bina kisi extra cost/duplication ke — sirf class declaration me comma-separated interfaces list ho jaati hain, aur class un sab ke methods implement karti hai jo already uske paas hain.",
  },
  {
    id: "isp-tr-6",
    question: "Ek fat interface ka existing consumer code hai jo poore IOrderService pe depend karta hai. Tumne interface segregate kar diya. Kya ye ek breaking change hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Agar OrderService concrete class sab segregated interfaces implement karti hai, to DI registration aur constructor injection thoda update karna padega, lekin behavior same rehta hai.",
    detailedAnswer:
      "Existing consumer jo `IOrderService orderService` constructor-inject karta tha, ab specific interfaces (`IOrderReader`, `IOrderWriter`) inject karega jo usko chahiye. Ye ek mechanical refactor hai — DI container me OrderService ko sab segregated interfaces ke against register karna hoga (`AddScoped<IOrderReader, OrderService>()`, `AddScoped<IOrderWriter, OrderService>()`, etc.), aur consumers apne constructors update karenge. Behavior change nahi hota, sirf dependency surface area chhota/precise ho jaata hai.",
    followUp: "Agar chaho ki OrderService ka ek hi instance (singleton-jaisa) sab interfaces ke liye resolve ho per request, kaise ensure karoge?",
  },
  {
    id: "isp-tr-7",
    question: "Kya ISP sirf service-layer interfaces pe apply hota hai, ya UI/domain layers pe bhi?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "ISP koi bhi layer pe apply hota hai — jahan bhi ek interface consumer ko unrelated methods pe depend karwa raha ho.",
    detailedAnswer:
      "ISP ek general OOP principle hai, sirf service layer specific nahi. Repository interfaces, domain event handlers, UI view-model contracts — kahin bhi ek interface fat ho sakta hai aur consumers ko unrelated cheezein force kar sakta hai. .NET BCL ka apna example: IEnumerable<T> (sirf iterate) vs ICollection<T> (mutate bhi) vs IList<T> (indexed access bhi) — ye progressive segregation across the framework hai, sirf service layer tak limited nahi.",
  },
];

export default questions;
