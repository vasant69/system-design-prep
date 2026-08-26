import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cpu-io-tr-1",
    question: "`Task.Run` ka use kab karna chahiye, aur kab bilkul nahi karna chahiye? Ek complete decision framework do.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS", "Amazon", "Accenture"],
    shortAnswer:
      "CPU-bound genuine computation ke liye use karo (thread offload karne ke liye); I/O-bound work (DB/HTTP/file) ke liye kabhi mat use karo — underlying async API already thread-free waiting deta hai.",
    detailedAnswer:
      "Decision ek single question pe aakar tikta hai: 'is operation ke andar CPU genuinely compute kar raha hai, ya sirf kisi external response ka wait ho raha hai?' Agar compute ho raha hai (image processing, heavy calculation), `Task.Run` us kaam ko thread-pool thread pe offload karta hai, calling thread (UI/server thread) ko free karke. Agar sirf wait ho raha hai (database, HTTP, file I/O), underlying async API (jaise `HttpClient.GetStringAsync`) already OS-level I/O completion mechanism use karta hai jisme koi thread occupy nahi hota — `Task.Run` lagana yahan sirf ek unnecessary thread-pool thread grab karta hai, koi fayda nahi deta.",
    followUp: "ASP.NET Core controller action ke context me ye galti kaise dikhti hai concretely?",
  },
  {
    id: "cpu-io-tr-2",
    question: "Ye code review me diya gaya hai:\n```csharp\n[HttpGet]\npublic async Task<IActionResult> GetOrder(int id)\n{\n    var order = await Task.Run(() => _repository.GetOrderAsync(id));\n    return Ok(order);\n}\n```\nIsme kya problem hai, aur fix kya hoga?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "`GetOrderAsync` I/O-bound hai (database call) — `Task.Run` me wrap karna unnecessary hai. Fix: seedha `await _repository.GetOrderAsync(id)`.",
    detailedAnswer:
      "ASP.NET Core request handler already thread-pool thread pe chal raha hota hai. `GetOrderAsync` agar database ke saath async I/O karta hai, wo already non-blocking hai — `Task.Run` lagana ek EXTRA thread-pool thread grab karta hai us kaam ke liye jo already thread-free tarike se ho sakta tha. Ye net effect me thread-pool par zyada pressure daalta hai, especially high-concurrency load me. Fix simple hai — `Task.Run` wrapper hata do, seedha `await _repository.GetOrderAsync(id)` likho.",
  },
  {
    id: "cpu-io-tr-3",
    question: "Ek `ProcessLargeDataSetAsync` method hai jo (a) database se data fetch karta hai, phir (b) us data pe heavy statistical computation karta hai in-memory. Isko async-friendly banane ke liye kya approach lena chahiye?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "(a) ko plain `await` se (I/O-bound), (b) ko `Task.Run` se (CPU-bound) handle karo — dono steps ko unki apni nature ke hisaab se alag treat karo, ek hi tool dono pe mat lagao.",
    detailedAnswer:
      "```csharp\npublic async Task<Result> ProcessLargeDataSetAsync()\n{\n    var data = await _repository.FetchDataAsync(); // I/O-bound — plain await\n    var result = await Task.Run(() => ComputeStatistics(data)); // CPU-bound — Task.Run\n    return result;\n}\n```\nYe pattern method ke andar dono types ke kaam ko unki nature ke hisaab se sahi tarike se handle karta hai — fetch ke dauraan koi thread occupy nahi hota, compute ke dauraan calling thread free rehta hai kyunki compute ek thread-pool thread pe offload hota hai. Ek hi tool (sirf await, ya sirf Task.Run) poore method pe lagana in dono me se ek scenario ko galat handle karega.",
    followUp: "Agar `ComputeStatistics` chhota, fast operation ho (microseconds), tab bhi `Task.Run` use karoge?",
  },
  {
    id: "cpu-io-tr-4",
    question: "Kya ye statement sahi hai: 'Task.Run poore async code ko faster bana deta hai, isliye jahan bhi doubt ho, laga do'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — `Task.Run` I/O-bound work ke liye koi fayda nahi deta, ulta thread-pool pressure badhata hai. Ye 'faster' banane ka universal tool nahi hai.",
    detailedAnswer:
      "`Task.Run` sirf CPU-bound compute ko ek doosre thread pe move karta hai — total work same rehta hai, bas kis thread pe ho raha hai wo badalta hai. I/O-bound operations ke liye kaam already 'thread-free' tha (wait ke dauraan koi thread busy nahi tha); `Task.Run` lagana yahan bilkul koi speed improvement nahi deta, sirf ek extra thread-pool thread ko unnecessarily occupy karta hai, jo high-concurrency scenarios me overall throughput ko hurt kar sakta hai. 'Jahan doubt ho waha laga do' approach genuinely harmful hai — sahi approach hai operation ki nature (CPU vs I/O) explicitly identify karna.",
    redFlag: "'Task.Run har jagah safe hai, extra thread hi to lagega' jaisi soch — high concurrency me ye exactly wo mistake hai jo thread-pool ko exhaust karti hai.",
  },
  {
    id: "cpu-io-tr-5",
    question: "Ek WPF app me ek button click par 5 second ka heavy computation (CPU-bound) chalana hai, aur result UI me dikhana hai. Poora flow (Task.Run se lekar UI update tak) design karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`async void` event handler me `Task.Run` se computation offload karo, `await` karo result ka, phir UI thread pe (jahan continuation automatically resume hoga, context-capture ki wajah se) result set karo.",
    detailedAnswer:
      "```csharp\nprivate async void OnCalculateClick(object sender, EventArgs e)\n{\n    ResultLabel.Text = \"Computing...\";\n    int result = await Task.Run(() => HeavyComputation());\n    ResultLabel.Text = result.ToString(); // UI thread pe resume, safe update\n}\n```\n`Task.Run` computation ko thread-pool thread pe bhej deta hai — UI thread turant free ho jaata hai (responsive rehta hai, 'Computing...' dikha sakta hai). Jab computation complete hoti hai, `await` ka continuation WPF ki `SynchronizationContext` ki wajah se automatically UI thread pe hi resume hota hai (bina `ConfigureAwait(false)` ke) — isliye `ResultLabel.Text` ko seedha, safely set kiya ja sakta hai bina cross-thread exception ke.",
    followUp: "Agar is method me `ConfigureAwait(false)` laga diya jaaye, kya problem hogi?",
  },
  {
    id: "cpu-io-tr-6",
    question: "Poore module (Thread/Task/ThreadPool se lekar Parallel.For tak) ko dekhte hue, CPU-bound vs I/O-bound distinction kaise sabko jodta hai — high-level me samjhao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Har concurrency primitive ka sahi use isi ek distinction pe tika hai — I/O-bound waiting thread-free hai (async/await ka core magic), CPU-bound work ke liye thread/core genuinely chahiye (Task.Run, Parallel.For dono isi zaroorat ko serve karte hain).",
    detailedAnswer:
      "Thread-pool ka poora design (Topic 1-2) is assumption pe based hai ki I/O-bound waiting threads occupy nahi karti, isliye limited thread-pool threads bahut saare concurrent I/O operations handle kar sakte hain. `async`/`await`'s state machine (Topic 3) exactly isi ko enable karta hai — I/O complete hone ka wait bina thread block kiye. `Task.Run` (Topic 4, aur capstone yahan) CPU-bound kaam ke liye hai jahan genuinely ek thread/core chahiye compute karne ke liye. `Parallel.For`/PLINQ (Topic 12) isi CPU-bound principle ko multiple independent work items tak extend karta hai — cores ke beech baantna. Deadlocks (Topic 9) tab hote hain jab ye distinction galat samjhi jaati hai — sync-blocking (`.Result`) ek I/O-bound async call pe, jo thread ko unnecessarily occupy karta hai jab use karne ki zaroorat hi nahi thi. Poora module essentially ek hi core insight ke around organize hota hai: computation ke liye thread/core chahiye, waiting ke liye nahi.",
  },
  {
    id: "cpu-io-tr-7",
    question: "Ek naya team member poochta hai: 'Agar database call I/O-bound hai aur koi thread occupy nahi karta, to phir database server khud kya kar raha hai us dauraan?' Is confusion ko kaise clarify karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Database server apni taraf CPU/threads use kar raha hai query process karne ke liye — 'no thread occupied' sirf CLIENT (calling app) side ki baat hai, server-side processing alag machine/process pe ho rahi hai.",
    detailedAnswer:
      "'I/O-bound = no thread occupied' ka scope specifically calling application (client) tak limited hai. Jab tumhara ASP.NET Core app ek database query bhejta hai, wo apni taraf koi thread block nahi karta jawab ka wait karte hue (OS I/O completion port mechanism). Lekin database server ke apne process me, wo query genuinely CPU cycles aur uske apne threads use kar raha hota hai us query ko execute karne ke liye. Dono alag processes/machines hain — client-side 'free waiting' aur server-side 'active computation' dono simultaneously true ho sakti hain, ek dusre ko contradict nahi karti.",
  },
];

export default questions;
