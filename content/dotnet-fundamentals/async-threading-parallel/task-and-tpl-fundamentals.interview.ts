import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "task-tpl-tr-1",
    question: "Task kya hai, aur ye Thread se kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer:
      "Task ek asynchronous operation ka abstraction hai — result/completion represent karta hai, thread ek implementation detail hai, guarantee nahi.",
    detailedAnswer:
      "Task ek asynchronous operation ko represent karta hai — kaam jo chal raha hai ya chalega, aur uska eventual outcome. CPU-bound `Task.Run` ke liye ek ThreadPool thread us kaam ki poori duration ke liye associated rehta hai. Lekin I/O-bound async operations (jaise `HttpClient.GetAsync`) ke liye, jab operation 'in flight' hai, koi thread occupy nahi hota — OS-level async I/O mechanism use hota hai. Isliye 'Task = thread' ek approximation hai jo I/O-bound work ke liye break ho jaati hai.",
    followUp: "Agar I/O ke dauraan koi thread occupy nahi hota, to jab I/O complete ho, continuation kis thread par chalega?",
  },
  {
    id: "task-tpl-tr-2",
    question: "I/O-bound async operation ke 'in-flight' hone ke dauraan kitne threads occupied hote hain, aur ye CPU-bound `Task.Run` se kaise alag hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Zero threads I/O ke dauraan; CPU-bound Task.Run me ek thread poori duration occupy karta hai.",
    detailedAnswer:
      "I/O-bound operations (network call, file read, database query) OS-level asynchronous I/O completion mechanism use karte hain — request bhejne ke baad, response ka wait karne ke dauraan koi thread busy nahi baitha rehta, na calling thread na koi pool thread. Jab response ready hota hai, OS ek completion notification deta hai, tab ek thread (pool se) continuation chalata hai. CPU-bound `Task.Run` isse bilkul alag hai — wahan genuinely CPU cycles consume ho rahe hain, isliye ek thread poori duration associated rehta hai. Ye distinction samajhna is module ka core theme hai.",
  },
  {
    id: "task-tpl-tr-3",
    question: "`.Result` ya `.Wait()` use karna kab problematic ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ye blocking calls hain — calling thread ko freeze karte hain, aur synchronization-context-having environments me deadlock bhi de sakte hain.",
    detailedAnswer:
      "`.Result`/`.Wait()` synchronously wait karte hain — calling thread tab tak block rehta hai jab tak Task complete na ho. High-concurrency scenarios me (jaise ek web API), ye ThreadPool threads ko unnecessarily busy rakhta hai jo doosri requests serve kar sakte the, throughput girata hai. Classic ASP.NET ya UI apps (WPF/WinForms) jaise synchronization-context-having environments me, ye ek classic deadlock pattern bhi bana sakta hai — is module ke ek alag topic me detail me cover hota hai.",
    followUp: "Deadlock exactly kaise hota hai is scenario me?",
  },
  {
    id: "task-tpl-tr-4",
    question: "Ye code kya print karega, aur kya isme koi problem hai?\n```csharp\nTask<int> t = Task.Run(() => 42);\nint value = t.Result;\nConsole.WriteLine(value);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "42 print karega — lekin `.Result` blocking hai, production async code path me avoid karna chahiye.",
    detailedAnswer:
      "Functionally ye code `42` print karega, kyunki `Task.Run` complete ho jaata hai aur `.Result` uska value return karta hai. Lekin `.Result` calling thread ko synchronously block karta hai jab tak Task complete na ho — ek console app me ye largely harmless hai, lekin ek async method ke andar ya high-concurrency server code me isi pattern se problems (thread starvation, potential deadlock) ban sakti hain. Better practice: `await t` use karna jahan possible ho.",
  },
  {
    id: "task-tpl-tr-5",
    question: "TPL sirf Task class hai — ye statement kitna sahi hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — TPL ek broader ecosystem hai: Task, Task.WhenAll/WhenAny, Parallel.For/ForEach, aur PLINQ sab iska hissa hain.",
    detailedAnswer:
      "Task Parallel Library (.NET 4.0) sirf `Task`/`Task<T>` tak limited nahi hai. Isme coordination APIs (`Task.WhenAll`, `Task.WhenAny` — ek alag topic), data-parallelism APIs (`Parallel.For`, `Parallel.ForEach` — is module ke baad ke topics), aur PLINQ (parallel LINQ queries) bhi shamil hain. Sabka common goal high-level, thread-management-se-abstracted concurrent/parallel programming APIs dena hai.",
    redFlag: "TPL ko 'bas Task.Run wali library' bolna — scope ki incomplete samajh dikhata hai.",
  },
  {
    id: "task-tpl-tr-6",
    question: "Ek scenario: tumhe ek simple external API call karni hai aur uska result use karna hai. Kya tum is call ko `Task.Run(() => httpClient.GetStringAsync(url))` me wrap karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Nahi — `GetStringAsync` already I/O-bound async hai, `Task.Run` me wrap karna unnecessary hai, ek extra ThreadPool thread waste karta hai.",
    detailedAnswer:
      "`HttpClient.GetStringAsync` internally already non-blocking, I/O-bound async I/O use karta hai — direct `await httpClient.GetStringAsync(url)` kaafi hai. `Task.Run` me wrap karna ek ThreadPool thread ko sirf is call ke andar wait karne ke liye occupy karega, jabki wo thread already un-occupied reh sakta tha (kyunki `GetStringAsync` khud wait ke dauraan koi thread occupy nahi karta). Ye module ka last, synthesis topic (CPU-bound vs I/O-bound decisions) isi principle ko detail me cover karta hai.",
    followUp: "To Task.Run kab genuinely zaroori hai?",
  },
  {
    id: "task-tpl-tr-7",
    question: "Task ke kaunse states hote hain, aur `RanToCompletion` vs `Faulted` me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Created, Running, RanToCompletion, Faulted, Canceled — RanToCompletion successful completion hai, Faulted ek unhandled exception ke saath complete hua.",
    detailedAnswer:
      "Ek Task apni lifetime me `Created` se shuru hokar `Running` se guzarta hai, aur final state `RanToCompletion` (successfully complete, result available agar `Task<T>` hai), `Faulted` (ek exception ke saath complete hua — exception `Task.Exception` property me accessible), ya `Canceled` (cancellation requested aur honored — cancellation-related topics is module me aage cover hote hain) me se koi ek hoti hai.",
  },
  {
    id: "task-tpl-tr-8",
    question: "`Task.FromResult(42)` aur `Task.Run(() => 42)` dono ek `Task<int>` return karte hain jiska result `42` hai. Kya dono equivalent hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `Task.FromResult` koi actual async work nahi karta, immediately ek completed Task banata hai; `Task.Run` ThreadPool par kaam schedule karta hai.",
    detailedAnswer:
      "`Task.FromResult(42)` sirf ek already-complete `Task<int>` wrap karta hai around an existing value — koi ThreadPool thread involve nahi hota, koi asynchronous kaam nahi hota. `Task.Run(() => 42)` ThreadPool ko ek work item schedule karta hai, jo ek pooled thread par execute hota hai (chahe kaam trivial ho) aur phir complete hota hai. Behavior-wise end result same dikh sakta hai chhote example me, lekin cost aur intent bilkul alag hai — agla topic (`Task.Run` vs `Task.FromResult`) isi difference ko detail me explain karta hai.",
  },
];

export default questions;
