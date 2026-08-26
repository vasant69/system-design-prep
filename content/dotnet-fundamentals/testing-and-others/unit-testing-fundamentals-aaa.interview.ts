import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "unit-testing-aaa-tr-1",
    question: "AAA pattern kya hai aur ye kyun important hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Arrange-Act-Assert — setup, execution, verification ko clearly separate karta hai, jisse test readable aur maintainable rehta hai.",
    detailedAnswer:
      "Arrange me test ke inputs/mocks/dependencies set up hote hain, Act me jo behavior test karna hai wo ek single action se execute hota hai, Assert me expected outcome verify hota hai. Ye structure har developer ko test ka intent turant samajhne deta hai bina business logic dobara trace kiye, aur failure hone par exactly pata chalta hai kis step pe kya expect kiya gaya tha.",
    followUp: "Agar ek test me multiple Act steps ho, to kya problem hai?",
  },
  {
    id: "unit-testing-aaa-tr-2",
    question: "xUnit, NUnit, aur MSTest ke setup/teardown mechanism me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Amazon", "Microsoft"],
    shortAnswer:
      "xUnit constructor/Dispose use karta hai (per-test fresh instance), NUnit explicit [SetUp]/[TearDown] maangta hai, MSTest [TestInitialize]/[TestCleanup] use karta hai.",
    detailedAnswer:
      "xUnit har test se pehle test class ka naya instance banata hai — isliye constructor hi setup ka role play karta hai, aur IDisposable.Dispose() teardown ka. NUnit by default shared instance assume karta hai aur explicit [SetUp]/[TearDown] methods chahiye har test se pehle/baad chalne ke liye. MSTest [TestInitialize]/[TestCleanup] attributes use karta hai, similar explicit convention NUnit jaisa hi.",
  },
  {
    id: "unit-testing-aaa-tr-3",
    question: "xUnit me `[Fact]` aur `[Theory]` me kya difference hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "[Fact] ek parameterless, fixed-scenario test hai; [Theory] ek parameterized test hai jo [InlineData] se multiple input combinations ke saath run hota hai.",
    detailedAnswer:
      "[Fact] ek single, specific scenario test karta hai — koi parameters nahi. [Theory] ke saath ek ya zyada [InlineData(...)] attributes lagakar same test method ko multiple different inputs ke saath chalaya ja sakta hai, jisse duplicate test methods likhne se bacha jaata hai jab logic same ho lekin inputs alag.",
    followUp: "NUnit aur MSTest me [Theory]/[InlineData] ka equivalent kya hai?",
  },
  {
    id: "unit-testing-aaa-tr-4",
    question: "Ye do test method names me se kaunsa better hai aur kyun: `Test1` ya `Divide_ByZero_ThrowsDivideByZeroException`?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Dusra — descriptive naming se failure list se hi pata chal jaata hai kya specifically toota, bina test body padhe.",
    detailedAnswer:
      "`Test1` jaisa generic naam test suite badi hone par bekaar ho jaata hai — CI failure report me sirf 'Test1 failed' dikhega, kuch context nahi milega. `MethodName_Scenario_ExpectedBehavior` pattern (jaise `Divide_ByZero_ThrowsDivideByZeroException`) failure list ko khud-explanatory bana deta hai.",
  },
  {
    id: "unit-testing-aaa-tr-5",
    question: "Kya NUnit me `[SetUp]` na likhne se compile error aayega?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi, compile error nahi aayega — lekin fields jo [SetUp] me initialize hone the, wo har test se pehle uninitialized (null/default) reh jaayenge, runtime pe NullReferenceException ya wrong-state failures milenge.",
    detailedAnswer:
      "[SetUp] ek runtime convention hai, compile-time requirement nahi — agar tum ise bhool jaate ho, code compile ho jaayega. Lekin agar tumhare fields sirf [SetUp] method me hi initialize hote the (constructor me nahi), to wo fields default state me rahenge jab tak koi aur jagah unhe set na kare, jisse tests galat tareeke se pass ya fail ho sakte hain.",
    redFlag: "Ye bol dena ki [SetUp] na hone par compiler error dega — ye galat hai, ye purely a runtime/logic issue hai.",
  },
  {
    id: "unit-testing-aaa-tr-6",
    question: "Ek team decide karti hai apne naye .NET 8 microservice ke liye test framework choose karna hai. Aap kya recommend karoge?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "xUnit — greenfield .NET projects ke liye sabse common default, per-test isolation built-in, strong community/tooling support.",
    detailedAnswer:
      "Agar koi existing constraint nahi hai (jaise legacy MSTest codebase ya team ki NUnit familiarity), xUnit ek safe default hai kyunki ye .NET runtime team khud production me use karta hai, per-test fresh-instance isolation deta hai jo accidental shared-state bugs se bachata hai, aur naye .NET tooling ke saath deeply integrated hai. Lekin ye ek convention choice hai, koi hard technical requirement nahi.",
  },
  {
    id: "unit-testing-aaa-tr-7",
    question: "Ek test jo `Assert.Equal(5, calculator.Add(2, 3))` aur usi method me `Assert.Equal(10, calculator.Multiply(2, 5))` dono assert karta hai — is design me kya problem hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "AAA violation — do alag behaviors (Add aur Multiply) ek hi test me test ho rahe hain, agar ek fail ho to dusra kabhi run hi nahi hoga aur failure report confusing hoga.",
    detailedAnswer:
      "Har unit test ideally EK behavior test kare. Yahan do independent operations (Add, Multiply) ek method me combine kiye gaye hain — agar pehla Assert fail hota hai, test wahin ruk jaayega aur Multiply kabhi test hi nahi hoga is run me. Fix: do separate test methods likho, `Add_TwoNumbers_ReturnsSum` aur `Multiply_TwoNumbers_ReturnsProduct`.",
  },
  {
    id: "unit-testing-aaa-tr-8",
    question: "Kya ek hi .NET solution me xUnit aur MSTest dono use kiye ja sakte hain, alag projects me?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Haan — test framework choice per-project hoti hai, ek solution ke andar legacy aur naye projects alag frameworks use kar sakte hain bina conflict ke.",
    detailedAnswer:
      "Har test project apna khud ka test framework NuGet package reference karta hai, isliye ek solution ke andar ek project MSTest use kar sakta hai (legacy) aur doosra xUnit (naya microservice) — dono independently `dotnet test` se run ho jaate hain. Ye common hai large enterprise codebases me jahan migration gradually hoti hai.",
  },
];

export default questions;
