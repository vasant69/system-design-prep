import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "async-await-mechanics-tr-1",
    question: "`await` hit hone par exactly kya hota hai internally?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon"],
    shortAnswer:
      "Compiler-generated state machine progress save karta hai, ek continuation register karta hai, aur agar operation turant complete nahi hui, control caller ko wapas return kar deta hai — thread block nahi hota.",
    detailedAnswer:
      "Compiler async method ko ek state machine (struct implementing `IAsyncStateMachine`) me rewrite karta hai. `await` tak ka code synchronously chalta hai. `await` point par, awaiter ka `IsCompleted` check hota hai — agar false, ek `state` field set hota hai (progress track karne ke liye), `AwaitOnCompleted` ke through ek continuation register hota hai awaited operation ke saath, aur method turant `return` kar deta hai — control caller ko wapas mil jaata hai, calling thread free ho jaata hai. Jab awaited operation complete hoti hai, koi bhi available thread `MoveNext()` ko dobara invoke karta hai, jahan se chhoda tha wahan se resume hota hai.",
    followUp: "Local variables ka is transformation me kya hota hai?",
  },
  {
    id: "async-await-mechanics-tr-2",
    question: "Ek async method ke local variables jo await ke across zinda rehte hain, unhe stack par kyun nahi rakha ja sakta?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Kyunki method 'pause' hokar baad me, potentially ek doosre thread par, resume hoga — stack sirf current call ki duration tak valid hota hai.",
    detailedAnswer:
      "Normal (synchronous) method call me, local variables stack frame par rehte hain jo method return hone tak zinda rehta hai. Async method ke case me, method beech me 'pause' ho sakta hai (`await` point par) aur baad me, possibly ek alag thread par, resume ho sakta hai — us waqt tak original stack frame already unwind ho chuka hoga. Isliye compiler in variables ko state machine (struct/class) ke fields banata hai, jo state machine instance ki lifetime tak zinda rehte hain, stack se independent.",
  },
  {
    id: "async-await-mechanics-tr-3",
    question: "Ye code kya karega?\n```csharp\nasync Task<int> DoWorkAsync()\n{\n    Console.WriteLine(\"A\");\n    int x = await Task.FromResult(5); // already-completed task\n    Console.WriteLine(\"B\");\n    return x;\n}\n```\nKya `await` yahan method ko genuinely pause karega?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Nahi — `Task.FromResult(5)` already complete hai, isliye `IsCompleted` true hoga aur execution 'A' se 'B' tak seedha synchronously chalega, koi pause nahi.",
    detailedAnswer:
      "`Task.FromResult(5)` ek already-completed Task return karta hai. State machine `await` par `awaiter.IsCompleted` check karta hai — chunki ye already true hai, `state` set karke return karne ki zaroorat nahi padti. Execution seedha aage badhta hai synchronously — 'A' phir 'B' print hoga bina kisi thread-switch ya control-return-to-caller ke. Ye ek common misconception ko highlight karta hai: har `await` genuinely 'pause aur resume' nahi karta, sirf tab jab awaited operation turant complete na ho.",
  },
  {
    id: "async-await-mechanics-tr-4",
    question: "Kya async/await automatically ek naya thread create karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — state machine sirf control-flow restructure karta hai, koi naya thread inherently create nahi hota.",
    detailedAnswer:
      "Ek common galat samajh hai ki `async` keyword dekhte hi ek naya thread ban jaata hai. Asal me `async`/`await` sirf ek compile-time control-flow transformation hai — state machine banata hai jo continuations manage karta hai. Thread involvement poori tarah depend karta hai ki AWAITED operation kaisa hai: agar wo I/O-bound hai (jaise `HttpClient.GetAsync`), koi extra thread involve nahi hota wait ke dauraan. Agar wo CPU-bound `Task.Run` hai, tab ek ThreadPool thread involve hota hai — lekin ye `Task.Run` ki wajah se hai, `async`/`await` ki wajah se nahi.",
    redFlag: "'async lagate hi thread ban jaata hai' bolna — state machine mechanism ki fundamental galat samajh dikhata hai.",
  },
  {
    id: "async-await-mechanics-tr-5",
    question: "State machine ka `MoveNext()` method kitni baar call hota hai ek typical single-await method ke liye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Do baar (agar operation turant complete nahi hui) — ek baar shuru me, ek baar resume ke liye. Ek baar agar turant complete ho gayi.",
    detailedAnswer:
      "Pehli call method ko shuru karti hai — `state == 0` se execute hokar `await` tak pahunchti hai. Agar awaited operation turant complete nahi hoti, `state = 1` set hokar return hota hai (pehli `MoveNext()` call yahan khatam). Jab operation complete hoti hai, registered continuation `MoveNext()` ko dobara call karta hai — is baar `state == 1` check hoke aage ka code (`await` ke baad wala) execute hota hai. Agar operation pehli baar hi turant complete ho jaaye, poora method ek hi `MoveNext()` call me complete ho jaata hai.",
  },
  {
    id: "async-await-mechanics-tr-6",
    question: "Ek scenario: ek async method me, `await` se pehle ek heavy, CPU-intensive loop likha gaya hai. Kya ye loop non-blocking hoga sirf isliye kyunki method `async` hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Nahi — `await` se pehle ka poora code synchronously calling thread par chalta hai, chahe method 'async' declared ho.",
    detailedAnswer:
      "`async` keyword method ko sirf await karne yogya banata hai aur compiler ko state-machine-generation trigger karta hai — ye khud kisi bhi code ko automatically background me nahi bhejta. `await` point tak ka poora code, chahe wo heavy CPU work ho, calling thread par synchronously hi chalega. Agar ye genuinely non-blocking hona chahiye, us heavy work ko explicitly `Task.Run(() => HeavyWork())` me wrap karna padega, taaki wo ThreadPool par offload ho.",
    followUp: "Is fix ke baad method ka behavior kaise badlega?",
  },
  {
    id: "async-await-mechanics-tr-7",
    question: "Jab ek awaited I/O operation complete hoti hai, continuation zaroori nahi ki wahi thread resume kare jisne method shuru kiya tha — ye kyun hota hai, aur iska practical implication kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Continuation kisi bhi available ThreadPool thread par resume ho sakta hai, kyunki I/O completion ek OS-level notification hai jise koi bhi free thread handle kar sakta hai — isliye thread-affinity-dependent code (jaise UI thread updates) careful handling maangta hai.",
    detailedAnswer:
      "State machine ka continuation registration thread-agnostic hai by default — jab I/O complete hota hai, ThreadPool me se koi bhi available thread us continuation ko chala sakta hai, zaroori nahi wahi thread ho jisne method call kiya tha. Ye ASP.NET Core jaise server environments me fine hai (koi specific thread affinity nahi chahiye). Lekin UI apps (WPF/WinForms) me jahan UI updates sirf UI thread se karne allowed hain, `SynchronizationContext` is continuation ko wapas UI thread par marshal karta hai by default — ye `ConfigureAwait` topic se connect hota hai.",
    followUp: "ConfigureAwait(false) is behavior ko kaise change karta hai?",
  },
  {
    id: "async-await-mechanics-tr-8",
    question: "Compiler-generated state machine hamesha ek class (heap-allocated) hoti hai — ye statement sahi hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — compiler jahan possible ho ek struct generate karta hai (performance ke liye), sirf specific conditions me class ban sakta hai.",
    detailedAnswer:
      "Performance optimization ke taur par, C# compiler async state machine ko often ek `struct` ke roop me generate karta hai jab possible ho, taaki unnecessary heap allocation avoid ho sake (especially jab method turant, synchronously complete ho jaaye — us case me state machine ki full heap allocation ki zaroorat hi nahi padti). Kuch scenarios me (jaise jab state machine ko interface reference ke through box karna pade) ye heap par bhi allocate ho sakta hai. Exact detail implementation-specific hai, lekin core point ye hai ki 'hamesha class' ek absolute, galat statement hai.",
  },
];

export default questions;
