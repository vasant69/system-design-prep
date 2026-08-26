import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "unit-testing-aaa-1",
    question:
      "AAA pattern me 'Act' step ka kya role hai?",
    options: [
      "Test ke liye inputs aur mocks set up karna",
      "Jis behavior ko test karna hai, usse execute karna (ek single action)",
      "Expected outcome verify karna",
      "Test class ko dispose karna",
    ],
    correctIndex: 1,
    explanation:
      "Act step me jo method/behavior test ho raha hai, usse actually call kiya jaata hai — ideally ek single action. Setup 'Arrange' me hota hai (option A), verification 'Assert' me hota hai (option C). Option D kisi bhi AAA step ka part nahi hai, ye teardown concept hai jo alag hai.",
    difficulty: "easy",
  },
  {
    id: "unit-testing-aaa-2",
    question:
      "xUnit me parameterized test likhne ke liye konsa attribute combination use hota hai?",
    options: [
      "[Test] + [TestCase]",
      "[TestMethod] + [DataRow]",
      "[Theory] + [InlineData]",
      "[Fact] + [SetUp]",
    ],
    correctIndex: 2,
    explanation:
      "xUnit me `[Theory]` + `[InlineData(...)]` parameterized tests ke liye use hote hain. `[Test]`+`[TestCase]` NUnit ka syntax hai (option A), `[TestMethod]`+`[DataRow]` MSTest ka (option B). `[Fact]` parameterless test ke liye hai, aur `[SetUp]` NUnit ka setup attribute hai — xUnit me setup constructor se hota hai, isliye option D bhi galat combination hai.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-aaa-3",
    question:
      "NUnit me test setup ke liye kya explicitly likhna padta hai jo xUnit me automatic hai?",
    options: [
      "Koi difference nahi, dono identical hain",
      "[SetUp] attribute wala ek separate method — xUnit me ye constructor se automatically ho jaata hai",
      "NUnit me setup possible hi nahi hai",
      "MSTest jaisa hi [TestInitialize] use hota hai NUnit me bhi",
    ],
    correctIndex: 1,
    explanation:
      "NUnit ko explicit `[SetUp]` method chahiye jo har test se pehle chale. xUnit me constructor hi ye role play karta hai — har test ke liye class ka fresh instance banta hai, isliye constructor automatically 'setup' ban jaata hai. Option D galat hai — `[TestInitialize]` MSTest ka attribute naam hai, NUnit ka nahi.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-aaa-4",
    question:
      "Test naming convention `Add_TwoPositiveNumbers_ReturnsSum` follow karne ka main fayda kya hai?",
    options: [
      "Test tez chalta hai",
      "Compiler ke liye zaroori hai, warna error aata hai",
      "Test suite badi hone par failure list se turant pata chal jaata hai kya specifically toota",
      "Sirf xUnit me zaroori hai, NUnit/MSTest me nahi",
    ],
    correctIndex: 2,
    explanation:
      "Ye ek naming convention hai (MethodName_Scenario_ExpectedBehavior), koi compiler requirement nahi (option B galat) aur performance se koi lena dena nahi (option A galat). Ye sabhi frameworks me equally applicable hai (option D galat) — value ye hai ki readable failure lists milte hain, poora test suite scan kiye bina hi pata chal jaata hai kya break hua.",
    difficulty: "easy",
  },
];

export default quiz;
