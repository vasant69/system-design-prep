import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "unit-testing-tr-1",
    question: "OOP aur unit testing ka relationship kya hai — interfaces aur DI testing ko kaise possible banate hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Amazon", "Swiggy"],
    shortAnswer: "Interfaces/DI ki wajah se real dependency ko test-time pe ek mock se substitute kiya ja sakta hai, isliye class ka logic isolation me test ho sakta hai.",
    detailedAnswer:
      "Agar ek class apni dependency khud `new` karti hai (tight coupling), us dependency ko test ke liye replace karna impossible ho jaata hai — real DB/network chahiye hota hai. Jab class ek interface (`IOrderRepository`) pe depend karti hai aur DI ke through inject hoti hai, test code us interface ka ek mock implementation pass kar sakta hai — predictable, fast, koi real infrastructure ke bina. Ye abstraction (interface) + DI ka direct, practical payoff hai.",
    followUp: "Agar ek class internally `new SqlConnection()` karti hai constructor ke bahar, use test karna kitna mushkil hoga?",
  },
  {
    id: "unit-testing-tr-2",
    question: "Moq library kya karti hai, aur kya limitation hai iski?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Runtime pe ek interface/virtual member ka fake implementation generate karti hai; limitation — sirf interfaces aur virtual/abstract members mock kar sakti hai.",
    detailedAnswer:
      "Moq ek proxy object generate karti hai jo target interface implement karta hai, jisme tum `Setup()` ke through behavior define karte ho ('jab ye call ho, ye return karo') aur `Verify()` ke through interactions confirm karte ho. Ye sirf interfaces aur virtual/abstract class members ke liye kaam karti hai — kyunki underlying mechanism ek derived/proxy type banata hai jo overridable members ko intercept karta hai. Non-virtual concrete methods (jaise ek sealed class ka regular method) mock nahi ho sakte.",
  },
  {
    id: "unit-testing-tr-3",
    question: "AAA (Arrange-Act-Assert) structure kya hai aur kyun follow karte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Ek test ko teen clear sections me organize karna — setup, execution, verification — taaki test ka intent turant readable ho.",
    detailedAnswer:
      "Arrange me tum mocks configure karte ho, input data banate ho. Act me actual method call karte ho jo test kar rahe ho. Assert me result ya interactions verify karte ho. Ye structural discipline hai, compiler-enforced nahi, lekin isse test files consistently readable rehti hain — koi bhi teammate turant samajh sakta hai test kya check kar raha hai bina poori logic trace kiye.",
  },
  {
    id: "unit-testing-tr-4",
    question: "Ye test kya verify kar raha hai, output batao?\n```csharp\nvar mockRepo = new Mock<IOrderRepository>();\nvar order = new Order { Id = 1, Total = 1000m };\nmockRepo.Setup(r => r.GetById(1)).Returns(order);\nvar service = new OrderService(mockRepo.Object);\n\nservice.ApplyDiscount(1, 10);\n\nAssert.Equal(900m, order.Total);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Test pass hoga — 10% discount lagne ke baad order.Total 1000 se 900 ho jaata hai.",
    detailedAnswer:
      "mockRepo.GetById(1) ko ek fixed order object return karne ke liye configure kiya gaya hai. service.ApplyDiscount(1, 10) is order ka Total field 10% kam kar deta hai (1000 - 100 = 900). Assertion Equal(900m, order.Total) is wajah se pass hoga. Note: koi real database involved nahi hai — pura test milliseconds me chal jaata hai, aur order object khud test ke andar shared reference hone ki wajah se mutation directly verify ho jaata hai.",
  },
  {
    id: "unit-testing-tr-5",
    question: "[Theory] aur [InlineData] use karke ek hi test method se multiple discount percentages test kaise karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "[Theory] attribute pe multiple [InlineData(input, expectedOutput)] lagao, method parameters us data ko receive karenge.",
    detailedAnswer:
      "```csharp\n[Theory]\n[InlineData(10, 900)]\n[InlineData(50, 500)]\n[InlineData(0, 1000)]\npublic void ApplyDiscount_HandlesMultiplePercentages(decimal percent, decimal expectedTotal)\n{\n    // Arrange/Act/Assert using percent and expectedTotal\n}\n```\nxUnit test runner is single method ko teen alag baar chalata hai, har baar corresponding InlineData values ke saath — result me teen alag test results dikhte hain (report me alag-alag), lekin code sirf ek jagah maintain hota hai.",
  },
  {
    id: "unit-testing-tr-6",
    question: "Tumhare paas ek OrderService hai jiska constructor directly `new SqlConnection(connectionString)` karta hai method ke andar, interface ke bina. Ise unit test karne me kya dikkat aayegi, aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Dikkat: koi mock inject nahi kar sakte, real DB chahiye hogi test ke liye. Fix: connection ko IDbConnection jaisa interface ke through inject karo.",
    detailedAnswer:
      "Jab SqlConnection method ke andar directly instantiate hoti hai, test code ke paas us dependency ko replace karne ka koi tareeka nahi hota — test ya to real database use karega (slow, flaky, environment-dependent) ya bilkul nahi likha ja sakega. Fix: connection/repository ko constructor ke through inject karo (`IOrderRepository` jaisa interface), taaki test ek mock implementation pass kar sake. Ye exactly wahi refactor hai jo tight-coupling ko testable design me convert karta hai.",
    followUp: "Agar legacy codebase me aisi bahut classes hain, kis order me refactor prioritize karoge?",
  },
  {
    id: "unit-testing-tr-7",
    question: "Ek service ka bug report aaya hai ki 'discount apply hone ke baad Save() call hi nahi ho raha kabhi kabhi.' Isko unit test se kaise catch/verify karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "mockRepo.Verify(r => r.Save(order), Times.Once) use karo — sirf return value check karna kaafi nahi, interaction verify karna zaroori hai.",
    detailedAnswer:
      "Agar test sirf `order.Total` ki correctness check karta hai (return value/state), wo `Save()` call hua ya nahi ye kabhi catch nahi karega — kyunki `order` object test me hi hai, `Save()` call na hone se bhi local mutation dikh jaayega. Isliye Moq ka `Verify()` zaroori hai — `mockRepo.Verify(r => r.Save(order), Times.Once)` explicitly confirm karta hai ki wo specific interaction hua. Ye behavior verification aur state verification ke beech ka important distinction hai.",
    redFlag: "Sirf state-based assertions likhna aur ye assume karna ki agar final state sahi hai to saare intermediate calls bhi sahi hue honge — hamesha true nahi hota.",
  },
  {
    id: "unit-testing-tr-8",
    question: "Kya ye statement sahi hai: 'Testability improve karne ke liye har class ke liye ek interface banani chahiye'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — sirf genuinely swappable/mockable dependencies (external I/O, DB, network) ke liye interface justified hai, har cheez ke liye nahi.",
    detailedAnswer:
      "Blanket rule ki 'har class = ek interface' unnecessary abstraction create karta hai — jaise ek pure calculation class jisme koi external dependency hi nahi hai, usko interface ke peeche daalna kisi real testing benefit ke bina complexity add karta hai. Interfaces waha zaroori hain jahan genuinely external/impure behavior hai (DB access, network calls, file I/O, time/random) jo test me predictable banane ki zaroorat ho. YAGNI principle yahan bhi apply hota hai.",
    redFlag: "'Best practice hai' bolke bina judgment ke har class pe interface thop dena.",
  },
  {
    id: "unit-testing-tr-9",
    question: "Ye test AAA structure follow kar raha hai ya nahi? Agar nahi, kya problem hai?\n```csharp\n[Fact]\npublic void Test1()\n{\n    var mockRepo = new Mock<IOrderRepository>();\n    var order = new Order { Total = 1000m };\n    mockRepo.Setup(r => r.GetById(1)).Returns(order);\n    var service = new OrderService(mockRepo.Object);\n    service.ApplyDiscount(1, 10);\n    Assert.Equal(900m, order.Total);\n    service.ApplyDiscount(1, 50);\n    Assert.Equal(450m, order.Total);\n}\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Technically AAA-ish hai but do alag behaviors ek hi test me mix ho rahe hain — agar pehla assertion fail ho, doosre ka pata hi nahi chalega.",
    detailedAnswer:
      "Ye test do independent scenarios (10% discount, phir 50% discount on already-discounted total) ko ek method me combine kar raha hai. Agar pehla Act/Assert pair fail ho jaaye, test turant stop ho jaata hai aur doosra scenario kabhi verify hi nahi hota — jisse failure diagnosis confusing ho jaata hai. Better approach: `[Theory]`/`[InlineData]` se do alag, independent test cases banao, ya do separate `[Fact]` methods, taaki har ek independently pass/fail ho sake aur failure clearly attributable ho.",
  },
];

export default questions;
