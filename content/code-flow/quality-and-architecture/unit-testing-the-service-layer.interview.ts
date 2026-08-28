import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "unittest-1",
    question:
      "Ek service jo database aur ek external API dono se baat karti hai, use unit test kaise karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Service ko un dependencies par interface ke through depend karwao. Test me Moq se un interfaces ke mocks banao, `.Setup(...).ReturnsAsync(...)` se scenario program karo, SUT ko mocks ke saath construct karo, ek method call karo, aur return/exception plus `.Verify(...)` assert karo.",
    detailedAnswer:
      "Precondition: `EmployeeService` `IEmployeeRepository` aur `IPanVerificationClient` par depend karti hai, `EfEmployeeRepository` ya raw `HttpClient` par nahi. Test project `dotnet new xunit` se banta hai, API project reference karta hai, aur `Moq` plus `FluentAssertions` add karta hai. Test AAA me: Arrange me `new Mock<IEmployeeRepository>()`, `_repo.Setup(r => r.EmailExistsAsync(email)).ReturnsAsync(true)`, phir `new EmployeeService(_repo.Object, _pan.Object)`. Act me ek method — `sut.CreateAsync(request)`. Assert me `await act.Should().ThrowAsync<ValidationException>()` aur `_repo.Verify(r => r.AddAsync(It.IsAny<Employee>()), Times.Never)` taaki side-effect bhi check ho. Na DB, na network — test milliseconds me, deterministic, aur exact rule pinpoint karta hai.",
    followUp: "Agar service ke andar `new HttpClient()` likha ho to test kaise stuck hoga?",
    redFlag:
      "In-memory EF provider ya localhost SQL Server se test karna aur use unit test bolna — wo integration test hai, slow aur DB par nirbhar.",
  },
  {
    id: "unittest-2",
    question: "AAA pattern kya hai, aur ek test me kitne behaviours assert karne chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Arrange (mocks banao aur program karo, SUT construct karo), Act (ek method call), Assert (return/exception plus interaction verify). Ek test = ek behaviour.",
    detailedAnswer:
      "Arrange: test doubles setup, SUT construction. Act: SUT ka sirf ek method, ek line. Assert: result ya thrown exception, aur zaroorat ho to `mock.Verify(...)` se check ki dependency sahi tarah (ya bilkul nahi) call hui. Teen blocks ek blank line se alag. Ek `[Fact]` me sirf ek behaviour rakho — agar duplicate-email, invalid-PAN aur happy-path sab ek test me daal doge to fail hone par pata nahi chalega kaunsa rule toota. Test ka naam bhi ek line padhna chahiye: `Method_Scenario_ExpectedResult`, jaise `CreateAsync_DuplicateEmail_ThrowsValidationException` — CI ki red line se hi samajh aa jaaye kya toota.",
    followUp: "Ek hi rule ke 5 input variations test karne hon to kya karoge, alag-alag `[Fact]` copy-paste?",
  },
  {
    id: "unittest-3",
    question: "`[Fact]` aur `[Theory]` me farak kya hai? `[Theory]` kab use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`[Fact]` ek parameterless test — ek scenario. `[Theory]` + `[InlineData(...)]` ek hi test body ko alag inputs par chalata hai; har row test runner me alag result. Boundary/format checks ke liye ideal.",
    detailedAnswer:
      "Jab ek rule ke kai input variations hon — PAN format ke valid/invalid cases, salary boundary values, page-size limits — to `[Theory]` use karo:\n```csharp\n[Theory]\n[InlineData(ABCDE1234F_placeholder, true)]\n[InlineData(lowercase_placeholder, false)]\n[InlineData(nine_char_placeholder, false)]\npublic void IsWellFormedPan_ChecksFormat(string pan, bool expected)\n    => PanFormat.IsWellFormed(pan).Should().Be(expected);\n```\n(asli code me literal string values hoti hain). Ek method, N cases, N alag pass/fail results — copy-paste `[Fact]` blocks se behtar. `[MemberData]` / `[ClassData]` tab jab test data complex object ho ya reuse karna ho.",
    followUp: "`[InlineData]` me ek object (jaise `CreateEmployeeRequest`) pass karna ho to kaunsa attribute?",
  },
  {
    id: "unittest-4",
    question:
      "Ye Moq snippet dekho — test pass hoga ya fail, aur kyun?\n```csharp\nvar repo = new Mock<IEmployeeRepository>();\nrepo.Setup(r => r.GetByIdAsync(7)).ReturnsAsync(new Employee { Id = 7, IsActive = true });\nvar sut = new EmployeeService(repo.Object, panMock.Object);\nawait sut.DeactivateAsync(7);\nrepo.Verify(r => r.SaveChangesAsync(), Times.Once);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Pass hoga agar `DeactivateAsync` employee load karke `IsActive = false` set karke `SaveChangesAsync` ek baar call karti hai. Verify exactly wahi behaviour assert kar raha hai.",
    detailedAnswer:
      "`GetByIdAsync(7)` mocked hai to SUT ko ek tracked-jaisa employee object milega jiska `IsActive` true hai. `DeactivateAsync` ko us object par flag false karke `SaveChangesAsync` call karna chahiye. `Verify(..., Times.Once)` yeh confirm karta hai ki save theek ek baar hua — na zero (rule chhoot gaya), na do baar. Agar service ne pehle `if (!employee.IsActive) return;` guard laga rakha hai aur ham `IsActive = true` de rahe hain to guard pass hoga aur save hoga. Behtar test me ek assert aur hota: `employee.IsActive.Should().BeFalse()` — kyunki ham setup me diya gaya same reference baad me inspect kar sakte hain.",
    followUp: "Agar `DeactivateAsync` id 7 par employee na mile (`null`) to test kaise likhoge?",
    redFlag:
      "`Times.Once` ki jagah `Times.AtLeastOnce` daal dena jab exact count matter karta ho — double-save bug chhoot jaayega.",
  },
  {
    id: "unittest-5",
    question: "Mock, stub, aur fake me farak batao.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Stub sirf canned data deta hai (`GetById` par ek object). Mock interactions record karta hai aur unpe assert kiya jaata hai (`Verify` ki `AddAsync` call hui/nahi). Fake ek chhoti working implementation hai (in-memory list-backed repository).",
    detailedAnswer:
      "Teeno test doubles hain. Stub: state provide karta hai, verify nahi hota — `_repo.Setup(r => r.EmailExistsAsync(x)).ReturnsAsync(false)` jab bas flow aage badhana ho. Mock: behaviour verification ke liye — `_repo.Verify(r => r.AddAsync(...), Times.Never)`; test tab fail hota hai jab interaction galat ho. Fake: real logic wali lightweight cheez — ek `InMemoryEmployeeRepository` jo `Dictionary<int, Employee>` par kaam karti hai, integration-ish tests me useful. Moq ek hi object se stub aur mock dono roles deta hai. Practical tip: interaction se zyada state assert karo — over-verification test ko implementation se chipka deta hai.",
    followUp: "Over-mocking ka nuksan kya hai — har internal call `Verify` karne se kya hota hai?",
    redFlag: "Teeno ko ek hi cheez bolna ya 'mock matlab koi bhi nakli object' par ruk jaana.",
  },
  {
    id: "unittest-6",
    question:
      "Team ne code coverage target 90% rakha. Iske kya side-effects ho sakte hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Coverage guide hai, target nahi. KPI banane par log assertion-less filler tests likhne lagte hain — method call karo, exception mat aane do, coverage badh gaya, regression detection zero.",
    detailedAnswer:
      "Coverage % ek acha negative signal hai — 'yeh poora module untested hai' dikhata hai. Par target banate hi incentive ulta ho jaata hai: developers trivial getters, DTO mapping, aur `Program.cs` wiring ke tests likhte hain sirf number ke liye. 85% coverage with no meaningful asserts, 70% focused behaviour-driven tests se kahin kamzor hai. Behtar approach: logic-heavy layers (services, validators, calculators) par 70-80% behaviour coverage, aur coverage drop ko review me discuss karo, gate mat banao. Test pyramid bhi yaad rakho — roughly 70% unit, 20% integration, 10% end-to-end.",
    followUp: "Kaunse code ke liye low coverage bilkul acceptable hai?",
    redFlag: "'100% coverage matlab bug-free code' — coverage sirf execution measure karta hai, correctness nahi.",
  },
  {
    id: "unittest-7",
    question:
      "Ek bug production me aaya: active employees delete ho rahe the kyunki `if (employee.IsActive) throw` guard galti se hat gaya tha. TDD-style is bug ko kaise handle karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Pehle ek failing test likho jo bug reproduce kare — `DeleteAsync_ActiveEmployee_ThrowsInvalidOperation` — dekho wo red hai, phir guard wapas daal kar green karo. Test permanent regression guard ban jaata hai.",
    detailedAnswer:
      "Regression workflow: (1) bug ko ek test me capture karo — `_repo.Setup(r => r.GetByIdAsync(7)).ReturnsAsync(new Employee { Id = 7, IsActive = true })`, `Func<Task> act = () => sut.DeleteAsync(7)`, `await act.Should().ThrowAsync<InvalidOperationException>()` aur `_repo.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never)`. (2) Run karo — red, bug confirmed. (3) Fix karo (guard wapas). (4) Green. Ab yeh test CI me hamesha ke liye pehra dega. Post-mortem me har business rule ke liye ek named test mandate karna acha practice hai — is se rule-regressions production tak pahunchna band ho jaate hain. Yeh bhi sochne layak: guard service me hi rehna chahiye tha, use 'performance ke liye' repository me shift karna hi galti thi.",
    followUp: "Yeh guard service layer me hona chahiye ya domain entity ke andar? Kyun?",
  },
];

export default questions;
