import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "task-vs-thread-tr-1",
    question: "Task aur Thread me kya fundamental fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer: "Thread ek low-level OS construct hai; Task ek higher-level abstraction hai jo thread se decoupled hota hai.",
    detailedAnswer:
      "`Thread` directly OS-level construct hai — apna stack, OS scheduler dwara manage. `Task` (TPL) ek higher-level abstraction hai jo 'kaam' represent karta hai — CPU-bound `Task.Run` ke liye ek ThreadPool thread us kaam ki duration ke liye associated rehta hai, lekin I/O-bound async work ke liye wait ke dauraan koi thread bilkul occupy nahi hota. Task built-in result handling (`Task<T>`), automatic exception propagation, aur easy composability (`WhenAll`/`WhenAny`, chaining) bhi deta hai jo raw `Thread` manually implement karna padta.",
    followUp: "Task.Run internally kya karta hai jab tum ise call karte ho?",
  },
  {
    id: "task-vs-thread-tr-2",
    question: "`Task.Run` aur `Task.FromResult` me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Task.Run ThreadPool par genuine kaam schedule karta hai; Task.FromResult ek already-known value ko bina kisi kaam ke already-completed Task me wrap karta hai.",
    detailedAnswer:
      "`Task.Run(() => Work())` ThreadPool ko ek work item schedule karta hai — ek pooled thread genuinely us lambda ko execute karta hai. `Task.FromResult(value)` koi ThreadPool involvement nahi karta — value already available hai, isliye ek already-completed `Task<T>` synchronously return ho jaata hai. `Task.FromResult` tab use hota hai jab ek async-signature method (jaise ek interface implementation) synchronously-available data return kar raha ho — mock implementations, cache hits.",
  },
  {
    id: "task-vs-thread-tr-3",
    question: "Ye code kis se better hai aur kyun?\n```csharp\n// Option A\npublic Task<int> GetCachedValue() => Task.Run(() => _cache[\"key\"]);\n\n// Option B\npublic Task<int> GetCachedValue() => Task.FromResult(_cache[\"key\"]);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Option B better hai — `_cache[\"key\"]` ek instant, synchronous lookup hai, `Task.Run` (Option A) unnecessarily ek ThreadPool thread schedule karta hai is trivial kaam ke liye.",
    detailedAnswer:
      "In-memory dictionary lookup me koi genuine async work involve nahi hota — result turant available hai. Option A me `Task.Run` ek pooled thread lega, lambda execute karega, result wapas dega — ye poora round-trip pure overhead hai kyunki kaam khud instant hai. Option B same result zero ThreadPool round-trip ke saath deta hai, `Task.FromResult` ke through — ye is scenario me correct choice hai.",
  },
  {
    id: "task-vs-thread-tr-4",
    question: "Kya Task.FromResult ek genuine I/O-bound operation (jaise ek database call) ke liye appropriate hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — Task.FromResult sirf tab use hota hai jab value already, synchronously known ho. Genuine I/O-bound kaam ke liye uska apna native async method use karo.",
    detailedAnswer:
      "`Task.FromResult` koi actual async operation perform nahi karta — sirf ek already-known value ko wrap karta hai. Agar tumhe genuinely database se data fetch karna hai (jo time leta hai, I/O involve karta hai), `Task.FromResult` yahan galat hoga — result abhi available hi nahi hai, isliye tumhe database driver ka native async method (jaise `ExecuteReaderAsync`) use karna chahiye, jo actually asynchronously wait karta hai bina thread occupy kiye.",
    redFlag: "Genuine I/O ke liye Task.FromResult suggest karna dikhata hai ki candidate 'Task.FromResult = generic async wrapper' samajh raha hai, jabki ye sirf already-known values ke liye hai.",
  },
  {
    id: "task-vs-thread-tr-5",
    question: "Ek scenario: tumhe ek `IUserRepository` interface ka in-memory (testing ke liye) implementation likhna hai, jiska method signature `Task<User> GetByIdAsync(int id)` hai. Data already ek in-memory `List<User>` me hai. Kaise implement karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Task.FromResult use karke — data already synchronously available hai, koi genuine async kaam nahi karna.",
    detailedAnswer:
      "```csharp\npublic Task<User> GetByIdAsync(int id)\n{\n    var user = _users.FirstOrDefault(u => u.Id == id);\n    return Task.FromResult(user);\n}\n```\nInterface `Task<User>` maangta hai (kyunki production implementation database se async fetch karega), lekin is in-memory test-double me data already available hai — `Task.FromResult` ye interface satisfy karta hai bina kisi unnecessary ThreadPool involvement ke. `Task.Run` yahan galat choice hoga.",
  },
  {
    id: "task-vs-thread-tr-6",
    question: "Task ka result handling (exceptions, chaining) Thread ke comparison me kaise better hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Task exceptions ko automatically Task object me capture karta hai aur await/continuation ke through propagate karta hai; Thread me ye manually handle karna padta hai.",
    detailedAnswer:
      "Ek raw `Thread` me agar delegate ke andar exception aaye, aur wo unhandled ho, poora process crash ho sakta hai (ya silently swallow ho sakta hai depending on setup) — manually try-catch aur cross-thread communication (event, shared variable) setup karna padta hai result/error dono ke liye. `Task` ye sab built-in deta hai — exception `Task.Exception` me capture hota hai, `await` karne par automatically re-throw hota hai caller ke context me, aur `Task<T>` result bhi seedha `.Result`/`await` se milta hai bina manual synchronization ke.",
  },
  {
    id: "task-vs-thread-tr-7",
    question: "Kya `Task.Run` hamesha behtar hai `new Thread()` se?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Almost hamesha for short-lived, poolable work — lekin genuinely dedicated, long-running thread ke rare use case me raw Thread abhi bhi appropriate ho sakta hai.",
    detailedAnswer:
      "Zyadatar modern scenarios me `Task.Run` (ThreadPool-backed) better hai — reuse, composability, built-in result/exception handling. Lekin ek rare case: agar tumhe genuinely ek dedicated thread chahiye poori app lifetime ke liye (jise tum background priority set karna chahte ho, ya jisse pool ke reuse-and-return model se bahar rakhna chahte ho), raw `Thread` fit ho sakta hai — is case me ThreadPool se ek thread 'permanently occupy' karna baaki pool ko starve kar sakta hai. Practically ye scenario rare hai, kyunki `IHostedService`/`BackgroundService` (ASP.NET Core) is need ko cleanly ThreadPool ke upar hi solve kar deta hai.",
  },
  {
    id: "task-vs-thread-tr-8",
    question: "Ye code kya karega, aur kya isme koi problem hai?\n```csharp\npublic Task<int> ComputeSquareAsync(int n) => Task.Run(() => n * n);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Ek square value return karega, lekin `n * n` itna trivial hai ki ThreadPool round-trip (Task.Run) ka overhead result ki actual computation cost se kai guna zyada hai — Task.FromResult(n * n) yahan better hota.",
    detailedAnswer:
      "`n * n` ek microsecond se bhi kam CPU time leta hai — genuinely 'offload karne layak' CPU-bound work nahi hai. `Task.Run` yahan poora ThreadPool scheduling overhead (queue karna, ek thread assign karna, execute karke result wapas lana) laata hai, jo khud us trivial computation se zyada expensive hai. Behtar approach: `Task.FromResult(n * n)` — turant, zero-allocation-relative-overhead result, kyunki koi genuine async ya heavy CPU work hai hi nahi jise offload karna zaroori ho.",
  },
];

export default questions;
