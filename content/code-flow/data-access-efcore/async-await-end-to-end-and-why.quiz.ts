import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-1",
    question: "Web API me `await _db.Employees.ToListAsync()` ka main fayda kya hai `_db.Employees.ToList()` ke muqable?",
    options: [
      "Query database pe tez chalti hai",
      "DB wait ke dauraan thread wapas thread pool me chala jaata hai, jisse zyada concurrent requests same threads pe serve hoti hain",
      "Result automatically cache ho jaata hai",
      "SQL query chhoti ban jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Async ek single request ko tez nahi karta — query utna hi time leti hai. Fayda scalability ka hai: `await` par thread block hone ke bajaye pool me wapas jaata hai aur doosri request serve karta hai, jisse thread-pool starvation nahi hota. Option A galat — SQL same hai. Option C/D bhi galat — na caching hoti hai na SQL badalti hai.",
    difficulty: "medium",
  },
  {
    id: "async-2",
    question: "In me se kaunsa 'cardinal sin' hai jo request path me thread block karta hai aur deadlock la sakta hai?",
    options: [
      "await _service.GetAsync(ct)",
      "_service.GetAsync(ct).Result",
      "return _repo.GetAsync(ct)  // async/await ke bina forward",
      "async Task<ActionResult> Get()",
    ],
    correctIndex: 1,
    explanation:
      "`.Result` (aur `.Wait()`, `.GetAwaiter().GetResult()`) async Task ko synchronously block karke result nikaalte hain — wo thread block ho jaata hai jabki pura point use free karna tha, aur kuch scenarios me deadlock. Option A sahi async pattern hai. Option C valid optimisation hai jab method sirf Task forward kar raha ho. Option D normal async controller signature hai.",
    difficulty: "medium",
  },
  {
    id: "async-3",
    question: "`async void SendEmail()` (event handler nahi) likhne ka sabse bada khatra kya hai?",
    options: [
      "Compile nahi hoga",
      "Method me exception aaye to caller ka try/catch use nahi pakadta aur wo process crash kar sakta hai",
      "Method hamesha null return karega",
      "Ye baaki async methods se 2x slow chalega",
    ],
    correctIndex: 1,
    explanation:
      "`async void` ka koi `Task` nahi hota jise await ya observe kiya ja sake — usme utha exception synchronization context pe re-throw hota hai, caller ke `try/catch` ke bahar, aur process crash kar sakta hai. Compile ho jaata hai (option A galat). Return type void hai, null ka sawaal hi nahi (option C galat). Speed ka issue nahi hai (option D galat) — safety ka hai. Hamesha `async Task`.",
    difficulty: "hard",
  },
  {
    id: "async-4",
    question: "ASP.NET Core application code (controller/service/repository) me `ConfigureAwait(false)` lagane ka kya asar hota hai?",
    options: [
      "Practically koi asar nahi — ASP.NET Core me SynchronizationContext hai hi nahi",
      "Query 30% tez ho jaati hai",
      "CancellationToken automatically flow karne lagta hai",
      "Deadlock guaranteed rok deta hai jo bina iske hamesha hota",
    ],
    correctIndex: 0,
    explanation:
      "Pre-Core ASP.NET me ek SynchronizationContext continuation ko original request thread pe force karta tha; `ConfigureAwait(false)` usse bachata tha. ASP.NET Core me wo context hai hi nahi — continuation kisi bhi pool thread pe chalta hai — to app code me `ConfigureAwait(false)` ka koi practical farak nahi. Reusable library code me convention ke taur pe abhi bhi likhte hain. Options B/C/D galat claims hain.",
    difficulty: "hard",
  },
];

export default quiz;
