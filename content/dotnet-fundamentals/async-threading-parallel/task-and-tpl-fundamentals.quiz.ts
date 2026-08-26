import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "task-tpl-1",
    question: "Jab ek `Task` I/O-bound operation (jaise `HttpClient.GetStringAsync`) ke 'in flight' hone ke dauraan hota hai, us wait ke time kitne ThreadPool threads occupied rehte hain?",
    options: [
      "Ek thread — wahi jisne request start kiya tha",
      "Zero threads — OS-level async I/O completion mechanism use hota hai, kaam khatam hone tak koi thread busy nahi baitha",
      "Do threads — ek sending ke liye, ek receiving ke liye",
      "Ye ThreadPool size par depend karta hai",
    ],
    correctIndex: 1,
    explanation:
      "I/O-bound async operations OS-level asynchronous I/O use karte hain — jab request 'in flight' hai (server response ka wait), koi thread occupy nahi hota, na calling thread block hota hai na koi pool thread busy baitha rehta hai. Jab response aata hai, tab kahin jaake ek thread continuation chalane ke liye assign hota hai. Options A, C, D is core mechanism ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "task-tpl-2",
    question: "CPU-bound kaam ke liye `Task.Run(() => HeavyComputation())` call karne par, us kaam ki poori duration ke liye kya hota hai?",
    options: [
      "Koi thread occupy nahi hota, kaam 'magically' background me hota hai",
      "Ek ThreadPool thread us kaam ki poori duration ke liye associated rehta hai",
      "Main thread hi kaam karta hai, koi doosra thread involve nahi hota",
      "Ek naya process spawn hota hai us kaam ke liye",
    ],
    correctIndex: 1,
    explanation:
      "CPU-bound work genuinely CPU cycles consume karta hai — isliye ek ThreadPool thread us poore kaam ki duration ke liye is task ko run karne me busy rehta hai. Ye I/O-bound async work se fundamentally alag hai (jahan wait ke dauraan koi thread occupied nahi hota). Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "task-tpl-3",
    question: "`.Result` ya `.Wait()` ko ek Task par call karna kya karta hai?",
    options: [
      "Task ko background me continue chalne deta hai, non-blocking tareeke se",
      "Calling thread ko synchronously block kar deta hai jab tak Task complete na ho",
      "Task ko cancel kar deta hai",
      "Sirf Task ka current status check karta hai, wait nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "`.Result` aur `.Wait()` dono blocking calls hain — calling thread tab tak freeze/wait karta hai jab tak Task complete na ho jaaye. Ye `await` (non-blocking) se fundamentally different hai. Specific environments (synchronization-context-having, jaise classic ASP.NET ya UI apps) me ye deadlock bhi de sakta hai — is module ke ek alag topic me detail me cover hota hai. Options A, C, D is blocking behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "task-tpl-4",
    question: "Task Parallel Library (TPL) sirf `Task` class tak limited hai — ye statement sahi hai ya galat?",
    options: [
      "Sahi — TPL aur Task class exactly same cheez hain",
      "Galat — TPL ek broader ecosystem hai jisme Task ke saath-saath Task.WhenAll/WhenAny, Parallel.For/ForEach, aur PLINQ bhi shamil hain",
      "Sahi — sirf Task.Run aur Task.WhenAll TPL ka hissa hain",
      "Galat — TPL sirf Parallel.For/ForEach ko refer karta hai, Task class alag library hai",
    ],
    correctIndex: 1,
    explanation:
      "TPL (.NET 4.0 me introduced) ek broader library hai jo `Task`/`Task<T>` ke saath-saath coordination APIs (`Task.WhenAll`, `Task.WhenAny`), data-parallelism APIs (`Parallel.For`, `Parallel.ForEach`), aur PLINQ ko bhi cover karti hai — sab concurrent/parallel work manage karne ke liye high-level, thread-management-abstracted APIs dene ke common goal ke saath. Options A, C, D is scope ko galat/incomplete represent karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
