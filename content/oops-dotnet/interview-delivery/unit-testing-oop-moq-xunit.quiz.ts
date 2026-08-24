import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "unit-testing-1",
    question: "Unit testing OOP code me practically possible kyun hoti hai, iska core reason kya hai?",
    options: [
      "xUnit ek magic tool hai jo kisi bhi code ko test kar sakta hai",
      "Interfaces aur DI ki wajah se real dependencies ko test-time pe mocks se replace kiya ja sakta hai",
      "C# me sab classes automatically testable hoti hain",
      "Unit testing sirf ASP.NET Core me possible hai, plain C# me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Testability directly OOP design decisions se aati hai — jab ek class abstraction (interface) pe depend karti hai concrete implementation ke bajaye, test me us abstraction ka mock implementation substitute kiya ja sakta hai. Option A galat hai, xUnit sirf ek test runner hai, koi magic nahi. Option C galat hai — tightly-coupled classes genuinely mushkil hoti hain test karna. Option D bhi galat hai, ye principle kisi bhi OOP C# code pe apply hota hai.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-2",
    question: "Moq kis type ke members ko mock kar sakta hai?",
    options: [
      "Kisi bhi class ke kisi bhi method ko, chahe wo private ho",
      "Sirf interfaces aur virtual/abstract members ko",
      "Sirf static methods ko",
      "Sirf async methods ko",
    ],
    correctIndex: 1,
    explanation:
      "Moq interfaces aur virtual/abstract members mock kar sakta hai — ye is wajah se hai ki mocking runtime pe ek proxy/derived implementation generate karke kaam karta hai, jo sirf overridable members ke liye possible hai. Non-virtual concrete methods (khaaskar private ones) mock nahi ho sakte. Options C aur D dono asymmetrically galat/incomplete claims hain.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-3",
    question: "[Fact] aur [Theory] me kya difference hai xUnit me?",
    options: [
      "Koi difference nahi, dono same kaam karte hain",
      "[Fact] ek fixed single test case hai; [Theory] [InlineData] ke saath parameterized multiple inputs test karta hai",
      "[Theory] sirf async tests ke liye hai",
      "[Fact] sirf integration tests ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "[Fact] no parameters leta, ek fixed scenario test karta hai. [Theory] ke saath [InlineData(...)] use karke same test logic multiple input/expected-output combinations ke against reuse hoti hai, bina test method duplicate kiye. Options C aur D dono factually galat constraints add karte hain jo actually exist nahi karte.",
    difficulty: "easy",
  },
  {
    id: "unit-testing-4",
    question: "mockRepo.Verify(r => r.Save(order), Times.Once) kya check karta hai?",
    options: [
      "Sirf ye ki order object null nahi hai",
      "Ki Save() method exactly ek baar call hua us specific order argument ke saath",
      "Ki Save() method ka return value 1 hai",
      "Ki order.Total sahi calculate hua",
    ],
    correctIndex: 1,
    explanation:
      "Verify() Moq ka behavior-verification feature hai — ye return value check nahi karta, balki ye confirm karta hai ki ek specific method call genuinely hua (aur kitni baar). Ye return-value-based Assert se alag hai — kabhi kabhi tumhe check karna hota hai ki koi interaction hua ya nahi, sirf final state nahi. Options A, C, D sab is specific call ka galat interpretation hain.",
    difficulty: "hard",
  },
];

export default quiz;
