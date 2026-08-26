import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "iasyncenumerable-tr-1",
    question: "`IAsyncEnumerable<T>` kya hai, aur ye `Task<List<T>>` return karne se kaise better hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS"],
    shortAnswer:
      "Async streaming sequence hai — items ek-ek karke, aate hi consume kiye ja sakte hain, poore set ke materialize hone ka wait nahi karna padta.",
    detailedAnswer:
      "`Task<List<T>>` poora result set memory me build hone tak wait karta hai, phir ek saath deta hai. `IAsyncEnumerable<T>` ke saath `await foreach` use karke caller items ko produce hote hi process kar sakta hai — memory footprint chhota rehta hai (poora set kabhi ek saath memory me nahi hota), aur agar caller beech me ruk jaaye, baaki data fetch hi nahi hota. Ye especially pagination-heavy APIs, DB cursors, aur event streams ke liye valuable hai.",
    followUp: "Ise implement karne ke liye kya syntax use karoge?",
  },
  {
    id: "iasyncenumerable-tr-2",
    question: "Ek async-iterator method kaise likhoge jo `IAsyncEnumerable<T>` return kare?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`async` method jo `IAsyncEnumerable<T>` return kare, andar `await` aur `yield return`/`yield break` combine karke.",
    detailedAnswer:
      "```csharp\npublic async IAsyncEnumerable<int> GenerateAsync()\n{\n    for (int i = 0; i < 5; i++)\n    {\n        await Task.Delay(100); // simulate async work\n        yield return i;\n    }\n}\n```\nCompiler `async` aur `yield` dono ko combine karke ek async iterator state machine generate karta hai. Consumer side pe `await foreach (var i in GenerateAsync())` se ise consume kiya jaata hai — har `yield return` ke beech genuinely `await` ho sakta hai.",
  },
  {
    id: "iasyncenumerable-tr-3",
    question: "`[EnumeratorCancellation]` attribute ka role kya hai, aur agar ise miss kar diya jaaye to kya practical impact hota hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Consumer ka WithCancellation token method parameter tak properly route nahi hoga — cancellation silently kaam nahi karega us path se.",
    detailedAnswer:
      "Jab consumer `await foreach (var x in Source().WithCancellation(ct))` likhta hai, ye token `IAsyncEnumerable<T>.GetAsyncEnumerator(CancellationToken)` ke through pass hota hai. Method ke andar wale `CancellationToken` parameter ko `[EnumeratorCancellation]` se mark karna zaroori hai taaki compiler is externally-supplied token ko us parameter se link kare. Bina is attribute ke, method apna default/independently-passed token use karega, aur `WithCancellation` se diya gaya token silently effect nahi karega — ek subtle, easy-to-miss bug.",
    followUp: "Aisi bug ko test me kaise catch karoge?",
  },
  {
    id: "iasyncenumerable-tr-4",
    question: "EF Core me `IQueryable<T>` ko `.AsAsyncEnumerable()` se consume karna, `.ToListAsync()` se kaise alag behave karta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`.AsAsyncEnumerable()` results ko database se aate hi stream karta hai; `.ToListAsync()` poora result set pehle memory me materialize karta hai.",
    detailedAnswer:
      "`.ToListAsync()` query execute karta hai aur poore rows ko fetch karke ek `List<T>` bana kar return karta hai — caller ko iske complete hone tak wait karna padta hai, aur poora set memory me hota hai. `.AsAsyncEnumerable()` ke saath `await foreach` use karne par, database se rows aate hi ek-ek karke consume kiye ja sakte hain — bade result sets ke liye memory footprint kam rehta hai aur processing early shuru ho sakti hai.",
  },
  {
    id: "iasyncenumerable-tr-5",
    question: "Ek chhoti, already in-memory `List<int>` (10 items) ko `IAsyncEnumerable<int>` me convert karke `await foreach` se consume karna — ye reasonable design choice hai ya not?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Generally not reasonable — koi genuine async work nahi ho raha, plain `foreach`/`IEnumerable<int>` kaafi hai, extra complexity bina fayde ke.",
    detailedAnswer:
      "`IAsyncEnumerable<T>` ka poora fayda tab milta hai jab underlying source genuinely incremental/async ho (network, DB cursor, IO). Ek already-materialized, chhoti in-memory list ke liye ise `IAsyncEnumerable<T>` banana sirf overhead add karta hai — extra state machine, `await foreach`'s per-iteration overhead — bina kisi real benefit ke, kyunki data already fully available hai. Isse batchna interview me candidate ki 'right tool for the job' judgment dikhata hai.",
    redFlag: "Har collection ko 'future-proofing' ke naam pe `IAsyncEnumerable<T>` banana, chahe genuine async source ho ya na ho.",
  },
  {
    id: "iasyncenumerable-tr-6",
    question: "Ek controller action `IAsyncEnumerable<T>` return karta hai. ASP.NET Core is response ko client tak kaise deliver karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "System.Text.Json ka native support use karke, ASP.NET Core response ko streaming JSON array ke roop me bhej sakta hai — poora set memory me materialize kiye bina.",
    detailedAnswer:
      "ASP.NET Core (with `System.Text.Json`) `IAsyncEnumerable<T>` ko controller action se return karne par ise automatically ek streaming JSON array response me serialize kar sakta hai — items server se generate hote hi client tak stream hote hain, bina poore response ko pehle ek buffer me materialize kiye. Ye bade result sets ke liye server-side memory aur time-to-first-byte dono improve karta hai.",
  },
  {
    id: "iasyncenumerable-tr-7",
    question: "`await foreach` internally kya call karta hai har iteration pe, aur regular `foreach` se ye kaise differ karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`await foreach` internally `await MoveNextAsync()` call karta hai; regular `foreach` synchronous `MoveNext()` call karta hai.",
    detailedAnswer:
      "Regular `foreach` `IEnumerator<T>.MoveNext()` (synchronous, `bool` return) call karta hai. `await foreach` `IAsyncEnumerator<T>.MoveNextAsync()` (`ValueTask<bool>` return) call karta hai aur usko `await` karta hai — isliye har iteration genuinely async ho sakta hai, thread ko block kiye bina. Ye syntactic sugar hai jo async iteration ko utni hi simple, readable syntax deta hai jitni synchronous iteration hoti hai.",
  },
  {
    id: "iasyncenumerable-tr-8",
    question: "Ek log-streaming feature banani hai jahan naye log entries real-time aate rahenge aur consumer unhe process karta rahega jab tak wo explicitly stop na kare. `IAsyncEnumerable<T>` yahan kaise fit hota hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ek natural fit hai — producer naye entries aane par `yield return` karta rahega, consumer `await foreach` se unhe process karta rahega, `CancellationToken` se gracefully stop kar sakta hai.",
    detailedAnswer:
      "`IAsyncEnumerable<T>` unbounded ya long-running sequences ke liye bhi kaam karta hai — producer method ek internal loop me naye log entries ka wait karega (jaise ek channel/queue se) aur jab bhi ek entry available ho, `yield return` karega. Consumer `await foreach` se continuously process karega jab tak `CancellationToken` cancel na ho jaaye (jo loop ke andar `ThrowIfCancellationRequested()` se check ho). Ye pattern `System.Threading.Channels` ke saath commonly combine hota hai producer-consumer scenarios ke liye.",
  },
];

export default questions;
