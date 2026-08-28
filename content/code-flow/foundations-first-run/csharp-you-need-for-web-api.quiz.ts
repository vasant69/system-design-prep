import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "csharp-web-api-1",
    question:
      "Hamare project me `Employee` ek `class` hai lekin `EmployeeSummary` ek `record`. Iski sabse sahi wajah kya hai?",
    options: [
      "record classes se tez chalte hain, isliye response ke liye record",
      "Employee mutable entity hai jise hum update karenge; EmployeeSummary immutable DTO hai jo banne ke baad badalta nahi",
      "record me properties nahi ho saktin, isliye sirf DTO ke liye",
      "class aur record bilkul same hain, ye sirf naming convention hai",
    ],
    correctIndex: 1,
    explanation:
      "record immutable data (DTO, request/response shape) ke liye ideal hai kyunki value equality aur short syntax deta hai. Employee ko hum track aur update karenge, isliye woh normal class. Option A galat hai — speed decision factor nahi. Option C galat hai — record me positional aur normal properties dono ho sakti hain. Option D galat hai — record value equality, with-expression aur immutability defaults me class se alag hai.",
    difficulty: "medium",
  },
  {
    id: "csharp-web-api-2",
    question: "`var employees = new List<Employee>();` ke baare me kaunsa statement sahi hai?",
    options: [
      "employees ka type runtime tak decide nahi hota, dynamic hai",
      "var static typing todta hai, isliye employees me kuch bhi daala ja sakta hai",
      "Type compile time pe right-hand side se infer hota hai; ye bilkul `List<Employee> employees = new List<Employee>();` jaisa hai",
      "var sirf loop variables ke liye allowed hai",
    ],
    correctIndex: 2,
    explanation:
      "var static typing nahi todta — compiler right-hand side dekh ke type fix kar deta hai compile time pe, runtime pe koi farak nahi. Option A galat hai (woh `dynamic` keyword hota hai). Option B galat hai — employees strictly `List<Employee>` hi rahega. Option D galat hai — var kahin bhi local variable ke liye chalta hai jab type infer ho sake.",
    difficulty: "easy",
  },
  {
    id: "csharp-web-api-3",
    question:
      "`<Nullable>enable</Nullable>` on hai. `public string PanNumber { get; set; }` likha hai (bina `?`), aur kuch employees ka PAN set nahi hua. Kya hoga?",
    options: [
      "Compile error, project build hi nahi hoga",
      "Compiler warning milega; aur jinke PAN missing hain un rows pe `PanNumber` use karte hi runtime `NullReferenceException` aa sakta hai",
      "PanNumber automatically empty string ban jaayega",
      "Kuch nahi hoga, non-nullable string kabhi null ho hi nahi sakta",
    ],
    correctIndex: 1,
    explanation:
      "Nullable enable sirf compile-time hints deta hai — non-null property ko initialize na karne pe warning aati hai, error nahi. Runtime pe woh reference phir bhi null ho sakta hai, aur use karte hi `NullReferenceException` milega. Sahi fix: optional field ke liye `string?` aur use se pehle null check. Option A galat (warning hai, error nahi). Option C galat (auto-default nahi hota). Option D galat (compiler guarantee nahi deta, sirf warn karta hai).",
    difficulty: "hard",
  },
  {
    id: "csharp-web-api-4",
    question: "Is course me `interface` aur `async`/`Task` ke baare me abhi tumse kya expect kiya jaata hai?",
    options: [
      "Dono ko poori tarah implement karke har controller me use karna",
      "Sirf pehchanna: `I` se shuru hone wala naam = contract (deep module 3), `async Task<...>` + `await` = wait karne wala code (deep module 4)",
      "Dono ko abhi skip karna, ye Web API me kabhi nahi aate",
      "async ko ratna, interface ko chhod dena",
    ],
    correctIndex: 1,
    explanation:
      "Guide ke mutabik ye do features abhi sirf 'preview' hain — inhe pehchano taaki aage ka code magic na lage, deep dive baad ke modules me hai. Option A galat (abhi full use expected nahi). Option C galat (dono Web API me har jagah aate hain). Option D galat (dono ka ek-paragraph preview padhna hai, ratna nahi).",
    difficulty: "easy",
  },
];

export default quiz;
