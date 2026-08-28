import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "unit-testing-the-service-layer-1",
    question:
      "xUnit har `[Fact]` test method ke liye test class ka kya karta hai, aur isse kya guarantee milti hai?",
    options: [
      "Poori test class ke liye ek hi instance banata hai — isliye fields shared state ki tarah kaam karte hain",
      "Har test method ke liye test class ka naya instance banata hai — constructor per-test setup ban jaata hai, ek test ka setup doosre me leak nahi hota",
      "Class ko `static` treat karta hai — koi instance nahi banta",
      "Instance sirf tab banata hai jab test me `IClassFixture` use ho",
    ],
    correctIndex: 1,
    explanation:
      "xUnit har test method se pehle test class ka fresh instance banata hai, isliye field initializers aur constructor ka code har test ke liye dobara chalta hai — yeh xUnit ki test-isolation guarantee hai. Ek test me kiya gaya mock setup doosre test me carry nahi hota. Ek shared instance (NUnit/MSTest ka purana default jaisa) hone par tests ek doosre ko pollute karte. `IClassFixture` deliberately mehnga shared context (jaise ek DB) share karne ke liye hota hai, default nahi.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-the-service-layer-2",
    question:
      "`Mock<IEmployeeRepository>` par `GetByIdAsync` ka return type `Task<Employee?>` hai. Setup me `.Returns(...)` bhool kar sirf `_repo.Object` use kar liya (koi setup nahi). SUT `await _repo.GetByIdAsync(7)` karta hai. Kya hota hai aur sahi tareeka kya hai?",
    options: [
      "Compile error aata hai kyunki mock ko har method ka setup chahiye",
      "Moq default `Task<Employee?>` return karta hai jo `null` complete hota hai — `await` par koi crash nahi, employee `null` milta hai; par agar observable behaviour chahiye to `.Setup(r => r.GetByIdAsync(7)).ReturnsAsync(employee)` likho",
      "`await` par hamesha `NullReferenceException` aata hai kyunki mock `null` Task deta hai",
      "Test infinite loop me chala jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Default `MockBehavior.Loose` me Moq un-setup async methods ke liye ek non-null completed `Task` return karta hai jiska result type ka default hota hai (`Employee?` ke liye `null`). To `await` crash nahi karta, par SUT ko `null` employee milega — jo aksar test ka intent nahi hota. Isliye har scenario ke liye `.Setup(...).ReturnsAsync(...)` chahiye. `NullReferenceException` tab aata jab pre-Moq-4.x style me raw `null` `Task` return hota — modern Moq me nahi. `MockBehavior.Strict` me un-setup call exception deta hai, par wo default nahi.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-the-service-layer-3",
    question:
      "`CreateAsync_DuplicateEmail_ThrowsValidationException` test me exception assert karne ke baad `_repo.Verify(r => r.AddAsync(It.IsAny<Employee>()), Times.Never)` bhi likha hai. Yeh line kya check kar rahi hai?",
    options: [
      "Ki `AddAsync` method exist karta hai interface par",
      "Behaviour verification — jab email duplicate tha, SUT ne DB me kuch persist karne ki koshish hi nahi ki (side-effect nahi hua)",
      "Ki `AddAsync` exactly ek baar call hua",
      "Ki mock ka `AddAsync` `null` return karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`Verify(..., Times.Never)` interaction/behaviour verification hai: sirf return/exception assert karna kaafi nahi — yeh confirm karta hai ki guard fail hone par koi galat side-effect (DB write) trigger nahi hua. `Times.Never` / `Times.Once` / `Times.Exactly(n)` / `Times.AtLeastOnce` sab available hain. Method ka exist karna compile-time par hi guaranteed hai. `Times.Once` chahiye to alag call likhna padta. Return value setup `.ReturnsAsync` se hota hai, `Verify` se nahi.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-the-service-layer-4",
    question:
      "In me se kaunsa cheez service-layer unit test me test karni chahiye, aur kaunsi NAHI?",
    options: [
      "Test karo: EF Core ka LINQ-to-SQL translation, in-memory provider ke saath — kyunki wo fast hai",
      "Test karo: `[ApiController]` model binding 400 deta hai galat body par",
      "Test karo: `EmployeeService` ke business rules (duplicate email reject, invalid PAN reject, delete-active guard) mocked dependencies ke saath; NAHI: EF/LINQ SQL translation aur framework behaviour",
      "Test karo: har auto-property ka get/set sahi value rakhta hai",
    ],
    correctIndex: 2,
    explanation:
      "Unit test wahan lagta hai jahan tumhaari apni decision logic hai — validation rules, guards, calculations, state transitions. EF Core ka SQL translation integration test ka kaam hai; in-memory provider case-sensitivity, transactions aur kai LINQ translations alag handle karta hai, isliye uspe unit test false confidence deta hai. Framework code (`[ApiController]` binding, `[Authorize]` 401) Microsoft test kar chuka hai. Trivial getters/setters test karna time waste hai.",
    difficulty: "hard",
  },
];

export default quiz;
